/**
 * Subscription Dashboard Repository
 * Counts active, canceling, trial, and total subscriptions for the current user
 */

import "server-only";

import { and, count, eq, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { subscriptions } from "@/app/api/[locale]/subscription/db";
import { SubscriptionStatus } from "@/app/api/[locale]/subscription/enum";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";

import type { SubscriptionDashboardResponseOutput } from "./definition";
import { scopedTranslation } from "./i18n";

export class SubscriptionDashboardRepository {
  /**
   * Get subscription KPI counts for the logged-in user.
   * CUSTOMER: counts their own subscription only.
   * ADMIN: counts all subscriptions across the platform.
   */
  static async getDashboard(
    userId: string,
    isAdmin: boolean,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionDashboardResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      logger.debug("Loading subscription dashboard", { userId, isAdmin });

      // Base filter: admins see all, customers see their own
      const userFilter = isAdmin ? undefined : eq(subscriptions.userId, userId);

      const [total] = await db
        .select({ total: count() })
        .from(subscriptions)
        .where(userFilter);

      const [active] = await db
        .select({ total: count() })
        .from(subscriptions)
        .where(
          userFilter
            ? and(
                userFilter,
                eq(subscriptions.status, SubscriptionStatus.ACTIVE),
              )
            : eq(subscriptions.status, SubscriptionStatus.ACTIVE),
        );

      const [canceling] = await db
        .select({ total: count() })
        .from(subscriptions)
        .where(
          userFilter
            ? and(userFilter, sql`${subscriptions.cancelAtPeriodEnd} = true`)
            : sql`${subscriptions.cancelAtPeriodEnd} = true`,
        );

      const [trial] = await db
        .select({ total: count() })
        .from(subscriptions)
        .where(
          userFilter
            ? and(
                userFilter,
                eq(subscriptions.status, SubscriptionStatus.TRIALING),
              )
            : eq(subscriptions.status, SubscriptionStatus.TRIALING),
        );

      return success({
        activeCount: active?.total ?? 0,
        cancelingCount: canceling?.total ?? 0,
        trialCount: trial?.total ?? 0,
        totalCount: total?.total ?? 0,
      });
    } catch (error) {
      logger.error("Error loading subscription dashboard", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  static getDashboardForUser(
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionDashboardResponseOutput>> {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    return SubscriptionDashboardRepository.getDashboard(
      user.id ?? "",
      isAdmin,
      logger,
      locale,
    );
  }
}
