/**
 * Folder Project - instructions + knowledge files.
 *
 * Drives the real GET / PATCH / POST files / DELETE file endpoints via
 * sendTestRequest and asserts the system-prompt fragment injects (only) for
 * chats in the project folder and its subfolders.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { DefaultFolderId, makeHeadlessContext } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createE2EUser,
  deleteE2EUser,
  type E2EAccount,
  seedFolder,
} from "../../../../testing/e2e-seed";
import { chatFolders } from "../../../../db";
import { folderProjectFragment } from "../../../system-prompt";
import projectDefinitions from "./definition";
import removeFileDefinitions from "./files/[fileId]/definition";
import addFileDefinitions from "./files/definition";

const logger = createEndpointLogger(false, defaultLocale);

let owner: E2EAccount;
let stranger: E2EAccount;
let projectFolderId: string;
let subFolderId: string;
let otherFolderId: string;

async function promptFor(
  account: E2EAccount,
  folderId: string | null,
): Promise<string | null> {
  return folderProjectFragment.build({
    user: account.user,
    logger,
    locale: defaultLocale,
    rootFolderId: DefaultFolderId.PRIVATE,
    subFolderId: folderId,
    skillId: null,
    isIncognito: false,
    isExposedFolder: false,
    subAgentDepth: 0,
    toolExecutionContext: makeHeadlessContext(undefined, undefined, "UTC"),
  });
}

describe("Folder project", () => {
  beforeAll(async () => {
    const tag = Date.now();
    owner = await createE2EUser(`e2e-proj-owner-${tag}@example.com`);
    stranger = await createE2EUser(`e2e-proj-stranger-${tag}@example.com`);
    projectFolderId = await seedFolder(owner, DefaultFolderId.PRIVATE, "Project A");
    otherFolderId = await seedFolder(owner, DefaultFolderId.PRIVATE, "Project B");
    const [sub] = await db
      .insert(chatFolders)
      .values({
        userId: owner.user.id,
        rootFolderId: DefaultFolderId.PRIVATE,
        name: "Sub",
        parentId: projectFolderId,
      })
      .returning({ id: chatFolders.id });
    subFolderId = sub.id;
  });

  afterAll(async () => {
    await db.delete(chatFolders).where(eq(chatFolders.userId, owner.user.id));
    await deleteE2EUser(owner);
    await deleteE2EUser(stranger);
  });

  it("a plain folder contributes nothing to the prompt", async () => {
    expect(await promptFor(owner, projectFolderId)).toBeNull();
  });

  it("only folder editors can set instructions", async () => {
    const denied = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: projectDefinitions.PATCH,
      urlPathParams: { subFolderId: projectFolderId },
      data: { instructions: "hijack" },
      user: stranger.user,
    });
    expect(denied.success).toBe(false);
    if (!denied.success) {
      expect(denied.errorType.errorKey).toBe(ErrorResponseTypes.FORBIDDEN.errorKey);
    }

    const ok = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: projectDefinitions.PATCH,
      urlPathParams: { subFolderId: projectFolderId },
      data: { instructions: "Always answer in haiku." },
      user: owner.user,
    });
    expect(ok.success, JSON.stringify(ok)).toBe(true);

    const read = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: projectDefinitions.GET,
      urlPathParams: { subFolderId: projectFolderId },
      user: owner.user,
    });
    expect(read.success).toBe(true);
    if (read.success) {
      expect(read.data.instructions).toBe("Always answer in haiku.");
      expect(read.data.canManage).toBe(true);
    }

    const strangerRead = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: projectDefinitions.GET,
      urlPathParams: { subFolderId: projectFolderId },
      user: stranger.user,
    });
    expect(strangerRead.success).toBe(false);
  });

  it("injects instructions for chats in the folder and its subfolders, not other folders", async () => {
    const inFolder = await promptFor(owner, projectFolderId);
    expect(inFolder).toContain("Always answer in haiku.");
    expect(inFolder).toContain("Project Instructions");

    const inSub = await promptFor(owner, subFolderId);
    expect(inSub).toContain("Always answer in haiku.");

    expect(await promptFor(owner, otherFolderId)).toBeNull();
    expect(await promptFor(owner, null)).toBeNull();
  });

  it("clearing instructions removes the injection", async () => {
    const cleared = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: projectDefinitions.PATCH,
      urlPathParams: { subFolderId: projectFolderId },
      data: { instructions: "   " },
      user: owner.user,
    });
    expect(cleared.success).toBe(true);
    expect(await promptFor(owner, projectFolderId)).toBeNull();
  });

  it("knowledge files: attach / list / inject / remove, scoped to the folder", async () => {
    const denied = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: addFileDefinitions.POST,
      urlPathParams: { subFolderId: projectFolderId },
      data: { name: "evil", content: "nope" },
      user: stranger.user,
    });
    expect(denied.success).toBe(false);

    const added = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: addFileDefinitions.POST,
      urlPathParams: { subFolderId: projectFolderId },
      data: { name: "launch brief", content: "Launch date is March 3rd." },
      user: owner.user,
    });
    expect(added.success, JSON.stringify(added)).toBe(true);
    if (!added.success) {
      return;
    }
    expect(added.data.path).toBe(
      `/documents/projects/${projectFolderId}/launch brief.md`,
    );

    const list = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: projectDefinitions.GET,
      urlPathParams: { subFolderId: projectFolderId },
      user: owner.user,
    });
    expect(list.success).toBe(true);
    if (list.success) {
      expect(list.data.files.map((f) => f.name)).toEqual(["launch brief.md"]);
    }

    const otherList = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: projectDefinitions.GET,
      urlPathParams: { subFolderId: otherFolderId },
      user: owner.user,
    });
    expect(otherList.success && otherList.data.files.length).toBe(0);

    const prompt = await promptFor(owner, subFolderId);
    expect(prompt).toContain("Project Knowledge");
    expect(prompt).toContain("Launch date is March 3rd.");
    expect(await promptFor(owner, otherFolderId)).toBeNull();

    // Another folder cannot delete this folder's file by id
    const crossDelete = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: removeFileDefinitions.DELETE,
      urlPathParams: { subFolderId: otherFolderId, fileId: added.data.fileId },
      user: owner.user,
    });
    expect(crossDelete.success).toBe(false);

    const strangerDelete = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: removeFileDefinitions.DELETE,
      urlPathParams: { subFolderId: projectFolderId, fileId: added.data.fileId },
      user: stranger.user,
    });
    expect(strangerDelete.success).toBe(false);

    const removed = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: removeFileDefinitions.DELETE,
      urlPathParams: { subFolderId: projectFolderId, fileId: added.data.fileId },
      user: owner.user,
    });
    expect(removed.success, JSON.stringify(removed)).toBe(true);
    expect(await promptFor(owner, projectFolderId)).toBeNull();
  });
});
