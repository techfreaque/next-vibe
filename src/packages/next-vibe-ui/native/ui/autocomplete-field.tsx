/**
 * AutocompleteField Component for React Native
 * Production-ready autocomplete with search, categories, and custom values
 */
import { cn } from "next-vibe/shared/utils/utils";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text as RNText, View } from "react-native";

import { useTranslation } from "@/i18n/core/client";
import type {
  AutocompleteFieldProps,
  AutocompleteOption,
  AutocompleteOptionBase,
} from "@/packages/next-vibe-ui/web/ui/autocomplete-field";

import { Badge } from "./badge";
import { Check, ChevronDown, Search, X } from "./icons";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text as UIText } from "./text";

// Re-export enum for type parity with web
export { FormFieldCategory } from "@/packages/next-vibe-ui/web/ui/autocomplete-field";

export function AutocompleteField<TKey extends string>({
  value = "",
  onChange,
  onBlur,
  options,
  placeholder,
  searchPlaceholder,
  allowCustom = true,
  disabled = false,
  className,
  t,
}: AutocompleteFieldProps<TKey>): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isCustomValue, setIsCustomValue] = useState(false);
  const { t: globalT } = useTranslation();

  // Group options by category
  const groupedOptions = useMemo(() => {
    const groups: Record<string, AutocompleteOption<TKey>[]> = {};

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

    const filtered: Record<string, AutocompleteOption<TKey>[]> = {};

    Object.entries(groupedOptions).forEach(([category, categoryOptions]) => {
      const matchingOptions = categoryOptions.filter(
        (option) =>
          t(option.label).toLowerCase().includes(searchValue.toLowerCase()) ||
          option.value.toLowerCase().includes(searchValue.toLowerCase()),
      );

      if (matchingOptions.length > 0) {
        filtered[category] = matchingOptions;
      }
    });

    return filtered;
  }, [groupedOptions, searchValue, t]);

  // Check if current value is a custom value
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? t(selectedOption.label) : value;

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

  const handleClearPress = (e: { stopPropagation: () => void }): void => {
    e.stopPropagation();
    clearValue();
  };

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen);
  };

  return (
    <View className={cn("relative", className)}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Pressable
            disabled={disabled}
            className={cn(
              "h-12 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2",
              !value && "opacity-70",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <View className="flex-1 flex-row items-center gap-2 min-w-0">
              {isCustomValue && (
                <Badge variant="secondary" className="text-xs">
                  <UIText>
                    {globalT(
                      "packages.nextVibeUi.native.ui.autocompleteField.custom",
                    )}
                  </UIText>
                </Badge>
              )}
              <RNText
                numberOfLines={1}
                className={cn(
                  "flex-1 text-base",
                  !value && "text-muted-foreground",
                )}
              >
                {value ? displayValue : placeholder ? t(placeholder) : ""}
              </RNText>
            </View>
            <View className="flex-row items-center gap-1">
              {value && !disabled && (
                <Pressable
                  onPress={handleClearPress}
                  className="h-5 w-5 items-center justify-center rounded-sm"
                >
                  <X size={14} className="text-foreground" />
                </Pressable>
              )}
              <ChevronDown
                size={16}
                className="text-muted-foreground opacity-50"
              />
            </View>
          </Pressable>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <View className="rounded-md border border-border bg-popover">
            {/* Search input */}
            <View className="flex-row items-center border-b border-border px-3">
              <Search
                size={16}
                className="mr-2 text-muted-foreground opacity-50"
              />
              <Input
                placeholder={searchPlaceholder ? t(searchPlaceholder) : ""}
                value={searchValue}
                onChangeText={setSearchValue}
                className="h-10 flex-1 border-0 bg-transparent"
              />
            </View>

            {/* Options list */}
            <ScrollView className="max-h-[300px]">
              {Object.keys(filteredGroups).length === 0 ? (
                <View className="py-6 text-center">
                  <UIText className="text-sm text-muted-foreground text-center">
                    {globalT(
                      "packages.nextVibeUi.native.ui.autocompleteField.noOptionsFound",
                    )}
                  </UIText>
                  {allowCustom && searchValue && (
                    <Pressable
                      onPress={() => handleCustomValue(searchValue)}
                      className="mt-2 items-center"
                    >
                      <UIText className="text-sm text-primary">
                        {globalT(
                          "packages.nextVibeUi.native.ui.autocompleteField.use",
                          {
                            value: searchValue,
                          },
                        )}
                      </UIText>
                    </Pressable>
                  )}
                </View>
              ) : (
                Object.entries(filteredGroups).map(
                  ([category, categoryOptions]) => (
                    <View key={category} className="p-1">
                      {category !== "other" && (
                        <UIText className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase">
                          {category}
                        </UIText>
                      )}
                      {categoryOptions.map((option) => (
                        <Pressable
                          key={option.value}
                          onPress={() => handleSelect(option.value)}
                          className={cn(
                            "flex-row items-center justify-between rounded-sm px-2 py-2 active:bg-accent",
                          )}
                        >
                          <UIText className="text-base">
                            {t(option.label)}
                          </UIText>
                          {value === option.value && (
                            <Check size={16} className="text-foreground" />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  ),
                )
              )}

              {allowCustom &&
                searchValue &&
                Object.keys(filteredGroups).length > 0 && (
                  <View className="border-t border-border p-1">
                    <Pressable
                      onPress={() => handleCustomValue(searchValue)}
                      className="flex-row items-center rounded-sm px-2 py-2 active:bg-accent"
                    >
                      <UIText className="text-base">
                        {globalT(
                          "packages.nextVibeUi.native.ui.autocompleteField.use",
                          {
                            value: searchValue,
                          },
                        )}
                      </UIText>
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
export type { AutocompleteFieldProps, AutocompleteOptionBase };
