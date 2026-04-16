import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { BadgeProps } from "../../web/ui/badge";

import { cva } from "class-variance-authority";

export const badgeVariants = cva("");
export const badgeTextVariants = cva("");
export type { BadgeVariant } from "../../web/ui/badge";

const VARIANT_COLOR: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "cyan",
  secondary: "gray",
  destructive: "red",
  outline: "white",
  notification: "red",
  success: "green",
  warning: "yellow",
  info: "blue",
};

export function Badge({
  variant = "default",
  children,
}: BadgeProps): JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return <Text>{children}</Text>;
  }

  const color =
    (variant !== undefined && variant !== null
      ? VARIANT_COLOR[variant]
      : undefined) ?? "cyan";

  return <Text color={color}>[{children}]</Text>;
}
