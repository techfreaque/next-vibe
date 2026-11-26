import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import {
  type E2EFixtures,
  useE2E,
} from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { hasSupplierBillCandidate } from "@/finance/bank/followup/bill-provenance";
import { scopedTranslation as financeTranslation } from "@/finance/i18n";
import { SupplierEvidenceRepository } from "@/finance/supplier-evidence/repository";
import { supplierEvidenceRecords } from "@/finance/supplier-evidence/db";
import { parkMailboxTaxPending } from "@/finance/supplier-evidence/tax-pending";
import billGet from "@/payment/bill/[billId]/get/definition";
import { scopedTranslation as billDetailTranslation } from "@/payment/bill/[billId]/get/i18n";
import billCreate from "@/payment/bill/create/definition";
import { paymentBillLines, paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { encryptEvidence } from "./attachments";
import attachment from "./attachment/definition";
import { billMailboxReview } from "./db";
import type { MailboxBinding } from "./env";
import mailboxDefinition from "./definition";
import { scopedTranslation } from "./i18n";
import type { BillMailbox } from "./imap";
import { BillMailboxRepository } from "./repository";
import syncDefinition from "./sync/definition";

const { t } = scopedTranslation.scopedT(E2E_LOCALE);

async function prepareMailboxCompany(fixtures: E2EFixtures) {
  const { companyId, userId, headers } = await prepareAtlasCompany(
    fixtures,
    "E2E Mail Supplier Company",
  );
  const accountId = randomUUID();
  await db.insert(accountNodes).values({
    id: accountId,
    companyId,
    code: "6100",
    name: "Fixture supplier expense",
    type: AccountType.EXPENSE,
    subtype: AccountSubtype.OPEX,
  });
  return { companyId, accountId, userId, headers };
}

describe("E2E: email supplier bill review", () => {
  const e2e = useE2E("mail-bill-review");

  e2e.it(
    "opens a synthetic receipt, reads protected evidence, and requests missing facts before posting",
    async (fixtures) => {
      const { page, gotoReady, capture, cleanup, uniqueEmail } = fixtures;
      const { companyId, accountId, headers } =
        await prepareMailboxCompany(fixtures);
      const synthetic = uniqueEmail("supplier-receipt");
      const vendorId = randomUUID();
      const namespace = synthetic;
      cleanup(async () => {
        await db
          .delete(billMailboxReview)
          .where(eq(billMailboxReview.namespace, namespace));
        const evidence = await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.vendorId, vendorId))
          .returning({ billId: supplierEvidenceRecords.billId });
        for (const { billId } of evidence) {
          if (billId)
            await db.delete(paymentBills).where(eq(paymentBills.id, billId));
        }
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(purchasingVendors)
          .where(eq(purchasingVendors.id, vendorId));
      });
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: synthetic });
      const uidValidity = "42";
      const uid = "7";
      const contents = Buffer.from("Synthetic receipt fixture.").toString(
        "base64",
      );
      const [record] = await db
        .insert(billMailboxReview)
        .values({
          namespace,
          uidValidity,
          uid,
          companyId,
          vendorId,
          debitAccountId: accountId,
          status: "review",
          issue: "missingFields",
          fileCount: 1,
          evidence: encryptEvidence(
            [{ kind: "text", data: contents }],
            JSON.stringify([namespace, uidValidity, uid, companyId]),
          ),
        })
        .returning({ id: billMailboxReview.id });
      expect(record).toBeDefined();
      if (!record) return;
      const listApi = await getAtlasFixture(
        `${fixtures.baseUrl}/api/${E2E_LOCALE}/messenger/system-mailbox/bills`,
        { companyId },
        headers,
      );
      expect(listApi.status).toBe(200);
      expect(await listApi.json()).toMatchObject({
        success: true,
        data: { reviews: [{ id: record.id, status: "review" }] },
      });
      const listPath = `/tools/mail-bill-reviews?arg.companyId=${companyId}`;
      const receipt = page.getByText(synthetic, { exact: true }).last();
      const unavailable = page
        .getByText("Database error", { exact: true })
        .last();
      const openReviewList = async (): Promise<void> => {
        await gotoReady(listPath, () =>
          receipt.or(unavailable).first().waitFor(),
        );
        if (!(await receipt.isVisible()) && (await unavailable.isVisible())) {
          // Atlas returns Retry-After: 5 when the pooled lead lookup is temporarily saturated.
          await new Promise<void>((resolve) => setTimeout(resolve, 5_000));
          await gotoReady(listPath, () => receipt.waitFor());
        }
      };
      await openReviewList();
      await page
        .getByText(String(t("missingFields")), { exact: true })
        .last()
        .waitFor();
      const file = page
        .getByRole("button", { name: `${t("file")} 1`, exact: true })
        .last();
      const read = await capture(attachment.GET, () => file.click());
      expect(read.response.success).toBe(true);
      if (read.response.success)
        expect(read.response.data.contents).toBe(contents);
      await page
        .getByRole("button", { name: String(t("download")), exact: true })
        .last()
        .waitFor();

      await openReviewList();
      await page
        .getByRole("button", { name: String(t("approveTitle")), exact: true })
        .last()
        .click();
      await page
        .getByRole("textbox", { name: String(t("reference")), exact: true })
        .last()
        .waitFor();
      const rejected = await capture(mailboxDefinition.POST, () =>
        page
          .getByRole("button", { name: String(t("approve")), exact: true })
          .last()
          .click(),
      );
      expect(rejected.response.success).toBe(false);
      const [saved] = await db
        .select({
          status: billMailboxReview.status,
          billId: billMailboxReview.billId,
        })
        .from(billMailboxReview)
        .where(eq(billMailboxReview.id, record.id));
      expect(saved).toEqual({ status: "review", billId: null });

      const reference = `MAIL-TEST-${randomUUID()}`;
      await page
        .getByRole("textbox", { name: String(t("reference")), exact: true })
        .last()
        .fill(reference);
      await page
        .getByRole("textbox", { name: String(t("date")), exact: true })
        .last()
        .fill("2026-01-17");
      await page
        .getByRole("textbox", { name: String(t("currency")), exact: true })
        .last()
        .fill("USD");
      await page
        .getByRole("textbox", { name: String(t("gross")), exact: true })
        .last()
        .fill("12.30");
      await page
        .getByRole("textbox", { name: String(t("tax")), exact: true })
        .last()
        .fill("0.30");
      const approved = await capture(mailboxDefinition.POST, () =>
        page
          .getByRole("button", { name: String(t("approve")), exact: true })
          .last()
          .click(),
      );
      expect(approved.response.success).toBe(true);
      if (!approved.response.success) {
        return;
      }
      const { billId } = approved.response.data;
      const [draft] = await db
        .select({
          companyId: paymentBills.companyId,
          billNumber: paymentBills.billNumber,
          total: paymentBills.total,
          taxAmount: paymentBills.taxAmount,
          status: paymentBills.status,
        })
        .from(paymentBills)
        .where(eq(paymentBills.id, billId));
      expect(draft).toEqual({
        companyId,
        billNumber: reference,
        total: 12.3,
        taxAmount: 0.3,
        status: BillStatus.DRAFT,
      });
      await page
        .getByRole("button", { name: String(t("openBill")), exact: true })
        .last()
        .waitFor();
    },
  );
  e2e.it(
    "drafts only trusted receipts and retries a failed mailbox flag without duplicating API bills",
    async (fixtures) => {
      const { page, gotoReady, capture, cleanup } = fixtures;
      const { companyId, accountId, userId } =
        await prepareMailboxCompany(fixtures);
      const vendorId = randomUUID();
      const prepaidId = randomUUID();
      const namespace = randomUUID();
      const vendor = `Synthetic mail supplier ${namespace.slice(0, 8)}`;
      const reference = `MAIL-${namespace.toUpperCase()}`;
      const binding = {
        sender: "local-forwarder@example.test",
        recipient: "bills@example.test",
        providerSender: "billing@supplier.example.test",
        providerSubjectPrefix: "Invoice from Supplier Fixture",
        autoDraft: true,
        companyId,
        vendorId,
        debitAccountId: accountId,
      };
      cleanup(async () => {
        await db
          .delete(billMailboxReview)
          .where(eq(billMailboxReview.namespace, namespace));
        const evidence = await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.vendorId, vendorId))
          .returning({ billId: supplierEvidenceRecords.billId });
        for (const { billId } of evidence) {
          if (billId)
            await db.delete(paymentBills).where(eq(paymentBills.id, billId));
        }
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(purchasingVendors)
          .where(eq(purchasingVendors.id, vendorId));
      });
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: vendor });

      await db.insert(accountNodes).values({
        id: prepaidId,
        companyId,
        code: "1500",
        name: "Fixture prepaid credits",
        type: AccountType.ASSET,
        subtype: AccountSubtype.PREPAID,
      });

      const disabled = await postAtlas(
        fixtures,
        "messenger/system-mailbox/bills/sync",
        {
          dryRun: false,
          limit: 5,
        },
      );
      expect(disabled.status).toBe(403);

      const logger = createEndpointLogger(false, E2E_LOCALE);
      const { t: financeT } = financeTranslation.scopedT(E2E_LOCALE);
      const date = "2026-01-17";
      const recordSupplierApi = (number: string, prepaid = false) =>
        SupplierEvidenceRepository.record(
          {
            operation: prepaid ? "fundBill" : "bill",
            companyId,
            vendorId,
            debitAccountId: prepaid ? prepaidId : accountId,
            externalReference: number,
            date,
            grossAmount: "12.30",
            taxAmount: "0.30",
            currency: "USD",
            description: vendor,
            dryRun: false,
          },
          userId,
          financeT,
          logger,
        );

      const createManual = (
        billNumber: string | undefined,
        canonicalVendorId?: string,
      ) =>
        postAtlas(fixtures, "payment/bill/create", {
          companyId,
          ...(canonicalVendorId
            ? { vendorId: canonicalVendorId }
            : { supplierName: vendor }),
          ...(billNumber ? { billNumber } : {}),
          billDate: date,
          currency: "USD",
          lineItems: [
            {
              description: vendor,
              unitPrice: 12,
              taxRate: 0.025,
              expenseAccountId: accountId,
            },
          ],
        });
      const manual = await createManual(reference.toLowerCase(), vendorId);
      expect(manual.ok).toBe(true);
      const firstBill = z
        .object({
          success: z.literal(true),
          data: billCreate.POST.responseSchema,
        })
        .parse(await manual.json());
      const apiBillId = firstBill.data.id;

      const flags: number[] = [];
      const mailbox: BillMailbox = {
        namespace,
        uidValidity: "42",
        uids: [1, 2, 3, 4],
        read: (uid) =>
          Promise.resolve({
            uid,
            raw: Buffer.from(
              [
                "From: local-forwarder@example.test",
                "To: bills@example.test",
                "Subject: Fwd: Invoice from Supplier Fixture",
                "Content-Type: text/plain; charset=utf-8",
                "",
                "---------- Forwarded message ---------",
                `From: Supplier <${uid === 3 ? "other@example.test" : uid === 4 ? "receipts@openrouter.ai" : "billing@supplier.example.test"}>`,
                `Subject: ${uid === 4 ? "Your OpenRouter receipt" : "Invoice from Supplier Fixture"}`,
                "",
                ...(uid === 4
                  ? [
                      `Receipt from OpenRouter Receipt # ${reference}-4`,
                      "Amount paid",
                      "$12.30",
                      "Date paid",
                      "January 17, 2026, 2:31:35 PM",
                      "Subtotal: $12.00",
                      "Tax: $0.30",
                      "Amount paid: $12.30",
                    ]
                  : [
                      `Invoice number: ${uid <= 2 ? reference : `${reference}-${uid}`}`,
                      `Invoice date: ${date}`,
                      `Total: USD ${uid === 2 ? "13.30" : "12.30"}`,
                      "Tax: USD 0.30",
                    ]),
              ].join("\r\n"),
            ),
          }),
        markProcessed: async (uid) => {
          flags.push(uid);
          const [committed] = await db
            .select({ billId: billMailboxReview.billId })
            .from(billMailboxReview)
            .where(
              and(
                eq(billMailboxReview.namespace, namespace),
                eq(billMailboxReview.uid, String(uid)),
              ),
            );
          expect(committed?.billId).toBeTruthy();
          return flags.length > 1;
        },
        close: () => undefined,
      };
      const openModes: boolean[] = [];
      const configured = {
        requestedPreview: false,
        scheduled: true,
        allowScheduledDrafts: false,
        configuredActorId: userId,
        actorId: userId,
        bindings: [
          binding,
          {
            ...binding,
            providerSender: "receipts@openrouter.ai",
            providerSubjectPrefix: "Your OpenRouter receipt",
            nativeCurrency: "USD",
            debitAccountId: prepaidId,
          },
        ],
        open: (
          _bindings: readonly MailboxBinding[],
          dryRun: boolean,
        ): Promise<BillMailbox> => {
          openModes.push(dryRun);
          return Promise.resolve(mailbox);
        },
      };
      const unavailableActor = await BillMailboxRepository.runConfigured(
        { ...configured, configuredActorId: randomUUID() },
        E2E_LOCALE,
        logger,
      );
      expect(unavailableActor.success).toBe(false);
      expect(openModes).toEqual([]);

      const wrongAccount = await BillMailboxRepository.runConfigured(
        {
          ...configured,
          bindings: configured.bindings.map((item) => ({
            ...item,
            debitAccountId: accountId,
          })),
        },
        E2E_LOCALE,
        logger,
      );
      expect(wrongAccount.success).toBe(false);
      expect(openModes).toEqual([]);

      const scan = (apply: boolean) =>
        BillMailboxRepository.runConfigured(
          { ...configured, allowScheduledDrafts: apply },
          E2E_LOCALE,
          logger,
        );
      const preview = await scan(false);
      expect(preview).toMatchObject({
        success: true,
        data: {
          dryRun: true,
          ready: 2,
          existing: 1,
          review: 1,
          skipped: 1,
          persisted: 0,
          flagged: 0,
        },
      });
      expect(flags).toEqual([]);
      expect(
        await db
          .select({ id: billMailboxReview.id })
          .from(billMailboxReview)
          .where(eq(billMailboxReview.namespace, namespace)),
      ).toEqual([]);

      const syncPath = `/api/${E2E_LOCALE}/messenger/system-mailbox/bills/sync`;
      await page.route(`**${syncPath}`, async (request) => {
        const input = syncDefinition.POST.requestSchema.parse(
          request.request().postDataJSON(),
        );
        expect(input.dryRun).toBe(true);
        await request.fulfill({ json: preview });
      });
      const previewButton = page
        .getByRole("button", { name: String(t("previewScan")), exact: true })
        .last();
      await gotoReady("/tools/mail-bill-scan", () => previewButton.waitFor());
      await previewButton.click();
      await page
        .getByText(String(t("newDraftCount")), { exact: true })
        .last()
        .waitFor();
      await saveWorkflowScreenshots(
        { page },
        "provider-bill-automation-preview",
      );
      await page.unroute(`**${syncPath}`);

      const first = await scan(true);
      expect(first).toMatchObject({
        success: true,
        data: {
          dryRun: false,
          ready: 2,
          existing: 1,
          review: 1,
          skipped: 1,
          persisted: 3,
          flagged: 1,
        },
      });
      const replay = await scan(true);
      expect(replay).toMatchObject({
        success: true,
        data: {
          ready: 2,
          existing: 2,
          review: 1,
          skipped: 1,
          persisted: 0,
          flagged: 2,
        },
      });
      expect(openModes).toEqual([true, false, false]);
      expect(flags).toEqual([1, 4, 1, 4]);
      const saved = await db
        .select({
          uid: billMailboxReview.uid,
          status: billMailboxReview.status,
          billId: billMailboxReview.billId,
        })
        .from(billMailboxReview)
        .where(eq(billMailboxReview.namespace, namespace));
      expect(saved.find(({ uid }) => uid === "1")?.billId).toBe(apiBillId);
      expect(saved.find(({ uid }) => uid === "2")).toMatchObject({
        status: "review",
        billId: null,
      });
      expect(saved.find(({ uid }) => uid === "3")).toBeUndefined();
      const freshBillId = saved.find(({ uid }) => uid === "4")?.billId;
      expect(freshBillId).toBeTruthy();
      if (!freshBillId) return;
      const [draft] = await db
        .select({
          companyId: paymentBills.companyId,
          status: paymentBills.status,
          total: paymentBills.total,
          tax: paymentBills.taxAmount,
          entryId: paymentBills.journalEntryId,
        })
        .from(paymentBills)
        .where(eq(paymentBills.id, freshBillId));
      expect(draft).toEqual({
        companyId,
        status: BillStatus.DRAFT,
        total: 12.3,
        tax: 0.3,
        entryId: null,
      });

      expect(
        (await createManual(` ${reference.toLowerCase()}-4 `, vendorId)).status,
      ).toBe(409);
      const providerReplay = await recordSupplierApi(`${reference}-4`, true);
      expect(providerReplay).toMatchObject({
        success: true,
        data: { result: { billId: freshBillId } },
      });

      expect(
        await db
          .select({
            kind: supplierEvidenceRecords.kind,
            debitAccountId: supplierEvidenceRecords.debitAccountId,
            currency: supplierEvidenceRecords.currency,
          })
          .from(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.billId, freshBillId)),
      ).toEqual([
        { kind: "fundBill", debitAccountId: prepaidId, currency: "USD" },
      ]);

      const scanUid = (uid: number) =>
        BillMailboxRepository.scan(
          {
            ...mailbox,
            uids: [uid],
            markProcessed: () => Promise.resolve(true),
          },
          [binding],
          false,
          userId,
          E2E_LOCALE,
          logger,
        );
      const [racingManual, racingMailbox] = await Promise.all([
        createManual(`${reference}-6`, vendorId),
        scanUid(6),
      ]);
      expect(racingManual.ok || racingManual.status === 409).toBe(true);
      expect(racingMailbox).toMatchObject({ ready: 1, flagged: 1 });
      const raced = await db
        .select({ id: paymentBills.id })
        .from(paymentBills)
        .where(
          and(
            eq(paymentBills.companyId, companyId),
            eq(paymentBills.billNumber, `${reference}-6`),
          ),
        );
      expect(raced).toHaveLength(1);

      const legacy = await createManual(`${reference}-7`);
      expect(legacy.ok).toBe(true);
      expect(await scanUid(7)).toMatchObject({
        ready: 0,
        review: 1,
        flagged: 0,
      });
      expect((await createManual(`${reference}-7`, vendorId)).status).toBe(409);

      const otherVendorId = randomUUID();
      await db
        .insert(purchasingVendors)
        .values({ id: otherVendorId, companyId, name: `${vendor} alternate` });
      expect((await createManual(`${reference}-4`, otherVendorId)).ok).toBe(
        true,
      );
      expect((await createManual(undefined, vendorId)).ok).toBe(true);
      expect((await createManual(undefined, vendorId)).ok).toBe(true);

      const draftRow = page.getByText(`${reference}-4`, { exact: true });
      await gotoReady(
        `/tools/mail-bill-reviews?arg.companyId=${companyId}`,
        () => draftRow.waitFor(),
      );
      await page
        .getByRole("button", { name: String(t("openBill")), exact: true })
        .first()
        .waitFor();
      await page
        .getByText(String(t("conflictingDocuments")), { exact: true })
        .last()
        .waitFor();
      await saveWorkflowScreenshots({ page }, "mail-auto-draft");
      const opened = await capture(billGet.GET, () =>
        draftRow
          .locator("xpath=../../..")
          .getByRole("button", { name: String(t("openBill")), exact: true })
          .click(),
      );
      expect(opened.response.success).toBe(true);
      if (opened.response.success) {
        expect(opened.response.data.id).toBe(freshBillId);
        expect(opened.response.data.status).toBe(BillStatus.DRAFT);
        const { t: billT } = billGet.GET.scopedTranslation.scopedT(E2E_LOCALE);
        await page
          .getByText(billT("widget.status.draft"), { exact: true })
          .last()
          .waitFor();
        await page.setViewportSize({ width: 1280, height: 900 });
        await saveWorkflowScreenshots({ page }, "mail-opened-draft");
      }
    },
  );
  e2e.it(
    "parks a verified gross-only receipt and confirms tax on the same draft",
    async (fixtures) => {
      const { page, gotoReady, cleanup } = fixtures;
      const { companyId, accountId, userId, headers } =
        await prepareMailboxCompany(fixtures);
      const vendorId = randomUUID();
      const prepaidId = randomUUID();
      const namespace = randomUUID();
      const vendor = "Synthetic prepaid supplier";
      const reference = `MAIL-${namespace.toUpperCase()}`;
      cleanup(async () => {
        await db
          .delete(billMailboxReview)
          .where(eq(billMailboxReview.namespace, namespace));
        await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.vendorId, vendorId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(purchasingVendors)
          .where(eq(purchasingVendors.id, vendorId));
      });
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: vendor });
      await db.insert(accountNodes).values({
        id: prepaidId,
        companyId,
        code: "1500",
        name: "Fixture prepaid credits",
        type: AccountType.ASSET,
        subtype: AccountSubtype.PREPAID,
      });
      const binding: MailboxBinding = {
        sender: "local-forwarder@example.test",
        recipient: "bills@example.test",
        providerSender: "receipts@openrouter.ai",
        providerSubjectPrefix: "Your OpenRouter receipt",
        nativeCurrency: "USD",
        autoDraft: true,
        companyId,
        vendorId,
        debitAccountId: prepaidId,
      };
      const mailbox: BillMailbox = {
        namespace,
        uidValidity: "42",
        uids: [9],
        read: (uid) =>
          Promise.resolve({
            uid,
            raw: Buffer.from(
              [
                "From: local-forwarder@example.test",
                "To: bills@example.test",
                "Subject: Fwd: Your OpenRouter receipt",
                "Content-Type: text/plain; charset=utf-8",
                "",
                "---------- Forwarded message ---------",
                "From: OpenRouter <receipts@openrouter.ai>",
                "Subject: Your OpenRouter receipt",
                "",
                `Receipt from OpenRouter Receipt # ${reference}-9`,
                "Amount paid",
                "$12.30",
                "Date paid",
                "January 17, 2026, 2:31:35 PM",
                "Amount paid: $12.30",
              ].join("\r\n"),
            ),
          }),
        markProcessed: () => Promise.resolve(true),
        close: () => undefined,
      };
      const logger = createEndpointLogger(false, E2E_LOCALE);
      const { t: financeT } = financeTranslation.scopedT(E2E_LOCALE);
      const recordSupplierApi = (number: string, grossAmount = "12.30") =>
        SupplierEvidenceRepository.record(
          {
            operation: "fundBill",
            companyId,
            vendorId,
            debitAccountId: prepaidId,
            externalReference: number,
            date: "2026-01-17",
            grossAmount,
            taxAmount: "0.30",
            currency: "USD",
            description: vendor,
            dryRun: false,
          },
          userId,
          financeT,
          logger,
        );
      const scanPending = (dryRun: boolean) =>
        BillMailboxRepository.scan(
          { ...mailbox, uids: [9], markProcessed: () => Promise.resolve(true) },
          [binding],
          dryRun,
          userId,
          E2E_LOCALE,
          logger,
        );
      expect(await scanPending(true)).toMatchObject({
        ready: 1,
        persisted: 0,
        flagged: 0,
      });
      expect(await scanPending(false)).toMatchObject({
        ready: 1,
        persisted: 1,
        flagged: 1,
      });
      expect(await scanPending(false)).toMatchObject({
        ready: 1,
        existing: 1,
        persisted: 0,
      });
      const [pending] = await db
        .select()
        .from(billMailboxReview)
        .where(
          and(
            eq(billMailboxReview.namespace, namespace),
            eq(billMailboxReview.uid, "9"),
          ),
        );
      expect(pending).toMatchObject({ status: "posted", taxAmount: null });
      if (!pending?.billId) return;
      const parkedBillId = pending.billId;
      const facts = {
        companyId,
        vendorId,
        supplierName: vendor,
        currency: "USD",
        total: 12.3,
        date: new Date("2026-01-24T00:00:00.000Z"),
        maxDateDistance: 7,
      } as const;
      expect(
        await hasSupplierBillCandidate(db, facts, "mailbox-tax-pending"),
      ).toBe(true);
      for (const mismatch of [
        { date: new Date("2026-01-25T00:00:00.000Z") },
        { vendorId: randomUUID() },
        { currency: "EUR" },
        { total: 12.29 },
      ] as const) {
        expect(
          await hasSupplierBillCandidate(
            db,
            { ...facts, ...mismatch },
            "mailbox-tax-pending",
          ),
        ).toBe(false);
      }
      expect(
        await db
          .select()
          .from(paymentBillLines)
          .where(eq(paymentBillLines.billId, parkedBillId)),
      ).toEqual([]);
      const billResponse = await getAtlasFixture(
        fixtures.baseUrl +
          `/api/${E2E_LOCALE}/payment/bill/${parkedBillId}/get`,
        {},
        headers,
      );
      expect(await billResponse.json()).toMatchObject({
        success: true,
        data: {
          taxPending: true,
          taxAmount: null,
          subtotal: null,
          total: 12.3,
          status: BillStatus.DRAFT,
        },
      });
      const receive = await postAtlas(
        fixtures,
        `payment/bill/${parkedBillId}/approve`,
        {},
      );
      expect(receive.status).toBe(409);
      const editLines = await postAtlas(fixtures, "payment/bill/line/add", {
        billId: parkedBillId,
        description: "Should not change pending draft",
        quantity: 1,
        unitPrice: 1,
        taxRate: 0,
        expenseAccountId: accountId,
      });
      expect(editLines.status).toBe(409);
      expect((await recordSupplierApi(`${reference}-9`, "13.30")).success).toBe(
        false,
      );
      await page.setViewportSize({ width: 1440, height: 900 });
      const showPending = page.getByText(String(t("taxPending")), {
        exact: true,
      });
      await gotoReady(
        `/tools/mail-bill-reviews?arg.companyId=${companyId}`,
        () => showPending.waitFor(),
      );
      await saveWorkflowScreenshots({ page }, "mail-bill-tax-pending");
      await showPending
        .locator("xpath=..")
        .getByRole("button", {
          name: String(t("openBill")),
          exact: true,
        })
        .click();
      const { t: billT } = billDetailTranslation.scopedT(E2E_LOCALE);
      const grossTotal = page.getByText(String(billT("widget.grossTotal")), {
        exact: true,
      });
      await grossTotal.waitFor();
      await page.setViewportSize({ width: 1440, height: 900 });
      await saveWorkflowScreenshots({ page }, "mail-bill-tax-pending-detail");
      await page
        .getByRole("button", {
          name: String(billT("widget.confirmSupplierTax")),
          exact: true,
        })
        .filter({ visible: true })
        .click();
      const taxEntry = page.getByRole("textbox", {
        name: String(t("tax")),
        exact: true,
      });
      await taxEntry.fill("0.30");
      const confirmButton = page.getByTestId("endpoint-submit").and(
        page.getByRole("button", {
          name: String(t("confirmTax")),
          exact: true,
        }),
      );
      const confirmedHttp = page.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          new URL(response.url()).pathname.endsWith(
            "/messenger/system-mailbox/bills",
          ),
      );
      await confirmButton.click();
      expect(await (await confirmedHttp).json()).toMatchObject({
        success: true,
        data: { billId: parkedBillId },
      });
      await page
        .getByRole("button", { name: String(t("openBill")), exact: true })
        .last()
        .waitFor();
      const [confirmed] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, parkedBillId));
      expect(confirmed).toMatchObject({
        status: BillStatus.DRAFT,
        taxAmount: 0.3,
        subtotal: 12,
        total: 12.3,
        journalEntryId: null,
      });
      expect(await recordSupplierApi(`${reference}-9`)).toMatchObject({
        success: true,
        data: { result: { billId: parkedBillId } },
      });
      const confirmTax = (taxAmount: string) =>
        BillMailboxRepository.post(
          mailboxDefinition.POST.requestSchema.parse({
            reviewId: pending.id,
            confirmTax: true,
            taxAmount,
          }),
          userId,
          E2E_LOCALE,
          logger,
        );
      expect(await confirmTax("0.30")).toMatchObject({
        success: true,
        data: { billId: parkedBillId },
      });
      expect((await confirmTax("0.31")).success).toBe(false);
      expect(
        await db
          .select()
          .from(paymentBillLines)
          .where(eq(paymentBillLines.billId, parkedBillId)),
      ).toHaveLength(1);

      // Two existing independent bank-origin drafts make another gross-only
      // receipt a review candidate. No amount-only link or bill is created.
      await db.insert(paymentBills).values(
        ["2026-01-10", "2026-01-24"].map((date) => ({
          companyId,
          supplierName: vendor,
          billDate: new Date(date),
          currency: "USD" as const,
          total: 12.3,
          metadata: { vendorId, bankStatementLineId: randomUUID() },
        })),
      );
      expect(
        await db.transaction(async (tx) => {
          await lockLedgerCompany(tx, companyId);
          return parkMailboxTaxPending(tx, {
            companyId,
            vendorId,
            debitAccountId: prepaidId,
            reference: `${reference}-another`,
            date: "2026-01-17",
            currency: "USD",
            grossAmount: "12.30",
          });
        }),
      ).toEqual({ outcome: "review" });
    },
  );
});
