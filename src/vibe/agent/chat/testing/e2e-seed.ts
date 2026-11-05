// Testing infrastructure - messages are for test debugging, not end users

/**
 * Seed data for the chat E2E suites: a throwaway customer account plus the
 * folders, threads, messages and stored files it owns. Everything created here
 * is removed by `deleteE2EUser` (user delete cascades to its threads, folders
 * and messages; the lead and stored files are removed explicitly).
 *
 *   const owner = await createE2EUser(uniqueEmail("tag"));
 *   cleanup(() => deleteE2EUser(owner));
 *   const threadId = await seedThread(owner, { rootFolderId, title });
 *   await signInAs(fixtures, owner);
 *   await gotoReady(`/threads/${rootFolderId}/${threadId}`, chatReady(page));
 */

import { eq } from "drizzle-orm";
import type { BrowserContext, Locator, Page } from "playwright";
import { expect } from "vitest";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import type { DefaultFolderId } from "next-vibe/core/execution-context";
import { db } from "next-vibe/database";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import {
  UserPermissionRole,
  type UserPermissionRoleValue,
} from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import type { E2EFixtures } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";

import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import userDeleteDefinitions from "@/users/user/[id]/definition";

import { chatFolders, chatMessages, chatThreads } from "../db";
import {
  getFolderTourAttr,
  getTourSelector,
  TOUR_DATA_ATTRS,
} from "../../ai-stream/stream/widget/chat-ui/welcome-tour/tour-attrs";
import { TOUR_STORAGE_KEY } from "../../ai-stream/stream/widget/chat-ui/welcome-tour/tour-config";
import { ChatMessageRole, ThreadStreamingState } from "../enum";
import { getStorageAdapter } from "../storage";

/**
 * Ids are minted here, never read back via INSERT…RETURNING: the Atlas PGlite
 * loopback proxy has been observed returning a stale id for a fresh insert
 * (see database/pglite-server.ts), which made cleanups miss and sessions point
 * at the wrong user.
 */
function newId(): string {
  return crypto.randomUUID();
}

export interface E2EAccount {
  user: JwtPrivatePayloadType;
  email: string;
  publicName: string;
}

/** A fresh CUSTOMER with its own lead — never the shared admin. */
export async function createE2EUser(email: string): Promise<E2EAccount> {
  const { language, country } = getLanguageAndCountryFromLocale(defaultLocale);
  const publicName = `E2E ${email.slice(4, 18)}`;
  const leadId = newId();
  const userId = newId();
  await db.insert(leads).values({
    id: leadId,
    email: null,
    businessName: publicName,
    country,
    language,
    source: LeadSource.WEBSITE,
    status: LeadStatus.WEBSITE_USER,
  });
  await db.insert(users).values({
    id: userId,
    email,
    // Never logged in through the form — loginAs() issues the session
    password: "e2e-no-password-login",
    privateName: publicName,
    publicName,
    locale: defaultLocale,
    emailVerified: true,
  });
  await db
    .insert(userRoles)
    .values({ userId, role: UserPermissionRole.CUSTOMER });
  await db
    .insert(userLeadLinks)
    .values({ userId, leadId, linkReason: "signup" });
  return {
    email,
    publicName,
    user: {
      isPublic: false,
      id: userId,
      leadId,
      roles: [UserPermissionRole.CUSTOMER],
    },
  };
}

/** Delete the account (cascades threads/folders/messages) and its lead. */
export async function deleteE2EUser(account: E2EAccount): Promise<void> {
  const removed = await sendTestRequest({
    endpoint: userDeleteDefinitions.DELETE,
    urlPathParams: { id: account.user.id },
    user: await resolveTestAdminUser(),
    toolExecutionContext: undefined,
  });
  expect(removed.success, JSON.stringify(removed)).toBe(true);
  await db.delete(leads).where(eq(leads.id, account.user.leadId));
}

/**
 * Sign the browser in as `account`, carrying the account's own lead cookie —
 * what a browser that signed up holds — instead of the fresh anonymous lead
 * the middleware would otherwise mint for this context.
 */
export async function signInAs(
  fixtures: Pick<E2EFixtures, "loginAs" | "context" | "baseUrl">,
  account: E2EAccount,
): Promise<void> {
  await fixtures.loginAs(account.user);
  await fixtures.context.addCookies([
    {
      name: LEAD_ID_COOKIE_NAME,
      value: account.user.leadId,
      url: fixtures.baseUrl,
      httpOnly: true,
    },
  ]);
}

export async function seedFolder(
  account: E2EAccount,
  rootFolderId: DefaultFolderId,
  name: string,
): Promise<string> {
  const id = newId();
  await db
    .insert(chatFolders)
    .values({ id, userId: account.user.id, rootFolderId, name });
  return id;
}

