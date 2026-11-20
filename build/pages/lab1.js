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
      ['Mode', 'A role for Bob: what it is, which tools it may use, which files it may edit', '<code>.bob/custom_modes.yaml</code>'],
      ['Skill', 'A reusable set of instructions Bob follows when the task matches', '<code>.bob/skills/&lt;name&gt;/SKILL.md</code>'],
      ['MCP server', 'A small program that gives Bob new tools, here: read our stock and sales', '<code>.bob/mcp.json</code>'],
    ],
  )}

${steps([
    {
      title: 'Open the kit folder and meet the three built-in modes',
      mins: 8,
      body: `
<p>In the Bob IDE, open the <b>kit folder</b> (the one with <code>package.json</code> in it). Open the Bob chat and look at the mode picker.</p>
${ul(['<b>Ask</b>: answers questions. Changes nothing.', '<b>Plan</b>: designs the work and writes plans. Edits only text files.', '<b>Agent</b>: reads, edits and runs commands to finish a task.'])}
<p>Try Ask first:</p>
${prompt('What does the data/ folder contain? Which files would I read to find products that are running out of stock at Khon Kaen?', 'Ask mode')}
${note('expect', '<p>Bob lists the four data files and points at <code>stock.json</code> (stock levels) and <code>products.json</code> (names).</p>')}
`,
    },
    {
      title: 'Ask the real question with no setup (your baseline)',
      mins: 6,
      body: `
<p>Still in Ask mode:</p>
${prompt('Which products are sold out or low on stock at Khon Kaen (KKN)? Give me SKU and English name, as a short list.', 'Ask mode')}
<p>Bob will open files and work it out. Write down: how long it took, how many files it opened, and the answer. You will compare in step 7.</p>
${note('tip', '<p>"Low" means <code>onHand</code> is at or below <code>reorderPoint</code>. Bob does not know that rule yet, so it may guess a different one. That is the problem skills and tools solve.</p>')}
`,
    },
    {
      title: 'Write a skill: our coding standard',
      mins: 10,
      body: `
<p>A skill is a folder with a <code>SKILL.md</code>. The top part says what it is for. The rest is the instructions. Bob decides when to use it from the description, so write the description for when to use it.</p>
<p>Create this folder structure in the kit folder:</p>
${code('.bob/skills/ghh-coding-standard/SKILL.md\n.bob/skills/ghh-coding-standard/sku-format.md', 'create these two files')}
<p>Put this in <code>SKILL.md</code>:</p>
${code(file('answers/lab1/skills/ghh-coding-standard/SKILL.md'), '.bob/skills/ghh-coding-standard/SKILL.md')}
<p>And this in <code>sku-format.md</code>. It is a supporting file. Bob reads it only when it needs it.</p>
${code(file('answers/lab1/skills/ghh-coding-standard/sku-format.md'), '.bob/skills/ghh-coding-standard/sku-format.md')}
<p>Check that Bob sees it: open Bob settings and look for the <b>Skills</b> tab. <code>ghh-coding-standard</code> should be listed.</p>
${note('tip', '<p>Short on time? The same files are in <code>answers/lab1/skills/</code>. Copy the folder into <code>.bob/skills/</code>.</p>')}
${stuck('If it does not work', ul(['Skill not listed: the folder must be inside <code>.bob/skills/</code> in the folder you opened, and the file must be named exactly <code>SKILL.md</code>.', 'The top of the file must start with <code>---</code> on the first line.', 'By default Bob asks before using a skill. That is expected. Approve it.']))}
`,
    },
    {
      title: 'Test the skill',
      mins: 6,
      body: `
<p>Switch to Agent mode. Ask for code that touches money and stock:</p>
${prompt('Write a small JavaScript module lib/reserve.js with two functions: formatPrice(amount) for showing a product price, and reserveStock(onHand, qty) that returns the new stock level. Do not run anything. Just write the file.', 'Agent mode')}
${note('expect', '<ul><li><code>formatPrice(1234.5)</code> gives <code>฿1,234.50</code>, not <code>$</code>.</li><li><code>reserveStock</code> refuses a quantity larger than stock instead of going negative.</li><li>Bob says it used the skill and lists the rules it applied.</li></ul>')}
<p>Delete <code>lib/reserve.js</code> when you are done. It is not part of the kit.</p>
`,
    },
    {
      title: 'Create a custom mode: GHH Data Analyst',
      mins: 8,
      body: `
<p>A mode sets a role, picks which tool groups Bob may use, and can restrict which files it may edit. This one can read, use MCP tools and skills, and may only write Markdown files in <code>reports/</code>.</p>
<p>Create <code>.bob/custom_modes.yaml</code> in the kit folder:</p>
${code(file('answers/lab1/custom_modes.yaml'), '.bob/custom_modes.yaml')}
<p>Open the mode picker. <b>GHH Data Analyst</b> should appear.</p>
${note('tip', '<p>The key line is <code>fileRegex: "^reports/.*\\\\.md$"</code>. It is a hard limit, not a polite request. If you ask this mode to edit a <code>.js</code> file, it cannot. That is why custom modes are safe to hand to non-developers.</p>')}
${stuck('If it does not work', ul(['Mode not in the picker: check the file is <code>.bob/custom_modes.yaml</code> (with the dot) and the first line is <code>customModes:</code>.', 'YAML is strict about spaces. Use spaces, not tabs. Copy the block as it is.', 'Still stuck: copy from <code>answers/lab1/custom_modes.yaml</code>.']))}
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
${stuck('If it does not work', ul(['Not connected: run <code>node lab1/mcp/inventory-server.js</code> in a terminal. It should print <code>ghh-inventory MCP server ready</code> and wait. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop. If it crashes, run <code>npm install</code>.', 'Connected but no tools: open the server in settings and check no tool is switched off.', 'Another way to add it: <code>bob mcp add</code> exists in Bob CLI, but the file above is simpler.']))}
`,
    },
    {
      title: 'Ask again with the mode and the tools',
      mins: 8,
      body: `
<p>Pick <b>GHH Data Analyst</b> in the mode picker and ask the same question as in step 2:</p>
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
<p>The file lands in <code>reports/</code>. Now try to make the mode break its own rule:</p>
${prompt('Also fix a typo in package.json.', 'GHH Data Analyst mode')}
${note('expect', '<p>Bob cannot edit <code>package.json</code> in this mode. It tells you so.</p>')}
<p>Compare with step 2:</p>
${table(['', 'Step 2: plain Ask', 'Step 7: mode + skill + MCP'], [['Where the numbers come from', 'Bob read files and guessed the rules', 'A tool that applies the real rules'], ['Money format', 'Whatever Bob picked', '฿ with two decimals, from the skill and mode'], ['Can it change code?', 'No (Ask)', 'Only <code>reports/*.md</code>']])}
`,
    },
  ])}

<h2>What you learned</h2>
${ul(['A <b>skill</b> teaches Bob how your team works. Write it once, every task benefits.', 'A <b>mode</b> sets a role and hard limits on tools and files.', 'An <b>MCP server</b> gives Bob live data and actions. Good descriptions on the tools matter, because Bob picks tools by reading them.', 'MCP servers run code on your laptop. Only add ones you trust, and read what they do.'])}
<p>Next: <a href="lab-2.html">Lab 2, build the stock dashboard</a>. The skill you wrote goes with you.</p>
`;
  const sheet = titleBlock({ no: '1', title: "Understand Bob's capability", sub: "Learn how to use MCP, skills and modes on Bob.", facts: [["Time", `60 minutes`], ["Where", `Bob IDE, with the kit folder open`], ["You build", `A skill, a mode and an MCP server connection`], ["Question", `What does Khun Somchai need to order before the 9:00 truck?`]] });
  return { sheet, id: 'lab-1', title: 'Lab 1: Understand Bob\'s capability', body };
}
