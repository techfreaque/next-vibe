"use client";

import { CheckIcon } from "next-vibe-ui/ui/icons";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

export type RadioGroupRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  children?: React.ReactNode;
} & StyleType;

export type RadioGroupItemProps = {
  value: string;
  disabled?: boolean;
  id?: string;
  children?: React.ReactNode;
} & StyleType;

export function RadioGroup({
  className,
  style,
  children,
  value,
  defaultValue,
  onValueChange,
  disabled,
  name,
  required,
}: RadioGroupRootProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      style={style}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      required={required}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export function RadioGroupItem({
  className,
  style,
  children,
  value,
  disabled,
  id,
}: RadioGroupItemProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={style}
      value={value}
      disabled={disabled}
      id={id}
    >
      <RadioGroupPrimitive.Indicator className="flex flex-row items-center justify-center">
        <CheckIcon className="h-3.5 w-3.5 fill-primary" />
      </RadioGroupPrimitive.Indicator>
      {children}
    </RadioGroupPrimitive.Item>
  );
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
