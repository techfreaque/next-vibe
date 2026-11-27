/**
 * Skill Import Repository
 * Imports a public Character.AI / Talkie character into a skill the caller owns.
 */

import "server-only";

import { and, eq, or, sql } from "drizzle-orm";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { fetchPublicUrl } from "next-vibe/core/utils/ssrf-guard";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { DEFAULT_CHAT_MODEL_SELECTION } from "../../ai-stream/constants";
import { createFixtureFetch } from "../../ai-stream/testing/fetch-cache";
import { getStorageAdapter } from "../../chat/storage/index";
import { agentEnv } from "../../env";
import { FetchUrlContentRepository } from "../../fetch-url-content/repository";
import { SKILL_AVATAR_STORAGE_NAMESPACE } from "../constants";
import type { SkillImportSource } from "../db";
import { customSkills } from "../db";
import { SkillCategory, SkillStatus, SkillType } from "../enum";
import { scopedTranslation as skillsScopedTranslation } from "../i18n";
import { SkillsRepository } from "../repository";
import type {
  SkillImportPostRequestOutput,
  SkillImportPostResponseOutput,
} from "./definition";
import type { SkillImportPlatformValue } from "./enum";
import { SkillImportVisibility } from "./enum";
import type { SkillImportT } from "./i18n";
import type {
  DetectedCharacterLink,
  FetchedPage,
  ImportedField,
  PageFetcher,
  ParsedCharacter,
} from "./parsers";
import {
  buildSkillContent,
  detectCharacterLink,
  importSourceKey,
  loadCharacter,
} from "./parsers";

// ─── Limits ─────────────────────────────────────────────────────────────────

/** Fresh imports (network fetches) per user per window. Dedupe hits are free. */
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_PAGE_BYTES = 5 * 1024 * 1024;
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const DIRECT_TIMEOUT_MS = 20_000;
const AVATAR_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
/** Honest client name; both platforms serve their public pages to it. */
const USER_AGENT =
  "Mozilla/5.0 (compatible; unbottled-import/1.0; +https://unbottled.ai)";

const importHits = new Map<string, number[]>();
const inFlight = new Set<string>();

/** Sliding-window limiter (per process; mirrors api-keys consumeRateLimit). */
export function consumeImportRateLimit(
  userId: string,
  now: number = Date.now(),
  max: number = RATE_LIMIT_MAX,
): { allowed: boolean; retryAfterSeconds: number } {
  const recent = (importHits.get(userId) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= max) {
    importHits.set(userId, recent);
    const oldest = recent[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000),
      ),
    };
  }
  recent.push(now);
  importHits.set(userId, recent);
  return { allowed: true, retryAfterSeconds: 0 };
}

function platformLabel(
  platform: typeof SkillImportPlatformValue,
  t: SkillImportT,
): string {
  return t(platform);
}

// ─── Fetching ───────────────────────────────────────────────────────────────

function createDirectFetcher(
  fetchImpl: typeof globalThis.fetch,
  logger: EndpointLogger,
): PageFetcher {
  return async (url: string): Promise<FetchedPage | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, DIRECT_TIMEOUT_MS);
    try {
      // oxlint-disable-next-line restricted/restricted-syntax -- external API: public character page (SSRF-guarded)
      const response = await fetchPublicUrl(url, fetchImpl, {
        headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
        signal: controller.signal,
      });
      if (!response) {
        return null;
      }
      const html = await response.text();
      return {
        status: response.status,
        html:
          html.length > MAX_PAGE_BYTES ? html.slice(0, MAX_PAGE_BYTES) : html,
      };
    } catch (error) {
      logger.warn("Character import: direct fetch failed", {
        url,
        error: parseError(error).message,
      });
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  };
}

