/**
 * Async media jobs of the /v1 API (POST /v1/videos, POST /v1/music). A job row
 * is the only state a client polls: any node can answer GET /v1/videos/{id},
 * whichever node runs the generation.
 */

import { sql } from "drizzle-orm";
import {
  doublePrecision,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import { userApiKeys } from "@/api-keys/db";

/** Wire values of the job status (OpenAI video object `status`). */
export const V1_MEDIA_JOB_STATUSES = [
  "queued",
  "in_progress",
  "completed",
  "failed",
] as const;
export type V1MediaJobStatus = (typeof V1_MEDIA_JOB_STATUSES)[number];

export const V1_MEDIA_JOB_KINDS = ["video", "music"] as const;
export type V1MediaJobKind = (typeof V1_MEDIA_JOB_KINDS)[number];

/** What the client asked for, echoed back on every job object. */
export interface V1MediaJobParams {
  /** video: clip length; music: requested length */
  seconds: number;
  /** video only: "WxH" as the client sent it, or derived */
  size: string | null;
  aspectRatio: string | null;
  resolution: string | null;
}

export const v1MediaJobs = pgTable(
  "v1_media_jobs",
  {
    /** "video_<hex>" / "music_<hex>": the id clients poll */
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    apiKeyId: uuid("api_key_id").references(() => userApiKeys.id, {
      onDelete: "set null",
    }),
    kind: text("kind", { enum: V1_MEDIA_JOB_KINDS }).notNull(),
    model: text("model").notNull(),
    prompt: text("prompt").notNull(),
    params: jsonb("params").$type<V1MediaJobParams>().notNull(),
    status: text("status", { enum: V1_MEDIA_JOB_STATUSES })
      .notNull()
      .default("queued"),
    /** Portable storage path of the finished file */
    resultUrl: text("result_url"),
    /** Length of the delivered clip, when the provider reports it */
    durationSeconds: doublePrecision("duration_seconds"),
    creditsCharged: doublePrecision("credits_charged"),
    /** Provider request/job/generation ID for matching provider dashboard charges. */
    providerJobId: text("provider_job_id"),
    errorCode: text("error_code"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("v1_media_jobs_user_created_idx").on(table.userId, table.createdAt),
    index("v1_media_jobs_provider_job_id_idx")
      .on(table.providerJobId)
      .where(sql`${table.providerJobId} IS NOT NULL`),
  ],
);

export type V1MediaJob = typeof v1MediaJobs.$inferSelect;
export type NewV1MediaJob = typeof v1MediaJobs.$inferInsert;
