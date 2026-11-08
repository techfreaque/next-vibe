/**
 * Platform Mailbox - Read message widget (web, CLI, MCP, AI, native)
 */

"use client";

import { Div } from "next-vibe/ui/components/div";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function SystemMailMessageContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  return (
    <WidgetShell className="gap-4">
      <WidgetHeader
        title={data?.subject || t("message.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          data?.unread ? (
            <StatusPill
              status="unread"
              variant="info"
              label={t("message.widget.unread")}
            />
          ) : null
        }
      />
      <Div className="flex items-end gap-3">
        <Div className="flex-1">
          <NumberFieldWidget
            fieldName="messageUid"
            field={children.messageUid}
          />
        </Div>
        <SubmitButtonWidget<typeof definition.GET>
          field={{
            text: "message.widget.submit",
            loadingText: "message.widget.submitting",
            icon: "mail-open",
            variant: "primary",
            size: "sm",
          }}
        />
      </Div>

      {data ? (
        <SectionGroup title={data.subject || t("message.widget.noSubject")}>
          <DetailGrid columns={2}>
            <DetailField label={t("message.response.from")} value={data.from} />
            <DetailField label={t("message.response.to")} value={data.to} />
            <DetailField
              label={t("message.response.date")}
              value={data.date.slice(0, 16).replace("T", " ")}
            />
            <DetailField
              label={t("message.response.messageId")}
              value={data.messageId}
              mono
            />
          </DetailGrid>
          <P className="mt-4 whitespace-pre-wrap text-sm">{data.bodyText}</P>
        </SectionGroup>
      ) : null}
    </WidgetShell>
  );
}
