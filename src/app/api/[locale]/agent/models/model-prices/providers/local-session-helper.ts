/**
 * Local Session Helper
 *
 * Resolves an admin session for the local instance. Used by the Unbottled
 * price fetcher as a fallback when UNBOTTLED_CLOUD_CREDENTIALS is not set,
 * so it can fetch the model list from itself via HTTP.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import { UserRoleDB } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";

import type { UnbottledCloudSession } from "@/app/api/[locale]/agent/env";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { env } from "@/config/env";

/**
 * Resolve an admin session pointing at the given local URL.
 * Signs a JWT for the admin user so the price fetcher can call
 * ws-provider/models on the local instance.
 */
export async function resolveLocalAdminSession(
  remoteUrl: string,
): Promise<UnbottledCloudSession | null> {
  const logger = createEndpointLogger(false, defaultLocale);
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
