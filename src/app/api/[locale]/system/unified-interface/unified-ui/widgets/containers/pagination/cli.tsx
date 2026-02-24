/**
 * Pagination Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import { scopedTranslation as unifiedInterfaceScopedTranslation } from "@/app/api/[locale]/system/unified-interface/i18n";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";
import { useInkWidgetLocale } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { PaginationWidgetConfig } from "./types";

export function PaginationWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TUsage extends FieldUsageConfig,
>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- props not needed
  _props: InkWidgetProps<TEndpoint, TUsage, PaginationWidgetConfig<TUsage>>,
): JSX.Element {
  const locale = useInkWidgetLocale();
  const { t: widgetT } = unifiedInterfaceScopedTranslation.scopedT(locale);
  return (
    <Box>
      <Text dimColor>
        {widgetT(
          "cli.vibe.endpoints.renderers.cliUi.widgets.pagination.notImplemented",
        )}
      </Text>
    </Box>
  );
}
