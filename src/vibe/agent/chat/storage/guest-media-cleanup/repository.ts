import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { coreEnv } from "next-vibe/core/env";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { Environment } from "next-vibe/env/env-util";
import { leads } from "next-vibe/identity/lead/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import { studioGenerations } from "../../../media-studio/db";
import { chatThreads } from "../../db";
import {
  type FileMetadata,
  getStorageAdapter,
  type StorageAdapter,
} from "../index";
import { parseStorageFileRef } from "../storage-url";
import { findGuestLeadComponent } from "./account-links";
import {
  GUEST_MEDIA_BATCH_PAUSE_MS,
  GUEST_MEDIA_CLEANUP_TASK_ID,
  GUEST_MEDIA_DELETE_CHUNK,
} from "./constants";
import type {
  GuestMediaCleanupPostRequestOutput,
  GuestMediaCleanupPostResponseOutput,
} from "./definition";
import { scopedTranslation } from "./i18n";
import {
  collectLeadIds,
  guestMediaCutoff,
  isUuidCandidate,
  selectGuestMediaForDeletion,
} from "./selection";

const LOOKUP_CHUNK = 100;
const SAFE_NAMESPACE = /^[a-z0-9_-]+$/i;
const SAFE_FILENAME = /^[a-z0-9_-]+(?:\.[a-z0-9]+)?$/i;

function sameStorageFile(url: string, file: FileMetadata): boolean {
  const ref = parseStorageFileRef(url);
  if (ref) {
    return ref.threadId === file.threadId && ref.filename === file.filename;
  }
  return (
    URL.canParse(url) &&
    new URL(url).pathname ===
      `/chat-attachments/${file.threadId}/${file.filename}`
  );
}

type CleanupDb = Pick<typeof db, "select" | "delete" | "execute">;

