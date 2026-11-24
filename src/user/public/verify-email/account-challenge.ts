import "server-only";

import { createHmac, randomInt } from "node:crypto";

import { and, eq, gt, isNotNull, lt, ne, or, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { identityEnv } from "next-vibe/identity/env";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { sendAccountChallenge } from "../signup/confirmation-mail";
import { accountEmailChallenges as challenges } from "./db";
import { scopedTranslation } from "./i18n";
import { createVerificationToken } from "./token";

const CODE_TTL_MS = 30 * 60_000;
const RESEND_INTERVAL_MS = 5 * 60_000;
const MAX_ATTEMPTS = 5;

function digest(
  userId: string,
  email: string,
  sentAt: Date,
  code: string,
): string {
  return createHmac("sha256", identityEnv.JWT_SECRET_KEY)
    .update(
      JSON.stringify([
        "account-email:v1",
        userId,
        email,
        sentAt.getTime(),
        code,
      ]),
    )
    .digest("hex");
}

export async function requestAccountChallenge(
  user: { id: string; email: string; privateName: string; leadId: string },
  mode: "notice" | "login" | "resend",
  locale: CountryLanguage,
  logger: EndpointLogger,
  deliver = sendAccountChallenge,
): Promise<ResponseType<"sent" | "existing">> {
  const { t } = scopedTranslation.scopedT(locale);
  const deliveryFailure = (): ErrorResponseType =>
    fail({
      message: t("accountChallenge.undeliverable", { email: user.email }),
      errorType: ErrorResponseTypes.EMAIL_ERROR,
    });
  if (!z.email().safeParse(user.email).success) {
    logger.warn("Invalid account verification address", { userId: user.id });
    return deliveryFailure();
  }
  const now = new Date(Date.now());
  const token = createVerificationToken(
    user.id,
    user.email,
    now.getTime(),
    "account-challenge",
  );
  if (!token) {
    return fail({
      message: t("errors.failed"),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
  const code = randomInt(1_000_000).toString().padStart(6, "0");
  const fields = {
    email: user.email,
    sentAt: now,
    codeHash: digest(user.id, user.email, now, code),
    attempts: 0,
    bounced: false,
    deliveryFailed: false,
    messageId: null,
  };
  const resendAfter = mode === "resend" ? RESEND_INTERVAL_MS : CODE_TTL_MS;
  const canRotate =
    mode === "notice"
      ? undefined
      : and(
          eq(challenges.bounced, false),
          mode === "login" ? eq(challenges.deliveryFailed, false) : undefined,
          lt(challenges.sentAt, new Date(now.getTime() - resendAfter)),
        );
  // The primary key serializes simultaneous logins, tabs and manual resends.
  // Once mailed, a banner never rotates a challenge. A login reuses its live code.
  const eligible = db
    .select({
      userId: users.id,
      email: users.email,
      codeHash: sql<string>`${fields.codeHash}::text`,
      sentAt: sql<Date>`${now.toISOString()}::timestamp`,
      attempts: sql<number>`0`,
      messageId: sql<string | null>`null::text`,
      deliveryFailed: sql<boolean>`false`,
      bounced: sql<boolean>`false`,
    })
    .from(users)
    .where(
      and(
        eq(users.id, user.id),
        eq(users.email, user.email),
        eq(users.emailVerified, false),
        eq(users.isActive, true),
        eq(users.isBanned, false),
      ),
    )
    .for("share");
  const [reserved] = await db
    .insert(challenges)
    .select(eligible.getSQL())
    .onConflictDoUpdate({
      target: challenges.userId,
      set: fields,
      setWhere: or(ne(challenges.email, user.email), canRotate),
    })
    .returning({ id: challenges.userId });
  if (!reserved) {
    const [previous] = await db
      .select()
      .from(challenges)
      .where(eq(challenges.userId, user.id));
    if (
      !previous ||
      previous.email !== user.email ||
      previous.bounced ||
      previous.deliveryFailed
    ) {
      return deliveryFailure();
    }
    if (mode === "resend") {
      return fail({
        message: t("accountChallenge.cooldown"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    return success("existing");
  }

  const { messageId, bounced } = await deliver(
    user,
    { code, token },
    locale,
    logger,
  ).catch(() => ({
    messageId: null,
    bounced: false,
  }));

  await db
    .update(challenges)
    .set({
      messageId,
      bounced: bounced || challenges.bounced,
      deliveryFailed: !messageId,
    })
    .where(
      and(
        eq(challenges.userId, user.id),
        eq(challenges.codeHash, fields.codeHash),
      ),
    );
  if (!messageId) {
    logger.warn("Account verification email delivery failed", {
      userId: user.id,
    });
  }
  return messageId ? success("sent") : deliveryFailure();
}

export async function claimAccountCode(
  userId: string,
  email: string,
  code: string,
  locale: CountryLanguage,
): Promise<ResponseType<string>> {
  const { t } = scopedTranslation.scopedT(locale);
  const invalid = (): ErrorResponseType =>
    fail({
      message: t("accountChallenge.invalid"),
      errorType: ErrorResponseTypes.INVALID_TOKEN_ERROR,
    });
  const [row] = await db
    .select({ sentAt: challenges.sentAt })
    .from(challenges)
    .where(and(eq(challenges.userId, userId), eq(challenges.email, email)));
  if (!row) {
    return invalid();
  }
  const hash = digest(userId, email, row.sentAt, code);
  const [claim] = await db
    .update(challenges)
    .set({
      attempts: sql`CASE WHEN ${challenges.codeHash} = ${hash} THEN ${MAX_ATTEMPTS} ELSE ${challenges.attempts} + 1 END`,
    })
    .where(
      and(
        eq(challenges.userId, userId),
        eq(challenges.email, email),
        eq(challenges.sentAt, row.sentAt),
        isNotNull(challenges.messageId),
        eq(challenges.deliveryFailed, false),
        eq(challenges.bounced, false),
        gt(challenges.sentAt, new Date(Date.now() - CODE_TTL_MS)),
        lt(challenges.attempts, MAX_ATTEMPTS),
      ),
    )
    .returning({ valid: sql<boolean>`${challenges.codeHash} = ${hash}` });
  const token =
    claim?.valid &&
    createVerificationToken(
      userId,
      email,
      row.sentAt.getTime(),
      "account-challenge",
    );
  if (!token) {
    return invalid();
  }
  return success(token);
}
