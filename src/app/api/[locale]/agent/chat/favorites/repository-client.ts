/**
 * Favorites Client Repository
 * Client-side operations for favorites using localStorage
 * Mirrors server repository structure but runs in browser
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import { DEFAULT_TTS_VOICE_ID } from "@/app/api/[locale]/agent/text-to-speech/constants";
import { parseError } from "../../../shared/utils";
import type { IconKey } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import type { ChatModelSelection } from "../../ai-stream/models";
import { getModelDisplayName } from "../../models/all-models";
import { modelProviders } from "../../models/models";
import type { VoiceModelSelection } from "../../text-to-speech/models";
import { generateFavoriteSlug, generateSlug, parseSkillId } from "../slugify";

import type { TtsModelId } from "../../text-to-speech/models";
import { STORAGE_KEYS } from "../constants";
import { ChatSettingsRepositoryClient } from "../settings/repository-client";
import { DEFAULT_SKILLS } from "../skills/config";
import { ModelSelectionType } from "../skills/enum";
import { scopedTranslation as charactersScopedTranslation } from "../skills/i18n";
import type {
  FavoriteGetResponseOutput,
  FavoriteUpdateRequestOutput,
  FavoriteUpdateResponseOutput,
} from "./[id]/definition";
import { getBestChatModelForFavorite } from "./[id]/definition";
import type {
  FavoriteCreateRequestOutput,
  FavoriteCreateResponseOutput,
} from "./create/definition";
import type { FavoriteConfig } from "./db";
import type { FavoriteCard, FavoritesListResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";
import type { FavoritesReorderRequestOutput } from "./reorder/definition";

/**
 * Minimal favorite data stored in localStorage
 * Skill data is filled in from DEFAULT_SKILLS on read
 */
interface StoredLocalFavorite {
  id: string;
  /** Merged format: "skillSlug" or "skillSlug__variantId" */
  skillId: string;
  customVariantName?: string | null;
  customIcon: IconKey | null;
  voiceModelSelection: VoiceModelSelection | null;
  modelSelection: ChatModelSelection | null;
  position: number;
}

/**
 * Chat Favorites Client Repository
 * Mirrors ChatFavoritesRepository but uses localStorage
 */
export class ChatFavoritesRepositoryClient {
  /**
   * Build a FavoriteConfig from a StoredLocalFavorite (public users / localStorage).
   * Only id, skillId, modelSelection, voiceModelSelection are populated;
   * everything else is null (cascade to system defaults).
   */
  static buildLocalFavoriteConfig(stored: StoredLocalFavorite): FavoriteConfig {
    return {
      id: stored.id,
      skillId: stored.skillId,
      modelSelection: stored.modelSelection ?? null,
      voiceModelSelection: stored.voiceModelSelection ?? null,
      sttModelSelection: null,
      imageVisionModelSelection: null,
      videoVisionModelSelection: null,
      audioVisionModelSelection: null,
      imageGenModelSelection: null,
      musicGenModelSelection: null,
      videoGenModelSelection: null,
      availableTools: null,
      pinnedTools: null,
      deniedTools: null,
      compactTrigger: null,
      memoryLimit: null,
      promptAppend: null,
    };
  }

