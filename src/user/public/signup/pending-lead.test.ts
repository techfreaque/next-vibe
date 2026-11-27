import { createHash, randomUUID } from "node:crypto";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, expect, it, mock, spyOn } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import type { PendingSignup } from "./db";
import { scopedTranslation } from "./i18n";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg), isPglite: true }));
mock.module("./confirmation-mail", () => ({
  sendSignupChallenge: (): null => null,
}));

afterAll(async () => {
  await pg.close();
});

it("claims an unowned visitor lead and creates a distinct lead when another signup reuses it", async () => {
  await pg.exec(`
    CREATE TABLE users (
      id uuid PRIMARY KEY, email text UNIQUE, password text, private_name text,
      public_name text, locale text, email_verified bool, marketing_consent bool
    );
    CREATE TABLE leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), business_name text, country text,
      language text, status text, source text, converted_user_id uuid REFERENCES users,
      converted_at timestamp, signed_up_at timestamp, updated_at timestamp,
      ip_address text, metadata jsonb
    );
    CREATE TABLE user_roles (user_id uuid REFERENCES users, role text);
    CREATE TABLE user_lead_links (
      user_id uuid REFERENCES users, lead_id uuid REFERENCES leads, link_reason text,
      UNIQUE (user_id, lead_id)
    );
    CREATE TABLE growth_journeys (lead_id uuid REFERENCES leads, user_id uuid REFERENCES users);
    CREATE TABLE chat_threads (lead_id uuid REFERENCES leads, user_id uuid REFERENCES users);
    CREATE TABLE chat_folders (lead_id uuid REFERENCES leads, user_id uuid REFERENCES users);
    CREATE TABLE signup_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id uuid REFERENCES leads, pending_id uuid, type text, occurred_at timestamp,
      dedupe_key text UNIQUE
    );
    CREATE TABLE signup_mail_attempts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), scope text NOT NULL, sent_at timestamp NOT NULL
    );
    CREATE TABLE pending_signups (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), lead_id uuid REFERENCES leads, email text,
      password_hash text, private_name text, public_name text, subscribe_to_newsletter bool,
      referral_code text, supported_skill_id uuid, local_favorites jsonb, callback_url text,
      locale text, signup_ip text, code_hash text, token_hash text, attempts int DEFAULT 0,
      expires_at timestamp, sent_at timestamp, message_id text, delivery_failed bool,
      bounced bool, bounce_reason text
    );
  `);
  const { consumeSignupChallenge, pendingStatus } = await import("./pending");
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const shared = randomUUID();
  await pg.query("INSERT INTO leads (id) VALUES ($1)", [shared]);
  await pg.query("INSERT INTO chat_threads (lead_id) VALUES ($1)", [shared]);
  const confirm = async (
    email: string,
  ): Promise<{ pending: PendingSignup; userId: string }> => {
    const token = randomUUID();
    await pg.query(
      `
      INSERT INTO pending_signups
        (lead_id, email, password_hash, locale, signup_ip, token_hash, sent_at, expires_at)
      VALUES ($1, $2, 'fixture', $3, '127.0.0.1', $4, now(), now() + interval '1 minute')
    `,
      [
        shared,
        email,
        defaultLocale,
        createHash("sha256").update(token).digest("hex"),
      ],
    );
    const claimed = await consumeSignupChallenge(
      { token },
      randomUUID(),
      t,
      createEndpointLogger(false, defaultLocale),
    );
    if (!claimed.success) {
      return expect.unreachable(claimed.message);
    }
    return claimed.data;
  };

  const first = await confirm("first@example.test");
  expect(pendingStatus(first.pending, t, "link").message).toBe(
    t("confirmation.linkSent"),
  );
  expect(pendingStatus(first.pending, t).message).toBe(
    t("confirmation.sent", { email: first.pending.email }),
  );
  expect(
    pendingStatus({ ...first.pending, deliveryFailed: true }, t, "link")
      .message,
  ).toBe(t("confirmation.sendFailed", { email: first.pending.email }));
  expect(first.pending.leadId).toBe(shared);
  await pg.query("INSERT INTO growth_journeys VALUES ($1, $2)", [
    shared,
    first.userId,
  ]);
  await pg.query("INSERT INTO chat_threads (lead_id) VALUES ($1)", [shared]);

  const second = await confirm("second@example.test");
  expect(second.pending.leadId).not.toBe(shared);
  expect(
    (
      await pg.query(`
    SELECT l.id, l.converted_user_id, l.ip_address, ll.link_reason
    FROM leads l JOIN user_lead_links ll ON ll.lead_id = l.id AND ll.user_id = l.converted_user_id
    ORDER BY l.ip_address NULLS FIRST
  `)
    ).rows,
  ).toEqual([
    {
      id: shared,
      converted_user_id: first.userId,
      ip_address: null,
      link_reason: "signup",
    },
    {
      id: second.pending.leadId,
      converted_user_id: second.userId,
      ip_address: "127.0.0.1",
      link_reason: "signup",
    },
  ]);
  expect(
    (
      await pg.query(
        "SELECT user_id FROM chat_threads ORDER BY user_id NULLS LAST",
      )
    ).rows,
  ).toEqual([{ user_id: first.userId }, { user_id: null }]);
  expect((await pg.query("SELECT user_id FROM growth_journeys")).rows).toEqual([
    { user_id: first.userId },
  ]);
});

