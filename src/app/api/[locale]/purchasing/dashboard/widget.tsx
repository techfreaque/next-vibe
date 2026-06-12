"use client";

import { Button, type ButtonMouseEvent } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";

import type definition from "./definition";

interface KpiCardProps {
  label: string;
  value: number;
  highlight?: "amber" | "red" | "emerald" | "blue";
}

function KpiCard({ label, value, highlight }: KpiCardProps): JSX.Element {
  const colorMap: Record<string, string> = {
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
  };
  const valueClass = highlight
    ? (colorMap[highlight] ?? "text-foreground")
    : "text-foreground";

  return (
    <Div className="flex flex-col gap-1 rounded-lg border bg-card px-5 py-4 flex-1 min-w-[120px]">
      <Span className={`text-2xl font-bold tabular-nums ${valueClass}`}>
        {value}
      </Span>
      <Span className="text-xs text-muted-foreground">{label}</Span>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PurchasingDashboardWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleNewPo = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../order/create/definition"),
        import("../order/[poId]/get/definition"),
      ]);
      navigation.push(createDef.default.POST, {
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            poId: responseData.result.id,
          }),
        },
      });
    })();
  };

  const handleAllPos = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../order/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleVendors = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const def = await import("../vendor/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleNewVendor = (e: ButtonMouseEvent): void => {
    e.stopPropagation();
    void (async (): Promise<void> => {
      const [createDef, getDef] = await Promise.all([
        import("../vendor/create/definition"),
        import("../vendor/[vendorId]/get/definition"),
      ]);
      navigation.push(createDef.default.POST, {
        replaceOnSuccess: {
          endpoint: getDef.default.GET,
          getUrlPathParams: (responseData) => ({
            vendorId: responseData.id,
          }),
        },
      });
    })();
  };

  if (data === undefined) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <Span className="text-sm">{t("dashboard.get.widget.loading")}</Span>
      </Div>
    );
  }

  const dueCount = data.dueThisWeekCount;
  const warningText =
    dueCount === 1
      ? t("dashboard.get.widget.warningDueThisWeek").replace(
          "{{count}}",
          String(dueCount),
        )
      : t("dashboard.get.widget.warningDueThisWeekPlural").replace(
          "{{count}}",
          String(dueCount),
        );

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-6">
      {/* KPI row */}
      <Div className="flex flex-wrap gap-3">
        <KpiCard
          label={t("dashboard.get.widget.kpiDraft")}
          value={data.draftCount}
          highlight="blue"
        />
        <KpiCard
          label={t("dashboard.get.widget.kpiConfirmed")}
          value={data.confirmedCount}
          highlight="emerald"
        />
        <KpiCard
          label={t("dashboard.get.widget.kpiAwaitingReceipt")}
          value={data.awaitingReceiptCount}
          highlight="amber"
        />
        <KpiCard
          label={t("dashboard.get.widget.kpiActiveVendors")}
          value={data.activeVendorCount}
        />
      </Div>

      {/* Due this week warning */}
      {dueCount > 0 ? (
        <Div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 px-4 py-3">
          <Span className="text-sm font-medium text-amber-700 dark:text-amber-400">
            {warningText}
          </Span>
        </Div>
      ) : null}

      {/* Quick nav */}
      <Div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="default" onClick={handleNewPo}>
          {t("dashboard.get.widget.navNewPo")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAllPos}
        >
          {t("dashboard.get.widget.navAllPos")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleVendors}
        >
          {t("dashboard.get.widget.navVendors")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleNewVendor}
        >
          {t("dashboard.get.widget.navNewVendor")}
        </Button>
      </Div>
    </Div>
  );
}
