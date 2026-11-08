/**
 * Machine access is admin-only.
 *
 * Hosted users get no terminal: cortex-exec, cortex-terminals and every SSH
 * connection endpoint reject customers, and the /ssh cortex mount is invisible
 * to them. Terminal sessions are owned — a session is never reachable by, or
 * listed for, any other user.
 */

import "server-only";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import sshCreateEndpoint from "@/ssh/connections/create/definition";
import sshListEndpoint from "@/ssh/connections/list/definition";
import { SshAuthType } from "@/ssh/enum";

import listEndpoint from "../list/definition";
import { ensureLocalConnection } from "../mounts/ssh";
import terminalsEndpoint from "../terminals/definition";
import execEndpoint from "./definition";
import {
  drainSessionPool,
  getDefaultSession,
  getSessionsForConnection,
  sessionPool,
} from "./pool";

let admin: JwtPrivatePayloadType;
let customer: TestUser;

describe("Machine access (cortex exec / terminals / ssh)", () => {
  beforeAll(async () => {
    admin = await resolveTestAdminUser();
    await ensureLocalConnection(
      admin.id,
      admin.roles.includes(UserPermissionRole.ADMIN),
    );
    const created = await createTestUser(
      `machine-access-${Date.now()}@example.com`,
    );
    expect(created.success).toBe(true);
    if (created.success) {
      customer = created.data;
    }
  });

  afterAll(async () => {
    drainSessionPool();
    await deleteTestUser(customer.user.id);
  });

  it("rejects cortex-exec for a customer", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: execEndpoint.POST,
      data: { path: "/ssh/local-machine", command: "id" },
      user: customer.user,
    });
    expect(res.success).toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.FORBIDDEN.errorCode,
    );
  });

  it("rejects terminals and SSH connection endpoints for a customer", async () => {
    const terminals = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: terminalsEndpoint.GET,
      data: {},
      user: customer.user,
    });
    expect(terminals.success).toBe(false);

    const list = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: sshListEndpoint.GET,
      data: {},
      user: customer.user,
    });
    expect(list.success).toBe(false);

    const create = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: sshCreateEndpoint.POST,
      data: {
        label: "internal",
        host: "127.0.0.1",
        port: 22,
        username: "root",
        authType: SshAuthType.PASSWORD,
        secret: "x",
      },
      user: customer.user,
    });
    expect(create.success).toBe(false);
  });

  it("hides the /ssh mount from a customer's cortex", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: listEndpoint.GET,
      data: { path: "/ssh" },
      user: customer.user,
    });
    if (res.success) {
      expect(
        res.data.entries.filter((e) => e.entryPath.startsWith("/ssh/")),
      ).toHaveLength(0);
    }
  });

  it("a terminal session is owned: never reused, reachable or listed for another user", async () => {
    const run = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: execEndpoint.POST,
      data: { path: "/ssh/local-machine", command: "echo owned", timeoutMs: 5000 },
      user: admin,
    });
    expect(run.success, run.success ? "" : run.message).toBe(true);
    if (!run.success) {
      return;
    }
    const session = sessionPool.get(run.data.terminalId);
    expect(session?.ownerUserId).toBe(admin.id);
    if (!session) {
      return;
    }

    expect(getDefaultSession(session.connectionId, customer.user.id)).toBe(
      undefined,
    );
    expect(getDefaultSession(session.connectionId, admin.id)?.sessionId).toBe(
      session.sessionId,
    );
    expect(
      getSessionsForConnection(session.connectionSlug, customer.user.id),
    ).toHaveLength(0);
    expect(getSessionsForConnection(null, customer.user.id)).toHaveLength(0);
    expect(
      getSessionsForConnection(null, admin.id).map((s) => s.sessionId),
    ).toContain(session.sessionId);
  }, 15_000);
});
