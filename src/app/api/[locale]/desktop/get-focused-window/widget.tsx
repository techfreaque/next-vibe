"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Camera } from "next-vibe-ui/ui/icons/Camera";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { Keyboard } from "next-vibe-ui/ui/icons/Keyboard";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Type } from "next-vibe-ui/ui/icons/Type";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useEffect } from "react";

import {
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";

import { DesktopNavHeader } from "../shared/nav-header";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GetFocusedWindowWidget(_props: CustomWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const { push: navigate } = navigation;
  const t = useWidgetTranslation<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();

  useEffect((): void => {
    if (!data && onSubmit) {
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = !data;

  const handleType = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../type-text/definition");
      navigate(def.default.POST, {
        data: { windowId: data?.windowId, windowTitle: data?.windowTitle },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleKey = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../press-key/definition");
      navigate(def.default.POST, {
        data: { windowId: data?.windowId },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleScreenshot = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../take-screenshot/definition");
      navigate(def.default.POST, {
        data: { monitorName: data?.monitor },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  const handleA11y = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../get-accessibility-tree/definition");
      navigate(def.default.POST, {
        data: { appName: data?.windowTitle },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  };

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader
        title={String(data?.windowTitle ?? t("widget.titleGetFocusedWindow"))}
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
        <Div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Div>
      ) : data?.success && data.windowTitle ? (
        <Div className="flex flex-col gap-5 p-4">
          <Div className="flex flex-col gap-2">
            <Span className="text-base font-semibold leading-tight">
              {data.windowTitle}
            </Span>
            <Div className="flex flex-wrap gap-1.5">
              {data.pid !== null && data.pid !== undefined ? (
                <Badge variant="secondary" className="font-mono text-xs">
                  {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                  pid:{data.pid}
                </Badge>
              ) : null}
              {data.windowId ? (
                <Badge variant="outline" className="font-mono text-xs">
                  {data.windowId}
                </Badge>
              ) : null}
              {data.width !== null &&
              data.width !== undefined &&
              data.height !== null &&
              data.height !== undefined ? (
                <Badge variant="outline" className="text-xs font-mono">
                  {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                  {data.width}×{data.height}
                </Badge>
              ) : null}
              {data.monitor ? (
                <Badge variant="outline" className="text-xs">
                  {data.monitor}
                </Badge>
              ) : null}
            </Div>
          </Div>

          <Div className="grid grid-cols-2 gap-2">
            <Button
              variant="default"
              className="h-9 gap-2 text-sm"
              onClick={handleType}
            >
              <Type className="h-4 w-4" />
              {t("widget.actionTypeText")}
            </Button>
            <Button
              variant="outline"
              className="h-9 gap-2 text-sm"
              onClick={handleKey}
            >
              <Keyboard className="h-4 w-4" />
              {t("widget.actionPressKey")}
            </Button>
            {data.monitor ? (
              <Button
                variant="outline"
                className="h-9 gap-2 text-sm"
                onClick={handleScreenshot}
              >
                <Camera className="h-4 w-4" />
                {t("widget.actionScreenshot")}
              </Button>
            ) : null}
            <Button
              variant="ghost"
              className="h-9 gap-2 text-sm"
              onClick={handleA11y}
            >
              <Eye className="h-4 w-4" />
              {t("widget.actionA11yTree")}
            </Button>
          </Div>
        </Div>
      ) : data?.error ? (
        <Div className="p-4">
          <Span className="text-sm text-destructive">{data.error}</Span>
        </Div>
      ) : null}
    </Div>
  );
}
