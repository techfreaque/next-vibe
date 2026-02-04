import { Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import { useInkWidgetTranslation } from "../../_shared/use-ink-widget-context";
import type { AvatarWidgetConfig } from "./types";

/**
 * Avatar Widget (CLI/Ink) - Displays avatar as text fallback
 *
 * Terminal-friendly avatar display showing initials or fallback text.
 * Images cannot be rendered in terminal, so shows text representation.
 *
 * Features:
 * - Text fallback display (initials)
 * - Accessible text representation
 * - Translation support for labels
 *
 * UI Config Options:
 * - fallback: Fallback text/initials (e.g., "JD", "?")
 * - alt: Translation key for label (TKey)
 *
 * Data Format:
 * - string: Shows as-is (for compatibility)
 * - object: { fallback?: string, alt?: string }
 * - null/undefined: Shows configured fallback or "?"
 */
interface AvatarData {
  fallback?: string;
  alt?: string;
}

export default function AvatarWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  AvatarWidgetConfig<TKey, TUsage, "widget", never>
>): JSX.Element {
  const t = useInkWidgetTranslation();
  const { alt: altKey, fallback: configFallback } = field;

  // Get avatar data from field value
  const avatarData = field.value as AvatarData | string | undefined;

  // Determine fallback text
  let fallback: string;
  if (typeof avatarData === "string") {
    fallback = avatarData;
  } else if (avatarData && typeof avatarData === "object") {
    fallback = avatarData.fallback || configFallback || "?";
  } else {
    fallback = configFallback || "?";
  }

  // Get alt text for label
  const alt = altKey ? t(altKey) : undefined;

  return (
    <Text>
      {alt ? `${alt}: ` : ""}[{fallback}]
    </Text>
  );
}

AvatarWidgetInk.displayName = "AvatarWidgetInk";
