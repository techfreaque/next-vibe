/**
 * Import Job Stop Widget
 */
"use client";

import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle, XCircle } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ImportJobStopContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <XCircle className="h-5 w-5 text-destructive" />
          <Span className="font-semibold text-base text-destructive">
            {t("app.api.leads.import.jobs.stop.widget.title")}
          </Span>
        </Div>
      </Div>
      {data && (
        <Div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <Span className="text-sm font-medium text-green-700 dark:text-green-300">
            {t("app.api.leads.import.jobs.stop.widget.successMessage")}
          </Span>
        </Div>
      )}
    </Div>
  );
}
