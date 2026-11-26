import { randomUUID } from "node:crypto";
import { mkdir } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  getAtlasFixture,
  prepareAtlasCompany,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";

import invoice from "../[invoiceId]/get/definition";
import delivery from "../[invoiceId]/send/definition";
import { InvoiceDeliveryRepository } from "../[invoiceId]/send/delivery-repository";
import {
  invoiceMailClaimSchema,
  type InvoiceMailOutcome,
  type InvoiceMailPayload,
} from "../[invoiceId]/send/delivery-state";

describe("Issued invoice delivery", () => {
  const e2e = useE2E("payment/invoice/delivery");
  e2e.it(
    "retrieves a scoped link, confirms the invoice recipient and never repeats an accepted or uncertain send",
    async (fixtures) => {
      const { page, cleanup } = fixtures;
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E Invoice Share Company",
      );
      cleanup(async () => {
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        expect(
          await db
            .select({ id: paymentInvoices.id })
            .from(paymentInvoices)
            .where(eq(paymentInvoices.companyId, companyId)),
        ).toEqual([]);
      });
      const viewerEmail = fixtures.uniqueEmail("invoice-share-viewer");
      cleanup(async () => {
        const [viewer] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, viewerEmail));
        if (viewer) {
          await db
            .delete(companyMembers)
            .where(eq(companyMembers.userId, viewer.id));
          await deleteTestUser(viewer.id);
        }
      });
      const viewer = await createTestUser(viewerEmail);
      expect(viewer.success).toBe(true);
      if (!viewer.success) return;
      await db.insert(companyMembers).values({
        companyId,
        userId: viewer.data.user.id,
        role: CompanyMemberRole.VIEWER,
      });

      const recipient = `buyer-${randomUUID().slice(0, 8)}@example.invalid`;
      const ids = {
        browser: randomUUID(),
        retry: randomUUID(),
        uncertain: randomUUID(),
        draft: randomUUID(),
        noRecipient: randomUUID(),
      };
      await db.insert(paymentInvoices).values(
        Object.entries(ids).map(
          ([key, id], index): typeof paymentInvoices.$inferInsert => ({
            id,
            userId,
            companyId,
            providerInvoiceId: `fixture-${id}`,
            invoiceNumber: `INV-${index + 1}`,
            amount: "120.00",
            currency: "EUR",
            status: key === "draft" ? InvoiceStatus.DRAFT : InvoiceStatus.OPEN,
            metadata:
              key === "noRecipient" ? null : { customerEmail: recipient },
          }),
        ),
      );
      const { t } = delivery.GET.scopedTranslation.scopedT(E2E_LOCALE);
      const { t: invoiceT } = invoice.GET.scopedTranslation.scopedT(E2E_LOCALE);
      const logger = createEndpointLogger(false, E2E_LOCALE);
      const send = (
        id: string,
        transport: (payload: InvoiceMailPayload) => Promise<InvoiceMailOutcome>,
      ) =>
        InvoiceDeliveryRepository.send(
          id,
          recipient,
          userId,
          E2E_LOCALE,
          logger,
          transport,
        );
      const readStatus = async (id: string): Promise<string> => {
        const [record] = await db
          .select({ metadata: paymentInvoices.metadata })
          .from(paymentInvoices)
          .where(eq(paymentInvoices.id, id));
        const state = z
          .object({ invoiceEmailDelivery: invoiceMailClaimSchema })
          .parse(record?.metadata);
        expect(JSON.stringify(state).includes("token=")).toBe(false);
        return state.invoiceEmailDelivery.status;
      };
      const viewerLink = await InvoiceDeliveryRepository.share(
        ids.browser,
        viewer.data.user.id,
        E2E_LOCALE,
        logger,
      );
      expect(viewerLink.success).toBe(false);
      expect(JSON.stringify(viewerLink).includes("token=")).toBe(false);
      expect(
        (
          await InvoiceDeliveryRepository.share(
            ids.browser,
            randomUUID(),
            E2E_LOCALE,
            logger,
          )
        ).success,
      ).toBe(false);

      const apiPath = (id: string): string =>
        `${fixtures.baseUrl}/api/${E2E_LOCALE}/payment/invoice/${id}/send`;
      const rejectedSend = async (
        id: string,
        expectedRecipient: string,
      ): Promise<Response> => {
        // oxlint-disable-next-line restricted/no-raw-fetch -- exercise the real Atlas PATCH with rejection before any transport
        return fetch(apiPath(id), {
          method: "PATCH",
          headers: { ...headers, "content-type": "application/json" },
          body: JSON.stringify({ expectedRecipient }),
          redirect: "error",
          signal: AbortSignal.timeout(30_000),
        });
      };
      expect(
        (await rejectedSend(ids.browser, "wrong@example.invalid")).status,
      ).toBe(409);
      expect((await rejectedSend(ids.noRecipient, recipient)).status).toBe(409);
      const draft = await getAtlasFixture(apiPath(ids.draft), {}, headers);
      expect(draft.status).toBe(409);
      expect(JSON.stringify(await draft.json()).includes("token=")).toBe(false);

      const acceptedPayloads: { invoiceId: string; to: string }[] = [];
      const released = Promise.withResolvers<void>();
      const entered = Promise.withResolvers<void>();
      const first = await send(ids.retry, () => Promise.resolve("retryable"));
      expect(first).toMatchObject({
        success: true,
        data: { deliveryStatus: "retryable" },
      });
      expect(await readStatus(ids.retry)).toBe("retryable");
      const active = send(ids.retry, async (payload) => {
        expect(await readStatus(ids.retry)).toBe("pending");
        acceptedPayloads.push({ invoiceId: ids.retry, to: payload.to });
        entered.resolve();
        await released.promise;
        return "accepted";
      });
      await entered.promise;
      try {
        const concurrent = await send(ids.retry, (payload) => {
          acceptedPayloads.push({ invoiceId: ids.retry, to: payload.to });
          return Promise.resolve("accepted");
        });
        expect(concurrent).toMatchObject({
          success: true,
          data: { deliveryStatus: "pending" },
        });
      } finally {
        released.resolve();
      }
      expect(await active).toMatchObject({
        success: true,
        data: { deliveryStatus: "accepted" },
      });
      expect(
        await send(ids.retry, (payload) => {
          acceptedPayloads.push({ invoiceId: ids.retry, to: payload.to });
          return Promise.resolve("accepted");
        }),
      ).toMatchObject({ success: true, data: { deliveryStatus: "accepted" } });
      expect(
        acceptedPayloads.filter(({ invoiceId }) => invoiceId === ids.retry),
      ).toEqual([{ invoiceId: ids.retry, to: recipient }]);

      const acceptedButInterrupted = await send(ids.uncertain, (payload) => {
        acceptedPayloads.push({ invoiceId: ids.uncertain, to: payload.to });
        return Promise.reject(
          new Error("synthetic relay accepted then connection interrupted"),
        );
      });
      expect(acceptedButInterrupted).toMatchObject({
        success: true,
        data: { deliveryStatus: "uncertain" },
      });
      expect(
        await send(ids.uncertain, (payload) => {
          acceptedPayloads.push({ invoiceId: ids.uncertain, to: payload.to });
          return Promise.resolve("accepted");
        }),
      ).toMatchObject({ success: true, data: { deliveryStatus: "uncertain" } });
      expect(await readStatus(ids.uncertain)).toBe("uncertain");
      expect(
        acceptedPayloads.filter(({ invoiceId }) => invoiceId === ids.uncertain),
      ).toEqual([{ invoiceId: ids.uncertain, to: recipient }]);

      const shareFromHttp = await getAtlasFixture(
        apiPath(ids.browser),
        {},
        headers,
      );
      expect(shareFromHttp.ok).toBe(true);
      const share = z
        .object({ success: z.literal(true), data: delivery.GET.responseSchema })
        .parse(await shareFromHttp.json()).data;
      expect(share.recipient).toBe(recipient);
      expect(Boolean(new URL(share.viewUrl).searchParams.get("token"))).toBe(
        true,
      );

      const browserPath = new URL(apiPath(ids.browser)).pathname;
      await page.setViewportSize({ width: 1440, height: 900 });
      await fixtures.open(invoice.GET, {
        query: { invoiceId: ids.browser },
        ready: () =>
          page
            .getByRole("button", { name: t("delivery.share"), exact: true })
            .last()
            .waitFor(),
      });
      const shown = page.waitForResponse(
        (response) =>
          new URL(response.url()).pathname === browserPath &&
          response.request().method() === "GET",
      );
      await page
        .getByRole("button", { name: t("delivery.share"), exact: true })
        .last()
        .click();
      expect((await shown).ok()).toBe(true);
      const link = page.getByText(share.viewUrl, { exact: true }).last();
      await link.waitFor();
      expect(
        await page.getByText(recipient, { exact: true }).last().isVisible(),
      ).toBe(true);
      await fixtures.context.grantPermissions([
        "clipboard-read",
        "clipboard-write",
      ]);
      await page
        .getByRole("button", { name: t("widget.copy"), exact: true })
        .last()
        .click();
      await page
        .getByRole("button", { name: t("widget.copied"), exact: true })
        .last()
        .waitFor();
      await mkdir("scratchpad/erp/shots/v2/invoice-delivery", {
        recursive: true,
      });
      await page.screenshot({
        path: "scratchpad/erp/shots/v2/invoice-delivery/01-share.png",
        fullPage: true,
        mask: [link],
        maskColor: "#364152",
      });

      // Every browser PATCH for this fixture is fulfilled by the same repository with a
      // synthetic transport. HTTP rejections above cannot reach any transport.
      await page.route(
        (url) => url.pathname === browserPath,
        async (route) => {
          if (route.request().method() !== "PATCH") {
            await route.fallback();
            return;
          }
          const body = z
            .object({ expectedRecipient: z.email() })
            .parse(route.request().postDataJSON());
          const result = await InvoiceDeliveryRepository.send(
            ids.browser,
            body.expectedRecipient,
            userId,
            E2E_LOCALE,
            logger,
            async (payload) => {
              expect(payload.to).toBe(recipient);
              expect(payload.text.includes(share.viewUrl)).toBe(true);
              expect(await readStatus(ids.browser)).toBe("pending");
              acceptedPayloads.push({ invoiceId: ids.browser, to: payload.to });
              return "accepted";
            },
          );
          await route.fulfill({
            json: result,
            status: result.success ? 200 : 409,
          });
        },
      );

      const emailAction = page
        .getByRole("button", { name: t("delivery.send"), exact: true })
        .last();
      await emailAction.click();
      await page
        .getByText(t("delivery.confirmDescription"), { exact: true })
        .last()
        .waitFor();
      await emailAction.click();
      await page
        .getByText(t("delivery.states.accepted"), { exact: true })
        .last()
        .waitFor();
      expect(await readStatus(ids.browser)).toBe("accepted");
      expect(
        acceptedPayloads.filter(({ invoiceId }) => invoiceId === ids.browser),
      ).toEqual([{ invoiceId: ids.browser, to: recipient }]);
      await page.screenshot({
        path: "scratchpad/erp/shots/v2/invoice-delivery/02-mail-accepted.png",
        fullPage: true,
        mask: [link],
        maskColor: "#364152",
      });
      expect(
        await page
          .getByText(invoiceT("widget.status.open"), { exact: true })
          .count(),
      ).toBeGreaterThan(0);
    },
    180_000,
  );
});
