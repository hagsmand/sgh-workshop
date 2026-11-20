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

## Publish on GitHub Pages

The workflow `.github/workflows/pages.yml` rebuilds the kit and the pages from source, checks that every link works under a `/repo-name/` path, and publishes `site/`.

1. Create an empty repository on GitHub (Pages needs a public repository on a Free plan).
2. Push this folder to it:

        git remote add origin https://github.com/<you>/<repo>.git
        git add -A && git commit -m "Workshop material"
        git push -u origin HEAD

3. On GitHub: **Settings, Pages, Build and deployment, Source: GitHub Actions**.
4. Open the **Actions** tab. The run "Deploy workshop to GitHub Pages" publishes the site. If it ran before step 3, press **Re-run all jobs**.

The site is then at `https://<you>.github.io/<repo>/`. Every later push to the default branch redeploys it.

Check locally before you push: `node build/build.js && node build/check-site.js`.
