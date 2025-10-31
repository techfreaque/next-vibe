/**
 * AutocompleteField Component for React Native
 * Production-ready autocomplete with search, categories, and custom values
 */
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Check, ChevronDown, Search, X } from "./icons";

import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text as UIText } from "./text";

// Import cross-platform types from web
import type {
  AutocompleteOptionBase,
  AutocompleteFieldPropsBase,
} from "next-vibe-ui/ui/autocomplete-field";

// Native uses the exact same interface as web
export type AutocompleteFieldProps = AutocompleteFieldPropsBase;

export function AutocompleteField({
  value = "",
  onChange,
  onBlur,
  options,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  allowCustom = true,
  disabled = false,
  className,
  name,
}: AutocompleteFieldProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCustomValue, setIsCustomValue] = useState(false);

  // Group options by category
  const groupedOptions = useMemo(() => {
    const groups: Record<string, AutocompleteOptionBase[]> = {};

    options.forEach((option) => {
      const category = option.category || "other";
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

    const filtered: Record<string, AutocompleteOptionBase[]> = {};

    Object.entries(groupedOptions).forEach(([category, categoryOptions]) => {
      const matchingOptions = categoryOptions.filter(
        (option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
          option.value.toLowerCase().includes(searchValue.toLowerCase()),
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
    <View {...({className: cn("relative", className)} as any)}>
      <Popover {...({open, onOpenChange: setOpen} as any)}>
        <PopoverTrigger {...({asChild: true} as any)}>
          <Pressable
            {...({
              disabled,
              className: cn(
                "h-12 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2",
                !value && "opacity-70",
                disabled && "cursor-not-allowed opacity-50",
              ),
            } as any)}
          >
            <View {...({className: "flex-1 flex-row items-center gap-2 min-w-0"} as any)}>
              {isCustomValue && (
                <Badge {...({variant: "secondary", className: "text-xs"} as any)}>
                  <UIText>Custom</UIText>
                </Badge>
              )}
              <UIText
                {...({
                  numberOfLines: 1,
                  className: cn(
                    "flex-1 text-base",
                    !value && "text-muted-foreground",
                  ),
                } as any)}
              >
                {value ? displayValue : placeholder}
              </UIText>
            </View>
            <View {...({className: "flex-row items-center gap-1"} as any)}>
              {value && !disabled && (
                <Pressable
                  {...({
                    onPress: (e: any) => {
                      e.stopPropagation();
                      clearValue();
                    },
                    className: "h-5 w-5 items-center justify-center rounded-sm",
                  } as any)}
                >
                  <X {...({size: 14, className: "text-foreground"} as any)} />
                </Pressable>
              )}
              <ChevronDown {...({size: 16, className: "text-muted-foreground opacity-50"} as any)} />
            </View>
          </Pressable>
        </PopoverTrigger>
        <PopoverContent {...({className: "w-full p-0", align: "start"} as any)}>
          <View {...({className: "rounded-md border border-border bg-popover"} as any)}>
            {/* Search input */}
            <View {...({className: "flex-row items-center border-b border-border px-3"} as any)}>
              <Search {...({size: 16, className: "mr-2 text-muted-foreground opacity-50"} as any)} />
              <Input
                {...({
                  placeholder: searchPlaceholder,
                  value: searchValue,
                  onChangeText: setSearchValue,
                  className: "h-10 flex-1 border-0 bg-transparent",
                } as any)}
              />
            </View>

            {/* Options list */}
            <ScrollView {...({className: "max-h-[300px]"} as any)}>
              {Object.keys(filteredGroups).length === 0 ? (
                <View {...({className: "py-6 text-center"} as any)}>
                  <UIText {...({className: "text-sm text-muted-foreground text-center"} as any)}>
                    No options found
                  </UIText>
                  {allowCustom && searchValue && (
                    <Pressable
                      {...({
                        onPress: () => handleCustomValue(searchValue),
                        className: "mt-2 items-center",
                      } as any)}
                    >
                      <UIText {...({className: "text-sm text-primary"} as any)}>
                        Use "{searchValue}"
                      </UIText>
                    </Pressable>
                  )}
                </View>
              ) : (
                Object.entries(filteredGroups).map(([category, categoryOptions]) => (
                  <View key={category} {...({className: "p-1"} as any)}>
                    {category !== "other" && (
                      <UIText {...({className: "px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase"} as any)}>
                        {category}
                      </UIText>
                    )}
                    {categoryOptions.map((option) => (
                      <Pressable
                        key={option.value}
                        {...({
                          onPress: () => handleSelect(option.value),
                          className: cn(
                            "flex-row items-center justify-between rounded-sm px-2 py-2 active:bg-accent",
                          ),
                        } as any)}
                      >
                        <UIText {...({className: "text-base"} as any)}>{option.label}</UIText>
                        {value === option.value && (
                          <Check {...({size: 16, className: "text-foreground"} as any)} />
                        )}
                      </Pressable>
                    ))}
                  </View>
                ))
              )}

              {allowCustom && searchValue && Object.keys(filteredGroups).length > 0 && (
                <View {...({className: "border-t border-border p-1"} as any)}>
                  <Pressable
                    {...({
                      onPress: () => handleCustomValue(searchValue),
                      className: "flex-row items-center rounded-sm px-2 py-2 active:bg-accent",
                    } as any)}
                  >
                    <UIText {...({className: "text-base"} as any)}>Use "{searchValue}"</UIText>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  );
}

// Re-export cross-platform types
export type { AutocompleteOptionBase, AutocompleteFieldPropsBase };
