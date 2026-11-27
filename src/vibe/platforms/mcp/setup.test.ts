import { mkdir, mkdtemp, readdir, readFile, writeFile } from "node:fs/promises";
import * as os from "node:os";
import { dirname, join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";

import * as paths from "@/env/paths";

import { defaultLocale } from "../../core/i18n/core/config";
import { createLogger } from "../../logger/create-logger";
import { install, uninstall } from "./setup";

const logger = createLogger(false, defaultLocale);
const fixtures = join(paths.getProjectRoot(), ".tmp/todelete");

describe("Project MCP setup", () => {
  let root: string;
  let codexConfig: string;
  let antigravityConfig: string;
  let restoreRoot: () => void;

  beforeEach(async () => {
    await mkdir(fixtures, { recursive: true });
    const prefix = process.platform === "win32" ? "codex setup " : 'codex setup "quoted" ';
    root = await mkdtemp(join(fixtures, prefix));
    codexConfig = join(root, ".codex/config.toml");
    const home = join(root, "home");
    antigravityConfig = join(home, ".gemini/config/mcp_config.json");
    const projectRoot = spyOn(paths, "getProjectRoot").mockReturnValue(root);
    const homeDirectory = spyOn(os, "homedir").mockReturnValue(home);
    restoreRoot = (): void => {
      projectRoot.mockRestore();
      homeDirectory.mockRestore();
    };
  });

  afterEach(() => {
    restoreRoot();
  });

  it("renders the same servers as Claude Code with Codex timeouts and tool approval", async () => {
    const result = await install(logger);
    expect(result.failed).toBeUndefined();
    expect(result.changed).toContain(codexConfig);

    const config = await readFile(codexConfig, "utf8");
    const { mcpServers } = JSON.parse(await readFile(join(root, ".mcp.json"), "utf8"));
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
      installed.replace("startup_timeout_sec = 60", "startup_timeout_sec = 1") + after,
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
    const existing = ["developer_instructions = '''", "# BEGIN next-vibe MCP servers", "'''"].join(
      "\n",
    );
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

  it("merges Antigravity servers, backs up the existing config and preserves custom entries", async () => {
    const path = antigravityConfig;
    const directory = dirname(path);
    const custom = {
      mcpServers: { custom: { command: "probe", args: ["an argument"] } },
      setting: true,
    };
    const existing = JSON.stringify(custom);
    await mkdir(directory, { recursive: true });
    await writeFile(path, existing);

    const installed = await install(logger);
    expect(installed.failed).toBeUndefined();
    expect(installed.changed).toContain(path);
    const { mcpServers } = JSON.parse(await readFile(join(root, ".mcp.json"), "utf8"));
    const generated = await readFile(path, "utf8");
    expect(JSON.parse(generated)).toEqual({
      ...custom,
      mcpServers: { ...custom.mcpServers, ...mcpServers },
    });
    const backup = (await readdir(directory)).find((file) => file.endsWith(".bak"));
    expect(backup).toBeDefined();
    if (backup) {
      expect(await readFile(join(directory, backup), "utf8")).toBe(existing);
    }

    expect((await install(logger)).changed).not.toContain(path);
    expect(await readFile(path, "utf8")).toBe(generated);
    expect((await readdir(directory)).filter((name) => name.endsWith(".bak"))).toHaveLength(1);
    expect((await uninstall(logger)).changed).toContain(path);
    expect(JSON.parse(await readFile(path, "utf8"))).toEqual(custom);
  });

  it("leaves malformed Antigravity config intact and reports the path", async () => {
    const path = antigravityConfig;
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, "{");

    const result = await install(logger);
    expect(result.failed).toContain(".gemini/config/mcp_config.json");
    expect(result.changed).not.toContain(path);
    expect(await readFile(path, "utf8")).toBe("{");
  });
});
