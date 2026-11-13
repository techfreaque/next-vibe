/**
 * System Mailbox Message Composition
 * Builds one RFC822 message. The same raw bytes are sent over SMTP and
 * appended to the IMAP Sent folder, so both copies are identical.
 */

import "server-only";

import type { Readable } from "node:stream";

import { createTransport } from "nodemailer";

import type { SystemMailboxConfig } from "./config";

export interface ComposeInput {
  to: string;
  subject: string;
  text: string;
  html?: string | undefined;
}

export interface ComposedMessage {
  raw: Buffer;
  messageId: string;
  from: string;
  to: string;
  subject: string;
}

async function toBuffer(message: Buffer | Readable): Promise<Buffer> {
  if (Buffer.isBuffer(message)) {
    return message;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of message) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export function isValidRecipient(value: string): boolean {
  // Single address only - no lists, no separators. Keeps this a 1:1 send path.
  return /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value.trim());
}

export function stripHeaderBreaks(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function composeMessage(
  config: SystemMailboxConfig,
  input: ComposeInput,
  now: Date = new Date(),
): Promise<ComposedMessage> {
  const domain = config.address.split("@")[1] ?? "localhost";
  const messageId = `<${now.getTime().toString(36)}.${Math.random()
    .toString(36)
    .slice(2, 10)}@${domain}>`;
  const subject = stripHeaderBreaks(input.subject);
  const to = input.to.trim();

  // Stream transport compiles the RFC822 message without any network I/O.
  const builder = createTransport({
    streamTransport: true,
    buffer: true,
    newline: "windows",
  });
  const built = await builder.sendMail({
    from: { name: config.fromName, address: config.address },
    to,
    subject,
    text: input.text,
    html: input.html,
    messageId,
    date: now,
    headers: { "Auto-Submitted": "auto-generated" },
  });
  const raw = await toBuffer(built.message);
  return { raw, messageId, from: config.address, to, subject };
}
