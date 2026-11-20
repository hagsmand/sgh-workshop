import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildComment, MARKER } from '../lab3/ci/post-review.js';

const ok = (msg, cost = 0.42) => JSON.stringify({ type: 'result', status: 'success', last_message: msg, stats: { session_costs: cost } });

test('success: comment is Bob\'s message plus a cost footer', () => {
  const c = buildComment(ok('### Bob review\nLooks fine.'));
  assert.ok(c.startsWith(MARKER));
  assert.match(c, /### Bob review\nLooks fine\./);
  assert.match(c, /Cost: 0\.42 Bobcoins/);
});

test('empty output (Bob hung or was killed) says NOT reviewed', () => {
  const c = buildComment('');
  assert.match(c, /has \*\*not\*\* been reviewed/);
});

test('garbage output says NOT reviewed', () => {
  assert.match(buildComment('Error: Unauthorized'), /has \*\*not\*\* been reviewed/);
});

test('status error says NOT reviewed and shows the status', () => {
  const c = buildComment(JSON.stringify({ status: 'error', last_message: null }));
  assert.match(c, /status: `error`/);
  assert.match(c, /has \*\*not\*\* been reviewed/);
});

test('success with empty message is not treated as a pass', () => {
  assert.match(buildComment(ok('   ')), /has \*\*not\*\* been reviewed/);
});

test('missing cost still works', () => {
  const c = buildComment(JSON.stringify({ status: 'success', last_message: 'Fine.' }));
  assert.match(c, /Reviewed by IBM Bob Shell\./);
});

test('stray lines before the JSON object are tolerated', () => {
  const raw = 'Bob Shell 2.1.0\nlicense accepted\n' + JSON.stringify({ status: 'success', last_message: 'Fine.', stats: { session_costs: 0.1 } }) + '\n';
  assert.match(buildComment(raw), /^<!-- bob-review -->\nFine\./);
});
