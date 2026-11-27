/**
 * Visual Installer CLI Widget
 * Renders a concise, structured installation status table in the terminal.
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";

import {
  useWidgetTranslation,
  useWidgetValue,
} from "../../unified-ui/_shared/use-widget-context";
import type endpoints from "./definition";
import type { InstallerGetResponseOutput, InstallerStepId } from "./definition";
import { InstallerStepStatus } from "./enum";

interface CliWidgetProps {
  field: {
    value: InstallerGetResponseOutput | null | undefined;
  };
  fieldName: string;
}

function statusMark(
  status: InstallerGetResponseOutput["steps"][number]["status"],
): string {
  switch (status) {
    case InstallerStepStatus.DONE:
      return chalk.green("✓");
    case InstallerStepStatus.SKIPPED:
      return chalk.dim("○");
    case InstallerStepStatus.IN_PROGRESS:
      return chalk.cyan("…");
    case InstallerStepStatus.ERROR:
      return chalk.red("✗");
    default:
      return chalk.yellow("•");
  }
}

export function InstallerWidget({ field }: CliWidgetProps): JSX.Element {
  const ctxValue = useWidgetValue<typeof endpoints.GET>();
  const value = field.value ?? ctxValue;
  const t = useWidgetTranslation<typeof endpoints.GET>();

  if (!value) {
    return <Box />;
  }

  const labelFor = (id: InstallerStepId): string => {
    switch (id) {
      case "git":
        return t("widget.steps.git.title");
      case "bun":
        return t("widget.steps.bun.title");
      case "clone":
        return t("widget.steps.clone.title");
      case "dependencies":
        return t("widget.steps.dependencies.title");
      case "github":
        return t("widget.steps.github.title");
      case "server":
        return t("widget.steps.server.title");
    }
  };

  const lines: string[] = [
    chalk.bold(t("get.title")),
    chalk.dim(`${t("widget.checkoutLabel")}: ${value.installDir}`),
    "",
  ];

  for (const step of value.steps) {
    const label = labelFor(step.id);
    const badge = t(step.status);
    lines.push(
      `${statusMark(step.status)} ${chalk.bold(label)} ${chalk.dim(`[${badge}]`)}  ${step.detail}`,
    );
    if (step.recovery) {
      lines.push(`    ${chalk.yellow(step.recovery)}`);
    }
  }

  lines.push("");
  lines.push(
    chalk.dim(
      `http://localhost:${value.port}/en-US/install  ->  http://localhost:${value.port}/en-US/setup`,
    ),
  );

  return (
    <Box flexDirection="column">
      <Text>{lines.join("\n")}</Text>
    </Box>
  );
}

InstallerWidget.cliWidget = true as const;
