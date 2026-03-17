/**
 * Custom Widget for Skill Report
 * Reason textarea + submit, with confirmation state after reporting
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { SkillReportPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: SkillReportPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function SkillReportContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation<typeof definition.POST>();

  if (data?.reported) {
    return (
      <Div className="flex flex-col gap-4 p-4">
        <Div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
          <Span className="text-sm font-medium text-green-700 dark:text-green-300">
            {t("post.success.title")}
          </Span>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
        <Span>{t("post.description")}</Span>
      </Div>

      <TextareaFieldWidget field={children.reason} fieldName="reason" />

      <SubmitButtonWidget<typeof definition.POST>
        field={{
          text: "post.button.submit",
          loadingText: "post.button.loading",
          icon: "alert-triangle",
          variant: "destructive",
          className: "w-full",
        }}
      />
    </Div>
  );
}
