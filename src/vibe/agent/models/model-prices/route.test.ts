import { expect, it, mock, spyOn } from "bun:test";
import { applyPatch, parsePatch } from "diff";
import { mkdirSync, mkdtempSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

import { rootlessToolExecutionContext } from "next-vibe/core/execution-context";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import type { LoggerMetadata } from "next-vibe/logger/types";
import { CliInputParser } from "next-vibe/platforms/cli/runtime/parsing";
import { Platform } from "next-vibe/platforms/platforms";

import { agentEnv } from "../../env";
import { ApiProvider } from "../models";
import definition from "./definition";
import { ModelPricesRepository } from "./repository";
import tasks from "./task";

const mediaEnum =
  "  // BEGIN:llm-generated - do not edit manually, updated by price updater\n" +
  "  // END:llm-generated\n";
const sourceFiles: Record<string, string> = {
  "ai-stream/models-definitions.ts": `
export enum ChatModelId {
  GPT_5_3_CODEX = "gpt-53-codex",
}
const models = {
  [ChatModelId.GPT_5_3_CODEX]: {
    inputs: ["text"],
    outputs: ["text"],
  },
};
`,
  "image-generation/models.ts": `
export enum ImageGenModelId {
  FLUX_2_MAX = "flux-2-max",
${mediaEnum}}
const models = {
  [ImageGenModelId.FLUX_2_MAX]: {
    providers: [{
      providerModel: "flux-2-max",
      creditCostPerImage: 24,
    }],
  },
};
`,
  "music-generation/models.ts": `export enum MusicGenModelId {\n${mediaEnum}}\n`,
  "video-generation/models.ts": `export enum VideoGenModelId {\n${mediaEnum}}\n`,
  "text-to-speech/models.ts": "",
  "speech-to-text/models.ts": "",
  "ai-stream/vision-models.generated.ts": "export enum ImageVisionModelId {}\n",
};

const user: JwtPrivatePayloadType = {
  isPublic: false,
  id: "00000000-0000-4000-8000-000000000002",
  leadId: "00000000-0000-4000-8000-000000000001",
  roles: [UserPermissionRole.ADMIN],
};

it("reports a skipped comparison on a keyless instance without contacting providers", async () => {
  const previousEnv = { ...agentEnv };
  const fetchPrices = spyOn(
    ModelPricesRepository,
    "fetchProviderPrices",
  ).mockResolvedValue([]);
  const info = mock((_message: string, ..._metadata: LoggerMetadata[]) => {});
  const logger = { ...createEndpointLogger(false, defaultLocale), info };

  try {
    Object.assign(agentEnv, {
      OPENROUTER_API_KEY: "",
      REPLICATE_API_TOKEN: undefined,
      OPENAI_API_KEY: undefined,
      FAL_AI_API_KEY: undefined,
      ELEVENLABS_API_KEY: undefined,
      DEEPGRAM_API_KEY: undefined,
      EDEN_AI_API_KEY: undefined,
      MODELSLAB_API_KEY: undefined,
      UNCENSORED_AI_API_KEY: undefined,
      FREEDOMGPT_API_KEY: undefined,
      GAB_AI_API_KEY: undefined,
      VENICE_AI_API_KEY: undefined,
      NANO_GPT_API_KEY: undefined,
    });
    const task = tasks.find((candidate) => candidate.type === "cron");
    expect(task).toBeDefined();
    if (!task) {
      return;
    }
    const result = await task.route({
      data: { write: false },
      urlPathParams: {},
      user,
      locale: defaultLocale,
      logger,
      platform: Platform.CRON,
      toolExecutionContext: rootlessToolExecutionContext(),
    });
    expect(result).toEqual({
      success: true,
      data: {
        summary: {
          totalProviders: 0,
          totalModels: 0,
          modelsUpdated: 0,
          fileUpdated: false,
          statusMessage: "Price comparison skipped. Provider API keys are not configured.",
        },
        diff: "",
        providerResults: [],
        updates: [],
        failures: [],
      },
    });
    expect(fetchPrices).not.toHaveBeenCalled();
    expect(info).toHaveBeenCalledWith(
      "Model price comparison skipped (provider API keys not configured)",
    );
  } finally {
    Object.assign(agentEnv, previousEnv);
    fetchPrices.mockRestore();
  }
});

it("reports the scheduled diff and writes that same diff only with the CLI flag", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const originalOpenRouterKey = agentEnv.OPENROUTER_API_KEY;
  const scratchRoot = join(originalCwd, ".tmp");
  const discarded = join(scratchRoot, "todelete", "model-price-refresh-tests");
  mkdirSync(discarded, { recursive: true });
  const checkout = mkdtempSync(join(scratchRoot, "model-price-refresh-"));
  const agentDir = join(checkout, "src/vibe/agent");
  const prices = spyOn(ModelPricesRepository, "fetchProviderPrices").mockResolvedValue([
    {
      provider: "saved catalog",
      modelsFound: 2,
      modelsUpdated: 2,
      updates: [
        {
          modelId: "flux-2-max",
          name: "FLUX.2 Max",
          provider: ApiProvider.MODELSLAB,
          providerModel: "flux-2-max",
          field: "creditCostPerImage",
          value: 25,
          source: "saved-catalog",
        },
        {
          modelId: "gpt-53-codex",
          name: "GPT-5.3 Codex",
          provider: ApiProvider.OPENROUTER,
          field: "inputTokenCost",
          value: 1.5,
          source: "saved-catalog",
        },
      ],
      modalityUpdates: [
        {
          modelId: "gpt-53-codex",
          name: "GPT-5.3 Codex",
          provider: ApiProvider.OPENROUTER,
          enumKey: "GPT_5_3_CODEX",
          inputs: ["text", "image"],
          outputs: ["text", "image", "video", "audio"],
          source: "saved-catalog",
        },
      ],
      failures: [],
    },
  ]);

  const logger = createEndpointLogger(false, defaultLocale);
  const handlerProps = {
    urlPathParams: {},
    user,
    locale: defaultLocale,
    logger,
    toolExecutionContext: rootlessToolExecutionContext(),
  };
  const cliData = async (rawTokens: string[]): Promise<{ write: boolean }> => {
    const { data } = await CliInputParser.collectCliRequestData(
      definition.GET,
      { positionalArgs: [], namedArgs: {}, rawTokens, interactive: false },
      logger,
    );
    return definition.GET.requestSchema.parse(data ?? {});
  };
  const readSource = (): Record<string, string> =>
    Object.fromEntries(
      Object.keys(sourceFiles).map((path) => [path, readFileSync(join(agentDir, path), "utf-8")]),
    );

  try {
    agentEnv.OPENROUTER_API_KEY = "test-key";
    for (const [path, contents] of Object.entries(sourceFiles)) {
      const absolutePath = join(agentDir, path);
      mkdirSync(dirname(absolutePath), { recursive: true });
      writeFileSync(absolutePath, contents);
    }
    process.chdir(checkout);
    process.argv = originalArgv.slice(0, 2);

    const task = tasks.find((candidate) => candidate.type === "cron");
    expect(task?.id).toBe("update-all-model-prices");
    if (!task) {
      return;
    }
    expect(task.taskInput).toEqual({ write: false });

    const scheduled = await task.route({
      ...handlerProps,
      data: definition.GET.requestSchema.parse(task.taskInput),
      platform: Platform.CRON,
    });
    expect(scheduled).toMatchObject({
      success: true,
      data: { summary: { fileUpdated: false } },
    });
    expect(readSource()).toEqual(sourceFiles);

    for (const data of [await cliData([]), { write: true }]) {
      const preview = await task.route({ ...handlerProps, data, platform: Platform.CLI });
      expect(preview).toEqual(scheduled);
      expect(readSource()).toEqual(sourceFiles);
    }

    process.argv = [...process.argv, "update-model-prices", "--write"];
    const cronWithWrite = await task.route({
      ...handlerProps,
      data: { write: true },
      platform: Platform.CRON,
    });
    expect(cronWithWrite).toEqual(scheduled);
    expect(readSource()).toEqual(sourceFiles);

    const written = await task.route({
      ...handlerProps,
      data: await cliData(["--write"]),
      platform: Platform.CLI,
    });
    expect(written).toMatchObject({ success: true, data: { summary: { fileUpdated: true } } });
    if (!("success" in written && written.success && "success" in scheduled && scheduled.success)) {
      return;
    }
    const { diff } = definition.GET.responseSchema.parse(scheduled.data);
    expect(diff).toContain("+      creditCostPerImage: 25,");
    expect(diff).toContain('+  GPT_5_3_CODEX = "gpt-53-codex",');
    expect(definition.GET.responseSchema.parse(written.data).diff).toEqual(diff);

    const patched = { ...sourceFiles };
    const patches = parsePatch(diff);
    expect(patches).toHaveLength(5);
    for (const file of patches) {
      const path = file.oldFileName?.replace(/^src\/vibe\/agent\//, "") ?? "";
      const content = applyPatch(sourceFiles[path], file);
      expect(content).not.toBe(false);
      if (content !== false) {
        patched[path] = content;
      }
    }
    expect(readSource()).toEqual(patched);
  } finally {
    agentEnv.OPENROUTER_API_KEY = originalOpenRouterKey;
    process.argv = originalArgv;
    process.chdir(originalCwd);
    prices.mockRestore();
    renameSync(checkout, join(discarded, basename(checkout)));
  }
});
