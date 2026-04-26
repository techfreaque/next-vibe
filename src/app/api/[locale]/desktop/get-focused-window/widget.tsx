/**
 * Get Focused Window Widget
 * No form. Result: card showing title, PID, window ID.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GetFocusedWindowWidget(_props: CustomWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST> field={{}} />

      {data?.success && data.windowTitle ? (
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Span className="text-base font-semibold">{data.windowTitle}</Span>
          <Div className="flex flex-wrap gap-2">
            {data.pid !== null && data.pid !== undefined ? (
              <Badge variant="secondary" className="font-mono text-xs">
                {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
                pid: {data.pid}
              </Badge>
            ) : null}
            {data.windowId ? (
              <Badge variant="outline" className="font-mono text-xs">
                {data.windowId}
              </Badge>
            ) : null}
          </Div>
        </Div>
      ) : data?.error ? (
        <Span className="text-sm text-destructive">{data.error}</Span>
      ) : null}
    </Div>
  );
}
