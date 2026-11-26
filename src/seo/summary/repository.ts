import "server-only";

import { and, count, eq, max, ne } from "drizzle-orm";
import { getDefaultFolderConfig } from "next-vibe/agent/chat/config";
import { chatFolders, chatThreads } from "next-vibe/agent/chat/db";
import {
  ThreadModerationStatus,
  ThreadStatus,
} from "next-vibe/agent/chat/enum";
import { getEffectiveRoles } from "next-vibe/agent/chat/permissions/permissions";
import { PUBLIC_FEED_ALIAS } from "next-vibe/agent/chat/public-feed/constants";
import { platformKv } from "next-vibe/agent/cortex/db";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { INDEXNOW_KV_KEY } from "../indexnow/constants";
import type { PublishingSummaryOutput } from "./definition";
import type { PublishingSummaryT } from "./i18n";

const fingerprintList = z.array(z.string().regex(/^[a-f0-9]{16}$/u));

function storedUrlCount(value: string | undefined): number | null {
  if (value === undefined) {
    return null;
  }
  try {
    const parsed = fingerprintList.safeParse(JSON.parse(value));
    return parsed.success ? new Set(parsed.data).size : null;
  } catch {
    return null;
  }
}

export class PublishingSummaryRepository {
  static async get(
    logger: EndpointLogger,
    t: PublishingSummaryT,
  ): Promise<ResponseType<PublishingSummaryOutput>> {
    try {
      const [visibilityGroups, publicFolders, [indexing]] = await Promise.all([
        db
          .select({
            folderId: chatThreads.folderId,
            rolesView: chatThreads.rolesView,
            total: count(),
            newest: max(chatThreads.createdAt),
          })
          .from(chatThreads)
          .where(
            and(
              eq(chatThreads.rootFolderId, DefaultFolderId.PUBLIC),
              eq(chatThreads.moderationStatus, ThreadModerationStatus.VISIBLE),
              ne(chatThreads.status, ThreadStatus.DELETED),
            ),
          )
          .groupBy(chatThreads.folderId, chatThreads.rolesView),
        db
          .select()
          .from(chatFolders)
          .where(eq(chatFolders.rootFolderId, DefaultFolderId.PUBLIC)),
        db
          .select({ value: platformKv.value, at: platformKv.updatedAt })
          .from(platformKv)
          .where(eq(platformKv.key, INDEXNOW_KV_KEY))
          .limit(1),
      ]);
      const folderMap = Object.fromEntries(
        publicFolders.map((folder) => [folder.id, folder]),
      );
      const rootRoles =
        getDefaultFolderConfig(DefaultFolderId.PUBLIC)?.rolesView ?? [];
      let total = 0;
      let newest = "";
      // The feed's SQL total precedes access checks. Resolve anonymous view
      // roles here without selecting thread titles, IDs or message bodies.
      for (const group of visibilityGroups) {
        const folder = group.folderId ? folderMap[group.folderId] : undefined;
        if (group.folderId && !folder) {
          continue;
        }
        const roles =
          group.rolesView ??
          (folder
            ? getEffectiveRoles(folder, "rolesView", folderMap)
            : rootRoles);
        if (!roles.includes(UserRole.PUBLIC)) {
          continue;
        }
        total += group.total;
        const day = group.newest?.toISOString().slice(0, 10) ?? "";
        if (day > newest) {
          newest = day;
        }
      }

      const today = new Date().toISOString().slice(0, 10);
      return success({
        summary: {
          from: today,
          to: today,
          kpis: [
            {
              label: "threads",
              format: "number",
              value: total,
              drill: { alias: PUBLIC_FEED_ALIAS },
            },
            {
              label: "savedUrls",
              format: "number",
              value: storedUrlCount(indexing?.value),
            },
          ],
          attention: [],
          attentionAvailable: false,
          recent: [],
        },
        newestThreadOn: newest || null,
        indexingSnapshotOn: indexing?.at.toISOString().slice(0, 10) ?? null,
      });
    } catch {
      logger.warn("Publishing summary query failed");
      return fail({
        message: t("errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
