/**
 * Ink Endpoint Page
 *
 * Thin wrapper around EndpointsPage for interactive terminal UI.
 * Uses the exact same widget rendering system as non-interactive CLI,
 * but with real Ink render() instead of fastRenderToString().
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { PassThrough } from "node:stream";

import {
  Box,
  render,
  Text,
  useApp,
  useFocusManager,
  useInput,
  useStdin,
} from "ink";
import { LoggerProvider } from "next-vibe/ui/hooks/logger-provider";
import type { JSX, ReactNode } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { getEnvAvailability } from "../../../agent/env-availability";
import { AgentAvailabilityProvider } from "../../../agent/env-availability-store";
import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { WidgetData } from "../../../core/utils/json";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { createEndpointLogger } from "../../../logger/server";
import { scopedTranslation as cliScopedTranslation } from "../../../platforms/cli/i18n";
import { Platform } from "../../../platforms/platforms";
import { areArrowsCaptured } from "../../../ui/cli/lib/focus-manager";
import {
  isEnterCaptured,
  triggerSubmit,
  useLiveRequestValues,
} from "../../../ui/cli/lib/live-request-values";
import { isOverlayOpen } from "../../../ui/cli/components/dialog";
import { QueryProvider } from "../../hooks/query-provider";
import { EndpointsPage } from "../web/EndpointsPage";
import { prewarmLazyWidgets } from "./response/result-formatter";

// ─── Error Boundary ──────────────────────────────────────────────────────────

// Debug labels — developer-only, not user-facing
const LABEL_INK_ROOT = "InkRoot";
const LABEL_ENDPOINTS_PAGE = "EndpointsPage";

interface InkErrorBoundaryProps {
  children: ReactNode;
  label?: string;
}

interface InkErrorBoundaryState {
  error: Error | null;
}

class InkErrorBoundary extends React.Component<
  InkErrorBoundaryProps,
  InkErrorBoundaryState
> {
  constructor(props: InkErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): InkErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    const label = this.props.label ?? "InkEndpointPage";
    // eslint-disable-next-line no-console
    console.error(
      `\n[InkErrorBoundary:${label}] ${error.message}\n` +
        `Component stack:\n${info.componentStack ?? "(unavailable)"}\n`,
    );
  }

  render(): ReactNode {
    if (this.state.error) {
      const prefix = this.props.label
        ? `Render error in ${this.props.label}:`
        : `Render error:`;
      const hint = `Check the console output above for the component stack trace.`;
      return (
        <Box flexDirection="column" paddingX={1}>
          <Text color="red" bold>
            {prefix}
          </Text>
          <Text color="red">{this.state.error.message}</Text>
          <Text dimColor>{hint}</Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

/**
 * Ink Endpoint Page Props
 */
interface InkEndpointPageProps<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
> {
  /** Endpoint definitions */
  endpoint: T;
  /** Locale for translations */
  locale: CountryLanguage;
  /** User object */
  user: JwtPayloadType;
  /** Enable debug logging */
  debug?: boolean;
  /** Initial data from CLI args to prefill request fields */
  initialData?: WidgetData;
  /** Enable file-based IPC for AI agent control (frame capture + key injection) */
  agentControl?: boolean;
}

/**
 * Build an example CLI command string from endpoint and current form values.
 * Shows `vibe <command> --key value` for each non-empty form field.
 */
/** Quote a CLI argument only when it contains whitespace. */
function quote(v: string): string {
  return v.includes(" ") ? `"${v}"` : v;
}

