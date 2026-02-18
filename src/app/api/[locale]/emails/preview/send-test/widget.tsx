/**
 * Custom Widget for Email Preview Send Test
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type ResponseOutput = (typeof definition.POST)["types"]["ResponseOutput"];

interface CustomWidgetProps {
  field: {
    value: ResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function EmailPreviewSendTestContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation();
  const result = field.value;

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.preview.sendTest.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        <Div className="flex flex-col gap-3">
          <TextFieldWidget
            fieldName={`${fieldName}.templateId`}
            field={children.templateId}
          />
          <EmailFieldWidget
            fieldName={`${fieldName}.recipientEmail`}
            field={children.recipientEmail}
          />
          <Div className="grid grid-cols-2 gap-3">
            <SelectFieldWidget
              fieldName={`${fieldName}.language`}
              field={children.language}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.country`}
              field={children.country}
            />
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
                ? t("app.api.emails.preview.sendTest.success")
                : t("app.api.emails.preview.sendTest.failed")}
            </Div>
            <Span className="text-sm">{result.message}</Span>
          </Div>
        )}

        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget
            field={{
              text: "app.api.emails.preview.sendTest.submit",
              loadingText: "app.api.emails.preview.sendTest.submitting",
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
