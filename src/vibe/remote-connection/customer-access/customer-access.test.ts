/**
 * Remote connections for customers — serving-side gate + isolation.
 *
 * Real DB, real endpoints (sendTestRequest), throwaway customer accounts:
 *   A = paid customer with a linked instance
 *   B = paid customer, no instance (the "other tenant")
 *   C = free customer
 *
 *   RCA-1  free account cannot register an instance (audited)
 *   RCA-2  paid register pins transports, never probes the URL, audits
 *   RCA-3  instance URL must be a plain origin
 *   RCA-4  connection cap; re-registering an existing label is not a new slot
 *   RCA-5  connect-reverse/update cannot steer a customer's transports
 *   RCA-6  list/[instanceId] only ever show the caller's own rows
 *   RCA-7  bridge: free/unconnected accounts get 403, A passes
 *   RCA-8  sync: unconnected account gets 403
 *   RCA-9  cron retarget on rename touches only the renamer's tasks
 *   RCA-10 B cannot disconnect A; A's disconnect revokes bridge access at once
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { resetPaidCache } from "@/api-keys/paid";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";

import { db } from "../../database";
import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import bridgeDefinitions from "../../realtime/remote-event-bridge/definition";
import { cronTasks } from "../../tasks/cron/db";
import { CronTaskPriority, TaskCategory } from "../../tasks/enum";
import { sendTestRequest } from "../../tooling/testing/testing-suite/send-test-request";
import {
  createTestUser,
  deleteTestUser,
} from "../../tooling/testing/testing-suite/test-users";
import instanceDefinitions from "../[instanceId]/definition";
import registerDefinitions from "../connect-reverse/definition";
import updateDefinitions from "../connect-reverse/update/definition";
import { remoteConnectionAudit, remoteConnections } from "../db";
import listDefinitions from "../list/definition";
import syncDefinitions from "../sync/definition";
import {
  REMOTE_CUSTOMER_LIMITS,
  resetRemoteCustomerRateLimits,
} from "./access";

const RUN = Date.now().toString(36);
const SCOPE = {
  memories: true,
  documents: true,
  skills: true,
  favorites: true,
  threads: false,
};

let userA: JwtPrivatePayloadType;
let userB: JwtPrivatePayloadType;
let userC: JwtPrivatePayloadType;
const createdUserIds: string[] = [];
const createdCronIds: string[] = [];

async function makeCustomer(label: string): Promise<JwtPrivatePayloadType> {
  const created = await createTestUser(`rca-${label}-${RUN}@example.com`);
  if (!created.success) {
    return expect.unreachable(`createTestUser ${label}: ${created.message}`);
  }
  createdUserIds.push(created.data.user.id);
  return created.data.user;
}

async function makePaid(user: JwtPrivatePayloadType): Promise<void> {
  // A succeeded payment is one of isPaidUser's three "paid" signals.
  await db.insert(paymentTransactions).values({
    userId: user.id,
    amount: "5.00",
    currency: "USD",
    status: PaymentStatus.SUCCEEDED,
  });
  resetPaidCache(user.id);
}

function register(
  user: JwtPrivatePayloadType,
  instanceId: string,
  localUrl = "http://127.0.0.1:5432",
): ReturnType<typeof sendTestRequest<typeof registerDefinitions.POST>> {
  return sendTestRequest({
    endpoint: registerDefinitions.POST,
    data: {
      instanceId,
      localUrl,
      reverseToken: "peer-token",
      reverseLeadId: "00000000-0000-0000-0000-0000000000aa",
      syncScope: SCOPE,
      // A customer asking us to dial its URL over WS: must be ignored.
      remoteTransportMode: "reverse-ws",
    },
    user,
    toolExecutionContext: undefined,
  });
}

async function rowOf(
  userId: string,
  instanceId: string,
): Promise<typeof remoteConnections.$inferSelect | undefined> {
  const [row] = await db
    .select()
    .from(remoteConnections)
    .where(
      and(
        eq(remoteConnections.userId, userId),
        eq(remoteConnections.instanceId, instanceId),
      ),
    );
  return row;
}

async function auditActions(userId: string): Promise<string[]> {
  // recordRemoteAudit is fire-and-forget: give the insert a moment.
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
  const rows = await db
    .select({
      action: remoteConnectionAudit.action,
      reason: remoteConnectionAudit.reason,
    })
    .from(remoteConnectionAudit)
    .where(eq(remoteConnectionAudit.userId, userId));
  return rows.map((r) => `${r.action}${r.reason ? `:${r.reason}` : ""}`);
}

function bridgePost(
  user: JwtPrivatePayloadType,
): ReturnType<typeof sendTestRequest<typeof bridgeDefinitions.POST>> {
  return sendTestRequest({
    endpoint: bridgeDefinitions.POST,
    // Unknown eventName: passes the gate, then ignored. No applier runs.
    data: { eventName: "rca-probe", payload: {} },
    user,
    toolExecutionContext: undefined,
  });
}

describe("Remote connections for customers", () => {
  beforeAll(async () => {
    resetRemoteCustomerRateLimits();
    userA = await makeCustomer("a");
    userB = await makeCustomer("b");
    userC = await makeCustomer("c");
    await makePaid(userA);
    await makePaid(userB);
  }, 120_000);

  afterAll(async () => {
    for (const id of createdCronIds) {
      await db.delete(cronTasks).where(eq(cronTasks.id, id));
    }
    // Cascades: remote_connections, instance_identities, audit rows, folders.
    for (const id of createdUserIds) {
      await deleteTestUser(id);
    }
    resetRemoteCustomerRateLimits();
  }, 120_000);

  it("RCA-1: a free account cannot register an instance", async () => {
    const result = await register(userC, "c-box");
    expect(result.success).toBe(false);
    expect(await rowOf(userC.id, "c-box")).toBeUndefined();
    expect(await auditActions(userC.id)).toContain("denied:register:notPaid");
  });

  it("RCA-2: paid register pins transports and never dials the URL", async () => {
    const result = await register(userA, "a-box");
    expect(result.success, "paid customer may register").toBe(true);
    if (!result.success) {
      return;
    }
    // Returned to the instance: it must open its own connector to us.
    expect(result.data.transportMode).toBe("reverse-ws");
    expect(result.data.remoteUserId).toBe(userA.id);

    const row = await rowOf(userA.id, "a-box");
    expect(row?.isReverseEntry).toBe(true);
    expect(row?.transportMode).toBe("reverse-ws");
    // The wire asked for reverse-ws (= we would dial out): pinned to HTTP-in.
    expect(row?.remoteTransportMode).toBe("direct-http");
    expect(row?.isInferenceProvider).toBe(false);
    expect(row?.forceSystemProvider).toBe(false);
    expect(await auditActions(userA.id)).toContain("registered");
  });

  it("RCA-3: the instance URL must be a plain origin", async () => {
    for (const url of [
      "http://evil.example.com/x?",
      "http://user:pw@evil.example.com",
      "http://evil.example.com/#frag",
      "http://evil.example.com/path",
    ]) {
      const result = await register(userA, "a-url-probe", url);
      expect(result.success, url).toBe(false);
    }
    expect(await rowOf(userA.id, "a-url-probe")).toBeUndefined();
  });

  it("RCA-4: connection cap, re-register of an existing label allowed", async () => {
    for (let i = 2; i <= REMOTE_CUSTOMER_LIMITS.maxConnections; i++) {
      const extra = await register(userA, `a-box-${i}`);
      expect(extra.success, `slot ${i}`).toBe(true);
    }
    const overCap = await register(userA, "a-box-over");
    expect(overCap.success).toBe(false);
    expect(await rowOf(userA.id, "a-box-over")).toBeUndefined();
    expect(await auditActions(userA.id)).toContain(
      "denied:register:connectionLimit",
    );

    const again = await register(userA, "a-box");
    expect(again.success, "re-register is not a new slot").toBe(true);
    expect(await auditActions(userA.id)).toContain("reregistered");

    // Free the extra slots for the rest of the suite.
    for (let i = 2; i <= REMOTE_CUSTOMER_LIMITS.maxConnections; i++) {
      await sendTestRequest({
        endpoint: instanceDefinitions.DELETE,
        urlPathParams: { instanceId: `a-box-${i}` },
        user: userA,
        toolExecutionContext: undefined,
      });
    }
  });

  it("RCA-5: a customer cannot steer its transports via update", async () => {
    const result = await sendTestRequest({
      endpoint: updateDefinitions.PATCH,
      data: {
        instanceId: "a-box",
        transportMode: "direct-http",
        remoteTransportMode: "reverse-ws",
        syncScope: { ...SCOPE, threads: true },
      },
      user: userA,
      toolExecutionContext: undefined,
    });
    expect(result.success).toBe(true);
    const row = await rowOf(userA.id, "a-box");
    expect(row?.transportMode).toBe("reverse-ws");
    expect(row?.remoteTransportMode).toBe("direct-http");
    // Scope mirroring still works.
    expect(row?.syncScope?.threads).toBe(true);
  });

  it("RCA-6: list and detail only show the caller's own rows", async () => {
    const listA = await sendTestRequest({
      endpoint: listDefinitions.GET,
      data: {},
      user: userA,
      toolExecutionContext: undefined,
    });
    expect(listA.success).toBe(true);
    if (listA.success) {
      expect(listA.data.connections.map((c) => c.instanceId)).toEqual([
        "a-box",
      ]);
      expect(listA.data.access.canConnect).toBe(true);
      expect(listA.data.access.maxConnections).toBe(
        REMOTE_CUSTOMER_LIMITS.maxConnections,
      );
      expect(listA.data.hasInferenceProvider).toBe(false);
    }

    const listB = await sendTestRequest({
      endpoint: listDefinitions.GET,
      data: {},
      user: userB,
      toolExecutionContext: undefined,
    });
    expect(listB.success && listB.data.connections.length).toBe(0);

    const listC = await sendTestRequest({
      endpoint: listDefinitions.GET,
      data: {},
      user: userC,
      toolExecutionContext: undefined,
    });
    expect(listC.success && listC.data.access.canConnect).toBe(false);

    const bPeek = await sendTestRequest({
      endpoint: instanceDefinitions.GET,
      urlPathParams: { instanceId: "a-box" },
      user: userB,
      toolExecutionContext: undefined,
    });
    expect(bPeek.success && bPeek.data.isConnected).toBe(false);
    expect(bPeek.success && bPeek.data.remoteUrl).toBe(null);

    // Settings stay admin-only.
    const patch = await sendTestRequest({
      endpoint: instanceDefinitions.PATCH,
      urlPathParams: { instanceId: "a-box" },
      data: { isInferenceProvider: true },
      user: userA,
      toolExecutionContext: undefined,
    });
    expect(patch.success).toBe(false);
  });

  it("RCA-7: bridge rejects free and unconnected accounts", async () => {
    const free = await bridgePost(userC);
    expect(free.success, "free account").toBe(false);
    const unconnected = await bridgePost(userB);
    expect(unconnected.success, "paid but no connection").toBe(false);
    expect(await auditActions(userB.id)).toContain(
      "denied:bridge:noConnection",
    );
    const connected = await bridgePost(userA);
    expect(connected.success, "paid + connected").toBe(true);
  });

  it("RCA-8: sync rejects an unconnected account", async () => {
    const result = await sendTestRequest({
      endpoint: syncDefinitions.POST,
      data: { instanceId: "a-box" },
      user: userB,
      toolExecutionContext: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("RCA-9: renaming a label retargets only the renamer's cron tasks", async () => {
    const label = "a-box";
    const mkTask = async (userId: string): Promise<string> => {
      const id = `rca-cron-${userId.slice(0, 8)}-${RUN}`;
      createdCronIds.push(id);
      await db.insert(cronTasks).values({
        id,
        shortId: id.slice(-8),
        routeId: "rca-noop",
        displayName: "RCA probe",
        category: TaskCategory.DEVELOPMENT,
        schedule: "0 0 1 1 *",
        priority: CronTaskPriority.LOW,
        enabled: false,
        targetInstance: label,
        userId,
      });
      return id;
    };
    const taskA = await mkTask(userA.id);
    const taskB = await mkTask(userB.id);

    const renamed = await sendTestRequest({
      endpoint: updateDefinitions.PATCH,
      data: { instanceId: label, newInstanceId: "a-box-renamed" },
      user: userA,
      toolExecutionContext: undefined,
    });
    expect(renamed.success).toBe(true);

    const [rowA] = await db
      .select({ target: cronTasks.targetInstance })
      .from(cronTasks)
      .where(eq(cronTasks.id, taskA));
    const [rowB] = await db
      .select({ target: cronTasks.targetInstance })
      .from(cronTasks)
      .where(eq(cronTasks.id, taskB));
    expect(rowA?.target).toBe("a-box-renamed");
    expect(rowB?.target, "other tenant's task untouched").toBe(label);
  });

  it("RCA-10: B cannot disconnect A; A's disconnect revokes at once", async () => {
    const instanceId = "a-box-renamed";
    const bDelete = await sendTestRequest({
      endpoint: instanceDefinitions.DELETE,
      urlPathParams: { instanceId },
      user: userB,
      toolExecutionContext: undefined,
    });
    expect(bDelete.success).toBe(false);
    expect(await rowOf(userA.id, instanceId)).toBeDefined();

    // Warm the gate's positive cache, then revoke.
    expect((await bridgePost(userA)).success).toBe(true);
    const aDelete = await sendTestRequest({
      endpoint: instanceDefinitions.DELETE,
      urlPathParams: { instanceId },
      user: userA,
      toolExecutionContext: undefined,
    });
    expect(aDelete.success).toBe(true);
    expect(await rowOf(userA.id, instanceId)).toBeUndefined();
    expect(await auditActions(userA.id)).toContain("disconnected");
    expect((await bridgePost(userA)).success, "revoked immediately").toBe(
      false,
    );
  });
});
