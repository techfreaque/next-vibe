"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
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
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
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

  const backButton = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("widget.back")}
    </Button>
  ) : undefined;

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.description")}
      backButton={backButton}
      primaryAction={
        !data?.success && line && bill ? (
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "widget.submit", variant: "destructive" }}
          />
        ) : null
      }
    >
      {data?.success === true ? (
        <ResultBanner
          variant="success"
          title={t("post.success.title")}
          message={t("widget.removed")}
        >
          {navigation.canGoBack && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigation.pop()}
            >
              {t("widget.back")}
            </Button>
          )}
        </ResultBanner>
      ) : (
        <Div className="flex flex-col gap-4">
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
              <Div className="flex flex-col gap-1 rounded-lg border bg-muted/30 px-4 py-3">
                <Span className="text-sm font-semibold [overflow-wrap:anywhere]">
                  {line.description}
                </Span>
                <Span className="text-sm text-muted-foreground">
                  {t("widget.lineGross", {
                    amount: formatMoney(line.lineTotal, bill.currency, locale),
                  })}
                </Span>
              </Div>
              <Div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                <P className="text-sm text-destructive">
                  {t("widget.warning")}
                </P>
              </Div>
            </>
          )}
        </Div>
      )}
    </AdminForm>
  );
}
