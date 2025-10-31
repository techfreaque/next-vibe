import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as React from "react";
import { View as RNView } from "react-native";
import type { RadioGroupBaseProps, RadioGroupItemBaseProps } from "next-vibe-ui/ui/radio-group";

import type { ViewPropsWithClassName, WithClassName } from "../lib/types";
import { cn } from "../lib/utils";

// Type-safe View component with className support for NativeWind
const View = RNView as React.ComponentType<ViewPropsWithClassName>;

// Native props that align with web interface
type NativeRadioGroupProps = WithClassName<RadioGroupBaseProps>;
type NativeRadioGroupItemProps = WithClassName<RadioGroupItemBaseProps>;

const RadioGroup = React.forwardRef<
  RadioGroupPrimitive.RootRef,
  NativeRadioGroupProps
>(({ className, value, onValueChange, disabled, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn("web:grid gap-2", className)}
      value={value}
      onValueChange={onValueChange ?? undefined}
      disabled={disabled}
      {...props}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  RadioGroupPrimitive.ItemRef,
  NativeRadioGroupItemProps
>(({ className, value, disabled, ...props }, ref) => {
  const itemClassName = cn(
    "aspect-square h-4 w-4 native:h-5 native:w-5 rounded-full justify-center items-center border border-primary text-primary web:ring-offset-background web:focus:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
    disabled && "web:cursor-not-allowed opacity-50",
    className,
  );
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={itemClassName}
      value={value}
      disabled={disabled}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <View className="aspect-square h-[9px] w-[9px] native:h-[10] native:w-[10] bg-primary rounded-full" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
export type { NativeRadioGroupProps as RadioGroupProps, NativeRadioGroupItemProps as RadioGroupItemProps };
