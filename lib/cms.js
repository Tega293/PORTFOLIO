const crypto = require('crypto');

const COOKIE_NAME = 'tegabyte_cms_session';
const SESSION_SECONDS = 60 * 60 * 8;
const loginAttempts = new Map();

function isConfigured() {
  return Boolean(process.env.CMS_ADMIN_PASSWORD && process.env.CMS_SESSION_SECRET && process.env.CMS_GITHUB_TOKEN);
}

function configurationError() {
  const missing = ['CMS_ADMIN_PASSWORD', 'CMS_SESSION_SECRET', 'CMS_GITHUB_TOKEN'].filter((key) => !process.env[key]);
  return missing.length ? `The CMS server is not configured (${missing.join(', ')}).` : '';
}

function setNoCache(res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
}

function sendJson(res, status, payload) {
  setNoCache(res);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function requestOriginAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  return origin === `${proto}://${host}`;
}

function signSession(expiry) {
  const payload = Buffer.from(JSON.stringify({ exp: expiry })).toString('base64url');
  const signature = crypto.createHmac('sha256', process.env.CMS_SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function readCookies(req) {
  return String(req.headers.cookie || '').split(';').reduce((cookies, part) => {
    const separator = part.indexOf('=');
    if (separator > 0) cookies[part.slice(0, separator).trim()] = decodeURIComponent(part.slice(separator + 1).trim());
    return cookies;
  }, {});
}

function hasSession(req) {
  const token = readCookies(req)[COOKIE_NAME];
  if (!token || !process.env.CMS_SESSION_SECRET) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = crypto.createHmac('sha256', process.env.CMS_SESSION_SECRET).update(payload).digest();
  let supplied;
  try { supplied = Buffer.from(signature, 'base64url'); } catch { return false; }
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isFinite(session.exp) && session.exp > Math.floor(Date.now() / 1000);
  } catch { return false; }
}

function setSessionCookie(res, value, maxAge) {
  const parts = [`${COOKIE_NAME}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Strict', `Max-Age=${maxAge}`];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

function rateLimitLogin(req) {
  const address = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const key = crypto.createHash('sha256').update(address).digest('hex');
  const now = Date.now();
  const current = loginAttempts.get(key);
  if (!current || current.resetAt < now) loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
  else current.count += 1;
  return (loginAttempts.get(key)?.count || 0) <= 8;
}

async function githubRequest(path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.CMS_GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`GitHub request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

function getGitConfig() {
  const repository = process.env.CMS_GITHUB_REPOSITORY || 'Tega293/PORTFOLIO';
  const branch = process.env.CMS_GITHUB_BRANCH || 'master';
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) || !/^[A-Za-z0-9._/-]+$/.test(branch)) throw new Error('Invalid CMS GitHub repository or branch configuration.');
  return { repository, branch, ref: encodeURIComponent(branch) };
}

async function getCatalog() {
  const { repository, branch, ref } = getGitConfig();
  try {
    const file = await githubRequest(`/repos/${repository}/contents/public/projects.json?ref=${ref}`);
    if (file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error('The project catalog could not be decoded.');
    const projects = JSON.parse(Buffer.from(file.content.replace(/\n/g, ''), 'base64').toString('utf8'));
    if (!Array.isArray(projects)) throw new Error('The project catalog must contain a JSON array.');
    return { projects, sha: file.sha, branch, repository };
  } catch (error) {
    if (error.status === 404) return { projects: [], sha: null, branch, repository };
    throw error;
  }
}

function validateProjects(projects) {
  if (!Array.isArray(projects) || projects.length > 50) throw new Error('The catalog must contain at most 50 projects.');
  const ids = new Set();
  const safe = projects.map((project, index) => {
    if (!project || typeof project !== 'object') throw new Error('Project data is malformed.');
    const id = String(project.id || '').trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) throw new Error('Project slugs must be unique lowercase words separated by hyphens.');
    ids.add(id);
    const text = (name, max = 10000) => {
      const value = String(project[name] || '').trim();
      if (value.length > max) throw new Error(`${name} is too long.`);
      return value;
    };
    const liveUrl = text('liveUrl', 500);
    const image = text('image', 1000);
    if (liveUrl && !/^https:\/\//i.test(liveUrl)) throw new Error('Project links must use HTTPS.');
    if (image && !/^https:\/\//i.test(image) && !/^\/uploads\/[a-z0-9-]+\.(jpg|png|webp|avif)$/i.test(image)) throw new Error('Cover images must be HTTPS links or uploaded CMS images.');
    const tags = Array.isArray(project.tags) ? project.tags.slice(0, 12).map((tag) => String(tag).trim().slice(0, 80)).filter(Boolean) : [];
    const nav = Array.isArray(project.nav) ? project.nav.slice(0, 8).map((item) => String(item).trim().slice(0, 60)).filter(Boolean) : [];
    return {
      id, number: String(index + 1).padStart(2, '0'),
      name: text('name', 120), category: text('category', 120), address: text('address', 200),
      theme: ['recipe-central', 'assurrex', 'field'].includes(project.theme) ? project.theme : 'field',
      brand: text('brand', 100), nav, action: text('action', 80), eyebrow: text('eyebrow', 150),
      headline: text('headline', 200), previewCopy: text('previewCopy', 1000), previewLink: text('previewLink', 100),
      liveUrl, image, imageAlt: text('imageAlt', 300), description: text('description', 2000), tags,
      challenge: text('challenge', 4000), response: text('response', 4000), caseStudyContent: text('caseStudyContent', 40000),
    };
  });
  if (safe.some((project) => !project.name || !project.category || !project.description)) throw new Error('Every project needs a title, category, and card description.');
  return safe;
}

function decodeImageAsset(asset) {
  if (!asset || typeof asset.path !== 'string' || typeof asset.data !== 'string') throw new Error('An uploaded image is malformed.');
  const match = asset.data.match(/^data:(image\/(?:jpeg|png|webp|avif));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !/^\/uploads\/[a-z0-9-]+\.(jpg|png|webp|avif)$/i.test(asset.path)) throw new Error('An uploaded image has an unsupported format or filename.');
  const bytes = Buffer.from(match[2], 'base64');
  if (!bytes.length || bytes.length > 3 * 1024 * 1024) throw new Error('Each uploaded image must be 3 MB or smaller.');
  const type = match[1];
  const isPng = type === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = type === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[bytes.length - 2] === 255 && bytes[bytes.length - 1] === 217;
  const isWebp = type === 'image/webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  const isAvif = type === 'image/avif' && bytes.toString('ascii').slice(4, 16).includes('ftypavif');
  if (!(isPng || isJpeg || isWebp || isAvif)) throw new Error('The uploaded file does not match its declared image type.');
  return { path: `public${asset.path}`, content: bytes.toString('base64') };
}

module.exports = {
  COOKIE_NAME, SESSION_SECONDS, configurationError, getCatalog, getGitConfig, githubRequest, hasSession,
  isConfigured, rateLimitLogin, requestOriginAllowed, sendJson, setNoCache, setSessionCookie, signSession,
  validateProjects, decodeImageAsset,
};
