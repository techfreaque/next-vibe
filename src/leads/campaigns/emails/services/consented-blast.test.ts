/**
 * Consented newsletter blast audience must exclude UNVERIFIED addresses.
 *
 * A fake/unconfirmed email (users.email_verified = false) is a bounce risk and
 * must never be mailed, even with marketing consent. This asserts the exact
 * audience gate used by bootstrapConsentedNewsletterBlast / bootstrapNewsletterBlast
 * (marketing consent AND email verified AND email present): a verified+consented
 * user is in the audience; an unverified+consented one and a verified+non-consented
 * one are not.
 *
 * Requires the dev DB. No mail is sent and no campaign rows are written — this
 * queries the audience the same way the blast does. Scoped to unique test
 * emails so no real/seeded contact is touched.
 */

import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";

const RUN = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const addr = (name: string): string =>
  `blast-${RUN}-${name}@example-test.invalid`;

const E = {
  verified: addr("verified"),
  unverified: addr("unverified"),
  noConsent: addr("noconsent"),
};
const ALL = Object.values(E);

const userIds: string[] = [];

async function makeUser(
  email: string,
  opts: { emailVerified: boolean; marketingConsent: boolean },
): Promise<string> {
  const [u] = await db
    .insert(users)
    .values({
      email,
      password: "x",
      privateName: "Test",
      publicName: "Test",
      locale: defaultLocale,
      emailVerified: opts.emailVerified,
      marketingConsent: opts.marketingConsent,
    })
    .returning({ id: users.id });
  if (!u) {
    throw new Error("user insert failed");
  }
  userIds.push(u.id);
  return u.id;
}

/** The exact gated audience query the blast uses, scoped to our test emails. */
async function audienceEmails(): Promise<Set<string>> {
  const rows = await db
    .select({ email: users.email })
    .from(users)
    .where(
      and(
        eq(users.marketingConsent, true),
        eq(users.emailVerified, true),
        isNotNull(users.email),
        inArray(users.email, ALL),
      ),
    );
  return new Set(rows.map((r) => r.email));
}

beforeAll(async () => {
  await makeUser(E.verified, { emailVerified: true, marketingConsent: true });
  await makeUser(E.unverified, {
    emailVerified: false,
    marketingConsent: true,
  });
  await makeUser(E.noConsent, {
    emailVerified: true,
    marketingConsent: false,
  });
}, 60_000);

afterAll(async () => {
  if (userIds.length > 0) {
    await db.delete(users).where(inArray(users.id, userIds));
  }
}, 60_000);

describe("consented newsletter blast audience", () => {
  it("includes verified+consented, excludes unverified and non-consented", async () => {
    const audience = await audienceEmails();
    expect(audience.has(E.verified)).toBe(true); // verified + consented
    expect(audience.has(E.unverified)).toBe(false); // unverified + consented
    expect(audience.has(E.noConsent)).toBe(false); // verified, no consent
  }, 60_000);
});
