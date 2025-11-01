const axios = require('axios');
const { buildAuthHeaders } = require('../utils/auth');

class MetagraphClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || process.env.METAGRAPH_BASE_URL;
    if (!this.baseUrl) {
      throw new Error('METAGRAPH_BASE_URL is not configured');
    }

    this.apiKey = options.apiKey || process.env.METAGRAPH_API_KEY;
    this.http = axios.create({
      baseURL: this.baseUrl.replace(/\/$/, ''),
      timeout: 10000,
    });
  }

  async fetchStateChannel(channelId = process.env.STATE_CHANNEL_ID) {
    if (!channelId) {
      throw new Error('No state channel id provided');
    }

    const response = await this.http.get(`/statechannel/${channelId}`, {
      headers: buildAuthHeaders(this.apiKey),
    });
    return response.data;
  }

  async submitTransaction(channelId, payload) {
    if (!channelId) {
      throw new Error('Channel id is required to submit a transaction');
    }

    const response = await this.http.post(
      `/statechannel/${channelId}/transaction`,
      { payload },
      {
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(this.apiKey),
        },
      }
    );
    return response.data;
  }

  async listNodes() {
    const response = await this.http.get('/cluster/info', {
      headers: buildAuthHeaders(this.apiKey),
    });
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.nodes)) {
      return data.nodes;
    }
    return [data];
  }
}

module.exports = { MetagraphClient };
