import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import * as React from "react";
import { View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";

import type {
  RadioGroupRootProps,
  RadioGroupItemProps,
} from "@/packages/next-vibe-ui/web/ui/radio-group";

const StyledRadioGroupItem = RadioGroupPrimitive.Item;
const StyledRadioGroupIndicator = RadioGroupPrimitive.Indicator;

function RadioGroup({
  className,
  children,
  value,
  onValueChange,
  disabled,
  ...props
}: RadioGroupRootProps): React.JSX.Element {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      value={value ?? ""}
      onValueChange={onValueChange ?? (() => {})} // eslint-disable-line no-empty-function
      disabled={disabled}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );
}
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

function RadioGroupItem({
  className,
  children,
  value,
  disabled,
  id,
  ...props
}: RadioGroupItemProps): React.JSX.Element {
  return (
    <StyledRadioGroupItem
      className={cn(
        "aspect-square h-5 w-5 rounded-full justify-center items-center border border-primary text-primary shadow ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        disabled && "opacity-50",
        className,
      )}
      value={value}
      disabled={disabled}
      id={id}
      {...props}
    >
      <StyledRadioGroupIndicator>
        <View className="flex flex-row items-center justify-center">
          <Check className="h-3.5 w-3.5 fill-primary" />
        </View>
      </StyledRadioGroupIndicator>
      {children}
    </StyledRadioGroupItem>
  );
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
