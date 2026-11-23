"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { StyleType } from "../utils/style-type";
import type { DivMouseEvent } from "./div";
import { CheckIcon } from "./icons/CheckIcon";

/** What a form library needs to focus the checkbox on a validation error. */
export interface CheckboxRefObject {
  focus: () => void;
}

export type CheckboxRootProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  children?: React.ReactNode;
  id?: string;
  onClick?: (e: DivMouseEvent) => void;
  /** Pass react-hook-form's field.ref so an invalid field gets focus. */
  ref?: React.RefCallback<CheckboxRefObject>;
} & StyleType;

export type CheckboxIndicatorProps = {
  children?: React.ReactNode;
} & StyleType;

export function Checkbox({
  className,
  style,
  children,
  ...props
}: CheckboxRootProps): React.JSX.Element {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
      style={style}
      {...props}
    >
      {children ?? (
        <CheckboxPrimitive.Indicator
          className={cn(
            "flex flex-row items-center justify-center text-current",
          )}
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  );
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export function CheckboxIndicator({
  className,
  style,
  children,
  ...props
}: CheckboxIndicatorProps): React.JSX.Element {
  return (
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex flex-row items-center justify-center text-current",
        className,
      )}
      style={style}
      {...props}
    >
      {children ?? <CheckIcon className="h-3.5 w-3.5" />}
    </CheckboxPrimitive.Indicator>
  );
}
CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;
