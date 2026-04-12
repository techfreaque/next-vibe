/**
 * Custom Widget for Skill Publish
 * Status selector + change note + submit. Shows publish confirmation on success.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Span } from "next-vibe-ui/ui/span";
import { type JSX } from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import { SkillStatus } from "../../enum";
import type definition from "./definition";
import type { SkillPublishPatchResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: SkillPublishPatchResponseOutput | null | undefined;
  } & (typeof definition.PATCH)["fields"];
}

export function SkillPublishContainer({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation<typeof definition.PATCH>();

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-row gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <SubmitButtonWidget<typeof definition.PATCH>
          field={children.submitButton}
        />
      </Div>
      {/* Success banner after publish */}
      {data?.status_response === SkillStatus.PUBLISHED && (
        <Div className="rounded-lg border border-success/30 bg-success/10 p-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-success shrink-0" />
          <Span className="text-sm font-medium text-success-foreground">
            {t("patch.success.title")}
          </Span>
        </Div>
      )}

      <SelectFieldWidget field={children.status} fieldName="status" />

      <TextareaFieldWidget field={children.changeNote} fieldName="changeNote" />
    </Div>
  );
}
