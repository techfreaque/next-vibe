/**
 * MultiSelect Component for React Native
 * Imports types from web and provides native implementation
 */
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Pressable, View } from "react-native";

// Import ALL types from web (source of truth)
import type {
  MultiSelectOption,
  MultiSelectProps,
} from "@/packages/next-vibe-ui/web/ui/multi-select";

import { convertCSSToViewStyle } from "../utils/style-converter";
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
import { Check, ChevronDown, X } from "./icons";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder,
  emptyMessage,
  disabled = false,
  className,
  style,
  maxSelections,
  searchable = true,
}: MultiSelectProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handleSelect = (selectedValue: string): void => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return;
      }
      onChange([...value, selectedValue]);
    }
  };

  const handleRemove = (removeValue: string): void => {
    onChange(value.filter((v) => v !== removeValue));
  };

  const selectedOptions = options.filter((option) => value.includes(option.value));

  // Note: style prop is not passed to Button due to StyleType discriminated union
  // Button uses className for styling via NativeWind (either style OR className, not both)
  void nativeStyle; // Acknowledge nativeStyle is intentionally unused for Button
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls="multi-select-content"
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          <View className="flex flex-row flex-wrap gap-1">
            {selectedOptions.length > 0
              ? selectedOptions.map((option) => (
                  <Badge key={option.value} variant="secondary" className="mr-1">
                    {option.label}
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleRemove(option.value);
                      }}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Pressable>
                  </Badge>
                ))
              : placeholder || "Select options..."}
          </View>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {searchable && <CommandInput placeholder="Search..." />}
          <CommandList>
            <CommandEmpty>{emptyMessage || "No options found."}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")}
                    />
                    {option.label}
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

export type { MultiSelectOption };
