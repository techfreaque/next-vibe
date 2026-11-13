/**
 * Outreach log parser - pure, no DB, no IO.
 *
 * Understands the formats the outreach agent writes:
 * - sent-log: one tab-separated line per email
 *   (date, name, email, angle, subject, status). Some writers emitted a
 *   literal backslash-t instead of a tab; both split the same.
 * - sent-log.md / replies-*.md: markdown tables. A header row containing an
 *   "Email" column defines the columns of the rows below it. Tables with a
 *   "Their response" column are inbound replies.
 * - free-text bullets "BOUNCE: ... email" and "REPLY: ... email".
 * Headings carrying a YYYY-MM-DD date date the rows that have no own timestamp.
 */

import type {
  OutreachContactKindValue,
  OutreachContactStatusValue,
  OutreachDirectionValue,
} from "../enum";
import {
  OutreachContactKind,
  OutreachContactStatus,
  OutreachDirection,
} from "../enum";
import { normalizeAngle, normalizeEmail } from "../pipeline";

export type ImportSkipReason =
  | "skip.noEmail"
  | "skip.noDate"
  | "skip.skippedStatus"
  | "skip.ignored"
  | "skip.columns";

export interface ParsedOutreachRow {
  source: string;
  line: number;
  at: Date;
  /** "day" when the log only carried a date */
  precision: "day" | "exact";
  email: string;
  name: string;
  angle: string | null;
  subject: string;
  /** null = status-only event (bounce), no touch */
  direction: typeof OutreachDirectionValue | null;
  status: typeof OutreachContactStatusValue;
  kind: typeof OutreachContactKindValue | null;
  note: string | null;
}

export interface SkippedOutreachLine {
  source: string;
  line: number;
  reason: ImportSkipReason;
}

export interface ParsedOutreachLog {
  rows: ParsedOutreachRow[];
  skipped: SkippedOutreachLine[];
}

const DATE_PATTERN = /\b(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}(?::\d{2})?)Z?)?/;
const MAX_TEXT = 300;

function parseDate(
  value: string,
): { at: Date; precision: "day" | "exact" } | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) {
    return null;
  }
  const iso = match[2] ? `${match[1]}T${match[2]}Z` : `${match[1]}T00:00:00Z`;
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) {
    return null;
  }
  return { at, precision: match[2] ? "exact" : "day" };
}

function clip(value: string): string {
  return value.trim().slice(0, MAX_TEXT);
}

/** printf-escaped "%%" leaked into some subjects */
function cleanSubject(value: string): string {
  return clip(value.replaceAll("%%", "%"));
}

function guessKind(
  name: string,
  angle: string | null,
): typeof OutreachContactKindValue | null {
  const lowerName = name.toLowerCase();
  if (/youtube|podcast|video-deal/.test(lowerName)) {
    return OutreachContactKind.CREATOR;
  }
  if (angle && /get-listed/i.test(angle)) {
    return OutreachContactKind.DIRECTORY;
  }
  return null;
}

