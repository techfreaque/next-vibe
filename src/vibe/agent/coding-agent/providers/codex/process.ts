import { spawn, spawnSync } from "node:child_process";
import {
  accessSync,
  constants,
  realpathSync,
  statSync,
  writeSync,
} from "node:fs";
import { delimiter, extname, isAbsolute, join } from "node:path";
import { createInterface } from "node:readline";

import { AgentError } from "../../types";
import type { RpcTransport } from "./rpc";

/** Environment variables; not `NodeJS.ProcessEnv`, which hosts augment with required keys such as NODE_ENV. */
type Environment = Record<string, string | undefined>;
const WIN = process.platform === "win32";

/** Inherits credentials too. On Windows use one spelling per key for both lookup and spawning. */
export function codexEnvironment(env: Environment): Environment | AgentError {
  const clean: Environment = {};
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      continue;
    }
    const name = WIN ? key.toUpperCase() : key;
    if (clean[name] !== undefined && clean[name] !== value) {
      return new AgentError(
        "invalid",
        `Conflicting Windows environment variable: ${name}`,
      );
    }
    clean[name] = value;
  }
  // Also protects executable lookups made by an npm shim (e.g. its bare `node` fallback).
  if (WIN) {
    clean.NODEFAULTCURRENTDIRECTORYINEXEPATH = "1";
  }
  return clean;
}

/** Rooted/drive-relative Windows paths and network/device paths are not local installation paths. */
function installationPath(path: string): boolean {
  return WIN ? /^[a-z]:[\\/]/i.test(path) : isAbsolute(path);
}

