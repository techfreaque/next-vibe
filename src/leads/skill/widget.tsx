/**
 * Lead Skill Attribution Widget
 *
 * The product calls this endpoint silently when a visitor favorites a skill
 * (first-touch attribution). This surface lets the same call be made by hand:
 * skill id in, attribution outcome out.
 */

"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Info } from "next-vibe/ui/components/icons/Info";
import { Zap } from "next-vibe/ui/components/icons/Zap";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { UuidFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/uuid-field/widget";
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
  const platform = useWidgetPlatform();
  const isCli = platform === Platform.CLI || platform === Platform.MCP;

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

  const form = (
    <>
      <FormAlertWidget field={{}} />
      <UuidFieldWidget fieldName="skillId" field={children.skillId} />
      <SubmitButtonWidget<typeof definition.PATCH>
        field={{ text: "patch.submit", icon: "zap", variant: "primary" }}
      />
    </>
  );

  if (isCli) {
    return (
      <Div className="flex flex-col gap-2">
        {outcome}
        {form}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex flex-col gap-1 pb-2 border-b">
        <Div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">{t("patch.title")}</Span>
        </Div>
        <Span className="text-sm text-muted-foreground">
          {t("patch.description")}
        </Span>
      </Div>
      {outcome}
      {form}
    </Div>
  );
}