it("logs why a confirmation proof was refused, never what was sent", async () => {
  // Runs after the test above: the tables exist.
  const { consumeSignupChallenge, SignupChallengeRejectReason } =
    await import("./pending");
  const { t } = scopedTranslation.scopedT(defaultLocale);
  const logger = createEndpointLogger(false, defaultLocale);
  const warnings: Array<Record<string, string | boolean>> = [];
  logger.warn = (message, ...rest): void => {
    const [context] = rest;
    if (
      message === "Signup confirmation challenge rejected" &&
      context &&
      typeof context === "object" &&
      !Array.isArray(context) &&
      !(context instanceof Error)
    ) {
      const flat: Record<string, string | boolean> = {};
      for (const [key, value] of Object.entries(context)) {
        if (typeof value === "string" || typeof value === "boolean") {
          flat[key] = value;
        }
      }
      warnings.push(flat);
    }
  };
  const leadId = randomUUID();
  await pg.query("INSERT INTO leads (id) VALUES ($1)", [leadId]);
  const sha = (value: string): string =>
    createHash("sha256").update(value).digest("hex");
  const insert = async (params: {
    token: string;
    expiresIn: string;
    attempts: number;
  }): Promise<string> => {
    const { rows } = await pg.query<{ id: string }>(
      `INSERT INTO pending_signups
        (lead_id, email, password_hash, locale, signup_ip, token_hash, code_hash, attempts, expires_at)
       VALUES ($1, 'reason@example.test', 'fixture', $2, '127.0.0.1', $3, $4, $5, now() + $6::interval)
       RETURNING id`,
      [
        leadId,
        defaultLocale,
        sha(params.token),
        sha("not-the-code"),
        params.attempts,
        params.expiresIn,
      ],
    );
    return rows[0]?.id ?? "";
  };
  const refuse = async (proof: {
    token?: string;
    pendingId?: string;
    code?: string;
  }): Promise<string> => {
    const result = await consumeSignupChallenge(proof, leadId, t, logger);
    expect(result.success).toBe(false);
    if (result.success) {
      return "";
    }
    const reason = String(warnings.at(-1)?.reason ?? "");
    // One generic answer, except a wrong code with guesses left: that one
    // points at the newest email (a resend replaces earlier codes).
    expect(result.message).toBe(
      reason === SignupChallengeRejectReason.MISMATCH
        ? t("confirmation.wrongCode")
        : t("confirmation.invalid"),
    );
    return reason;
  };

  expect(await refuse({ token: randomUUID() })).toBe(
    SignupChallengeRejectReason.MISSING,
  );
  const expiredToken = randomUUID();
  await insert({ token: expiredToken, expiresIn: "-1 minute", attempts: 0 });
  expect(await refuse({ token: expiredToken })).toBe(
    SignupChallengeRejectReason.EXPIRED,
  );
  const exhausted = await insert({
    token: randomUUID(),
    expiresIn: "10 minutes",
    attempts: 5,
  });
  expect(await refuse({ pendingId: exhausted, code: "123456" })).toBe(
    SignupChallengeRejectReason.EXHAUSTED,
  );
  const guessed = await insert({
    token: randomUUID(),
    expiresIn: "10 minutes",
    attempts: 0,
  });
  expect(await refuse({ pendingId: guessed, code: "123456" })).toBe(
    SignupChallengeRejectReason.MISMATCH,
  );
  expect(
    (
      await pg.query<{ attempts: number }>(
        "SELECT attempts FROM pending_signups WHERE id = $1",
        [guessed],
      )
    ).rows[0]?.attempts,
  ).toBe(1);

  expect(warnings).toHaveLength(4);
  const allowed = new Set([
    "challengeType",
    "hasPendingId",
    "reason",
    // Shape of a typed code, never the code itself.
    "enteredCodeShape",
    "codeDeliveryFailed",
    // What the browser's lead has when a link matches nothing.
    "linkState",
  ]);
  for (const warning of warnings) {
    for (const key of Object.keys(warning)) {
      expect(allowed.has(key)).toBe(true);
    }
    expect(Object.values(warning)).not.toContain("123456");
  }
  expect(warnings.at(-1)?.enteredCodeShape).toBe("six-digits");
  expect(warnings[0]?.linkState).toBe("none");
});

it("distinguishes resend cooldown from hourly budgets without consuming more sends", async () => {
  const { issueSignupChallenge } = await import("./pending");
  const leadId = randomUUID();
  await pg.query("INSERT INTO leads (id) VALUES ($1)", [leadId]);
  const input = {
    leadId,
    email: "fixture@example.invalid",
    passwordHash: "fixture",
    privateName: "Fixture",
    publicName: "Fixture",
    subscribeToNewsletter: false,
    locale: defaultLocale,
  };
  const logger = createEndpointLogger(false, defaultLocale);
  const warn = spyOn(logger, "warn").mockImplementation(() => {});
  const deliver = mock(async () => "fixture");
  const issue = () =>
    issueSignupChallenge(
      input,
      null,
      null,
      logger,
      scopedTranslation.scopedT(defaultLocale).t,
      deliver,
    );
  expect((await issue()).success).toBe(true);
  expect((await issue()).success).toBe(false);
  expect(warn).toHaveBeenLastCalledWith(
    "Signup confirmation send rate limited",
    {
      limits: ["email-cooldown"],
      replacingChallenge: false,
    },
  );
  await pg.query(
    "INSERT INTO signup_mail_attempts (scope, sent_at) SELECT $1, now() FROM generate_series(1, 4)",
    [`lead:${leadId}`],
  );
  expect((await issue()).success).toBe(false);
  expect(warn).toHaveBeenLastCalledWith(
    "Signup confirmation send rate limited",
    {
      limits: ["email-cooldown", "lead-hourly"],
      replacingChallenge: false,
    },
  );
  expect(deliver).toHaveBeenCalledTimes(1);
  expect(
    (
      await pg.query<{ count: number }>(
        "SELECT count(*)::int AS count FROM signup_mail_attempts",
      )
    ).rows[0]?.count,
  ).toBe(6);
});
