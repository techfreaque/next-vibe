/**
 * Custom Widget for IMAP Messages Sync
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { ImapMessageSyncPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapMessageSyncPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ImapMessagesSyncContainer({
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
          {t("app.api.emails.imapClient.messages.sync.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        <Div className="flex flex-col gap-3">
          <TextFieldWidget
            fieldName={`${fieldName}.accountId`}
            field={children.accountId}
          />
          <TextFieldWidget
            fieldName={`${fieldName}.folderId`}
            field={children.folderId}
          />
          <BooleanFieldWidget
            fieldName={`${fieldName}.force`}
            field={children.force}
          />
        </Div>

        {/* Result */}
        {result !== null && result !== undefined && (
          <Div className="rounded-lg border p-4 flex flex-col gap-2">
            <Span className="text-sm font-semibold">
              {t("app.api.emails.imapClient.messages.sync.result")}
            </Span>
            <Span className="text-sm">{result.message}</Span>
            <Div className="flex flex-col gap-1 mt-2">
              {[
                ["messagesProcessed", result.results.messagesProcessed],
                ["messagesAdded", result.results.messagesAdded],
                ["messagesUpdated", result.results.messagesUpdated],
                ["messagesDeleted", result.results.messagesDeleted],
              ].map(([key, val]) => (
                <Div
                  key={String(key)}
                  className="flex items-center justify-between text-sm"
                >
                  <Span className="text-muted-foreground">
                    {t(
                      `app.api.emails.imapClient.messages.sync.${String(key)}`,
                    )}
                  </Span>
                  <Span className="font-semibold">{String(val)}</Span>
                </Div>
              ))}
              <Div className="flex items-center justify-between text-sm">
                <Span className="text-muted-foreground">
                  {t("app.api.emails.imapClient.messages.sync.duration")}
                </Span>
                <Span className="font-semibold">
                  {result.results.duration}
                  {"ms"}
                </Span>
              </Div>
            </Div>
            {result.errors.length > 0 && (
              <Div className="mt-2">
                {result.errors.map((err, i) => (
                  <Div key={i} style={{ color: "#ef4444", fontSize: "12px" }}>
                    {err.code}: {err.message}
                  </Div>
                ))}
              </Div>
            )}
          </Div>
        )}

        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget
            field={{
              text: "app.api.emails.imapClient.messages.sync.submit",
              loadingText: "app.api.emails.imapClient.messages.sync.submitting",
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
