"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { ArrowLeft } from "next-vibe-ui/ui/icons/ArrowLeft";
import { Bell } from "next-vibe-ui/ui/icons/Bell";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

// ─── Shared UI ─────────────────────────────────────────────────────────────────

function TopBar({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-3 py-2.5 border-b shrink-0 bg-background">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 shrink-0"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      {children}
    </Div>
  );
}

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <Div
      className={cn(
        "rounded-2xl border bg-card shadow-xs overflow-hidden",
        className,
      )}
    >
      {children}
    </Div>
  );
}

function SectionHead({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-4 py-2.5 border-b bg-muted/20">
      <Span className="text-muted-foreground">{icon}</Span>
      <Span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Span>
    </Div>
  );
}

// ─── SubscriptionReminderContainer ─────────────────────────────────────────────

export function SubscriptionReminderContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { pop: goBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const value = useWidgetValue<typeof definition.POST>();

  const isCompact = platform === Platform.CLI || platform === Platform.MCP;

  const handleRun = useCallback((): void => {
    onSubmit?.();
  }, [onSubmit]);

  // ── Compact ──
  if (isCompact) {
    if (!value) {
      return (
        <Div className="flex-col">
          <Div>{`Run: corvina_subscription_reminder`}</Div>
        </Div>
      );
    }
    return (
      <Div className="flex-col">
        <Div>{`checked:${value.checked} reminded:${value.reminded} errors:${value.errors.length}`}</Div>
      </Div>
    );
  }

  const hasResult = value !== null && value !== undefined;
  const hasErrors = hasResult && value.errors.length > 0;

  return (
    <Div className="flex flex-col min-h-0 bg-background">
      <TopBar onBack={goBack}>
        <Bell className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Span className="font-semibold text-sm mr-auto">
          {t("post.widget.title")}
        </Span>
      </TopBar>

      <Div className="overflow-y-auto flex-1 max-h-[min(700px,calc(100dvh-120px))] p-4 flex flex-col gap-3">
        {/* ── About ── */}
        <SectionCard>
          <SectionHead
            icon={<Bell className="h-3.5 w-3.5" />}
            label={t("post.widget.sections.about")}
          />
          <Div className="p-3.5 flex flex-col gap-2.5">
            <Span className="text-sm text-muted-foreground leading-relaxed">
              {t("post.widget.description")}
            </Span>
            <Div className="flex flex-col rounded-xl border bg-muted/30 overflow-hidden divide-y">
              <Div className="flex items-center gap-2.5 px-3 py-2.5">
                <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                <Span className="text-xs text-muted-foreground">
                  {t("post.widget.scanNote")}
                </Span>
              </Div>
              <Div className="flex items-center gap-2.5 px-3 py-2.5">
                <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                <Span className="text-xs text-muted-foreground">
                  {t("post.widget.safeNote")}
                </Span>
              </Div>
            </Div>
          </Div>
        </SectionCard>

        {/* ── Results — only after run ── */}
        {hasResult && (
          <SectionCard>
            <Div
              className={cn(
                "h-1 w-full shrink-0",
                hasErrors
                  ? "bg-gradient-to-r from-warning to-warning/50"
                  : "bg-gradient-to-r from-success to-success/50",
              )}
            />

            <Div className="p-3.5 flex flex-col gap-3">
              {/* Top: icon + title + status badge */}
              <Div className="flex items-start gap-2.5">
                <Div
                  className={cn(
                    "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center",
                    hasErrors ? "bg-warning/10" : "bg-success/10",
                  )}
                >
                  <CheckCircle
                    className={cn(
                      "h-4 w-4",
                      hasErrors ? "text-warning" : "text-success",
                    )}
                  />
                </Div>
                <Div className="flex-1 min-w-0">
                  <Span className="font-semibold text-sm block leading-tight">
                    {t("post.widget.sections.results")}
                  </Span>
                  <Span className="text-[10px] text-muted-foreground block mt-0.5">
                    {`${value.checked} scanned · ${value.reminded} sent`}
                  </Span>
                </Div>
                <Span
                  className={cn(
                    "shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                    hasErrors
                      ? "bg-warning/10 text-warning"
                      : "bg-success/10 text-success",
                  )}
                >
                  <Span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      hasErrors ? "bg-warning" : "bg-success",
                    )}
                  />
                  {hasErrors
                    ? `${value.errors.length} error${value.errors.length > 1 ? "s" : ""}`
                    : t("post.widget.noErrors")}
                </Span>
              </Div>

              {/* Stat chips */}
              <Div className="grid grid-cols-2 gap-2">
                <Div className="rounded-xl border bg-muted/20 p-3 flex flex-col gap-0.5">
                  <Span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                    {t("post.response.checked")}
                  </Span>
                  <Span className="text-2xl font-bold font-mono tabular-nums">
                    {value.checked}
                  </Span>
                </Div>
                <Div
                  className={cn(
                    "rounded-xl border p-3 flex flex-col gap-0.5",
                    value.reminded > 0
                      ? "bg-primary/5 border-primary/15"
                      : "bg-muted/20",
                  )}
                >
                  <Span
                    className={cn(
                      "text-[10px] uppercase tracking-wide font-semibold",
                      value.reminded > 0
                        ? "text-primary/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {t("post.response.reminded")}
                  </Span>
                  <Span
                    className={cn(
                      "text-2xl font-bold font-mono tabular-nums",
                      value.reminded > 0 ? "text-primary" : "",
                    )}
                  >
                    {value.reminded}
                  </Span>
                </Div>
              </Div>

              {/* Errors */}
              {hasErrors && (
                <Div className="rounded-xl border border-destructive/20 bg-destructive/5 overflow-hidden">
                  <Div className="flex items-center gap-2 px-3 py-2 border-b border-destructive/15">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    <Span className="text-[11px] font-semibold text-destructive uppercase tracking-wide">
                      {`${value.errors.length} error${value.errors.length > 1 ? "s" : ""}`}
                    </Span>
                  </Div>
                  <Div className="p-3 flex flex-col gap-1">
                    {value.errors.map((err, i) => (
                      <Span
                        key={i}
                        className="text-xs text-destructive font-mono leading-snug"
                      >
                        {err}
                      </Span>
                    ))}
                  </Div>
                </Div>
              )}

              {/* Footer */}
              {!hasErrors && (
                <Div className="flex items-center pt-2 border-t border-border/40 mt-auto">
                  <Span className="text-[10px] font-mono text-muted-foreground/60">
                    {t("post.widget.noErrors")}
                  </Span>
                </Div>
              )}
            </Div>
          </SectionCard>
        )}

        {/* ── Run button ── */}
        <Button
          type="button"
          variant="default"
          size="sm"
          className="w-full gap-2 h-10 text-sm font-semibold"
          onClick={handleRun}
        >
          <Bell className="h-4 w-4" />
          {value ? t("post.widget.runAgain") : t("post.widget.run")}
        </Button>
      </Div>
    </Div>
  );
}
