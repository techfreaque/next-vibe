/**
 * Import Job Retry Widget
 */
"use client";

import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React, { useMemo } from "react";

import {
  useWidgetLocale,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";

import type definition from "./definition";
import { scopedTranslation } from "./i18n";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ImportJobRetryContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const locale = useWidgetLocale();
  const t = useMemo(() => scopedTranslation.scopedT(locale).t, [locale]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">{t("widget.title")}</Span>
        </Div>
      </Div>
      {data && (
        <Div className="rounded-lg border border-success/30 bg-success/10 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
          <Span className="text-sm font-medium text-success-foreground">
            {t("widget.successMessage")}
          </Span>
        </Div>
      )}
    </Div>
  );
}
