"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Span } from "next-vibe/ui/components/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useEffect } from "react";

import { DesktopNavHeader } from "../shared/nav-header";
import type definition from "./definition";
import type { DesktopListMonitorsResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type MonitorInfo = NonNullable<
  DesktopListMonitorsResponseOutput["monitors"]
>[number];
type T = ReturnType<typeof useWidgetTranslation>;

function MonitorCard({
  m,
  isPickerMode,
  onPick,
  onScreenshot,
  onMoveWindow,
  t,
}: {
  m: MonitorInfo;
  isPickerMode: boolean;
  onPick: (() => void) | undefined;
  onScreenshot: () => void;
  onMoveWindow: () => void;
  t: T;
}): JSX.Element {
  return (
    <Div
      className={`group relative flex flex-col gap-2 rounded-lg border p-4 transition-colors${
        isPickerMode
          ? " hover:bg-accent cursor-pointer"
          : m.primary
            ? " border-primary/40 bg-primary/5"
            : " border-border bg-card"
      }`}
      onClick={isPickerMode ? onPick : undefined}
    >
      <Div className="flex items-center justify-between gap-2">
        <Div className="flex items-center gap-2 min-w-0">
          <Monitor className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Span className="font-semibold text-sm font-mono truncate">
            {m.name}
          </Span>
        </Div>
        {m.primary ? (
          <Badge className="text-[10px] h-5 px-1.5 shrink-0">
            {t("widget.labelPrimary")}
          </Badge>
        ) : (
          <Span className="text-xs text-muted-foreground shrink-0">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            #{m.index}
          </Span>
        )}
      </Div>
      <Div className="text-xs text-muted-foreground font-mono">
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        {m.width}×{m.height}
        <Span className="mx-1.5 opacity-40">/</Span>
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        {m.x},{m.y}
      </Div>
      {!isPickerMode ? (
        <Div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs flex-1"
            onClick={onScreenshot}
          >
            {t("widget.actionScreenshot")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs flex-1"
            onClick={onMoveWindow}
          >
            {t("widget.actionMoveWindowHere")}
          </Button>
        </Div>
      ) : null}
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ListMonitorsWidget(_props: CustomWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const { push: navigate } = navigation;
  const t = useWidgetTranslation<typeof definition.POST>();
  const onPickRaw = usePickerCallback<{ id: string; name: string }>();
  const isPickerMode = !!onPickRaw;
  const onSubmit = useWidgetOnSubmit();

  useEffect((): void => {
    if (!data && onSubmit) {
      onSubmit();
    }
  }, [data, onSubmit]);

  const isLoading = !data;

  const title = data?.monitors
    ? t("widget.windowCount_other").replace(
        "{{count}}",
        String(data.monitors.length),
      )
    : t("widget.titleListMonitors");

  const handleScreenshot = (monitorName: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../take-screenshot/definition");
      navigate(def.default.POST, {
        data: { monitorName },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleMoveWindow = (monitorName: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../move-window-to-monitor/definition");
      navigate(def.default.POST, {
        data: { monitorName },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader
        title={String(title)}
        right={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={(): void => {
              onSubmit?.();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
          </Button>
        }
      />

      {isLoading ? (
        <Div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Div>
      ) : data?.monitors && data.monitors.length > 0 ? (
        <Div className="flex-1 overflow-y-auto p-4">
          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.monitors.map((m) => (
              <MonitorCard
                key={m.name}
                m={m}
                isPickerMode={isPickerMode}
                onPick={
                  onPickRaw
                    ? (): void => onPickRaw({ id: m.name, name: m.name })
                    : undefined
                }
                t={t}
                onScreenshot={(): void => handleScreenshot(m.name)}
                onMoveWindow={(): void => handleMoveWindow(m.name)}
              />
            ))}
          </Div>
        </Div>
      ) : (
        <Div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
          <Monitor className="h-8 w-8 opacity-30" />
          <Span className="text-sm">{t("widget.noWindows")}</Span>
        </Div>
      )}

      {data?.error ? (
        <Div className="px-4 py-3 border-t">
          <Span className="text-sm text-destructive">{data.error}</Span>
        </Div>
      ) : null}
    </Div>
  );
}
