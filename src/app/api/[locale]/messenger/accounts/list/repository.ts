/**
 * Unified Messenger Accounts List Repository
 */

import "server-only";

import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
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

import { messengerAccounts } from "../db";
import {
  MessengerAccountSortField,
  MessengerAccountStatusFilter,
  MessengerChannelFilter,
  MessengerProviderFilter,
  MessengerSortOrder,
} from "../enum";
import type {
  MessengerAccountsListGETRequestOutput,
  MessengerAccountsListGETResponseOutput,
} from "./definition";
import type { MessengerAccountsListT } from "./i18n";

export class MessengerAccountsListRepository {
  static async listAccounts(
    data: MessengerAccountsListGETRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
    t: MessengerAccountsListT,
  ): Promise<ResponseType<MessengerAccountsListGETResponseOutput>> {
    try {
      logger.info("Getting messenger accounts", { data, userId: user.id });

      const whereConditions = [];

      // Channel filter
      if (data.channel && data.channel !== MessengerChannelFilter.ANY) {
        whereConditions.push(eq(messengerAccounts.channel, data.channel));
      }

      // Provider filter
      if (data.provider && data.provider !== MessengerProviderFilter.ANY) {
        whereConditions.push(eq(messengerAccounts.provider, data.provider));
      }

      // Status filter
      if (data.status && data.status !== MessengerAccountStatusFilter.ANY) {
        whereConditions.push(eq(messengerAccounts.status, data.status));
      }

      // Search filter
      if (data.search) {
        whereConditions.push(
          or(
            ilike(messengerAccounts.name, `%${data.search}%`),
            ilike(messengerAccounts.description, `%${data.search}%`),
            ilike(messengerAccounts.smtpFromEmail, `%${data.search}%`),
            ilike(messengerAccounts.fromId, `%${data.search}%`),
          ),
        );
      }

      const sortBy = data.sortBy ?? MessengerAccountSortField.CREATED_AT;
      const sortOrder = data.sortOrder ?? MessengerSortOrder.DESC;

      let sortColumn;
      if (sortBy === MessengerAccountSortField.NAME) {
        sortColumn = messengerAccounts.name;
      } else if (sortBy === MessengerAccountSortField.CHANNEL) {
        sortColumn = messengerAccounts.channel;
      } else if (sortBy === MessengerAccountSortField.PROVIDER) {
        sortColumn = messengerAccounts.provider;
      } else if (sortBy === MessengerAccountSortField.STATUS) {
        sortColumn = messengerAccounts.status;
      } else if (sortBy === MessengerAccountSortField.PRIORITY) {
        sortColumn = messengerAccounts.priority;
      } else if (sortBy === MessengerAccountSortField.MESSAGES_SENT_TOTAL) {
        sortColumn = messengerAccounts.messagesSentTotal;
      } else if (sortBy === MessengerAccountSortField.LAST_USED_AT) {
        sortColumn = messengerAccounts.lastUsedAt;
      } else {
        sortColumn = messengerAccounts.createdAt;
      }

      const orderBy =
        sortOrder === MessengerSortOrder.ASC
          ? asc(sortColumn)
          : desc(sortColumn);

      const page = data.page ?? 1;
      const limit = data.limit ?? 20;
      const offset = (page - 1) * limit;

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const [totalResult, accounts] = await Promise.all([
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(messengerAccounts)
          .where(whereClause),
        db
          .select({
            id: messengerAccounts.id,
            name: messengerAccounts.name,
            channel: messengerAccounts.channel,
            provider: messengerAccounts.provider,
            status: messengerAccounts.status,
            healthStatus: messengerAccounts.healthStatus,
            isDefault: messengerAccounts.isDefault,
            priority: messengerAccounts.priority,
            smtpFromEmail: messengerAccounts.smtpFromEmail,
            fromId: messengerAccounts.fromId,
            messagesSentTotal: messengerAccounts.messagesSentTotal,
            lastUsedAt: messengerAccounts.lastUsedAt,
            createdAt: messengerAccounts.createdAt,
          })
          .from(messengerAccounts)
          .where(whereClause)
          .orderBy(orderBy)
          .limit(limit)
          .offset(offset),
      ]);

      const total = totalResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / limit);

      logger.info("Messenger accounts retrieved", {
        count: accounts.length,
        total,
        page,
      });

      return success({
        accounts: accounts.map((a) => ({
          id: a.id,
          name: a.name,
          channel: a.channel,
          provider: a.provider,
          status: a.status,
          healthStatus: a.healthStatus ?? null,
          isDefault: a.isDefault ?? false,
          priority: a.priority ?? 0,
          smtpFromEmail: a.smtpFromEmail ?? null,
          fromId: a.fromId ?? null,
          messagesSentTotal: a.messagesSentTotal ?? 0,
          lastUsedAt: a.lastUsedAt ?? null,
          createdAt: a.createdAt,
        })),
        pagination: { page, limit, total, totalPages },
      });
    } catch (error) {
      logger.error("Error getting messenger accounts", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
