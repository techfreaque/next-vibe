/**
 * Number Input Component
 * A number input with increment/decrement buttons
 */

"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useEffect } from "react";

import { Button } from "./button";
import { Div } from "./div";
import { Input } from "./input";

export interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  name?: string;
}

export function NumberInput({
  value = 1,
  onChange,
  onBlur,
  min = 1,
  max = 10,
  step = 1,
  disabled = false,
  className,
  name,
}: NumberInputProps): JSX.Element {
    // Call onChange with initial value on mount to register the field
    useEffect(() => {
      onChange?.(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only on mount

    const handleDecrement = (): void => {
      const newValue = Math.max(min, (value || min) - step);
      onChange?.(newValue);
    };

    const handleIncrement = (): void => {
      const newValue = Math.min(max, (value || min) + step);
      onChange?.(newValue);
    };

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      const inputValue = e.target.value;
      if (inputValue === "") {
        onChange?.(min);
        return;
      }
      const numValue = Number(inputValue);
      if (!Number.isNaN(numValue)) {
        const clampedValue = Math.max(min, Math.min(max, numValue));
        onChange?.(clampedValue);
      }
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
          value={String(value)}
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
