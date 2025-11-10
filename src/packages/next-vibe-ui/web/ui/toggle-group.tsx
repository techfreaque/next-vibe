"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { toggleVariants, type ToggleSize, type ToggleVariant } from "./toggle";

const ToggleGroupContext = React.createContext<{
  size?: ToggleSize;
  variant?: ToggleVariant;
}>({
  size: "default",
  variant: "default",
});

export interface ToggleGroupRootProps {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
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
}

export function ToggleGroup({
  className,
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
        className={cn("flex items-center justify-center gap-1", className)}
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
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

export interface ToggleGroupItemProps {
  variant?: ToggleVariant;
  size?: ToggleSize;
  className?: string;
  children?: React.ReactNode;
  value: string;
  disabled?: boolean;
}

export function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
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
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}
