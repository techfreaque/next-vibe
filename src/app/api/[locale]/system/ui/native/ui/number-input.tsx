import { styled } from "nativewind";
import { cn } from "next-vibe/core/utils/utils";
import { Minus, Plus } from "next-vibe/ui/native/ui/icons";
import { convertCSSToViewStyle } from "next-vibe/ui/native/utils/style-converter";
import type { NumberInputProps } from "next-vibe/ui/web/ui/number-input";
import { applyStyleType } from "next-vibe/ui/web/utils/style-type";
import * as React from "react";
import { View } from "react-native";

import { Button } from "./button";
import { Input } from "./input";

const StyledView = styled(View, { className: "style" });

export type { NumberInputProps };

export function NumberInput({
  value = 0,
  onChange,
  onBlur,
  min = 0,
  max = 10,
  step = 1,
  disabled = false,
  className,
  style,
}: NumberInputProps): React.JSX.Element {
  const currentValue = value ?? min;
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handleDecrement = (): void => {
    const newValue = Math.max(min, currentValue - step);
    onChange?.(newValue);
  };

  const handleIncrement = (): void => {
    const newValue = Math.min(max, currentValue + step);
    onChange?.(newValue);
  };

  const handleInputChange = (text: string): void => {
    if (text === "" || text === "-") {
      // Allow empty or negative sign for better UX
      onChange?.(min);
      return;
    }
    const numValue = Number(text);
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange?.(clampedValue);
    }
  };

  const isDecrementDisabled = disabled || currentValue <= min;
  const isIncrementDisabled = disabled || currentValue >= max;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("flex-row items-center gap-3", className),
      })}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
      >
        <Minus size={16} />
      </Button>
      <Input<"number">
        keyboardType="numeric"
        value={currentValue}
        onChangeText={handleInputChange}
        onBlur={onBlur}
        editable={!disabled}
        className="text-center w-20"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
      >
        <Plus size={16} />
      </Button>
    </StyledView>
  );
}
