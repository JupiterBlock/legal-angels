function buildAuthHeaders(apiKey) {
  const headers = {};
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }
  return headers;
}

module.exports = { buildAuthHeaders };
