import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { View } from "react-native";

import type {
  RadioGroupItemProps,
  RadioGroupRootProps,
} from "@/packages/next-vibe-ui/web/ui/radio-group";

import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { Check } from "./icons/Check";

const StyledView = styled(View, { className: "style" });
const StyledRadioGroupItem = RadioGroupPrimitive.Item;
const StyledRadioGroupIndicator = RadioGroupPrimitive.Indicator;

function RadioGroup({
  className,
  children,
  value,
  onValueChange,
  disabled,
  style,
  defaultValue,
  ...props
}: RadioGroupRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <RadioGroupPrimitive.Root
      {...applyStyleType({
        nativeStyle,
        className: cn("grid gap-2", className),
      })}
      value={value ?? defaultValue ?? ""}
      // eslint-disable-next-line no-empty-function -- Intentional no-op default handler
      onValueChange={onValueChange ?? (() => {})}
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
  style,
  id,
  ...props
}: RadioGroupItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledRadioGroupItem
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "aspect-square h-5 w-5 rounded-full justify-center items-center border border-primary text-primary shadow ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          disabled && "opacity-50",
          className,
        ),
      })}
      value={value}
      disabled={disabled}
      nativeID={id}
      {...props}
    >
      <StyledRadioGroupIndicator>
        <StyledView className="flex flex-row items-center justify-center">
          <Check className="h-3.5 w-3.5 fill-primary" />
        </StyledView>
      </StyledRadioGroupIndicator>
      {children}
    </StyledRadioGroupItem>
  );
}
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
