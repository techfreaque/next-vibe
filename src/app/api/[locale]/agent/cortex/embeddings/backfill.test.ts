/**
 * Cortex Embedding Backfill Endpoint — End-to-End Tests
 *
 * Drives the real BACKFILL endpoint via sendTestRequest. Backfill does two
 * things: (1) synchronously materializes all virtual mounts into cortex_nodes
 * (fast DB upserts) and returns immediately, and (2) kicks off the rate-limited
 * embedding generation in the background (fire-and-forget). The synchronous
 * response therefore reports the materialized count plus zeroed processed /
 * failed / skipped counters — the background job does not block the response.
 *
 * This means the endpoint is safe to drive live: it returns quickly and never
 * waits on the embedding API. We assert the numeric response shape and the
 * admin-only authorization contract.
 */

import "server-only";

import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { resolveTestAdminUser } from "@/app/api/[locale]/system/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "@/app/api/[locale]/system/check/testing/testing-suite/send-test-request";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import backfillEndpoint from "./backfill/definition";

let user: JwtPrivatePayloadType;
let publicUser: JwtPayloadType;

describe("Cortex Embedding Backfill E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    // A public (unauthenticated) caller sharing the admin's leadId, used to
    // assert the admin-only authorization contract.
    publicUser = {
      isPublic: true,
      leadId: user.leadId,
      roles: [UserPermissionRole.PUBLIC],
    };
  });

  afterAll(() => {
    // No persistent state to clean: backfill upserts virtual mounts (idempotent)
    // and runs embeddings in the background.
  });

  it("runs backfill as admin and returns the numeric count shape", async () => {
    const res = await sendTestRequest({
      endpoint: backfillEndpoint.POST,
      data: { force: false },
      user,
    });

    expect(
      res.success,
      `backfill failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    // The synchronous response reports the materialized mount count and the
    // zeroed background counters. Assert the shape, not exact magnitudes.
    expect(typeof res.data.materialized).toBe("number");
    expect(res.data.materialized).toBeGreaterThanOrEqual(0);
    expect(res.data.processed).toBe(0);
    expect(res.data.failed).toBe(0);
    expect(res.data.skipped).toBe(0);
  }, 60_000);

  it("is idempotent — a second run still returns a valid count shape", async () => {
    const res = await sendTestRequest({
      endpoint: backfillEndpoint.POST,
      data: { force: false },
      user,
    });

    expect(
      res.success,
      `second backfill failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(typeof res.data.materialized).toBe("number");
    expect(res.data.materialized).toBeGreaterThanOrEqual(0);
    expect(res.data.processed).toBe(0);
    expect(res.data.failed).toBe(0);
    expect(res.data.skipped).toBe(0);
  }, 60_000);

  it("rejects a public (non-admin) caller", async () => {
    const res = await sendTestRequest({
      endpoint: backfillEndpoint.POST,
      data: { force: false },
      user: publicUser,
    });

    expect(res.success, "public backfill must be rejected").toBe(false);
    if (res.success) {
      return;
    }
    // Admin-only endpoints reject unauthenticated callers with an
    // unauthorized/forbidden error.
    const code = res.errorType?.errorCode;
    expect(
      code === ErrorResponseTypes.UNAUTHORIZED.errorCode ||
        code === ErrorResponseTypes.FORBIDDEN.errorCode,
    ).toBe(true);
  });
});
