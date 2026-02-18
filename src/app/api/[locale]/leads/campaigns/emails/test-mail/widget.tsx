/**
 * Test Email Widget
 */
"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { CheckCircle, Mail, Send, Settings } from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useMemo } from "react";

import {
  useWidgetLocale,
  useWidgetNavigation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { simpleT } from "@/i18n/core/shared";

import type definition from "./definition";

type PostResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: PostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function TestEmailContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const locale = useWidgetLocale();
  const t = useMemo(() => simpleT(locale).t, [locale]);

  const navigation = useWidgetNavigation();

  const sentAtFormatted = data?.result?.sentAt
    ? new Date(String(data.result.sentAt)).toLocaleString()
    : null;

  const handleGoToConfig = (): void => {
    void (async (): Promise<void> => {
      const configDefs =
        await import("../../campaign-starter/campaign-starter-config/definition");
      navigation.push(configDefs.default.PUT, {});
    })();
  };

  const handleSendAnother = (): void => {
    void (async (): Promise<void> => {
      const selfDefs = await import("./definition");
      navigation.push(selfDefs.default.POST, {});
    })();
  };

  return (
    <Div className="flex flex-col gap-4 p-4">
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.campaigns.emails.testMail.widget.title")}
          </Span>
        </Div>
      </Div>
      {data?.result?.success && (
        <>
          <Div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20 p-4 flex flex-col gap-2">
            <Div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <Span className="text-sm font-medium text-green-700 dark:text-green-300">
                {t(
                  "app.api.leads.campaigns.emails.testMail.widget.successMessage",
                )}
              </Span>
            </Div>
            {data.result.testEmail && (
              <Span className="text-xs text-muted-foreground pl-8">
                {t("app.api.leads.campaigns.emails.testMail.widget.sentTo")}
                {data.result.testEmail}
              </Span>
            )}
            {data.result.subject && (
              <Span className="text-xs text-muted-foreground pl-8">
                {t("app.api.leads.campaigns.emails.testMail.widget.subject")}
                {data.result.subject}
              </Span>
            )}
            {sentAtFormatted && (
              <Span className="text-xs text-muted-foreground pl-8">
                {t("app.api.leads.campaigns.emails.testMail.widget.sentAt")}
                {sentAtFormatted}
              </Span>
            )}
          </Div>
          <Div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGoToConfig}
              className="flex items-center gap-1.5"
            >
              <Settings className="h-4 w-4" />
              {t(
                "app.api.leads.campaigns.emails.testMail.widget.campaignConfig",
              )}
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleSendAnother}
              className="flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              {t("app.api.leads.campaigns.emails.testMail.widget.sendAnother")}
            </Button>
          </Div>
        </>
      )}
    </Div>
  );
}
