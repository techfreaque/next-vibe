import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as React from "react";
import { View as RNView } from "react-native";

import type { ViewPropsWithClassName, WithClassName } from "../lib/types";
import { cn } from "../lib/utils";

// Type-safe View component with className support for NativeWind
const View = RNView as React.ComponentType<ViewPropsWithClassName>;

// Type-safe wrapper for primitives that accept className at runtime
// Using WithClassName to preserve all original props while adding className support
const StyledRadioGroupRoot = RadioGroupPrimitive.Root as React.ForwardRefExoticComponent<
  WithClassName<RadioGroupPrimitive.RootProps> & React.RefAttributes<RadioGroupPrimitive.RootRef>
>;
const StyledRadioGroupItem = RadioGroupPrimitive.Item as React.ForwardRefExoticComponent<
  WithClassName<RadioGroupPrimitive.ItemProps> & React.RefAttributes<RadioGroupPrimitive.ItemRef>
>;
const StyledRadioGroupIndicator = RadioGroupPrimitive.Indicator as React.ForwardRefExoticComponent<
  WithClassName<RadioGroupPrimitive.IndicatorProps> & React.RefAttributes<RadioGroupPrimitive.IndicatorRef>
>;

const RadioGroup = React.forwardRef<
  RadioGroupPrimitive.RootRef,
  WithClassName<RadioGroupPrimitive.RootProps>
>(({ className, ...props }, ref) => {
  return (
    <StyledRadioGroupRoot
      ref={ref}
      className={cn("web:grid gap-2", className)}
      {...props}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  RadioGroupPrimitive.ItemRef,
  WithClassName<RadioGroupPrimitive.ItemProps>
>(({ className, ...props }, ref) => {
  const itemClassName = cn(
    "aspect-square h-4 w-4 native:h-5 native:w-5 rounded-full justify-center items-center border border-primary text-primary web:ring-offset-background web:focus:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-explicit-any
    (props as any).disabled && "web:cursor-not-allowed opacity-50",
    className,
  );
  return (
    <StyledRadioGroupItem
      ref={ref}
      {...({
        className: itemClassName,
        ...props,
      } as any)}
    >
      <StyledRadioGroupIndicator {...({ className: "flex items-center justify-center" } as any)}>
        <View className="aspect-square h-[9px] w-[9px] native:h-[10] native:w-[10] bg-primary rounded-full" />
      </StyledRadioGroupIndicator>
    </StyledRadioGroupItem>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
