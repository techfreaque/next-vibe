/**
 * Skills Repository
 * Database operations for custom skills
 */

import "server-only";

import { and, count, eq, inArray, ne, or, sql } from "drizzle-orm";
import { DEFAULT_CHAT_MODEL_SELECTION } from "../ai-stream/constants";
import type { ChatModelSelection } from "../ai-stream/models";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "../image-generation/constants";
import type { ImageGenModelSelection } from "../image-generation/models";
import { DEFAULT_STT_MODEL_SELECTION } from "../speech-to-text/constants";
import type { SttModelSelection } from "../speech-to-text/models";
import { DEFAULT_TTS_MODEL_SELECTION } from "../text-to-speech/constants";
import type { VoiceModelSelection } from "../text-to-speech/models";
import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type {
  ChannelDecision,
  RemoteEventHandlerProps,
} from "next-vibe/core/route/handler-realtime";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import {
  searchField,
  searchItems,
} from "next-vibe/core/utils/in-memory-search";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { Platform } from "next-vibe/platforms/platforms";
import { isAgentPlatform } from "next-vibe/platforms/platforms";
import { createEndpointEmitter } from "next-vibe/realtime/core/emitter";
import type { EmitChannelDecision } from "next-vibe/realtime/core/structured-events";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";
import type { z } from "zod";

import { leadMagnetConfigs } from "@/lead-magnet/db";
import { referralCodes } from "@/referral/db";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import {
  ensureUniqueSlug,
  generateSlug,
  isUuid,
  parseSkillId,
  resolveIdAlias,
} from "../chat/slugify";
import type { AgentEnvAvailability } from "../env-availability";
import { getEnvAvailability } from "../env-availability";
import type {
  SkillDeleteResponseOutput,
  SkillGetResponseOutput,
  SkillUpdateRequestOutput,
  SkillUpdateResponseOutput,
} from "./[id]/definition";
import skillIdDefinitions from "./[id]/definition";
import {
  DEFAULT_SKILLS,
  NO_SKILL,
  type Skill,
  type SkillVariant,
} from "./config";
import { NO_SKILL_ID } from "./constants";
import createSkillDefinitions, {
  type SkillCreateRequestOutput,
  type SkillCreateResponseOutput,
} from "./create/definition";
import {
  customSkills,
  type SkillVariantData,
  skillVariantSchema,
  skillVotes,
} from "./db";
import type {
  SkillListItem,
  SkillListRequestOutput,
  SkillListResponseOutput,
  SkillListSections,
} from "./definition";
import {
  CATEGORY_CONFIG,
  ModelSelectionType,
  type SkillCategoryValue,
  SkillOwnershipType,
  type SkillOwnershipTypeValue,
  SkillSourceFilter,
  type SkillTrustLevelValue,
} from "./enum";
import { chatFavorites } from "./favorites/db";
import type { SkillsT, SkillsTranslationKey } from "./i18n";
import { scopedTranslation } from "./i18n";
import { SkillsRepositoryClient } from "./repository-client";

