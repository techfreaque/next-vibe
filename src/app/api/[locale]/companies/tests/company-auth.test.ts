/**
 * CompanyAuthRepository unit tests
 *
 * Tests CompanyAuthRepository.requireMember() with a live DB:
 * - Returns success when user is a valid active member with sufficient role
 * - Returns FORBIDDEN when user's role is below the required minimum
 * - Returns FORBIDDEN when user is not a member of the company
 * - Returns FORBIDDEN when no minimumRole is specified (any active member passes)
 *
 * Uses real DB (same pattern as existing route.test.ts suites).
 * Creates and cleans up test fixtures in beforeAll/afterAll.
 */

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import { companies, companyMembers } from "../db";
import { CompanyMemberRole } from "../enum";
import { CompanyAuthRepository } from "../repository";

const TEST_TIMEOUT = 60_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeLogger(): EndpointLogger {
  return createEndpointLogger(false, Date.now(), defaultLocale);
}

async function resolveUserId(email: string): Promise<string | null> {
  const logger = makeLogger();
  const result = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!result.success || !result.data) {
    return null;
  }
  return result.data.id;
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe("CompanyAuthRepository.requireMember", () => {
  let adminUserId: string;
  let testCompanyId: string;
  const nonExistentUserId = "00000000-0000-0000-0000-000000000001";
  const nonExistentCompanyId = "00000000-0000-0000-0000-000000000002";

  beforeAll(async () => {
    const userId = await resolveUserId(env.VIBE_ADMIN_USER_EMAIL);
    if (!userId) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`);
    }
    adminUserId = userId;

    // Create a test company owned by the admin
    const [company] = await db
      .insert(companies)
      .values({
        name: "Test Auth Company",
        type: "enums.companyType.b2b",
        ownerUserId: adminUserId,
        currency: "EUR",
      })
      .returning({ id: companies.id });

    if (!company) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error("Failed to create test company");
    }
    testCompanyId = company.id;

    // Upsert admin as MEMBER (not OWNER/ADMIN) for role-check tests
    await db
      .insert(companyMembers)
      .values({
        companyId: testCompanyId,
        userId: adminUserId,
        role: CompanyMemberRole.MEMBER,
        invitedByUserId: adminUserId,
        isActive: true,
      })
      .onConflictDoNothing();
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (testCompanyId) {
      // cascade deletes members
      await db.delete(companies).where(
        require("drizzle-orm").eq(companies.id, testCompanyId),
      );
    }
  });

  // ── Success cases ─────────────────────────────────────────────────────────

  it(
    "CA1: active member with exact required role succeeds",
    async () => {
      // Admin is MEMBER — require MEMBER → should pass
      const result = await CompanyAuthRepository.requireMember(
        adminUserId,
        testCompanyId,
        CompanyMemberRole.MEMBER,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success, `requireMember failed: ${result.success ? "" : JSON.stringify(result)}`).toBe(true);
      if (result.success) {
        expect(result.data.userId).toBe(adminUserId);
        expect(result.data.companyId).toBe(testCompanyId);
        expect(result.data.isActive).toBe(true);
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "CA2: no minimum role (null) accepts any active member",
    async () => {
      const result = await CompanyAuthRepository.requireMember(
        adminUserId,
        testCompanyId,
        null,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(true);
    },
    TEST_TIMEOUT,
  );

  // ── Forbidden: insufficient role ──────────────────────────────────────────

  it(
    "CA3: member with insufficient role returns FORBIDDEN",
    async () => {
      // Admin is MEMBER — require ADMIN → should fail
      const result = await CompanyAuthRepository.requireMember(
        adminUserId,
        testCompanyId,
        CompanyMemberRole.ADMIN,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "CA4: member with insufficient role (ACCOUNTANT > MEMBER) returns FORBIDDEN",
    async () => {
      // Admin is MEMBER — require ACCOUNTANT → should fail
      const result = await CompanyAuthRepository.requireMember(
        adminUserId,
        testCompanyId,
        CompanyMemberRole.ACCOUNTANT,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  // ── Forbidden: not a member ───────────────────────────────────────────────

  it(
    "CA5: non-member user returns FORBIDDEN",
    async () => {
      const result = await CompanyAuthRepository.requireMember(
        nonExistentUserId,
        testCompanyId,
        null,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  // ── Forbidden: company does not exist ─────────────────────────────────────

  it(
    "CA6: non-existent company returns FORBIDDEN",
    async () => {
      const result = await CompanyAuthRepository.requireMember(
        adminUserId,
        nonExistentCompanyId,
        null,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  // ── Inactive member ───────────────────────────────────────────────────────

  it(
    "CA7: inactive member returns FORBIDDEN even with correct role",
    async () => {
      // Deactivate the admin membership
      const { eq } = await import("drizzle-orm");
      await db
        .update(companyMembers)
        .set({ isActive: false })
        .where(
          eq(companyMembers.userId, adminUserId),
        );

      const result = await CompanyAuthRepository.requireMember(
        adminUserId,
        testCompanyId,
        CompanyMemberRole.MEMBER,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }

      // Re-activate for any subsequent tests
      await db
        .update(companyMembers)
        .set({ isActive: true })
        .where(
          eq(companyMembers.userId, adminUserId),
        );
    },
    TEST_TIMEOUT,
  );
});
