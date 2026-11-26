/**
 * Provider request/job ID persistence across credit_transactions,
 * studio_generations and v1_media_jobs.
 */

import "server-only";

import { and, eq, inArray, or } from "drizzle-orm";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import { ImageGenModelId } from "next-vibe/agent/image-generation/models";
import { studioGenerations } from "next-vibe/agent/media-studio/db";
import { MediaStudioRepository } from "next-vibe/agent/media-studio/repository";
import { ApiProvider } from "next-vibe/agent/models/models";
import { SttModelId } from "next-vibe/agent/speech-to-text/models";
import { TtsModelId } from "next-vibe/agent/text-to-speech/models";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect, it } from "vitest";

import { v1MediaJobs } from "@/v1/db";
import {
  createMediaJob,
  newMediaJobId,
  startMediaJob,
} from "@/v1/shared/media-jobs";

import { creditTransactions, creditWallets } from "./db";
import { CreditTransactionType } from "./enum";
import { scopedTranslation as creditsScopedTranslation } from "./i18n";
import { CreditRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const stamp = Date.now();

async function usageRowsForUser(userId: string) {
  const leadIds = (
    await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, userId))
  ).map((row) => row.leadId);
  const wallets = await db
    .select({ id: creditWallets.id })
    .from(creditWallets)
    .where(
      leadIds.length > 0
        ? or(
            eq(creditWallets.userId, userId),
            inArray(creditWallets.leadId, leadIds),
          )
        : eq(creditWallets.userId, userId),
    );
  const ids = wallets.map((w) => w.id);
  return db
    .select({
      feature: creditTransactions.feature,
      modelId: creditTransactions.modelId,
      providerJobId: creditTransactions.providerJobId,
      metadata: creditTransactions.metadata,
    })
    .from(creditTransactions)
    .where(
      and(
        inArray(creditTransactions.walletId, ids),
        eq(creditTransactions.type, CreditTransactionType.USAGE),
      ),
    )
    .orderBy(creditTransactions.createdAt);
}

async function waitForV1JobStatus(
  jobId: string,
  expected: "completed" | "failed",
): Promise<typeof v1MediaJobs.$inferSelect | undefined> {
  for (let i = 0; i < 40; i++) {
    const [row] = await db
      .select()
      .from(v1MediaJobs)
      .where(eq(v1MediaJobs.id, jobId))
      .limit(1);
    if (row?.status === expected) {
      return row;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, 25);
    });
  }
  return undefined;
}

