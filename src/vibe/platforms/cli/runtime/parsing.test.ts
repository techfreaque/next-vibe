import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "bun:test";
import { Command } from "commander";

import creditsHistory from "@/credits/history/definition";
import referrals from "@/subscription/admin/referrals/definition";

import { ChatModelId } from "../../../agent/ai-stream/models";
import { ModelSelectionType } from "../../../agent/skills/enum";
import favoriteCreate from "../../../agent/skills/favorites/create/definition";
import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import { defaultLocale } from "../../../core/i18n/core/config";
import { createEndpointLogger } from "../../../logger/server";
import { resolveInputPath } from "./input-path";
import { CliInputParser } from "./parsing";

function parseRemoteFlag(args: string[]): { remote: string; command?: string } {
  const program = new Command()
    .option("--hermes")
    .option("--remote [instanceId]")
    .argument("[command]")
    .argument("[args...]")
    .allowUnknownOption();
  program.parse(
    CliInputParser.normalizeRemoteFlag(args, (arg) => arg === "user-update"),
    { from: "user" },
  );
  return {
    remote: program.opts<{ remote: string }>().remote,
    command: program.args[0],
  };
}

function collect(
  rawTokens: string[],
  endpoint: CreateApiEndpointAny | null = creditsHistory.GET,
): ReturnType<typeof CliInputParser.collectCliRequestData> {
  return CliInputParser.collectCliRequestData(
    endpoint,
    { positionalArgs: [], namedArgs: {}, rawTokens, interactive: false },
    createEndpointLogger(false, defaultLocale),
  );
}

describe("CliInputParser.normalizeRemoteFlag", () => {
  it("preserves the command after bare --remote", () => {
    expect(
      parseRemoteFlag(["--hermes", "--remote", "user-update", "--id=demo"]),
    ).toEqual({
      remote: "thea",
      command: "user-update",
    });
  });

  it("accepts explicit labels with equals or a space", () => {
    expect(parseRemoteFlag(["--remote=user-update", "user-update"])).toEqual({
      remote: "user-update",
      command: "user-update",
    });
    expect(parseRemoteFlag(["--remote", "peer", "user-update"])).toEqual({
      remote: "peer",
      command: "user-update",
    });
  });

  it("leaves literals after -- unchanged", () => {
    const args = ["user-update", "--", "--remote", "user-update"];
    expect(CliInputParser.normalizeRemoteFlag(args, () => true)).toEqual(args);
  });
});

describe("CliInputParser.parseCliArgumentsSimple", () => {
  it("keeps everything after -- positional, flags included", () => {
    const parsed = CliInputParser.parseCliArgumentsSimple([
      "--name",
      "x",
      "--",
      "git",
      "--version",
    ]);
    expect(parsed.positionalArgs).toEqual(["git", "--version"]);
    expect(parsed.namedArgs).toEqual({ name: "x" });
  });

  it("parses numbers and booleans when the endpoint is unknown", () => {
    const parsed = CliInputParser.parseCliArgumentsSimple([
      "--count=3",
      "--flag=true",
    ]);
    expect(parsed.namedArgs).toEqual({ count: 3, flag: true });
  });
});

