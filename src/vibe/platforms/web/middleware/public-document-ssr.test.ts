import { expect, it, mock, spyOn } from "bun:test";
import { drizzle } from "drizzle-orm/node-postgres";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import * as agentEnvironment from "next-vibe/agent/env";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import * as databaseModule from "next-vibe/database";
import { UserPermissionRole, UserRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { Platform } from "next-vibe/platforms/platforms";
import * as navigationModule from "next-vibe/ui/hooks/use-navigation";
import { renderToStaticMarkup } from "react-dom/server";

import { toModelSlug } from "@/_pages/models/_shared/model-facts";
import { LEAD_ID_COOKIE_NAME } from "@/env/constants";
import { NewsletterSubscriptionStatus } from "@/newsletter/enum";

import {
  DEGRADED_PUBLIC_DOCUMENT_HEADER,
  VERIFIED_CRAWLER_HEADER,
} from "./public-document";

const requestHeaders = new Headers();
let requestPath = "/en-US/story";
const readCookies = mock(() => new Map<string, { value: string }>());
mock.module("next-vibe/ui/lib/headers", () => ({
  headers: async () => requestHeaders,
  getPathname: async () => requestPath,
  cookies: readCookies,
}));

// Next normally mounts its router and injects the font at compile time.
const navigation = { ...navigationModule };
mock.module("next-vibe/ui/hooks/use-navigation", () => ({
  ...navigation,
  useRouter: () => ({}),
}));
mock.module("next-vibe/ui/components/font", () => ({
  inter: { className: "", variable: "" },
  devanagari: { className: "", variable: "" },
}));

const agentConfig = { ...agentEnvironment };
mock.module("next-vibe/agent/env", () => ({
  ...agentConfig,
  agentPublicFlags: {
    ...agentConfig.agentPublicFlags,
    NEXT_PUBLIC_AGENT_OPEN_ROUTER: true,
  },
}));

const database = { ...databaseModule };
const logQuery = mock();
const db = drizzle.mock({ logger: { logQuery } });
mock.module("next-vibe/database", () => ({
  ...database,
  db,
}));

it("renders marked public documents without a lead or optional database reads", async () => {
  const { AuthRepository } = await import("next-vibe/identity/auth/repository");
  const { NewsletterStatusRepository } =
    await import("@/newsletter/status/repository");
  const { getEnvAvailability } =
    await import("next-vibe/agent/env-availability");
  const { tanstackLoader: loadIndex } =
    await import("@/_pages/story/refusal-index/page");
  const { RootProviders } = await import("@/_pages/layout-shared");
  const { tanstackLoader: loadRoot } = await import("@/_pages/layout");
  const { tanstackLoader: loadLayout } = await import("@/_pages/story/layout");
  const { tanstackLoader: loadStory } = await import("@/_pages/story/page");
  const { tanstackLoader: loadModel, TanstackPage: renderModel } =
    await import("@/_pages/models/[modelId]/page");
  const { loadSkillLandingPage } = await import("@/_pages/skill/[skillId]/loader");
  const locale = defaultLocale;
  const logger = createEndpointLogger(false, locale);
  const page = { platform: Platform.NEXT_PAGE, locale };
  requestHeaders.set(DEGRADED_PUBLIC_DOCUMENT_HEADER, "1");

  for (const cookie of [
    "",
    "invalid",
    "12000000-0000-4000-8000-000000000003",
  ]) {
    const cookies = new Map<string, { value: string }>();
    if (cookie) {
      cookies.set(LEAD_ID_COOKIE_NAME, { value: cookie });
    }
    readCookies.mockReturnValue(cookies);
    const guest = await AuthRepository.getAuthMinimalUser(
      [UserRole.PUBLIC],
      page,
      logger,
    );
    expect(guest.isPublic).toBeTruthy();
    expect(guest.leadId).toBe("");
    expect(guest.roles).toEqual([UserPermissionRole.PUBLIC]);
    expect(
      await NewsletterStatusRepository.getOwnStatus(guest, logger),
    ).toEqual({
      subscribed: false,
      status: NewsletterSubscriptionStatus.UNSUBSCRIBED,
      confirmed: false,
    });
    await expect(
      AuthRepository.getAuthMinimalUser([UserRole.ADMIN], page, logger),
    ).rejects.toThrow("Public user");
  }
  expect(readCookies).not.toHaveBeenCalled();
  expect(await getEnvAvailability()).toMatchObject({
    unbottledSystem: false,
    unbottledForce: false,
  });
  const pageParams = { params: Promise.resolve({ locale }) };
  requestPath = `/${locale}/story`;
  const root = await loadRoot(pageParams);
  expect(root).toMatchObject({
    locale,
    theme: "dark",
    structuredData: { "@graph": expect.any(Array) },
  });
  expect(await loadLayout(pageParams)).toMatchObject({
    locale,
    isHomePage: true,
    hasSubscription: false,
    user: { isPublic: true, leadId: "" },
  });
  const story = await loadStory(pageParams);
  expect(story.hasUser).toBe(false);
  expect(story.authError).toBeUndefined();
  expect(story.totalToolCount).toBeGreaterThan(0);
  requestPath = "/en-US/story/refusal-index";
  expect(await loadIndex({ params: Promise.resolve({ locale }) })).toEqual({
    locale,
    leaderboard: null,
  });
  const modelId = ChatModelId.CLAUDE_OPUS_5_5;
  const slug = toModelSlug(modelId);
  requestPath = `/en-US/models/${slug}`;
  const model = await loadModel({
    params: Promise.resolve({ locale, modelId: slug }),
  });
  expect(model).toMatchObject({
    kind: "chat",
    refusal: null,
    facts: { id: modelId },
  });
  const markup = renderToStaticMarkup(
    RootProviders({ ...root, children: renderModel(model) }),
  );
  expect(markup).toContain(model.facts.name);
  expect(markup).toContain("<h1");
  requestPath = `/${locale}/skill/uncensored`;
  const skill = await loadSkillLandingPage({
    params: Promise.resolve({ locale, skillId: "uncensored" }),
  });
  expect(skill).toMatchObject({
    skillId: "uncensored",
    user: { isPublic: true, leadId: "" },
    skillData: { name: expect.any(String) },
  });
  expect(logQuery).not.toHaveBeenCalled();

  // Other platforms and unmarked pages retain their existing guest identity.
  const existing = {
    isPublic: true,
    leadId: crypto.randomUUID(),
    roles: [UserPermissionRole.PUBLIC],
  } as const;
  for (const platform of [
    Platform.NEXT_API,
    Platform.CLI,
    Platform.NEXT_PAGE,
  ]) {
    if (platform === Platform.NEXT_PAGE) {
      requestHeaders.delete(DEGRADED_PUBLIC_DOCUMENT_HEADER);
    }
    const guest = await AuthRepository.getAuthMinimalUser(
      [UserRole.PUBLIC],
      {
        platform,
        locale,
        jwtPayload: { ...existing, roles: [...existing.roles] },
      },
      logger,
    );
    expect(guest.leadId).toBe(existing.leadId);
  }
  const inference = await import("next-vibe/remote-connection/inference-state");
  const getState = spyOn(
    inference,
    "getInstanceInferenceState",
  ).mockResolvedValue({
    hasSystem: true,
    forceSystem: true,
  });
  expect(await getEnvAvailability()).toMatchObject({
    unbottledSystem: true,
    unbottledForce: true,
  });
  expect(getState).toHaveBeenCalledTimes(1);
  getState.mockRestore();
});

it("resolves verified crawler documents as leadless public users without enabling degraded SSR", async () => {
  const { AuthRepository } = await import("next-vibe/identity/auth/repository");
  const { isDegradedPublicDocument, isVerifiedCrawlerDocument } =
    await import("./public-document.server");
  const locale = defaultLocale;
  const logger = createEndpointLogger(false, locale);
  const page = { platform: Platform.NEXT_PAGE, locale };

  requestHeaders.delete(DEGRADED_PUBLIC_DOCUMENT_HEADER);
  requestHeaders.set(VERIFIED_CRAWLER_HEADER, "1");
  requestPath = `/${locale}/story/refusal-index`;
  logQuery.mockClear();

  expect(await isVerifiedCrawlerDocument()).toBe(true);
  expect(await isDegradedPublicDocument()).toBe(false);

  const guest = await AuthRepository.getAuthMinimalUser(
    [UserRole.PUBLIC],
    page,
    logger,
  );
  expect(guest.isPublic).toBeTruthy();
  expect(guest.leadId).toBe("");
  expect(guest.roles).toEqual([UserPermissionRole.PUBLIC]);
  expect(logQuery).not.toHaveBeenCalled();

  await expect(
    AuthRepository.getAuthMinimalUser([UserRole.ADMIN], page, logger),
  ).rejects.toThrow("Public user");

  requestHeaders.delete(VERIFIED_CRAWLER_HEADER);
});
