import { afterEach, beforeEach, expect, test } from "bun:test";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { z } from "zod";

import { agentEnv } from "../../env";
import { ApiProvider } from "../../models/models";
import { imageGenModelDefinitions } from "../models";
import { generateImageWithModelsLab, MODELSLAB_IMAGE_MODELS } from "./modelslab";

const API = "https://modelslab.com/api";
const IMAGE = "https://example.com/image.png";
const locale: CountryLanguage = "en-GLOBAL";
const logger = createEndpointLogger(false, locale);
const originalKey = agentEnv.MODELSLAB_API_KEY;
const requestBody = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
);

beforeEach(() => {
  agentEnv.MODELSLAB_API_KEY = "test-key";
});

afterEach(() => {
  agentEnv.MODELSLAB_API_KEY = originalKey;
});

function run(
  providerModel: string,
  responses: Response[],
  options: { aspectRatio?: string; inputMediaUrl?: string } = {},
): {
  result: ReturnType<typeof generateImageWithModelsLab>;
  calls: Array<{ url: string; body: z.infer<typeof requestBody> }>;
} {
  const calls: Array<{ url: string; body: z.infer<typeof requestBody> }> = [];
  const fetchImpl = Object.assign(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      calls.push({
        url: String(input),
        body: requestBody.parse(JSON.parse(String(init?.body))),
      });
      return responses.shift() ?? new Response(null, { status: 500 });
    },
    { preconnect: fetch.preconnect },
  );
  const result = generateImageWithModelsLab({
    providerModel,
    prompt: "a blue cube",
    locale,
    logger,
    fetchImpl,
    ...options,
  });
  return { calls, result };
}

function mockResponse(body: Record<string, z.core.util.JSONType>): Response {
  return Response.json(body, {
    headers: { "x-vibe-fixture-replay": "true" },
  });
}

test("every enabled dedicated ModelsLab image model has an API route", () => {
  for (const model of Object.values(imageGenModelDefinitions)) {
    if (model.enabled === false && model.enabledWithoutPrice !== true) {
      continue;
    }
    for (const provider of model.providers) {
      if (provider.apiProvider === ApiProvider.MODELSLAB) {
        expect(MODELSLAB_IMAGE_MODELS.has(provider.providerModel)).toBe(true);
      }
    }
  }
});

test("keeps documented v6 routes and sends pixel dimensions", async () => {
  const { result, calls } = run(
    "z-image-base",
    [mockResponse({ status: "success", output: [IMAGE] })],
    { aspectRatio: "16:9" },
  );
  expect(await result).toMatchObject({ success: true, data: { imageUrl: IMAGE } });
  expect(calls).toEqual([
    {
      url: `${API}/v6/images/text2img`,
      body: {
        key: "test-key",
        model_id: "z-image-base",
        prompt: "a blue cube",
        samples: 1,
        num_inference_steps: 30,
        width: 1024,
        height: 576,
      },
    },
  ]);
});

test("hosted models send model-specific v7 parameters", async () => {
  const runway = run("gen4_image", [
    mockResponse({ status: "success", output: [IMAGE] }),
  ]);
  const wan = run(
    "wan-2.7-t2i",
    [mockResponse({ status: "success", output: [IMAGE] })],
    { aspectRatio: "16:9" },
  );
  expect((await runway.result).success).toBe(true);
  expect((await wan.result).success).toBe(true);
  expect(runway.calls[0]).toEqual({
    url: `${API}/v7/images/text-to-image`,
    body: {
      key: "test-key",
      model_id: "gen4_image",
      prompt: "a blue cube",
      aspect_ratio: "1:1",
    },
  });
  expect(wan.calls[0]?.body).toEqual({
    key: "test-key",
    model_id: "wan-2.7-t2i",
    prompt: "a blue cube",
  });
});

