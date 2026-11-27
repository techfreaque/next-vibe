/**
 * MCP setup — writes and removes the per-editor MCP config files.
 *
 * Self-contained on purpose: everything this setup needs lives in this file and
 * `mcp.template.json` beside it. Discovered by the `setup-index` generator and
 * run by the setup command in core/setup. See docs/patterns/setup.md.
 *
 * `mcp.template.json` is the single source of truth for which MCP servers this
 * project exposes. Editors disagree on where that file lives and what it looks
 * like, so the template is written once in Claude Code's shape and rewritten per
 * editor here.
 */

import "server-only";

import { randomUUID } from "node:crypto";
import { existsSync, promises as fs } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";

import chalk from "chalk";
import { parseTOML } from "confbox/toml";
import { z } from "zod";

import { getProjectRoot } from "@/env/paths";

import { coreEnv, getRuntimeInvocation } from "../../core/env";
import type { SetupResult } from "../../core/setup/types";
import { type WidgetData, WidgetDataSchema } from "../../core/utils/json";
import { parseError } from "../../core/utils/parse-error";
import type { EndpointLogger } from "../../logger/types";

/**
 * The template, resolved beside this module rather than at the project root.
 *
 * It declares which MCP servers *this platform* exposes, so it belongs to the
 * platform — not to whatever repo vendors it. Resolving it from here also means
 * the vendoring depth never has to be known, the same way `binary.ts` finds
 * `vibe-runtime.ts`.
 */
const MCP_TEMPLATE_FILENAME = "mcp.template.json";
const MCP_TEMPLATE_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  MCP_TEMPLATE_FILENAME,
);

/** Replaced with the project root, POSIX-separated. */
const PROJECT_PATH_PLACEHOLDER = "{{PROJECT_PATH}}";

/**
 * Replaced with the runtime executable. Expands to a command *and* any leading
 * args (`npx` → `npx tsx`), so it is only meaningful as a whole `command` value.
 */
const PACKAGE_MANAGER_EXECUTABLE_PLACEHOLDER = "{{PACKAGE_MANAGER_EXECUTABLE}}";

/** Replaced with the runtime's preload flag: `--preload` (bun) or `--import` (tsx). */
const PRELOAD_FLAG_PLACEHOLDER = "{{PRELOAD_FLAG}}";

const mcpStdioServerSchema = z.object({
  command: z.string().min(1),
  args: z.array(z.string()).optional(),
  env: z.record(z.string(), z.string()).optional(),
});

const mcpTemplateSchema = z.object({
  mcpServers: z.record(z.string(), mcpStdioServerSchema),
});

type McpTemplate = z.infer<typeof mcpTemplateSchema>;

const sharedJsonSchema = z
  .object({ mcpServers: z.record(z.string(), WidgetDataSchema).optional() })
  .catchall(WidgetDataSchema);

const CODEX_BLOCK_START = "# BEGIN next-vibe MCP servers";
const CODEX_BLOCK_END = "# END next-vibe MCP servers";
const CODEX_BLOCK = new RegExp(
  `(^|\\r?\\n)(?=(${CODEX_BLOCK_START}\\r?\\n[\\s\\S]*?^${CODEX_BLOCK_END}(?:\\r?\\n|$)))`,
  "gm",
);

function tomlString(value: string): string {
  // TOML basic strings use the same escapes as JSON, and also require DEL to be escaped.
  return JSON.stringify(value).replaceAll(String.fromCharCode(127), "\\u007F");
}

function tomlKey(key: string): string {
  return /^[\w-]+$/.test(key) ? key : tomlString(key);
}

function renderCodexConfig(template: McpTemplate): string {
  const tables = Object.entries(template.mcpServers).map(([name, server]) => {
    const args = (server.args ?? []).map(tomlString);
    const env = Object.entries(server.env ?? {}).map(
      ([key, value]) => `${tomlKey(key)} = ${tomlString(value)}`,
    );
    return [
      `[mcp_servers.${tomlKey(name)}]`,
      `command = ${tomlString(server.command)}`,
      `args = [${args.join(", ")}]`,
      `env = {${env.length > 0 ? ` ${env.join(", ")} ` : ""}}`,
      "startup_timeout_sec = 60",
      "tool_timeout_sec = 600",
      'default_tools_approval_mode = "approve"',
    ].join("\n");
  });
  return `${CODEX_BLOCK_START}\n${tables.join("\n\n")}\n${CODEX_BLOCK_END}\n`;
}

/**
 * Codex shares its MCP tables with other project settings. Setup owns only the
 * marked block. Keep everything outside it verbatim and replace it in place.
 */
