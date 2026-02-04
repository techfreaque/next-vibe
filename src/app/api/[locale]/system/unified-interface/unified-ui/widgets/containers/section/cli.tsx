/**
 * Section Widget - Ink implementation
 * Handles SECTION widget type for grouped content with borders
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import { InkWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import {
  useInkWidgetResponseOnly,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import { withValue } from "../../_shared/field-helpers";
import { isResponseField } from "../../_shared/type-guards";
import type { SectionWidgetConfig } from "./types";

/**
 * Section Widget - Ink functional component
 *
 * Groups content with optional title and border.
 */
export function SectionWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  SectionWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const responseOnly = useInkWidgetResponseOnly();
  const { title: titleKey, description: descriptionKey } = field;

  const title = titleKey ? t(titleKey) : undefined;
  const description = descriptionKey ? t(descriptionKey) : undefined;

  // Get children fields
  const children = field.children || {};
  const childEntries = Object.entries(children);

  // Filter children based on responseOnly mode
  const filteredChildren = childEntries.filter(([name, childField]) => {
    // In responseOnly mode, only show response fields with data
    if (responseOnly) {
      if (!isResponseField(childField)) {
        return false;
      }
      const childValue = field.value[name];
      return childValue !== null && childValue !== undefined;
    }
    // In interactive mode, show all fields but filter response fields without data
    if (isResponseField(childField)) {
      const childValue = field.value[name];
      return childValue !== null && childValue !== undefined;
    }
    return true;
  });

  return (
    <Box flexDirection="column" marginY={1}>
      {/* Title */}
      {title && (
        <Box marginBottom={description ? 0 : 1}>
          <Text bold underline>
            {title}
          </Text>
        </Box>
      )}
      {description && (
        <Box marginBottom={1}>
          <Text dimColor>{description}</Text>
        </Box>
      )}

      {/* Children fields */}
      <Box flexDirection="column">
        {filteredChildren.map(([name, childField]) => {
          const childValue = field.value[name];

          return (
            <InkWidgetRenderer
              key={name}
              field={withValue(childField, childValue, field.value)}
              fieldName={name}
            />
          );
        })}
      </Box>
    </Box>
  );
}
