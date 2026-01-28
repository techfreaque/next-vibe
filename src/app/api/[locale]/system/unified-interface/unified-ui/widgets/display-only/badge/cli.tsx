/**
 * Badge Widget - CLI Ink implementation
 * Handles BADGE widget type for interactive terminal UI
 */

import { Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import {
  extractBadgeData,
  findEnumLabel,
  getBadgeColor,
  mapSemanticVariantToBadgeVariant,
} from "./shared";
import type { BadgeWidgetConfig, BadgeWidgetSchema } from "./types";

/**
 * Badge Widget - Ink functional component (matches React interface)
 *
 * Displays badges with color-coded styling in interactive terminal UI.
 * Mirrors the React BadgeWidget component exactly.
 */
export function BadgeWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TSchema extends BadgeWidgetSchema,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "primitive" | "widget",
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  BadgeWidgetConfig<TKey, TSchema, TUsage, TSchemaType>
>): JSX.Element {
  const { text: staticText, enumOptions, variant: semanticVariant } = field;

  // Handle static text from UI config
  if (staticText) {
    const translatedText = context.t(staticText);
    const variant = semanticVariant
      ? mapSemanticVariantToBadgeVariant(semanticVariant)
      : "default";
    const color = getBadgeColor(variant);

    return <Text color={color}>{translatedText}</Text>;
  }

  // Handle enum options - find matching label for value
  if (enumOptions) {
    const enumLabel = findEnumLabel(field.value, enumOptions, context);
    if (enumLabel) {
      const variant = semanticVariant
        ? mapSemanticVariantToBadgeVariant(semanticVariant)
        : "default";
      const color = getBadgeColor(variant);

      return <Text color={color}>{enumLabel}</Text>;
    }
  }

  // Extract data using shared logic with translation context
  const data = extractBadgeData(field.value, context);

  // Handle null/empty case
  if (!data) {
    return <Text dimColor>—</Text>;
  }

  // Apply semantic variant if configured, otherwise use data variant
  const variant = semanticVariant
    ? mapSemanticVariantToBadgeVariant(semanticVariant)
    : data.variant;
  const color = getBadgeColor(variant);

  // Build badge text with icon if available
  const badgeText = data.icon ? `${data.icon} ${data.text}` : data.text;

  return <Text color={color}>{badgeText}</Text>;
}
