/**
 * Markdown Widget - Ink implementation
 * Handles MARKDOWN widget type for markdown content
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { StringWidgetSchema } from "../../../../shared/widgets/utils/schema-constraints";
import type { FieldUsageConfig } from "../../_shared/types";
import type { MarkdownWidgetConfig } from "./types";

/**
 * Markdown Widget - Ink functional component
 *
 * Displays markdown content as plain text (basic implementation).
 */
export function MarkdownWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  MarkdownWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  if (!field.value) {
    return (
      <Box>
        {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Empty state fallback message */}
        <Text dimColor>No content</Text>
      </Box>
    );
  }

  // Basic markdown stripping (remove common markdown syntax)
  const plainText = field.value
    .replace(/^#{1,6}\s+/gm, "") // Headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Bold
    .replace(/\*(.+?)\*/g, "$1") // Italic
    .replace(/`(.+?)`/g, "$1") // Code
    .replace(/\[(.+?)\]\(.+?\)/g, "$1"); // Links

  return (
    <Box flexDirection="column" marginY={1}>
      {plainText.split("\n").map((line, index) => (
        <Text key={index}>{line}</Text>
      ))}
    </Box>
  );
}
