/**
 * Import Job Retry Widget
 */
"use client";

import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle, RefreshCw } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useMemo } from "react";

import { useWidgetLocale } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { simpleT } from "@/i18n/core/shared";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ImportJobRetryContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const locale = useWidgetLocale();
  const t = useMemo(() => simpleT(locale).t, [locale]);

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.import.jobs.retry.widget.title")}
          </Span>
        </Div>
      </Div>
      {data && (
        <Div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <Span className="text-sm font-medium text-green-700 dark:text-green-300">
            {t("app.api.leads.import.jobs.retry.widget.successMessage")}
          </Span>
        </Div>
      )}
    </Div>
  );
}
