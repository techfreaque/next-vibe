/**
 * Remote Connection Connect Widget
 *
 * Two-phase flow — credentials never touch the local backend:
 * 1. User fills instanceId, friendlyName, remoteUrl, email, password
 * 2. On "Connect" click, the widget POSTs credentials DIRECTLY from the browser
 *    to the remote login endpoint. The remote middleware auto-creates a lead_id
 *    if none exists. The JWT token is returned in the JSON body (not Set-Cookie)
 *    so cross-origin clients can read it. Then the standard endpoint submit runs.
 *
 * Role-aware:
 * - ADMIN: full benefits (CLI, tools, Claude Code, task routing)
 * - CUSTOMER: simplified benefits (memories, AI access, sync)
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
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
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";

import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { UrlFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/url-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { defaultLocale } from "@/i18n/core/config";

import loginEndpoints, {
  type LoginPostResponseOutput,
} from "../../public/login/definition";
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
  const form = useWidgetForm<typeof definitions.POST>();
  const onSubmit = useWidgetOnSubmit();
  const emptyField = useMemo(() => ({}), []);

  const backButton = <NavigateButtonWidget field={field.children.backButton} />;

  // Credential state — local only, never serialized into the form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleConnect = useCallback(async () => {
    if (!form || !onSubmit) {
      return;
    }
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const remoteUrl =
        (form.getValues("remoteUrl") as string | undefined)?.replace(
          /\/+$/,
          "",
        ) ?? "";

      if (!remoteUrl || !email || !password) {
        setLoginError(t("post.errors.validation.title"));
        return;
      }

      // POST credentials DIRECTLY from the browser to the remote login endpoint.
      // The remote middleware creates a lead_id on-the-fly if none exists, so no
      // pre-ping is needed. The token is returned in the JSON body (not Set-Cookie)
      // so cross-origin clients can read it.
      const loginUrl = `${remoteUrl}/api/${defaultLocale}/${loginEndpoints.POST.path.join("/")}`;
      const loginResp = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe: true }),
      });

      if (!loginResp.ok) {
        if (loginResp.status === 401) {
          setLoginError(t("post.errors.unauthorized.title"));
          return;
        }
        if (loginResp.status === 403) {
          setLoginError(t("post.errors.forbidden.title"));
          return;
        }
        if (loginResp.status === 404) {
          setLoginError(t("post.errors.notFound.title"));
          return;
        }
        setLoginError(t("post.errors.server.title"));
        return;
      }

      const loginJson = (await loginResp.json()) as {
        success?: boolean;
        data?: LoginPostResponseOutput;
      };

      const token = loginJson.data?.token;
      if (!token) {
        setLoginError(t("post.errors.server.title"));
        return;
      }

      // Step 3: inject token + leadId into the form, then trigger the endpoint mutation
      form.setValue("token", token);
      form.setValue("leadId", loginJson.data?.leadId ?? "");

      form.handleSubmit(onSubmit)();
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : t("post.errors.network.title"),
      );
    } finally {
      setIsLoggingIn(false);
    }
  }, [email, form, onSubmit, password, t]);

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

          {/* Instance config — standard form fields (no credentials) */}
          <Div className="grid grid-cols-2 gap-4">
            <Div className="col-span-1">
              <TextFieldWidget
                fieldName="instanceId"
                field={field.children.instanceId}
              />
            </Div>
            <Div className="col-span-1">
              <TextFieldWidget
                fieldName="friendlyName"
                field={field.children.friendlyName}
              />
            </Div>
            <Div className="col-span-2">
              <UrlFieldWidget
                fieldName="remoteUrl"
                field={field.children.remoteUrl}
              />
            </Div>

            {/* Security notice */}
            <Div className="col-span-2 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <P className="text-xs text-amber-700 dark:text-amber-300">
                {t("post.credentialWarning")}
              </P>
            </Div>

            {/* Credentials — local state only, never sent to this server */}
            <Div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
              <Label htmlFor="connect-email">{t("post.email.label")}</Label>
              <Input
                id="connect-email"
                type="email"
                placeholder={t("post.email.placeholder")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoComplete="email"
              />
            </Div>
            <Div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
              <Label htmlFor="connect-password">
                {t("post.password.label")}
              </Label>
              <Input
                id="connect-password"
                type="password"
                placeholder={t("post.password.placeholder")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                autoComplete="current-password"
              />
            </Div>
          </Div>

          {loginError && (
            <P className="text-sm text-destructive">{loginError}</P>
          )}

          <FormAlertWidget field={emptyField} />

          <Button
            type="button"
            onClick={() => {
              void handleConnect();
            }}
            disabled={isLoggingIn || !email || !password}
          >
            <Link2 className="h-4 w-4 mr-2" />
            {isLoggingIn
              ? t("post.actions.submitting")
              : t("post.actions.submit")}
          </Button>
        </CardContent>
      </Card>
    </Div>
  );
}
