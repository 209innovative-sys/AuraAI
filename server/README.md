# AuraAI Server

This is the Node.js + Express backend for AuraAI.

Main responsibility:

- Expose POST /analyze endpoint.
- Call the AI provider with the pasted chat.
- Return summary, vibe score, insights, and suggestions.
- Optionally interact with Firestore if needed.

See ../docs/ for data model and API expectations.
