/**
 * Cortex Exec Widget - Terminal Command Runner
 *
 * Split-pane terminal UI: machine + command input on top, output below.
 * Inline collapsible directory browser: click path to expand, navigate folders
 * to update path live. No modal steps, no confirm buttons.
 */

"use client";

import { useEndpoint } from "next-vibe/platforms/react/hooks/use-endpoint";
import {
  useSearchParams,
  useSilentHistory,
} from "next-vibe/ui/hooks/use-navigation";
import { getCurrentUrl } from "next-vibe/ui/lib/location";
import { Button, type ButtonMouseEvent } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { EmptyBlock } from "next-vibe/ui/ui/empty-block";
import { ChevronDown } from "next-vibe/ui/ui/icons/ChevronDown";
import { ChevronLeft } from "next-vibe/ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/ui/icons/ChevronRight";
import { FolderOpen } from "next-vibe/ui/ui/icons/FolderOpen";
import { Home } from "next-vibe/ui/ui/icons/Home";
import { Laptop } from "next-vibe/ui/ui/icons/Laptop";
import { Play } from "next-vibe/ui/ui/icons/Play";
import { RotateCcw } from "next-vibe/ui/ui/icons/RotateCcw";
import { Server } from "next-vibe/ui/ui/icons/Server";
import { Terminal } from "next-vibe/ui/ui/icons/Terminal";
import { Wifi } from "next-vibe/ui/ui/icons/Wifi";
import { Input } from "next-vibe/ui/ui/input";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { Pre } from "next-vibe/ui/ui/pre";
import { SectionGroup } from "next-vibe/ui/ui/section-group";
import { Span } from "next-vibe/ui/ui/span";
import { StatusPill } from "next-vibe/ui/ui/status-pill";
import type { TextareaKeyboardEvent } from "next-vibe/ui/ui/textarea";
import { Textarea } from "next-vibe/ui/ui/textarea";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/interactive/form-alert/widget";
import {
  type JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import cortexListDefinitions from "@/app/api/[locale]/agent/cortex/list/definition";
import connectionsListDefinitions from "@/app/api/[locale]/ssh/connections/list/definition";

import type endpoints from "./definition";

// ─── Types ───────────────────────────────────────────────────────────────────

interface HistoryEntry {
  command: string;
  exitCode: number | null;
  cwd: string;
}

type Connection = NonNullable<
  (typeof connectionsListDefinitions.GET.types.ResponseOutput)["connections"]
>[number];

type DirEntry = NonNullable<
  (typeof cortexListDefinitions.GET.types.ResponseOutput)["entries"]
>[number];

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function ConnectionIcon({
  type,
}: {
  type: Connection["connectionType"];
}): JSX.Element {
  if (type === "local") {
    return <Laptop className="h-4 w-4 text-blue-400" />;
  }
  if (type === "remote") {
    return <Wifi className="h-4 w-4 text-amber-400" />;
  }
  return <Server className="h-4 w-4 text-muted-foreground" />;
}

function connectionSubtitle(conn: Connection): string {
  if (conn.connectionType === "remote") {
    return conn.host;
  }
  if (conn.connectionType === "local") {
    return `${conn.username}@localhost`;
  }
  return `${conn.username}@${conn.host}:${String(conn.port)}`;
}

function connectionToSlug(conn: Connection): string {
  return conn.label.toLowerCase().replace(/\s+/g, "-");
}

function buildBreadcrumbs(
  base: string,
  path: string,
): { label: string; path: string }[] {
  const stripped = path.replace(base, "").replace(/^\//, "");
  const crumbs: { label: string; path: string }[] = [
    { label: "/", path: base },
  ];
  if (!stripped) {
    return crumbs;
  }
  let current = base;
  for (const part of stripped.split("/").filter(Boolean)) {
    current += `/${part}`;
    crumbs.push({ label: part, path: current });
  }
  return crumbs;
}

// ─── Machine list (shown when no machine selected) ────────────────────────────

interface MachinePanelProps {
  onPick: (conn: Connection) => void;
}

function MachinePanel({ onPick }: MachinePanelProps): JSX.Element {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const t = useWidgetTranslation<typeof endpoints.POST>();

  const connectionsEndpoint = useEndpoint(
    connectionsListDefinitions,
    useMemo(
      () => ({
        read: {
          queryOptions: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
      [],
    ),
    logger,
    user,
  );

  const connections = connectionsEndpoint.read?.data?.connections ?? null;
  const isLoading = connectionsEndpoint.read?.isLoading ?? true;

  if (isLoading) {
    return <LoadingBlock message={t("widget.picker.loading")} />;
  }

  if (!connections || connections.length === 0) {
    return (
      <Div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
        <Server className="h-6 w-6 opacity-30" />
        <Span className="text-xs">{t("widget.picker.noMachines")}</Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col divide-y divide-border/40">
      {connections.map((conn) => (
        <Button
          key={conn.id}
          type="button"
          variant="ghost"
          onClick={() => onPick(conn)}
          className="w-full h-auto flex items-center gap-3 px-3 py-2.5 justify-start rounded-none hover:bg-muted/40"
        >
          <Div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/40">
            <ConnectionIcon type={conn.connectionType} />
          </Div>
          <Div className="flex-1 min-w-0 text-left">
            <Div className="text-sm font-medium text-foreground truncate">
              {conn.label}
            </Div>
            <Div className="text-xs text-muted-foreground font-mono truncate">
              {connectionSubtitle(conn)}
            </Div>
          </Div>
          <Div className="flex items-center gap-1.5 shrink-0">
            {conn.isDefault && (
              <StatusPill
                status={t("widget.picker.defaultBadge")}
                variant="info"
              />
            )}
            <StatusPill
              status={conn.connectionType}
              variant={
                conn.connectionType === "local"
                  ? "info"
                  : conn.connectionType === "remote"
                    ? "warning"
                    : "default"
              }
            />
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
          </Div>
        </Button>
      ))}
    </Div>
  );
}

// ─── File browser (shown after machine selected) ──────────────────────────────

interface FileBrowserProps {
  machinePath: string;
  currentPath: string;
  onNavigate: (path: string) => void;
  onChangeMachine: () => void;
}

function FileBrowser({
  machinePath,
  currentPath,
  onNavigate,
  onChangeMachine,
}: FileBrowserProps): JSX.Element {
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const t = useWidgetTranslation<typeof endpoints.POST>();

  const initialMachinePathRef = useRef(machinePath);
  const listEndpoint = useEndpoint(
    cortexListDefinitions,
    useMemo(
      () => ({
        read: {
          initialState: { path: initialMachinePathRef.current },
          formOptions: { autoSubmit: true, debounceMs: 0 },
          queryOptions: { staleTime: 0, refetchOnWindowFocus: false },
        },
      }),
      [],
    ),
    logger,
    user,
  );

  const form = listEndpoint.read?.form;

  const browsePath: string =
    (form?.watch("path") as string | undefined) ?? currentPath;

  const setBrowsePath = useCallback(
    (path: string): void => {
      form?.setValue("path", path, { shouldDirty: true });
      onNavigate(path);
    },
    [form, onNavigate],
  );

  const entries: DirEntry[] = (listEndpoint.read?.data?.entries ?? []).filter(
    (e) => e.nodeType === "dir" || e.nodeType === "enums.nodeType.dir",
  );
  const isLoading = listEndpoint.read?.isLoading ?? true;
  const crumbs = buildBreadcrumbs(machinePath, browsePath);

  return (
    <>
      {/* Breadcrumb bar */}
      <Div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border/40 bg-muted/10 overflow-x-auto">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onChangeMachine}
          className="h-auto p-0 pr-2 text-xs text-muted-foreground hover:text-foreground hover:bg-transparent shrink-0 gap-1"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        {crumbs.map((crumb, i) => (
          <Div key={crumb.path} className="flex items-center gap-0.5 shrink-0">
            {i > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
            )}
            {i === 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBrowsePath(crumb.path)}
                className="h-auto p-1 text-muted-foreground hover:text-foreground hover:bg-transparent"
              >
                <Home className="h-3 w-3" />
              </Button>
            ) : i === crumbs.length - 1 ? (
              <Span className="text-xs font-medium text-foreground font-mono px-1">
                {crumb.label}
              </Span>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBrowsePath(crumb.path)}
                className="h-auto px-1 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 font-mono"
              >
                {crumb.label}
              </Button>
            )}
          </Div>
        ))}
      </Div>

      {/* Directory listing */}
      {isLoading ? (
        <LoadingBlock message={t("widget.picker.loading")} />
      ) : entries.length === 0 ? (
        <Div className="flex flex-col items-center justify-center py-6 gap-1.5 text-muted-foreground">
          <FolderOpen className="h-5 w-5 opacity-30" />
          <Span className="text-xs">{t("widget.picker.emptyDir")}</Span>
        </Div>
      ) : (
        <Div className="flex flex-col divide-y divide-border/20 max-h-52 overflow-y-auto">
          {entries.map((entry) => (
            <Button
              key={entry.entryPath}
              type="button"
              variant="ghost"
              onClick={() => setBrowsePath(entry.entryPath)}
              className="w-full h-auto flex items-center gap-2.5 px-3 py-2 justify-start rounded-none hover:bg-muted/40"
            >
              <FolderOpen className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <Span className="text-xs font-mono text-foreground truncate flex-1 text-left">
                {entry.name}
              </Span>
              <ChevronRight className="h-3 w-3 text-muted-foreground/30 shrink-0" />
            </Button>
          ))}
        </Div>
      )}
    </>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CortexExecWidget(_props: {
  field: (typeof endpoints.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const form = useWidgetForm<typeof endpoints.POST>();
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const responseOnly = useWidgetResponseOnly();
  const searchParams = useSearchParams();
  const { replaceState } = useSilentHistory();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  // null = collapsed, "machines" = showing machine list, "files" = browsing dirs
  const [browserMode, setBrowserMode] = useState<"machines" | "files" | null>(
    null,
  );

  const value = useWidgetValue<typeof endpoints.POST>();
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  const path = form.watch("path") ?? "";
  const command = form.watch("command") ?? "";

  // Read ?path= from URL on first render and apply to form
  const didInitPathRef = useRef(false);
  useEffect(() => {
    if (didInitPathRef.current) {
      return;
    }
    didInitPathRef.current = true;
    const urlPath = searchParams.get("path");
    if (urlPath && !form.getValues("path")) {
      form.setValue("path", urlPath, { shouldDirty: true });
    }
  }, [searchParams, form]);

  // Sync path to URL search param on every change
  useEffect(() => {
    if (!path) {
      return;
    }
    const currentHref = getCurrentUrl();
    if (!currentHref) {
      return;
    }
    const url = new URL(currentHref);
    if (url.searchParams.get("path") === path) {
      return;
    }
    url.searchParams.set("path", path);
    replaceState(url.toString());
  }, [path, replaceState]);

  // Derive machinePath from path: the /ssh/<slug> prefix
  const machinePath = useMemo((): string => {
    if (!path.startsWith("/ssh/")) {
      return "";
    }
    const parts = path.split("/").filter(Boolean); // ["ssh", "slug", ...]
    return parts.length >= 2 ? `/ssh/${parts[1]}` : "";
  }, [path]);

  const handleRun = useCallback((): void => {
    if (!command.trim() || !path.trim() || isLoading) {
      return;
    }
    onSubmit?.();
  }, [command, path, isLoading, onSubmit]);

  const handleClear = useCallback((): void => {
    form.setValue("command", "", { shouldDirty: true });
  }, [form]);

  const handleKeyDown = useCallback(
    (e: TextareaKeyboardEvent): void => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleRun();
      }
    },
    [handleRun],
  );

  // Track history on new response
  const [lastValue, setLastValue] = useState(value);
  if (value && value !== lastValue) {
    setLastValue(value);
    if (command.trim()) {
      setHistory((prev) => [
        { command, exitCode: value.exitCode, cwd: value.cwd },
        ...prev.slice(0, 49),
      ]);
    }
  }

  const handleHistoryClick = useCallback(
    (cmd: string): void => {
      form.setValue("command", cmd, { shouldDirty: true });
    },
    [form],
  );

  // ── Browser handlers ──

  const toggleBrowser = useCallback((): void => {
    setBrowserMode((prev) => {
      if (prev !== null) {
        return null;
      }
      return machinePath ? "files" : "machines";
    });
  }, [machinePath]);

  const handlePickMachine = useCallback(
    (conn: Connection): void => {
      const slug = connectionToSlug(conn);
      form.setValue("path", `/ssh/${slug}`, { shouldDirty: true });
      setBrowserMode("files");
    },
    [form],
  );

  const handleNavigate = useCallback(
    (newPath: string): void => {
      form.setValue("path", newPath, { shouldDirty: true });
    },
    [form],
  );

  const handleChangeMachine = useCallback((): void => {
    setBrowserMode("machines");
  }, []);

  // ── Cross-endpoint navigation ──

  const handleNavConnections = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/ssh/connections/list/definition");
      navigate(def.default.GET, {});
    })();
  };

  const handleNavTerminals = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def =
        await import("@/app/api/[locale]/agent/cortex/terminals/definition");
      navigate(def.default.GET, {});
    })();
  };

  const browserOpen = browserMode !== null;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("widget.title")}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
              className="gap-1.5 -ml-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          <Div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNavConnections}
              className="text-xs"
            >
              {t("widget.manageConnections")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNavTerminals}
              className="text-xs"
            >
              {t("widget.viewTerminals")}
            </Button>
          </Div>
        }
      />

      {!responseOnly && <FormAlertWidget field={{}} />}

      {/* ── Machine + Command Input ── */}
      {!responseOnly && (
        <Div className="flex flex-col gap-3">
          {/* Path row: editable input + browse toggle */}
          <Div
            className={`flex items-center rounded-md border ${browserOpen ? "border-ring" : "border-input"} bg-background overflow-hidden transition-colors`}
          >
            <Input
              value={path}
              onChange={(e) =>
                form.setValue("path", e.target.value, { shouldDirty: true })
              }
              placeholder={t("widget.machinePlaceholder")}
              className="flex-1 border-0 rounded-none font-mono text-xs h-9 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent px-3"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={toggleBrowser}
              className="h-9 w-9 rounded-none border-l border-input shrink-0 flex items-center justify-center p-0"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted-foreground/60 transition-transform ${
                  browserOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </Div>

          {/* Inline browser — collapses/expands with the path row */}
          {browserOpen && (
            <Div className="flex flex-col border border-border rounded-lg overflow-hidden -mt-1">
              {browserMode === "machines" && (
                <MachinePanel onPick={handlePickMachine} />
              )}
              {browserMode === "files" && machinePath && (
                <FileBrowser
                  machinePath={machinePath}
                  currentPath={path || machinePath}
                  onNavigate={handleNavigate}
                  onChangeMachine={handleChangeMachine}
                />
              )}
            </Div>
          )}

          <Textarea
            value={command}
            onChange={(e) =>
              form.setValue("command", e.target.value, { shouldDirty: true })
            }
            onKeyDown={handleKeyDown}
            placeholder={t("widget.placeholder")}
            className="font-mono text-sm min-h-[80px] resize-none"
            disabled={isLoading}
          />

          <Div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleRun}
              disabled={!command.trim() || !path.trim() || isLoading}
              className="gap-1.5"
            >
              <Play className="h-3.5 w-3.5" />
              {isLoading ? t("widget.running") : t("widget.runButton")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleClear}
              disabled={!command}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("widget.clearButton")}
            </Button>
            <Span className="text-[10px] text-muted-foreground ml-auto">
              {t("widget.ctrlEnterHint")}
            </Span>
          </Div>
        </Div>
      )}

      {/* ── Output ── */}
      {value ? (
        <Div className="flex flex-col rounded-lg overflow-hidden border border-border">
          {/* Terminal title bar */}
          <Div className="flex items-center gap-2 px-3 py-1.5 bg-muted/60 border-b border-border/60">
            <Div className="flex gap-1.5">
              <Div
                className={`h-2.5 w-2.5 rounded-full ${value.exitCode === 0 ? "bg-green-500" : "bg-red-500"}`}
              />
              <Div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
              <Div className="h-2.5 w-2.5 rounded-full bg-green-500/20" />
            </Div>
            <Span className="text-[10px] text-muted-foreground font-mono flex-1 text-center truncate">
              {value.cwd}
            </Span>
            <StatusPill
              status={value.backend}
              variant={value.backend === "LOCAL" ? "info" : "default"}
            />
            {value.truncated && (
              <StatusPill
                status={t("widget.truncatedWarning")}
                variant="warning"
              />
            )}
          </Div>

          {/* Terminal body */}
          <Pre className="text-xs font-mono whitespace-pre-wrap break-all max-h-[400px] overflow-y-auto bg-[#0d0d0d] dark:bg-[#0a0a0a] text-[#e8e8e8] p-3 leading-[1.6]">
            {/* Prompt + command */}
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            <Span className="text-green-400 select-none">$ </Span>
            <Span className="text-[#e8e8e8]">
              {command}
              {"\n"}
            </Span>
            {/* Output */}
            {value.output ? (
              <Span
                className={value.exitCode !== 0 ? "text-red-400" : undefined}
              >
                {value.output}
              </Span>
            ) : (
              <Span className="text-muted-foreground italic text-[10px]">
                {t("widget.emptyOutput")}
              </Span>
            )}
          </Pre>
        </Div>
      ) : (
        <EmptyBlock
          icon={<Terminal className="h-8 w-8" />}
          title={t("widget.outputLabel")}
        />
      )}

      {/* ── History ── */}
      {history.length > 0 && (
        <SectionGroup title={t("widget.historyTitle")} collapsible>
          <Div className="flex flex-col divide-y divide-border rounded-lg border overflow-hidden">
            {history.map((h, i) => (
              <Div
                key={`${h.command}-${String(i)}`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer"
                onClick={() => handleHistoryClick(h.command)}
              >
                <StatusPill
                  status={String(h.exitCode ?? "—")}
                  variant={h.exitCode === 0 ? "success" : "danger"}
                />
                <Span className="text-xs font-mono truncate flex-1">
                  {h.command}
                </Span>
                <Span className="text-[10px] text-muted-foreground shrink-0">
                  {h.cwd}
                </Span>
              </Div>
            ))}
          </Div>
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
