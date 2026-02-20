/**
 * Custom Widget for IMAP Configuration
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Span } from "next-vibe-ui/ui/span";
import React from "react";

import { useWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/react";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";
import type { ImapConfigPostResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: ImapConfigPostResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ImapConfigContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation();

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.imapClient.config.title")}
        </Span>
      </Div>

      <Div className="p-4 flex flex-col gap-6">
        <FormAlertWidget field={{}} />

        {/* Connection */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.config.widget.connection")}
          </Span>
          <TextFieldWidget
            fieldName={`${fieldName}.host`}
            field={children.host}
          />
          <Div className="grid grid-cols-2 gap-3">
            <NumberFieldWidget
              fieldName={`${fieldName}.port`}
              field={children.port}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.tls`}
              field={children.tls}
            />
          </Div>
          <TextFieldWidget
            fieldName={`${fieldName}.username`}
            field={children.username}
          />
          <PasswordFieldWidget
            fieldName={`${fieldName}.password`}
            field={children.password}
          />
          <Div className="grid grid-cols-2 gap-3">
            <SelectFieldWidget
              fieldName={`${fieldName}.loggingLevel`}
              field={children.loggingLevel}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.autoReconnect`}
              field={children.autoReconnect}
            />
          </Div>
        </Div>

        {/* Server */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.config.widget.server")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget
              fieldName={`${fieldName}.serverEnabled`}
              field={children.serverEnabled}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.maxConnections`}
              field={children.maxConnections}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.connectionTimeout`}
              field={children.connectionTimeout}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.poolIdleTimeout`}
              field={children.poolIdleTimeout}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.keepAlive`}
              field={children.keepAlive}
            />
          </Div>
        </Div>

        {/* Sync */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.config.widget.sync")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget
              fieldName={`${fieldName}.syncEnabled`}
              field={children.syncEnabled}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.syncInterval`}
              field={children.syncInterval}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.maxMessages`}
              field={children.maxMessages}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.batchSize`}
              field={children.batchSize}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.concurrentAccounts`}
              field={children.concurrentAccounts}
            />
          </Div>
        </Div>

        {/* Cache */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.config.widget.cache")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget
              fieldName={`${fieldName}.cacheEnabled`}
              field={children.cacheEnabled}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.cacheMaxSize`}
              field={children.cacheMaxSize}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.cacheTtl`}
              field={children.cacheTtl}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.memoryThreshold`}
              field={children.memoryThreshold}
            />
          </Div>
        </Div>

        {/* Resilience */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.config.widget.resilience")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <NumberFieldWidget
              fieldName={`${fieldName}.maxRetries`}
              field={children.maxRetries}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.retryDelay`}
              field={children.retryDelay}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.circuitBreakerThreshold`}
              field={children.circuitBreakerThreshold}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.circuitBreakerTimeout`}
              field={children.circuitBreakerTimeout}
            />
          </Div>
        </Div>

        {/* Monitoring + Dev */}
        <Div className="flex flex-col gap-3">
          <Span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("app.api.emails.imapClient.config.widget.monitoring")}
          </Span>
          <Div className="grid grid-cols-2 gap-3">
            <BooleanFieldWidget
              fieldName={`${fieldName}.metricsEnabled`}
              field={children.metricsEnabled}
            />
            <NumberFieldWidget
              fieldName={`${fieldName}.healthCheckInterval`}
              field={children.healthCheckInterval}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.debugMode`}
              field={children.debugMode}
            />
            <BooleanFieldWidget
              fieldName={`${fieldName}.testMode`}
              field={children.testMode}
            />
          </Div>
        </Div>

        {/* Submit */}
        <Div className="flex items-center justify-end pt-2">
          <SubmitButtonWidget
            field={{
              text: "app.api.emails.imapClient.config.widget.submit",
              loadingText: "app.api.emails.imapClient.config.widget.submitting",
              icon: "save",
              variant: "primary",
              size: "sm",
            }}
          />
        </Div>
      </Div>
    </Div>
  );
}
