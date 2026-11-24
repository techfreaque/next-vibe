/**
 * Public root access tests
 *
 * Reading: the Public root is "visible to all". A guest, a signed-in customer
 * and a signed-in account without any stored role row (older or admin-created
 * accounts; every authenticated user is a CUSTOMER implicitly) must all see
 * the same public threads in the sidebar list and in the community feed.
 * Regression: the account without a role row saw "No threads found" while
 * guests saw everything.
 *
 * Posting: signed-in users start threads and reply in Public; guests read
 * only, enforced server-side (the same ensureThread gate the AI stream uses).
 *
 * Real DB; every row created here is removed afterwards.
 */

import { eq, inArray } from "drizzle-orm";
import { DefaultFolderId } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { getLanguageAndCountryFromLocale } from "next-vibe/core/i18n/core/language-utils";
import { db } from "next-vibe/database";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import { leads, userLeadLinks } from "next-vibe/identity/lead/db";
import { LeadSource, LeadStatus } from "next-vibe/identity/lead/enum";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";

import { DEFAULT_CHAT_MODEL_ID } from "../../ai-stream/constants";
import { runAutoQueueBranch } from "../../ai-stream/repository/intake/queue";
import { scopedTranslation as aiStreamTranslation } from "../../ai-stream/stream/i18n";
import { NO_SKILL_ID } from "../../skills/constants";
import { chatFolders, chatMessages, chatThreads } from "../db";
import { ChatMessageRole, ThreadStreamingState } from "../enum";
import rootPermissionsEndpoints from "../folders/[rootFolderId]/root-permissions/definition";
import { ThreadsRepository } from "../threads/repository";
import threadsEndpoints from "../threads/definition";
import feedEndpoints, { FeedSortMode } from "./definition";

const TEST_TIMEOUT = 60_000;
const logger = createEndpointLogger(false, defaultLocale);