function executable(path: string): boolean {
  try {
    accessSync(path, WIN ? constants.F_OK : constants.X_OK);
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/**
 * The absolute local PATH entries. Empty and relative entries (`.`, `bin`) depend on the working directory, which is
 * the agent's checkout; the npm shim's bare `node` lookup uses the child's PATH too, so they are dropped there as well.
 * Absolute entries are the caller's own configuration (e.g. an activated venv) and stay.
 */
function absolutePath(env: Environment): string[] {
  return (env.PATH ?? "")
    .split(delimiter)
    .map((entry) => (WIN ? entry.replace(/^"(.*)"$/, "$1") : entry))
    .filter(installationPath);
}

function validateBinary(bin: string): string | AgentError {
  if (!installationPath(bin) || !executable(bin)) {
    return new AgentError(
      "unavailable",
      "PCV_CODEX_BIN must be an existing executable at an absolute local installation path.",
    );
  }
  const canonical = realpathSync(bin);
  if (
    WIN &&
    (!installationPath(canonical) ||
      !/^\.(exe|com|bat|cmd)$/i.test(extname(canonical)) ||
      /["%\r\n]/.test(canonical))
  ) {
    return new AgentError(
      "invalid",
      "Codex must be a local .exe, .com, .bat or .cmd path without quotes or percent variables.",
    );
  }
  return canonical;
}

/**
 * The absolute path of the Codex binary, independent of the working directory (where cmd.exe would look first):
 * `PCV_CODEX_BIN` (absolute) or the first match on an absolute local PATH entry.
 */
export function resolveCodexBinary(env: Environment): string | AgentError {
  const clean = codexEnvironment(env);
  return clean instanceof AgentError ? clean : findBinary(clean);
}

function findBinary(env: Environment): string | AgentError {
  const override = env.PCV_CODEX_BIN;
  if (override) {
    return validateBinary(override);
  }
  const extensions = WIN
    ? (env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD")
        .split(";")
        .filter((ext) => /^\.(com|exe|bat|cmd)$/i.test(ext))
        .map((ext) => ext.toLowerCase())
    : [""];
  for (const dir of absolutePath(env)) {
    for (const ext of extensions) {
      const candidate = join(dir, `codex${ext}`);
      if (executable(candidate)) {
        return validateBinary(candidate);
      }
    }
  }
  return new AgentError(
    "unavailable",
    "codex was not found on an absolute local PATH entry. Install @openai/codex or set PCV_CODEX_BIN.",
  );
}

/**
 * `codex app-server` on stdio as an RPC transport; its stderr goes to the log descriptor. `PCV_CODEX_BIN` (absolute)
 * overrides discovery. The caller's environment, including credentials, is inherited. Windows batch shims run
 * through the OS cmd.exe with AutoRun and delayed expansion disabled. Stopping needs taskkill /T.
 */
export function spawnCodexAppServer(
  logFd: number,
  env: Environment = process.env,
  cwd = process.cwd(),
): RpcTransport | AgentError {
  const clean = codexEnvironment(env);
  if (clean instanceof AgentError) {
    return clean;
  }
  const bin = findBinary(clean);
  if (bin instanceof AgentError) {
    return bin;
  }
  clean.PATH = absolutePath(clean).join(delimiter);
  // Do not let COMSPEC or project-local cmd.exe/taskkill.exe choose the launcher or cleanup executable.
  const systemRoot = process.env.SystemRoot ?? process.env.SYSTEMROOT;
  if (WIN && (!systemRoot || !installationPath(systemRoot))) {
    return new AgentError(
      "invalid",
      "Windows SystemRoot must be an absolute local installation path.",
    );
  }
  const systemDir = join(systemRoot ?? "", "System32");
  const batch = WIN && /\.(bat|cmd)$/i.test(bin);
  if (batch && !installationPath(realpathSync(cwd))) {
    return new AgentError(
      "invalid",
      "The Windows batch launcher requires a local drive working directory; UNC paths are unsupported.",
    );
  }
  const child = spawn(
    batch ? join(systemDir, "cmd.exe") : bin,
    batch
      ? ["/d", "/v:off", "/s", "/c", `""${bin}" app-server"`]
      : ["app-server"],
    {
      stdio: "pipe",
      windowsVerbatimArguments: batch,
      windowsHide: true,
      detached: process.platform !== "win32",
      env: childEnvironment(clean),
      cwd,
    },
  );
  const lineListeners: ((line: string) => void)[] = [];
  const closeListeners: ((reason: string) => void)[] = [];
  let closed = false;
  let stopping: Promise<void> | undefined;
  const kill = (force: boolean): void => {
    if (process.platform === "win32" && child.pid !== undefined) {
      spawnSync(
        join(systemDir, "taskkill.exe"),
        ["/pid", String(child.pid), "/T", "/F"],
        {
          windowsHide: true,
          stdio: "ignore",
        },
      );
    } else if (child.pid !== undefined) {
      try {
        process.kill(-child.pid, force ? "SIGKILL" : "SIGTERM");
      } catch {
        /* Already gone. */
      }
    }
  };
  const onExit = (): void => kill(true);
  process.once("exit", onExit);
  const exited = new Promise<void>((resolve) => {
    child.once("close", () => {
      process.removeListener("exit", onExit);
      resolve();
    });
  });
  const closeAll = (reason: string): void => {
    if (closed) {
      return;
    }
    closed = true;
    for (const listener of closeListeners) {
      listener(reason);
    }
  };
  createInterface({ input: child.stdout })
    .on("error", (error) => closeAll(error.message))
    .on("line", (line) => {
      for (const listener of lineListeners) {
        listener(line);
      }
    });
  child.stderr.on("data", (chunk: Buffer) => {
    try {
      writeSync(logFd, chunk);
    } catch {
      // The log is gone; the agent work goes on.
    }
  });
  child.on("error", (error) => closeAll(error.message));
  // `close` follows the last stdout line; `exit` can arrive before the final response is drained.
  child.on("close", (code, signal) => closeAll(`exit ${code ?? signal}`));
  child.stdin.on("error", () => undefined);
  return {
    write: (line) => void child.stdin.write(`${line}\n`),
    close: () => {
      stopping ??= (async (): Promise<void> => {
        if (!closed) {
          child.stdin.end();
          kill(false);
        }
        const timer = setTimeout(() => kill(true), 1000);
        try {
          await exited;
        } finally {
          clearTimeout(timer);
          if (process.platform !== "win32") {
            kill(true);
          }
        }
      })();
      return stopping;
    },
    onLine: (listener) => void lineListeners.push(listener),
    onClose: (listener) => void closeListeners.push(listener),
  };
}

/** Hosts augment `NodeJS.ProcessEnv` with required keys (NODE_ENV); the child gets exactly the keys given. */
function childEnvironment(env: Environment): NodeJS.ProcessEnv {
  const child: NodeJS.ProcessEnv = Object.create(null);
  return Object.assign(child, env);
}
