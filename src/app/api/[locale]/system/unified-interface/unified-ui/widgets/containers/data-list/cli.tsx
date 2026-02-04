/**
 * Data List Widget - Ink implementation
 * Handles DATA_LIST widget type for list displays.
 * Supports both array (items as list entries) and object (children as list entries) variants.
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { MultiWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/MultiWidgetRenderer";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import { hasChild, hasChildren } from "../../_shared/type-guards";
import type { DataListWidgetConfig } from "./types";

/**
 * Data List Widget - Ink functional component
 *
 * Displays data in a list format.
 * - Array variant: each array item is a list entry, child's children define sub-fields
 * - Object variant: each child field is a list entry
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
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  DataListWidgetConfig<TKey, TUsage, TSchemaType, TChildOrChildren, undefined>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { title: titleKey } = field;

  const title = titleKey ? t(titleKey) : undefined;

  // Array variant: each array item is a list entry
  if (hasChild(field)) {
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

        <MultiWidgetRenderer
          childrenSchema={field.child}
          value={items}
          fieldName={undefined}
          renderItem={({ itemData, index }) => {
            // Get children schema from child if it has nested children
            const childrenSchema =
              "children" in field.child ? field.child.children : undefined;

            return (
              <Box key={index} marginLeft={2} marginY={0}>
                <Text>• </Text>
                {childrenSchema ? (
                  <Box flexDirection="column">
                    <MultiWidgetRenderer
                      childrenSchema={childrenSchema}
                      value={itemData}
                      fieldName={undefined}
                    />
                  </Box>
                ) : (
                  <Text>{`${itemData}`}</Text>
                )}
              </Box>
            );
          }}
        />
      </Box>
    );
  }

  // Object variant: each child is a list entry
  if (hasChildren(field)) {
    const { children, value } = field;

    return (
      <Box flexDirection="column" marginY={1}>
        {title && (
          <Box marginBottom={1}>
            <Text bold>{title}</Text>
          </Box>
        )}

        {Object.keys(children).length === 0 ? (
          <Text dimColor>
            {t("app.api.system.unifiedInterface.cli.widgets.dataList.noItems")}
          </Text>
        ) : (
          <Box marginLeft={2}>
            <MultiWidgetRenderer
              childrenSchema={children}
              value={value}
              fieldName={undefined}
            />
          </Box>
        )}
      </Box>
    );
  }

  // Fallback: no renderable data
  return (
    <Box flexDirection="column" marginY={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold>{title}</Text>
        </Box>
      )}
      <Text dimColor>
        {t("app.api.system.unifiedInterface.cli.widgets.dataList.noItems")}
      </Text>
    </Box>
  );
}
