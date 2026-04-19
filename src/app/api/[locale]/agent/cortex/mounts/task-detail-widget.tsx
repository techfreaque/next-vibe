/**
 * Task Detail Widget — domain enrichment for /tasks/ paths
 *
 * Renders a compact task card below the Cortex operation summary
 * showing the task's identity in a domain-aware format.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { SquareCheck } from "next-vibe-ui/ui/icons/SquareCheck";
import { Span } from "next-vibe-ui/ui/span";

interface TaskDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function TaskDetailWidget({
  path,
  label,
  mountLabel,
}: TaskDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-green-500/20 bg-green-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <SquareCheck className="h-4 w-4 text-green-500" />
          <Span className="text-sm font-medium text-green-700 dark:text-green-300">
            {mountLabel}
          </Span>
          <Span className="font-mono text-xs text-muted-foreground">
            {label}
          </Span>
          <Badge variant="outline" className="ml-auto text-xs">
            {path}
          </Badge>
        </Div>
      </CardContent>
    </Card>
  );
}
