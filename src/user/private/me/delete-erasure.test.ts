/**
 * Account deletion — erasure coverage + transactionality (real DB).
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { leads } from "next-vibe/identity/lead/db";
import { userAddresses, users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { contacts } from "../../../contact/db";
import { newsletterSubscriptions } from "../../../newsletter/db";
import { scopedTranslation } from "./i18n";
import { UserProfileRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);
const stamp = Date.now();
const email = `erase-${stamp}@example.com`;

let account: TestUser;
let contactId: string;

async function userExists(): Promise<boolean> {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, account.user.id));
  return rows.length > 0;
}

describe("account erasure", () => {
  beforeAll(async () => {
    const created = await createTestUser(email);
    if (!created.success) {
      throw new Error("seed failed");
    }
    account = created.data;
    await db
      .update(leads)
      .set({ email, contactName: "Erase Me", phone: "+4912345", ipAddress: "1.2.3.4" })
      .where(eq(leads.id, account.user.leadId));
    await db.insert(newsletterSubscriptions).values({ email, userId: account.user.id });
    await db.insert(userAddresses).values({
      userId: account.user.id,
      label: "home",
      addressLine1: "Erase St 1",
      city: "Berlin",
      country: "DE",
    });
    const [c] = await db
      .insert(contacts)
      .values({ name: "Erase Me", email, subject: "hi", message: "secret", userId: account.user.id })
      .returning({ id: contacts.id });
    contactId = c?.id ?? "";
  });

  afterAll(async () => {
    await db.execute(sql`DROP TRIGGER IF EXISTS test_block_user_delete ON users`);
    await db.execute(sql`DROP FUNCTION IF EXISTS test_block_user_delete()`);
    if (await userExists()) {
      await deleteTestUser(account.user.id);
    }
    await db.delete(contacts).where(eq(contacts.id, contactId));
  });

  it("rolls everything back when a statement fails mid-transaction", async () => {
    await db.execute(sql`
      CREATE FUNCTION test_block_user_delete() RETURNS trigger AS $$
      BEGIN RAISE EXCEPTION 'blocked'; END; $$ LANGUAGE plpgsql`);
    await db.execute(sql`
      CREATE TRIGGER test_block_user_delete BEFORE DELETE ON users
      FOR EACH ROW EXECUTE FUNCTION test_block_user_delete()`);

    const result = await UserProfileRepository.deleteAccount(
      account.user,
      defaultLocale,
      logger,
      t,
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe(t("delete.errors.internal.retry"));
      expect(result.message).not.toContain("blocked");
    }
    expect(await userExists()).toBe(true);
    const [lead] = await db.select({ email: leads.email }).from(leads).where(eq(leads.id, account.user.leadId));
    expect(lead?.email).toBe(email);
    const news = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email));
    expect(news).toHaveLength(1);

    await db.execute(sql`DROP TRIGGER test_block_user_delete ON users`);
  });

  it("erases or anonymizes all personal data", async () => {
    const result = await UserProfileRepository.deleteAccount(
      account.user,
      defaultLocale,
      logger,
      t,
    );
    expect(result.success).toBe(true);
    expect(await userExists()).toBe(false);

    const [lead] = await db.select().from(leads).where(eq(leads.id, account.user.leadId));
    expect(lead?.email).toBeNull();
    expect(lead?.contactName).toBeNull();
    expect(lead?.phone).toBeNull();
    expect(lead?.ipAddress).toBeNull();
    expect(lead?.convertedUserId).toBeNull();

    expect(await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email))).toHaveLength(0);
    expect(await db.select().from(userAddresses).where(eq(userAddresses.userId, account.user.id))).toHaveLength(0);

    const [contact] = await db.select().from(contacts).where(eq(contacts.id, contactId));
    expect(contact?.email).toBeNull();
    expect(contact?.message).toBe("");
    expect(contact?.userId).toBeNull();
  });
});
