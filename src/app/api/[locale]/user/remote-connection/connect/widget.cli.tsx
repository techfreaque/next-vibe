/**
 * Remote Connection Connect — CLI Widget
 *
 * Handles the two-phase login flow in the terminal:
 * 1. User fills instanceId, friendlyName, remoteUrl (rendered by CustomWidgetRequestFields)
 * 2. This widget adds email + password fields and does the remote login
 *    before the standard submit fires, injecting the token into the form.
 *
 * Credentials go directly from the CLI process to the remote server.
 * The local backend never sees the password — only the resulting token.
 */

/* eslint-disable oxlint-plugin-i18n/no-literal-string */

import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import type { JSX } from "react";
import { useCallback, useEffect, useState } from "react";

import { isInkFormState } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import {
  useInkWidgetContext,
  useInkWidgetForm,
  useInkWidgetLocale,
  useInkWidgetLogger,
  useInkWidgetPreSubmitRef,
  useInkWidgetResponseOnly,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
import { defaultLocale } from "@/i18n/core/config";
import type { TParams } from "@/i18n/core/static-types";

import loginEndpoints, {
  type LoginPostResponseOutput,
} from "../../public/login/definition";
import { scopedTranslation } from "./i18n";

interface CliWidgetProps {
  field: {
    value:
      | { remoteUrlResult?: string; isConnected?: boolean }
      | null
      | undefined;
  };
  fieldName: string;
}

interface LoginJsonResponse {
  success?: boolean;
  data?: LoginPostResponseOutput;
}

type WidgetField = "email" | "password";

export function RemoteConnectWidget({ field }: CliWidgetProps): JSX.Element {
  const logger = useInkWidgetLogger();
  const locale = useInkWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const form = useInkWidgetForm();
  const responseOnly = useInkWidgetResponseOnly();
  const preSubmitRef = useInkWidgetPreSubmitRef();
  const context = useInkWidgetContext();
  const response = context.response;

  // Scoped t cast for FormAlert-style error display
  const endpointT = context.t as (key: string, params?: TParams) => string;

  logger.debug("[widget.cli] RemoteConnectWidget render", {
    fieldValue: field.value ? JSON.stringify(field.value).slice(0, 100) : null,
    responseOnly,
    hasResponse: !!response,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<WidgetField>("email");

  // The widget's fields should be active when the renderer's focusedField
  // is on a non-text-input field (formAlert, submitButton, backButton).
  // These fields aren't rendered as editable text inputs, so focus falls through to us.
  const rendererFocusedField = context.focusedField;
  const nonInputFields = new Set(["formAlert", "submitButton", "backButton"]);
  const widgetIsActive =
    !responseOnly &&
    (rendererFocusedField === undefined ||
      nonInputFields.has(rendererFocusedField));

  // Navigation within the widget uses Enter (not Tab, which conflicts with renderer's
  // field focus management). Email Enter → password. Password Enter → submit.

  // Async pre-submit hook: login to remote, inject token into form
  const preSubmit = useCallback(async (): Promise<boolean> => {
    logger.debug("[widget.cli] preSubmit called", {
      hasForm: !!form,
      isInk: form ? isInkFormState(form) : false,
      email: email ? `${email.slice(0, 3)}...` : "(empty)",
      hasPassword: !!password,
    });

    if (!form || !isInkFormState(form)) {
      return false;
    }

    setLoginError(null);
    setEmailError(null);
    setPasswordError(null);

    const remoteUrl = (form.getValue<string>("remoteUrl") ?? "").replace(
      /\/+$/,
      "",
    );

    let hasFieldError = false;
    if (!email) {
      setEmailError(t("post.email.validation.required"));
      hasFieldError = true;
    }
    if (!password) {
      setPasswordError(t("post.password.validation.required"));
      hasFieldError = true;
    }
    if (!remoteUrl || hasFieldError) {
      return false;
    }

    try {
      const loginUrl = `${remoteUrl}/api/${defaultLocale}/${loginEndpoints.POST.path.join("/")}`;
      const fetchResponse = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe: true }),
        signal: AbortSignal.timeout(15000),
      });

      if (!fetchResponse.ok) {
        if (fetchResponse.status === 401) {
          setLoginError(t("post.errors.unauthorized.title"));
        } else if (fetchResponse.status === 403) {
          setLoginError(t("post.errors.forbidden.title"));
        } else if (fetchResponse.status === 404) {
          setLoginError(t("post.errors.notFound.title"));
        } else {
          setLoginError(t("post.errors.server.title"));
        }
        return false;
      }

      const body = (await fetchResponse.json()) as LoginJsonResponse;
      const token = body.data?.token;
      if (!token) {
        setLoginError(t("post.errors.server.title"));
        return false;
      }

      // Inject token + leadId into form before validation runs
      form.setValue("token", token);
      form.setValue("leadId", body.data?.leadId ?? "");
      return true;
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : t("post.errors.network.title"),
      );
      return false;
    }
  }, [email, form, logger, password, t]);

  // Register preSubmit hook so CliEndpointRenderer awaits it before submit
  useEffect(() => {
    logger.debug("[widget.cli] registering preSubmit", {
      hasRef: !!preSubmitRef,
    });
    if (preSubmitRef) {
      preSubmitRef.current = preSubmit;
    }
    return (): void => {
      if (preSubmitRef) {
        preSubmitRef.current = undefined;
      }
    };
  }, [logger, preSubmit, preSubmitRef]);

  // Response-only mode: show connection result
  // Check context.response (set by renderer after successful submit), not field.value
  // which contains initial form data from CLI args and is always truthy.
  if (responseOnly || response) {
    if (!field.value?.isConnected) {
      // Show error response if available (matches FormAlertWidgetInk behavior)
      if (response && !response.success) {
        return (
          <Box marginBottom={1}>
            <Text color="red">
              {endpointT(response.message, response.messageParams)}
            </Text>
          </Box>
        );
      }
      return <Box />;
    }
    return (
      <Box flexDirection="column">
        <Text color="green">
          {t("post.success.title")} — {field.value.remoteUrlResult}
        </Text>
      </Box>
    );
  }

  const emailFocused = widgetIsActive && activeField === "email";
  const passwordFocused = widgetIsActive && activeField === "password";

  logger.debug("[widget.cli] focus state", {
    widgetIsActive,
    rendererFocusedField,
    activeField,
    emailFocused,
    passwordFocused,
  });

  // Interactive mode: show email + password fields
  return (
    <Box flexDirection="column">
      {/* Email field */}
      <Box flexDirection="column" marginBottom={1}>
        <Box>
          <Text bold color={emailFocused ? "cyan" : undefined}>
            {emailFocused ? "> " : "  "}
            {t("post.email.label")}
          </Text>
          <Text dimColor> - {t("post.email.description")}</Text>
        </Box>
        <Box>
          <Text dimColor>{emailFocused ? "> " : "  "}</Text>
          <TextInput
            value={email}
            focus={emailFocused}
            onChange={(v) => {
              setEmail(v);
              if (v) {
                setEmailError(null);
              }
            }}
            onSubmit={() => {
              setActiveField("password");
            }}
            placeholder={t("post.email.placeholder")}
          />
        </Box>
        {emailError && (
          <Box>
            <Text color="red"> {emailError}</Text>
          </Box>
        )}
      </Box>

      {/* Password field */}
      <Box flexDirection="column" marginBottom={1}>
        <Box>
          <Text bold color={passwordFocused ? "cyan" : undefined}>
            {passwordFocused ? "> " : "  "}
            {t("post.password.label")}
          </Text>
          <Text dimColor> - {t("post.password.description")}</Text>
        </Box>
        <Box>
          <Text dimColor>{passwordFocused ? "> " : "  "}</Text>
          <TextInput
            value={password}
            focus={passwordFocused}
            onChange={(v) => {
              setPassword(v);
              if (v) {
                setPasswordError(null);
              }
            }}
            onSubmit={() => {
              // Trigger the form submit — preSubmit hook handles login
              context.onSubmit?.();
            }}
            placeholder={t("post.password.placeholder")}
            mask="*"
          />
        </Box>
        {passwordError && (
          <Box>
            <Text color="red"> {passwordError}</Text>
          </Box>
        )}
      </Box>

      {/* Login error (auth failures, network errors) */}
      {loginError && (
        <Box marginBottom={1}>
          <Text color="red">{loginError}</Text>
        </Box>
      )}

      {/* Security notice */}
      <Box marginBottom={1}>
        <Text dimColor wrap="end">
          {t("post.credentialWarning")}
        </Text>
      </Box>
    </Box>
  );
}

RemoteConnectWidget.cliWidget = true as const;
