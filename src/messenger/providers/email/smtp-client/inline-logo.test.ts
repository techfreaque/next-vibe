import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

import { expect, test } from "bun:test";
import { simpleParser } from "mailparser";
import { createTransport } from "nodemailer";

import { buildSentCopy } from "./sent-copy";
import { getEmailLogoBytes, prepareSmtpEmailLogo } from "./inline-logo";

const html = '<p>Hello</p><img src="cid:logo@unbottled.ai" alt="unbottled.ai">';

test.each([false, true])(
  "SMTP groups the HTML and its inline PNG in multipart/related (plain text: %s)",
  async (withText) => {
    const transport = createTransport({ streamTransport: true, buffer: true });
    const { message } = await transport.sendMail({
      from: "sender@example.invalid",
      to: "recipient@example.invalid",
      subject: "Logo MIME test",
      text: withText ? "Hello" : undefined,
      ...(prepareSmtpEmailLogo(html)),
    });
    assert(
      Buffer.isBuffer(message),
      "Expected the raw MIME message as a buffer",
    );

    const raw = message.toString("utf8");
    expect(raw).toContain('Content-Type: multipart/related; type="text/html"');
    expect(raw).toContain("Content-Type: image/png");
    expect(raw).toContain("Content-ID: <logo@unbottled.ai>");
    expect(raw).toContain("Content-Disposition: inline;");
    expect(raw.includes("Content-Type: multipart/alternative;")).toBe(withText);

    const parsed = await simpleParser(message, { skipImageLinks: true });
    expect(parsed.html).toContain('src="cid:logo@unbottled.ai"');
    expect(parsed.html).not.toContain("data:image/");
    expect(parsed.attachments).toHaveLength(1);
    const [logo] = parsed.attachments;
    assert(logo, "Expected an inline logo attachment");
    expect(logo).toMatchObject({
      filename: "unbottled-email-logo.png",
      contentId: "<logo@unbottled.ai>",
      contentType: "image/png",
      contentDisposition: "inline",
      related: true,
    });
    expect(logo.content.subarray(0, 8).toString("hex")).toBe(
      "89504e470d0a1a0a",
    );
    expect(logo.content.readUInt32BE(16)).toBe(56);
    expect(logo.content.readUInt32BE(20)).toBe(56);
    expect(logo.size).toBeLessThanOrEqual(15_000);
  },
);

test("the logo is bundled, so no remote URL is ever produced", () => {
  const prepared = prepareSmtpEmailLogo(html);
  expect(prepared.html).toBe(html);
  expect(prepared.html).not.toMatch(/src="https?:/);
  expect(prepared.attachments).toHaveLength(1);
  expect(prepareSmtpEmailLogo("<p>Hello</p>")).toEqual({
    html: "<p>Hello</p>",
  });
});

test("the bundled logo matches public/images/unbottled-email-logo.png", async () => {
  const file = await Bun.file("public/images/unbottled-email-logo.png").bytes();
  expect(Buffer.compare(getEmailLogoBytes(), Buffer.from(file))).toBe(0);
});

test("the IMAP Sent copy is multipart/related with the inline cid logo", async () => {
  const raw = await buildSentCopy({
    from: "sender@example.invalid",
    to: "recipient@example.invalid",
    subject: "Sent copy",
    html,
    messageId: "<sent-copy@example.invalid>",
    date: new Date("2026-11-27T10:00:00Z"),
  });
  const text = raw.toString("utf8");
  expect(text).toContain('multipart/related; type="text/html"');
  expect(text).toContain("Content-ID: <logo@unbottled.ai>");
  expect(text).toContain("Message-ID: <sent-copy@example.invalid>");
  expect(text).not.toMatch(/https?:\/\/[^\s"]*\.png/);
  const parsed = await simpleParser(raw, { skipImageLinks: true });
  expect(parsed.html).toContain('src="cid:logo@unbottled.ai"');
  expect(parsed.attachments).toHaveLength(1);
});
