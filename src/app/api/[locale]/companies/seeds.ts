/**
 * Companies seeds
 * Creates a demo company with the admin user as owner + member
 */

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { users } from "../user/db";
import { companies, companyMembers } from "./db";
import { CompanyMemberRole, CompanyType } from "./enum";

const DEMO_COMPANY_NAME = "Demo Company";

/**
 * Development seed — creates a demo company and makes the admin user its owner
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;
  // Find the first admin user (lowest createdAt)
  const adminUsers = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .limit(1);

  if (adminUsers.length === 0) {
    logger.warn("No users found — skipping companies seed");
    return;
  }

  const adminUser = adminUsers[0];

  // Check if demo company already exists
  const existing = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.name, DEMO_COMPANY_NAME))
    .limit(1);

  let companyId: string;

  if (existing.length > 0) {
    companyId = existing[0].id;
    logger.debug(`Demo company already exists: ${companyId}`);
  } else {
    const [company] = await db
      .insert(companies)
      .values({
        name: DEMO_COMPANY_NAME,
        type: CompanyType.B2C,
        ownerUserId: adminUser.id,
        currency: "EUR",
        country: "DE",
        isActive: true,
      })
      .returning({ id: companies.id });

    companyId = company.id;
    logger.debug(`Created demo company: ${companyId}`);
  }

  // Ensure admin user is an active OWNER member
  const existingMember = await db
    .select({ id: companyMembers.id })
    .from(companyMembers)
    .where(
      and(
        eq(companyMembers.companyId, companyId),
        eq(companyMembers.userId, adminUser.id),
      ),
    )
    .limit(1);

  if (existingMember.length === 0) {
    await db.insert(companyMembers).values({
      companyId,
      userId: adminUser.id,
      role: CompanyMemberRole.OWNER,
      isActive: true,
    });
    logger.debug(
      `Added admin user ${adminUser.email} as OWNER of demo company`,
    );
  } else {
    logger.debug(`Admin user is already a member of demo company`);
  }

  logger.debug("✅ Companies seed complete");
}

/**
 * Production seed — same as dev: ensure at least one company exists for admin
 */
export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  return dev(logger, locale);
}

// Priority: after users (100) but before POS (5)
export const priority = 80;
