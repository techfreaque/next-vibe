import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type endpoints from "./definition";
import type {
  ApiKeysCreateResponseOutput,
  ApiKeysListResponseOutput,
} from "./definition";

function maskKey(key: string): string {
  if (key.length <= 4) {
    return key;
  }
  return `****${key.slice(-4)}`;
}

interface ListWidgetProps {
  field: { value: ApiKeysListResponseOutput | null | undefined };
}

export function ApiKeysListContainer({ field }: ListWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const keys = value.keys ?? [];

  if (isMcp) {
    const lines = [`API Keys (${keys.length}):`];
    for (const k of keys) {
      lines.push(`  #${k.id} user:${k.userId} key: ****${k.key.slice(-4)}`);
    }
    if (keys.length === 0) {
      lines.push("  (none)");
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
        <Text bold>{t("get.widget.title")}</Text>
        <Text dimColor>({keys.length})</Text>
      </Box>
      {keys.length === 0 ? (
        <Text dimColor>{t("get.widget.noKeysFound")}</Text>
      ) : (
        keys.map((k) => (
          <Box key={k.id} gap={2} marginBottom={0}>
            <Text dimColor>#{k.id}</Text>
            <Text dimColor>{`user:${k.userId}`}</Text>
            <Text>
              {chalk.dim("key:")} {chalk.yellow(maskKey(k.key))}
            </Text>
          </Box>
        ))
      )}
    </Box>
  );
}

ApiKeysListContainer.cliWidget = true as const;

interface CreateWidgetProps {
  field: { value: ApiKeysCreateResponseOutput | null | undefined };
}

export function ApiKeyCreateContainer({
  field,
}: CreateWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    return (
      <Box flexDirection="column">
        <Text>{`Created API key #${value.id}: ${value.key}`}</Text>
        <Text dimColor>{`Save this key — it won't be shown again.`}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box gap={2} marginBottom={1}>
        <Text dimColor>#{value.id}</Text>
        <Text dimColor>{`user:${value.userId}`}</Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>{`key:`}</Text>
        <Text bold color="green">
          {value.key}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text dimColor color="yellow">
          {`Save this key now — it won't be shown again.`}
        </Text>
      </Box>
    </Box>
  );
}

ApiKeyCreateContainer.cliWidget = true as const;
