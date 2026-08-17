/**
 * Durable holding pen for ianOS pull-sync (SPEC-v17 in the ianOS repo).
 *
 * Bookings and contact messages are stored here AFTER email delivery, and
 * ianOS collects + acks them whenever Ian's Mac is awake. Email stays the
 * source of truth; this store can never fail a visitor's submission, so every
 * function catches everything and reports a boolean / empty result instead.
 *
 * Talks to Vercel KV (Upstash Redis) over its REST API with plain fetch, the
 * same zero-dependency style as the Resend calls. No KV env vars -> silently
 * unconfigured (the RESEND_API_KEY precedent).
 *
 * Data shape: one JSON record per key `ianos:rec:<request_id>` with a 60-day
 * TTL as a safety net, plus a set `ianos:unacked` of ids awaiting pickup.
 * Ack = SREM + DEL. The TTL means an abandoned queue cleans itself up; the
 * email archive is the permanent site-side copy.
 *
 * CommonJS on purpose (see api/contact.js header).
 */

const TTL_SECONDS = 60 * 60 * 24 * 60; // 60 days
const UNACKED_SET = 'ianos:unacked';
const REC_PREFIX = 'ianos:rec:';
const TIMEOUT_MS = 2000;

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

function storeConfigured() {
  return kvConfig() !== null;
}

/** Run a pipeline of Redis commands. Returns the array of results, or null on
 *  any failure. Hard 2s timeout: Vercel bills wall-clock and the visitor is
 *  waiting behind the stamp animation. */
async function pipeline(commands) {
  const cfg = kvConfig();
  if (!cfg) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${cfg.url}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(commands),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error('ianos-store pipeline failed', res.status);
      return null;
    }
    const out = await res.json();
    return Array.isArray(out) ? out : null;
  } catch (err) {
    console.error('ianos-store pipeline threw', err && err.message);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Store one record and mark it unacked. Returns true on success. */
async function storeRecord(record) {
  if (!record || !record.request_id) return false;
  const key = REC_PREFIX + record.request_id;
  const out = await pipeline([
    ['SET', key, JSON.stringify(record), 'EX', String(TTL_SECONDS)],
    ['SADD', UNACKED_SET, record.request_id],
  ]);
  return !!(out && out.every((r) => r && r.error === undefined));
}

/** All unacked records, oldest first, capped. Ids whose record has expired
 *  (TTL) are dropped from the set opportunistically so they don't pile up. */
async function listUnacked(limit = 200) {
  const members = await pipeline([['SMEMBERS', UNACKED_SET]]);
  const ids = members && members[0] && Array.isArray(members[0].result) ? members[0].result : [];
  if (ids.length === 0) return [];

  const capped = ids.slice(0, Math.max(1, limit));
  const got = await pipeline([['MGET', ...capped.map((id) => REC_PREFIX + id)]]);
  const raw = got && got[0] && Array.isArray(got[0].result) ? got[0].result : [];

  const records = [];
  const orphans = [];
  raw.forEach((val, i) => {
    if (val == null) return orphans.push(capped[i]);
    try {
      records.push(JSON.parse(val));
    } catch {
      orphans.push(capped[i]); // unparseable = unrecoverable; drop it
    }
  });
  if (orphans.length) await pipeline([['SREM', UNACKED_SET, ...orphans]]);

  records.sort((a, b) => String(a.received_at_utc || '').localeCompare(String(b.received_at_utc || '')));
  return records;
}

/** Drain acked ids: out of the set, records deleted. Returns count asked. */
async function ackIds(ids) {
  const clean = (Array.isArray(ids) ? ids : [])
    .map((x) => String(x))
    .filter((x) => /^[A-Za-z0-9-]{8,64}$/.test(x))
    .slice(0, 500);
  if (clean.length === 0) return 0;
  const out = await pipeline([
    ['SREM', UNACKED_SET, ...clean],
    ['DEL', ...clean.map((id) => REC_PREFIX + id)],
  ]);
  return out ? clean.length : 0;
}

module.exports = { storeConfigured, storeRecord, listUnacked, ackIds };
