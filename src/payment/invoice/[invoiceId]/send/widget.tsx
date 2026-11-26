"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Copy } from "next-vibe/ui/components/icons/Copy";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { copyToClipboard } from "next-vibe/ui/lib/clipboard";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EmailFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/email-field/widget";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useState } from "react";

import definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function InvoiceSendWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  if (data?.success === true) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
          {t("post.success.title")}
        </Span>
        <Span className="text-sm font-medium text-foreground">
          {t("widget.sent")}
        </Span>
        {data.viewUrl && <InvoiceShareLink viewUrl={data.viewUrl} />}
        {navigation.canGoBack && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigation.pop()}
            className="self-start"
          >
            {t("widget.back")}
          </Button>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("widget.back")}
        </Button>
      )}

      <Div className="flex flex-col gap-1">
        <Span className="text-base font-semibold">{t("post.title")}</Span>
        <P className="text-sm text-muted-foreground">{t("post.description")}</P>
      </Div>

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}

export function InvoiceShareLink({
  viewUrl,
}: {
  viewUrl: string;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const logger = useWidgetLogger();
  const interactive = useWidgetIsInteractive();
  const [copied, setCopied] = useState<boolean>();

  const copyLink = async (): Promise<void> => {
    const success = await copyToClipboard(viewUrl, logger).catch(() => false);
    setCopied(success);
  };
  return (
    <Div className="flex min-w-0 flex-col gap-1">
      <Span className="text-xs text-muted-foreground">
        {t("widget.viewUrl")}
      </Span>
      <Span className="text-xs font-mono break-all text-foreground">
        {viewUrl}
      </Span>
      {interactive && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1 self-start"
          onClick={() => void copyLink()}
        >
          <Copy className="size-4" />
          {t(copied === true ? "widget.copied" : "widget.copy")}
        </Button>
      )}
      {copied === false && (
        <P className="text-sm text-destructive">{t("widget.copyError")}</P>
      )}
    </Div>
  );
}

export function InvoiceShareWidget({
  field: { children },
}: {
  field: typeof definition.GET.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();

  return (
    <WidgetShell>
      <WidgetHeader title={t("delivery.share")} subtitle={data?.number} />
      <FormAlertWidget field={{}} />
      {!data && interactive && (
        <EntityPickerFieldWidget
          field={children.invoiceId}
          fieldName="invoiceId"
        />
      )}
      {data && (
        <Div className="flex min-w-0 flex-col gap-4">
          <InvoiceShareLink viewUrl={data.viewUrl} />
          <Div className="flex min-w-0 flex-col gap-2 border-t pt-3">
            {data.recipient ? (
              <>
                <P className="text-sm text-muted-foreground">
                  {t("delivery.recipient")}
                </P>
                <P className="break-all text-sm">{data.recipient}</P>
              </>
            ) : (
              <P className="text-sm text-muted-foreground">
                {t("delivery.noRecipient")}
              </P>
            )}
            {data.deliveryStatus !== "ready" && (
              <P className="text-sm">
                {t(`delivery.states.${data.deliveryStatus}`)}
              </P>
            )}
            {interactive &&
              data.recipient &&
              (data.deliveryStatus === "ready" ||
                data.deliveryStatus === "retryable") && (
                <Button
                  type="button"
                  className="self-start"
                  onClick={() => {
                    if (data.recipient) {
                      navigation.push(definition.PATCH, {
                        urlPathParams: { invoiceId: data.id },
                        data: { expectedRecipient: data.recipient },
                        renderInModal: true,
                      });
                    }
                  }}
                >
                  {t("delivery.send")}
                </Button>
              )}
          </Div>
        </Div>
      )}
      {navigation.canGoBack && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="self-start"
          onClick={() => navigation.pop()}
        >
          {t("widget.back")}
        </Button>
      )}
    </WidgetShell>
  );
}

export function InvoiceEmailWidget({
  field: { children },
}: {
  field: typeof definition.PATCH.fields;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.PATCH>();
  const data = useWidgetValue<typeof definition.PATCH>();
  const form = useWidgetForm<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const recipient = form.watch("expectedRecipient");
  const [recipientPrefilled] = useState(() =>
    Boolean(form.getValues("expectedRecipient")),
  );
  return (
    <WidgetShell>
      <WidgetHeader
        title={t("delivery.send")}
        subtitle={!data ? t("delivery.confirmDescription") : undefined}
      />
      <FormAlertWidget field={{}} />
      {data ? (
        <P className="text-sm">{t(`delivery.states.${data.deliveryStatus}`)}</P>
      ) : (
        interactive && (
          <Div className="flex flex-col gap-3">
            <EntityPickerFieldWidget
              field={children.invoiceId}
              fieldName="invoiceId"
            />
            {recipientPrefilled && recipient ? (
              <Div className="flex flex-col gap-1">
                <P className="text-sm text-muted-foreground">
                  {t("delivery.recipient")}
                </P>
                <P className="break-all text-sm">{recipient}</P>
              </Div>
            ) : (
              <EmailFieldWidget
                field={children.expectedRecipient}
                fieldName="expectedRecipient"
              />
            )}
            <SubmitButtonWidget<typeof definition.PATCH>
              field={{ text: "delivery.send", className: "self-start" }}
            />
          </Div>
        )
      )}
      {navigation.canGoBack && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="self-start"
          onClick={() => navigation.pop()}
        >
          {t("widget.back")}
        </Button>
      )}
    </WidgetShell>
  );
}
