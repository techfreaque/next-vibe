/**
 * Outreach Import - Repository
 * Server-only.
 *
 * Two passes: fold every parsed row (oldest first) into a per-email state in
 * memory, then write the new contacts, the changed contacts and the new
 * touches. Re-importing the same log writes nothing.
 */

import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { eq, inArray } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { outreachContacts, outreachTouches } from "../db";
import type {
  OutreachContactKindValue,
  OutreachContactStatusValue,
} from "../enum";
import {
  OutreachContactKind,
  OutreachContactStatus,
  OutreachDirection,
} from "../enum";
import type { OutreachT } from "../i18n";
import { mergeStatus, normalizeEmail } from "../pipeline";
import { OutreachContactStore } from "../repository";
import { OUTREACH_IMPORT_MAX_SKIPPED_DETAIL } from "./constants";
import type {
  OutreachImportRequestOutput,
  OutreachImportResponseOutput,
} from "./definition";
import {
  type ParsedOutreachRow,
  parseOutreachLog,
  type SkippedOutreachLine,
  touchKey,
} from "./parser";

const INSERT_CHUNK = 500;

interface ContactState {
  id: string | null;
  name: string;
  kind: typeof OutreachContactKindValue;
  angle: string | null;
  status: typeof OutreachContactStatusValue | null;
  original: {
    kind: typeof OutreachContactKindValue;
    angle: string | null;
    status: typeof OutreachContactStatusValue | null;
  } | null;
  newTouches: ParsedOutreachRow[];
}

type SourceSkipReason = "skip.unreadable" | "skip.outsideTmp";

