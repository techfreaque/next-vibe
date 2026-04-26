/**
 * Take Screenshot CLI Widget
 * Note: The actual inline image is returned by the backend as ContentResponse.
 * This widget handles the ScreenshotResult metadata (when outputPath is set).
 * CLI: green checkmark, monitor info, dimensions, file path
 * MCP: compact one-liner
 */

import chalk from "chalk";
import { Box, Text } from "ink";
import type { JSX } from "react";
import { useMemo } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { useWidgetPlatform } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type { DesktopTakeScreenshotResponseOutput } from "./definition";

interface CliWidgetProps {
  field: { value: DesktopTakeScreenshotResponseOutput | null | undefined };
  fieldName: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function TakeScreenshotCliWidget({
  field,
}: CliWidgetProps): JSX.Element {
  const platform = useWidgetPlatform();
  const isMcp = platform === Platform.MCP;

  const output = useMemo(() => {
    const v = field.value;
    if (!v) {
      return "";
    }

    const monitor = v.capturedMonitor ?? "all monitors";
    const wasScaled = v.originalWidth && v.width && v.originalWidth !== v.width;
    const dimStr = wasScaled
      ? `${v.originalWidth}×${v.originalHeight} → ${v.width}×${v.height}`
      : v.width
        ? `${v.width}×${v.height}`
        : "unknown size";

    const imageSize = v.imageData
      ? formatBytes(Math.round((v.imageData.length * 3) / 4))
      : null;

    if (isMcp) {
      const parts = [`screenshot: ${monitor} (${dimStr})`];
      if (v.imagePath) {
        parts.push(`saved: ${v.imagePath}`);
      }
      if (imageSize) {
        parts.push(`size: ${imageSize}`);
      }
      return parts.join("\n");
    }

    const lines: string[] = [];
    lines.push(`${chalk.green("✓")} Screenshot captured`);
    lines.push(
      `  ${chalk.dim("Monitor:")} ${chalk.cyan(monitor)}  ${chalk.dim("Dimensions:")} ${chalk.green(dimStr)}`,
    );
    if (imageSize) {
      lines.push(`  ${chalk.dim("Size:")} ${chalk.yellow(imageSize)}`);
    }
    if (v.imagePath) {
      lines.push(`  ${chalk.dim("Saved to:")} ${chalk.white(v.imagePath)}`);
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

TakeScreenshotCliWidget.cliWidget = true as const;

export { TakeScreenshotCliWidget as TakeScreenshotWidget };
