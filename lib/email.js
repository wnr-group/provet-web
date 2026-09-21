// SMTP transport + enquiry email templates.
//
// Everything SMTP-related lives here so the API routes never touch transport
// config or credentials. Credentials are read from process.env on the server
// only - nothing in this file is importable from a Client Component, and no
// value here is ever returned to the browser.
//
// Every exported send* function resolves to a plain { sent, reason } result
// and never throws: email is best-effort, and a mail failure must not affect
// the enquiry that was already saved.
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const REQUIRED_VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"];

// The brand logo is embedded as a CID attachment rather than linked from a
// public URL: it needs no absolute site URL, works before the site is live,
// and still renders in clients that block remote images. Read once and cached
// - it is a small static file that cannot change at runtime.
const LOGO_PATH = path.join(process.cwd(), "public", "logo-mark.png");
const LOGO_CID = "provet-logo";

// Brand palette, mirroring the @theme tokens in app/globals.css so emails
// match the site. Email clients don't support CSS variables or external
// stylesheets, so these are inlined as literal hex at render time - if the
// brand colours change in globals.css, update them here too.
const THEME = {
  brand: "#393185", // --color-brand-600 (navy, from the Provet logo)
  brandDark: "#2b2565", // --color-brand-700
  accent: "#e5097f", // --color-accent-500 (magenta, from the Provet logo)
  ink: "#201b30", // --color-ink
  inkSoft: "#565070", // --color-ink-soft
  mist: "#f7f6fb", // --color-mist-50
  border: "#dfddf3", // --color-brand-100
  white: "#ffffff",
};

let logoAttachment; // undefined = not tried yet, null = unavailable

function getLogoAttachment() {
  if (logoAttachment !== undefined) return logoAttachment;
  try {
    logoAttachment = {
      filename: "provet-logo-mark.png",
      content: fs.readFileSync(LOGO_PATH),
      cid: LOGO_CID,
      contentType: "image/png",
    };
  } catch (err) {
    // Fall back to the text wordmark - never fail an email over the logo.
    console.warn(`[email] Logo not found at ${LOGO_PATH} (${err.code}) - sending without it.`);
    logoAttachment = null;
  }
  return logoAttachment;
}

function missingConfig() {
  return REQUIRED_VARS.filter((key) => !process.env[key]);
}

function isEmailConfigured() {
  return missingConfig().length === 0;
}

// Cached across requests (and across hot reloads in dev, like lib/prisma.js)
// so we build one connection pool rather than one per enquiry.
const globalForEmail = globalThis;

function getTransporter() {
  if (globalForEmail.__mailTransporter) return globalForEmail.__mailTransporter;

  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587/25 start plaintext and upgrade via STARTTLS.
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    pool: true,
    maxConnections: 2,
    // Without these a hung SMTP server would stall the enquiry response.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  globalForEmail.__mailTransporter = transporter;
  return transporter;
}

// Verifies the SMTP connection at most once per process, the first time an
// email is actually needed. Doing it per enquiry would add a round trip to
// every submission; doing it never would let a bad host/credential go
// unnoticed until someone checks the logs for individual send failures.
// The promise is cached, so concurrent callers share one verification.
function verifyTransport() {
  if (!globalForEmail.__mailVerification) {
    globalForEmail.__mailVerification = getTransporter()
      .verify()
      .then(() => {
        console.log(`[email] SMTP ready (${process.env.SMTP_HOST}:${process.env.SMTP_PORT})`);
        return true;
      })
      .catch((err) => {
        // Host/port/user only - never the password.
        console.error(
          `[email] SMTP verification failed for ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}` +
            ` as ${process.env.SMTP_USER}: ${err.message}`
        );
        return false;
      });
  }
  return globalForEmail.__mailVerification;
}

// Minimal escaping for values interpolated into the HTML bodies. Enquiry
// fields are attacker-controlled free text, so they must never reach an email
// client as live markup.
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Strips CR/LF so a crafted name or subject cannot inject extra SMTP headers.
function headerSafe(value) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendMail({ to, subject, text, html, replyTo, attachments }) {
  const missing = missingConfig();
  if (missing.length) {
    console.warn(
      `[email] SMTP is not configured (missing: ${missing.join(", ")}) - skipping "${subject}" to ${to}.` +
        ` Set these in .env to enable email; see .env.example.`
    );
    return { sent: false, reason: "not-configured" };
  }

  if (!to || !EMAIL_RE.test(to)) {
    console.error(`[email] Refusing to send "${subject}": invalid recipient address.`);
    return { sent: false, reason: "invalid-recipient" };
  }

  const ok = await verifyTransport();
  if (!ok) return { sent: false, reason: "smtp-unavailable" };

  try {
    const info = await getTransporter().sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: headerSafe(subject),
      text,
      html,
      ...(replyTo ? { replyTo: headerSafe(replyTo) } : {}),
      ...(attachments?.length ? { attachments } : {}),
    });
    console.log(`[email] Sent "${subject}" to ${to} (id: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    // Message only - never the transport config or credentials.
    console.error(`[email] Failed to send "${subject}" to ${to}: ${err.message}`);
    return { sent: false, reason: "send-failed" };
  }
}

function formatWhen(date) {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

function layout(heading, bodyHtml, { withLogo = true } = {}) {
  // Mark + wordmark on a white bar with a navy rule: the mark is navy/magenta
  // on transparent, so it needs a light background. A two-cell table (not
  // flex/inline-block) because Outlook's Word engine ignores modern layout.
  // The image is decorative - alt="" - since the adjacent text already says
  // "Provet", so a client with images blocked shows the name exactly once.
  const markCell = withLogo
    ? `<td style="vertical-align:middle;padding-right:10px;">
         <img src="cid:${LOGO_CID}" alt="" width="40" height="40"
              style="display:block;border:0;outline:none;text-decoration:none;width:40px;height:40px;" />
       </td>`
    : "";

  const header = `<div style="background:${THEME.white};padding:18px 24px;border-bottom:1px solid ${THEME.border};">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${markCell}
          <td style="vertical-align:middle;">
            <span style="font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;color:${THEME.brand};">Provet</span>
          </td>
        </tr>
      </table>
    </div>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:${THEME.mist};font-family:Helvetica,Arial,sans-serif;color:${THEME.ink};">
    <div style="max-width:560px;margin:0 auto;background:${THEME.white};border-radius:16px;overflow:hidden;border:1px solid ${THEME.border};">
      <!-- Brand accent strip: magenta into navy, the same pairing the site uses. -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
        <tr>
          <td height="4" width="35%" style="height:4px;line-height:4px;font-size:0;background:${THEME.accent};">&nbsp;</td>
          <td height="4" style="height:4px;line-height:4px;font-size:0;background:${THEME.brand};">&nbsp;</td>
        </tr>
      </table>
      ${header}
      <div style="padding:24px;">
        <h1 style="margin:0 0 16px;font-size:18px;color:${THEME.brand};">${escapeHtml(heading)}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:16px 24px;background:${THEME.mist};border-top:1px solid ${THEME.border};color:${THEME.inkSoft};font-size:12px;">
        <span style="color:${THEME.brand};font-weight:bold;">Provet</span> &middot; No. 9, 1st Floor, 2nd Lane, Chakrapani Street, Guindy, Chennai - 600 032
      </div>
    </div>
  </body>
</html>`;
}

function detailRows(rows) {
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 12px 6px 0;color:${THEME.inkSoft};vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:${THEME.ink};font-weight:bold;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("")}</table>`;
}

