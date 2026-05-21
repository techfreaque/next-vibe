import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { TagQueryResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: TagQueryResponseOutput | null | undefined };
}

export function TagQueryContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const results = value.results ?? [];

  if (isMcp) {
    const lines = [`${t("post.widget.title")} (${results.length}):`];
    for (const row of results) {
      const ts =
        row.latestTimestamp !== null && row.latestTimestamp !== undefined
          ? new Date(row.latestTimestamp).toISOString()
          : null;
      const valuePart =
        row.latestValue !== null && row.latestValue !== undefined
          ? ` = ${row.latestValue}`
          : "";
      const tsPart = ts ? ` [${ts}]` : "";
      lines.push(
        `  ${row.modelPath}${valuePart}${tsPart} (${row.rowCount} ${t("post.widget.rows")})`,
      );
    }
    if (results.length === 0) {
      lines.push(`  (${t("post.widget.noResultsFound")})`);
    }
    return (
      <Box flexDirection="column">
        <Text>{lines.join("\n")}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={1} marginBottom={1}>
        <Text bold>{t("post.widget.title")}</Text>
        <Text dimColor>({results.length})</Text>
      </Box>
      {results.length === 0 ? (
        <Text dimColor>{t("post.widget.noResultsFound")}</Text>
      ) : (
        results.map((row) => {
          const ts =
            row.latestTimestamp !== null && row.latestTimestamp !== undefined
              ? new Date(row.latestTimestamp).toLocaleString()
              : null;
          return (
            <Box key={row.modelPath} flexDirection="column" marginBottom={1}>
              <Box gap={2}>
                <Text bold color="cyan">
                  {row.modelPath}
                </Text>
                {row.latestValue !== null && row.latestValue !== undefined ? (
                  <Text>{row.latestValue}</Text>
                ) : (
                  <Text dimColor>—</Text>
                )}
                <Text dimColor>
                  ({row.rowCount} {t("post.widget.rows")})
                </Text>
              </Box>
              {ts && <Text dimColor> {ts}</Text>}
            </Box>
          );
        })
      )}
    </Box>
  );
}

TagQueryContainer.cliWidget = true as const;
