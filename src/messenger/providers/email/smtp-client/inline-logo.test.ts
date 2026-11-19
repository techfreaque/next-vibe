import assert from "node:assert/strict";
import { Buffer } from "node:buffer";

import { expect, test } from "bun:test";
import { simpleParser } from "mailparser";
import { coreClientEnv } from "next-vibe/core/env-client";
import { createTransport } from "nodemailer";

import { EMAIL_LOGO_FALLBACK_PATH, withHostedEmailLogo } from "./email-logo";
import { prepareSmtpEmailLogo } from "./inline-logo";

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
      ...(await prepareSmtpEmailLogo(html)),
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

test("a hosted fallback and HTML without the logo need no attachment", async () => {
  const hosted = withHostedEmailLogo(html);
  const url = new URL(
    EMAIL_LOGO_FALLBACK_PATH,
    coreClientEnv.NEXT_PUBLIC_APP_URL,
  );
  expect(hosted).toContain(`src="${url.href}"`);
  expect(hosted).not.toContain("cid:");
  expect(await prepareSmtpEmailLogo(hosted)).toEqual({ html: hosted });
  expect(await prepareSmtpEmailLogo("<p>Hello</p>")).toEqual({
    html: "<p>Hello</p>",
  });
});
