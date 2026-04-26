/**
 * Custom Widget for Test Results (React Web)
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";

import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";

export function TestResultWidget(): React.JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  if (!value) {
    return <Div />;
  }

  const durationSec = (value.duration / 1000).toFixed(2);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header with status */}
      <Div className="flex items-center gap-3">
        <Span
          className={`text-2xl font-bold ${value.success ? "text-success" : "text-destructive"}`}
        >
          {value.success ? "Tests Passed" : "Tests Failed"}
        </Span>
        <Span className="text-sm text-muted-foreground">{durationSec}s</Span>
      </Div>

      {/* Test output */}
      <Div className="rounded-md bg-muted p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[600px]">
        <Span>{value.output}</Span>
      </Div>
    </Div>
  );
}
