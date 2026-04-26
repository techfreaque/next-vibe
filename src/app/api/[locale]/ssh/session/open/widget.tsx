/**
 * Session Open Widget - minimal, used internally by terminal widget
 */
"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";

export function SessionOpenContainer(): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const data = useWidgetValue<typeof endpoints.POST>();
  return (
    <Div className="px-4 py-3">
      <Span className="text-sm text-muted-foreground">
        {data?.sessionId ?? t("session.open.post.disconnected")}
      </Span>
    </Div>
  );
}
