/**
 * Which cron tasks a connection rename may retarget.
 *
 * Renaming an instance label retargets cron tasks that point at the old label.
 * `targetInstance` labels are per-user names ("hermes", "thea"), so on a
 * multi-tenant instance an unscoped update would retarget OTHER accounts'
 * tasks that happen to use the same label. Customers: own tasks only. Admins:
 * own tasks plus system-owned ones (userId null), which is what a
 * single-operator instance renaming itself needs.
 */

import "server-only";

import type { SQL } from "drizzle-orm";
import { eq, isNull, or } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import type { JwtPrivatePayloadType } from "../identity/auth/types";
import { isRemoteAdmin } from "./customer-access/access";

export function cronTaskOwnerScope(
  user: JwtPrivatePayloadType,
  userIdColumn: PgColumn,
): SQL {
  if (isRemoteAdmin(user)) {
    return (
      or(eq(userIdColumn, user.id), isNull(userIdColumn)) ??
      eq(userIdColumn, user.id)
    );
  }
  return eq(userIdColumn, user.id);
}
