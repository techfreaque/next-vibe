/**
 * Button Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { ButtonWidgetConfig } from "./types";

export function ButtonWidgetInk<
  TKey extends string,
  TEndpoint extends CreateApiEndpointAny,
>({
  field,
  context,
}: InkWidgetProps<
  TEndpoint,
  ButtonWidgetConfig<TKey, FieldUsageConfig, "widget">
>): JSX.Element {
  const { t } = context;

  return (
    <Box>
      <Text>{t(field.text)}</Text>
    </Box>
  );
}
