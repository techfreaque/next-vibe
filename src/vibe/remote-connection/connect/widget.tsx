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

import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/ui/card";
import { Div } from "next-vibe/ui/ui/div";
import { AlertTriangle } from "next-vibe/ui/ui/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe/ui/ui/icons/CheckCircle2";
import { Link2 } from "next-vibe/ui/ui/icons/Link2";
import { Lock } from "next-vibe/ui/ui/icons/Lock";
import { SectionGroup } from "next-vibe/ui/ui/section-group";
import { Switch } from "next-vibe/ui/ui/switch";
import { P } from "next-vibe/ui/ui/typography";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { UrlFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/url-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import type { SyncScope } from "../db";
import type { SyncProviderInfo } from "../sync/providers/definition";
import syncProvidersDefinitions from "../sync/providers/definition";
import type definitions from "./definition";
import { scopedTranslation } from "./i18n";

interface ConnectWidgetProps {
  field: (typeof definitions.POST)["fields"];
}

function SyncScopeEditor({
  t,
}: {
  t: ReturnType<typeof scopedTranslation.scopedT>["t"];
}): JSX.Element {
  const { setValue } = useFormContext();
  const syncScope = useWatch({ name: "syncScope" }) as SyncScope | undefined;
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const syncProvidersEndpoint = useEndpoint(
    syncProvidersDefinitions,
    undefined,
    logger,
    user,
  );
  const providers: SyncProviderInfo[] =
    syncProvidersEndpoint.read?.data?.providers ?? [];

  const current: Record<string, boolean> = {};
  const scopeRecord = syncScope as Record<string, boolean | undefined> | null;
  for (const p of providers) {
    current[p.key] = scopeRecord?.[p.key] ?? false;
  }

  const toggle = (key: string): void => {
    setValue(
      "syncScope",
      { ...current, [key]: !current[key] },
      { shouldDirty: true },
    );
  };

  if (providers.length === 0) {
    return <></>;
  }

  return (
    <SectionGroup title={t("post.syncScope.label")}>
      <P className="text-xs text-muted-foreground mb-3">
        {t("post.syncScope.description")}
      </P>
      <Div className="grid grid-cols-1 gap-2">
        {providers.map((p) => (
          <Div
            key={p.key}
            className="flex items-center justify-between rounded-md border px-3 py-2 bg-background"
          >
            <Div className="flex flex-col gap-0.5">
              <P className="text-sm font-medium">{p.label}</P>
              {p.description && (
                <P className="text-xs text-muted-foreground">{p.description}</P>
              )}
            </Div>
            <Switch
              checked={current[p.key] ?? false}
              onCheckedChange={() => toggle(p.key)}
              aria-label={p.label}
            />
          </Div>
        ))}
      </Div>
    </SectionGroup>
  );
}

export function RemoteConnectWidget({
  field,
}: ConnectWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();

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

          {/* Inference provider — always visible for admins */}
          <BooleanFieldWidget
            fieldName="isInferenceProvider"
            field={field.children.isInferenceProvider}
          />

          <SyncScopeEditor t={t} />

          <FormAlertWidget field={field.children.formAlert} />

          <SubmitButtonWidget field={field.children.submitButton} />
        </CardContent>
      </Card>
    </Div>
  );
}
