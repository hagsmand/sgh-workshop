# Smart Branch in a Day: code kit

Code for the Siam Global House x IBM Bob developer workshop. Plain JavaScript on Node.js. All data is synthetic.

## Set up (once, about 5 minutes)

You need Node.js 24 LTS. Check with `node -v`.

```
npm install
npm run setup
```

You should end with `All good. You are ready for the workshop.`

## What is where

| Folder | Used in |
|--------|---------|
| `data/` | every lab. Products, stock, sales for 3 branches |
| `lab1/` | lab 1. `mcp/` has the inventory MCP server. Open the **kit folder** (this folder) in Bob for lab 1 |
| `lab2/starter/` | lab 2. The app you build with Bob |
| `lab3/ci/` | lab 3. Files for the GitHub Action: reviewer mode, workflow, comment script |
| `lab3/pr-samples/` | lab 3. A "bad" and a "good" pull request to try |
| `lab3/repo/` | lab 3 fallback. A finished app to upload if you skipped lab 2 |
| `lab4/monday-pack/` | lab 4. Files for Bob Desktop |
| `answers/` and `lab2/solution/` | peek only after you tried |

## Commands

| Command | What it does |
|---------|--------------|
| `npm run setup` | makes the data and copies it into the labs |
| `npm run check` | checks that everything is in place |
| `npm run mcp:config -- --write` | writes `.bob/mcp.json` with the right path for your laptop |
| `npm run app` | runs the finished lab 2 app on http://localhost:3000 |
| `npm test` | runs all kit tests |
