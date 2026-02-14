/**
 * Characters Repository
 * Database operations for custom characters
 */

import "server-only";

import { and, eq, ne, or } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type {
  FiltersModelSelection,
  ManualModelSelection,
} from "@/app/api/[locale]/agent/models/components/types";
import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

import type { IconKey } from "../../../system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { defaultModel, modelProviders } from "../../models/models";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import type {
  CharacterDeleteResponseOutput,
  CharacterGetResponseOutput,
  CharacterUpdateRequestOutput,
  CharacterUpdateResponseOutput,
} from "./[id]/definition";
import { DEFAULT_CHARACTERS, NO_CHARACTER, NO_CHARACTER_ID } from "./config";
import type {
  CharacterCreateRequestOutput,
  CharacterCreateResponseOutput,
} from "./create/definition";
import { customCharacters } from "./db";
import type {
  CharacterListItem,
  CharacterListResponseOutput,
} from "./definition";
import { type CharacterCategoryValue, CharacterOwnershipType } from "./enum";
import { CATEGORY_CONFIG } from "./enum";
import { CharactersRepositoryClient } from "./repository-client";

/**
 * Characters Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class CharactersRepository {
  /**
   * Get all characters for a user (default + custom)
   * Handles both authenticated and public users
   * Returns characters grouped by category into sections
   * Visibility rules:
   * - User's own characters (any ownershipType)
   * - PUBLIC characters from other users
   * - SYSTEM/built-in characters (via DEFAULT_CHARACTERS)
   */
  static async getCharacters(
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: TFunction,
  ): Promise<ResponseType<CharacterListResponseOutput>> {
    try {
      const userId = user.id;

      // For authenticated users, return default + user's own + public from others
      if (userId) {
        logger.debug("Getting all characters for user", { userId });

        // Fetch custom characters
        const customCharactersList = await db
          .select({
            id: customCharacters.id,
            name: customCharacters.name,
            description: customCharacters.description,
            icon: customCharacters.icon,
            systemPrompt: customCharacters.systemPrompt,
            category: customCharacters.category,
            tagline: customCharacters.tagline,
            ownershipType: customCharacters.ownershipType,
            modelSelection: customCharacters.modelSelection,
            voice: customCharacters.voice,
          })
          .from(customCharacters)
          .where(
            or(
              // User's own characters (any ownershipType)
              eq(customCharacters.userId, userId),
              // PUBLIC characters from other users
              and(
                eq(
                  customCharacters.ownershipType,
                  CharacterOwnershipType.PUBLIC,
                ),
                ne(customCharacters.userId, userId),
              ),
            ),
          );

        // Map custom characters to card display fields
        const customCharactersCards = customCharactersList.map((char) => {
          return CharactersRepository.mapCharacterToListItem(
            char.id,
            {
              icon: char.icon,
              name: char.name,
              tagline: char.tagline,
              description: char.description,
              category: char.category,
              modelSelection: char.modelSelection,
            },
            t,
          );
        });

        // Map default characters to card display fields
        const defaultCharactersCards = DEFAULT_CHARACTERS.map((char) => {
          return CharactersRepository.mapCharacterToListItem(
            char.id,
            {
              icon: char.icon,
              name: char.name,
              tagline: char.tagline,
              description: char.description,
              category: char.category,
              modelSelection: char.modelSelection,
            },
            t,
          );
        });

        // Combine all characters
        const allCharacters = [
          ...defaultCharactersCards,
          ...customCharactersCards,
        ];

        // Group characters by category into sections
        const sections = this.groupCharactersIntoSections(allCharacters);

        // Flattened response - no container wrapper
        return success({
          sections,
        });
      }

      // For public/lead users, return only default characters as card display fields
      logger.debug("Getting default characters for public user");
      const defaultCharactersCards = DEFAULT_CHARACTERS.map((char) => {
        return CharactersRepository.mapCharacterToListItem(
          char.id,
          {
            icon: char.icon,
            name: char.name,
            tagline: char.tagline,
            description: char.description,
            category: char.category,
            modelSelection: char.modelSelection,
          },
          t,
        );
      });

      // Group characters by category into sections
      const sections = this.groupCharactersIntoSections(defaultCharactersCards);

      // Flattened response - no container wrapper
      return success({
        sections,
      });
    } catch (error) {
      logger.error("Failed to get characters", parseError(error));
      return fail({
        message: "app.api.agent.chat.characters.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Group character cards into sections by category
   */
  private static groupCharactersIntoSections(
    characters: CharacterListItem[],
  ): CharacterListResponseOutput["sections"] {
    // Group characters by category
    const groupedByCategory = new Map<
      typeof CharacterCategoryValue,
      CharacterListItem[]
    >();

    for (const char of characters) {
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
          sectionTitle: config.label,
          sectionCount: chars.length,
          characters: chars,
          order: config.order,
        };
      })
      .filter((section) => section.characters.length > 0)
      .toSorted((a, b) => a.order - b.order)
      .map(({ sectionIcon, sectionTitle, sectionCount, characters }) => ({
        sectionIcon,
        sectionTitle,
        sectionCount,
        characters,
      }));
  }

  /**
   * Get a single character by ID
   */
  static async getCharacterById(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CharacterGetResponseOutput>> {
    try {
      const { id: characterId } = urlPathParams;
      const userId = user.id;

      logger.debug("Getting character by ID", { characterId, userId });

      // Check default characters first
      const defaultCharacter = DEFAULT_CHARACTERS.find(
        (p) => p.id === characterId,
      );
      if (defaultCharacter) {
        // Flattened response - no container/character/badges/systemPromptSection nesting
        return success({
          icon: defaultCharacter.icon,
          name: defaultCharacter.name,
          tagline: defaultCharacter.tagline,
          description: defaultCharacter.description,
          category: defaultCharacter.category,
          isPublic: false,
          voice: defaultCharacter.voice,
          systemPrompt: defaultCharacter.systemPrompt,
          modelSelection: defaultCharacter.modelSelection,
          characterOwnership: CharacterOwnershipType.SYSTEM,
        });
      }

      // Check for NO_CHARACTER
      if (characterId === NO_CHARACTER_ID) {
        // Flattened response
        return success({
          icon: null,
          name: null,
          tagline: null,
          description: null,
          category: NO_CHARACTER.category,
          isPublic: false,
          voice: NO_CHARACTER.voice,
          systemPrompt: null,
          modelSelection: NO_CHARACTER.modelSelection,
          characterOwnership: CharacterOwnershipType.SYSTEM,
        });
      }

      // Check custom characters
      // Return character if:
      // 1. User owns it (any ownershipType)
      // 2. It's PUBLIC (regardless of owner)
      const [customCharacter] = await db
        .select()
        .from(customCharacters)
        .where(
          and(
            eq(customCharacters.id, characterId),
            userId
              ? or(
                  eq(customCharacters.userId, userId),
                  eq(
                    customCharacters.ownershipType,
                    CharacterOwnershipType.PUBLIC,
                  ),
                )
              : eq(
                  customCharacters.ownershipType,
                  CharacterOwnershipType.PUBLIC,
                ),
          ),
        )
        .limit(1);

      if (!customCharacter) {
        return fail({
          message: "app.api.agent.chat.characters.id.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Return only response fields (exclude database fields like userId, createdAt, updatedAt)
      // Flattened response
      return success({
        icon: customCharacter.icon,
        name: customCharacter.name,
        tagline: customCharacter.tagline,
        description: customCharacter.description,
        category: customCharacter.category,
        isPublic:
          customCharacter.ownershipType === CharacterOwnershipType.PUBLIC,
        voice: customCharacter.voice || DEFAULT_TTS_VOICE,
        systemPrompt: customCharacter.systemPrompt,
        modelSelection: customCharacter.modelSelection,
        characterOwnership: customCharacter.ownershipType,
      });
    } catch (error) {
      logger.error("Failed to get character by ID", parseError(error));
      return fail({
        message: "app.api.agent.chat.characters.id.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Create a new custom character
   */
  static async createCharacter(
    data: CharacterCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CharacterCreateResponseOutput>> {
    try {
      const userId = user.id;

      if (!userId) {
        return fail({
          message:
            "app.api.agent.chat.characters.post.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Creating custom character", {
        userId,
        name: data.name,
      });

      const [character] = await db
        .insert(customCharacters)
        .values({
          userId,
          name: data.name,
          description: data.description,
          tagline: data.tagline,
          icon: data.icon,
          systemPrompt: data.systemPrompt,
          category: data.category,
          voice: data.voice,
          modelSelection: data.modelSelection,
          ownershipType: data.isPublic
            ? CharacterOwnershipType.PUBLIC
            : CharacterOwnershipType.USER,
        })
        .returning();

      return success({
        success: "app.api.agent.chat.characters.post.success.title",
        id: character.id,
      });
    } catch (error) {
      logger.error("Failed to create character", parseError(error));
      return fail({
        message: "app.api.agent.chat.characters.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Update a custom character
   */
  static async updateCharacter(
    data: CharacterUpdateRequestOutput,
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CharacterUpdateResponseOutput>> {
    try {
      const userId = user.id;
      const { id: characterId } = urlPathParams;

      if (!userId) {
        return fail({
          message:
            "app.api.agent.chat.characters.id.patch.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      // Check if this is a default character
      const isDefaultCharacter = DEFAULT_CHARACTERS.some(
        (c) => c.id === characterId,
      );

      if (isDefaultCharacter) {
        // Create a new custom character instead of updating the default one
        logger.debug("Creating custom character from default", {
          userId,
          defaultCharacterId: characterId,
        });

        await db
          .insert(customCharacters)
          .values({
            userId,
            name: data.name,
            description: data.description,
            tagline: data.tagline,
            icon: data.icon,
            systemPrompt: data.systemPrompt,
            category: data.category,
            voice: data.voice,
            modelSelection: data.modelSelection,
            ownershipType: data.isPublic
              ? CharacterOwnershipType.PUBLIC
              : CharacterOwnershipType.USER,
          })
          .returning();

        // Flattened response
        return success({
          success: "app.api.agent.chat.characters.id.patch.success.title",
        });
      }

      logger.debug("Updating custom character", { userId, characterId });

      // Get existing character to compare icon
      const [existingCharacter] = await db
        .select()
        .from(customCharacters)
        .where(
          and(
            eq(customCharacters.id, characterId),
            eq(customCharacters.userId, userId),
          ),
        )
        .limit(1);

      if (!existingCharacter) {
        return fail({
          message:
            "app.api.agent.chat.characters.id.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Only update icon if it's different from existing, otherwise set to null
      const iconToUpdate =
        data.icon && data.icon !== existingCharacter.icon ? data.icon : null;

      // Map isPublic to ownershipType
      const ownershipType =
        data.isPublic !== undefined
          ? data.isPublic
            ? CharacterOwnershipType.PUBLIC
            : CharacterOwnershipType.USER
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
        .update(customCharacters)
        .set({
          ...updateValues,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(customCharacters.id, characterId),
            eq(customCharacters.userId, userId),
          ),
        )
        .returning();

      if (!updated) {
        return fail({
          message:
            "app.api.agent.chat.characters.id.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Return the full updated character to match GET response structure
      // Transform ownershipType: PATCH response only accepts "user" | "public", not "system"
      // Custom characters should never be "system", but TypeScript doesn't know this
      // Flattened response
      return success({
        success: "app.api.agent.chat.characters.id.patch.success.title",
      });
    } catch (error) {
      logger.error("Failed to update character", parseError(error));
      return fail({
        message: "app.api.agent.chat.characters.id.patch.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Delete a custom character
   */
  static async deleteCharacter(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CharacterDeleteResponseOutput>> {
    try {
      const userId = user.id;
      const { id: characterId } = urlPathParams;

      if (!userId) {
        return fail({
          message:
            "app.api.agent.chat.characters.id.delete.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Deleting custom character", { userId, characterId });

      const result = await db
        .delete(customCharacters)
        .where(
          and(
            eq(customCharacters.id, characterId),
            eq(customCharacters.userId, userId),
          ),
        )
        .returning();

      if (result.length === 0) {
        return fail({
          message:
            "app.api.agent.chat.characters.id.delete.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success();
    } catch (error) {
      logger.error("Failed to delete character", parseError(error));
      return fail({
        message: "app.api.agent.chat.characters.id.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Map a character to a list item card
   * Uses CharactersRepositoryClient for all display field computation
   */
  private static mapCharacterToListItem(
    id: string,
    char: {
      icon: IconKey | null;
      name: TranslationKey | null;
      tagline: TranslationKey | null;
      description: TranslationKey | null;
      category: typeof CharacterCategoryValue;
      modelSelection: FiltersModelSelection | ManualModelSelection;
    },
    t: TFunction,
  ): CharacterListItem {
    // Get best model from character's modelSelection
    const bestModel = CharactersRepositoryClient.getBestModelForCharacter(
      char.modelSelection,
    );

    // Fallback if no model found (shouldn't happen with valid modelSelection)
    const modelId = bestModel?.id ?? defaultModel;
    const modelRow = bestModel
      ? {
          modelIcon: bestModel.icon,
          modelInfo: bestModel.name,
          modelProvider: modelProviders[bestModel.provider].name,
        }
      : {
          modelIcon: "sparkles" as const,
          modelInfo: t("app.api.agent.chat.characters.fallbacks.unknownModel"),
          modelProvider: t(
            "app.api.agent.chat.characters.fallbacks.unknownProvider",
          ),
        };

    // Flattened structure - no nested content object
    return {
      id,
      category: char.category,
      icon: char.icon ?? "sparkles",
      modelId,
      name:
        char.name ??
        bestModel?.name ??
        ("app.api.agent.chat.characters.fallbacks.unknownModel" as const),
      description:
        char.description ??
        ("app.api.agent.chat.characters.fallbacks.noDescription" as const),
      tagline:
        char.tagline ??
        ("app.api.agent.chat.characters.fallbacks.noTagline" as const),
      ...modelRow,
    };
  }
}
