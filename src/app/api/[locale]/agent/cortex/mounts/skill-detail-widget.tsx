/**
 * Skill Detail Widget — domain enrichment for /skills/ paths
 *
 * Renders a compact skill card below the Cortex operation summary
 * showing the skill's identity in a domain-aware format.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Card, CardContent } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Span } from "next-vibe-ui/ui/span";

interface SkillDetailWidgetProps {
  path: string;
  label: string;
  mountLabel: string;
}

export function SkillDetailWidget({
  path,
  label,
  mountLabel,
}: SkillDetailWidgetProps): React.JSX.Element {
  return (
    <Card className="border-amber-500/20 bg-amber-500/5">
      <CardContent className="p-3">
        <Div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          <Span className="text-sm font-medium text-amber-700 dark:text-amber-300">
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
