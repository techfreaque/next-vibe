import { Box, Text } from "ink";
import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type { ResultBannerProps } from "../../web/ui/result-banner";

export type {
  ResultBannerProps,
  ResultBannerVariant,
} from "../../web/ui/result-banner";

const variantColors: Record<string, string> = {
  success: "green",
  danger: "red",
  warning: "yellow",
  info: "blue",
};

const variantSymbols: Record<string, string> = {
  success: "✓",
  danger: "✗",
  warning: "⚠",
  info: "ℹ",
};

export function ResultBanner({
  variant,
  title,
  message,
}: ResultBannerProps): JSX.Element {
  const isMcp = useIsMcp();
  const color = variantColors[variant] ?? "white";
  const symbol = variantSymbols[variant] ?? "•";

  if (isMcp) {
    return (
      <Text>
        {symbol} {title}
        {message ? ` - ${message}` : ""}
      </Text>
    );
  }

  return (
    <Box flexDirection="column" gap={0} paddingY={1}>
      <Text color={color}>
        {symbol} {title}
      </Text>
      {message ? (
        <Text color={color} dimColor>
          {"  "}
          {message}
        </Text>
      ) : null}
    </Box>
  );
}
ResultBanner.displayName = "ResultBanner";
