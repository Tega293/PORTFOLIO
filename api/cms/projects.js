const { getCatalog, getSkillsCatalog, hasSession, isConfigured, configurationError, sendJson } = require('../../lib/cms');

module.exports = async function projectsHandler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!isConfigured()) return sendJson(res, 503, { error: configurationError() });
  if (!hasSession(req)) return sendJson(res, 401, { error: 'Sign in to access the project catalog.' });
  try {
    const [projectCatalog, skillCatalog] = await Promise.all([getCatalog(), getSkillsCatalog()]);
    return sendJson(res, 200, { projects: projectCatalog.projects, sha: projectCatalog.sha, skills: skillCatalog.skills, skillsSha: skillCatalog.skillsSha, branch: projectCatalog.branch });
  } catch (error) {
    return sendJson(res, error.status || 502, { error: `Unable to load the GitHub project catalog. ${error.message}` });
  }
};
