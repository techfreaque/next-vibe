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
import type { SecurityPoliciesListResponseOutput } from "./definition";

interface CliWidgetProps {
  field: {
    value: SecurityPoliciesListResponseOutput | null | undefined;
  };
}

export function SecurityPolicyListContainer({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const policies = value.policies ?? [];
  const total = value.totalElements ?? policies.length;

  if (isMcp) {
    const lines = [`Security Policies (${total}):`];
    for (const p of policies) {
      lines.push(`  #${p.id} ${p.name} [${p.type}] ${p.orgResourceId}`);
    }
    if (policies.length === 0) {
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
        <Text dimColor>({total})</Text>
      </Box>
      {policies.length === 0 ? (
        <Text dimColor>{t("get.widget.noPoliciesFound")}</Text>
      ) : (
        policies.map((p) => (
          <Box key={p.id} gap={2} marginBottom={0}>
            <Text dimColor>#{p.id}</Text>
            <Text bold>{p.name}</Text>
            <Text>{chalk.dim("[") + p.type + chalk.dim("]")}</Text>
            <Text dimColor>{p.orgResourceId}</Text>
          </Box>
        ))
      )}
    </Box>
  );
}

SecurityPolicyListContainer.cliWidget = true as const;
