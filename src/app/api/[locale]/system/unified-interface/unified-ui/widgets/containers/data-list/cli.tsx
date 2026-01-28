/**
 * Data List Widget - Ink implementation
 * Handles DATA_LIST widget type for list displays
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { InkWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import { isResponseField } from "../../_shared/type-guards";
import { hasChildren, isObject } from "../../_shared/type-guards";
import type { DataListWidgetConfig } from "./types";

/**
 * Data List Widget - Ink functional component
 *
 * Displays data in a list format.
 */
export function DataListWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends
    | "array"
    | "object"
    | "object-optional"
    | "widget-object"
    | "array-optional",
  TChildOrChildren,
  TTargetEndpoint extends CreateApiEndpointAny | undefined = undefined,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  DataListWidgetConfig<
    TKey,
    TUsage,
    TSchemaType,
    TChildOrChildren,
    TTargetEndpoint
  >
>): JSX.Element {
  const { title: titleKey } = field;
  const { t } = context;

  const title = titleKey ? t(titleKey) : undefined;

  // Handle array data
  const items = field.value;

  return (
    <Box flexDirection="column" marginY={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold>{title}</Text>
        </Box>
      )}

      {items.length === 0 && (
        <Text dimColor>
          {t("app.api.system.unifiedInterface.cli.widgets.dataList.noItems")}
        </Text>
      )}

      {items.map((item, index) => {
        // Filter children based on responseOnly mode
        const childEntries = hasChildren(field)
          ? Object.entries(field.children)
          : [];
        const filteredChildren = childEntries.filter(
          ([childName, childField]) => {
            // In responseOnly mode, only show response fields with data
            if (context.responseOnly) {
              if (!isResponseField(childField)) {
                return false;
              }
              const childValue = isObject(item) ? item[childName] : undefined;
              return childValue !== null && childValue !== undefined;
            }
            // In interactive mode, show all fields but filter response fields without data
            if (isResponseField(childField)) {
              const childValue = isObject(item) ? item[childName] : undefined;
              return childValue !== null && childValue !== undefined;
            }
            return true;
          },
        );

        return (
          <Box key={index} marginLeft={2} marginY={0}>
            <Text>• </Text>
            {hasChildren(field) ? (
              <Box flexDirection="column">
                {filteredChildren.map(([childName, childField]) => {
                  const childValue = isObject(item)
                    ? item[childName]
                    : undefined;

                  return (
                    <InkWidgetRenderer
                      key={childName}
                      field={{ ...childField, value: childValue }}
                      fieldName={childName}
                      context={context}
                    />
                  );
                })}
              </Box>
            ) : (
              <Text>{`${item}`}</Text>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
