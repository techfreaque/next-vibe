/**
 * Accordion Widget - CLI Ink implementation
 * Renders accordion items as sequential sections (no collapse in CLI)
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  BaseObjectWidgetConfig,
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import { MultiWidgetRenderer } from "../../../renderers/cli/MultiWidgetRenderer";
import { hasChild } from "../../_shared/type-guards";
import type { AccordionArrayWidgetConfig } from "./types";

const EMPTY_ITEMS_KEY =
  "app.api.system.unifiedInterface.cli.containers.accordion.noItems";

/**
 * Accordion Widget - Ink functional component
 *
 * Renders accordion items as sequential sections since CLI doesn't support collapse.
 */
export function AccordionWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TChild extends BaseObjectWidgetConfig<
    TKey,
    ConstrainedChildUsage<TUsage>,
    "object" | "object-optional" | "widget-object",
    ObjectChildrenConstraint<
      TKey,
      ConstrainedChildUsage<ConstrainedChildUsage<TUsage>>
    >
  >,
>({
  field,
  fieldName,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  AccordionArrayWidgetConfig<TKey, TUsage, "array" | "array-optional", TChild>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { title: titleKey } = field;

  const title = titleKey ? t(titleKey) : undefined;

  // Handle empty array
  if (!Array.isArray(field.value) || field.value.length === 0) {
    return (
      <Box flexDirection="column" paddingY={1}>
        {title && (
          <Box marginBottom={1}>
            <Text bold underline>
              {title}
            </Text>
          </Box>
        )}
        <Text dimColor>{t(EMPTY_ITEMS_KEY)}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1} paddingY={1}>
      {title && (
        <Box marginBottom={1}>
          <Text bold underline>
            {title}
          </Text>
        </Box>
      )}
      <MultiWidgetRenderer
        childrenSchema={hasChild(field) ? field.child : undefined}
        value={field.value}
        fieldName={fieldName}
        renderItem={({ itemData, index, itemFieldName }) => {
          // Get children from child schema if it has them
          const childrenSchema =
            hasChild(field) && "children" in field.child
              ? field.child.children
              : undefined;

          return (
            <Box key={index} flexDirection="column" paddingLeft={1} gap={0}>
              {/* Render trigger */}
              <MultiWidgetRenderer
                childrenSchema={
                  childrenSchema && "trigger" in childrenSchema
                    ? { trigger: childrenSchema.trigger }
                    : undefined
                }
                value={itemData}
                fieldName={itemFieldName}
              />
              {/* Render content */}
              <Box paddingLeft={2} marginTop={0}>
                <MultiWidgetRenderer
                  childrenSchema={
                    childrenSchema && "content" in childrenSchema
                      ? { content: childrenSchema.content }
                      : undefined
                  }
                  value={itemData}
                  fieldName={itemFieldName}
                />
              </Box>
            </Box>
          );
        }}
      />
    </Box>
  );
}