function buildExampleCommand(
  endpoint: CreateApiEndpointAny,
  formValues: Record<string, WidgetData>,
): string {
  // Use first alias if available, otherwise join path with spaces
  const command =
    endpoint.aliases && endpoint.aliases.length > 0
      ? endpoint.aliases[0]
      : endpoint.path.join(" ");

  const firstArgKey =
    endpoint.cli && "firstCliArgKey" in endpoint.cli
      ? endpoint.cli.firstCliArgKey
      : undefined;

  const parts: string[] = [`vibe ${command}`];

  for (const [key, value] of Object.entries(formValues)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    // `interactive` is always true here — it is what put us in this view. Echoing
    // it back would make the copied command re-open the form instead of running.
    if (key === "interactive") {
      continue;
    }

    // First positional arg doesn't need a flag. Arrays become several
    // positionals — that is exactly how the parser collects them back.
    if (key === firstArgKey) {
      if (Array.isArray(value)) {
        for (const entry of value) {
          parts.push(quote(String(entry)));
        }
      } else {
        parts.push(quote(String(value)));
      }
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }
    }

    const strValue = String(value);

    // Convert camelCase to kebab-case for CLI flags
    const kebabKey = key.replaceAll(
      /[A-Z]/g,
      (match) => `-${match.toLowerCase()}`,
    );

    if (typeof value === "boolean") {
      if (value) {
        parts.push(`--${kebabKey}`);
      }
    } else {
      parts.push(
        `--${kebabKey} ${strValue.includes(" ") ? `"${strValue}"` : strValue}`,
      );
    }
  }

  return parts.join(" ");
}

/**
 * Ink Endpoint Page Component
 *
 * Wraps EndpointsPage with Ink chrome: header box, footer hints, quit handling.
 */
