/**
 * System mailbox - config resolution, message composition, send path (mocked
 * transport + rate guard) and the daily report composer. No network, no DB.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { describe, expect, it } from "vitest";

import type { MessengerAccount } from "../accounts/db";
import { composeMessage, isValidRecipient } from "./compose";
import type { SystemMailboxEnvValues } from "./config";
import { resolveSystemMailboxConfig } from "./config";
import { scopedTranslation } from "./i18n";
import type { ReportQueryRunner, ReportRow } from "./report/composer";
import { collectReportData, composeReport } from "./report/composer";
import type { SystemMailboxDeps } from "./repository";
import { SystemMailboxRepository } from "./repository";

const ENV: SystemMailboxEnvValues = {
  THEA_MAIL_ADDRESS: "ops@example.com",
  THEA_MAIL_HOST: "mail.example.com",
  THEA_MAIL_PASSWORD: "test-secret",
  THEA_MAIL_REPORT_TO: "founder@example.com",
  THEA_MAIL_RATE_LIMIT_PER_HOUR: 3,
};

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

function makeRow(overrides: Partial<MessengerAccount>): MessengerAccount {
  // Minimal row; unrelated columns are irrelevant to config resolution.
  const base: Partial<MessengerAccount> = {
    id: "00000000-0000-4000-8000-000000000001",
    smtpFromName: "Platform",
    isSystem: true,
  };
  return { ...base, ...overrides } as MessengerAccount;
}

describe("resolveSystemMailboxConfig", () => {
  it("resolves host, user and ports from env", () => {
    const config = resolveSystemMailboxConfig(null, ENV);
    expect(config).not.toBeNull();
    expect(config?.smtp).toMatchObject({
      host: "mail.example.com",
      port: 465,
      secure: true,
      username: "ops@example.com",
    });
    expect(config?.imap).toMatchObject({
      host: "mail.example.com",
      port: 993,
      secure: true,
      username: "ops@example.com",
    });
    expect(config?.rateLimitPerHour).toBe(3);
    expect(config?.reportTo).toBe("founder@example.com");
  });

  it("returns null when the password is missing everywhere", () => {
    expect(
      resolveSystemMailboxConfig(null, { ...ENV, THEA_MAIL_PASSWORD: undefined }),
    ).toBeNull();
  });

  it("lets env win and the designated row fill the gaps", () => {
    const row = makeRow({
      smtpHost: "row.example.com",
      smtpFromEmail: "row@example.com",
      smtpUsername: "row@example.com",
    });
    const gap = resolveSystemMailboxConfig(row, {
      THEA_MAIL_PASSWORD: "pw",
    });
    expect(gap?.smtp.host).toBe("row.example.com");
    expect(gap?.accountId).toBe(row.id);
    const env = resolveSystemMailboxConfig(row, ENV);
    expect(env?.smtp.host).toBe("mail.example.com");
    expect(env?.address).toBe("ops@example.com");
  });
});

describe("composeMessage", () => {
  const config = resolveSystemMailboxConfig(null, ENV);

  it("builds a plain-text RFC822 message with the right headers", async () => {
    if (!config) {
      throw new Error("config missing");
    }
    const msg = await composeMessage(config, {
      to: "founder@example.com",
      subject: "Hello\r\nBcc: evil@example.com",
      text: "Body line",
    });
    const raw = msg.raw.toString("utf8");
    expect(raw).toContain("To: founder@example.com");
    expect(raw).toContain("ops@example.com");
    expect(raw).toContain("Body line");
    expect(raw).not.toMatch(/^Bcc:/m);
    expect(msg.subject).toBe("Hello Bcc: evil@example.com");
    expect(msg.messageId).toMatch(/^<.+@example\.com>$/);
  });

  it("accepts exactly one recipient", () => {
    expect(isValidRecipient("a@b.co")).toBe(true);
    expect(isValidRecipient("a@b.co, c@d.co")).toBe(false);
    expect(isValidRecipient("a@b.co;c@d.co")).toBe(false);
    expect(isValidRecipient("nope")).toBe(false);
  });
});

interface Calls {
  sent: string[];
  appended: number;
  recorded: number;
}

function makeDeps(
  state: { sentLastHour: number; appendFails?: boolean; smtpFails?: boolean },
  calls: Calls,
): SystemMailboxDeps {
  return {
    env: () => ENV,
    loadRow: () => Promise.resolve(makeRow({ id: "acc-1" })),
    sendRaw: (_config, message) => {
      if (state.smtpFails) {
        return Promise.reject(new Error("550 rejected"));
      }
      calls.sent.push(message.to);
      return Promise.resolve();
    },
    appendSent: () => {
      if (state.appendFails) {
        return Promise.reject(new Error("imap down"));
      }
      calls.appended += 1;
      return Promise.resolve("Sent");
    },
    countSentSince: () => Promise.resolve(state.sentLastHour),
    recordSent: () => {
      calls.recorded += 1;
      return Promise.resolve();
    },
    listInbox: () => Promise.resolve([]),
    readMessage: () => Promise.resolve(null),
    now: () => new Date("2026-11-07T10:00:00Z"),
  };
}

describe("SystemMailboxRepository.send", () => {
  const input = { to: "founder@example.com", subject: "Hi", text: "Body" };

  it("sends, records and files the message in Sent", async () => {
    const calls: Calls = { sent: [], appended: 0, recorded: 0 };
    SystemMailboxRepository.deps = makeDeps({ sentLastHour: 0 }, calls);
    const result = await SystemMailboxRepository.send(input, undefined, logger, t);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.storedInSent).toBe(true);
      expect(result.data.sentFolder).toBe("Sent");
      expect(result.data.sentLastHour).toBe(1);
    }
    expect(calls).toEqual({ sent: ["founder@example.com"], appended: 1, recorded: 1 });
  });

  it("blocks at the hourly limit and sends nothing", async () => {
    const calls: Calls = { sent: [], appended: 0, recorded: 0 };
    SystemMailboxRepository.deps = makeDeps({ sentLastHour: 3 }, calls);
    const result = await SystemMailboxRepository.send(input, undefined, logger, t);
    expect(result.success).toBe(false);
    expect(calls).toEqual({ sent: [], appended: 0, recorded: 0 });
  });

  it("still succeeds when only the Sent append fails", async () => {
    const calls: Calls = { sent: [], appended: 0, recorded: 0 };
    SystemMailboxRepository.deps = makeDeps(
      { sentLastHour: 0, appendFails: true },
      calls,
    );
    const result = await SystemMailboxRepository.send(input, undefined, logger, t);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.storedInSent).toBe(false);
      expect(result.data.sentFolder).toBeNull();
    }
    expect(calls.recorded).toBe(1);
  });

  it("fails and records nothing when SMTP rejects", async () => {
    const calls: Calls = { sent: [], appended: 0, recorded: 0 };
    SystemMailboxRepository.deps = makeDeps(
      { sentLastHour: 0, smtpFails: true },
      calls,
    );
    const result = await SystemMailboxRepository.send(input, undefined, logger, t);
    expect(result.success).toBe(false);
    expect(calls.recorded).toBe(0);
    expect(calls.appended).toBe(0);
  });

  it("rejects a recipient list before touching the transport", async () => {
    const calls: Calls = { sent: [], appended: 0, recorded: 0 };
    SystemMailboxRepository.deps = makeDeps({ sentLastHour: 0 }, calls);
    const result = await SystemMailboxRepository.send(
      { ...input, to: "a@b.co, c@d.co" },
      undefined,
      logger,
      t,
    );
    expect(result.success).toBe(false);
    expect(calls.sent).toEqual([]);
  });
});

describe("daily report composer", () => {
  function runner(rows: Record<string, ReportRow[]>, missing: string[]): ReportQueryRunner {
    return {
      tableExists: (table) => Promise.resolve(!missing.includes(table)),
      rows: (query) => {
        for (const [needle, value] of Object.entries(rows)) {
          if (query.includes(needle)) {
            return Promise.resolve(value);
          }
        }
        return Promise.resolve([]);
      },
    };
  }

  it("composes a plain-text report and skips sections with missing tables", async () => {
    const data = await collectReportData(
      runner(
        {
          "FROM users": [{ new_users: "4", total_users: "120" }],
          "FROM credit_transactions": [
            { spent: 12.5, bought: 40, usage_events: 9 },
          ],
          "FROM error_logs": [{ distinct_errors: 2, occurrences: 7 }],
        },
        ["task_incidents", "growth_journeys"],
      ),
      { now: new Date("2026-11-07T06:00:00Z"), windowHours: 24, instance: "unbottled" },
    );
    const report = composeReport(data);
    expect(report.subject).toBe("[unbottled] Daily status 2026-11-07");
    expect(report.body).toContain("SIGNUPS");
    expect(report.body).toContain("New users: 4");
    expect(report.body).toContain("Credits spent: 12.5");
    expect(report.body).toContain("Distinct errors: 2 (7 occurrences)");
    expect(report.body).toContain("SKIPPED");
    expect(report.skippedKeys).toEqual(["funnel", "incidents"]);
    expect(report.sectionKeys).toContain("signups");
    expect(report.body).not.toContain("<");
  });

  it("skips a section whose query throws instead of failing the report", async () => {
    const failing: ReportQueryRunner = {
      tableExists: () => Promise.resolve(true),
      rows: () => Promise.reject(new Error("boom")),
    };
    const data = await collectReportData(failing, {
      now: new Date("2026-11-07T06:00:00Z"),
      windowHours: 24,
      instance: "unbottled",
    });
    expect(data.sections).toEqual([]);
    expect(data.skipped.length).toBe(8);
    expect(composeReport(data).body).toContain("boom");
  });
});
