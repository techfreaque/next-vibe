/**
 * Catalog Product Ownership tests
 *
 * Tests the ownership and authorization logic in:
 * - products/catalog/[productId]/update/repository.ts
 *
 * Scenarios:
 * - Personal product (no companyId): any call without ownerUserId match fails NOT_FOUND
 * - Personal product: ownerUserId match succeeds
 * - Company product: ownerUserId match + ADMIN role succeeds
 * - Company product: ownerUserId match but MEMBER role → FORBIDDEN (company auth takes precedence)
 *
 * Uses real DB. Creates and cleans up test fixtures.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { defaultLocale } from "@/i18n/core/config";
import { env } from "@/config/env";

import { companies, companyMembers } from "../../companies/db";
import { CompanyMemberRole } from "../../companies/enum";
import { catalogProducts } from "../db";
import { CatalogUpdateRepository } from "../catalog/[productId]/update/repository";

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

describe("Catalog Product Ownership Auth", () => {
  let adminUserId: string;
  let testCompanyId: string;
  let personalProductId: string;
  let companyProductId: string;

  const nonExistentUserId = "00000000-0000-0000-0000-000000000011";

  beforeAll(async () => {
    const userId = await resolveUserId(env.VIBE_ADMIN_USER_EMAIL);
    expect(
      userId,
      `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe dev`,
    ).toBeTruthy();
    if (!userId) {
      return;
    }
    adminUserId = userId;

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

    expect(company, "Failed to create test company").toBeTruthy();
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

    expect(personalProduct, "Failed to create personal product").toBeTruthy();
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

    expect(companyProduct, "Failed to create company product").toBeTruthy();
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
      const result = await CatalogUpdateRepository.updateProduct(
        personalProductId,
        adminUserId,
        { fields: { name: "Updated Personal Product" } },
        makeLogger(),
        defaultLocale,
      );

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
      const result = await CatalogUpdateRepository.updateProduct(
        personalProductId,
        nonExistentUserId,
        { fields: { name: "Hacked" } },
        makeLogger(),
        defaultLocale,
      );

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
      const result = await CatalogUpdateRepository.updateProduct(
        personalProductId,
        adminUserId,
        { fields: {} },
        makeLogger(),
        defaultLocale,
      );

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
      const result = await CatalogUpdateRepository.updateProduct(
        companyProductId,
        adminUserId,
        { fields: { name: "Updated Company Product" } },
        makeLogger(),
        defaultLocale,
      );

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
      // Downgrade to MEMBER
      const { and } = await import("drizzle-orm");
      await db
        .update(companyMembers)
        .set({ role: CompanyMemberRole.MEMBER })
        .where(
          and(
            eq(companyMembers.userId, adminUserId),
            eq(companyMembers.companyId, testCompanyId),
          ),
        );

      const result = await CatalogUpdateRepository.updateProduct(
        companyProductId,
        adminUserId,
        { fields: { name: "Should Fail" } },
        makeLogger(),
        defaultLocale,
      );

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