function updateCodexConfig(existing: string, block: string): string {
  const match = [...existing.matchAll(CODEX_BLOCK)].find(({ index }) => {
    try {
      // A marker inside a multiline value has an incomplete TOML prefix.
      parseTOML(existing.slice(0, index));
      return true;
    } catch {
      return false;
    }
  });
  if (!match) {
    return existing && block ? `${existing}\n${block}` : existing + block;
  }
  const before = existing.slice(0, match.index);
  const after = existing.slice(match.index + match[1].length + match[2].length);
  const separator =
    block || (before && after && !before.endsWith("\n")) ? match[1] : "";
  return before + separator + block + after;
}

function mergeCodexConfig(
  existing: string,
  block: string,
  template: McpTemplate,
): { content: string } | { failed: string } {
  try {
    const userConfig = parseTOML<{ mcp_servers?: WidgetData }>(
      updateCodexConfig(existing, ""),
    );
    const servers = userConfig.mcp_servers;
    if (servers && typeof servers === "object") {
      const conflict = Object.keys(template.mcpServers).find((name) =>
        Object.hasOwn(servers, name),
      );
      if (conflict !== undefined) {
        return {
          failed: `The Codex config already defines the MCP server "${conflict}" outside the next-vibe block.`,
        };
      }
    }
    const content = updateCodexConfig(existing, block);
    parseTOML(content);
    return { content };
  } catch {
    return {
      failed:
        "The Codex config could not be merged as TOML. Check .codex/config.toml.",
    };
  }
}

/**
 * Where each editor reads MCP config, and in what shape.
 *
 * VS Code uses the top-level `servers` key and an explicit `type` discriminator.
 * Codex reads TOML and shares the file with other project settings.
 *
 * Windsurf is absent deliberately: it reads user-level config only
 * (`~/.codeium/windsurf/mcp_config.json`) and has no project-scoped file to
 * write. Zed is absent because its project-level support is unconfirmed.
 */
type McpTarget = {
  readonly path: string;
  readonly editor: string;
} & (
  | {
      readonly format?: "json";
      readonly render: (template: McpTemplate) => WidgetData;
    }
  | {
      readonly format: "toml";
      readonly render: (template: McpTemplate) => string;
    }
  | {
      readonly format: "user-json";
      readonly render: (template: McpTemplate) => McpTemplate;
    }
);

const MCP_TARGETS: readonly McpTarget[] = [
  { path: ".mcp.json", editor: "Claude Code", render: (template) => template },
  {
    path: ".cursor/mcp.json",
    editor: "Cursor",
    render: (template) => template,
  },
  {
    path: ".vscode/mcp.json",
    editor: "VS Code / Copilot",
    render: (template) => ({
      servers: Object.fromEntries(
        Object.entries(template.mcpServers).map(([name, server]) => [
          name,
          { type: "stdio", ...server },
        ]),
      ),
    }),
  },
  {
    path: "opencode.json",
    editor: "OpenCode",
    render: (template) => ({
      $schema: "https://opencode.ai/config.json",
      mcp: Object.fromEntries(
        Object.entries(template.mcpServers).map(([name, server]) => {
          const { command, args = [], env, ...rest } = server;
          return [
            name,
            {
              type: "local",
              command: [command, ...args],
              ...(env !== undefined ? { environment: env } : {}),
              ...rest,
            },
          ];
        }),
      ),
    }),
  },
  {
    path: ".codex/config.toml",
    editor: "Codex",
    format: "toml",
    render: renderCodexConfig,
  },
  {
    path: ".gemini/config/mcp_config.json",
    editor: "Antigravity",
    format: "user-json",
    render: (template) => template,
  },
];

/**
 * Resolved template, or the reason it could not be. Returned rather than thrown:
 * `no-throw` bans `throw` here, and the setup contract expects a
 * `failed` message anyway. See core/setup/types.
 */
type TemplateResult =
  | { readonly ok: true; readonly template: McpTemplate }
  | { readonly ok: false; readonly failed: string };

/**
 * JSON needs no escaping of Windows separators once they are POSIX, and every
 * MCP client accepts forward slashes on Windows.
 */
function toPosixPath(value: string): string {
  return value.replaceAll("\\", "/");
}

/** Substitute placeholders in every string of a parsed template. */
function substitute<T>(value: T, replacements: Record<string, string>): T {
  if (typeof value === "string") {
    let result: string = value;
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      result = result.replaceAll(placeholder, replacement);
    }
    return result as T;
  }
  if (Array.isArray(value)) {
    return value.map((item: WidgetData) => substitute(item, replacements)) as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        substitute(item, replacements),
      ]),
    ) as T;
  }
  return value;
}

/**
 * Expand `{{PRELOAD_FLAG}}` and reformat the module path that follows it.
 *
 * The two runtimes disagree on more than the flag name: node's `--import` takes
 * a URL, so a Windows absolute path is rejected outright (`C:` reads as a URL
 * scheme). bun's `--preload` takes a plain path and no URL. The path therefore
 * cannot be baked into the template — only the flag knows which form it needs,
 * which is why the argument right after it is rewritten here.
 */
