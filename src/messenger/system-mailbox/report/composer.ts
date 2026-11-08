/**
 * Daily Status Report - data collection + plain-text composition.
 * Collection is defensive: every section checks its table exists and is
 * skipped (with a reason) on any failure, so one missing table never blocks
 * the report. Composition is pure and unit-tested.
 */

import { CreditTransactionType } from "@/credits/enum";
import { collectFinanceDigestLines } from "@/finance/digest";
import { SubscriptionStatus } from "@/subscription/enum";

export type ReportRow = Record<string, string | number | null>;

/** Minimal query surface so tests can run the collector without a database. */
export interface ReportQueryRunner {
  tableExists(table: string): Promise<boolean>;
  /** `since` is the window start; queries reference it as `{{since}}`. */
  rows(query: string, since: Date): Promise<ReportRow[]>;
}

export interface ReportSection {
  key: string;
  title: string;
  lines: string[];
}

export interface ReportSkip {
  key: string;
  reason: string;
}

export interface ReportData {
  generatedAt: Date;
  windowHours: number;
  instance: string;
  sections: ReportSection[];
  skipped: ReportSkip[];
}

export interface ComposedReport {
  subject: string;
  body: string;
  sectionKeys: string[];
  skippedKeys: string[];
}

function num(row: ReportRow | undefined, key: string): number {
  const value = row?.[key];
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function str(row: ReportRow | undefined, key: string): string {
  const value = row?.[key];
  return value === null || value === undefined ? "" : String(value);
}

function fmt(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

interface SectionSpec {
  key: string;
  title: string;
  tables: string[];
  collect: (
    run: ReportQueryRunner,
    since: Date,
    now: Date,
  ) => Promise<string[]>;
}

const SECTION_SPECS: SectionSpec[] = [
  {
    key: "finance",
    title: "Finance",
    tables: ["finance_source_status", "finance_daily_rollups"],
    collect: (run, since, now) => collectFinanceDigestLines(run, now, since),
  },
  {
    key: "signups",
    title: "Signups",
    tables: ["users"],
    collect: async (run, since) => {
      const [row] = await run.rows(
        `SELECT count(*) FILTER (WHERE created_at >= '{{since}}') AS new_users, count(*) AS total_users FROM users`,
        since,
      );
      return [
        `New users: ${fmt(num(row, "new_users"))}`,
        `Total users: ${fmt(num(row, "total_users"))}`,
      ];
    },
  },
  {
    key: "subscriptions",
    title: "Subscriptions",
    tables: ["subscriptions"],
    collect: async (run, since) => {
      const [row] = await run.rows(
        `SELECT count(*) FILTER (WHERE status IN ('${SubscriptionStatus.ACTIVE}','${SubscriptionStatus.TRIALING}')) AS active_subs, count(*) FILTER (WHERE created_at >= '{{since}}') AS new_subs, count(*) FILTER (WHERE canceled_at >= '{{since}}') AS canceled FROM subscriptions`,
        since,
      );
      return [
        `Active subscriptions: ${fmt(num(row, "active_subs"))}`,
        `New: ${fmt(num(row, "new_subs"))}, canceled: ${fmt(num(row, "canceled"))}`,
      ];
    },
  },
  {
    key: "credits",
    title: "Credits",
    tables: ["credit_transactions"],
    collect: async (run, since) => {
      const [row] = await run.rows(
        `SELECT coalesce(-sum(amount) FILTER (WHERE type = '${CreditTransactionType.USAGE}'), 0) AS spent, coalesce(sum(amount) FILTER (WHERE type = '${CreditTransactionType.PURCHASE}'), 0) AS bought, count(*) FILTER (WHERE type = '${CreditTransactionType.USAGE}') AS usage_events FROM credit_transactions WHERE created_at >= '{{since}}'`,
        since,
      );
      return [
        `Credits spent: ${fmt(num(row, "spent"))} (${fmt(num(row, "usage_events"))} usage events)`,
        `Credits purchased: ${fmt(num(row, "bought"))}`,
      ];
    },
  },
  {
    key: "funnel",
    title: "Funnel",
    tables: ["growth_journeys"],
    collect: async (run, since) => {
      const [row] = await run.rows(
        `SELECT count(*) FILTER (WHERE first_touch_at >= '{{since}}') AS visits, count(*) FILTER (WHERE first_chat_at >= '{{since}}') AS chats, count(*) FILTER (WHERE signed_up_at >= '{{since}}') AS signups, count(*) FILTER (WHERE first_paid_at >= '{{since}}') AS paid, count(*) FILTER (WHERE retained_at >= '{{since}}') AS retained FROM growth_journeys`,
        since,
      );
      return [
        `Visits ${fmt(num(row, "visits"))} > chat ${fmt(num(row, "chats"))} > signup ${fmt(num(row, "signups"))} > paid ${fmt(num(row, "paid"))} > retained ${fmt(num(row, "retained"))}`,
      ];
    },
  },
  {
    key: "incidents",
    title: "Task incidents",
    tables: ["task_incidents"],
    collect: async (run, since) => {
      const [counts] = await run.rows(
        `SELECT count(*) FILTER (WHERE created_at >= '{{since}}') AS opened, count(*) FILTER (WHERE resolved_at IS NULL) AS open_now FROM task_incidents`,
        since,
      );
      const open = await run.rows(
        `SELECT task_name, type, reason FROM task_incidents WHERE resolved_at IS NULL ORDER BY created_at DESC LIMIT 5`,
        since,
      );
      const lines = [
        `Opened in window: ${fmt(num(counts, "opened"))}, open now: ${fmt(num(counts, "open_now"))}`,
      ];
      for (const item of open) {
        lines.push(
          `- ${str(item, "task_name")} [${str(item, "type")}] ${str(item, "reason").slice(0, 120)}`,
        );
      }
      return lines;
    },
  },
  {
    key: "tasks",
    title: "Cron runs",
    tables: ["cron_task_executions"],
    collect: async (run, since) => {
      const [row] = await run.rows(
        `SELECT count(*) AS runs, count(*) FILTER (WHERE status IN ('status.failed','status.timeout')) AS failed FROM cron_task_executions WHERE started_at >= '{{since}}'`,
        since,
      );
      return [
        `Runs: ${fmt(num(row, "runs"))}, failed or timed out: ${fmt(num(row, "failed"))}`,
      ];
    },
  },
  {
    key: "errors",
    title: "Production errors",
    tables: ["error_logs"],
    collect: async (run, since) => {
      const [row] = await run.rows(
        `SELECT count(*) AS distinct_errors, coalesce(sum(occurrences), 0) AS occurrences FROM error_logs WHERE level = 'error' AND created_at >= '{{since}}'`,
        since,
      );
      const top = await run.rows(
        `SELECT message, occurrences FROM error_logs WHERE level = 'error' AND created_at >= '{{since}}' ORDER BY occurrences DESC LIMIT 3`,
        since,
      );
      const lines = [
        `Distinct errors: ${fmt(num(row, "distinct_errors"))} (${fmt(num(row, "occurrences"))} occurrences)`,
      ];
      for (const item of top) {
        lines.push(
          `- ${fmt(num(item, "occurrences"))}x ${str(item, "message").slice(0, 120)}`,
        );
      }
      return lines;
    },
  },
];

export async function collectReportData(
  run: ReportQueryRunner,
  options: { now: Date; windowHours: number; instance: string },
): Promise<ReportData> {
  const since = new Date(options.now.getTime() - options.windowHours * 3600000);
  const sections: ReportSection[] = [];
  const skipped: ReportSkip[] = [];

  for (const spec of SECTION_SPECS) {
    try {
      let missing: string | null = null;
      for (const table of spec.tables) {
        if (!(await run.tableExists(table))) {
          missing = table;
          break;
        }
      }
      if (missing) {
        skipped.push({ key: spec.key, reason: `table ${missing} missing` });
        continue;
      }
      const lines = await spec.collect(run, since, options.now);
      sections.push({ key: spec.key, title: spec.title, lines });
    } catch (error) {
      skipped.push({
        key: spec.key,
        reason: error instanceof Error ? error.message.slice(0, 120) : "failed",
      });
    }
  }

  return {
    generatedAt: options.now,
    windowHours: options.windowHours,
    instance: options.instance,
    sections,
    skipped,
  };
}

/** Pure: report data in, subject + plain-text body out. */
export function composeReport(data: ReportData): ComposedReport {
  const day = data.generatedAt.toISOString().slice(0, 10);
  const subject = `[${data.instance}] Daily status ${day}`;
  const out: string[] = [
    `Platform status - last ${data.windowHours}h`,
    `Generated ${data.generatedAt.toISOString()}`,
    "",
  ];
  for (const section of data.sections) {
    out.push(section.title.toUpperCase());
    for (const line of section.lines) {
      out.push(`  ${line}`);
    }
    out.push("");
  }
  if (data.skipped.length > 0) {
    out.push("SKIPPED");
    for (const item of data.skipped) {
      out.push(`  ${item.key}: ${item.reason}`);
    }
    out.push("");
  }
  return {
    subject,
    body: `${out.join("\n").trimEnd()}\n`,
    sectionKeys: data.sections.map((s) => s.key),
    skippedKeys: data.skipped.map((s) => s.key),
  };
}