function statusFromLog(raw: string): {
  status: typeof OutreachContactStatusValue;
  direction: typeof OutreachDirectionValue | null;
} | null {
  const value = raw.trim().toUpperCase();
  if (value.startsWith("SKIP")) {
    return null;
  }
  if (value.startsWith("BOUNCE")) {
    return { status: OutreachContactStatus.BOUNCED, direction: null };
  }
  if (value === "SENT-REPLY") {
    // Our reply inside a thread they answered
    return {
      status: OutreachContactStatus.REPLIED,
      direction: OutreachDirection.OUT,
    };
  }
  if (value.startsWith("REPL") || value === "RECEIVED") {
    return {
      status: OutreachContactStatus.REPLIED,
      direction: OutreachDirection.IN,
    };
  }
  return {
    status: OutreachContactStatus.SENT,
    direction: OutreachDirection.OUT,
  };
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

interface TableContext {
  columns: string[];
  inbound: boolean;
  creators: boolean;
}

function cellOf(
  table: TableContext,
  cells: readonly string[],
  ...names: string[]
): string {
  for (const name of names) {
    const index = table.columns.indexOf(name);
    if (index !== -1 && cells[index] !== undefined) {
      return cells[index];
    }
  }
  return "";
}

/**
 * Parse one log file's content.
 * @param source - label used in skipped-line reports (file name or "content")
 * @param ignoreEmails - lowercased addresses that are not outreach (e.g. the owner)
 */
export function parseOutreachLog(
  content: string,
  source: string,
  ignoreEmails: ReadonlySet<string> = new Set(),
): ParsedOutreachLog {
  const rows: ParsedOutreachRow[] = [];
  const skipped: SkippedOutreachLine[] = [];
  let headingDate: Date | null = null;
  let table: TableContext | null = null;

  const lines = content.split(/\r?\n/);
  for (const [index, rawLine] of lines.entries()) {
    const lineNo = index + 1;
    const line = rawLine.trim();
    if (line.length === 0) {
      table = null;
      continue;
    }

    if (line.startsWith("#")) {
      table = null;
      const dated = parseDate(line);
      if (dated) {
        headingDate = dated.at;
      }
      continue;
    }

    const skip = (reason: ImportSkipReason): void => {
      skipped.push({ source, line: lineNo, reason });
    };

    // ── Markdown table ─────────────────────────────────────────────────
    if (line.startsWith("|")) {
      if (/^\|[\s|:-]+\|?$/.test(line)) {
        continue;
      }
      const cells = splitTableRow(line);
      const lower = cells.map((cell) => cell.toLowerCase());
      if (lower.includes("email")) {
        table = {
          columns: lower,
          inbound: lower.includes("their response"),
          creators: lower.includes("creator"),
        };
        continue;
      }
      if (!table) {
        continue;
      }
      const email = normalizeEmail(cellOf(table, cells, "email"));
      if (!email) {
        skip("skip.noEmail");
        continue;
      }
      if (ignoreEmails.has(email)) {
        skip("skip.ignored");
        continue;
      }
      const name = clip(cellOf(table, cells, "creator", "name", "contact"));
      if (table.inbound) {
        if (!headingDate) {
          skip("skip.noDate");
          continue;
        }
        const response = cellOf(table, cells, "their response");
        const classification = cellOf(table, cells, "classification");
        rows.push({
          source,
          line: lineNo,
          at: headingDate,
          precision: "day",
          email,
          name: name || email,
          angle: null,
          subject: "",
          direction: OutreachDirection.IN,
          status: OutreachContactStatus.REPLIED,
          kind: table.creators ? OutreachContactKind.CREATOR : null,
          note:
            clip([response, classification].filter(Boolean).join(" · ")) ||
            null,
        });
        continue;
      }
      const statusCell = cellOf(table, cells, "status");
      const mapped = statusFromLog(statusCell || "sent");
      if (!mapped) {
        skip("skip.skippedStatus");
        continue;
      }
      const dated =
        parseDate(cellOf(table, cells, "utc timestamp", "timestamp", "date")) ??
        (headingDate ? { at: headingDate, precision: "day" as const } : null);
      if (!dated) {
        skip("skip.noDate");
        continue;
      }
      const angle = normalizeAngle(cellOf(table, cells, "angle"));
      rows.push({
        source,
        line: lineNo,
        at: dated.at,
        precision: dated.precision,
        email,
        name: name || email,
        angle,
        subject: cleanSubject(cellOf(table, cells, "subject")),
        direction: mapped.direction,
        status: mapped.status,
        kind: table.creators
          ? OutreachContactKind.CREATOR
          : guessKind(name, angle),
        note: null,
      });
      continue;
    }
    table = null;

    // ── Free-text bounce / reply bullets ───────────────────────────────
    const bullet = /^(?:[-*]\s*)?(BOUNCE|REPLY)\s*:\s*(.*)$/i.exec(line);
    if (bullet) {
      const email = normalizeEmail(bullet[2]);
      if (!email) {
        skip("skip.noEmail");
        continue;
      }
      if (ignoreEmails.has(email)) {
        skip("skip.ignored");
        continue;
      }
      if (!headingDate) {
        skip("skip.noDate");
        continue;
      }
      const isBounce = bullet[1].toUpperCase() === "BOUNCE";
      const name = clip(bullet[2].split(/[(—]/)[0] ?? "");
      rows.push({
        source,
        line: lineNo,
        at: headingDate,
        precision: "day",
        email,
        name: isBounce || name.includes("@") || !name ? email : name,
        angle: null,
        subject: "",
        direction: isBounce ? null : OutreachDirection.IN,
        status: isBounce
          ? OutreachContactStatus.BOUNCED
          : OutreachContactStatus.REPLIED,
        kind: null,
        note: clip(bullet[2].split("—").slice(1).join("—")) || null,
      });
      continue;
    }

    // ── Tab-separated sent-log line ────────────────────────────────────
    const fields = line.split(/\t|\\t/).map((field) => field.trim());
    if (fields.length < 2 || !DATE_PATTERN.test(fields[0])) {
      // Prose, notes, totals: not data
      continue;
    }
    if (fields.length < 5) {
      skip("skip.columns");
      continue;
    }
    const [dateField, nameField, emailField, angleField, subjectField] = fields;
    const statusField = fields[5] ?? "SENT";
    const dated = parseDate(dateField);
    if (!dated) {
      skip("skip.noDate");
      continue;
    }
    const email = normalizeEmail(emailField);
    if (!email) {
      skip("skip.noEmail");
      continue;
    }
    if (ignoreEmails.has(email)) {
      skip("skip.ignored");
      continue;
    }
    const mapped = statusFromLog(statusField);
    if (!mapped) {
      skip("skip.skippedStatus");
      continue;
    }
    const angle = normalizeAngle(angleField);
    const name = clip(nameField) || email;
    rows.push({
      source,
      line: lineNo,
      at: dated.at,
      precision: dated.precision,
      email,
      name,
      angle,
      subject: cleanSubject(subjectField),
      direction: mapped.direction,
      status: mapped.status,
      kind: guessKind(name, angle),
      note: null,
    });
  }

  return { rows, skipped };
}

/** Dedupe key for a touch: same contact email, direction, UTC day and subject. */
export function touchKey(
  email: string,
  direction: typeof OutreachDirectionValue,
  at: Date,
  subject: string,
): string {
  return [
    email,
    direction,
    at.toISOString().slice(0, 10),
    subject.trim().toLowerCase(),
  ].join("|");
}
