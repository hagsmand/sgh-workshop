---
name: ghh-coding-standard
description: Global House coding standard for JavaScript services. Use when writing or reviewing code that handles products, SKUs, stock levels, prices or Thai baht amounts.
---

Follow these rules for any Global House JavaScript code. Read `sku-format.md` in this folder when you need the SKU rules.

<Steps>
<Step>
Money is Thai baht (THB). Show it as `฿1,234.50`: the ฿ sign, thousands separators, two decimals. Never use `$`. Keep prices as numbers in code and format them only when displaying.
</Step>

<Step>
SKUs follow `GH-<CAT>-<NNNN>`, for example `GH-CEM-1001`. Compare SKUs case-insensitively but always store and return them in upper case.
</Step>

<Step>
Stock on hand is a whole number and is never negative. Any code that subtracts stock must check that enough stock exists first and return a clear error if not.
</Step>

<Step>
Validate every value that comes from a request (query string, body, params) before using it. Reject unknown branch codes, unknown statuses and out-of-range numbers with HTTP 400 and a message that says what is allowed.
</Step>

<Step>
Product names are stored in both English and Thai. Keep Thai text as UTF-8 and never truncate by bytes. Search must work in both languages.
</Step>

<Step>
Never put keys, tokens or passwords in source files. Read them from environment variables.
</Step>
</Steps>

When you finish, list which of these rules you applied.
