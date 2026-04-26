/**
 * Gen Detail Widget — domain enrichment for /gens/ paths
 *
 * Renders a compact card for AI-generated media files.
 * No single-item endpoint exists; shows path identity only.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Wand2 } from "next-vibe-ui/ui/icons/Wand2";
import { Span } from "next-vibe-ui/ui/span";

interface GenDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function GenDetailWidget({
  path,
  label,
  mountLabel,
}: GenDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-pink-500/20 bg-pink-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-pink-500" />
          <Span className="text-sm font-medium text-pink-700 dark:text-pink-300">
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
