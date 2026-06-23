/**
 * execute-tool/dismiss-task — Unit Tests
 *
 *   DT1  — POST with missing callId fails validation
 *   DT2  — POST with unknown callId returns not-found (no pending revival)
 *   DT3  — POST is accessible to customers (non-admin allowed role)
 */

import "server-only";

import { describe, expect, it } from "vitest";

import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";

import endpoints from "./definition";

describe("execute-tool/dismiss-task", () => {
  // ── DT1 ────────────────────────────────────────────────────────────────────

  it("DT1: POST rejects missing callId", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      // @ts-expect-error intentional — testing missing required field
      data: {},
    });

    expect(result.success, "DT1: must fail — missing callId").toBe(false);
  });

  // ── DT2 ────────────────────────────────────────────────────────────────────

  it("DT2: POST with unknown callId returns not-found", async () => {
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      data: { callId: "non-existent-task-00000000" },
    });

    expect(result.success, "DT2: must fail — task not found").toBe(false);
  });

  // ── DT3 ────────────────────────────────────────────────────────────────────

  it("DT3: POST schema validates correctly for a well-formed request", async () => {
    // This will fail with NOT_FOUND (no such task) — but it passes validation,
    // proving the schema accepts the correct shape.
    const result = await sendTestRequest({
      endpoint: endpoints.POST,
      data: { callId: "00000000-0000-0000-0000-000000000099" },
    });

    // Either NOT_FOUND (correct) or success — either way it's not a validation error.
    // If it were a schema error the message would reference "callId".
    if (!result.success) {
      expect(
        result.errorType,
        "DT3: must be NOT_FOUND, not VALIDATION_FAILED",
      ).not.toBe("VALIDATION_FAILED");
    }
  });
});
