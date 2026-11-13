/**
 * Custom Widget for Login Form
 */

"use client";

import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { Button } from "next-vibe/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "next-vibe/ui/components/card";
import type { DivRefObject } from "next-vibe/ui/components/div";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import type { InputRefObject } from "next-vibe/ui/components/input";
import { Input } from "next-vibe/ui/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "next-vibe/ui/components/input-otp";
import { P } from "next-vibe/ui/components/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import AlertWidget from "next-vibe/unified-ui/widgets/display-only/alert/widget";
import { LinkWidget } from "next-vibe/unified-ui/widgets/display-only/link/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { useEffect, useRef, useState } from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

type Phase = "credentials" | "code";

export function LoginFormContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const response = useWidgetResponse();
  const isSubmitting = useWidgetIsSubmitting();

  const [phase, setPhase] = useState<Phase>("credentials");
  const [recovery, setRecovery] = useState(false);
  const [handled, setHandled] = useState<typeof response>(undefined);
  const codeRef = useRef<InputRefObject>(null);
  const otpRef = useRef<DivRefObject>(null);
  const onSubmit = useWidgetOnSubmit();
  // Last code auto-submitted; a failed code is not re-sent until it is edited
  const lastAutoSubmitted = useRef("");

  // Machine-readable signal: the backend answers a 2FA account's code-less
  // attempt with errorType TWO_FACTOR_REQUIRED. We never look at message text.
  const twoFactorRequired =
    response !== undefined &&
    !response.success &&
    response.errorType.errorKey ===
      ErrorResponseTypes.TWO_FACTOR_REQUIRED.errorKey;

  // Adjust state during render (no effect): react once per new response
  if (response !== handled) {
    setHandled(response);
    if (twoFactorRequired) {
      setPhase("code");
    }
  }

  useEffect(() => {
    if (phase !== "code") {
      return;
    }
    if (recovery) {
      codeRef.current?.focus();
      return;
    }
    // The OTP's real input overlays its container: resolve it by hit-test
    const rect = otpRef.current?.getBoundingClientRect();
    if (rect) {
      // oxlint-disable-next-line restricted/no-browser-globals -- shared InputOTP exposes no ref/autoFocus; hit-test is the only way to reach its overlaid input
      const hit = document.elementFromPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      if (hit instanceof HTMLInputElement) {
        hit.focus();
      }
    }
  }, [phase, recovery]);

  const handleOtpChange = (v: string): void => {
    const next = v.replace(/\D/g, "").slice(0, 6);
    form?.setValue("twoFactorCode", next, { shouldDirty: true });
    if (next.length < 6) {
      lastAutoSubmitted.current = "";
      return;
    }
    if (isSubmitting || next === lastAutoSubmitted.current) {
      return;
    }
    lastAutoSubmitted.current = next;
    onSubmit?.();
  };

  const backToCredentials = (): void => {
    form?.setValue("twoFactorCode", "");
    lastAutoSubmitted.current = "";
    setRecovery(false);
    setPhase("credentials");
  };

  // A wrong code is a plain failure; the "required" prompt is not an error
  const visibleError =
    response !== undefined && !response.success && !twoFactorRequired
      ? response.message
      : undefined;

  if (phase === "code") {
    const email = form?.watch("email") ?? "";
    const code = form?.watch("twoFactorCode") ?? "";
    return (
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="items-center gap-2 p-6 pb-2 text-center sm:p-8 sm:pb-2">
          <Div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </Div>
          <CardTitle className="text-2xl tracking-tight">
            {t("twoFactorStep.title")}
          </CardTitle>
          <CardDescription>
            {recovery
              ? t("twoFactorStep.recoveryHelper")
              : t("twoFactorStep.helper")}
          </CardDescription>
          <Div
            className="mt-1 max-w-full truncate rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            data-testid="login-2fa-email"
          >
            {email}
          </Div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6 pt-4 sm:p-8 sm:pt-4">
          {recovery ? (
            <Input
              ref={codeRef}
              name="twoFactorCode"
              data-testid="login-2fa-code"
              aria-label={t("twoFactorStep.recoveryLabel")}
              type="text"
              value={code}
              onChangeText={(v: string) => {
                form?.setValue("twoFactorCode", v.trim(), {
                  shouldDirty: true,
                });
              }}
              placeholder={t("twoFactorStep.recoveryPlaceholder")}
              maxLength={32}
              autoComplete="one-time-code"
              keyboardType="default"
              spellCheck={false}
              className="h-14 text-center font-mono text-2xl tracking-[0.2em] placeholder:tracking-normal"
            />
          ) : (
            <Div
              ref={otpRef}
              data-testid="login-2fa-otp"
              aria-label={t("twoFactorStep.codeLabel")}
              className="flex justify-center"
            >
              <InputOTP
                maxLength={6}
                value={code}
                onChange={handleOtpChange}
                containerClassName="justify-center"
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-12 w-10 rounded-lg border bg-background text-xl font-semibold first:rounded-lg last:rounded-lg sm:h-14 sm:w-12 sm:text-2xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </Div>
          )}

          {visibleError && (
            <Div role="alert" data-testid="login-2fa-error">
              <P className="text-center text-sm text-destructive">
                {visibleError}
              </P>
            </Div>
          )}

          <Button
            type="submit"
            data-testid="endpoint-submit"
            size="lg"
            disabled={isSubmitting || code.length === 0}
          >
            {isSubmitting
              ? t("twoFactorStep.verifying")
              : t("twoFactorStep.verify")}
          </Button>

          <Div className="flex flex-col items-center gap-1 border-t pt-4 text-sm">
            <Button
              type="button"
              variant="link"
              size="sm"
              data-testid="login-2fa-toggle"
              onClick={() => {
                form?.setValue("twoFactorCode", "");
                lastAutoSubmitted.current = "";
                setRecovery(!recovery);
              }}
            >
              {recovery
                ? t("twoFactorStep.useApp")
                : t("twoFactorStep.useRecovery")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-testid="login-2fa-back"
              onClick={backToCredentials}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t("twoFactorStep.back")}
            </Button>
          </Div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="gap-1.5 p-6 pb-2 text-center sm:p-8 sm:pb-2">
        <CardTitle className="text-2xl tracking-tight">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 p-6 pt-4 sm:p-8 sm:pt-4">
        <EmailFieldWidget fieldName="email" field={children.email} />
        <PasswordFieldWidget fieldName="password" field={children.password} />
        <BooleanFieldWidget
          fieldName="rememberMe"
          field={children.rememberMe}
        />

        {!twoFactorRequired && <FormAlertWidget field={children.formAlert} />}

        {data?.message && (
          <AlertWidget
            fieldName="message"
            field={withValue(children.message, data.message, null)}
          />
        )}

        <SubmitButtonWidget<typeof definition.POST>
          field={children.submitButton}
        />

        <Div className="flex flex-col items-center gap-1 border-t pt-4 text-sm">
          <LinkWidget
            field={children.forgotPassword}
            fieldName="forgotPassword"
          />
          <LinkWidget
            field={children.createAccount}
            fieldName="createAccount"
          />
        </Div>
      </CardContent>
    </Card>
  );
}
