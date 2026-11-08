/**
 * Platform Mailbox - Daily report widget (web, CLI, MCP, AI, native)
 */

"use client";

import { Div } from "next-vibe/ui/components/div";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function SystemMailReportContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();

  return (
    <WidgetShell className="gap-4">
      <WidgetHeader
        title={t("report.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
      />
      <Div className="grid grid-cols-3 items-end gap-3">
        <Div className="col-span-2">
          <TextFieldWidget fieldName="to" field={children.to} />
        </Div>
        <BooleanFieldWidget fieldName="dryRun" field={children.dryRun} />
      </Div>
      <FormAlertWidget field={{}} />
      <Div className="flex justify-end">
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "report.widget.submit",
            loadingText: "report.widget.submitting",
            icon: "send",
            variant: "primary",
            size: "sm",
          }}
        />
      </Div>

      {result !== null && result !== undefined && "body" in result && (
        <SectionGroup title={result.subject}>
          <Div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusPill
              status={result.sent ? "sent" : "preview"}
              variant={result.sent ? "success" : "muted"}
              label={
                result.sent
                  ? t("report.widget.sent")
                  : t("report.widget.preview")
              }
            />
            {result.recipient ? (
              <StatusPill
                status="recipient"
                variant="info"
                label={result.recipient}
              />
            ) : null}
          </Div>
          <P className="whitespace-pre-wrap font-mono text-xs">{result.body}</P>
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
