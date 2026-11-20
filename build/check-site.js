// Checks the built site the way GitHub Pages will serve it:
//   - under a project path (https://<user>.github.io/<repo>/), not at the domain root
//   - case-sensitively (GitHub Pages is; macOS and Windows usually are not)
//
//   node build/check-site.js
//
// Catches the two classic "works on my laptop, breaks on Pages" bugs:
//   href="/assets/site.js"   (root-relative: lands on the domain root, not your repo)
//   href="Lab-1.html"        (wrong case: opens on a Mac, 404 on Pages)

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = process.env.SITE_DIR ?? join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const BASE = new URL('https://example.github.io/any-repo-name/');

// Every path segment must match a real directory entry byte for byte.
function existsExact(rel) {
  let dir = SITE;
  for (const part of rel.split('/').filter(Boolean)) {
    if (!readdirSync(dir).includes(part)) return false;
    dir = join(dir, part);
  }
  return statSync(dir).isFile();
}

const problems = [];
let checked = 0;
let external = 0;
const pages = readdirSync(SITE).filter((f) => f.endsWith('.html'));
if (pages.length === 0) problems.push('no .html pages in ' + SITE);

for (const page of pages) {
  const html = readFileSync(join(SITE, page), 'utf8');
  const pageUrl = new URL(page, BASE);

  // Every link to another site must open in a new tab and must not hand it window.opener.
  for (const m of html.matchAll(/<a\s[^>]*?href="(https?:\/\/[^"]*)"[^>]*>/g)) {
    const tag = m[0];
    external++;
    if (!/\starget="_blank"/.test(tag)) problems.push(`${page}: external link "${m[1]}" does not open in a new tab`);
    else if (!/\srel="[^"]*noopener[^"]*"/.test(tag)) problems.push(`${page}: external link "${m[1]}" opens a new tab without rel="noopener"`);
  }
  const refs = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)].map((m) => m[1]),
  ];
  for (const ref of refs) {
    if (!ref || ref.startsWith('#') || /^(mailto:|data:|javascript:)/.test(ref)) continue;
    const u = new URL(ref, pageUrl);
    if (u.origin !== BASE.origin) continue; // an external site, not ours to check
    checked++;
    if (!u.pathname.startsWith(BASE.pathname)) {
      problems.push(`${page}: "${ref}" points at the domain root, outside the repo path. Use a relative link.`);
      continue;
    }
    let rel = decodeURIComponent(u.pathname.slice(BASE.pathname.length));
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    if (!existsExact(rel)) problems.push(`${page}: "${ref}" does not exist (names are case-sensitive on GitHub Pages)`);
  }
}

if (problems.length) {
  console.error('Site check failed:\n' + problems.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(`Site check passed: ${pages.length} pages, ${checked} internal links and assets, ${external} external links open in a new tab`);
