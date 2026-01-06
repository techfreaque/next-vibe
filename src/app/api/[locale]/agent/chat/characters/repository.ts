/**
 * Characters Repository
 * Database operations for custom characters
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

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
import type { Character, CharacterListResponseOutput } from "./definition";

/**
 * Simple character lookup for internal use (non-route handlers)
 * Does not require full JWT payload or logger
 */
export async function getCharacterById(
  characterId: string,
  userId?: string,
): Promise<Character | null> {
  // Check default characters first
  const defaultCharacter = DEFAULT_CHARACTERS.find((p) => p.id === characterId);
  if (defaultCharacter) {
    return defaultCharacter;
  }

  // Check custom characters (requires authenticated user)
  if (!userId) {
    return null;
  }

  const [customCharacter] = await db
    .select()
    .from(customCharacters)
    .where(and(eq(customCharacters.id, characterId), eq(customCharacters.userId, userId)))
    .limit(1);

  return customCharacter || null;
}

/**
 * Characters Repository - Static class pattern
 * All methods return ResponseType for consistent error handling
 */
export class CharactersRepository {
  /**
   * Get all characters for a user (default + custom)
   * Handles both authenticated and public users
   */
  static async getCharacters(
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CharacterListResponseOutput>> {
    try {
      const userId = user.id;

      // For authenticated users, return default + custom characters
      if (userId) {
        logger.debug("Getting all characters for user", { userId });
        const customCharactersList = await db
          .select()
          .from(customCharacters)
          .where(eq(customCharacters.userId, userId));

        return success({
          characters: [...DEFAULT_CHARACTERS, ...customCharactersList],
        });
      }

      // For public/lead users, return only default characters
      logger.debug("Getting default characters for public user");
      return success({
        characters: DEFAULT_CHARACTERS,
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
        return success({
          character: defaultCharacter,
        });
      }

      // Check custom characters (requires authenticated user)
      if (!userId) {
        return fail({
          message: "app.api.agent.chat.characters.id.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const [customCharacter] = await db
        .select()
        .from(customCharacters)
        .where(and(eq(customCharacters.id, characterId), eq(customCharacters.userId, userId)))
        .limit(1);

      if (!customCharacter) {
        return fail({
          message: "app.api.agent.chat.characters.id.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        character: customCharacter,
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
          ...data,
          userId,
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

      return success({ success: true });
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
}
