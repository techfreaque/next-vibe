import "server-only";

import { and, eq, gt } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { AuthRepository } from "next-vibe/identity/auth/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { sessions } from "next-vibe/identity/session/db";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";

export async function sessionNoticeRecipient(
  token: string,
  locale: CountryLanguage,
): Promise<{ user: JwtPrivatePayloadType; email: string } | null> {
  const logger = createEndpointLogger(false, locale);
  try {
    const [account] = await db
      .select({ id: users.id, email: users.email })
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(
        and(
          eq(sessions.token, token),
          gt(sessions.expiresAt, new Date()),
          eq(users.emailVerified, false),
          eq(users.isActive, true),
          eq(users.isBanned, false),
        ),
      )
      .limit(1);
    if (!account) {
      return null;
    }
    const signed = await AuthRepository.verifyJwt(token, logger, locale);
    return signed.success && signed.data.id === account.id
      ? { user: signed.data, email: account.email }
      : null;
  } catch {
    // A failed notice lookup must never interrupt an existing session.
    logger.warn("Could not look up the email confirmation notice");
    return null;
  }
}
