import "server-only";

import { and, count, eq, gte, lt } from "drizzle-orm";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";

import { chatThreads } from "../chat/db";
import { allModelDefinitions } from "../models/all-models";
import { ModelUtility } from "../models/enum";
import { customSkills } from "../skills/db";
import { SkillOwnershipType, SkillStatus } from "../skills/enum";
import type { AiSummaryOutput } from "./definition";
import type { AiSummaryT } from "./i18n";

/** Aggregate counts only. Conversation content and private skill names stay outside the admin overview. */
export async function aiSummary(
  t: AiSummaryT,
  now = new Date(),
): Promise<ResponseType<AiSummaryOutput>> {
  const day = 86400000;
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const from = new Date(today - 6 * day);
  const previousFrom = new Date(from.getTime() - 7 * day);
  const models = allModelDefinitions.filter(
    (model) => !model.utilities.includes(ModelUtility.LEGACY),
  );
  try {
    const [published, reported, current, previous] = await Promise.all([
      db
        .select({ total: count() })
        .from(customSkills)
        .where(
          and(
            eq(customSkills.status, SkillStatus.PUBLISHED),
            eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
          ),
        ),
      db
        .select({ total: count() })
        .from(customSkills)
        .where(gte(customSkills.reportCount, 1)),
      db
        .select({ total: count() })
        .from(chatThreads)
        .where(
          and(gte(chatThreads.createdAt, from), lt(chatThreads.createdAt, now)),
        ),
      db
        .select({ total: count() })
        .from(chatThreads)
        .where(
          and(
            gte(chatThreads.createdAt, previousFrom),
            lt(chatThreads.createdAt, new Date(now.getTime() - 7 * day)),
          ),
        ),
    ]);
    const flagged = reported[0]?.total ?? 0;
    return success({
      summary: {
        from: from.toISOString().slice(0, 10),
        to: now.toISOString().slice(0, 10),
        attentionAvailable: true,
        recent: [],
        destinationCounts: [{ alias: "models", count: models.length }],
        attention: flagged
          ? [
              {
                label: "reported",
                count: flagged,
                severity: "warning",
                drill: { alias: "skill-moderation" },
              },
            ]
          : [],
        kpis: [
          {
            label: "models",
            format: "number",
            value: models.length,
            drill: { alias: "models" },
          },
          {
            label: "providers",
            format: "number",
            value: new Set(
              models.flatMap((model) =>
                model.providers.map((p) => p.apiProvider),
              ),
            ).size,
            drill: { alias: "models" },
          },
          {
            label: "skills",
            format: "number",
            value: published[0]?.total ?? 0,
            drill: { alias: "skills" },
          },
          {
            label: "conversations",
            format: "number",
            value: current[0]?.total ?? 0,
            previous: previous[0]?.total ?? 0,
          },
        ],
      },
    });
  } catch {
    return fail({
      message: t("failed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
