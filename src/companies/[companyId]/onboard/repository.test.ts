import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, expect, mock, test } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  AccountSubtype,
  AccountType,
  PeriodStatus,
} from "@/chart-of-accounts/enum";
import { CoaSetupRepository } from "@/chart-of-accounts/setup/repository";
import { listWorkspaceCompanies } from "@/companies/_shared/workspace-company.repository";
import { CompaniesCreateRepository } from "@/companies/create/repository";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";

import { proposeOpeningMonth } from "./first-period";
import { CompanyOnboardRepository } from "./repository";

const pg = new PGlite();
mock.module("next-vibe/database", () => ({ db: drizzle(pg) }));
const logger = createEndpointLogger(false, defaultLocale);
const ownerId = crypto.randomUUID();

beforeAll(async () => {
  await pg.exec(`
    CREATE TABLE companies (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
      type text NOT NULL, vat_number text, tax_id text, registration_number text,
      country text, currency text, fiscal_year_start int, address_line1 text,
      address_line2 text, city text, region text, postal_code text, email text,
      phone text, website text, logo_url text, owner_user_id uuid NOT NULL,
      is_active boolean DEFAULT true, created_at timestamp, updated_at timestamp
    );
    CREATE TABLE company_members (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL REFERENCES companies(id),
      user_id uuid NOT NULL, role text NOT NULL, is_active boolean DEFAULT true,
      invited_by_user_id uuid, joined_at timestamp, created_at timestamp, updated_at timestamp,
      UNIQUE (company_id, user_id)
    );
    CREATE TABLE accounting_periods (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL,
      name text NOT NULL, start_date timestamp NOT NULL, end_date timestamp NOT NULL,
      status text NOT NULL DEFAULT '${PeriodStatus.OPEN}', closed_at timestamp,
      closed_by_user_id uuid, created_at timestamp DEFAULT now(), updated_at timestamp DEFAULT now()
    );
    CREATE TABLE coa_templates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), country text NOT NULL, is_default boolean NOT NULL
    );
    CREATE TABLE coa_template_nodes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), template_id uuid NOT NULL REFERENCES coa_templates(id),
      code text NOT NULL, name text NOT NULL, name_de text, name_pl text, type text NOT NULL,
      subtype text NOT NULL, parent_code text, is_postable boolean NOT NULL, sort_order int,
      created_at timestamp DEFAULT now(), UNIQUE (template_id, code)
    );
    CREATE TABLE account_nodes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL,
      template_node_id uuid REFERENCES coa_template_nodes(id), code text NOT NULL,
      name text NOT NULL, type text NOT NULL, subtype text NOT NULL, parent_id uuid,
      is_postable boolean DEFAULT true, is_active boolean DEFAULT true, is_system boolean DEFAULT false,
      description text, sort_order int DEFAULT 0, created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now(), UNIQUE (company_id, code)
    );
    CREATE TABLE tax_rates (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL REFERENCES companies(id),
      name text NOT NULL, code text NOT NULL, type text NOT NULL, rate numeric NOT NULL,
      country text, region text, tax_payable_account_id uuid, tax_receivable_account_id uuid,
      is_default boolean, is_active boolean, is_compound boolean, created_at timestamp,
      updated_at timestamp, UNIQUE (company_id, code)
    );
  `);

  for (const country of ["DE", "XX"]) {
    const id = crypto.randomUUID();
    await pg.query(
      "INSERT INTO coa_templates (id, country, is_default) VALUES ($1, $2, true)",
      [id, country],
    );
    await pg.query(
      `INSERT INTO coa_template_nodes
         (template_id, code, name, type, subtype, parent_code, is_postable, sort_order)
       VALUES ($1, '100', 'Assets', $2, $3, NULL, false, 0),
         ($1, '110', 'Cash', $2, $3, '100', true, 1)
       `,
      [id, AccountType.ASSET, AccountSubtype.CASH],
    );
  }
});
afterAll(() => pg.close());

