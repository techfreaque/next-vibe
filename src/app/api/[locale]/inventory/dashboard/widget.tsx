"use client";

import { Button } from "next-vibe-ui/ui/button";
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { MetricCard } from "next-vibe-ui/ui/metric-card";
import { MetricGrid } from "next-vibe-ui/ui/metric-grid";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";

export function InventoryDashboardWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();

  const handleStockLevels = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../stock/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleTransfers = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../transfer/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleWarehouses = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../warehouse/list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  if (!data) {
    return <LoadingBlock message={t("dashboard.get.widget.loading")} />;
  }

  const outCount = data.outOfStockCount;
  const pendingCount = data.pendingTransferCount;

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("dashboard.get.title")}
        actions={
          <>
            <Button
              type="button"
              size="sm"
              variant="default"
              onClick={handleStockLevels}
            >
              {t("dashboard.get.widget.navStockLevels")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleTransfers}
            >
              {t("dashboard.get.widget.navTransfers")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleWarehouses}
            >
              {t("dashboard.get.widget.navWarehouses")}
            </Button>
          </>
        }
      />

      <MetricGrid columns={4}>
        <MetricCard
          label={t("dashboard.get.widget.kpiInStock")}
          value={data.inStockCount}
          variant="success"
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiOutOfStock")}
          value={outCount}
          variant={outCount > 0 ? "danger" : "default"}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiLowStock")}
          value={data.lowStockCount}
          variant={data.lowStockCount > 0 ? "warning" : "default"}
        />
        <MetricCard
          label={t("dashboard.get.widget.kpiWarehouses")}
          value={data.warehouseCount}
          variant="info"
        />
      </MetricGrid>

      {outCount > 0 && (
        <MetricCard
          label={t("dashboard.get.widget.alertOutOfStock")}
          value={outCount}
          variant="danger"
        />
      )}

      {pendingCount > 0 && (
        <MetricCard
          label={t("dashboard.get.widget.pendingTransfers")}
          value={pendingCount}
          variant="info"
        />
      )}
    </WidgetShell>
  );
}
