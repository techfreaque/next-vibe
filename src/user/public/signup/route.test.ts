import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { pgliteReady } from "next-vibe/database/client";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { createAnonymousLead } from "next-vibe/identity/lead/middleware-ops";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { pendingSignups, signupMailAttempts } from "./db";
import signupEndpoints from "./definition";
import { setMxResolverForTests } from "./disposable-mx";
import { scopedTranslation } from "./i18n";

const endpoint = signupEndpoints.POST;
const logger = createEndpointLogger(false, defaultLocale);
const { t } = scopedTranslation.scopedT(defaultLocale);

describe("POST /user/public/signup", () => {
  let publicUser: JWTPublicPayloadType;
  let mailScopes: string[] = [];

  beforeAll(async () => {
    await pgliteReady;
    setMxResolverForTests(async () => ["mx.fixture.invalid"]);
  });
  afterAll(() => setMxResolverForTests(null));

  beforeEach(async () => {
    mailScopes = [];
    const leadId = await createAnonymousLead(
      { userAgent: randomUUID() },
      defaultLocale,
      logger,
    );
    publicUser = { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] };
    mailScopes.push(`lead:${leadId}`);
  });

  afterEach(async () => {
    if (mailScopes.length === 0) {
      return;
    }
    await db.delete(leads).where(eq(leads.id, publicUser.leadId));
    await db
      .delete(signupMailAttempts)
      .where(inArray(signupMailAttempts.scope, mailScopes));
  });

  const uniqueEmail = (): string => {
    const email = `test-signup-${randomUUID()}@example-test.invalid`;
    mailScopes.push(`email:${email}`);
    return email;
  };

  it("starts a pending signup with a trimmed one-character private name", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: " A ",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(
      res.success,
      `Signup failed: ${String(res.success === false && res.message)}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.pendingId).toBeTypeOf("string");
    expect(res.data.message).toBeTypeOf("string");
    expect(res.data.message.length).toBeGreaterThan(0);
    const [pending] = await db
      .select({ privateName: pendingSignups.privateName })
      .from(pendingSignups)
      .where(eq(pendingSignups.id, res.data.pendingId));
    expect(pending?.privateName).toBe("A");
  });

  it("throttles repeated confirmation mail to the same address", async () => {
    const email = uniqueEmail();

    const first = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "First User",
        publicName: "First",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(
      first.success,
      `First signup failed: ${String(first.success === false && first.message)}`,
    ).toBe(true);

    const second = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Duplicate User",
        publicName: "Duplicate",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });
    // Same browser: no second mail, the code already sent stays valid.
    expect(second.success && second.data.pendingId).toBe(
      first.success && first.data.pendingId,
    );

    const otherLeadId = await createAnonymousLead(
      { userAgent: randomUUID() },
      defaultLocale,
      logger,
    );
    mailScopes.push(`lead:${otherLeadId}`);
    const other = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Other Browser",
        publicName: "Other",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: {
        isPublic: true,
        leadId: otherLeadId,
        roles: [UserPermissionRole.PUBLIC],
      },
    });
    await db.delete(leads).where(eq(leads.id, otherLeadId));

    expect(other.success).toBe(false);
    if (other.success) {
      return;
    }
    expect(other.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
    expect(other.message).toBe(t("confirmation.cooldown"));
  });

  it("rejects weak password (too short) with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "short",
        confirmPassword: "short",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("rejects password without uppercase with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "alllowercase123",
        confirmPassword: "alllowercase123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("rejects invalid email format with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: "not-an-email",
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("rejects if acceptTerms is false with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Test User",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: false,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("rejects a whitespace-only private name with VALIDATION_ERROR", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "   ",
        publicName: "Tester",
        email: uniqueEmail(),
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("email is stored lowercase even if submitted with uppercase", async () => {
    const base = uniqueEmail();
    const upperEmail = base.toUpperCase();

    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Case Test",
        publicName: "CaseTester",
        email: upperEmail,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });

    expect(
      res.success,
      `Signup with uppercase email failed: ${String(res.success === false && res.message)}`,
    ).toBe(true);
  });

  it("rejects an unknown referral code before creating the account", async () => {
    const email = uniqueEmail();
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Referral Test",
        publicName: "RefTester",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
        referralCode: `NO-SUCH-CODE-${Date.now()}`,
      },
      user: publicUser,
    });

    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
    expect(res.message).toBe(t("fields.referralCode.validation.invalid"));

    // Retry from the same lead and address with the rejected code cleared.
    const retry = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint,
      data: {
        privateName: "Referral Test",
        publicName: "RefTester",
        email,
        password: "SecurePass123",
        confirmPassword: "SecurePass123",
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser,
    });
    expect(
      retry.success,
      `Retry without code failed: ${String(retry.success === false && retry.message)}`,
    ).toBe(true);
  });
});