describe("provider job ID persistence", () => {
  it("stores providerJobId and multi-call providerJobIds on credit_transactions", async () => {
    const created = await createTestUser(`pjid-ledger-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    const { user } = created.data;
    try {
      const pack = await CreditRepository.addUserCredits(
        user.id,
        10,
        "permanent",
        logger,
        creditsT,
      );
      expect(pack.success).toBe(true);

      const featureRes = await CreditRepository.deductCreditsForFeature(
        user,
        1,
        IMAGE_GEN_ALIAS,
        logger,
        creditsT,
        defaultLocale,
        {
          modelId: ImageGenModelId.FLUX_2_PRO,
          apiProvider: ApiProvider.MODELSLAB,
          providerJobId: "ml-job-101",
        },
      );
      expect(featureRes.success).toBe(true);

      const ttsRes = await CreditRepository.deductCreditsForTTS(
        user,
        0.5,
        logger,
        defaultLocale,
        creditsT,
        {
          modelId: TtsModelId.OPENAI_NOVA,
          apiProvider: ApiProvider.ELEVENLABS,
          providerJobId: "el-hist-202",
        },
      );
      expect(ttsRes.success).toBe(true);

      const sttRes = await CreditRepository.deductCreditsForSTT(
        user,
        0.5,
        logger,
        creditsT,
        defaultLocale,
        {
          modelId: SttModelId.OPENAI_WHISPER,
          apiProvider: ApiProvider.EDEN_AI_STT,
          providerJobId: "eden-chunk-1",
          providerJobIds: ["eden-chunk-1", "eden-chunk-2"],
        },
      );
      expect(sttRes.success).toBe(true);

      const llmRes = await CreditRepository.deductCreditsForModelUsage(
        user,
        1,
        ChatModelId.CLAUDE_SONNET_5_5,
        logger,
        creditsT,
        defaultLocale,
        undefined,
        ApiProvider.OPENROUTER,
        undefined,
        {
          providerJobId: "gen-step-1",
          providerJobIds: ["gen-step-1", "gen-step-2"],
        },
      );
      expect(llmRes.success).toBe(true);

      const rows = await usageRowsForUser(user.id);
      expect(rows.some((r) => r.providerJobId === "ml-job-101")).toBe(true);
      expect(rows.some((r) => r.providerJobId === "el-hist-202")).toBe(true);

      const sttRow = rows.find((r) => r.providerJobId === "eden-chunk-1");
      expect(sttRow).toBeDefined();
      expect(
        sttRow && "providerJobIds" in sttRow.metadata
          ? sttRow.metadata.providerJobIds
          : undefined,
      ).toEqual(["eden-chunk-1", "eden-chunk-2"]);

      const llmRow = rows.find((r) => r.providerJobId === "gen-step-1");
      expect(llmRow).toBeDefined();
      expect(
        llmRow && "providerJobIds" in llmRow.metadata
          ? llmRow.metadata.providerJobIds
          : undefined,
      ).toEqual(["gen-step-1", "gen-step-2"]);
    } finally {
      await deleteTestUser(user.id);
    }
  });

  it("stores providerJobId on studio_generations for both completed and failed runs", async () => {
    const created = await createTestUser(`pjid-studio-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    const { user } = created.data;
    try {
      const ok = await MediaStudioRepository.run({
        save: true,
        user,
        kind: "image",
        model: ImageGenModelId.FLUX_2_PRO,
        title: "studio ok test",
        settings: { prompt: "cube" },
        locale: defaultLocale,
        logger,
        generate: async ({ progress, recordProviderJobId }) => {
          await progress?.("running");
          recordProviderJobId?.("gen-img-studio-ok");
          return success({
            imageUrl: "/api/storage/test.png",
            creditCost: 1,
          });
        },
      });
      expect(ok.success).toBe(true);

      const failed = await MediaStudioRepository.run({
        save: true,
        user,
        kind: "video",
        model: "kling-v2-5-turbo-t2v",
        title: "studio failed after submit",
        settings: { prompt: "wave" },
        locale: defaultLocale,
        logger,
        generate: async ({ progress, recordProviderJobId }) => {
          await progress?.("running");
          recordProviderJobId?.("venice-q-failed-1");
          return fail({
            message: creditsT("expire.post.errors.server.title"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        },
      });
      expect(failed.success).toBe(false);

      const rows = await db
        .select({
          status: studioGenerations.status,
          providerJobId: studioGenerations.providerJobId,
        })
        .from(studioGenerations)
        .where(eq(studioGenerations.userId, user.id));
      expect(rows).toContainEqual({
        status: "completed",
        providerJobId: "gen-img-studio-ok",
      });
      expect(rows).toContainEqual({
        status: "failed",
        providerJobId: "venice-q-failed-1",
      });
    } finally {
      await deleteTestUser(user.id);
    }
  });

  it("stores providerJobId on v1_media_jobs for both completed and failed jobs", async () => {
    const created = await createTestUser(`pjid-v1-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    const { user } = created.data;
    try {
      const completedJob = await createMediaJob({
        id: newMediaJobId("video"),
        userId: user.id,
        apiKeyId: null,
        kind: "video",
        model: "grok-imagine-video",
        prompt: "wave",
        params: {
          seconds: 5,
          size: "1280x720",
          aspectRatio: "16:9",
          resolution: "720p",
        },
      });
      expect(completedJob).not.toBeNull();
      if (!completedJob) {
        return;
      }
      startMediaJob(
        completedJob,
        async (onProviderJobId) => {
          onProviderJobId?.("gen-vid-v1-ok");
          return success({
            url: "/api/storage/video.mp4",
            creditCost: 3,
            durationSeconds: 5,
          });
        },
        logger,
      );
      const completedRow = await waitForV1JobStatus(
        completedJob.id,
        "completed",
      );
      expect(completedRow?.providerJobId).toBe("gen-vid-v1-ok");

      const failedJob = await createMediaJob({
        id: newMediaJobId("music"),
        userId: user.id,
        apiKeyId: null,
        kind: "music",
        model: "lyria-3",
        prompt: "synth",
        params: {
          seconds: 30,
          size: null,
          aspectRatio: null,
          resolution: null,
        },
      });
      expect(failedJob).not.toBeNull();
      if (!failedJob) {
        return;
      }
      startMediaJob(
        failedJob,
        async (onProviderJobId) => {
          onProviderJobId?.("ml-music-fail-9");
          return fail({
            message: creditsT("expire.post.errors.server.title"),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        },
        logger,
      );
      const failedRow = await waitForV1JobStatus(failedJob.id, "failed");
      expect(failedRow?.providerJobId).toBe("ml-music-fail-9");
    } finally {
      await deleteTestUser(user.id);
    }
  });
});
