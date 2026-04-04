/**
 * Custom Widget for Test Results (React Web)
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";

import type definition from "./definition";
import type { TestResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: TestResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function TestResultWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const value = field.value;
  if (!value) {
    return <Div />;
  }

  const durationSec = (value.duration / 1000).toFixed(2);

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header with status */}
      <Div className="flex items-center gap-3">
        <Span
          className={`text-2xl font-bold ${value.success ? "text-green-500" : "text-red-500"}`}
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
