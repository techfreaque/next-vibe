import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import type { JSX, ReactNode } from "react";
import React from "react";

import type { DivDragEvent } from "./div";
import type { StyleType } from "../utils/style-type";

export const buttonVariants = cva(
  "inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        info: "bg-info text-info-foreground hover:bg-info/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-md px-3 text-xs",
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
      success: "text-success-foreground",
      warning: "text-warning-foreground",
      info: "text-info-foreground",
    },
    size: {
      default: "",
      xs: "text-xs",
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
  clientX?: number;
  clientY?: number;
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
  draggable?: boolean;
  onDragStart?: (e: DivDragEvent) => void;
  "data-tour"?: string;
  "data-testid"?: string;
  "aria-label"?: string;
} & StyleType;

export function Button({
  className,
  style,
  variant,
  size,
  asChild = false,
  suppressHydrationWarning = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  draggable,
  onDragStart,
  ...props
}: ButtonProps): JSX.Element {
  const Comp = asChild ? Slot : "button";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (onClick) {
      onClick({
        stopPropagation: () => e.stopPropagation(),
        clientX: e.clientX,
        clientY: e.clientY,
      });
    }
  };
  return (
    <Comp
      {...(suppressHydrationWarning ? { suppressHydrationWarning: true } : {})}
      className={cn(
        buttonVariants({ variant, size, className }),
        "cursor-pointer",
      )}
      style={style}
      {...(onClick ? { onClick: handleClick } : {})}
      {...(onMouseEnter ? { onMouseEnter } : {})}
      {...(onMouseLeave ? { onMouseLeave } : {})}
      {...(draggable !== undefined ? { draggable } : {})}
      {...(onDragStart ? { onDragStart } : {})}
      {...props}
    />
  );
}
