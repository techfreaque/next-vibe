/**
 * Users List Repository Implementation
 * Business logic for listing and filtering users
 */

import "server-only";

import {
  and,
  count,
  desc,
  eq,
  exists,
  ilike,
  notExists,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import {
  creditPacks,
  creditTransactions,
  creditWallets,
} from "@/app/api/[locale]/credits/db";
import {
  CreditActivityFilter,
  ReferralActivityFilter,
  SortOrder,
  SubscriptionPresenceFilter,
  ThreadsFilter,
  UserSortField,
  UserStatusFilter,
} from "@/app/api/[locale]/users/enum";
import {
  referralCodes,
  leadReferrals,
  userReferrals,
} from "@/app/api/[locale]/referral/db";
import { subscriptions } from "@/app/api/[locale]/subscription/db";
import type { SubscriptionStatusDB } from "@/app/api/[locale]/subscription/enum";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { users } from "@/app/api/[locale]/user/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type { UserListRequestOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class UserListRepository {
  /**
   * Convert status filter to database conditions
   */
  private static convertStatusFilter(status: string | undefined): SQL | null {
    if (!status || status === UserStatusFilter.ALL) {
      return null;
    }

    switch (status) {
      case UserStatusFilter.ACTIVE:
        return eq(users.isActive, true);
      case UserStatusFilter.INACTIVE:
        return eq(users.isActive, false);
      case UserStatusFilter.EMAIL_VERIFIED:
        return eq(users.emailVerified, true);
      case UserStatusFilter.EMAIL_UNVERIFIED:
        return eq(users.emailVerified, false);
      default:
        return null;
    }
  }

  /**
   * Convert role filter to database conditions
   * Note: Role filtering is disabled due to complex enum type mapping
   */
  private static convertRoleFilter(): SQL | null {
    // Role filtering disabled for now due to enum type complexity
    // TODO: Implement proper role filtering with correct type mapping
    return null;
  }

  /**
   * Subscription presence filter - uses EXISTS on subscriptions table
   */
  private static convertSubscriptionFilter(
    filter: string | undefined,
  ): SQL | null {
    if (!filter || filter === SubscriptionPresenceFilter.ANY) {
      return null;
    }

    const activeStatuses = [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.TRIALING,
    ] as (typeof SubscriptionStatusDB)[number][];

    switch (filter) {
      case SubscriptionPresenceFilter.HAS_ACTIVE:
        return exists(
          db
            .select({ one: sql`1` })
            .from(subscriptions)
            .where(
              and(
                eq(subscriptions.userId, users.id),
                sql`${subscriptions.status} = ANY(ARRAY[${sql.join(
                  activeStatuses.map((s) => sql`${s}`),
                  sql`, `,
                )}])`,
              ),
            ),
        );
      case SubscriptionPresenceFilter.HAD_ANY:
        return exists(
          db
            .select({ one: sql`1` })
            .from(subscriptions)
            .where(eq(subscriptions.userId, users.id)),
        );
      case SubscriptionPresenceFilter.NEVER:
        return notExists(
          db
            .select({ one: sql`1` })
            .from(subscriptions)
            .where(eq(subscriptions.userId, users.id)),
        );
      default:
        return null;
    }
  }

  /**
   * Credit activity filter - purchased packs or spent credits
   */
  private static convertCreditActivityFilter(
    filter: string | undefined,
  ): SQL | null {
    if (!filter || filter === CreditActivityFilter.ANY) {
      return null;
    }

    switch (filter) {
      case CreditActivityFilter.BOUGHT_PACK:
        // Has at least one credit pack of type PERMANENT (purchased, not subscription/bonus)
        return exists(
          db
            .select({ one: sql`1` })
            .from(creditWallets)
            .innerJoin(creditPacks, eq(creditPacks.walletId, creditWallets.id))
            .where(
              and(
                eq(creditWallets.userId, users.id),
                sql`${creditPacks.source} LIKE '%purchase%'`,
              ),
            ),
        );
      case CreditActivityFilter.SPENT_CREDITS:
        // Has at least one USAGE transaction
        return exists(
          db
            .select({ one: sql`1` })
            .from(creditWallets)
            .innerJoin(
              creditTransactions,
              eq(creditTransactions.walletId, creditWallets.id),
            )
            .where(
              and(
                eq(creditWallets.userId, users.id),
                sql`${creditTransactions.amount} < 0`,
              ),
            ),
        );
      case CreditActivityFilter.NEVER_SPENT:
        return notExists(
          db
            .select({ one: sql`1` })
            .from(creditWallets)
            .innerJoin(
              creditTransactions,
              eq(creditTransactions.walletId, creditWallets.id),
            )
            .where(
              and(
                eq(creditWallets.userId, users.id),
                sql`${creditTransactions.amount} < 0`,
              ),
            ),
        );
      default:
        return null;
    }
  }

  /**
   * Threads filter - has/no chat threads
   */
  private static convertThreadsFilter(filter: string | undefined): SQL | null {
    if (!filter || filter === ThreadsFilter.ANY) {
      return null;
    }

    switch (filter) {
      case ThreadsFilter.HAS_THREADS:
        return exists(
          db
            .select({ one: sql`1` })
            .from(chatThreads)
            .where(eq(chatThreads.userId, users.id)),
        );
      case ThreadsFilter.NO_THREADS:
        return notExists(
          db
            .select({ one: sql`1` })
            .from(chatThreads)
            .where(eq(chatThreads.userId, users.id)),
        );
      default:
        return null;
    }
  }

  /**
   * Referral activity filter - code, clicks, signups, paying subscribers
   */
  private static convertReferralActivityFilter(
    filter: string | undefined,
  ): SQL | null {
    if (!filter || filter === ReferralActivityFilter.ANY) {
      return null;
    }

    switch (filter) {
      case ReferralActivityFilter.HAS_CODE:
        // Has at least one referral code
        return exists(
          db
            .select({ one: sql`1` })
            .from(referralCodes)
            .where(eq(referralCodes.ownerUserId, users.id)),
        );
      case ReferralActivityFilter.HAS_CLICKS:
        // Has a referral code that has been clicked (leadReferrals exist for their code)
        return exists(
          db
            .select({ one: sql`1` })
            .from(referralCodes)
            .innerJoin(
              leadReferrals,
              eq(leadReferrals.referralCodeId, referralCodes.id),
            )
            .where(eq(referralCodes.ownerUserId, users.id)),
        );
      case ReferralActivityFilter.HAS_SIGNUPS:
        // Has at least one user who signed up via their referral
        return exists(
          db
            .select({ one: sql`1` })
            .from(userReferrals)
            .where(eq(userReferrals.referrerUserId, users.id)),
        );
      case ReferralActivityFilter.HAS_SUBSCRIBERS:
        // Has at least one referred user who has an active subscription
        return exists(
          db
            .select({ one: sql`1` })
            .from(userReferrals)
            .innerJoin(
              subscriptions,
              eq(subscriptions.userId, userReferrals.referredUserId),
            )
            .where(
              and(
                eq(userReferrals.referrerUserId, users.id),
                sql`${subscriptions.status} IN (${sql.join(
                  [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING].map(
                    (s) => sql`${s}`,
                  ),
                  sql`, `,
                )})`,
              ),
            ),
        );
      default:
        return null;
    }
  }

  /**
   * Get sort column based on sort field
   */
  private static getSortColumn(
    field: string,
  ):
    | typeof users.createdAt
    | typeof users.updatedAt
    | typeof users.email
    | typeof users.privateName
    | typeof users.publicName {
    switch (field) {
      case UserSortField.CREATED_AT:
        return users.createdAt;
      case UserSortField.UPDATED_AT:
        return users.updatedAt;
      case UserSortField.EMAIL:
        return users.email;
      case UserSortField.PRIVATE_NAME:
        return users.privateName;
      case UserSortField.PUBLIC_NAME:
        return users.publicName;
      default:
        return users.createdAt;
    }
  }

  static async listUsers(
    data: UserListRequestOutput,
    user: JwtPrivatePayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<
    ResponseType<{
      response: {
        users: Array<{
          id: string;
          email: string;
          privateName: string;
          publicName: string;
          isActive: boolean;
          emailVerified: boolean;
          createdAt: Date;
          updatedAt: Date;
          referralCode: string | null;
          referredByUserId: string | null;
          totalReferrals: number;
        }>;
      };
      paginationInfo: {
        totalCount: number;
        pageCount: number;
        page: number;
        limit: number;
      };
    }>
  > {
    try {
      logger.debug("Listing users", {
        query: data,
        requestingUser: user.id,
      });

      // Type assertion to match new definition structure
      const requestData = data as {
        searchFilters?: {
          search?: string;
          status?: string[];
          role?: string[];
          subscription?: string;
          creditActivity?: string;
          threads?: string;
          referralActivity?: string;
        };
        sortingOptions?: {
          sortBy?: string;
          sortOrder?: string;
        };
        paginationInfo?: {
          page?: number;
          limit?: number;
        };
      };

      const limit = requestData.paginationInfo?.limit || 20;
      const page = requestData.paginationInfo?.page || 1;
      const offset = (page - 1) * limit;

      // Build conditions
      const conditions: SQL[] = [];

      // Status filter
      const statusCondition = UserListRepository.convertStatusFilter(
        requestData.searchFilters?.status?.[0],
      );
      if (statusCondition) {
        conditions.push(statusCondition);
      }

      // Role filter
      const roleCondition = UserListRepository.convertRoleFilter();
      if (roleCondition) {
        conditions.push(roleCondition);
      }

      // Subscription presence filter
      const subscriptionCondition =
        UserListRepository.convertSubscriptionFilter(
          requestData.searchFilters?.subscription,
        );
      if (subscriptionCondition) {
        conditions.push(subscriptionCondition);
      }

      // Credit activity filter
      const creditCondition = UserListRepository.convertCreditActivityFilter(
        requestData.searchFilters?.creditActivity,
      );
      if (creditCondition) {
        conditions.push(creditCondition);
      }

      // Threads filter
      const threadsCondition = UserListRepository.convertThreadsFilter(
        requestData.searchFilters?.threads,
      );
      if (threadsCondition) {
        conditions.push(threadsCondition);
      }

      // Referral activity filter
      const referralCondition =
        UserListRepository.convertReferralActivityFilter(
          requestData.searchFilters?.referralActivity,
        );
      if (referralCondition) {
        conditions.push(referralCondition);
      }

      // Search filter
      if (requestData.searchFilters?.search) {
        const searchCondition = or(
          ilike(users.email, `%${requestData.searchFilters.search}%`),
          ilike(users.privateName, `%${requestData.searchFilters.search}%`),
          ilike(users.publicName, `%${requestData.searchFilters.search}%`),
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      // Build where clause
      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get sort configuration
      const sortField =
        requestData.sortingOptions?.sortBy || UserSortField.CREATED_AT;
      const sortOrder = requestData.sortingOptions?.sortOrder || SortOrder.DESC;
      const sortColumn = UserListRepository.getSortColumn(sortField);

      // Execute queries
      const [usersList, [{ total }]] = await Promise.all([
        db
          .select()
          .from(users)
          .where(whereClause)
          .orderBy(sortOrder === SortOrder.ASC ? sortColumn : desc(sortColumn))
          .limit(limit)
          .offset(offset),
        db.select({ total: count() }).from(users).where(whereClause),
      ]);

      const totalPages = Math.ceil(total / limit);

      // Fetch referral data for all users in bulk
      const userIds = usersList.map((u) => u.id);
      const [referralData, referralCountData] =
        userIds.length > 0
          ? await Promise.all([
              // Who referred each user (userReferrals → referralCode)
              db
                .select({
                  referredUserId: userReferrals.referredUserId,
                  referrerUserId: userReferrals.referrerUserId,
                  code: referralCodes.code,
                })
                .from(userReferrals)
                .leftJoin(
                  referralCodes,
                  eq(userReferrals.referralCodeId, referralCodes.id),
                )
                .where(
                  sql`${userReferrals.referredUserId} = ANY(ARRAY[${sql.join(
                    userIds.map((id) => sql`${id}::uuid`),
                    sql`, `,
                  )}])`,
                ),
              // How many users each user referred
              db
                .select({
                  referrerUserId: userReferrals.referrerUserId,
                  cnt: count(),
                })
                .from(userReferrals)
                .where(
                  sql`${userReferrals.referrerUserId} = ANY(ARRAY[${sql.join(
                    userIds.map((id) => sql`${id}::uuid`),
                    sql`, `,
                  )}])`,
                )
                .groupBy(userReferrals.referrerUserId),
            ])
          : [[], []];

      // Build lookup maps
      const referralByUser = new Map(
        referralData.map((r) => [
          r.referredUserId,
          { referrerUserId: r.referrerUserId, code: r.code },
        ]),
      );
      const referralCountByUser = new Map(
        referralCountData.map((r) => [r.referrerUserId, Number(r.cnt)]),
      );

      logger.debug("Users listed successfully", {
        total,
        page,
        limit,
        totalPages,
        resultsCount: usersList.length,
      });

      return success({
        response: {
          users: usersList.map((u) => {
            const ref = referralByUser.get(u.id);
            return {
              id: u.id,
              email: u.email,
              privateName: u.privateName,
              publicName: u.publicName,
              isActive: u.isActive,
              emailVerified: u.emailVerified,
              createdAt: u.createdAt,
              updatedAt: u.updatedAt,
              referralCode: ref?.code ?? null,
              referredByUserId: ref?.referrerUserId ?? null,
              totalReferrals: referralCountByUser.get(u.id) ?? 0,
            };
          }),
        },
        paginationInfo: {
          totalCount: total,
          pageCount: totalPages,
          page,
          limit,
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
