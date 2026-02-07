# Preview Node.js Demo

A small Node.js backend that depends on **MongoDB** and **Redis**, with a **health** endpoint and **API** routes. Suitable for demonstrating isolated preview environments.

## Prerequisites

- Node.js 18+
- MongoDB (running and reachable)
- Redis (running and reachable)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and set your MongoDB and Redis URLs:

   ```bash
   cp .env.example .env
   # Edit .env with your MONGODB_URI and REDIS_URL
   ```

3. **Run migrations**

   ```bash
   npm run migrate
   ```

4. **Seed demo data**

   ```bash
   npm run seed
   ```

5. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

   The server listens on `PORT` (default `3000`).

## Endpoints

### Health

- **GET /health** – Reports status of MongoDB and Redis.
  - **200**: `{ "status": "ok", "mongodb": "ok", "redis": "ok" }`
  - **503**: One or both services degraded; response includes per-service status.

### API

- **GET /api/items** – List items (from MongoDB).
- **POST /api/items** – Create an item (body: `{ "name": "..." }`).
- **GET /api/counter** – Get current counter value (from Redis).
- **POST /api/counter** – Increment counter, returns new value.

## Docker

**Run the full stack** (app + MongoDB + Redis) with Docker Compose. Migrations and seed run automatically before the app starts.

```bash
docker compose up --build
```

The API is at http://localhost:3000. Data is stored in named volumes (`mongodb_data`, `redis_data`).

**Build the app image only** (connect to your own MongoDB and Redis):

```bash
docker build -t preview-nodejs-demo .
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/preview-demo \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  preview-nodejs-demo
```

## Scripts

| Script     | Description                    |
| ---------- | ------------------------------ |
| `npm start` | Start the server               |
| `npm run dev` | Start with watch mode          |
| `npm run migrate` | Run database migrations   |
| `npm run seed` | Seed demo data (idempotent) |
