/**
 * Custom Widget for IMAP Full Sync
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import {
  useWidgetForm,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Label } from "next-vibe-ui/ui/label";

import { useMessengerAccountsList } from "@/app/api/[locale]/messenger/accounts/list/hooks";
import type { MessengerAccountsListGETResponseOutput } from "@/app/api/[locale]/messenger/accounts/list/definition";
import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function ImapSyncContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm();
  const user = useWidgetUser();
  const logger = useWidgetLogger();

  const accountsResult = useMessengerAccountsList(user, logger);
  const accounts: MessengerAccountsListGETResponseOutput["accounts"] =
    accountsResult.read.data?.accounts ?? [];

  const selectedIds = form.watch("accountIds") ?? [];

  function toggleAccount(id: string): void {
    const current = form.getValues("accountIds") ?? [];
    const next = current.includes(id)
      ? current.filter((x: string) => x !== id)
      : [...current, id];
    form.setValue("accountIds", next, { shouldDirty: true });
  }

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <Span className="font-semibold text-base">{t("title")}</Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        {/* Options */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("widget.options")}
          </Span>

          {/* Account selector */}
          <Div className="flex flex-col gap-2">
            <Span className="text-sm font-medium">{t("accountIds.label")}</Span>
            <Span className="text-xs text-muted-foreground">
              {t("accountIds.description")}
            </Span>
            {accounts.length === 0 ? (
              <Span className="text-sm text-muted-foreground italic">
                {t("widget.noAccounts")}
              </Span>
            ) : (
              <Div className="flex flex-col gap-2 rounded-md border p-3">
                {accounts.map((account) => (
                  <Div
                    key={account.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleAccount(account.id)}
                  >
                    <Checkbox
                      checked={selectedIds.includes(account.id)}
                      onCheckedChange={() => toggleAccount(account.id)}
                      id={`account-${account.id}`}
                    />
                    <Label
                      htmlFor={`account-${account.id}`}
                      className="cursor-pointer flex-1 text-sm"
                    >
                      {account.name}
                      <Span className="text-muted-foreground ml-2 text-xs">
                        {account.smtpFromEmail}
                      </Span>
                    </Label>
                  </Div>
                ))}
              </Div>
            )}
          </Div>

          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget fieldName={"force"} field={children.force} />
            <BooleanFieldWidget fieldName={"dryRun"} field={children.dryRun} />
          </Div>
          <NumberFieldWidget
            fieldName={"maxMessages"}
            field={children.maxMessages}
          />
        </Div>

        {/* Result */}
        {result !== null && result !== undefined && (
          <Div className="rounded-lg border p-4 flex flex-col gap-2">
            <Span className="text-sm font-semibold">{t("widget.result")}</Span>
            {(
              [
                ["widget.accountsProcessed", result.accountsProcessed],
                ["widget.foldersProcessed", result.foldersProcessed],
                ["widget.messagesProcessed", result.messagesProcessed],
                ["widget.messagesAdded", result.messagesAdded],
                ["widget.messagesUpdated", result.messagesUpdated],
                ["widget.messagesDeleted", result.messagesDeleted],
              ] as const
            ).map(([key, val]) => (
              <Div
                key={key}
                className="flex items-center justify-between text-sm"
              >
                <Span className="text-muted-foreground">{t(key)}</Span>
                <Span className="font-semibold">{String(val)}</Span>
              </Div>
            ))}
            <Div className="flex items-center justify-between text-sm">
              <Span className="text-muted-foreground">
                {t("widget.duration")}
              </Span>
              <Span className="font-semibold">
                {result.duration}
                {"ms"}
              </Span>
            </Div>
            {result.errors.length > 0 && (
              <Div className="mt-2">
                <Span className="text-xs font-semibold text-destructive">
                  {t("widget.errors")}
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
          <SubmitButtonWidget<typeof definition.POST>
            field={{
              text: "widget.submit",
              loadingText: "widget.submitting",
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
