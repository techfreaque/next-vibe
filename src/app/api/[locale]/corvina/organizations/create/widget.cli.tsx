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
import type { CorvinaOrganizationCreateResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: CorvinaOrganizationCreateResponseOutput | null | undefined;
  };
}

export function OrgCreateCliContainer({ field }: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  if (isMcp) {
    const lines = [`Organization created: #${value.orgId} ${value.nameResult}`];
    if (value.displayNameResult) {
      lines.push(`  display: ${value.displayNameResult}`);
    }
    if (value.createdAt) {
      lines.push(`  created: ${value.createdAt}`);
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
        <Text bold>
          {chalk.green("✓")} {t("post.widget.created")}
        </Text>
      </Box>
      <Box gap={2}>
        <Text dimColor>#{value.orgId}</Text>
        <Text bold>{value.nameResult}</Text>
        {value.displayNameResult && (
          <Text dimColor>({value.displayNameResult})</Text>
        )}
      </Box>
      {value.createdAt && (
        <Text dimColor>
          {t("post.widget.createdAt")} {value.createdAt}
        </Text>
      )}
    </Box>
  );
}

OrgCreateCliContainer.cliWidget = true as const;