function InkEndpointPage<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>({
  endpoint,
  locale,
  user,
  debug = false,
  initialData,
}: InkEndpointPageProps<T>): JSX.Element {
  const { exit } = useApp();
  const { focus, focusNext, focusPrevious } = useFocusManager();

  // After all fields mount, focus the primary prompt field (if present).
  // Delay slightly so all useFocus() registrations complete first.
  useEffect(() => {
    const timer = setTimeout(() => {
      focus("prompt");
    }, 100);
    return (): void => clearTimeout(timer);
  }, [focus]);

  const activeEndpoint =
    endpoint.GET ??
    endpoint.POST ??
    endpoint.PUT ??
    endpoint.PATCH ??
    endpoint.DELETE;

  // Stable logger - useRef so it doesn't cause re-renders
  const loggerRef = useRef(createEndpointLogger(debug, locale));
  const logger = loggerRef.current;

  const { isRawModeSupported } = useStdin();
  const [ctrlCHint, setCtrlCHint] = useState(false);
  const [escHint, setEscHint] = useState(false);
  const lastCtrlCRef = useRef(0);
  const lastEscRef = useRef(0);

  // Double Ctrl+C or double Esc within 3 seconds to exit.
  // Arrow keys navigate between form fields when no overlay (dropdown) is open.
  useInput(
    (input, key) => {
      if (input === "c" && key.ctrl) {
        const now = Date.now();
        if (now - lastCtrlCRef.current < 3000) {
          exit();
          return;
        }
        lastCtrlCRef.current = now;
        setCtrlCHint(true);
        setTimeout(() => setCtrlCHint(false), 3000);
      }
      if (key.escape && !isOverlayOpen()) {
        const now = Date.now();
        if (now - lastEscRef.current < 3000) {
          exit();
          return;
        }
        lastEscRef.current = now;
        setEscHint(true);
        setTimeout(() => setEscHint(false), 3000);
      }
      // Enter submits from anywhere in the form, not just the submit button —
      // unless a field is using Enter for its own editing (tags) or an overlay
      // owns the key.
      if (key.return && !isOverlayOpen() && !isEnterCaptured()) {
        triggerSubmit();
      }

      // Arrow keys move between fields — unless an overlay is open, or the
      // focused field has claimed them for its own value (a number field steps
      // by ↑/↓, which must not jump to the next field). Tab still navigates.
      if (!isOverlayOpen() && !areArrowsCaptured()) {
        if (key.downArrow) {
          focusNext();
        } else if (key.upArrow) {
          focusPrevious();
        }
      }
    },
    { isActive: isRawModeSupported },
  );

  // Example CLI command based on endpoint path
  // Live: reflects what is currently typed in the form, so the line under the
  // description is always a runnable command you can copy.
  const liveRequestValues = useLiveRequestValues();
  const exampleCommand = useMemo(
    () =>
      activeEndpoint
        ? buildExampleCommand(activeEndpoint, liveRequestValues)
        : "",
    [activeEndpoint, liveRequestValues],
  );

  const { t: cliT } = cliScopedTranslation.scopedT(locale);

  if (!activeEndpoint) {
    return (
      <Box>
        <Text color="red">
          {cliScopedTranslation
            .scopedT(locale)
            .t("vibe.endpoints.renderers.cliUi.noEndpoint")}
        </Text>
      </Box>
    );
  }

  const { t } = activeEndpoint.scopedTranslation.scopedT(locale);
  const title = t(activeEndpoint.title);
  const description = t(activeEndpoint.description);
  const method = activeEndpoint.method;

  // Custom widget endpoints (noFormElement: true) own their entire layout.
  // Skip the header/border chrome and render the widget full-screen.
  const isCustomWidget =
    "noFormElement" in activeEndpoint.fields &&
    activeEndpoint.fields.noFormElement === true;

  const endpointOptions =
    initialData && activeEndpoint
      ? activeEndpoint.method === "GET"
        ? { read: { initialData: initialData as never } }
        : activeEndpoint.method === "DELETE"
          ? {
              delete: {
                urlPathParams: initialData as never,
                autoPrefillData: initialData as never,
              },
            }
          : activeEndpoint.method === "PATCH"
            ? { update: { autoPrefillData: initialData as never } }
            : { create: { autoPrefillData: initialData as never } }
      : undefined;

  if (isCustomWidget) {
    return (
      <Box flexDirection="column">
        <InkErrorBoundary label={LABEL_ENDPOINTS_PAGE}>
          <EndpointsPage
            endpoint={endpoint as never}
            locale={locale}
            user={user}
            logger={logger}
            platform={Platform.CLI}
            endpointOptions={endpointOptions}
          />
        </InkErrorBoundary>
        {(ctrlCHint || escHint) && (
          <Box>
            <Text color="yellow" bold>
              {escHint
                ? cliT(
                    "vibe.endpoints.renderers.cliUi.widgets.common.hints.escExitHint",
                  )
                : cliT(
                    "vibe.endpoints.renderers.cliUi.widgets.common.hints.ctrlCExitHint",
                  )}
            </Text>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      {/* Endpoint header */}
      <Box
        borderStyle="round"
        borderColor="blue"
        paddingX={1}
        flexDirection="column"
      >
        <Box>
          <Text bold color="cyan">
            {method}{" "}
          </Text>
          <Text bold>{title}</Text>
        </Box>
        <Text dimColor>{description}</Text>
        <Box marginTop={1}>
          <Text dimColor>
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.dollarPrompt",
            )}
          </Text>
          <Text color="yellow">{exampleCommand}</Text>
        </Box>
      </Box>

      {/* Endpoint fields - rendered by EndpointsPage */}
      <Box
        borderStyle="round"
        borderColor="green"
        paddingX={1}
        paddingY={1}
        marginTop={1}
        flexDirection="column"
      >
        <InkErrorBoundary label={LABEL_ENDPOINTS_PAGE}>
          <EndpointsPage
            endpoint={endpoint as never}
            locale={locale}
            user={user}
            logger={logger}
            platform={Platform.CLI}
            endpointOptions={endpointOptions}
          />
        </InkErrorBoundary>
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        {escHint ? (
          <Text color="yellow" bold>
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.escExitHint",
            )}
          </Text>
        ) : ctrlCHint ? (
          <Text color="yellow" bold>
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.ctrlCExitHint",
            )}
          </Text>
        ) : (
          <Text dimColor>
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.tabNextField",
            )}
          </Text>
        )}
      </Box>
    </Box>
  );
}

// ─── Agent Control (file-based IPC) ─────────────────────────────────────────

