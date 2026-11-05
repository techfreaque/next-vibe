/**
 * E2E: the invoice link a customer gets by email — /invoice/[invoiceId]?token=…
 * Requires a server (Atlas dev by default): `vibe dev`.
 */

import { describe, expect } from "vitest";

import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { recordPage } from "next-vibe/tooling/testing/e2e/coverage";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import {
  e2eEndpointId,
  EndpointForm,
} from "next-vibe/tooling/testing/e2e/endpoint-form";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { paymentInvoiceLines, paymentInvoices } from "../../../db";
import { InvoiceStatus } from "../../../enum";
import { scopedTranslation as paymentScopedTranslation } from "../../../i18n";
import { generateInvoiceViewToken } from "../../token";
import invoicePublicViewEndpoints from "./definition";
import { scopedTranslation } from "./i18n";

const endpoint = invoicePublicViewEndpoints.GET;
const { t } = scopedTranslation.scopedT(defaultLocale);
const paymentT = paymentScopedTranslation.scopedT(defaultLocale).t;

/**
 * Customers land on /invoice/[invoiceId]?token=… (src/_pages/invoice), which
 * mounts this endpoint via EndpointsPage. A running TanStack dev server only
 * learns new page routes on restart, so until Atlas dev restarts the same
 * widget is driven through its tool page. After a restart, switch to:
 *   (invoiceId, token) => `/invoice/${invoiceId}${token ? `?token=${token}` : ""}`
 */
const TOOL_PAGE = `/tools/${endpointToUrlSegment(endpoint)}`;
function invoicePage(invoiceId: string, token?: string): string {
  const query = new URLSearchParams({ invoiceId });
  if (token !== undefined) {
    query.set("token", token);
  }
  return `${TOOL_PAGE}?${query.toString()}`;
}

/** An OPEN (sent) invoice with one line, owned by a throwaway account. */
async function sentInvoice(fixtures: E2EFixtures): Promise<{
  invoiceId: string;
  invoiceNumber: string;
  token: string;
}> {
  const created = await createTestUser(fixtures.uniqueEmail("invoice-view"));
  expect(created.success, JSON.stringify(created)).toBe(true);
  if (!created.success) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error("test user creation failed");
  }
  const owner = created.data.user;
  // Invoices and their lines cascade with the owning user
  fixtures.cleanup(() => deleteTestUser(owner.id));

  const invoiceNumber = `E2E-${owner.id.slice(0, 8)}`;
  const [invoice] = await db
    .insert(paymentInvoices)
    .values({
      userId: owner.id,
      providerInvoiceId: `e2e_${owner.id}`,
      invoiceNumber,
      amount: "119.00",
      currency: "EUR",
      status: InvoiceStatus.OPEN,
      notes: "Thanks for building with us.",
    })
    .returning({ id: paymentInvoices.id });
  await db.insert(paymentInvoiceLines).values({
    invoiceId: invoice.id,
    description: "E2E consulting hour",
    quantity: 1,
    unitPrice: 100,
    taxRate: 19,
    taxAmount: 19,
    lineTotal: 119,
  });
  return {
    invoiceId: invoice.id,
    invoiceNumber,
    token: generateInvoiceViewToken(invoice.id),
  };
}

describe("E2E: public invoice view", () => {
  const e2e = useE2E("payment/invoice/public-view");

  e2e.it("opens the emailed invoice link and shows the invoice", async (fixtures) => {
    const { invoiceId, invoiceNumber, token } = await sentInvoice(fixtures);

    // With a valid token the page loads straight into the invoice — the token
    // field never shows, so `open()` has nothing to anchor on. Record, load,
    // wait for React to own the page, take the call it fires on mount.
    const form = new EndpointForm(fixtures.page, endpoint);
    await form.attach();
    await fixtures.goto(invoicePage(invoiceId, token));
    await fixtures.page
      .locator("[data-hydrated]")
      .first()
      .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS });
    recordPage(e2eEndpointId(endpoint), TOOL_PAGE);
    const call = await form.firstCall();
    expect(call.requestBody).toMatchObject({ token });
    expect(call.response.success, JSON.stringify(call.response)).toBe(true);
    if (!call.response.success) return;
    expect(call.response.data.invoiceNumber).toBe(invoiceNumber);

    const { page } = fixtures;
    await page.getByText(invoiceNumber).first().waitFor();
    await page.getByText("E2E consulting hour").first().waitFor();
    // Status reads as a word, not an enum key
    await page
      .getByText(paymentT(InvoiceStatus.OPEN), { exact: true })
      .first()
      .waitFor();
    expect(await page.getByText(InvoiceStatus.OPEN).count()).toBe(0);
  });

  e2e.it("refuses a forged token and asks for the real one", async (fixtures) => {
    const { invoiceId, token } = await sentInvoice(fixtures);
    const forged = `${token.slice(0, -4)}0000`;

    const form = await fixtures.open(endpoint, {
      query: { invoiceId, token: forged },
    });
    const call = await form.firstCall();
    expect(call.response.success).toBe(false);
    expect(call.status).toBe(403);
    await fixtures.page
      .getByText(t("get.errors.forbidden.title"))
      .first()
      .waitFor();
  });

  e2e.it("blocks opening without a token", async (fixtures) => {
    const { invoiceId } = await sentInvoice(fixtures);
    const form = await fixtures.open(endpoint, { query: { invoiceId } });
    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) return;
    expect(Object.keys(result.fieldErrors)).toEqual(["token"]);
  });
});
