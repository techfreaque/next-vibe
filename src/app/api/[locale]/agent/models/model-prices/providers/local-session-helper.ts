/**
 * Local Session Helper
 *
 * Resolves an admin session for the local instance. Used by the Unbottled
 * price fetcher as a fallback when UNBOTTLED_CLOUD_CREDENTIALS is not set,
 * so it can fetch the model list from itself via HTTP.
 */

import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";
import type { UnbottledCloudSession } from "@/app/api/[locale]/agent/env";

/**
 * Resolve an admin session pointing at the given local URL.
 * Signs a JWT for the admin user so the price fetcher can call
 * ws-provider/models on the local instance.
 */
export async function resolveLocalAdminSession(
  remoteUrl: string,
): Promise<UnbottledCloudSession | null> {
  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const adminEmail = env.VIBE_ADMIN_USER_EMAIL;

  const userResult = await UserRepository.getUserByEmail(
    adminEmail,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!userResult.success || !userResult.data) {
    return null;
  }
  const user = userResult.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    return null;
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  const tokenResult = await AuthRepository.signJwt(
    { isPublic: false, id: user.id, leadId: link.leadId, roles },
    logger,
    defaultLocale,
  );
  if (!tokenResult.success || !tokenResult.data) {
    return null;
  }

  return {
    token: tokenResult.data,
    leadId: link.leadId,
    remoteUrl,
  };
}