/**
 * Skills Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class SkillsRepository {
  private static getSkillReferenceIds(
    skillId: string,
    skillSlug: string | null,
  ): string[] {
    if (!skillSlug || skillSlug === skillId) {
      return [skillId];
    }
    return [skillSlug, skillId];
  }

  /**
   * Resolve a skill identifier (UUID or slug) to a DB where condition.
   * Returns null if the identifier doesn't match any known format.
   */
  static resolveSkillIdCondition(skillId: string): ReturnType<typeof eq> {
    if (isUuid(skillId)) {
      return eq(customSkills.id, skillId);
    }
    // Resolve legacy alias before slug lookup
    return eq(customSkills.slug, resolveIdAlias(skillId));
  }

  /**
   * Resolve the WS channel for a skill `[id]` subscription. Single source of
   * truth for skill visibility, shared by the read path and the route's
   * `resolveChannel` so subscribe-auth and read-auth can never drift:
   *   owner          → "user"     (events ride the owner's own user channel)
   *   PUBLIC / SYSTEM → "resource" (shared channel; anyone viewing the skill)
   *   otherwise      → "deny"
   * Resolves SYSTEM skills without a DB hit.
   */
  static async resolveSubscriptionChannel(ctx: {
    user: JwtPayloadType;
    urlPathParams: { readonly id?: string };
  }): Promise<ChannelDecision> {
    const raw = ctx.urlPathParams.id;
    if (!raw) {
      return { kind: "deny" };
    }
    const { skillId } = parseSkillId(raw);

    // SYSTEM / built-in skills are public to everyone — a shared resource channel.
    if (DEFAULT_SKILLS.some((s) => s.id === skillId)) {
      return { kind: "resource" };
    }

    const [skill] = await db
      .select({
        userId: customSkills.userId,
        ownershipType: customSkills.ownershipType,
      })
      .from(customSkills)
      .where(eq(customSkills.slug, skillId))
      .limit(1);
    if (!skill) {
      return { kind: "deny" };
    }

    // Owner sees their own skill on their own channel (any ownershipType).
    const userId = ctx.user.isPublic ? null : ctx.user.id;
    if (userId !== null && skill.userId === userId) {
      return { kind: "user" };
    }
    // Non-owner: only PUBLIC skills are visible, on the shared resource channel.
    if (skill.ownershipType === SkillOwnershipType.PUBLIC) {
      return { kind: "resource" };
    }
    return { kind: "deny" };
  }

  /**
   * The emit-side channel for a skill event. The emitting user owns the skill
   * (they just mutated it), so a PUBLIC skill's events ride the shared resource
   * channel (every viewer gets them) and any other skill rides the owner's own
   * user channel. Mirrors resolveSubscriptionChannel's owner/public split so the
   * emitter delivers on exactly the channel subscribers were admitted to.
   */
  static emitChannelForOwnership(
    ownershipType: string | undefined,
  ): EmitChannelDecision {
    return {
      kind: ownershipType === SkillOwnershipType.PUBLIC ? "resource" : "user",
    };
  }

  /**
   * Resolve the emit-side channel for a skill by id — for re-emit sites (the
   * peer-relay onRemoteEvent handlers) that have only the id. SYSTEM/built-in
   * skills are public → resource; a missing custom skill defaults to the owner's
   * own channel (safe: never a shared channel for an unknown resource).
   */
  static async emitChannelBySkillId(
    rawSkillId: string,
  ): Promise<EmitChannelDecision> {
    const { skillId } = parseSkillId(rawSkillId);
    if (DEFAULT_SKILLS.some((s) => s.id === skillId)) {
      return { kind: "resource" };
    }
    const [skill] = await db
      .select({ ownershipType: customSkills.ownershipType })
      .from(customSkills)
      .where(eq(customSkills.slug, skillId))
      .limit(1);
    return skill
      ? SkillsRepository.emitChannelForOwnership(skill.ownershipType)
      : { kind: "user" };
  }

  /**
   * Resolve a skill identifier (UUID or slug) to its canonical slug form.
   * Default skill IDs are already friendly strings - returned as-is.
   * Custom skill UUIDs are looked up and resolved to the slug.
   * If the skill has no slug or isn't found, returns the original identifier.
   */
  static async resolveCanonicalSkillId(skillId: string): Promise<string> {
    // Resolve legacy aliases (camelCase → slug) first
    const resolved = resolveIdAlias(skillId);
    // Default skills already have friendly IDs
    if (DEFAULT_SKILLS.some((s) => s.id === resolved)) {
      return resolved;
    }
    // If it's not a UUID, it's already a slug
    if (!isUuid(resolved)) {
      return resolved;
    }
    // UUID → look up the slug
    const [row] = await db
      .select({ slug: customSkills.slug })
      .from(customSkills)
      .where(eq(customSkills.id, resolved))
      .limit(1);
    return row?.slug || resolved;
  }

  /**
   * Generate a unique slug for a new skill.
   */
  private static async generateUniqueSkillSlug(name: string): Promise<string> {
    const base = generateSlug(name) || "skill";
    // Check existing slugs in DB
    const existing = await db
      .select({ slug: customSkills.slug })
      .from(customSkills)
      .where(sql`${customSkills.slug} LIKE ${`${base}%`}`);
    const existingSlugs = existing.map((r) => r.slug);
    // Also check default skill IDs to avoid collisions
    const defaultIds = DEFAULT_SKILLS.map((s) => s.id);
    return ensureUniqueSlug(base, [
      ...existingSlugs,
      ...defaultIds,
      NO_SKILL_ID,
    ]);
  }

  private static isSelectionEqual<T>(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private static normalizeTtsSelection(
    sel: VoiceModelSelection | null,
  ): VoiceModelSelection | null {
    if (!sel) {
      return null;
    }
    if (this.isSelectionEqual(sel, DEFAULT_TTS_MODEL_SELECTION)) {
      return null;
    }
    return sel;
  }

  private static normalizeSttSelection(
    sel: SttModelSelection | null,
  ): SttModelSelection | null {
    if (!sel) {
      return null;
    }
    if (this.isSelectionEqual(sel, DEFAULT_STT_MODEL_SELECTION)) {
      return null;
    }
    return sel;
  }

  private static normalizeImageGenSelection(
    sel: ImageGenModelSelection | null,
  ): ImageGenModelSelection | null {
    if (!sel) {
      return null;
    }
    if (this.isSelectionEqual(sel, DEFAULT_IMAGE_GEN_MODEL_SELECTION)) {
      return null;
    }
    return sel;
  }

  /**
   * Safely parse JSONB model selection data from the DB.
   * Returns null if the data doesn't match the expected schema (e.g. stale/migrated data).
   */
  private static safeParseSelection<T>(
    schema: z.ZodType<T>,
    data:
      | Record<string, string | number | boolean | null>
      | T
      | null
      | undefined,
  ): T | null {
    if (!data) {
      return null;
    }
    const result = schema.safeParse(data);
    return result.success ? result.data : null;
  }

  private static safeParseVariants(
    variants: SkillVariantData[] | null | undefined,
  ): SkillVariantData[] {
    if (!variants || variants.length === 0) {
      return [];
    }
    return variants
      .map((v) => skillVariantSchema.safeParse(v))
      .filter((r): r is z.ZodSafeParseSuccess<SkillVariantData> => r.success)
      .map((r) => r.data);
  }

  /**
   * Filter default skills based on user roles and current instance.
   * - userRole: only show skills the user's role can access (defaults to [CUSTOMER, ADMIN])
   */
  private static filterDefaultSkills(user: JwtPayloadType): Skill[] {
    const userRoles = user.roles;

    return DEFAULT_SKILLS.filter((char) => {
      // Check user role access
      const allowedRoles = char.userRole ?? [
        UserPermissionRole.PUBLIC,
        UserPermissionRole.CUSTOMER,
        UserPermissionRole.ADMIN,
      ];
      const hasRole = userRoles.some((role) =>
        allowedRoles.some((r) => r === role),
      );
      if (!hasRole) {
        return false;
      }

      // If no instance filter, show on all instances
      // If no instanceId in DB, show all skills (dev/disconnected mode)
      return true;
    });
  }

  /**
   * Get all skills for a user (default + custom)
   * Handles both authenticated and public users
   * Returns skills grouped by category into sections
   * Visibility rules:
   * - User's own skills (any ownershipType)
   * - PUBLIC skills from other users
   * - SYSTEM/built-in skills (via DEFAULT_SKILLS)
   */
  static async getSkills(
    data: SkillListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    platform: Platform,
  ): Promise<ResponseType<SkillListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const isCompact = platform ? isAgentPlatform(platform) : false;
    const COMPACT_PAGE_SIZE = 10;
    const effectivePageSize =
      data.pageSize ?? (isCompact ? COMPACT_PAGE_SIZE : undefined);
    const currentPage = data.page ?? 1;
    const skillsAvailability = await getEnvAvailability();

    try {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = data.targetUserId && isAdmin ? data.targetUserId : user.id;
      const query = data?.query?.trim().toLowerCase();
      const rawCharId = data?.skillId?.trim();
      // Support merged "skillSlug__variantId" format in the filter param
      const { skillId: requestedCharId, variantId: requestedVariantId } =
        rawCharId
          ? parseSkillId(rawCharId)
          : { skillId: undefined, variantId: null };
      const source = data?.sourceFilter;

      // For authenticated users, return default + user's own + public from others
      if (userId) {
        logger.debug("Getting all skills for user", { userId });

        // Fetch custom skills from DB (skip when filtering to built-in only)
        const needCustom = source !== SkillSourceFilter.BUILT_IN;
        const customSkillsCards: SkillListItem[] = [];

        if (needCustom) {
          // Build DB where clause based on source filter
          const dbCondition =
            source === SkillSourceFilter.MY
              ? eq(customSkills.userId, userId)
              : source === SkillSourceFilter.COMMUNITY
                ? and(
                    eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
                    ne(customSkills.userId, userId),
                  )
                : or(
                    eq(customSkills.userId, userId),
                    and(
                      eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
                      ne(customSkills.userId, userId),
                    ),
                  );

          const customSkillsList = await db
            .select({
              id: customSkills.id,
              slug: customSkills.slug,
              name: customSkills.name,
              description: customSkills.description,
              icon: customSkills.icon,
              systemPrompt: customSkills.systemPrompt,
              category: customSkills.category,
              tagline: customSkills.tagline,
              ownershipType: customSkills.ownershipType,
              variants: customSkills.variants,
              voteCount: customSkills.voteCount,
              trustLevel: customSkills.trustLevel,
            })
            .from(customSkills)
            .where(dbCondition);

          // Map custom skills to card display fields (expand variants for multi-variant skills)
          for (const char of customSkillsList) {
            // Use slug as the external ID (fall back to UUID for old data without slug)
            const externalId = char.slug || char.id;
            const variants = char.variants;
            if (variants && variants.length > 1) {
              customSkillsCards.push(
                ...SkillsRepository.expandDefaultSkill(
                  {
                    icon: char.icon,
                    name: char.name,
                    tagline: char.tagline,
                    description: char.description,
                    category: char.category,
                    ownershipType: char.ownershipType,
                    voteCount: char.voteCount,
                    trustLevel: char.trustLevel,
                    variants: variants.map((v: SkillVariantData) => ({
                      ...v,
                      voiceModelSelection: v.voiceModelSelection ?? undefined,
                      sttModelSelection: v.sttModelSelection ?? undefined,
                      imageVisionModelSelection:
                        v.imageVisionModelSelection ?? undefined,
                      videoVisionModelSelection:
                        v.videoVisionModelSelection ?? undefined,
                      audioVisionModelSelection:
                        v.audioVisionModelSelection ?? undefined,
                      imageGenModelSelection:
                        v.imageGenModelSelection ?? undefined,
                      musicGenModelSelection:
                        v.musicGenModelSelection ?? undefined,
                      videoGenModelSelection:
                        v.videoGenModelSelection ?? undefined,
                      variantName: (v.displayName ??
                        v.id) as SkillsTranslationKey,
                    })),
                  },
                  externalId,
                  t,
                  user,
                  skillsAvailability,
                ),
              );
            } else {
              customSkillsCards.push(
                SkillsRepository.mapSkillToListItem(
                  externalId,
                  {
                    icon: char.icon,
                    name: char.name,
                    tagline: char.tagline,
                    description: char.description,
                    category: char.category,
                    modelSelection:
                      (
                        char.variants?.find((v) => v.isDefault) ??
                        char.variants?.[0]
                      )?.modelSelection ?? null,
                    ownershipType: char.ownershipType,
                    voteCount: char.voteCount,
                    trustLevel: char.trustLevel,
                  },
                  t,
                  user,
                  skillsAvailability,
                ),
              );
            }
          }
        }

        // Map default skills (skip when filtering to custom-only sources)
        const needDefaults =
          source === SkillSourceFilter.BUILT_IN ||
          source === SkillSourceFilter.ALL ||
          !source;
        const defaultSkillsCards: SkillListItem[] = [];

        if (needDefaults) {
          const filteredDefaults = SkillsRepository.filterDefaultSkills(user);
          for (const char of filteredDefaults) {
            defaultSkillsCards.push(
              ...SkillsRepository.expandDefaultSkill(
                {
                  icon: char.icon,
                  name: t(char.name),
                  tagline: t(char.tagline),
                  description: t(char.description),
                  category: char.category,
                  ownershipType: SkillOwnershipType.SYSTEM,
                  voteCount: null,
                  trustLevel: null,
                  variants: char.variants,
                },
                char.id,
                t,
                user,
                skillsAvailability,
              ),
            );
          }
        }

        // Combine all skills
        let allSkills = [...defaultSkillsCards, ...customSkillsCards];

        // Apply search filter if query is provided
        if (query) {
          allSkills = searchItems(allSkills, {
            query,
            fields: [
              searchField((s) => s.name, 1.0),
              searchField((s) => s.tagline, 0.5),
              searchField((s) => s.description ?? "", 0.3),
              searchField((s) => s.category, 0.2),
              searchField((s) => parseSkillId(s.skillId).skillId, 0.1),
            ],
          });
        }

        // Apply skill ID filter if requested (supports merged "skillSlug__variantId")
        if (requestedCharId) {
          allSkills = allSkills.filter(
            (char) =>
              parseSkillId(char.skillId).skillId === requestedCharId &&
              (!requestedVariantId ||
                parseSkillId(char.skillId).variantId === requestedVariantId),
          );
        }

        // Group skills by category into sections
        const sections = this.groupSkillsIntoSections(allSkills, t);

        return success(
          this.buildResponse(
            allSkills,
            sections,
            isCompact,
            currentPage,
            effectivePageSize,
            t,
          ),
        );
      }

      // For public/lead users: built-in defaults + community (public) custom skills
      logger.debug("Getting skills for public user");

      // Built-in skills (skip when filtering to community only)
      const defaultSkillsCards: SkillListItem[] = [];
      if (source !== SkillSourceFilter.COMMUNITY) {
        const filteredDefaults = SkillsRepository.filterDefaultSkills(user);
        for (const char of filteredDefaults) {
          defaultSkillsCards.push(
            ...SkillsRepository.expandDefaultSkill(
              {
                icon: char.icon,
                name: t(char.name),
                tagline: t(char.tagline),
                description: t(char.description),
                category: char.category,
                ownershipType: SkillOwnershipType.SYSTEM,
                voteCount: null,
                trustLevel: null,
                variants: char.variants,
              },
              char.id,
              t,
              user,
              skillsAvailability,
            ),
          );
        }
      }

      // Community (public) custom skills (skip when filtering to built-in only)
      const communitySkillsCards: SkillListItem[] = [];
      if (source !== SkillSourceFilter.BUILT_IN) {
        const publicSkills = await db
          .select({
            id: customSkills.id,
            slug: customSkills.slug,
            name: customSkills.name,
            description: customSkills.description,
            icon: customSkills.icon,
            category: customSkills.category,
            tagline: customSkills.tagline,
            ownershipType: customSkills.ownershipType,
            variants: customSkills.variants,
            voteCount: customSkills.voteCount,
            trustLevel: customSkills.trustLevel,
          })
          .from(customSkills)
          .where(eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC));

        for (const char of publicSkills) {
          const externalId = char.slug || char.id;
          const variants = char.variants;
          if (variants && variants.length > 1) {
            communitySkillsCards.push(
              ...SkillsRepository.expandDefaultSkill(
                {
                  icon: char.icon,
                  name: char.name,
                  tagline: char.tagline,
                  description: char.description,
                  category: char.category,
                  ownershipType: char.ownershipType,
                  voteCount: char.voteCount,
                  trustLevel: char.trustLevel,
                  variants: variants.map((v: SkillVariantData) => ({
                    ...v,
                    voiceModelSelection: v.voiceModelSelection ?? undefined,
                    sttModelSelection: v.sttModelSelection ?? undefined,
                    imageVisionModelSelection:
                      v.imageVisionModelSelection ?? undefined,
                    videoVisionModelSelection:
                      v.videoVisionModelSelection ?? undefined,
                    audioVisionModelSelection:
                      v.audioVisionModelSelection ?? undefined,
                    imageGenModelSelection:
                      v.imageGenModelSelection ?? undefined,
                    musicGenModelSelection:
                      v.musicGenModelSelection ?? undefined,
                    videoGenModelSelection:
                      v.videoGenModelSelection ?? undefined,
                    variantName: (v.displayName ??
                      v.id) as SkillsTranslationKey,
                  })),
                },
                externalId,
                t,
                user,
                skillsAvailability,
              ),
            );
          } else {
            communitySkillsCards.push(
              SkillsRepository.mapSkillToListItem(
                externalId,
                {
                  icon: char.icon,
                  name: char.name,
                  tagline: char.tagline,
                  description: char.description,
                  category: char.category,
                  modelSelection:
                    (
                      char.variants?.find((v) => v.isDefault) ??
                      char.variants?.[0]
                    )?.modelSelection ?? null,
                  ownershipType: char.ownershipType,
                  voteCount: char.voteCount,
                  trustLevel: char.trustLevel,
                },
                t,
                user,
                skillsAvailability,
              ),
            );
          }
        }
      }

      let allSkills = [...defaultSkillsCards, ...communitySkillsCards];

      // Apply search filter if query is provided
      if (query) {
        allSkills = searchItems(allSkills, {
          query,
          fields: [
            searchField((s) => s.name, 1.0),
            searchField((s) => s.tagline, 0.5),
            searchField((s) => s.description ?? "", 0.3),
            searchField((s) => s.category, 0.2),
            searchField((s) => parseSkillId(s.skillId).skillId, 0.1),
          ],
        });
      }

      // Apply skill ID filter if requested
      if (requestedCharId) {
        allSkills = allSkills.filter(
          (char) => parseSkillId(char.skillId).skillId === requestedCharId,
        );
      }

      // Group skills by category into sections
      const sections = this.groupSkillsIntoSections(allSkills, t);

      return success(
        this.buildResponse(
          allSkills,
          sections,
          isCompact,
          currentPage,
          effectivePageSize,
          t,
        ),
      );
    } catch (error) {
      logger.error("Failed to get skills", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Build the response object, adding pagination metadata for compact (AI/MCP) callers.
   * Human callers get sections only (no pagination fields - null).
   */
  private static buildResponse(
    allMatchedSkills: SkillListItem[],
    allSections: SkillListSections,
    isCompact: boolean,
    currentPage: number,
    pageSize: number | undefined,
    t: SkillsT,
  ): SkillListResponseOutput {
    if (!isCompact || !pageSize) {
      return {
        sections: allSections,
        totalCount: null,
        matchedCount: null,
        currentPage: null,
        totalPages: null,
        hint: null,
      };
    }

    const totalCount = allMatchedSkills.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const offset = (safePage - 1) * pageSize;
    const pageSkills = allMatchedSkills.slice(offset, offset + pageSize);
    const pageSections = this.groupSkillsIntoSections(pageSkills, t);
    const s = totalCount === 1 ? "" : "s";
    const hint =
      totalCount <= 5
        ? `${totalCount} skill${s} matched - showing full detail.`
        : totalPages > 1
          ? `Page ${safePage}/${totalPages} (${totalCount} skills). Use page param to navigate. Narrow query for more detail.`
          : `${totalCount} skill${s} found. Use query to filter. ≤5 results = full detail.`;

    return {
      sections: pageSections,
      totalCount,
      matchedCount: totalCount,
      currentPage: safePage,
      totalPages,
      hint,
    };
  }

  /**
   * Group skill cards into sections by category
   */
  private static groupSkillsIntoSections(
    skills: SkillListItem[],
    t: SkillsT,
  ): SkillListSections {
    // Group skills by category
    const groupedByCategory = new Map<
      typeof SkillCategoryValue,
      SkillListItem[]
    >();

    for (const char of skills) {
      const existing = groupedByCategory.get(char.category) || [];
      existing.push(char);
      groupedByCategory.set(char.category, existing);
    }

    // Convert to sections array with metadata from CATEGORY_CONFIG
    // Sort by category order before returning
    // Flattened structure: sectionIcon, sectionTitle, sectionCount instead of nested sectionHeader
    return [...groupedByCategory.entries()]
      .map(([category, chars]) => {
        const config = CATEGORY_CONFIG[category];
        return {
          sectionIcon: config.icon,
          sectionTitle: t(config.category),
          sectionCount: chars.length,
          skills: chars,
          order: config.order,
        };
      })
      .filter((section) => section.skills.length > 0)
      .toSorted((a, b) => a.order - b.order)
      .map(
        ({
          sectionIcon,
          sectionTitle,
          sectionCount,
          skills: sectionSkills,
        }) => ({
          sectionIcon,
          sectionTitle,
          sectionCount,
          skills: sectionSkills,
        }),
      );
  }

  /**
   * Get a single skill by ID
   */
  static async getSkillById(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const { id: rawSkillId } = urlPathParams;
      const { skillId, variantId } = parseSkillId(rawSkillId);
      const userId = user.id;

      logger.debug("Getting skill by ID", { skillId, variantId, userId });

      // Check default skills first
      const defaultSkill = DEFAULT_SKILLS.find((p) => p.id === skillId);
      if (defaultSkill) {
        return success<SkillGetResponseOutput>({
          internalId: null,
          icon: defaultSkill.icon,
          name: t(defaultSkill.name),
          tagline: t(defaultSkill.tagline),
          description: t(defaultSkill.description),
          category: defaultSkill.category,
          isPublic: false,
          systemPrompt: defaultSkill.systemPrompt,
          skillOwnership: SkillOwnershipType.SYSTEM,
          compactTrigger: null,
          availableTools: defaultSkill.availableTools
            ? defaultSkill.availableTools.map((tool) => ({
                toolId: tool.toolId,
                requiresConfirmation: tool.requiresConfirmation ?? false,
              }))
            : null,
          pinnedTools: defaultSkill.pinnedTools
            ? defaultSkill.pinnedTools.map((tool) => ({
                toolId: tool.toolId,
                requiresConfirmation: tool.requiresConfirmation ?? false,
              }))
            : null,
          variants: defaultSkill.variants.map((v) => ({
            id: v.id,
            displayName: t(v.variantName),
            modelSelection: v.modelSelection,
            isDefault: v.isDefault,
            voiceModelSelection: v.voiceModelSelection,
            sttModelSelection: v.sttModelSelection,
            imageVisionModelSelection: v.imageVisionModelSelection,
            videoVisionModelSelection: v.videoVisionModelSelection,
            audioVisionModelSelection: v.audioVisionModelSelection,
            imageGenModelSelection: v.imageGenModelSelection,
            musicGenModelSelection: v.musicGenModelSelection,
            videoGenModelSelection: v.videoGenModelSelection,
          })),
          longContent: null,
          favoritesCount: 0,
          creatorProfile: null,
          voteCount: null,
          userVote: null,
        });
      }

      // Check for NO_SKILL
      if (skillId === NO_SKILL_ID) {
        return success({
          internalId: null,
          icon: null,
          name: null,
          tagline: null,
          description: null,
          category: NO_SKILL.category,
          isPublic: false,
          systemPrompt: null,
          skillOwnership: SkillOwnershipType.SYSTEM,
          compactTrigger: null,
          availableTools: null,
          pinnedTools: null,
          variants: (NO_SKILL.variants as SkillVariant[]).map((v) => ({
            id: v.id,
            modelSelection: v.modelSelection,
            isDefault: v.isDefault,
            voiceModelSelection: v.voiceModelSelection,
            sttModelSelection: v.sttModelSelection,
            imageVisionModelSelection: v.imageVisionModelSelection,
            videoVisionModelSelection: v.videoVisionModelSelection,
            audioVisionModelSelection: v.audioVisionModelSelection,
            imageGenModelSelection: v.imageGenModelSelection,
            musicGenModelSelection: v.musicGenModelSelection,
            videoGenModelSelection: v.videoGenModelSelection,
          })),
          longContent: null,
          favoritesCount: 0,
          creatorProfile: null,
          voteCount: null,
          userVote: null,
        });
      }

      // Check custom skills by UUID or slug
      // Return skill if:
      // 1. User owns it (any ownershipType)
      // 2. It's PUBLIC (regardless of owner)
      const idCondition = SkillsRepository.resolveSkillIdCondition(skillId);
      const [customSkill] = await db
        .select()
        .from(customSkills)
        .where(
          and(
            idCondition,
            userId
              ? or(
                  eq(customSkills.userId, userId),
                  eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
                )
              : eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
          ),
        )
        .limit(1);

      if (!customSkill) {
        return fail({
          message: t("id.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Fetch creator profile for USER-owned public skills
      let creatorProfile: SkillGetResponseOutput["creatorProfile"] = null;
      let favoritesCount = 0;

      // Count favorites (votes) for this skill (always use UUID, not slug)
      const [votesResult] = await db
        .select({ count: count() })
        .from(skillVotes)
        .where(eq(skillVotes.skillId, customSkill.id));
      favoritesCount = votesResult?.count ?? 0;

      // The caller's own vote direction on this skill (null = no vote).
      let userVote: SkillGetResponseOutput["userVote"] = null;
      if (userId) {
        const [ownVote] = await db
          .select({ direction: skillVotes.direction })
          .from(skillVotes)
          .where(
            and(
              eq(skillVotes.skillId, customSkill.id),
              eq(skillVotes.userId, userId),
            ),
          )
          .limit(1);
        userVote = ownVote?.direction ?? null;
      }

      // Fetch creator profile if skill is owned by a user (private or published)
      if (
        customSkill.ownershipType === SkillOwnershipType.USER ||
        customSkill.ownershipType === SkillOwnershipType.PUBLIC
      ) {
        const [creatorUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, customSkill.userId))
          .limit(1);

        if (creatorUser) {
          const [refCode] = await db
            .select({ code: referralCodes.code })
            .from(referralCodes)
            .where(eq(referralCodes.ownerUserId, customSkill.userId))
            .limit(1);

          // Lead magnet config for this creator
          const [lmConfig] = await db
            .select({
              isActive: leadMagnetConfigs.isActive,
              headline: leadMagnetConfigs.headline,
              buttonText: leadMagnetConfigs.buttonText,
            })
            .from(leadMagnetConfigs)
            .where(eq(leadMagnetConfigs.userId, customSkill.userId))
            .limit(1);

          const resolvedCreatorSlug =
            creatorUser.creatorSlug ??
            creatorUser.publicName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
          creatorProfile = {
            // Use creatorSlug as public identifier (never expose raw UUID)
            userId: resolvedCreatorSlug,
            creatorSlug: resolvedCreatorSlug,
            publicName: creatorUser.publicName,
            avatarUrl: creatorUser.avatarUrl ?? null,
            bio: creatorUser.bio ?? null,
            websiteUrl: creatorUser.websiteUrl ?? null,
            twitterUrl: creatorUser.twitterUrl ?? null,
            youtubeUrl: creatorUser.youtubeUrl ?? null,
            instagramUrl: creatorUser.instagramUrl ?? null,
            tiktokUrl: creatorUser.tiktokUrl ?? null,
            githubUrl: creatorUser.githubUrl ?? null,
            discordUrl: creatorUser.discordUrl ?? null,
            creatorAccentColor: creatorUser.creatorAccentColor ?? null,
            creatorHeaderImageUrl: creatorUser.creatorHeaderImageUrl ?? null,
            referralCode: refCode?.code ?? null,
            leadMagnetActive: lmConfig?.isActive ?? false,
            leadMagnetHeadline: lmConfig?.headline ?? null,
            leadMagnetButtonText: lmConfig?.buttonText ?? null,
          };
        }
      }

      // Return only response fields (exclude database fields like userId, createdAt, updatedAt)
      // Flattened response

      const parsedVariants = SkillsRepository.safeParseVariants(
        customSkill.variants,
      );

      return success<SkillGetResponseOutput>({
        internalId: customSkill.slug ? customSkill.id : null,
        icon: customSkill.icon,
        name: customSkill.name,
        tagline: customSkill.tagline,
        description: customSkill.description,
        category: customSkill.category,
        isPublic: customSkill.ownershipType === SkillOwnershipType.PUBLIC,
        systemPrompt: customSkill.systemPrompt,
        skillOwnership:
          customSkill.userId === userId
            ? SkillOwnershipType.USER
            : customSkill.ownershipType,
        compactTrigger: customSkill.compactTrigger ?? null,
        availableTools:
          customSkill.availableTools?.map((tool) => ({
            toolId: tool.toolId,
            requiresConfirmation: tool.requiresConfirmation ?? false,
          })) ?? null,
        pinnedTools:
          customSkill.pinnedTools?.map((tool) => ({
            toolId: tool.toolId,
            requiresConfirmation: tool.requiresConfirmation ?? false,
          })) ?? null,
        variants: parsedVariants,
        longContent: customSkill.longContent ?? null,
        favoritesCount,
        creatorProfile,
        voteCount: customSkill.voteCount,
        userVote,
      });
    } catch (error) {
      logger.error("Failed to get skill by ID", parseError(error));
      return fail({
        message: t("id.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get the companionPrompt for a skill by ID.
   * Returns null if the skill has no companionPrompt or is not found.
   * Used by ai-run to auto-prepend the calling companion's soul fragment.
   */
  static async getCompanionPrompt(skillId: string): Promise<string | null> {
    // Default (built-in) skills
    const defaultSkill = DEFAULT_SKILLS.find((p) => p.id === skillId);
    if (defaultSkill) {
      return defaultSkill.companionPrompt ?? null;
    }

    // Custom skill - DB lookup by UUID or slug (no user filter; caller already validated ownership)
    const idCondition = SkillsRepository.resolveSkillIdCondition(skillId);
    const [row] = await db
      .select({ companionPrompt: customSkills.companionPrompt })
      .from(customSkills)
      .where(idCondition)
      .limit(1);

    return row?.companionPrompt ?? null;
  }

  /**
   * Create a new custom skill
   */
  static async createSkill(
    data: SkillCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: SkillsT,
    /** Caller's stream/fixture context — threaded to the embedding sync so it
     *  records/replays under the run's fixture prefix instead of hitting live. */
    toolExecutionContext: ToolExecutionContext,
    relayed = false,
    forcedSlug?: string,
  ): Promise<ResponseType<SkillCreateResponseOutput>> {
    try {
      const userId = user.id;

      if (!userId) {
        return fail({
          message: t("post.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Creating custom skill", {
        userId,
        name: data.name,
      });

      // Validate variant IDs are unique within the skill
      if (data.variants && data.variants.length > 0) {
        const variantIds = data.variants.map((v) => v.id);
        if (new Set(variantIds).size !== variantIds.length) {
          return fail({
            message: t("post.errors.server.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      // When relaying a remote create, use the origin's slug so slugs stay identical
      // across instances (cross-instance deletes and updates key on slug).
      const slug =
        forcedSlug ??
        (await SkillsRepository.generateUniqueSkillSlug(data.name));

      const insertValues = {
        userId,
        slug,
        name: data.name,
        description: data.description,
        tagline: data.tagline,
        icon: data.icon,
        systemPrompt: data.systemPrompt,
        category: data.category,
        voiceModelSelection: SkillsRepository.normalizeTtsSelection(
          data.voiceModelSelection ?? null,
        ),
        sttModelSelection: SkillsRepository.normalizeSttSelection(
          data.sttModelSelection ?? null,
        ),
        imageVisionModelSelection: data.imageVisionModelSelection ?? null,
        videoVisionModelSelection: data.videoVisionModelSelection ?? null,
        audioVisionModelSelection: data.audioVisionModelSelection ?? null,
        imageGenModelSelection: SkillsRepository.normalizeImageGenSelection(
          data.imageGenModelSelection ?? null,
        ),
        musicGenModelSelection: data.musicGenModelSelection ?? null,
        videoGenModelId:
          data.videoGenModelSelection !== null &&
          data.videoGenModelSelection !== undefined &&
          "manualModelId" in data.videoGenModelSelection
            ? (data.videoGenModelSelection.manualModelId ?? null)
            : null,
        variants: data.variants,
        ownershipType: data.isPublic
          ? SkillOwnershipType.PUBLIC
          : SkillOwnershipType.USER,
        compactTrigger: data.compactTrigger ?? null,
      } satisfies typeof customSkills.$inferInsert;

      // When relaying, upsert so a stale same-slug row is refreshed rather than
      // throwing a unique-constraint violation.
      const [skill] = forcedSlug
        ? await db
            .insert(customSkills)
            .values(insertValues)
            .onConflictDoUpdate({
              target: customSkills.slug,
              set: {
                name: insertValues.name,
                description: insertValues.description,
                tagline: insertValues.tagline,
                icon: insertValues.icon,
                systemPrompt: insertValues.systemPrompt,
                category: insertValues.category,
                voiceModelSelection: insertValues.voiceModelSelection,
                sttModelSelection: insertValues.sttModelSelection,
                imageVisionModelSelection:
                  insertValues.imageVisionModelSelection,
                videoVisionModelSelection:
                  insertValues.videoVisionModelSelection,
                audioVisionModelSelection:
                  insertValues.audioVisionModelSelection,
                imageGenModelSelection: insertValues.imageGenModelSelection,
                musicGenModelSelection: insertValues.musicGenModelSelection,
                videoGenModelId: insertValues.videoGenModelId,
                variants: insertValues.variants,
                ownershipType: insertValues.ownershipType,
                compactTrigger: insertValues.compactTrigger,
              },
            })
            .returning()
        : await db.insert(customSkills).values(insertValues).returning();

      // Fire-and-forget: sync embedding for vector search
      if (skill) {
        void (async (): Promise<void> => {
          const { syncVirtualNodeToEmbedding } =
            await import("../cortex/embeddings/sync-virtual");
          const embeddingContent = [
            `# ${skill.name}`,
            skill.tagline ? `> ${skill.tagline}` : "",
            skill.description ?? "",
            "",
            skill.systemPrompt ?? "",
          ]
            .filter(Boolean)
            .join("\n");
          await syncVirtualNodeToEmbedding(
            userId,
            `/skills/${skill.id}.md`,
            embeddingContent,
            // Caller's stream/fixture context — records/replays in fixture runs.
            toolExecutionContext,
          );
        })().catch(() => {
          // Best-effort embedding sync
        });
      }

      // This op owns its `skill-created` event: the create request the user
      // submitted (requestFields) plus the new id. Locally its client onEvent
      // rebuilds the list card and inserts it; cross-instance (remoteEvent) the
      // peer's onRemoteEvent re-runs create. Suppressed when applying a relayed
      // create (avoids re-relay ping-pong).
      if (skill && !relayed) {
        createEndpointEmitter(
          createSkillDefinitions.POST,
          logger,
          user,
        )("skill-created", {
          responseData: { id: skill.slug ?? skill.id },
          requestData: data,
        });
      }

      return success({
        success: t("post.success.title"),
        id: skill.slug,
      });
    } catch (error) {
      logger.error("Failed to create skill", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a custom skill
   */
  static async updateSkill(
    data: SkillUpdateRequestOutput,
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    /** Caller's stream/fixture context — threaded to the embedding sync so it
     *  records/replays under the run's fixture prefix instead of hitting live. */
    toolExecutionContext: ToolExecutionContext,
  ): Promise<ResponseType<SkillUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const userId = user.id;
      const { id: skillId } = urlPathParams;

      if (!userId) {
        return fail({
          message: t("id.patch.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Validate: if variants provided, exactly one must be isDefault + all IDs unique
      if (data.variants && data.variants.length > 0) {
        const defaultCount = data.variants.filter((v) => v.isDefault).length;
        if (defaultCount !== 1) {
          return fail({
            message: t("id.patch.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        const variantIds = data.variants.map((v) => v.id);
        const uniqueVariantIds = new Set(variantIds);
        if (uniqueVariantIds.size !== variantIds.length) {
          return fail({
            message: t("id.patch.errors.validation.title"),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
      }

      // Check if this is a default skill
      const isDefaultSkill = DEFAULT_SKILLS.some((c) => c.id === skillId);

      if (isDefaultSkill) {
        // Create a new custom skill instead of updating the default one
        logger.debug("Creating custom skill from default", {
          userId,
          defaultSkillId: skillId,
        });

        // Fall back to the default skill's icon if not provided
        const defaultSkillForIcon = DEFAULT_SKILLS.find(
          (c) => c.id === skillId,
        );
        const iconToUse = data.icon ?? defaultSkillForIcon?.icon ?? "sparkles";

        // Generate slug for the new custom skill derived from a default skill
        const derivedSlug = await SkillsRepository.generateUniqueSkillSlug(
          data.name,
        );

        // Derive model selections from the default variant (variants are now the source of truth)
        const derivedVariants: SkillVariantData[] =
          data.variants && data.variants.length > 0
            ? data.variants
            : [
                {
                  id: "default",
                  modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
                  isDefault: true,
                },
              ];
        const derivedDefaultVariant =
          derivedVariants.find((v) => v.isDefault) ?? derivedVariants[0];

        const [derivedSkill] = await db
          .insert(customSkills)
          .values({
            userId,
            slug: derivedSlug,
            name: data.name,
            description: data.description,
            tagline: data.tagline,
            icon: iconToUse,
            systemPrompt: data.systemPrompt,
            category: data.category,
            // Sync top-level columns from default variant for backward compat
            voiceModelSelection: SkillsRepository.normalizeTtsSelection(
              derivedDefaultVariant?.voiceModelSelection ?? null,
            ),
            sttModelSelection: SkillsRepository.normalizeSttSelection(
              derivedDefaultVariant?.sttModelSelection ?? null,
            ),
            imageVisionModelSelection:
              derivedDefaultVariant?.imageVisionModelSelection ?? null,
            videoVisionModelSelection:
              derivedDefaultVariant?.videoVisionModelSelection ?? null,
            audioVisionModelSelection:
              derivedDefaultVariant?.audioVisionModelSelection ?? null,
            imageGenModelSelection: SkillsRepository.normalizeImageGenSelection(
              derivedDefaultVariant?.imageGenModelSelection ?? null,
            ),
            musicGenModelSelection:
              derivedDefaultVariant?.musicGenModelSelection ?? null,
            videoGenModelId:
              derivedDefaultVariant?.videoGenModelSelection?.selectionType ===
                ModelSelectionType.MANUAL &&
              derivedDefaultVariant.videoGenModelSelection.manualModelId
                ? derivedDefaultVariant.videoGenModelSelection.manualModelId
                : null,
            variants: derivedVariants,
            ownershipType: data.isPublic
              ? SkillOwnershipType.PUBLIC
              : SkillOwnershipType.USER,
            compactTrigger: data.compactTrigger ?? null,
          })
          .returning();

        // Updating a built-in skill derives a new custom skill — emit the
        // `skill-created` event (full create config + id) so all tabs/instances
        // add it and peers re-create it.
        if (derivedSkill) {
          createEndpointEmitter(
            createSkillDefinitions.POST,
            logger,
            user,
          )("skill-created", {
            responseData: { id: derivedSkill.slug ?? derivedSkill.id },
            requestData: {
              name: derivedSkill.name,
              tagline: derivedSkill.tagline ?? "",
              icon: derivedSkill.icon,
              description: derivedSkill.description ?? "",
              category: derivedSkill.category,
              isPublic:
                derivedSkill.ownershipType === SkillOwnershipType.PUBLIC,
              systemPrompt: derivedSkill.systemPrompt || null,
              variants: derivedSkill.variants ?? undefined,
              availableTools: data.availableTools,
              pinnedTools: data.pinnedTools,
              compactTrigger: derivedSkill.compactTrigger ?? null,
            },
          });
        }

        // Flattened response
        return success({
          success: t("id.patch.success.title"),
        });
      }

      logger.debug("Updating custom skill", { userId, skillId });

      // Get existing skill to compare icon (lookup by UUID or slug)
      const idCondition = SkillsRepository.resolveSkillIdCondition(skillId);
      const [existingSkill] = await db
        .select()
        .from(customSkills)
        .where(and(idCondition, eq(customSkills.userId, userId)))
        .limit(1);

      if (!existingSkill) {
        return fail({
          message: t("id.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Only update icon if it's different from existing, otherwise skip (undefined gets filtered out)
      const iconToUpdate =
        data.icon && data.icon !== existingSkill.icon ? data.icon : undefined;

      // Map isPublic to ownershipType
      const ownershipType =
        data.isPublic !== undefined
          ? data.isPublic
            ? SkillOwnershipType.PUBLIC
            : SkillOwnershipType.USER
          : undefined;

      // Prepare update values, excluding isPublic and including ownershipType
      // Normalize model selections: store null if same as platform default (defense-in-depth)
      // oxlint-disable-next-line no-unused-vars
      const { isPublic, ...dataWithoutIsPublic } = data;
      // Remove variants from spread — handled separately below
      const { variants: requestVariants, ...dataWithoutVariants } =
        dataWithoutIsPublic;

      const variantsToWrite = requestVariants ?? undefined;

      // Derive per-modality selections from the default variant (variants are now the source of truth)
      const updateDefaultVariant = variantsToWrite
        ? (variantsToWrite.find((v) => v.isDefault) ?? variantsToWrite[0])
        : undefined;

      const videoGenModelIdToUpdate =
        updateDefaultVariant?.videoGenModelSelection
          ? updateDefaultVariant.videoGenModelSelection.selectionType ===
              ModelSelectionType.MANUAL &&
            updateDefaultVariant.videoGenModelSelection.manualModelId
            ? updateDefaultVariant.videoGenModelSelection.manualModelId
            : null
          : undefined;

      const updateValues = Object.fromEntries(
        Object.entries({
          ...dataWithoutVariants,
          icon: iconToUpdate,
          ownershipType,
          variants: variantsToWrite,
          // Derive per-modality columns from the default variant
          voiceModelSelection: updateDefaultVariant
            ? SkillsRepository.normalizeTtsSelection(
                updateDefaultVariant.voiceModelSelection ?? null,
              )
            : undefined,
          sttModelSelection: updateDefaultVariant
            ? SkillsRepository.normalizeSttSelection(
                updateDefaultVariant.sttModelSelection ?? null,
              )
            : undefined,
          imageGenModelSelection: updateDefaultVariant
            ? SkillsRepository.normalizeImageGenSelection(
                updateDefaultVariant.imageGenModelSelection ?? null,
              )
            : undefined,
          videoGenModelId: videoGenModelIdToUpdate,
        }).filter(([, value]) => value !== undefined),
      );

      const [updated] = await db
        .update(customSkills)
        .set({
          ...updateValues,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(customSkills.id, existingSkill.id),
            eq(customSkills.userId, userId),
          ),
        )
        .returning();

      if (!updated) {
        return fail({
          message: t("id.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Fire-and-forget: sync embedding for vector search
      void (async (): Promise<void> => {
        const { syncVirtualNodeToEmbedding } =
          await import("../cortex/embeddings/sync-virtual");
        const embeddingContent = [
          `# ${updated.name}`,
          updated.tagline ? `> ${updated.tagline}` : "",
          updated.description ?? "",
          "",
          updated.systemPrompt ?? "",
        ]
          .filter(Boolean)
          .join("\n");
        await syncVirtualNodeToEmbedding(
          userId,
          `/skills/${updated.id}.md`,
          embeddingContent,
          // Caller's stream/fixture context — records/replays in fixture runs.
          toolExecutionContext,
        );
      })().catch(() => {
        // Best-effort embedding sync
      });

      // This op owns its `skill-updated` event. The payload is the updated skill's
      // response fields, keyed by the skill id on the event's urlPathParams. Locally
      // the framework merges them into the [id] DETAIL cache AND the client onEvent
      // rebuilds the LIST card; cross-instance (remoteEvent) the peer re-applies the
      // update.
      createEndpointEmitter(skillIdDefinitions.PATCH, logger, user, {
        urlPathParams: { id: existingSkill.slug ?? existingSkill.id },
        // PUBLIC skill → shared resource channel (all viewers); else owner's own.
        kindOverride:
          SkillsRepository.emitChannelForOwnership(ownershipType).kind,
      })("skill-updated", {
        requestData: {
          name: updated.name ?? null,
          icon: updated.icon ?? null,
          tagline: updated.tagline ?? null,
          description: updated.description ?? null,
          category: updated.category,
        },
      });

      // Return the full updated skill to match GET response structure
      // Transform ownershipType: PATCH response only accepts "user" | "public", not "system"
      // Custom skills should never be "system", but TypeScript doesn't know this
      // Flattened response
      return success({
        success: t("id.patch.success.title"),
      });
    } catch (error) {
      logger.error("Failed to update skill", parseError(error));
      return fail({
        message: t("id.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a custom skill
   */
  static async deleteSkill(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SkillDeleteResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const userId = user.id;
      const { id: skillId } = urlPathParams;

      if (!userId) {
        return fail({
          message: t("id.delete.errors.unauthorized.title"),
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Deleting custom skill", { userId, skillId });

      const idCondition = SkillsRepository.resolveSkillIdCondition(skillId);
      const [existingSkill] = await db
        .select()
        .from(customSkills)
        .where(and(idCondition, eq(customSkills.userId, userId)))
        .limit(1);

      if (!existingSkill) {
        return fail({
          message: t("id.delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const skillReferenceIds = SkillsRepository.getSkillReferenceIds(
        existingSkill.id,
        existingSkill.slug,
      );

      const result = await db.transaction(async (tx) => {
        await tx
          .delete(chatFavorites)
          .where(
            and(
              eq(chatFavorites.userId, userId),
              skillReferenceIds.length === 1
                ? eq(chatFavorites.skillId, skillReferenceIds[0])
                : inArray(chatFavorites.skillId, skillReferenceIds),
            ),
          );

        return tx
          .delete(customSkills)
          .where(
            and(
              eq(customSkills.id, existingSkill.id),
              eq(customSkills.userId, userId),
            ),
          )
          .returning();
      });

      if (result.length === 0) {
        return fail({
          message: t("id.delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const deleted = result[0];

      // This op owns its `skill-deleted` event (side-effect; the skill id rides on
      // urlPathParams). Locally its client onEvent removes the skill from the list;
      // cross-instance (remoteEvent) the peer's onRemoteEvent removes it by id.
      createEndpointEmitter(skillIdDefinitions.DELETE, logger, user, {
        urlPathParams: { id: deleted.slug ?? deleted.id },
        // PUBLIC skill → shared resource channel (all viewers); else owner's own.
        kindOverride: SkillsRepository.emitChannelForOwnership(
          deleted.ownershipType,
        ).kind,
      })("skill-deleted");

      // Fire-and-forget: remove embedding from cortex_nodes
      void (async (): Promise<void> => {
        const { removeVirtualNode } =
          await import("../cortex/embeddings/sync-virtual");
        await removeVirtualNode(userId, `/skills/${deleted.id}.md`);
      })().catch(() => {
        // Best-effort embedding removal
      });

      return success({
        name: deleted.name,
        tagline: deleted.tagline,
        icon: deleted.icon,
        category: deleted.category,
        ownershipType: deleted.ownershipType,
        systemPrompt: deleted.systemPrompt,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt,
      });
    } catch (error) {
      logger.error("Failed to delete skill", parseError(error));
      return fail({
        message: t("id.delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Map a skill to a list item card
   * Uses SkillsRepositoryClient for all display field computation
   */
  private static mapSkillToListItem(
    id: string,
    char: {
      icon: IconKey | null;
      name: string | null;
      tagline: string | null;
      description: string | null;
      category: typeof SkillCategoryValue;
      modelSelection: ChatModelSelection | null | undefined;
      ownershipType: typeof SkillOwnershipTypeValue;
      voteCount: number | null;
      trustLevel: typeof SkillTrustLevelValue | null;
    },
    t: ReturnType<(typeof scopedTranslation)["scopedT"]>["t"],
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
    variantId?: string | null,
    variantName?: string | null,
    isVariant?: boolean,
    isDefault?: boolean,
  ): SkillListItem {
    // Single source of truth — delegate to the client builder so server-rendered
    // and onEvent-rebuilt cards are identical.
    return SkillsRepositoryClient.mapSkillToListItem(
      id,
      char,
      t,
      user,
      availability,
      variantId,
      variantName,
      isVariant,
      isDefault,
    );
  }

  /**
   * Expand a default skill into one or more list items.
   * Each variant produces one item (isVariant=true).
   */
  private static expandDefaultSkill(
    char: {
      icon: IconKey | null;
      name: string | null;
      tagline: string | null;
      description: string | null;
      category: typeof SkillCategoryValue;
      ownershipType: typeof SkillOwnershipTypeValue;
      voteCount: number | null;
      trustLevel: typeof SkillTrustLevelValue | null;
      variants: SkillVariant[];
    },
    id: string,
    t: ReturnType<(typeof scopedTranslation)["scopedT"]>["t"],
    user: JwtPayloadType,
    availability: AgentEnvAvailability,
  ): SkillListItem[] {
    return char.variants.map((variant) =>
      SkillsRepository.mapSkillToListItem(
        id,
        {
          ...char,
          modelSelection: variant.modelSelection,
        },
        t,
        user,
        availability,
        variant.id,
        variant.variantName ? t(variant.variantName) : "",
        true,
        variant.isDefault ?? false,
      ),
    );
  }

  /**
   * Cross-instance applier for the `skill-created` event: re-run create on this
   * instance with the relayed request. Reuses createSkill so there is one path.
   * The relayed `id` is informational — the slug is regenerated locally.
   */
  static async applyRemoteSkillCreate({
    requestData,
    responseData,
    user,
    logger,
  }: RemoteEventHandlerProps<
    (typeof createSkillDefinitions)["POST"],
    "skill-created"
  >): Promise<void> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    // Use the origin's slug so slugs stay identical across instances — cross-instance
    // deletes/updates key on slug, so a mismatch silently fails.
    const remoteSlug = responseData?.id;
    const result = await this.createSkill(
      requestData,
      user,
      logger,
      t,
      // Relayed apply — no originating stream; thread-less root routes live.
      rootlessToolExecutionContext(),
      true,
      remoteSlug,
    );
    if (!result.success) {
      logger.error("Failed to apply remote skill create", {
        message: result.message,
      });
      return;
    }
    createEndpointEmitter(createSkillDefinitions.POST, logger, user, {
      fanOut: false,
    })("skill-created", {
      requestData,
      responseData: { id: result.data.id },
    });
  }

  /**
   * Apply a remote skill delete by skill id — for the side-effect `skill-deleted`
   * event where the id rides on urlPathParams (no payload). Called by
   * [id]/route.ts onRemoteEvent. `payload` is the empty side-effect data; it is
   * accepted (and ignored) so the route handler can stay a single expression that
   * uses it (route boilerplate forbids unused params / multi-statement bodies).
   */
  static async applyRemoteSkillDeleteById({
    urlPathParams,
    logger,
    user,
  }: RemoteEventHandlerProps<
    (typeof skillIdDefinitions)["DELETE"],
    "skill-deleted"
  >): Promise<void> {
    const skillId = urlPathParams.id;
    // Capture the channel kind BEFORE the row is gone (the delete removes the
    // ownership we need to decide owner-vs-public delivery).
    const channel = await SkillsRepository.emitChannelBySkillId(skillId);
    try {
      const { parseSkillId: parse } = await import("../chat/slugify");
      const { skillId: resolvedId } = parse(skillId);
      const [{ eq: eqOp }, { db: database }, { customSkills: cs }] =
        await Promise.all([
          import("drizzle-orm"),
          import("next-vibe/database"),
          import("./db"),
        ]);
      await database.delete(cs).where(eqOp(cs.slug, resolvedId));
    } catch (err) {
      logger.error("applyRemoteSkillDeleteById failed", {
        skillId,
        ...parseError(err),
      });
      return;
    }
    createEndpointEmitter(skillIdDefinitions.DELETE, logger, user, {
      urlPathParams: { id: skillId },
      kindOverride: channel.kind,
      fanOut: false,
    })("skill-deleted");
  }

  /**
   * Apply a partial update relayed from a peer's PATCH event.
   * Only updates the 5 display fields that ride on the event's requestFields.
   * Called by [id]/route.ts onRemoteEvent for "skill-updated".
   */
  static async applyRemoteSkillPartialUpdate({
    requestData,
    urlPathParams,
    logger,
    user,
  }: RemoteEventHandlerProps<
    (typeof skillIdDefinitions)["PATCH"],
    "skill-updated"
  >): Promise<void> {
    const skillId = urlPathParams.id;
    try {
      const { parseSkillId: parse } = await import("../chat/slugify");
      const { skillId: resolvedId } = parse(skillId);
      const [{ eq: eqOp }, { db: database }, { customSkills: cs }] =
        await Promise.all([
          import("drizzle-orm"),
          import("next-vibe/database"),
          import("./db"),
        ]);
      await database
        .update(cs)
        .set({
          name: requestData.name,
          tagline: requestData.tagline,
          icon: requestData.icon,
          description: requestData.description,
          category: requestData.category,
        })
        .where(eqOp(cs.slug, resolvedId));
    } catch (err) {
      logger.error("applyRemoteSkillPartialUpdate failed", {
        skillId,
        ...parseError(err),
      });
      return;
    }
    const channel = await SkillsRepository.emitChannelBySkillId(skillId);
    createEndpointEmitter(skillIdDefinitions.PATCH, logger, user, {
      urlPathParams: { id: skillId },
      kindOverride: channel.kind,
      fanOut: false,
    })("skill-updated", {
      requestData,
    });
  }
}
