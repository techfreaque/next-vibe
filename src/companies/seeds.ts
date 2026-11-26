import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies, companyMembers } from "./db";
import { DEMO_COMPANY_NAME } from "./demo-company";
import {
  demoRecordId,
  findDemoAdmin,
  findDemoCompany,
} from "./demo-company.repository";
import { CompanyMemberRole, CompanyType } from "./enum";

export const priority = 80;

export async function dev(logger: EndpointLogger): Promise<void> {
  const adminId = await findDemoAdmin();
  if (!adminId) {
    logger.warn("Configured development admin is missing; skipping ERP demo");
    return;
  }
  const existing = await findDemoCompany(adminId);
  const companyId = existing?.id ?? demoRecordId(adminId, "company");

  await db.transaction(async (tx) => {
    if (!existing) {
      await tx
        .insert(companies)
        .values({
          id: companyId,
          name: DEMO_COMPANY_NAME,
          type: CompanyType.B2B,
          ownerUserId: adminId,
          currency: "EUR",
          country: "DE",
          city: "Berlin",
          email: "accounts@demo-company.example",
          website: "https://demo-company.example",
        })
        .onConflictDoNothing();
    }

    await tx
      .insert(companyMembers)
      .values({
        companyId,
        userId: adminId,
        role: CompanyMemberRole.OWNER,
        joinedAt: new Date(),
      })
      .onConflictDoNothing();
  });
  logger.debug("ERP demo company is ready", { companyId });
}
