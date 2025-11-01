# Legal Angels Deployment Guide

This guide explains how to run the Legal Angels stack locally, deploy it to Replit, and connect it to a Constellation Metagraph environment following the official quick-start.

## Repository Layout

```
.
├── package.json          # Node.js backend service (Express)
├── src/                  # Backend source code
│   └── metagraph/        # Client + wallet utilities for Metagraph interactions
├── web/                  # React/Vite front-end imported from the Replit site
└── docs/                 # Documentation assets
```

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn
- Docker (required by the Constellation Metagraph quick-start)
- Access to the Constellation Network Metagraph quick-start guide and binaries

## 1. Set up the Metagraph environment

Follow the [Constellation Metagraph quick-start](https://docs.constellationnetwork.io) to provision a sandbox network. The high-level steps are:

1. Clone the `metagraph-node` quick-start repository and run the Docker compose scripts to launch an L0, L1, and validator set.
2. Generate wallet keys using the `dag-l2` CLI:
   ```bash
   ./dag-l2 wallet create --alias legal-angels --password <strong-password>
   ./dag-l2 wallet export --alias legal-angels --public-key wallet/public.key --private-key wallet/private.key
   ```
3. Deploy your state channel smart contract (if applicable) with the provided tooling:
   ```bash
   ./dag-l2 project create legal-angels-channel
   ./dag-l2 project deploy legal-angels-channel --wallet legal-angels --password <strong-password>
   ```
4. Record the generated **state channel ID**, node REST API URL (typically `http://localhost:9000` for L1), and any API keys configured.
5. Update the backend `.env` file with these values (see [Configuration](#4-configuration)).

> **Tip:** The quick-start spins up a sandbox cluster; keep it running while testing locally. For Replit, expose the necessary ports via tunnels or host the nodes on publicly reachable infrastructure.

## 2. Install backend dependencies

```bash
npm install
```

This installs the Express server, Axios HTTP client, and supporting utilities. Use `npm run dev` for auto-reloading development mode or `npm start` for production mode.

## 3. Install front-end dependencies

```bash
cd web
npm install
```

Use `npm run dev` to run the Vite dev server locally. The server proxies `/api/*` requests to the backend (`http://localhost:3000` by default).

## 4. Configuration

1. Copy the sample environment files:
   ```bash
   cp .env.example .env
   cp web/.env.example web/.env
   ```
2. Edit `.env` with the real Metagraph values:
   - `METAGRAPH_BASE_URL`: Base REST endpoint exposed by your L1/L0 stack.
   - `METAGRAPH_API_KEY`: Optional API key for secured clusters.
   - `WALLET_PUBLIC_KEY_PATH` / `WALLET_PRIVATE_KEY_PATH`: Paths to the exported key files.
   - `WALLET_PASSWORD`: Wallet unlock password.
   - `STATE_CHANNEL_ID`: Default state channel for read operations.
3. Adjust `web/.env` if the Replit deployment requires an absolute API URL (for example, `https://legal-angels-backend.replit.app/api/metagraph`).

## 5. Running locally end-to-end

1. Start the Metagraph nodes via Docker Compose (per the quick-start).
2. Launch the backend service:
   ```bash
   npm run dev
   ```
3. In a separate terminal, launch the front-end:
   ```bash
   cd web
   npm run dev
   ```
4. Navigate to `http://localhost:5173`, authenticate with your wallet password, and run state channel reads/transactions. All requests flow through the Express backend to your Metagraph cluster.

## 6. Deploying to Replit

1. Create a new Replit project and import this Git repository.
2. Configure two repls (or a single repl with Nix):
   - **Backend repl**: set the run command to `npm install && npm start` and add environment variables mirroring `.env` (but without storing private keys in the repo).
   - **Front-end repl**: set the run command to `npm install && npm run dev -- --host 0.0.0.0 --port 5173` or build the site with `npm run build` and serve statically.
3. Store wallet key files in Replit Secrets or use an encrypted storage solution. Update `WALLET_PRIVATE_KEY_PATH` to reference the runtime path (e.g., `/home/runner/.secrets/private.key`).
4. Configure the front-end `VITE_API_BASE_URL` to point at the backend repl URL. Replit automatically injects the repl domain into environment variables (e.g., `https://legal-angels-backend.<username>.repl.co`).
5. Restart both repls. The UI should now communicate with the Metagraph nodes via the backend service.

## 7. Verifying deployment

- Use the dashboard to unlock the wallet, fetch the default state channel, and submit a test transaction (e.g., a no-op payload) to confirm end-to-end connectivity.
- Monitor backend logs for responses from the Metagraph APIs.
- If transactions fail, ensure the Metagraph Docker stack is reachable from Replit (you may need public endpoints or tunneling such as `ngrok`).

## 8. Maintenance Tips

- Rotate API keys and wallet passwords regularly.
- Mirror Replit secrets locally via `.env.local` (ignored by git).
- Extend `src/metagraph/client.js` for additional endpoints (e.g., smart contract method calls) as your application evolves.