/** A thread owned by `account`. Returns its id. */
export async function seedThread(
  account: E2EAccount,
  options: {
    rootFolderId: DefaultFolderId;
    title: string;
    folderId?: string;
    streamingState?: ThreadStreamingState;
    published?: boolean;
    /** Who may view it (null = inherit from folder / root). */
    rolesView?: (typeof UserPermissionRoleValue)[] | null;
  },
): Promise<string> {
  const id = newId();
  await db.insert(chatThreads).values({
    id,
    userId: account.user.id,
    leadId: account.user.leadId,
    title: options.title,
    rootFolderId: options.rootFolderId,
    folderId: options.folderId ?? null,
    streamingState: options.streamingState ?? ThreadStreamingState.IDLE,
    published: options.published ?? false,
    rolesView: options.rolesView ?? null,
  });
  return id;
}

export async function getThreadStreamingState(
  threadId: string,
): Promise<ThreadStreamingState | null> {
  const [thread] = await db
    .select({ streamingState: chatThreads.streamingState })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId));
  return thread?.streamingState ?? null;
}

export interface SeededFile {
  fileId: string;
  /** Name as uploaded. */
  name: string;
  /** Stored name — the `[filename]` URL segment. */
  filename: string;
  mimeType: string;
  url: string;
  bytes: number;
  remove: () => Promise<void>;
}

/** Store a file in the thread's namespace exactly like an upload does. */
export async function seedThreadFile(
  account: E2EAccount,
  threadId: string,
  file: { name: string; mimeType: string; bytes: Buffer },
): Promise<SeededFile> {
  const storage = getStorageAdapter();
  const stored = await storage.uploadFile(file.bytes, {
    filename: file.name,
    mimeType: file.mimeType,
    threadId,
    userId: account.user.id,
  });
  return {
    fileId: stored.fileId,
    name: file.name,
    filename: stored.metadata.filename,
    mimeType: file.mimeType,
    url: stored.url,
    bytes: file.bytes.length,
    remove: () => storage.deleteFile(stored.fileId),
  };
}

/**
 * A message in `threadId` authored by `account`. Returns its id. `attachment`
 * leaves behind what an upload does: the stored file on the message metadata.
 */
export async function seedMessage(
  account: E2EAccount,
  threadId: string,
  content: string,
  options: {
    parentId?: string;
    role?: ChatMessageRole.USER | ChatMessageRole.ASSISTANT;
    attachment?: SeededFile;
  } = {},
): Promise<string> {
  const id = newId();
  const { attachment } = options;
  await db.insert(chatMessages).values({
    id,
    threadId,
    parentId: options.parentId ?? null,
    role: options.role ?? ChatMessageRole.USER,
    content,
    authorId: account.user.id,
    authorName: account.publicName,
    metadata: attachment
      ? {
          attachments: [
            {
              id: attachment.fileId,
              url: attachment.url,
              filename: attachment.name,
              mimeType: attachment.mimeType,
              size: attachment.bytes,
            },
          ],
        }
      : {},
  });
  return id;
}

/** 1x1 transparent PNG. */
export const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

/** The welcome tour overlays the chat on first visit — mark it done for this context. */
export async function suppressWelcomeTour(
  context: BrowserContext,
): Promise<void> {
  await context.addInitScript((key) => {
    // eslint-disable-next-line restricted/no-browser-globals -- init script runs inside the browser page, not app code
    localStorage.setItem(key, "true");
  }, TOUR_STORAGE_KEY);
}

/** A root folder tab in the chat sidebar (Private, Shared, Public…). */
export function rootFolderTab(
  page: Page,
  rootFolderId: DefaultFolderId,
): Locator {
  const attr = getFolderTourAttr(rootFolderId);
  if (!attr) {
    // eslint-disable-next-line restricted/restricted-syntax -- test setup failure
    throw new Error(`[e2e] root folder "${rootFolderId}" has no tab hook`);
  }
  return page.locator(getTourSelector(attr)).first();
}

/**
 * `gotoReady` condition for a chat page (hand-built — no endpoint form for
 * `open()` to wait on): the composer's `[data-hydrated]` form, then the lazily
 * loaded root folder tabs. In order: the sidebar re-mounts once the page
 * hydrates, so its server-rendered markup alone does not mean it is clickable.
 */
export function chatReady(page: Page): () => Promise<void> {
  return async () => {
    await page
      .locator("[data-hydrated]")
      .first()
      .waitFor({ state: "attached" });
    await page
      .locator(getTourSelector(TOUR_DATA_ATTRS.ROOT_FOLDERS))
      .first()
      .waitFor({ state: "attached" });
  };
}
