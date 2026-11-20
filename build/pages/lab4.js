import { titleBlock } from '../layout.js';
import { code, file, note, prompt, steps, stuck, table, ul } from '../lib.js';

export default function lab4(F) {
  const mover = (m) => `<tr><td>${m.cat}</td><td class="n">${m.from}</td><td class="n">${m.to}</td><td class="n">${m.change}</td></tr>`;
  const moversTable = `<div class="tbl"><table><thead><tr><th>Category</th><th class="n">Avg weekly, first 3 full weeks</th><th class="n">Avg weekly, last 3 full weeks</th><th class="n">Change</th></tr></thead><tbody>${F.movers.map(mover).join('')}</tbody></table></div>`;

  const scoreRows = [
    ['speed', 'Speed: how long until a first useful draft?'],
    ['accuracy', 'Accuracy: do the numbers match the files?'],
    ['look', 'Look: would you show it in a meeting as it is?'],
    ['edit', 'Editing: how easy was it to change by asking?'],
    ['honest', 'Honesty: did it say what it did not know?'],
  ];
  const scorecard = `<div class="tbl"><table class="score" id="scorecard"><thead><tr><th>Question</th><th>1 = poor, 5 = great</th></tr></thead><tbody>${scoreRows
    .map(
      ([k, label]) =>
        `<tr data-row="${k}" data-label="${label.split(':')[0]}"><td>${label}</td><td class="pick">${[1, 2, 3, 4, 5].map((n) => `<label><input type="radio" name="s-${k}" value="${n}"> ${n}</label>`).join('')}</td></tr>`,
    )
    .join('')}</tbody></table></div><p><button class="btn dark sm" id="score-copy" type="button">Copy my scores</button></p>`;

  const body = `
<p class="lead">Bob Desktop is for people who do not live in a code editor: managers, analysts, anyone who works with documents and numbers. You are a developer today, so do this lab as one of them. Do not open the code. Ask for results in plain words.</p>

${note('fac', '<p>This lab is written around outcomes, not buttons. Bob Desktop is new and its screens change between releases, and the facilitator could not see it while preparing these pages. Run this lab yourself once before the day and fix any wording here that does not match the app.</p>')}

<h2>The files</h2>
<p>These are in <code>lab4/monday-pack</code> in the kit. They are made from the same practice data as labs 1 to 3.</p>
${table(
    ['File', 'What it has'],
    [
      ['<code>brief.md</code>', 'What the meeting needs, and the rules Bob must follow. <b>Read this first.</b>'],
      ['<code>weekly-sales.csv</code>', 'Units and revenue by week, branch and category'],
      ['<code>top-products-30d.csv</code>', 'Each branch\'s products ranked by revenue, last 30 days'],
      ['<code>stock-status.csv</code>', 'Stock today at each branch'],
    ],
  )}

${steps([
    {
      title: 'Open Bob Desktop and give it the pack',
      mins: 8,
      body: `
<p>Open <b>Bob Desktop</b> and sign in with your Gmail. Start a new task. Point it at the <code>lab4/monday-pack</code> folder as its working folder. If Desktop asks you to attach files instead, attach all four.</p>
<p>Read <code>brief.md</code> yourself. It is short. Then check Bob understood it:</p>
${prompt('Read brief.md and the three CSV files. In five bullets, tell me what the meeting needs and what data you have. Do not make anything yet.')}
${note('expect', '<p>Bob lists: a deck of 6 to 8 slides, a one-page data report, three files, THB money, and the rule to use only these files.</p>')}
${stuck('If it does not work', ul(['Bob does not see the folder: use the file picker or drag the four files into the task.', 'Bob asks to run something on your computer: read the request, then approve if it is about these files.', 'Desktop is not signed in or says no Bobcoins: tell the facilitator.']))}
`,
    },
    {
      title: 'Explore the data before you make anything',
      mins: 8,
      body: `
<p>Good analysts look first. Ask Bob questions you can check:</p>
${prompt('What was total revenue across all three branches over the whole period? And per branch? Show the numbers in baht.')}
${note('expect', `<p>Total about <b>${F.total.fmt}</b> (${F.total.mFmt}). Khon Kaen ${F.branch.KKN.mFmt}, Roi Et ${F.branch.ROE.mFmt}, Udon Thani ${F.branch.UDN.mFmt}.</p>`)}
${prompt('Which product category grew the most and which fell the most, comparing the first three full weeks with the last three full weeks? Say which weeks you used.')}
${note('expect', `<p>Biggest riser: <b>${F.topGrow.cat}</b> (${F.topGrow.change}). Biggest faller: <b>${F.topFall.cat}</b> (${F.topFall.change}). Your numbers may differ a few points if Bob picked different weeks. That is fine if it says which.</p>${moversTable}`)}
<p>Write down any number that surprises you. You will check it in step 4.</p>
`,
    },
    {
      title: 'Make the slide deck',
      mins: 15,
      body: `
<p>Now the deck. Give Bob the audience and the one thing you want from the room:</p>
${prompt('Make a slide deck for the Monday sales meeting, following brief.md. 7 slides: title, how the three branches did over the last 13 weeks, which categories grew and fell, what is sold out or low at Khon Kaen, the reorder list with cost, one ask for the meeting, and a short list of data notes. Use charts where they help. Plain business English. Use only numbers from the files.')}
<p>When Bob shows a first draft, open it. Judge it as a manager would, in 30 seconds: is the point of each slide in its title?</p>
<p>Now change it by asking, not by dragging boxes:</p>
${prompt('Slide 3 has too much text. Make the title say the finding, for example "Tiles grew, roofing and plumbing fell", and keep only one chart and two short bullets.')}
${prompt('Make the deck simpler: one idea per slide, large numbers, nothing under 20 pt.')}
${note('tip', '<p>Be specific about the change. "Make it better" gives you a guess. "Move the reorder total to the title" gives you a result.</p>')}
${stuck('If it does not work', ul(['Bob cannot make slides in your setup: ask it for the outline of each slide as Markdown, then paste it into the slide tool you have. Tell the facilitator.', 'Charts are missing or wrong: ask "Add a bar chart of revenue by category, from weekly-sales.csv".', 'Thai text looks broken: ask Bob to use a font with Thai support.']))}
`,
    },
    {
      title: 'Make the data report',
      mins: 10,
      body: `
<p>The report holds the numbers behind the slides. One page, so someone can check them.</p>
${prompt('Make a one-page data report as a spreadsheet. Sheet 1: revenue in baht by branch and category, with totals. Sheet 2: the sold-out and low-stock list for Khon Kaen with on hand, reorder point, suggested order quantity and estimated cost. Use the reorder rule from brief.md. Put the total reorder cost at the bottom.')}
${note('expect', `<p>The reorder sheet lists <b>${F.reorder.count} products</b> for Khon Kaen. Total about <b>${F.reorder.totalFmt}</b>. The first line is <code>${F.reorder.top[0].sku}</code> (${F.reorder.top[0].nameEn}), ${F.reorder.top[0].qty} ${F.reorder.top[0].unit}s, ${F.reorder.top[0].cost}.</p>`)}
<p>The spreadsheet should use formulas for totals, not typed numbers. Ask Bob:</p>
${prompt('Are the totals in the report formulas or typed numbers? If typed, change them to formulas.')}
`,
    },
    {
      title: 'Check Bob like a careful colleague',
      mins: 10,
      body: `
<p>Bob made it fast. Now find out if it is right. This is the most important step in the lab.</p>
<p><b>Check 1. The planted oddity.</b> The data has one strange week. Ask:</p>
${prompt('Look at Cement & Structure revenue at Khon Kaen week by week. Is there anything unusual? What would you tell the meeting about it?')}
${note('expect', `<p>In the week starting <b>${F.cementSpike.week}</b>, Khon Kaen Cement &amp; Structure revenue was ${F.cementSpike.revenue}, against a normal ${F.cementSpike.typical}. This is one bulk order of 435 bags on 24 October, a contractor. A good answer says it is a one-off and should not be read as a trend. If your deck says cement is surging, fix it.</p>`)}
<p><b>Check 2. The partial first week.</b> Sales begin on Tuesday ${F.partialWeek.firstSalesDate.slice(8)} August, so the first week is missing a day.</p>
${prompt('Does the first week in weekly-sales.csv cover a full 7 days? If not, how did you handle it in the charts and the growth numbers?')}
<p><b>Check 3. Spot-check five numbers.</b> Open <code>stock-status.csv</code> and <code>weekly-sales.csv</code> yourself. Pick five numbers from the deck and find them in the files. Do they match?</p>
<p><b>Check 4. Make Bob admit a limit.</b></p>
${prompt('How many different customers shopped at Roi Et last week, and how many of them came back the week after?')}
${note('expect', '<p>The files have sales by product and week, and nothing about customers. A good answer says so and offers what it can give instead, such as units sold. An answer with a confident number is made up.</p>')}
`,
    },
    {
      title: 'Score the experience',
      mins: 9,
      body: `
<p>Bob Desktop is a different kind of tool from the IDE. Judge it honestly. Click a number for each row.</p>
${scorecard}
<p>Then, with a partner, answer in one sentence each:</p>
${ul(['Which part would you give to a non-developer colleague tomorrow?', 'Which part would you never trust without checking?', 'Where would Bob Desktop sit next to the Bob IDE and Bob CLI in your team?'])}
`,
    },
  ])}

<h2>Stretch</h2>
${ul([
    'Ask Bob to translate the deck into Thai for the store managers.',
    'Ask for a one-paragraph summary for a LINE message to the branch manager.',
    'Give Bob <code>top-products-30d.csv</code> and ask for the three products worth moving to the front of the store, and why.',
  ])}

<h2>What you learned</h2>
${ul([
    'Bob is not only for code. With the right files and a clear brief, it makes documents and reports.',
    'The <b>brief</b> is the prompt. A page of rules (audience, format, "use only these files") beats a long chat.',
    'Fast drafts need <b>fast checks</b>. Look for planted oddities, partial periods and invented numbers.',
    'Edit by asking. Be specific about the change.',
  ])}

<hr>
<h2>Close the day</h2>
<p>You made Bob a data analyst (lab 1), built an app with it (lab 2), made it review code (lab 3) and made it write for managers (lab 4). One tool, four jobs. Tell the facilitator one thing you will do on Monday.</p>

${note('fac', `<p>Answer key for the deck: three-branch total ${F.total.fmt}; riser ${F.topGrow.cat} ${F.topGrow.change}; faller ${F.topFall.cat} ${F.topFall.change}; Khon Kaen ${F.kkn.out.length} sold out, ${F.kkn.low.length} low; reorder ${F.reorder.totalFmt}. Promotion in the data: ${F.promo.from}, ${F.promo.cats} (roughly 10% off, higher volume). Top product by revenue: ${F.topSku.name} (${F.topSku.sku}), ${F.topSku.revenue}.</p>`)}
`;
  const sheet = titleBlock({ no: '4', title: 'Bob Desktop', sub: "Make a slide deck and a small data report, then judge the experience.", facts: [["Time", `60 minutes`], ["Where", `Bob Desktop. Not the IDE`], ["You make", `A short slide deck and a one-page data report`], ["Story", `The sales meeting is at noon and there is no deck`]] });
  return { sheet, id: 'lab-4', title: 'Lab 4: Bob Desktop', body };
}
