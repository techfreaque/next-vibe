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
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
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
        <Div className="rounded-lg border border-success/30 bg-success/10 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-success shrink-0" />
          <Span className="text-sm font-medium text-success-foreground">
            {t("post.success.title")}
          </Span>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />
      </Div>

      <Div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <Span>{t("post.description")}</Span>
      </Div>

      <TextareaFieldWidget field={children.reason} fieldName="reason" />
    </Div>
  );
}
