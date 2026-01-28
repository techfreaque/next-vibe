/**
 * FormAlert Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { FieldUsageConfig } from "../../_shared/types";
import type { FormAlertWidgetConfig } from "./types";

export function FormAlertWidgetInk<
  TUsage extends FieldUsageConfig,
  TEndpoint extends CreateApiEndpointAny,
>({
  context,
}: InkWidgetProps<
  TEndpoint,
  FormAlertWidgetConfig<TUsage, "widget">
>): JSX.Element {
  const { response } = context;

  if (!response || response.success) {
    return <Box />;
  }

  return (
    <Box marginBottom={1}>
      <Text color="red">
        {context.t(response.message, response.messageParams)}
      </Text>
    </Box>
  );
}
