/**
 * Separator Widget - Ink implementation
 * Handles SEPARATOR widget type for visual dividers
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import type { SeparatorWidgetConfig } from "./types";

/**
 * Separator Widget - Ink functional component
 *
 * Renders a visual separator line.
 */
export function SeparatorWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  SeparatorWidgetConfig<TKey, TUsage, "widget">
>): JSX.Element {
  const { label: labelKey } = field;
  const { t } = context;

  const label = labelKey ? t(labelKey) : undefined;

  if (label) {
    return (
      <Box marginY={1}>
        {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator decoration */}
        <Text dimColor>─── {label} ───</Text>
      </Box>
    );
  }

  return (
    <Box marginY={1}>
      {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Separator decoration */}
      <Text dimColor>───────────────────────────</Text>
    </Box>
  );
}
