/**
 * Users List Repository
 * One CTE enriches every user with money, activity and attribution columns,
 * then filters, sorts and paginates on those columns in SQL.
 */

import "server-only";

import {
  aliasedTable,
  and,
  asc,
  desc,
  eq,
  exists,
  ilike,
  inArray,
  isNotNull,
  notExists,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
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
import { userLeadLinks } from "next-vibe/identity/lead/db";
import {
  UserPermissionRole,
  type UserRoleDB,
} from "next-vibe/identity/roles/enum";
import { sessions } from "next-vibe/identity/session/db";
import { userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { creditTransactions, creditWallets } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { growthJourneys } from "@/leads/growth/db";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { leadReferrals, referralCodes, userReferrals } from "@/referral/db";
import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

import { roundMoney, usdAmountSql } from "../money-sql";
import type {
  UserListRequestOutput,
  UserListResponseOutput,
  UserListRow,
} from "./definition";
import {
  AccountStateFilter,
  LastActiveFilter,
  ListSortOrder,
  PayerFilter,
  ReferrerFilter,
  RoleFilter,
  SubscriptionFilter,
  UserListSortField,
} from "./enum";
import { scopedTranslation } from "./i18n";

const DAY_MS = 24 * 60 * 60 * 1000;

/** epoch-ms of a timestamp-without-time-zone column (stored as UTC). */
function epochMs(expr: SQL): SQL {
  return sql`(extract(epoch from ${expr}) * 1000)`;
}

/**
 * The enriched-user CTE. Every money/activity number is computed once here so
 * filters, sort and the summary row all read the same values.
 *
 * Activity = credit usage on the user's own wallet OR on any lead wallet
 * linked to them (free-tier spend lives on lead wallets), or a new login session.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- drizzle CTE type is inferred, spelling it out duplicates 25 column types
function buildEnrichedUsers() {
  const ownUsage = db
    .select({
      ownerId: sql<string>`${creditWallets.userId}`.as("ou_user_id"),
      lastMs: sql<
        number | null
      >`${epochMs(sql`max(${creditTransactions.createdAt})`)}`.as("ou_last_ms"),
      spent:
        sql<number>`coalesce(sum(-${creditTransactions.amount}), 0)::float8`.as(
          "ou_spent",
        ),
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .where(
      and(
        eq(creditTransactions.type, CreditTransactionType.USAGE),
        isNotNull(creditWallets.userId),
      ),
    )
    .groupBy(creditWallets.userId)
    .as("ou");

  const leadUsage = db
    .select({
      ownerId: sql<string>`${userLeadLinks.userId}`.as("lu_user_id"),
      lastMs: sql<
        number | null
      >`${epochMs(sql`max(${creditTransactions.createdAt})`)}`.as("lu_last_ms"),
      spent:
        sql<number>`coalesce(sum(-${creditTransactions.amount}), 0)::float8`.as(
          "lu_spent",
        ),
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .innerJoin(userLeadLinks, eq(userLeadLinks.leadId, creditWallets.leadId))
    .where(eq(creditTransactions.type, CreditTransactionType.USAGE))
    .groupBy(userLeadLinks.userId)
    .as("lu");

  const lastSession = db
    .select({
      ownerId: sql<string>`${sessions.userId}`.as("ls_user_id"),
      lastMs: sql<
        number | null
      >`${epochMs(sql`max(${sessions.createdAt})`)}`.as("ls_last_ms"),
    })
    .from(sessions)
    .groupBy(sessions.userId)
    .as("ls");

  const paid = db
    .select({
      ownerId: sql<string>`${paymentTransactions.userId}`.as("pt_user_id"),
      totalUsd:
        sql<number>`coalesce(sum(${usdAmountSql(paymentTransactions.amount, paymentTransactions.currency)}), 0)::float8`.as(
          "pt_total_usd",
        ),
      count: sql<number>`count(*)::int`.as("pt_count"),
    })
    .from(paymentTransactions)
    .where(eq(paymentTransactions.status, PaymentStatus.SUCCEEDED))
    .groupBy(paymentTransactions.userId)
    .as("pt");

  const latestSub = db
    .selectDistinctOn([subscriptions.userId], {
      ownerId: sql<string>`${subscriptions.userId}`.as("sub_user_id"),
      status: sql<string>`${subscriptions.status}`.as("sub_status"),
    })
    .from(subscriptions)
    .orderBy(subscriptions.userId, desc(subscriptions.createdAt))
    .as("sub");

  const referralsMade = db
    .select({
      ownerId: sql<string>`${userReferrals.referrerUserId}`.as("rm_user_id"),
      count: sql<number>`count(*)::int`.as("rm_count"),
    })
    .from(userReferrals)
    .groupBy(userReferrals.referrerUserId)
    .as("rm");

  const referrer = aliasedTable(users, "referrer");

  return db.$with("enriched").as(
    db
      .select({
        id: users.id,
        email: users.email,
        privateName: users.privateName,
        publicName: users.publicName,
        isActive: users.isActive,
        isBanned: users.isBanned,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        lastActiveMs: sql<
          number | null
        >`greatest(${ownUsage.lastMs}, ${leadUsage.lastMs}, ${lastSession.lastMs})`.as(
          "last_active_ms",
        ),
        creditBalance:
          sql<number>`coalesce(${creditWallets.balance}, 0)::float8`.as(
            "credit_balance",
          ),
        creditsSpent:
          sql<number>`(coalesce(${ownUsage.spent}, 0) + coalesce(${leadUsage.spent}, 0))::float8`.as(
            "credits_spent",
          ),
        totalPaidUsd: sql<number>`coalesce(${paid.totalUsd}, 0)::float8`.as(
          "total_paid_usd",
        ),
        paymentsCount: sql<number>`coalesce(${paid.count}, 0)::int`.as(
          "payments_count",
        ),
        subscriptionStatus: sql<string | null>`${latestSub.status}`.as(
          "subscription_status",
        ),
        source: sql<
          string | null
        >`nullif(concat_ws(' / ', ${growthJourneys.firstChannel}, nullif(${growthJourneys.firstCampaign}, '')), '')`.as(
          "source",
        ),
        sourceSearch:
          sql<string>`concat_ws(' ', ${growthJourneys.firstChannel}, ${growthJourneys.firstSource}, ${growthJourneys.firstMedium}, ${growthJourneys.firstCampaign}, ${growthJourneys.firstRefCode}, ${growthJourneys.firstReferrerHost}, ${growthJourneys.lastChannel}, ${referralCodes.code})`.as(
            "source_search",
          ),
        referredByUserId: sql<
          string | null
        >`${userReferrals.referrerUserId}`.as("referred_by_user_id"),
        referredByEmail: sql<string | null>`${referrer.email}`.as(
          "referred_by_email",
        ),
        referralCode: sql<string | null>`${referralCodes.code}`.as(
          "referral_code",
        ),
        referralsMade: sql<number>`coalesce(${referralsMade.count}, 0)::int`.as(
          "referrals_made",
        ),
      })
      .from(users)
      .leftJoin(creditWallets, eq(creditWallets.userId, users.id))
      .leftJoin(ownUsage, eq(ownUsage.ownerId, users.id))
      .leftJoin(leadUsage, eq(leadUsage.ownerId, users.id))
      .leftJoin(lastSession, eq(lastSession.ownerId, users.id))
      .leftJoin(paid, eq(paid.ownerId, users.id))
      .leftJoin(latestSub, eq(latestSub.ownerId, users.id))
      .leftJoin(referralsMade, eq(referralsMade.ownerId, users.id))
      .leftJoin(growthJourneys, eq(growthJourneys.userId, users.id))
      .leftJoin(userReferrals, eq(userReferrals.referredUserId, users.id))
      .leftJoin(referrer, eq(referrer.id, userReferrals.referrerUserId))
      .leftJoin(
        referralCodes,
        eq(referralCodes.id, userReferrals.referralCodeId),
      ),
  );
}

type EnrichedUsers = ReturnType<typeof buildEnrichedUsers>;

const ACTIVE_SUB_STATUSES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

export class UserListRepository {
  private static roleFilterToDbRole(
    role: (typeof RoleFilter)[keyof typeof RoleFilter],
  ): (typeof UserRoleDB)[number] {
    switch (role) {
      case RoleFilter.PUBLIC:
        return UserPermissionRole.PUBLIC;
      case RoleFilter.CUSTOMER:
        return UserPermissionRole.CUSTOMER;
      case RoleFilter.PARTNER_ADMIN:
        return UserPermissionRole.PARTNER_ADMIN;
      case RoleFilter.PARTNER_EMPLOYEE:
        return UserPermissionRole.PARTNER_EMPLOYEE;
      case RoleFilter.ADMIN:
        return UserPermissionRole.ADMIN;
    }
  }

  private static buildConditions(
    data: UserListRequestOutput,
    e: EnrichedUsers,
  ): SQL[] {
    const conditions: SQL[] = [];
    const now = Date.now();

    // Search: email, names, id prefix, referral code
    const search = data.search?.trim();
    if (search) {
      const pattern = `%${search}%`;
      const searchCondition = or(
        ilike(e.email, pattern),
        ilike(e.privateName, pattern),
        ilike(e.publicName, pattern),
        sql`${e.id}::text ilike ${`${search.toLowerCase()}%`}`,
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // Roles: user holds ANY selected role
    const roles = data.roles ?? [];
    if (roles.length > 0) {
      const dbRoles: (typeof UserRoleDB)[number][] = [];
      for (const role of roles) {
        dbRoles.push(UserListRepository.roleFilterToDbRole(role));
      }
      if (dbRoles.length > 0) {
        conditions.push(
          exists(
            db
              .select({ one: sql`1` })
              .from(userRoles)
              .where(
                and(
                  eq(userRoles.userId, e.id),
                  inArray(userRoles.role, dbRoles),
                ),
              ),
          ),
        );
      }
    }

    // Account state: ANY selected
    const stateConditions: SQL[] = [];
    for (const state of data.accountState ?? []) {
      switch (state) {
        case AccountStateFilter.ACTIVE:
          stateConditions.push(
            sql`(${e.isActive} = true and ${e.isBanned} = false)`,
          );
          break;
        case AccountStateFilter.INACTIVE:
          stateConditions.push(sql`${e.isActive} = false`);
          break;
        case AccountStateFilter.BANNED:
          stateConditions.push(sql`${e.isBanned} = true`);
          break;
        case AccountStateFilter.VERIFIED:
          stateConditions.push(sql`${e.emailVerified} = true`);
          break;
        case AccountStateFilter.UNVERIFIED:
          stateConditions.push(sql`${e.emailVerified} = false`);
          break;
      }
    }
    const stateCondition = or(...stateConditions);
    if (stateCondition) {
      conditions.push(stateCondition);
    }

    // Paid vs free
    if (data.payer === PayerFilter.PAID) {
      conditions.push(sql`${e.paymentsCount} > 0`);
    } else if (data.payer === PayerFilter.FREE) {
      conditions.push(sql`${e.paymentsCount} = 0`);
    }

    // Subscription presence
    const anySubscription = db
      .select({ one: sql`1` })
      .from(subscriptions)
      .where(eq(subscriptions.userId, e.id));
    switch (data.subscription) {
      case SubscriptionFilter.HAS_ACTIVE:
        conditions.push(
          exists(
            db
              .select({ one: sql`1` })
              .from(subscriptions)
              .where(
                and(
                  eq(subscriptions.userId, e.id),
                  inArray(subscriptions.status, ACTIVE_SUB_STATUSES),
                ),
              ),
          ),
        );
        break;
      case SubscriptionFilter.HAD_ANY:
        conditions.push(exists(anySubscription));
        break;
      case SubscriptionFilter.NEVER:
        conditions.push(notExists(anySubscription));
        break;
      case SubscriptionFilter.ANY:
      case undefined:
        break;
    }

    // Last active window
    switch (data.lastActive) {
      case LastActiveFilter.DAY:
        conditions.push(sql`${e.lastActiveMs} >= ${now - DAY_MS}`);
        break;
      case LastActiveFilter.WEEK:
        conditions.push(sql`${e.lastActiveMs} >= ${now - 7 * DAY_MS}`);
        break;
      case LastActiveFilter.MONTH:
        conditions.push(sql`${e.lastActiveMs} >= ${now - 30 * DAY_MS}`);
        break;
      case LastActiveFilter.DORMANT:
        conditions.push(sql`${e.lastActiveMs} < ${now - 30 * DAY_MS}`);
        break;
      case LastActiveFilter.NEVER:
        conditions.push(sql`${e.lastActiveMs} is null`);
        break;
      case LastActiveFilter.ANY:
      case undefined:
        break;
    }

    // Signup window (to is inclusive of the whole day)
    if (data.signupFrom) {
      const from = new Date(data.signupFrom);
      from.setUTCHours(0, 0, 0, 0);
      conditions.push(sql`${e.createdAt} >= ${from}`);
    }
    if (data.signupTo) {
      const to = new Date(data.signupTo);
      to.setUTCHours(23, 59, 59, 999);
      conditions.push(sql`${e.createdAt} <= ${to}`);
    }

    // Credit balance range
    if (data.creditsMin !== undefined) {
      conditions.push(sql`${e.creditBalance} >= ${data.creditsMin}`);
    }
    if (data.creditsMax !== undefined) {
      conditions.push(sql`${e.creditBalance} <= ${data.creditsMax}`);
    }

    // Attribution: channel / utm / referrer host / referral code
    const source = data.source?.trim();
    if (source) {
      conditions.push(ilike(e.sourceSearch, `%${source}%`));
    }

    // Referral activity (as a referrer)
    switch (data.referralActivity) {
      case ReferrerFilter.HAS_CODE:
        conditions.push(
          exists(
            db
              .select({ one: sql`1` })
              .from(referralCodes)
              .where(eq(referralCodes.ownerUserId, e.id)),
          ),
        );
        break;
      case ReferrerFilter.HAS_CLICKS:
        conditions.push(
          exists(
            db
              .select({ one: sql`1` })
              .from(referralCodes)
              .innerJoin(
                leadReferrals,
                eq(leadReferrals.referralCodeId, referralCodes.id),
              )
              .where(eq(referralCodes.ownerUserId, e.id)),
          ),
        );
        break;
      case ReferrerFilter.HAS_SIGNUPS:
        conditions.push(sql`${e.referralsMade} > 0`);
        break;
      case ReferrerFilter.HAS_SUBSCRIBERS:
        conditions.push(
          exists(
            db
              .select({ one: sql`1` })
              .from(userReferrals)
              .innerJoin(
                subscriptions,
                eq(subscriptions.userId, userReferrals.referredUserId),
              )
              .where(
                and(
                  eq(userReferrals.referrerUserId, e.id),
                  inArray(subscriptions.status, ACTIVE_SUB_STATUSES),
                ),
              ),
          ),
        );
        break;
      case ReferrerFilter.ANY:
      case undefined:
        break;
    }

    return conditions;
  }

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
      const conditions = UserListRepository.buildConditions(data, enriched);
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const [rows, [summaryRow]] = await Promise.all([
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
            totalPaidUsd: sql<number>`coalesce(sum(${enriched.totalPaidUsd}), 0)::float8`,
            creditBalance: sql<number>`coalesce(sum(${enriched.creditBalance}), 0)::float8`,
          })
          .from(enriched)
          .where(whereClause),
      ]);

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
        totalPaidUsd: roundMoney(Number(r.totalPaidUsd)),
        paymentsCount: Number(r.paymentsCount),
        subscriptionStatus: r.subscriptionStatus,
        source: r.source,
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
          totalPaidUsd: roundMoney(Number(summaryRow?.totalPaidUsd ?? 0)),
          creditBalance: roundMoney(Number(summaryRow?.creditBalance ?? 0)),
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