async function createCompany(country: string, name = country): Promise<string> {
  const result = await CompaniesCreateRepository.createCompany(
    {
      details: {
        name,
        type: CompanyType.B2B,
        country,
        email: undefined,
        phone: undefined,
        website: undefined,
      },
    },
    logger,
    ownerId,
    defaultLocale,
  );
  expect(result.success).toBe(true);
  return result.success ? result.data.result.id : "";
}

async function snapshot(companyId: string) {
  const accounts = await pg.query<{
    id: string;
    code: string;
    parentId: string | null;
  }>(
    'SELECT id, code, parent_id AS "parentId" FROM account_nodes WHERE company_id = $1 ORDER BY code',
    [companyId],
  );
  const rates = await pg.query<{ code: string }>(
    "SELECT code FROM tax_rates WHERE company_id = $1 ORDER BY code",
    [companyId],
  );
  return { accounts: accounts.rows, rates: rates.rows };
}

test("company creation rolls back if assigning the owner fails", async () => {
  const roleConstraint = "test_company_member_reject_owner";
  await pg.exec(`
    ALTER TABLE company_members ADD CONSTRAINT ${roleConstraint}
    CHECK (role <> '${CompanyMemberRole.OWNER}');
  `);
  const result = await CompaniesCreateRepository.createCompany(
    {
      details: {
        name: "Rolled back company",
        type: CompanyType.B2B,
        email: undefined,
        phone: undefined,
        website: undefined,
      },
    },
    logger,
    ownerId,
    defaultLocale,
  );
  await pg.exec(
    `ALTER TABLE company_members DROP CONSTRAINT ${roleConstraint};`,
  );
  expect(result.success).toBe(false);
  expect(
    (
      await pg.query("SELECT id FROM companies WHERE name = $1", [
        "Rolled back company",
      ])
    ).rows,
  ).toHaveLength(0);
});

test("rejects a mismatched or missing template before writing any defaults", async () => {
  for (const country of ["DE", "AT"]) {
    const companyId = await createCompany(country);
    const response = await CompanyOnboardRepository.onboardCompany(
      ownerId,
      { companyId },
      { country: "AT" },
      logger,
    );
    expect(response.success).toBe(false);
    expect(await snapshot(companyId)).toEqual({ accounts: [], rates: [] });
  }
});

test("rolls chart changes back when tax seeding fails and safely retries", async () => {
  const companyId = await createCompany("DE", "German company");
  await pg.exec(`
    ALTER TABLE tax_rates ADD CONSTRAINT test_reject_de_tax_rate CHECK (code <> 'DE_VAT_7');
  `);
  const failed = await CompanyOnboardRepository.onboardCompany(
    ownerId,
    { companyId },
    { country: "DE" },
    logger,
  );
  try {
    expect(failed.success).toBe(false);
    expect(await snapshot(companyId)).toEqual({ accounts: [], rates: [] });
  } finally {
    await pg.exec(
      "ALTER TABLE tax_rates DROP CONSTRAINT test_reject_de_tax_rate;",
    );
  }

  const request = { companyId };
  const [first, second] = await Promise.all([
    CompanyOnboardRepository.onboardCompany(
      ownerId,
      request,
      { country: "DE" },
      logger,
    ),
    CompanyOnboardRepository.onboardCompany(
      ownerId,
      request,
      { country: "DE" },
      logger,
    ),
  ]);
  expect(first.success && second.success).toBe(true);
  if (first.success && second.success) {
    expect(
      [first.data.accountsCreated, second.data.accountsCreated].toSorted(),
    ).toEqual([0, 2]);
    expect(
      [first.data.taxRatesCreated, second.data.taxRatesCreated].toSorted(),
    ).toEqual([0, 3]);
    expect(first.data.cashAccountId).toEqual(second.data.cashAccountId);
    expect(first.data.bankAccountId).toEqual(second.data.bankAccountId);
    expect(first.data.companyName).toEqual("German company");
  }

  const result = await snapshot(companyId);
  expect(result.rates.map(({ code }) => code)).toEqual([
    "DE_VAT_0",
    "DE_VAT_19",
    "DE_VAT_7",
  ]);
  expect(result.accounts.map(({ code }) => code)).toEqual([
    "100",
    "110",
    "BANK-DEFAULT",
  ]);
  expect(result.accounts[1]?.parentId).toBe(result.accounts[0]?.id);
});

