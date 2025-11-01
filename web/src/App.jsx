import { useEffect, useState } from 'react';
import { authenticateWallet, fetchChannelState, submitTransaction, listNodes } from './api.js';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const [wallet, setWallet] = useState(null);
  const [channelId, setChannelId] = useState('');
  const [state, setState] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [payload, setPayload] = useState('{}');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listNodes()
      .then(setNodes)
      .catch((err) => setError(err.message));
  }, []);

  const handleAuthenticate = async (password) => {
    setError('');
    setLoading(true);
    try {
      const unlockedWallet = await authenticateWallet(password);
      setWallet(unlockedWallet);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchState = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await fetchChannelState(channelId);
      setState(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTransaction = async () => {
    setError('');
    setLoading(true);
    try {
      let parsedPayload;
      try {
        parsedPayload = JSON.parse(payload);
      } catch (parseError) {
        throw new Error('Payload must be valid JSON');
      }
      const response = await submitTransaction(channelId, parsedPayload);
      setState(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Legal Angels Metagraph Console</h1>
        <p>Interact with your Constellation Metagraph from the Replit deployment.</p>
      </header>
      <Dashboard
        wallet={wallet}
        channelId={channelId}
        onChannelChange={setChannelId}
        state={state}
        payload={payload}
        onPayloadChange={setPayload}
        onAuthenticate={handleAuthenticate}
        onFetchState={handleFetchState}
        onSubmitTransaction={handleSubmitTransaction}
        loading={loading}
        error={error}
        nodes={nodes}
      />
    </div>
  );
}

export default App;
