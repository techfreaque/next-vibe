/**
 * Guest Media Cleanup Repository
 * Deletes media of guests (leads never linked to an account) from incognito
 * threads and standalone tool runs once older than the retention window.
 * Works with S3 and filesystem storage via the StorageAdapter. Selection
 * rules live in ./selection.ts.
 */

import "server-only";

import { and, inArray, isNull } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatThreads } from "../../db";
import { type FileMetadata, getStorageAdapter } from "../index";
import type {
  GuestMediaCleanupPostRequestOutput,
  GuestMediaCleanupPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import {
  collectLeadIds,
  isUuidCandidate,
  selectGuestMediaForDeletion,
} from "./selection";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Max ids per `IN (...)` lookup. */
const LOOKUP_CHUNK = 500;

export class GuestMediaCleanupRepository {
  static async cleanup(
    data: GuestMediaCleanupPostRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<GuestMediaCleanupPostResponseOutput>> {
    const startTime = Date.now();
    const cutoff = new Date(startTime - data.retentionDays * DAY_MS);

    try {
      const adapter = getStorageAdapter();
      const namespaces = await adapter.listThreadIds();

      const storedThreadIds =
        await GuestMediaCleanupRepository.findStoredThreadIds(namespaces);

      // Stored threads are skipped without listing their files: nothing in
      // them is ever a candidate.
      const files: FileMetadata[] = [];
      for (const threadId of namespaces) {
        if (storedThreadIds.has(threadId.toLowerCase())) {
          continue;
        }
        files.push(...(await adapter.listFilesByThread(threadId)));
      }

      const leadIds = collectLeadIds(files);
      const { guestLeadIds, unconvertedLeads } =
        await GuestMediaCleanupRepository.findGuestLeadIds(leadIds);

      const selection = selectGuestMediaForDeletion({
        files,
        storedThreadIds,
        guestLeadIds,
        cutoff,
        limit: data.batchSize,
      });

      let filesDeleted = 0;
      let bytesDeleted = 0;
      let failed = 0;
      for (const file of selection.toDelete) {
        const ageDays = Math.round(
          (startTime - new Date(file.uploadedAt).getTime()) / DAY_MS,
        );
        if (data.dryRun) {
          logger.debug("[GuestMediaCleanup] Would delete", {
            threadId: file.threadId,
            fileId: file.id,
            mimeType: file.mimeType,
            size: file.size,
            ageDays,
          });
          filesDeleted++;
          bytesDeleted += file.size;
          continue;
        }
        try {
          await adapter.deleteFile(file.id, file.threadId);
          filesDeleted++;
          bytesDeleted += file.size;
        } catch (error) {
          failed++;
          logger.error("[GuestMediaCleanup] Delete failed", {
            threadId: file.threadId,
            fileId: file.id,
            error: parseError(error).message,
          });
        }
      }

      const result: GuestMediaCleanupPostResponseOutput = {
        cutoff: cutoff.toISOString(),
        namespacesScanned: namespaces.length,
        storedThreadNamespaces: storedThreadIds.size,
        filesScanned: files.length,
        filesDeleted,
        bytesDeleted,
        skippedTooNew: selection.skipped.tooNew,
        skippedUserOwned: selection.skipped.userOwned,
        skippedUnowned: selection.skipped.unowned,
        skippedAccountLead: selection.skipped.accountLead,
        deferred: selection.deferred,
        failed,
        executionTimeMs: Date.now() - startTime,
      };

      logger.info(
        `[GuestMediaCleanup] ${data.dryRun ? "Would delete" : "Deleted"} ${filesDeleted} files (${bytesDeleted} bytes)`,
        {
          dryRun: data.dryRun,
          retentionDays: data.retentionDays,
          leadsChecked: leadIds.length,
          guestLeads: guestLeadIds.size,
          // unconverted leads with a user_lead_links row (logged in/signed up)
          linkedLeads: unconvertedLeads - guestLeadIds.size,
          ...result,
        },
      );

      return success(result);
    } catch (error) {
      const { t } = scopedTranslation.scopedT(locale);
      logger.error("[GuestMediaCleanup] Cleanup failed", parseError(error));
      return fail({
        message: t("errors.failed", { error: parseError(error).message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** Lowercased ids of the namespaces that have a `chat_threads` row. */
  private static async findStoredThreadIds(
    namespaces: string[],
  ): Promise<Set<string>> {
    const candidates = namespaces
      .filter(isUuidCandidate)
      .map((id) => id.toLowerCase());
    const stored = new Set<string>();
    for (let i = 0; i < candidates.length; i += LOOKUP_CHUNK) {
      const chunk = candidates.slice(i, i + LOOKUP_CHUNK);
      const rows = await db
        .select({ id: chatThreads.id })
        .from(chatThreads)
        .where(inArray(chatThreads.id, chunk));
      for (const row of rows) {
        stored.add(row.id.toLowerCase());
      }
    }
    return stored;
  }

  /**
   * Lowercased ids of confirmed guest leads: the lead row exists, it was never
   * converted to a user and no `user_lead_links` row ties it to an account.
   * Leads without a row are left out, so their files are kept.
   */
  private static async findGuestLeadIds(
    leadIds: string[],
  ): Promise<{ guestLeadIds: Set<string>; unconvertedLeads: number }> {
    const guests = new Set<string>();
    let unconvertedLeads = 0;
    for (let i = 0; i < leadIds.length; i += LOOKUP_CHUNK) {
      const chunk = leadIds.slice(i, i + LOOKUP_CHUNK);
      const unconverted = await db
        .select({ id: leads.id })
        .from(leads)
        .where(and(inArray(leads.id, chunk), isNull(leads.convertedUserId)));
      if (unconverted.length === 0) {
        continue;
      }
      unconvertedLeads += unconverted.length;
      const linked = await db
        .select({ leadId: userLeadLinks.leadId })
        .from(userLeadLinks)
        .where(
          inArray(
            userLeadLinks.leadId,
            unconverted.map((row) => row.id),
          ),
        );
      const linkedIds = new Set(linked.map((row) => row.leadId.toLowerCase()));
      for (const row of unconverted) {
        const id = row.id.toLowerCase();
        if (!linkedIds.has(id)) {
          guests.add(id);
        }
      }
    }
    return { guestLeadIds: guests, unconvertedLeads };
  }
}
