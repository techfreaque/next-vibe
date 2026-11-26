/**
 * Dev-only Slovak demo company: a VAT payer with the Slovak chart, rates,
 * two customers (SK and CZ) and issued invoices with SK VAT and with
 * reverse charge. Runs through the real onboarding and invoice repositories
 * so the country checks are exercised. Called from ./seeds.ts (dev only);
 * lives outside seeds.ts because the dev server stubs seeds modules.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userAddresses, userRoles, users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import { CompanyOnboardRepository } from "@/companies/[companyId]/onboard/repository";
import { companies, companyMembers } from "@/companies/db";
import {
  demoRecordId,
  findDemoAdmin,
} from "@/companies/demo-company.repository";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { paymentInvoices } from "@/payment/db";
import { InvoiceSendRepository } from "@/payment/invoice/[invoiceId]/send/repository";
import { InvoiceCreateRepository } from "@/payment/invoice/create/repository";

import { companyTaxRegimes } from "../regime/db";
import { CompanyTaxRegime } from "../regime/enum";
import { VatTreatment } from "./enum";

export const SK_DEMO_COMPANY_ID = "5c0a1e5b-0000-4000-8000-00000000005b";
export const SK_DEMO_COMPANY_NAME = "Demo Slovensko s.r.o.";

const SK_CUSTOMERS = [
  {
    key: "tatra",
    name: "Tatra Obchod s.r.o.",
    addressLine1: "Námestie SNP 12",
    city: "Banská Bystrica",
    postalCode: "974 01",
    country: "SK",
    taxId: "2021869234",
    vatNumber: "SK2021869234",
  },
  {
    key: "vltava",
    name: "Vltava Digital s.r.o.",
    addressLine1: "Národní 2",
    city: "Praha",
    postalCode: "110 00",
    country: "CZ",
    taxId: null,
    vatNumber: "CZ12345678",
  },
] as const;

export async function seedSlovakDemoCompany(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  const adminId = await findDemoAdmin();
  if (!adminId) {
    logger.debug("SK demo: no admin user, skipping");
    return;
  }
  const companyId = SK_DEMO_COMPANY_ID;
  await db
    .insert(companies)
    .values({
      id: companyId,
      name: SK_DEMO_COMPANY_NAME,
      type: CompanyType.B2B,
      country: "SK",
      currency: "EUR",
      registrationNumber: "35763469",
      taxId: "2020273893",
      vatNumber: "SK2020273893",
      addressLine1: "Hlavná 1",
      city: "Bratislava",
      postalCode: "811 01",
      email: "fakturacia@demo-slovensko.example",
      ownerUserId: adminId,
    })
    .onConflictDoNothing();
  await db
    .insert(companyMembers)
    .values({ companyId, userId: adminId, role: CompanyMemberRole.OWNER })
    .onConflictDoNothing();

  const [chart] = await db
    .select({ id: accountNodes.id })
    .from(accountNodes)
    .where(eq(accountNodes.companyId, companyId))
    .limit(1);
  if (!chart) {
    const year = new Date().getUTCFullYear();
    const onboarded = await CompanyOnboardRepository.onboardCompany(
      adminId,
      { companyId },
      {
        country: "SK",
        openFirstPeriod: true,
        periodName: `${year}`,
        periodStart: `${year}-01-01`,
        periodEnd: `${year}-12-31`,
      },
      logger,
      locale,
    );
    if (!onboarded.success) {
      logger.warn("SK demo: onboarding failed", {
        message: onboarded.message,
      });
      return;
    }
  }
  await db
    .insert(companyTaxRegimes)
    .values({
      companyId,
      effectiveFrom: "2025-01-01",
      regime: CompanyTaxRegime.STANDARD,
      recordedBy: adminId,
    })
    .onConflictDoNothing();

  const customerIds: Record<(typeof SK_CUSTOMERS)[number]["key"], string> = {
    tatra: demoRecordId(companyId, "customer:tatra"),
    vltava: demoRecordId(companyId, "customer:vltava"),
  };
  for (const customer of SK_CUSTOMERS) {
    const id = customerIds[customer.key];
    await db
      .insert(users)
      .values({
        id,
        email: `${customer.key}+${companyId}@demo-company.example`,
        privateName: customer.name,
        publicName: customer.name,
        password: "!",
        locale,
        isActive: false,
      })
      .onConflictDoNothing();
    await db
      .insert(userRoles)
      .values({
        id: demoRecordId(id, "role"),
        userId: id,
        role: UserRole.CUSTOMER,
      })
      .onConflictDoNothing();
    await db
      .insert(userAddresses)
      .values({
        id: demoRecordId(id, "billing"),
        userId: id,
        label: "Fakturačná adresa",
        company: customer.name,
        addressLine1: customer.addressLine1,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country,
        taxId: customer.taxId,
        vatNumber: customer.vatNumber,
        isDefaultBilling: true,
      })
      .onConflictDoNothing();
  }

  const [existing] = await db
    .select({ id: paymentInvoices.id })
    .from(paymentInvoices)
    .where(
      and(
        eq(paymentInvoices.companyId, companyId),
        eq(paymentInvoices.userId, adminId),
      ),
    )
    .limit(1);
  if (existing) {
    return;
  }

  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const samples = [
    {
      customerId: customerIds.tatra,
      vatTreatment: VatTreatment.DOMESTIC,
      lineItems: [
        {
          description: "Implementácia účtovného systému",
          quantity: 10,
          unitPrice: 80,
          taxRate: 0.23,
        },
        {
          description: "Odborná príručka (kniha)",
          quantity: 2,
          unitPrice: 25,
          taxRate: 0.05,
        },
      ],
    },
    {
      customerId: customerIds.vltava,
      vatTreatment: VatTreatment.EU_SERVICES_REVERSE_CHARGE,
      lineItems: [
        {
          description: "Konzultačné služby (október)",
          quantity: 1,
          unitPrice: 1200,
          taxRate: 0,
        },
      ],
    },
  ];
  for (const sample of samples) {
    const created = await InvoiceCreateRepository.createInvoice(
      adminId,
      {
        companyId,
        currency: "EUR",
        supplyDate: today,
        dueDate: new Date(today.getTime() + 14 * 86_400_000),
        notes: "Splatnosť 14 dní",
        ...sample,
      },
      logger,
      locale,
    );
    if (!created.success) {
      logger.warn("SK demo: invoice draft failed", {
        message: created.message,
      });
      continue;
    }
    const issued = await InvoiceSendRepository.sendInvoice(
      adminId,
      { invoiceId: created.data.invoice.id },
      logger,
      locale,
    );
    if (!issued.success) {
      logger.warn("SK demo: invoice issue failed", { message: issued.message });
    }
  }
  logger.debug("SK demo company seeded", { companyId });
}
