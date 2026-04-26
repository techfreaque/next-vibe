/**
 * Memory Detail Widget - domain enrichment for /memories/ paths
 *
 * Renders a compact memory card below the Cortex operation summary
 * showing the memory's metadata (path, tags, priority) in a
 * domain-aware format instead of raw file info.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Brain } from "next-vibe-ui/ui/icons/Brain";
import { Span } from "next-vibe-ui/ui/span";

interface MemoryDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function MemoryDetailWidget({
  path,
  label,
  mountLabel,
}: MemoryDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-purple-500/20 bg-purple-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-500" />
          <Span className="text-sm font-medium text-purple-700 dark:text-purple-300">
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
