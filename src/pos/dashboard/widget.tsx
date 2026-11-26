"use client";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Monitor } from "next-vibe/ui/components/icons/Monitor";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { posTerminalNameMap } from "../terminal/list/widget";
import type definition from "./definition";
import type { PosDashboardGetResponseOutput } from "./definition";

type TerminalRow = NonNullable<
  PosDashboardGetResponseOutput["terminals"]
>[number];

export function PosDashboardWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const navigation = useWidgetNavigation();

  const openRegister = (sessionId: string): void => {
    void import("../session/[sessionId]/register/definition").then((def) =>
      navigation.push(def.default.GET, { urlPathParams: { sessionId } }),
    );
  };

  const openTill = (terminal: TerminalRow): void => {
    posTerminalNameMap.set(terminal.id, terminal.name);
    void Promise.all([
      import("../session/open/definition"),
      import("../session/[sessionId]/register/definition"),
    ]).then(([openDef, registerDef]) =>
      navigation.push(openDef.default.POST, {
        data: { details: { terminalId: terminal.id, openingFloat: 0 } },
        replaceOnSuccess: {
          endpoint: registerDef.default.GET,
          getUrlPathParams: (response) => ({ sessionId: response.result.id }),
        },
      }),
    );
  };

  const closeTill = (sessionId: string): void => {
    void import("../session/close/definition").then((def) =>
      navigation.push(def.default.POST, {
        data: { details: { sessionId, closingFloat: 0 } },
      }),
    );
  };

  const openSalesHistory = (): void => {
    void import("../order/list/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  const createTill = (): void => {
    void import("../terminal/create/definition").then((def) =>
      navigation.push(def.default.POST, {}),
    );
  };

  const manageTills = (): void => {
    void import("../terminal/list/definition").then((def) =>
      navigation.push(def.default.GET, {}),
    );
  };

  const header = (
    <WidgetHeader
      title={t("dashboard.get.widget.title")}
      subtitle={t("dashboard.get.widget.subtitle")}
      size="page"
      actions={
        <Div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={openSalesHistory}>
            {t("dashboard.get.widget.salesHistory")}
          </Button>
          <Button type="button" variant="outline" onClick={createTill}>
            <Plus className="mr-1.5 h-4 w-4" />
            {t("dashboard.get.widget.newTill")}
          </Button>
        </Div>
      }
    />
  );

  if (!data) {
    return (
      <WidgetShell layout="page">
        {header}
        <LoadingBlock />
      </WidgetShell>
    );
  }

  const terminals = data.terminals ?? [];
  const sales = data.salesByCurrency?.length
    ? data.salesByCurrency
    : [{ currency: data.currency, amount: data.todaySalesTotal ?? 0 }];
  const orders = data.todayOrderCount ?? 0;
  const primarySales =
    sales.find((row) => row.currency === data.currency) ?? sales[0];
  const average =
    orders > 0 && primarySales && sales.length === 1
      ? formatMoney(primarySales.amount / orders, primarySales.currency, locale)
      : "-";

  return (
    <WidgetShell layout="page">
      {header}

      <MetricGrid columns={4}>
        <MetricCard
          label={t("dashboard.get.widget.kpiSalesToday")}
          value={sales
            .map((row) => formatMoney(row.amount, row.currency, locale))
            .join(" · ")}
          description={t("dashboard.get.widget.kpiSalesCount", {
            count: String(orders),
          })}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiOpenTills")}
          value={data.openSessionsCount ?? 0}
          description={t("dashboard.get.widget.kpiTillsTotal", {
            active: String(data.terminalsActive ?? 0),
            total: String(data.terminalsTotal ?? 0),
          })}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiAverage")}
          value={average}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiRefunds")}
          value={formatMoney(
            data.refundsToday?.amount ?? 0,
            data.currency,
            locale,
          )}
          description={t("dashboard.get.widget.kpiRefundsCount", {
            count: String(data.refundsToday?.count ?? 0),
          })}
        />
      </MetricGrid>

      <Div className="flex items-center justify-between gap-3">
        <Span className="text-[15px] font-semibold">
          {t("dashboard.get.widget.tillsTitle")}
        </Span>
        {terminals.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={manageTills}>
            {t("dashboard.get.widget.manageTills")}
          </Button>
        ) : null}
      </Div>

      {terminals.length === 0 ? (
        <EmptyBlock
          size="page"
          icon={<Monitor className="h-6 w-6" />}
          title={t("dashboard.get.widget.emptyTitle")}
          message={t("dashboard.get.widget.emptyMessage")}
          action={{
            label: t("dashboard.get.widget.createTill"),
            onClick: createTill,
          }}
        />
      ) : (
        <Div className="grid grid-cols-1 gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {terminals.map((terminal) => (
            <TillCard
              key={terminal.id}
              terminal={terminal}
              onOpenRegister={openRegister}
              onOpenTill={openTill}
              onCloseTill={closeTill}
            />
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}

function TillCard({
  terminal,
  onOpenRegister,
  onOpenTill,
  onCloseTill,
}: {
  terminal: TerminalRow;
  onOpenRegister: (sessionId: string) => void;
  onOpenTill: (terminal: TerminalRow) => void;
  onCloseTill: (sessionId: string) => void;
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.GET>();
  const sessionId = terminal.hasOpenSession ? terminal.openSessionId : null;

  return (
    <Div
      className={`flex flex-col gap-4 rounded-xl border bg-card p-4 ${terminal.isActive ? "" : "opacity-70"}`}
    >
      <Div className="flex items-start gap-3">
        <Div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Monitor className="h-5 w-5 text-muted-foreground" />
        </Div>
        <Div className="min-w-0 flex-1">
          <Span className="block truncate text-base font-semibold">
            {terminal.name}
          </Span>
          <Span className="block truncate text-sm text-muted-foreground">
            {[terminal.location, terminal.currency].filter(Boolean).join(" · ")}
          </Span>
        </Div>
        <StatusPill
          status={terminal.id}
          variant={sessionId ? "success" : terminal.isActive ? "info" : "muted"}
          label={
            sessionId
              ? t("dashboard.get.widget.tillSelling")
              : terminal.isActive
                ? t("dashboard.get.widget.tillReady")
                : t("dashboard.get.widget.tillInactive")
          }
        />
      </Div>
      {sessionId ? (
        <Div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="lg"
            className="flex-1 px-4"
            onClick={() => onOpenRegister(sessionId)}
          >
            {t("dashboard.get.widget.openRegister")}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="px-4"
            onClick={() => onCloseTill(sessionId)}
          >
            {t("dashboard.get.widget.closeTill")}
          </Button>
        </Div>
      ) : (
        <Button
          type="button"
          size="lg"
          variant="outline"
          disabled={!terminal.isActive}
          onClick={() => onOpenTill(terminal)}
        >
          {t("dashboard.get.widget.openTill")}
        </Button>
      )}
    </Div>
  );
}
