import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type { DeviceConfigurationResponseOutput } from "./definition";

type JsonScalar = string | number | boolean | null;
type JsonObject = Record<string, JsonScalar | JsonScalar[]>;

interface CliWidgetProps {
  field: {
    value: DeviceConfigurationResponseOutput | null | undefined;
  };
}

function isJsonObject(
  value: JsonScalar | JsonScalar[] | JsonObject,
): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function tryParseJsonObject(raw: string): JsonObject | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed: JsonScalar | JsonObject | JsonScalar[] = JSON.parse(raw);
    if (isJsonObject(parsed)) {
      return parsed;
    }
  } catch {
    // not valid JSON
  }
  return null;
}

export function DeviceConfigurationContainer({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const result = field.value;

  if (!responseOnly || !result) {
    return <Box />;
  }

  const parsed = tryParseJsonObject(result.configJson);
  const topLevelKeys = parsed ? Object.keys(parsed) : [];
  const keyCount = topLevelKeys.length;

  if (isMcp) {
    const summary = parsed
      ? `${keyCount} top-level keys: ${topLevelKeys.join(", ")}`
      : result.configJson.slice(0, 200);
    return (
      <Box flexDirection="column">
        <Text>{`configuration: ${summary}`}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text bold>{t("get.response.configJson")}</Text>
        {parsed && <Text dimColor>{`(${keyCount} keys)`}</Text>}
      </Box>
      {parsed ? (
        topLevelKeys.map((key) => (
          <Box key={key} gap={2}>
            <Text dimColor>{`${key}:`}</Text>
            <Text>{JSON.stringify(parsed[key])}</Text>
          </Box>
        ))
      ) : (
        <Box>
          <Text>{result.configJson}</Text>
        </Box>
      )}
    </Box>
  );
}

DeviceConfigurationContainer.cliWidget = true as const;