describe("public root visibility", () => {
  const stamp = `pubvis${Date.now()}`;
  const visibleTitle = `${stamp} open thread`;
  const userIds: string[] = [];
  const leadIds: string[] = [];
  let author: JwtPrivatePayloadType;
  let customer: JwtPrivatePayloadType;
  let roleless: JwtPrivatePayloadType;
  let guest: JwtPayloadType;
  let publicThreadId: string;
  const announcementsId = crypto.randomUUID();

  async function createLead(): Promise<string> {
    const { language, country } =
      getLanguageAndCountryFromLocale(defaultLocale);
    const leadId = crypto.randomUUID();
    await db.insert(leads).values({
      id: leadId,
      email: null,
      businessName: `${stamp} lead`,
      country,
      language,
      source: LeadSource.WEBSITE,
      status: LeadStatus.WEBSITE_USER,
    });
    leadIds.push(leadId);
    return leadId;
  }

  /** A user; `withCustomerRow` false = no stored role at all. */
  async function createUser(
    name: string,
    withCustomerRow: boolean,
  ): Promise<JwtPrivatePayloadType> {
    const leadId = await createLead();
    const userId = crypto.randomUUID();
    await db.insert(users).values({
      id: userId,
      email: `${stamp}-${name}@example.com`,
      password: "test-no-password-login",
      privateName: `${stamp} ${name}`,
      publicName: `${stamp} ${name}`,
      locale: defaultLocale,
      emailVerified: true,
    });
    userIds.push(userId);
    if (withCustomerRow) {
      await db
        .insert(userRoles)
        .values({ userId, role: UserPermissionRole.CUSTOMER });
    }
    await db
      .insert(userLeadLinks)
      .values({ userId, leadId, linkReason: "signup" });
    return {
      isPublic: false,
      id: userId,
      leadId,
      // What the endpoint auth layer issues for any signed-in account, stored
      // role row or not (AuthRepository.getUserRolesInternal)
      roles: [UserPermissionRole.CUSTOMER],
    };
  }

  beforeAll(async () => {
    author = await createUser("author", true);
    customer = await createUser("customer", true);
    roleless = await createUser("roleless", false);
    guest = {
      isPublic: true,
      leadId: await createLead(),
      roles: [UserPermissionRole.PUBLIC],
    };
    publicThreadId = crypto.randomUUID();
    await db.insert(chatThreads).values({
      id: publicThreadId,
      userId: author.id,
      leadId: author.leadId,
      title: visibleTitle,
      rootFolderId: DefaultFolderId.PUBLIC,
      published: true,
    });
  }, TEST_TIMEOUT);

  afterAll(async () => {
    await db.delete(chatThreads).where(inArray(chatThreads.leadId, leadIds));
    if (userIds.length > 0) {
      await db.delete(chatThreads).where(inArray(chatThreads.userId, userIds));
      await db
        .delete(userLeadLinks)
        .where(inArray(userLeadLinks.userId, userIds));
      await db.delete(userRoles).where(inArray(userRoles.userId, userIds));
      await db.delete(users).where(inArray(users.id, userIds));
    }
    await db.delete(chatFolders).where(eq(chatFolders.id, announcementsId));
    for (const leadId of leadIds) {
      await db.delete(leads).where(eq(leads.id, leadId));
    }
  }, TEST_TIMEOUT);

  async function listedTitles(user: JwtPayloadType): Promise<string[]> {
    const listed = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: threadsEndpoints.GET,
      data: {
        page: 1,
        limit: 20,
        rootFolderId: DefaultFolderId.PUBLIC,
        subFolderId: undefined,
        status: undefined,
        search: stamp,
        isPinned: undefined,
        dateFrom: undefined,
        dateTo: undefined,
      },
      user,
    });
    expect(listed.success, JSON.stringify(listed)).toBe(true);
    return listed.success ? listed.data.threads.map((th) => th.title) : [];
  }

  async function feedTitles(user: JwtPayloadType): Promise<string[]> {
    const feed = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: feedEndpoints.GET,
      data: {
        sortMode: FeedSortMode.NEW,
        page: 1,
        limit: 20,
        search: stamp,
        needsReply: undefined,
      },
      user,
    });
    expect(feed.success, JSON.stringify(feed)).toBe(true);
    return feed.success ? feed.data.items.map((item) => item.title) : [];
  }

  it(
    "guest, customer and a role-less signed-in account all see the public thread",
    async () => {
      for (const user of [guest, customer, roleless]) {
        expect(await listedTitles(user)).toEqual([visibleTitle]);
        expect(await feedTitles(user)).toEqual([visibleTitle]);
      }
    },
    TEST_TIMEOUT,
  );

  /** The gate every AI turn passes before a message lands in a thread. */
  async function ensure(
    user: JwtPayloadType,
    threadId: string,
    rootFolderId: DefaultFolderId = DefaultFolderId.PUBLIC,
  ): Promise<{ success: boolean; forbidden: boolean }> {
    const result = await ThreadsRepository.ensureThread({
      threadId,
      rootFolderId,
      subFolderId: null,
      userId: user.isPublic ? undefined : user.id,
      leadId: user.leadId,
      isIncognito: rootFolderId === DefaultFolderId.INCOGNITO,
      logger,
      user,
      locale: defaultLocale,
    });
    return {
      success: result.success,
      forbidden:
        !result.success &&
        result.errorType.errorKey === ErrorResponseTypes.FORBIDDEN.errorKey,
    };
  }

  async function canCreateInPublicRoot(user: JwtPayloadType): Promise<boolean> {
    const result = await sendTestRequest({
      toolExecutionContext: undefined,
      endpoint: rootPermissionsEndpoints.GET,
      urlPathParams: { rootFolderId: DefaultFolderId.PUBLIC },
      user,
    });
    expect(result.success, JSON.stringify(result)).toBe(true);
    return result.success && result.data.canCreateThread;
  }

  it(
    "signed-in users reply and start threads in Public, guests cannot",
    async () => {
      // Reply into an existing public thread
      expect(await ensure(guest, publicThreadId)).toEqual({
        success: false,
        forbidden: true,
      });
      for (const user of [customer, roleless]) {
        expect((await ensure(user, publicThreadId)).success).toBe(true);
      }

      // Start a new thread at the Public root
      expect(await ensure(guest, crypto.randomUUID())).toEqual({
        success: false,
        forbidden: true,
      });
      for (const user of [customer, roleless]) {
        const newThreadId = crypto.randomUUID();
        expect((await ensure(user, newThreadId)).success).toBe(true);
        const [created] = await db
          .select({ userId: chatThreads.userId })
          .from(chatThreads)
          .where(eq(chatThreads.id, newThreadId));
        expect(created?.userId).toBe(user.id);
      }

      // The composer reads the same rule from root-permissions
      expect(await canCreateInPublicRoot(guest)).toBe(false);
      expect(await canCreateInPublicRoot(customer)).toBe(true);
      expect(await canCreateInPublicRoot(roleless)).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    "guests can continue only their own lead-owned Background threads",
    async () => {
      for (const [rootFolderId, leadId, userId, allowed] of [
        [DefaultFolderId.BACKGROUND, guest.leadId, null, true],
        [DefaultFolderId.BACKGROUND, author.leadId, null, false],
        [DefaultFolderId.BACKGROUND, guest.leadId, author.id, false],
        [DefaultFolderId.PRIVATE, guest.leadId, null, false],
        [DefaultFolderId.SHARED, guest.leadId, null, false],
        [DefaultFolderId.PUBLIC, guest.leadId, null, false],
      ] as const) {
        const threadId = crypto.randomUUID();
        await db.insert(chatThreads).values({
          id: threadId,
          rootFolderId,
          leadId,
          userId,
          title: visibleTitle,
          rolesPost: [UserRole.PUBLIC],
        });
        expect(await ensure(guest, threadId, rootFolderId)).toEqual({
          success: allowed,
          forbidden: !allowed,
        });
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "keeps Announcements creation and replies restricted to admins",
    async () => {
      await db.insert(chatFolders).values({
        id: announcementsId,
        name: `${stamp} Announcements`,
        rootFolderId: DefaultFolderId.PUBLIC,
        rolesCreateThread: [UserRole.ADMIN],
        rolesPost: [UserRole.ADMIN],
      });
      const threadId = crypto.randomUUID();
      await db.insert(chatThreads).values({
        id: threadId,
        folderId: announcementsId,
        rootFolderId: DefaultFolderId.PUBLIC,
        userId: author.id,
        leadId: author.leadId,
        title: visibleTitle,
      });
      for (const user of [guest, customer]) {
        expect(await ensure(user, threadId)).toEqual({
          success: false,
          forbidden: true,
        });
        const result = await ThreadsRepository.ensureThread({
          threadId: crypto.randomUUID(),
          rootFolderId: DefaultFolderId.PUBLIC,
          subFolderId: announcementsId,
          isIncognito: false,
          userId: user.id,
          leadId: user.leadId,
          user,
          logger,
          locale: defaultLocale,
        });
        expect(!result.success && result.errorType.errorKey).toBe(
          ErrorResponseTypes.FORBIDDEN.errorKey,
        );
      }
    },
    TEST_TIMEOUT,
  );

  it(
    "denies guest creation in Private and Shared and derives Background ownership from the guest identity",
    async () => {
      for (const root of [DefaultFolderId.PRIVATE, DefaultFolderId.SHARED]) {
        expect(await ensure(guest, crypto.randomUUID(), root)).toEqual({
          success: false,
          forbidden: true,
        });
      }
      const threadId = crypto.randomUUID();
      const created = await ThreadsRepository.ensureThread({
        threadId,
        rootFolderId: DefaultFolderId.BACKGROUND,
        subFolderId: null,
        isIncognito: false,
        user: guest,
        logger,
        locale: defaultLocale,
      });
      expect(created.success).toBe(true);
      expect(await ensure(guest, threadId, DefaultFolderId.BACKGROUND)).toEqual({
        success: true,
        forbidden: false,
      });
    },
    TEST_TIMEOUT,
  );

  it(
    "guests cannot queue replies while another user's thread is streaming",
    async () => {
      const messageId = crypto.randomUUID();
      await db
        .update(chatThreads)
        .set({ streamingState: ThreadStreamingState.STREAMING })
        .where(eq(chatThreads.id, publicThreadId));
      const queued = await runAutoQueueBranch({
        data: {
          operation: "send",
          rootFolderId: DefaultFolderId.PUBLIC,
          subFolderId: null,
          threadId: publicThreadId,
          userMessageId: messageId,
          parentMessageId: null,
          content: "Guest reply",
          role: ChatMessageRole.USER,
          model: DEFAULT_CHAT_MODEL_ID,
          skill: NO_SKILL_ID,
          favoriteConfig: null,
          toolConfirmations: null,
          messageHistory: [],
          voiceMode: { enabled: false },
          audioInput: { file: null },
          resumeToken: null,
          timezone: "UTC",
          attachments: null,
          executionContext: { mode: "local" },
        },
        user: guest,
        userId: undefined,
        t: aiStreamTranslation.scopedT(defaultLocale).t,
        logger,
        fixtureScopeId: undefined,
      });
      expect(queued?.success).toBe(false);
      expect(queued && !queued.success && queued.errorType.errorKey).toBe(
        ErrorResponseTypes.FORBIDDEN.errorKey,
      );
      const rows = await db
        .select({ id: chatMessages.id })
        .from(chatMessages)
        .where(eq(chatMessages.id, messageId));
      expect(rows).toEqual([]);
    },
    TEST_TIMEOUT,
  );
});
