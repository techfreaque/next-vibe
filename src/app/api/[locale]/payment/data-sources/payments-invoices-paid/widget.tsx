/**
 * Payments Invoices Paid – Data Source Chart Widget
 */

"use client";

import { useWidgetTranslation } from "next-vibe-ui/unified/_shared/use-widget-context";
import React from "react";

import { DataSourceChartWidget } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/data-source-widget";

import definitions from "./definition";

export function PaymentsInvoicesPaidWidget(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  return (
    <DataSourceChartWidget
      definition={definitions}
      label={t("post.fields.result.label")}
    />
  );
}
