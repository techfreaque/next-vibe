// Testing infrastructure - messages are for test debugging, not end users

/**
 * Throwaway customer for paid-endpoint E2E suites: signs up a fresh account
 * through the real signup endpoint ON ITS OWN anonymous lead (a lead shared
 * with another account would merge credit pools / history), tops it up to
 * `credits` permanent credits and hands back a JWT payload for `loginAs` plus
 * a `remove` for `cleanup` (deletes the account — cascading its threads,
 * messages and credits — and its lead).
 *
 *   const buyer = await createE2ECreditUser("image-gen", 200);
 *   cleanup(buyer.remove);
 *   await loginAs(buyer.user);
 *
 * Never use the admin account for spend-bearing tests — its balance and
 * history are shared by every other agent/suite on the instance.
 */

import { eq, or } from "drizzle-orm";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import signupEndpoints from "@/user/public/signup/definition";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import { defaultLocale } from "../../../core/i18n/core/config";
import { db } from "../../../database";
import type { JwtPrivatePayloadType } from "../../../identity/auth/types";
import { leads } from "../../../identity/lead/db";
import { createAnonymousLead } from "../../../identity/lead/middleware-ops";
import { UserPermissionRole, UserRoleDB } from "../../../identity/roles/enum";
import { userRoles } from "../../../identity/user/db";
import { UserDetailLevel } from "../../../identity/user/enum";
import { UserRepository } from "../../../identity/user/repository";
import { createEndpointLogger } from "../../../logger/server";
import { resolveTestAdminUser } from "../../../tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "../../../tooling/testing/testing-suite/send-test-request";
import { ChatModelId } from "../models-definitions";

const PASSWORD = "E2eCreditUser123";

export interface E2ECreditUser {
  user: JwtPrivatePayloadType;
  email: string;
  /** Delete the account and its lead (register with `cleanup`). */
  remove: () => Promise<void>;
}

function isRole(role: string): role is (typeof UserRoleDB)[number] {
  return UserRoleDB.some((r) => r === role);
}

/**
 * Spend the account's whole balance (as if spent elsewhere). A balance read
 * can lazily grant the month's free credits, so read → spend until a read
 * comes back empty — otherwise a "broke" customer silently has credits again
 * and a refusal test goes live.
 */
export async function drainCredits(user: JwtPrivatePayloadType): Promise<void> {
  const logger = createEndpointLogger(false, defaultLocale);
  const { t } = creditsScopedTranslation.scopedT(defaultLocale);
  for (let round = 0; round < 5; round++) {
    const balance = await CreditRepository.getCreditBalanceForUser(
      user,
      defaultLocale,
      logger,
      t,
    );
    if (!balance.success) {
      // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
      throw new Error(`[e2e] balance read failed: ${JSON.stringify(balance)}`);
    }
    if (balance.data.total <= 0) {
      return;
    }
    // Model-usage deduction (allowPartial): draining is test setup, not a
    // generation, so it must not trip the public free-tier cap gate (that
    // gate guards pre-generation spend; the real cap is left untouched).
    const spent = await CreditRepository.deductCreditsForModelUsage(
      user,
      balance.data.total,
      ChatModelId.GPT_5_4,
      logger,
      t,
      defaultLocale,
    );
    if (!spent.success) {
      // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
      throw new Error(`[e2e] drain failed: ${JSON.stringify(spent)}`);
    }
  }
  // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
  throw new Error("[e2e] balance would not drain to 0");
}

/**
 * @param credits Permanent credits to top the account up to. Pass 0 for a
 *   broke customer (signup's free allowance is left as-is).
 */
