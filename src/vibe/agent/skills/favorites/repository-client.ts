/**
 * Favorites Client Repository
 * Client-side operations for favorites using localStorage
 * Mirrors server repository structure but runs in browser
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { reportStorageFailure } from "next-vibe/logger/storage-failure";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getLocalItem, storage } from "next-vibe/ui/lib/storage";
import { executeQuery } from "next-vibe/unified-ui/hooks/query-executor";
import type { IconKey } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icons";

import type { ChatModelSelection } from "../../ai-stream/models";
import { STORAGE_KEYS } from "../../chat/constants";
import { ChatSettingsRepositoryClient } from "../../chat/settings/repository-client";
import {
  generateFavoriteSlug,
  generateSlug,
  parseSkillId,
} from "../../chat/slugify";
import type { AgentEnvAvailability } from "../../env-availability";
import { getModelDisplayName } from "../../models/all-models";
import { modelProviders } from "../../models/models";
import { DEFAULT_TTS_VOICE_ID } from "../../text-to-speech/constants";
import type {
  TtsModelId,
  VoiceModelSelection,
} from "../../text-to-speech/models";
import skillSingleDefinition from "../[id]/definition";
import { DEFAULT_SKILLS, type SkillVariant } from "../config";
import type { SkillVariantData } from "../db";
import { ModelSelectionType } from "../enum";
import { scopedTranslation as charactersScopedTranslation } from "../i18n";
import { pickSkillVariant } from "../pick-variant";
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

function resolveFavoriteVoiceId(
  selection: VoiceModelSelection | null | undefined,
): TtsModelId | null {
  if (
    selection?.selectionType === ModelSelectionType.MANUAL &&
    selection.manualModelId
  ) {
    return selection.manualModelId;
  }
  return null;
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
      // Load-bearing for model resolution: local favorites store the merged
      // "skillSlug__variantId" format, so the variant must be split out for
      // the skill-variant cascade to pick this favorite's variant.
      variantId: parseSkillId(stored.skillId).variantId,
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
    availability: AgentEnvAvailability,
  ): Promise<ResponseType<FavoritesListResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const settings = await ChatSettingsRepositoryClient.loadLocalSettings(
        user,
        availability,
        logger,
      );
      const activeFavoriteId = settings.activeFavoriteId;

      // Load stored minimal configs
      const allStoredConfigs = await this.loadAllLocalFavorites(logger);

      // Batch-fetch UUID skills (custom/community) from the public API
      const uuidRe =
        /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;
      const uuidSkillIds = [
        ...new Set(
          allStoredConfigs
            .map((c) => parseSkillId(c.skillId).skillId)
            .filter((id) => uuidRe.test(id)),
        ),
      ];

      interface FetchedSkill {
        icon: IconKey | null;
        name: string | null;
        tagline: string | null;
        description: string | null;
        variants: SkillVariantData[];
      }

      const fetchedSkillMap = new Map<string, FetchedSkill>();
      // Skills the server no longer serves to this user (deleted, unpublished
      // or made private) - their favorites are dead and get pruned below.
      const goneSkillIds = new Set<string>();
      if (uuidSkillIds.length > 0) {
        const results = await Promise.allSettled(
          uuidSkillIds.map(async (skillId) => {
            const response = await executeQuery({
              endpoint: skillSingleDefinition.GET,
              logger,
              user,
              locale,
              requestData: undefined,
              pathParams: { id: skillId },
            });
            if (!response.success) {
              if (response.errorType?.errorCode === 404) {
                goneSkillIds.add(skillId);
              }
              return;
            }
            const { icon, name, tagline, description, variants } =
              response.data;
            fetchedSkillMap.set(skillId, {
              icon,
              name,
              tagline,
              description,
              variants,
            });
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

      if (goneSkillIds.size > 0) {
        logger.info("Pruning local favorites of unavailable skills", {
          skillIds: [...goneSkillIds].join(","),
        });
        await this.pruneUnavailableLocalSkills(goneSkillIds, logger);
      }
      const storedConfigs = allStoredConfigs.filter(
        (c) => !goneSkillIds.has(parseSkillId(c.skillId).skillId),
      );

      // For PUBLIC users (localStorage), get character data from DEFAULT_SKILLS
      const { t: tChar } = charactersScopedTranslation.scopedT(locale);
      const cards = storedConfigs.map((config): FavoriteCard => {
        // UUID skills: use fetched data; built-in skills: use DEFAULT_SKILLS
        // skillId is stored merged ("thea__brilliant") - look skills up by base id
        const { skillId: baseSkillId, variantId: configVariantId } =
          parseSkillId(config.skillId);
        const isUuid = uuidRe.test(baseSkillId);
        const fetchedSkill = isUuid
          ? fetchedSkillMap.get(baseSkillId)
          : undefined;
        const character = isUuid
          ? undefined
          : DEFAULT_SKILLS.find((c) => c.id === baseSkillId);

        const variants: readonly (SkillVariant | SkillVariantData)[] =
          fetchedSkill?.variants ?? character?.variants ?? [];
        const variant = pickSkillVariant(variants, configVariantId);

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
          availability,
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
      const currentConfigs = await this.loadAllLocalFavorites(logger);

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

      await this.saveAllLocalFavorites([...currentConfigs, newConfig], logger);
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
      const config = await this.loadLocalFavorite(id, logger);
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
      const existing = await this.loadLocalFavorite(id, logger);
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

      await this.updateLocalFavorite(id, updated, logger);
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
      await this.deleteLocalFavorite(id, logger);
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
   * Batch-delete favorites (mirrors server FavoritesDeleteBatchRepository).
   *
   * One read-modify-write removes every id at once. This is the whole point of
   * the batch op: deleting a multi-variant skill one id at a time raced here,
   * because concurrent deleteFavorite calls each read the same snapshot and drop
   * only their own id, so the last write clobbered the rest and all-but-one
   * variant survived a refresh.
   */
  static async deleteFavorites(
    ids: string[],
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<{ success: boolean }>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const idsToRemove = new Set(ids);
      const currentConfigs = await this.loadAllLocalFavorites(logger);
      const newConfigs = currentConfigs.filter(
        (config) => !idsToRemove.has(config.id),
      );
      await this.saveAllLocalFavorites(newConfigs, logger);
      logger.debug("Batch-deleted favorites", { count: ids.length });
      return success({ success: true });
    } catch (error) {
      logger.error("Failed to batch-delete favorites", parseError(error));
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
      const allFavorites = await this.loadAllLocalFavorites(logger);

      // Update positions
      data.positions.forEach(({ id, position }) => {
        const favorite = allFavorites.find((f) => f.id === id);
        if (favorite) {
          favorite.position = position;
        }
      });

      await this.saveAllLocalFavorites(allFavorites, logger);
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
    availability: AgentEnvAvailability,
  ): FavoriteCard {
    const { t } = scopedTranslation.scopedT(locale);
    const bestModel = getBestChatModelForFavorite(
      stored.modelSelection,
      characterModelSelection ?? undefined,
      user,
      availability,
    );
    const hasSkill = stored.skillId !== "default";

    const resolvedVoiceId =
      resolveFavoriteVoiceId(stored.voiceModelSelection) ??
      resolveFavoriteVoiceId(characterVoiceSelection) ??
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
              availability,
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
    const variant = pickSkillVariant(character.variants, storedVariantId);
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

  private static loadAllLocalFavoritesSync(
    logger: EndpointLogger,
  ): StoredLocalFavorite[] {
    const stored = getLocalItem(STORAGE_KEYS.FAVORITE_CHARACTERS, logger);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored) as StoredLocalFavorite[];
    } catch (error) {
      reportStorageFailure(logger, {
        platform: "web",
        area: "localStorage",
        operation: "parse",
        key: STORAGE_KEYS.FAVORITE_CHARACTERS,
        error: error instanceof Error ? error : String(error),
        valueLength: stored.length,
      });
      return [];
    }
  }

  static loadLocalFavoriteSync(
    id: string,
    logger: EndpointLogger,
  ): StoredLocalFavorite | null {
    return (
      this.loadAllLocalFavoritesSync(logger).find((c) => c.id === id) ?? null
    );
  }

  private static async loadAllLocalFavorites(
    logger: EndpointLogger,
  ): Promise<StoredLocalFavorite[]> {
    const stored = await storage.getItem(
      STORAGE_KEYS.FAVORITE_CHARACTERS,
      logger,
    );
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored) as StoredLocalFavorite[];
    } catch (error) {
      reportStorageFailure(logger, {
        platform: "web",
        area: "localStorage",
        operation: "parse",
        key: STORAGE_KEYS.FAVORITE_CHARACTERS,
        error: error instanceof Error ? error : String(error),
        valueLength: stored.length,
      });
      return [];
    }
  }

  private static async saveAllLocalFavorites(
    configs: StoredLocalFavorite[],
    logger: EndpointLogger,
  ): Promise<void> {
    await storage.setItem(
      STORAGE_KEYS.FAVORITE_CHARACTERS,
      JSON.stringify(configs),
      logger,
    );
  }

  static async setLastAttributedSkillId(
    skillId: string,
    name: string | null | undefined,
    logger: EndpointLogger,
  ): Promise<void> {
    await storage.setItem(
      STORAGE_KEYS.LAST_ATTRIBUTED_SKILL,
      JSON.stringify({ skillId, name: name ?? null }),
      logger,
    );
  }

  static async getLastAttributedSkillId(
    logger: EndpointLogger,
  ): Promise<string | null> {
    const raw = await storage.getItem(
      STORAGE_KEYS.LAST_ATTRIBUTED_SKILL,
      logger,
    );
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

  static async getLocalUuidSkillsForAttribution(
    logger: EndpointLogger,
  ): Promise<Array<{ skillId: string; name: string | null }>> {
    const uuidRe = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

    const nameMap = new Map<string, string | null>();
    const raw = await storage.getItem(
      STORAGE_KEYS.LAST_ATTRIBUTED_SKILL,
      logger,
    );
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          skillId?: string;
          name?: string | null;
        };
        if (parsed.skillId) {
          nameMap.set(parsed.skillId, parsed.name ?? null);
        }
      } catch (error) {
        reportStorageFailure(logger, {
          platform: "web",
          area: "localStorage",
          operation: "parse",
          key: STORAGE_KEYS.LAST_ATTRIBUTED_SKILL,
          error: error instanceof Error ? error : String(error),
          valueLength: raw.length,
        });
      }
    }

    const all = await this.loadAllLocalFavorites(logger);
    // skillId is stored merged ("<uuid>__<variant>") - attribute the base skill
    return all
      .map((f) => parseSkillId(f.skillId).skillId)
      .filter((id) => uuidRe.test(id))
      .filter((id, idx, arr) => arr.indexOf(id) === idx)
      .map((skillId) => ({ skillId, name: nameMap.get(skillId) ?? null }));
  }

  /**
   * Drop every local favorite of skills the server answered 404 for (deleted,
   * unpublished or made private), and forget them as the last attributed
   * skill - otherwise each favorites load / signup render re-requests them.
   */
  static async pruneUnavailableLocalSkills(
    skillIds: ReadonlySet<string>,
    logger: EndpointLogger,
  ): Promise<void> {
    if (skillIds.size === 0) {
      return;
    }
    const all = await this.loadAllLocalFavorites(logger);
    const kept = all.filter(
      (f) => !skillIds.has(parseSkillId(f.skillId).skillId),
    );
    if (kept.length !== all.length) {
      await this.saveAllLocalFavorites(kept, logger);
    }
    const lastAttributed = await this.getLastAttributedSkillId(logger);
    if (lastAttributed !== null && skillIds.has(lastAttributed)) {
      await storage.removeItem(STORAGE_KEYS.LAST_ATTRIBUTED_SKILL, logger);
    }
  }

  static async getLocalFavoritesForMigration(logger: EndpointLogger): Promise<
    Array<{
      skillId: string;
      customVariantName: string | null | undefined;
      modelSelection: StoredLocalFavorite["modelSelection"];
      voiceModelSelection: StoredLocalFavorite["voiceModelSelection"];
    }>
  > {
    const all = await this.loadAllLocalFavorites(logger);
    return all.map((f) => ({
      skillId: f.skillId,
      customVariantName: f.customVariantName,
      modelSelection: f.modelSelection,
      voiceModelSelection: f.voiceModelSelection,
    }));
  }

  static async loadLocalFavorite(
    id: string,
    logger: EndpointLogger,
  ): Promise<StoredLocalFavorite | null> {
    const configs = await this.loadAllLocalFavorites(logger);
    return configs.find((config) => config.id === id) ?? null;
  }

  private static async updateLocalFavorite(
    id: string,
    updated: StoredLocalFavorite,
    logger: EndpointLogger,
  ): Promise<void> {
    const currentConfigs = await this.loadAllLocalFavorites(logger);
    const updatedConfigs = currentConfigs.map((config) =>
      config.id === id ? updated : config,
    );
    await this.saveAllLocalFavorites(updatedConfigs, logger);
  }

  private static async deleteLocalFavorite(
    id: string,
    logger: EndpointLogger,
  ): Promise<void> {
    const currentConfigs = await this.loadAllLocalFavorites(logger);
    const newConfigs = currentConfigs.filter((config) => config.id !== id);
    await this.saveAllLocalFavorites(newConfigs, logger);
  }
}
