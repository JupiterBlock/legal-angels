import PropTypes from 'prop-types';
import { useState } from 'react';

function Dashboard({
  wallet,
  channelId,
  onChannelChange,
  state,
  payload,
  onPayloadChange,
  onAuthenticate,
  onFetchState,
  onSubmitTransaction,
  loading,
  error,
  nodes,
}) {
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onAuthenticate(password);
  };

  return (
    <div className="dashboard">
      <section className="card">
        <h2>Wallet Authentication</h2>
        {wallet ? (
          <div className="wallet-info">
            <p><strong>Address:</strong> {wallet.address}</p>
            <p><strong>Public Key:</strong> {wallet.publicKey}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Wallet Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter wallet password"
              />
            </label>
            <button type="submit" disabled={loading}>Unlock</button>
          </form>
        )}
      </section>

      <section className="card">
        <h2>Metagraph Nodes</h2>
        {nodes.length === 0 ? <p>No nodes available.</p> : (
          <ul className="nodes">
            {nodes.map((node) => (
              <li key={node.id || node.host}>{node.host || JSON.stringify(node)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>State Channel</h2>
        <label>
          Channel ID
          <input
            type="text"
            value={channelId}
            onChange={(event) => onChannelChange(event.target.value)}
            placeholder="Enter state channel id"
          />
        </label>
        <div className="actions">
          <button onClick={onFetchState} disabled={loading || !channelId}>Fetch State</button>
        </div>
        <pre className="state-display">{state ? JSON.stringify(state, null, 2) : 'No state loaded.'}</pre>
      </section>

      <section className="card">
        <h2>Submit Transaction</h2>
        <textarea
          value={payload}
          onChange={(event) => onPayloadChange(event.target.value)}
          rows={8}
        />
        <button onClick={onSubmitTransaction} disabled={loading || !channelId}>
          Submit Transaction
        </button>
      </section>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Working...</div>}
    </div>
  );
}

Dashboard.propTypes = {
  wallet: PropTypes.shape({
    address: PropTypes.string,
    publicKey: PropTypes.string,
  }),
  channelId: PropTypes.string.isRequired,
  onChannelChange: PropTypes.func.isRequired,
  state: PropTypes.any,
  payload: PropTypes.string.isRequired,
  onPayloadChange: PropTypes.func.isRequired,
  onAuthenticate: PropTypes.func.isRequired,
  onFetchState: PropTypes.func.isRequired,
  onSubmitTransaction: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  nodes: PropTypes.arrayOf(PropTypes.any),
};

Dashboard.defaultProps = {
  wallet: null,
  state: null,
  loading: false,
  error: '',
  nodes: [],
};

export default Dashboard;
