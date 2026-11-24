import "server-only";

import { randomBytes } from "node:crypto";

import { and, eq } from "drizzle-orm";

import { db } from "../database";
import { hashPassword, verifyPassword } from "./auth/password";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORDS,
  isDefaultAdminPassword,
} from "./default-admin-password";
import { UserRole } from "./roles/enum";
import { userRoles, users } from "./user/db";

export async function hasShippedAdminPassword(hash: string): Promise<boolean> {
  for (const password of DEFAULT_ADMIN_PASSWORDS) {
    if (await verifyPassword(password, hash)) {
      return true;
    }
  }
  return false;
}

/** Retire an old placeholder after the instance has a separate admin login. */
export async function retireShippedPlaceholderAdmin(config: {
  VIBE_ADMIN_USER_EMAIL: string;
  VIBE_ADMIN_USER_PASSWORD: string;
}): Promise<void> {
  if (
    config.VIBE_ADMIN_USER_EMAIL === DEFAULT_ADMIN_EMAIL ||
    isDefaultAdminPassword(config.VIBE_ADMIN_USER_PASSWORD)
  ) {
    return;
  }
  const [placeholder] = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .innerJoin(userRoles, eq(userRoles.userId, users.id))
    .where(
      and(
        eq(users.email, DEFAULT_ADMIN_EMAIL),
        eq(userRoles.role, UserRole.ADMIN),
      ),
    )
    .limit(1);
  if (!placeholder || !(await hasShippedAdminPassword(placeholder.password))) {
    return;
  }
  await db
    .update(users)
    .set({ password: await hashPassword(randomBytes(32).toString("hex")) })
    .where(
      and(
        eq(users.id, placeholder.id),
        eq(users.email, DEFAULT_ADMIN_EMAIL),
        eq(users.password, placeholder.password),
      ),
    );
}
