# Auth & Design System

## Auth Rules

- Auth provider: Firebase Auth (email/password).
- Public route:
  - `/auth`
- Protected routes:
  - `/`
  - `/new`
  - `/analysis/:id`
  - `/profile`

### Auth Flow

- On login/sign up:
  - Use Firebase Auth to authenticate.
  - Store user in app state (context/store).
  - If it is the first login, create `/users/{uid}` in Firestore.

- On logout:
  - Call signOut().
  - Clear user state.
  - Redirect to `/auth`.

## Design System (MVP)

### Theme

- Dark theme by default.

### Colors (example palette)

- Background: `#050816`
- Card: `#0f172a`
- Text primary: `#e5e7eb`
- Text secondary: `#9ca3af`
- Primary accent: `#6366f1`
- Danger: `#ef4444`
- Vibe gauge gradient: blue → yellow → red

### Typography

- Titles: `text-2xl font-semibold`
- Section headings: `text-lg font-semibold`
- Body text: `text-sm` or `text-base`

### Layout & Spacing

- Page padding:
  - Mobile: `px-4 py-6`
  - Desktop: `px-8 py-10`
- Cards:
  - Rounded corners (`rounded-2xl`)
  - Padding (`p-4` / `p-6`)
  - Soft shadow

### Buttons

- Primary button:
  - Solid background with primary accent color.
  - Rounded corners.
  - Clear hover state (slightly brighter).

- Secondary button:
  - Outline / ghost style.
  - Used for less critical actions.
