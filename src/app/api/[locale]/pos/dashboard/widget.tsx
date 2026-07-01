"use client";

import { Badge } from "next-vibe/ui/web/ui/badge";
import { Button } from "next-vibe/ui/web/ui/button";
import { Div } from "next-vibe/ui/web/ui/div";
import { Monitor } from "next-vibe/ui/web/ui/icons/Monitor";
import { ShoppingCart } from "next-vibe/ui/web/ui/icons/ShoppingCart";
import { Span } from "next-vibe/ui/web/ui/span";
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

interface KpiCardProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function KpiCard({
  label,
  value,
  highlight = false,
}: KpiCardProps): JSX.Element {
  return (
    <Div
      className={`flex flex-col gap-1 rounded-lg border px-4 py-3 ${highlight ? "border-blue-500/30 bg-blue-500/5" : ""}`}
    >
      <Span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </Span>
      <Span className="text-2xl font-bold tabular-nums">{value}</Span>
    </Div>
  );
}

interface TerminalCardProps {
  terminal: TerminalRow;
  onViewSession: (terminal: TerminalRow) => void;
  onOpenSession: (terminal: TerminalRow) => void;
  onViewOrders: (sessionId: string) => void;
  activeLabel: string;
  inactiveLabel: string;
  openSessionLabel: string;
  viewOrdersLabel: string;
  sessionOpenLabel: string;
  viewSessionLabel: string;
}

