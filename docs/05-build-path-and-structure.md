# Build Path & Project Structure

## Build Path (Technology Stack)

- Frontend:
  - React
  - Vite
  - TypeScript
  - TailwindCSS

- Backend:
  - Node.js
  - Express
  - Hosted on Render as a web service

- Auth & Database:
  - Firebase Auth
  - Firestore

- Hosting:
  - Frontend: Vercel
  - Backend: Render

## Project Structure (High-Level)

auraai-live/
  frontend/      # Vite + React app
  server/        # Node/Express API
  docs/          # Planning and specification docs

### Suggested frontend src structure

frontend/src/
  main.tsx
  App.tsx
  routes/
    Dashboard.tsx
    NewAnalysis.tsx
    AnalysisDetail.tsx
    Auth.tsx
    Profile.tsx
  components/
    VibeGauge.tsx
    AnalysisCard.tsx
    Layout.tsx
  lib/
    firebase.ts
    apiClient.ts
  styles/
    globals.css

### Suggested server structure

server/src/
  index.ts
  routes/
    analyze.ts          # POST /analyze
  services/
    openaiClient.ts
    analysisFormatter.ts
  config/
    env.ts
