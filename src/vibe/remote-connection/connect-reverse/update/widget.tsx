/**
 * Reverse Connection Update Widget
 * System-internal endpoint — called machine-to-machine to mirror syncScope.
 * No user interaction needed.
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/ui/card";
import { Div } from "next-vibe/ui/ui/div";
import { RefreshCw } from "next-vibe/ui/ui/icons/RefreshCw";
import type { JSX } from "react";

import { useWidgetLocale } from "../../../unified-ui/_shared/use-widget-context";
import { scopedTranslation } from "./i18n";

export function ReverseConnectionUpdateWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Card>
      <CardHeader>
        <Div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">{t("widget.title")}</CardTitle>
        </Div>
        <CardDescription>{t("widget.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Div className="text-xs text-muted-foreground">{t("widget.note")}</Div>
      </CardContent>
    </Card>
  );
}
