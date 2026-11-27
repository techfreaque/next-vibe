/**
 * Cheapest-route selection across providers of the same model.
 *
 * A model ("of a kind": one ChatModelId) can be served by several providers
 * (NanoGPT, Venice, OpenUncensored, ...). Every turn must run on the cheapest
 * route whose provider is configured here, so an aggregator that is pricier
 * for a model is skipped and one that is cheaper wins. Route-only providers
 * (OpenUncensored) never become the availability-blind static primary that
 * listed prices and display use. Pure catalogue tests, no network.
 */

import { describe, expect, it } from "bun:test";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type { AgentEnvAvailability } from "../env-availability";
import {
  ApiProvider,
  calculateCreditCost,
  getProviderPrice,
  isApiProviderAvailable,
  type ModelDefinition,
} from "../models/models";
import {
  chatModelDefinitions,
  ChatModelId,
  chatModelOptionsIndex,
  compareRoutesByPrice,
  compareStaticPrimaryRoutes,
  getChatModelForUser,
} from "./models";

type Route = ModelDefinition["providers"][number];

const publicUser: JwtPayloadType = {
  isPublic: true,
  leadId: "00000000-0000-4000-8000-000000000001",
  roles: [UserPermissionRole.PUBLIC],
};

const directOnly: AgentEnvAvailability = {
  openRouter: true,
  claudeCode: false,
  voice: false,
  braveSearch: false,
  kagiSearch: false,
  anySearch: false,
  uncensoredAI: false,
  freedomGPT: false,
  gabAI: false,
  veniceAI: true,
  nanoGPT: true,
  scrappey: false,
  openAiImages: false,
  openAiStt: false,
  replicate: false,
  falAi: false,
  modelsLab: false,
  edenAiStt: false,
  deepgram: false,
  openAiTts: false,
  edenAiTts: false,
  elevenlabs: false,
  unbottledSystem: false,
  unbottledForce: false,
};

const withOpenUncensored: AgentEnvAvailability = {
  ...directOnly,
  openUncensored: true,
};

const modelsWithOpenUncensored = Object.values(ChatModelId).filter((id) =>
  chatModelDefinitions[id]?.providers.some(
    (route) => route.apiProvider === ApiProvider.OPENUNCENSORED,
  ),
);

/** The route a public user must get: cheapest configured, first on ties. */
function expectedRoute(
  id: ChatModelId,
  availability: AgentEnvAvailability,
): Route | undefined {
  return chatModelDefinitions[id]?.providers
    .filter(
      (route) =>
        route.adminOnly !== true &&
        isApiProviderAvailable(route.apiProvider, availability),
    )
    .toSorted(compareRoutesByPrice)[0];
}

function route(
  apiProvider: ApiProvider,
  inputTokenCost: number,
  outputTokenCost: number,
): Route {
  return {
    id: ChatModelId.GLM_5_3_UNCENSORED,
    apiProvider,
    providerModel: `${apiProvider}-model`,
    creditCost: calculateCreditCost,
    inputTokenCost,
    outputTokenCost,
  };
}

describe("cheapest route per model", () => {
  it("has OpenUncensored routes to check", () => {
    expect(modelsWithOpenUncensored.length).toBeGreaterThan(0);
  });

  it("picks the cheapest configured route, OpenUncensored included", () => {
    for (const id of modelsWithOpenUncensored) {
      const expected = expectedRoute(id, withOpenUncensored);
      const picked = getChatModelForUser(id, publicUser, withOpenUncensored);
      expect(`${id} ${picked.apiProvider} ${picked.providerModel}`).toBe(
        `${id} ${expected?.apiProvider ?? ""} ${expected?.providerModel ?? ""}`,
      );
    }
  });

  it("prefers OpenUncensored for GLM 5.3 and DeepSeek V4.1 Flash when configured", () => {
    for (const id of [
      ChatModelId.GLM_5_3_UNCENSORED,
      ChatModelId.VENICE_DEEPSEEK_V4_1_FLASH_UNCENSORED,
    ]) {
      expect(
        getChatModelForUser(id, publicUser, withOpenUncensored).apiProvider,
      ).toBe(ApiProvider.OPENUNCENSORED);
    }
  });

  it("never routes to OpenUncensored without its key", () => {
    for (const id of modelsWithOpenUncensored) {
      const picked = getChatModelForUser(id, publicUser, directOnly);
      expect(picked.apiProvider).not.toBe(ApiProvider.OPENUNCENSORED);
      expect(picked.providerModel).toBe(
        expectedRoute(id, directOnly)?.providerModel ?? "",
      );
    }
  });

  it("static primary (listed price, display) is never a route-only provider", () => {
    for (const id of modelsWithOpenUncensored) {
      expect(chatModelOptionsIndex[id]?.apiProvider).not.toBe(
        ApiProvider.OPENUNCENSORED,
      );
    }
  });
});

describe("route comparators", () => {
  const nano = route(ApiProvider.NANO_GPT, 1.25, 2.25);
  const ouCheaper = route(ApiProvider.OPENUNCENSORED, 0.39, 1.32);
  const ouPricier = route(ApiProvider.OPENUNCENSORED, 2, 4);
  const ouSame = route(ApiProvider.OPENUNCENSORED, 1.25, 2.25);

  it("routing: cheaper aggregator first, pricier aggregator last", () => {
    expect([nano, ouCheaper].toSorted(compareRoutesByPrice)[0]).toBe(
      ouCheaper,
    );
    expect([ouPricier, nano].toSorted(compareRoutesByPrice)[0]).toBe(nano);
    expect(getProviderPrice(ouCheaper)).toBeLessThan(getProviderPrice(nano));
  });

  it("routing: a price tie keeps the definition order", () => {
    expect([nano, ouSame].toSorted(compareRoutesByPrice)[0]).toBe(nano);
  });

  it("static primary: direct routes before route-only, admin-only last", () => {
    const admin = { ...route(ApiProvider.CLAUDE_CODE, 0, 0), adminOnly: true };
    expect(
      [admin, ouCheaper, nano].toSorted(compareStaticPrimaryRoutes),
    ).toEqual([nano, ouCheaper, admin]);
  });
});
