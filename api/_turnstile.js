/**
 * Cloudflare Turnstile verification.
 *
 * The failure policy is the whole design, and it is deliberately lopsided:
 *
 *   explicit bot verdict  -> reject
 *   anything else at all  -> ALLOW, and log
 *
 * api/contact.js carries the note that a failed submit is exactly what got
 * the A2P campaign rejected. A bot check that turns away a real contractor
 * because Cloudflare had a blip recreates that failure, and we would never
 * find out, because the person just leaves. Bot spam is an annoyance someone
 * deletes in three seconds; a lost lead is a thing this business has already
 * paid for once. So the verifier is allowed to be wrong in exactly one
 * direction.
 *
 * Unconfigured is a no-op: no TURNSTILE_SECRET means every submission passes,
 * so the site behaves exactly as it did before this file existed and the
 * whole layer can ship before the keys do.
 *
 * CommonJS on purpose (see api/contact.js header).
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TIMEOUT_MS = 4000;

function turnstileConfigured() {
  return Boolean(process.env.TURNSTILE_SECRET);
}

/**
 * -> { ok: true }                      allow (verified, unconfigured, or degraded)
 *    { ok: false, reason: 'bot' }      reject: Cloudflare explicitly said no
 *
 * `remoteIp` is optional; Cloudflare uses it to sharpen scoring.
 */
async function verifyTurnstile(token, remoteIp) {
  if (!turnstileConfigured()) return { ok: true, reason: 'unconfigured' };

  // No token at all: the widget did not run. That is a bot posting straight
  // at the endpoint, OR a human whose browser blocked the script. Treated as
  // degraded rather than a verdict, because we cannot tell the two apart and
  // the honeypot already catches the naive bots.
  if (!token) {
    console.warn('TURNSTILE_DEGRADED no-token');
    return { ok: true, reason: 'no-token' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET, response: token });
    if (remoteIp) body.set('remoteip', remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn('TURNSTILE_DEGRADED status', res.status);
      return { ok: true, reason: 'verifier-error' };
    }

    const data = await res.json();
    if (data.success) return { ok: true, reason: 'verified' };

    // An expired or already-redeemed token usually means a slow human or a
    // double submit, not an attacker. Only a genuine rejection blocks.
    const codes = Array.isArray(data['error-codes']) ? data['error-codes'] : [];
    const soft = codes.some((c) =>
      c === 'timeout-or-duplicate' || c === 'internal-error');
    if (soft) {
      console.warn('TURNSTILE_DEGRADED soft', codes.join(','));
      return { ok: true, reason: 'soft-fail' };
    }

    console.warn('TURNSTILE_REJECT', codes.join(','));
    return { ok: false, reason: 'bot' };
  } catch (err) {
    console.warn('TURNSTILE_DEGRADED threw', err && err.message);
    return { ok: true, reason: 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { verifyTurnstile, turnstileConfigured };
