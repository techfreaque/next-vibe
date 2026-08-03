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

import type { JwtPrivatePayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import { CronTaskStatus } from "../../tasks/enum";
import { sendTestRequest } from "../../tooling/testing/testing-suite/send-test-request";
import { describe, expect, it } from "vitest";

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
      toolExecutionContext: undefined,
      endpoint: endpoints.POST,
      // @ts-expect-error intentional — testing missing required field
      data: { status: CronTaskStatus.COMPLETED },
    });

    expect(result.success, "EC1: must fail — missing taskId").toBe(false);
  });

  // ── EC2 ────────────────────────────────────────────────────────────────────

  it("EC2: POST with missing status and no wakeUpContext returns not-found", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.POST,
      data: { taskId: "some-task-id" } as Parameters<
        typeof sendTestRequest<typeof endpoints.POST>
      >[0]["data"],
    });

    // status is optional (AI-caller path omits it and provides response instead).
    // With neither status nor response, the normalization is skipped and the task
    // row lookup fails — not-found, not a validation error.
    expect(result.success, "EC2: must fail — task not found").toBe(false);
  });

  // ── EC3 ────────────────────────────────────────────────────────────────────

  it("EC3: POST rejects invalid status value", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: endpoints.POST,
      // @ts-expect-error intentional — testing invalid enum value
      data: { taskId: "some-task-id", status: "invalid-status" },
    });

    expect(result.success, "EC3: must fail — invalid status").toBe(false);
  });

  // ── EC4 ────────────────────────────────────────────────────────────────────

  it("EC4: POST with unknown taskId and no wakeUpContext returns not-found", async () => {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
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
      toolExecutionContext: undefined,
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
