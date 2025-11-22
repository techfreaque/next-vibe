/**
 * Number Input Component
 * A number input with increment/decrement buttons
 */

"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useEffect } from "react";
import type { StyleType } from "../utils/style-type";

import { Button } from "./button";
import { Div } from "./div";
import { Input, type InputChangeEvent } from "./input";

export type NumberInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  name?: string;
} & StyleType;

export function NumberInput(props: NumberInputProps): JSX.Element {
  const {
    value = 1,
    onChange,
    onBlur,
    min,
    max,
    step,
    disabled = false,
    className,
    name,
  } = props;

  // Call onChange with initial value on mount to register the field
  useEffect(() => {
    onChange?.(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  const handleDecrement = (): void => {
    const newValue =
      min !== undefined ? Math.max(min, value - step) : value - step;
    onChange?.(newValue);
  };

  const handleIncrement = (): void => {
    const newValue =
      max !== undefined ? Math.min(max, value + step) : value - step;
    onChange?.(newValue);
  };

  const handleInputChange = (e: InputChangeEvent<"number">): void => {
    const inputValue = e.target.value;
    if (inputValue === 0 || !inputValue) {
      onChange?.(min);
      return;
    }
    if (min === undefined && max === undefined) {
      onChange?.(inputValue);
      return;
    }
    if (min !== undefined && inputValue < min) {
      onChange?.(min);
      return;
    }
    if (max !== undefined && inputValue > max) {
      onChange?.(max);
      return;
    }
    onChange?.(inputValue);
  };

  return (
    <Div className={cn("flex items-center gap-3", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        tabIndex={-1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        name={name}
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="text-center w-20"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        tabIndex={-1}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </Div>
  );
}
