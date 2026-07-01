/**
 * Cortex Read Endpoint — End-to-End Tests
 *
 * Drives the real READ endpoint via sendTestRequest. State is set up exclusively
 * through the real WRITE endpoint, and virtual-mount discovery goes through the
 * real LIST endpoint. DB access on cortexNodes is limited to isolation cleanup.
 */

import "server-only";

import { and, eq, like } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { resolveTestAdminUser } from "next-vibe/tooling/check/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/check/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { DEFAULT_CHAT_MODEL_SELECTION } from "@/app/api/[locale]/agent/ai-stream/constants";
import { customSkills } from "@/app/api/[locale]/agent/skills/db";
import {
  SkillCategory,
  SkillOwnershipType,
} from "@/app/api/[locale]/agent/skills/enum";

import { cortexNodes } from "./db";
import listEndpoint from "./list/definition";
import readEndpoint from "./read/definition";
import writeEndpoint from "./write/definition";

const TEST_PREFIX = "/documents/read-test";
const CLEANUP_PATTERN = `${TEST_PREFIX}%`;

/** Unique slug for the skill this suite materializes so /skills always has a file. */
const SKILL_SLUG = "cortex-read-test-skill-zxq";
const SKILL_SYSTEM_PROMPT =
  "# Read Test Skill\n\nThis skill exists so the /skills mount always has a readable file.";

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
    name: "Cortex Read Test Skill",
    description: "Fixture skill that guarantees a readable /skills file.",
    tagline: "Read-test fixture",
    icon: "brain",
    systemPrompt: SKILL_SYSTEM_PROMPT,
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

/** Remove the materialized skill + its embedding index row. */
async function deleteTestSkill(userId: string): Promise<void> {
  await db
    .delete(customSkills)
    .where(
      and(eq(customSkills.userId, userId), eq(customSkills.slug, SKILL_SLUG)),
    );
  await db
    .delete(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        like(cortexNodes.path, `/skills/${SKILL_SLUG}%`),
      ),
    );
}

/** Write a file via the real WRITE endpoint; fails the test if it does not stick. */
async function writeFile(path: string, content: string): Promise<void> {
  const res = await sendTestRequest({
    endpoint: writeEndpoint.POST,
    data: { path, content, createParents: true },
    user,
  });
  expect(
    res.success,
    `setup write failed for ${path}: ${res.success ? "" : res.message}`,
  ).toBe(true);
}

