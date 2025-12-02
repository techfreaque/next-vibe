/**
 * TagsField Component for React Native
 * Production-ready multi-select tags input with suggestions and custom values
 */
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Plus, X } from "./icons";

// Import cross-platform types from web (source of truth)
import type {
  TagOption,
  TagsFieldProps,
} from "@/packages/next-vibe-ui/web/ui/tags-field";
import type { InputKeyboardEvent } from "@/packages/next-vibe-ui/web/ui/input";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import { useTranslation } from "../../../../i18n/core/client";
import { cn } from "next-vibe/shared/utils/utils";
import { Badge } from "./badge";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text as UIText } from "./text";

export function TagsField({
  value = [],
  onChange,
  onBlur,
  suggestions = [],
  placeholder = "packages.nextVibeUi.web.common.addTags",
  maxTags,
  allowCustom = true,
  disabled = false,
  className,
  style,
  name: _name,
}: TagsFieldProps): React.JSX.Element {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  // Filter suggestions based on input and exclude already selected
  const filteredSuggestions = suggestions.filter((suggestion: TagOption) => {
    const matchesInput = suggestion.label
      .toLowerCase()
      .includes(inputValue.toLowerCase());
    const notSelected = !value.includes(suggestion.value);
    return matchesInput && notSelected;
  });

  // Group suggestions by category
  const groupedSuggestions = filteredSuggestions.reduce(
    (groups: Record<string, TagOption[]>, suggestion: TagOption) => {
      const category = suggestion.category || "other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(suggestion);
      return groups;
    },
    {} as Record<string, TagOption[]>,
  );

  const addTag = (tagValue: string): void => {
    if (!tagValue.trim()) {
      return;
    }

    const trimmedValue = tagValue.trim();

    // Check if tag already exists
    if (value.includes(trimmedValue)) {
      return;
    }

    // Check max tags limit
    if (maxTags && value.length >= maxTags) {
      return;
    }

    onChange([...value, trimmedValue]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string): void => {
    onChange(value.filter((tag: string) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: InputKeyboardEvent): void => {
    // Input component doesn't actually use onKeyPress on native, but we accept it for API compatibility
    // This handler won't be called on native TextInput
    if (e.key === "Enter" && inputValue.trim()) {
      if (allowCustom) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleInputFocus = (): void => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = (): void => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      onBlur?.();
    }, 200);
  };

  const getTagLabel = (tagValue: string): string => {
    const suggestion = suggestions.find((s: TagOption) => s.value === tagValue);
    return suggestion ? suggestion.label : tagValue;
  };

  const canAddMore = !maxTags || value.length < maxTags;

  const handleSuggestionsOpenChange = (newOpen: boolean): void => {
    setShowSuggestions(newOpen);
  };

  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("relative", className),
      })}
    >
      <View
        className={cn(
          "min-h-[48px] w-full rounded-md border border-input bg-background px-3 py-2",
          disabled && "cursor-not-allowed opacity-50",
          "flex-row flex-wrap gap-2 items-center",
        )}
      >
        {/* Render selected tags */}
        {value.map((tag: string) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex-row items-center gap-1 px-2 py-1"
          >
            <UIText className="text-xs">{getTagLabel(tag)}</UIText>
            {!disabled && (
              <Pressable
                onPress={() => removeTag(tag)}
                className="h-3 w-3 items-center justify-center"
              >
                <X size={10} className="text-foreground" />
              </Pressable>
            )}
          </Badge>
        ))}

        {/* Input field */}
        {canAddMore && !disabled && (
          <Popover
            open={showSuggestions}
            onOpenChange={handleSuggestionsOpenChange}
          >
            <PopoverTrigger>
              <View className="flex-1 min-w-[120px]">
                <Input
                  value={inputValue}
                  onChangeText={setInputValue}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={value.length === 0 ? placeholder : ""}
                  className="border-0 p-0 h-6 bg-transparent"
                />
              </View>
            </PopoverTrigger>

            {suggestions.length > 0 && filteredSuggestions.length > 0 && (
              <PopoverContent className="w-80 p-0" align="start">
                <ScrollView className="max-h-[200px]">
                  {Object.entries(groupedSuggestions).map(
                    ([category, categorySuggestions]) => (
                      <View key={category} className="p-2">
                        {category !== "other" && (
                          <UIText className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                            {category}
                          </UIText>
                        )}
                        <View className="gap-1">
                          {(categorySuggestions as TagOption[]).map(
                            (suggestion: TagOption) => (
                              <Pressable
                                key={suggestion.value}
                                onPress={() => addTag(suggestion.value)}
                                className="flex-row items-center w-full h-8 px-2 rounded-sm active:bg-accent"
                              >
                                <Plus
                                  size={14}
                                  className="mr-2 text-foreground"
                                />
                                <UIText className="text-base">
                                  {suggestion.label}
                                </UIText>
                              </Pressable>
                            ),
                          )}
                        </View>
                      </View>
                    ),
                  )}

                  {allowCustom &&
                    inputValue.trim() &&
                    !filteredSuggestions.some(
                      (s: TagOption) => s.value === inputValue.trim(),
                    ) && (
                      <View className="p-2 border-t border-border">
                        <Pressable
                          onPress={() => addTag(inputValue)}
                          className="flex-row items-center w-full h-8 px-2 rounded-sm active:bg-accent"
                        >
                          <Plus size={14} className="mr-2 text-foreground" />
                          <UIText className="text-base">
                            {t(
                              "packages.nextVibeUi.web.common.addCustomValue",
                              {
                                value: inputValue.trim(),
                              },
                            )}
                          </UIText>
                        </Pressable>
                      </View>
                    )}
                </ScrollView>
              </PopoverContent>
            )}
          </Popover>
        )}

        {/* Max tags indicator */}
        {maxTags && (
          <UIText className="text-xs text-muted-foreground ml-auto">
            {value.length}/{maxTags}
          </UIText>
        )}
      </View>
    </View>
  );
}

// Re-export all types from web
export type { TagOption, TagsFieldProps };
