import { Box, Text } from "ink";
import type {
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
  AlertVariant,
} from "next-vibe/ui/web/ui/alert";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

export type {
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
  AlertVariant,
} from "next-vibe/ui/web/ui/alert";
import { cva } from "class-variance-authority";

export const alertVariants = cva("");

const VARIANT_SYMBOL: Record<NonNullable<AlertVariant>, string> = {
  default: "ℹ",
  destructive: "✗",
  success: "✓",
  warning: "⚠",
  info: "ℹ",
};

const VARIANT_COLOR: Record<NonNullable<AlertVariant>, string> = {
  default: "blue",
  destructive: "red",
  success: "green",
  warning: "yellow",
  info: "blue",
};

export function Alert({
  variant = "default",
  children,
}: AlertProps): JSX.Element {
  const isMcp = useIsMcp();
  const symbol = VARIANT_SYMBOL[variant];
  const color = VARIANT_COLOR[variant];

  if (isMcp) {
    return (
      <Text>
        {symbol} {children}
      </Text>
    );
  }

  return (
    <Box>
      <Text color={color}>{symbol} </Text>
      <Text>{children}</Text>
    </Box>
  );
}
Alert.displayName = "Alert";

export function AlertTitle({ children }: AlertTitleProps): JSX.Element {
  return <Text bold>{children}</Text>;
}
AlertTitle.displayName = "AlertTitle";

export function AlertDescription({
  children,
}: AlertDescriptionProps): JSX.Element {
  return <Text>{children}</Text>;
}
AlertDescription.displayName = "AlertDescription";
