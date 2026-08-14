/**
 * The ianOS pull endpoint (SPEC-v17 in the ianOS repo).
 *
 * GET  -> every unacked demo/contact record, oldest first
 * POST -> {"ack": ["<request_id>", ...]} drains what ianOS durably wrote
 *
 * This is the most sensitive URL on the site: records carry the A2P consent
 * block (timestamp, IP, user agent, disclosure text). Hence: bearer token
 * required (IANOS_SYNC_TOKEN, compared timing-safe), Cache-Control: no-store,
 * no CORS headers at all (the caller is a Python loader, never a browser),
 * and 503 when either the token or the KV store is unconfigured, so an
 * un-provisioned deploy exposes nothing.
 *
 * CommonJS on purpose (see api/contact.js header).
 */

const { timingSafeEqual } = require('node:crypto');
const store = require('./_ianos-store.js');

function tokenOk(req) {
  const expect = process.env.IANOS_SYNC_TOKEN || '';
  const got = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!expect || !got) return false;
  const a = Buffer.from(got);
  const b = Buffer.from(expect);
  return a.length === b.length && timingSafeEqual(a, b);
}

function readJson(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 100000) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!process.env.IANOS_SYNC_TOKEN || !store.storeConfigured()) {
    return res.status(503).json({ ok: false, error: 'sync not configured' });
  }
  if (!tokenOk(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  if (req.method === 'GET') {
    const records = await store.listUnacked(200);
    return res.status(200).json({ ok: true, records });
  }

  if (req.method === 'POST') {
    const body = await readJson(req);
    const acked = await store.ackIds(body.ack);
    return res.status(200).json({ ok: true, acked });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};
