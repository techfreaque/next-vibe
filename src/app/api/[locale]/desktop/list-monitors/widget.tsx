/**
 * List Monitors Widget
 * No form (no inputs). Result: responsive grid of monitor cards.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Monitor } from "next-vibe-ui/ui/icons/Monitor";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import type { DesktopListMonitorsResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type MonitorInfo = NonNullable<
  DesktopListMonitorsResponseOutput["monitors"]
>[number];

function MonitorCard({ m }: { m: MonitorInfo }): JSX.Element {
  return (
    <Div
      className={`flex flex-col gap-2 rounded-lg border p-4 ${
        m.primary ? "border-primary/50 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <Div className="flex items-center justify-between gap-2">
        <Div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
          <Span className="font-medium text-sm font-mono">{m.name}</Span>
        </Div>
        {m.primary ? (
          <Badge className="text-xs shrink-0">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            Primary
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs shrink-0">
            #{m.index}
          </Badge>
        )}
      </Div>

      <Div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <Span>
          {m.width}
          {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}×
          {m.height}
        </Span>
        <Span>
          at {m.x},{m.y}
        </Span>
      </Div>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ListMonitorsWidget(_props: CustomWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.POST> field={{}} />

      {data?.monitors?.length ? (
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.monitors.map((m) => (
            <MonitorCard key={m.name} m={m} />
          ))}
        </Div>
      ) : data?.success === false && data.error ? (
        <Span className="text-sm text-destructive">{data.error}</Span>
      ) : null}
    </Div>
  );
}
