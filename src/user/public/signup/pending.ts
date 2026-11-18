import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

import { and, eq, lt, sql } from "drizzle-orm";
import { chatFolders, chatThreads } from "next-vibe/agent/chat/db";
import type {
  ErrorResponseType,
  ResponseType,
} from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { db, isPglite } from "next-vibe/database";
import { identityEnv } from "next-vibe/identity/env";
import { userLeadLinks } from "next-vibe/identity/lead/db";
import { ipPoolKey, ipSubnetKey } from "next-vibe/identity/lead/ip-key";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { signupSubnetLimitHit } from "@/credits/anti-farming/signup-limit";

import { sendSignupChallenge } from "./confirmation-mail";
import { type PendingSignup, pendingSignups, signupMailAttempts } from "./db";
import type { SignupPatchResponseOutput } from "./definition";
import { normalizedEmailSql } from "./email-guard";
import { normalizeEmailForUniqueness } from "./email-identity";
import type { SignupT } from "./i18n";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
export const CONFIRMATION_TTL = 30 * MINUTE;
const MAX_SENDS = 5;
const MAX_GUESSES = 5;
type PendingInput = Omit<
  typeof pendingSignups.$inferInsert,
  "codeHash" | "tokenHash" | "expiresAt" | "sentAt"
>;

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function codeDigest(tokenHash: string, code: string): string {
  return createHmac("sha256", identityEnv.JWT_SECRET_KEY)
    .update(`signup:v1:${tokenHash}:${code}`)
    .digest("hex");
}

export function pendingStatus(
  row: PendingSignup,
  t: SignupT,
): SignupPatchResponseOutput & { message: ReturnType<SignupT> } {
  return {
    address: row.email,
    bounced: row.bounced,
    resendAt: row.sentAt.getTime() + MINUTE,
    message: row.bounced
      ? t("confirmation.bounce", { email: row.email })
      : row.deliveryFailed
        ? t("confirmation.sendFailed", { email: row.email })
        : t("confirmation.sent", { email: row.email }),
  };
}

/** A rotation uses the observed hash as a version. A stale resend or correction
 * cannot resurrect a consumed row or replace a newer address. */
