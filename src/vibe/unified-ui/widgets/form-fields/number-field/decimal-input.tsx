"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Input, type InputRefObject } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import { type JSX, type Ref, useState } from "react";

import { cn } from "../../../_shared/cn";
import {
  decimalInputText,
  type DecimalPresentation,
  parseDecimalInput,
} from "./decimal-value";

interface DecimalInputProps {
  value: number | undefined;
  locale: CountryLanguage;
  presentation: DecimalPresentation;
  onChange: (value: number) => void;
  onBlur?: () => void;
  suffix?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  ref?: Ref<InputRefObject>;
  className?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function DecimalInput({
  value,
  locale,
  presentation,
  onChange,
  onBlur,
  suffix,
  className,
  ...inputProps
}: DecimalInputProps): JSX.Element {
  const [editing, setEditing] = useState<string>();
  return (
    <Div className="relative min-w-0">
      <Input
        {...inputProps}
        type="text"
        keyboardType="decimal-pad"
        className={cn(
          "w-full text-right tabular-nums",
          suffix && "pr-12",
          className,
        )}
        value={editing ?? decimalInputText(value, locale, presentation, false)}
        onFocus={() =>
          setEditing(decimalInputText(value, locale, presentation, true))
        }
        onBlur={() => {
          setEditing(undefined);
          onBlur?.();
        }}
        onChangeText={(text) => {
          setEditing(text);
          onChange(parseDecimalInput(text, locale, presentation));
        }}
      />
      {suffix && (
        <Span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
          {suffix}
        </Span>
      )}
    </Div>
  );
}
