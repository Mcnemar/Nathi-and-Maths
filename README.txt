NATHI & MATHS — AI TUTOR FOUNDATION V4

WHAT IS INCLUDED
- The V3 mobile/PWA Mathematics learning foundation, retained.
- AI tutor interface updated to accept typed questions and JPG/PNG/WEBP photos.
- Preview of the selected question photo before sending.
- Secure Node.js server-side AI proxy using the OpenAI Responses API.
- API key is read only from the server environment, never from browser JavaScript.
- Tutor instructions emphasise step-by-step teaching for NC(V) Levels 2, 3 and 4.
- Basic request validation, 20-request/minute IP rate limit, security headers and bounded history.

IMPORTANT STATUS
This is a development foundation, not a deployed or production-ready commercial service. The browser app still works in offline demo mode. Live AI will work only after the server is deployed and a valid API key with API billing is configured securely. No API key is included.

RUN LOCALLY (requires Node.js 20+)
1. Open a terminal in the 'server' folder.
2. Run: npm install
3. Copy the root .env.example to a root file named .env and add your API key.
4. Run: npm start
5. Open http://localhost:3000

The API key must stay in the server environment. Never put it in app.js, index.html, a public GitHub repository or an Android app.

PHOTO INPUT
Supported: JPEG, PNG and WEBP, up to 5 MB. The browser sends the image to the app's own server; the server forwards it to the AI provider. Review privacy notices and retention settings before using real learner data.

NOT YET IMPLEMENTED
- User accounts, college tenancy and role-based access.
- Cloud database and synchronised learner progress.
- Lecturer dashboard and class analytics.
- Institutional/individual subscriptions and payment processing.
- Verified DHET curriculum mapping and complete Level 2/3/4 question banks.
- POPIA compliance review, consent workflows, production monitoring and security testing.
- Production deployment, domain, Android packaging and app-store release.

NEXT MILESTONES
1. Deploy the backend securely and test typed and photo-based questions.
2. Build sign-in, learner/lecturer/admin roles and institution/campus structure.
3. Add database-backed learner progress and lecturer reporting.
4. Add subscription plans, payment integration and entitlement enforcement.
5. Complete curriculum mapping, safeguarding, POPIA/legal review and pilot testing.

The AI integration follows the OpenAI Responses API. See https://developers.openai.com/api/docs/quickstart and https://developers.openai.com/api/reference/overview.
