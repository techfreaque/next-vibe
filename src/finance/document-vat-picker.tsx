"use client";

import { Div } from "next-vibe/ui/components/div";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { formatPercent } from "next-vibe/unified-ui/_shared/format-money";
import { useWidgetLocale } from "next-vibe/unified-ui/_shared/use-widget-context";
import { DecimalInput } from "next-vibe/unified-ui/widgets/form-fields/number-field/decimal-input";
import { type JSX, useState } from "react";

import type { VatRateChoice } from "./document-vat-rates";

export function DocumentVatPicker({
  rates,
  value,
  label,
  manualLabel,
  disabled,
  invalid,
  onChange,
}: {
  rates: readonly VatRateChoice[];
  value: number;
  label: string;
  manualLabel: string;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (rate: number) => void;
}): JSX.Element {
  const locale = useWidgetLocale();
  const [manualSelected, setManualSelected] = useState(false);
  const manual =
    manualSelected ||
    (value !== 0 && !rates.some((rate) => rate.rate === value));
  const hasZeroRate = rates.some((rate) => rate.rate === 0);

  return (
    <Div className="flex min-w-0 flex-col gap-1">
      {rates.length > 0 && (
        <Select
          disabled={disabled}
          value={manual ? "manual" : String(value)}
          onValueChange={(selection) => {
            setManualSelected(selection === "manual");
            if (selection !== "manual") {
              onChange(Number(selection));
            }
          }}
        >
          <SelectTrigger aria-label={label} aria-invalid={invalid}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {!hasZeroRate && (
              <SelectItem value="0">{formatPercent(0, locale)}</SelectItem>
            )}
            {rates.map((rate) => (
              <SelectItem key={rate.rate} value={String(rate.rate)}>
                {rate.name} ({formatPercent(rate.rate, locale)})
              </SelectItem>
            ))}
            <SelectItem value="manual">{manualLabel}</SelectItem>
          </SelectContent>
        </Select>
      )}
      {(manual || rates.length === 0) && (
        <DecimalInput
          aria-label={label}
          aria-invalid={invalid}
          disabled={disabled}
          presentation="percent"
          locale={locale}
          suffix="%"
          value={value}
          onChange={(rate) => {
            setManualSelected(true);
            onChange(rate);
          }}
        />
      )}
    </Div>
  );
}
