"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import { type JSX, useMemo } from "react";

import billDefinition from "@/payment/bill/[billId]/get/definition";

import type definition from "./definition";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BillLineRemoveWidget(_props: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof definition.POST>();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const responseOnly = useWidgetResponseOnly();
  const interactive = useWidgetIsInteractive() && !responseOnly;
  const billId = form.watch("billId");
  const lineId = form.watch("lineId");
  const verify = interactive && !data?.success && Boolean(billId && lineId);
  const options = useMemo(
    () => ({
      read: {
        urlPathParams: { billId: billId ?? "" },
        queryOptions: {
          enabled: verify,
          staleTime: 0,
          refetchOnMount: "always" as const,
          disableLocalCache: true,
          queryKey: `bill-line-confirmation:${billId ?? ""}:${lineId ?? ""}`,
        },
      },
    }),
    [billId, lineId, verify],
  );
  const verification = useEndpoint(billDefinition, options, logger, user).read;
  const loading =
    verify && (verification?.isLoading || verification?.isFetching);
  const bill = verification?.response?.success
    ? verification.response.data
    : undefined;
  const line =
    bill && bill.id === billId && bill.canEditLines && !loading
      ? bill.lines.find((item) => item.id === lineId)
      : undefined;

  if (data?.success === true) {
    return (
      <Div className="flex flex-col gap-4 p-4 rounded-lg border bg-success/10 border-success/30">
        <Span className="text-xs font-semibold text-success">
          {t("post.success.title")}
        </Span>
        <Span className="text-sm font-medium text-foreground">
          {t("widget.removed")}
        </Span>
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

      <Div className="flex flex-col gap-2">
        <Span className="text-base font-semibold">{t("post.title")}</Span>
        <P className="text-sm text-muted-foreground">{t("post.description")}</P>
      </Div>

      {loading && (
        <Div aria-live="polite">
          <P className="text-sm text-muted-foreground">
            {t("widget.verifying")}
          </P>
        </Div>
      )}
      {interactive && !loading && (!line || !bill) && (
        <Div aria-live="polite">
          <P className="text-sm text-muted-foreground">
            {t("widget.unavailable")}
          </P>
        </Div>
      )}
      {line && bill && (
        <>
          <Div className="flex flex-col gap-1 rounded-md border bg-muted/30 px-4 py-3">
            <Span className="text-sm font-semibold [overflow-wrap:anywhere]">
              {line.description}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("widget.lineGross", {
                amount: formatMoney(line.lineTotal, bill.currency, locale),
              })}
            </Span>
          </Div>
          <Div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
            <P className="text-sm text-destructive">{t("widget.warning")}</P>
          </Div>
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "widget.submit", variant: "destructive" }}
          />
        </>
      )}
      <FormAlertWidget field={{}} />
    </Div>
  );
}
