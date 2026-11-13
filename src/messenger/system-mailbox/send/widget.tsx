/**
 * Platform Mailbox - Send widget (web, CLI, MCP, AI, native)
 */

"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { TextareaFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/textarea-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function SystemMailSendContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  return (
    <WidgetShell className="gap-4">
      <WidgetHeader
        title={t("send.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
      />
      <Div className="flex flex-col gap-4">
        <TextFieldWidget fieldName="to" field={children.to} />
        <TextFieldWidget fieldName="subject" field={children.subject} />
        <TextareaFieldWidget fieldName="body" field={children.body} />
        <TextareaFieldWidget fieldName="html" field={children.html} />
        <FormAlertWidget field={{}} />
        <Div className="flex justify-end">
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "send.widget.submit",
              loadingText: "send.widget.submitting",
              icon: "send",
              variant: "primary",
              size: "sm",
            }}
          />
        </Div>
      </Div>

      {result !== null && result !== undefined && "messageId" in result && (
        <SectionGroup title={t("send.widget.sent")}>
          <DetailGrid columns={2}>
            <DetailField label={t("send.response.from")} value={result.from} />
            <DetailField
              label={t("send.response.to")}
              value={result.toAddress}
            />
            <DetailField
              label={t("send.response.messageId")}
              value={result.messageId}
              mono
            />
            <DetailField
              label={t("send.response.storedInSent")}
              value={
                result.storedInSent
                  ? t("send.widget.filed")
                  : t("send.widget.notFiled")
              }
            />
            <DetailField
              label={t("send.response.sentLastHour")}
              value={`${result.sentLastHour} / ${result.rateLimitPerHour}`}
            />
          </DetailGrid>
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
