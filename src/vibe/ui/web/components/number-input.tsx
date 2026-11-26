/**
 * Number Input Component
 * A number input with increment/decrement buttons
 */

"use client";

import { useTranslation } from "next-vibe/core/i18n/core/client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Minus } from "next-vibe/ui/components/icons/Minus";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import type { JSX, Ref } from "react";
import { useEffect, useRef } from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import { scopedTranslation } from "../../../unified-ui/hooks/i18n";
import type { StyleType } from "../utils/style-type";
import { Button } from "./button";
import {
  Input,
  type InputChangeEvent,
  type InputProps,
  type InputRefObject,
} from "./input";

export type NumberInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  allowDecimals?: boolean;
  disabled?: boolean;
  name?: string;
  locale?: CountryLanguage;
  ref?: Ref<InputRefObject>;
} & Pick<
  InputProps<"number">,
  "id" | "aria-label" | "aria-describedby" | "aria-invalid"
> &
  StyleType;

export function NumberInput(props: NumberInputProps): JSX.Element {
  const {
    value = 0,
    onChange,
    onBlur,
    min,
    max,
    step = 1,
    allowDecimals = false,
    disabled = false,
    className,
    style,
    locale,
    ...inputProps
  } = props;
  const { locale: currentLocale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale ?? currentLocale);

  // Call onChange with initial value on mount to register the field
  const hasRegistered = useRef(false);
  useEffect(() => {
    if (!hasRegistered.current) {
      hasRegistered.current = true;
      onChange?.(value);
    }
  }, [onChange, value]);

  const handleDecrement = (): void => {
    const newValue =
      min === undefined ? value - step : Math.max(min, value - step);
    onChange?.(newValue);
  };

  const handleIncrement = (): void => {
    const newValue =
      max === undefined ? value + step : Math.min(max, value + step);
    onChange?.(newValue);
  };

  const handleInputChange = (e: InputChangeEvent<"number">): void => {
    const inputValue = e.target.value;
    if (inputValue === 0 || !inputValue) {
      onChange?.(min ?? 0);
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
    <div
      className={cn(
        "flex min-w-0 items-center justify-between border-input rounded",
        className,
      )}
      style={style}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={t("widgets.formFields.common.decreaseValue")}
        onClick={handleDecrement}
        disabled={disabled || (min !== undefined ? value <= min : false)}
        tabIndex={-1}
        className="shrink-0 border-r rounded-r-none"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        {...inputProps}
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        min={min}
        max={max}
        step={allowDecimals && props.step === undefined ? "any" : step}
        disabled={disabled}
        className="min-w-0 flex-1 text-center border-none"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={t("widgets.formFields.common.increaseValue")}
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined ? value >= max : false)}
        tabIndex={-1}
        className="shrink-0 border-l rounded-l-none"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
