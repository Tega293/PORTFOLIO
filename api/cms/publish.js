const {
  decodeImageAsset, getCatalog, getGitConfig, githubRequest, hasSession, isConfigured,
  configurationError, requestOriginAllowed, sendJson, validateProjects,
} = require('../../lib/cms');

function parseBody(body) {
  if (body && typeof body === 'object') return body;
  if (typeof body === 'string') return JSON.parse(body);
  throw new Error('The publish request body is missing or invalid.');
}

module.exports = async function publishHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!isConfigured()) return sendJson(res, 503, { error: configurationError() });
  if (!hasSession(req)) return sendJson(res, 401, { error: 'Your admin session expired. Sign in again.' });
  if (!requestOriginAllowed(req)) return sendJson(res, 403, { error: 'Request origin was rejected.' });

  try {
    const body = parseBody(req.body);
    const projects = validateProjects(body.projects);
    const currentCatalog = await getCatalog();
    if ((body.baseSha || null) !== currentCatalog.sha) return sendJson(res, 409, { error: 'The catalog changed since it was loaded.' });
    const assets = Array.isArray(body.assets) ? body.assets : [];
    if (assets.length > 10) return sendJson(res, 400, { error: 'Upload at most 10 images per publish.' });
    const files = [{ path: 'public/projects.json', content: Buffer.from(`${JSON.stringify(projects, null, 2)}\n`, 'utf8').toString('base64') }];
    const seenPaths = new Set();
    let uploadedBytes = 0;
    assets.forEach((asset) => {
      const decoded = decodeImageAsset(asset);
      if (seenPaths.has(decoded.path)) throw new Error('An image was included more than once.');
      seenPaths.add(decoded.path);
      uploadedBytes += Buffer.from(decoded.content, 'base64').length;
      if (uploadedBytes > 3 * 1024 * 1024) throw new Error('Keep the total new image uploads under 3 MB per publish.');
      files.push(decoded);
    });

    const { repository, branch } = getGitConfig();
    const encodedRef = encodeURIComponent(branch);
    const ref = await githubRequest(`/repos/${repository}/git/ref/heads/${encodedRef}`);
    const parentSha = ref.object?.sha;
    if (!parentSha) throw new Error('GitHub did not return the target branch commit.');
    const parent = await githubRequest(`/repos/${repository}/git/commits/${parentSha}`);

    const blobRecords = await Promise.all(files.map(async (file) => {
      const blob = await githubRequest(`/repos/${repository}/git/blobs`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: file.content, encoding: 'base64' }),
      });
      return { path: file.path, mode: '100644', type: 'blob', sha: blob.sha };
    }));
    const tree = await githubRequest(`/repos/${repository}/git/trees`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base_tree: parent.tree.sha, tree: blobRecords }),
    });
    const commit = await githubRequest(`/repos/${repository}/git/commits`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Publish portfolio projects from CMS`, tree: tree.sha, parents: [parentSha] }),
    });

    try {
      await githubRequest(`/repos/${repository}/git/refs/heads/${encodedRef}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });
    } catch (error) {
      if (error.status === 422) return sendJson(res, 409, { error: 'The target branch moved during publishing. Reload the project catalog and try again.' });
      throw error;
    }

    const catalogBlob = blobRecords.find((record) => record.path === 'public/projects.json');
    return sendJson(res, 200, { sha: catalogBlob.sha, commitSha: commit.sha, branch, projectCount: projects.length });
  } catch (error) {
    const status = error.status === 404 || error.status === 401 || error.status === 403 ? 502 : (error.status || 400);
    return sendJson(res, status, { error: `Publish failed. ${error.message}` });
  }
};
