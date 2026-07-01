"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { Keyboard } from "next-vibe/ui/web/ui/icons/Keyboard";
import { Loader2 } from "next-vibe/ui/web/ui/icons/Loader2";
import { MousePointer } from "next-vibe/ui/web/ui/icons/MousePointer";
import { RefreshCw } from "next-vibe/ui/web/ui/icons/RefreshCw";
import { Span } from "next-vibe/ui/web/ui/span";
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
import type { DesktopListWindowsResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type WindowInfo = NonNullable<
  DesktopListWindowsResponseOutput["windows"]
>[number];
type T = ReturnType<typeof useWidgetTranslation>;

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function WindowRow({
  w,
  isPickerMode,
  onPick,
  onFocus,
  onType,
  onKey,
  onMove,
  onA11y,
  t,
}: {
  w: WindowInfo;
  isPickerMode: boolean;
  onPick: (() => void) | undefined;
  onFocus: () => void;
  onType: () => void;
  onKey: () => void;
  onMove: () => void;
  onA11y: () => void;
  t: T;
}): JSX.Element {
  return (
    <Div
      className={`group flex items-center gap-3 px-4 py-3 border-b last:border-b-0 transition-colors${
        isPickerMode ? " hover:bg-accent cursor-pointer" : ""
      }`}
      onClick={isPickerMode ? onPick : undefined}
    >
      <Div className="shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center">
        <MousePointer className="h-4 w-4 text-muted-foreground" />
      </Div>
      <Div className="flex-1 min-w-0">
        <Span className="text-sm font-medium block truncate leading-tight">
          {truncate(w.title, 55)}
        </Span>
        <Div className="flex items-center gap-2 mt-0.5">
          <Span className="text-[11px] text-muted-foreground font-mono">
            {w.windowId}
          </Span>
          {w.monitor ? (
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1 h-4 font-normal"
            >
              {w.monitor}
            </Badge>
          ) : null}
          <Span className="text-[11px] text-muted-foreground">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            {w.width}×{w.height}
          </Span>
        </Div>
      </Div>
      {!isPickerMode ? (
        <Div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="default"
            className="h-7 text-xs px-2.5"
            onClick={onFocus}
          >
            {t("widget.actionFocus")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2"
            onClick={onType}
          >
            {t("widget.actionType")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2"
            onClick={onKey}
          >
            {t("widget.actionKey")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2"
            onClick={onMove}
          >
            {t("widget.actionMove")}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-2"
            onClick={onA11y}
          >
            {t("widget.actionA11y")}
          </Button>
        </Div>
      ) : null}
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ListWindowsWidget(_props: CustomWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const { push: navigate } = navigation;
  const t = useWidgetTranslation<typeof definition.POST>();
  const onPickRaw = usePickerCallback<{ id: string; title: string }>();
  const isPickerMode = !!onPickRaw;
  const onSubmit = useWidgetOnSubmit();

  useEffect((): void => {
    if (!data && onSubmit) {
      onSubmit();
    }
  }, [data, onSubmit]);

  const isLoading = !data;

  const title = data?.windows
    ? data.windows.length === 1
      ? t("widget.windowCount_one").replace("{{count}}", "1")
      : t("widget.windowCount_other").replace(
          "{{count}}",
          String(data.windows.length),
        )
    : t("widget.titleListWindows");

  const handleFocus = (windowId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../focus-window/definition");
      navigate(def.default.POST, {
        data: { windowId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleType = (windowId: string, windowTitle: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../type-text/definition");
      navigate(def.default.POST, {
        data: { windowId, windowTitle },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleKey = (windowId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../press-key/definition");
      navigate(def.default.POST, {
        data: { windowId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleMove = (windowId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../move-window-to-monitor/definition");
      navigate(def.default.POST, {
        data: { windowId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleA11y = (windowTitle: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../get-accessibility-tree/definition");
      navigate(def.default.POST, {
        data: { appName: windowTitle },
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
        <Div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Div>
      ) : data?.windows && data.windows.length > 0 ? (
        <Div className="flex-1 overflow-y-auto">
          {data.windows.map((w) => (
            <WindowRow
              key={w.windowId}
              w={w}
              isPickerMode={isPickerMode}
              onPick={
                onPickRaw
                  ? (): void => onPickRaw({ id: w.windowId, title: w.title })
                  : undefined
              }
              t={t}
              onFocus={(): void => handleFocus(w.windowId)}
              onType={(): void => handleType(w.windowId, w.title)}
              onKey={(): void => handleKey(w.windowId)}
              onMove={(): void => handleMove(w.windowId)}
              onA11y={(): void => handleA11y(w.title)}
            />
          ))}
        </Div>
      ) : (
        <Div className="flex flex-col items-center justify-center py-16 gap-2 text-muted-foreground">
          <Keyboard className="h-8 w-8 opacity-30" />
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
