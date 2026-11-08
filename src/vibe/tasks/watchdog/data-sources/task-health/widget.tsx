/**
 * Task Health - Data Source Chart Widget
 */

"use client";

import { DataSourceChartWidget } from "next-vibe/dataflow/shared/data-source-widget";
import { useWidgetTranslation } from "next-vibe/unified-ui/_shared/use-widget-context";
import React from "react";

import definitions from "./definition";

export function TaskHealthSeriesWidget(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  return (
    <DataSourceChartWidget
      definition={definitions}
      label={t("dataSources.taskHealth.post.fields.result.label")}
    />
  );
}
