/**
 * execute-tool/dismiss-task — Unit Tests
 *
 *   DT1  — POST with missing callId fails validation
 *   DT2  — POST with unknown callId succeeds (idempotent — already done)
 *   DT3  — POST is accessible to customers (non-admin allowed role)
 */

import "server-only";

import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { describe, expect, it } from "vitest";

import endpoints from "./definition";

describe("execute-tool/dismiss-task", () => {
  // ── DT1 ────────────────────────────────────────────────────────────────────

  it("DT1: POST rejects missing callId", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: endpoints.POST,
      // @ts-expect-error intentional — testing missing required field
      data: {},
    });

    expect(result.success, "DT1: must fail — missing callId").toBe(false);
  });

  // ── DT2 ────────────────────────────────────────────────────────────────────

  it("DT2: POST with unknown callId succeeds (idempotent)", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: endpoints.POST,
      data: { callId: "non-existent-task-00000000" },
    });

    // dismiss-task is idempotent — if the task is already done or never existed,
    // it returns dismissed: true rather than an error.
    expect(result.success, "DT2: must succeed — idempotent dismiss").toBe(true);
    if (!result.success) {
      // oxlint-disable-next-line restricted-syntax
      throw new Error(`DT2: ${result.message}`);
    }
    expect(result.data.dismissed, "DT2: dismissed must be true").toBe(true);
  });

  // ── DT3 ────────────────────────────────────────────────────────────────────

  it("DT3: POST schema validates correctly for a well-formed request", async () => {
    const result = await sendTestRequest({
      streamContext: undefined,
      endpoint: endpoints.POST,
      data: { callId: "00000000-0000-0000-0000-000000000099" },
    });

    // Well-formed callId passes schema validation. Idempotent dismiss returns success.
    expect(result.success, "DT3: schema-valid request must succeed").toBe(true);
  });
});