describe("CliInputParser.collectCliRequestData", () => {
  it("materializes the omitted pagination group from the endpoint defaults", async () => {
    expect((await collect([])).data?.paginationInfo).toEqual({
      page: 1,
      limit: 50,
    });
    expect((await collect([], referrals.GET)).data?.paginationInfo).toEqual({
      page: 1,
      limit: 20,
    });
  });

  it("produces structured favorite fields for remote dispatch and retains JSON in a text field", async () => {
    const selection = {
      selectionType: ModelSelectionType.MANUAL,
      manualModelId: ChatModelId.GPT_6_2_SOL,
    };
    const tools = [{ toolId: "favorite-get", requiresConfirmation: false }];
    const rawName = '{"name":"literal text"}';
    const result = await collect(
      [
        "--skillId=fixture",
        `--modelSelection=${JSON.stringify(selection)}`,
        `--available-tools=${JSON.stringify(tools)}`,
        "--pinnedTools=[]",
        `--customVariantName=${rawName}`,
      ],
      favoriteCreate.POST,
    );
    expect(
      favoriteCreate.POST.requestSchema.safeParse(result.data).success,
    ).toBe(true);
    expect(result.data).toMatchObject({
      modelSelection: selection,
      availableTools: tools,
      pinnedTools: [],
      customVariantName: rawName,
    });
  });

  it("parses JSON array and object flags without a local definition", async () => {
    const { data } = await collect(
      [
        '--filters=["active"]',
        "--pagination-info",
        '{"page":2,"limit":10}',
        '--invalid=["active",]',
      ],
      null,
    );
    expect(data).toEqual({
      filters: ["active"],
      paginationInfo: { page: 2, limit: 10 },
      invalid: '["active",]',
    });
  });

  it("accepts JSON objects at indexed array paths", async () => {
    const { data } = await collect(
      [
        "--skillId=fixture",
        '--available-tools.0={"toolId":"favorite-get","requiresConfirmation":false}',
      ],
      favoriteCreate.POST,
    );
    expect(
      favoriteCreate.POST.requestSchema.parse(data).availableTools,
    ).toEqual([{ toolId: "favorite-get", requiresConfirmation: false }]);
  });

  it("turns contiguous indexed flags into tool arrays and rejects sparse indices", async () => {
    const { data } = await collect(
      [
        "--skillId=fixture",
        "--pinnedTools.1.toolId=favorite-update",
        "--pinnedTools.0.toolId=favorite-get",
        "--pinnedTools.0.requiresConfirmation=true",
      ],
      favoriteCreate.POST,
    );
    expect(favoriteCreate.POST.requestSchema.parse(data).pinnedTools).toEqual([
      { toolId: "favorite-get", requiresConfirmation: true },
      { toolId: "favorite-update", requiresConfirmation: false },
    ]);
    const sparse = await collect(
      ["--skillId=fixture", "--availableTools.9.toolId=favorite-get"],
      favoriteCreate.POST,
    );
    expect(
      favoriteCreate.POST.requestSchema.safeParse(sparse.data).success,
    ).toBe(false);
  });

  it("preserves dotted and JSON pagination overrides", async () => {
    const dotted = await collect(["--paginationInfo.page=3"]);
    expect(
      creditsHistory.GET.requestSchema.parse(dotted.data).paginationInfo,
    ).toEqual({
      page: 3,
      limit: 50,
    });
    const json = await collect(['--paginationInfo={"page":4,"limit":10}']);
    expect(json.data?.paginationInfo).toEqual({ page: 4, limit: 10 });
  });
});

describe("resolveInputPath", () => {
  it("falls back to the invocation directory for a relative file", () => {
    const invocation = mkdtempSync(join(tmpdir(), "vibe-invocation-"));
    const root = mkdtempSync(join(tmpdir(), "vibe-root-"));
    writeFileSync(join(invocation, "note.txt"), "hi");
    expect(resolveInputPath("note.txt", invocation, root)).toBe(
      join(invocation, "note.txt"),
    );
  });

  it("prefers the project root when the file exists there", () => {
    const invocation = mkdtempSync(join(tmpdir(), "vibe-invocation-"));
    const root = mkdtempSync(join(tmpdir(), "vibe-root-"));
    writeFileSync(join(root, "note.txt"), "hi");
    writeFileSync(join(invocation, "note.txt"), "other");
    expect(resolveInputPath("note.txt", invocation, root)).toBe(
      join(root, "note.txt"),
    );
  });

  it("names the project-root path when the file exists nowhere", () => {
    const invocation = mkdtempSync(join(tmpdir(), "vibe-invocation-"));
    const root = mkdtempSync(join(tmpdir(), "vibe-root-"));
    expect(resolveInputPath("missing.txt", invocation, root)).toBe(
      join(root, "missing.txt"),
    );
  });
});
