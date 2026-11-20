import { titleBlock } from '../layout.js';
import { code, file, note, prompt, steps, stuck, table, ul } from '../lib.js';

export default function lab1(F) {
  const mcpJson = `{
  "mcpServers": {
    "ghh-inventory": {
      "command": "/path/to/node",
      "args": ["/path/to/kit/lab1/mcp/inventory-server.js"],
      "alwaysAllow": ["get_low_stock", "get_product", "get_sales_summary", "suggest_reorder"],
      "disabled": false
    }
  }
}`;

  const body = `
<p class="lead">Bob is only as useful as the context it has. In this lab you give it three kinds: a <b>skill</b> (how we write code), a <b>mode</b> (who Bob is for this job) and an <b>MCP server</b> (live access to our stock data). You will ask the same question before and after, and see the difference.</p>

${table(
    ['Piece', 'What it is', 'Where it lives'],
    [
      ['Mode', 'A role for Bob: what it is, which tools it may use, how it should answer', 'Created in <b>Settings, Modes</b>'],
      ['Skill', 'A reusable set of instructions Bob follows when the task matches', '<code>.bob/skills/&lt;name&gt;/SKILL.md</code>'],
      ['MCP server', 'A small program that gives Bob new tools, here: read our stock and sales', '<code>.bob/mcp.json</code>, added from <b>Settings, MCP</b>'],
    ],
  )}

${steps([
    {
      title: 'Open the kit folder and add the skill',
      mins: 8,
      body: `
<p>In the Bob IDE, open the <b>kit folder</b> (the one with <code>package.json</code> in it).</p>
<p>A skill is a folder with a <code>SKILL.md</code>. The top part says what it is for. The rest is the instructions. Bob decides when to use it from the description, so the description says when to use it.</p>
<p>The skill is already written. It is in the kit at <code>answers/lab1/skills/ghh-coding-standard</code>. Copy that whole folder into <code>.bob/skills/</code> in the kit folder (make <code>.bob/skills/</code> if it is not there), so you end up with:</p>
${code('.bob/skills/ghh-coding-standard/SKILL.md\n.bob/skills/ghh-coding-standard/sku-format.md', 'in the kit folder')}
<p>Read it first. This is what Bob will follow:</p>
${stuck('Show SKILL.md', code(file('answers/lab1/skills/ghh-coding-standard/SKILL.md'), '.bob/skills/ghh-coding-standard/SKILL.md'))}
${stuck('Show sku-format.md (Bob reads it only when it needs it)', code(file('answers/lab1/skills/ghh-coding-standard/sku-format.md'), '.bob/skills/ghh-coding-standard/sku-format.md'))}
${note('tip', '<p>Do not look for the skill in Bob yet. Create the custom mode in step 2, then reopen Bob <b>once</b> in step 3. That one reopen loads both.</p><p><b>If you cannot see the skill you added, reopen Bob.</b> Quit it completely (closing the window is not enough), start it again, and look in the <b>Skills</b> tab.</p>')}
`,
    },
    {
      title: 'Create the custom mode in Bob settings',
      mins: 8,
      body: `
<p>A mode sets a role, picks which tools Bob may use, and adds its own instructions. You create this one in the settings, with no file to copy.</p>
<ol>
  <li>In the Bob panel, click the <b>settings</b> icon and open the <b>Modes</b> tab.</li>
  <li>Click the button to create a new mode. The form is titled <b>Create new mode</b>.</li>
  <li>Fill it in with the values below.</li>
  <li>Click <b>Save</b>.</li>
</ol>
${table(
    ['Field', 'What to enter'],
    [
      ['Slug', '<code>ghh-data-analyst</code>'],
      ['Name', '<code>GHH Data Analyst</code>'],
      ['Description', '<code class="wrap">Answers stock and sales questions for Global House branches and writes short reports.</code>'],
      ['Scope', 'The workspace (this kit folder), not Global'],
      ['Role definition', 'Paste the first block below'],
      ['When to use', '<code class="wrap">Use this mode for questions about stock levels, reorders and sales at a Global House branch.</code>'],
      ['Mode-specific Custom Instructions', 'Paste the second block below'],
      ['Available Tools', 'Switch on <b>Read</b>, <b>Edit</b>, <b>MCP</b> and <b>Skill</b>. Leave the others off'],
    ],
  )}
<p>Role definition:</p>
${prompt('You are a data analyst for Siam Global House, a Thai home-improvement retailer. You answer questions about branch stock and sales using the ghh-inventory MCP tools, never from memory. You show money in Thai baht as ฿1,234.50. You answer in the language the user writes in, and you keep product names in both English and Thai when you list products.', 'Role definition')}
<p>Mode-specific Custom Instructions:</p>
${prompt('Always call a ghh-inventory tool before stating any stock or sales number.\nIf a tool returns an error, show the error text and ask the user what to change.\nDo not guess a branch. If the user does not name one, ask which of KKN, ROE or UDN.\nWhen you write a report, save it as Markdown under reports/ and start it with the data date.\nOnly create or edit Markdown files under reports/. Refuse any other edit and say why.\nKeep answers short: a one-line finding first, then a small table or list.', 'Custom instructions')}
${note('tip', '<p>Bob saves the mode as a YAML file for you. You never touch it. The form has no field to lock editing to the <code>reports/</code> folder, so this mode keeps to reports because its instructions say so. That is a polite limit, not a hard one. The kit has the strict version in <code>answers/lab1/custom_modes.yaml</code> if you want to compare.</p>')}
${stuck('If it does not work', ul(['The slug is rejected: use lowercase letters, numbers and dashes only.', 'You cannot find the create button: open the <b>Modes</b> tab and look near the search box.', 'You would rather paste a file: copy <code>answers/lab1/custom_modes.yaml</code> to <code>.bob/custom_modes.yaml</code> in the kit folder. That version also locks editing to <code>reports/</code> files.']))}
`,
    },
    {
      title: 'Reopen Bob once, then check the skill and the mode',
      mins: 5,
      body: `
<p>Bob loads new skills and modes when it starts. You added both before this step, so you reopen Bob <b>one time</b>.</p>
<ol>
  <li>Save everything. Quit Bob completely, then open it again and open the kit folder.</li>
  <li>Open Bob settings and the <b>Skills</b> tab. Check <code>ghh-coding-standard</code> is listed.</li>
  <li>Open the mode picker. Check <b>GHH Data Analyst</b> is there.</li>
</ol>
${note('expect', '<p>The skill is listed in the <b>Skills</b> tab and the new mode is in the picker.</p>')}
${note('warn', '<p><b>Cannot see the skill?</b> Reopen Bob. Quit it completely (closing the window is not enough), start it again, then look in the <b>Skills</b> tab once more.</p>')}
${stuck('If something is still missing', ul(['Skill still not listed: the folder must be inside <code>.bob/skills/</code> in the folder you opened, and the file must be named exactly <code>SKILL.md</code>. Its first line must be <code>---</code>.', 'Mode missing: open the <b>Modes</b> tab and check it was saved and its scope is this workspace. You must have opened the kit folder.', 'By default Bob asks before using a skill. That is expected. Approve it.']))}
`,
    },
    {
      title: 'Meet the built-in modes, then ask a plain question',
      mins: 10,
      body: `
<p>Open the Bob chat and look at the mode picker.</p>
${ul(['<b>Ask</b>: answers questions. Changes nothing.', '<b>Plan</b>: designs the work and writes plans. Edits only text files.', '<b>Agent</b>: reads, edits and runs commands to finish a task.'])}
<p>Try Ask first:</p>
${prompt('What does the data/ folder contain? Which files would I read to find products that are running out of stock at Khon Kaen?', 'Ask mode')}
${note('expect', '<p>Bob lists the four data files and points at <code>stock.json</code> (stock levels) and <code>products.json</code> (names).</p>')}
<p>Now the real question, with no stock server connected yet. Stay in <b>Ask</b> mode:</p>
${prompt('Which products are sold out or low on stock at Khon Kaen (KKN)? Give me SKU and English name, as a short list.', 'Ask mode')}
<p>Bob will open files and work it out. Write down: how long it took, how many files it opened, and the answer. You will compare in step 8.</p>
${note('tip', '<p>"Low" means <code>onHand</code> is at or below <code>reorderPoint</code>. Bob does not know that rule yet, so it may guess a different one. That is the problem tools solve.</p>')}
`,
    },
    {
      title: 'Test the skill',
      mins: 6,
      body: `
<p>Switch to Agent mode. Ask for code that touches money and stock:</p>
${prompt('Write a small JavaScript module lib/reserve.js with two functions: formatPrice(amount) for showing a product price, and reserveStock(onHand, qty) that returns the new stock level. Do not run anything. Just write the file.', 'Agent mode')}
${note('expect', '<ul><li><code>formatPrice(1234.5)</code> gives <code>฿1,234.50</code>, not <code>$</code>.</li><li><code>reserveStock</code> refuses a quantity larger than stock instead of going negative.</li><li>Bob says it used the skill and lists the rules it applied.</li></ul>')}
${stuck('If Bob does not use the skill', ul(['Reopen Bob. Quit it completely, start it again, and check the <b>Skills</b> tab lists <code>ghh-coding-standard</code>. A skill added while Bob was running is only picked up on the next start.', 'By default Bob asks before using a skill. Approve it when it asks.', 'Still nothing: ask "Which skills do you have available?" and check the answer includes <code>ghh-coding-standard</code>.']))}
`,
    },
    {
      title: 'Connect the MCP server',
      mins: 10,
      body: `
<p>The kit has a small MCP server in <code>lab1/mcp/inventory-server.js</code>. It gives Bob four read-only tools:</p>
${table(['Tool', 'Answers'], [['<code>get_low_stock</code>', 'What is low or sold out at a branch?'], ['<code>get_product</code>', 'Price and stock of one product, by SKU or by name in English or Thai'], ['<code>get_sales_summary</code>', 'Revenue and top products over the last N days'], ['<code>suggest_reorder</code>', 'How much to order, and what it costs']])}
<p>Bob needs to know how to start it. Generate the config for your laptop, with the right folder paths filled in:</p>
${code('npm run mcp:config -- --write', 'terminal, inside the kit folder')}
<p>This writes <code>.bob/mcp.json</code>. It looks like this (your paths will differ):</p>
${code(mcpJson, '.bob/mcp.json')}
<p>Now open Bob settings, go to <b>MCP</b>, and check <code>ghh-inventory</code> is listed and connected with four tools.</p>
${note('expect', '<p>The server shows as connected, with <code>get_low_stock</code>, <code>get_product</code>, <code>get_sales_summary</code> and <code>suggest_reorder</code> listed.</p>')}
${note('warn', '<p>The server talks to Bob over standard output. If you edit it, never use <code>console.log</code> in it. Use <code>console.error</code>. A stray <code>console.log</code> breaks the connection.</p>')}
${stuck('If it does not work', ul(['Listed but not connected: click <b>Restart server</b> next to it in the <b>MCP</b> tab.', 'Not connected: run <code>node lab1/mcp/inventory-server.js</code> in a terminal. It should print <code>ghh-inventory MCP server ready</code> and wait. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop. If it crashes, run <code>npm install</code>.', 'Connected but no tools: open the server in settings and check no tool is switched off.', 'Another way to add it: <code>bob mcp add</code> exists in Bob CLI, but the file above is simpler.']))}
`,
    },
    {
      title: 'Ask again with the mode and the tools',
      mins: 9,
      body: `
<p>Pick <b>GHH Data Analyst</b> in the mode picker and ask the same question as in step 4:</p>
${prompt('Which products are sold out or low on stock at Khon Kaen?', 'GHH Data Analyst mode')}
${note('expect', `<ul><li>Bob calls <code>get_low_stock</code> with branch <code>KKN</code>. It does not open data files.</li><li><b>${F.kkn.out.length} sold out</b>: ${F.kkn.out.map((r) => `<code>${r.sku}</code>`).join(', ')}.</li><li><b>${F.kkn.low.length} low</b>: ${F.kkn.low.map((r) => `<code>${r.sku}</code>`).join(', ')}.</li></ul>`)}
<p>Now go further:</p>
${prompt('What should Khun Somchai order before the 9:00 truck? Use the reorder tool and put the answer in a table with SKU, name, quantity and cost in baht.', 'GHH Data Analyst mode')}
${note('expect', `<p>${F.reorder.count} products to order, about <b>${F.reorder.totalFmt}</b> in total. The biggest line is <code>${F.reorder.top[0].sku}</code> (${F.reorder.top[0].nameEn}), ${F.reorder.top[0].qty} ${F.reorder.top[0].unit}s for ${F.reorder.top[0].cost}.</p>`)}
<p>Try the Thai search, and a branch that does not exist:</p>
${prompt('ค้นหาสินค้า ปูนซีเมนต์ ดูสต็อกทุกสาขา', 'GHH Data Analyst mode')}
${prompt('What is low on stock at the Bangkok branch?', 'GHH Data Analyst mode')}
${note('expect', '<p>The first finds <code>GH-CEM-1001</code> and shows stock for all three branches. The second does not make up an answer. Either Bob asks which of KKN, ROE or UDN you mean, or the tool rejects the branch and Bob shows you that error.</p>')}
`,
    },
    {
      title: 'Write the report, then compare',
      mins: 4,
      body: `
<p>Ask the mode for a file:</p>
${prompt('Write a one-page report for Khun Somchai: what is sold out, what is low, and the reorder list with the total cost. Save it as reports/khon-kaen-reorder.md.', 'GHH Data Analyst mode')}
<p>The file lands in <code>reports/</code>. Now try to make the mode go outside its job:</p>
${prompt('Also fix a typo in package.json.', 'GHH Data Analyst mode')}
${note('expect', '<p>Bob should refuse and say it only writes reports. A mode made in the form holds back because of its instructions. A mode loaded from the YAML file cannot edit <code>package.json</code> at all.</p>')}
<p>Compare with step 4:</p>
${table(['', 'Step 4: plain Ask', 'Step 7: mode + skill + MCP'], [['Where the numbers come from', 'Bob read files and guessed the rules', 'A tool that applies the real rules'], ['Money format', 'Whatever Bob picked', '฿ with two decimals, from the skill and mode'], ['Can it change code?', 'No (Ask)', 'Reports only, by its instructions']])}
`,
    },
  ])}

<h2>What you learned</h2>
${ul(['A <b>skill</b> teaches Bob how your team works. Write it once, every task benefits.', 'A <b>mode</b> sets a role and hard limits on tools and files.', 'An <b>MCP server</b> gives Bob live data and actions. Good descriptions on the tools matter, because Bob picks tools by reading them.', 'MCP servers run code on your laptop. Only add ones you trust, and read what they do.'])}
<p>Next: <a href="lab-2.html">Lab 2, build the stock dashboard</a>. The skill goes with you.</p>
`;
  const sheet = titleBlock({ no: '1', title: "Understand Bob's capability", sub: "Learn how to use MCP, skills and modes on Bob.", facts: [["Time", `60 minutes`], ["Where", `Bob IDE, with the kit folder open`], ["You build", `A skill, a mode and an MCP server connection`], ["Question", `What does Khun Somchai need to order before the 9:00 truck?`]] });
  return { sheet, id: 'lab-1', title: 'Lab 1: Understand Bob\'s capability', body };
}
