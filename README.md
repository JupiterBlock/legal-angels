# Legal Angels

Legal Angels is a decentralized legal services prototype built for the BLI Legal Hackathon. This repository now contains both the front-end experience (imported from Replit) and a Node.js backend that brokers calls to a Constellation Network Metagraph.

## Project Structure

```
.
├── src/                # Express backend and Metagraph SDK wrappers
├── web/                # React + Vite front-end previously hosted on Replit
├── docs/               # Deployment and operational documentation
├── package.json        # Backend package manifest
├── .env.example        # Backend environment template
└── web/.env.example    # Front-end environment template
```

- **Backend (`src/`)** exposes REST endpoints under `/api/metagraph` for wallet authentication, state channel queries, and transaction submission.
- **Front-end (`web/`)** provides the Replit UI, now wired to the backend endpoints via Axios.

## Getting Started

1. Install backend dependencies and run the API server:
   ```bash
   npm install
   npm run dev
   ```
2. Install front-end dependencies and start Vite:
   ```bash
   cd web
   npm install
   npm run dev
   ```
3. Copy `.env.example` files to configure Metagraph credentials.
4. Visit `http://localhost:5173` to access the dashboard.

Refer to [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions covering Metagraph provisioning, Replit deployment, and end-to-end verification.
