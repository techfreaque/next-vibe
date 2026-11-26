/**
 * OpenUncensored prices come from the per-model host list: the cheapest
 * ONLINE host that supports tool calls, never the model-level minimum (which
 * includes offline hosts). Host data shape captured live on 2026-11-26.
 */

import { describe, expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { chatModelDefinitions } from "../../../ai-stream/models";
import { ApiProvider } from "../../models";
import {
  cheapestServingHost,
  OpenUncensoredPriceFetcher,
} from "./openuncensored";

const HOSTS = [
  {
    name: "heabsy",
    status: "online",
    supports_tools: true,
    pricing: {
      input_per_mtok: 0.2,
      output_per_mtok: 0.8001,
      cache_read_per_mtok: 0.0641,
      known: true,
    },
  },
  {
    // Cheapest, but offline: must not set the price.
    name: "refuseless",
    status: "offline",
    supports_tools: true,
    pricing: {
      input_per_mtok: 0.12,
      output_per_mtok: 0.5,
      cache_read_per_mtok: 0.025,
      known: true,
    },
  },
  {
    // Cheaper than heabsy, but no tool calls: a chat turn cannot use it.
    name: "nanogpt",
    status: "online",
    supports_tools: false,
    pricing: { input_per_mtok: 0.1, output_per_mtok: 0.4, known: true },
  },
  {
    name: "uncensuredai",
    status: "online",
    supports_tools: true,
    pricing: {
      input_per_mtok: 0.22,
      output_per_mtok: 0.8,
      cache_read_per_mtok: 0.08,
      known: true,
    },
  },
];

/** fetch stub: a handler with fetch's preconnect, as typeof fetch requires. */
function stubFetch(
  respond: (input: RequestInfo | URL) => Response,
): typeof globalThis.fetch {
  const handler = (input: RequestInfo | URL): Promise<Response> =>
    Promise.resolve(respond(input));
  return Object.assign(handler, { preconnect: fetch.preconnect });
}

const ouProviderModels = Object.values(chatModelDefinitions).flatMap((def) =>
  def.providers
    .filter((route) => route.apiProvider === ApiProvider.OPENUNCENSORED)
    .map((route) => route.providerModel),
);

describe("cheapestServingHost", () => {
  it("skips offline and tool-less hosts", () => {
    expect(cheapestServingHost(HOSTS)).toEqual({
      name: "heabsy",
      input: 0.2,
      output: 0.8001,
      cacheRead: 0.0641,
    });
  });

  it("none when no host can serve a tool-calling turn", () => {
    expect(
      cheapestServingHost(HOSTS.filter((host) => host.name === "refuseless")),
    ).toBeUndefined();
  });
});

describe("OpenUncensoredPriceFetcher", () => {
  it("prices every OpenUncensored route from its serving host", async () => {
    expect(ouProviderModels.length).toBeGreaterThan(0);
    const fetchMock = spyOn(globalThis, "fetch").mockImplementation(
      stubFetch((input) =>
        Response.json({
          id: decodeURIComponent(String(input).split("/").pop() ?? ""),
          available: true,
          context_length: 1048576,
          tags: [],
          providers: [...HOSTS, "not-a-host"],
        }),
      ),
    );
    try {
      const result = await new OpenUncensoredPriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      expect(result.error).toBeUndefined();
      expect(result.failures).toEqual([]);
      for (const providerModel of ouProviderModels) {
        const fields = Object.fromEntries(
          result.updates
            .filter((update) => update.providerModel === providerModel)
            .map((update) => [update.field, update.value]),
        );
        expect(fields).toMatchObject({
          inputTokenCost: 0.2,
          outputTokenCost: 0.8001,
          cacheReadTokenCost: 0.0641,
        });
      }
    } finally {
      fetchMock.mockRestore();
    }
  });

  it("reports a failure (no price) when every host is offline", async () => {
    const fetchMock = spyOn(globalThis, "fetch").mockImplementation(
      stubFetch((input) =>
        Response.json({
          id: String(input).split("/").pop(),
          available: true,
          providers: HOSTS.map((host) => ({ ...host, status: "offline" })),
        }),
      ),
    );
    try {
      const result = await new OpenUncensoredPriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      expect(result.updates).toEqual([]);
      expect(result.error).toContain("no online host");
    } finally {
      fetchMock.mockRestore();
    }
  });
});
