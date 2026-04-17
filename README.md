# RunSight

Production-ready Turborepo monorepo for a full-stack API monitoring tool.

## Apps

- `apps/web`: Next.js dashboard with Tailwind and shared UI components.
- `apps/api`: Express backend with health check endpoint.

## Packages

- `packages/sdk`: API monitoring middleware for Express.
- `packages/ui`: Shared React UI components.
- `packages/config`: Shared ESLint and TypeScript configs.

## Quick start

```bash
npm install
npm run dev
```

## Endpoints

- `GET http://localhost:4000/health`
