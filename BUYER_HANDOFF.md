Buyer Handoff — Merry Cookies (short guide)

1) Studio URL
- If Studio is deployed to Vercel: visit the Studio URL (e.g., https://merrycookies-studio.vercel.app/). If you don't have a deployed Studio, run `cd studio && npm run dev` locally to open it.

2) Access & Users
- Invite or create a user in Sanity (https://manage.sanity.io/).
- Alternatively, create a Sanity account and invite them to the project via the Sanity project settings.

3) Edit cookies
- Open the Desk (left sidebar) and select the `cookie` document type.
- Create/edit cookie documents; fields: name, description, price, image.
- Images upload will be stored in the Sanity CDN and the storefront will show them automatically.

4) Seed data (if needed)
- To populate initial cookies (idempotent), run the seed script (requires a write token):
  ```bash
  export SANITY_PROJECT_ID=3tusbazs
  export SANITY_DATASET=production
  export SANITY_TOKEN=<write_token>
  npm run seed:studio
  ```

5) Rotate tokens
- If you used `SANITY_TOKEN` for seeding, revoke or rotate it in the Sanity management console after seeding. Do not share tokens publicly.

6) Quick troubleshooting
- "Tool not found" in Studio: confirm `studio/sanity.config.ts` includes `deskTool()` (it does in this repo).
- Frontend not showing changes: ensure NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET env vars are set in the deployed Next project.

7) Support
- If anything breaks during deploy, provide the developer logs and I can help fix build or env issues quickly.
