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

test('valid contact submissions succeed without configured outbound services', async () => {
  const handler = require('../api/contact.js');
  const previous = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    KV_REST_API_URL: process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN,
    TURNSTILE_SECRET: process.env.TURNSTILE_SECRET,
  };
  for (const key of Object.keys(previous)) delete process.env[key];
  const priorError = console.error;
  console.error = () => {};
  try {
    const body = { name: 'API Contract', email: 'qa@example.com', message: 'A valid message.' };
    let statusCode = 0;
    let payload;
    await handler(
      { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body },
      {
        setHeader() {},
        status(code) { statusCode = code; return this; },
        json(value) { payload = value; return this; },
      },
    );
    assert.equal(statusCode, 200);
    assert.deepEqual(payload, { ok: true });

    let redirectCode = 0;
    let redirectHeaders;
    let ended = false;
    await handler(
      { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body },
      {
        setHeader() {},
        writeHead(code, headers) { redirectCode = code; redirectHeaders = headers; return this; },
        end() { ended = true; return this; },
      },
    );
    assert.equal(redirectCode, 303);
    assert.equal(redirectHeaders.Location, 'https://www.ianmccallum.com/thank-you');
    assert.equal(ended, true);
  } finally {
    console.error = priorError;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
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
