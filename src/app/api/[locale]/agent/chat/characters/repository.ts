/**
 * Characters Repository
 * Database operations for custom characters
 */

import "server-only";

import { and, eq, ne, or } from "drizzle-orm";
import { parseError } from "next-vibe/shared/utils";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { IconKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { modelOptions, modelProviders } from "../../models/models";
import { DEFAULT_TTS_VOICE } from "../../text-to-speech/enum";
import type {
  CharacterGetResponseOutput,
  CharacterUpdateRequestOutput,
  CharacterUpdateResponseOutput,
} from "./[id]/definition";
import { DEFAULT_CHARACTERS } from "./config";
import type {
  CharacterCreateRequestOutput,
  CharacterCreateResponseOutput,
} from "./create/definition";
import { customCharacters } from "./db";
import type { CharacterListItem, CharacterListResponseOutput } from "./definition";
import type { CharacterCategoryDB } from "./enum";
import { type CharacterCategoryValue, CharacterOwnershipType } from "./enum";
import { CATEGORY_CONFIG } from "./enum";
import { CharactersRepositoryClient } from "./repository-client";

/**
 * Characters Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class CharactersRepository {
  /**
   * Simple character lookup for internal use (non-route handlers)
   * Does not require full JWT payload or logger
   */
  static async getCharacterByIdSimple(
    characterId: string,
    userId?: string,
  ): Promise<CharacterGetResponseOutput | null> {
    // Check default characters first (these already have source field)
    const defaultCharacter = DEFAULT_CHARACTERS.find((p) => p.id === characterId);
    if (defaultCharacter) {
      return {
        ...defaultCharacter,
        ownershipType: CharacterOwnershipType.SYSTEM,
      };
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
                eq(customCharacters.ownershipType, CharacterOwnershipType.PUBLIC),
              )
            : eq(customCharacters.ownershipType, CharacterOwnershipType.PUBLIC),
        ),
      )
      .limit(1);

    if (!customCharacter) {
      return null;
    }

    return {
      id: customCharacter.id,
      name: customCharacter.name,
      description: customCharacter.description,
      icon: customCharacter.icon,
      systemPrompt: customCharacter.systemPrompt,
      category: customCharacter.category,
      tagline: customCharacter.tagline,
      ownershipType: customCharacter.ownershipType,
      modelSelection: customCharacter.modelSelection,
      voice: customCharacter.voice || DEFAULT_TTS_VOICE,
      suggestedPrompts: customCharacter.suggestedPrompts,
    };
  }

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
  ): Promise<ResponseType<CharacterListResponseOutput>> {
    try {
      const userId = user.id;

      // For authenticated users, return default + user's own + public from others
      if (userId) {
        logger.debug("Getting all characters for user", { userId });
        const customCharactersList = await db
          .select()
          .from(customCharacters)
          .where(
            or(
              // User's own characters (any ownershipType)
              eq(customCharacters.userId, userId),
              // PUBLIC characters from other users
              and(
                eq(customCharacters.ownershipType, CharacterOwnershipType.PUBLIC),
                ne(customCharacters.userId, userId),
              ),
            ),
          );

        // Map custom characters to card display fields
        const customCharactersCards = customCharactersList.map(
          CharactersRepository.mapCharacterToListItem,
        );

        // Map default characters to card display fields
        const defaultCharactersCards = DEFAULT_CHARACTERS.map(
          CharactersRepository.mapCharacterToListItem,
        );

        // Combine all characters
        const allCharacters = [...defaultCharactersCards, ...customCharactersCards];

        // Group characters by category into sections
        const sections = this.groupCharactersIntoSections(allCharacters);

        return success({
          sections,
        });
      }

      // For public/lead users, return only default characters as card display fields
      logger.debug("Getting default characters for public user");
      const defaultCharactersCards = DEFAULT_CHARACTERS.map(
        CharactersRepository.mapCharacterToListItem,
      );

      // Group characters by category into sections
      const sections = this.groupCharactersIntoSections(defaultCharactersCards);

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
    const groupedByCategory = new Map<typeof CharacterCategoryValue, CharacterListItem[]>();

    for (const char of characters) {
      const existing = groupedByCategory.get(char.category) || [];
      existing.push(char);
      groupedByCategory.set(char.category, existing);
    }

    // Convert to sections array with metadata from CATEGORY_CONFIG
    // Sort by category order before returning
    return [...groupedByCategory.entries()]
      .map(([category, chars]) => {
        const config = CATEGORY_CONFIG[category];
        return {
          sectionHeader: {
            icon: config.icon,
            title: config.label,
            count: chars.length,
          },
          characters: chars,
          order: config.order,
        };
      })
      .filter((section) => section.characters.length > 0)
      .toSorted((a, b) => a.order - b.order)
      .map(({ sectionHeader, characters }) => ({ sectionHeader, characters }));
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
      const defaultCharacter = DEFAULT_CHARACTERS.find((p) => p.id === characterId);
      if (defaultCharacter) {
        const characterData: CharacterGetResponseOutput = {
          id: defaultCharacter.id,
          name: defaultCharacter.name,
          description: defaultCharacter.description,
          icon: defaultCharacter.icon,
          systemPrompt: defaultCharacter.systemPrompt,
          category: defaultCharacter.category,
          tagline: defaultCharacter.tagline,
          ownershipType: CharacterOwnershipType.SYSTEM,
          modelSelection: defaultCharacter.modelSelection,
          voice: defaultCharacter.voice,
          suggestedPrompts: defaultCharacter.suggestedPrompts,
        };
        return success(characterData);
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
                  eq(customCharacters.ownershipType, CharacterOwnershipType.PUBLIC),
                )
              : eq(customCharacters.ownershipType, CharacterOwnershipType.PUBLIC),
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
      return success({
        id: customCharacter.id,
        name: customCharacter.name,
        description: customCharacter.description,
        icon: customCharacter.icon,
        systemPrompt: customCharacter.systemPrompt,
        category: customCharacter.category,
        tagline: customCharacter.tagline,
        ownershipType: customCharacter.ownershipType,
        modelSelection: customCharacter.modelSelection,
        voice: customCharacter.voice || DEFAULT_TTS_VOICE,
        suggestedPrompts: customCharacter.suggestedPrompts,
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
          message: "app.api.agent.chat.characters.post.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Creating custom character", { userId, name: data.name });

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
          suggestedPrompts: data.suggestedPrompts || [],
          modelSelection: data.modelSelection,
          ownershipType: data.ownershipType,
        })
        .returning();

      return success({ id: character.id });
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
          message: "app.api.agent.chat.characters.id.patch.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Updating custom character", { userId, characterId });

      const updateValues = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined),
      );

      const [updated] = await db
        .update(customCharacters)
        .set({
          ...updateValues,
          updatedAt: new Date(),
        })
        .where(and(eq(customCharacters.id, characterId), eq(customCharacters.userId, userId)))
        .returning();

      if (!updated) {
        return fail({
          message: "app.api.agent.chat.characters.id.patch.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      // Return the full updated character to match GET response structure
      // Transform ownershipType: PATCH response only accepts "user" | "public", not "system"
      // Custom characters should never be "system", but TypeScript doesn't know this
      return success({
        id: updated.id,
        name: updated.name,
        description: updated.description,
        icon: updated.icon,
        systemPrompt: updated.systemPrompt,
        category: updated.category,
        tagline: updated.tagline,
        ownershipType:
          updated.ownershipType === "app.api.agent.chat.characters.enums.ownershipType.system"
            ? "app.api.agent.chat.characters.enums.ownershipType.user"
            : updated.ownershipType,
        voice: updated.voice || DEFAULT_TTS_VOICE,
        suggestedPrompts: updated.suggestedPrompts,
        modelSelection: updated.modelSelection,
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
  ): Promise<ResponseType<{ success: boolean }>> {
    try {
      const userId = user.id;
      const { id: characterId } = urlPathParams;

      if (!userId) {
        return fail({
          message: "app.api.agent.chat.characters.id.delete.errors.unauthorized.title",
          errorType: ErrorResponseTypes.UNAUTHORIZED,
        });
      }

      logger.debug("Deleting custom character", { userId, characterId });

      const result = await db
        .delete(customCharacters)
        .where(and(eq(customCharacters.id, characterId), eq(customCharacters.userId, userId)))
        .returning();

      if (result.length === 0) {
        return fail({
          message: "app.api.agent.chat.characters.id.delete.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({ success: true });
    } catch (error) {
      logger.error("Failed to delete character", parseError(error));
      return fail({
        message: "app.api.agent.chat.characters.id.delete.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
  /**
   * Format credit cost for display (server-side version, no i18n)
   */
  private static formatCreditCost(cost: number): string {
    if (cost === 0) {
      return "Free";
    }
    if (cost === 1) {
      return "1 credit";
    }
    return `${cost} credits`;
  }

  /**
   * Compute display fields for a character
   */
  private static computeCharacterDisplayFields(character: {
    modelSelection: CharacterGetResponseOutput["modelSelection"];
  }): {
    modelIcon: IconKey;
    modelInfo: string;
    modelProvider: string;
    creditCost: string;
  } {
    const allModels = Object.values(modelOptions);
    const resolvedModel = CharactersRepositoryClient.resolveModelForSelection(
      character.modelSelection,
      allModels,
    );

    return {
      modelIcon: resolvedModel?.icon ?? ("sparkles" as IconKey),
      modelInfo: resolvedModel?.name ?? "Default Model",
      modelProvider: resolvedModel?.provider
        ? (modelProviders[resolvedModel.provider]?.name ?? "Unknown")
        : "Unknown",
      creditCost: resolvedModel
        ? CharactersRepository.formatCreditCost(resolvedModel.creditCost)
        : "—",
    };
  }

  /**
   * Map a character to a list item card
   */
  private static mapCharacterToListItem(char: {
    id: string;
    category: string;
    icon: string;
    name: string;
    description: string;
    tagline: string;
    modelSelection: CharacterGetResponseOutput["modelSelection"];
  }): CharacterListItem {
    const displayFields = CharactersRepository.computeCharacterDisplayFields(char);
    return {
      id: char.id,
      category: char.category as (typeof CharacterCategoryDB)[number],
      icon: char.icon as IconKey,
      content: {
        name: char.name,
        description: char.description,
        tagline: char.tagline,
        modelRow: {
          modelIcon: displayFields.modelIcon,
          modelInfo: displayFields.modelInfo,
          modelProvider: displayFields.modelProvider,
          creditCost: displayFields.creditCost,
        },
      },
    };
  }
}
