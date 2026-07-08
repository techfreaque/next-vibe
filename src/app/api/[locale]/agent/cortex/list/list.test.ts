/**
 * Cortex List Endpoint — End-to-End Tests
 *
 * Drives the real LIST endpoint via sendTestRequest. All document/dir state is
 * built exclusively through the real WRITE and MKDIR endpoints. Direct DB access
 * on cortexNodes is limited to isolation cleanup.
 */

import "server-only";

import { and, eq, like, or } from "drizzle-orm";
import {
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";
import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { chatThreads } from "@/app/api/[locale]/agent/chat/db";
import { ThreadStatus } from "@/app/api/[locale]/agent/chat/enum";
import { customSkills } from "@/app/api/[locale]/agent/skills/db";
import {
  SkillCategory,
  SkillOwnershipType,
} from "@/app/api/[locale]/agent/skills/enum";

import { cortexNodes } from "../db";
import listEndpoint, {
  type CortexListResponseOutput,
} from "../list/definition";
import mkdirEndpoint from "../mkdir/definition";
import writeEndpoint from "../write/definition";

const TEST_PREFIX = "/documents/list-test";
const CLEANUP_PATTERN = `${TEST_PREFIX}%`;

/** Unique slug for the skill this suite materializes so /skills always lists ≥1 entry. */
const SKILL_SLUG = "cortex-list-test-skill-zxq";
/** Unique thread title so /threads always lists ≥1 entry. */
const THREAD_TITLE = "Cortex List Test Thread zxq";

let user: JwtPrivatePayloadType;
let threadId: string | null = null;

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

/** Insert a custom skill so the /skills virtual mount always lists a file. */
async function createTestSkill(userId: string): Promise<void> {
  await db
    .delete(customSkills)
    .where(
      and(eq(customSkills.userId, userId), eq(customSkills.slug, SKILL_SLUG)),
    );
  await db.insert(customSkills).values({
    slug: SKILL_SLUG,
    userId,
    name: "Cortex List Test Skill",
    description: "Fixture skill that guarantees a listed /skills entry.",
    tagline: "List-test fixture",
    icon: "brain",
    systemPrompt: "# List Test Skill\n\nGuarantees a /skills listing entry.",
    category: SkillCategory.ASSISTANT,
    ownershipType: SkillOwnershipType.USER,
    variants: [
      {
        id: "default",
        modelSelection: DEFAULT_CHAT_MODEL_SELECTION,
        isDefault: true,
      },
    ],
  });
}

/** Insert a chat thread so the /threads virtual mount always lists ≥1 entry. */
async function createTestThread(userId: string): Promise<void> {
  const [row] = await db
    .insert(chatThreads)
    .values({
      userId,
      title: THREAD_TITLE,
      rootFolderId: DefaultFolderId.PRIVATE,
      status: ThreadStatus.ACTIVE,
    })
    .returning({ id: chatThreads.id });
  threadId = row?.id ?? null;
}

/** Remove the materialized skill + thread + their embedding index rows. */
async function deleteTestFixtures(userId: string): Promise<void> {
  await db
    .delete(customSkills)
    .where(
      and(eq(customSkills.userId, userId), eq(customSkills.slug, SKILL_SLUG)),
    );
  if (threadId) {
    await db.delete(chatThreads).where(eq(chatThreads.id, threadId));
  }
  await db
    .delete(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        or(
          like(cortexNodes.path, `/skills/${SKILL_SLUG}%`),
          like(cortexNodes.path, "/threads/%"),
        ),
      ),
    );
}