test("uses Seedream's edit ID and polls the v7 job by ID", async () => {
  const { result, calls } = run(
    "seedream-4.5",
    [
      mockResponse({ status: "processing", id: "job-123" }),
      mockResponse({ status: "processing", id: "job-123" }),
      mockResponse({
        status: "success",
        output: [IMAGE],
        meta: { model_id: "seedream-4.5-i2i" },
      }),
    ],
    { inputMediaUrl: IMAGE, aspectRatio: "16:9" },
  );
  expect(await result).toMatchObject({ success: true, data: { imageUrl: IMAGE } });
  expect(calls).toEqual([
    {
      url: `${API}/v7/images/image-to-image`,
      body: {
        key: "test-key",
        model_id: "seedream-4.5-i2i",
        prompt: "a blue cube",
        init_image: [IMAGE],
        aspect_ratio: "16:9",
      },
    },
    { url: `${API}/v7/images/fetch/job-123`, body: { key: "test-key" } },
    { url: `${API}/v7/images/fetch/job-123`, body: { key: "test-key" } },
  ]);
});

test("uploads inline references before selecting the Gemini 3.1 edit route", async () => {
  const inputMediaUrl = "data:image/png;base64,AAAA";
  const { result, calls } = run(
    "gemini-3.1-t2i",
    [
      mockResponse({ status: "success", output: [IMAGE] }),
      mockResponse({ status: "success", proxy_links: IMAGE }),
    ],
    { inputMediaUrl },
  );
  expect((await result).success).toBe(true);
  expect(calls).toEqual([
    {
      url: `${API}/v6/base64_to_url`,
      body: { key: "test-key", base64_string: inputMediaUrl },
    },
    {
      url: `${API}/v7/images/image-to-image`,
      body: {
        key: "test-key",
        model_id: "gemini-3.1-i2i",
        prompt: "a blue cube",
        init_image: [IMAGE],
        aspect_ratio: "1:1",
        resolution: "1K",
      },
    },
  ]);
});

test("does not start an edit if the reference upload fails", async () => {
  const { result, calls } = run(
    "nano-banana-pro",
    [mockResponse({ status: "error" })],
    { inputMediaUrl: "data:image/png;base64,AAAA" },
  );
  expect((await result).success).toBe(false);
  expect(calls).toHaveLength(1);
});

test("stops when a v6 job reports terminal failure", async () => {
  const { result, calls } = run("z-image-base", [
    mockResponse({ status: "processing", id: 123 }),
    mockResponse({ status: "failed" }),
  ]);
  expect((await result).success).toBe(false);
  expect(calls[0]?.body).toMatchObject({ width: 1024, height: 1024 });
  expect(calls.map(({ url }) => url)).toEqual([
    `${API}/v6/images/text2img`,
    `${API}/v6/images/fetch/123`,
  ]);
});

test("continues a v6 job when the polling response has a string output", async () => {
  const { result, calls } = run("z-image-base", [
    mockResponse({ status: "processing", id: 123, output: [] }),
    mockResponse({ status: "processing", message: "Try Again", output: "" }),
    mockResponse({ status: "success", output: IMAGE }),
  ]);
  expect(await result).toMatchObject({
    success: true,
    data: { imageUrl: IMAGE },
  });
  expect(calls.map(({ url }) => url)).toEqual([
    `${API}/v6/images/text2img`,
    `${API}/v6/images/fetch/123`,
    `${API}/v6/images/fetch/123`,
  ]);
});

test("rejects success for a reported model different from the requested model", async () => {
  const { result } = run("gen4_image", [
    mockResponse({
      status: "success",
      output: [IMAGE],
      meta: { model_id: "some-default" },
    }),
  ]);
  expect((await result).success).toBe(false);
});

test("rejects unknown models and unsupported reference modes before starting a job", async () => {
  const unknown = run("some-model", []);
  const unsupportedReference = run("gen4_image", [], { inputMediaUrl: IMAGE });
  expect((await unknown.result).success).toBe(false);
  expect((await unsupportedReference.result).success).toBe(false);
  expect(unknown.calls).toHaveLength(0);
  expect(unsupportedReference.calls).toHaveLength(0);
});
