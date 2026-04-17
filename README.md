# ReqSight

Production-ready Turborepo monorepo for a full-stack API monitoring tool.

## Apps

- `apps/web`: Next.js dashboard with Tailwind and shared UI components.
- `apps/api`: Express backend with MongoDB persistence and analytics APIs.

## Packages

- `packages/sdk`: API monitoring middleware for Express.
- `packages/ui`: Shared React UI components.
- `packages/config`: Shared ESLint and TypeScript configs.

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB running locally (or update `MONGO_URI` in `apps/api/.env`)
- Redis running locally

### Setup

```bash
npm install
npm run dev
```

This will start both the API server (port 5001) and web dashboard (port 3000).

## Features

### Backend (API)

- **Log Processing**: Queue-based log processing with BullMQ and Redis
- **MongoDB Storage**: Persistent log storage with efficient indexing
- **Analytics APIs**: RESTful endpoints for metrics and log queries
- **Health Checks**: System health monitoring

### Frontend (Dashboard)

- **Real-time Metrics**: Live API analytics with charts and cards
- **Log Tables**: Paginated logs and error views
- **Responsive Design**: Clean UI built with Tailwind CSS
- **Error Handling**: Graceful error states and loading indicators

## Endpoints

### API Endpoints

- `GET /health` - Health check
- `POST /log` - Queue a log entry
- `GET /log/logs` - Get paginated logs
- `GET /log/metrics` - Get analytics metrics
- `GET /log/errors` - Get paginated errors

### Dashboard

- `http://localhost:3000/dashboard` - Analytics dashboard

## Development

### Running Individual Services

```bash
# API only
cd apps/api && npm run dev

# Web only
cd apps/web && npm run dev

# Worker only (for log processing)
cd apps/api && npm run worker
```

### Environment Variables

Copy `.env.example` to `.env` in each app and configure:

**API (.env)**

```
REDIS_HOST=localhost
REDIS_PORT=6379
MONGO_URI=mongodb://localhost:27017/reqsight
PORT=5001
```

**Web (.env.local)**

```
# API base URL is hardcoded to http://localhost:5000
```
