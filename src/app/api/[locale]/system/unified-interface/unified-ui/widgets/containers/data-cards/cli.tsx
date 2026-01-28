/**
 * DataCards Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";
import type { z } from "zod";

import { simpleT } from "@/i18n/core/shared";

import type { CreateApiEndpointAny } from "../../../../shared/types/endpoint-base";
import type { InkWidgetProps } from "../../_shared/cli-types";
import type { FieldUsageConfig } from "../../_shared/types";
import type { DataCardsWidgetConfig } from "./types";

export function DataCardsWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
  TSchemaType extends "array" | "array-optional",
  TSchema extends z.ZodTypeAny,
  TItemData,
>({
  context,
}: InkWidgetProps<
  TEndpoint,
  DataCardsWidgetConfig<TKey, TUsage, TSchemaType, TSchema, TItemData>
>): JSX.Element {
  const { t } = simpleT(context.locale);
  return (
    <Box>
      <Text dimColor>
        {t("app.api.system.unifiedInterface.cli.vibe.widgets.notImplemented")}
      </Text>
    </Box>
  );
}
