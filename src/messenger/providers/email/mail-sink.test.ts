/**
 * Mail sink: non-production never reaches a real mail server.
 */

import { describe, expect, it } from "bun:test";
import { readFile } from "node:fs/promises";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { Environment } from "next-vibe/env/env-util";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  createMailSinkTransport,
  isMailSinkActive,
  shouldSinkMail,
} from "./mail-sink";

const logger = createEndpointLogger(false, defaultLocale);

describe("shouldSinkMail", () => {
  it("always sinks in tests, even with the real-SMTP flag", () => {
    expect(shouldSinkMail(Environment.TEST, false)).toBe(true);
    expect(shouldSinkMail(Environment.TEST, true)).toBe(true);
  });

  it("sinks in development unless VIBE_DEV_REAL_SMTP=true", () => {
    expect(shouldSinkMail(Environment.DEVELOPMENT, false)).toBe(true);
    expect(shouldSinkMail(Environment.DEVELOPMENT, true)).toBe(false);
  });

  it("never sinks in production", () => {
    expect(shouldSinkMail(Environment.PRODUCTION, false)).toBe(false);
    expect(shouldSinkMail(Environment.PRODUCTION, true)).toBe(false);
  });

  it("is active in this test run", () => {
    expect(isMailSinkActive()).toBe(true);
  });
});

describe("createMailSinkTransport", () => {
  it("stores the rendered mail and reports it accepted", async () => {
    const transport = createMailSinkTransport(logger);
    expect(await transport.verify()).toBe(true);

    const info = await transport.sendMail({
      from: "Unbottled <noreply@example.com>",
      to: "sink-test@example.com",
      subject: "Sink subject check",
      text: "plain body",
      html: "<p>html body</p>",
    });

    expect(info.accepted).toEqual(["sink-test@example.com"]);
    expect(info.rejected).toEqual([]);
    const file = info.response.replace("250 mail-sink ", "");
    expect(file).toContain("mail-sink");
    const raw = await readFile(file, "utf8");
    expect(raw).toContain("Subject: Sink subject check");
    expect(raw).toContain("sink-test@example.com");
  });
});
