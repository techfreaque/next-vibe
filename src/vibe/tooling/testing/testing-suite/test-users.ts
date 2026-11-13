/**
 * Throwaway customer accounts for tests.
 *
 * createTestUser() runs the real signup flow (server-side, no browser) on a
 * fresh lead of its own — never the admin's lead, which signup would link and
 * merge into the new account. deleteTestUser() removes the account and lead.
 */

import { eq } from "drizzle-orm";

import userDeleteDefinitions from "@/users/user/[id]/definition";

import { defaultLocale } from "../../../core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "../../../core/i18n/core/language-utils";
import type { ResponseType } from "../../../core/route/response.schema";
import { success } from "../../../core/route/response.schema";
import { db } from "../../../database";
import type { JwtPrivatePayloadType } from "../../../identity/auth/types";
import { leads, userLeadLinks } from "../../../identity/lead/db";
import { LeadSource, LeadStatus } from "../../../identity/lead/enum";
import { UserPermissionRole, UserRoleDB } from "../../../identity/roles/enum";
import { userRoles } from "../../../identity/user/db";
import { UserDetailLevel } from "../../../identity/user/enum";
import { UserRepository } from "../../../identity/user/repository";
import { createEndpointLogger } from "../../../logger/server";
import { resolveTestAdminUser } from "./resolve-test-user";
import { sendTestRequest } from "./send-test-request";

export const TEST_USER_PASSWORD = "E2eSecurePass123";

export interface TestUser {
  /** JWT payload — pass to loginAs() / sendTestRequest(). */
  user: JwtPrivatePayloadType;
  email: string;
  password: string;
  publicName: string;
}

function isUserRole(role: string): role is (typeof UserRoleDB)[number] {
  return (UserRoleDB as readonly string[]).includes(role);
}

/** Sign up a fresh customer account (own lead) and return its session payload. */
export async function createTestUser(
  email: string,
  publicName = "E2E Customer",
): Promise<ResponseType<TestUser>> {
  const { language, country } = getLanguageAndCountryFromLocale(defaultLocale);
  const [lead] = await db
    .insert(leads)
    .values({
      email: null,
      businessName: "",
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      country,
      language,
    })
    .returning({ id: leads.id });

  const { default: signupDefinitions } =
    await import("@/user/public/signup/definition");
  const signup = await sendTestRequest({
    endpoint: signupDefinitions.POST,
    data: {
      privateName: publicName,
      publicName,
      email,
      password: TEST_USER_PASSWORD,
      confirmPassword: TEST_USER_PASSWORD,
      acceptTerms: true,
      subscribeToNewsletter: false,
    },
    user: {
      isPublic: true,
      leadId: lead.id,
      roles: [UserPermissionRole.PUBLIC],
    },
    toolExecutionContext: undefined,
  });
  if (!signup.success) {
    return signup;
  }

  const logger = createEndpointLogger(false, defaultLocale);
  const found = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!found.success) {
    return found;
  }
  const userId = found.data.id;
  const [link] = await db
    .select({ leadId: userLeadLinks.leadId })
    .from(userLeadLinks)
    .where(eq(userLeadLinks.userId, userId))
    .limit(1);
  const roles = (
    await db
      .select({ role: userRoles.role })
      .from(userRoles)
      .where(eq(userRoles.userId, userId))
  )
    .map((r) => r.role)
    .filter(isUserRole);

  return success({
    user: {
      isPublic: false,
      id: userId,
      leadId: link?.leadId ?? lead.id,
      roles,
    },
    email,
    password: TEST_USER_PASSWORD,
    publicName,
  });
}

/** Delete a test account (and the leads linked to it). Safe to call twice. */
export async function deleteTestUser(userId: string): Promise<void> {
  const linked = await db
    .select({ leadId: userLeadLinks.leadId })
    .from(userLeadLinks)
    .where(eq(userLeadLinks.userId, userId));
  await sendTestRequest({
    endpoint: userDeleteDefinitions.DELETE,
    urlPathParams: { id: userId },
    user: await resolveTestAdminUser(),
    toolExecutionContext: undefined,
  });
  for (const { leadId } of linked) {
    await db.delete(leads).where(eq(leads.id, leadId));
  }
}
