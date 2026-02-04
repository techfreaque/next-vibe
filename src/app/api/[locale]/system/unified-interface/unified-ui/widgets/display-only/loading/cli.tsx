/**
 * Loading Widget - CLI Ink implementation
 * Displays loading state with message
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetTranslation } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { LoadingWidgetConfig } from "./types";

/**
 * Loading Widget - Ink functional component
 *
 * Displays a loading message (no animated spinner in CLI for simplicity).
 */
export function LoadingWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>({
  field,
}: InkWidgetProps<
  TEndpoint,
  TUsage,
  LoadingWidgetConfig<TKey, TUsage, "widget">
>): JSX.Element {
  const { message: messageKey } = field;
  const t = useInkWidgetTranslation();

  const message = messageKey ? t(messageKey) : "Loading...";

  return (
    <Box gap={1} paddingY={1}>
      <Text color="cyan">{t("app.common.loading.emoji")}</Text>
      <Text dimColor>{message}</Text>
    </Box>
  );
}
