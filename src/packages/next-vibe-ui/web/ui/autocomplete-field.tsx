/**
 * Autocomplete Field Component
 * Enhanced autocomplete input with search, categories, and custom options
 */

"use client";

import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useMemo, useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { TranslationKey } from "@/i18n/core/static-types";

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

export enum FormFieldCategory {
  OTHER = "other",
}

const CATEGORY_TRANSLATION_KEYS: Record<FormFieldCategory, TranslationKey> = {
  [FormFieldCategory.OTHER]: "packages.nextVibeUi.web.common.other",
};

// Cross-platform base interface (no TranslationKey dependency)
export interface AutocompleteOptionBase<TKey extends string> {
  value: string;
  label: TKey;
  category?: TranslationKey;
  description?: TKey;
}

export interface AutocompleteOption<TKey extends string> {
  value: string;
  label: TKey;
  category?: string;
  /** Optional secondary text shown below the label */
  description?: TKey;
}

export interface AutocompleteFieldProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: AutocompleteOption<string>[];
  /** Already-translated placeholder text */
  placeholder?: string;
  /** Already-translated search placeholder text */
  searchPlaceholder?: string;
  allowCustom?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export function AutocompleteField({
  value = "",
  onChange,
  onBlur,
  options,
  placeholder,
  searchPlaceholder,
  allowCustom = true,
  disabled = false,
  className,
  name,
}: AutocompleteFieldProps): JSX.Element {
  const { t: globalT } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCustomValue, setIsCustomValue] = useState(false);

  // Group options by category
  const groupedOptions = useMemo(() => {
    const groups: Record<string, AutocompleteOption<string>[]> = {};

    options.forEach((option) => {
      const category = option.category || FormFieldCategory.OTHER;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(option);
    });

    return groups;
  }, [options]);

  // Filter options based on search
  const filteredGroups = useMemo(() => {
    if (!searchValue) {
      return groupedOptions;
    }

    const filtered: Record<string, AutocompleteOption<string>[]> = {};

    Object.entries(groupedOptions).forEach(([category, categoryOptions]) => {
      const lowerSearch = searchValue.toLowerCase();
      const matchingOptions = categoryOptions.filter(
        (option) =>
          option.label.toLowerCase().includes(lowerSearch) ||
          option.value.toLowerCase().includes(lowerSearch) ||
          (option.description &&
            option.description.toLowerCase().includes(lowerSearch)),
      );

      if (matchingOptions.length > 0) {
        filtered[category] = matchingOptions;
      }
    });

    return filtered;
  }, [groupedOptions, searchValue]);

  // Check if current value is a custom value
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : value;

  React.useEffect(() => {
    setIsCustomValue(!selectedOption && value !== "");
  }, [selectedOption, value]);

  const handleSelect = (selectedValue: string): void => {
    onChange(selectedValue);
    setOpen(false);
    setSearchValue("");
    onBlur?.();
  };

  const handleCustomValue = (customValue: string): void => {
    onChange(customValue);
    setIsCustomValue(true);
    setOpen(false);
    setSearchValue("");
    onBlur?.();
  };

  const clearValue = (): void => {
    onChange("");
    setIsCustomValue(false);
    onBlur?.();
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative w-full">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-controls="autocomplete-listbox"
              className={cn(
                "w-full justify-between h-10 font-normal",
                !value && "text-muted-foreground",
                disabled && "cursor-not-allowed opacity-50",
                value && !disabled && "pr-14",
              )}
              disabled={disabled}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isCustomValue && (
                  <Badge variant="secondary" className="text-xs">
                    {globalT("app.common.customValue")}
                  </Badge>
                )}
                <span className="truncate">
                  {value ? displayValue : (placeholder ?? "")}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {value && !disabled && (
            <button
              type="button"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 p-0 rounded-sm hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center z-10"
              onClick={(e) => {
                e.stopPropagation();
                clearValue();
              }}
              title="Clear value"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <PopoverContent className="w-full p-0" align="start">
          <Command id="autocomplete-listbox">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder={searchPlaceholder ?? ""}
                value={searchValue}
                onValueChange={setSearchValue}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p className="text-muted-foreground">
                    {globalT("app.common.noOptionsFound")}
                  </p>
                  {allowCustom && searchValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleCustomValue(searchValue)}
                    >
                      {globalT("app.common.useCustomValue", {
                        value: searchValue,
                      })}
                    </Button>
                  )}
                </div>
              </CommandEmpty>

              {Object.entries(filteredGroups).map(
                ([category, categoryOptions]) => (
                  <CommandGroup
                    key={category}
                    heading={
                      category !== FormFieldCategory.OTHER.toString()
                        ? globalT(
                            CATEGORY_TRANSLATION_KEYS[
                              category as FormFieldCategory
                            ] ||
                              CATEGORY_TRANSLATION_KEYS[
                                FormFieldCategory.OTHER
                              ],
                          )
                        : undefined
                    }
                  >
                    {categoryOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="truncate">{option.label}</span>
                          {option.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {option.description}
                            </span>
                          )}
                        </div>
                        {value === option.value && (
                          <Check className="h-4 w-4 shrink-0" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ),
              )}

              {allowCustom &&
                searchValue &&
                Object.keys(filteredGroups).length === 0 && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => handleCustomValue(searchValue)}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {globalT("app.common.useCustomValue", {
                          value: searchValue,
                        })}
                      </span>
                    </CommandItem>
                  </CommandGroup>
                )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
