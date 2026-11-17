/**
 * Cross-account isolation for inbound remote tool execution.
 *
 * A connected peer holds its account's token and controls the whole
 * tool-execute-request / tool-execute-result payload. These tests pin the
 * guards that keep one customer's peer inside its own account:
 *
 *   RI1 — resolveInboundPlatform clamps non-admin platform claims
 *   RI2 — a customer's CLI_PACKAGE claim can no longer reach CLI_AUTH_BYPASS
 *   RI3 — a customer cannot execute an admin-only tool under the clamped platform
 *   RI4 — wire caller context: foreign threads/skills are not visible
 *   RI5 — A's tool-execute-result cannot complete B's pending call
 *   RI6 — A's tool-execute-result still completes A's own pending call
 *   RI7 — A's durable result row (unknown callId) is never consumed by B
 */

import "server-only";

import { eq } from "drizzle-orm";
import { makeHeadlessContext } from "next-vibe/core/execution-context";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import vibeDepsDefinitions from "../tooling/vibe-deps/definition";
import { VIBE_DEPS_ALIAS } from "../tooling/vibe-deps/constants";
import { DEFAULT_SKILLS } from "../agent/skills/config";
import { isSkillVisibleToUser } from "../agent/skills/resolver";
import { defaultLocale } from "../core/i18n/core/config";
import { permissionsRegistry } from "../core/permissions/registry";
import { db } from "../database";
import type { JwtPrivatePayloadType } from "../identity/auth/types";
import { UserPermissionRole } from "../identity/roles/enum";
import { createEndpointLogger } from "../logger/server";
import { scopedTranslation as aiScopedTranslation } from "../platforms/ai/i18n";
import { Platform } from "../platforms/platforms";
import type { TestUser } from "../tooling/testing/testing-suite/test-users";
import {
  createTestUser,
  deleteTestUser,
} from "../tooling/testing/testing-suite/test-users";
import { CallbackMode } from "./constants";
import { pendingCallResults } from "./db";
import type executeDefinition from "./definition";
import {
  isThreadOwnedByUser,
  pendingResultKey,
  resolveInboundPlatform,
} from "./repository/inbound-guards";
import { RouteExecuteRepository } from "./repository/index";
import { PendingCalls } from "./repository/pending-calls";
import { handleToolResult } from "./repository/result-handler";
import type { RemoteEventHandlerProps } from "../core/route/handler-realtime";

const logger = createEndpointLogger(false, defaultLocale);
const stamp = Date.now();

let customerA: TestUser;
let customerB: TestUser;

const adminUser: JwtPrivatePayloadType = {
  id: "00000000-0000-0000-0000-0000000000ad",
  leadId: "00000000-0000-0000-0000-0000000000ad",
  roles: [UserPermissionRole.ADMIN],
  isPublic: false,
};

function resultProps(
  user: JwtPrivatePayloadType,
  callId: string,
  output: Record<string, string>,
): RemoteEventHandlerProps<
  typeof executeDefinition.POST,
  "tool-execute-result"
> {
  return {
    responseData: {
      taskId: callId,
      result: output,
      hint: undefined,
      status: "completed",
    },
    requestData: {},
    urlPathParams: undefined,
    payload: undefined,
    instanceId: "cloud",
    originInstanceId: "peer",
    user,
    locale: defaultLocale,
    logger,
    isServer: true,
  };
}

function registerFor(userId: string, callId: string): void {
  PendingCalls.register({
    callId,
    instanceId: "peer",
    toolName: "test-tool",
    threadId: null,
    toolMessageId: null,
    userId,
    deadlineMs: 60_000,
    onDeadline: async (): Promise<void> => undefined,
  });
}

