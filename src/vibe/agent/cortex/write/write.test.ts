/**
 * Cortex Write Endpoint — End-to-End Tests
 *
 * Drives the real WRITE endpoint via sendTestRequest and cross-verifies the
 * result through the sibling READ / LIST / TREE endpoints. DB pokes on
 * cortexNodes are used only to assert state not observable through endpoints
 * (frontmatter parsing) and for isolation cleanup.
 */

import "server-only";

import { and, eq, like } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { cortexNodes } from "../db";
import listEndpoint from "../list/definition";
import readEndpoint from "../read/definition";
import treeEndpoint from "../tree/definition";
import writeEndpoint from "../write/definition";

const TEST_PREFIX = "/documents/write-test";
const CLEANUP_PATTERN = `${TEST_PREFIX}%`;

let user: JwtPrivatePayloadType;

async function cleanup(userId: string): Promise<void> {
  await db
    .delete(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        like(cortexNodes.path, CLEANUP_PATTERN),
      ),
    );
}

describe("Cortex Write E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
    }
  });

  it("creates a new file (created=true, size>0, correct path)", async () => {
    const path = `${TEST_PREFIX}/create.md`;
    const content = "# Create Test\n\nFresh file body.";

    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content, createParents: true },
      user,
    });
    expect(res.success, `write failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe(path);
    expect(res.data.created).toBe(true);
    expect(res.data.size).toBeGreaterThan(0);
  });

  it("round-trips: READ after write returns identical content incl. frontmatter", async () => {
    const path = `${TEST_PREFIX}/roundtrip.md`;
    const content =
      "---\ntitle: Round Trip\nstatus: open\n---\n\n# Body\n\nExact bytes must survive.";

    const writeRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content, createParents: true },
      user,
    });
    expect(
      writeRes.success,
      `write failed: ${writeRes.success ? "" : writeRes.message}`,
    ).toBe(true);
    if (!writeRes.success) {
      return;
    }

    const readRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(
      readRes.success,
      `read failed: ${readRes.success ? "" : readRes.message}`,
    ).toBe(true);
    if (!readRes.success) {
      return;
    }

    expect(readRes.data.responsePath).toBe(path);
    expect(readRes.data.content).toBe(content);
    expect(readRes.data.nodeType).toBe("file");
    expect(readRes.data.readonly).toBe(false);
    expect(readRes.data.truncated).toBe(false);
  });

  it("cross-tool: LIST parent dir shows the new file as nodeType 'file'", async () => {
    const dir = `${TEST_PREFIX}/listdir`;
    const path = `${dir}/listed.md`;
    const content = "# Listed\n\nShould appear in listing.";

    const writeRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content, createParents: true },
      user,
    });
    expect(
      writeRes.success,
      `write failed: ${writeRes.success ? "" : writeRes.message}`,
    ).toBe(true);
    if (!writeRes.success) {
      return;
    }

    const listRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: listEndpoint.GET,
      data: { path: dir },
      user,
    });
    expect(
      listRes.success,
      `list failed: ${listRes.success ? "" : listRes.message}`,
    ).toBe(true);
    if (!listRes.success) {
      return;
    }

    const entry = listRes.data.entries.find((e) => e.entryPath === path);
    expect(entry, `file ${path} must appear in list of ${dir}`).toBeDefined();
    if (!entry) {
      return;
    }
    expect(entry.name).toBe("listed.md");
    expect(entry.nodeType).toBe("file");
    expect(listRes.data.total).toBeGreaterThanOrEqual(1);
  });

  it("cross-tool: TREE of prefix contains the filename and counts the file", async () => {
    const path = `${TEST_PREFIX}/treetest/in-tree.md`;
    const content = "# In Tree\n\nTree must render this file.";

    const writeRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content, createParents: true },
      user,
    });
    expect(
      writeRes.success,
      `write failed: ${writeRes.success ? "" : writeRes.message}`,
    ).toBe(true);
    if (!writeRes.success) {
      return;
    }

    const treeRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: treeEndpoint.GET,
      data: { path: `${TEST_PREFIX}/treetest`, depth: 5 },
      user,
    });
    expect(
      treeRes.success,
      `tree failed: ${treeRes.success ? "" : treeRes.message}`,
    ).toBe(true);
    if (!treeRes.success) {
      return;
    }

    expect(treeRes.data.tree).toContain("in-tree.md");
    expect(treeRes.data.totalFiles).toBeGreaterThanOrEqual(1);
  });

  it("createParents=true creates a deeply nested path; list+read confirm it", async () => {
    const dir = `${TEST_PREFIX}/a/b`;
    const path = `${dir}/c.md`;
    const content = "# Nested\n\nDeep child via createParents.";

    const writeRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content, createParents: true },
      user,
    });
    expect(
      writeRes.success,
      `write failed: ${writeRes.success ? "" : writeRes.message}`,
    ).toBe(true);
    if (!writeRes.success) {
      return;
    }
    expect(writeRes.data.responsePath).toBe(path);

    // Parent dir was materialized and lists the nested file
    const listRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: listEndpoint.GET,
      data: { path: dir },
      user,
    });
    expect(
      listRes.success,
      `list failed: ${listRes.success ? "" : listRes.message}`,
    ).toBe(true);
    if (!listRes.success) {
      return;
    }
    const entry = listRes.data.entries.find((e) => e.entryPath === path);
    expect(entry, `nested file ${path} must be listed`).toBeDefined();
    expect(entry?.nodeType).toBe("file");

    // And readable with identical content
    const readRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(
      readRes.success,
      `read failed: ${readRes.success ? "" : readRes.message}`,
    ).toBe(true);
    if (!readRes.success) {
      return;
    }
    expect(readRes.data.content).toBe(content);
  });

  it("overwrites an existing file: second write created=false, read returns new content", async () => {
    const path = `${TEST_PREFIX}/overwrite.md`;
    const first = "# Version 1\n\nOriginal content.";
    const second = "# Version 2\n\nReplaced content, longer than before.";

    const writeFirst = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content: first, createParents: true },
      user,
    });
    expect(
      writeFirst.success,
      `first write failed: ${writeFirst.success ? "" : writeFirst.message}`,
    ).toBe(true);
    if (!writeFirst.success) {
      return;
    }
    expect(writeFirst.data.created).toBe(true);

    const writeSecond = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content: second, createParents: true },
      user,
    });
    expect(
      writeSecond.success,
      `second write failed: ${writeSecond.success ? "" : writeSecond.message}`,
    ).toBe(true);
    if (!writeSecond.success) {
      return;
    }
    expect(writeSecond.data.created).toBe(false);

    const readRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(
      readRes.success,
      `read failed: ${readRes.success ? "" : readRes.message}`,
    ).toBe(true);
    if (!readRes.success) {
      return;
    }
    expect(readRes.data.content).toBe(second);
  });

  it("parses YAML frontmatter into cortexNodes.frontmatter (DB poke) while read exposes raw content", async () => {
    const path = `${TEST_PREFIX}/frontmatter.md`;
    const content =
      "---\nstatus: open\npriority: 3\npublished: true\n---\n\n# Body\n\nFrontmatter parse target.";

    const writeRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content, createParents: true },
      user,
    });
    expect(
      writeRes.success,
      `write failed: ${writeRes.success ? "" : writeRes.message}`,
    ).toBe(true);
    if (!writeRes.success) {
      return;
    }

    // Read exposes the raw markdown (frontmatter is not parsed in the read response)
    const readRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(
      readRes.success,
      `read failed: ${readRes.success ? "" : readRes.message}`,
    ).toBe(true);
    if (!readRes.success) {
      return;
    }
    expect(readRes.data.content).toBe(content);

    // DB poke: parsed frontmatter is only observable on the row, not via read.
    const [row] = await db
      .select({ frontmatter: cortexNodes.frontmatter })
      .from(cortexNodes)
      .where(and(eq(cortexNodes.userId, user.id), eq(cortexNodes.path, path)))
      .limit(1);
    expect(row, `row for ${path} must exist`).toBeDefined();
    if (!row) {
      return;
    }
    expect(row.frontmatter.status).toBe("open");
    expect(row.frontmatter.priority).toBe(3);
    expect(row.frontmatter.published).toBe(true);
  });

  it("rejects writes to a read-only virtual mount path (/threads) with FORBIDDEN", async () => {
    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: {
        path: "/threads/foo.md",
        content: "# Should be rejected",
        createParents: false,
      },
      user,
    });
    expect(res.success, "write to /threads must be rejected").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType).toBe(ErrorResponseTypes.FORBIDDEN);
  });

  it("computes size as the UTF-8 byte length of the content", async () => {
    const path = `${TEST_PREFIX}/size.md`;
    // Includes a multi-byte char (é = 2 bytes UTF-8) to prove byte (not char) length.
    const content = "café\n";
    const expectedBytes = Buffer.byteLength(content, "utf8");

    const res = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: writeEndpoint.POST,
      data: { path, content, createParents: true },
      user,
    });
    expect(res.success, `write failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }
    expect(res.data.size).toBe(expectedBytes);

    // Cross-verify the size the read endpoint reports.
    const readRes = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(
      readRes.success,
      `read failed: ${readRes.success ? "" : readRes.message}`,
    ).toBe(true);
    if (!readRes.success) {
      return;
    }
    expect(readRes.data.size).toBe(expectedBytes);
  });
});
