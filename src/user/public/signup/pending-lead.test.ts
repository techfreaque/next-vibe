import { createHash, randomUUID } from "node:crypto";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";

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
      lead_id uuid REFERENCES leads, pending_id uuid, type text, occurred_at timestamp,
      dedupe_key text UNIQUE
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
  const { consumeSignupChallenge } = await import("./pending");
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
        (lead_id, email, password_hash, locale, signup_ip, token_hash, expires_at)
      VALUES ($1, $2, 'fixture', $3, '127.0.0.1', $4, now() + interval '1 minute')
    `,
      [
        shared,
        email,
        defaultLocale,
        createHash("sha256").update(token).digest("hex"),
      ],
    );
    const claimed = await consumeSignupChallenge({ token }, randomUUID(), t);
    if (!claimed.success) {
      return expect.unreachable(claimed.message);
    }
    return claimed.data;
  };

  const first = await confirm("first@example.test");
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
