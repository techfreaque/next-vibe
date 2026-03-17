/**
 * Skills Repository
 * Database operations for custom skills
 */

import "server-only";

import { and, eq, ne, or } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ModelSelectionSimple } from "@/app/api/[locale]/agent/models/types";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { isAgentPlatform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { IconKey } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  defaultModel,
  getModelDisplayName,
  modelProviders,
} from "../../models/models";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import type {
  SkillDeleteResponseOutput,
  SkillGetResponseOutput,
  SkillUpdateRequestOutput,
  SkillUpdateResponseOutput,
} from "./[id]/definition";
import { type Skill, DEFAULT_SKILLS, NO_SKILL } from "./config";
import { NO_SKILL_ID } from "./constants";
import type {
  SkillCreateRequestOutput,
  SkillCreateResponseOutput,
} from "./create/definition";
import { customSkills } from "./db";
import type {
  SkillListItem,
  SkillListRequestOutput,
  SkillListResponseOutput,
} from "./definition";
import {
  type SkillCategoryValue,
  type SkillOwnershipTypeValue,
  type SkillTrustLevelValue,
  SkillOwnershipType,
  ModelSelectionType,
} from "./enum";
import { CATEGORY_CONFIG } from "./enum";
import type { SkillsT } from "./i18n";
import { scopedTranslation } from "./i18n";
import { SkillsRepositoryClient } from "./repository-client";

/** Default model selection used when none is provided */
const DEFAULT_MODEL_SELECTION: ModelSelectionSimple = {
  selectionType: ModelSelectionType.MANUAL,
  manualModelId: defaultModel,
};

/**
 * Filter default skills based on user roles and current instance.
 * - userRole: only show skills the user's role can access (defaults to [CUSTOMER, ADMIN])
 */