/** Write a file via the real WRITE endpoint; fails the test if it does not stick. */
async function writeFile(path: string, content: string): Promise<void> {
  const res = await sendTestRequest({
    streamContext: undefined,
    endpoint: writeEndpoint.POST,
    data: { path, content, createParents: true },
    user,
  });
  expect(
    res.success,
    `setup write failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
}

/** Create a directory via the real MKDIR endpoint; fails the test if it does not stick. */
async function mkdir(path: string): Promise<void> {
  const res = await sendTestRequest({
    streamContext: undefined,
    endpoint: mkdirEndpoint.POST,
    data: { path, createParents: true },
    user,
  });
  expect(
    res.success,
    `setup mkdir failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
}

function listDir(
  path: string,
): Promise<ResponseType<CortexListResponseOutput>> {
  return sendTestRequest({
    streamContext: undefined,
    endpoint: listEndpoint.GET,
    data: { path },
    user,
  });
}

describe("Cortex List E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
    await createTestSkill(user.id);
    await createTestThread(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
      await deleteTestFixtures(user.id);
    }
  });

  it("lists a native directory with several files by name, path and nodeType", async () => {
    const dir = `${TEST_PREFIX}/files`;
    const names = ["alpha.md", "beta.md", "gamma.md"];
    for (const name of names) {
      await writeFile(`${dir}/${name}`, `content of ${name}`);
    }

    const res = await listDir(dir);
    expect(res.success, `list failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe(dir);
    for (const name of names) {
      const entry = res.data.entries.find((e) => e.name === name);
      expect(entry, `missing entry ${name}`).toBeDefined();
      if (!entry) {
        continue;
      }
      expect(entry.entryPath).toBe(`${dir}/${name}`);
      expect(entry.nodeType).toBe("file");
    }
    expect(res.data.total).toBe(res.data.entries.length);
    expect(res.data.entries.length).toBeGreaterThanOrEqual(names.length);
  });

  it("lists both files and subdirectories with correct nodeTypes", async () => {
    const dir = `${TEST_PREFIX}/mixed`;
    await writeFile(`${dir}/note.md`, "a note");
    await writeFile(`${dir}/task.md`, "a task");
    await mkdir(`${dir}/sub-a`);
    await mkdir(`${dir}/sub-b`);

    const res = await listDir(dir);
    expect(res.success, `list failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    const fileEntry = res.data.entries.find((e) => e.name === "note.md");
    expect(fileEntry?.nodeType).toBe("file");

    const dirA = res.data.entries.find((e) => e.name === "sub-a");
    const dirB = res.data.entries.find((e) => e.name === "sub-b");
    expect(dirA?.nodeType).toBe("dir");
    expect(dirB?.nodeType).toBe("dir");
    expect(dirA?.entryPath).toBe(`${dir}/sub-a`);

    // At least the 2 files + 2 dirs we created.
    const fileCount = res.data.entries.filter(
      (e) => e.nodeType === "file",
    ).length;
    const dirCount = res.data.entries.filter(
      (e) => e.nodeType === "dir",
    ).length;
    expect(fileCount).toBeGreaterThanOrEqual(2);
    expect(dirCount).toBeGreaterThanOrEqual(2);
  });

  it("lists an empty directory with zero entries", async () => {
    const dir = `${TEST_PREFIX}/empty`;
    await mkdir(dir);

    const res = await listDir(dir);
    expect(res.success, `list failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe(dir);
    expect(res.data.entries).toHaveLength(0);
    expect(res.data.total).toBe(0);
  });

  it("lists /documents and surfaces the test prefix directory", async () => {
    // Ensure our prefix dir exists as a child of /documents.
    await writeFile(`${TEST_PREFIX}/root-probe.md`, "probe");

    const res = await listDir("/documents");
    expect(res.success, `list failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe("/documents");
    const testDir = res.data.entries.find((e) => e.name === "list-test");
    expect(
      testDir,
      "list-test dir should appear under /documents",
    ).toBeDefined();
    expect(testDir?.nodeType).toBe("dir");
    expect(testDir?.entryPath).toBe(TEST_PREFIX);
  });

  it("lists a virtual mount (/skills) and returns a well-formed entry array", async () => {
    const res = await listDir("/skills");
    expect(
      res.success,
      `skills list failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe("/skills");
    expect(Array.isArray(res.data.entries)).toBe(true);
    expect(res.data.total).toBe(res.data.entries.length);

    // beforeAll materialized a skill, so the mount must always list ≥1 entry.
    expect(res.data.entries.length).toBeGreaterThanOrEqual(1);
    for (const entry of res.data.entries) {
      expect(entry.entryPath.startsWith("/skills")).toBe(true);
      expect(entry.nodeType === "file" || entry.nodeType === "dir").toBe(true);
      expect(typeof entry.name).toBe("string");
      expect(entry.name.length).toBeGreaterThan(0);
    }

    // The fixture skill must appear as a precise file entry.
    const skillEntry = res.data.entries.find(
      (e) => e.name === `${SKILL_SLUG}.md`,
    );
    expect(
      skillEntry,
      "fixture skill must be listed under /skills",
    ).toBeDefined();
    expect(skillEntry?.nodeType).toBe("file");
    expect(skillEntry?.entryPath).toBe(`/skills/${SKILL_SLUG}`);
  });

  it("lists /threads/private (read-only virtual mount) and surfaces the test thread", async () => {
    // beforeAll inserted a thread in the PRIVATE root folder, so this listing
    // must always contain at least the fixture thread file — never skip.
    const res = await listDir(`/threads/${DefaultFolderId.PRIVATE}`);
    expect(
      res.success,
      `threads list failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe(`/threads/${DefaultFolderId.PRIVATE}`);
    expect(Array.isArray(res.data.entries)).toBe(true);
    expect(res.data.total).toBe(res.data.entries.length);

    expect(res.data.entries.length).toBeGreaterThanOrEqual(1);
    for (const entry of res.data.entries) {
      expect(entry.entryPath.startsWith("/threads")).toBe(true);
      expect(entry.nodeType === "file" || entry.nodeType === "dir").toBe(true);
    }

    // The fixture thread renders as a file whose name carries its UUID.
    const threadEntry = res.data.entries.find(
      (e) => threadId !== null && e.name.includes(threadId),
    );
    expect(
      threadEntry,
      "fixture thread must be listed under /threads/private",
    ).toBeDefined();
    expect(threadEntry?.nodeType).toBe("file");
  });

  it("lists /ssh (admin live mount) and returns a well-formed array", async () => {
    const res = await listDir("/ssh");
    expect(
      res.success,
      `ssh list failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe("/ssh");
    expect(Array.isArray(res.data.entries)).toBe(true);
    expect(res.data.total).toBe(res.data.entries.length);

    // /ssh resolves connections live. Whatever is present must be a valid dir.
    for (const entry of res.data.entries) {
      expect(entry.entryPath.startsWith("/ssh")).toBe(true);
      expect(entry.nodeType).toBe("dir");
    }
  });

  it("lists a non-existent native path as an empty directory", async () => {
    // Native listing of a path with no children returns an empty list, not NOT_FOUND.
    const res = await listDir(`${TEST_PREFIX}/never-created-xyz`);
    expect(
      res.success,
      `list of missing path failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }
    expect(res.data.entries).toHaveLength(0);
    expect(res.data.total).toBe(0);
  });

  it("rejects an invalid path with VALIDATION_ERROR", async () => {
    // SQL LIKE wildcards in a path segment are rejected by isValidPath.
    const res = await listDir("/documents/bad%segment");
    expect(res.success, "invalid path must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("reports each entry's size equal to its content byte length", async () => {
    const dir = `${TEST_PREFIX}/sizes`;
    const content = "café 日本 — multibyte payload";
    const byteLength = Buffer.byteLength(content, "utf8");
    await writeFile(`${dir}/sized.md`, content);

    const res = await listDir(dir);
    expect(res.success, `list failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    const entry = res.data.entries.find((e) => e.name === "sized.md");
    expect(entry, "sized.md entry missing").toBeDefined();
    if (!entry) {
      return;
    }
    expect(entry.nodeType).toBe("file");
    expect(entry.size).toBe(byteLength);
    // Multibyte content: byte length exceeds JS string length.
    expect(byteLength).toBeGreaterThan(content.length);
  });
});