function TerminalCard({
  terminal,
  onViewSession,
  onOpenSession,
  onViewOrders,
  activeLabel,
  inactiveLabel,
  openSessionLabel,
  viewOrdersLabel,
  sessionOpenLabel,
  viewSessionLabel,
}: TerminalCardProps): JSX.Element {
  return (
    <Div
      className={`flex items-center gap-3 px-4 py-4 border-b last:border-b-0 transition-colors ${terminal.isActive ? "hover:bg-muted/30" : "opacity-55"}`}
    >
      {/* Icon */}
      <Div
        className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
          terminal.hasOpenSession
            ? "bg-green-500/10 border border-green-500/30"
            : terminal.isActive
              ? "bg-blue-500/10 border border-blue-500/30"
              : "bg-muted"
        }`}
      >
        <Monitor
          className={`h-5 w-5 ${
            terminal.hasOpenSession
              ? "text-green-600 dark:text-green-400"
              : terminal.isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-muted-foreground"
          }`}
        />
      </Div>

      {/* Info — clickable to view session detail */}
      <Div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onViewSession(terminal)}
      >
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="text-sm font-semibold truncate">
            {terminal.name}
          </Span>
          {terminal.hasOpenSession ? (
            <Badge
              variant="default"
              className="text-xs py-0 h-4 bg-green-600 hover:bg-green-600"
            >
              {sessionOpenLabel}
            </Badge>
          ) : (
            <Badge
              variant={terminal.isActive ? "default" : "secondary"}
              className={`text-xs py-0 h-4 ${terminal.isActive ? "bg-blue-600 hover:bg-blue-600" : ""}`}
            >
              {terminal.isActive ? activeLabel : inactiveLabel}
            </Badge>
          )}
        </Div>
        <Div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {terminal.location ? (
            <Span className="text-xs text-muted-foreground">
              {terminal.location}
            </Span>
          ) : null}
          <Badge variant="outline" className="text-xs py-0 h-4 font-mono">
            {terminal.currency}
          </Badge>
        </Div>
      </Div>

      {/* CTA */}
      {terminal.hasOpenSession && terminal.openSessionId ? (
        <Div className="flex gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="shrink-0"
            onClick={() => onViewSession(terminal)}
          >
            {viewSessionLabel}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="default"
            className="shrink-0 bg-green-600 hover:bg-green-700"
            onClick={() => onViewOrders(terminal.openSessionId ?? "")}
          >
            {viewOrdersLabel}
          </Button>
        </Div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant={terminal.isActive ? "outline" : "ghost"}
          className="shrink-0"
          onClick={() => onOpenSession(terminal)}
          disabled={!terminal.isActive}
        >
          {openSessionLabel}
        </Button>
      )}
    </Div>
  );
}

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

  const handleOpenSession = (terminal: TerminalRow): void => {
    void (async (): Promise<void> => {
      posTerminalNameMap.set(terminal.id, terminal.name);
      const sessionDef = await import("../session/open/definition");
      navigation.push(sessionDef.default.POST, {
        data: {
          details: {
            terminalId: terminal.id,
            openingFloat: 0,
          },
        },
      });
    })();
  };

  const handleViewSession = (terminal: TerminalRow): void => {
    if (terminal.openSessionId) {
      void (async (): Promise<void> => {
        const def = await import("../session/[sessionId]/get/definition");
        navigation.push(def.default.GET, {
          urlPathParams: { sessionId: terminal.openSessionId ?? "" },
        });
      })();
    } else {
      void (async (): Promise<void> => {
        const def = await import("../terminal/list/definition");
        navigation.push(def.default.GET, {});
      })();
    }
  };

  const handleViewOrders = (sessionId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../order/list/definition");
      navigation.push(def.default.GET, {
        data: {
          input: { sessionId, status: undefined },
          page: 1,
          pageSize: 50,
        },
      });
    })();
  };

  const handleAllTerminals = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../terminal/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  // Loading state
  if (!data) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col items-center gap-4 py-12 rounded-lg border border-dashed">
        <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border-2 border-dashed border-muted-foreground/30">
          <ShoppingCart className="h-6 w-6 text-muted-foreground" />
        </Div>
        <Div className="flex flex-col gap-1 text-center px-4">
          <Span className="text-base font-semibold">
            {t("dashboard.get.widget.loading")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("dashboard.get.widget.loadingHint")}
          </Span>
        </Div>
      </Div>
    );
  }

  const terminals = data.terminals ?? [];
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: data.currency ?? "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-5">
      {/* KPI Row */}
      <Div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard
          label={t("dashboard.get.widget.kpiTerminals")}
          value={`${data.terminalsActive ?? 0} / ${data.terminalsTotal ?? 0}`}
        />
        <KpiCard
          label={t("dashboard.get.widget.kpiOpenSessions")}
          value={data.openSessionsCount ?? 0}
          highlight={(data.openSessionsCount ?? 0) > 0}
        />
        <KpiCard
          label={t("dashboard.get.widget.kpiTodayOrders")}
          value={data.todayOrderCount ?? 0}
        />
        <KpiCard
          label={t("dashboard.get.widget.kpiTodaySales")}
          value={currencyFormatter.format(data.todaySalesTotal ?? 0)}
          highlight={(data.todaySalesTotal ?? 0) > 0}
        />
      </Div>

      {/* Terminals header */}
      <Div className="flex items-center justify-between gap-3">
        <Span className="text-sm font-semibold">
          {t("dashboard.get.widget.terminalsHeading")}
        </Span>
        <Div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAllTerminals}
          >
            {t("dashboard.get.widget.allTerminals")}
          </Button>
        </Div>
      </Div>

      {/* Terminal list */}
      {terminals.length === 0 ? (
        <Div className="flex flex-col items-center gap-5 py-14 text-center rounded-lg border border-dashed">
          <Div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border border-muted-foreground/20">
            <Monitor className="h-6 w-6 text-muted-foreground" />
          </Div>
          <Div className="flex flex-col gap-2 px-6">
            <Span className="text-base font-semibold">
              {t("dashboard.get.widget.emptyTerminals")}
            </Span>
            <Span className="text-sm text-muted-foreground">
              {t("dashboard.get.widget.emptyTerminalsHint")}
            </Span>
          </Div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAllTerminals}
          >
            {t("dashboard.get.widget.allTerminals")}
          </Button>
        </Div>
      ) : (
        <Div className="rounded-lg border overflow-hidden">
          {terminals.map((terminal: TerminalRow) => (
            <TerminalCard
              key={terminal.id}
              terminal={terminal}
              onViewSession={handleViewSession}
              onOpenSession={handleOpenSession}
              onViewOrders={handleViewOrders}
              activeLabel={t("dashboard.get.widget.statusActive")}
              inactiveLabel={t("dashboard.get.widget.statusInactive")}
              openSessionLabel={t("dashboard.get.widget.openSession")}
              viewOrdersLabel={t("dashboard.get.widget.viewOrders")}
              sessionOpenLabel={t("dashboard.get.widget.statusSessionOpen")}
              viewSessionLabel={t("dashboard.get.widget.viewSession")}
            />
          ))}
        </Div>
      )}
    </Div>
  );
}
