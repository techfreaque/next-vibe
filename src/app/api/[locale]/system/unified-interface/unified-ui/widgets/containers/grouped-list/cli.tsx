/**
 * GroupedList Widget - Ink implementation
 * Displays items in expandable groups with summaries
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
import { useInkWidgetLocale } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
import { simpleT } from "@/i18n/core/shared"; // for global keys only

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { WidgetData } from "../../../../shared/widgets/widget-data";
import {
  extractGroupedListData,
  getDisplayItems,
  getRemainingItemsCount,
} from "./shared";
import type { GroupedListWidgetConfig } from "./types";

export function GroupedListWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>(
  props: InkWidgetProps<
    TEndpoint,
    GroupedListWidgetConfig<TKey, TUsage, TSchemaType, TChild>
  >,
): JSX.Element {
  const t = useInkWidgetTranslation();
  const locale = useInkWidgetLocale();
  const { t: simpleTParse } = simpleT(locale);
  const { field } = props;
  const { groupBy, sortBy } = field;

  const config = groupBy ? { groupBy, sortBy } : undefined;
  const data = extractGroupedListData(field.value, config);

  if (!data) {
    return <Text>{simpleTParse("app.common.noData")}</Text>;
  }

  const { groups, maxItemsPerGroup, showGroupSummary } = data;

  return (
    <Box flexDirection="column">
      {groups.map((group) => {
        const groupLabel =
          typeof group.label === "string" ? t(group.label) : "";
        const itemCount = group.items.length;
        const displayItems = getDisplayItems(
          group.items,
          maxItemsPerGroup,
          true,
        );
        const remainingCount = getRemainingItemsCount(
          itemCount,
          maxItemsPerGroup,
        );

        return (
          <Box key={group.key} flexDirection="column" marginBottom={1}>
            <Text bold>
              {groupLabel} ({itemCount})
            </Text>

            {showGroupSummary && group.summary && (
              <Box flexDirection="column" paddingLeft={2} marginBottom={1}>
                {Object.entries(group.summary).map(([key, value]) => {
                  const translatedKey = typeof key === "string" ? t(key) : "";
                  return (
                    <Text key={key} dimColor>
                      {translatedKey}: {formatDisplayValue(value)}
                    </Text>
                  );
                })}
              </Box>
            )}

            <Box flexDirection="column" paddingLeft={2}>
              {displayItems.map((item, itemIndex: number) => (
                <Box key={itemIndex} flexDirection="column" marginBottom={1}>
                  {Object.entries(item).map(([key, value]) => {
                    const translatedKey = typeof key === "string" ? t(key) : "";
                    return (
                      <Text key={key} dimColor>
                        {translatedKey}: {formatDisplayValue(value)}
                      </Text>
                    );
                  })}
                </Box>
              ))}

              {remainingCount > 0 && (
                <Text dimColor italic>
                  {t(
                    "app.api.system.unifiedInterface.react.widgets.groupedList.showMore",
                    {
                      count: remainingCount,
                    },
                  )}
                </Text>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/**
 * Format value for display (handles all WidgetData types)
 */
function formatDisplayValue(value: WidgetData): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number") {
    return `${value}`;
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return "";
}
