/**
 * Contact handler for ianmccallum.com (SPEC-v19, ianOS repo).
 *
 * Deliberately simpler than its beatyourclock.com sibling:
 *
 *   - NO autoresponse. beatyourclock promises a reply within 24 hours, so it
 *     sends one. This is a personal site that promises nothing, and any
 *     autoresponse would have to come from the Resend-verified
 *     beatyourclock.com sender, which reads as a business robot answering a
 *     personal note. The thank-you page is the confirmation; Ian replies.
 *   - NO consent block. No SMS is offered here, so there is no A2P record to
 *     archive and nothing legally load-bearing on this seam.
 *   - NO lead creation downstream. ianOS files these as correspondence, never
 *     into Clockwork's call pipeline (SPEC-v19 law 1).
 *
 * What it shares with btc: the honeypot, Turnstile with the same lopsided
 * fail-open policy, the KV holding pen for ianOS to pull, and the rule that a
 * visitor never sees an error we can avoid showing them.
 *
 * CommonJS on purpose: the root package.json has no "type": "module", and
 * adding it would break this handler.
 */

const { randomUUID } = require('node:crypto');
const ianosStore = require('./_ianos-store.js');
const { dispatchSlip } = require('./_email.js');
const { verifyTurnstile } = require('./_turnstile.js');

const FROM_EMAIL = 'Ian McCallum <noreply@beatyourclock.com>'; // Resend-verified domain
const THANK_YOU_URL = 'https://www.ianmccallum.com/thank-you';

/** Where the alert lands. Config, not source (the SPEC-v18 lesson: a typo'd
 *  or unset variable should degrade to a real inbox, never to nowhere). */
function notifyTo() {
  const raw = String(process.env.NOTIFY_TO || '').trim();
  const list = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
  return list.length ? list : ['contact@beatyourclock.com'];
}

function esc(value) {
  return String(value == null ? '' : value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 100000) req.destroy();
    });
    req.on('end', () => {
      const type = req.headers['content-type'] || '';
      try {
        if (type.includes('application/json')) return resolve(JSON.parse(raw || '{}'));
        return resolve(Object.fromEntries(new URLSearchParams(raw)));
      } catch {
        return resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

async function sendViaResend({ subject, html, replyTo }) {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: notifyTo(), reply_to: replyTo, subject, html }),
    });
    if (!res.ok) console.error('resend failed', res.status, await res.text().catch(() => ''));
    return res.ok;
  } catch (err) {
    console.error('resend threw', err && err.message);
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const contentType = req.headers['content-type'] || '';
  const wantsJson =
    contentType.includes('application/json') ||
    (req.headers.accept || '').includes('application/json');

  const ok = () => (wantsJson
    ? res.status(200).json({ ok: true })
    : res.writeHead(303, { Location: THANK_YOU_URL }).end());

  const data = await readBody(req);

  if (data._gotcha) return ok();                       // honeypot

  // Turnstile: a bot gets the same success shape a human does and vanishes.
  const gate = await verifyTurnstile(
    data['cf-turnstile-response'],
    String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
  );
  if (!gate.ok) return ok();

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();

  const fail = (msg) => (wantsJson
    ? res.status(400).json({ ok: false, error: msg })
    : res.writeHead(303, { Location: `/contact?error=${encodeURIComponent(msg)}` }).end());

  if (!name || !email || !message) return fail('Name, email and message are required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.');

  const requestId = randomUUID();
  const receivedAt = new Date().toISOString();

  const html = dispatchSlip({
    kind: 'contact',
    headline: name,
    sub: '',              // the header rail already says where this came from
    rows: [
      ['Email', `<a href="mailto:${esc(email)}" style="color:#16181b;">${esc(email)}</a>`, { raw: true }],
      ['Message', esc(message).replace(/\n/g, '<br>'), { raw: true }],
    ],
    replyTo: email,
    consent: {},          // no SMS offered here, so no consent record exists
    requestId,
    receivedIso: '',      // no promised deadline: this site promises nothing
    brand: 'ianmccallum.com',
    slipLabel: 'Message',
    foot: 'ianOS files this under Inbox. Not a Clockwork lead.',
  });

  const delivered = await sendViaResend({
    subject: `PERSONAL · ${name}`,
    html,
    replyTo: email,
  });
  if (!delivered) {
    console.error('PERSONAL_DELIVERY_FAILED ' +
      JSON.stringify({ requestId, name, email, message }));
  }

  // Hold it for ianOS to collect. Awaited (Vercel drops detached promises),
  // 2s timeout inside the store, and it can never fail the submission.
  if (ianosStore.storeConfigured()) {
    const stored = await ianosStore
      .storeRecord({
        request_id: requestId,
        kind: 'contact',
        source: 'personal',
        received_at_utc: receivedAt,
        name, email, message,
      })
      .catch(() => false);
    if (!stored) console.error('PERSONAL_STORE_FAILED ' + requestId);
  }

  return ok();
};
