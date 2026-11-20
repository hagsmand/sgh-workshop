import { titleBlock } from '../layout.js';
import { code, note, ol, stuck, steps, table, ul } from '../lib.js';

export default function step0() {
  const body = `
<p class="lead">Work through the steps in order. At the end, a single command tells you if you are ready.</p>

${steps([
    {
      title: 'Register for the Bob trial',
      mins: 5,
      body: `
<p>Go to <a href="https://bob.ibm.com/trial">https://bob.ibm.com/trial</a> and complete the registration with your Gmail account.</p>
<p>The trial gives you <b>50 Bobcoins for 30 days</b>. Bobcoins are what Bob spends when it works for you. Use the same Gmail for every Bob sign-in today.</p>
${note('tip', '<p>The 30 days start when you register. If you register weeks early, the trial may run out before the workshop. Register in the week of the workshop.</p>')}
${stuck('If it does not work', ul(['No email arrives: check spam, then try again with the same address.', 'The page asks for an IBMid: use "Create an IBMid" with your Gmail.', 'Still blocked: tell the facilitator before the day.']))}
`,
    },
    {
      title: 'Install Bob Insiders (includes Bob Desktop)',
      mins: 8,
      body: `
<p>Lab 4 uses Bob Desktop. You open it from the <b>Desktop</b> button at the top right of the Bob Insiders window, so install Insiders now. Open the Google Drive folder, download the one file for your computer, then open it and follow the installer:</p>
<p><a class="btn sm dark" href="https://drive.google.com/drive/folders/1k3uoDmz2MG9kWns51NP3wVXkI775edRM?usp=sharing">Open the download folder (Google Drive)</a></p>
${table(
    ['Your computer', 'File in the folder', 'Size'],
    [
      ['Mac with Apple silicon (M1 or newer)', '<code>mac-arm64.pkg</code>', 'about 270 MB'],
      ['Mac with an Intel chip', '<code>mac-intel.pkg</code>', 'about 280 MB'],
      ['Windows, 64-bit', '<code>windows-x64.exe</code>', 'about 240 MB'],
      ['Linux, Debian or Ubuntu', '<code>linux-amd64.deb</code>', 'about 230 MB'],
    ],
  )}
<p>Not sure which Mac you have? Open the Apple menu, then <b>About This Mac</b>. "Chip: Apple M…" means Apple silicon. "Processor: Intel" means Intel.</p>
<p>On an Apple silicon Mac you can also use the <a href="https://drive.google.com/file/d/1yxg6k8Yo8cn3x5eEEXxpVTkD1mBYyIzg/view?usp=sharing">direct download link</a>.</p>
<p>Open Bob Insiders and sign in with the Gmail you registered in step 1. Look at the top right of the window: you should see a <b>Desktop</b> button. You will click it in lab 4.</p>
${note('warn', '<p>This is a pre-release "Insiders" build (version <code>2.4.0-insider.1</code>). It can be rougher than the public release. If something behaves oddly, say so in the room before you assume you did it wrong.</p><p>Mac: if macOS says it cannot verify the app, right-click the installer and choose <b>Open</b>. Windows: if SmartScreen blocks it, choose <b>More info</b>, then <b>Run anyway</b>.</p>', 'Before you install')}
${note('expect', '<p>Bob Insiders opens and shows your name or Gmail after you sign in, and a <b>Desktop</b> button sits at the top right of the window.</p>')}
`,
    },
    {
      title: 'Install the Bob IDE',
      mins: 5,
      body: `
<p>Labs 1 and 2 use Bob as an IDE: a code editor with Bob built in. Download it from <a href="https://bob.ibm.com/download">https://bob.ibm.com/download</a> (pick your computer: Mac ARM, Mac Intel, Windows or Linux) and sign in with the same Gmail.</p>
${note('tip', '<p>Labs 1 and 2 use the IDE. Lab 3 uses GitHub. Lab 4 uses Bob Desktop, opened from the Desktop button in Insiders. Keep the IDE open on the day.</p>')}
`,
    },
    {
      title: 'Install Node.js 24',
      mins: 4,
      body: `
<p>Node.js is the only other program you install. Get the <b>24 LTS</b> version from <a href="https://nodejs.org">nodejs.org</a> and run the installer. Then open a terminal and check:</p>
${code('node -v', 'terminal')}
<p>It should print <code>v24</code> or higher. Everything else in the workshop is JavaScript libraries that <code>npm</code> installs for you into one folder.</p>
${stuck('If it does not work', ul(['<code>command not found: node</code>: close the terminal and open a new one.', 'It prints <code>v20</code> or lower: install 24 LTS over it.']))}
`,
    },
    {
      title: 'Get a personal GitHub account',
      mins: 2,
      body: `
<p>Lab 3 uses GitHub. Use your <b>personal</b> account, not a company one. Sign up at <a href="https://github.com/signup">github.com/signup</a> if you do not have one. Sign in and check that you can open <code>github.com/new</code>.</p>
${note('tip', '<p>You do not need Git installed. Lab 3 uses the GitHub website.</p>')}
`,
    },
    {
      title: 'Download the code kit and set it up',
      mins: 5,
      body: `
<p><a href="downloads/ghh-bob-workshop-kit.zip" download>Download <code>ghh-bob-workshop-kit.zip</code></a> and unzip it. Open a terminal <b>in the unzipped folder</b>, then run:</p>
${code('npm install\nnpm run setup', 'terminal, inside the kit folder')}
<p>This makes the practice data (60 products, 3 branches, 90 days of sales) and checks that everything is in place.</p>
${note('expect', '<p>The last line says <code>All good. You are ready for the workshop.</code></p>')}
${stuck('If it does not work', ul(['<code>npm: command not found</code>: Node.js is not installed. Go back to step 4.', 'A line says <code>FAIL</code>: it also tells you what to run. Fix it, then run <code>npm run check</code>.', 'Corporate network blocks npm: tell the facilitator. The kit has only three libraries and a spare copy can be shared on a USB drive.']))}
`,
    },
    {
      title: 'Say hello to Bob',
      mins: 3,
      body: `
<p>In the Bob IDE, open the kit folder (<b>File</b>, then <b>Open Folder</b>). Open the Bob chat and send:</p>
<div class="prompt" data-copyable><div class="who">Paste into Bob</div><p>Read data/SCHEMA.md and tell me, in two sentences, what data this folder has.</p><button class="copy" type="button">Copy</button></div>
${note('expect', '<p>Bob answers that the folder has 60 products, stock for three branches and 90 days of sales, with money in Thai baht.</p>')}
`,
    },
    {
      title: 'Find the API keys page',
      mins: 2,
      body: `
<p>In lab 3 you will create an API key so a GitHub Action can use Bob. Check now that you can find the page. Go to <a href="https://bob.ibm.com">bob.ibm.com</a>, sign in, open your subscription, and find the <b>API keys</b> section. <b>Do not create a key yet.</b></p>
${note('warn', '<p>If you cannot find API keys, tell the facilitator now. Lab 3 needs one.</p>')}
`,
    },
  ])}

<h2>Check list</h2>
${table(
    ['Done', 'Check'],
    [
      ['☐', 'Bob trial registered with Gmail'],
      ['☐', 'Bob Desktop installed and signed in'],
      ['☐', 'Bob IDE installed and signed in'],
      ['☐', '<code>node -v</code> shows v24 or higher'],
      ['☐', 'GitHub account can create a repository'],
      ['☐', '<code>npm run setup</code> ends with "All good"'],
      ['☐', 'Bob answered the hello question'],
      ['☐', 'You found the API keys page'],
    ],
  )}
`;
  const sheet = titleBlock({ no: '0', title: 'Step 0: Set up', sub: "Do this before the day. At the end, one command tells you if you are ready.", facts: [["When", `Before the day`], ["Time", `About 30 minutes`], ["You need", `A laptop, a Gmail account, a personal GitHub account`], ["You get", `A Bob account, Bob installed, the code kit ready`]] });
  return { sheet, id: 'step-0', title: 'Step 0: Set up', body };
}
