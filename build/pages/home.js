// Home page: a drafting-table hero (an animated floor plan of the store) and the day as drawing sheets.

// Floor plan. viewBox 560 x 380. Pathlength=1 lets CSS animate stroke drawing without measuring.
function plan() {
  const racks = [];
  // 6 aisles of racks in the sales hall
  for (let c = 0; c < 6; c++) for (let r = 0; r < 2; r++) racks.push(`<rect class="rack fade" style="--d:${1.3 + (c * 2 + r) * 0.05}s" x="${150 + c * 52}" y="${86 + r * 90}" width="34" height="68" rx="2"/>`);
  // dir: where the tooltip opens. Boxes are clamped inside the 560 x 380 drawing.
  const pin = (n, x, y, label, href, d, dir = 'b') => {
    const w = Math.round(label.length * 6.5 + 24);
    const tx = Math.max(6, Math.min(554 - w, x - w / 2));
    const ty = dir === 'a' ? y - 24 - 28 : y + 24;
    const ly1 = dir === 'a' ? y - 15 : y + 15;
    const ly2 = dir === 'a' ? ty + 28 : ty;
    return `
    <g class="pin" data-n="${n}" data-href="${href}" tabindex="0" role="link" aria-label="Problem ${n}: ${label}. Open lab ${n}.">
      <circle class="halo" style="--d:${d}s" cx="${x}" cy="${y}" r="14"/>
      <circle class="dot" cx="${x}" cy="${y}" r="15"/>
      <text class="n" x="${x}" y="${y}">${n}</text>
      <g class="tip"><path class="leader" d="M${x} ${ly1} V${ly2}"/><rect x="${tx}" y="${ty}" width="${w}" height="28" rx="7"/><text x="${tx + 12}" y="${ty + 18.5}">${label}</text></g>
    </g>`;
  };
  return `<svg class="plan" viewBox="0 0 560 380" width="560" height="380" role="img" aria-labelledby="plan-t" focusable="false">
  <title id="plan-t">Floor plan of a Global House branch with four numbered problem markers, one for each lab.</title>
  <!-- outer wall -->
  <path class="wall" d="M30 56 H530 V318 H30 Z"/>
  <path class="trace" pathLength="1" d="M30 56 H530 V318 H30 Z"/>
  <!-- loading dock notch -->
  <path class="wall" d="M30 318 V344 H150 V318"/>
  <!-- office / server room -->
  <rect class="room" x="440" y="62" width="84" height="76" rx="2"/>
  <!-- checkout line -->
  <path class="thin" d="M150 276 H420 M150 296 H420"/>
  <!-- entrance -->
  <path class="wall" d="M470 318 H500" stroke-width="5"/>
  <!-- truck -->
  <g class="fade" style="--d:1.2s"><rect class="truck" x="40" y="352" width="86" height="22" rx="3"/><circle class="truck" cx="58" cy="376" r="5"/><circle class="truck" cx="108" cy="376" r="5"/><path class="truck" d="M126 358 h14 l7 8 v8 h-21"/></g>
  ${racks.join('')}
  <!-- dimension line -->
  <g class="fade" style="--d:1.9s"><path class="dim" d="M30 36 H530 M30 30 V42 M530 30 V42"/><text class="t-mono" x="280" y="28" text-anchor="middle">100,000+ SKUs under one roof</text></g>
  <g class="fade" style="--d:2s"><text class="t-lbl" x="482" y="123" text-anchor="middle">Dev office</text><text class="t-mono" x="482" y="136" text-anchor="middle">PRs</text>
  <text class="t-lbl" x="285" y="270" text-anchor="middle" style="font-size:10px">Checkout</text><text class="t-mono" x="85" y="306" text-anchor="middle">Dock 9:00</text><text class="t-mono" x="485" y="334" text-anchor="middle">Entrance</text></g>
  ${pin(1, 118, 140, 'Teach Bob the store', 'lab-1.html', 2.2)}
  ${pin(2, 300, 130, 'Build the stock dashboard', 'lab-2.html', 2.5, 'a')}
  ${pin(3, 482, 84, 'Bob reviews every PR', 'lab-3.html', 2.8)}
  ${pin(4, 330, 262, 'A deck by noon', 'lab-4.html', 3.1)}
</svg>`;
}

