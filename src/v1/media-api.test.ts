/**
 * OpenAI-compatible media API: images, audio (speech, transcriptions,
 * translations), async videos + music, signed media downloads, /v1/models
 * modalities.
 *
 * Gating (auth, paid rule, rate limit, model availability), validation and the
 * job lifecycle run on the real code + real DB with injected generators (no
 * provider call). The replay cases run the real tool repositories against
 * src/generated/ai-fixtures/http-cache/v1-media-<case>/ and assert the billing
 * ledger against the provider's recorded cost.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { and, desc, eq, gte, inArray, or } from "drizzle-orm";
import {
  createE2ECreditUser,
  type E2ECreditUser,
} from "next-vibe/agent/ai-stream/testing/e2e-credit-user";
import { cacheDir } from "next-vibe/agent/ai-stream/testing/fetch-cache";
import { seedFixtureThread } from "next-vibe/agent/ai-stream/testing/fixture-seed";
import { fixtures } from "next-vibe/agent/ai-stream/testing/fixtures.db";
import { getStorageAdapter } from "next-vibe/agent/chat/storage/index";
import { agentEnv } from "next-vibe/agent/env";
import { ImageGenModelId } from "next-vibe/agent/image-generation/models";
import { resolveMediaCharge } from "next-vibe/agent/models/models";
import { scopedTranslation as consentScopedTranslation } from "next-vibe/agent/models/uncensored-consent/i18n";
import { UncensoredConsentRepository } from "next-vibe/agent/models/uncensored-consent/repository";
import { MusicGenModelId } from "next-vibe/agent/music-generation/models";
import { VideoGenModelId } from "next-vibe/agent/video-generation/models";
import {
  makeHeadlessContext,
  rootlessToolExecutionContext,
  type ToolExecutionContext,
} from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  failInline,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type {
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "next-vibe/identity/auth/types";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";

import { ApiKeyAuth } from "@/api-keys/auth";
import { userApiKeys } from "@/api-keys/db";
import apiKeysEndpoints from "@/api-keys/definition";
import { generateApiKey } from "@/api-keys/keys";
import { creditTransactions, creditWallets } from "@/credits/db";

import { V1AudioSpeechRepository } from "./audio/speech/repository";
import {
  toSrt,
  toVtt,
  transcriptSegments,
  V1AudioTranscriptionsRepository,
} from "./audio/transcriptions/repository";
import { v1MediaJobs } from "./db";
import { scopedTranslation } from "./i18n";
import {
  mapImageQuality,
  mapImageShape,
  V1ImagesRepository,
} from "./images/repository";
import { V1MediaFileRepository } from "./media/[threadId]/[filename]/repository";
import { V1ModelsRepository } from "./models/repository";
import { musicDurationFor, V1MusicRepository } from "./music/repository";
import {
  fileToDataUri,
  signedMediaUrl,
  V1_MEDIA_URL_TTL_SECONDS,
  verifyMediaSignature,
} from "./shared/media";
import { mockV1Providers } from "./test-providers";
import { mapVideoSize, V1VideosRepository } from "./videos/repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

const errorSchema = z.object({
  error: z.object({
    message: z.string(),
    type: z.string(),
    code: z.string().nullable(),
  }),
});
const imagesSchema = z.object({
  created: z.number(),
  model: z.string(),
  data: z.array(
    z.union([
      z.object({ url: z.string() }),
      z.object({ b64_json: z.string() }),
    ]),
  ),
  credits_charged: z.number(),
});
const jobSchema = z.object({
  id: z.string(),
  object: z.string(),
  model: z.string(),
  status: z.enum(["queued", "in_progress", "completed", "failed"]),
  progress: z.number(),
  url: z.string().nullable(),
  credits_charged: z.number(),
  error: z.object({ code: z.string(), message: z.string() }).nullable(),
});
const modelsSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      modality: z.string(),
      endpoints: z.array(z.string()),
    }),
  ),
});

function anonymous(): JWTPublicPayloadType {
  return { isPublic: true, leadId: "", roles: [UserPermissionRole.PUBLIC] };
}

function v1Request(
  path: string,
  bearer: string | undefined,
  headers: Record<string, string> = {},
): Request {
  return new Request(`http://localhost/api/en-US/v1${path}`, {
    method: "POST",
    headers: {
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...headers,
    },
  });
}

async function authed(
  request: Request,
): Promise<JwtPrivatePayloadType | JWTPublicPayloadType> {
  const auth = await ApiKeyAuth.authenticateRequest(
    request,
    defaultLocale,
    logger,
  );
  return auth?.success ? auth.data : anonymous();
}

async function createKey(user: JwtPrivatePayloadType): Promise<string> {
  const res = await sendTestRequest({
    endpoint: apiKeysEndpoints.POST,
    data: { name: "media" },
    user,
    toolExecutionContext: undefined,
  });
  expect(res.success, JSON.stringify(res)).toBe(true);
  return res.success ? res.data.key : "";
}

/** Common params of a repository call for `key` on `path`. */
async function call(
  path: string,
  key: string | undefined,
  toolExecutionContext: ToolExecutionContext = rootlessToolExecutionContext(),
  headers: Record<string, string> = {},
): Promise<{
  user: JwtPrivatePayloadType | JWTPublicPayloadType;
  locale: typeof defaultLocale;
  logger: typeof logger;
  request: Request;
  t: typeof t;
  toolExecutionContext: ToolExecutionContext;
  platform: Platform;
}> {
  const request = v1Request(path, key, headers);
  return {
    user: await authed(request),
    locale: defaultLocale,
    logger,
    request,
    t,
    toolExecutionContext,
    platform: Platform.NEXT_API,
  };
}

