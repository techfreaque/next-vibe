import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  test,
} from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import { defaultLocale } from "../core/i18n/core/config";
import { hashPassword, verifyPassword } from "./auth/password";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from "./default-admin-password";
import { UserRole } from "./roles/enum";
import { userRoles, users } from "./user/db";

const pg = new PGlite();
const db = drizzle(pg);
const identityEnv = {
  VIBE_ADMIN_USER_EMAIL: String(DEFAULT_ADMIN_EMAIL),
  VIBE_ADMIN_USER_PASSWORD: String(DEFAULT_ADMIN_PASSWORD),
};
let sync: typeof import("./admin-login-sync").AdminLoginSyncRepository.sync;
let retire: typeof import("./placeholder-admin").retireShippedPlaceholderAdmin;

const placeholderId = crypto.randomUUID();
const establishedId = crypto.randomUUID();
const establishedEmail = `setup-review-${establishedId}@example.com`;
const newEmail = `setup-review-${placeholderId}@example.com`;
const newPassword = "new-fixture-password";
let shippedHash: string;
let establishedHash: string;

async function currentPassword(id: string): Promise<string | undefined> {
  const [row] = await db
    .select({ password: users.password })
    .from(users)
    .where(eq(users.id, id));
  return row?.password;
}

describe("first-run administrator credentials", () => {
  beforeAll(async () => {
    await pg.exec(`
      CREATE TABLE users (
        id uuid PRIMARY KEY, email text UNIQUE NOT NULL, password text NOT NULL,
        private_name text, public_name text, locale text,
        is_active boolean DEFAULT true, is_banned boolean DEFAULT false
      );
      CREATE TABLE user_roles (
        id uuid DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id), role text
      );
    `);
    mock.module("../database", () => ({ db }));
    mock.module("./env", () => ({ identityEnv }));
    const { AdminLoginSyncRepository } = await import("./admin-login-sync");
    sync = AdminLoginSyncRepository.sync;
    const { retireShippedPlaceholderAdmin } =
      await import("./placeholder-admin");
    retire = retireShippedPlaceholderAdmin;
    shippedHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
    establishedHash = await hashPassword("existing-fixture-password");
    await pg.query(
      `INSERT INTO users (id, email, password, private_name, public_name, locale)
       VALUES ($1, $2, $3, 'Fixture', 'Fixture', $7),
              ($4, $5, $6, 'Fixture', 'Fixture', $7)`,
      [
        placeholderId,
        DEFAULT_ADMIN_EMAIL,
        shippedHash,
        establishedId,
        establishedEmail,
        establishedHash,
        defaultLocale,
      ],
    );
    await pg.query(
      "INSERT INTO user_roles (user_id, role) VALUES ($1, $3), ($2, $3)",
      [placeholderId, establishedId, UserRole.ADMIN],
    );
  });

  beforeEach(async () => {
    identityEnv.VIBE_ADMIN_USER_EMAIL = DEFAULT_ADMIN_EMAIL;
    identityEnv.VIBE_ADMIN_USER_PASSWORD = DEFAULT_ADMIN_PASSWORD;
    await db
      .update(users)
      .set({ email: DEFAULT_ADMIN_EMAIL, password: shippedHash })
      .where(eq(users.id, placeholderId));
  });

  afterAll(async () => {
    await pg.close();
  });

  test("cannot take over an established admin or reset the placeholder from another account", async () => {
    const save = mock(() => Promise.resolve());
    expect(
      await sync(
        placeholderId,
        establishedEmail.toUpperCase(),
        newPassword,
        save,
      ),
    ).toBe(false);
    expect(await sync(establishedId, newEmail, newPassword, save)).toBe(false);
    expect(await currentPassword(establishedId)).toBe(establishedHash);
    expect(await currentPassword(placeholderId)).toBe(shippedHash);
    expect(save).not.toHaveBeenCalled();
  });

  test("configured instances cannot invoke first-run credential synchronization", async () => {
    identityEnv.VIBE_ADMIN_USER_EMAIL = establishedEmail;
    identityEnv.VIBE_ADMIN_USER_PASSWORD = newPassword;
    const save = mock(() => Promise.resolve());
    expect(await sync(placeholderId, newEmail, newPassword, save)).toBe(false);
    expect(await currentPassword(placeholderId)).toBe(shippedHash);
    expect(save).not.toHaveBeenCalled();
  });

  test("updates the placeholder account in place and preserves its admin role", async () => {
    const save = mock(() => Promise.resolve());
    expect(await sync(placeholderId, newEmail, newPassword, save)).toBe(true);
    const [row] = await db
      .select({ email: users.email, password: users.password })
      .from(users)
      .where(eq(users.id, placeholderId));
    expect(row?.email).toBe(newEmail);
    expect(await verifyPassword(newPassword, row?.password ?? "")).toBe(true);
    expect(
      await db
        .select({ role: userRoles.role })
        .from(userRoles)
        .where(eq(userRoles.userId, placeholderId)),
    ).toHaveLength(1);
    expect(save).toHaveBeenCalledTimes(1);
  });

  test("rolls back the login change when writing settings fails", async () => {
    const save = (): Promise<void> =>
      Promise.reject(new Error("fixture disk failure"));
    await expect(
      sync(placeholderId, newEmail, newPassword, save),
    ).rejects.toThrow("fixture disk failure");
    expect(await currentPassword(placeholderId)).toBe(shippedHash);
  });

  test("seed retirement changes only the exact admin placeholder with a shipped password", async () => {
    const configured = {
      VIBE_ADMIN_USER_EMAIL: establishedEmail,
      VIBE_ADMIN_USER_PASSWORD: newPassword,
    };
    await db
      .update(users)
      .set({ password: establishedHash })
      .where(eq(users.id, placeholderId));
    await retire(configured);
    expect(await currentPassword(placeholderId)).toBe(establishedHash);
    await db
      .update(users)
      .set({ password: shippedHash })
      .where(eq(users.id, placeholderId));
    await retire(configured);
    const retired = await currentPassword(placeholderId);
    expect(retired).not.toBe(shippedHash);
    expect(await verifyPassword(newPassword, retired ?? "")).toBe(false);
    expect(await currentPassword(establishedId)).toBe(establishedHash);
  });
});
