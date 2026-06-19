/**
 * Remote Connection Connect Widget
 *
 * Renders the Card layout with benefits, security warning, and form fields.
 * Email + password are regular form fields - the server handles the
 * remote login and only stores the token.
 *
 * Role-aware:
 * - ADMIN: full benefits (CLI, tools, Claude Code, task routing) + advanced settings
 * - CUSTOMER: blocked with explanation
 */

"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { Lock } from "next-vibe-ui/ui/icons/Lock";
import { P } from "next-vibe-ui/ui/typography";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe-ui/unified/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe-ui/unified/form-fields/email-field/widget";
import { PasswordFieldWidget } from "next-vibe-ui/unified/form-fields/password-field/widget";
import { UrlFieldWidget } from "next-vibe-ui/unified/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe-ui/unified/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { useProviderAvailability } from "@/app/api/[locale]/agent/env-availability-context";
import type { SyncProviderInfo } from "@/app/api/[locale]/remote-connection/sync-providers/definition";
import syncProvidersDefinitions from "@/app/api/[locale]/remote-connection/sync-providers/definition";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type definitions from "./definition";
import { scopedTranslation } from "./i18n";

interface ConnectWidgetProps {
  field: (typeof definitions.POST)["fields"];
}

const SYNC_SCOPE_KEYS = [
  "memories",
  "documents",
  "skills",
  "favorites",
  "threads",
] as const;
type SyncScopeKey = (typeof SYNC_SCOPE_KEYS)[number];

export function RemoteConnectWidget({
  field,
}: ConnectWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const backButton = <NavigateButtonWidget field={field.children.backButton} />;

  const isAdmin =
    !user.isPublic && user.roles?.includes(UserPermissionRole.ADMIN) === true;

  if (user.isPublic) {
    return (
      <Div className="space-y-2">
        {backButton}
        <Card>
          <CardHeader>
            <Div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t("post.title")}</CardTitle>
            </Div>
            <CardDescription>{t("widget.signInDescription")}</CardDescription>
          </CardHeader>
        </Card>
      </Div>
    );
  }

  if (!isAdmin) {
    return (
      <Div className="space-y-2">
        {backButton}
        <Card>
          <CardHeader>
            <Div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{t("post.title")}</CardTitle>
            </Div>
            <CardDescription>
              {t("widget.adminOnlyDescription")}
            </CardDescription>
          </CardHeader>
        </Card>
      </Div>
    );
  }

  const benefits = [
    "widget.adminBenefit1",
    "widget.adminBenefit2",
    "widget.adminBenefit3",
    "widget.adminBenefit4",
  ] as const;

  return (
    <Div className="space-y-2">
      {backButton}
      <Card>
        <CardHeader className="pb-4">
          <Div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            <CardTitle>{t("post.title")}</CardTitle>
          </Div>
          <CardDescription>{t("post.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Benefits */}
          <Div className="flex flex-col gap-1.5">
            {benefits.map((key) => (
              <Div key={key} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <P className="text-sm text-muted-foreground">{t(key)}</P>
              </Div>
            ))}
          </Div>

          <Div className="grid grid-cols-2 gap-4">
            <Div className="col-span-2">
              <UrlFieldWidget
                fieldName="remoteUrl"
                field={field.children.remoteUrl}
              />
            </Div>

            {/* Security notice */}
            <Div className="col-span-2 flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <P className="text-xs text-warning">
                {t("post.credentialWarning")}
              </P>
            </Div>

            {/* Credentials */}
            <Div className="col-span-2 sm:col-span-1">
              <EmailFieldWidget
                fieldName="email"
                field={field.children.email}
              />
            </Div>
            <Div className="col-span-2 sm:col-span-1">
              <PasswordFieldWidget
                fieldName="password"
                field={field.children.password}
              />
            </Div>
          </Div>

          {/* Advanced settings toggle */}
          <Div
            className="flex items-center gap-2 cursor-pointer select-none py-1 border-t pt-3"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            {showAdvanced ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <P className="text-xs font-medium text-muted-foreground">
              {t("post.advancedSettings")}
            </P>
          </Div>

          {showAdvanced && (
            <Div className="flex flex-col gap-4 border rounded-md px-4 py-4 bg-muted/20">
              {/* Inference provider */}
              <BooleanFieldWidget
                fieldName="isInferenceProvider"
                field={field.children.isInferenceProvider}
              />

              {/* Sync scope */}
              <Div>
                <P className="text-xs font-medium mb-1">
                  {t("post.syncScope.label")}
                </P>
                <P className="text-xs text-muted-foreground mb-2">
                  {t("post.syncScope.description")}
                </P>
                <Div className="grid grid-cols-2 gap-1.5">
                  {SYNC_SCOPE_KEYS.map((key: SyncScopeKey) => (
                    <Div
                      key={key}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                      {t(`post.syncScope.${key}` as const)}
                    </Div>
                  ))}
                </Div>
                <P className="text-[10px] text-muted-foreground mt-1.5 italic">
                  {t("post.syncScope.defaultNote")}
                </P>
              </Div>
            </Div>
          )}

          <FormAlertWidget field={field.children.formAlert} />

          <SubmitButtonWidget field={field.children.submitButton} />
        </CardContent>
      </Card>
    </Div>
  );
}