describe("remote execute-tool isolation", () => {
  beforeAll(async () => {
    const a = await createTestUser(`remote-iso-a-${stamp}@example.com`);
    const b = await createTestUser(`remote-iso-b-${stamp}@example.com`);
    expect(a.success && b.success).toBe(true);
    if (!a.success || !b.success) {
      return;
    }
    customerA = a.data;
    customerB = b.data;
  }, 60_000);

  afterAll(async () => {
    await deleteTestUser(customerA.user.id);
    await deleteTestUser(customerB.user.id);
  }, 60_000);

  it("RI1: non-admin platform claims are clamped, admins keep theirs", () => {
    const customer = customerA.user;
    expect(resolveInboundPlatform(customer, Platform.CLI_PACKAGE)).toBe(
      Platform.AI,
    );
    expect(resolveInboundPlatform(customer, Platform.CLI)).toBe(Platform.AI);
    expect(resolveInboundPlatform(customer, Platform.CRON)).toBe(Platform.AI);
    expect(resolveInboundPlatform(customer, Platform.TRPC)).toBe(Platform.AI);
    expect(resolveInboundPlatform(customer, Platform.AI)).toBe(Platform.AI);
    expect(resolveInboundPlatform(customer, Platform.MCP)).toBe(Platform.MCP);
    // The relay (ai-stream) rides NEXT_API — the token's own HTTP surface.
    expect(resolveInboundPlatform(customer, Platform.NEXT_API)).toBe(
      Platform.NEXT_API,
    );
    expect(resolveInboundPlatform(customer, undefined)).toBe(Platform.AI);

    expect(resolveInboundPlatform(adminUser, Platform.CLI_PACKAGE)).toBe(
      Platform.CLI_PACKAGE,
    );
    expect(resolveInboundPlatform(adminUser, Platform.CLI)).toBe(Platform.CLI);
  });

  it("RI2: a customer's CLI_PACKAGE claim no longer reaches CLI_AUTH_BYPASS", () => {
    const def = vibeDepsDefinitions.POST;
    const customer = customerA.user;
    // The hole: CLI_PACKAGE + CLI_AUTH_BYPASS passes the role gate for anyone.
    expect(
      permissionsRegistry.checkRolePermission(
        def.allowedRoles,
        def.allowedClientRoles,
        customer,
        Platform.CLI_PACKAGE,
      ),
    ).toBe(true);
    // The platform execute() is now called with for that claim is denied.
    expect(
      permissionsRegistry.checkRolePermission(
        def.allowedRoles,
        def.allowedClientRoles,
        customer,
        resolveInboundPlatform(customer, Platform.CLI_PACKAGE),
      ),
    ).toBe(false);
  });

  it("RI3: a customer cannot execute an admin-only tool under the clamped platforms", async () => {
    const { t } = aiScopedTranslation.scopedT(defaultLocale);
    for (const claimed of [Platform.CLI_PACKAGE, Platform.MCP]) {
      const result = await RouteExecuteRepository.execute(
        {
          toolName: VIBE_DEPS_ALIAS,
          input: {},
          instanceId: undefined,
          callbackMode: CallbackMode.WAIT,
        },
        customerA.user,
        defaultLocale,
        logger,
        t,
        makeHeadlessContext(undefined, undefined, "UTC"),
        resolveInboundPlatform(customerA.user, claimed),
      );
      expect(result.success, `claimed ${claimed} must not execute`).toBe(
        false,
      );
    }
  }, 60_000);

  it("RI4: foreign threads and unknown skills are not visible", async () => {
    expect(await isThreadOwnedByUser("not-a-uuid", customerA.user.id)).toBe(
      false,
    );
    expect(
      await isThreadOwnedByUser(crypto.randomUUID(), customerA.user.id),
    ).toBe(false);
    const defaultSkill = DEFAULT_SKILLS[0];
    expect(defaultSkill).toBeDefined();
    if (defaultSkill) {
      expect(
        await isSkillVisibleToUser(defaultSkill.id, customerA.user.id),
      ).toBe(true);
    }
    expect(
      await isSkillVisibleToUser(crypto.randomUUID(), customerA.user.id),
    ).toBe(false);
  });

  it("RI5: A's tool-execute-result cannot complete B's pending call", async () => {
    const callId = `remote-iso-b-call-${stamp}`;
    registerFor(customerB.user.id, callId);
    try {
      await handleToolResult(
        resultProps(customerA.user, callId, { forged: "by-a" }),
      );
      const entry = PendingCalls.get(callId);
      expect(entry?.userId).toBe(customerB.user.id);
      expect(entry?.result).toBeNull();
    } finally {
      PendingCalls.discard(callId);
    }
  }, 30_000);

  it("RI6: A's tool-execute-result completes A's own pending call", async () => {
    const callId = `remote-iso-a-call-${stamp}`;
    registerFor(customerA.user.id, callId);
    try {
      await handleToolResult(
        resultProps(customerA.user, callId, { value: "ok" }),
      );
      const entry = PendingCalls.get(callId);
      expect(entry?.result?.status).toBe("completed");
      expect(entry?.result?.output).toEqual({ value: "ok" });
    } finally {
      PendingCalls.discard(callId);
    }
  }, 30_000);

  it("RI7: A's durable result for an unknown callId is never consumed by B", async () => {
    const callId = `remote-iso-durable-${stamp}`;
    try {
      // No entry in this process: the result is persisted (cross-process path).
      await handleToolResult(
        resultProps(customerA.user, callId, { forged: "by-a" }),
      );
      const [row] = await db
        .select({ callId: pendingCallResults.callId })
        .from(pendingCallResults)
        .where(
          eq(
            pendingCallResults.callId,
            pendingResultKey(customerA.user.id, callId),
          ),
        );
      expect(row).toBeDefined();

      // B's waiter for the same callId reconciles against ITS namespace only.
      registerFor(customerB.user.id, callId);
      const info = await PendingCalls.getReconciled(callId);
      expect(info?.result).toBeNull();
    } finally {
      PendingCalls.discard(callId);
      await db
        .delete(pendingCallResults)
        .where(
          eq(
            pendingCallResults.callId,
            pendingResultKey(customerA.user.id, callId),
          ),
        );
    }
  }, 30_000);
});
