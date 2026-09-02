THE CORE STANDARD — marketing site (feedback preview)
=====================================================

WHAT THIS IS
  A self-contained static website. No build step. Drag-and-drop ready.

DEPLOY TO NETLIFY (fastest — drag & drop)
  1. Go to https://app.netlify.com/drop
  2. Drag this whole folder (or the .zip) onto the page.
  3. Netlify gives you a random URL like random-name-123.netlify.app — share that for feedback.
  4. (Optional) Site settings > Change site name to something tidier.

DEPLOY TO NETLIFY (from the dashboard)
  1. "Add new site" > "Deploy manually" > drop the folder/zip.
  2. Publish directory: the folder root (netlify.toml already sets publish = ".").

PREVIEW IS HIDDEN FROM GOOGLE
  - robots.txt disallows all crawlers.
  - netlify.toml adds an X-Robots-Tag: noindex,nofollow header.
  When you go live on the real domain, replace robots.txt with the full
  version (in the source Website/ folder) and delete the headers block in netlify.toml.

KNOWN PRE-LAUNCH ITEMS (don't block feedback)
  - Stripe "Commission" buttons fall back to mailto until live Stripe links are added.
  - Terms/Privacy carry pending-legal-sign-off banners.
  - Simulators are NOT included here — they deploy separately under their own path.
