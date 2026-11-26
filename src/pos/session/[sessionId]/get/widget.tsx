"use client";

import { Button } from "next-vibe/ui/components/button";
import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { PosSessionStatus } from "../../../enum";
import type definition from "./definition";

type Tone = "success" | "warning" | "danger" | undefined;

function CashRow({
  label,
  value,
  strong = false,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: Tone;
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
      <Span
        className={`whitespace-nowrap text-right tabular-nums ${toneClass}`}
      >
        {value}
      </Span>
    </Div>
  );
}

function varianceTone(variance: number): Tone {
  const cents = Math.round(Math.abs(variance) * 100);
  if (cents === 0) {
    return "success";
  }
  return cents <= 500 ? "warning" : "danger";
}

export function PosSessionGetWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const interactive = useWidgetIsInteractive();
  const session = data?.result;

  const openRegister = (sessionId: string): void => {
    void import("../register/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { sessionId } }),
    );
  };

  const openSales = (sessionId: string): void => {
    void import("../../../order/list/definition").then((def) =>
      navigation.push(def.default.GET, {
        data: {
          input: { sessionId, status: undefined },
          page: 1,
          pageSize: 50,
        },
      }),
    );
  };

  const closeTill = (sessionId: string): void => {
    void import("../../close/definition").then((def) =>
      navigation.push(def.default.POST, {
        data: { details: { sessionId, closingFloat: 0 } },
      }),
    );
  };

  const backButton =
    interactive && navigation.canGoBack ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => navigation.pop()}
        className="-ml-1 gap-1.5"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("sessionGet.get.widget.back")}
      </Button>
    ) : undefined;

  if (!session) {
    return (
      <WidgetShell layout="page" className="mx-auto max-w-3xl">
        <WidgetHeader
          size="page"
          title={t("sessionGet.get.widget.title")}
          backButton={backButton}
        />
        <FormAlertWidget field={{}} />
        {data ? null : (
          <LoadingBlock message={t("sessionGet.get.widget.loading")} />
        )}
      </WidgetShell>
    );
  }

  const isOpen = session.status === PosSessionStatus.OPEN;
  const money = (amount: number): string =>
    formatMoney(amount, session.currency, locale);
  const when = (date: Date): string =>
    new Date(date).toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const closing = session.closingFloat;
  const variance =
    closing === null
      ? null
      : (Math.round(closing * 10_000) -
          Math.round(session.expectedCash * 10_000)) /
        10_000;
  const tone = variance === null ? undefined : varianceTone(variance);

  return (
    <WidgetShell layout="page" className="mx-auto max-w-3xl">
      <WidgetHeader
        size="page"
        title={session.terminalName ?? t("sessionGet.get.widget.title")}
        titleAccessory={
          <StatusPill
            status={session.status}
            variant={isOpen ? "success" : "muted"}
            label={
              isOpen
                ? t("sessionGet.get.widget.selling")
                : t("sessionGet.get.widget.closed")
            }
          />
        }
        subtitle={
          isOpen
            ? t("sessionGet.get.widget.subtitleOpen", {
                time: when(session.openedAt),
              })
            : t("sessionGet.get.widget.subtitleClosed", {
                time: when(session.closedAt ?? session.openedAt),
              })
        }
        backButton={backButton}
        actions={
          interactive ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => openSales(session.id)}
              >
                {t("sessionGet.get.widget.sales")}
              </Button>
              {isOpen ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => closeTill(session.id)}
                  >
                    {t("sessionGet.get.widget.closeTill")}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => openRegister(session.id)}
                  >
                    {t("sessionGet.get.widget.openRegister")}
                  </Button>
                </>
              ) : null}
            </>
          ) : undefined
        }
      />

      <FormAlertWidget field={{}} />

      <Div className="rounded-xl border bg-card p-4">
        <DetailGrid columns={3}>
          <DetailField
            label={t("sessionGet.get.response.companyName")}
            value={session.companyName ?? "-"}
          />
          <DetailField
            label={t("sessionGet.get.response.cashierName")}
            value={session.cashierName ?? "-"}
          />
          <DetailField
            label={t("sessionGet.get.response.openedAt")}
            value={when(session.openedAt)}
          />
          {session.closedAt ? (
            <DetailField
              label={t("sessionGet.get.response.closedAt")}
              value={when(session.closedAt)}
            />
          ) : null}
        </DetailGrid>
      </Div>

      <Div className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
        <Span className="px-4 py-3 text-[15px] font-semibold">
          {t("sessionGet.get.widget.drawerTitle")}
        </Span>
        <CashRow
          label={t("sessionGet.get.response.openingFloat")}
          value={money(session.openingFloat)}
        />
        <CashRow
          label={t("sessionGet.get.response.cashSalesTotal")}
          value={money(session.cashSalesTotal)}
        />
        <CashRow
          label={t("sessionGet.get.response.cashRefundsTotal")}
          value={money(
            session.cashRefundsTotal === 0 ? 0 : -session.cashRefundsTotal,
          )}
        />
        <CashRow
          label={t("sessionGet.get.response.expectedCash")}
          value={money(session.expectedCash)}
          strong
        />
        {closing !== null && variance !== null ? (
          <>
            <CashRow
              label={t("sessionGet.get.response.closingFloat")}
              value={money(closing)}
              strong
            />
            <CashRow
              label={t("sessionGet.get.widget.variance")}
              value={`${variance > 0 ? "+" : ""}${money(variance)}`}
              strong
              tone={tone}
            />
          </>
        ) : null}
      </Div>
    </WidgetShell>
  );
}
