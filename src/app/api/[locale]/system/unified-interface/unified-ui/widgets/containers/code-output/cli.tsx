/**
 * CodeOutput Widget - Ink implementation
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { InkWidgetProps } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/cli-types";
import type { FieldUsageConfig } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/types";

import type { CodeOutputWidgetConfig } from "./types";

export function CodeOutputWidgetInk<
  TEndpoint extends CreateApiEndpointAny,
  TKey extends string,
  TUsage extends FieldUsageConfig,
>(
  props:
    | InkWidgetProps<
        TEndpoint,
        CodeOutputWidgetConfig<TKey, never, TUsage, "widget">
      >
    | InkWidgetProps<
        TEndpoint,
        CodeOutputWidgetConfig<TKey, StringWidgetSchema, TUsage, "primitive">
      >,
): JSX.Element {
  const { field, context } = props;
  const code = field.value;

  if (!code) {
    return (
      <Box>
        <Text dimColor>{context.t("app.common.noData")}</Text>
      </Box>
    );
  }

  const language = field.language;
  const showLineNumbers = field.showLineNumbers ?? false;
  const lines = code.split("\n");

  return (
    <Box flexDirection="column" borderStyle="round" paddingX={1}>
      {language && (
        <Box marginBottom={1}>
          <Text color="blue">{language}</Text>
        </Box>
      )}
      <Box flexDirection="column">
        {lines.map((line: string, index: number) => (
          <Box key={index}>
            {showLineNumbers && (
              <Text dimColor>{`${index + 1}`.padStart(4, " ")} </Text>
            )}
            <Text>{line}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
