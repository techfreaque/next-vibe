import { EventEmitter } from "node:events";

import { expect, it, mock } from "bun:test";

import type { SystemMailboxConfig } from "./config";

const attempts: string[] = [];
const destroyed: string[] = [];
const scanned: string[] = [];
const ended: string[] = [];

class FixtureImap extends EventEmitter {
  constructor(private readonly password: string) {
    super();
  }

  connect(): void {
    attempts.push(this.password);
    if (this.password === "stale-fixture") {
      this.emit("error", new Error("Authentication failed"));
      return;
    }
    this.emit("ready");
  }

  destroy(): void {
    destroyed.push(this.password);
  }

  openBox(
    name: string,
    readOnly: boolean,
    done: (error: null, box: { newKeywords: boolean }) => void,
  ): void {
    expect(name).toBe("INBOX");
    expect(readOnly).toBe(false);
    scanned.push(this.password);
    done(null, { newKeywords: false });
  }

  search(
    criteria: readonly string[],
    done: (error: null, uids: number[]) => void,
  ): void {
    expect(criteria).toContain("UNSEEN");
    done(null, []);
  }

  end(): void {
    ended.push(this.password);
  }
}

mock.module("@/messenger/providers/email/imap-client/safe-imap", () => ({
  createImap: ({ password }: SystemMailboxConfig["imap"]): FixtureImap =>
    new FixtureImap(password),
}));

it("identifies socket failures when an IMAP aggregate has no message", async () => {
  const { describeImapFailure } = await import("./imap-ops");
  const failure = new AggregateError([
    Object.assign(new Error("connect 192.0.2.1"), { code: "ECONNREFUSED" }),
    Object.assign(new Error("connect 2001:db8::1"), { code: "ENETUNREACH" }),
  ]);
  const details = describeImapFailure(
    {
      host: "mail.example.test",
      port: 993,
      secure: true,
      username: "sender@example.test",
      password: "fixture-password",
    },
    failure,
  );
  expect(details.responseText).toBe("AggregateError");
  expect(details.socketCodes).toEqual(["ECONNREFUSED", "ENETUNREACH"]);
  expect(JSON.stringify(details)).not.toContain("connect ");
});

it("closes a rejected IMAP login and scans once using the next configuration", async () => {
  const { visitDeliveryReports } = await import("./imap-ops");
  const mailbox = {
    host: "mail.example.test",
    port: 993,
    secure: true,
    username: "sender@example.test",
    password: "stale-fixture",
  };
  const failures: string[] = [];
  expect(
    await visitDeliveryReports(
      [mailbox, { ...mailbox, password: "current-fixture" }],
      (config, error) => failures.push(`${config.host}: ${error.message}`),
      new Date("2026-11-20T00:00:00Z"),
      async () => null,
    ),
  ).toBe(true);
  expect(attempts).toEqual(["stale-fixture", "current-fixture"]);
  expect(destroyed).toEqual(["stale-fixture"]);
  expect(scanned).toEqual(["current-fixture"]);
  expect(ended).toEqual(["current-fixture"]);
  expect(failures).toEqual(["mail.example.test: Authentication failed"]);
});
