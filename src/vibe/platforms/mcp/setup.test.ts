import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";

import * as paths from "@/env/paths";

import { defaultLocale } from "../../core/i18n/core/config";
import { createLogger } from "../../logger/create-logger";
import { install, uninstall } from "./setup";

const logger = createLogger(false, defaultLocale);
const fixtures = join(paths.getProjectRoot(), ".tmp/todelete");

describe("Codex MCP setup", () => {
  let root: string;
  let codexConfig: string;
  let restoreRoot: () => void;

  beforeEach(async () => {
    await mkdir(fixtures, { recursive: true });
    const prefix =
      process.platform === "win32" ? "codex setup " : 'codex setup "quoted" ';
    root = await mkdtemp(join(fixtures, prefix));
    codexConfig = join(root, ".codex/config.toml");
    const projectRoot = spyOn(paths, "getProjectRoot").mockReturnValue(root);
    restoreRoot = (): void => projectRoot.mockRestore();
  });

  afterEach(() => {
    restoreRoot();
  });

  it("renders the same servers as Claude Code with Codex timeouts and tool approval", async () => {
    const result = await install(logger);
    expect(result.failed).toBeUndefined();
    expect(result.changed).toContain(codexConfig);

    const config = await readFile(codexConfig, "utf8");
    const { mcpServers } = JSON.parse(
      await readFile(join(root, ".mcp.json"), "utf8"),
    );
    expect(Bun.TOML.parse(config)).toEqual({
      mcp_servers: {
        atlas: {
          ...mcpServers.atlas,
          startup_timeout_sec: 60,
          tool_timeout_sec: 600,
          default_tools_approval_mode: "approve",
        },
        hermes: {
          ...mcpServers.hermes,
          startup_timeout_sec: 60,
          tool_timeout_sec: 600,
          default_tools_approval_mode: "approve",
        },
      },
    });
    expect(config).toContain("[mcp_servers.atlas]");
    expect(config).toContain('env = { NODE_ENV = "production", PROJECT_ROOT = ');

    expect((await uninstall(logger)).changed).toContain(codexConfig);
    expect(await Bun.file(codexConfig).exists()).toBe(false);
  });

  it("updates the managed block and preserves settings on both sides", async () => {
    const before = '# Project settings\r\nmodel = "example"';
    const after = '\n[mcp_servers.probe]\ncommand = "probe"\n';
    await mkdir(join(root, ".codex"));
    await writeFile(codexConfig, before);

    expect((await install(logger)).failed).toBeUndefined();
    const installed = await readFile(codexConfig, "utf8");
    await writeFile(
      codexConfig,
      installed.replace("startup_timeout_sec = 60", "startup_timeout_sec = 1") +
        after,
    );

    expect((await install(logger)).failed).toBeUndefined();
    expect(await readFile(codexConfig, "utf8")).toBe(installed + after);
    expect((await uninstall(logger)).changed).toContain(codexConfig);
    expect(await readFile(codexConfig, "utf8")).toBe(`${before}\n${after}`);
    expect((await uninstall(logger)).changed).toEqual([]);
  });

  it("leaves a manually defined server intact and reports the conflict", async () => {
    const existing = '[mcp_servers."atlas"]\ncommand = "custom"\n';
    await mkdir(join(root, ".codex"));
    await writeFile(codexConfig, existing);

    const result = await install(logger);
    expect(result.failed).toContain('already defines the MCP server "atlas"');
    expect(result.changed).not.toContain(codexConfig);
    expect((await uninstall(logger)).changed).not.toContain(codexConfig);
    expect(await readFile(codexConfig, "utf8")).toBe(existing);
  });

  it("preserves marker text inside a multiline user setting", async () => {
    const existing = [
      "developer_instructions = '''",
      "# BEGIN next-vibe MCP servers",
      "'''",
    ].join("\n");
    await mkdir(join(root, ".codex"));
    await writeFile(codexConfig, existing);

    expect((await install(logger)).failed).toBeUndefined();
    const generated = await readFile(codexConfig, "utf8");
    expect(generated.startsWith(`${existing}\n`)).toBe(true);
    expect((await install(logger)).failed).toBeUndefined();
    expect(await readFile(codexConfig, "utf8")).toBe(generated);
    expect((await uninstall(logger)).changed).toContain(codexConfig);
    expect(await readFile(codexConfig, "utf8")).toBe(existing);
  });
});