function createAntiBotFetcher(
  fetchImpl: typeof globalThis.fetch,
  logger: EndpointLogger,
): PageFetcher | null {
  if (!agentEnv.SCRAPPEY_API_KEY) {
    return null;
  }
  return async (url: string): Promise<FetchedPage | null> => {
    const result =
      await FetchUrlContentRepository.getFetchUrlService().fetchRawHtml(
        url,
        fetchImpl,
      );
    if (!result.ok) {
      logger.warn("Character import: anti-bot fetch failed", {
        url,
        error: result.error,
        isTimeout: result.isTimeout ?? false,
      });
      return null;
    }
    return { status: result.data.statusCode, html: result.data.html };
  };
}

/**
 * Download the avatar and store it in our storage (never hotlinked). Returns
 * the portable storage URL, or null when the image is missing or unusable.
 */
async function storeAvatar(
  sourceUrl: string,
  userId: string,
  fetchImpl: typeof globalThis.fetch,
  logger: EndpointLogger,
): Promise<string | null> {
  try {
    // oxlint-disable-next-line restricted/restricted-syntax -- external API: public avatar CDN (SSRF-guarded)
    const response = await fetchPublicUrl(sourceUrl, fetchImpl, {
      headers: { "User-Agent": USER_AGENT, Accept: "image/*" },
    });
    if (!response?.ok) {
      logger.warn("Character import: avatar download failed", {
        sourceUrl,
        status: response?.status ?? null,
      });
      return null;
    }
    const mimeType = (response.headers.get("content-type") ?? "")
      .split(";")[0]
      ?.trim()
      .toLowerCase();
    const ext = mimeType ? AVATAR_TYPES[mimeType] : undefined;
    if (!mimeType || !ext) {
      logger.warn("Character import: avatar has unsupported type", {
        sourceUrl,
        mimeType: mimeType ?? null,
      });
      return null;
    }
    const buffer = Buffer.from(new Uint8Array(await response.arrayBuffer()));
    return await storeAvatarBytes(buffer, mimeType, userId, logger);
  } catch (error) {
    logger.warn("Character import: avatar store failed", {
      sourceUrl,
      error: parseError(error).message,
    });
    return null;
  }
}

/**
 * Store avatar bytes in the public avatar folder. Returns the portable
 * storage URL, or null when the image type or size is unusable.
 */
export async function storeAvatarBytes(
  buffer: Buffer,
  mimeType: string,
  userId: string,
  logger: EndpointLogger,
): Promise<string | null> {
  const ext = AVATAR_TYPES[mimeType];
  if (!ext) {
    logger.warn("Character import: avatar has unsupported type", { mimeType });
    return null;
  }
  if (buffer.length === 0 || buffer.length > MAX_AVATAR_BYTES) {
    logger.warn("Character import: avatar size out of range", {
      bytes: buffer.length,
    });
    return null;
  }
  try {
    const stored = await getStorageAdapter().uploadFile(buffer, {
      filename: `character-avatar.${ext}`,
      mimeType,
      threadId: SKILL_AVATAR_STORAGE_NAMESPACE,
      userId,
    });
    return stored.url || null;
  } catch (error) {
    logger.warn("Character import: avatar store failed", {
      error: parseError(error).message,
    });
    return null;
  }
}

// ─── Repository ─────────────────────────────────────────────────────────────

interface ExistingImport {
  id: string;
  slug: string;
  name: string;
  avatarUrl: string | null;
  importSource: SkillImportSource | null;
}

export class SkillImportRepository {
  /** The caller's existing import of this source (by dedupe key or source URL). */
  static async findExisting(
    userId: string,
    keys: string[],
    sourceUrls: string[],
  ): Promise<ExistingImport | null> {
    const conditions = [
      ...keys.map((key) => eq(customSkills.importSourceKey, key)),
      ...sourceUrls.map(
        (url) => sql`${customSkills.importSource}->>'sourceUrl' = ${url}`,
      ),
    ];
    if (conditions.length === 0) {
      return null;
    }
    const [row] = await db
      .select({
        id: customSkills.id,
        slug: customSkills.slug,
        name: customSkills.name,
        avatarUrl: customSkills.avatarUrl,
        importSource: customSkills.importSource,
      })
      .from(customSkills)
      .where(
        and(
          eq(customSkills.userId, userId),
          eq(customSkills.isDeleted, false),
          or(...conditions),
        ),
      )
      .limit(1);
    return row ?? null;
  }

