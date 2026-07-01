/**
 * Cortex Terminals Endpoint — End-to-End Tests
 *
 * Drives the real TERMINALS endpoint via sendTestRequest. Terminals lists active
 * terminal sessions from the in-memory session pool. In a test process no SSH
 * terminals are open, so the canonical baseline is an empty-but-valid response:
 * { terminals: [], total: 0 }. We assert that shape and the filtering contract.
 */

import "server-only";

import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { drainSessionPool } from "../../ssh/session/pool";
import terminalsEndpoint from "./terminals/definition";

let user: JwtPrivatePayloadType;

describe("Cortex Terminals E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    // Start from a clean pool so total counts reflect this suite only.
    drainSessionPool();
  });

  afterAll(() => {
    drainSessionPool();
  });

  it("lists all terminals with a valid shape when no path filter is given", async () => {
    const res = await sendTestRequest({
      endpoint: terminalsEndpoint.GET,
      data: {},
      user,
    });

    expect(
      res.success,
      `terminals list failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(Array.isArray(res.data.terminals)).toBe(true);
    expect(typeof res.data.total).toBe("number");
    expect(res.data.total).toBe(res.data.terminals.length);
    // No sessions opened in the test process → empty baseline.
    expect(res.data.total).toBe(0);
    expect(res.data.terminals).toHaveLength(0);
  });

  it("filters by a connection path and returns an empty list with total 0", async () => {
    const res = await sendTestRequest({
      endpoint: terminalsEndpoint.GET,
      data: { path: "/ssh/local-machine" },
      user,
    });

    expect(
      res.success,
      `filtered terminals failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(Array.isArray(res.data.terminals)).toBe(true);
    expect(res.data.total).toBe(0);
    expect(res.data.terminals).toHaveLength(0);
  });

  it("returns an empty list for an /ssh path with no sessions", async () => {
    const res = await sendTestRequest({
      endpoint: terminalsEndpoint.GET,
      data: { path: "/ssh/no-sessions-here-xyz" },
      user,
    });

    expect(
      res.success,
      `no-session terminals failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(res.data.total).toBe(0);
    expect(res.data.terminals).toHaveLength(0);
  });

  it("treats a non-/ssh path as no slug filter and still returns a valid empty shape", async () => {
    // A path that does not match /ssh/<slug> parses to a null slug, which means
    // "list everything". With an empty pool that is still { terminals: [], 0 }.
    const res = await sendTestRequest({
      endpoint: terminalsEndpoint.GET,
      data: { path: "/documents/whatever" },
      user,
    });

    expect(
      res.success,
      `invalid-path terminals failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(Array.isArray(res.data.terminals)).toBe(true);
    expect(res.data.total).toBe(0);
  });
});
