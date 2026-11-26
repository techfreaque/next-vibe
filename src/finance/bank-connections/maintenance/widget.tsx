"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function BankMaintenanceWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();
  return (
    <WidgetShell layout="page">
      <WidgetHeader
        size="page"
        title={t("maintenance")}
        subtitle={t("maintenanceHint")}
      />
      <FormAlertWidget field={{}} />
      {data && (
        <DetailGrid columns={2}>
          <DetailField label={t("completed")} value={data.completed} />
          <DetailField label={t("failedFeeds")} value={data.failed} />
          <DetailField label={t("notified")} value={data.reminded} />
        </DetailGrid>
      )}
    </WidgetShell>
  );
}
