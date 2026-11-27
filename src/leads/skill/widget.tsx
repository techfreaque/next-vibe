/**
 * Lead Skill Attribution Widget
 *
 * The product calls this endpoint silently when a visitor favorites a skill
 * (first-touch attribution). This surface lets the same call be made by hand:
 * choose a skill and see whether the lead was attributed.
 */

"use client";

import { SkillSourceFilter } from "next-vibe/agent/skills/enum";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import React from "react";

import type definition from "./definition";

interface LeadSkillWidgetProps {
  field: (typeof definition.PATCH)["fields"];
}

export function LeadSkillWidget({
  field,
}: LeadSkillWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.PATCH>();
  const t = useWidgetTranslation<typeof definition.PATCH>();

  const outcome =
    data?.success === true ? (
      <Div className="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4">
        <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
        <Div className="flex flex-col gap-0.5">
          <Span className="font-semibold">{t("patch.success.title")}</Span>
          <Span className="text-sm text-muted-foreground">
            {t("patch.success.description")}
          </Span>
        </Div>
      </Div>
    ) : data?.success === false ? (
      <Div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
        <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <Div className="flex flex-col gap-0.5">
          <Span className="font-semibold">{t("patch.skipped.title")}</Span>
          <Span className="text-sm text-muted-foreground">
            {t("patch.skipped.description")}
          </Span>
        </Div>
      </Div>
    ) : null;

  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("patch.title")}
        subtitle={t("patch.description")}
      />
      {outcome}
      <FormAlertWidget field={{}} />
      <EntityPickerFieldWidget
        fieldName="skillId"
        field={children.skillId}
        listData={{ sourceFilter: SkillSourceFilter.COMMUNITY }}
      />
      <SubmitButtonWidget<typeof definition.PATCH>
        field={{
          text: "patch.submit",
          icon: "zap",
          variant: "primary",
          className: "min-h-10 self-stretch @md:self-end",
        }}
      />
    </WidgetShell>
  );
}
