/**
 * The dispatch slip, as an email.
 *
 * Both form handlers render through here so the two alerts are one design and
 * one place to change. Whiteprint in an email client: graphite ink on
 * drafting-white paper, engraved mono labels, hairline rules, and colour used
 * exactly once, on the deadline, because --cw-marker means "needs you now"
 * and nothing else (DESIGN.md).
 *
 * Email is not the web. The rules that shape this file:
 *   - Layout is tables. Flex and grid do not survive Outlook or Gmail.
 *   - Every style is inline. <style> blocks are stripped or partially applied.
 *   - No external images or webfonts: they hang, get blocked, or leak a
 *     tracking signal. The wordmark is type.
 *   - Colours are explicit on every cell, so a dark-mode client inverting the
 *     page cannot leave dark ink on a dark ground.
 *   - 600px is the widest safe body; it must still read at 375.
 *
 * CommonJS on purpose (see api/contact.js header).
 */

// Whiteprint tokens, hard-coded because an email cannot import a stylesheet.
// Keep in step with packages/whiteprint/src/tokens.css.
const INK = '#16181b';
const INK_2 = '#565c62';
const INK_MUTED = '#6b7076';
const PAPER = '#ffffff';
const RAISED = '#f4f6f7';
const CHROME = '#e8eaec';
const BORDER = '#e0e4e7';
const MARKER = '#ffd23f';

const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

