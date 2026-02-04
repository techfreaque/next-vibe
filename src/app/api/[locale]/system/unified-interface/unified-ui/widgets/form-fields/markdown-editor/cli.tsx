/**
 * Markdown Editor Widget - Ink implementation
 * Handles MARKDOWN_EDITOR widget type for editable text (read-only in CLI)
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import { extractEditableTextData } from "./shared";
import type {
  MarkdownEditorWidgetConfig,
  MarkdownEditorWidgetSchema,
} from "./types";

/**
 * Markdown Editor Widget - Ink functional component
 *
 * Displays text in read-only mode for CLI (editing not supported in terminal)
 */
export function MarkdownEditorWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends MarkdownEditorWidgetSchema,
  TUsage extends FieldUsageConfig,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  MarkdownEditorWidgetConfig<TKey, TSchema, TUsage, "primitive">
>): JSX.Element {
  const extractedData = extractEditableTextData(field.value);

  if (!extractedData) {
    return (
      <Box>
        <Text>—</Text>
      </Box>
    );
  }

  const { value: text, placeholder } = extractedData;

  return (
    <Box>
      <Text>{text || placeholder || "—"}</Text>
    </Box>
  );
}
