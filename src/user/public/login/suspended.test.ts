/**
 * Suspended (banned / deactivated) accounts: no login, no live token, no API
 * key. Suspending through the admin user-update path ends sessions and
 * revokes keys at once (incident 2026-11-17: is_banned was never enforced).
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { isAccountSuspended } from "next-vibe/identity/auth/repository";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { sessions } from "next-vibe/identity/session/db";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { clearLoginAttempts } from "next-vibe/tooling/testing/testing-suite/login-attempts";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
  TEST_USER_PASSWORD,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { userApiKeys } from "@/api-keys/db";
import { findActiveKey, generateApiKey } from "@/api-keys/keys";
import { UserByIdRepository } from "@/users/user/[id]/repository";

import loginEndpoints from "./definition";

const logger = createEndpointLogger(false, defaultLocale);
const TIMEOUT_MS = 60_000;

describe("suspended accounts", () => {
  let admin: JwtPrivatePayloadType;
  let userId = "";
  let leadId = "";
  const email = `suspended-${String(Date.now())}@example-test.invalid`;

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
    const created = await createTestUser(email);
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (created.success && !created.data.user.isPublic) {
      userId = created.data.user.id;
      leadId = created.data.user.leadId;
    }
  }, TIMEOUT_MS);

  afterAll(async () => {
    await clearLoginAttempts(email);
    if (userId) {
      await deleteTestUser(userId);
    }
  });

  async function login(): Promise<
    Awaited<ReturnType<typeof sendTestRequest<typeof loginEndpoints.POST>>>
  > {
    return await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: loginEndpoints.POST,
      data: { email, password: TEST_USER_PASSWORD, rememberMe: false },
      user: { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] },
    });
  }

  it(
    "admin ban: sessions end, keys revoked, login refused, unban restores login",
    async () => {
      expect((await login()).success).toBe(true);
      const generated = generateApiKey();
      await db.insert(userApiKeys).values({
        userId,
        name: "suspend-test",
        keyPrefix: generated.keyPrefix,
        hashedKey: generated.hashedKey,
      });
      expect(await isAccountSuspended(userId)).toBe(false);

      const banned = await UserByIdRepository.updateUser(
        { isBanned: true, bannedReason: "test" },
        { id: userId },
        admin,
        logger,
        defaultLocale,
      );
      expect(banned.success, JSON.stringify(banned)).toBe(true);
      expect(await isAccountSuspended(userId)).toBe(true);
      expect(
        await db.select().from(sessions).where(eq(sessions.userId, userId)),
      ).toHaveLength(0);
      expect(await findActiveKey(generated.plaintext)).toBeUndefined();

      const refused = await login();
      expect(refused.success).toBe(false);
      if (!refused.success) {
        expect(refused.errorType?.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }

      await db
        .update(users)
        .set({ isBanned: false })
        .where(eq(users.id, userId));
      expect((await login()).success).toBe(true);
    },
    TIMEOUT_MS,
  );

  it(
    "deactivated accounts are suspended too",
    async () => {
      await db
        .update(users)
        .set({ isActive: false })
        .where(eq(users.id, userId));
      try {
        expect(await isAccountSuspended(userId)).toBe(true);
        expect((await login()).success).toBe(false);
      } finally {
        await db
          .update(users)
          .set({ isActive: true })
          .where(eq(users.id, userId));
      }
    },
    TIMEOUT_MS,
  );
});
