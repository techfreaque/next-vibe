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

import { existsSync, promises as fs } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import chalk from "chalk";
import { coreEnv, getRuntimeInvocation } from "../../core/env";
import type { SetupResult } from "../../core/setup/types";
import type { WidgetData } from "../../core/utils/json";
import { parseError } from "../../core/utils/parse-error";
import { getProjectRoot } from "@/env/paths";
import type { EndpointLogger } from "../../logger/types";
import { z } from "zod";

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

/**
 * Where each editor reads project-scoped MCP config, and in what shape.
 *
 * VS Code is the odd one out on both counts: it keys servers under `servers`
 * rather than `mcpServers`, and requires an explicit `type` discriminator.
 * Handing it a Claude Code file raises no error — the servers simply never
 * appear, which is why this cannot be one blob copied to every path.
 *
 * Windsurf is absent deliberately: it reads user-level config only
 * (`~/.codeium/windsurf/mcp_config.json`) and has no project-scoped file to
 * write. Zed is absent because its project-level support is unconfirmed.
 */
const MCP_TARGETS: readonly {
  readonly path: string;
  readonly editor: string;
  readonly render: (template: McpTemplate) => WidgetData;
}[] = [
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
];

// Both writeMcpConfigs and removeMcpConfigs walk MCP_TARGETS directly, so a
// separate exported path list only restated it for nobody to read.

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

/** Serialize one target, newline-terminated so the files stay diff-friendly. */
function renderTarget(
  target: (typeof MCP_TARGETS)[number],
  template: McpTemplate,
): string {
  return `${JSON.stringify(target.render(template), null, 2)}\n`;
}

/**
 * Write every editor's MCP config from the template. Overwrites unconditionally
 * — these are generated artifacts, and a stale one is a server that fails to
 * start rather than a customization worth keeping.
 */
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
    const destination = join(projectRoot, target.path);
    // Guarded rather than relying on `recursive: true` to be a no-op: under bun
    // it still fails with EEXIST for a directory that already exists, and the
    // most common target (.mcp.json) sits directly in the project root.
    const directory = dirname(destination);
    if (!existsSync(directory)) {
      await fs.mkdir(directory, { recursive: true });
    }
    await fs.writeFile(
      destination,
      renderTarget(target, resolved.template),
      "utf8",
    );
    writtenPaths.push(destination);
  }
  return { changed: writtenPaths };
}

/** Remove every generated config. Absent files are already in the desired state. */
async function removeMcpConfigs(): Promise<string[]> {
  const projectRoot = getProjectRoot();
  const removedPaths: string[] = [];
  for (const target of MCP_TARGETS) {
    const destination = join(projectRoot, target.path);
    if (existsSync(destination)) {
      await fs.rm(destination);
      removedPaths.push(destination);
    }
  }
  return removedPaths;
}

// ── The setup contract ─────────────────────────────────────────────────────

/** A label, not a sentence — it is printed after a tick, above the files it wrote. */
export const description = "MCP config";

/** Repo-relative and POSIX — an absolute Windows path buries the point. */
function forDisplay(absolutePath: string): string {
  return relative(getProjectRoot(), absolutePath).replaceAll("\\", "/");
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
    logger.info(
      `${chalk.dim("·")} ${chalk.dim(`${description} — none found`)}`,
    );
    return { changed, summary: "nothing to remove" };
  }
  logger.info(
    `${chalk.yellow("−")} ${description}\n${changed
      .map((file) => `    ${chalk.dim(forDisplay(file))}`)
      .join("\n")}`,
  );
  return { changed, summary: `removed ${changed.length} MCP config file(s)` };
}