  /**
   * Get all favorites (mirrors server getFavorites)
   */
  static async getFavorites(
    logger: EndpointLogger,
    locale: CountryLanguage,
    user: JwtPayloadType,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const settings = ChatSettingsRepositoryClient.loadLocalSettings(user);
      const activeFavoriteId = settings.activeFavoriteId;

      // Load stored minimal configs
      const storedConfigs = this.loadAllLocalFavorites();

      // Batch-fetch UUID skills (custom/community) from the public API
      const uuidRe =
        /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
      const uuidSkillIds = [
        ...new Set(
          storedConfigs.map((c) => c.skillId).filter((id) => uuidRe.test(id)),
        ),
      ];

      interface FetchedSkill {
        icon: IconKey | null;
        name: string | null;
        tagline: string | null;
        description: string | null;
        variants: Array<{
          id: string;
          modelSelection: ChatModelSelection | null;
          voiceModelSelection: VoiceModelSelection | null;
          isDefault: boolean;
        }>;
      }

      const fetchedSkillMap = new Map<string, FetchedSkill>();
      if (uuidSkillIds.length > 0) {
        const results = await Promise.allSettled(
          uuidSkillIds.map(async (skillId) => {
            const res = await fetch(
              `/api/${locale}/agent/chat/skills/${skillId}`,
            );
            if (!res.ok) {
              return;
            }
            const json = (await res.json()) as {
              data?: FetchedSkill & { id?: string };
            };
            if (json.data) {
              fetchedSkillMap.set(skillId, json.data);
            }
          }),
        );
        // Log failures for debugging but don't crash
        for (const result of results) {
          if (result.status === "rejected") {
            logger.warn("Failed to fetch UUID skill", {
              reason: String(result.reason),
            });
          }
        }
      }

      // For PUBLIC users (localStorage), get character data from DEFAULT_SKILLS
      const { t: tChar } = charactersScopedTranslation.scopedT(locale);
      const cards = storedConfigs.map((config): FavoriteCard => {
        // UUID skills: use fetched data; built-in skills: use DEFAULT_SKILLS
        const isUuid = uuidRe.test(config.skillId);
        const fetchedSkill = isUuid
          ? fetchedSkillMap.get(config.skillId)
          : undefined;
        const character = isUuid
          ? undefined
          : DEFAULT_SKILLS.find((c) => c.id === config.skillId);

        const variants = fetchedSkill?.variants ?? character?.variants ?? [];
        const { variantId: configVariantId } = parseSkillId(config.skillId);
        const variant = configVariantId
          ? (variants.find((v) => v.id === configVariantId) ??
            variants.find((v) => v.isDefault) ??
            variants[0])
          : (variants.find((v) => v.isDefault) ?? variants[0]);

        const icon = fetchedSkill?.icon ?? character?.icon ?? null;
        const name =
          fetchedSkill?.name ??
          (character?.name ? tChar(character.name) : null);
        const tagline =
          fetchedSkill?.tagline ??
          (character?.tagline ? tChar(character.tagline) : null);
        const description =
          fetchedSkill?.description ??
          (character?.description ? tChar(character.description) : null);

        return this.computeFavoriteDisplayFields(
          config,
          variant?.modelSelection,
          icon,
          name,
          tagline,
          description,
          activeFavoriteId,
          variant?.voiceModelSelection ?? null,
          locale,
          user,
        );
      });

      // Sort by position (ascending)
      const favorites = cards.toSorted((a, b) => a.position - b.position);

      return success({
        favorites,
        totalCount: null,
        matchedCount: null,
        currentPage: null,
        totalPages: null,
        hint: null,
      });
    } catch (error) {
      logger.error("Failed to load favorites", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new favorite (mirrors server createFavorite)
   */
  static async createFavorite(
    data: FavoriteCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteCreateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const currentConfigs = this.loadAllLocalFavorites();

      // Generate a slug-based ID for localStorage favorites
      const { skillId: plainSkillId, variantId: parsedVariantId } =
        parseSkillId(data.skillId);
      const defaultSkill = DEFAULT_SKILLS.find((c) => c.id === plainSkillId);
      const skillSlug = defaultSkill?.id ?? generateSlug(plainSkillId);
      const baseSlug = generateFavoriteSlug({
        customVariantName: data.customVariantName,
        skillSlug,
        variantId: parsedVariantId,
      });
      const existingSlugs = currentConfigs.map((c) => c.id);
      // Ensure uniqueness: append -2, -3, etc. if needed
      let id = baseSlug || "favorite";
      if (existingSlugs.includes(id)) {
        let counter = 2;
        while (existingSlugs.includes(`${id}-${counter}`)) {
          counter++;
        }
        id = `${id}-${counter}`;
      }

      const newConfig: StoredLocalFavorite = {
        id,
        skillId: data.skillId, // store as-is (merged format)
        voiceModelSelection: data.voiceModelSelection ?? null,
        modelSelection: data.modelSelection ?? null,
        customIcon: null,
        position: currentConfigs.length,
      };

      this.saveAllLocalFavorites([...currentConfigs, newConfig]);
      logger.debug("Created favorite", { id });

      return success({
        success: t("post.success.title"),
        id,
      });
    } catch (error) {
      logger.error("Failed to create favorite", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get single favorite by ID (mirrors server getFavoriteById)
   */
  static async getFavoriteById(
    id: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteGetResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const config = this.loadLocalFavorite(id);
      if (!config) {
        return fail({
          message: t("id.get.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const enriched = this.enrichLocalFavorite(config, locale);
      return success(enriched);
    } catch (error) {
      logger.error("Failed to get favorite", { ...parseError(error), id });
      return fail({
        message: t("id.get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update favorite (mirrors server updateFavorite)
   */
  static async updateFavorite(
    id: string,
    data: FavoriteUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<FavoriteUpdateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const existing = this.loadLocalFavorite(id);
      if (!existing) {
        return fail({
          message: t("id.patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const skillId = data.skillId ?? existing.skillId;
      const character = DEFAULT_SKILLS.find((c) => c.id === skillId);

      // Extract icon from character.info.icon in request data
      const iconFromRequest = data.icon;

      // Only store customIcon if different from character default
      const customIconToStore =
        character && iconFromRequest === character.icon
          ? null
          : (iconFromRequest ?? null);

      const updated: StoredLocalFavorite = {
        ...existing,
        skillId,
        customIcon: customIconToStore,
        voiceModelSelection: data.voiceModelSelection ?? null,
        modelSelection: data.modelSelection,
      };

      this.updateLocalFavorite(id, updated);
      logger.debug("Updated favorite", { id });

      return success({
        success: t("id.patch.success.title"),
      });
    } catch (error) {
      logger.error("Failed to update favorite", { ...parseError(error), id });
      return fail({
        message: t("id.patch.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete favorite (mirrors server deleteFavorite)
   */
  static async deleteFavorite(
    id: string,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<never>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      this.deleteLocalFavorite(id);
      logger.debug("Deleted favorite", { id });
      return success();
    } catch (error) {
      logger.error("Failed to delete favorite", { ...parseError(error), id });
      return fail({
        message: t("id.delete.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Reorder favorites (mirrors server reorderFavorites)
   */
  static async reorderFavorites(
    data: FavoritesReorderRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const allFavorites = this.loadAllLocalFavorites();

      // Update positions
      data.positions.forEach(({ id, position }) => {
        const favorite = allFavorites.find((f) => f.id === id);
        if (favorite) {
          favorite.position = position;
        }
      });

      this.saveAllLocalFavorites(allFavorites);
      logger.debug("Reordered favorites");

      return success({ success: true });
    } catch (error) {
      logger.error("Failed to reorder favorites", parseError(error));
      return fail({
        message: t("reorder.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Compute display fields for a favorite
   */
  static computeFavoriteDisplayFields(
    stored: StoredLocalFavorite,
    characterModelSelection: ChatModelSelection | undefined | null,
    characterIcon: IconKey | null,
    characterName: string | null,
    characterTagline: string | null,
    characterDescription: string | null,
    activeFavoriteId: string | null,
    characterVoiceSelection: VoiceModelSelection | null,
    locale: CountryLanguage,
    user: JwtPayloadType,
  ): FavoriteCard {
    const { t } = scopedTranslation.scopedT(locale);
    const bestModel = getBestChatModelForFavorite(
      stored.modelSelection,
      characterModelSelection ?? undefined,
      user,
    );
    const hasSkill = stored.skillId !== "default";

    // Resolve voice model ID from MANUAL selection, falling back to character voice or default
    const resolveVoiceId = (
      sel: VoiceModelSelection | null | undefined,
    ): TtsModelId | null => {
      if (
        sel?.selectionType === ModelSelectionType.MANUAL &&
        sel.manualModelId
      ) {
        return sel.manualModelId;
      }
      return null;
    };
    const resolvedVoiceId =
      resolveVoiceId(stored.voiceModelSelection) ??
      resolveVoiceId(characterVoiceSelection) ??
      DEFAULT_TTS_VOICE_ID;

    // Flattened structure - no nested content/titleRow/modelRow
    return {
      id: stored.id,
      skillId: stored.skillId,
      customVariantName: stored.customVariantName ?? null,
      modelId: bestModel?.id ?? null,
      voiceId: resolvedVoiceId,
      position: stored.position,
      icon: stored.customIcon ?? characterIcon ?? bestModel?.icon ?? "bot",
      name: characterName ?? bestModel?.name ?? t("fallbacks.unknown"),
      tagline: characterTagline ?? null,
      activeBadge: stored.id === activeFavoriteId ? ("active" as const) : null,
      description: characterDescription ?? null,
      ...(bestModel
        ? {
            modelIcon: hasSkill ? bestModel.icon : ("sparkles" as const),
            modelInfo: getModelDisplayName(
              bestModel,
              !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN),
            ),
            modelProvider:
              modelProviders[bestModel.provider]?.name ??
              t("fallbacks.unknownProvider"),
          }
        : {
            modelIcon: "sparkles" as const,
            modelInfo: t("fallbacks.noModel"),
            modelProvider: t("fallbacks.unknownProvider"),
          }),
    };
  }

  /**
   * Enrich minimal stored favorite with DEFAULT_SKILLS data
   * Returns flattened structure matching FavoriteGetResponseOutput
   */
  static enrichLocalFavorite(
    stored: StoredLocalFavorite,
    locale: CountryLanguage,
  ): FavoriteGetResponseOutput {
    const { t } = scopedTranslation.scopedT(locale);
    const { t: tChar } = charactersScopedTranslation.scopedT(locale);
    const character = DEFAULT_SKILLS.find((c) => c.id === stored.skillId);

    if (!character) {
      // Flattened structure - no character found
      return {
        skillId: stored.skillId,
        customVariantName: stored.customVariantName ?? null,
        icon: "user" as const,
        name: t("fallbacks.unknownSkill"),
        tagline: t("fallbacks.noTagline"),
        description: t("fallbacks.noDescription"),
        voiceModelSelection: stored.voiceModelSelection ?? null,
        modelSelection: stored.modelSelection, // null or actual selection
        characterModelSelection: null,
        compactTrigger: null,
        availableTools: null,
        pinnedTools: null,
        deniedTools: null,
        promptAppend: null,
        memoryLimit: null,
      };
    }

    // Resolve modelSelection from the specific variant
    const { variantId: storedVariantId } = parseSkillId(stored.skillId);
    const variant = storedVariantId
      ? character.variants.find((v) => v.id === storedVariantId)
      : undefined;
    const effectiveCharacterModelSelection = variant?.modelSelection ?? null;

    // Flattened structure - translate default character keys using characters scope
    return {
      skillId: stored.skillId,
      customVariantName: stored.customVariantName ?? null,
      icon: stored.customIcon ?? character.icon,
      name: character.name ? tChar(character.name) : t("fallbacks.unknown"),
      tagline: character.tagline ? tChar(character.tagline) : "",
      description: character.description ? tChar(character.description) : "",
      voiceModelSelection: stored.voiceModelSelection ?? null,
      modelSelection: stored.modelSelection, // null = use character defaults
      characterModelSelection: effectiveCharacterModelSelection,
      compactTrigger: null,
      availableTools: null,
      pinnedTools: null,
      deniedTools: null,
      promptAppend: null,
      memoryLimit: null,
    };
  }

  /**
   * Load all favorites from localStorage
   */
  private static loadAllLocalFavorites(): StoredLocalFavorite[] {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITE_CHARACTERS);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as StoredLocalFavorite[];
    } catch {
      return [];
    }
  }

  /**
   * Save all favorites to localStorage
   */
  private static saveAllLocalFavorites(configs: StoredLocalFavorite[]): void {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(
      STORAGE_KEYS.FAVORITE_CHARACTERS,
      JSON.stringify(configs),
    );
  }

  /**
   * Store the last UUID skillId (+ display name) a public user favorited.
   * Used on the signup page to pre-select the creator to support.
   * "Last wins" — each new UUID-skill add overwrites.
   */
  static setLastAttributedSkillId(skillId: string, name?: string | null): void {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem(
      STORAGE_KEYS.LAST_ATTRIBUTED_SKILL,
      JSON.stringify({ skillId, name: name ?? null }),
    );
  }

  /**
   * Get the last UUID skillId stored by setLastAttributedSkillId.
   */
  static getLastAttributedSkillId(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_ATTRIBUTED_SKILL);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as { skillId?: string };
      return parsed.skillId ?? null;
    } catch {
      return raw; // legacy: plain string
    }
  }

  /**
   * Return UUID skills from local favorites with names from the attribution store.
   * Used on signup page to build the creator-support selector.
   */
  static getLocalUuidSkillsForAttribution(): Array<{
    skillId: string;
    name: string | null;
  }> {
    const uuidRe = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

    // Build name map from the attribution store
    const nameMap = new Map<string, string | null>();
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEYS.LAST_ATTRIBUTED_SKILL);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as {
            skillId?: string;
            name?: string | null;
          };
          if (parsed.skillId) {
            nameMap.set(parsed.skillId, parsed.name ?? null);
          }
        } catch {
          // ignore
        }
      }
    }

    return this.loadAllLocalFavorites()
      .filter((f) => uuidRe.test(f.skillId))
      .map((f) => f.skillId)
      .filter((id, idx, arr) => arr.indexOf(id) === idx) // dedupe
      .map((skillId) => ({ skillId, name: nameMap.get(skillId) ?? null }));
  }

  /**
   * Return local favorites in a shape suitable for the signup migration payload.
   * Only the fields the server needs to recreate them are included.
   */
  static getLocalFavoritesForMigration(): Array<{
    skillId: string;
    customVariantName: string | null | undefined;
    modelSelection: StoredLocalFavorite["modelSelection"];
    voiceModelSelection: StoredLocalFavorite["voiceModelSelection"];
  }> {
    return this.loadAllLocalFavorites().map((f) => ({
      skillId: f.skillId,
      customVariantName: f.customVariantName,
      modelSelection: f.modelSelection,
      voiceModelSelection: f.voiceModelSelection,
    }));
  }

  /**
   * Load single favorite by ID
   */
  static loadLocalFavorite(id: string): StoredLocalFavorite | null {
    const configs = this.loadAllLocalFavorites();
    return configs.find((config) => config.id === id) ?? null;
  }

  /**
   * Update a favorite in localStorage
   */
  private static updateLocalFavorite(
    id: string,
    updated: StoredLocalFavorite,
  ): void {
    const currentConfigs = this.loadAllLocalFavorites();
    const updatedConfigs = currentConfigs.map((config) =>
      config.id === id ? updated : config,
    );
    this.saveAllLocalFavorites(updatedConfigs);
  }

  /**
   * Delete a favorite from localStorage
   */
  private static deleteLocalFavorite(id: string): void {
    const currentConfigs = this.loadAllLocalFavorites();
    const newConfigs = currentConfigs.filter((config) => config.id !== id);
    this.saveAllLocalFavorites(newConfigs);
  }
}