const TMP_DIR = resolve(process.cwd(), ".tmp");
const ANSI_RE =
  /\u001B\[[0-9;]*[A-Za-z]|\u001B\][^\u0007]*\u0007|\u001B\[[?]?[0-9;]*[a-zA-Z]/g; // eslint-disable-line no-control-regex
const IDLE_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

/** Key name → ANSI escape sequence mapping for agent-injected keystrokes */
const KEY_MAP: Record<string, string> = {
  Enter: "\r",
  Tab: "\t",
  Escape: "\u001B",
  Up: "\u001B[A",
  Down: "\u001B[B",
  Right: "\u001B[C",
  Left: "\u001B[D",
  Backspace: "\u007F",
  Delete: "\u001B[3~",
  Space: " ",
  "Shift+Tab": "\u001B[Z",
  "Ctrl+C": "\u0003",
  "Ctrl+D": "\u0004",
};

function frameFilePath(pid: number): string {
  return resolve(TMP_DIR, `.vibe-interactive-${pid}.frame`);
}

function keysFilePath(pid: number): string {
  return resolve(TMP_DIR, `.vibe-interactive-${pid}.keys`);
}

function stripAnsi(s: string): string {
  return s.replaceAll(ANSI_RE, "");
}

/**
 * Set up agent control: frame file writing + keys file polling.
 * Returns a cleanup function.
 */
function setupAgentControl(pid: number): {
  onRender: () => void;
  cleanup: () => void;
  stdinProxy: NodeJS.ReadStream;
  stdoutProxy: NodeJS.WriteStream;
} {
  const framePath = frameFilePath(pid);
  const keysPath = keysFilePath(pid);
  const errorLog: string[] = [];
  let lastActivityTime = Date.now();

  // Ensure .tmp/ exists
  if (!existsSync(TMP_DIR)) {
    mkdirSync(TMP_DIR, { recursive: true });
  }

  // Write PID file so external tools can discover the active session
  const pidFilePath = resolve(TMP_DIR, ".vibe-interactive.pid");
  writeFileSync(pidFilePath, String(pid));

  // Create empty keys file for this session
  writeFileSync(keysPath, "");

  // Create a PassThrough stream that merges real stdin with injected keys.
  // Ink reads stdin via `stdin.read()` on the `readable` event, so we can't
  // inject keys into the real TTY stdin. Instead we pipe real stdin through
  // a PassThrough and push injected keys into it.
  const rawProxy = Object.assign(new PassThrough(), {
    isTTY: true as const,
    setRawMode:
      process.stdin.setRawMode?.bind(process.stdin) ??
      // No-op: non-TTY stdin has no raw mode to set
      ((): void => undefined),
    fd: 0 as const,
    ref: process.stdin.ref?.bind(process.stdin) ?? ((): void => undefined),
    unref: process.stdin.unref?.bind(process.stdin) ?? ((): void => undefined),
  });
  // Only pipe real stdin if it's a TTY; in agent-control mode without TTY,
  // all input comes from the keys file — no real stdin to pipe.
  if (process.stdin.isTTY) {
    process.stdin.pipe(rawProxy);
  }
  // Duck-typed ReadStream: PassThrough with TTY properties Ink needs.
  // Full structural conformance is impractical; Ink only uses read/readable/setRawMode/isTTY.
  const stdinProxy = rawProxy as never as NodeJS.ReadStream;

  // Capture frames via stdout proxy. Ink writes frames in multiple chunks
  // (erase sequences + content). We accumulate all writes and extract the
  // clean frame on each onRender callback.
  const frameBuffer: string[] = [];

  // Create a stdout proxy stream with TTY properties so Ink renders
  // interactive frames even when the real stdout is piped/redirected.
  const stdoutProxy = Object.assign(new PassThrough(), {
    isTTY: true as const,
    columns: process.stdout.columns || 180,
    rows: process.stdout.rows || 40,
    getColorDepth: (): number => 8,
    hasColors: (): boolean => true,
    cursorTo: (): boolean => true,
    clearLine: (): boolean => true,
    moveCursor: (): boolean => true,
    getWindowSize: (): [number, number] => [
      process.stdout.columns || 180,
      process.stdout.rows || 40,
    ],
  }) as never as NodeJS.WriteStream;

  // Intercept all writes to the stdout proxy to capture frame content
  stdoutProxy.write = new Proxy(stdoutProxy.write, {
    apply(target, thisArg, argArray): boolean {
      const chunk = argArray[0] as string | Uint8Array;
      const text =
        typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
      frameBuffer.push(text);
      return Reflect.apply(target, thisArg, argArray) as boolean;
    },
  });

  // Capture stderr for error log
  const origStderrWrite = process.stderr.write.bind(process.stderr);
  process.stderr.write = new Proxy(process.stderr.write, {
    apply(target, thisArg, argArray): boolean {
      const chunk = argArray[0] as string | Uint8Array;
      const text =
        typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
      if (text.trim()) {
        errorLog.push(text.trim());
        if (errorLog.length > 100) {
          errorLog.splice(0, errorLog.length - 100);
        }
      }
      return Reflect.apply(target, thisArg, argArray) as boolean;
    },
  });

  // Write frame file throttled to at most once per second.
  // Ink calls onRender after it has written the frame to stdout.
  // We accumulate the buffer and schedule a disk write.
  let pendingFrame = "";
  let lastFrameWriteTime = 0;
  let frameWriteTimer: ReturnType<typeof setTimeout> | null = null;

  const flushFrame = (): void => {
    if (!pendingFrame) {
      return;
    }
    const logs = errorLog.join("\n");
    try {
      writeFileSync(
        framePath,
        logs ? `${pendingFrame}\n--- LOGS ---\n${logs}` : pendingFrame,
      );
    } catch {
      /* file write failed, non-critical */
    }
    lastFrameWriteTime = Date.now();
    pendingFrame = "";
  };

  const onRender = (): void => {
    const raw = frameBuffer.join("");
    frameBuffer.length = 0;
    pendingFrame = stripAnsi(raw)
      .split("\n")
      .filter((line) => line.trim())
      .join("\n");

    const elapsed = Date.now() - lastFrameWriteTime;
    if (elapsed >= 1000) {
      // Enough time passed — write immediately
      flushFrame();
    } else if (!frameWriteTimer) {
      // Schedule a write for the remaining time
      frameWriteTimer = setTimeout(() => {
        frameWriteTimer = null;
        flushFrame();
      }, 1000 - elapsed);
    }
  };

  // Queue of keys waiting to be injected. We push one key per tick to
  // let React process each state update before the next key arrives.
  // Without this, controlled components (e.g. ink-text-input) see stale
  // props and batch multiple keystrokes into a single state change.
  const keyQueue: string[] = [];
  let keyDrainTimer: ReturnType<typeof setTimeout> | null = null;

  const drainNextKey = (): void => {
    keyDrainTimer = null;
    if (keyQueue.length === 0) {
      return;
    }
    const mapped = keyQueue.shift()!;
    stdinProxy.push(Buffer.from(mapped));
    if (keyQueue.length > 0) {
      // Schedule next key after Ink's render throttle (~34ms at 30fps).
      // Must exceed the throttle window so React can commit the state
      // update from the previous key before the next one arrives.
      keyDrainTimer = setTimeout(drainNextKey, 50);
    }
  };

  // Poll keys file every 100ms
  const keysInterval = setInterval(() => {
    try {
      if (!existsSync(keysPath)) {
        return;
      }
      const raw = readFileSync(keysPath, "utf-8").trim();
      if (!raw) {
        return;
      }
      // Clear the file immediately
      writeFileSync(keysPath, "");
      lastActivityTime = Date.now();

      // Enqueue each line as a key
      for (const line of raw.split("\n")) {
        const key = line.trim();
        if (!key) {
          continue;
        }
        const mapped = KEY_MAP[key] ?? key;
        keyQueue.push(mapped);
      }

      // Start draining if not already in progress
      if (!keyDrainTimer && keyQueue.length > 0) {
        drainNextKey();
      }
    } catch {
      /* polling failure, non-critical */
    }
  }, 100);

  // Idle timeout check every minute
  const idleInterval = setInterval(() => {
    if (Date.now() - lastActivityTime > IDLE_TIMEOUT_MS) {
      process.stderr.write(
        "[interactive] Session timed out after 20 minutes of inactivity.\n",
      );
      process.exit(0);
    }
  }, 60_000);

  const cleanup = (): void => {
    clearInterval(keysInterval);
    clearInterval(idleInterval);
    if (keyDrainTimer) {
      clearTimeout(keyDrainTimer);
    }
    if (frameWriteTimer) {
      clearTimeout(frameWriteTimer);
    }
    // Flush any pending frame before cleanup
    flushFrame();
    // Restore original stderr write
    process.stderr.write = origStderrWrite;
    // Tear down proxies
    if (process.stdin.isTTY) {
      process.stdin.unpipe(stdinProxy);
    }
    stdinProxy.destroy();
    stdoutProxy.destroy();
    // Clean up files
    for (const f of [framePath, keysPath, pidFilePath]) {
      try {
        unlinkSync(f);
      } catch {
        /* ignore */
      }
    }
  };

  return { onRender, cleanup, stdinProxy, stdoutProxy };
}

/**
 * Render interactive endpoint page with real Ink.
 * Same widget rendering system as non-interactive CLI, but with live terminal UI.
 *
 * Agent control: writes current frame to .tmp/.vibe-interactive-<pid>.frame
 * and polls .tmp/.vibe-interactive-<pid>.keys for keystroke injection.
 */
export async function renderInkEndpointPage<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>(props: InkEndpointPageProps<T>): Promise<void> {
  const pid = process.pid;
  const useAgentControl = props.agentControl === true;

  if (!process.stdin.isTTY && !useAgentControl) {
    process.stderr.write(
      "Interactive mode requires a TTY. Run this command directly in a terminal.\n",
    );
    return;
  }

  // Preload all lazy widgets so the first frame renders immediately (no Suspense blank flash)
  await Promise.all(
    Object.values(props.endpoint)
      // Predicate rather than filter(Boolean): the method map is all-optional,
      // and filter(Boolean) does not narrow away the undefined for TypeScript.
      .filter((ep): ep is CreateApiEndpointAny => ep !== undefined)
      .map((ep) => prewarmLazyWidgets(ep)),
  );

  // Set up agent control (frame file + keys polling) only when requested
  const agentCtrl = useAgentControl ? setupAgentControl(pid) : null;

  // eslint-disable-next-line no-console
  console.log(`Interactive session PID: ${pid}`);

  // Fallback SIGINT handler: double within 3s kills even if React tree is crashed.
  // In raw mode Ctrl+C sends \x03 to stdin (handled by useInput above),
  // but if the tree crashes SIGINT is the only way out.
  let lastSigint = 0;
  const sigintHandler = (): void => {
    const now = Date.now();
    if (now - lastSigint < 3000) {
      agentCtrl?.cleanup();
      process.exit(0);
    }
    lastSigint = now;
    process.stderr.write("\nPress Ctrl+C again to exit\n");
  };
  process.on("SIGINT", sigintHandler);

  const availability = await getEnvAvailability();
  const instance = render(
    <InkErrorBoundary label={LABEL_INK_ROOT}>
      <LoggerProvider locale={props.locale}>
        <AgentAvailabilityProvider availability={availability}>
          <QueryProvider>
            <InkEndpointPage {...props} />
          </QueryProvider>
        </AgentAvailabilityProvider>
      </LoggerProvider>
    </InkErrorBoundary>,
    agentCtrl
      ? {
          stdin: agentCtrl.stdinProxy,
          stdout: agentCtrl.stdoutProxy,
          exitOnCtrlC: false,
          onRender: agentCtrl.onRender,
          interactive: true,
        }
      : { exitOnCtrlC: false },
  );

  try {
    await instance.waitUntilExit();
  } finally {
    process.removeListener("SIGINT", sigintHandler);
    agentCtrl?.cleanup();
  }
}
