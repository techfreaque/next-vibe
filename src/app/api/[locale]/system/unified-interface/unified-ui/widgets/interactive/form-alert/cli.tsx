/**
 * FormAlert Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import {
  useInkWidgetResponse,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { FieldUsageConfig } from "../../_shared/types";
import type { FormAlertWidgetConfig } from "./types";

export function FormAlertWidgetInk<
  TUsage extends FieldUsageConfig,
  TEndpoint extends CreateApiEndpointAny,
>(
  // eslint-disable-next-line no-unused-vars
  _props: InkWidgetProps<
    TEndpoint,
    TUsage,
    FormAlertWidgetConfig<TUsage, "widget">
  >,
): JSX.Element {
  const t = useInkWidgetTranslation();
  const response = useInkWidgetResponse();

  if (!response || response.success) {
    return <Box />;
  }

  return (
    <Box marginBottom={1}>
      <Text color="red">{t(response.message, response.messageParams)}</Text>
    </Box>
  );
}
