/**
 * SubmitButton Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { SubmitButtonWidgetConfig } from "./types";

export function SubmitButtonWidgetInk<TKey extends string>({
  field,
  context,
}: InkWidgetProps<
  SubmitButtonWidgetConfig<TKey, FieldUsageConfig, "widget">
>): JSX.Element {
  const { t } = context;
  const text = field.text || ("app.common.actions.submit" as TKey);

  return (
    <Box>
      <Text>{t(text)}</Text>
    </Box>
  );
}
