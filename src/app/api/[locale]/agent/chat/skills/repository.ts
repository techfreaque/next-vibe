/**
 * Skills Repository
 * Database operations for custom skills
 */

import "server-only";

import { and, count, eq, inArray, ne, or, sql } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ChatModelSelection } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ImageGenModelSelection } from "@/app/api/[locale]/agent/image-generation/models";
import type { SttModelSelection } from "@/app/api/[locale]/agent/speech-to-text/models";
import type { VoiceModelSelection } from "@/app/api/[locale]/agent/text-to-speech/models";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  searchField,
  searchItems,
} from "@/app/api/[locale]/system/unified-interface/shared/search/in-memory-search";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { isAgentPlatform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";
import { DEFAULT_IMAGE_GEN_MODEL_SELECTION } from "@/app/api/[locale]/agent/image-generation/constants";
import { DEFAULT_STT_MODEL_SELECTION } from "@/app/api/[locale]/agent/speech-to-text/constants";
import { DEFAULT_TTS_MODEL_SELECTION } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { createEndpointEmitter } from "@/app/api/[locale]/system/unified-interface/websocket/endpoint-emitter";
import type { IconKey } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { getModelDisplayName } from "../../models/all-models";
import { modelProviders } from "../../models/models";

import { leadMagnetConfigs } from "@/app/api/[locale]/lead-magnet/db";
import { referralCodes } from "@/app/api/[locale]/referral/db";
import { users } from "@/app/api/[locale]/user/db";
import { getBestChatModel } from "../../ai-stream/models";
import { chatFavorites } from "../favorites/db";
import {
  ensureUniqueSlug,
  formatSkillId,
  generateSlug,
  isUuid,
  parseSkillId,
  resolveIdAlias,
} from "../slugify";
import type {
  SkillDeleteResponseOutput,
  SkillGetResponseOutput,
  SkillUpdateRequestOutput,
  SkillUpdateResponseOutput,
} from "./[id]/definition";
import skillIdDefinitions from "./[id]/definition";
import {
  type Skill,
  type SkillVariant,
  DEFAULT_SKILLS,
  NO_SKILL,
} from "./config";
import { NO_SKILL_ID } from "./constants";
import type {
  SkillCreateRequestOutput,
  SkillCreateResponseOutput,
} from "./create/definition";
import { type SkillVariantData, customSkills, skillVotes } from "./db";
import type {
  SkillListItem,
  SkillListRequestOutput,
  SkillListResponseOutput,
  SkillListSections,
} from "./definition";
import skillsDefinitions from "./definition";
import {
  type SkillCategoryValue,
  type SkillOwnershipTypeValue,
  type SkillTrustLevelValue,
  CATEGORY_CONFIG,
  ModelSelectionType,
  SkillOwnershipType,
  SkillSourceFilter,
} from "./enum";
import type { SkillsT, SkillsTranslationKey } from "./i18n";
import { scopedTranslation } from "./i18n";

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
   * Resolve a skill identifier (UUID or slug) to its canonical slug form.
   * Default skill IDs are already friendly strings — returned as-is.
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
    platform?: Platform,
  ): Promise<ResponseType<SkillListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    const isCompact = platform ? isAgentPlatform(platform) : false;
    const COMPACT_PAGE_SIZE = 10;
    const effectivePageSize =
      data.pageSize ?? (isCompact ? COMPACT_PAGE_SIZE : undefined);
    const currentPage = data.page ?? 1;

    try {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId =
        data.targetUserId && isAdmin ? data.targetUserId : user.id;
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
              modelSelection: customSkills.modelSelection,
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
                      variantName: (v.displayName ??
                        v.id) as SkillsTranslationKey,
                    })),
                  },
                  externalId,
                  t,
                  user,
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
                    modelSelection: char.modelSelection,
                    ownershipType: char.ownershipType,
                    voteCount: char.voteCount,
                    trustLevel: char.trustLevel,
                  },
                  t,
                  user,
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
            modelSelection: customSkills.modelSelection,
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
                    variantName: (v.displayName ??
                      v.id) as SkillsTranslationKey,
                  })),
                },
                externalId,
                t,
                user,
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
                  modelSelection: char.modelSelection,
                  ownershipType: char.ownershipType,
                  voteCount: char.voteCount,
                  trustLevel: char.trustLevel,
                },
                t,
                user,
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
        wsEvent: null,
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
      wsEvent: null,
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
        // Use the requested variant if specified, otherwise fall back to default
        const defaultVariant =
          (variantId
            ? defaultSkill.variants.find((v) => v.id === variantId)
            : null) ??
          defaultSkill.variants.find((v) => v.isDefault) ??
          defaultSkill.variants[0];
        return success<SkillGetResponseOutput>({
          internalId: null,
          icon: defaultSkill.icon,
          name: t(defaultSkill.name),
          tagline: t(defaultSkill.tagline),
          description: t(defaultSkill.description),
          category: defaultSkill.category,
          isPublic: false,
          voiceModelSelection: defaultVariant?.voiceModelSelection ?? null,
          sttModelSelection: defaultVariant?.sttModelSelection ?? null,
          imageVisionModelSelection:
            defaultVariant?.imageVisionModelSelection ?? null,
          videoVisionModelSelection:
            defaultVariant?.videoVisionModelSelection ?? null,
          audioVisionModelSelection:
            defaultVariant?.audioVisionModelSelection ?? null,
          imageGenModelSelection:
            defaultVariant?.imageGenModelSelection ?? null,
          musicGenModelSelection:
            defaultVariant?.musicGenModelSelection ?? null,
          videoGenModelSelection:
            defaultVariant?.videoGenModelSelection ?? null,
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
          voiceModelSelection: null,
          sttModelSelection: null,
          imageVisionModelSelection: null,
          videoVisionModelSelection: null,
          audioVisionModelSelection: null,
          imageGenModelSelection: null,
          musicGenModelSelection: null,
          videoGenModelSelection: null,
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
            creatorUser.publicName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
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
      return success<SkillGetResponseOutput>({
        internalId: customSkill.slug ? customSkill.id : null,
        icon: customSkill.icon,
        name: customSkill.name,
        tagline: customSkill.tagline,
        description: customSkill.description,
        category: customSkill.category,
        isPublic: customSkill.ownershipType === SkillOwnershipType.PUBLIC,
        voiceModelSelection: customSkill.voiceModelSelection ?? null,
        sttModelSelection: customSkill.sttModelSelection ?? null,
        imageVisionModelSelection:
          customSkill.imageVisionModelSelection ?? null,
        videoVisionModelSelection:
          customSkill.videoVisionModelSelection ?? null,
        audioVisionModelSelection:
          customSkill.audioVisionModelSelection ?? null,
        imageGenModelSelection: customSkill.imageGenModelSelection ?? null,
        musicGenModelSelection: customSkill.musicGenModelSelection ?? null,
        videoGenModelSelection: customSkill.videoGenModelId
          ? {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: customSkill.videoGenModelId,
            }
          : null,
        systemPrompt: customSkill.systemPrompt,
        skillOwnership: customSkill.ownershipType,
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
        variants:
          customSkill.variants ??
          (customSkill.modelSelection
            ? [
                {
                  id: "default",
                  modelSelection: customSkill.modelSelection,
                  isDefault: true,
                },
              ]
            : []),
        longContent: customSkill.longContent ?? null,
        favoritesCount,
        creatorProfile,
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

      // Build variants array: use provided variants or auto-create single default variant
      const effectiveModelSelection =
        data.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION;
      const effectiveVariants =
        data.variants && data.variants.length > 0
          ? data.variants
          : [
              {
                id: "default",
                modelSelection: effectiveModelSelection,
                isDefault: true,
              },
            ];

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

      // Generate a unique slug from the skill name
      const slug = await SkillsRepository.generateUniqueSkillSlug(data.name);

      const [skill] = await db
        .insert(customSkills)
        .values({
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
          modelSelection: effectiveModelSelection,
          variants: effectiveVariants,
          ownershipType: data.isPublic
            ? SkillOwnershipType.PUBLIC
            : SkillOwnershipType.USER,
          compactTrigger: data.compactTrigger ?? null,
        })
        .returning();

      // Fire-and-forget: sync embedding for vector search
      if (skill) {
        void (async (): Promise<void> => {
          const { syncVirtualNodeToEmbedding } =
            await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
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
          );
        })().catch(() => {
          // Best-effort embedding sync
        });
      }

      // Emit WS event so all open tabs see the new skill immediately
      const emitSkills = createEndpointEmitter(
        skillsDefinitions.GET,
        logger,
        user,
      );
      if (skill) {
        const listItem = SkillsRepository.mapSkillToListItem(
          skill.slug ?? skill.id,
          {
            icon: skill.icon,
            name: skill.name,
            tagline: skill.tagline,
            description: skill.description,
            category: skill.category,
            modelSelection:
              skill.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION,
            ownershipType: skill.ownershipType,
            voteCount: skill.voteCount,
            trustLevel: skill.trustLevel,
          },
          t,
          user,
        );
        emitSkills("skill-created", {
          wsEvent: {
            type: "created",
            item: listItem,
            category: skill.category,
          },
        });
      } else {
        emitSkills("skill-created", { wsEvent: null });
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
              data.videoGenModelSelection?.selectionType ===
                ModelSelectionType.MANUAL &&
              data.videoGenModelSelection.manualModelId
                ? data.videoGenModelSelection.manualModelId
                : null,
            modelSelection: data.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION,
            variants:
              data.variants && data.variants.length > 0
                ? data.variants
                : [
                    {
                      id: "default",
                      modelSelection:
                        data.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION,
                      isDefault: true,
                    },
                  ],
            ownershipType: data.isPublic
              ? SkillOwnershipType.PUBLIC
              : SkillOwnershipType.USER,
            compactTrigger: data.compactTrigger ?? null,
          })
          .returning();

        // Emit WS event so all open tabs see the new skill immediately
        const emitSkillsCreate = createEndpointEmitter(
          skillsDefinitions.GET,
          logger,
          user,
        );
        if (derivedSkill) {
          const derivedListItem = SkillsRepository.mapSkillToListItem(
            derivedSkill.slug ?? derivedSkill.id,
            {
              icon: derivedSkill.icon,
              name: derivedSkill.name,
              tagline: derivedSkill.tagline,
              description: derivedSkill.description,
              category: derivedSkill.category,
              modelSelection:
                derivedSkill.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION,
              ownershipType: derivedSkill.ownershipType,
              voteCount: derivedSkill.voteCount,
              trustLevel: derivedSkill.trustLevel,
            },
            t,
            user,
          );
          emitSkillsCreate("skill-created", {
            wsEvent: {
              type: "created",
              item: derivedListItem,
              category: derivedSkill.category,
            },
          });
        } else {
          emitSkillsCreate("skill-created", { wsEvent: null });
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

      // Only update icon if it's different from existing, otherwise set to null
      const iconToUpdate =
        data.icon && data.icon !== existingSkill.icon ? data.icon : null;

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
      const videoGenModelIdToUpdate =
        data.videoGenModelSelection !== undefined
          ? data.videoGenModelSelection?.selectionType ===
              ModelSelectionType.MANUAL &&
            data.videoGenModelSelection.manualModelId
            ? data.videoGenModelSelection.manualModelId
            : null
          : undefined;
      // Remove videoGenModelSelection from spread (we use videoGenModelId column instead)
      const {
        videoGenModelSelection,
        variants: requestVariants,
        ...dataWithoutVideoGen
      } = dataWithoutIsPublic;
      void videoGenModelSelection;

      // Sync modelSelection from default variant when variants are provided
      const variantsToWrite = requestVariants ?? undefined;
      const defaultVariantModelSelection = variantsToWrite
        ? variantsToWrite.find((v) => v.isDefault)?.modelSelection
        : undefined;

      const updateValues = Object.fromEntries(
        Object.entries({
          ...dataWithoutVideoGen,
          icon: iconToUpdate,
          ownershipType,
          variants: variantsToWrite,
          // Sync top-level modelSelection from default variant for backward compat
          modelSelection: defaultVariantModelSelection ?? data.modelSelection,
          voiceModelSelection: SkillsRepository.normalizeTtsSelection(
            data.voiceModelSelection ?? null,
          ),
          sttModelSelection: SkillsRepository.normalizeSttSelection(
            data.sttModelSelection ?? null,
          ),
          imageGenModelSelection: SkillsRepository.normalizeImageGenSelection(
            data.imageGenModelSelection ?? null,
          ),
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
          await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
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
        );
      })().catch(() => {
        // Best-effort embedding sync
      });

      // Emit WS events so all open tabs see the updated skill immediately
      const emitSkills = createEndpointEmitter(
        skillsDefinitions.GET,
        logger,
        user,
      );
      emitSkills("skill-updated", {
        wsEvent: {
          type: "updated",
          skillId: existingSkill.slug ?? existingSkill.id,
          name: updated.name,
          icon: updated.icon,
          tagline: updated.tagline,
          ownershipType: updated.ownershipType,
          voteCount: updated.voteCount,
          trustLevel: updated.trustLevel,
        },
      });
      const emitSkillId = createEndpointEmitter(
        skillIdDefinitions.GET,
        logger,
        user,
        { id: existingSkill.slug ?? existingSkill.id },
      );
      emitSkillId("skill-updated", {
        name: updated.name ?? null,
        icon: updated.icon ?? null,
        tagline: updated.tagline ?? null,
        description: updated.description ?? null,
        category: updated.category,
        isPublic: updated.ownershipType === SkillOwnershipType.PUBLIC,
        skillOwnership: updated.ownershipType,
        systemPrompt: updated.systemPrompt ?? null,
        compactTrigger: updated.compactTrigger ?? null,
        variants: updated.variants ?? [],
        availableTools:
          updated.availableTools?.map((tool) => ({
            toolId: tool.toolId,
            requiresConfirmation: tool.requiresConfirmation ?? false,
          })) ?? null,
        pinnedTools:
          updated.pinnedTools?.map((tool) => ({
            toolId: tool.toolId,
            requiresConfirmation: tool.requiresConfirmation ?? false,
          })) ?? null,
        voiceModelSelection: updated.voiceModelSelection ?? null,
        sttModelSelection: updated.sttModelSelection ?? null,
        imageVisionModelSelection: updated.imageVisionModelSelection ?? null,
        videoVisionModelSelection: updated.videoVisionModelSelection ?? null,
        audioVisionModelSelection: updated.audioVisionModelSelection ?? null,
        imageGenModelSelection: updated.imageGenModelSelection ?? null,
        musicGenModelSelection: updated.musicGenModelSelection ?? null,
        videoGenModelSelection: updated.videoGenModelId
          ? {
              selectionType: ModelSelectionType.MANUAL,
              manualModelId: updated.videoGenModelId,
            }
          : null,
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

      // Emit WS event so all open tabs remove the deleted skill immediately
      const emitSkills = createEndpointEmitter(
        skillsDefinitions.GET,
        logger,
        user,
      );
      emitSkills("skill-deleted", {
        wsEvent: { type: "deleted", skillId: deleted.slug ?? deleted.id },
      });

      // Fire-and-forget: remove embedding from cortex_nodes
      void (async (): Promise<void> => {
        const { removeVirtualNode } =
          await import("@/app/api/[locale]/agent/cortex/embeddings/sync-virtual");
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
      modelSelection: ChatModelSelection;
      ownershipType: typeof SkillOwnershipTypeValue;
      voteCount: number | null;
      trustLevel: typeof SkillTrustLevelValue | null;
    },
    t: ReturnType<(typeof scopedTranslation)["scopedT"]>["t"],
    user: JwtPayloadType,
    variantId?: string | null,
    variantName?: string | null,
    isVariant?: boolean,
    isDefault?: boolean,
  ): SkillListItem {
    // Get best model from skill's modelSelection
    const selection = char.modelSelection ?? DEFAULT_CHAT_MODEL_SELECTION;
    const bestModel = getBestChatModel(selection, user);

    const modelId = bestModel?.id ?? null;
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const modelRow = bestModel
      ? {
          modelIcon: bestModel.icon,
          modelInfo: getModelDisplayName(bestModel, isAdmin),
          modelProvider:
            modelProviders[bestModel.provider]?.name ?? bestModel.provider,
        }
      : {
          modelIcon: "sparkles" as const,
          modelInfo: t("fallbacks.unknownModel"),
          modelProvider: t("fallbacks.unknownProvider"),
        };

    // Flattened structure - no nested content object
    // name/tagline/description are pre-resolved strings (from t() for defaults, raw strings for custom chars)
    return {
      skillId: formatSkillId(id, variantId),
      category: char.category,
      icon: char.icon ?? "sparkles",
      modelId,
      name: char.name ?? bestModel?.name ?? t("fallbacks.unknownModel"),
      description: char.description ?? t("fallbacks.noDescription"),
      tagline: char.tagline ?? t("fallbacks.noTagline"),
      ownershipType: char.ownershipType,
      voteCount: char.voteCount,
      trustLevel: char.trustLevel,
      variantName: variantName ?? null,
      isVariant: isVariant ?? false,
      isDefault: isDefault ?? false,
      ...modelRow,
    };
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
        variant.id,
        variant.variantName ? t(variant.variantName) : "",
        true,
        variant.isDefault ?? false,
      ),
    );
  }
}