async function errorOf(response: Response): Promise<z.infer<typeof errorSchema>> {
  return errorSchema.parse(await response.json());
}

/** Usage ledger rows of `user` since `since` (negative amounts). */
async function chargedSince(user: JwtPrivatePayloadType, since: Date): Promise<number> {
  // The account's pool: its user wallet AND every linked lead wallet. The free
  // allowance lives on the lead wallets and is spent first (one free pool per
  // account, 94002a48bd), so a user-wallet-only query misses those debits.
  const leadIds = (
    await db
      .select({ leadId: userLeadLinks.leadId })
      .from(userLeadLinks)
      .where(eq(userLeadLinks.userId, user.id))
  ).map((r) => r.leadId);
  const rows = await db
    .select({ amount: creditTransactions.amount })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditTransactions.walletId, creditWallets.id))
    .where(
      and(
        leadIds.length > 0
          ? or(eq(creditWallets.userId, user.id), inArray(creditWallets.leadId, leadIds))
          : eq(creditWallets.userId, user.id),
        gte(creditTransactions.createdAt, since),
      ),
    )
    .orderBy(desc(creditTransactions.createdAt));
  const total = rows.reduce((sum, row) => sum + (row.amount < 0 ? -row.amount : 0), 0);
  return Math.round(total * 100) / 100;
}

/** Store a file the way a media tool does and return its storage URL. */
async function storeFile(owner: JwtPrivatePayloadType, bytes: Uint8Array, mimeType: string, ext: string): Promise<string> {
  const upload = await getStorageAdapter().uploadFile(Buffer.from(bytes), {
    filename: `test.${ext}`,
    mimeType,
    threadId: crypto.randomUUID(),
    userId: owner.id,
  });
  return upload.url;
}

async function waitForJob(
  read: () => Promise<Response>,
  timeoutMs: number,
): Promise<z.infer<typeof jobSchema>> {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const job = jobSchema.parse(await (await read()).json());
    if (job.status === "completed" || job.status === "failed" || Date.now() > deadline) {
      return job;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  }
}

/** USD cost the recorded provider responses of a fixture folder report. */
function recordedUpstreamCost(prefix: string): number | undefined {
  const dir = cacheDir(prefix);
  let total: number | undefined;
  for (const name of readdirSync(dir).filter((file) => file.endsWith("-res.json"))) {
    const parsed = z
      .object({ body: z.object({ usage: z.object({ cost: z.number() }) }) })
      .safeParse(JSON.parse(readFileSync(join(dir, name), "utf8")));
    if (parsed.success) {
      total = (total ?? 0) + parsed.data.body.usage.cost;
    }
  }
  return total;
}

// ------------------------------------------------------------ pure helpers

