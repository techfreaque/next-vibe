import "server-only";

import { Buffer } from "node:buffer";

import { createTransport } from "nodemailer";

import { prepareSmtpEmailLogo } from "./inline-logo";
import { resolvePlainText } from "./plain-text";

/**
 * Raw RFC 822 copy of a sent mail for the IMAP Sent folder. Same MIME as the
 * SMTP send: multipart/related with the inline cid logo, nothing remote.
 */
export async function buildSentCopy(msg: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  messageId: string;
  date: Date;
}): Promise<Buffer> {
  const preparedLogo = prepareSmtpEmailLogo(msg.html);
  const { message } = await createTransport({
    streamTransport: true,
    buffer: true,
    newline: "windows",
  }).sendMail({
    from: msg.from,
    to: msg.to,
    subject: msg.subject,
    date: msg.date,
    messageId: msg.messageId,
    html: preparedLogo.html,
    attachments: preparedLogo.attachments,
    text: resolvePlainText(msg.html, msg.text),
  });
  return Buffer.isBuffer(message) ? message : Buffer.from(String(message));
}
