/**
 * Shared utility to resolve the execution user for a cron task.
 *
 * This is the ONLY place where task owner → JwtPrivatePayloadType conversion
 * should happen. All callers (pulse, execute, complete-task) must use this
 * instead of building their own resolution logic.
 *
 * Rules:
 *   - System tasks (userId IS NULL): use the admin account (VIBE_ADMIN_USER_EMAIL)
 *   - User tasks: resolve the actual owner's locale, roles, and leadId from DB
 */

import "server-only";

import { eq } from "drizzle-orm";

import { LeadAuthRepository } from "@/app/api/[locale]/leads/auth/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserRolesRepository } from "@/app/api/[locale]/user/user-roles/repository";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import type { TaskOwner } from "./db";

export interface TaskUserContext {
  user: JwtPrivatePayloadType;
  locale: CountryLanguage;
}

/**
 * Resolve the execution user context for a task based on its owner.
 *
 * Returns null if the user cannot be resolved (admin email missing,
 * user not found, or role fetch failed) — callers must treat this as
 * a hard failure and abort task execution.
 */
export async function resolveTaskOwnerUser(
  owner: TaskOwner,
  systemLocale: CountryLanguage,
  logger: EndpointLogger,
  /** Pre-resolved admin auth result to avoid redundant DB round-trips in pulse cycles */
  cachedAdminAuth?: JwtPrivatePayloadType | null,
): Promise<TaskUserContext | null> {
  if (owner.type === "system") {
    if (cachedAdminAuth) {
      return { user: cachedAdminAuth, locale: systemLocale };
    }
    const adminEmail = env.VIBE_ADMIN_USER_EMAIL;
    if (!adminEmail) {
      logger.error(
        "[resolveTaskOwnerUser] VIBE_ADMIN_USER_EMAIL not set — cannot resolve system task user",
      );
      return null;
    }
    const authResult = await AuthRepository.authenticateUserByEmail(
      adminEmail,
      systemLocale,
      logger,
    );
    if (!authResult.success || !authResult.data) {
      logger.error("[resolveTaskOwnerUser] Admin auth failed for system task", {
        adminEmail,
      });
      return null;
    }
    return { user: authResult.data, locale: systemLocale };
  }

  // User task — resolve real locale, roles, and leadId from DB
  let userLocale: CountryLanguage = systemLocale;
  const ownerRow = await db
    .select({ locale: usersTable.locale })
    .from(usersTable)
    .where(eq(usersTable.id, owner.userId))
    .limit(1);
  if (ownerRow[0]?.locale) {
    userLocale = ownerRow[0].locale;
  }

  const rolesResult = await UserRolesRepository.getUserRoles(
    owner.userId,
    logger,
    userLocale,
  );
  if (!rolesResult.success) {
    logger.error("[resolveTaskOwnerUser] Failed to resolve roles", {
      userId: owner.userId,
    });
    return null;
  }

  const { leadId } = await LeadAuthRepository.getAuthenticatedUserLeadId(
    owner.userId,
    undefined,
    userLocale,
    logger,
  );

  return {
    user: {
      id: owner.userId,
      leadId,
      isPublic: false as const,
      roles: rolesResult.data,
    },
    locale: userLocale,
  };
}
