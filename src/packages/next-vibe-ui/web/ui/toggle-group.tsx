"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { StyleType } from "../utils/style-type";
import { type ToggleSize, type ToggleVariant,toggleVariants } from "./toggle";

const ToggleGroupContext = React.createContext<{
  size?: ToggleSize;
  variant?: ToggleVariant;
}>({
  size: "default",
  variant: "default",
});

export type ToggleGroupRootProps = {
  variant?: ToggleVariant;
  size?: ToggleSize;
  children?: React.ReactNode;
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  defaultValue?: string | string[];
  disabled?: boolean;
  rovingFocus?: boolean;
  loop?: boolean;
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
} & StyleType;

export function ToggleGroup({
  className,
  style,
  variant,
  size,
  children,
  type = "single",
  value,
  onValueChange,
  defaultValue,
  disabled,
  rovingFocus,
  loop,
  orientation,
  dir,
}: ToggleGroupRootProps): React.JSX.Element {
  if (type === "single") {
    return (
      <ToggleGroupPrimitive.Root
        type="single"
        value={value as string | undefined}
        onValueChange={onValueChange as ((value: string) => void) | undefined}
        defaultValue={defaultValue as string | undefined}
        disabled={disabled}
        rovingFocus={rovingFocus}
        loop={loop}
        orientation={orientation}
        dir={dir}
        className={cn(
          "flex flex-row items-center justify-center gap-1",
          className,
        )}
        style={style}
      >
        <ToggleGroupContext.Provider value={{ variant, size }}>
          {children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive.Root>
    );
  }

  return (
    <ToggleGroupPrimitive.Root
      type="multiple"
      value={value as string[] | undefined}
      onValueChange={onValueChange as ((value: string[]) => void) | undefined}
      defaultValue={defaultValue as string[] | undefined}
      disabled={disabled}
      rovingFocus={rovingFocus}
      loop={loop}
      orientation={orientation}
      dir={dir}
      className={cn(
        "flex flex-row items-center justify-center gap-1",
        className,
      )}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export type ToggleGroupItemProps = {
  variant?: ToggleVariant;
  size?: ToggleSize;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
} & StyleType;

export function ToggleGroupItem({
  className,
  style,
  children,
  variant,
  size,
  value,
  disabled,
}: ToggleGroupItemProps): React.JSX.Element {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({
          variant: context.variant ?? variant,
          size: context.size ?? size,
        }),
        className,
      )}
      style={style}
      value={value}
      disabled={disabled}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}
