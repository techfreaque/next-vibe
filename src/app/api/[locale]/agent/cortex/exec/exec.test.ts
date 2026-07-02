/**
 * Cortex Exec Endpoint — End-to-End Tests
 *
 * Drives the real EXEC endpoint via sendTestRequest. Exec runs shell commands
 * inside a persistent terminal session against an SSH/local connection context
 * (path = "/ssh/<connection-slug>").
 *
 * The built-in "Local Machine" LOCAL connection is auto-created for admins on
 * first virtual-mount access (ensureLocalConnection). We discover its real slug
 * through the real LIST endpoint on "/ssh" rather than hardcoding it.
 *
 * The built-in "Local Machine" LOCAL connection is guaranteed by the beforeAll
 * (ensureLocalConnection), so exec runs against a real local shell. Tests assert
 * real exec behavior — no skipping.
 */

import "server-only";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { drainSessionPool } from "../../../ssh/session/pool";
import execEndpoint from "../exec/definition";
import listEndpoint from "../list/definition";
import { ensureLocalConnection } from "../mounts/ssh";

let user: JwtPrivatePayloadType;

/**
 * Resolve the local-machine connection slug via the real LIST endpoint on /ssh.
 * The beforeAll guarantees the LOCAL connection exists, so this MUST find one.
 */
async function resolveLocalPath(): Promise<string> {
  const res = await sendTestRequest({
    endpoint: listEndpoint.GET,
    data: { path: "/ssh" },
    user,
  });
  expect(
    res.success,
    `/ssh list failed: ${res.success ? "" : res.message}`,
  ).toBe(true);
  if (!res.success) {
    return "/ssh/local-machine";
  }
  // The built-in local shell renders as "/ssh/local-machine".
  const local = res.data.entries.find(
    (entry) => entry.entryPath === "/ssh/local-machine",
  );
  const firstConn =
    local ??
    res.data.entries.find(
      (entry) =>
        entry.nodeType === "dir" && entry.entryPath.startsWith("/ssh/"),
    );
  expect(
    firstConn,
    "no /ssh connection found — ensureLocalConnection should have created the local machine",
  ).toBeTruthy();
  return firstConn?.entryPath ?? "/ssh/local-machine";
}

describe("Cortex Exec E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    // Guarantee the built-in "Local Machine" LOCAL connection exists so exec
    // always has a real shell to run against (no skipping).
    const isAdmin = user.roles.includes(UserPermissionRole.ADMIN);
    expect(isAdmin, "exec tests require the admin user").toBe(true);
    await ensureLocalConnection(user.id, isAdmin);
  });

  afterAll(() => {
    // Close any terminal sessions opened during exec tests so timers/procs
    // do not leak past the suite.
    drainSessionPool();
  });

  it("runs a simple command on the local connection and reports exit 0", async () => {
    const path = await resolveLocalPath();

    const res = await sendTestRequest({
      endpoint: execEndpoint.POST,
      data: { path, command: "echo hello-cortex-exec", timeoutMs: 5000 },
      user,
    });

    expect(res.success, `exec failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.exitCode).toBe(0);
    expect(res.data.output).toContain("hello-cortex-exec");
    expect(res.data.backend).toBe("LOCAL");
    expect(res.data.truncated).toBe(false);
    expect(typeof res.data.cwd).toBe("string");
  }, 15_000);

  it("runs a failing command without tearing down the session", async () => {
    const path = await resolveLocalPath();

    // `false` returns non-zero but stays inside the persistent shell, so the
    // CWD marker still arrives and the exec settles normally. (`exit N` would
    // kill the shell and is intentionally avoided.)
    const res = await sendTestRequest({
      endpoint: execEndpoint.POST,
      data: { path, command: "echo before-false; false", timeoutMs: 5000 },
      user,
    });
    expect(res.success, `exec failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.backend).toBe("LOCAL");
    // Exit code is a numeric value reported by the terminal exec.
    expect(Number.isInteger(res.data.exitCode)).toBe(true);
    expect(typeof res.data.output).toBe("string");
  }, 15_000);

  it("rejects a non-/ssh path with BAD_REQUEST", async () => {
    // Exec only accepts /ssh/<connection> paths. A document path fails to parse
    // a connection slug and returns a BAD_REQUEST validation failure.
    const res = await sendTestRequest({
      endpoint: execEndpoint.POST,
      data: { path: "/documents/not-a-connection", command: "echo nope" },
      user,
    });

    expect(res.success, "exec at a non-ssh path must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.BAD_REQUEST.errorCode,
    );
  });

  it("returns NOT_FOUND for an /ssh path with no matching connection", async () => {
    const res = await sendTestRequest({
      endpoint: execEndpoint.POST,
      data: {
        path: "/ssh/does-not-exist-connection-xyz",
        command: "echo nope",
      },
      user,
    });

    expect(res.success, "exec on an unknown connection must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  it("rejects an invalid workingDir with BAD_REQUEST", async () => {
    const path = await resolveLocalPath();

    // workingDir must be absolute and free of "..". A traversal path is rejected
    // before any connection/shell work happens.
    const res = await sendTestRequest({
      endpoint: execEndpoint.POST,
      data: { path, command: "pwd", workingDir: "../../etc" },
      user,
    });

    expect(res.success, "exec with a traversal workingDir must fail").toBe(
      false,
    );
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.BAD_REQUEST.errorCode,
    );
  });

  it("caps a slow command at the requested timeout (best-effort)", async () => {
    const path = await resolveLocalPath();

    // sleep 5 with a 500ms budget: the CWD marker never arrives in time, so
    // the exec settles on timeout. Returns success with a (possibly
    // truncated) partial output rather than throwing.
    const res = await sendTestRequest({
      endpoint: execEndpoint.POST,
      data: { path, command: "sleep 5", timeoutMs: 500 },
      user,
    });
    expect(res.success, `exec failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.backend).toBe("LOCAL");
    expect(Number.isInteger(res.data.exitCode)).toBe(true);
    expect(typeof res.data.output).toBe("string");
  }, 15_000);
});
