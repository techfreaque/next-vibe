/**
 * Resolves the real admin user from the database for test infrastructure.
 * Cached after first call - all testEndpoint() suites share the same resolved user.
 */

import { eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { userRoles } from "@/app/api/[locale]/user/db";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { UserRoleDB } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";

let cached: JwtPrivatePayloadType | null = null;

export async function resolveTestAdminUser(): Promise<JwtPrivatePayloadType> {
  if (cached) {
    return cached;
  }

  const logger = createEndpointLogger(false, Date.now(), defaultLocale);
  const result = await UserRepository.getUserByEmail(
    env.VIBE_ADMIN_USER_EMAIL,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );

  if (!result.success || !result.data) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      `Test admin user ${env.VIBE_ADMIN_USER_EMAIL} not found - run: vibe seed`,
    );
  }

  const user = result.data;

  const [link, roleRows] = await Promise.all([
    db.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      `Test admin user ${env.VIBE_ADMIN_USER_EMAIL} has no lead link - run: vibe seed`,
    );
  }

  const roles = roleRows
    .map((r) => r.role)
    .filter((r): r is (typeof UserRoleDB)[number] =>
      UserRoleDB.includes(r as (typeof UserRoleDB)[number]),
    );

  cached = {
    isPublic: false,
    id: user.id,
    leadId: link.leadId,
    roles,
  };

  return cached;
}
