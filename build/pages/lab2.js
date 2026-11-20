import { titleBlock } from '../layout.js';
import { code, file, note, prompt, steps, stuck, table, ul } from '../lib.js';

export default function lab2(F) {
  const body = `
<p class="lead">Khun Somchai opens one page every morning to see what needs ordering. You will not write this by hand. You will plan it with Bob, let Bob build it, and then check what Bob built.</p>
${note('tip', '<p>40 minutes is tight on purpose. The starter already has the data loader and a server that says hello. Bob builds the rest. Step 3 and 4 are what matter. Do not polish.</p>')}

${steps([
    {
      title: 'Open the starter and read the spec',
      mins: 4,
      body: `
<p>In the Bob IDE, <b>File, Open Folder</b>, and open <code>lab2/starter</code>. Then run it once, in a terminal inside that folder:</p>
${code('npm install\nnpm start', 'terminal, inside lab2/starter')}
<p>Open <a href="http://localhost:3000/api/health">http://localhost:3000/api/health</a>. You should see <code>{"ok":true,"asOf":"2026-11-16"}</code>. Stop the server with <kbd>Ctrl</kbd>+<kbd>C</kbd>.</p>
<p>Now read <code>SPEC.md</code> and <code>AGENTS.md</code>. The spec says what to build. <code>AGENTS.md</code> holds rules Bob follows in every task in this folder. The lab 1 skill is also here, in <code>.bob/skills/</code>.</p>
${stuck('If it does not work', ul(['<code>EADDRINUSE</code>: something else uses port 3000. Run <code>PORT=3001 npm start</code> on Mac or Linux, or <code>set PORT=3001 &amp;&amp; npm start</code> on Windows, and use 3001 below.', '<code>Cannot find module</code>: run <code>npm install</code> inside <code>lab2/starter</code>.', 'Skipped lab 1? Nothing to do. The skill is already in the starter folder.']))}
`,
    },
    {
      title: 'Plan first, in Plan mode',
      mins: 8,
      body: `
<p>Switch to <b>Plan</b> mode. Plan mode can read your files and write only text files. It cannot change code, so it is a safe place to think.</p>
${prompt('Read SPEC.md, AGENTS.md and data/SCHEMA.md. Make a plan to build the stock dashboard: which files you will create or change, in what order, and how we will test it. Keep it to 10 lines. Do not write code yet.', 'Plan mode')}
<p>Read Bob's plan. Check three things:</p>
${ul(['Does it build the API <b>before</b> the page?', 'Does it put the status rules (out, low, over, ok) in one function, not copy them around?', 'Does it say how to check the result?'])}
<p>If something is off, say so: "Put the status rules in <code>src/data.js</code>, and add a test for them." Plans are cheap to fix. Code is not.</p>
`,
    },
    {
      title: 'Build the API in Agent mode',
      mins: 10,
      body: `
<p>Switch to <b>Agent</b> mode. Ask for the API first, with tests. Then the page.</p>
${prompt('Follow the plan. Build the API only: GET /api/branches, GET /api/stock, GET /api/stock/summary, as described in SPEC.md. Put the status logic in src/data.js. Add node:test tests in test/api.test.js. Run npm test and fix any failures. Do not build the web page yet.', 'Agent mode')}
<p>Bob will ask to approve commands, such as <code>npm test</code>. Read each one, then approve. This is the approval workflow. It is the default, and it is how you stay in control.</p>
${note('expect', `<p>Bob reports passing tests. Then you check it yourself. Start the server and open <a href="http://localhost:3000/api/stock/summary?branch=KKN">/api/stock/summary?branch=KKN</a>. You should see <code>"out": ${F.kkn.out.length}</code>, <code>"low": ${F.kkn.low.length}</code>, <code>"over": ${F.kkn.over.length}</code>.</p>`)}
${table(
    ['Check this URL', 'You should see'],
    [
      ['<code>/api/stock?branch=KKN&amp;status=out</code>', `${F.kkn.out.length} products, all with <code>onHand: 0</code>`],
      ['<code>/api/stock?branch=BKK</code>', 'HTTP 400 and a message that says to use KKN, ROE or UDN'],
      ['<code>/api/stock?q=hose</code>', 'The garden hose (<code>GH-GRD-1001</code>)'],
      ['<code>/api/stock?q=ปูน</code>', `${F.thaiSearchPun} products, searched in Thai`],
    ],
  )}
${stuck('If it does not work', ul(['Counts are different: ask Bob "Which rule order did you use for status? Compare it to SPEC.md, section Status rules." The order matters: out, then low, then over.', 'Tests pass but a URL fails: tests only cover what they test. Tell Bob the URL and what you saw.', 'Stuck for more than 5 minutes: the finished API is in <code>lab2/solution/src/server.js</code>. Read it, then continue.']))}
`,
    },
    {
      title: 'Build the page',
      mins: 10,
      body: `
<p>Now the page. Be specific about what it shows. Bob does better with a clear picture.</p>
${prompt('Now build public/index.html as one file with vanilla JavaScript, no framework. Show: a branch picker, summary tiles (products, sold out, low, overstock, stock value in baht), status filter chips, a search box that works in English and Thai, and a table with name in English and Thai, SKU, status badge, on hand, reorder point, days of cover. Colour sold out red, low amber, overstock blue, OK green. Handle API errors by showing the message. Keep it simple.', 'Agent mode')}
<p>Open <a href="http://localhost:3000">http://localhost:3000</a>. Switch to Roi Et and Udon Thani. Filter by "Sold out". Search for <code>ปูน</code>.</p>
${note('expect', `<p>Khon Kaen shows ${F.kkn.out.length} sold out and ${F.kkn.low.length} low. Stock value is <b>${F.kkn.stockValueFmt}</b>. Roi Et shows 0 sold out and ${F.stockByBranch.ROE.low} low.</p>`)}
${note('tip', '<p>Something looks off? Do not edit the code. Tell Bob what you see: "The Thai names are cut off" or "The badges are hard to read". Describe the problem, not the fix.</p>')}
`,
    },
    {
      title: 'Check what Bob built',
      mins: 5,
      body: `
<p>AI code needs a human check. Switch to <b>Ask</b> mode and review the work:</p>
${prompt('Review src/server.js and public/index.html for problems: unvalidated query parameters, status rules written in more than one place, user text put into the page without escaping, missing error handling. List what you find with file and line. Do not change anything.', 'Ask mode')}
<p>Pick one finding and ask Agent mode to fix it. This is the habit to keep: build, review, fix. Lab 3 automates the review step.</p>
`,
    },
    {
      title: 'Stretch: reorder suggestions',
      mins: 3,
      body: `
<p>Done early? Add the "Suggest reorder" button from the spec.</p>
${prompt('Add GET /api/reorder as described in SPEC.md, with tests, and a Suggest reorder button on the page that shows the list and the total estimated cost in baht.', 'Agent mode')}
${note('expect', `<p>For Khon Kaen: <b>${F.reorder.count} products</b> to order, estimated total <b>${F.reorder.totalFmt}</b>. Check the first line: <code>${F.reorder.top[0].sku}</code>, ${F.reorder.top[0].qty} ${F.reorder.top[0].unit}s, ${F.reorder.top[0].cost}.</p>`)}
`,
    },
  ])}

<h2>Keep your app for lab 3</h2>
<p>Lab 3 puts this app on GitHub. Make sure <code>npm test</code> passes in <code>lab2/starter</code>. If your app is a mess, no problem: lab 3 has a finished copy in <code>lab3/repo</code>.</p>

<h2>What you learned</h2>
${ul(['<b>Plan</b> before you build. A bad plan is a ten-second fix.', 'Ask for the <b>API and tests first</b>, then the page. Small steps give small mistakes.', '<code>AGENTS.md</code> and skills give Bob the rules once, so you do not repeat them in every prompt.', 'Always <b>check the result</b> against numbers you know. Passing tests are not proof.'])}

${note('fac', `<p>The finished app is in <code>lab2/solution</code> and runs with <code>npm run app</code> from the kit folder. If a participant is behind at minute 25, give them the solution and let them skip to step 5.</p><p>Expected counts for the check: Khon Kaen out ${F.stockByBranch.KKN.out}, low ${F.stockByBranch.KKN.low}, over ${F.stockByBranch.KKN.over}. Roi Et out ${F.stockByBranch.ROE.out}, low ${F.stockByBranch.ROE.low}, over ${F.stockByBranch.ROE.over}. Udon Thani out ${F.stockByBranch.UDN.out}, low ${F.stockByBranch.UDN.low}, over ${F.stockByBranch.UDN.over}.</p>`)}
`;
  const sheet = titleBlock({ no: '2', title: 'Create an app with Bob', sub: "Learn how to implement a web app with Bob.", facts: [["Time", `40 minutes`], ["Where", `Bob IDE, the lab2/starter folder`], ["You build", `A stock dashboard with an API and a web page`], ["Done when", `Khon Kaen shows ${F.kkn.out.length} sold-out products`]] });
  return { sheet, id: 'lab-2', title: 'Lab 2: Create an app with Bob', body };
}
