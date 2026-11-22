"use client";
import { Div } from "next-vibe/ui/components/div";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Input } from "next-vibe/ui/components/input";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import type { RegionEntry } from "./model";

export function CurrencyTag({
  region,
  className,
}: {
  region: RegionEntry;
  className?: string;
}): JSX.Element {
  return (
    <Span
      className={cn(
        "w-9 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground",
        className,
      )}
    >
      {region.currency}
    </Span>
  );
}

export function SectionLabel({
  children,
  className,
}: {
  children: string;
  className?: string;
}): JSX.Element {
  return (
    <Div
      className={cn(
        "px-4 pb-1.5 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </Div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}): JSX.Element {
  return (
    <Div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
        className="h-9 pl-9"
      />
    </Div>
  );
}
