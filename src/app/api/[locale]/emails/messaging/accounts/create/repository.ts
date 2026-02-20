/**
 * Messaging Account Create Repository
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { messagingAccounts } from "../../db";
import type { MessagingAccountCreatePOSTResponseOutput } from "./definition";

interface MessagingAccountCreateRepositoryInterface {
  createAccount(
    data: {
      name: string;
      description?: string;
      channel: string;
      provider: string;
      fromId?: string;
      apiToken?: string;
      apiSecret?: string;
      priority?: number;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagingAccountCreatePOSTResponseOutput>>;
}

class MessagingAccountCreateRepositoryImpl implements MessagingAccountCreateRepositoryInterface {
  async createAccount(
    data: {
      name: string;
      description?: string;
      channel: string;
      provider: string;
      fromId?: string;
      apiToken?: string;
      apiSecret?: string;
      priority?: number;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagingAccountCreatePOSTResponseOutput>> {
    try {
      logger.debug("Creating messaging account", {
        name: data.name,
        channel: data.channel,
        userId: user.isPublic ? "public" : user.id,
      });

      const [newAccount] = await db
        .insert(messagingAccounts)
        .values({
          name: data.name,
          description: data.description,
          channel:
            data.channel as (typeof messagingAccounts.$inferInsert)["channel"],
          provider:
            data.provider as (typeof messagingAccounts.$inferInsert)["provider"],
          fromId: data.fromId,
          apiToken: data.apiToken,
          apiSecret: data.apiSecret,
          priority: data.priority ?? 0,
          createdBy: user.isPublic ? undefined : user.id,
          updatedBy: user.isPublic ? undefined : user.id,
        })
        .returning();

      if (!newAccount) {
        return fail({
          message:
            "app.api.emails.messaging.accounts.create.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error:
              "app.api.emails.messaging.accounts.create.errors.server.description",
          },
        });
      }

      const response: MessagingAccountCreatePOSTResponseOutput = {
        id: newAccount.id,
        name: newAccount.name,
        channel: newAccount.channel,
        provider: newAccount.provider,
        fromId: newAccount.fromId ?? undefined,
        status: newAccount.status,
        createdAt: newAccount.createdAt,
      };

      logger.info("Messaging account created", {
        accountId: newAccount.id,
        name: newAccount.name,
      });

      return success(response);
    } catch (error) {
      const errorMessage = parseError(error).message;
      logger.error("Error creating messaging account", parseError(error));

      const isUniqueViolation =
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate") ||
        (typeof error === "object" &&
          error !== null &&
          "cause" in error &&
          typeof error.cause === "object" &&
          error.cause !== null &&
          "code" in error.cause &&
          error.cause.code === "23505");

      if (isUniqueViolation) {
        return fail({
          message:
            "app.api.emails.messaging.accounts.create.errors.conflict.title",
          errorType: ErrorResponseTypes.CONFLICT,
          messageParams: {
            error:
              "app.api.emails.messaging.accounts.create.errors.conflict.description",
          },
        });
      }

      return fail({
        message: "app.api.emails.messaging.accounts.create.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }
}

export const messagingAccountCreateRepository =
  new MessagingAccountCreateRepositoryImpl();