function filterDefaultSkills(user: JwtPayloadType): Skill[] {
  const userRoles = user.roles;

  return DEFAULT_SKILLS.filter((char) => {
    // Check user role access
    const allowedRoles = char.userRole ?? [
      UserPermissionRole.PUBLIC,
      UserPermissionRole.CUSTOMER,
      UserPermissionRole.ADMIN,
    ];
    const hasRole = userRoles.some((role) =>
      (allowedRoles as string[]).includes(role),
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
 * Skills Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class SkillsRepository {
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
    const COMPACT_PAGE_SIZE = 25;
    const effectivePageSize =
      data.pageSize ?? (isCompact ? COMPACT_PAGE_SIZE : undefined);
    const currentPage = data.page ?? 1;

    try {
      const userId = user.id;
      const query = data?.query?.trim().toLowerCase();
      const requestedCharId = data?.skillId?.trim();

      // For authenticated users, return default + user's own + public from others
      if (userId) {
        logger.debug("Getting all skills for user", { userId });

        // Fetch custom skills
        const customSkillsList = await db
          .select({
            id: customSkills.id,
            name: customSkills.name,
            description: customSkills.description,
            icon: customSkills.icon,
            systemPrompt: customSkills.systemPrompt,
            category: customSkills.category,
            tagline: customSkills.tagline,
            ownershipType: customSkills.ownershipType,
            modelSelection: customSkills.modelSelection,
            voice: customSkills.voice,
            voteCount: customSkills.voteCount,
            trustLevel: customSkills.trustLevel,
          })
          .from(customSkills)
          .where(
            or(
              // User's own skills (any ownershipType)
              eq(customSkills.userId, userId),
              // PUBLIC skills from other users
              and(
                eq(customSkills.ownershipType, SkillOwnershipType.PUBLIC),
                ne(customSkills.userId, userId),
              ),
            ),
          );

        // Map custom skills to card display fields
        const customSkillsCards = customSkillsList.map((char) => {
          return SkillsRepository.mapSkillToListItem(
            char.id,
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
          );
        });

        // Map default skills to card display fields (filtered by role + instance)
        const filteredDefaults = filterDefaultSkills(user);
        const defaultSkillsCards = filteredDefaults.map((char) => {
          return SkillsRepository.mapSkillToListItem(
            char.id,
            {
              icon: char.icon,
              name: t(char.name),
              tagline: t(char.tagline),
              description: t(char.description),
              category: char.category,
              modelSelection: char.modelSelection,
              ownershipType: SkillOwnershipType.SYSTEM,
              voteCount: null,
              trustLevel: null,
            },
            t,
            user,
          );
        });

        // Combine all skills
        let allSkills = [...defaultSkillsCards, ...customSkillsCards];

        // Apply search filter if query is provided
        if (query) {
          allSkills = allSkills.filter(
            (char) =>
              char.name.toLowerCase().includes(query) ||
              char.description.toLowerCase().includes(query) ||
              char.tagline.toLowerCase().includes(query) ||
              char.category.toLowerCase().includes(query) ||
              char.id.toLowerCase().includes(query),
          );
        }

        // Apply skill ID filter if requested
        if (requestedCharId) {
          allSkills = allSkills.filter((char) => char.id === requestedCharId);
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

      // For public/lead users, return only default skills as card display fields (filtered)
      logger.debug("Getting default skills for public user");
      const filteredDefaults = filterDefaultSkills(user);
      let defaultSkillsCards = filteredDefaults.map((char) => {
        return SkillsRepository.mapSkillToListItem(
          char.id,
          {
            icon: char.icon,
            name: t(char.name),
            tagline: t(char.tagline),
            description: t(char.description),
            category: char.category,
            modelSelection: char.modelSelection,
            ownershipType: SkillOwnershipType.SYSTEM,
            voteCount: null,
            trustLevel: null,
          },
          t,
          user,
        );
      });

      // Apply search filter if query is provided
      if (query) {
        defaultSkillsCards = defaultSkillsCards.filter(
          (char) =>
            char.name.toLowerCase().includes(query) ||
            char.description.toLowerCase().includes(query) ||
            char.tagline.toLowerCase().includes(query) ||
            char.category.toLowerCase().includes(query) ||
            char.id.toLowerCase().includes(query),
        );
      }

      // Apply skill ID filter if requested
      if (requestedCharId) {
        defaultSkillsCards = defaultSkillsCards.filter(
          (char) => char.id === requestedCharId,
        );
      }

      // Group skills by category into sections
      const sections = this.groupSkillsIntoSections(defaultSkillsCards, t);

      return success(
        this.buildResponse(
          defaultSkillsCards,
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
   * Human callers get sections only (no pagination fields — null).
   */
  private static buildResponse(
    allMatchedSkills: SkillListItem[],
    allSections: SkillListResponseOutput["sections"],
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
    const hint =
      totalPages > 1
        ? `Page ${safePage}/${totalPages} (${totalCount} skills). Use page param to navigate.`
        : `${totalCount} skill${totalCount === 1 ? "" : "s"} found.`;

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
  ): SkillListResponseOutput["sections"] {
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
      const { id: skillId } = urlPathParams;
      const userId = user.id;

      logger.debug("Getting skill by ID", { skillId, userId });

      // Check default skills first
      const defaultSkill = DEFAULT_SKILLS.find((p) => p.id === skillId);
      if (defaultSkill) {
        // Flattened response - no container/skill/badges/systemPromptSection nesting
        return success({
          icon: defaultSkill.icon,
          name: t(defaultSkill.name),
          tagline: t(defaultSkill.tagline),
          description: t(defaultSkill.description),
          category: defaultSkill.category,
          isPublic: false,
          voice: defaultSkill.voice,
          systemPrompt: defaultSkill.systemPrompt,
          modelSelection: defaultSkill.modelSelection,
          skillOwnership: SkillOwnershipType.SYSTEM,
          compactTrigger: null,
          availableTools: defaultSkill.availableTools
            ? defaultSkill.availableTools.map((tool) => ({
                toolId: tool.toolId,
                requiresConfirmation: tool.requiresConfirmation ?? false,
              }))
            : null,
          pinnedTools: null,
        });
      }

      // Check for NO_SKILL
      if (skillId === NO_SKILL_ID) {
        // Flattened response
        return success({
          icon: null,
          name: null,
          tagline: null,
          description: null,
          category: NO_SKILL.category,
          isPublic: false,
          voice: NO_SKILL.voice,
          systemPrompt: null,
          modelSelection: NO_SKILL.modelSelection,
          skillOwnership: SkillOwnershipType.SYSTEM,
          compactTrigger: null,
          availableTools: null,
          pinnedTools: null,
        });
      }

      // Guard: custom skills use UUID IDs; non-UUID strings are unknown IDs
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(skillId)) {
        return fail({
          message: t("id.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Check custom skills
      // Return skill if:
      // 1. User owns it (any ownershipType)
      // 2. It's PUBLIC (regardless of owner)
      const [customSkill] = await db
        .select()
        .from(customSkills)
        .where(
          and(
            eq(customSkills.id, skillId),
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

      // Return only response fields (exclude database fields like userId, createdAt, updatedAt)
      // Flattened response
      return success<SkillGetResponseOutput>({
        icon: customSkill.icon,
        name: customSkill.name,
        tagline: customSkill.tagline,
        description: customSkill.description,
        category: customSkill.category,
        isPublic: customSkill.ownershipType === SkillOwnershipType.PUBLIC,
        voice: customSkill.voice || DEFAULT_TTS_VOICE,
        systemPrompt: customSkill.systemPrompt,
        modelSelection: customSkill.modelSelection,
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

    // Custom skill — DB lookup by ID only (no user filter; caller already validated ownership)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(skillId)) {
      return null;
    }

    const [row] = await db
      .select({ companionPrompt: customSkills.companionPrompt })
      .from(customSkills)
      .where(eq(customSkills.id, skillId))
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

      const [skill] = await db
        .insert(customSkills)
        .values({
          userId,
          name: data.name,
          description: data.description,
          tagline: data.tagline,
          icon: data.icon,
          systemPrompt: data.systemPrompt,
          category: data.category,
          voice: data.voice,
          modelSelection: data.modelSelection ?? DEFAULT_MODEL_SELECTION,
          ownershipType: data.isPublic
            ? SkillOwnershipType.PUBLIC
            : SkillOwnershipType.USER,
          compactTrigger: data.compactTrigger ?? null,
        })
        .returning();

      return success({
        success: t("post.success.title"),
        id: skill.id,
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

      // Check if this is a default skill
      const isDefaultSkill = DEFAULT_SKILLS.some((c) => c.id === skillId);

      if (isDefaultSkill) {
        // Create a new custom skill instead of updating the default one
        logger.debug("Creating custom skill from default", {
          userId,
          defaultSkillId: skillId,
        });

        await db
          .insert(customSkills)
          .values({
            userId,
            name: data.name,
            description: data.description,
            tagline: data.tagline,
            icon: data.icon,
            systemPrompt: data.systemPrompt,
            category: data.category,
            voice: data.voice,
            modelSelection: data.modelSelection ?? DEFAULT_MODEL_SELECTION,
            ownershipType: data.isPublic
              ? SkillOwnershipType.PUBLIC
              : SkillOwnershipType.USER,
            compactTrigger: data.compactTrigger ?? null,
          })
          .returning();

        // Flattened response
        return success({
          success: t("id.patch.success.title"),
        });
      }

      logger.debug("Updating custom skill", { userId, skillId });

      // Get existing skill to compare icon
      const [existingSkill] = await db
        .select()
        .from(customSkills)
        .where(
          and(eq(customSkills.id, skillId), eq(customSkills.userId, userId)),
        )
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
      // oxlint-disable-next-line no-unused-vars
      const { isPublic, ...dataWithoutIsPublic } = data;
      const updateValues = Object.fromEntries(
        Object.entries({
          ...dataWithoutIsPublic,
          icon: iconToUpdate,
          ownershipType,
        }).filter(([, value]) => value !== undefined),
      );

      const [updated] = await db
        .update(customSkills)
        .set({
          ...updateValues,
          updatedAt: new Date(),
        })
        .where(
          and(eq(customSkills.id, skillId), eq(customSkills.userId, userId)),
        )
        .returning();

      if (!updated) {
        return fail({
          message: t("id.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

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

      const result = await db
        .delete(customSkills)
        .where(
          and(eq(customSkills.id, skillId), eq(customSkills.userId, userId)),
        )
        .returning();

      if (result.length === 0) {
        return fail({
          message: t("id.delete.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const deleted = result[0];
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
      modelSelection: ModelSelectionSimple;
      ownershipType: typeof SkillOwnershipTypeValue;
      voteCount: number | null;
      trustLevel: typeof SkillTrustLevelValue | null;
    },
    t: ReturnType<(typeof scopedTranslation)["scopedT"]>["t"],
    user: JwtPayloadType,
  ): SkillListItem {
    // Get best model from skill's modelSelection
    const bestModel = SkillsRepositoryClient.getBestModelForSkill(
      char.modelSelection,
      user,
    );

    // Fallback if no model found (shouldn't happen with valid modelSelection)
    const modelId = bestModel?.id ?? defaultModel;
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const modelRow = bestModel
      ? {
          modelIcon: bestModel.icon,
          modelInfo: getModelDisplayName(bestModel, isAdmin),
          modelProvider: modelProviders[bestModel.provider].name,
        }
      : {
          modelIcon: "sparkles" as const,
          modelInfo: t("fallbacks.unknownModel"),
          modelProvider: t("fallbacks.unknownProvider"),
        };

    // Flattened structure - no nested content object
    // name/tagline/description are pre-resolved strings (from t() for defaults, raw strings for custom chars)
    return {
      id,
      category: char.category,
      icon: char.icon ?? "sparkles",
      modelId,
      name: char.name ?? bestModel?.name ?? t("fallbacks.unknownModel"),
      description: char.description ?? t("fallbacks.noDescription"),
      tagline: char.tagline ?? t("fallbacks.noTagline"),
      ownershipType: char.ownershipType,
      voteCount: char.voteCount,
      trustLevel: char.trustLevel,
      ...modelRow,
    };
  }
}
