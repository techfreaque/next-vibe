/** Replace the first-run placeholder credentials without assigning new roles. */
import "server-only";

import { and, eq, ne, sql } from "drizzle-orm";

import { db } from "../database";
import { hashPassword } from "./auth/password";
import {
  DEFAULT_ADMIN_EMAIL,
  isDefaultAdminPassword,
} from "./default-admin-password";
import { identityEnv } from "./env";
import { hasShippedAdminPassword } from "./placeholder-admin";
import { UserRole } from "./roles/enum";
import { getSetupPhase } from "./setup-state";
import { userRoles, users } from "./user/db";

export class AdminLoginSyncRepository {
  static async sync(
    userId: string,
    email: string,
    password: string,
    saveSettings: () => Promise<void>,
  ): Promise<boolean> {
    if (
      getSetupPhase(identityEnv) !== "first-run" ||
      isDefaultAdminPassword(password)
    ) {
      return false;
    }
    return db.transaction(async (tx) => {
      const [admin] = await tx
        .select({ password: users.password })
        .from(users)
        .innerJoin(userRoles, eq(userRoles.userId, users.id))
        .where(
          and(
            eq(users.id, userId),
            eq(users.email, DEFAULT_ADMIN_EMAIL),
            eq(users.isActive, true),
            eq(users.isBanned, false),
            eq(userRoles.role, UserRole.ADMIN),
          ),
        )
        .limit(1);
      if (!admin || !(await hasShippedAdminPassword(admin.password))) {
        return false;
      }

      const [target] = await tx
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            ne(users.id, userId),
            eq(sql<string>`lower(${users.email})`, email.toLowerCase()),
          ),
        )
        .limit(1);
      if (target) {
        return false;
      }

      const [updated] = await tx
        .update(users)
        .set({ email, password: await hashPassword(password) })
        .where(
          and(
            eq(users.id, userId),
            eq(users.email, DEFAULT_ADMIN_EMAIL),
            eq(users.password, admin.password),
          ),
        )
        .returning({ id: users.id });
      if (!updated) {
        return false;
      }
      await saveSettings();
      return true;
    });
  }
}
