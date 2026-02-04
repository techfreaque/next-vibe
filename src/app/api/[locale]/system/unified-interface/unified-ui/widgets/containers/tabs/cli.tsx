/**
 * Tabs Widget - CLI Ink implementation
 * Renders all tabs as sequential sections (no tab switching in CLI)
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  BaseWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
  SchemaTypes,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import { MultiWidgetRenderer } from "../../../renderers/cli/MultiWidgetRenderer";
import { useInkWidgetTranslation } from "../../_shared/use-ink-widget-context";
import type { TabsWidgetConfig } from "./types";

/**
 * Tabs Widget - Ink functional component
 *
 * Renders all tabs as sequential sections since CLI doesn't support interactive tabs.
 */
export function TabsWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TabsWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { tabs: tabsConfig, title: titleKey, children } = field;

  const title = titleKey ? t(titleKey) : undefined;

  // If no children, show empty state
  if (!children || Object.keys(children).length === 0) {
    return (
      <Box flexDirection="column" paddingY={1}>
        {title && (
          <Box marginBottom={1}>
            <Text bold underline>
              {title}
            </Text>
          </Box>
        )}
        <Text dimColor>{t("system.ui.widgets.tabs.empty")}</Text>
      </Box>
    );
  }

  const childEntries = Object.entries(children) as Array<
    [string, BaseWidgetConfig<FieldUsageConfig, SchemaTypes>]
  >;

  return (
    <Box flexDirection="column" gap={1} paddingY={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold underline>
            {title}
          </Text>
        </Box>
      )}
      {childEntries.map(([childKey], index) => {
        const tabConfig = tabsConfig?.[index];
        const tabLabel = tabConfig?.label ? t(tabConfig.label) : childKey;

        return (
          <Box key={childKey} flexDirection="column" gap={0}>
            <Text bold>{tabLabel}</Text>
            <Box paddingLeft={2}>
              <MultiWidgetRenderer
                childrenSchema={{ [childKey]: children[childKey] }}
                value={field.value}
                fieldName={undefined}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
