import { permissionsRegistry } from "next-vibe/core/permissions/registry";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserRole } from "next-vibe/identity/roles/enum";
import { Platform } from "next-vibe/platforms/platforms";
import { describe, expect, it } from "vitest";

import subscriptionDefinitions from "@/subscription/admin/list/definition";

import { CheckoutMode, PaymentProvider, PaymentStatus } from "../enum";
import refundDefinitions from "../refund/definition";
import { canStartStripeRefund } from "../refund/eligibility";
import definitions from "./definition";
import { ProcessorView, WebhookProcessing } from "./enum";

const customer: JwtPrivatePayloadType = {
  isPublic: false,
  id: "22cca261-5789-4d02-aa9c-26d1b6b986af",
  leadId: "5484c849-b20e-4dde-8971-ef0da51059b6",
  roles: [UserRole.CUSTOMER],
};

describe("admin payment diagnostics", () => {
  it("admits administrators and rejects customers on both reads", () => {
    const admin: JwtPrivatePayloadType = { ...customer, roles: [UserRole.ADMIN] };
    for (const endpoint of [definitions.GET, subscriptionDefinitions.GET]) {
      expect(
        permissionsRegistry.validateEndpointAccess(endpoint, customer, Platform.NEXT_API).allowed,
      ).toBe(false);
      expect(
        permissionsRegistry.validateEndpointAccess(endpoint, admin, Platform.NEXT_API).allowed,
      ).toBe(true);
    }
  });

  it("keeps exact customer scope and validates the requested page", () => {
    const transactionId = "9dcfcdaa-6f32-4ea7-8180-4d662aaef27f";
    const input = definitions.GET.requestSchema.safeParse({
      userId: customer.id,
      transactionId,
      status: PaymentStatus.FAILED,
      page: "2",
      limit: "10",
    });
    expect(input.data).toMatchObject({
      view: ProcessorView.TRANSACTIONS,
      userId: customer.id,
      transactionId,
      status: PaymentStatus.FAILED,
      page: 2,
      limit: 10,
    });
    expect(definitions.GET.requestSchema.safeParse({ userId: "invalid" }).success).toBe(false);
    expect(
      definitions.GET.requestSchema.safeParse({
        view: ProcessorView.WEBHOOKS,
        processing: WebhookProcessing.UNPROCESSED,
      }).success,
    ).toBe(true);
    expect(definitions.GET.requestSchema.safeParse({ limit: 101 }).success).toBe(false);
    expect(
      subscriptionDefinitions.GET.requestSchema.safeParse({ userId: customer.id }).data?.userId,
    ).toBe(customer.id);
    expect(
      subscriptionDefinitions.GET.requestSchema.safeParse({
        paginationInfo: { page: 0, limit: 20 },
      }).success,
    ).toBe(false);
  });

  it("offers Stripe refunds only for settled monetary charges", () => {
    const transaction = {
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.SUCCEEDED,
      mode: CheckoutMode.SUBSCRIPTION,
      amount: "29.00",
      providerPaymentIntentId: "pi_test",
      providerSessionId: null,
    };
    expect(canStartStripeRefund(transaction)).toBe(true);
    expect(
      canStartStripeRefund({
        ...transaction,
        providerPaymentIntentId: null,
        providerSessionId: "cs_test",
      }),
    ).toBe(true);
    expect(
      canStartStripeRefund({
        ...transaction,
        providerPaymentIntentId: null,
        providerSessionId: "renewal:internal-key",
      }),
    ).toBe(false);
    expect(canStartStripeRefund({ ...transaction, amount: "0.00" })).toBe(false);
    expect(canStartStripeRefund({ ...transaction, provider: PaymentProvider.NOWPAYMENTS })).toBe(
      false,
    );
    expect(canStartStripeRefund({ ...transaction, mode: CheckoutMode.SETUP })).toBe(false);
    expect(canStartStripeRefund({ ...transaction, status: PaymentStatus.FAILED })).toBe(false);
    expect(canStartStripeRefund({ ...transaction, status: PaymentStatus.REFUNDED })).toBe(false);
  });

  it("keeps the saved account and currency visible for an exact refund review target", () => {
    const partial = refundDefinitions.POST.examples.requests?.eligibleReview;
    const input = definitions.GET.requestSchema.parse({
      transactionId: partial?.transactionId,
      limit: 1,
    });
    const response = definitions.GET.responseSchema.parse(
      definitions.GET.examples.responses?.eligible,
    );
    expect(response.transactions.find((row) => row.id === input.transactionId)).toMatchObject({
      userId: customer.id,
      userEmail: "billing-test@example.com",
      currency: "EUR",
      amount: 29,
      refundEligible: true,
    });
    expect(partial?.amount).toBe(7.5);
  });
});
