"use client";

/**
 * Compact list controls shared by the money admin lists (processor,
 * subscriptions): a labelled segment group that applies on click and a row of
 * removable active-filter chips. Built from next-vibe-ui primitives so they
 * render on every platform.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { formatDate } from "next-vibe/core/i18n/core/localization-utils";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";

const REMOVE_GLYPH = "\u00D7";

export interface SegmentOption<TValue extends string> {
  value: TValue | undefined;
  label: string;
}

export function SegmentGroup<TValue extends string>({
  label,
  value,
  options,
  disabled,
  onSelect,
}: {
  label: string;
  value: TValue | undefined;
  options: readonly SegmentOption<TValue>[];
  disabled?: boolean;
  onSelect: (next: TValue | undefined) => void;
}): JSX.Element {
  return (
    <Div className="flex min-w-0 flex-col gap-1">
      <Span className="text-xs font-medium text-muted-foreground">{label}</Span>
      <Div className="flex min-w-0 flex-nowrap gap-1 overflow-x-auto pe-6 [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] @3xl:flex-wrap @3xl:pe-0 @3xl:[mask-image:none]">
        {options.map((option) => (
          <Button
            key={option.value ?? "all"}
            type="button"
            size="sm"
            variant={option.value === value ? "secondary" : "ghost"}
            className="h-7 shrink-0 px-2.5 text-xs"
            disabled={disabled}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </Div>
    </Div>
  );
}

export function DayRangeInputs({
  fromLabel,
  toLabel,
  from,
  to,
  disabled,
  onChange,
}: {
  fromLabel: string;
  toLabel: string;
  from: string | undefined;
  to: string | undefined;
  disabled?: boolean;
  onChange: (patch: { from?: string; to?: string }) => void;
}): JSX.Element {
  return (
    <Div className="flex flex-wrap items-end gap-2">
      <Div className="flex min-w-0 flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {fromLabel}
        </Span>
        <Input
          type="date"
          value={from ?? ""}
          disabled={disabled}
          className="h-8 w-40 text-xs"
          onChange={(event) => onChange({ from: event.target.value })}
        />
      </Div>
      <Div className="flex min-w-0 flex-col gap-1">
        <Span className="text-xs font-medium text-muted-foreground">
          {toLabel}
        </Span>
        <Input
          type="date"
          value={to ?? ""}
          disabled={disabled}
          className="h-8 w-40 text-xs"
          onChange={(event) => onChange({ to: event.target.value })}
        />
      </Div>
    </Div>
  );
}

export interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterChips({
  title,
  chips,
  clearLabel,
  removeLabel,
  disabled,
  onClear,
}: {
  title: string;
  chips: readonly FilterChip[];
  clearLabel: string;
  removeLabel: string;
  disabled?: boolean;
  onClear: () => void;
}): JSX.Element | null {
  if (chips.length === 0) {
    return null;
  }
  return (
    <Div className="flex min-w-0 flex-wrap items-center gap-1.5">
      <Span className="text-xs text-muted-foreground">{title}</Span>
      {chips.map((chip) => (
        <Span
          key={chip.key}
          className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-full border bg-muted/50 py-0.5 ps-2.5 pe-1 text-xs"
        >
          <Span className="shrink-0 text-muted-foreground">{chip.label}</Span>
          <Span className="min-w-0 font-medium [overflow-wrap:anywhere]">
            {chip.value}
          </Span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-5 shrink-0 rounded-full p-0 text-muted-foreground"
            aria-label={`${removeLabel}: ${chip.label} ${chip.value}`}
            disabled={disabled}
            onClick={chip.onRemove}
          >
            {REMOVE_GLYPH}
          </Button>
        </Span>
      ))}
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-6 px-1 text-xs"
        disabled={disabled}
        onClick={onClear}
      >
        {clearLabel}
      </Button>
    </Div>
  );
}

/** Timestamp formatted in UTC (stored timestamps are UTC), suffixed "UTC". */
export function formatUtc(
  value: Date | string,
  locale: CountryLanguage,
  pattern = "PP p",
): string {
  const date = new Date(value);
  const shifted = new Date(date.getTime() + date.getTimezoneOffset() * 60_000);
  return `${formatDate(shifted, locale, pattern)} UTC`;
}
