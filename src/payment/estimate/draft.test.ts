import { PGlite } from "@electric-sql/pglite";
import { beforeAll, afterAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { CompanyMemberRole } from "@/companies/enum";
import { EstimateStatus } from "../enum";
import createDefinition from "./create/definition";
import lineDefinition from "./line/add/definition";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const company = crypto.randomUUID(),
  other = crypto.randomUUID(),
  user = crypto.randomUUID(),
  foreignProduct = crypto.randomUUID();
const logger = createEndpointLogger(false, defaultLocale);
const year = new Date().getUTCFullYear();
beforeAll(async () => {
  await pg.exec(`
 create table companies(id uuid primary key,name text,currency text,is_active boolean);
 create table company_members(id uuid,company_id uuid,user_id uuid,role text,is_active boolean,invited_by_user_id uuid,joined_at timestamp,created_at timestamp,updated_at timestamp);
 create table catalog_products(id uuid,company_id uuid,owner_user_id uuid);
 create table payment_estimates(id uuid primary key default gen_random_uuid(),company_id uuid,estimate_number text,status text,customer_id uuid,customer_email text,customer_name text,currency text,valid_until timestamp,title text,notes text,terms text,subtotal numeric(12,4),tax_amount numeric(12,4),total numeric(12,4),sent_at timestamp,accepted_at timestamp,declined_at timestamp,invoice_id uuid,metadata jsonb,created_at timestamp default now(),updated_at timestamp default now(), unique(company_id,estimate_number));
 create table payment_estimate_lines(id uuid primary key default gen_random_uuid(),estimate_id uuid references payment_estimates(id),description text check(description<>'Broken row'),product_id uuid,quantity numeric(12,4),unit_price numeric(12,4),tax_rate numeric(12,4),tax_amount numeric(12,4),line_total numeric(12,4),sort_order int,created_at timestamp default now(),updated_at timestamp default now());
 create table payment_invoices(id uuid primary key default gen_random_uuid(),user_id uuid,company_id uuid,provider_invoice_id text,invoice_number text,invoice_sequence_number int,amount numeric(10,2),currency text,status text,invoice_url text,invoice_pdf text,due_date timestamp,paid_at timestamp,callback_token text,notes text,journal_entry_id uuid,metadata jsonb,created_at timestamp default now(),updated_at timestamp);
 create table payment_invoice_lines(id uuid default gen_random_uuid(),invoice_id uuid,description text,product_id uuid,quantity numeric(12,4),unit_price numeric(12,4),tax_rate numeric(12,4),tax_amount numeric(12,4),line_total numeric(12,4),sort_order int,created_at timestamp,updated_at timestamp);
 insert into companies values ('${company}','Our company','PLN',true),('${other}','Other','EUR',true);
 insert into company_members(company_id,user_id,role,is_active) values ('${company}','${user}','${CompanyMemberRole.ACCOUNTANT}',true);
 insert into catalog_products values ('${foreignProduct}','${other}',null);
 insert into payment_estimates(company_id,estimate_number,status,total) values ('${company}','EST-${year}-0009','${EstimateStatus.DRAFT}',0);
 `);
});
afterAll(() => pg.close());

test("estimate allocates beyond existing suffixes, defaults company currency and saves exact item amounts with its header", async () => {
  const { EstimateCreateRepository } = await import("./create/repository");
  const { EstimateDuplicateRepository } =
    await import("./[estimateId]/duplicate/repository");
  const input = createDefinition.POST.requestSchema.parse({
    companyId: company,
    title: "Quote A",
    lines: [
      { description: "Part", quantity: 0.01, unitPrice: 0.015, taxRate: 0.23 },
      { description: "Services", unitPrice: 20, taxRate: 0.23 },
    ],
  });
  const result = await EstimateCreateRepository.createEstimate(
    user,
    input,
    logger,
  );
  expect(result.success && result.data.estimate).toMatchObject({
    currency: "PLN",
    estimateNumber: `EST-${year}-0010`,
    subtotal: 20,
    taxAmount: 4.6,
    total: 24.6,
  });
  if (!result.success) return;
  const copies = await Promise.all(
    [1, 2].map(() =>
      EstimateDuplicateRepository.duplicateEstimate(
        user,
        { estimateId: result.data.estimate.id },
        logger,
      ),
    ),
  );
  const numbers = copies
    .flatMap((row) => (row.success ? [row.data.estimateNumber] : []))
    .toSorted();
  expect(numbers).toEqual([`EST-${year}-0011`, `EST-${year}-0012`]);
  const clone = await pg.query(
    "select title,total::text from payment_estimates where estimate_number=$1",
    [numbers[0]],
  );
  expect(clone.rows).toEqual([{ title: "Quote A", total: "24.6000" }]);
});

test("rejects foreign products, rolls back a failed line insert and serializes status and line mutations", async () => {
  const { EstimateCreateRepository } = await import("./create/repository");
  const { EstimateLineAddRepository } = await import("./line/add/repository");
  const { EstimateLineRemoveRepository } =
    await import("./line/[lineId]/remove/repository");
  const { EstimateAcceptRepository } =
    await import("./[estimateId]/accept/repository");
  const { EstimateDeclineRepository } =
    await import("./[estimateId]/decline/repository");
  const { EstimateSendRepository } =
    await import("./[estimateId]/send/repository");
  const add = (description: string, productId?: string) =>
    EstimateCreateRepository.createEstimate(
      user,
      createDefinition.POST.requestSchema.parse({
        companyId: company,
        title: "Forbidden or broken",
        lines: [{ description, productId, unitPrice: 4 }],
      }),
      logger,
    );
  expect((await add("Foreign", foreignProduct)).success).toBe(false);
  expect((await add("Broken row")).success).toBe(false);
  expect(
    (
      await pg.query(
        "select id from payment_estimates where title='Forbidden or broken'",
      )
    ).rows,
  ).toHaveLength(0);
  const draft = await add("Good row");
  expect(draft.success).toBe(true);
  if (!draft.success) {
    return;
  }
  const estimateId = draft.data.estimate.id;
  const addLine = () =>
    EstimateLineAddRepository.addLine(
      user,
      lineDefinition.POST.requestSchema.parse({
        estimateId,
        description: "Service",
        quantity: 2,
        unitPrice: 3,
        taxRate: 0.2,
      }),
      logger,
    );
  const line = await addLine();
  expect(line.success && line.data.line.lineTotal).toBe(7.2);
  if (!line.success) return;
  expect(
    (
      await EstimateLineRemoveRepository.removeLine(
        user,
        { lineId: line.data.line.id },
        logger,
      )
    ).success,
  ).toBe(true);
  const sent = await EstimateSendRepository.sendEstimate(
    user,
    { estimateId },
    logger,
  );
  expect(sent.success).toBe(true);
  expect((await addLine()).success).toBe(false);
  const decisions = await Promise.all([
    EstimateAcceptRepository.acceptEstimate(user, { estimateId }, logger),
    EstimateDeclineRepository.declineEstimate(user, { estimateId }, logger),
  ]);
  expect(decisions.filter((row) => row.success)).toHaveLength(1);
  const dates = await pg.query(
    "select sent_at is not null as sent, (accepted_at is null) <> (declined_at is null) as decided,total::text from payment_estimates where id=$1",
    [estimateId],
  );
  expect(dates.rows).toEqual([{ sent: true, decided: true, total: "4.0000" }]);
});

test("converts a quoted recipient without a user account and rejects a mismatched legacy quote", async () => {
  const { EstimateCreateRepository } = await import("./create/repository");
  const { EstimateSendRepository } =
    await import("./[estimateId]/send/repository");
  const { EstimateConvertToInvoiceRepository } =
    await import("./[estimateId]/convert-to-invoice/repository");
  const result = await EstimateCreateRepository.createEstimate(
    user,
    createDefinition.POST.requestSchema.parse({
      companyId: company,
      customerName: "Paper Mill",
      customerEmail: "accounts@example.invalid",
      lines: [
        { description: "Freight", quantity: 1, unitPrice: 6.125, taxRate: 0 },
      ],
    }),
    logger,
  );
  expect(result.success).toBe(true);
  if (!result.success) return;
  const estimateId = result.data.estimate.id;
  await EstimateSendRepository.sendEstimate(user, { estimateId }, logger);
  // An accepted legacy quote predates per-line settlement. Its four-place
  // lines and original cent conversion must survive a retry.
  await pg.query(
    "update payment_estimate_lines set line_total=6.125 where estimate_id=$1",
    [estimateId],
  );
  await pg.query(
    "update payment_estimates set metadata=null, subtotal=6.125, total=17 where id=$1",
    [estimateId],
  );
  expect(
    (
      await EstimateConvertToInvoiceRepository.convertToInvoice(
        user,
        { estimateId },
        logger,
      )
    ).success,
  ).toBe(false);
  expect((await pg.query("select id from payment_invoices")).rows).toHaveLength(
    0,
  );
  await pg.query("update payment_estimates set total=6.125 where id=$1", [
    estimateId,
  ]);
  const tries = await Promise.all(
    [1, 2].map(() =>
      EstimateConvertToInvoiceRepository.convertToInvoice(
        user,
        { estimateId },
        logger,
      ),
    ),
  );
  expect(tries.filter((row) => row.success)).toHaveLength(1);
  const invoices = await pg.query(
    "select amount::text,currency,metadata->>'customerName' as customer,metadata->>'estimateId' as source from payment_invoices",
  );
  expect(invoices.rows).toEqual([
    {
      amount: "6.13",
      currency: "PLN",
      customer: "Paper Mill",
      source: estimateId,
    },
  ]);
});

test("an archived company or a viewer cannot create an estimate", async () => {
  const { EstimateCreateRepository } = await import("./create/repository");
  const viewer = crypto.randomUUID();
  await pg.query(
    "insert into company_members(company_id,user_id,role,is_active) values ($1,$2,$3,true),($4,$5,$6,true)",
    [
      company,
      viewer,
      CompanyMemberRole.VIEWER,
      other,
      user,
      CompanyMemberRole.ACCOUNTANT,
    ],
  );
  await pg.query("update companies set is_active=false where id=$1", [other]);
  for (const [companyId, userId] of [
    [company, viewer],
    [other, user],
  ]) {
    const result = await EstimateCreateRepository.createEstimate(
      userId,
      createDefinition.POST.requestSchema.parse({
        companyId,
        title: "Restricted quote",
      }),
      logger,
    );
    expect(result.success).toBe(false);
  }
  expect(
    (
      await pg.query(
        "select id from payment_estimates where title='Restricted quote'",
      )
    ).rows,
  ).toHaveLength(0);
});

test("a quote using line rounding cannot convert a fractional or mismatched tax total", async () => {
  const { EstimateCreateRepository } = await import("./create/repository");
  const { EstimateConvertToInvoiceRepository } =
    await import("./[estimateId]/convert-to-invoice/repository");
  const created = await EstimateCreateRepository.createEstimate(
    user,
    createDefinition.POST.requestSchema.parse({
      companyId: company,
      title: "Line-rounded quote",
      lines: [
        {
          description: "First print",
          quantity: 1,
          unitPrice: 1.07,
          taxRate: 0.23,
        },
        {
          description: "Second print",
          quantity: 1,
          unitPrice: 1.07,
          taxRate: 0.23,
        },
      ],
    }),
    logger,
  );
  expect(created.success && created.data.estimate).toMatchObject({
    subtotal: 2.14,
    taxAmount: 0.5,
    total: 2.64,
  });
  if (!created.success) return;
  const estimateId = created.data.estimate.id;
  await pg.query(
    "update payment_estimates set status=$1, tax_amount=.49 where id=$2",
    [EstimateStatus.SENT, estimateId],
  );
  const convert = () =>
    EstimateConvertToInvoiceRepository.convertToInvoice(
      user,
      { estimateId },
      logger,
    );
  expect((await convert()).success).toBe(false);
  await pg.query("update payment_estimates set tax_amount=.5 where id=$1", [
    estimateId,
  ]);
  await pg.query(
    "update payment_estimate_lines set tax_amount=.2461 where estimate_id=$1",
    [estimateId],
  );
  expect((await convert()).success).toBe(false);
  expect(
    (
      await pg.query(
        "select count(*)::int as n from payment_invoices where metadata->>'estimateId'=$1",
        [estimateId],
      )
    ).rows,
  ).toEqual([{ n: 0 }]);
});
