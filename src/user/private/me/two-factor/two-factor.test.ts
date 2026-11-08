/**
 * Two-factor integration: setup -> enable -> login gate -> recovery -> disable.
 * Real DB (test instance), no mail sent (signup mail failures are non-blocking).
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { UserDetailLevel } from "next-vibe/identity/user/enum";
import { UserRepository } from "next-vibe/identity/user/repository";
import { createEndpointLogger } from "next-vibe/logger/server";
import { clearLoginAttempts } from "next-vibe/tooling/testing/testing-suite/login-attempts";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import loginEndpoints from "../../../public/login/definition";
import signupEndpoints from "../../../public/signup/definition";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import twoFactorEndpoints from "./definition";
import { TwoFactorAction } from "./enum";
import { TwoFactorRepository } from "./repository";
import { decryptSecret, totpAt } from "./totp";

const PASSWORD = "SecurePass123";
const logger = createEndpointLogger(false, defaultLocale);

describe("two-factor", () => {
  let admin: JwtPrivatePayloadType;
  const emails: string[] = [];

  beforeAll(async () => {
    admin = await resolveTestAdminUser();
  });

  afterAll(async () => {
    for (const email of emails) {
      await clearLoginAttempts(email);
      const found = await UserRepository.getUserByEmail(
        email,
        UserDetailLevel.STANDARD,
        defaultLocale,
        logger,
      );
      if (found.success) {
        await sendTestRequest({
          endpoint: userDeleteDefinitions.DELETE,
          urlPathParams: { id: found.data.id },
          user: admin,
          toolExecutionContext: undefined,
        });
      }
    }
  });

  const publicUser = () => ({
    isPublic: true as const,
    leadId: admin.leadId,
    roles: [UserPermissionRole.PUBLIC],
  });

  async function makeUser(): Promise<{
    id: string;
    email: string;
    asUser: JwtPrivatePayloadType;
  }> {
    const email = `test-2fa-${Date.now()}-${Math.floor(Math.random() * 100000)}@example-test.invalid`;
    emails.push(email);
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: signupEndpoints.POST,
      data: {
        privateName: "TwoFa Test",
        publicName: "TwoFaTest",
        email,
        password: PASSWORD,
        confirmPassword: PASSWORD,
        acceptTerms: true,
        subscribeToNewsletter: false,
      },
      user: publicUser(),
    });
    expect(res.success, JSON.stringify(res)).toBe(true);
    const found = await UserRepository.getUserByEmail(
      email,
      UserDetailLevel.STANDARD,
      defaultLocale,
      logger,
    );
    if (!found.success) {
      throw new Error("user not created");
    }
    return {
      id: found.data.id,
      email,
      asUser: {
        id: found.data.id,
        leadId: admin.leadId,
        isPublic: false,
        roles: [UserPermissionRole.CUSTOMER],
      },
    };
  }

  const call = (
    user: JwtPrivatePayloadType,
    data: { action: (typeof TwoFactorAction)[keyof typeof TwoFactorAction]; code?: string; password?: string },
  ) =>
    sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: twoFactorEndpoints.POST,
      data,
      user,
    });

  const login = (email: string, twoFactorCode?: string) =>
    sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: loginEndpoints.POST,
      data: { email, password: PASSWORD, rememberMe: false, twoFactorCode },
      user: publicUser(),
    });

  it("non-2FA user logs in unchanged", async () => {
    const u = await makeUser();
    const res = await login(u.email);
    expect(res.success, JSON.stringify(res)).toBe(true);
    const status = await call(u.asUser, { action: TwoFactorAction.STATUS });
    expect(status.success && status.data.enabled).toBe(false);
  }, 60_000);

  it("enable requires a pending setup and a valid code; secret is encrypted at rest", async () => {
    TwoFactorRepository.resetThrottleForTests();
    const u = await makeUser();

    const noSetup = await call(u.asUser, {
      action: TwoFactorAction.ENABLE,
      code: "123456",
    });
    expect(noSetup.success).toBe(false);

    const setup = await call(u.asUser, { action: TwoFactorAction.SETUP });
    expect(setup.success).toBe(true);
    if (!setup.success) {
      return;
    }
    const secret = setup.data.secret;
    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
    expect(setup.data.otpauthUri).toContain(`secret=${secret}`);
    expect(setup.data.qrDataUri).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(setup.data.enabled).toBe(false);

    // pending secret must not turn login into a 2FA login
    expect((await login(u.email)).success).toBe(true);

    const [row] = await db
      .select({ s: users.twoFactorSecret })
      .from(users)
      .where(eq(users.id, u.id));
    expect(row?.s).toBeTruthy();
    expect(row?.s).not.toContain(secret ?? "");
    expect(decryptSecret(row?.s ?? "")).toBe(secret);

    const wrong = await call(u.asUser, {
      action: TwoFactorAction.ENABLE,
      code: "000000",
    });
    expect(wrong.success).toBe(false);
    const stillOff = await call(u.asUser, { action: TwoFactorAction.STATUS });
    expect(stillOff.success && stillOff.data.enabled).toBe(false);

    const ok = await call(u.asUser, {
      action: TwoFactorAction.ENABLE,
      code: totpAt(secret ?? "", Date.now()),
    });
    expect(ok.success, JSON.stringify(ok)).toBe(true);
    if (!ok.success) {
      return;
    }
    expect(ok.data.enabled).toBe(true);
    expect(ok.data.recoveryCodes).toHaveLength(10);

    // recovery codes are stored hashed
    const [after] = await db
      .select({ r: users.twoFactorRecoveryCodes })
      .from(users)
      .where(eq(users.id, u.id));
    expect(after?.r).not.toContain(ok.data.recoveryCodes?.[0] ?? "");
  }, 60_000);

  it("login requires a correct TOTP or single-use recovery code", async () => {
    TwoFactorRepository.resetThrottleForTests();
    const u = await makeUser();
    const setup = await call(u.asUser, { action: TwoFactorAction.SETUP });
    const secret = setup.success ? (setup.data.secret ?? "") : "";
    const enabled = await call(u.asUser, {
      action: TwoFactorAction.ENABLE,
      code: totpAt(secret, Date.now()),
    });
    const recovery = enabled.success ? (enabled.data.recoveryCodes ?? []) : [];
    expect(recovery.length).toBe(10);

    const missing = await login(u.email);
    expect(missing.success).toBe(false);

    const wrong = await login(u.email, "000000");
    expect(wrong.success).toBe(false);

    const good = await login(u.email, totpAt(secret, Date.now()));
    expect(good.success, JSON.stringify(good)).toBe(true);

    const rc = recovery[0] ?? "";
    const viaRecovery = await login(u.email, rc);
    expect(viaRecovery.success, JSON.stringify(viaRecovery)).toBe(true);
    const reused = await login(u.email, rc);
    expect(reused.success).toBe(false);
    // a different recovery code still works
    expect((await login(u.email, recovery[1] ?? "")).success).toBe(true);

    const status = await call(u.asUser, { action: TwoFactorAction.STATUS });
    expect(status.success && status.data.recoveryCodesRemaining).toBe(8);
  }, 60_000);

  it("regenerate and disable need valid credentials; public cannot call", async () => {
    TwoFactorRepository.resetThrottleForTests();
    const u = await makeUser();
    const setup = await call(u.asUser, { action: TwoFactorAction.SETUP });
    const secret = setup.success ? (setup.data.secret ?? "") : "";
    const enabled = await call(u.asUser, {
      action: TwoFactorAction.ENABLE,
      code: totpAt(secret, Date.now()),
    });
    const oldCodes = enabled.success ? (enabled.data.recoveryCodes ?? []) : [];

    expect((await call(u.asUser, { action: TwoFactorAction.DISABLE })).success).toBe(false);
    expect(
      (await call(u.asUser, { action: TwoFactorAction.DISABLE, password: "wrong-password" })).success,
    ).toBe(false);
    expect(
      (await call(u.asUser, { action: TwoFactorAction.REGENERATE, code: "000000" })).success,
    ).toBe(false);

    const regen = await call(u.asUser, {
      action: TwoFactorAction.REGENERATE,
      code: totpAt(secret, Date.now()),
    });
    expect(regen.success).toBe(true);
    if (regen.success) {
      expect(regen.data.recoveryCodes).toHaveLength(10);
      expect(regen.data.recoveryCodes).not.toContain(oldCodes[0]);
    }
    // old recovery codes are dead
    expect((await login(u.email, oldCodes[0] ?? "")).success).toBe(false);

    const disabled = await call(u.asUser, {
      action: TwoFactorAction.DISABLE,
      password: PASSWORD,
    });
    expect(disabled.success).toBe(true);
    expect(disabled.success && disabled.data.enabled).toBe(false);
    // back to plain password login
    expect((await login(u.email)).success).toBe(true);

    const anon = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: twoFactorEndpoints.POST,
      data: { action: TwoFactorAction.STATUS },
      user: publicUser(),
    });
    expect(anon.success).toBe(false);
  }, 60_000);

  it("throttles repeated wrong codes", async () => {
    TwoFactorRepository.resetThrottleForTests();
    const u = await makeUser();
    const setup = await call(u.asUser, { action: TwoFactorAction.SETUP });
    const secret = setup.success ? (setup.data.secret ?? "") : "";
    for (let i = 0; i < 5; i++) {
      await call(u.asUser, { action: TwoFactorAction.ENABLE, code: "000000" });
    }
    const blocked = await call(u.asUser, {
      action: TwoFactorAction.ENABLE,
      code: totpAt(secret, Date.now()),
    });
    expect(blocked.success).toBe(false);
    TwoFactorRepository.resetThrottleForTests();
  }, 60_000);
});
