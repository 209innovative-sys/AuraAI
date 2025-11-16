# Screens & Routes

## Core Screens

1. Auth (Login / Sign Up)
2. Dashboard (My Analyses)
3. New Analysis
4. Analysis Result
5. Profile / Settings

## Screen Sketches (Conceptual)

### Auth Screen

- Logo + short tagline.
- Inputs: email, password.
- Buttons: "Log In", "Sign Up".
- Link: "Forgot password?".

### Dashboard (My Analyses)

- Header: AuraAI logo, "New Analysis" button, "Profile" button.
- Greeting: "Welcome back, <FirstName>".
- List of analyses:
  - Title
  - Date
  - Vibe label (e.g., Warm / Mixed / Tense)
  - Clickable to open details.

### New Analysis

- Text input: "Label this conversation".
- Dropdown: relationship type (Partner, Ex, Friend, etc.).
- Large textarea to paste chat.
- Button: "Analyze Vibe".
- Small privacy note.

### Analysis Result

- Title + date + relationship type.
- Vibe gauge (cool → warm → tense).
- One-line overall vibe summary.
- Section: Summary (short paragraph).
- Section: Key Insights (bullets).
- Section: Suggested Reflections (bullets).
- Buttons: "Re-run Analysis", "Back to Dashboard".

### Profile / Settings

- Email and plan.
- Buttons:
  - Manage account (later).
  - Delete all analyses (later).
  - Log out.

## Route Map

- `/auth` → Auth page (login/sign up).
- `/` → Dashboard (requires auth).
- `/new` → New Analysis screen.
- `/analysis/:id` → Analysis Result screen.
- `/profile` → Profile / Settings.

## Navigation Rules

- After successful login/sign up → redirect to `/`.
- Dashboard:
  - "New Analysis" button → `/new`.
  - Clicking an analysis card → `/analysis/:id`.
  - "Profile" button → `/profile`.
- Analysis Result:
  - "Back" → `/`.
- Profile:
  - "Back" → `/`.
  - "Log out" → sign out and go to `/auth`.
