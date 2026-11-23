/**
 * Users List Repository
 * One CTE enriches every user with money, activity and attribution columns,
 * then filters, sorts and paginates on those columns in SQL.
 */

import "server-only";

import { and, asc, desc, inArray, type SQL, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { userRoles } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { bucketKey, listBuckets } from "next-vibe/unified-ui/analytics/window";
import { utcSql } from "next-vibe/unified-ui/analytics/window-sql";

import { CreditTransactionType } from "@/credits/enum";
import { notSignupCarryoverRaw } from "@/credits/usage-filter";

import { roundMoney } from "../money-sql";
import { FREE_BURN_MIN_CREDITS } from "./constants";
import type {
  UserListRequestOutput,
  UserListResponseOutput,
  UserListRow,
} from "./definition";
import { ListSortOrder, UserListSortField } from "./enum";
import {
  buildEnrichedUsers,
  buildUserFilterConditions,
  type EnrichedUsers,
} from "./filter-sql";
import { scopedTranslation } from "./i18n";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Weeks shown in the signup sparkline of the KPI strip. */
const SPARK_WEEKS = 12;

export class UserListRepository {
  private static buildOrderBy(
    data: UserListRequestOutput,
    e: EnrichedUsers,
  ): SQL[] {
    const ascending = data.sortOrder === ListSortOrder.ASC;
    const direction = (column: SQL | EnrichedUsers["email"]): SQL =>
      ascending
        ? sql`${column} asc nulls last`
        : sql`${column} desc nulls last`;

    let primary: SQL;
    switch (data.sortBy) {
      case UserListSortField.LAST_ACTIVE:
        primary = direction(sql`${e.lastActiveMs}`);
        break;
      case UserListSortField.CREDITS:
        primary = direction(sql`${e.creditBalance}`);
        break;
      case UserListSortField.TOTAL_PAID:
        primary = direction(sql`${e.totalPaidUsd}`);
        break;
      case UserListSortField.CREDITS_SPENT:
        primary = direction(sql`${e.creditsSpent}`);
        break;
      case UserListSortField.EMAIL:
        primary = direction(sql`lower(${e.email})`);
        break;
      case UserListSortField.NAME:
        primary = direction(sql`lower(${e.privateName})`);
        break;
      case UserListSortField.CREATED_AT:
        primary = direction(sql`${e.createdAt}`);
        break;
    }
    // Stable secondary order so pages never shuffle on ties
    return [
      primary,
      ascending ? asc(e.createdAt) : desc(e.createdAt),
      asc(e.id),
    ];
  }

  static async listUsers(
    data: UserListRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<UserListResponseOutput>> {
    try {
      logger.debug("Listing users", { query: data, requestingUser: user.id });

      const limit = data.limit;
      const page = data.page;
      const offset = (page - 1) * limit;

      const enriched = buildEnrichedUsers();
      const conditions = buildUserFilterConditions(data, enriched);
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const nowMs = Date.now();
      const monthAgoMs = nowMs - 30 * DAY_MS;
      // Last SPARK_WEEKS complete ISO weeks plus the running week (kept apart).
      const weekKeys = listBuckets(
        new Date(nowMs - SPARK_WEEKS * 7 * DAY_MS),
        new Date(nowMs + 1),
        "week",
      ).slice(-(SPARK_WEEKS + 1));
      const currentWeekKey =
        weekKeys.at(-1) ?? bucketKey(new Date(nowMs), "week");
      const sparkKeys = weekKeys.slice(0, -1);
      const sparkFrom = new Date(
        `${sparkKeys[0] ?? bucketKey(new Date(nowMs), "week")}T00:00:00.000Z`,
      );

      const matchingIds = db
        .with(enriched)
        .select({ id: enriched.id })
        .from(enriched)
        .where(whereClause);
      const [rows, [summaryRow], weekRows, spent30Rows] = await Promise.all([
        db
          .with(enriched)
          .select()
          .from(enriched)
          .where(whereClause)
          .orderBy(...UserListRepository.buildOrderBy(data, enriched))
          .limit(limit)
          .offset(offset),
        db
          .with(enriched)
          .select({
            totalCount: sql<number>`count(*)::int`,
            payingCount: sql<number>`count(*) filter (where ${enriched.paymentsCount} > 0)::int`,
            verifiedCount: sql<number>`count(*) filter (where ${enriched.emailVerified})::int`,
            activeMonthCount: sql<number>`count(*) filter (where ${enriched.lastActiveMs} >= ${monthAgoMs})::int`,
            bannedCount: sql<number>`count(*) filter (where ${enriched.isBanned})::int`,
            freeBurnCount: sql<number>`count(*) filter (where ${enriched.paymentsCount} = 0 and ${enriched.creditsSpent} >= ${FREE_BURN_MIN_CREDITS} and ${enriched.isHuman})::int`,
            totalPaidUsd: sql<number>`coalesce(sum(${enriched.totalPaidUsd}), 0)::float8`,
            creditBalance: sql<number>`coalesce(sum(${enriched.creditBalance}), 0)::float8`,
            creditsSpent: sql<number>`coalesce(sum(${enriched.creditsSpent}), 0)::float8`,
          })
          .from(enriched)
          .where(whereClause),
        db
          .with(enriched)
          .select({
            bucket: sql<string>`to_char(date_trunc('week', ${enriched.createdAt}), 'YYYY-MM-DD')`,
            value: sql<number>`count(*)::int`,
          })
          .from(enriched)
          .where(
            and(
              ...conditions,
              sql`${enriched.createdAt} >= ${utcSql(sparkFrom)}`,
            ),
          )
          .groupBy(sql`1`),
        db.execute<{ spent: string | number | null }>(sql`
          WITH m AS (${matchingIds})
          SELECT coalesce(sum(-t.amount), 0) AS spent
          FROM credit_transactions t
          JOIN credit_wallets w ON w.id = t.wallet_id
          LEFT JOIN user_lead_links ul ON w.user_id IS NULL AND ul.lead_id = w.lead_id
          JOIN m ON m.id = coalesce(w.user_id, ul.user_id)
          WHERE t.type = ${CreditTransactionType.USAGE}
            AND ${sql.raw(notSignupCarryoverRaw("t"))}
            AND t.created_at >= ${utcSql(new Date(monthAgoMs))}`),
      ]);
      const weekly = new Map<string, number>();
      for (const row of weekRows) {
        weekly.set(row.bucket, Number(row.value));
      }

      const pageIds = rows.map((r) => r.id);
      const roleRows =
        pageIds.length > 0
          ? await db
              .select({ userId: userRoles.userId, role: userRoles.role })
              .from(userRoles)
              .where(inArray(userRoles.userId, pageIds))
          : [];
      const rolesByUser = new Map<string, string[]>();
      for (const row of roleRows) {
        const list = rolesByUser.get(row.userId) ?? [];
        list.push(row.role);
        rolesByUser.set(row.userId, list);
      }

      const totalCount = Number(summaryRow?.totalCount ?? 0);
      const usersOut: UserListRow[] = rows.map((r) => ({
        id: r.id,
        email: r.email,
        privateName: r.privateName,
        publicName: r.publicName,
        roles: rolesByUser.get(r.id) ?? [],
        isActive: r.isActive,
        isBanned: r.isBanned,
        emailVerified: r.emailVerified,
        createdAt: r.createdAt,
        lastActiveAt:
          r.lastActiveMs === null ? null : new Date(Number(r.lastActiveMs)),
        creditBalance: roundMoney(Number(r.creditBalance)),
        creditsSpent: roundMoney(Number(r.creditsSpent)),
        creditsSpent30d: roundMoney(Number(r.creditsSpent30d)),
        totalPaidUsd: roundMoney(Number(r.totalPaidUsd)),
        paymentsCount: Number(r.paymentsCount),
        subscriptionStatus: r.subscriptionStatus,
        plan: r.subscriptionPlan,
        source: r.source,
        firstRefCode: r.firstRefCode,
        referredByEmail: r.referredByEmail,
        referredByUserId: r.referredByUserId,
        referralCode: r.referralCode,
        referralsMade: Number(r.referralsMade),
      }));

      return success({
        users: usersOut,
        summary: {
          totalCount,
          pageCount: Math.ceil(totalCount / limit),
          page,
          limit,
          payingCount: Number(summaryRow?.payingCount ?? 0),
          verifiedCount: Number(summaryRow?.verifiedCount ?? 0),
          activeMonthCount: Number(summaryRow?.activeMonthCount ?? 0),
          bannedCount: Number(summaryRow?.bannedCount ?? 0),
          freeBurnCount: Number(summaryRow?.freeBurnCount ?? 0),
          totalPaidUsd: roundMoney(Number(summaryRow?.totalPaidUsd ?? 0)),
          creditBalance: roundMoney(Number(summaryRow?.creditBalance ?? 0)),
          creditsSpent: roundMoney(Number(summaryRow?.creditsSpent ?? 0)),
          creditsSpent30d: roundMoney(Number(spent30Rows.rows[0]?.spent ?? 0)),
          signupsByWeek: sparkKeys.map((key) => weekly.get(key) ?? 0),
          signupsThisWeek: weekly.get(currentWeekKey) ?? 0,
        },
      });
    } catch (error) {
      logger.error("Error listing users", parseError(error));
      const { t } = scopedTranslation.scopedT(locale);
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
