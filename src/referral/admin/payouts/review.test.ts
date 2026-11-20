import { describe, expect, test } from "bun:test";
import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";

import grant from "@/credits/admin-add/definition";
import ledger from "@/credits/history/definition";

import { PayoutCurrency, PayoutStatus } from "../../enum";
import { getAdminPayoutActions } from "../../payout-actions";
import payouts from "./definition";

const customer: JwtPrivatePayloadType = {
  isPublic: false,
  id: "123e4567-e89b-12d3-a456-426614174000",
  leadId: "123e4567-e89b-12d3-a456-426614174001",
  roles: [UserRole.CUSTOMER],
};

describe("credit grants and partner payout review", () => {
  test("only administrators can verify a recipient, grant credits or review payouts", () => {
    const admin: JwtPrivatePayloadType = { ...customer, roles: [UserRole.ADMIN] };
    for (const endpoint of [grant.GET, grant.POST, payouts.GET, payouts.POST]) {
      expect(
        permissionsRegistry.validateEndpointAccess(endpoint, customer, Platform.NEXT_API).allowed,
      ).toBe(false);
      expect(
        permissionsRegistry.validateEndpointAccess(endpoint, admin, Platform.NEXT_API).allowed,
      ).toBe(true);
    }
    expect(
      permissionsRegistry.validateEndpointAccess(ledger.GET, customer, Platform.NEXT_API).allowed,
    ).toBe(true);
  });

  test("uses the verified account ID and preserves an exact whole-credit grant", () => {
    const recipient = grant.GET.responseSchema.parse(grant.GET.examples.responses?.default);
    expect(recipient).toEqual({ id: customer.id, email: "customer@example.test" });
    expect(grant.POST.requestSchema.parse({ targetUserId: recipient.id, amount: "137" })).toEqual({
      targetUserId: recipient.id,
      amount: 137,
    });
    for (const amount of ["", "137.5", "-137"]) {
      expect(
        grant.POST.requestSchema.safeParse({ targetUserId: recipient.id, amount }).success,
      ).toBe(false);
    }
    const history = ledger.GET.responseSchema.parse(ledger.GET.examples.responses?.adminLedger);
    expect(history.transactions.map(({ amount }) => amount)).toEqual([-2505, -0.176985, 137]);
  });

  test("keeps email, status and exact partner scope when reading a different page", () => {
    expect(
      payouts.GET.requestSchema.parse({
        status: PayoutStatus.APPROVED,
        search: " partner@example.test ",
        userId: customer.id,
        page: "2",
        limit: "10",
      }),
    ).toEqual({
      status: PayoutStatus.APPROVED,
      search: "partner@example.test",
      userId: customer.id,
      page: 2,
      limit: 10,
    });
    expect(payouts.GET.requestSchema.safeParse({ page: 0 }).success).toBe(false);
    expect(payouts.GET.requestSchema.safeParse({ limit: 101 }).success).toBe(false);

    const pending = payouts.GET.responseSchema.parse(payouts.GET.examples.responses?.pending);
    expect(pending.items[0]).toMatchObject({
      userId: customer.id,
      amountCents: 2505,
      status: PayoutStatus.PENDING,
      currency: PayoutCurrency.USDC,
    });
    const second = payouts.GET.responseSchema.parse(payouts.GET.examples.responses?.secondPage);
    expect(second).toMatchObject({ resultPage: 2, pageSize: 1, totalCount: 2 });
    expect(payouts.GET.responseSchema.parse(payouts.GET.examples.responses?.empty).items).toEqual(
      [],
    );
  });

  test("limits manual actions to pending or approved crypto payouts", () => {
    expect(
      getAdminPayoutActions({ currency: PayoutCurrency.USDC, status: PayoutStatus.PENDING }),
    ).toEqual(["approve", "reject"]);
    expect(
      getAdminPayoutActions({ currency: PayoutCurrency.BTC, status: PayoutStatus.APPROVED }),
    ).toEqual(["complete"]);
    for (const status of [
      PayoutStatus.REJECTED,
      PayoutStatus.PROCESSING,
      PayoutStatus.COMPLETED,
      PayoutStatus.FAILED,
    ]) {
      expect(getAdminPayoutActions({ currency: PayoutCurrency.USDC, status })).toEqual([]);
    }
    expect(
      getAdminPayoutActions({ currency: PayoutCurrency.CREDITS, status: PayoutStatus.PENDING }),
    ).toEqual([]);
    expect(
      getAdminPayoutActions({ currency: PayoutCurrency.CREDITS, status: PayoutStatus.APPROVED }),
    ).toEqual([]);
  });
});
