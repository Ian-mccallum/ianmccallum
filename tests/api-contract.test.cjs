const test = require('node:test');
const assert = require('node:assert/strict');

test('API modules remain loadable as CommonJS', () => {
  assert.equal(typeof require('../api/contact.js'), 'function');
  assert.equal(typeof require('../api/ianos-inbox.js'), 'function');
  assert.equal(typeof require('../api/_email.js').dispatchSlip, 'function');
});

test('Turnstile is fail-open when unconfigured', async () => {
  const prior = process.env.TURNSTILE_SECRET;
  delete process.env.TURNSTILE_SECRET;
  const { verifyTurnstile } = require('../api/_turnstile.js');
  assert.deepEqual(await verifyTurnstile('', ''), { ok: true, reason: 'unconfigured' });
  if (prior) process.env.TURNSTILE_SECRET = prior;
});

test('contact rejects an invalid JSON request without outbound calls', async () => {
  const handler = require('../api/contact.js');
  const req = { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: { name: '', email: '', message: '' } };
  let statusCode = 0;
  let payload;
  const res = {
    setHeader() {},
    status(code) { statusCode = code; return this; },
    json(value) { payload = value; return this; },
  };
  await handler(req, res);
  assert.equal(statusCode, 400);
  assert.equal(payload.ok, false);
  assert.match(payload.error, /required/i);
});

test('ianOS endpoint keeps no-store and fails closed when unconfigured', async () => {
  const handler = require('../api/ianos-inbox.js');
  const prior = process.env.IANOS_SYNC_TOKEN;
  delete process.env.IANOS_SYNC_TOKEN;
  const headers = {};
  let statusCode = 0;
  const res = {
    setHeader(name, value) { headers[name] = value; },
    status(code) { statusCode = code; return this; },
    json(value) { return value; },
  };
  await handler({ method: 'GET', headers: {} }, res);
  assert.equal(headers['Cache-Control'], 'no-store');
  assert.equal(statusCode, 503);
  if (prior) process.env.IANOS_SYNC_TOKEN = prior;
});
