Required environment variables for Vercel deployment

- NEXT_PUBLIC_SANITY_PROJECT_ID (example: 3tusbazs)
- NEXT_PUBLIC_SANITY_DATASET (example: production)
- NEXT_PUBLIC_SANITY_API_VERSION (optional; used in src/sanity/env.ts)
- SANITY_WRITE_TOKEN (used only for seeding on CI or for server-side scripts)

Seeding data before deploy

To seed initial cookie documents into your Sanity dataset before deploying to Vercel, run the seed script locally or in CI with a write token:

bash

export SANITY_PROJECT_ID=3tusbazs
export SANITY_DATASET=production
export SANITY_TOKEN=your_write_token_here
node studio/scripts/seedCookies.js

# On Windows PowerShell

$env:SANITY_PROJECT_ID="3tusbazs"
$env:SANITY_DATASET="production"
$env:SANITY_TOKEN="your_write_token_here"
node studio/scripts/seedCookies.js

Notes

- Do NOT commit your SANITY_TOKEN to source control. Use Vercel Environment Variables for runtime secrets.
- Once seeded, the frontend will query Sanity for cookie documents. The local `cookiesData` file remains as a fallback only for development if Sanity is empty.
