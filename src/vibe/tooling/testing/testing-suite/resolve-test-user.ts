/**
 * Resolves the real admin user from the database for test infrastructure.
 * Cached after first call - all testEndpoint() suites share the same resolved user.
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "../../../core/i18n/core/config";
import { db } from "../../../database";
import type { JwtPrivatePayloadType } from "../../../identity/auth/types";
import { identityEnv } from "../../../identity/env";
import { leadDb } from "../../../identity/lead/db";
import { UserRoleDB } from "../../../identity/roles/enum";
import { userRoles } from "../../../identity/user/db";
import { UserDetailLevel } from "../../../identity/user/enum";
import { UserRepository } from "../../../identity/user/repository";
import { createEndpointLogger } from "../../../logger/server";

let cached: JwtPrivatePayloadType | null = null;

export async function resolveTestAdminUser(): Promise<JwtPrivatePayloadType> {
  if (cached) {
    return cached;
  }

  const logger = createEndpointLogger(false, defaultLocale);
  const result = await UserRepository.getUserByEmail(
    identityEnv.VIBE_ADMIN_USER_EMAIL,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );

  if (!result.success || !result.data) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      `Test admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} not found - run: vibe seed`,
    );
  }

  const user = result.data;

  const [link, roleRows] = await Promise.all([
    leadDb.query.userLeadLinks.findFirst({
      where: (ul, { eq: eql }) => eql(ul.userId, user.id),
    }),
    db.select().from(userRoles).where(eq(userRoles.userId, user.id)),
  ]);

  if (!link) {
    // oxlint-disable-next-line restricted-syntax
    throw new Error(
      `Test admin user ${identityEnv.VIBE_ADMIN_USER_EMAIL} has no lead link - run: vibe seed`,
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
