/**
 * Link Card Widget - CLI Ink implementation
 * Handles LINK_CARD widget type for interactive terminal UI
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { InkWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { LinkCardWidgetConfig } from "./types";

/**
 * Link Card Widget - Ink functional component
 *
 * Displays a clickable card with children fields rendered inside.
 * The linkKey prop specifies which child field contains the URL.
 */
export function LinkCardWidgetInk<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  LinkCardWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const { linkKey } = field;

  // Extract URL from the specified linkKey (supports dot notation)
  const url = linkKey.split(".").reduce((obj, key) => obj?.[key], field.value);

  if (!url || typeof url !== "string") {
    return (
      <Box borderStyle="round" paddingX={2} paddingY={1}>
        <Text dimColor italic>
          {context.t("system.ui.widgets.linkCard.noLink")}
        </Text>
      </Box>
    );
  }

  // Get children fields
  const children = field.children || {};
  const childEntries = Object.entries(children);

  return (
    <Box borderStyle="round" paddingX={2} paddingY={1} flexDirection="column">
      {/* Show the URL */}
      <Box marginBottom={1}>
        <Text color="blue" underline>
          {url}
        </Text>
      </Box>

      {/* Render children fields */}
      <Box flexDirection="column">
        {childEntries.map(([name, childField]) => {
          const childValue = field.value?.[name];

          return (
            <InkWidgetRenderer
              key={name}
              field={childField}
              fieldName={name}
              value={childValue}
              context={context}
            />
          );
        })}
      </Box>
    </Box>
  );
}
