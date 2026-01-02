"use client";

import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { useTranslation } from "@/i18n/core/client";
import { Check, ChevronDown, X } from "@/packages/next-vibe-ui/web/ui/icons";

import type { StyleType } from "../utils/style-type";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type MultiSelectProps = {
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
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

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
    onChange(value.filter((v) => v !== optionValue));
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls="multi-select-list"
          className={cn(
            "w-full justify-between min-h-10 h-auto",
            value.length === 0 && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap">
            {value.length === 0 ? (
              <span>{placeholder || t("packages.nextVibeUi.web.ui.multiSelect.placeholder")}</span>
            ) : (
              selectedOptions.map((option) => (
                <Badge key={option.value} variant="secondary" className="mr-1 mb-1">
                  {option.label}
                  <button
                    type="button"
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(option.value);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false} id="multi-select-list">
          {searchable && <CommandInput placeholder="Search..." className="h-9" />}
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              {emptyMessage || t("packages.nextVibeUi.web.ui.multiSelect.noResultsFound")}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                const isDisabled =
                  option.disabled ||
                  (!isSelected && maxSelections !== undefined && value.length >= maxSelections);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      if (!isDisabled) {
                        handleSelect(option.value);
                      }
                    }}
                    disabled={isDisabled}
                    className={cn(isDisabled && "opacity-50 cursor-not-allowed")}
                  >
                    <div
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
