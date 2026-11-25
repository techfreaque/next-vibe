import "server-only";

import { and, eq, inArray, type SQL } from "drizzle-orm";
import { db } from "next-vibe/database";

import { companies, companyMembers } from "@/companies/db";
import {
  CompanyMemberRole,
  type CompanyMemberRoleValue,
} from "@/companies/enum";

const documentManagerRoles = [
  CompanyMemberRole.OWNER,
  CompanyMemberRole.ADMIN,
  CompanyMemberRole.ACCOUNTANT,
];

function activeMembership(userId: string, companyId?: string): SQL | undefined {
  return and(
    eq(companyMembers.userId, userId),
    eq(companyMembers.isActive, true),
    eq(companies.isActive, true),
    companyId ? eq(companies.id, companyId) : undefined,
  );
}

export function canManageCompanyDocuments(
  role: typeof CompanyMemberRoleValue,
): boolean {
  return documentManagerRoles.some((managerRole) => managerRole === role);
}

export async function getDocumentAccess(
  userId: string,
  scope: { companyId: string | null; userId?: string },
  tx?: Pick<typeof db, "select">,
): Promise<{ companyName: string | null; canManage: boolean } | null> {
  if (!scope.companyId) {
    return scope.userId === userId
      ? { companyName: null, canManage: true }
      : null;
  }

  const memberships = (tx ?? db)
    .select({ companyName: companies.name, role: companyMembers.role })
    .from(companyMembers)
    .innerJoin(companies, eq(companyMembers.companyId, companies.id))
    .where(activeMembership(userId, scope.companyId))
    .limit(1);
  const [member] = tx
    ? await memberships.for("share", { of: companyMembers })
    : await memberships;
  return member
    ? {
        companyName: member.companyName,
        canManage: canManageCompanyDocuments(member.role),
      }
    : null;
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
    .where(activeMembership(userId, companyId));
}

export async function canManageDocumentsInCompanySelection(
  userId: string,
  companyId?: string,
): Promise<boolean> {
  const [member] = await db
    .select({ role: companyMembers.role })
    .from(companyMembers)
    .innerJoin(companies, eq(companyMembers.companyId, companies.id))
    .where(
      and(
        activeMembership(userId, companyId),
        inArray(companyMembers.role, documentManagerRoles),
      ),
    )
    .limit(1);
  return Boolean(member);
}