export default function home() {
  const hero = `
<section class="hero" aria-labelledby="h1">
  <div class="hero-in">
    <div>
      <h1 id="h1">Smart Branch in a Day</h1>
      <p class="lede">It is Monday morning at the Khon Kaen branch and four things are broken. By the end of the day you will have fixed all four with IBM Bob.</p>
      <div class="cta">
        <a class="btn" href="step-0.html">Start with step 0</a>
        <a class="btn ghost" href="#day">See the day</a>
      </div>
      <ul class="stats">
        <li><b>4 labs</b></li>
        <li><b>4 h 40 min</b> with a 1 h break</li>
        <li><b>1 laptop</b> and a Gmail account</li>
      </ul>
    </div>
    <figure style="margin:0">
      ${plan()}
      <figcaption class="plan-caption">Tap or hover a number. Each one is a problem you fix today.</figcaption>
    </figure>
  </div>
</section>`;

  const sheet = (no, file, title, mins, w, hl, cls = '') => {
    const inner = `<span class="big" aria-hidden="true">${no}</span><span class="t">${title}</span><span class="foot"><span>${mins}</span>${w ? `<b>Sheet ${no}</b>` : ''}</span>`;
    return `<li>${file ? `<a class="sheet ${cls}" href="${file}"${hl ? ` data-hl="${hl}"` : ''}>${inner}</a>` : `<div class="sheet ${cls}">${inner}</div>`}</li>`;
  };

  const body = `
<div class="wrap">
  <section class="band" id="day">
    <h2>The day, in six sheets</h2>
    <ol class="sheets" aria-label="Plan of the day">
      ${sheet('0', 'step-0.html', 'Set up', 'Before the day', false, '', 'pre')}
      ${sheet('1', 'lab-1.html', "Understand Bob's capability", '60 min', true, '1')}
      ${sheet('2', 'lab-2.html', 'Create an app with Bob', '40 min', true, '2')}
      ${sheet('3', 'lab-3.html', 'Bob CLI in GitHub Actions', '60 min', true, '3')}
      ${sheet('–', '', 'Break', '60 min', false, '', 'break')}
      ${sheet('4', 'lab-4.html', 'Bob Desktop', '60 min', true, '4')}
    </ol>
  </section>

  <section class="band">
    <div class="mondays">
      <div class="story">
        <h2>Monday, 7:40 a.m.</h2>
        <p>Khun Somchai runs the Khon Kaen branch. He is made up, and so is all the data you will use today. A real Global House store carries more than 100,000 products. We use 60, so you can see all of them.</p>
        <p>A delivery truck leaves for the branch at 9:00. Nobody can say what is sold out without opening three spreadsheets. Code reaches the main branch with nobody reading it. The sales meeting is at noon and there is no deck.</p>
      </div>
      <ol class="problems" aria-label="The four problems">
        <li data-hl="1"><span class="p">Nobody can say what is low on stock without a spreadsheet</span><span class="s">You teach Bob the store with a mode, a skill and an MCP server. <a href="lab-1.html">Lab 1</a></span></li>
        <li data-hl="2"><span class="p">The branch has no stock screen</span><span class="s">Bob builds a stock dashboard from a one-page spec. <a href="lab-2.html">Lab 2</a></span></li>
        <li data-hl="3"><span class="p">Code reaches main without a second pair of eyes</span><span class="s">A GitHub Action installs Bob CLI and posts a review on every pull request. <a href="lab-3.html">Lab 3</a></span></li>
        <li data-hl="4"><span class="p">The sales meeting needs a deck by noon</span><span class="s">Slides and a data report, made in Bob Desktop. <a href="lab-4.html">Lab 4</a></span></li>
      </ol>
    </div>
  </section>

  <section class="band">
    <h2>How these pages work</h2>
    <ul class="howto">
      <li><b>Tick steps as you go</b><span>Each lab is a list of steps. Tick the circle when a step is done. Your ticks are saved in this browser and counted at the top.</span></li>
      <li><b>Copy, then paste into Bob</b><span>Red-edged cards are prompts for Bob. Dark blocks are code. Both have a Copy button. Reword prompts as you like.</span></li>
      <li><b>Green says what to expect</b><span>If your screen looks different, open the "If it does not work" fold under the step.</span></li>
    </ul>
  </section>

  <section class="start">
    <div><h2>Ready?</h2><p>Step 0 takes about 30 minutes. Please finish it before the day.</p></div>
    <a class="btn" href="step-0.html">Open step 0</a>
  </section>
</div>
<div style="height:72px"></div>`;
  return { id: 'home', title: 'Smart Branch in a Day', hero, body };
}
