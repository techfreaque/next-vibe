import "server-only";

import { inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { pgliteReady } from "next-vibe/database/client";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { BillListRepository } from "@/payment/bill/list/repository";
import { CreditNoteCreateRepository } from "@/payment/credit-note/create/repository";
import { paymentBills, paymentEstimates, paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";
import { EstimateListRepository } from "@/payment/estimate/list/repository";
import { InvoiceGetRepository } from "@/payment/invoice/[invoiceId]/get/repository";
import { InvoiceListRepository } from "@/payment/invoice/list/repository";

describe("company document lists", () => {
  const caller = crypto.randomUUID();
  const outsider = crypto.randomUUID();
  const firstCompany = crypto.randomUUID();
  const secondCompany = crypto.randomUUID();
  const inaccessibleCompany = crypto.randomUUID();
  const archivedCompany = crypto.randomUUID();
  const firstInvoice = crypto.randomUUID();
  const secondInvoice = crypto.randomUUID();
  const inaccessibleInvoice = crypto.randomUUID();
  const archivedInvoice = crypto.randomUUID();
  const companyIds = [firstCompany, secondCompany, inaccessibleCompany, archivedCompany];
  const logger = createEndpointLogger(false, defaultLocale);
  const marker = `document-audit-${caller}`;

  beforeAll(async () => {
    await pgliteReady;
    await db.insert(users).values(
      [caller, outsider].map((id) => ({
        id,
        email: `${id}@example.invalid`,
        password: "fixture-no-login",
        privateName: marker,
        publicName: marker,
        locale: defaultLocale,
      })),
    );
    await db.insert(companies).values(
      companyIds.map((id) => ({
        id,
        ownerUserId: outsider,
        name: `${marker}-${id}`,
        type: CompanyType.B2B,
        isActive: id !== archivedCompany,
      })),
    );
    await db.insert(companyMembers).values(
      companyIds.map((companyId) => ({
        companyId,
        userId: caller,
        role: companyId === secondCompany ? CompanyMemberRole.ACCOUNTANT : CompanyMemberRole.VIEWER,
        isActive: companyId !== inaccessibleCompany,
      })),
    );
    const invoiceData = {
      userId: outsider,
      amount: "90.00",
      currency: "EUR",
      status: InvoiceStatus.OPEN,
    } satisfies Partial<typeof paymentInvoices.$inferInsert>;
    await db.insert(paymentInvoices).values([
      {
        ...invoiceData,
        companyId: firstCompany,
        providerInvoiceId: crypto.randomUUID(),
        invoiceNumber: `${marker}-unrelated`,
        createdAt: new Date("2026-11-01T00:00:00.000Z"),
        metadata: { customerId: outsider },
      },
      ...[firstInvoice, secondInvoice, inaccessibleInvoice, archivedInvoice].map((id, index) => ({
        ...invoiceData,
        companyId: companyIds[index],
        id,
        providerInvoiceId: id,
        invoiceNumber: `${marker}-CUSTOMER%${index + 1}`,
        createdAt: new Date(Date.UTC(2026, 10, index + 2)),
        metadata: { customerId: caller },
      })),
    ]);
    await db.insert(paymentBills).values(
      companyIds.map((companyId) => ({
        companyId,
        supplierName: marker,
        billDate: new Date("2026-11-01T00:00:00.000Z"),
      })),
    );
    await db.insert(paymentEstimates).values(
      companyIds.map((companyId, index) => ({
        companyId,
        estimateNumber: `${marker}-${index + 1}`,
        customerName: marker,
      })),
    );
  });

  afterAll(async () => {
    await db.delete(companies).where(inArray(companies.id, companyIds));
    await db.delete(users).where(inArray(users.id, [caller, outsider]));
  });

  it("counts and pages the scoped customer-filtered invoices", async () => {
    const first = await InvoiceListRepository.listInvoices(
      caller,
      { page: 1, pageSize: 1, customerId: caller, status: InvoiceStatus.OPEN },
      logger,
    );
    expect(first.success && first.data).toMatchObject({
      total: 2,
      currentPage: 1,
      pageCount: 2,
      invoices: [{ id: firstInvoice, companyId: firstCompany }],
    });

    const second = await InvoiceListRepository.listInvoices(
      caller,
      { page: 2, pageSize: 1, customerId: caller, search: "customer%" },
      logger,
    );
    expect(second.success && second.data).toMatchObject({
      total: 2,
      currentPage: 2,
      pageCount: 2,
      invoices: [{ id: secondInvoice, companyId: secondCompany }],
    });

    const empty = await InvoiceListRepository.listInvoices(
      caller,
      { page: 2, pageSize: 1, search: "customer_" },
      logger,
    );
    expect(empty.success && empty.data).toMatchObject({
      total: 0,
      currentPage: 1,
      invoices: [],
    });
  });

  it("keeps archived and inactive memberships unavailable through direct routes", async () => {
    for (const companyId of [inaccessibleCompany, archivedCompany]) {
      const result = await InvoiceListRepository.listInvoices(
        caller,
        { companyId, page: 1, pageSize: 20 },
        logger,
      );
      expect(result).toMatchObject({ success: false, errorType: ErrorResponseTypes.FORBIDDEN });
    }
    for (const invoiceId of [inaccessibleInvoice, archivedInvoice]) {
      const result = await InvoiceGetRepository.getInvoice(caller, { invoiceId }, logger);
      expect(result).toMatchObject({ success: false, errorType: ErrorResponseTypes.FORBIDDEN });
    }
    const viewable = await InvoiceGetRepository.getInvoice(
      caller,
      { invoiceId: firstInvoice },
      logger,
    );
    expect(viewable.success && viewable.data).toMatchObject({
      id: firstInvoice,
      canManage: false,
      canCreateCreditNote: false,
    });
  });

  it("rejects a credit note for an invoice belonging to another company", async () => {
    const result = await CreditNoteCreateRepository.createCreditNote(
      caller,
      { companyId: secondCompany, invoiceId: firstInvoice, reason: "Scope fixture" },
      logger,
    );
    expect(result).toMatchObject({ success: false, errorType: ErrorResponseTypes.NOT_FOUND });
  });

  it("uses the same scope for supplier and estimate matches", async () => {
    const input = { page: 2, pageSize: 1, search: marker };
    const bill = await BillListRepository.listBills(caller, input, logger);
    const estimate = await EstimateListRepository.listEstimates(caller, input, logger);
    expect(bill.success && bill.data).toMatchObject({ totalCount: 2, currentPage: 2 });
    expect(estimate.success && estimate.data).toMatchObject({ total: 2, currentPage: 2 });
    expect(bill.success && bill.data.bills).toHaveLength(1);
    expect(estimate.success && estimate.data.estimates).toHaveLength(1);
  });
});
