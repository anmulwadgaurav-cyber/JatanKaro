# JatanKaro — Deployment Guide

This repository contains two apps:

- `Backend/` — Express + MongoDB API
- `Frontend/` — Vite + React SPA

This README lists recommended steps and environment variables to deploy the whole app to a platform like Render, Vercel, Netlify, or any VPS.

---

## 1) Backend (Node/Express)

Required environment variables (set these in your hosting provider):

- `PORT` (default 5000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `FRONTEND_URL` — deployed frontend origin (e.g. `https://app.example.com`) for CORS
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (optional for Redis)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_USER` (if using Google services)
- `OPENAI_API_KEY`, `GOOGLE_API_KEY` (if using AI features)

Quick deploy notes (Render example):

1. Create a new Web Service on Render.
2. Connect to your GitHub repo and select the `Backend/` folder as the root (or point to the repo and set build/start commands in the dashboard).
3. Set the build and start commands in Render:
   - Build command: (none usually required for Node)
   - Start command: `npm start`
4. Add all environment variables above in the Render dashboard.
5. Make sure `MONGODB_URI` points to your production cluster.
6. If you want to serve the frontend from the backend, upload the built frontend files to `Backend/public` and Express will serve them.

Check the health endpoint after deployment:

GET https://<your-backend>/health — should return 200 JSON { status: "ok" }

---

## 2) Frontend (Vite + React)

The frontend reads the backend base URL from `VITE_API_BASE`.

1. In the `Frontend/` project, create a `.env` with:

VITE_API_BASE=https://jatankaro.onrender.com

2. Build the frontend for production:

npm install
npm run build

3 options to host the build:

- Deploy as a static site on Render (New -> Static Site). Set `Build Command` to `npm run build` and `Publish Directory` to `dist`.
- Deploy to Netlify/Vercel with the same build and publish settings.
- Serve via the backend: copy the `dist` contents into `Backend/public` and let Express serve the static files.

## 3) CORS and Cookies

- The backend allows credentials (cookies). If you use cookies for session auth, ensure `FRONTEND_URL` is set to the exact deployed frontend origin and that `VITE_API_BASE` is set to the backend URL.
- If frontend and backend are on different domains, keep `withCredentials: true` in axios calls and verify cookies are set with appropriate `SameSite=None; Secure` flags from backend.

## 4) Security and Secrets

- Never commit your `.env` file. Use the hosting provider's environment variable settings.
- Rotate secrets before production. The repository currently contains a local `.env` - ensure you don't push secrets to public repos.

## 5) Useful commands (Windows PowerShell)

# Frontend

cd Frontend
npm install
npm run build

# Backend (local testing)

cd Backend
npm install
npm run dev

## 6) Optional: Render yaml (example)

If you want a single `render.yaml` to deploy both services, Render supports it — see their docs. Otherwise use the Render UI to create two services:

- Web Service (Backend)
- Static Site (Frontend)

---

If you want, I can:

- Add a `render.yaml` that declares both services (backend + static frontend).
- Add a small Express middleware to serve the `dist` folder when present (so you can deploy a single service).

Tell me which hosting target you prefer (Render, Vercel, Netlify, Docker, VPS). I can then:

- Create a `render.yaml` and CI-friendly configs, or
- Wire a single-service deployment that serves frontend from backend (copy `dist` to `Backend/public` during build).
