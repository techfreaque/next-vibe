import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import { companies, companyMembers } from "../db";
import type { WorkspaceCompany } from "./workspace-company";

export function listWorkspaceCompanies(
  userId: string,
): Promise<WorkspaceCompany[]> {
  return db
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
      ),
    )
    .orderBy(asc(companies.name), asc(companies.id));
}