test("generic chart setup reuses installed accounts and adds no country tax presets", async () => {
  const companyId = await createCompany(" sk ", "Slovak company");
  const denied = await CompanyOnboardRepository.onboardCompany(
    crypto.randomUUID(),
    { companyId },
    { country: "XX" },
    logger,
  );
  expect(denied.success).toBe(false);
  expect(await snapshot(companyId)).toEqual({ accounts: [], rates: [] });

  const chart = await CoaSetupRepository.setupChartOfAccounts(
    { companyId, country: "XX" },
    ownerId,
    logger,
    defaultLocale,
  );
  expect(chart.success).toBe(true);
  const existingCash = (await snapshot(companyId)).accounts[1];
  const result = await CompanyOnboardRepository.onboardCompany(
    ownerId,
    { companyId },
    { country: "XX" },
    logger,
  );
  expect(result.success).toBe(true);
  if (result.success) {
    expect(result.data.accountsCreated).toBe(0);
    expect(result.data.accountsSkipped).toBe(2);
    expect(result.data.taxRatesCreated).toBe(0);
    expect(result.data.cashAccountId).toBe(existingCash?.id);
    expect(result.data.bankAccountId).toBeTruthy();
  }
  expect((await snapshot(companyId)).rates).toEqual([]);
});

test("workspace companies exclude disabled memberships and inactive companies", async () => {
  const memberDisabled = await createCompany("DE", "Membership disabled");
  const companyDisabled = await createCompany("DE", "Company disabled");
  const active = await createCompany("DE", "Active company");
  await pg.query(
    "UPDATE company_members SET is_active = false WHERE company_id = $1",
    [memberDisabled],
  );
  await pg.query("UPDATE companies SET is_active = false WHERE id = $1", [
    companyDisabled,
  ]);
  const options = await listWorkspaceCompanies(ownerId);
  expect(options.find(({ id }) => id === active)).toEqual({
    id: active,
    name: "Active company",
    currency: "EUR",
  });
  expect(
    options.some(({ id }) => id === memberDisabled || id === companyDisabled),
  ).toBe(false);
  expect(await listWorkspaceCompanies(crypto.randomUUID())).toEqual([]);
});

async function calendar(companyId: string) {
  return (
    await pg.query<{
      name: string;
      start: string;
      end: string;
      status: string;
    }>(
      'SELECT name, start_date::date::text AS start, end_date::date::text AS "end", status FROM accounting_periods WHERE company_id = $1 ORDER BY start_date',
      [companyId],
    )
  ).rows;
}

test("proposes the UTC accounting month including its last day", () => {
  expect(
    proposeOpeningMonth("en-US", new Date("2028-02-22T13:00:00Z")),
  ).toEqual({
    periodName: "February 2028",
    periodStart: "2028-02-01",
    periodEnd: "2028-02-29",
  });
});

test("validates a proposed period before writes and supports opting out", async () => {
  const companyId = await createCompany("DE");
  const proposal = {
    country: "DE",
    periodName: "Fiscal 2026",
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
  } satisfies Parameters<typeof CompanyOnboardRepository.onboardCompany>[2];
  const invalid = await CompanyOnboardRepository.onboardCompany(
    ownerId,
    { companyId },
    { ...proposal, openFirstPeriod: true, periodEnd: "2025-12-31" },
    logger,
  );
  expect(invalid.success).toBe(false);
  expect(await snapshot(companyId)).toEqual({ accounts: [], rates: [] });
  expect(await calendar(companyId)).toEqual([]);

  const optedOut = await CompanyOnboardRepository.onboardCompany(
    ownerId,
    { companyId },
    { ...proposal, openFirstPeriod: false },
    logger,
  );
  expect(optedOut.success && optedOut.data.hasPeriods).toBe(false);
  expect(await calendar(companyId)).toEqual([]);
  expect((await snapshot(companyId)).accounts.length).toBeGreaterThan(0);
});

