/**
 * NavigateButton Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { NavigateButtonWidgetConfig } from "./types";

export function NavigateButtonWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TTargetEndpoint extends CreateApiEndpointAny | undefined,
  TGetEndpoint extends CreateApiEndpointAny | undefined,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  NavigateButtonWidgetConfig<
    TKey,
    TUsage,
    "widget",
    TTargetEndpoint,
    TGetEndpoint
  >
>): JSX.Element {
  const t = useInkWidgetTranslation();

  return (
    <Box>
      <Text>{field.label ? t(field.label) : "Navigate"}</Text>
    </Box>
  );
}