describe("Cortex Read E2E", () => {
  beforeAll(async () => {
    user = await resolveTestAdminUser();
    await cleanup(user.id);
    await createTestSkill(user.id);
  });

  afterAll(async () => {
    if (user) {
      await cleanup(user.id);
      await deleteTestSkill(user.id);
    }
  });

  it("reads a freshly written document with exact content and metadata", async () => {
    const path = `${TEST_PREFIX}/basic.md`;
    const content = "# Notes\n\nStay sharp. Ship it.";
    await writeFile(path, content);

    const res = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(res.success, `read failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe(path);
    expect(res.data.content).toBe(content);
    expect(res.data.nodeType).toBe("file");
    expect(res.data.readonly).toBe(false);
    expect(res.data.truncated).toBe(false);
    expect(res.data.size).toBe(Buffer.byteLength(content, "utf8"));
    expect(res.data.size).toBeGreaterThan(0);
    expect(res.data.updatedAt).toBeInstanceOf(Date);
    expect(Number.isNaN(res.data.updatedAt.getTime())).toBe(false);
  });

  it("truncates output when maxLines is below the line count", async () => {
    const path = `${TEST_PREFIX}/long.md`;
    const lines = [...Array(50).keys()].map((i) => `line ${i + 1}`);
    const full = lines.join("\n");
    await writeFile(path, full);

    // Sanity: full read is not truncated and carries every line.
    const fullRes = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(
      fullRes.success,
      `full read failed: ${fullRes.success ? "" : fullRes.message}`,
    ).toBe(true);
    if (!fullRes.success) {
      return;
    }
    expect(fullRes.data.truncated).toBe(false);
    expect(fullRes.data.content.split("\n")).toHaveLength(50);

    const res = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path, maxLines: 5 },
      user,
    });
    expect(
      res.success,
      `truncated read failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(res.data.truncated).toBe(true);
    // First maxLines lines are kept; rest dropped.
    expect(res.data.content.split("\n")).toHaveLength(5);
    expect(res.data.content).toBe(lines.slice(0, 5).join("\n"));
    expect(res.data.content.length).toBeLessThan(full.length);
  });

  it("rejects reading a native document directory with VALIDATION_ERROR", async () => {
    // Writing a child auto-creates the parent dir node in the document workspace.
    const childPath = `${TEST_PREFIX}/dir-probe/child.md`;
    await writeFile(childPath, "child content");

    const dirPath = `${TEST_PREFIX}/dir-probe`;
    const res = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: dirPath },
      user,
    });
    // Document-workspace dirs are not readable as files — read returns a
    // validation error (only virtual mounts render a directory listing).
    expect(res.success, "reading a document dir must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.VALIDATION_ERROR.errorCode,
    );
  });

  it("returns NOT_FOUND for a never-written document path", async () => {
    const res = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: `${TEST_PREFIX}/does-not-exist-xyz.md` },
      user,
    });
    expect(res.success, "reading a missing file must fail").toBe(false);
    if (res.success) {
      return;
    }
    expect(res.errorType?.errorCode).toBe(
      ErrorResponseTypes.NOT_FOUND.errorCode,
    );
  });

  it("reads a virtual-mount /skills file resolved live from source", async () => {
    const listRes = await sendTestRequest({
      endpoint: listEndpoint.GET,
      data: { path: "/skills" },
      user,
    });
    expect(
      listRes.success,
      `skills list failed: ${listRes.success ? "" : listRes.message}`,
    ).toBe(true);
    if (!listRes.success) {
      return;
    }

    // The suite materializes a custom skill in beforeAll, so the mount must
    // always expose at least one readable file — never skip.
    const fileEntry = listRes.data.entries.find(
      (entry) => entry.nodeType === "file",
    );
    expect(
      fileEntry,
      "a /skills file must exist (test skill was materialized in beforeAll)",
    ).toBeDefined();
    if (!fileEntry) {
      return;
    }

    const res = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: fileEntry.entryPath },
      user,
    });
    expect(
      res.success,
      `skill read failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe(fileEntry.entryPath);
    expect(res.data.nodeType).toBe("file");
    expect(res.data.content.length).toBeGreaterThan(0);
    // /skills is a write-through mount, so its files report readonly=false.
    expect(res.data.readonly).toBe(false);
    expect(res.data.size).toBe(Buffer.byteLength(res.data.content, "utf8"));
  });

  it("reads a read-only virtual-mount directory listing (/threads)", async () => {
    // /threads is a virtual mount that is NOT write-through. Reading the mount
    // root renders a directory listing with readonly=true and nodeType=dir.
    const res = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path: "/threads" },
      user,
    });
    expect(
      res.success,
      `/threads read failed: ${res.success ? "" : res.message}`,
    ).toBe(true);
    if (!res.success) {
      return;
    }

    expect(res.data.responsePath).toBe("/threads");
    expect(res.data.nodeType).toBe("dir");
    expect(res.data.readonly).toBe(true);
    // Listing summary is rendered as markdown headed by the path.
    expect(res.data.content).toContain("/threads");
  });

  it("reports UTF-8 byte size for multibyte content", async () => {
    const path = `${TEST_PREFIX}/multibyte.md`;
    const content = "café 日本";
    await writeFile(path, content);

    const res = await sendTestRequest({
      endpoint: readEndpoint.GET,
      data: { path },
      user,
    });
    expect(res.success, `read failed: ${res.success ? "" : res.message}`).toBe(
      true,
    );
    if (!res.success) {
      return;
    }

    const byteLength = Buffer.byteLength(content, "utf8");
    // Byte length exceeds the JS string length for multibyte characters.
    expect(byteLength).toBeGreaterThan(content.length);
    expect(res.data.content).toBe(content);
    expect(res.data.size).toBe(byteLength);
  });
});
