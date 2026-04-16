import { Box, Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertVariant,
} from "../../web/ui/alert";

export type {
  AlertProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertVariant,
} from "../../web/ui/alert";
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
