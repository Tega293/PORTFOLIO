const { sendJson } = require('../lib/cms');

module.exports = async function languagesHandler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) return sendJson(res, 503, { configured: false, languages: [{ code: 'en', name: 'English' }] });
  try {
    const url = new URL('https://translation.googleapis.com/language/translate/v2/languages');
    url.searchParams.set('target', 'en');
    const response = await fetch(url, { headers: { 'x-goog-api-key': process.env.GOOGLE_TRANSLATE_API_KEY } });
    if (!response.ok) throw new Error('Language service unavailable.');
    const data = await response.json();
    const languages = (data.data?.languages || [])
      .filter((language) => /^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})?$/.test(language.language) && language.language !== 'en')
      .map((language) => ({ code: language.language, name: language.name }))
      .sort((first, second) => first.name.localeCompare(second.name));
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    return sendJson(res, 200, { configured: true, languages: [{ code: 'en', name: 'English' }, ...languages] });
  } catch {
    return sendJson(res, 502, { error: 'Could not load the supported language list.' });
  }
};
