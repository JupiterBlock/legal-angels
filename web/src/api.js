import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/metagraph';

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function authenticateWallet(password) {
  const { data } = await client.post('/authenticate', { password });
  return data;
}

export async function fetchChannelState(channelId) {
  const { data } = await client.get(`/state/${channelId}`);
  return data;
}

export async function submitTransaction(channelId, payload) {
  const { data } = await client.post('/transactions', { channelId, payload });
  return data;
}

export async function listNodes() {
  const { data } = await client.get('/nodes');
  return data;
}
