import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";

import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole } from "@/companies/enum";
import { subscriptions } from "@/subscription/db";

export async function readCompanyOwnerBilling(
  companyId: string,
  userId: string,
): Promise<
  | {
      companyName: string;
      subscription: typeof subscriptions.$inferSelect | null;
    }
  | undefined
> {
  const [result] = await db
    .select({ companyName: companies.name, subscription: subscriptions })
    .from(companies)
    .innerJoin(
      companyMembers,
      and(
        eq(companyMembers.companyId, companies.id),
        eq(companyMembers.userId, companies.ownerUserId),
        eq(companyMembers.isActive, true),
        eq(companyMembers.role, CompanyMemberRole.OWNER),
      ),
    )
    .leftJoin(subscriptions, eq(subscriptions.userId, companies.ownerUserId))
    .where(
      and(
        eq(companies.id, companyId),
        eq(companies.ownerUserId, userId),
        eq(companies.isActive, true),
      ),
    )
    .limit(1);
  return result;
}