export class GuestMediaCleanupRepository {
  static async cleanup(
    data: GuestMediaCleanupPostRequestOutput,
    platform: Platform,
    cronTaskId: string | undefined,
    abortSignal: AbortSignal | undefined,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<GuestMediaCleanupPostResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    if (
      !data.dryRun &&
      (platform !== Platform.CRON ||
        cronTaskId !== GUEST_MEDIA_CLEANUP_TASK_ID ||
        coreEnv.NODE_ENV !== Environment.PRODUCTION ||
        coreEnv.IS_PREVIEW_MODE)
    ) {
      return fail({
        message: t("errors.scheduledOnly"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    try {
      const result = await GuestMediaCleanupRepository.scan(
        data,
        abortSignal,
        logger,
      );
      logger.info("[GuestMediaCleanup] Finished", {
        dryRun: data.dryRun,
        ...result,
      });
      return success(result);
    } catch (error) {
      const parsed = parseError(error);
      logger.error("[GuestMediaCleanup] Cleanup failed", parsed);
      return fail({
        message: t("errors.failed", { error: parsed.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async scan(
    data: GuestMediaCleanupPostRequestOutput,
    abortSignal: AbortSignal | undefined,
    logger: EndpointLogger,
  ): Promise<GuestMediaCleanupPostResponseOutput> {
    const start = new Date();
    const cutoff = guestMediaCutoff(start);
    const result: GuestMediaCleanupPostResponseOutput = {
      cutoff: cutoff.toISOString(),
      namespacesScanned: 0,
      storedThreadNamespaces: 0,
      filesScanned: 0,
      eligibleFiles: 0,
      eligibleBytes: 0,
      filesDeleted: 0,
      bytesDeleted: 0,
      rowsDeleted: 0,
      skippedTooNew: 0,
      skippedUserOwned: 0,
      skippedUnowned: 0,
      skippedAccountLead: 0,
      deferred: 0,
      failed: 0,
      executionTimeMs: 0,
      scanComplete: false,
    };

    const adapter = getStorageAdapter();
    const namespaces = await adapter.listThreadIds(abortSignal);
    let attempted = 0;
    for (let i = 0; i < namespaces.length; i += LOOKUP_CHUNK) {
      if (abortSignal?.aborted) {
        break;
      }
      const group = namespaces.slice(i, i + LOOKUP_CHUNK);
      const stored =
        await GuestMediaCleanupRepository.findStoredThreadIds(group);
      for (const namespace of group) {
        if (abortSignal?.aborted) {
          break;
        }
        result.namespacesScanned++;
        if (stored.has(namespace.toLowerCase())) {
          result.storedThreadNamespaces++;
          continue;
        }

        const files = await adapter.listFilesByThread(namespace, {
          strict: true,
          signal: abortSignal,
        });
        for (
          let offset = 0;
          offset < files.length;
          offset += GUEST_MEDIA_DELETE_CHUNK
        ) {
          if (abortSignal?.aborted) {
            break;
          }
          const batch = files.slice(offset, offset + GUEST_MEDIA_DELETE_CHUNK);
          const candidates = batch.filter(
            (file) =>
              file.threadId === namespace &&
              SAFE_NAMESPACE.test(file.threadId) &&
              isUuidCandidate(file.id) &&
              SAFE_FILENAME.test(file.filename) &&
              file.filename.split(".")[0] === file.id &&
              Number.isSafeInteger(file.size) &&
              file.size >= 0,
          );
          const component = await findGuestLeadComponent(
            db,
            collectLeadIds(
              candidates.filter(
                (file) => file.uploadedAt.getTime() < cutoff.getTime(),
              ),
            ),
          );
          const guests = new Set(component.map((row) => row.root_id));
          for (const row of component) {
            if (row.account_linked) {
              guests.delete(row.root_id);
            }
          }
          const { skipped, toDelete } = selectGuestMediaForDeletion({
            files: candidates,
            storedThreadIds: stored,
            guestLeadIds: guests,
            cutoff,
            limit: GUEST_MEDIA_DELETE_CHUNK,
          });
          result.filesScanned += batch.length;
          result.skippedUnowned +=
            skipped.unowned + batch.length - candidates.length;
          result.skippedTooNew += skipped.tooNew;
          result.skippedUserOwned += skipped.userOwned;
          result.skippedAccountLead += skipped.accountLead;
          for (const file of toDelete) {
            if (
              (await GuestMediaCleanupRepository.findStudioRows(
                db,
                file,
                cutoff,
              )) === null
            ) {
              continue;
            }
            result.eligibleFiles++;
            result.eligibleBytes += file.size;
            if (data.dryRun) {
              continue;
            }
            if (attempted >= data.batchSize || abortSignal?.aborted) {
              result.deferred++;
              continue;
            }
            if (attempted > 0 && attempted % GUEST_MEDIA_DELETE_CHUNK === 0) {
              await Bun.sleep(GUEST_MEDIA_BATCH_PAUSE_MS);
              if (abortSignal?.aborted) {
                break;
              }
            }
            attempted++;

            try {
              const rows = await GuestMediaCleanupRepository.deleteFile(
                adapter,
                file,
                cutoff,
                abortSignal,
              );
              if (rows === null) {
                continue;
              }
              result.filesDeleted++;
              result.bytesDeleted += file.size;
              result.rowsDeleted += rows;
            } catch (error) {
              result.failed++;
              logger.error("[GuestMediaCleanup] Delete failed", {
                fileId: file.id,
                error: parseError(error).message,
              });
            }
          }
        }
      }
    }
    result.scanComplete = !abortSignal?.aborted;
    result.executionTimeMs = Date.now() - start.getTime();
    return result;
  }

  private static async deleteFile(
    adapter: StorageAdapter,
    file: FileMetadata,
    cutoff: Date,
    abortSignal: AbortSignal | undefined,
  ): Promise<number | null> {
    if (!file.leadId) {
      return null;
    }
    const leadId = file.leadId.toLowerCase();
    let metadataDeleteAttempted = false;
    return db
      .transaction(async (tx) => {
        // Lead FK inserts and conversion take locks on these rows. Re-read the
        // component after locking so an account link committed during the scan
        // or an edge to a lead we have not locked makes this file ineligible.
        const component = await findGuestLeadComponent(tx, [leadId]);
        if (
          component.length === 0 ||
          component.some((row) => row.account_linked)
        ) {
          return null;
        }
        const locked = new Set(
          (
            await tx
              .select({ id: leads.id })
              .from(leads)
              .where(
                inArray(
                  leads.id,
                  component.map((row) => row.lead_id),
                ),
              )
              .orderBy(leads.id)
              .for("update", { skipLocked: true })
          ).map((row) => row.id),
        );
        const rechecked = await findGuestLeadComponent(tx, [leadId]);
        if (
          !locked.has(leadId) ||
          rechecked.some(
            (row) => row.account_linked || !locked.has(row.lead_id),
          ) ||
          (
            await GuestMediaCleanupRepository.findStoredThreadIds(
              [file.threadId],
              tx,
            )
          ).size > 0
        ) {
          return null;
        }

        const rows = await GuestMediaCleanupRepository.findStudioRows(
          tx,
          file,
          cutoff,
        );
        if (rows === null || abortSignal?.aborted) {
          return null;
        }

        // Both storage operations must succeed before the row deletes commit.
        const deletedRows =
          rows.length === 0
            ? []
            : await tx
                .delete(studioGenerations)
                .where(inArray(studioGenerations.id, rows))
                .returning({ id: studioGenerations.id });
        const timeout = AbortSignal.timeout(10_000);
        await adapter.deleteFileContent(
          file,
          abortSignal ? AbortSignal.any([abortSignal, timeout]) : timeout,
        );
        metadataDeleteAttempted = true;
        await adapter.deleteFileMetadata(file);
        return deletedRows.length;
      })
      .catch(async (error: Error) => {
        if (metadataDeleteAttempted) {
          // A failed commit or a lost S3 response can leave the retry without
          // its inventory entry. Recreate it with its original owner and age.
          await adapter
            .writeFileMetadata(file)
            .catch((recoveryError: Error) =>
              Promise.reject(
                new AggregateError(
                  [error, recoveryError],
                  "Could not restore guest media metadata",
                ),
              ),
            );
        }
        return Promise.reject(error);
      });
  }

  private static async findStudioRows(
    database: CleanupDb,
    file: FileMetadata,
    cutoff: Date,
  ): Promise<string[] | null> {
    if (!file.leadId) {
      return null;
    }
    const suffix = `/${file.threadId}/${file.filename}`;
    const rows = await database
      .select({
        id: studioGenerations.id,
        url: studioGenerations.url,
        status: studioGenerations.status,
        createdAt: studioGenerations.createdAt,
      })
      .from(studioGenerations)
      .where(
        and(
          eq(studioGenerations.leadId, file.leadId),
          sql`right(split_part(split_part(${studioGenerations.url}, '?', 1), '#', 1), ${suffix.length}) = ${suffix}`,
        ),
      )
      .limit(GUEST_MEDIA_DELETE_CHUNK + 1);
    if (rows.length > GUEST_MEDIA_DELETE_CHUNK) {
      return null;
    }
    const matching = rows.filter(
      (row) => row.url && sameStorageFile(row.url, file),
    );
    if (
      matching.some(
        (row) => row.createdAt >= cutoff || row.status !== "completed",
      )
    ) {
      return null;
    }
    return matching.map((row) => row.id);
  }

  private static async findStoredThreadIds(
    namespaces: string[],
    database: CleanupDb = db,
  ): Promise<Set<string>> {
    const candidates = namespaces
      .filter(isUuidCandidate)
      .map((id) => id.toLowerCase());
    if (candidates.length === 0) {
      return new Set();
    }
    const rows = await database
      .select({ id: chatThreads.id })
      .from(chatThreads)
      .where(inArray(chatThreads.id, candidates));
    return new Set(rows.map((row) => row.id));
  }
}
