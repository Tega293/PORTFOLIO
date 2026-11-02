const { requestOriginAllowed, sendJson } = require('../lib/cms');

const requestBuckets = new Map();

function allowRequest(req) {
  const address = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const bucket = requestBuckets.get(address);
  if (!bucket || bucket.resetAt < now) requestBuckets.set(address, { count: 1, resetAt: now + 60_000 });
  else bucket.count += 1;
  return (requestBuckets.get(address)?.count || 0) <= 24;
}

module.exports = async function translateHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) return sendJson(res, 503, { error: 'Automatic translation is not configured yet.' });
  if (!requestOriginAllowed(req)) return sendJson(res, 403, { error: 'Request origin was rejected.' });
  if (!allowRequest(req)) return sendJson(res, 429, { error: 'Translation is temporarily rate limited. Please wait a minute and try again.' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const target = String(body?.target || '');
    const texts = body?.texts;
    if (!/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/.test(target) || target === 'en') return sendJson(res, 400, { error: 'Choose a supported non-English language.' });
    if (!Array.isArray(texts) || texts.length < 1 || texts.length > 128 || texts.some((text) => typeof text !== 'string' || text.length > 3000)) return sendJson(res, 400, { error: 'Send between 1 and 128 text items, each no longer than 3,000 characters.' });
    if (texts.reduce((total, text) => total + text.length, 0) > 24_000) return sendJson(res, 413, { error: 'This translation batch is too large. Please try again.' });

    const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GOOGLE_TRANSLATE_API_KEY },
      body: JSON.stringify({ q: texts, target, format: 'text' }),
    });
    if (!response.ok) return sendJson(res, 502, { error: 'The translation provider could not translate this page right now.' });
    const data = await response.json();
    const translations = data.data?.translations?.map((item) => item.translatedText);
    if (!Array.isArray(translations) || translations.length !== texts.length) return sendJson(res, 502, { error: 'The translation provider returned an incomplete result.' });
    return sendJson(res, 200, { translations });
  } catch (error) {
    return sendJson(res, error instanceof SyntaxError ? 400 : 502, { error: error instanceof SyntaxError ? 'The translation request was malformed.' : 'Translation is temporarily unavailable.' });
  }
};
