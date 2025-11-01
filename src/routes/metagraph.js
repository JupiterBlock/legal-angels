const express = require('express');
const { MetagraphClient } = require('../metagraph/client');
const { WalletManager } = require('../metagraph/wallet');

const router = express.Router();
const metagraphClient = new MetagraphClient();
const walletManager = new WalletManager();

router.post('/authenticate', async (req, res) => {
  try {
    const { password } = req.body;
    const wallet = await walletManager.unlockWallet(password);
    res.json({
      address: wallet.address,
      publicKey: wallet.publicKey,
    });
  } catch (error) {
    console.error('Authentication error', error);
    res.status(400).json({ message: error.message || 'Unable to unlock wallet' });
  }
});

router.get('/state/:channelId', async (req, res) => {
  try {
    const state = await metagraphClient.fetchStateChannel(req.params.channelId);
    res.json(state);
  } catch (error) {
    console.error('State retrieval error', error.message);
    res.status(500).json({ message: 'Failed to fetch state channel data', details: error.message });
  }
});

router.post('/transactions', async (req, res) => {
  try {
    const { channelId, payload } = req.body;
    const response = await metagraphClient.submitTransaction(channelId, payload);
    res.json(response);
  } catch (error) {
    console.error('Transaction submission error', error.message);
    res.status(500).json({ message: 'Failed to submit transaction', details: error.message });
  }
});

router.get('/nodes', async (_req, res) => {
  try {
    const nodes = await metagraphClient.listNodes();
    res.json(nodes);
  } catch (error) {
    console.error('Node discovery error', error.message);
    res.status(500).json({ message: 'Failed to fetch node information', details: error.message });
  }
});

module.exports = router;