// `enquiry` is the saved row; `productName` is resolved by the caller when the
// enquiry references a product.
async function sendCustomerEnquiryConfirmation(enquiry, productName = null) {
  const rows = [
    ["Subject", enquiry.subject],
    ["Product", productName],
    ["Submitted", formatWhen(enquiry.createdAt)],
  ];

  const text = [
    `Hi ${enquiry.name},`,
    "",
    "Thank you for contacting Provet. We have received your enquiry and our team will get back to you shortly.",
    "",
    "Your enquiry:",
    `  Subject  : ${enquiry.subject}`,
    ...(productName ? [`  Product  : ${productName}`] : []),
    `  Submitted: ${formatWhen(enquiry.createdAt)}`,
    "",
    enquiry.message,
    "",
    "- The Provet Team",
  ].join("\n");

  const logo = getLogoAttachment();
  const html = layout(
    `Thank you, ${enquiry.name}`,
    `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${THEME.inkSoft};">
       We have received your enquiry and our team will contact you shortly.
     </p>
     ${detailRows(rows)}
     <div style="margin-top:16px;padding:12px 16px;background:${THEME.mist};border-left:3px solid ${THEME.accent};border-radius:0 12px 12px 0;">
       <div style="font-size:12px;color:${THEME.inkSoft};margin-bottom:4px;">Your message</div>
       <div style="font-size:14px;color:${THEME.ink};white-space:pre-line;">${escapeHtml(enquiry.message)}</div>
     </div>`,
    { withLogo: Boolean(logo) }
  );

  return sendMail({
    to: enquiry.email,
    // Leads with the brand so the customer can see at a glance that Provet
    // received their enquiry, without relying on the From display name.
    subject: "Provet - We have received your enquiry",
    text,
    html,
    attachments: logo ? [logo] : undefined,
  });
}

async function sendVendorEnquiryNotification(enquiry, productName = null) {
  // Vendor address comes from the environment only - never from the request,
  // so a customer can't redirect the notification.
  const to = process.env.VENDOR_EMAIL;
  if (!to) {
    console.warn("[email] VENDOR_EMAIL is not set - skipping vendor notification.");
    return { sent: false, reason: "not-configured" };
  }

  const rows = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Phone", enquiry.phone],
    ["Product", productName],
    ["Subject", enquiry.subject],
    ["Received", formatWhen(enquiry.createdAt)],
  ];

  const text = [
    "New enquiry from the Provet website.",
    "",
    `  Name    : ${enquiry.name}`,
    `  Email   : ${enquiry.email}`,
    `  Phone   : ${enquiry.phone || "-"}`,
    ...(productName ? [`  Product : ${productName}`] : []),
    `  Subject : ${enquiry.subject}`,
    `  Received: ${formatWhen(enquiry.createdAt)}`,
    "",
    "Message:",
    enquiry.message,
  ].join("\n");

  const logo = getLogoAttachment();
  const html = layout(
    "New website enquiry",
    `${detailRows(rows)}
     <div style="margin-top:16px;padding:12px 16px;background:${THEME.mist};border-left:3px solid ${THEME.accent};border-radius:0 12px 12px 0;">
       <div style="font-size:12px;color:${THEME.inkSoft};margin-bottom:4px;">Message</div>
       <div style="font-size:14px;color:${THEME.ink};white-space:pre-line;">${escapeHtml(enquiry.message)}</div>
     </div>`,
    { withLogo: Boolean(logo) }
  );

  return sendMail({
    to,
    subject: `Provet - New enquiry from ${enquiry.name}`,
    text,
    html,
    // Lets staff reply straight to the customer; the From stays SMTP_FROM.
    replyTo: enquiry.email,
    attachments: logo ? [logo] : undefined,
  });
}

module.exports = {
  isEmailConfigured,
  verifyTransport,
  sendCustomerEnquiryConfirmation,
  sendVendorEnquiryNotification,
};
