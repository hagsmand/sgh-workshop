# Smart Branch in a Day: Siam Global House x IBM Bob workshop

Open `site/index.html` in a browser. That is the workshop material.

If the browser says **"Access to the file was denied"**, macOS is blocking it from reading your Documents, Desktop or Downloads folder. Serve the pages instead:

    node build/serve.js

Then open http://localhost:4173. No install needed.

| Path | What it is |
|------|------------|
| `site/` | The HTML workshop pages (home, step 0, labs 1 to 4, facilitator guide). Works from a double-click, no server needed |
| `site/downloads/ghh-bob-workshop-kit.zip` | The code kit participants download in step 0 |
| `kit/` | Source of the code kit. Plain Node.js. `npm install && npm run setup`, then `npm test` |
| `build/` | Generates the HTML from the kit, so code and numbers on the pages are always the tested ones |

Rebuild after any change to `kit/` or `build/`:

    cd kit && npm install && npm run setup && cd .. && node build/build.js

Read `site/facilitator.html` first. It has the run sheet, the risks, and a dry-run checklist for the parts that could not be tested without a Bob account.
