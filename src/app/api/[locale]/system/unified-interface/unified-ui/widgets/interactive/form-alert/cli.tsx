/**
 * FormAlert Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";

import type { FieldUsageConfig } from "../../_shared/types";
import type { FormAlertWidgetConfig } from "./types";

export function FormAlertWidgetInk<TUsage extends FieldUsageConfig>({
  context,
}: InkWidgetProps<FormAlertWidgetConfig<TUsage, "widget">>): JSX.Element {
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
