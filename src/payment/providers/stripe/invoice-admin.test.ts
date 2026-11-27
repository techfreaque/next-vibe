import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { pgliteReady } from "next-vibe/database/client";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import Stripe from "stripe";
import { expect, it, vi } from "vitest";

import invoice from "../../invoice/definition";
import { StripeAdminToolsImpl } from "./admin";
import { StripeProvider } from "./repository";

type StripeHttpRequest = InstanceType<typeof Stripe.HttpClient>["makeRequest"];

it("creates the invoice on the selected account with its due date and validates the Stripe response", async () => {
  await pgliteReady;
  const admin = await resolveTestAdminUser();
  const providerCustomer = "cus_invoice_fixture";
  const providerInvoice = "in_invoice_fixture";
  const dueDate = new Date(Date.now() + 86400_000);
  const dueSeconds = Math.floor(dueDate.getTime() / 1000);
  const forms = new Map<string, URLSearchParams>();
  const stripe = new Stripe("sk_test_invoice_fixture", {
    httpClient: {
      getClientName: (): string => "invoice-fixture",
      async makeRequest(
        ...[, , path, method, , body]: Parameters<StripeHttpRequest>
      ): ReturnType<StripeHttpRequest> {
        forms.set(`${method} ${path}`, new URLSearchParams(body));
        const response =
          method === "GET"
            ? { id: providerCustomer, object: "customer" }
            : {
                id: providerInvoice,
                object: "invoice",
                number: "INV-104",
                status: "open",
                due_date: dueSeconds,
                created: 1700000000,
              };
        return {
          getStatusCode: (): number => 200,
          getHeaders: (): Record<string, string> => ({}),
          getRawResponse: (): typeof response => response,
          toStream: (): null => null,
          toJSON: async (): Promise<typeof response> => response,
        };
      },
    },
  });
  const getStripe = vi
    .spyOn(StripeProvider, "getStripe")
    .mockReturnValue(stripe);
  let customerId: string | undefined;
  try {
    const created = await createTestUser(
      `invoice-provider-${crypto.randomUUID()}@example.test`,
    );
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    customerId = created.data.user.id;
    await db
      .update(users)
      .set({ stripeCustomerId: providerCustomer })
      .where(eq(users.id, customerId));
    const tools = new StripeAdminToolsImpl();
    const result = await tools.createInvoice(
      admin.id,
      { customerId, dueDate, amount: 99.99, currency: "EUR" },
      "en-US",
      createEndpointLogger(false, "en-US"),
    );
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(invoice.POST.responseSchema.safeParse(result.data).success).toBe(
      true,
    );
    expect(result.data.invoice).toMatchObject({
      id: providerInvoice,
      userId: customerId,
      dueDate: new Date(dueSeconds * 1000),
    });
    expect(forms.get("POST /v1/invoices")?.get("customer")).toBe(
      providerCustomer,
    );
    expect(forms.get("POST /v1/invoices")?.get("due_date")).toBe(
      String(dueSeconds),
    );
    expect(forms.get("POST /v1/invoiceitems")?.get("amount")).toBe("9999");
  } finally {
    getStripe.mockRestore();
    if (customerId) {
      await deleteTestUser(customerId);
    }
  }
});
