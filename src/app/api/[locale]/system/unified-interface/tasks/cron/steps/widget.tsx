/**
 * Widget for Cron Task Steps Editor
 * Renders a summary after the steps PUT form submits successfully.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import type endpoints from "./definition";
import type { CronTaskStepsPutResponseOutput } from "./definition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WidgetProps {
  field: {
    value: CronTaskStepsPutResponseOutput | null | undefined;
  } & (typeof endpoints.PUT)["fields"];
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Widget — shown after a successful steps save
// ---------------------------------------------------------------------------

export function CronTaskStepsContainer({
  field,
}: WidgetProps): React.ReactNode {
  const value = field.value;

  if (!value?.task) {
    return null;
  }

  const stepsRaw = (
    value.task.defaultConfig as Record<string, Array<Record<string, string>>>
  )?.steps;
  const count = Array.isArray(stepsRaw) ? stepsRaw.length : 0;

  return (
    <Div className="rounded-md border p-4 bg-muted/40 text-sm space-y-1">
      <Div className="font-semibold">{value.task.displayName}</Div>
      <Div className="text-muted-foreground font-mono text-xs">
        {value.task.routeId}
      </Div>
      <Div className="text-muted-foreground">
        <Span>
          {count} {count === 1 ? "step" : "steps"} configured
        </Span>
      </Div>
    </Div>
  );
}
