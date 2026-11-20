// Tiny syntax highlighter for the workshop pages (no dependencies).
// Output only adds <span class="tk-…"> around text. It never changes the text itself,
// and code() in lib.js asserts that, so Copy always gives exactly the tested file.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const span = (cls, text) => (text === '' ? '' : cls ? `<span class="${cls}">${esc(text)}</span>` : esc(text));
const render = (toks) => toks.map(([c, t]) => span(c, t)).join('');

/* ---------------- JavaScript ---------------- */
const JS_KW = new Set('const let var function return if else for while do break continue new throw try catch finally async await import export from default class extends typeof instanceof in of switch case this static get set'.split(' '));
const JS_LIT = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);
const REGEX_AFTER = new Set(['', '(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', 'return', '=>']);

function js(src) {
  const toks = [];
  let i = 0;
  let prev = '';
  const rules = [
    ['tk-c', /\/\/[^\n]*/y],
    ['tk-c', /\/\*[\s\S]*?\*\//y],
    ['tk-s', /'(?:\\.|[^'\\\n])*'/y],
    ['tk-s', /"(?:\\.|[^"\\\n])*"/y],
    ['tk-s', /`(?:\\.|[^`\\])*`/y],
    ['tk-n', /\b\d[\d_]*(?:\.\d+)?\b/y],
  ];
  const ident = /[A-Za-z_$][\w$]*/y;
  const regex = /\/(?:\\.|\[(?:\\.|[^\]\\\n])*\]|[^\/\\\n\[])+\/[a-z]*/y;
  const plain = [];
  const flush = () => { if (plain.length) { toks.push([null, plain.join('')]); plain.length = 0; } };
  while (i < src.length) {
    let hit = null;
    for (const [cls, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(src);
      if (m) { hit = [cls, m[0]]; break; }
    }
    if (!hit && src[i] === '/' && REGEX_AFTER.has(prev)) {
      regex.lastIndex = i;
      const m = regex.exec(src);
      if (m) hit = ['tk-s', m[0]];
    }
    if (!hit) {
      ident.lastIndex = i;
      const m = ident.exec(src);
      if (m) {
        const w = m[0];
        const after = src[i + w.length];
        const before = src[i - 1];
        hit = [JS_KW.has(w) ? 'tk-k' : JS_LIT.has(w) ? 'tk-n' : after === '(' && before !== '.' ? 'tk-fn' : after === '(' ? 'tk-fn' : null, w];
      }
    }
    if (hit) {
      if (hit[0]) { flush(); toks.push(hit); } else plain.push(hit[1]);
      i += hit[1].length;
      if (hit[0] !== 'tk-c') prev = /^\s+$/.test(hit[1]) ? prev : hit[1];
    } else {
      plain.push(src[i]);
      if (!/\s/.test(src[i])) prev = src[i];
      i++;
    }
  }
  flush();
  return render(toks);
}

/* ---------------- JSON ---------------- */
function json(src) {
  const toks = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b|([{}\[\],:])|(\s+)|([^\s])/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[1]) { toks.push([m[2] ? 'tk-key' : 'tk-s', m[1]]); if (m[2]) toks.push(['tk-p', m[2]]); }
    else if (m[3] || m[4]) toks.push(['tk-n', m[0]]);
    else if (m[5]) toks.push(['tk-p', m[0]]);
    else toks.push([null, m[0]]);
  }
  return render(toks);
}

/* ---------------- Shell ---------------- */
const SH_KW = new Set(['if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', 'export', 'echo']);
function shLine(line) {
  const toks = [];
  const re = /(\s+)|("(?:\\.|[^"\\])*"|'[^']*')|(\$\{?[A-Za-z_][\w@\[\]]*\}?|\$\([^)]*\))|(--?[A-Za-z][\w-]*)|(\|\||&&|[|;<>]+|\(|\)|\{|\})|(\\$)|(#.*$)|([^\s"'$|&;<>(){}\\#]+)/g;
  let m;
  let cmdPos = true;
  while ((m = re.exec(line))) {
    if (m[1]) { toks.push([null, m[1]]); continue; }
    if (m[7] && (toks.length === 0 || /\s$/.test(toks[toks.length - 1][1]))) { toks.push(['tk-c', m[7]]); continue; }
    if (m[2]) { toks.push(['tk-s', m[2]]); cmdPos = false; continue; }
    if (m[3]) { toks.push(['tk-x', m[3]]); cmdPos = false; continue; }
    if (m[4]) { toks.push(['tk-k', m[4]]); cmdPos = false; continue; }
    if (m[5]) { toks.push(['tk-p', m[5]]); cmdPos = /^(\|\||&&|\||;|\(|\{)$/.test(m[5]); continue; }
    if (m[6]) { toks.push(['tk-p', m[6]]); continue; }
    const w = m[8] ?? m[7];
    const assign = /^([A-Za-z_]\w*)=(.*)$/.exec(w);
    if (assign && cmdPos) { toks.push(['tk-x', assign[1]], ['tk-p', '='], [assign[2] ? 'tk-s' : null, assign[2]]); continue; }
    if (cmdPos) { toks.push([SH_KW.has(w) ? 'tk-k' : 'tk-fn', w]); cmdPos = SH_KW.has(w) && w !== 'in'; }
    else toks.push([SH_KW.has(w) ? 'tk-k' : null, w]);
  }
  return toks;
}
function sh(src) { return src.split('\n').map((l) => render(shLine(l))).join('\n'); }

/* ---------------- YAML (line based) ---------------- */
function exprSplit(text, cls) {
  // highlight ${{ ... }} inside a value
  const toks = [];
  const re = /\$\{\{[\s\S]*?\}\}/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) toks.push([cls, text.slice(last, m.index)]);
    toks.push(['tk-x', m[0]]);
    last = m.index + m[0].length;
  }
  if (last < text.length) toks.push([cls, text.slice(last)]);
  return toks;
}
function yamlValue(rest) {
  // split off a trailing comment (a "#" preceded by whitespace, outside quotes)
  let cut = -1;
  let q = null;
  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i];
    if (q) { if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; continue; }
    if (ch === '#' && (i === 0 || /\s/.test(rest[i - 1]))) { cut = i; break; }
  }
  const body = cut >= 0 ? rest.slice(0, cut) : rest;
  const comment = cut >= 0 ? rest.slice(cut) : '';
  const toks = [];
  const t = body.trim();
  if (/^["']/.test(t)) toks.push(...exprSplit(body, 'tk-s'));
  else if (/^(true|false|null|~|-?\d+(\.\d+)?)\s*$/.test(t)) toks.push(['tk-n', body]);
  else if (/^[\[{]/.test(t)) {
    for (const part of body.split(/([\[\]{},:])/)) toks.push([/^[\[\]{},:]$/.test(part) ? 'tk-p' : part.trim() ? 'tk-s' : null, part]);
  } else toks.push(...exprSplit(body, 'tk-s'));
  if (comment) toks.push(['tk-c', comment]);
  return toks;
}
function yaml(src) {
  const out = [];
  let block = null;
  for (const line of src.split('\n')) {
    const indent = line.match(/^ */)[0].length;
    if (block) {
      if (line.trim() === '' || indent > block.indent) {
        if (block.lang === 'sh') out.push(exprSplitLine(line));
        else out.push(render(exprSplit(line, 'tk-t')));
        continue;
      }
      block = null;
    }
    if (/^\s*#/.test(line)) { out.push(render([['tk-c', line]])); continue; }
    const m = /^(\s*)((?:-\s+)*)((?:"[^"]*"|'[^']*'|[A-Za-z0-9_.\/@-][^:#]*?))(:)(\s+|$)(.*)$/.exec(line);
    if (m && !/^\s*-\s+[^:]*$/.test(line.slice(0, 0))) {
      const [, ws, dashes, key, colon, gap, rest] = m;
      const toks = [[null, ws], ['tk-p', dashes], ['tk-key', key], ['tk-p', colon], [null, gap]];
      const blockHead = /^([|>])[+-]?\s*$/.exec(rest.trim());
      if (blockHead) {
        toks.push(['tk-p', rest]);
        block = { indent: ws.length + dashes.length, lang: key === 'run' ? 'sh' : 'plain' };
      } else toks.push(...yamlValue(rest));
      out.push(render(toks));
      continue;
    }
    const d = /^(\s*)((?:-\s+)+)(.*)$/.exec(line);
    if (d) { out.push(render([[null, d[1]], ['tk-p', d[2]], ...yamlValue(d[3])])); continue; }
    out.push(esc(line));
  }
  return out.join('\n');
}
function exprSplitLine(line) {
  // a shell line inside a YAML "run: |" block: shell colours plus ${{ }} expressions
  const parts = line.split(/(\$\{\{[\s\S]*?\}\})/);
  return parts.map((p) => (p.startsWith('${{') ? span('tk-x', p) : render(shLine(p)))).join('');
}

/* ---------------- Markdown (just enough for SKILL.md) ---------------- */
function md(src) {
  const lines = src.split('\n');
  let fm = lines[0] === '---' ? 1 : 0; // 1 = inside front matter
  return lines
    .map((line, i) => {
      if (line === '---' && (i === 0 || fm === 1)) { if (i > 0) fm = 2; return span('tk-p', line); }
      if (fm === 1) {
        const m = /^([\w-]+)(:)(\s*)(.*)$/.exec(line);
        return m ? render([['tk-key', m[1]], ['tk-p', m[2]], [null, m[3]], ['tk-s', m[4]]]) : esc(line);
      }
      if (/^#{1,6}\s/.test(line)) return span('tk-k', line);
      const toks = [];
      const m0 = /^(\s*(?:[-*]|\d+\.)\s+)(.*)$/.exec(line);
      const body = m0 ? m0[2] : line;
      if (m0) toks.push(['tk-p', m0[1]]);
      for (const part of body.split(/(`[^`]+`|<\/?[A-Z]\w*>)/)) {
        toks.push([/^`/.test(part) ? 'tk-s' : /^</.test(part) ? 'tk-fn' : null, part]);
      }
      return render(toks);
    })
    .join('\n');
}

export const LANGS = { js, json, sh, yaml, md };

export function highlight(src, lang) {
  const fn = LANGS[lang];
  return fn ? fn(src) : esc(src);
}

// Split highlighted HTML into per-line wrappers, closing and re-opening spans at line breaks,
// so CSS can number the lines without changing the copied text.
export function wrapLines(html) {
  const out = [];
  const stack = [];
  let line = '';
  const re = /<span class="([^"]+)">|<\/span>|\n|[^<\n]+|</g;
  let m;
  const open = () => stack.map((c) => `<span class="${c}">`).join('');
  const close = () => '</span>'.repeat(stack.length);
  line = open();
  while ((m = re.exec(html))) {
    const t = m[0];
    if (t === '\n') { out.push(`<span class="l">${line}${close()}\n</span>`); line = open(); }
    else if (m[1]) { stack.push(m[1]); line += t; }
    else if (t === '</span>') { stack.pop(); line += t; }
    else line += t;
  }
  out.push(`<span class="l">${line}${close()}</span>`);
  return out.join('');
}
