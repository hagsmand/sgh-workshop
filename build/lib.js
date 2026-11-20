// HTML building blocks for the workshop pages. Plain strings, no dependencies.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { highlight, wrapLines } from './highlight.js';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const KIT = join(here, '..', 'kit');

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Read a kit file so pages always show the code that was actually tested.
export const file = (rel) => readFileSync(join(KIT, rel), 'utf8').replace(/\s+$/, '') + '\n';

// Highlighted code block. The highlighter only adds <span> tags; we prove the text is unchanged,
// so the Copy button always gives exactly the tested file.
const stripTags = (h) => h.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const guessLang = (name = '', hint) => {
  if (hint) return hint;
  if (/\.(js|mjs)$/.test(name)) return 'js';
  if (/\.ya?ml$/.test(name)) return 'yaml';
  if (/\.json$/.test(name)) return 'json';
  if (/\.md$/.test(name)) return 'md';
  return null;
};

// A code block. With `name` it gets a caption bar (usually the file path).
export function code(content, name, lang) {
  const text = content.replace(/\n$/, '');
  const l = guessLang(name, lang) ?? (name && /terminal|bash|shell/i.test(name) ? 'sh' : name ? null : 'sh');
  const html = l ? highlight(text, l) : esc(text);
  if (stripTags(html) !== text) throw new Error(`highlighter changed the text of a ${l} block (${name ?? 'unnamed'})`);
  const lines = text.split('\n').length;
  const short = lines <= 4 ? ' short' : '';
  const body = `<pre><code>${wrapLines(html)}</code></pre>`;
  return name
    ? `<div class="code${short}" data-copyable><div class="cap"><span class="name">${esc(name)}</span><button class="copy" type="button">Copy</button></div>${body}</div>`
    : `<div class="code nocap${short}" data-copyable><button class="copy" type="button">Copy</button>${body}</div>`;
}

// Text to paste into Bob.
export const prompt = (text, who = 'Paste into Bob') =>
  `<div class="prompt" data-copyable><div class="who">${esc(who)}</div><p>${esc(text)}</p><button class="copy" type="button">Copy</button></div>`;

const NOTE_TITLE = { tip: 'Tip', warn: 'Careful', expect: 'You should see', fac: 'For the facilitator' };
export const note = (kind, html, title) => `<div class="note ${kind}"><p class="h">${esc(title ?? NOTE_TITLE[kind])}</p>${html}</div>`;

export const stuck = (title, html) => `<details class="stuck"><summary>${title}</summary><div class="in">${html}</div></details>`;

export function table(head, rows, { num = [] } = {}) {
  const cls = (i) => (num.includes(i) ? ' class="n"' : '');
  return `<div class="tbl"><table><thead><tr>${head.map((h, i) => `<th${cls(i)}>${h}</th>`).join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c, i) => `<td${cls(i)}>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;
}

// Numbered steps with a number in the gutter and a "done" checkbox.
export function steps(list) {
  const items = list
    .map(
      (s, i) =>
        `<section class="step" id="step-${i + 1}"><div class="gutter"><span class="tag">${i + 1}</span><input type="checkbox" aria-label="Mark step ${i + 1} done"></div><div class="inner"><h3>${s.title}${s.mins ? `<span class="mins">${s.mins} min</span>` : ''}</h3>${s.body}</div></section>`,
    )
    .join('\n');
  return `<div class="steps">${items}</div>`;
}

export const ul = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
export const ol = (items) => `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`;
