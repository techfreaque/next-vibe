/**
 * SSH Exec Widget — Command Runner
 * Split-pane UI: command input top, output bottom.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  CheckCircle,
  Play,
  RotateCcw,
  Terminal,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import type { TextareaKeyboardEvent } from "next-vibe-ui/ui/textarea";
import { Textarea } from "next-vibe-ui/ui/textarea";
import { P } from "next-vibe-ui/ui/typography";
import React, { useCallback, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { SshExecResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: SshExecResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
  fieldName: string;
}

interface HistoryEntry {
  command: string;
  exitCode: number | null;
  backend: string;
  timestamp: string;
}

function ExitCodeBadge({ code }: { code: number | null }): React.JSX.Element {
  if (code === null) {
    return <Span className="text-xs text-muted-foreground">—</Span>;
  }
  const ok = code === 0;
  return (
    <Span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-mono px-1.5 py-0.5 rounded",
        ok
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      )}
    >
      {ok ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {code}
    </Span>
  );
}

export function SshExecContainer({ field }: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const form = useWidgetForm<typeof endpoints.POST>();
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const value = field.value;
  const isLoading = endpointMutations?.read?.isLoading ?? false;

  const command = form?.watch("command") ?? "";

  const handleRun = useCallback((): void => {
    if (!command.trim() || isLoading) {
      return;
    }
    if (onSubmit) {
      onSubmit();
    }
  }, [command, isLoading, onSubmit]);

  const handleClear = useCallback((): void => {
    form?.setValue("command", "");
  }, [form]);

  const handleKeyDown = useCallback(
    (e: TextareaKeyboardEvent): void => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        handleRun();
      }
    },
    [handleRun],
  );

  // Record into history when we get a result
  React.useEffect((): void => {
    if (value && command.trim()) {
      setHistory((prev) => [
        {
          command,
          exitCode: value.exitCode,
          backend: value.backend,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 49),
      ]);
    }
  }, [value, command]);

  const handleHistoryClick = useCallback(
    (cmd: string): void => {
      form?.setValue("command", cmd);
      setShowHistory(false);
    },
    [form],
  );

  return (
    <Div className="flex flex-col gap-0 h-full min-h-[500px]">
      {/* ── Header ── */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("app.api.ssh.exec.widget.title")}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowHistory((v) => !v)}
          className="text-xs text-muted-foreground"
        >
          {t("app.api.ssh.exec.widget.historyLabel")} ({history.length})
        </Button>
      </Div>

      {/* ── History panel ── */}
      {showHistory && (
        <Div className="border-b bg-muted/30 max-h-40 overflow-y-auto">
          {history.length === 0 ? (
            <P className="px-4 py-3 text-xs text-muted-foreground">
              {t("app.api.ssh.exec.widget.noHistory")}
            </P>
          ) : (
            history.map((h, i) => (
              <Div
                key={i}
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-muted cursor-pointer border-b last:border-0"
                onClick={() => handleHistoryClick(h.command)}
              >
                <ExitCodeBadge code={h.exitCode} />
                <Span className="text-xs font-mono truncate flex-1">
                  {h.command}
                </Span>
                <Span className="text-[10px] text-muted-foreground shrink-0">
                  {h.timestamp.slice(11, 19)}
                </Span>
              </Div>
            ))
          )}
        </Div>
      )}

      {/* ── Command input ── */}
      <Div className="flex flex-col gap-2 px-4 py-3 border-b">
        <Textarea
          value={command}
          onChange={(e) => form?.setValue("command", e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("app.api.ssh.exec.widget.placeholder")}
          className="font-mono text-sm min-h-[80px] resize-none"
          disabled={isLoading}
        />
        <Div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleRun}
            disabled={!command.trim() || isLoading}
            className="gap-1.5"
          >
            <Play className="h-3.5 w-3.5" />
            {isLoading
              ? t("app.api.ssh.exec.widget.running")
              : t("app.api.ssh.exec.widget.runButton")}
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
            {t("app.api.ssh.exec.widget.clearButton")}
          </Button>
          <Span className="text-[10px] text-muted-foreground ml-auto">
            {t("app.api.ssh.exec.widget.ctrlEnterHint")}
          </Span>
        </Div>
      </Div>

      {/* ── Output area ── */}
      <Div className="flex flex-col gap-0 flex-1">
        {value ? (
          <>
            {/* Meta bar */}
            <Div className="flex items-center gap-3 px-4 py-2 border-b bg-muted/20 flex-wrap text-xs">
              <Div className="flex items-center gap-1.5">
                <Span className="text-muted-foreground">
                  {t("app.api.ssh.exec.widget.exitCodeLabel")}:
                </Span>
                <ExitCodeBadge code={value.exitCode} />
              </Div>
              <Div className="flex items-center gap-1.5">
                <Span className="text-muted-foreground">
                  {t("app.api.ssh.exec.widget.durationLabel")}:
                </Span>
                <Span className="font-mono">{value.durationMs}ms</Span>
              </Div>
              <Div className="flex items-center gap-1.5">
                <Span className="text-muted-foreground">
                  {t("app.api.ssh.exec.widget.backendLabel")}:
                </Span>
                <Span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-medium",
                    value.backend === "LOCAL"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                  )}
                >
                  {value.backend}
                </Span>
              </Div>
              {value.truncated && (
                <Span className="text-amber-600 dark:text-amber-400">
                  {t("app.api.ssh.exec.widget.truncatedWarning")}
                </Span>
              )}
            </Div>

            {/* stdout */}
            {value.stdout && (
              <Div className="flex flex-col gap-0 border-b">
                <Div className="px-4 py-1 bg-muted/10 border-b">
                  <Span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {t("app.api.ssh.exec.widget.stdoutLabel")}
                  </Span>
                </Div>
                <Pre className="px-4 py-3 text-xs font-mono whitespace-pre-wrap break-words overflow-x-auto max-h-64 overflow-y-auto">
                  {value.stdout}
                </Pre>
              </Div>
            )}

            {/* stderr */}
            {value.stderr && (
              <Div className="flex flex-col gap-0">
                <Div className="px-4 py-1 bg-amber-50 dark:bg-amber-900/10 border-b">
                  <Span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                    {t("app.api.ssh.exec.widget.stderrLabel")}
                  </Span>
                </Div>
                <Pre className="px-4 py-3 text-xs font-mono whitespace-pre-wrap break-words overflow-x-auto max-h-48 overflow-y-auto text-amber-800 dark:text-amber-300">
                  {value.stderr}
                </Pre>
              </Div>
            )}

            {!value.stdout && !value.stderr && (
              <Div className="flex items-center justify-center py-10">
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.ssh.exec.widget.emptyOutput")}
                </Span>
              </Div>
            )}
          </>
        ) : (
          <Div className="flex flex-col items-center justify-center flex-1 gap-2 py-16 text-center">
            <Terminal className="h-8 w-8 text-muted-foreground/40" />
            <Span className="text-xs text-muted-foreground">
              {t("app.api.ssh.exec.widget.outputLabel")}
            </Span>
          </Div>
        )}
      </Div>
    </Div>
  );
}
