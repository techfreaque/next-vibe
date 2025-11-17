"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

const toggleVariants = cva(
  "web:group web:inline-flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:hover:bg-muted active:bg-muted web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent web:hover:bg-accent active:bg-accent active:bg-accent",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const toggleTextVariants = cva("text-sm text-foreground font-medium", {
  variants: {
    variant: {
      default: "",
      outline:
        "web:group-hover:text-accent-foreground web:group-active:text-accent-foreground",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ToggleVariant = VariantProps<typeof toggleVariants>["variant"];
export type ToggleSize = VariantProps<typeof toggleVariants>["size"];

export type ToggleRootProps = {
  variant?: ToggleVariant;
  size?: ToggleSize;
  children?: React.ReactNode;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
} & StyleType;

export function Toggle({
  className,
  style,
  variant,
  size,
  children,
  pressed,
  onPressedChange,
  disabled,
}: ToggleRootProps): React.JSX.Element {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ variant, size, className }))}
      style={style}
      pressed={pressed}
      onPressedChange={onPressedChange}
      disabled={disabled}
    >
      {children}
    </TogglePrimitive.Root>
  );
}

export { toggleVariants, toggleTextVariants };
