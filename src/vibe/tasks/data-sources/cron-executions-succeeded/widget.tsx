/**
 * Cron Executions Succeeded – Data Source Chart Widget
 */

"use client";

import { DataSourceChartWidget } from "../../../dataflow/shared/data-source-widget";
import { useWidgetTranslation } from "../../../unified-ui/_shared/use-widget-context";
import React from "react";

import definitions from "./definition";

export function CronExecutionsSucceededWidget(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  return (
    <DataSourceChartWidget
      definition={definitions}
      label={t("post.fields.result.label")}
    />
  );
}
