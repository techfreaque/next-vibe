/**
 * Remote Connection Connect Widget
 *
 * Renders the Card layout with benefits, security warning, and form fields.
 * Email + password are regular form fields - the server handles the
 * remote login and only stores the token.
 *
 * Role-aware:
 * - ADMIN: full benefits (CLI, tools, Claude Code, task routing)
 * - CUSTOMER: simplified benefits (memories, AI access, sync)
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
import { Link2 } from "next-vibe-ui/ui/icons/Link2";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";

import {
  useWidgetLocale,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { EmailFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/email-field/widget";
import { PasswordFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/password-field/widget";
import { UrlFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type definitions from "./definition";
import { scopedTranslation } from "./i18n";

interface ConnectWidgetProps {
  field: (typeof definitions.POST)["fields"];
}

export function RemoteConnectWidget({
  field,
}: ConnectWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();

  const backButton = <NavigateButtonWidget field={field.children.backButton} />;

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

  const isAdmin = user.roles?.includes(UserPermissionRole.ADMIN);

  const benefits = isAdmin
    ? ([
        "widget.adminBenefit1",
        "widget.adminBenefit2",
        "widget.adminBenefit3",
        "widget.adminBenefit4",
      ] as const)
    : (["widget.benefit1", "widget.benefit2", "widget.benefit3"] as const);

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

            {/* Credentials - sent to local server, which logs in on your behalf */}
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

          <FormAlertWidget field={field.children.formAlert} />

          <SubmitButtonWidget field={field.children.submitButton} />
        </CardContent>
      </Card>
    </Div>
  );
}
