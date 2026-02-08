/**
 * Icon Widget - Ink implementation
 * Handles ICON widget type for icon display
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  IconSchemaNullishType,
  IconSchemaOptionalType,
  IconSchemaType,
} from "@/app/api/[locale]/shared/types/common.schema";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { getCliIcon } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/cli-icons";

import type { IconWidgetConfig } from "./types";

/**
 * Icon Widget - Ink functional component
 *
 * Displays an icon using unicode/emoji characters for CLI
 */
export function IconWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TSchema extends
    | IconSchemaType
    | IconSchemaOptionalType
    | IconSchemaNullishType,
  TUsage extends FieldUsageConfig,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  | IconWidgetConfig<never, TUsage, "widget">
  | IconWidgetConfig<TSchema, TUsage, "primitive">
>): JSX.Element {
  if (!field.value) {
    return (
      <Box>
        {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Fallback icon character */}
        <Text>{chalk.dim("●")}</Text>
      </Box>
    );
  }

  if (typeof field.value !== "string") {
    return (
      <Box>
        {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Error indicator character */}
        <Text>{chalk.red("!")}</Text>
      </Box>
    );
  }

  // Check if it's already a unicode/emoji character (length 1-2 for emoji)
  if (field.value.length <= 2) {
    return (
      <Box>
        <Text>{field.value}</Text>
      </Box>
    );
  }

  // Get icon from CLI icons system
  const cliIcon = getCliIcon(field.value);

  if (cliIcon) {
    return (
      <Box>
        <Text>{chalk.cyan(cliIcon)}</Text>
      </Box>
    );
  }

  // Fallback: show first 2 chars of icon name
  return (
    <Box>
      <Text>{chalk.dim(`[${field.value.slice(0, 2).toUpperCase()}]`)}</Text>
    </Box>
  );
}
