/**
 * Release Tool Widget (CLI/MCP)
 *
 * Shows a compact summary after `vibe pub` completes.
 * Step-by-step logs are already printed during execution,
 * so this only shows the final outcome - no redundancy.
 */

import { Box, Text } from "ink";
import type { JSX } from "react";

import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useInkWidgetPlatform,
  useInkWidgetResponseOnly,
  useInkWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-ink-widget-context";

import type definition from "./definition";
import type { ReleaseResponseType } from "./definition";

interface CliWidgetProps {
  field: {
    value: ReleaseResponseType | null | undefined;
  };
  fieldName: string;
}

type PackageResult = NonNullable<
  ReleaseResponseType["packagesProcessed"]
>[number];
type PublishedPackage = NonNullable<
  ReleaseResponseType["publishedPackages"]
>[number];
type TranslateFn = ReturnType<
  typeof useInkWidgetTranslation<typeof definition.POST>
>;

function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60_000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

function PackageRow({ pkg }: { pkg: PackageResult }): JSX.Element {
  const icon =
    pkg.status === "success" ? "✓" : pkg.status === "skipped" ? "–" : "✗";
  const color =
    pkg.status === "success"
      ? "green"
      : pkg.status === "skipped"
        ? "gray"
        : "red";

  return (
    <Box gap={1}>
      <Text color={color}>{`  ${icon}`}</Text>
      <Text color={color}>{pkg.name}</Text>
      {pkg.version !== undefined && (
        <Text color="cyan">{`v${pkg.version}`}</Text>
      )}
      {pkg.tag !== undefined && <Text dimColor>{`(${pkg.tag})`}</Text>}
      {pkg.message !== undefined && <Text dimColor>{`— ${pkg.message}`}</Text>}
    </Box>
  );
}

function PublishedRow({
  pkg,
  t,
}: {
  pkg: PublishedPackage;
  t: TranslateFn;
}): JSX.Element {
  return (
    <Box gap={1}>
      <Text color="cyan">{`  ${t("widget.bullet")}`}</Text>
      <Text>{`${pkg.name}@${pkg.version}`}</Text>
      <Text dimColor>{`(${pkg.registry})`}</Text>
    </Box>
  );
}

export function ReleaseResultWidget({ field }: CliWidgetProps): JSX.Element {
  const platform = useInkWidgetPlatform();
  const responseOnly = useInkWidgetResponseOnly();
  const t = useInkWidgetTranslation<typeof definition.POST>();
  const isMcp = platform === Platform.MCP;
  const value = field.value;

  if (!responseOnly || !value) {
    return <Box />;
  }

  const packages = value.packagesProcessed ?? [];
  const published = value.publishedPackages ?? [];
  const durationStr =
    value.duration !== undefined ? formatDuration(value.duration) : "";
  const durationSuffix = durationStr ? ` (${durationStr})` : "";
  const statusLabel = value.success ? t("widget.complete") : t("widget.failed");

  // ── MCP: compact plain text ──────────────────────────────────────────────
  if (isMcp) {
    const lines: string[] = [
      `${value.success ? "✓" : "✗"} ${statusLabel}${durationSuffix}`,
    ];
    for (const pkg of packages) {
      const icon =
        pkg.status === "success" ? "✓" : pkg.status === "skipped" ? "–" : "✗";
      const version = pkg.version !== undefined ? ` v${pkg.version}` : "";
      const msg = pkg.message !== undefined ? ` - ${pkg.message}` : "";
      lines.push(`  ${icon} ${pkg.name}${version}${msg}`);
    }
    if (published.length > 0) {
      lines.push(
        `  ${t("widget.published")} (${published.length.toString()}):`,
      );
      for (const pkg of published) {
        lines.push(
          `    ${t("widget.bullet")} ${pkg.name}@${pkg.version} (${pkg.registry})`,
        );
      }
    }
    if (value.warnings) {
      for (const w of value.warnings) {
        lines.push(`  WARN: ${w}`);
      }
    }
    if (value.errors) {
      lines.push(`  ${t("widget.errors")}:`);
      for (const err of value.errors) {
        lines.push(`    ${err}`);
      }
    }
    return (
      <Box flexDirection="column">
        <Text wrap="end">{lines.join("\n")}</Text>
      </Box>
    );
  }

  // ── CLI: proper Ink components ───────────────────────────────────────────
  return (
    <Box flexDirection="column" marginTop={1} gap={1}>
      <Text bold color={value.success ? "green" : "red"}>
        {`${value.success ? "✅" : "❌"} ${statusLabel}${durationSuffix}`}
      </Text>

      {packages.length > 0 && (
        <Box flexDirection="column">
          {packages.map((pkg) => (
            <PackageRow key={pkg.name} pkg={pkg} />
          ))}
        </Box>
      )}

      {published.length > 0 && (
        <Box flexDirection="column">
          <Text bold color="cyan">
            {`${t("widget.published")} (${published.length.toString()}):`}
          </Text>
          {published.map((pkg) => (
            <PublishedRow key={`${pkg.name}@${pkg.registry}`} pkg={pkg} t={t} />
          ))}
        </Box>
      )}

      {value.warnings && value.warnings.length > 0 && (
        <Box flexDirection="column">
          {value.warnings.map((w, i) => (
            <Box key={i} gap={1}>
              <Text color="yellow">{`  ${t("widget.warning")}`}</Text>
              <Text color="yellow">{w}</Text>
            </Box>
          ))}
        </Box>
      )}

      {value.errors && value.errors.length > 0 && (
        <Box flexDirection="column">
          <Text bold color="red">
            {`${t("widget.errors")}:`}
          </Text>
          {value.errors.map((err, i) => (
            <Text key={i} color="red">
              {`  ${err}`}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
}

ReleaseResultWidget.cliWidget = true as const;
