/**
 * Uncensored-model consent: the server rule.
 * - only the UNCENSORED tier is gated (mainstream / open pass untouched)
 * - guests consent on their lead, accounts on their user row
 * - withdrawing or an outdated consent text locks the model again
 * - a guest's consent moves to the account on signup/login
 * - the chat stream refuses an uncensored model with CONSENT_REQUIRED before
 *   it writes anything (no thread, no message, no provider call)
 * Requires the dev DB.
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { leads } from "next-vibe/identity/lead/db";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { sendTestRequest } from "next-vibe/tooling/testing/testing-suite/send-test-request";
import { afterAll, describe, expect, it } from "vitest";

import { DefaultFolderId } from "../../../core/execution-context";
import { DEFAULT_CHAT_MODEL_ID } from "../../ai-stream/constants";
import { ChatModelId, getChatModelById } from "../../ai-stream/models";
import { AiStreamRepository } from "../../ai-stream/repository";
import { scopedTranslation as aiStreamScopedTranslation } from "../../ai-stream/stream/i18n";
import {
  createE2ECreditUser,
  createE2EFreeGuest,
  type E2ECreditUser,
  type E2EFundedGuest,
} from "../../ai-stream/testing/e2e-credit-user";
import { chatThreads } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import { NO_SKILL_ID } from "../../skills/constants";
import { ContentLevel } from "../../skills/enum";
import {
  isConsentCurrent,
  isUncensoredContent,
  UNCENSORED_CONSENT_VERSION,
} from "./constants";
import uncensoredConsentEndpoints from "./definition";
import { UncensoredConsentRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const { t: aiStreamT } = aiStreamScopedTranslation.scopedT(defaultLocale);
const TIMEOUT_MS = 60_000;

const UNCENSORED_MODEL = getChatModelById(ChatModelId.UNCENSORED_LM_V1_2);
const MAINSTREAM_MODEL = getChatModelById(DEFAULT_CHAT_MODEL_ID);

const cleanups: Array<() => Promise<void>> = [];

afterAll(async () => {
  for (const cleanup of cleanups.toReversed()) {
    await cleanup();
  }
});

function guestUser(leadId: string): JwtPayloadType {
  return { isPublic: true, leadId, roles: [UserPermissionRole.PUBLIC] };
}

async function newGuest(tag: string): Promise<E2EFundedGuest> {
  const guest = await createE2EFreeGuest(`consent-${tag}`);
  cleanups.push(guest.remove);
  return guest;
}

async function newAccount(tag: string): Promise<E2ECreditUser> {
  const account = await createE2ECreditUser(`consent-${tag}`, 0);
  cleanups.push(account.remove);
  return account;
}

function gateUncensored(
  user: JwtPayloadType,
): ReturnType<typeof UncensoredConsentRepository.gate> {
  return UncensoredConsentRepository.gate({
    content: UNCENSORED_MODEL?.content,
    modelName: UNCENSORED_MODEL?.name ?? "uncensored",
    user,
    locale: defaultLocale,
    logger,
  });
}

describe("tier rule", () => {
  it("only the uncensored tier is gated", () => {
    expect(isUncensoredContent(ContentLevel.UNCENSORED)).toBe(true);
    expect(isUncensoredContent(ContentLevel.OPEN)).toBe(false);
    expect(isUncensoredContent(ContentLevel.MAINSTREAM)).toBe(false);
    expect(isUncensoredContent(undefined)).toBe(false);
    expect(UNCENSORED_MODEL?.content).toBe(ContentLevel.UNCENSORED);
    expect(MAINSTREAM_MODEL?.content).not.toBe(ContentLevel.UNCENSORED);
  });

  it("an outdated or missing consent does not count", () => {
    expect(isConsentCurrent(null, null)).toBe(false);
    expect(isConsentCurrent(new Date(), null)).toBe(false);
    expect(isConsentCurrent(new Date(), UNCENSORED_CONSENT_VERSION - 1)).toBe(
      false,
    );
    expect(isConsentCurrent(new Date(), UNCENSORED_CONSENT_VERSION)).toBe(true);
  });
});

describe("guest (lead) consent", () => {
  it(
    "mainstream passes, uncensored refused until the guest agrees, withdraw locks again",
    async () => {
      const guest = await newGuest("guest");
      const user = guestUser(guest.leadId);

      const mainstream = await UncensoredConsentRepository.gate({
        content: MAINSTREAM_MODEL?.content,
        modelName: MAINSTREAM_MODEL?.name ?? "default",
        user,
        locale: defaultLocale,
        logger,
      });
      expect(mainstream.success).toBe(true);

      const refused = await gateUncensored(user);
      expect(refused.success).toBe(false);
      if (!refused.success) {
        expect(refused.errorType.errorKey).toBe(
          ErrorResponseTypes.CONSENT_REQUIRED.errorKey,
        );
        // CLI / MCP callers learn how a human confirms
        expect(String(refused.message)).toContain("uncensored-consent-agree");
      }

      const before = await sendTestRequest({
        endpoint: uncensoredConsentEndpoints.GET,
        user,
        toolExecutionContext: undefined,
      });
      expect(before.success && before.data.consented).toBe(false);

      const agreed = await sendTestRequest({
        endpoint: uncensoredConsentEndpoints.POST,
        data: { confirm: true },
        user,
        toolExecutionContext: undefined,
      });
      expect(agreed.success, JSON.stringify(agreed)).toBe(true);
      expect(agreed.success && agreed.data.consented).toBe(true);

      const [row] = await db
        .select()
        .from(leads)
        .where(eq(leads.id, guest.leadId));
      expect(row?.uncensoredConsentAt).toBeInstanceOf(Date);
      expect(row?.uncensoredConsentVersion).toBe(UNCENSORED_CONSENT_VERSION);

      expect((await gateUncensored(user)).success).toBe(true);

      const withdrawn = await sendTestRequest({
        endpoint: uncensoredConsentEndpoints.DELETE,
        user,
        toolExecutionContext: undefined,
      });
      expect(withdrawn.success && withdrawn.data.consented).toBe(false);
      expect((await gateUncensored(user)).success).toBe(false);
    },
    TIMEOUT_MS,
  );

  it(
    "consent for an older consent text is asked again",
    async () => {
      const guest = await newGuest("outdated");
      await db
        .update(leads)
        .set({
          uncensoredConsentAt: new Date(),
          uncensoredConsentVersion: UNCENSORED_CONSENT_VERSION - 1,
        })
        .where(eq(leads.id, guest.leadId));
      expect((await gateUncensored(guestUser(guest.leadId))).success).toBe(
        false,
      );
    },
    TIMEOUT_MS,
  );
});

describe("account consent", () => {
  it(
    "is stored on the user, independent of the guest lead",
    async () => {
      const account = await newAccount("account");
      expect((await gateUncensored(account.user)).success).toBe(false);

      const agreed = await sendTestRequest({
        endpoint: uncensoredConsentEndpoints.POST,
        data: { confirm: true },
        user: account.user,
        toolExecutionContext: undefined,
      });
      expect(agreed.success).toBe(true);

      const [row] = await db
        .select()
        .from(users)
        .where(eq(users.id, account.user.id));
      expect(row?.uncensoredConsentVersion).toBe(UNCENSORED_CONSENT_VERSION);
      expect((await gateUncensored(account.user)).success).toBe(true);
    },
    TIMEOUT_MS,
  );

  it(
    "a guest who consented keeps it after linking to an account",
    async () => {
      const guest = await newGuest("carry");
      const account = await newAccount("carry");
      const agreed = await sendTestRequest({
        endpoint: uncensoredConsentEndpoints.POST,
        data: { confirm: true },
        user: guestUser(guest.leadId),
        toolExecutionContext: undefined,
      });
      expect(agreed.success).toBe(true);
      expect((await gateUncensored(account.user)).success).toBe(false);

      await UncensoredConsentRepository.carryLeadConsentToUser(
        guest.leadId,
        account.user.id,
        logger,
      );
      expect((await gateUncensored(account.user)).success).toBe(true);
    },
    TIMEOUT_MS,
  );
});

describe("chat stream gate", () => {
  it(
    "refuses an uncensored model with CONSENT_REQUIRED before writing anything",
    async () => {
      const guest = await newGuest("stream");
      const threadId = crypto.randomUUID();
      const result = await AiStreamRepository.createAiStream({
        data: {
          operation: "send",
          rootFolderId: DefaultFolderId.PRIVATE,
          subFolderId: null,
          threadId,
          userMessageId: crypto.randomUUID(),
          parentMessageId: null,
          content: "hello",
          role: ChatMessageRole.USER,
          model: ChatModelId.UNCENSORED_LM_V1_2,
          skill: NO_SKILL_ID,
          favoriteConfig: null,
          toolConfirmations: null,
          messageHistory: [],
          voiceMode: { enabled: false },
          audioInput: { file: null },
          timezone: "UTC",
          attachments: null,
          executionContext: { mode: "local" },
        },
        locale: defaultLocale,
        logger,
        user: guestUser(guest.leadId),
        request: undefined,
        t: aiStreamT,
        subAgentDepth: 0,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorType.errorKey).toBe(
          ErrorResponseTypes.CONSENT_REQUIRED.errorKey,
        );
      }
      const threads = await db
        .select({ id: chatThreads.id })
        .from(chatThreads)
        .where(eq(chatThreads.id, threadId));
      expect(threads).toHaveLength(0);
    },
    TIMEOUT_MS,
  );
});
