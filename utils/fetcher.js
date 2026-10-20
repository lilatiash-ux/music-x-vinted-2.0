const axios = require("axios");
async function safeFetch(url, options = {}) {
  try {
    const response = await axios.get(url, {
      timeout: options.timeout || 20000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MusicDropVintedBot/2.0)",
        ...(options.headers || {})
      },
      ...options
    });
    return response;
  } catch (err) {
    return { error: err, status: err.response?.status || 0, data: null };
  }
}
module.exports = { safeFetch };
