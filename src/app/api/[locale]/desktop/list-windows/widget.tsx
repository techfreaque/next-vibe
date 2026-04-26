/**
 * List Windows Widget
 * No form. Result: table of windows with focus action on each row.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import type { DesktopListWindowsResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type WindowInfo = NonNullable<
  DesktopListWindowsResponseOutput["windows"]
>[number];

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function WindowRow({
  w,
  onFocus,
}: {
  w: WindowInfo;
  onFocus: () => void;
}): JSX.Element {
  return (
    <Div className="flex items-center justify-between gap-3 py-3 px-1 border-b last:border-b-0">
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Span className="text-sm font-medium truncate">
          {truncate(w.title, 55)}
        </Span>
        <Div className="flex gap-3 text-xs text-muted-foreground">
          <Span className="font-mono">{w.windowId}</Span>
          {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
          <Span>pid:{w.pid}</Span>
          <Span>
            {w.width}
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            ×{w.height}
          </Span>
          <Badge variant="outline" className="text-xs py-0 h-4">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            Desktop {w.desktopId}
          </Badge>
        </Div>
      </Div>
      <Button
        size="sm"
        variant="outline"
        className="shrink-0 text-xs h-7"
        onClick={onFocus}
      >
        {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
        Focus
      </Button>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ListWindowsWidget(_props: CustomWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();

  const handleFocus = (windowId: string): void => {
    void (async (): Promise<void> => {
      const focusDef = await import("../focus-window/definition");
      navigation.push(focusDef.default.POST, {
        data: { windowId },
        popNavigationOnSuccess: 1,
      });
    })();
  };

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.POST> field={{}} />

      {data?.windows?.length ? (
        <Div className="rounded-lg border overflow-hidden">
          {data.windows.map((w) => (
            <WindowRow
              key={w.windowId}
              w={w}
              onFocus={(): void => handleFocus(w.windowId)}
            />
          ))}
          <Div className="px-1 py-2 text-xs text-muted-foreground">
            {data.windows.length} window
            {data.windows.length === 1 ? "" : "s"}
          </Div>
        </Div>
      ) : data?.success && data.windows?.length === 0 ? (
        <Span className="text-sm text-muted-foreground text-center py-6 block">
          {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
          No open windows found
        </Span>
      ) : null}
    </Div>
  );
}
