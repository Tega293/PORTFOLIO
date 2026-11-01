const crypto = require('crypto');
const {
  COOKIE_NAME, SESSION_SECONDS, configurationError, hasSession, isConfigured, rateLimitLogin,
  requestOriginAllowed, sendJson, setNoCache, setSessionCookie, signSession,
} = require('../../lib/cms');

module.exports = async function sessionHandler(req, res) {
  if (!isConfigured()) return sendJson(res, 503, { configured: false, error: configurationError() });
  if (req.method === 'GET') return sendJson(res, 200, { configured: true, authenticated: hasSession(req) });
  if (!['POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!requestOriginAllowed(req)) return sendJson(res, 403, { error: 'Request origin was rejected.' });
  if (req.method === 'DELETE') {
    setNoCache(res);
    const parts = [`${COOKIE_NAME}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
    if (process.env.NODE_ENV === 'production') parts.push('Secure');
    res.setHeader('Set-Cookie', parts.join('; '));
    return sendJson(res, 200, { authenticated: false });
  }
  if (!rateLimitLogin(req)) return sendJson(res, 429, { error: 'Too many sign-in attempts. Wait 15 minutes and try again.' });
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password || password.length > 256) return sendJson(res, 400, { error: 'Enter the admin password.' });
  const expected = crypto.createHash('sha256').update(process.env.CMS_ADMIN_PASSWORD).digest();
  const actual = crypto.createHash('sha256').update(password).digest();
  if (!crypto.timingSafeEqual(actual, expected)) return sendJson(res, 401, { error: 'That password was not accepted.' });
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  setSessionCookie(res, signSession(expiry), SESSION_SECONDS);
  return sendJson(res, 200, { authenticated: true, expiresAt: expiry });
};
