/**
 * POS Order Complete integration tests
 *
 * Tests PosOrderCompleteRepository.completeOrder() with a live DB:
 * - Fails if order status is not OPEN (CONFLICT)
 * - Fails if total paid < order total (CONFLICT)
 * - Succeeds if total paid >= order total (order marked COMPLETED)
 * - Order not found returns NOT_FOUND
 *
 * Uses real DB. Creates and cleans up test fixtures (terminal → session → orders).
 * The journal posting is best-effort and is tested only for the presence of the
 * journalEntryId when accounting data is set up, but its absence does not block
 * order completion.
 */

import { eq } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { db } from "@/app/api/[locale]/system/db";
import { createEndpointLogger } from "@/app/api/[locale]/system/logger/server";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { UserDetailLevel } from "@/app/api/[locale]/user/enum";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import { env } from "@/config/env";
import { defaultLocale } from "@/i18n/core/config";

import { companies, companyMembers } from "../../companies/db";
import { CompanyMemberRole } from "../../companies/enum";
import { posOrders, posPayments, posSessions, posTerminals } from "../db";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "../enum";
import { PosOrderCompleteRepository } from "../order/[orderId]/complete/repository";

const TEST_TIMEOUT = 60_000;

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeLogger(): EndpointLogger {
  return createEndpointLogger(false, defaultLocale);
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

describe("POS Order Complete", () => {
  let adminUserId: string;
  let testCompanyId: string;
  let testTerminalId: string;
  let testSessionId: string;

  /** IDs of orders to clean up (they cascade-delete payments) */
  const createdOrderIds: string[] = [];

  const nonExistentOrderId = "00000000-0000-0000-0000-000000000099";

  beforeAll(async () => {
    const userId = await resolveUserId(env.VIBE_ADMIN_USER_EMAIL);
    if (!userId) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(
        `${env.VIBE_ADMIN_USER_EMAIL} not found — run: vibe seed`,
      );
    }
    adminUserId = userId;

    // Create a test company
    const [company] = await db
      .insert(companies)
      .values({
        name: "Test POS Company",
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

    // Add admin as MEMBER of the company
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

    // Create a terminal
    const [terminal] = await db
      .insert(posTerminals)
      .values({
        companyId: testCompanyId,
        name: "Test Terminal",
        currency: "EUR",
        isActive: true,
      })
      .returning({ id: posTerminals.id });
    if (!terminal) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error("Failed to create terminal");
    }
    testTerminalId = terminal.id;

    // Create an open session
    const [session] = await db
      .insert(posSessions)
      .values({
        terminalId: testTerminalId,
        cashierUserId: adminUserId,
        status: PosSessionStatus.OPEN,
        openingFloat: 0,
      })
      .returning({ id: posSessions.id });
    if (!session) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error("Failed to create session");
    }
    testSessionId = session.id;
  }, TEST_TIMEOUT);

  afterAll(async () => {
    // Orders cascade-delete payments, so just delete orders
    for (const orderId of createdOrderIds) {
      await db.delete(posOrders).where(eq(posOrders.id, orderId));
    }
    // Clean session → terminal → company
    if (testSessionId) {
      await db.delete(posSessions).where(eq(posSessions.id, testSessionId));
    }
    if (testTerminalId) {
      await db.delete(posTerminals).where(eq(posTerminals.id, testTerminalId));
    }
    if (testCompanyId) {
      await db.delete(companies).where(eq(companies.id, testCompanyId));
    }
  });

  /** Helper: create a test order with given total, return orderId */
  async function createTestOrder(total: number): Promise<string> {
    const now = new Date();
    const orderNumber = `TEST-${now.getTime()}`;
    const [order] = await db
      .insert(posOrders)
      .values({
        sessionId: testSessionId,
        orderNumber,
        currency: "EUR",
        status: PosOrderStatus.OPEN,
        subtotal: total,
        taxAmount: 0,
        total,
      })
      .returning({ id: posOrders.id });
    createdOrderIds.push(order.id);
    return order.id;
  }

  /** Helper: add a payment to an order */
  async function addPayment(orderId: string, amount: number): Promise<void> {
    await db.insert(posPayments).values({
      orderId,
      method: PosPaymentMethod.CASH,
      amount,
      change: 0,
    });
  }

  // ── NOT_FOUND ─────────────────────────────────────────────────────────────

  it(
    "OC1: non-existent order returns NOT_FOUND",
    async () => {
      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId: nonExistentOrderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.NOT_FOUND.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  // ── Status check: order not OPEN ──────────────────────────────────────────

  it(
    "OC2: completed order cannot be completed again (CONFLICT)",
    async () => {
      // Create an order and mark it COMPLETED directly
      const orderId = await createTestOrder(50);
      await db
        .update(posOrders)
        .set({ status: PosOrderStatus.COMPLETED })
        .where(eq(posOrders.id, orderId));

      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.CONFLICT.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "OC3: voided order cannot be completed (CONFLICT)",
    async () => {
      const orderId = await createTestOrder(50);
      await db
        .update(posOrders)
        .set({ status: PosOrderStatus.VOIDED })
        .where(eq(posOrders.id, orderId));

      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.CONFLICT.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  // ── Payment insufficient ──────────────────────────────────────────────────

  it(
    "OC4: underpayment (paid < total) returns CONFLICT",
    async () => {
      const orderId = await createTestOrder(100);
      await addPayment(orderId, 50); // only half paid

      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType?.errorCode).toBe(
          ErrorResponseTypes.CONFLICT.errorCode,
        );
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "OC5: zero-total order with no payment succeeds (nothing owed)",
    async () => {
      const orderId = await createTestOrder(0);
      // No payment added - order total is 0

      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(
        result.success,
        `OC5 failed: ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);
      if (result.success) {
        expect(result.data.result.status).toBe(PosOrderStatus.COMPLETED);
      }
    },
    TEST_TIMEOUT,
  );

  // ── Successful completion ─────────────────────────────────────────────────

  it(
    "OC6: exact payment marks order COMPLETED",
    async () => {
      const orderId = await createTestOrder(119);
      await addPayment(orderId, 119); // exact payment

      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(
        result.success,
        `OC6 failed: ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);
      if (result.success) {
        expect(result.data.result.id).toBe(orderId);
        expect(result.data.result.status).toBe(PosOrderStatus.COMPLETED);
        expect(result.data.result.total).toBe(119);
      }

      // Verify in DB
      const [updated] = await db
        .select({ status: posOrders.status })
        .from(posOrders)
        .where(eq(posOrders.id, orderId));
      expect(updated.status).toBe(PosOrderStatus.COMPLETED);
    },
    TEST_TIMEOUT,
  );

  it(
    "OC7: overpayment (paid > total) also marks order COMPLETED",
    async () => {
      const orderId = await createTestOrder(100);
      await addPayment(orderId, 150); // 50 change

      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(
        result.success,
        `OC7 failed: ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);
      if (result.success) {
        expect(result.data.result.status).toBe(PosOrderStatus.COMPLETED);
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "OC8: split payment (two payments summing >= total) marks order COMPLETED",
    async () => {
      const orderId = await createTestOrder(200);
      await addPayment(orderId, 100);
      await addPayment(orderId, 100);

      const result = await PosOrderCompleteRepository.completeOrder(
        { orderId },
        adminUserId,
        makeLogger(),
        defaultLocale,
      );

      expect(
        result.success,
        `OC8 failed: ${result.success ? "" : JSON.stringify(result)}`,
      ).toBe(true);
      if (result.success) {
        expect(result.data.result.status).toBe(PosOrderStatus.COMPLETED);
      }
    },
    TEST_TIMEOUT,
  );
});