export async function issueSignupChallenge(
  input: PendingInput,
  previous: PendingSignup | null,
  ip: string | null,
  logger: EndpointLogger,
  t: SignupT,
  deliver = sendSignupChallenge,
): Promise<ResponseType<PendingSignup>> {
  const addressKey = `email:${normalizeEmailForUniqueness(input.email)}`;
  const network = ipPoolKey(ip);
  const keys = [
    `lead:${input.leadId}`,
    addressKey,
    ...(network ? [`ip:${network}`] : []),
  ].toSorted();
  const token = randomBytes(32).toString("base64url");
  let code = randomInt(1_000_000).toString().padStart(6, "0");
  if (previous && codeDigest(previous.tokenHash, code) === previous.codeHash) {
    code = ((Number(code) + randomInt(1, 1_000_000)) % 1_000_000)
      .toString()
      .padStart(6, "0");
  }
  const tokenHash = digest(token);
  const limited = (): ErrorResponseType =>
    fail({
      message: t("confirmation.cooldown"),
      errorType: ErrorResponseTypes.VALIDATION_ERROR,
    });
  const issue = async (
    tx: Pick<typeof db, "delete" | "$with" | "with" | "update" | "execute">,
  ): Promise<ResponseType<PendingSignup>> => {
    for (const key of isPglite ? [] : keys) {
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtextextended(${`signup:${key}`}, 0))`,
      );
    }
    const now = new Date();
    const cutoff = new Date(now.getTime() - HOUR);
    await tx
      .delete(signupMailAttempts)
      .where(lt(signupMailAttempts.sentAt, cutoff));
    await tx
      .delete(pendingSignups)
      .where(
        lt(pendingSignups.expiresAt, new Date(now.getTime() - 7 * 24 * HOUR)),
      );
    // Reserve all three budgets together. On the shared PGlite session this
    // single statement also serializes simultaneous requests for the last send.
    const scopes = sql.join(
      keys.map((key) => sql`${key}::text`),
      sql`, `,
    );
    const reserved = await tx.execute<{ id: string }>(sql`
      WITH scopes(scope) AS (SELECT unnest(ARRAY[${scopes}])),
      limited AS (
        SELECT scope FROM ${signupMailAttempts} JOIN scopes USING (scope)
        WHERE sent_at >= ${cutoff.toISOString()}::timestamp
        GROUP BY scope
        HAVING count(*) >= ${MAX_SENDS}
          OR (scope = ${addressKey} AND max(sent_at) >= ${new Date(now.getTime() - MINUTE).toISOString()}::timestamp)
      )
      INSERT INTO ${signupMailAttempts} (scope, sent_at)
      SELECT scope, ${now.toISOString()}::timestamp FROM scopes
      WHERE NOT EXISTS (SELECT 1 FROM limited) RETURNING id`);
    if (!reserved.rows.length) {
      return limited();
    }
    const fields = {
      email: input.email,
      codeHash: codeDigest(tokenHash, code),
      tokenHash,
      attempts: 0,
      expiresAt: new Date(now.getTime() + CONFIRMATION_TTL),
      sentAt: now,
      bounced: false,
      deliveryFailed: false,
      messageId: null,
    };
    const [pending] = previous
      ? await tx
          .update(pendingSignups)
          .set(fields)
          .where(
            and(
              eq(pendingSignups.id, previous.id),
              eq(pendingSignups.tokenHash, previous.tokenHash),
            ),
          )
          .returning()
      : await tx
          .with(
            tx
              .$with("discarded_signup")
              .as(
                tx
                  .delete(pendingSignups)
                  .where(eq(pendingSignups.leadId, input.leadId))
                  .returning({ id: pendingSignups.id }),
              ),
          )
          .insert(pendingSignups)
          .values({ ...input, ...fields })
          .returning();
    if (!pending) {
      return fail({
        message: t("confirmation.invalid"),
        errorType: ErrorResponseTypes.INVALID_TOKEN_ERROR,
      });
    }
    return success(pending);
  };
  const issued = isPglite ? await issue(db) : await db.transaction(issue);
  if (!issued.success) {
    return issued;
  }
  const row = issued.data;
  const messageId = await deliver(row, { code, token }, row.locale, logger);
  const deliveryFailed = !messageId;
  await db
    .update(pendingSignups)
    .set({ messageId, deliveryFailed })
    .where(
      and(
        eq(pendingSignups.id, row.id),
        eq(pendingSignups.tokenHash, tokenHash),
      ),
    );
  return success({ ...row, deliveryFailed, messageId });
}

/** Lock the pending challenge and consume it in the transaction that creates
 * the account and its role. Invalid guesses commit their attempt count. */
export async function consumeSignupChallenge(
  proof: { token?: string; pendingId?: string; code?: string },
  leadId: string,
  t: SignupT,
): Promise<ResponseType<{ pending: PendingSignup; userId: string }>> {
  const invalid = (): ErrorResponseType =>
    fail({
      message: t("confirmation.invalid"),
      errorType: ErrorResponseTypes.INVALID_TOKEN_ERROR,
    });
  const match = proof.token
    ? eq(pendingSignups.tokenHash, digest(proof.token))
    : proof.pendingId && proof.code
      ? and(
          eq(pendingSignups.id, proof.pendingId),
          eq(pendingSignups.leadId, leadId),
        )
      : null;
  if (!match) {
    return invalid();
  }
  const claim = async (
    tx: Pick<typeof db, "select" | "update" | "execute">,
  ): Promise<ResponseType<{ pending: PendingSignup; userId: string }>> => {
    const [row] = await tx
      .select()
      .from(pendingSignups)
      .where(match)
      .for("update");
    if (!row || row.expiresAt.getTime() <= Date.now()) {
      return invalid();
    }
    if (!proof.token) {
      if (!proof.code || row.attempts >= MAX_GUESSES) {
        return invalid();
      }
      if (
        !timingSafeEqual(
          Buffer.from(row.codeHash, "hex"),
          Buffer.from(codeDigest(row.tokenHash, proof.code), "hex"),
        )
      ) {
        await tx
          .update(pendingSignups)
          .set({ attempts: sql`${pendingSignups.attempts} + 1` })
          .where(
            and(
              eq(pendingSignups.id, row.id),
              eq(pendingSignups.tokenHash, row.tokenHash),
              lt(pendingSignups.attempts, MAX_GUESSES),
            ),
          );
        return invalid();
      }
    }
    const subnet = ipSubnetKey(row.signupIp);
    if (subnet) {
      await tx.execute(
        sql`SELECT pg_advisory_xact_lock(hashtextextended(${`signup:subnet:${subnet}`}, 0))`,
      );
      if (await signupSubnetLimitHit(row.signupIp, new Date(), tx)) {
        return fail({
          message: t("errors.subnetSignupLimit.detail"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
    }
    const normalized = normalizeEmailForUniqueness(row.email);
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${`signup:account:${normalized}`}, 0))`,
    );
    const [taken] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(normalizedEmailSql(), normalized))
      .limit(1);
    if (taken) {
      return fail({
        message: t("errors.conflict.detail"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }
    // The PGlite proxy shares one SQL session between clients. Keep all of
    // these writes in one statement, including the compare-and-delete. A
    // racing click or correction can never create a second account.
    const userId = randomUUID();
    const claimed = await tx.execute<{ id: string }>(sql`
      WITH consumed AS (
        DELETE FROM ${pendingSignups} WHERE id = ${row.id}
          AND token_hash = ${row.tokenHash} AND expires_at > ${new Date().toISOString()}::timestamp
          AND (${Boolean(proof.token)} OR attempts < ${MAX_GUESSES})
          AND NOT EXISTS (SELECT 1 FROM ${users} WHERE ${normalizedEmailSql()} = ${normalized})
        RETURNING *
      ), account AS (
        INSERT INTO ${users} (id,email,password,private_name,public_name,locale,email_verified,marketing_consent)
        SELECT ${userId}::uuid,email,password_hash,private_name,public_name,locale,true,subscribe_to_newsletter
        FROM consumed RETURNING id
      ), role AS (
        INSERT INTO ${userRoles} (user_id,role) SELECT id,${UserRole.CUSTOMER} FROM account
      ), link AS (
        INSERT INTO ${userLeadLinks} (user_id,lead_id,link_reason) SELECT id,${row.leadId}::uuid,'signup' FROM account
      ), folders AS (
        UPDATE ${chatFolders} SET user_id = account.id FROM account WHERE lead_id = ${row.leadId} AND user_id IS NULL
      ), threads AS (
        UPDATE ${chatThreads} SET user_id = account.id FROM account WHERE lead_id = ${row.leadId} AND user_id IS NULL
      ) SELECT id FROM account`);
    return claimed.rows.length ? success({ pending: row, userId }) : invalid();
  };
  return isPglite ? claim(db) : db.transaction(claim);
}
