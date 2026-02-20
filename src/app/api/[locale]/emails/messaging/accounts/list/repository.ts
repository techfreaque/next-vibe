/**
 * Messaging Accounts List Repository
 */

import "server-only";

import { and, desc, eq, ilike, sql } from "drizzle-orm";
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
import { MessageChannelFilter } from "../../enum";
import type {
  MessagingAccountsListGETRequestOutput,
  MessagingAccountsListGETResponseOutput,
} from "./definition";

export class MessagingAccountsListRepository {
  static async listAccounts(
    data: MessagingAccountsListGETRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<MessagingAccountsListGETResponseOutput>> {
    try {
      logger.info("Getting messaging accounts", { data, userId: user.id });

      const whereConditions = [];

      // Channel filter
      if (data.channel && data.channel !== MessageChannelFilter.ANY) {
        whereConditions.push(eq(messagingAccounts.channel, data.channel));
      }

      // Search filter
      if (data.search) {
        whereConditions.push(ilike(messagingAccounts.name, `%${data.search}%`));
      }

      const page = data.page || 1;
      const limit = data.limit || 20;
      const offset = (page - 1) * limit;

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const totalResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(messagingAccounts)
        .where(whereClause);

      const total = totalResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / limit) || 1;

      const accounts = await db
        .select()
        .from(messagingAccounts)
        .where(whereClause)
        .orderBy(desc(messagingAccounts.createdAt))
        .limit(limit)
        .offset(offset);

      return success({
        accounts: accounts.map((a) => ({
          id: a.id,
          name: a.name,
          channel: a.channel,
          provider: a.provider,
          fromId: a.fromId ?? null,
          status: a.status,
          messagesSentTotal: a.messagesSentTotal ?? 0,
          lastUsedAt: a.lastUsedAt ?? null,
          createdAt: a.createdAt,
        })),
        pagination: { page, limit, total, totalPages },
      });
    } catch (error) {
      logger.error("Error getting messaging accounts", parseError(error));
      return fail({
        message: "app.api.emails.messaging.accounts.list.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
