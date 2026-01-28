/**
 * Link Widget - CLI Ink implementation
 * Handles LINK widget type for interactive terminal UI
 */

import { Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import { extractLinkData } from "./shared";
import type { LinkWidgetConfig, LinkWidgetSchema } from "./types";

/**
 * Link Widget - Ink functional component (matches React interface)
 *
 * Displays hyperlinks in interactive terminal UI.
 * Mirrors the React LinkWidget component exactly.
 */
export function LinkWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends LinkWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  LinkWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const t = context.t;

  // value is properly typed from schema - no assertions needed
  const data = extractLinkData(field.value);

  // Handle null case
  if (!data) {
    return (
      <Text dimColor>
        {t(
          "app.api.system.unifiedInterface.cli.vibe.endpoints.renderers.cliUi.widgets.common.noDataAvailable",
        )}
      </Text>
    );
  }

  const { url, text } = data;

  // For CLI, we render links in a readable format
  // Format: text (url) or just url if text equals url
  if (text === url) {
    return <Text color="blue">{url}</Text>;
  }

  // Format: text (url)
  return (
    <>
      <Text color="blue">{text}</Text>
      <Text dimColor> ({url})</Text>
    </>
  );
}
