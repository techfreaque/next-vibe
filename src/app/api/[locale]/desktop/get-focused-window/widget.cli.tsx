/**
 * Get Focused Window CLI Widget
 * CLI: prominent title display, PID + window ID in dim below
 * MCP: compact key: value pairs
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import { useWidgetPlatform } from "next-vibe-ui/unified/_shared/use-widget-context";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";

import type { DesktopGetFocusedWindowResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopGetFocusedWindowResponseOutput | null | undefined };
  fieldName: string;
}

export function GetFocusedWindowCliWidget({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    if (!v.success || !v.windowTitle) {
      const msg = v.error ?? "No focused window found";
      return isMcp ? `error: ${msg}` : chalk.red(`  ✗ ${msg}`);
    }

    if (isMcp) {
      const parts = [`title: ${v.windowTitle}`];
      if (v.pid !== null && v.pid !== undefined) {
        parts.push(`pid: ${v.pid}`);
      }
      if (v.windowId) {
        parts.push(`id: ${v.windowId}`);
      }
      if (
        v.width !== null &&
        v.width !== undefined &&
        v.height !== null &&
        v.height !== undefined
      ) {
        parts.push(`size: ${v.width}x${v.height}`);
      }
      if (v.monitor) {
        parts.push(`monitor: ${v.monitor}`);
      }
      return parts.join("\n");
    }

    const lines: string[] = [];
    lines.push(`  ${chalk.bold("◆ Focused Window")}`);
    lines.push(`    ${chalk.white.bold(v.windowTitle)}`);
    const meta: string[] = [];
    if (v.pid !== null && v.pid !== undefined) {
      meta.push(`pid: ${chalk.cyan(String(v.pid))}`);
    }
    if (v.windowId) {
      meta.push(`id: ${chalk.dim(v.windowId)}`);
    }
    if (
      v.width !== null &&
      v.width !== undefined &&
      v.height !== null &&
      v.height !== undefined
    ) {
      meta.push(`${chalk.green(`${v.width}×${v.height}`)}`);
    }
    if (v.monitor) {
      meta.push(`monitor: ${chalk.cyan(v.monitor)}`);
    }
    if (meta.length) {
      lines.push(`    ${chalk.dim(meta.join("  "))}`);
    }
    return lines.join("\n");
  }, [field.value, isMcp]);

  if (!output) {
    return <Box />;
  }

  return (
    <Box flexDirection="column">
      <Text wrap="wrap">{output}</Text>
    </Box>
  );
}

GetFocusedWindowCliWidget.cliWidget = true as const;

export { GetFocusedWindowCliWidget as GetFocusedWindowWidget };