describe("media mapping helpers", () => {
  it("maps OpenAI image sizes onto size buckets + ratios", () => {
    expect(mapImageShape("1024x1024", undefined)).toEqual({
      size: "post.size.square1024",
      aspectRatio: "1:1",
      explicit: true,
    });
    expect(mapImageShape("1536x1024", undefined)?.aspectRatio).toBe("3:2");
    expect(mapImageShape("1536x1024", undefined)?.size).toBe("post.size.landscape1792");
    expect(mapImageShape("1024x1792", undefined)?.size).toBe("post.size.portrait1792");
    expect(mapImageShape("auto", undefined)?.explicit).toBe(false);
    expect(mapImageShape(undefined, "16:9")?.aspectRatio).toBe("16:9");
    expect(mapImageShape("big", undefined)).toBeNull();
    expect(mapImageQuality("hd")).toBe("post.quality.hd");
    expect(mapImageQuality("high")).toBe("post.quality.hd");
    expect(mapImageQuality("auto")).toBe("post.quality.standard");
  });

  it("maps video sizes and music lengths", () => {
    expect(mapVideoSize("1280x720")).toEqual({ aspectRatio: "16:9", resolution: "720p" });
    expect(mapVideoSize("720x1280")).toEqual({ aspectRatio: "9:16", resolution: "720p" });
    expect(musicDurationFor(undefined)).toBe("post.duration.medium");
    expect(musicDurationFor(5)).toBe("post.duration.short");
    expect(musicDurationFor(60)).toBe("post.duration.long");
  });

  it("signs media URLs: valid until expiry, bound to the file", () => {
    const storageUrl =
      "/api/en-GLOBAL/vibe/agent/chat/threads/files/thread-1/file-1.png";
    const now = 1_800_000_000;
    const url = new URL(signedMediaUrl(storageUrl, undefined, now));
    expect(url.pathname).toBe("/api/en-GLOBAL/v1/media/thread-1/file-1.png");
    const expires = Number(url.searchParams.get("expires"));
    const sig = url.searchParams.get("sig") ?? "";
    expect(expires).toBe(now + V1_MEDIA_URL_TTL_SECONDS);
    expect(verifyMediaSignature("thread-1", "file-1.png", expires, sig, now)).toBe(true);
    expect(verifyMediaSignature("thread-1", "file-2.png", expires, sig, now)).toBe(false);
    expect(verifyMediaSignature("thread-1", "file-1.png", expires + 1, sig, now)).toBe(false);
    expect(verifyMediaSignature("thread-1", "file-1.png", expires, sig, expires + 1)).toBe(false);
    // Not one of our files: unchanged.
    expect(signedMediaUrl("https://cdn.example.com/a.png", undefined)).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("renders SRT and WebVTT from segments, or one cue without them", () => {
    const segments = [
      { start: 0, end: 1.5, text: "Hello there." },
      { start: 1.5, end: 3.25, text: "General Kenobi." },
    ];
    expect(toSrt(segments)).toBe(
      "1\n00:00:00,000 --> 00:00:01,500\nHello there.\n\n2\n00:00:01,500 --> 00:00:03,250\nGeneral Kenobi.\n",
    );
    expect(toVtt(segments)).toBe(
      "WEBVTT\n\n00:00:00.000 --> 00:00:01.500\nHello there.\n\n00:00:01.500 --> 00:00:03.250\nGeneral Kenobi.\n",
    );
    expect(
      transcriptSegments({ text: "one two three four five", duration: 0, segments: undefined }),
    ).toEqual([{ start: 0, end: 2, text: "one two three four five" }]);
  });
});

// ------------------------------------------------- gating, validation, jobs

describe("OpenAI-compatible media API", () => {
  let alice: E2ECreditUser;
  let bob: E2ECreditUser;
  let free: E2ECreditUser;
  let aliceKey = "";
  let bobKey = "";
  let freeKey = "";
  const scopes: string[] = [];
  let restoreProviders: (() => void) | undefined;
  const originalOpenRouterKey = agentEnv.OPENROUTER_API_KEY;
  const originalEdenKey = agentEnv.EDEN_AI_API_KEY;
  const originalNanoKey = agentEnv.NANO_GPT_API_KEY;
  const originalReplayOnly = process.env["VIBE_FIXTURE_REPLAY_ONLY"];

  async function fixtureContext(prefix: string): Promise<ToolExecutionContext> {
    const scope = crypto.randomUUID();
    scopes.push(scope);
    await seedFixtureThread(scope, prefix, false);
    return {
      ...makeHeadlessContext(undefined, undefined, "UTC"),
      fixtureScopeId: scope,
    };
  }

  beforeAll(async () => {
    process.env["VIBE_FIXTURE_REPLAY_ONLY"] = "1";
    agentEnv.OPENROUTER_API_KEY = "fixture-only";
    agentEnv.EDEN_AI_API_KEY = "fixture-only";
    agentEnv.NANO_GPT_API_KEY = "fixture-only";
    restoreProviders = mockV1Providers({
      voice: true,
      uncensoredAI: true,
      veniceAI: true,
      nanoGPT: true,
      modelsLab: true,
      edenAiStt: true,
      edenAiTts: true,
    });
    alice = await createE2ECreditUser("v1-media-alice", 300);
    bob = await createE2ECreditUser("v1-media-bob", 300);
    free = await createE2ECreditUser("v1-media-free", 0);
    aliceKey = await createKey(alice.user);
    bobKey = await createKey(bob.user);
    // Free accounts cannot create keys; one made before the paid rule.
    const generated = generateApiKey();
    await db.insert(userApiKeys).values({
      userId: free.user.id,
      name: "legacy",
      keyPrefix: generated.keyPrefix,
      hashedKey: generated.hashedKey,
    });
    freeKey = generated.plaintext;
  }, 60_000);

  afterAll(async () => {
    try {
      if (scopes.length > 0) {
        await db.delete(fixtures).where(inArray(fixtures.threadId, scopes));
      }
      if (alice) {
        await db
          .delete(v1MediaJobs)
          .where(eq(v1MediaJobs.userId, alice.user.id));
        await alice.remove();
      }
      await bob?.remove();
      await free?.remove();
    } finally {
      restoreProviders?.();
      agentEnv.OPENROUTER_API_KEY = originalOpenRouterKey;
      agentEnv.EDEN_AI_API_KEY = originalEdenKey;
      agentEnv.NANO_GPT_API_KEY = originalNanoKey;
      if (originalReplayOnly === undefined) {
        delete process.env["VIBE_FIXTURE_REPLAY_ONLY"];
      } else {
        process.env["VIBE_FIXTURE_REPLAY_ONLY"] = originalReplayOnly;
      }
    }
  }, 60_000);

  describe("gate", () => {
    it("401 without a key, on every media endpoint", async () => {
      const images = await V1ImagesRepository.generate({
        ...(await call("/images/generations", undefined)),
        data: { model: "flux-2-klein-4b", prompt: "x" },
      });
      expect(images.response.status).toBe(401);
      expect((await errorOf(images.response)).error.code).toBe("missing_api_key");
      const speech = await V1AudioSpeechRepository.speak({
        ...(await call("/audio/speech", undefined)),
        data: { model: "tts-1", voice: "nova", input: "hi" },
      });
      expect(speech.response.status).toBe(401);
      const video = await V1VideosRepository.create({
        ...(await call("/videos", undefined)),
        data: { model: "x", prompt: "x" },
      });
      expect(video.response.status).toBe(401);
      const music = await V1MusicRepository.create({
        ...(await call("/music", undefined)),
        data: { model: "x", prompt: "x" },
      });
      expect(music.response.status).toBe(401);
    });

    it("402 for a key of an account that never paid", async () => {
      for (const response of [
        await V1ImagesRepository.generate({
          ...(await call("/images/generations", freeKey)),
          data: { model: "flux-2-klein-4b", prompt: "x" },
        }),
        await V1AudioTranscriptionsRepository.transcribe({
          ...(await call("/audio/transcriptions", freeKey)),
          task: "transcribe",
          data: { model: "whisper-1", file: new File([new Uint8Array(10)], "a.mp3", { type: "audio/mpeg" }) },
        }),
        await V1VideosRepository.create({
          ...(await call("/videos", freeKey)),
          data: { model: "x", prompt: "x" },
        }),
      ]) {
        expect(response.response.status).toBe(402);
        expect((await errorOf(response.response)).error.code).toBe("paid_plan_required");
      }
    });

    it("429 once the key's per-minute budget is spent", async () => {
      const key = await createKey(alice.user);
      let limited = false;
      for (let i = 0; i < 70 && !limited; i++) {
        const out = await V1ImagesRepository.generate({
          ...(await call("/images/generations", key)),
          data: { model: "no-such-model", prompt: "x" },
        });
        limited = out.response.status === 429;
      }
      expect(limited).toBe(true);
    }, 60_000);
  });

  describe("models + validation", () => {
    it("lists media models with their modality; Anthropic clients get chat only", async () => {
      const listed = modelsSchema.parse(
        await (
          await V1ModelsRepository.list(
            (await call("/models", aliceKey)).user,
            v1Request("/models", aliceKey),
            defaultLocale,
            t,
            logger,
          )
        ).response.json(),
      );
      const image = listed.data.find((m) => m.id === ImageGenModelId.FLUX_3_KLEIN);
      expect(image?.modality).toBe("image");
      expect(image?.endpoints).toContain("/v1/images/generations");
      expect(listed.data.some((m) => m.modality === "chat")).toBe(true);
      expect(new Set(listed.data.map((m) => m.id)).size).toBe(listed.data.length);

      const anthropic = modelsSchema.parse(
        await (
          await V1ModelsRepository.list(
            (await call("/models", aliceKey)).user,
            v1Request("/models", aliceKey, { "anthropic-version": "2023-06-01" }),
            defaultLocale,
            t,
            logger,
          )
        ).response.json(),
      );
      expect(anthropic.data.every((m) => m.modality === "chat")).toBe(true);
    });

    it("404 model_not_found for unknown media models", async () => {
      const image = await V1ImagesRepository.generate({
        ...(await call("/images/generations", aliceKey)),
        data: { model: "dall-e-9", prompt: "x" },
      });
      expect(image.response.status).toBe(404);
      expect((await errorOf(image.response)).error.code).toBe("model_not_found");
      const speech = await V1AudioSpeechRepository.speak({
        ...(await call("/audio/speech", aliceKey)),
        data: { model: "tts-1", voice: "no-such-voice", input: "hi" },
      });
      expect(speech.response.status).toBe(404);
      const video = await V1VideosRepository.create({
        ...(await call("/videos", aliceKey)),
        data: { model: "sora-9", prompt: "x" },
      });
      expect(video.response.status).toBe(404);
    });

    it("400 for a bad size, a mask, a missing image, and image input on a text-only model", async () => {
      const badSize = await V1ImagesRepository.generate({
        ...(await call("/images/generations", aliceKey)),
        data: { model: ImageGenModelId.FLUX_3_KLEIN, prompt: "x", size: "huge" },
      });
      expect(badSize.response.status).toBe(400);
      expect((await errorOf(badSize.response)).error.message).toContain("huge");
      const mask = await V1ImagesRepository.edit({
        ...(await call("/images/edits", aliceKey)),
        data: {
          model: ImageGenModelId.QWEN_EDIT,
          prompt: "x",
          image: new File([new Uint8Array(8)], "a.png", { type: "image/png" }),
          mask: new File([new Uint8Array(8)], "m.png", { type: "image/png" }),
        },
      });
      expect(mask.response.status).toBe(400);
      expect((await errorOf(mask.response)).error.code).toBe("unsupported_parameter");
      const noImage = await V1ImagesRepository.edit({
        ...(await call("/images/edits", aliceKey)),
        data: { model: ImageGenModelId.QWEN_EDIT, prompt: "x" },
      });
      expect(noImage.response.status).toBe(400);
      const textOnly = await V1ImagesRepository.edit({
        ...(await call("/images/edits", aliceKey)),
        data: {
          model: ImageGenModelId.RECRAFT_V4_1_FLASH,
          prompt: "x",
          image_url: "https://example.com/a.png",
        },
      });
      expect(textOnly.response.status).toBe(400);
      expect((await errorOf(textOnly.response)).error.message).toContain(
        ImageGenModelId.RECRAFT_V4_1_FLASH,
      );
    });

    it("translation is refused on a route that is not Whisper on OpenAI", async () => {
      // whisper-large-v3 runs on NanoGPT: never a translation route.
      const out = await V1AudioTranscriptionsRepository.transcribe({
        ...(await call("/audio/translations", aliceKey)),
        task: "translate",
        data: {
          model: "whisper-large-v3",
          file: new File([new Uint8Array(32)], "a.mp3", { type: "audio/mpeg" }),
        },
      });
      expect(out.response.status).toBe(400);
      expect((await errorOf(out.response)).error.message).toContain("whisper-1");
    });

    it("turns an uploaded file into a data: URI reference", async () => {
      const uri = await fileToDataUri(
        new File([new Uint8Array([1, 2, 3])], "a.png", { type: "image/png" }),
      );
      expect(uri).toBe("data:image/png;base64,AQID");
    });
  });

  describe("async jobs (injected generator)", () => {
    it("queues, completes, bills via the generator, serves status + content + signed URL", async () => {
      const videoBytes = new Uint8Array([0, 0, 0, 24, 102, 116, 121, 112, 109, 112, 52, 50]);
      const stored = await storeFile(alice.user, videoBytes, "video/mp4", "mp4");
      const created = await V1VideosRepository.create({
        ...(await call("/videos", aliceKey)),
        data: { model: VideoGenModelId.GROK_IMAGINE_VIDEO_1_5_LITE, prompt: "a boat", seconds: 1 },
        generate: () =>
          Promise.resolve(success({ url: stored, creditCost: 3.9, durationSeconds: 1 })),
      });
      expect(created.response.status, await created.response.clone().text()).toBe(200);
      const queued = jobSchema.parse(await created.response.json());
      expect(queued.object).toBe("video");
      expect(queued.status).toBe("queued");
      expect(queued.id.startsWith("video_")).toBe(true);

      const job = await waitForJob(
        async () =>
          (
            await V1VideosRepository.get({ ...(await call(`/videos/${queued.id}`, aliceKey)), id: queued.id })
          ).response,
        10_000,
      );
      expect(job.status).toBe("completed");
      expect(job.credits_charged).toBe(3.9);
      expect(job.url).toContain("/v1/media/");

      const content = await V1VideosRepository.content({
        ...(await call(`/videos/${queued.id}/content`, aliceKey)),
        id: queued.id,
      });
      expect(content.response.status).toBe(200);
      expect(content.response.headers.get("content-type")).toBe("video/mp4");
      expect(new Uint8Array(await content.response.arrayBuffer())).toEqual(videoBytes);

      // Signed URL: no key needed.
      const signed = new URL(job.url ?? "");
      const [, , , , , threadId = "", filename = ""] = signed.pathname.split("/");
      const download = await V1MediaFileRepository.download({
        ...(await call("/media", undefined)),
        threadId,
        filename,
        expires: Number(signed.searchParams.get("expires")),
        sig: signed.searchParams.get("sig") ?? undefined,
      });
      expect(download.response.status).toBe(200);
      expect(new Uint8Array(await download.response.arrayBuffer())).toEqual(videoBytes);
      // Tampered signature: 404, no bytes.
      const tampered = await V1MediaFileRepository.download({
        ...(await call("/media", undefined)),
        threadId,
        filename,
        expires: Number(signed.searchParams.get("expires")),
        sig: "0".repeat(64),
      });
      expect(tampered.response.status).toBe(404);
      // Owner's key without signature works; another account's key does not.
      const byKey = await V1MediaFileRepository.download({
        ...(await call("/media", aliceKey)),
        threadId,
        filename,
        expires: undefined,
        sig: undefined,
      });
      expect(byKey.response.status).toBe(200);
      const byOther = await V1MediaFileRepository.download({
        ...(await call("/media", bobKey)),
        threadId,
        filename,
        expires: undefined,
        sig: undefined,
      });
      expect(byOther.response.status).toBe(404);

      // Bob cannot see Alice's job.
      const foreign = await V1VideosRepository.get({
        ...(await call(`/videos/${queued.id}`, bobKey)),
        id: queued.id,
      });
      expect(foreign.response.status).toBe(404);
    });

    it("a refused generation fails the job with content_policy_violation", async () => {
      const created = await V1MusicRepository.create({
        ...(await call("/music", aliceKey)),
        data: { model: MusicGenModelId.LYRIA_3_CLIP_PREVIEW, prompt: "x" },
        generate: () =>
          Promise.resolve(
            // A provider's raw refusal text, as a tool repository passes it on.
            failInline({
              message: "Request blocked by safety system: content policy violation",
              errorType: ErrorResponseTypes.BAD_REQUEST,
            }),
          ),
      });
      expect(created.response.status, await created.response.clone().text()).toBe(200);
      const queued = jobSchema.parse(await created.response.json());
      expect(queued.object).toBe("music");
      const job = await waitForJob(
        async () =>
          (await V1MusicRepository.get({ ...(await call(`/music/${queued.id}`, aliceKey)), id: queued.id })).response,
        10_000,
      );
      expect(job.status).toBe("failed");
      expect(job.error?.code).toBe("content_policy_violation");
      expect(job.credits_charged).toBe(0);
      const content = await V1MusicRepository.content({
        ...(await call(`/music/${queued.id}/content`, aliceKey)),
        id: queued.id,
      });
      expect(content.response.status).toBe(409);
    });

    it("a job whose process died is closed as interrupted", async () => {
      const id = `video_${crypto.randomUUID().replaceAll("-", "")}`;
      await db.insert(v1MediaJobs).values({
        id,
        userId: alice.user.id,
        kind: "video",
        model: VideoGenModelId.GROK_IMAGINE_VIDEO_1_5_LITE,
        prompt: "x",
        params: { seconds: 1, size: null, aspectRatio: null, resolution: null },
        status: "in_progress",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      });
      const out = await V1VideosRepository.get({ ...(await call(`/videos/${id}`, aliceKey)), id });
      const job = jobSchema.parse(await out.response.json());
      expect(job.status).toBe("failed");
      expect(job.error?.code).toBe("job_interrupted");
    });
  });

  describe("provider recordings", () => {
    it("images/generations: cheapest model, url + b64, billed at the provider's real cost", async () => {
      const prefix = "v1-media-images-generations";
      const since = new Date();
      const out = await V1ImagesRepository.generate({
        ...(await call("/images/generations", aliceKey, await fixtureContext(prefix))),
        data: {
          model: ImageGenModelId.FLUX_3_KLEIN,
          prompt: "A small red circle on a white background",
          size: "1024x1024",
        },
      });
      expect(out.response.status, await out.response.clone().text()).toBe(200);
      const body = imagesSchema.parse(await out.response.json());
      expect(body.data).toHaveLength(1);
      const first = body.data[0];
      expect(first && "url" in first ? first.url : "").toContain("/v1/media/");
      const cost = recordedUpstreamCost(prefix);
      expect(cost).toBeGreaterThan(0);
      expect(body.credits_charged).toBe(resolveMediaCharge(cost, 0).credits);
      expect(await chargedSince(alice.user, since)).toBe(body.credits_charged);

      // The signed URL serves the stored image.
      const signed = new URL(first && "url" in first ? first.url : "http://x/");
      const [, , , , , threadId = "", filename = ""] = signed.pathname.split("/");
      const download = await V1MediaFileRepository.download({
        ...(await call("/media", undefined)),
        threadId,
        filename,
        expires: Number(signed.searchParams.get("expires")),
        sig: signed.searchParams.get("sig") ?? undefined,
      });
      expect(download.response.status).toBe(200);
      expect(download.response.headers.get("content-type")).toMatch(/^image\//);
    }, 180_000);

    it("images/edits: edits a reference image, b64_json, billed at the provider's real cost", async () => {
      const prefix = "v1-media-images-edits";
      const since = new Date();
      const out = await V1ImagesRepository.edit({
        ...(await call("/images/edits", aliceKey, await fixtureContext(prefix))),
        data: {
          model: ImageGenModelId.FLUX_3_KLEIN,
          prompt: "Make the background blue",
          response_format: "b64_json",
          // Small stable public PNG, fetched once while recording.
          image_url: "https://dummyimage.com/320x320/4287f5/ffffff.png",
        },
      });
      expect(out.response.status, await out.response.clone().text()).toBe(200);
      const body = imagesSchema.parse(await out.response.json());
      const first = body.data[0];
      expect(first && "b64_json" in first ? first.b64_json.length : 0).toBeGreaterThan(1000);
      const cost = recordedUpstreamCost(prefix);
      expect(cost).toBeGreaterThan(0);
      expect(body.credits_charged).toBe(resolveMediaCharge(cost, 0).credits);
      expect(await chargedSince(alice.user, since)).toBe(body.credits_charged);
    }, 180_000);

    it("uncensored media models need the account's 18+ consent first (403, nothing charged)", async () => {
      const since = new Date();
      const refused = await V1ImagesRepository.edit({
        ...(await call("/images/edits", aliceKey)),
        data: {
          model: ImageGenModelId.QWEN_EDIT,
          prompt: "x",
          image_url: "https://dummyimage.com/320x320/4287f5/ffffff.png",
        },
      });
      expect(refused.response.status).toBe(403);
      expect((await errorOf(refused.response)).error.code).toBe("uncensored_consent_required");
      const speech = await V1AudioSpeechRepository.speak({
        ...(await call("/audio/speech", aliceKey)),
        data: { model: "kokoro", voice: "bella", input: "hi" },
      });
      expect(speech.response.status).toBe(403);
      expect(await chargedSince(alice.user, since)).toBe(0);
      const agreed = await UncensoredConsentRepository.agree(
        alice.user,
        logger,
        consentScopedTranslation.scopedT(defaultLocale).t,
      );
      expect(agreed.success).toBe(true);
    });

    let speechBytes = new Uint8Array(0);
    let speechType = "audio/mpeg";

    it("audio/speech: OpenAI model + voice spelling, mp3 bytes, billed per character", async () => {
      const since = new Date();
      const out = await V1AudioSpeechRepository.speak({
        ...(await call("/audio/speech", aliceKey, await fixtureContext("v1-media-audio-speech"))),
        data: {
          model: "tts-1",
          voice: "alloy",
          input: "The quick brown fox jumps over the lazy dog.",
        },
      });
      expect(out.response.status, await out.response.clone().text()).toBe(200);
      expect(out.response.headers.get("content-type")).toMatch(/^audio\//);
      expect(out.response.headers.get("x-voice")).toBe("openai-alloy");
      const credits = Number(out.response.headers.get("x-credits-charged"));
      speechType = out.response.headers.get("content-type") ?? speechType;
      // OpenAI's default format: mp3, whatever the provider's own default is.
      expect(speechType).toBe("audio/mpeg");
      speechBytes = new Uint8Array(await out.response.arrayBuffer());
      expect(speechBytes.length).toBeGreaterThan(1000);
      expect(credits).toBeGreaterThan(0);
      expect(await chargedSince(alice.user, since)).toBe(credits);
    }, 120_000);

    it("audio/transcriptions: transcribes the speech back, json and srt", async () => {
      expect(speechBytes.length).toBeGreaterThan(0);
      const context = await fixtureContext("v1-media-audio-transcriptions");
      const since = new Date();
      const json = await V1AudioTranscriptionsRepository.transcribe({
        ...(await call("/audio/transcriptions", aliceKey, context)),
        task: "transcribe",
        data: {
          model: "whisper-large-v3",
          language: "en",
          file: new File([speechBytes], "speech.mp3", { type: speechType }),
        },
      });
      expect(json.response.status, await json.response.clone().text()).toBe(200);
      const body = z
        .object({ text: z.string(), credits_charged: z.number() })
        .parse(await json.response.json());
      expect(body.text.toLowerCase()).toContain("fox");
      expect(await chargedSince(alice.user, since)).toBe(body.credits_charged);

      const srt = await V1AudioTranscriptionsRepository.transcribe({
        ...(await call("/audio/transcriptions", aliceKey, context)),
        task: "transcribe",
        data: {
          model: "whisper-large-v3",
          language: "en",
          response_format: "srt",
          file: new File([speechBytes], "speech.mp3", { type: speechType }),
        },
      });
      expect(srt.response.status).toBe(200);
      const text = await srt.response.text();
      expect(text.startsWith("1\n00:00:00,000 --> ")).toBe(true);
      expect(text.toLowerCase()).toContain("fox");
    }, 120_000);

    it("videos: cheapest model, 1 second, completes and bills only when ready", async () => {
      const since = new Date();
      const created = await V1VideosRepository.create({
        ...(await call("/videos", aliceKey, await fixtureContext("v1-media-videos"))),
        data: {
          model: VideoGenModelId.GROK_IMAGINE_VIDEO_1_5_LITE,
          prompt: "A red ball bouncing once on a white floor",
          seconds: 1,
          size: "1280x720",
        },
      });
      expect(created.response.status, await created.response.clone().text()).toBe(200);
      const queued = jobSchema.parse(await created.response.json());
      expect(await chargedSince(alice.user, since)).toBe(0);
      const job = await waitForJob(
        async () =>
          (await V1VideosRepository.get({ ...(await call(`/videos/${queued.id}`, aliceKey)), id: queued.id })).response,
        540_000,
      );
      expect(job.status, JSON.stringify(job.error)).toBe("completed");
      expect(job.credits_charged).toBeGreaterThan(0);
      expect(await chargedSince(alice.user, since)).toBe(job.credits_charged);
      const content = await V1VideosRepository.content({
        ...(await call(`/videos/${queued.id}/content`, aliceKey)),
        id: queued.id,
      });
      expect(content.response.status).toBe(200);
      expect(content.response.headers.get("content-type")).toMatch(/^video\//);
    }, 600_000);

    it("music: cheapest clip model completes and bills", async () => {
      const since = new Date();
      const created = await V1MusicRepository.create({
        ...(await call("/music", aliceKey, await fixtureContext("v1-media-music"))),
        data: {
          model: MusicGenModelId.LYRIA_3_CLIP_PREVIEW,
          prompt: "Short calm piano melody",
          seconds: 8,
        },
      });
      expect(created.response.status, await created.response.clone().text()).toBe(200);
      const queued = jobSchema.parse(await created.response.json());
      const job = await waitForJob(
        async () =>
          (await V1MusicRepository.get({ ...(await call(`/music/${queued.id}`, aliceKey)), id: queued.id })).response,
        300_000,
      );
      expect(job.status, JSON.stringify(job.error)).toBe("completed");
      expect(job.credits_charged).toBeGreaterThan(0);
      expect(await chargedSince(alice.user, since)).toBe(job.credits_charged);
      const content = await V1MusicRepository.content({
        ...(await call(`/music/${queued.id}/content`, aliceKey)),
        id: queued.id,
      });
      expect(content.response.status).toBe(200);
      expect(content.response.headers.get("content-type")).toMatch(/^audio\//);
    }, 360_000);
  });
});
