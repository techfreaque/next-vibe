/**
 * Test cleanup for the login lockout ledger.
 *
 * LoginRepository locks an account after MAX_FAILED_ATTEMPTS failures within
 * WINDOW_MS, counted by email OR IP. Every rejection test therefore pollutes a
 * shared bucket: enough runs lock the account under test AND every login from
 * the same IP (localhost — i.e. the developer's own browser). Tests that post
 * failed logins must delete their rows afterwards via this helper.
 */

import { and, eq } from "drizzle-orm";

import { db } from "../../../database";
import { loginAttempts } from "../../../identity/user/db";

/** Delete the FAILED attempts recorded for `email` (successful logins are kept). */
export async function clearLoginAttempts(email: string): Promise<void> {
  await db
    .delete(loginAttempts)
    .where(
      and(
        eq(loginAttempts.email, email.toLowerCase()),
        eq(loginAttempts.success, false),
      ),
    );
}
