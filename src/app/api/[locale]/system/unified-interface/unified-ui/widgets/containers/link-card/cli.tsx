/**
 * Link Card Widget - CLI Ink implementation
 * Handles LINK_CARD widget type for interactive terminal UI
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import { InkWidgetRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/cli/CliWidgetRenderer";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import { withValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/field-helpers";
import type {
  ConstrainedChildUsage,
  FieldUsageConfig,
  ObjectChildrenConstraint,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

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
  TChildren extends ObjectChildrenConstraint<
    TKey,
    ConstrainedChildUsage<TUsage>
  >,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  LinkCardWidgetConfig<
    TKey,
    TUsage,
    "object" | "object-optional" | "widget-object",
    TChildren
  >
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { linkKey } = field;

  // Extract URL from the specified linkKey (supports dot notation)
  // Extract URL from field.value using linkKey path
  let url: WidgetData = undefined;
  if (field.value && typeof field.value === "object") {
    const keys = linkKey.split(".");
    let current: WidgetData = field.value;
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = (current as Record<string, WidgetData>)[key];
      } else {
        current = undefined;
        break;
      }
    }
    url = current;
  }

  if (!url || typeof url !== "string") {
    return (
      <Box borderStyle="round" paddingX={2} paddingY={1}>
        <Text dimColor italic>
          {t("system.ui.widgets.linkCard.noLink")}
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
              field={withValue(childField, childValue, field.value)}
              fieldName={name}
            />
          );
        })}
      </Box>
    </Box>
  );
}
