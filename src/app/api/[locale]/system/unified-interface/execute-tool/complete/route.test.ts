/**
 * execute-tool/complete — Unit Tests
 *
 * Tests the async completion callback endpoint via sendTestRequest.
 * Full E2E (remote wakeUp dispatch → complete callback) is in
 * tests/route.execute-tool-hermes-e2e.test.ts.
 *
 *   EC1  — POST with missing taskId fails validation
 *   EC2  — POST with missing status fails validation
 *   EC3  — POST with invalid status fails validation
 *   EC4  — POST with unknown taskId and no wakeUpContext returns not-found
 *   EC5  — POST is admin-only
 */

import "server-only";

import { describe, expect, it } from "vitest";

import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { endpoints } from "./definition";

const customerUser: JwtPrivatePayloadType = {
  id: "00000000-0000-0000-0000-000000000001",
  leadId: "00000000-0000-0000-0000-000000000001",
  roles: [UserPermissionRole.CUSTOMER],
  isPublic: false,
};

describe("execute-tool/complete", () => {
  // ── EC1 ────────────────────────────────────────────────────────────────────

  it("EC1: POST rejects missing taskId", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      // @ts-expect-error intentional — testing missing required field
      data: { status: CronTaskStatus.COMPLETED },
    });

    expect(result.success, "EC1: must fail — missing taskId").toBe(false);
  });

  // ── EC2 ────────────────────────────────────────────────────────────────────

  it("EC2: POST rejects missing status", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      // @ts-expect-error intentional — testing missing required field
      data: { taskId: "some-task-id" },
    });

    expect(result.success, "EC2: must fail — missing status").toBe(false);
  });

  // ── EC3 ────────────────────────────────────────────────────────────────────

  it("EC3: POST rejects invalid status value", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      // @ts-expect-error intentional — testing invalid enum value
      data: { taskId: "some-task-id", status: "invalid-status" },
    });

    expect(result.success, "EC3: must fail — invalid status").toBe(false);
  });

  // ── EC4 ────────────────────────────────────────────────────────────────────

  it("EC4: POST with unknown taskId and no wakeUpContext returns not-found", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      data: {
        taskId: "non-existent-task-00000000",
        status: CronTaskStatus.COMPLETED,
        summary: "Test completion",
      },
    });

    expect(result.success, "EC4: must fail — task not found").toBe(false);
  });

  // ── EC5 ────────────────────────────────────────────────────────────────────

  it("EC5: POST is admin-only", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      data: {
        taskId: "some-task-id",
        status: CronTaskStatus.COMPLETED,
      },
      user: customerUser,
    });

    expect(result.success, "EC5: customer must be rejected").toBe(false);
  });
});
