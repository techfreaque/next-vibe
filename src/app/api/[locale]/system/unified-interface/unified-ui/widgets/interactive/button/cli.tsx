/**
 * Button Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { ButtonWidgetConfig } from "./types";

export function ButtonWidgetInk<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  ButtonWidgetConfig<TKey, TUsage, "widget">
>): JSX.Element {
  const t = useInkWidgetTranslation();

  const text = field.text;

  return (
    <Box>
      <Text>{text ? t(text) : ""}</Text>
    </Box>
  );
}
