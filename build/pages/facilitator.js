import { titleBlock } from '../layout.js';
import { note, table, ul } from '../lib.js';

export default function facilitator(F) {
  const body = `
<p class="lead">This is the one page participants do not need. Read it before the day, then do the dry run.</p>

<h2>Run sheet</h2>
${table(
    ['Time', 'Block', 'Say and do'],
    [
      ['Before', 'Step 0', 'Send <a href="step-0.html">step 0</a> one week before. Ask people to register for the trial <b>in the week of the workshop</b>, because the trial lasts 30 days. Ask for a screenshot of <code>npm run setup</code> ending with "All good".'],
      ['0:00 (10 min)', 'Welcome (not in the agenda: drop it if you are short)', 'Show the <a href="index.html">home page</a>. Tell the Monday story in two minutes. Ask who has already used an AI coding tool.'],
      ['0:10 (60 min)', '<a href="lab-1.html">Lab 1</a>', 'Mode, skill, MCP. The moment to wait for: step 7, when the answer changes from a guess to the exact list. Let people feel the difference before you explain it.'],
      ['1:10 (40 min)', '<a href="lab-2.html">Lab 2</a>', 'Tight. Walk the room during steps 3 and 4. If someone is behind at minute 25, give them <code>lab2/solution</code> and move them to step 5.'],
      ['1:50 (60 min)', '<a href="lab-3.html">Lab 3</a>', 'Highest risk. Put the key-creation step on the screen. Show the workflow once, slowly. Everyone starts from <code>lab3/repo</code>.'],
      ['2:50 (60 min)', 'Break', 'Use the break to look at who has a red Action run, and fix them one by one.'],
      ['3:50 (60 min)', '<a href="lab-4.html">Lab 4</a>', 'Tell people to be a manager, not a developer. Collect the scorecards in the last 5 minutes.'],
      ['4:50', 'Close', 'One thing each person will do on Monday.'],
    ],
  )}

<h2>Risks, in order</h2>
${table(
    ['Risk', 'Why', 'What to do'],
    [
      ['Cannot create an API key on a trial account', 'The Bob docs say API keys are available for trial users. Nobody has tested it for this workshop.', '<b>Test it first.</b> If it fails, create one key on a paid or admin account, share it only in the room, and revoke it that evening. Do not post it in chat history that stays.'],
      ['Bobcoins run out', 'The trial has 50 per person. Lab 3 spends about 3 reviews. Labs 1, 2 and 4 spend more, and their cost is not known.', 'Dry-run all labs and watch the balance. Tell people which labs are heavy. Ask for a second trial on another Gmail only as a last resort.'],
      ['Bob Desktop installer', 'The Drive folder holds an Insiders pre-release build, <code>1.126.0+bob2.4.0-insider.1</code>, for Mac (Apple silicon and Intel), Windows and Linux. A pre-release can change or break between now and the day.', 'Download the right file for every laptop in the room before the day. Keep copies on a USB drive. Re-check the folder the week before: the file names or versions may change.'],
      ['Corporate network blocks npm or GitHub Actions', 'Labs need <code>registry.npmjs.org</code>, GitHub, and <code>bob.ibm.com</code>.', 'Test on the venue network. Have a phone hotspot.'],
      ['Bob output differs between people', 'Models vary. Every review is different.', 'The pages say what to expect in general ("finds most of these"), never exact text. Say it out loud.'],
      ['Browser says "Access to the file was denied"', 'macOS protects Documents, Desktop and Downloads. A browser without permission for that folder cannot open pages from it, even though the files are fine.', 'Serve the pages instead: <code>node build/serve.js</code>, then open <code>http://localhost:4173</code>. Or move the folder out of Documents, or allow the browser under System Settings, Privacy &amp; Security, Files and Folders.'],
      ['Workflow on a private repo uses Actions minutes', 'Free accounts have a monthly limit. This lab uses about 10 minutes per person.', 'Fine for one day. Mention it.'],
    ],
  )}

<h2>Dry-run checklist</h2>
<p>Do all of this once, on a clean laptop, a few days before. Nobody could do these steps while the pages were being written, so each one is a guess until you try it.</p>
${table(
    ['', 'Check', 'If it fails'],
    [
      ['☐', 'Register at bob.ibm.com/trial with a Gmail account. Note the Bobcoins you start with.', 'Change step 1'],
      ['☐', 'Install Bob Desktop from the Drive folder on each kind of laptop in the room (Apple silicon, Intel, Windows). Sign in.', 'Change step 2, or share a different build'],
      ['☐', 'Create an <b>Inference</b> API key on the trial account.', 'Lab 3 needs the plan above'],
      ['☐', 'Lab 1 step 3: the skill shows in settings. Step 5: the mode shows in the picker. Step 6: the MCP server shows as connected with 4 tools.', 'Fix the wording of the step. Settings screens may use other names'],
      ['☐', 'Lab 1 step 7: Bob lists exactly the sold-out and low items shown on the page.', 'Check <code>.bob/mcp.json</code> paths'],
      ['☐', 'Lab 2: build with Bob in about 40 minutes. Note how long it really takes.', 'Cut steps or give more of the starter'],
      ['☐', 'Lab 3, the whole thing, on a fresh GitHub account. The Action goes green and the bad PR gets a comment.', 'See the lab 3 troubleshooting folds'],
      ['☐', 'Lab 3: one review finishes under the cost cap. <code>--max-cost 1</code> in the workflow is a guess. If the comment says "Bob did not finish" and the log shows a cost-limit message, raise <code>BOB_MAX_COST</code> to 2 in <code>lab3/ci/bob-review.yml</code> and rebuild.', 'Raise the cap'],
      ['☐', 'Lab 3: the second push <b>edits</b> the comment and does not add another.', '<code>gh pr comment --edit-last</code> needs a recent GitHub CLI. Runners have one'],
      ['☐', 'Lab 4: Bob Desktop makes slides and a spreadsheet from the pack. Note which output formats it offers.', 'Rewrite lab 4 steps 3 and 4 to match'],
      ['☐', 'Total Bobcoins used for one person doing everything.', 'Decide if 50 is enough'],
    ],
  )}

<h2>Things in these pages that come from Bob's own documentation, not from a test</h2>
${ul([
    'The flags used by <code>bob run</code> (<code>--mode</code>, <code>--format json</code>, <code>--max-cost</code>, <code>--max-turns</code>, <code>--disable-tool-groups</code>, <code>--trust</code>, <code>--accept-license</code>) exist in Bob Shell 2.1.0 and were checked with <code>bob run --help</code>. How they behave with a live key was not tested.',
    'The JSON result has the fields <code>status</code>, <code>last_message</code> and <code>stats.session_costs</code>. This comes from the Bob Shell source and from IBM\'s documentation. Check it in the dry run. If the field names differ, change <code>post-review.js</code> and its tests.',
    'The reviewer reads <code>pr.diff</code> from disk. If it does not find the file in your dry run, change the prompt in the workflow.',
    'The "read-only" claim rests on the <code>read</code> group in the mode and on <code>--disable-tool-groups</code>. Both are in IBM\'s documentation.',
  ])}

<h2>What was tested</h2>
${table(
    ['Part', 'How'],
    [
      ['Data generator', 'Run from a clean folder. Same output every time. Planted stories checked: 4 sold out, 8 low, 4 overstock at Khon Kaen.'],
      ['MCP server', 'Started over real STDIO and called with the MCP SDK client. 8 tests.'],
      ['Reference app', '11 API tests. The lab 3 repository copy runs its own tests too.'],
      ['Comment script', '7 tests, including empty output, garbage output and error status.'],
      ['Workflow', 'YAML parses. Each step\'s shell logic was run locally with a stand-in for <code>bob</code>. It has <b>not</b> run on GitHub.'],
      ['Numbers on these pages', 'Computed from the dataset when the pages are built, so they cannot drift.'],
    ],
  )}
${note('warn', '<p>Nothing that talks to Bob\'s servers was run: no login, no API key, no model call. That is what the dry run is for.</p>')}

<h2>Rebuilding the pages</h2>
<p>The pages are generated from the kit, so the code on the pages is always the code that was tested.</p>
${ul(['<code>node build/build.js</code> rebuilds the HTML and the zip.', 'To change the data, edit <code>kit/scripts/catalog.js</code> or <code>seed.js</code>, run <code>npm run setup</code> in <code>kit</code>, then rebuild. All numbers on these pages update.'])}
`;
  const sheet = titleBlock({ no: 'F', title: 'Facilitator guide', sub: 'Run sheet, risks, and a dry-run checklist. Participants do not need this page.', facts: [['Read', 'Before the day'], ['Do', 'The dry run, a few days ahead'], ['Why', 'Nothing that talks to Bob could be tested while these pages were written']] });
  return { sheet, id: 'facilitator', title: 'Facilitator guide', body };
}
