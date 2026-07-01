/**
 * Catalog Product Ownership tests
 *
 * Tests the ownership and authorization logic in:
 * - products/catalog/[productId]/update/route.ts
 *
 * Scenarios:
 * - Personal product (no companyId): any call without ownerUserId match fails NOT_FOUND
 * - Personal product: ownerUserId match succeeds
 * - Company product: ownerUserId match + ADMIN role succeeds
 * - Company product: ownerUserId match but MEMBER role → FORBIDDEN (company auth takes precedence)
 *
 * Uses real DB. Creates and cleans up test fixtures.
 */

import { and, eq } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { companies, companyMembers } from "../../companies/db";
import { CompanyMemberRole } from "../../companies/enum";
import updateEndpoints from "../catalog/[productId]/update/definition";
import { catalogProducts } from "../db";

const TEST_TIMEOUT = 60_000;

// ── Test suite ────────────────────────────────────────────────────────────────

describe("Catalog Product Ownership Auth", () => {
  let adminUser: JwtPrivatePayloadType;
  let testCompanyId: string;
  let personalProductId: string;
  let companyProductId: string;

  beforeAll(async () => {
    adminUser = await resolveTestAdminUser();
    const adminUserId = adminUser.id;

    // Create a test company
    const [company] = await db
      .insert(companies)
      .values({
        name: "Test Catalog Company",
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

    // Add admin as ADMIN of the company (for company product tests)
    await db
      .insert(companyMembers)
      .values({
        companyId: testCompanyId,
        userId: adminUserId,
        role: CompanyMemberRole.ADMIN,
        invitedByUserId: adminUserId,
        isActive: true,
      })
      .onConflictDoNothing();

    // Create a personal product (no companyId)
    const [personalProduct] = await db
      .insert(catalogProducts)
      .values({
        ownerUserId: adminUserId,
        companyId: null,
        name: "Test Personal Product",
        type: "enums.productType.service",
        basePrice: 100,
        currency: "EUR",
      })
      .returning({ id: catalogProducts.id });

    if (!personalProduct) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error("Failed to create personal product");
    }
    personalProductId = personalProduct.id;

    // Create a company product (has companyId)
    const [companyProduct] = await db
      .insert(catalogProducts)
      .values({
        ownerUserId: adminUserId,
        companyId: testCompanyId,
        name: "Test Company Product",
        type: "enums.productType.service",
        basePrice: 200,
        currency: "EUR",
      })
      .returning({ id: catalogProducts.id });

    if (!companyProduct) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error("Failed to create company product");
    }
    companyProductId = companyProduct.id;
  }, TEST_TIMEOUT);

  afterAll(async () => {
    // Clean up products first, then company (FK constraint)
    if (personalProductId) {
      await db
        .delete(catalogProducts)
        .where(eq(catalogProducts.id, personalProductId));
    }
    if (companyProductId) {
      await db
        .delete(catalogProducts)
        .where(eq(catalogProducts.id, companyProductId));
    }
    if (testCompanyId) {
      await db.delete(companies).where(eq(companies.id, testCompanyId));
    }
  });

  // ── Personal product ──────────────────────────────────────────────────────

  it(
    "CP1: personal product owner can update it successfully",
    async () => {
      const result = await sendTestRequest({
        endpoint: updateEndpoints.PATCH,
        data: { fields: { name: "Updated Personal Product" } },
        urlPathParams: { productId: personalProductId },
        user: adminUser,
      });

      expect(result.success, `Update failed: ${result.success ? "" : JSON.stringify(result)}`).toBe(true);
      if (result.success) {
        expect(result.data.result.id).toBe(personalProductId);
        expect(result.data.result.name).toBe("Updated Personal Product");
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "CP2: non-owner cannot update personal product (NOT_FOUND)",
    async () => {
      // Same roles as admin but different id — passes endpoint auth, fails product ownership check
      const nonOwnerUser: JwtPrivatePayloadType = {
        ...adminUser,
        id: "00000000-0000-0000-0000-000000000011",
      };
      const result = await sendTestRequest({
        endpoint: updateEndpoints.PATCH,
        data: { fields: { name: "Hacked" } },
        urlPathParams: { productId: personalProductId },
        user: nonOwnerUser,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        // Query filters by ownerUserId so non-owner gets NOT_FOUND (not FORBIDDEN)
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.NOT_FOUND.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "CP3: empty fields object returns VALIDATION_ERROR",
    async () => {
      const result = await sendTestRequest({
        endpoint: updateEndpoints.PATCH,
        data: { fields: {} },
        urlPathParams: { productId: personalProductId },
        user: adminUser,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.VALIDATION_ERROR.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  // ── Company product ───────────────────────────────────────────────────────

  it(
    "CP4: company product owner with ADMIN role can update it",
    async () => {
      // Admin has ADMIN role in the company (set in beforeAll)
      const result = await sendTestRequest({
        endpoint: updateEndpoints.PATCH,
        data: { fields: { name: "Updated Company Product" } },
        urlPathParams: { productId: companyProductId },
        user: adminUser,
      });

      expect(result.success, `Update failed: ${result.success ? "" : JSON.stringify(result)}`).toBe(true);
      if (result.success) {
        expect(result.data.result.id).toBe(companyProductId);
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "CP5: company product — downgraded to MEMBER role returns FORBIDDEN",
    async () => {
      const adminUserId = adminUser.id;

      // Downgrade to MEMBER
      await db
        .update(companyMembers)
        .set({ role: CompanyMemberRole.MEMBER })
        .where(
          and(
            eq(companyMembers.userId, adminUserId),
            eq(companyMembers.companyId, testCompanyId),
          ),
        );

      const result = await sendTestRequest({
        endpoint: updateEndpoints.PATCH,
        data: { fields: { name: "Should Fail" } },
        urlPathParams: { productId: companyProductId },
        user: adminUser,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.FORBIDDEN.errorCode,
        );
      }

      // Restore ADMIN role
      await db
        .update(companyMembers)
        .set({ role: CompanyMemberRole.ADMIN })
        .where(
          and(
            eq(companyMembers.userId, adminUserId),
            eq(companyMembers.companyId, testCompanyId),
          ),
        );
    },
    TEST_TIMEOUT,
  );
});
