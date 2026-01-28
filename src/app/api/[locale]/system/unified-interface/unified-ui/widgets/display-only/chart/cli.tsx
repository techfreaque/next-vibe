/**
 * Chart Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { type ChartDataPoint, extractChartData } from "./shared";
import type { ChartWidgetConfig, ChartWidgetSchema } from "./types";

export function ChartWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        ChartWidgetConfig<TKey, never, TUsage, "widget">
      >
    | InkWidgetProps<
        TEndpoint,
        ChartWidgetConfig<TKey, ChartWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field, context } = props;
  const { t: globalT } = simpleT(context.locale);
  const {
    chartType = "line",
    label: labelKey,
    title: titleKey,
    description: descriptionKey,
  } = field;

  const chartTitleKey = labelKey || titleKey;
  const title = chartTitleKey ? context.t(chartTitleKey) : undefined;
  const description = descriptionKey ? context.t(descriptionKey) : undefined;

  const chartData = extractChartData(field.value);

  if (!chartData || chartData.data.length === 0) {
    return (
      <Box flexDirection="column" paddingY={1}>
        {title && <Text bold>{title}</Text>}
        {description && <Text dimColor>{description}</Text>}
        <Box paddingTop={1}>
          <Text dimColor>
            {globalT(
              "app.api.system.unifiedInterface.widgets.chart.noDataAvailable",
            )}
          </Text>
        </Box>
      </Box>
    );
  }

  const isPie = chartType === "pie" || chartType === "donut";

  if (isPie) {
    const firstSeries = chartData.data[0];
    const pieData = firstSeries?.data.filter((d) => d.y > 0) || [];

    if (pieData.length === 0) {
      return (
        <Box flexDirection="column" paddingY={1}>
          {title && <Text bold>{title}</Text>}
          <Box paddingTop={1}>
            <Text dimColor>
              {globalT(
                "app.api.system.unifiedInterface.widgets.chart.noDataToDisplay",
              )}
            </Text>
          </Box>
        </Box>
      );
    }

    const totalValue = pieData.reduce((sum, item) => sum + item.y, 0);

    return (
      <Box flexDirection="column" paddingY={1}>
        {title && <Text bold>{title}</Text>}
        {description && <Text dimColor>{description}</Text>}
        <Box flexDirection="column" paddingTop={1}>
          {pieData.map((d: ChartDataPoint, idx: number) => {
            const rawLabel = String(d.label ?? d.x ?? "");
            const translatedLabel = context.t(rawLabel as TranslationKey);
            const percentage = totalValue > 0 ? (d.y / totalValue) * 100 : 0;
            const barLength = Math.round((percentage / 100) * 30);
            const bar = "█".repeat(Math.max(1, barLength));

            return (
              <Box key={idx} flexDirection="column" marginBottom={1}>
                <Box>
                  <Text color="cyan">{translatedLabel}: </Text>
                  <Text>{d.y}</Text>
                  <Text dimColor> ({percentage.toFixed(1)}%)</Text>
                </Box>
                <Box>
                  <Text color="green">{bar}</Text>
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box paddingTop={1}>
          <Text dimColor>
            {globalT("app.api.system.unifiedInterface.widgets.chart.total")}:{" "}
            <Text>{totalValue}</Text>
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingY={1}>
      {title && <Text bold>{title}</Text>}
      {description && <Text dimColor>{description}</Text>}
      <Box flexDirection="column" paddingTop={1}>
        {chartData.data.map((series, seriesIdx) => (
          <Box key={seriesIdx} flexDirection="column" marginBottom={1}>
            {chartData.data.length > 1 && (
              <Text color="cyan" bold>
                {series.name}
              </Text>
            )}
            {series.data.map((d: ChartDataPoint, idx: number) => {
              const rawLabel = String(d.label ?? d.x ?? "");
              const translatedLabel = context.t(rawLabel as TranslationKey);
              const maxY = Math.max(...series.data.map((p) => p.y), 1);
              const barLength = Math.round((d.y / maxY) * 40);
              const bar =
                chartType === "bar" || chartType === "area"
                  ? "█".repeat(Math.max(0, barLength))
                  : "●";

              return (
                <Box key={idx} marginBottom={0}>
                  <Box width={20}>
                    <Text>{translatedLabel}</Text>
                  </Box>
                  <Box width={5}>
                    <Text dimColor>{d.y}</Text>
                  </Box>
                  <Box>
                    <Text color="blue">{bar}</Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
