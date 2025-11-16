# Data Model, Database & CRUD

## Collections

### users

- id (auto)
- email
- createdAt
- plan ("free" for v1)
- displayName (optional)

Usage:

- On first login/sign up, create `/users/{uid}` with:
  - email
  - createdAt
  - plan: "free"

### analyses

- id (auto)
- userId (reference to users.id)
- title (e.g., "Talk after fight")
- relationshipType (Partner, Ex, Friend, etc.)
- rawText (the chat text)
- summaryText (short summary of the conversation)
- overallVibe (e.g., calm, mixed, tense)
- vibeScore (0–100)
- insights (array of strings)
- suggestions (array of strings)
- createdAt
- updatedAt

## Firestore Usage

- To list analyses for the current user:
  - query(analyses, where("userId", "==", uid), orderBy("createdAt", "desc"))
- To fetch a single analysis:
  - getDoc(doc(analyses, id))

## CRUD Operations on analyses

### Create

- Trigger: user clicks "Analyze Vibe" on New Analysis screen.
- Flow:
  1. Frontend sends rawText + title + relationshipType to backend `/analyze`.
  2. Backend uses AI to return:
     - summaryText
     - overallVibe
     - vibeScore
     - insights[]
     - suggestions[]
  3. Frontend stores document in `analyses` with fields listed above.

### Edit (lightweight)

- Allow user to change:
  - title
  - relationshipType
- Do not edit rawText or AI content in v1.
- If user wants updated AI analysis, use "Re-run".

### Delete

- Allow user to delete their own analysis record:
  - deleteDoc(doc(analyses, id))

### Re-run Analysis

- Button: "Re-run Analysis".
- Flow:
  1. Use existing rawText.
  2. Call backend `/analyze` again.
  3. Update summaryText, overallVibe, vibeScore, insights, suggestions, updatedAt.