function applyPreload(
  args: readonly string[],
  runtime: ReturnType<typeof getRuntimeInvocation>,
): string[] {
  const resolved: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== PRELOAD_FLAG_PLACEHOLDER) {
      resolved.push(args[i]);
      continue;
    }
    resolved.push(runtime.preloadFlag);
    const modulePath = args[i + 1];
    if (modulePath !== undefined) {
      resolved.push(
        runtime.preloadNeedsUrl ? pathToFileURL(modulePath).href : modulePath,
      );
      i++;
    }
  }
  return resolved;
}

/**
 * Resolve one server's runtime: the executable placeholder expands to a command
 * plus leading args, so it is spliced rather than substituted in place.
 */
function applyRuntime(
  server: z.infer<typeof mcpStdioServerSchema>,
  runtime: ReturnType<typeof getRuntimeInvocation>,
): z.infer<typeof mcpStdioServerSchema> {
  const args = applyPreload(server.args ?? [], runtime);
  if (server.command !== PACKAGE_MANAGER_EXECUTABLE_PLACEHOLDER) {
    return { ...server, args };
  }
  return {
    ...server,
    command: runtime.command,
    args: [...runtime.argsPrefix, ...args],
  };
}

/**
 * Read `mcp.template.json` and resolve its placeholders.
 *
 * Parses before substituting so an interpolated value can never produce
 * malformed JSON, and validates the shape so a typo in the template surfaces
 * here rather than as an editor that silently starts no servers.
 */
async function resolveMcpTemplate(): Promise<TemplateResult> {
  const projectRoot = getProjectRoot();
  if (!existsSync(MCP_TEMPLATE_PATH)) {
    return {
      ok: false,
      failed: `No ${MCP_TEMPLATE_FILENAME} at ${MCP_TEMPLATE_PATH}. This file defines the MCP servers this platform exposes and is required to generate editor configs.`,
    };
  }

  let parsed: WidgetData;
  try {
    parsed = JSON.parse(await fs.readFile(MCP_TEMPLATE_PATH, "utf8"));
  } catch (error) {
    return {
      ok: false,
      failed: `${MCP_TEMPLATE_FILENAME} is not valid JSON: ${parseError(error).message}`,
    };
  }

  const validated = mcpTemplateSchema.safeParse(parsed);
  if (!validated.success) {
    return {
      ok: false,
      failed: `${MCP_TEMPLATE_FILENAME} has an unexpected shape: ${validated.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ")}`,
    };
  }

  // Only PROJECT_PATH is a plain text substitution. The preload flag and its
  // module path are resolved together in applyRuntime, which needs them adjacent.
  const runtime = getRuntimeInvocation(coreEnv.PACKAGE_MANAGER, projectRoot);
  const substituted = substitute(validated.data, {
    [PROJECT_PATH_PLACEHOLDER]: toPosixPath(projectRoot),
  });

  return {
    ok: true,
    template: {
      mcpServers: Object.fromEntries(
        Object.entries(substituted.mcpServers).map(([name, server]) => [
          name,
          applyRuntime(server, runtime),
        ]),
      ),
    },
  };
}

async function updateSharedJson(
  destination: string,
  template: McpTemplate,
  operation: "install" | "uninstall",
): Promise<{ changed: boolean; failed?: string }> {
  const existing = existsSync(destination)
    ? await fs.readFile(destination, "utf8")
    : undefined;
  let parsed: ReturnType<typeof sharedJsonSchema.safeParse>;
  try {
    parsed = sharedJsonSchema.safeParse(
      existing?.trim() ? JSON.parse(existing) : {},
    );
  } catch {
    return { changed: false, failed: "Expected valid JSON." };
  }
  if (!parsed.success) {
    return { changed: false, failed: "Expected an MCP server map." };
  }
  const config = parsed.data;
  const servers = { ...config.mcpServers };
  for (const [name, server] of Object.entries(template.mcpServers)) {
    if (operation === "install") {
      servers[name] = server;
    } else if (isDeepStrictEqual(servers[name], server)) {
      // A server edited after setup now belongs to the user.
      delete servers[name];
    }
  }
  if (isDeepStrictEqual(config.mcpServers ?? {}, servers)) {
    return { changed: false };
  }

  const revision = randomUUID();
  if (existing !== undefined) {
    await fs.writeFile(`${destination}.${revision}.bak`, existing, {
      flag: "wx",
      mode: 0o600,
    });
  }
  const temporary = `${destination}.${revision}.tmp`;
  await fs.writeFile(
    temporary,
    `${JSON.stringify({ ...config, mcpServers: servers }, null, 2)}\n`,
    { flag: "wx", mode: 0o600 },
  );
  await fs.rename(temporary, destination);
  return { changed: true };
}

