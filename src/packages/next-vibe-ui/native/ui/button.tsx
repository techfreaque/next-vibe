import { Pressable, Text as RNText } from "react-native";

import type {
  ButtonProps } from "next-vibe-ui/ui/button";
import {
  buttonTextVariants,
  buttonVariants } from "next-vibe-ui/ui/button";
import { cn } from "next-vibe/shared/utils/utils";


function Button({
  className,
  variant,
  size,
  disabled,
  children,
  onClick,
  // TODO: Add asChild support for native
  // asChild,
}: ButtonProps): React.JSX.Element {
  return (
    <Pressable
      // oxlint-disable-next-line prefer-tag-over-role
      role="button"
      disabled={disabled}
      onPress={onClick}
      className={cn(
        disabled && "opacity-50 web:pointer-events-none",
        buttonVariants({ variant, size, className }),
      )}
    >
      {typeof children === "string" ? (
        <RNText className={buttonTextVariants({ variant, size })}>
          {children}
        </RNText>
      ) : (
        children
      )}
    </Pressable>
  );
}

Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
