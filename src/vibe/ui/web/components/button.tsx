import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import type { JSX, ReactNode } from "react";
import React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";
import { buttonVariants } from "./button-variants";
import type { DivDragEvent } from "./div";

export { buttonTextVariants, buttonVariants } from "./button-variants";

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

export interface ButtonMouseEvent {
  stopPropagation: () => void;
  clientX?: number;
  clientY?: number;
}

export type ButtonProps = {
  id?: string;
  name?: string;
  ref?: React.RefCallback<{ focus: () => void }>;
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
  form?: string;
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
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
  "aria-current"?: "true" | "page" | "step";
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
