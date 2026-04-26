/**
 * Thread Detail Widget — domain enrichment for /threads/ paths
 *
 * Renders a compact thread card below the Cortex operation summary
 * showing the thread's identity in a domain-aware format.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { MessageSquare } from "next-vibe-ui/ui/icons/MessageSquare";
import { Span } from "next-vibe-ui/ui/span";

interface ThreadDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function ThreadDetailWidget({
  path,
  label,
  mountLabel,
}: ThreadDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-cyan-500/20 bg-cyan-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-cyan-500" />
          <Span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
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
