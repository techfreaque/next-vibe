import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import type { JSX, ReactNode } from "react";
import React from "react";

import type { StyleType } from "../utils/style-type";

export const buttonVariants = cva(
  "inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:text-blue-400",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:text-blue-400",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        unset: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const buttonTextVariants = cva("text-sm font-medium text-foreground", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "group-active:text-accent-foreground",
      secondary:
        "text-secondary-foreground group-active:text-secondary-foreground",
      ghost: "group-active:text-accent-foreground",
      link: "text-primary group-active:underline",
    },
    size: {
      default: "",
      sm: "",
      lg: "",
      icon: "",
      unset: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

export interface ButtonMouseEvent {
  stopPropagation: () => void;
}

export type ButtonProps = {
  suppressHydrationWarning?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  children?: ReactNode;
  onClick?:
    | ((e: ButtonMouseEvent) => void)
    | ((e: ButtonMouseEvent) => Promise<void>);
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  type?: "button" | "submit" | "reset";
  title?: string;
  role?:
    | "button"
    | "link"
    | "menuitem"
    | "tab"
    | "switch"
    | "checkbox"
    | "radio"
    | "combobox";
  tabIndex?: number;
  asChild?: boolean;
  key?: React.Key;
  "data-tour"?: string;
} & StyleType;

export function Button({
  className,
  style,
  variant,
  size,
  asChild = false,
  suppressHydrationWarning = false,
  onClick,
  ...props
}: ButtonProps): JSX.Element {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...(suppressHydrationWarning ? { suppressHydrationWarning: true } : {})}
      className={cn(
        buttonVariants({ variant, size, className }),
        "cursor-pointer",
      )}
      style={style}
      onClick={onClick}
      {...props}
    />
  );
}
