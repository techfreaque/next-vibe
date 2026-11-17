/**
 * Async media jobs behind POST /v1/videos and POST /v1/music. The create call
 * validates, checks the balance and answers at once with a queued job; the
 * generation runs in the background through the same tool repository the
 * chat uses (it bills only on success). Clients poll GET .../{id} and download
 * GET .../{id}/content. The row is the only state, so any node can answer a
 * poll. A job whose process died (deploy, crash) is reported failed once it
 * is older than V1_MEDIA_JOB_STALE_MS; it was never charged.
 */

import "server-only";

import { and, eq, inArray, lt } from "drizzle-orm";
import { trackActiveRun } from "next-vibe/agent/ai-stream/repository/loop/active-loops";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  type NewV1MediaJob,
  type V1MediaJob,
  type V1MediaJobKind,
  v1MediaJobs,
} from "../db";
import type { V1T } from "../i18n";
import { V1_MEDIA_JOB_STALE_MS } from "./constants";
import { signedMediaUrl, unixSeconds, v1ErrorFromToolFailure } from "./media";

/** What a finished generation hands back to the job. */
export interface V1MediaJobOutput {
  url: string;
  creditCost: number;
  durationSeconds: number | undefined;
}

export function newMediaJobId(kind: V1MediaJobKind): string {
  return `${kind}_${crypto.randomUUID().replaceAll("-", "")}`;
}

export async function createMediaJob(
  values: Omit<NewV1MediaJob, "status">,
): Promise<V1MediaJob | null> {
  const [job] = await db
    .insert(v1MediaJobs)
    .values({ ...values, status: "queued" })
    .returning();
  return job ?? null;
}

/**
 * Run a job's generation in the background. Tracked as an active run, so a
 * draining deploy waits for it instead of killing it mid-generation.
 */
export function startMediaJob(
  job: V1MediaJob,
  generate: () => Promise<ResponseType<V1MediaJobOutput>>,
  logger: EndpointLogger,
): void {
  const markFailed = async (code: string, message: string): Promise<void> => {
    await db
      .update(v1MediaJobs)
      .set({
        status: "failed",
        errorCode: code,
        errorMessage: message,
        completedAt: new Date(),
      })
      .where(eq(v1MediaJobs.id, job.id));
  };
  const run = async (): Promise<void> => {
    try {
      await db
        .update(v1MediaJobs)
        .set({ status: "in_progress", startedAt: new Date() })
        .where(eq(v1MediaJobs.id, job.id));
      const result = await generate();
      if (result.success) {
        await db
          .update(v1MediaJobs)
          .set({
            status: "completed",
            resultUrl: result.data.url,
            creditsCharged: result.data.creditCost,
            durationSeconds: result.data.durationSeconds ?? null,
            completedAt: new Date(),
          })
          .where(eq(v1MediaJobs.id, job.id));
        return;
      }
      const error = v1ErrorFromToolFailure(result);
      logger.warn("[v1/media-jobs] Generation failed", {
        jobId: job.id,
        model: job.model,
        status: error.status,
        error: error.message,
      });
      await markFailed(error.code ?? error.type, error.message);
    } catch (error) {
      const message = parseError(error).message;
      logger.error("[v1/media-jobs] Job failed unexpectedly", {
        jobId: job.id,
        model: job.model,
        error: message,
      });
      await markFailed("server_error", message).catch(() => undefined);
    }
  };
  trackActiveRun(run());
}

/**
 * The caller's job of this kind, or null. A queued/running job past the
 * stale limit is closed as failed first (its process is gone).
 */
export async function findMediaJob(
  id: string,
  kind: V1MediaJobKind,
  userId: string,
  t: V1T,
): Promise<V1MediaJob | null> {
  const [job] = await db
    .select()
    .from(v1MediaJobs)
    .where(
      and(
        eq(v1MediaJobs.id, id),
        eq(v1MediaJobs.kind, kind),
        eq(v1MediaJobs.userId, userId),
      ),
    )
    .limit(1);
  if (!job) {
    return null;
  }
  const staleBefore = new Date(Date.now() - V1_MEDIA_JOB_STALE_MS);
  if (
    (job.status === "queued" || job.status === "in_progress") &&
    job.createdAt < staleBefore
  ) {
    const [closed] = await db
      .update(v1MediaJobs)
      .set({
        status: "failed",
        errorCode: "job_interrupted",
        errorMessage: t("media.errors.jobInterrupted"),
        completedAt: new Date(),
      })
      .where(
        and(
          eq(v1MediaJobs.id, job.id),
          inArray(v1MediaJobs.status, ["queued", "in_progress"]),
          lt(v1MediaJobs.createdAt, staleBefore),
        ),
      )
      .returning();
    return closed ?? job;
  }
  return job;
}

const PROGRESS: Record<V1MediaJob["status"], number> = {
  queued: 0,
  in_progress: 50,
  completed: 100,
  failed: 0,
};

/**
 * A job as the wire object. Videos follow OpenAI's video object (`seconds`
 * and `size` as strings); music uses the same fields. `url` (signed, valid
 * for a week) and `credits_charged` are ours.
 */
export function mediaJobObject(
  job: V1MediaJob,
  request: Request | undefined,
): Record<string, string | number | null | { code: string; message: string }> {
  const seconds = job.durationSeconds ?? job.params.seconds;
  return {
    id: job.id,
    object: job.kind,
    model: job.model,
    status: job.status,
    progress: PROGRESS[job.status],
    created_at: unixSeconds(job.createdAt),
    completed_at: job.completedAt ? unixSeconds(job.completedAt) : null,
    expires_at: null,
    prompt: job.prompt,
    seconds: job.kind === "video" ? String(seconds) : seconds,
    ...(job.kind === "video"
      ? {
          size: job.params.size,
          aspect_ratio: job.params.aspectRatio,
          resolution: job.params.resolution,
        }
      : {}),
    url:
      job.status === "completed" && job.resultUrl
        ? signedMediaUrl(job.resultUrl, request)
        : null,
    credits_charged: job.creditsCharged ?? 0,
    error:
      job.status === "failed"
        ? {
            code: job.errorCode ?? "generation_failed",
            message: job.errorMessage ?? "",
          }
        : null,
  };
}
