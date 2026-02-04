/**
 * DataCards Widget - Ink implementation
 * Renders cards as a list in CLI
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import {
  useInkWidgetLocale,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";
import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { MultiWidgetRenderer } from "../../../renderers/cli/MultiWidgetRenderer";
import type { InkWidgetProps } from "../../_shared/cli-types";
import { hasChild, hasChildren } from "../../_shared/type-guards";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "../../_shared/types";
import type { DataCardsWidgetConfig } from "./types";

export function DataCardsWidgetInk<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TChildOrChildren extends
    | ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>
    | ObjectChildrenConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>(
  props: InkWidgetProps<
    TEndpoint,
    DataCardsWidgetConfig<
      TKey,
      TUsage,
      | "array"
      | "array-optional"
      | "object"
      | "object-optional"
      | "widget-object",
      TChildOrChildren
    >
  >,
): JSX.Element {
  const locale = useInkWidgetLocale();
  const { t: simpleTParse } = simpleT(locale);
  const t = useInkWidgetTranslation();
  const { field, fieldName } = props;

  // Handle array data
  if (hasChild(field)) {
    if (field.value.length === 0) {
      return (
        <Box>
          <Text>{simpleTParse("app.common.noData")}</Text>
        </Box>
      );
    }

    // Check if child has children to render
    const childrenToRender =
      "children" in field.child ? field.child.children : undefined;

    return (
      <Box flexDirection="column" marginY={0}>
        <MultiWidgetRenderer
          childrenSchema={field.child}
          value={field.value}
          fieldName={fieldName}
          renderItem={({ itemData, index, itemFieldName }) => {
            return (
              <Box
                key={index}
                flexDirection="column"
                marginBottom={1}
                paddingLeft={2}
              >
                <Text bold dimColor>
                  {t(
                    "app.api.system.unifiedInterface.cli.widgets.dataCards.card",
                    {
                      index: index + 1,
                    },
                  )}
                </Text>
                <MultiWidgetRenderer
                  childrenSchema={childrenToRender}
                  value={itemData}
                  fieldName={itemFieldName}
                />
              </Box>
            );
          }}
        />
      </Box>
    );
  }

  // Handle object data
  if (hasChildren(field)) {
    const { children, value } = field;
    const childKeys = Object.keys(children);

    if (childKeys.length === 0) {
      return (
        <Box>
          <Text>{simpleTParse("app.common.noData")}</Text>
        </Box>
      );
    }

    return (
      <Box flexDirection="column" marginY={0}>
        {childKeys.map((childName) => {
          const childField = children[childName];
          const itemData = value[childName];
          if (childField && itemData !== undefined) {
            return (
              <Box
                key={childName}
                flexDirection="column"
                marginBottom={1}
                paddingLeft={2}
              >
                <Text bold dimColor>
                  {t(childName)}:
                </Text>
                <MultiWidgetRenderer
                  childrenSchema={{ [childName]: childField }}
                  value={value}
                  fieldName={fieldName}
                />
              </Box>
            );
          }
          return null;
        })}
      </Box>
    );
  }

  // No data
  return (
    <Box>
      <Text>{simpleTParse("app.common.noData")}</Text>
    </Box>
  );
}