  /** Response for a source the caller already imported. */
  static existingResponse(
    existing: ExistingImport,
    fallback: { platform: typeof SkillImportPlatformValue; sourceUrl: string },
  ): SkillImportPostResponseOutput {
    const source = existing.importSource;
    return {
      id: existing.slug || existing.id,
      name: existing.name,
      platform: source?.platform ?? fallback.platform,
      creatorName: source?.creatorName ?? null,
      sourceUrl: source?.sourceUrl ?? fallback.sourceUrl,
      avatarUrl: existing.avatarUrl,
      alreadyImported: true,
      importedFields: [],
    };
  }

  static async importFromLink(
    data: SkillImportPostRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: SkillImportT,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<SkillImportPostResponseOutput>> {
    const userId = user.isPublic ? null : user.id;
    if (!userId) {
      return fail({
        message: t("post.errors.unauthorized.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    const link = detectCharacterLink(data.url);
    if (!link) {
      return fail({
        message: t("post.errors.unsupported"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }
    const platform = platformLabel(link.platform, t);

    try {
      // Cheap dedupe before any network call.
      const preExisting = await SkillImportRepository.findExisting(
        userId,
        link.sourceIdHint
          ? [importSourceKey(link.platform, link.sourceIdHint)]
          : [],
        [link.fetchUrl],
      );
      if (preExisting) {
        return success(
          SkillImportRepository.existingResponse(preExisting, {
            platform: link.platform,
            sourceUrl: link.fetchUrl,
          }),
        );
      }

      const lockKey = `${userId}:${link.fetchUrl}`;
      if (inFlight.has(lockKey)) {
        return fail({
          message: t("post.errors.conflict.description"),
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      const limit = consumeImportRateLimit(userId);
      if (!limit.allowed) {
        return fail({
          message: t("post.errors.rateLimited", {
            seconds: limit.retryAfterSeconds,
          }),
          errorType: ErrorResponseTypes.BAD_REQUEST,
        });
      }

      inFlight.add(lockKey);
      try {
        return await SkillImportRepository.fetchAndCreate(
          link,
          data,
          user,
          userId,
          platform,
          logger,
          locale,
          t,
          toolExecutionContext,
        );
      } finally {
        inFlight.delete(lockKey);
      }
    } catch (error) {
      logger.error("Character import failed", {
        ...parseError(error),
        url: data.url,
        platform: link.platform,
      });
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private static async fetchAndCreate(
    link: DetectedCharacterLink,
    data: SkillImportPostRequestOutput,
    user: JwtPayloadType,
    userId: string,
    platform: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: SkillImportT,
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<SkillImportPostResponseOutput>> {
    const fetchImpl = createFixtureFetch(toolExecutionContext, logger);
    const loaded = await loadCharacter(
      link,
      createDirectFetcher(fetchImpl, logger),
      createAntiBotFetcher(fetchImpl, logger),
    );

    if (!loaded.ok) {
      logger.warn("Character import: source unavailable", {
        url: link.fetchUrl,
        reason: loaded.reason,
      });
      switch (loaded.reason) {
        case "notFound":
          return fail({
            message: t("post.errors.noPublicData", { platform }),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        case "notConfigured":
          return fail({
            message: t("post.errors.notConfigured", { platform }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
        case "blocked":
        case "network":
          return fail({
            message: t("post.errors.blocked", { platform }),
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });
      }
    }

    const character = loaded.character;
    const key = importSourceKey(character.platform, character.sourceId);

    // Second dedupe: the canonical id is only known after parsing
    // (`/character/<hash>` and `/chat/<id>` are the same character).
    const existing = await SkillImportRepository.findExisting(
      userId,
      [key],
      [character.sourceUrl],
    );
    if (existing) {
      return success(
        SkillImportRepository.existingResponse(existing, {
          platform: link.platform,
          sourceUrl: link.fetchUrl,
        }),
      );
    }

    const avatarUrl = character.avatarSourceUrl
      ? await storeAvatar(character.avatarSourceUrl, userId, fetchImpl, logger)
      : null;

    return await SkillImportRepository.createImportedSkill({
      character,
      key,
      visibility: data.visibility,
      avatarUrl,
      fallbackTagline: t("post.result.creditUnknown", { platform }),
      user,
      userId,
      logger,
      locale,
      toolExecutionContext,
    });
  }

  /**
   * Create the skill for a parsed character (link or card import). The avatar
   * is already stored; `fallbackTagline` is the localized "Imported from X".
   */
  static async createImportedSkill({
    character,
    key,
    visibility,
    avatarUrl,
    fallbackTagline,
    user,
    userId,
    logger,
    locale,
    toolExecutionContext,
  }: {
    character: ParsedCharacter;
    key: string;
    visibility: SkillImportPostRequestOutput["visibility"];
    avatarUrl: string | null;
    fallbackTagline: string;
    user: JwtPayloadType;
    userId: string;
    logger: EndpointLogger;
    locale: CountryLanguage;
    toolExecutionContext: ToolExecutionContext;
  }): Promise<ResponseType<SkillImportPostResponseOutput>> {
    const content = buildSkillContent(character, fallbackTagline);
    // "avatar" means "stored": a link import can fail the download, and a
    // PNG card brings its image without a source URL.
    const importedFields: ImportedField[] = content.importedFields.filter(
      (field) => field !== "avatar",
    );
    if (avatarUrl !== null) {
      importedFields.splice(1, 0, "avatar");
    }

    const isPublic = visibility === SkillImportVisibility.PUBLIC;
    const importSource: SkillImportSource = {
      platform: character.platform,
      sourceUrl: character.sourceUrl,
      sourceId: character.sourceId,
      creatorName: character.creatorName,
      creatorUrl: character.creatorUrl,
      tags: character.tags,
      importedAt: new Date().toISOString(),
    };
    const status =
      visibility === SkillImportVisibility.PUBLIC
        ? SkillStatus.PUBLISHED
        : visibility === SkillImportVisibility.UNLISTED
          ? SkillStatus.UNLISTED
          : SkillStatus.DRAFT;

    const { t: skillsT } = skillsScopedTranslation.scopedT(locale);
    const created = await SkillsRepository.createSkill(
      {
        name: content.name,
        tagline: content.tagline,
        description: content.description,
        icon: "theater",
        category: SkillCategory.ROLEPLAY,
        isPublic,
        systemPrompt: content.systemPrompt,
        variants: [
          {
            id: "default",
            isDefault: true,
            modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
          },
        ],
      },
      user,
      logger,
      skillsT,
      toolExecutionContext,
      false,
      undefined,
      {
        avatarUrl,
        importSource,
        importSourceKey: key,
        skillType: SkillType.PERSONA,
        status,
        publishedAt: isPublic ? new Date() : null,
      },
    );
    if (!created.success) {
      if (
        created.errorType.errorCode === ErrorResponseTypes.CONFLICT.errorCode
      ) {
        const existing = await SkillImportRepository.findExisting(
          userId,
          [key],
          [],
        );
        if (existing) {
          return success(
            SkillImportRepository.existingResponse(existing, character),
          );
        }
      }
      return created;
    }

    logger.info("Character imported", {
      platform: character.platform,
      sourceId: character.sourceId,
      skillId: created.data.id,
      visibility,
      hasAvatar: avatarUrl !== null,
      importedFields,
    });

    return success({
      id: created.data.id,
      name: content.name,
      platform: character.platform,
      creatorName: character.creatorName,
      sourceUrl: character.sourceUrl,
      avatarUrl,
      alreadyImported: false,
      importedFields,
    });
  }
}
