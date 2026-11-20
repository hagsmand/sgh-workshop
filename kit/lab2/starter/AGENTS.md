# Project rules for Bob

- Plain Node.js (ES modules) with Express. No database, no TypeScript, no front-end framework.
- The page is one HTML file with vanilla JavaScript in `public/`.
- Money is Thai baht, shown as ฿1,234.50.
- Validate every query parameter. Bad input returns 400 with a message that lists what is allowed.
- Product names exist in English and Thai. Search must work in both.
- Read `SPEC.md` before you start. Do not add features that are not in it.
