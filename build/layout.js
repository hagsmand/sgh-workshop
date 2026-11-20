import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { esc } from './lib.js';

// The stylesheet is inlined into every page, so a page still looks right if it is opened
// without the assets folder next to it (only the fonts fall back to system fonts).
const CSS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'site', 'assets', 'site.css'), 'utf8').replace(/url\("fonts\//g, 'url("assets/fonts/');

export const NAV = [
  { id: 'step-0', file: 'step-0.html', no: '0', title: 'Set up', meta: 'Before the day · about 30 min' },
  { id: 'lab-1', file: 'lab-1.html', no: '1', title: "Understand Bob's capability", meta: '60 min' },
  { id: 'lab-2', file: 'lab-2.html', no: '2', title: 'Create an app with Bob', meta: '40 min' },
  { id: 'lab-3', file: 'lab-3.html', no: '3', title: 'Bob CLI in GitHub Actions', meta: '60 min' },
  { id: 'break', gap: true, no: '–', title: 'Break', meta: '60 min' },
  { id: 'lab-4', file: 'lab-4.html', no: '4', title: 'Bob Desktop', meta: '60 min' },
];

const PAGES = [{ id: 'home', file: 'index.html', title: 'Smart Branch in a Day' }, ...NAV.filter((n) => n.file)];

// Brand mark: a floor-plan corner with a redline dimension tick.
const MARK = `<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect x="1.5" y="1.5" width="29" height="29" rx="7" fill="#0b2a4a"/><path d="M7 25V9.5h8.5M7 17h12M19 25V13.5h6" fill="none" stroke="#8fb8e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="25" cy="8" r="3" fill="#ff7a63"/></svg>`;


// Links to other sites open in a new tab, so people keep their place in the workshop.
// Done at build time: it works without JavaScript and covers every page, including future ones.
// rel="noopener noreferrer" stops the new tab from controlling this one.
export function markExternalLinks(html) {
  return html.replace(/<a\s([^>]*?)>([\s\S]*?)<\/a>/g, (whole, attrs, inner) => {
    const href = /\shref="(https?:\/\/[^"]*)"|^href="(https?:\/\/[^"]*)"/.exec(' ' + attrs);
    if (!href || /\btarget=/.test(attrs)) return whole;
    const cls = /\bclass="([^"]*)"/.exec(attrs);
    const a = cls ? attrs.replace(cls[0], `class="${cls[1]} ext"`) : `${attrs} class="ext"`;
    // Keep the icon on the same line as the last word: wrap the final word and the hint in a nowrap span.
    const glued = inner.replace(/(\S+)$/, '<span class="last">$1<span class="sr-only"> (opens in a new tab)</span></span>');
    return `<a ${a} target="_blank" rel="noopener noreferrer">${glued === inner ? inner + '<span class="sr-only"> (opens in a new tab)</span>' : glued}</a>`;
  });
}

function render({ id, title, body, hero, sheet }) {
  const i = PAGES.findIndex((p) => p.id === id);
  const prev = i > 0 ? PAGES[i - 1] : null;
  const next = i >= 0 && i < PAGES.length - 1 ? PAGES[i + 1] : null;

  const map = NAV.map((n) => {
    const inner = `<span class="no">${esc(n.no)}</span><span class="t">${esc(n.title)}<span class="m">${esc(n.meta)}</span></span>`;
    if (n.gap) return `<li><div class="gap">${inner}</div></li>`;
    return `<li><a href="${n.file}"${n.id === id ? ' aria-current="page"' : ''}>${inner}</a></li>`;
  }).join('');

  const pager =
    prev || next
      ? `<nav class="pager" aria-label="Previous and next page">${prev ? `<a class="prev" href="${prev.file}"><small>Back</small><b>${esc(prev.title)}</b></a>` : ''}${next ? `<a class="next" href="${next.file}"><small>Next</small><b>${esc(next.title)}</b></a>` : ''}</nav>`
      : '';

  const bar = `<header class="bar">
  <div class="bar-in">
    <a class="brand" href="index.html">${MARK}<span>Smart Branch in a Day</span></a>
    <span class="meta">Siam Global House × IBM Bob</span>
    <div class="progress-wrap" id="progress-wrap" hidden><span id="progress-label" aria-live="polite"></span><span class="meter" aria-hidden="true"><i id="progress-fill"></i></span></div>
  </div>
</header>`;

  const rail = `<nav class="rail" aria-label="Workshop map">
    <h2>Workshop map</h2>
    <ol>${map}</ol>
    <div class="side"><a href="facilitator.html">Facilitator guide</a><a href="downloads/ghh-bob-workshop-kit.zip" download>Download the code kit</a></div>
  </nav>`;

  const head = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#0b2a4a">
<title>${esc(title)} · Smart Branch in a Day</title>
<style>
${CSS}</style>
</head>
<body data-page="${esc(id)}">
<a class="skip" href="#main">Skip to content</a>
${bar}`;

  const tail = `<script src="assets/site.js"></script>
</body>
</html>
`;

  if (hero) {
    return `${head}
<main id="main">
${hero}
${body}
</main>
<p class="footer">Siam Global House × IBM Bob · sample data is made up</p>
${tail}`;
  }

  return `${head}
<div class="floor">
  ${rail}
  <main id="main">
${sheet ?? ''}
${body}
${pager}
  </main>
</div>
${tail}`;
}

export const layout = (page) => markExternalLinks(render(page));

// The title block at the top of each lab: sheet number, title, and a small spec table.
export function titleBlock({ no, title, sub, facts }) {
  const dl = facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('');
  return `<header class="titleblock"><div class="top"><div class="sheetno" aria-hidden="true">${esc(no)}</div><div><h1>${esc(title)}</h1><p class="sub">${esc(sub)}</p></div></div><dl>${dl}</dl></header>`;
}