export async function createE2ECreditUser(
  tag: string,
  credits: number,
): Promise<E2ECreditUser> {
  const logger = createEndpointLogger(false, defaultLocale);
  const nonce = `${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  const email = `e2e-${tag.replaceAll(/[^a-z0-9]+/gi, "-")}-${nonce}@example.com`;
  const leadId = await createAnonymousLead(
    { userAgent: `e2e-credit-user-${nonce}` },
    defaultLocale,
    logger,
  );

  const signup = await sendTestRequest({
    endpoint: signupEndpoints.POST,
    data: {
      privateName: "E2E Buyer",
      publicName: `E2EBuyer${nonce}`,
      email,
      password: PASSWORD,
      confirmPassword: PASSWORD,
      subscribeToNewsletter: false,
      acceptTerms: true,
    },
    user: { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] },
    toolExecutionContext: undefined,
  });
  if (!signup.success) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error(`[e2e] signup failed: ${JSON.stringify(signup)}`);
  }

  const found = await UserRepository.getUserByEmail(
    email,
    UserDetailLevel.STANDARD,
    defaultLocale,
    logger,
  );
  if (!found.success || !found.data) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error(`[e2e] signed-up user ${email} not found`);
  }
  const userId = found.data.id;
  const roleRows = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, userId));
  const user: JwtPrivatePayloadType = {
    isPublic: false,
    id: userId,
    leadId,
    roles: roleRows.map((r) => r.role).filter(isRole),
  };

  if (credits > 0) {
    const { t } = creditsScopedTranslation.scopedT(defaultLocale);
    const balance = await CreditRepository.getCreditBalanceForUser(
      user,
      defaultLocale,
      logger,
      t,
    );
    const current = balance.success ? balance.data.total : 0;
    if (current < credits) {
      await CreditRepository.addUserCredits(
        user.id,
        credits - current,
        "permanent",
        logger,
        t,
      );
    }
  }

  return {
    user,
    email,
    remove: async (): Promise<void> => {
      await sendTestRequest({
        endpoint: userDeleteDefinitions.DELETE,
        urlPathParams: { id: userId },
        user: await resolveTestAdminUser(),
        toolExecutionContext: undefined,
      });
      // Signup converts the lead and may spawn one keyed by the email
      await db
        .delete(leads)
        .where(or(eq(leads.id, leadId), eq(leads.email, email)));
    },
  };
}

export interface E2EFundedGuest {
  leadId: string;
  /** Delete the lead (cascades its wallet, packs and transactions). */
  remove: () => Promise<void>;
}

/**
 * Throwaway anonymous visitor with its own `credits` permanent credits.
 *
 * Browser-minted leads on localhost all share one IP, so the middleware links
 * them into one lead pool (see `linkLeadsByIp`) whose monthly free allowance
 * is spent after a few guest suites — every later spend-bearing guest test
 * would 402. This lead is created without an IP, so it is never pooled, and
 * carries a paid pack so the budget doesn't depend on the free tier.
 * The anti-abuse pooling for real visitors is untouched.
 */
export async function createE2EFundedGuest(
  tag: string,
  credits: number,
): Promise<E2EFundedGuest> {
  const logger = createEndpointLogger(false, defaultLocale);
  const { leadId, remove } = await createE2EFreeGuest(tag);
  const { t } = creditsScopedTranslation.scopedT(defaultLocale);
  const funded = await CreditRepository.addCredits(
    { leadId },
    credits,
    "permanent",
    logger,
    t,
    defaultLocale,
  );
  if (!funded.success) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error(`[e2e] funding guest failed: ${JSON.stringify(funded)}`);
  }
  return { leadId, remove };
}

/**
 * Throwaway anonymous visitor on nothing but the guest free allowance — what a
 * first-time visitor gets. Created without an IP, so it is never pooled with
 * the other localhost leads (whose shared monthly allowance other suites
 * spend): the balance starts at exactly FREE_CREDIT_ALLOWANCE.guest.
 * Put `leadId` in the browser's lead cookie to browse as this guest.
 */
export async function createE2EFreeGuest(tag: string): Promise<E2EFundedGuest> {
  const logger = createEndpointLogger(false, defaultLocale);
  const nonce = `${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  const leadId = await createAnonymousLead(
    { userAgent: `e2e-guest-${tag}-${nonce}` },
    defaultLocale,
    logger,
  );
  return {
    leadId,
    remove: async (): Promise<void> => {
      await db.delete(leads).where(eq(leads.id, leadId));
    },
  };
}
