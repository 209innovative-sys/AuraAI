# Testing & Deployment

## Manual Test Checklist (Desktop + Phone)

### 1. Auth

- [ ] Can create a new account.
- [ ] Can log out and log back in.
- [ ] Wrong password shows a clear error message.

### 2. Dashboard

- [ ] After login, Dashboard loads successfully.
- [ ] "New Analysis" button is visible.
- [ ] On phone, analysis cards are readable without horizontal scrolling.

### 3. New Analysis

- [ ] Can enter a title, pick relationship type, and paste chat text.
- [ ] "Analyze Vibe" button is visible and clickable on phone and desktop.

### 4. Analysis Result

- [ ] Vibe gauge renders correctly (no layout break).
- [ ] Summary, key insights, and suggestions are readable on phone.

### 5. History

- [ ] New analysis appears on Dashboard list.
- [ ] Clicking an analysis card opens the correct detail page.

### 6. Profile

- [ ] Email and plan (e.g., Free) are shown.
- [ ] "Log out" works and returns user to `/auth`.

## Deployment Notes

### Frontend (Vercel)

- Build the frontend/ Vite app.
- Required environment variables (examples):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_API_BASE_URL` (URL of backend on Render)

### Backend (Render)

- Node/Express app exposing:
  - `POST /analyze` endpoint.
- Required environment variables (examples):
  - `OPENAI_API_KEY`
  - Any Firebase-related config needed server-side.

### Post-deploy Sanity Checks

- [ ] Frontend URL loads with no critical console errors.
- [ ] `/auth` works (login and signup).
- [ ] Creating a new analysis calls the `/analyze` endpoint.
- [ ] A result appears and is saved in Firestore.
- [ ] Refreshing Dashboard still shows the saved analysis.
