/**
 * Pagination Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import type { UnifiedField } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { PaginationWidgetConfig } from "./types";

export function PaginationWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "object" | "object-optional" | "widget-object",
  TChildren extends {
    page: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
    limit: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
    totalCount: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
    pageCount?: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
    offset?: UnifiedField<TKey, z.ZodTypeAny, FieldUsageConfig, any>; // oxlint-disable-line typescript/no-explicit-any;
  },
>({
  context,
}: InkWidgetProps<
  TEndpoint,
  PaginationWidgetConfig<TKey, TUsage, TSchemaType, TChildren>
>): JSX.Element {
  const { t } = context;
  return (
    <Box>
      <Text dimColor>
        {t(
          "app.api.system.unifiedInterface.cli.widgets.pagination.notImplemented",
        )}
      </Text>
    </Box>
  );
}
