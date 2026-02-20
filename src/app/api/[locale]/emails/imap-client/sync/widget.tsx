/**
 * Custom Widget for IMAP Full Sync
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { TextareaFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/textarea-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { ImapSyncPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapSyncPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ImapSyncContainer({
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
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.sync.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        {/* Options */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.sync.widget.options")}
          </Span>
          <TextareaFieldWidget
            fieldName={`${fieldName}.accountIds`}
            field={children.accountIds}
          />
          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget
              fieldName={`${fieldName}.force`}
              field={children.force}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.dryRun`}
              field={children.dryRun}
            />
          </Div>
          <NumberFieldWidget
            fieldName={`${fieldName}.maxMessages`}
            field={children.maxMessages}
          />
        </Div>

        {/* Result */}
        {result !== null && result !== undefined && (
          <Div className="rounded-lg border p-4 flex flex-col gap-2">
            <Span className="text-sm font-semibold">
              {t("app.api.emails.imapClient.sync.widget.result")}
            </Span>
            {[
              ["accountsProcessed", result.accountsProcessed],
              ["foldersProcessed", result.foldersProcessed],
              ["messagesProcessed", result.messagesProcessed],
              ["messagesAdded", result.messagesAdded],
              ["messagesUpdated", result.messagesUpdated],
              ["messagesDeleted", result.messagesDeleted],
            ].map(([key, val]) => (
              <Div
                key={String(key)}
                className="flex items-center justify-between text-sm"
              >
                <Span className="text-muted-foreground">
                  {t(`app.api.emails.imapClient.sync.widget.${String(key)}`)}
                </Span>
                <Span className="font-semibold">{String(val)}</Span>
              </Div>
            ))}
            <Div className="flex items-center justify-between text-sm">
              <Span className="text-muted-foreground">
                {t("app.api.emails.imapClient.sync.widget.duration")}
              </Span>
              <Span className="font-semibold">
                {result.duration}
                {"ms"}
              </Span>
            </Div>
            {result.errors.length > 0 && (
              <Div className="mt-2">
                <Span className="text-xs font-semibold text-red-600">
                  {t("app.api.emails.imapClient.sync.widget.errors")}
                </Span>
                {result.errors.map((err, i) => (
                  <Div key={i} style={{ color: "#ef4444", fontSize: "12px" }}>
                    {err.code}: {err.message}
                  </Div>
                ))}
              </Div>
            )}
          </Div>
        )}

        {/* Submit */}
        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget
            field={{
              text: "app.api.emails.imapClient.sync.widget.submit",
              loadingText: "app.api.emails.imapClient.sync.widget.submitting",
              icon: "refresh-cw",
              variant: "primary",
              size: "sm",
            }}
          />
        </Div>
      </Div>
    </Div>
  );
}
