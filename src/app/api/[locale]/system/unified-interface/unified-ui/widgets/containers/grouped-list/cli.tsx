/**
 * GroupedList Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type {
  ArrayChildConstraint,
  ConstrainedChildUsage,
  FieldUsageConfig,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { GroupedListWidgetConfig } from "./types";

export function GroupedListWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TChild extends ArrayChildConstraint<TKey, ConstrainedChildUsage<TUsage>>,
>({
  context,
}: InkWidgetProps<
  TEndpoint,
  GroupedListWidgetConfig<TKey, TUsage, TSchemaType, TChild>
>): JSX.Element {
  const { t } = context;
  return (
    <Box>
      <Text dimColor>
        {t(
          "app.api.system.unifiedInterface.cli.widgets.groupedList.notImplemented",
        )}
      </Text>
    </Box>
  );
}
