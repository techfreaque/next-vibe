/**
 * Cron Executions Failed – Data Source Chart Widget
 */

"use client";

import React from "react";

import { DataSourceChartWidget } from "../../../dataflow/shared/data-source-widget";
import { useWidgetTranslation } from "../../../unified-ui/_shared/use-widget-context";
import definitions from "./definition";

export function CronExecutionsFailedWidget(): React.JSX.Element {
  const t = useWidgetTranslation<typeof definitions.POST>();
  return (
    <DataSourceChartWidget
      definition={definitions}
      label={t("post.fields.result.label")}
    />
  );
}
