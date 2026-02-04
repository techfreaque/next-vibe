/**
 * Empty State Widget - CLI Ink implementation
 * Displays empty state message with optional description
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { EmptyStateWidgetConfig } from "./types";

/**
 * Empty State Widget - Ink functional component
 *
 * Displays empty state with title, optional description, and icon.
 */
export function EmptyStateWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  EmptyStateWidgetConfig<TKey, TUsage, "widget">
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { title: titleKey, message: messageKey, icon } = field;

  const title = t(titleKey);
  const description = messageKey ? t(messageKey) : undefined;

  return (
    <Box flexDirection="column" gap={0} paddingY={2} alignItems="center">
      {icon && (
        <Box marginBottom={1}>
          <Text>{icon}</Text>
        </Box>
      )}
      <Text bold dimColor>
        {title}
      </Text>
      {description && (
        <Box marginTop={0}>
          <Text dimColor>{description}</Text>
        </Box>
      )}
    </Box>
  );
}
