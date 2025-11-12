"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface CheckboxRootProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export interface CheckboxIndicatorProps {
  className?: string;
  children?: React.ReactNode;
}

export function Checkbox({
  className,
  children,
  ...props
}: CheckboxRootProps): React.JSX.Element {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
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
  children,
  ...props
}: CheckboxIndicatorProps): React.JSX.Element {
  return (
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex flex-row items-center justify-center text-current",
        className,
      )}
      {...props}
    >
      {children ?? <CheckIcon className="h-3.5 w-3.5" />}
    </CheckboxPrimitive.Indicator>
  );
}
CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;