function esc(value) {
  return String(value == null ? '' : value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
}

/** An engraved label: uppercase, letterspaced, mono, muted. */
function etched(text, color = INK_MUTED) {
  return `<span style="font-family:${MONO};font-size:11px;line-height:1.4;`
    + `letter-spacing:0.08em;text-transform:uppercase;color:${color};">${esc(text)}</span>`;
}

/** One ledger row: engraved label left, value right. */
function row(label, value, opts = {}) {
  if (value == null || value === '') return '';
  const valueHtml = opts.raw ? value : esc(value);
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid ${BORDER};vertical-align:top;
                 width:88px;white-space:nowrap;">${etched(label)}</td>
      <td style="padding:9px 0 9px 12px;border-bottom:1px solid ${BORDER};vertical-align:top;
                 font-family:${SANS};font-size:15px;line-height:1.5;color:${INK};
                 overflow-wrap:break-word;">${valueHtml}</td>
    </tr>`;
}

/** Central time, because that is the only clock Ian books against. */
function deadlineLabel(receivedIso, hours = 24) {
  const t = Date.parse(receivedIso);
  if (Number.isNaN(t)) return '';
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago', weekday: 'short', month: 'short',
      day: 'numeric', hour: 'numeric', minute: '2-digit',
    }).format(new Date(t + hours * 3600 * 1000));
  } catch {
    return '';
  }
}

/**
 * Render a slip.
 *   kind      'demo' | 'contact'          drives the eyebrow only
 *   headline  the business, or the person when there is no business
 *   sub       the person, when headline is a business
 *   rows      [[label, value], ...]       already ordered
 *   replyTo   email address for the action button
 *   consent   the full A2P record (rendered small, at the foot)
 *   requestId reconciles this email with the KV record and ianOS
 */
function dispatchSlip({ kind, headline, sub, rows, replyTo, consent, requestId, receivedIso,
                        brand = 'Beat the Clock', slipLabel = 'Dispatch slip',
                        foot = 'ianOS collects this automatically. Confirm on the BtC tab.' }) {
  const isDemo = kind === 'demo';
  const eyebrow = isDemo ? 'Demo request' : 'Message';
  const deadline = deadlineLabel(receivedIso);
  const granted = consent && consent.granted;
  // A seam that never offers SMS (the personal site) has no consent concept
  // at all. Printing "not given" there would imply a choice nobody was
  // offered, so an absent/empty record drops the line rather than reporting
  // a negative.
  const hasConsentConcept = Boolean(consent && Object.keys(consent).length);

  const rowsHtml = rows.map(([l, v, o]) => row(l, v, o || {})).join('');

  // The one place colour is allowed: the promise with a clock on it.
  const deadlineBlock = deadline ? `
    <tr><td style="padding:22px 0 0 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
             style="border-collapse:collapse;background:${RAISED};">
        <tr>
          <td style="width:4px;background:${MARKER};" bgcolor="${MARKER}">&nbsp;</td>
          <td style="padding:12px 16px;">
            ${etched('Confirm by', INK_2)}<br>
            <span style="font-family:${MONO};font-size:16px;line-height:1.5;
                         color:${INK};font-weight:600;">${esc(deadline)}</span>
          </td>
        </tr>
      </table>
    </td></tr>` : '';

  const replyBlock = replyTo ? `
    <tr><td style="padding:24px 0 4px 0;">
      <a href="mailto:${esc(replyTo)}"
         style="display:inline-block;padding:13px 22px;background:${INK};color:${PAPER};
                font-family:${SANS};font-size:15px;font-weight:600;line-height:1;
                text-decoration:none;">Reply</a>
    </td></tr>` : '';

  return `<!doctype html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(eyebrow)}</title></head>
<body style="margin:0;padding:0;background:${CHROME};" bgcolor="${CHROME}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
  ${esc(headline)}${deadline ? ` · confirm by ${esc(deadline)}` : ''}
</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
       style="border-collapse:collapse;background:${CHROME};" bgcolor="${CHROME}">
  <tr><td align="center" style="padding:24px 12px;">

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"
           style="border-collapse:collapse;max-width:600px;width:100%;background:${PAPER};
                  border:1px solid ${BORDER};" bgcolor="${PAPER}">

      <!-- header rail -->
      <tr>
        <td style="padding:14px 24px;background:${CHROME};border-bottom:1px solid ${BORDER};"
            bgcolor="${CHROME}">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
              <td align="left">${etched(brand, INK_2)}</td>
              <td align="right">${etched(slipLabel, INK_MUTED)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- the slip -->
      <tr><td style="padding:26px 24px 28px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
               style="border-collapse:collapse;">
          <tr><td style="padding:0 0 4px 0;">${etched(eyebrow)}</td></tr>
          <tr><td style="padding:0;font-family:${SANS};font-size:26px;line-height:1.25;
                         font-weight:700;color:${INK};letter-spacing:-0.01em;">
            ${esc(headline)}
          </td></tr>
          ${sub ? `<tr><td style="padding:3px 0 0 0;font-family:${SANS};font-size:15px;
                                  line-height:1.5;color:${INK_2};">${esc(sub)}</td></tr>` : ''}
          ${deadlineBlock}
          <tr><td style="padding:18px 0 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="border-collapse:collapse;border-top:1px solid ${BORDER};">
              ${rowsHtml}
            </table>
          </td></tr>
          ${replyBlock}
        </table>
      </td></tr>

      <!-- foot: the consent record. Quiet, but COMPLETE.
           This is the A2P 10DLC evidence: the exact disclosure they agreed
           to, when, from where, on what. It was the only durable archive
           before ianOS existed and is still the one Ian can forward to a
           carrier from his phone, so it is rendered in full even though a
           shorter foot would look better. Legibility loses to completeness
           on a compliance artifact. -->
      <tr>
        <td style="padding:14px 24px 16px 24px;background:${RAISED};
                   border-top:1px solid ${BORDER};" bgcolor="${RAISED}">
          ${hasConsentConcept
            ? etched(granted ? 'SMS consent · granted' : 'SMS consent · not given',
                     granted ? INK_2 : INK_MUTED)
            : etched('Received', INK_MUTED)}
          <div style="font-family:${MONO};font-size:11px;line-height:1.7;color:${INK_MUTED};
                      padding-top:6px;word-break:break-word;">
            ${granted ? [
              `${esc(consent.timestamp_utc || '')} · ${esc(consent.ip || '')}`,
              esc(consent.phone || ''),
              esc(consent.page_url || ''),
              esc(consent.user_agent || ''),
            ].filter(Boolean).join('<br>') + '<br>' : ''}
            ref ${esc(requestId || '')}
            ${granted && consent.disclosure_text ? `
            <div style="padding-top:8px;color:${INK_2};">
              &ldquo;${esc(consent.disclosure_text)}&rdquo;
            </div>` : ''}
          </div>
        </td>
      </tr>
    </table>

    <div style="font-family:${MONO};font-size:11px;line-height:1.6;color:${INK_MUTED};
                padding:12px 8px 0 8px;letter-spacing:0.04em;">
      ${esc(foot)}
    </div>

  </td></tr>
</table>
</body></html>`;
}

module.exports = { dispatchSlip, deadlineLabel };