/** Write generated configs and merge the shared Codex and Antigravity files. */
async function writeMcpConfigs(): Promise<{
  changed: string[];
  failed?: string;
}> {
  const resolved = await resolveMcpTemplate();
  if (!resolved.ok) {
    return { changed: [], failed: resolved.failed };
  }
  const projectRoot = getProjectRoot();
  const writtenPaths: string[] = [];
  for (const target of MCP_TARGETS) {
    const destination = join(
      target.format === "user-json" ? homedir() : projectRoot,
      target.path,
    );
    try {
      // On Bun, recursive mkdir can fail with EEXIST for an existing directory.
      const directory = dirname(destination);
      if (!existsSync(directory)) {
        await fs.mkdir(directory, { recursive: true });
      }
      if (target.format === "toml") {
        const existing = existsSync(destination)
          ? await fs.readFile(destination, "utf8")
          : "";
        const merged = mergeCodexConfig(
          existing,
          target.render(resolved.template),
          resolved.template,
        );
        if ("failed" in merged) {
          return { changed: writtenPaths, failed: merged.failed };
        }
        await fs.writeFile(destination, merged.content, "utf8");
      } else if (target.format === "user-json") {
        const result = await updateSharedJson(
          destination,
          target.render(resolved.template),
          "install",
        );
        if (result.failed !== undefined) {
          return {
            changed: writtenPaths,
            failed: `Could not write ${target.path}: ${result.failed}`,
          };
        }
        if (!result.changed) {
          continue;
        }
      } else {
        const content = JSON.stringify(
          target.render(resolved.template),
          null,
          2,
        );
        await fs.writeFile(destination, `${content}\n`, "utf8");
      }
    } catch (error) {
      return {
        changed: writtenPaths,
        failed: `Could not write ${target.path}: ${parseError(error).message}`,
      };
    }
    writtenPaths.push(destination);
  }
  return { changed: writtenPaths };
}

/** Remove generated files and entries still owned by setup in shared configs. */
async function removeMcpConfigs(): Promise<string[]> {
  const projectRoot = getProjectRoot();
  const removedPaths: string[] = [];
  for (const target of MCP_TARGETS) {
    const destination = join(
      target.format === "user-json" ? homedir() : projectRoot,
      target.path,
    );
    if (!existsSync(destination)) {
      continue;
    }
    if (target.format === "user-json") {
      const resolved = await resolveMcpTemplate();
      if (resolved.ok) {
        const result = await updateSharedJson(
          destination,
          target.render(resolved.template),
          "uninstall",
        );
        if (result.changed) {
          removedPaths.push(destination);
        }
      }
      continue;
    }
    if (target.format === "toml") {
      const existing = await fs.readFile(destination, "utf8");
      const remaining = updateCodexConfig(existing, "");
      if (existing === remaining) {
        continue;
      }
      if (remaining) {
        await fs.writeFile(destination, remaining, "utf8");
        removedPaths.push(destination);
        continue;
      }
    }
    await fs.unlink(destination);
    removedPaths.push(destination);
  }
  return removedPaths;
}

// ── The setup contract ─────────────────────────────────────────────────────

/** A label, not a sentence — it is printed after a tick, above the files it wrote. */
export const description = "MCP config";

/** Repo-relative and POSIX — an absolute Windows path buries the point. */
function forDisplay(absolutePath: string): string {
  const projectPath = relative(getProjectRoot(), absolutePath).replaceAll(
    "\\",
    "/",
  );
  return projectPath.startsWith("../")
    ? `~/${relative(homedir(), absolutePath).replaceAll("\\", "/")}`
    : projectPath;
}

export async function install(logger: EndpointLogger): Promise<SetupResult> {
  const { changed, failed } = await writeMcpConfigs();
  if (failed !== undefined) {
    return { changed, summary: failed, failed };
  }
  logger.info(
    `${chalk.green("✓")} ${description}\n${changed
      .map((file) => `    ${chalk.cyan(forDisplay(file))}`)
      .join("\n")}`,
  );
  return { changed, summary: `wrote ${changed.length} MCP config file(s)` };
}

export async function uninstall(logger: EndpointLogger): Promise<SetupResult> {
  const changed = await removeMcpConfigs();
  if (changed.length === 0) {
    logger.info(`${chalk.dim("·")} ${chalk.dim(`No ${description} found`)}`);
    return { changed, summary: "nothing to remove" };
  }
  logger.info(
    `${chalk.yellow("−")} ${description}\n${changed
      .map((file) => `    ${chalk.dim(forDisplay(file))}`)
      .join("\n")}`,
  );
  return { changed, summary: `removed ${changed.length} MCP config file(s)` };
}