test("opens one custom first period under concurrent retries and preserves it later", async () => {
  const companyId = await createCompany("DE");
  const proposal = {
    country: "DE",
    openFirstPeriod: true,
    periodName: "Fiscal 2026",
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
  } satisfies Parameters<typeof CompanyOnboardRepository.onboardCompany>[2];
  const responses = await Promise.all([
    CompanyOnboardRepository.onboardCompany(
      ownerId,
      { companyId },
      proposal,
      logger,
    ),
    CompanyOnboardRepository.onboardCompany(
      ownerId,
      { companyId },
      proposal,
      logger,
    ),
  ]);
  expect(
    responses.every((result) => result.success && result.data.hasPeriods),
  ).toBe(true);
  expect(
    responses.filter((result) => result.success && result.data.periodCreated),
  ).toHaveLength(1);
  expect(await calendar(companyId)).toEqual([
    {
      name: "Fiscal 2026",
      start: "2026-01-01",
      end: "2026-12-31",
      status: PeriodStatus.OPEN,
    },
  ]);
  const retry = await CompanyOnboardRepository.onboardCompany(
    ownerId,
    { companyId },
    { ...proposal, periodName: "Replacement Month", periodEnd: "2026-01-31" },
    logger,
  );
  expect(retry.success && retry.data.periodCreated).toBe(false);
  expect((await calendar(companyId))[0]?.name).toBe("Fiscal 2026");
});

test("keeps an existing closed calendar without adding the suggested month", async () => {
  const companyId = await createCompany("DE");
  await pg.query(
    "INSERT INTO accounting_periods (company_id,name,start_date,end_date,status) VALUES ($1,'Archived fiscal year','2024-01-01','2024-12-31',$2)",
    [companyId, PeriodStatus.CLOSED],
  );
  const result = await CompanyOnboardRepository.onboardCompany(
    ownerId,
    { companyId },
    { country: "DE", openFirstPeriod: true, ...proposeOpeningMonth("en-US") },
    logger,
  );
  expect(result.success && result.data.hasPeriods).toBe(true);
  expect(result.success && result.data.periodCreated).toBe(false);
  expect(await calendar(companyId)).toEqual([
    {
      name: "Archived fiscal year",
      start: "2024-01-01",
      end: "2024-12-31",
      status: PeriodStatus.CLOSED,
    },
  ]);
});

test("rolls back chart and tax defaults if opening the period fails", async () => {
  const companyId = await createCompany("DE");
  await pg.exec(
    "ALTER TABLE accounting_periods ADD CONSTRAINT fixture_period_reject CHECK (name <> 'Fail first period');",
  );
  const parameters = {
    country: "DE",
    openFirstPeriod: true,
    periodName: "Fail first period",
    periodStart: "2026-11-01",
    periodEnd: "2026-11-30",
  } satisfies Parameters<typeof CompanyOnboardRepository.onboardCompany>[2];
  try {
    const failed = await CompanyOnboardRepository.onboardCompany(
      ownerId,
      { companyId },
      parameters,
      logger,
    );
    expect(failed.success).toBe(false);
    expect(await snapshot(companyId)).toEqual({ accounts: [], rates: [] });
    expect(await calendar(companyId)).toEqual([]);
  } finally {
    await pg.exec(
      "ALTER TABLE accounting_periods DROP CONSTRAINT fixture_period_reject;",
    );
  }
  const recovered = await CompanyOnboardRepository.onboardCompany(
    ownerId,
    { companyId },
    parameters,
    logger,
  );
  expect(recovered.success && recovered.data.periodCreated).toBe(true);
  expect(await calendar(companyId)).toHaveLength(1);
});
