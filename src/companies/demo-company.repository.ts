import "server-only";

import { createHash } from "node:crypto";

import { and, eq, or } from "drizzle-orm";
import { db } from "next-vibe/database";
import { identityEnv } from "next-vibe/identity/env";
import { users } from "next-vibe/identity/user/db";

import { companies, companyMembers } from "./db";
import { DEMO_COMPANY_NAME } from "./demo-company";
import { CompanyMemberRole } from "./enum";

export function demoRecordId(scope: string, key: string): string {
  const hex = createHash("sha256")
    .update(`erp-demo:${scope}:${key}`)
    .digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export async function findDemoAdmin(): Promise<string | undefined> {
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, identityEnv.VIBE_ADMIN_USER_EMAIL))
    .limit(1);
  return admin?.id;
}

export async function findDemoCompany(
  adminId?: string,
): Promise<{ id: string; name: string; adminId: string } | undefined> {
  const userId = adminId ?? (await findDemoAdmin());
  if (!userId) {
    return undefined;
  }
  const [company] = await db
    .select({ id: companies.id, name: companies.name })
    .from(companies)
    .leftJoin(
      companyMembers,
      and(
        eq(companyMembers.companyId, companies.id),
        eq(companyMembers.userId, userId),
        eq(companyMembers.isActive, true),
        eq(companyMembers.role, CompanyMemberRole.OWNER),
      ),
    )
    .where(
      and(
        eq(companies.name, DEMO_COMPANY_NAME),
        eq(companies.isActive, true),
        or(
          eq(companies.ownerUserId, userId),
          eq(companyMembers.userId, userId),
        ),
      ),
    )
    .orderBy(companies.createdAt, companies.id)
    .limit(1);
  return company ? { ...company, adminId: userId } : undefined;
}
