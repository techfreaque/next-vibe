import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CompanyMemberRole } from "@/companies/enum";
import { getInvoiceOpenBalanceParts } from "@/finance/document-balance";
import { CompanyTaxRegime } from "@/tax/regime/enum";

import { paymentInvoices } from "../db";
import { InvoiceStatus, ManualPaymentMethod } from "../enum";
import { eq } from "drizzle-orm";

const pg = new PGlite();
const testDb = drizzle(pg);
mock.module("next-vibe/database", () => ({ db: testDb }));
const companyId = crypto.randomUUID();
const ownerId = crypto.randomUUID();
const accountantId = crypto.randomUUID();
const viewerId = crypto.randomUUID();
const revokedCreatorId = crypto.randomUUID();
const foreignCompanyId = crypto.randomUUID();
const foreignAccountantId = crypto.randomUUID();
const inactiveCompanyId = crypto.randomUUID();
const receivableId = crypto.randomUUID();
const revenueId = crypto.randomUUID();
const vatId = crypto.randomUUID();
const bankId = crypto.randomUUID();
const today = new Date().toISOString().slice(0, 10);
const logger = createEndpointLogger(false, defaultLocale);

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE company_tax_regimes (company_id uuid NOT NULL, effective_from date NOT NULL, regime text NOT NULL, recorded_by uuid, recorded_at timestamp DEFAULT now(), PRIMARY KEY (company_id, effective_from));
    CREATE TABLE companies (id uuid PRIMARY KEY, currency text, name text, is_active boolean);
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, user_id uuid,
      role text, is_active boolean, invited_by_user_id uuid, joined_at timestamp,
      created_at timestamp, updated_at timestamp
    );
    CREATE TABLE payment_invoices (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid, company_id uuid,
      provider_invoice_id text, invoice_number text, invoice_sequence_number int,
      amount numeric(10,2), currency text, status text, invoice_url text, invoice_pdf text,
      due_date timestamp, paid_at timestamp, callback_token text, notes text,
      journal_entry_id uuid, metadata jsonb, created_at timestamp DEFAULT now(), updated_at timestamp
    );
    CREATE TABLE payment_invoice_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id uuid, description text,
      product_id uuid, quantity numeric(12,4), unit_price numeric(12,4), tax_rate numeric(12,4),
      tax_amount numeric(12,4), line_total numeric(12,4), sort_order int, created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    );
    CREATE TABLE users (id uuid PRIMARY KEY, public_name text, private_name text);
    CREATE TABLE payment_invoice_receipts (
      invoice_id uuid, scope_id uuid, is_company_scope boolean, receipt_key text, journal_entry_id uuid
    );
    CREATE TABLE payment_invoice_reminder_drafts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id uuid, company_id uuid,
      prepared_at timestamp DEFAULT now(), due_date date, currency text, amount numeric(10,2), note text
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY, company_id uuid, subtype text, code text,
      is_active boolean DEFAULT true, is_postable boolean DEFAULT true
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid,
      start_date timestamp, end_date timestamp, status text
    );
    CREATE TABLE journal_entries (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid, period_id uuid,
      entry_number text, date timestamp, description text, memo text, status text,
      reversal_of_id uuid, reversed_by_id uuid, posted_at timestamp, posted_by_user_id uuid,
      source_type text, source_id uuid, created_at timestamp, updated_at timestamp
    );
    CREATE TABLE journal_entry_lines (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), journal_entry_id uuid REFERENCES journal_entries(id),
      account_id uuid REFERENCES account_nodes(id), type text, amount numeric(14,4),
      currency text, description text, sort_order int, created_at timestamp
    );
    INSERT INTO companies VALUES
      ('${companyId}', 'EUR', 'Company', true),
      ('${foreignCompanyId}', 'EUR', 'Other company', true),
      ('${inactiveCompanyId}', 'EUR', 'Inactive company', false);
    INSERT INTO company_members (company_id, user_id, role, is_active) VALUES
      ('${companyId}', '${ownerId}', '${CompanyMemberRole.OWNER}', true),
      ('${companyId}', '${accountantId}', '${CompanyMemberRole.ACCOUNTANT}', true),
      ('${companyId}', '${viewerId}', '${CompanyMemberRole.VIEWER}', true),
      ('${companyId}', '${revokedCreatorId}', '${CompanyMemberRole.OWNER}', false),
      ('${foreignCompanyId}', '${foreignAccountantId}', '${CompanyMemberRole.ACCOUNTANT}', true),
      ('${inactiveCompanyId}', '${accountantId}', '${CompanyMemberRole.ACCOUNTANT}', true);
    INSERT INTO account_nodes (id, company_id, subtype, code) VALUES
      ('${receivableId}', '${companyId}', '${AccountSubtype.ACCOUNTS_RECEIVABLE}', '411'),
      ('${revenueId}', '${companyId}', '${AccountSubtype.REVENUE_SALES}', '701'),
      ('${vatId}', '${companyId}', '${AccountSubtype.VAT_PAYABLE}', '343'),
      ('${bankId}', '${companyId}', '${AccountSubtype.BANK}', '221');
    INSERT INTO accounting_periods (company_id, start_date, end_date, status)
      VALUES ('${companyId}', '${today}', '${today}', '${PeriodStatus.OPEN}');
  `);
});
afterAll(() => pg.close());

async function insertDraft(
  creatorId = ownerId,
  company: string | null = companyId,
): Promise<string> {
  const invoiceId = crypto.randomUUID();
  await pg.query(
    `INSERT INTO payment_invoices (id, user_id, company_id, amount, currency, status)
      VALUES ($1, $2, $3, 123.01, 'EUR', $4)`,
    [invoiceId, creatorId, company, InvoiceStatus.DRAFT],
  );
  await pg.query(
    `INSERT INTO payment_invoice_lines (invoice_id, description, quantity, unit_price, tax_rate, tax_amount, line_total)
      VALUES ($1, 'Labor', 1, 100.005, .23, 23.0012, 123.0062)`,
    [invoiceId],
  );
  return invoiceId;
}

async function invoiceBalance(invoiceId: string) {
  const { payments, credits, paymentJoin, creditJoin, amountPaid, openAmount } =
    getInvoiceOpenBalanceParts(testDb, companyId, "EUR");
  const [balance] = await testDb
    .select({ status: paymentInvoices.status, amountPaid, openAmount })
    .from(paymentInvoices)
    .leftJoin(payments, paymentJoin)
    .leftJoin(credits, creditJoin)
    .where(eq(paymentInvoices.id, invoiceId));
  return {
    status: balance?.status,
    amountPaid: Number(balance?.amountPaid),
    amountDue: Number(balance?.openAmount),
  };
}

it("books issued cents and applies partial payments and credits against the remaining receivable", async () => {
  const { InvoiceSendRepository } =
    await import("./[invoiceId]/send/repository");
  const { InvoiceRecordPaymentRepository } =
    await import("./[invoiceId]/record-payment/repository");
  const { InvoiceVoidRepository } =
    await import("./[invoiceId]/void/repository");
  const invoiceId = await insertDraft();
  const send = () =>
    InvoiceSendRepository.sendInvoice(ownerId, { invoiceId }, logger);

  await pg.query("UPDATE account_nodes SET is_postable = false WHERE id = $1", [
    vatId,
  ]);
  expect((await send()).success).toBe(false);
  expect((await invoiceBalance(invoiceId)).status).toBe(InvoiceStatus.DRAFT);
  await pg.query("UPDATE account_nodes SET is_postable = true WHERE id = $1", [
    vatId,
  ]);
  expect((await send()).success).toBe(true);

  const { rows } = await pg.query<{
    account_id: string;
    type: string;
    amount: string;
  }>(
    `SELECT account_id, type, amount FROM journal_entry_lines
      JOIN journal_entries ON journal_entry_id = journal_entries.id
      WHERE source_id = $1 AND source_type = $2 ORDER BY sort_order`,
    [invoiceId, JournalSourceType.AR_INVOICE],
  );
  expect(rows).toEqual([
    { account_id: receivableId, type: LineType.DEBIT, amount: "123.0100" },
    { account_id: revenueId, type: LineType.CREDIT, amount: "100.0100" },
    { account_id: vatId, type: LineType.CREDIT, amount: "23.0000" },
  ]);

  const pay = (amount: number, accountNodeId = bankId) =>
    InvoiceRecordPaymentRepository.recordPayment(
      accountantId,
      { invoiceId },
      {
        amount,
        accountNodeId,
        method: ManualPaymentMethod.BANK_TRANSFER,
        paidAt: new Date(`${today}T14:00:00Z`),
      },
      logger,
    );
  expect((await pay(20.01, revenueId)).success).toBe(false);
  expect((await pay(20.001)).success).toBe(false);
  expect((await pay(20.01)).success).toBe(true);
  expect(await invoiceBalance(invoiceId)).toEqual({
    status: InvoiceStatus.OPEN,
    amountPaid: 20.01,
    amountDue: 103,
  });
  expect(
    (await InvoiceVoidRepository.voidInvoice(ownerId, { invoiceId }, logger))
      .success,
  ).toBe(false);

  await pg.query(
    `INSERT INTO payment_invoices (company_id, currency, status, amount, metadata)
      VALUES ($1, 'EUR', $2, -3, jsonb_build_object('originalInvoiceId', $3::text))`,
    [companyId, InvoiceStatus.OPEN, invoiceId],
  );
  expect((await pay(103)).success).toBe(false);
  const settlement = await Promise.all([pay(100), pay(100)]);
  expect(settlement.filter(({ success }) => success)).toHaveLength(1);
  expect(await invoiceBalance(invoiceId)).toEqual({
    status: InvoiceStatus.PAID,
    amountPaid: 120.01,
    amountDue: 0,
  });
});

it("voids an unapplied invoice with a linked journal reversal", async () => {
  const { InvoiceSendRepository } =
    await import("./[invoiceId]/send/repository");
  const { InvoiceVoidRepository } =
    await import("./[invoiceId]/void/repository");
  const invoiceId = await insertDraft();
  expect(
    (await InvoiceSendRepository.sendInvoice(ownerId, { invoiceId }, logger))
      .success,
  ).toBe(true);
  expect(
    (await InvoiceVoidRepository.voidInvoice(ownerId, { invoiceId }, logger))
      .success,
  ).toBe(true);
  expect((await invoiceBalance(invoiceId)).status).toBe(InvoiceStatus.VOID);
  const { rows } = await pg.query<{
    status: string;
    reversal_of_id: string | null;
    reversed_by_id: string | null;
    id: string;
  }>(
    "SELECT id, status, reversal_of_id, reversed_by_id FROM journal_entries WHERE source_id = $1 ORDER BY entry_number",
    [invoiceId],
  );
  const [original, reversal] = rows;
  expect(rows).toHaveLength(2);
  expect(original).toMatchObject({
    status: JournalEntryStatus.REVERSED,
    reversed_by_id: reversal?.id,
  });
  expect(reversal).toMatchObject({
    status: JournalEntryStatus.POSTED,
    reversal_of_id: original?.id,
  });
});

it("books the original VAT and receivable when crediting, rejects excess credits and rolls back failures", async () => {
  const { CreditNoteCreateRepository } =
    await import("../credit-note/create/repository");
  const { InvoiceSendRepository } =
    await import("./[invoiceId]/send/repository");
  const invoiceId = await insertDraft();
  expect(
    (await InvoiceSendRepository.sendInvoice(ownerId, { invoiceId }, logger))
      .success,
  ).toBe(true);

  const credit = (unitPrice: number, taxRate = 23) =>
    CreditNoteCreateRepository.createCreditNote(
      accountantId,
      {
        companyId,
        invoiceId,
        reason: "Price adjustment",
        lineItems: [{ description: "Labor", quantity: 1, unitPrice, taxRate }],
      },
      logger,
    );
  expect((await credit(100, 12)).success).toBe(false);
  await pg.query("UPDATE account_nodes SET is_postable = false WHERE id = $1", [
    vatId,
  ]);
  expect((await credit(60)).success).toBe(false);
  expect((await invoiceBalance(invoiceId)).amountDue).toBe(123.01);
  await pg.query("UPDATE account_nodes SET is_postable = true WHERE id = $1", [
    vatId,
  ]);

  const results = await Promise.all([credit(60), credit(60)]);
  expect(results.filter(({ success }) => success)).toHaveLength(1);
  expect((await invoiceBalance(invoiceId)).amountDue).toBe(49.21);
  const { rows } = await pg.query<{
    account_id: string;
    type: string;
    amount: string;
    invoice_number: string;
  }>(
    `SELECT account_id, type, lines.amount, notes.invoice_number
      FROM payment_invoices notes
      JOIN journal_entries journal ON journal.id = notes.journal_entry_id AND journal.source_id = notes.id
      JOIN journal_entry_lines lines ON lines.journal_entry_id = journal.id
      WHERE notes.metadata ->> 'originalInvoiceId' = $1 ORDER BY lines.sort_order`,
    [invoiceId],
  );
  expect(rows).toEqual([
    {
      account_id: receivableId,
      type: LineType.CREDIT,
      amount: "73.8000",
      invoice_number: expect.stringMatching(/^CN-/),
    },
    {
      account_id: revenueId,
      type: LineType.DEBIT,
      amount: "60.0000",
      invoice_number: expect.stringMatching(/^CN-/),
    },
    {
      account_id: vatId,
      type: LineType.DEBIT,
      amount: "13.8000",
      invoice_number: expect.stringMatching(/^CN-/),
    },
  ]);
});

it("creates draft lines, totals and unique company references together", async () => {
  const { InvoiceCreateRepository } = await import("./create/repository");
  const create = () =>
    InvoiceCreateRepository.createInvoice(
      accountantId,
      {
        companyId,
        lineItems: [
          {
            description: "Planning",
            quantity: 1,
            unitPrice: 100.5,
            taxRate: 0.23,
          },
          { description: "Review", quantity: 2, unitPrice: 5, taxRate: 0.1 },
        ],
      },
      logger,
    );
  const drafts = await Promise.all([create(), create()]);
  expect(drafts.every((result) => result.success)).toBe(true);
  const invoices = drafts.flatMap((result) =>
    result.success ? [result.data.invoice] : [],
  );
  expect(
    new Set(invoices.map((invoice) => invoice.invoiceSequenceNumber)).size,
  ).toBe(2);
  for (const invoice of invoices) {
    expect(invoice).toMatchObject({
      amount: "134.62",
      currency: "EUR",
      status: InvoiceStatus.DRAFT,
    });
    const { rows } = await pg.query<{
      description: string;
      line_total: string;
    }>(
      "SELECT description, line_total FROM payment_invoice_lines WHERE invoice_id = $1 ORDER BY sort_order",
      [invoice.id],
    );
    expect(rows).toEqual([
      { description: "Planning", line_total: "123.6200" },
      { description: "Review", line_total: "11.0000" },
    ]);
  }
});

it("uses active company roles for invoice reads and writes regardless of the creator", async () => {
  const { InvoiceGetRepository } = await import("./[invoiceId]/get/repository");
  const { InvoiceListRepository } = await import("./list/repository");
  const { InvoiceLineAddRepository } = await import("./line/add/repository");
  const { InvoiceLineRemoveRepository } =
    await import("./line/[lineId]/remove/repository");
  const { InvoiceDuplicateRepository } =
    await import("./[invoiceId]/duplicate/repository");
  const { InvoiceSendRepository } =
    await import("./[invoiceId]/send/repository");
  const { InvoiceVoidRepository } =
    await import("./[invoiceId]/void/repository");
  const { InvoiceRecordPaymentRepository } =
    await import("./[invoiceId]/record-payment/repository");
  const { InvoiceCreateRepository } = await import("./create/repository");

  const invoiceId = await insertDraft(revokedCreatorId);
  await pg.query(
    `INSERT INTO payment_invoice_reminder_drafts
      (invoice_id, company_id, due_date, currency, amount, note)
      VALUES ($1, $2, '2026-11-18', 'EUR', 123.01, 'Call customer')`,
    [invoiceId, companyId],
  );
  const source = { invoiceId };
  const get = (actor: string) =>
    InvoiceGetRepository.getInvoice(actor, source, logger);
  const list = (actor: string) =>
    InvoiceListRepository.listInvoices(
      actor,
      { companyId, page: 1, pageSize: 5 },
      logger,
    );
  const add = (actor: string, id = invoiceId) =>
    InvoiceLineAddRepository.addLine(
      actor,
      {
        invoiceId: id,
        description: "Consulting",
        quantity: 1,
        unitPrice: 10,
        taxRate: 0,
      },
      logger,
    );
  const forbidden = {
    success: false,
    errorType: ErrorResponseTypes.FORBIDDEN,
  };
  expect(await get(viewerId)).toMatchObject({
    success: true,
    data: {
      id: invoiceId,
      canManage: false,
      canCreateCreditNote: false,
      recentReminders: undefined,
    },
  });
  expect(await list(viewerId)).toMatchObject({
    success: true,
    data: { canCreateInvoice: false, selectedCompanyId: companyId },
  });
  expect(await list(accountantId)).toMatchObject({
    success: true,
    data: { canCreateInvoice: true },
  });
  expect(await get(revokedCreatorId)).toMatchObject(forbidden);
  expect(await get(foreignAccountantId)).toMatchObject(forbidden);
  expect(await list(foreignAccountantId)).toMatchObject(forbidden);

  const added = await add(accountantId);
  expect(added.success).toBe(true);
  if (!added.success) {
    return;
  }
  const line = { lineId: added.data.line.id };
  for (const actor of [viewerId, revokedCreatorId, foreignAccountantId]) {
    expect(await add(actor)).toMatchObject(forbidden);
    expect(
      await InvoiceLineRemoveRepository.removeLine(actor, line, logger),
    ).toMatchObject(forbidden);
    expect(
      await InvoiceDuplicateRepository.duplicateInvoice(actor, source, logger),
    ).toMatchObject(forbidden);
    expect(
      await InvoiceSendRepository.sendInvoice(actor, source, logger),
    ).toMatchObject(forbidden);
    expect(
      await InvoiceVoidRepository.voidInvoice(actor, source, logger),
    ).toMatchObject(forbidden);
    expect(
      await InvoiceRecordPaymentRepository.recordPayment(
        actor,
        source,
        {
          amount: 5,
          accountNodeId: bankId,
          method: ManualPaymentMethod.BANK_TRANSFER,
          paidAt: new Date(today),
        },
        logger,
      ),
    ).toMatchObject(forbidden);
  }

  expect(await get(accountantId)).toMatchObject({
    success: true,
    data: {
      id: invoiceId,
      canManage: true,
      // A draft invoice cannot be credited until it is issued.
      canCreateCreditNote: false,
      recentReminders: [{ currency: "EUR", amount: "123.01" }],
    },
  });
  expect(
    await InvoiceLineRemoveRepository.removeLine(accountantId, line, logger),
  ).toMatchObject({ success: true });
  expect(
    await InvoiceDuplicateRepository.duplicateInvoice(
      accountantId,
      source,
      logger,
    ),
  ).toMatchObject({
    success: true,
    data: { invoice: { companyId, status: InvoiceStatus.DRAFT } },
  });
  expect(
    await InvoiceSendRepository.sendInvoice(accountantId, source, logger),
  ).toMatchObject({ success: true });
  expect(
    await InvoiceVoidRepository.voidInvoice(accountantId, source, logger),
  ).toMatchObject({ success: true });

  const inactiveInvoice = await insertDraft(accountantId, inactiveCompanyId);
  expect(
    await InvoiceGetRepository.getInvoice(
      accountantId,
      { invoiceId: inactiveInvoice },
      logger,
    ),
  ).toMatchObject(forbidden);
  expect(await add(accountantId, inactiveInvoice)).toMatchObject(forbidden);
  expect(
    await InvoiceCreateRepository.createInvoice(
      accountantId,
      { companyId: inactiveCompanyId },
      logger,
    ),
  ).toMatchObject(forbidden);

  const personalId = await insertDraft(revokedCreatorId, null);
  await pg.query(
    "UPDATE payment_invoices SET metadata = jsonb_build_object('customerName', '  Saved customer  ') WHERE id = $1",
    [personalId],
  );
  expect(await add(revokedCreatorId, personalId)).toMatchObject({
    success: true,
  });
  expect(await add(accountantId, personalId)).toMatchObject(forbidden);
  expect(
    await InvoiceGetRepository.getInvoice(
      revokedCreatorId,
      { invoiceId: personalId },
      logger,
    ),
  ).toMatchObject({
    success: true,
    data: {
      companyId: null,
      customerName: "Saved customer",
      canManage: true,
      canCreateCreditNote: false,
    },
  });
  expect(
    await InvoiceGetRepository.getInvoice(
      accountantId,
      { invoiceId: personalId },
      logger,
    ),
  ).toMatchObject(forbidden);
});

it("persists the issued company reference and rejects a duplicate before posting", async () => {
  const { InvoiceSendRepository } =
    await import("./[invoiceId]/send/repository");
  const [first, duplicate, external] = await Promise.all([
    insertDraft(),
    insertDraft(),
    insertDraft(),
  ]);
  await pg.query(
    "UPDATE payment_invoices SET invoice_sequence_number = 172 WHERE id IN ($1, $2, $3)",
    [first, duplicate, external],
  );
  await pg.query(
    "UPDATE payment_invoices SET invoice_number = 'Imported-86' WHERE id = $1",
    [external],
  );
  const issue = (invoiceId: string) =>
    InvoiceSendRepository.sendInvoice(accountantId, { invoiceId }, logger);
  expect(await issue(first)).toMatchObject({ success: true });
  expect(await issue(duplicate)).toMatchObject({
    success: false,
    errorType: ErrorResponseTypes.CONFLICT,
  });
  expect(await issue(external)).toMatchObject({ success: true });
  const { rows } = await pg.query<{
    id: string;
    invoice_number: string | null;
    journal_entry_id: string | null;
  }>(
    "SELECT id, invoice_number, journal_entry_id FROM payment_invoices WHERE id IN ($1, $2, $3)",
    [first, duplicate, external],
  );
  expect(rows).toEqual(
    expect.arrayContaining([
      {
        id: first,
        invoice_number: "INV-172",
        journal_entry_id: expect.any(String),
      },
      { id: duplicate, invoice_number: null, journal_entry_id: null },
      {
        id: external,
        invoice_number: "Imported-86",
        journal_entry_id: expect.any(String),
      },
    ]),
  );
});

it("searches linked and snapshotted customer names and paginates positive overdue balances", async () => {
  const { InvoiceListRepository } = await import("./list/repository");
  const { OVERDUE_INVOICE_FILTER } = await import("./list/filters");
  const customerId = crypto.randomUUID();
  await pg.query(
    "INSERT INTO users (id, public_name, private_name) VALUES ($1, 'Mlyn Studio', 'Monika Mlynova')",
    [customerId],
  );

  const addInvoice = async (
    options: {
      status?: (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
      dueDate?: string | null;
      company?: string;
      metadata?: {
        customerName?: string;
        customerId?: string;
        originalInvoiceId?: string;
      };
      amount?: number;
    } = {},
  ): Promise<string> => {
    const id = crypto.randomUUID();
    await pg.query(
      `INSERT INTO payment_invoices
        (id, user_id, company_id, status, due_date, metadata, amount, currency)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, 'EUR')`,
      [
        id,
        accountantId,
        options.company ?? companyId,
        options.status ?? InvoiceStatus.OPEN,
        options.dueDate === undefined ? "2000-01-01" : options.dueDate,
        JSON.stringify(options.metadata ?? { customerName: "Aging fixture" }),
        options.amount ?? 40,
      ],
    );
    return id;
  };

  const linked = await addInvoice({
    amount: 37.25,
    metadata: { customerId, customerName: "Aging fixture old name" },
  });
  const saved = await addInvoice({
    amount: 25,
    metadata: { customerName: "  Aging fixture snapshot  " },
  });
  const fullyPaid = await addInvoice({ amount: 40 });
  const fullyCredited = await addInvoice({ amount: 20 });
  await addInvoice({
    amount: -20,
    metadata: { originalInvoiceId: fullyCredited },
  });
  await addInvoice({ amount: -12.25, metadata: { originalInvoiceId: linked } });
  await addInvoice({ dueDate: today });
  await addInvoice({ dueDate: "2999-01-01" });
  await addInvoice({ dueDate: null });
  await addInvoice({ status: InvoiceStatus.DRAFT });
  await addInvoice({ status: InvoiceStatus.PAID });
  await addInvoice({ amount: 0 });
  await addInvoice({ company: foreignCompanyId });

  const entryId = crypto.randomUUID();
  await pg.query(
    `INSERT INTO journal_entries (id, company_id, source_id, source_type, status)
      VALUES ($1, $2, $3, $4, $5)`,
    [
      entryId,
      companyId,
      fullyPaid,
      JournalSourceType.AR_PAYMENT,
      JournalEntryStatus.POSTED,
    ],
  );
  await pg.query(
    `INSERT INTO journal_entry_lines (journal_entry_id, account_id, type, amount, currency)
      VALUES ($1, $2, $3, 40, 'EUR')`,
    [entryId, receivableId, LineType.CREDIT],
  );

  const query = (
    search: string,
    page = 1,
    status?: typeof OVERDUE_INVOICE_FILTER,
  ) =>
    InvoiceListRepository.listInvoices(
      viewerId,
      { search, status, page, pageSize: 1 },
      logger,
    );
  for (const search of ["Mlyn Studio", "old name"]) {
    expect(await query(search)).toMatchObject({
      success: true,
      data: {
        total: 1,
        invoices: [{ id: linked, customerName: "Mlyn Studio" }],
      },
    });
  }
  expect(await query("monika mlynova")).toMatchObject({
    success: true,
    data: { total: 0, invoices: [] },
  });
  expect(await query("snapshot")).toMatchObject({
    success: true,
    data: {
      total: 1,
      invoices: [{ id: saved, customerName: "Aging fixture snapshot" }],
    },
  });

  const foundIds: string[] = [];
  for (const page of [1, 2]) {
    const result = await query("aging fixture", page, OVERDUE_INVOICE_FILTER);
    expect(result).toMatchObject({
      success: true,
      data: {
        total: 2,
        pageCount: 2,
        currentPage: page,
        invoices: [{ amountDue: 25, isOverdue: true }],
      },
    });
    if (result.success) {
      foundIds.push(...result.data.invoices.map(({ id }) => id));
    }
  }
  expect(foundIds.toSorted()).toEqual([linked, saved].toSorted());
});

it("credits two separately rounded invoice lines, and reverses full credit at the stored amounts", async () => {
  const { InvoiceCreateRepository } = await import("./create/repository");
  const { InvoiceSendRepository } =
    await import("./[invoiceId]/send/repository");
  const { CreditNoteCreateRepository } =
    await import("../credit-note/create/repository");
  const line = {
    description: "Catalogue page",
    quantity: 1,
    unitPrice: 1.07,
    taxRate: 0.23,
  };
  for (const mode of ["partial", "full"] as const) {
    const draft = await InvoiceCreateRepository.createInvoice(
      ownerId,
      { companyId, lineItems: [line, line] },
      logger,
    );
    expect(draft.success).toBe(true);
    if (!draft.success) return;
    const invoiceId = draft.data.invoice.id;
    expect(draft.data.invoice.amount).toBe("2.64");
    expect(
      (await InvoiceSendRepository.sendInvoice(ownerId, { invoiceId }, logger))
        .success,
    ).toBe(true);
    const sourceCredit = {
      companyId,
      invoiceId,
      reason: "Returned service",
      lineItems: mode === "partial" ? [{ ...line, taxRate: 23 }] : undefined,
    };
    const first = await CreditNoteCreateRepository.createCreditNote(
      ownerId,
      sourceCredit,
      logger,
    );
    expect(first.success).toBe(true);
    if (!first.success) return;
    expect(first.data.creditNote.amount).toBe(
      mode === "partial" ? "-1.32" : "-2.64",
    );
    if (mode === "partial") {
      const second = await CreditNoteCreateRepository.createCreditNote(
        ownerId,
        sourceCredit,
        logger,
      );
      expect(second.success).toBe(true);
      if (!second.success) return;
      expect(second.data.creditNote.amount).toBe("-1.32");
    }
    const surplus = await CreditNoteCreateRepository.createCreditNote(
      ownerId,
      sourceCredit,
      logger,
    );
    expect(surplus.success).toBe(false);
    expect((await invoiceBalance(invoiceId)).amountDue).toBe(0);
    const { rows } = await pg.query<{ vat: string; gross: string }>(
      `SELECT sum(lines.tax_amount)::text AS vat, sum(lines.line_total)::text AS gross
       FROM payment_invoices notes
       JOIN payment_invoice_lines lines ON lines.invoice_id = notes.id
       WHERE notes.metadata ->> 'originalInvoiceId' = $1`,
      [invoiceId],
    );
    expect(rows).toEqual([{ vat: "-0.5000", gross: "-2.6400" }]);
  }
});

it("carries the issued §19 notice into an exact zero-VAT full credit", async () => {
  const { InvoiceCreateRepository } = await import("./create/repository");
  const { InvoiceSendRepository } =
    await import("./[invoiceId]/send/repository");
  const { CreditNoteCreateRepository } =
    await import("../credit-note/create/repository");
  await pg.query(
    "INSERT INTO company_tax_regimes (company_id, effective_from, regime) VALUES ($1, $2, $3)",
    [companyId, today, CompanyTaxRegime.DE_SMALL_BUSINESS],
  );
  try {
    const draft = await InvoiceCreateRepository.createInvoice(
      ownerId,
      {
        companyId,
        lineItems: [
          {
            description: "Catalogue page",
            quantity: 1,
            unitPrice: 0.025,
            taxRate: 0,
          },
        ],
      },
      logger,
    );
    expect(draft.success).toBe(true);
    if (!draft.success) return;
    expect(draft.data.invoice.amount).toBe("0.03");
    const invoiceId = draft.data.invoice.id;
    expect(
      (await InvoiceSendRepository.sendInvoice(ownerId, { invoiceId }, logger))
        .success,
    ).toBe(true);
    const note = await CreditNoteCreateRepository.createCreditNote(
      ownerId,
      {
        companyId,
        invoiceId,
        reason: "Returned service",
      },
      logger,
    );
    expect(note.success).toBe(true);
    if (!note.success) return;
    expect(note.data.creditNote.amount).toBe("-0.03");
    const { rows } = await pg.query<{ amount: string; notice: string }>(
      "SELECT line.tax_amount AS amount, invoice.metadata->>'taxExemptionNotice' AS notice FROM payment_invoices invoice JOIN payment_invoice_lines line ON invoice.id = line.invoice_id WHERE invoice.id = $1",
      [note.data.creditNote.id],
    );
    expect(rows).toEqual([
      { amount: "0.0000", notice: expect.stringContaining("§ 19") },
    ]);
  } finally {
    await pg.query(
      "DELETE FROM company_tax_regimes WHERE company_id = $1 AND effective_from = $2",
      [companyId, today],
    );
  }
});
