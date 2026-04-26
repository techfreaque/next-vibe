import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { ButtonProps } from "../../web/ui/button";

import { cva } from "class-variance-authority";

// Stub variants for CLI - CSS classes are unused in terminal rendering
export const buttonVariants = cva("");
export const buttonTextVariants = cva("");
export type { ButtonVariant, ButtonSize } from "../../web/ui/button";

export function Button({ variant, children }: ButtonProps): JSX.Element | null {
  const isMcp = useIsMcp();

  if (isMcp) {
    return null;
  }

  if (variant === "destructive") {
    return (
      <Text color="red" dimColor>
        [{children}]
      </Text>
    );
  }

  if (variant === "success") {
    return (
      <Text color="green" dimColor>
        [{children}]
      </Text>
    );
  }

  if (variant === "link") {
    return (
      <Text color="cyan" underline>
        [{children}]
      </Text>
    );
  }

  return <Text dimColor>[{children}]</Text>;
}
