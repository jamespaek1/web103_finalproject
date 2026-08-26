# PotluckHub client

The PotluckHub client is a Vite-powered React application for browsing potluck events and recipes, managing RSVPs, and claiming dishes.

## Local setup

```bash
npm install
npm run dev
```

The client runs at `http://localhost:5173` by default. It expects the API at `http://localhost:3001`; set `VITE_API_URL` to use a different API endpoint.

## Production build

```bash
npm run build
npm run preview
```

The full-stack application requires the API configuration documented in the [main project README](../README.md#run-locally).
