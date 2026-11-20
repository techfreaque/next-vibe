import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import { companies, companyMembers } from "@/companies/db";
import {
  CompanyMemberRole,
  type CompanyMemberRoleValue,
} from "@/companies/enum";

export function canManageCompanyDocuments(
  role: typeof CompanyMemberRoleValue,
): boolean {
  return (
    role === CompanyMemberRole.OWNER ||
    role === CompanyMemberRole.ADMIN ||
    role === CompanyMemberRole.ACCOUNTANT
  );
}

export async function getDocumentCompanies(
  userId: string,
  companyId?: string,
): Promise<{ id: string; name: string; currency: string | null }[]> {
  return await db
    .select({
      id: companies.id,
      name: companies.name,
      currency: companies.currency,
    })
    .from(companyMembers)
    .innerJoin(companies, eq(companyMembers.companyId, companies.id))
    .where(
      and(
        eq(companyMembers.userId, userId),
        eq(companyMembers.isActive, true),
        eq(companies.isActive, true),
        companyId ? eq(companies.id, companyId) : undefined,
      ),
    );
}
