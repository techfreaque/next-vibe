/**
 * Document Detail Widget - domain enrichment for /documents/ paths
 *
 * Renders a compact document card below the Cortex operation summary
 * showing the document's path in a domain-aware format.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { FileText } from "next-vibe-ui/ui/icons/FileText";
import { Span } from "next-vibe-ui/ui/span";

interface DocumentDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function DocumentDetailWidget({
  path,
  label,
  mountLabel,
}: DocumentDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <Span className="text-sm font-medium text-blue-700 dark:text-blue-300">
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
