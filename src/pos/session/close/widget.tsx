"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { useEndpoint } from "next-vibe/unified-ui/hooks/use-endpoint";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";
import { useMemo } from "react";

import { formatPosSettlement } from "../../order/format-settlement";
import sessionGetDefinition from "../[sessionId]/get/definition";
import type definition from "./definition";

interface PosSessionCloseWidgetProps {
  field: (typeof definition.POST)["fields"];
}

function Row({
  label,
  value,
  strong = false,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "success" | "warning" | "danger";
}): JSX.Element {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "danger"
          ? "text-destructive"
          : "";
  return (
    <Div
      className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${strong ? "font-semibold" : ""}`}
    >
      <Span className={strong ? "" : "text-muted-foreground"}>{label}</Span>
      <Span className={`tabular-nums ${toneClass}`}>{value}</Span>
    </Div>
  );
}

function varianceTone(variance: number): "success" | "warning" | "danger" {
  const units = Math.round(Math.abs(variance) * 100);
  if (units === 0) {
    return "success";
  }
  return units <= 500 ? "warning" : "danger";
}

export function PosSessionCloseWidget({
  field,
}: PosSessionCloseWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const logger = useWidgetLogger();
  const user = useWidgetUser();
  const interactive = useWidgetIsInteractive();
  const result = data?.result;
  const sessionId = form?.watch("details.sessionId") ?? "";

  const sessionOptions = useMemo(
    () => ({
      read: {
        urlPathParams: { sessionId },
        queryOptions: {
          enabled: interactive && sessionId.length > 0 && !result,
          staleTime: 0,
        },
      },
    }),
    [sessionId, interactive, result],
  );
  const session = useEndpoint(
    sessionGetDefinition,
    sessionOptions,
    logger,
    user,
  ).read?.data?.result;

  const currency = result?.currency ?? session?.currency;
  const fmt = (n: number): string => formatPosSettlement(n, currency, locale);
  const signed = (n: number): string => `${n > 0 ? "+" : ""}${fmt(n)}`;

  const back = navigation.canGoBack ? (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-1 gap-1.5"
      onClick={() => navigation.pop()}
    >
      <ChevronLeft className="h-4 w-4" />
      {t("sessionClose.post.widget.backToTerminals")}
    </Button>
  ) : undefined;

  const openDashboard = (): void => {
    void import("../../dashboard/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  if (result?.id) {
    const tone = varianceTone(result.variance);
    return (
      <WidgetShell layout="page" className="mx-auto max-w-2xl">
        <WidgetHeader
          title={t("sessionClose.post.success.title")}
          subtitle={[result.terminalName, result.companyName]
            .filter(Boolean)
            .join(" · ")}
          size="page"
        />
        <ResultBanner
          variant={
            tone === "success"
              ? "success"
              : tone === "warning"
                ? "warning"
                : "danger"
          }
          title={
            tone === "success"
              ? t("sessionClose.post.widget.balanced")
              : result.variance > 0
                ? t("sessionClose.post.widget.over", {
                    amount: fmt(result.variance),
                  })
                : t("sessionClose.post.widget.short", {
                    amount: fmt(Math.abs(result.variance)),
                  })
          }
          message={t("sessionClose.post.widget.orderCount", {
            count: new Intl.NumberFormat(locale).format(result.orderCount),
          })}
        />
        <Div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
          <Span className="px-4 py-3 text-[15px] font-semibold">
            {t("sessionClose.post.widget.reconciliationTitle")}
          </Span>
          <Row
            label={t("sessionClose.post.widget.openingFloat")}
            value={fmt(result.openingFloat)}
          />
          <Row
            label={t("sessionClose.post.widget.cashSales")}
            value={fmt(result.cashSalesTotal)}
          />
          {result.cashRefundsTotal > 0 ? (
            <Row
              label={t("sessionClose.post.widget.cashRefunds")}
              value={fmt(-result.cashRefundsTotal)}
            />
          ) : null}
          <Row
            label={t("sessionClose.post.widget.expectedClosingFloat")}
            value={fmt(result.expectedFloat)}
            strong
          />
          {result.closingFloat !== null ? (
            <Row
              label={t("sessionClose.post.widget.actualClosingFloat")}
              value={fmt(result.closingFloat)}
              strong
            />
          ) : null}
          <Row
            label={t("sessionClose.post.widget.variance")}
            value={signed(result.variance)}
            strong
            tone={tone}
          />
          {result.closedAt ? (
            <Row
              label={t("sessionClose.post.response.closedAt")}
              value={new Date(result.closedAt).toLocaleString(locale, {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          ) : null}
        </Div>
        <Div className="flex justify-end">
          <Button type="button" onClick={openDashboard}>
            {t("sessionClose.post.widget.backToPos")}
          </Button>
        </Div>
      </WidgetShell>
    );
  }

  const counted = form?.watch("details.closingFloat");
  const countedValue =
    typeof counted === "number" && Number.isFinite(counted) ? counted : null;
  const liveVariance =
    session && countedValue !== null
      ? (Math.round(countedValue * 10_000) -
          Math.round(session.expectedCash * 10_000)) /
        10_000
      : null;

  return (
    <WidgetShell layout="page" className="mx-auto max-w-2xl">
      <WidgetHeader
        title={t("sessionClose.post.widget.title")}
        subtitle={
          session
            ? t("sessionClose.post.widget.subtitle", {
                terminal: session.terminalName ?? "",
                time: new Date(session.openedAt).toLocaleString(locale, {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })
            : undefined
        }
        size="page"
        backButton={back}
      />
      <FormAlertWidget field={{}} />

      {session ? (
        <Div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
          <Span className="px-4 py-3 text-[15px] font-semibold">
            {t("sessionClose.post.widget.reconciliationTitle")}
          </Span>
          <Row
            label={t("sessionClose.post.widget.openingFloat")}
            value={fmt(session.openingFloat)}
          />
          <Row
            label={t("sessionClose.post.widget.cashSales")}
            value={fmt(session.cashSalesTotal)}
          />
          {session.cashRefundsTotal > 0 ? (
            <Row
              label={t("sessionClose.post.widget.cashRefunds")}
              value={fmt(-session.cashRefundsTotal)}
            />
          ) : null}
          <Row
            label={t("sessionClose.post.widget.expectedClosingFloat")}
            value={fmt(session.expectedCash)}
            strong
          />
        </Div>
      ) : sessionId ? (
        <LoadingBlock />
      ) : null}

      <Div className="flex flex-col gap-1.5 rounded-xl border bg-card p-4">
        <NumberFieldWidget
          fieldName="details.closingFloat"
          presentation="money"
          field={withValue(
            field.children.details.children.closingFloat,
            undefined,
            null,
          )}
        />
        <Span className="text-xs text-muted-foreground">
          {t("sessionClose.post.widget.floatHint")}
        </Span>
        {liveVariance !== null ? (
          <Span
            className={`text-sm font-medium tabular-nums ${
              varianceTone(liveVariance) === "success"
                ? "text-success"
                : varianceTone(liveVariance) === "warning"
                  ? "text-warning"
                  : "text-destructive"
            }`}
          >
            {liveVariance === 0
              ? t("sessionClose.post.widget.balanced")
              : liveVariance > 0
                ? t("sessionClose.post.widget.over", {
                    amount: fmt(liveVariance),
                  })
                : t("sessionClose.post.widget.short", {
                    amount: fmt(Math.abs(liveVariance)),
                  })}
          </Span>
        ) : null}
      </Div>

      <Div className="flex justify-end">
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "sessionGet.get.widget.closeSession" }}
        />
      </Div>
    </WidgetShell>
  );
}