export class OutreachImportRepository {
  static async import(
    data: OutreachImportRequestOutput,
    logger: EndpointLogger,
    t: OutreachT,
  ): Promise<ResponseType<OutreachImportResponseOutput>> {
    const filePaths = (data.filePaths ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    if (!data.content?.trim() && filePaths.length === 0) {
      return fail({
        message: t("errors.importEmpty"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    try {
      const ignore = new Set(
        (data.ignoreEmails ?? "")
          .split(",")
          .map((entry) => normalizeEmail(entry))
          .filter((entry): entry is string => entry !== null),
      );

      const rows: ParsedOutreachRow[] = [];
      const skipped: SkippedOutreachLine[] = [];
      const sourceErrors: Array<{ source: string; reason: SourceSkipReason }> =
        [];

      if (data.content?.trim()) {
        const parsed = parseOutreachLog(data.content, "content", ignore);
        rows.push(...parsed.rows);
        skipped.push(...parsed.skipped);
      }
      const tmpRoot = path.resolve(process.cwd(), ".tmp");
      for (const filePath of filePaths) {
        const resolved = path.resolve(process.cwd(), filePath);
        if (!resolved.startsWith(`${tmpRoot}${path.sep}`)) {
          sourceErrors.push({ source: filePath, reason: "skip.outsideTmp" });
          continue;
        }
        let content: string;
        try {
          content = await readFile(resolved, "utf8");
        } catch (error) {
          logger.warn("Outreach import file not readable", {
            filePath,
            error: parseError(error).message,
          });
          sourceErrors.push({ source: filePath, reason: "skip.unreadable" });
          continue;
        }
        const parsed = parseOutreachLog(
          content,
          path.basename(filePath),
          ignore,
        );
        rows.push(...parsed.rows);
        skipped.push(...parsed.skipped);
      }

      // Oldest first: the first pitch names the contact and sets its angle
      rows.sort((a, b) => a.at.getTime() - b.at.getTime());

      const emails = [...new Set(rows.map((row) => row.email))];
      const existing =
        emails.length > 0
          ? await db
              .select()
              .from(outreachContacts)
              .where(inArray(outreachContacts.email, emails))
          : [];
      const existingById = new Map(existing.map((c) => [c.id, c]));
      const knownTouches = new Set<string>();
      if (existing.length > 0) {
        const touches = await db
          .select({
            contactId: outreachTouches.contactId,
            direction: outreachTouches.direction,
            at: outreachTouches.at,
            subject: outreachTouches.subject,
          })
          .from(outreachTouches)
          .where(inArray(outreachTouches.contactId, [...existingById.keys()]));
        for (const touch of touches) {
          const contact = existingById.get(touch.contactId);
          if (contact) {
            knownTouches.add(
              touchKey(contact.email, touch.direction, touch.at, touch.subject),
            );
          }
        }
      }

      const states = new Map<string, ContactState>();
      for (const contact of existing) {
        states.set(contact.email, {
          id: contact.id,
          name: contact.name,
          kind: contact.kind,
          angle: contact.angle,
          status: contact.status,
          original: {
            kind: contact.kind,
            angle: contact.angle,
            status: contact.status,
          },
          newTouches: [],
        });
      }

      let touchesDuplicate = 0;
      for (const row of rows) {
        const state: ContactState = states.get(row.email) ?? {
          id: null,
          name: row.name,
          kind: OutreachContactKind.OTHER,
          angle: null,
          status: null,
          original: null,
          newTouches: [],
        };
        states.set(row.email, state);
        if (state.kind === OutreachContactKind.OTHER && row.kind) {
          state.kind = row.kind;
        }
        if (
          !state.angle &&
          row.angle &&
          row.direction === OutreachDirection.OUT &&
          row.status === OutreachContactStatus.SENT
        ) {
          state.angle = row.angle;
        }
        state.status = mergeStatus(state.status, row.status);
        if (row.direction) {
          const key = touchKey(row.email, row.direction, row.at, row.subject);
          if (knownTouches.has(key)) {
            touchesDuplicate += 1;
          } else {
            knownTouches.add(key);
            state.newTouches.push(row);
          }
        }
      }

      const created = [...states.entries()].filter(([, s]) => s.id === null);
      const changed = [...states.values()].filter(
        (s) =>
          s.original !== null &&
          (s.original.kind !== s.kind ||
            s.original.angle !== s.angle ||
            s.original.status !== s.status),
      );
      const updated = [...states.values()].filter(
        (s) =>
          s.original !== null &&
          (changed.includes(s) || s.newTouches.length > 0),
      );
      const touchesAdded = [...states.values()].reduce(
        (sum, s) => sum + s.newTouches.length,
        0,
      );

      if (!data.dryRun) {
        for (let i = 0; i < created.length; i += INSERT_CHUNK) {
          const chunk = created.slice(i, i + INSERT_CHUNK);
          const inserted = await db
            .insert(outreachContacts)
            .values(
              chunk.map(([email, s]) => ({
                email,
                name: s.name,
                kind: s.kind,
                angle: s.angle,
                status: s.status ?? OutreachContactStatus.SENT,
              })),
            )
            .onConflictDoNothing({ target: outreachContacts.email })
            .returning({
              id: outreachContacts.id,
              email: outreachContacts.email,
            });
          for (const row of inserted) {
            const state = states.get(row.email);
            if (state) {
              state.id = row.id;
            }
          }
        }
        for (const state of changed) {
          if (state.id && state.status) {
            await db
              .update(outreachContacts)
              .set({
                kind: state.kind,
                angle: state.angle,
                status: state.status,
                updatedAt: new Date(),
              })
              .where(eq(outreachContacts.id, state.id));
          }
        }
        const touchValues = [...states.values()].flatMap((s) =>
          s.id
            ? s.newTouches.flatMap((row) =>
                row.direction
                  ? [
                      {
                        contactId: s.id ?? "",
                        at: row.at,
                        direction: row.direction,
                        subject: row.subject,
                        angle: row.angle,
                        note: row.note,
                      },
                    ]
                  : [],
              )
            : [],
        );
        for (let i = 0; i < touchValues.length; i += INSERT_CHUNK) {
          await db
            .insert(outreachTouches)
            .values(touchValues.slice(i, i + INSERT_CHUNK));
        }
        for (const state of states.values()) {
          if (state.id && state.newTouches.length > 0) {
            await OutreachContactStore.refreshCounters(state.id);
          }
        }
      }

      const skippedLines = [
        ...sourceErrors.map((entry) =>
          t("import.post.widget.line", {
            source: entry.source,
            line: 0,
            reason: t(entry.reason),
          }),
        ),
        ...skipped.map((entry) =>
          t("import.post.widget.line", {
            source: entry.source,
            line: entry.line,
            reason: t(entry.reason),
          }),
        ),
      ];

      logger.debug("Outreach import finished", {
        dryRun: data.dryRun,
        rows: rows.length,
        created: created.length,
        updated: updated.length,
        touchesAdded,
        touchesDuplicate,
      });
      return success({
        rowsParsed: rows.length,
        contactsCreated: created.length,
        contactsUpdated: updated.length,
        touchesAdded,
        touchesDuplicate,
        statusChanges: changed.filter(
          (s) => s.original !== null && s.original.status !== s.status,
        ).length,
        skipped: skippedLines.length,
        skippedLines: skippedLines.slice(0, OUTREACH_IMPORT_MAX_SKIPPED_DETAIL),
      });
    } catch (error) {
      logger.error("Failed to import outreach log", parseError(error));
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
