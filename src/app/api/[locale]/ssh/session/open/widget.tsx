/**
 * Session Open Widget - minimal, used internally by terminal widget
 */
"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { SessionOpenResponseOutput } from "./definition";

interface WidgetProps {
  field: {
    value: SessionOpenResponseOutput | null | undefined;
  } & (typeof endpoints.POST)["fields"];
  fieldName: string;
}

export function SessionOpenContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  return (
    <Div className="px-4 py-3">
      <Span className="text-sm text-muted-foreground">
        {field.value?.sessionId ??
          t("app.api.ssh.terminal.widget.disconnected")}
      </Span>
    </Div>
  );
}
