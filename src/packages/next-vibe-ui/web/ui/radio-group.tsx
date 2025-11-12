"use client";

import { CheckIcon } from "next-vibe-ui/ui/icons";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface RadioGroupRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export interface RadioGroupItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  children?: React.ReactNode;
}

export function RadioGroup({
  className,
  children,
  ...props
}: RadioGroupRootProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export function RadioGroupItem({
  className,
  children,
  ...props
}: RadioGroupItemProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex flex-row items-center justify-center">
        <CheckIcon className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
      {children}
    </RadioGroupPrimitive.Item>
  );
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
