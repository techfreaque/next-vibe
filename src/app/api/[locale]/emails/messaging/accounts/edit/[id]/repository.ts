/**
 * Messaging Account Edit Repository
 */

import "server-only";

import { eq } from "drizzle-orm";
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

import { messagingAccounts } from "../../../db";
import type {
  MessagingAccountEditGETResponseOutput,
  MessagingAccountEditPUTResponseOutput,
} from "./definition";

class MessagingAccountEditRepositoryImpl {
  async getAccount(
    urlPathParams: { id: string },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagingAccountEditGETResponseOutput>> {
    try {
      logger.debug("Getting messaging account", {
        accountId: urlPathParams.id,
        userId: user.id,
      });

      const [account] = await db
        .select()
        .from(messagingAccounts)
        .where(eq(messagingAccounts.id, urlPathParams.id))
        .limit(1);

      if (!account) {
        return fail({
          message:
            "app.api.emails.messaging.accounts.edit.id.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { accountId: urlPathParams.id },
        });
      }

      const response: MessagingAccountEditGETResponseOutput = {
        id: account.id,
        name: account.name,
        description: account.description ?? undefined,
        channel: account.channel,
        provider: account.provider,
        fromId: account.fromId ?? null,
        status: account.status,
        priority: account.priority ?? undefined,
        messagesSentTotal: account.messagesSentTotal ?? 0,
        lastUsedAt: account.lastUsedAt ?? null,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      };

      return success(response);
    } catch (error) {
      logger.error("Error getting messaging account", parseError(error));
      return fail({
        message:
          "app.api.emails.messaging.accounts.edit.id.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  async updateAccount(
    data: {
      id: string;
      name?: string;
      description?: string;
      channel?: string;
      provider?: string;
      fromId?: string;
      apiToken?: string;
      apiSecret?: string;
      priority?: number;
      status?: string;
    },
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagingAccountEditPUTResponseOutput>> {
    try {
      logger.info("Updating messaging account", {
        accountId: data.id,
        userId: user.id,
      });

      const [existing] = await db
        .select()
        .from(messagingAccounts)
        .where(eq(messagingAccounts.id, data.id))
        .limit(1);

      if (!existing) {
        return fail({
          message:
            "app.api.emails.messaging.accounts.edit.id.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { accountId: data.id },
        });
      }

      type MessagingAccountUpdate = Partial<
        typeof messagingAccounts.$inferInsert
      >;

      const updateData: MessagingAccountUpdate = {
        updatedAt: new Date(),
        updatedBy: user.isPublic ? undefined : user.id,
      };

      if (data.name !== undefined) {
        updateData.name = data.name;
      }
      if (data.description !== undefined) {
        updateData.description = data.description;
      }
      if (data.channel !== undefined) {
        updateData.channel =
          data.channel as (typeof messagingAccounts.$inferInsert)["channel"];
      }
      if (data.provider !== undefined) {
        updateData.provider =
          data.provider as (typeof messagingAccounts.$inferInsert)["provider"];
      }
      if (data.fromId !== undefined) {
        updateData.fromId = data.fromId;
      }
      if (data.priority !== undefined) {
        updateData.priority = data.priority;
      }
      if (data.status !== undefined) {
        updateData.status =
          data.status as (typeof messagingAccounts.$inferInsert)["status"];
      }
      if (data.apiToken?.trim()) {
        updateData.apiToken = data.apiToken;
      }
      if (data.apiSecret?.trim()) {
        updateData.apiSecret = data.apiSecret;
      }

      const [updated] = await db
        .update(messagingAccounts)
        .set(updateData)
        .where(eq(messagingAccounts.id, data.id))
        .returning();

      if (!updated) {
        return fail({
          message:
            "app.api.emails.messaging.accounts.edit.id.errors.server.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            error:
              "app.api.emails.messaging.accounts.edit.id.errors.server.description",
          },
        });
      }

      const response: MessagingAccountEditPUTResponseOutput = {
        id: updated.id,
        name: updated.name,
        channel: updated.channel,
        provider: updated.provider,
        fromId: updated.fromId ?? undefined,
        status: updated.status,
      };

      logger.info("Messaging account updated", { accountId: updated.id });
      return success(response);
    } catch (error) {
      logger.error("Error updating messaging account", parseError(error));
      const errorMessage = parseError(error).message;

      if (
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate")
      ) {
        return fail({
          message:
            "app.api.emails.messaging.accounts.edit.id.errors.conflict.title",
          errorType: ErrorResponseTypes.CONFLICT,
          messageParams: { error: errorMessage },
        });
      }

      return fail({
        message:
          "app.api.emails.messaging.accounts.edit.id.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: errorMessage },
      });
    }
  }
}

export const messagingAccountEditRepository =
  new MessagingAccountEditRepositoryImpl();
