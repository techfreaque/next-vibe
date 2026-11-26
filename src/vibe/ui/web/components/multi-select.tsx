"use client";

import { Command as CommandPrimitive, defaultFilter } from "cmdk";
import * as React from "react";

import { useTranslation } from "../../../core/i18n/core/client";
import { cn } from "../../../unified-ui/_shared/cn";
import { scopedTranslation } from "../i18n";
import type { StyleType } from "../utils/style-type";
import { Badge } from "./badge";
import { Command, CommandGroup, CommandItem, CommandList } from "./command";
import { Check } from "./icons/Check";
import { ChevronDown } from "./icons/ChevronDown";
import { MagnifyingGlassIcon } from "./icons/MagnifyingGlassIcon";
import { X } from "./icons/X";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type MultiSelectProps = {
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  maxSelections?: number;
  searchable?: boolean;
} & StyleType;

export function MultiSelect(props: MultiSelectProps): React.JSX.Element {
  const {
    options,
    value = [],
    onChange,
    placeholder,
    emptyMessage,
    disabled = false,
    className,
    maxSelections,
    searchable = true,
  } = props;
  const { locale } = useTranslation();
  const { t } = scopedTranslation.scopedT(locale);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const popoverId = React.useId();
  const commandId = `${popoverId}-options`;
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (optionValue: string): void => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      // Remove from selection
      onChange(value.filter((v) => v !== optionValue));
    } else if (maxSelections === undefined || value.length < maxSelections) {
      // Add to selection (if not at max)
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string): void => {
    const focusTarget = open
      ? (searchRef.current ?? document.getElementById(commandId))
      : triggerRef.current;
    focusTarget?.focus();
    onChange(value.filter((v) => v !== optionValue));
  };

  const visibleOptions =
    searchable && query
      ? options.filter((option) => defaultFilter(option.label, query) > 0)
      : options;
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex min-h-10 w-full min-w-0 flex-wrap items-center gap-1 rounded-md border border-input bg-background px-2 text-sm focus-within:ring-1 focus-within:ring-ring",
          disabled && "opacity-50",
          className,
        )}
      >
        {selectedOptions.map((option) => (
          <Badge
            key={option.value}
            variant="secondary"
            className="max-w-full min-w-0 gap-1"
          >
            <span className="min-w-0 whitespace-normal [overflow-wrap:anywhere]">
              {option.label}
            </span>
            <button
              type="button"
              disabled={disabled || option.disabled}
              aria-label={t("ui.multiSelect.remove", { label: option.label })}
              className="grid size-6 shrink-0 place-items-center rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
              onClick={() => handleRemove(option.value)}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </Badge>
        ))}
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            id={props.id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? popoverId : undefined}
            aria-label={
              props["aria-label"] ??
              placeholder ??
              t("ui.multiSelect.placeholder")
            }
            aria-invalid={props["aria-invalid"]}
            aria-describedby={props["aria-describedby"]}
            className="flex min-h-9 min-w-8 flex-1 items-center justify-between gap-2 rounded-sm px-1 text-start font-normal focus-visible:outline-2 focus-visible:outline-ring"
            disabled={disabled}
          >
            {!selectedOptions.length && (
              <span className="text-muted-foreground">
                {placeholder ?? t("ui.multiSelect.placeholder")}
              </span>
            )}
            <ChevronDown
              className="ml-auto size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        id={popoverId}
        className="w-80 max-w-[calc(100vw-2rem)] p-0"
        align="start"
        collisionPadding={16}
        onOpenAutoFocus={(event) => {
          if (!searchable) {
            event.preventDefault();
            document.getElementById(commandId)?.focus();
          }
        }}
        onInteractOutside={(event) => {
          if (
            event.target instanceof Node &&
            fieldRef.current?.contains(event.target)
          ) {
            event.preventDefault();
          }
        }}
      >
        <Command shouldFilter={false} id={commandId}>
          {searchable && (
            <div className="flex items-center gap-2 border-b px-3">
              <MagnifyingGlassIcon
                className="size-4 shrink-0 opacity-50"
                aria-hidden="true"
              />
              <CommandPrimitive.Input
                ref={searchRef}
                aria-label={t("ui.multiSelect.search")}
                placeholder={t("ui.multiSelect.search")}
                value={query}
                onValueChange={setQuery}
                className="h-10 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          )}
          {!visibleOptions.length && (
            <p role="status" className="px-3 py-6 text-center text-sm">
              {emptyMessage || t("ui.multiSelect.noResultsFound")}
            </p>
          )}
          <CommandList className="max-h-[300px]">
            <CommandGroup>
              {visibleOptions.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled =
                  option.disabled ||
                  (!isSelected &&
                    maxSelections !== undefined &&
                    value.length >= maxSelections);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      if (!isDisabled) {
                        handleSelect(option.value);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(
                      isDisabled && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <div
                      // cmdk's aria-selected means "highlighted"; this is the real selection (E2E hook)
                      data-checked={isSelected}
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
