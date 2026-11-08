/**
 * Two-factor authentication widget (all platforms).
 * Loads status on open, then drives setup -> confirm -> recovery codes,
 * and disable / regenerate, all through the single `action` POST.
 */

"use client";

import { Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Shield } from "next-vibe/ui/components/icons/Shield";
import { Image } from "next-vibe/ui/components/image";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { PasswordFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/password-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";

import type definition from "./definition";
import { TwoFactorAction } from "./enum";

interface TwoFactorWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function TwoFactorWidget({ field }: TwoFactorWidgetProps): JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();
  const submitting = useWidgetIsSubmitting() ?? false;
  const navigation = useWidgetNavigation();
  const platform = useWidgetPlatform();
  const isWeb = platform !== Platform.CLI && platform !== Platform.MCP;

  const res = data !== undefined && "enabled" in data ? data : undefined;
  const [dismissedCodes, setDismissedCodes] = useState<
    readonly string[] | undefined
  >(undefined);
  const [dismissedSetup, setDismissedSetup] = useState<string | undefined>(
    undefined,
  );
  const [copied, setCopied] = useState(false);

  const run = (
    action: (typeof TwoFactorAction)[keyof typeof TwoFactorAction],
  ): void => {
    if (!form || !onSubmit) {
      return;
    }
    form.setValue("action", action);
    onSubmit();
  };

  // Load the current status once on open
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current || !form || !onSubmit) {
      return;
    }
    loaded.current = true;
    form.setValue("action", TwoFactorAction.STATUS);
    onSubmit();
  }, [form, onSubmit]);

  // Clear the typed secrets after each response
  useEffect(() => {
    if (res && form) {
      form.setValue("code", "");
      form.setValue("password", "");
    }
  }, [res, form]);

  const back = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(): void => {
        navigation.pop();
      }}
      className="-ml-2 w-fit gap-1.5 text-muted-foreground"
    >
      <ChevronLeft className="h-4 w-4" />
      {t("widget.back")}
    </Button>
  ) : null;

  const enabled = res?.enabled === true;
  const codes =
    res?.recoveryCodes && res.recoveryCodes !== dismissedCodes
      ? res.recoveryCodes
      : undefined;
  const inSetup =
    !enabled && res?.secret !== undefined && res.secret !== dismissedSetup;

  const header = (
    <Div className="flex items-start gap-3 border-b p-5 sm:p-6">
      <Span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Shield className="h-4 w-4" />
      </Span>
      <Div className="flex flex-1 flex-col gap-0.5">
        <H2 className="m-0 border-0 p-0 text-lg font-semibold tracking-tight">
          {t("title")}
        </H2>
        <P className="m-0 text-sm text-muted-foreground">
          {res
            ? enabled
              ? t("widget.onIntro", { count: res.recoveryCodesRemaining })
              : t("widget.offIntro")
            : t("description")}
        </P>
      </Div>
      {res && (
        <Span
          className={
            enabled
              ? "rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success"
              : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
          }
        >
          {enabled ? t("widget.statusOn") : t("widget.statusOff")}
        </Span>
      )}
    </Div>
  );

  let body: JSX.Element;
  if (codes) {
    body = (
      <Div className="flex flex-col gap-4 p-5 sm:p-6">
        <Div className="flex flex-col gap-1">
          <Span className="text-sm font-semibold">
            {t("widget.recoveryTitle")}
          </Span>
          <P className="m-0 text-sm text-muted-foreground">
            {t("widget.recoveryHint")}
          </P>
        </Div>
        <Div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-4 font-mono text-sm">
          {codes.map((c) => (
            <Span key={c}>{c}</Span>
          ))}
        </Div>
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={(): void => {
              void copyToClipboard(codes.join("\n")).then(() =>
                setCopied(true),
              );
            }}
            className="h-11 gap-1.5 sm:h-10"
          >
            <Copy className="h-4 w-4" />
            {copied ? t("widget.recoveryCopied") : t("widget.recoveryCopy")}
          </Button>
          <Button
            type="button"
            onClick={(): void => {
              setDismissedCodes(codes);
              setCopied(false);
            }}
            className="h-11 sm:h-10"
          >
            {t("widget.recoveryDone")}
          </Button>
        </Div>
      </Div>
    );
  } else if (inSetup && res) {
    body = (
      <Div className="flex flex-col gap-4 p-5 sm:p-6">
        <P className="m-0 text-sm">{t("widget.setupStep1")}</P>
        {isWeb && res.qrDataUri && (
          <Div className="mx-auto w-48 overflow-hidden rounded-lg border bg-white p-2">
            <Image
              src={res.qrDataUri}
              alt={t("response.qrDataUri")}
              width={176}
              height={176}
              unoptimized
            />
          </Div>
        )}
        <P className="m-0 text-xs text-muted-foreground">
          {t("widget.setupStep2")}
        </P>
        <Span className="break-all rounded-md border bg-muted/40 px-3 py-2 font-mono text-sm select-all">
          {res.secret}
        </Span>
        <P className="m-0 text-sm">{t("widget.setupStep3")}</P>
        <TextFieldWidget fieldName="code" field={children.code} />
        <FormAlertWidget field={{}} />
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={submitting}
            onClick={(): void => {
              run(TwoFactorAction.ENABLE);
            }}
            className="h-11 sm:h-10"
          >
            {submitting ? t("widget.confirming") : t("widget.confirm")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={(): void => {
              setDismissedSetup(res.secret);
            }}
            className="h-11 sm:h-10"
          >
            {t("widget.cancelSetup")}
          </Button>
        </Div>
      </Div>
    );
  } else if (enabled) {
    body = (
      <Div className="flex flex-col gap-4 p-5 sm:p-6">
        <Div className="flex flex-col gap-1">
          <Span className="text-sm font-semibold">
            {t("widget.manageTitle")}
          </Span>
          <P className="m-0 text-sm text-muted-foreground">
            {t("widget.manageHint")}
          </P>
        </Div>
        <TextFieldWidget fieldName="code" field={children.code} />
        <Div className="flex flex-col gap-2 border-t pt-4">
          <P className="m-0 text-xs text-muted-foreground">
            {t("widget.disablePasswordHint")}
          </P>
          <PasswordFieldWidget fieldName="password" field={children.password} />
        </Div>
        <FormAlertWidget field={{}} />
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={(): void => {
              run(TwoFactorAction.REGENERATE);
            }}
            className="h-11 sm:h-10"
          >
            {t("widget.regenerate")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={(): void => {
              run(TwoFactorAction.DISABLE);
            }}
            className="h-11 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-10"
          >
            {t("widget.disable")}
          </Button>
        </Div>
      </Div>
    );
  } else {
    body = (
      <Div className="flex flex-col gap-4 p-5 sm:p-6">
        <FormAlertWidget field={{}} />
        <Button
          type="button"
          disabled={submitting || !res}
          onClick={(): void => {
            run(TwoFactorAction.SETUP);
          }}
          className="h-11 w-full sm:h-10 sm:w-fit"
        >
          {submitting ? t("widget.working") : t("widget.startSetup")}
        </Button>
      </Div>
    );
  }

  return (
    <WidgetShell className="gap-4">
      {back}
      <Div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        {header}
        {body}
      </Div>
    </WidgetShell>
  );
}
