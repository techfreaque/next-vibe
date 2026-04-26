/**
 * Custom Widget for Email Preview Send Test
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/widget";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function EmailPreviewSendTestContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("preview.sendTest.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        <Div className="flex flex-col gap-3">
          <TextFieldWidget
            fieldName={"templateId"}
            field={children.templateId}
          />
          <EmailFieldWidget
            fieldName={"recipientEmail"}
            field={children.recipientEmail}
          />
          <Div className="grid grid-cols-2 gap-3">
            <SelectFieldWidget
              fieldName={"language"}
              field={children.language}
            />
            <SelectFieldWidget fieldName={"country"} field={children.country} />
          </Div>
        </Div>

        {/* Result */}
        {result !== null && result !== undefined && (
          <Div className="rounded-lg border p-4 flex flex-col gap-2">
            <Div
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: result.success ? "#22c55e" : "#ef4444",
              }}
            >
              {result.success
                ? t("preview.sendTest.success")
                : t("preview.sendTest.failed")}
            </Div>
            <Span className="text-sm">{result.message}</Span>
          </Div>
        )}

        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "preview.sendTest.submit",
              loadingText: "preview.sendTest.submitting",
              icon: "send",
              variant: "primary",
              size: "sm",
            }}
          />
        </Div>
      </Div>
    </Div>
  );
}
