/**
 * Search Detail Widget — domain enrichment for /searches/ paths
 *
 * Renders a compact search card below the Cortex operation summary
 * showing the search query in a domain-aware format.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Span } from "next-vibe-ui/ui/span";

interface SearchDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function SearchDetailWidget({
  path,
  label,
  mountLabel,
}: SearchDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-indigo-500/20 bg-indigo-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-indigo-500" />
          <Span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
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
