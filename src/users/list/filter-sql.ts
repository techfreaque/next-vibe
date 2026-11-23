/**
 * Users filter SQL.
 * The enriched-user CTE plus the filter predicates shared by users-list and
 * the signups report (users-stats). Both endpoints read the same columns, so a
 * report number and the list it drills into always agree.
 */

import "server-only";

import {
  aliasedTable,
  and,
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
import { db } from "next-vibe/database";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import {
  UserPermissionRole,
  type UserRoleDB,
} from "next-vibe/identity/roles/enum";
import { sessions } from "next-vibe/identity/session/db";
import { userRoles, users } from "next-vibe/identity/user/db";
import { utcSql } from "next-vibe/unified-ui/analytics/window-sql";

import { creditTransactions, creditWallets } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import {
  notSignupCarryover,
  notSignupCarryoverRaw,
} from "@/credits/usage-filter";
import { growthJourneys } from "@/leads/growth/db";
import { ChannelType } from "@/leads/growth/enum";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { leadReferrals, referralCodes, userReferrals } from "@/referral/db";
import { subscriptions } from "@/subscription/db";
import { SubscriptionPlan, SubscriptionStatus } from "@/subscription/enum";

import { humanUserSql } from "../audience-sql";
import { usdAmountSql } from "../money-sql";
import { USERS_CHANNEL_NONE } from "./constants";
import type { UserListRequestOutput } from "./definition";
import {
  AccountStateFilter,
  LastActiveFilter,
  PayerFilter,
  ReferrerFilter,
  RoleFilter,
  SubscriptionFilter,
  UserChannelTypeFilter,
  UserPlanFilter,
  UsersAudience,
} from "./enum";

const DAY_MS = 24 * 60 * 60 * 1000;

export const ACTIVE_SUB_STATUSES = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

/** Filter keys every consumer of the enriched CTE understands. */
export type UserFilterInput = Partial<
  Pick<
    UserListRequestOutput,
    | "search"
    | "audience"
    | "channel"
    | "channelType"
    | "refCode"
    | "plan"
    | "roles"
    | "accountState"
    | "requiredState"
    | "accountLocale"
    | "attributedRefCode"
    | "payer"
    | "subscription"
    | "lastActive"
    | "signupFrom"
    | "signupTo"
    | "activeFrom"
    | "activeTo"
    | "paidFrom"
    | "paidTo"
    | "spentMin"
    | "hasSpentCredits"
    | "creditsMin"
    | "creditsMax"
    | "source"
    | "referralActivity"
  >
>;

/** epoch-ms of a timestamp-without-time-zone column (stored as UTC). */
function epochMs(expr: SQL): SQL {
  return sql`(extract(epoch from ${expr}) * 1000)`;
}

/**
 * The enriched-user CTE. Every money/activity number is computed once here so
 * filters, sort and the summary row all read the same values.
 *
 * Activity = credit usage on the user's own wallet OR on any lead wallet
 * linked to them (free-tier spend lives on lead wallets), a new login
 * session, or a succeeded payment.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- drizzle CTE type is inferred, spelling it out duplicates 30 column types
export function buildEnrichedUsers() {
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
      spent30:
        sql<number>`coalesce(sum(-${creditTransactions.amount}) filter (where ${creditTransactions.createdAt} >= (now() at time zone 'UTC') - interval '30 days'), 0)::float8`.as(
          "ou_spent30",
        ),
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .where(
      and(
        eq(creditTransactions.type, CreditTransactionType.USAGE),
        notSignupCarryover,
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
      spent30:
        sql<number>`coalesce(sum(-${creditTransactions.amount}) filter (where ${creditTransactions.createdAt} >= (now() at time zone 'UTC') - interval '30 days'), 0)::float8`.as(
          "lu_spent30",
        ),
    })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditWallets.id, creditTransactions.walletId))
    .innerJoin(userLeadLinks, eq(userLeadLinks.leadId, creditWallets.leadId))
    // Signup-carryover rows are bookkeeping (they mirror guest spend that is
    // already a usage row elsewhere), never this account's spend.
    .where(
      and(
        eq(creditTransactions.type, CreditTransactionType.USAGE),
        notSignupCarryover,
      ),
    )
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
      lastMs: sql<
        number | null
      >`${epochMs(sql`max(${paymentTransactions.createdAt})`)}`.as(
        "pt_last_ms",
      ),
    })
    .from(paymentTransactions)
    .where(eq(paymentTransactions.status, PaymentStatus.SUCCEEDED))
    .groupBy(paymentTransactions.userId)
    .as("pt");

  const latestSub = db
    .selectDistinctOn([subscriptions.userId], {
      ownerId: sql<string>`${subscriptions.userId}`.as("sub_user_id"),
      status: sql<string>`${subscriptions.status}`.as("sub_status"),
      planId: sql<string>`${subscriptions.planId}`.as("sub_plan_id"),
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
        locale: users.locale,
        isActive: users.isActive,
        isBanned: users.isBanned,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        isHuman: sql<boolean>`${humanUserSql(users.id, users.email)}`.as(
          "is_human",
        ),
        lastActiveMs: sql<
          number | null
        >`greatest(${ownUsage.lastMs}, ${leadUsage.lastMs}, ${lastSession.lastMs}, ${paid.lastMs})`.as(
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
        creditsSpent30d:
          sql<number>`(coalesce(${ownUsage.spent30}, 0) + coalesce(${leadUsage.spent30}, 0))::float8`.as(
            "credits_spent_30d",
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
        subscriptionPlan: sql<string | null>`${latestSub.planId}`.as(
          "subscription_plan",
        ),
        channel: sql<string | null>`${growthJourneys.firstChannel}`.as(
          "first_channel",
        ),
        channelType: sql<string | null>`${growthJourneys.firstChannelType}`.as(
          "first_channel_type",
        ),
        firstRefCode: sql<string | null>`${growthJourneys.firstRefCode}`.as(
          "first_ref_code",
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

export type EnrichedUsers = ReturnType<typeof buildEnrichedUsers>;

function roleFilterToDbRole(
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

function channelTypeToDb(
  value: (typeof UserChannelTypeFilter)[keyof typeof UserChannelTypeFilter],
): string {
  switch (value) {
    case UserChannelTypeFilter.CAMPAIGN:
      return ChannelType.CAMPAIGN;
    case UserChannelTypeFilter.REFERRAL:
      return ChannelType.REFERRAL;
    case UserChannelTypeFilter.ORGANIC:
      return ChannelType.ORGANIC;
    case UserChannelTypeFilter.DIRECT:
      return ChannelType.DIRECT;
  }
}

function planToDb(
  value: (typeof UserPlanFilter)[keyof typeof UserPlanFilter],
): (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan] {
  switch (value) {
    case UserPlanFilter.SUBSCRIPTION:
      return SubscriptionPlan.SUBSCRIPTION;
    case UserPlanFilter.PLUS:
      return SubscriptionPlan.PLUS;
    case UserPlanFilter.PRO:
      return SubscriptionPlan.PRO;
    case UserPlanFilter.ULTRA:
      return SubscriptionPlan.ULTRA;
  }
}

/** UTC midnight of the given day. */
function dayStart(value: Date): Date {
  const d = new Date(value);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Last millisecond of the given UTC day. */
function dayEnd(value: Date): Date {
  const d = new Date(value);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

/**
 * Credit usage by the user (own wallet or a linked lead wallet) inside
 * [from, to]. Either bound may be open.
 */
export function usageInWindowSql(
  userId: SQL | EnrichedUsers["id"],
  from: Date | undefined,
  to: Date | undefined,
): SQL {
  const bounds: SQL[] = [];
  if (from) {
    bounds.push(sql`t.created_at >= ${utcSql(from)}`);
  }
  if (to) {
    bounds.push(sql`t.created_at <= ${utcSql(to)}`);
  }
  const timeBounds =
    bounds.length > 0 ? sql` AND ${sql.join(bounds, sql` AND `)}` : sql``;
  // Uncorrelated: the active-owner set is computed once, then probed.
  return sql`${userId} IN (
    SELECT coalesce(w.user_id, ul.user_id)
    FROM credit_transactions t
    JOIN credit_wallets w ON w.id = t.wallet_id
    LEFT JOIN user_lead_links ul ON w.user_id IS NULL AND ul.lead_id = w.lead_id
    WHERE t.type = ${CreditTransactionType.USAGE}
      AND ${sql.raw(notSignupCarryoverRaw("t"))}
      AND coalesce(w.user_id, ul.user_id) IS NOT NULL${timeBounds}
  )`;
}

/** All filter predicates for the enriched CTE (AND-combined by the caller). */
export function buildUserFilterConditions(
  data: UserFilterInput,
  e: EnrichedUsers,
): SQL[] {
  const conditions: SQL[] = [];
  const now = Date.now();

  // Search treats punctuation in email addresses and names literally.
  const search = data.search?.trim();
  if (search) {
    const literal = search.replaceAll(/[\\%_]/g, (char) => `\\${char}`);
    const pattern = `%${literal}%`;
    const searchCondition = or(
      ilike(e.email, pattern),
      ilike(e.privateName, pattern),
      ilike(e.publicName, pattern),
      sql`${e.id}::text ilike ${`${literal}%`}`,
    );
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  if (data.audience === UsersAudience.HUMANS) {
    conditions.push(sql`${e.isHuman} = true`);
  }

  // First-touch channel (exact, case-insensitive). "none" = no journey.
  const channel = data.channel?.trim();
  if (channel) {
    conditions.push(
      channel.toLowerCase() === USERS_CHANNEL_NONE
        ? sql`${e.channel} is null`
        : sql`lower(${e.channel}) = ${channel.toLowerCase()}`,
    );
  }
  if (data.channelType) {
    conditions.push(
      sql`${e.channelType} = ${channelTypeToDb(data.channelType)}`,
    );
  }

  // Ref code: first-touch code OR the code credited in user_referrals.
  const refCode = data.refCode?.trim().toLowerCase();
  if (refCode) {
    conditions.push(
      sql`(lower(${e.firstRefCode}) = ${refCode} OR lower(${e.referralCode}) = ${refCode})`,
    );
  }

  if (data.attributedRefCode) {
    conditions.push(
      sql`lower(coalesce(${e.referralCode}, ${e.firstRefCode})) = ${data.attributedRefCode.toLowerCase()}`,
    );
  }
  if (data.accountLocale) {
    conditions.push(
      sql`lower(${e.locale}) = ${data.accountLocale.toLowerCase()}`,
    );
  }

  if (data.plan) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(subscriptions)
          .where(
            and(
              eq(subscriptions.userId, e.id),
              eq(subscriptions.planId, planToDb(data.plan)),
              inArray(subscriptions.status, ACTIVE_SUB_STATUSES),
            ),
          ),
      ),
    );
  }

  // Roles: user holds ANY selected role
  const roles = data.roles ?? [];
  if (roles.length > 0) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(userRoles)
          .where(
            and(
              eq(userRoles.userId, e.id),
              inArray(userRoles.role, roles.map(roleFilterToDbRole)),
            ),
          ),
      ),
    );
  }

  // Match any selected state and the additional state from a report drill.
  const statePredicates = {
    [AccountStateFilter.ACTIVE]: sql`(${e.isActive} = true and ${e.isBanned} = false)`,
    [AccountStateFilter.INACTIVE]: sql`${e.isActive} = false`,
    [AccountStateFilter.BANNED]: sql`${e.isBanned} = true`,
    [AccountStateFilter.VERIFIED]: sql`${e.emailVerified} = true`,
    [AccountStateFilter.UNVERIFIED]: sql`${e.emailVerified} = false`,
  };
  const stateCondition = or(
    ...(data.accountState ?? []).map((state) => statePredicates[state]),
  );
  if (stateCondition) {
    conditions.push(stateCondition);
  }
  if (data.requiredState) {
    conditions.push(statePredicates[data.requiredState]);
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

  // Signup window (both days inclusive)
  if (data.hasSpentCredits) {
    conditions.push(usageInWindowSql(e.id, undefined, undefined));
  }

  if (data.signupFrom) {
    conditions.push(
      sql`${e.createdAt} >= ${utcSql(dayStart(data.signupFrom))}`,
    );
  }
  if (data.signupTo) {
    conditions.push(sql`${e.createdAt} <= ${utcSql(dayEnd(data.signupTo))}`);
  }

  // Credit usage inside a window (both days inclusive)
  if (data.activeFrom || data.activeTo) {
    conditions.push(
      usageInWindowSql(
        e.id,
        data.activeFrom ? dayStart(data.activeFrom) : undefined,
        data.activeTo ? dayEnd(data.activeTo) : undefined,
      ),
    );
  }

  // Succeeded payment inside a window (both days inclusive)
  if (data.paidFrom || data.paidTo) {
    const bounds: SQL[] = [
      eq(paymentTransactions.userId, e.id),
      eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
    ];
    if (data.paidFrom) {
      bounds.push(
        sql`${paymentTransactions.createdAt} >= ${utcSql(dayStart(data.paidFrom))}`,
      );
    }
    if (data.paidTo) {
      bounds.push(
        sql`${paymentTransactions.createdAt} <= ${utcSql(dayEnd(data.paidTo))}`,
      );
    }
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(paymentTransactions)
          .where(and(...bounds)),
      ),
    );
  }

  if (data.spentMin !== undefined) {
    conditions.push(sql`${e.creditsSpent} >= ${data.spentMin}`);
  }

  // Credit balance range
  if (data.creditsMin !== undefined) {
    conditions.push(sql`${e.creditBalance} >= ${data.creditsMin}`);
  }
  if (data.creditsMax !== undefined) {
    conditions.push(sql`${e.creditBalance} <= ${data.creditsMax}`);
  }

  // Attribution free text: channel / utm / referrer host / referral code
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
