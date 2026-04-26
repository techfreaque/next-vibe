/**
 * Upload Detail Widget - domain enrichment for /uploads/ paths
 *
 * Renders a compact upload card below the Cortex operation summary
 * showing the file's identity in a domain-aware format.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Paperclip } from "next-vibe-ui/ui/icons/Paperclip";
import { Span } from "next-vibe-ui/ui/span";

interface UploadDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function UploadDetailWidget({
  path,
  label,
  mountLabel,
}: UploadDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-orange-500/20 bg-orange-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-orange-500" />
          <Span className="text-sm font-medium text-orange-700 dark:text-orange-300">
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
