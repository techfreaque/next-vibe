/**
 * Tags Field Component
 * Multi-select tags input with suggestions and custom values
 */

"use client";

import { Plus, X } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useRef, useState } from "react";

import { useTranslation } from "@/i18n/core/client";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";
import type { TParams } from "@/i18n/core/static-types";

import { Badge } from "./badge";
import { Button } from "./button";
import { Input, type InputKeyboardEvent } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface TagOption<TKey extends string> {
  value: string;
  label: TKey;
  category?: string;
}

export interface TagsFieldProps<TKey extends string> {
  value?: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  suggestions?: TagOption<TKey>[];
  placeholder?: TKey;
  maxTags?: number;
  allowCustom?: boolean;
  disabled?: boolean;
  name?: string;
  t: <K extends string>(key: K, params?: TParams) => TranslatedKeyType;
  className?: string;
}

export function TagsField<TKey extends string>({
  value = [],
  onChange,
  onBlur,
  suggestions = [],
  placeholder,
  maxTags,
  allowCustom = true,
  disabled = false,
  className,
  name,
  t,
}: TagsFieldProps<TKey>): JSX.Element {
  const { t: globalT } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input and exclude already selected
  const filteredSuggestions = suggestions.filter((suggestion) => {
    const matchesInput = t(suggestion.label)
      .toLowerCase()
      .includes(inputValue.toLowerCase());
    const notSelected = !value.includes(suggestion.value);
    return matchesInput && notSelected;
  });

  // Group suggestions by category
  const groupedSuggestions = filteredSuggestions.reduce(
    (groups, suggestion) => {
      const category = suggestion.category || "other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(suggestion);
      return groups;
    },
    {} as Record<string, TagOption<TKey>[]>,
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
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: InputKeyboardEvent): void => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault?.();
      if (allowCustom) {
        addTag(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
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
    const suggestion = suggestions.find((s) => s.value === tagValue);
    return suggestion ? t(suggestion.label) : tagValue;
  };

  const canAddMore = !maxTags || value.length < maxTags;

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500",
          disabled && "cursor-not-allowed opacity-50",
          "flex flex-wrap gap-2 items-center",
        )}
      >
        {/* Render selected tags */}
        {value.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span className="text-xs">{getTagLabel(tag)}</span>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-transparent"
                onClick={() => removeTag(tag)}
              >
                <X className="h-2 w-2" />
              </Button>
            )}
          </Badge>
        ))}

        {/* Input field */}
        {canAddMore && !disabled && (
          <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
            <PopoverTrigger asChild>
              <div className="flex-1 min-w-[120px]">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder={
                    value.length === 0 && placeholder ? t(placeholder) : ""
                  }
                  className="border-0 p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent w-full"
                />
              </div>
            </PopoverTrigger>

            {suggestions.length > 0 && (
              <PopoverContent className="w-80 p-0" align="start">
                <div className="max-h-[200px] overflow-y-auto">
                  {Object.entries(groupedSuggestions).map(
                    ([category, categorySuggestions]) => (
                      <div key={category} className="p-2">
                        {category !== "other" && (
                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {category}
                          </div>
                        )}
                        <div className="space-y-1">
                          {categorySuggestions.map((suggestion) => (
                            <Button
                              key={suggestion.value}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-8 px-2"
                              onClick={() => addTag(suggestion.value)}
                            >
                              <Plus className="h-3 w-3 mr-2" />
                              {t(suggestion.label)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ),
                  )}

                  {allowCustom &&
                    inputValue.trim() &&
                    !filteredSuggestions.some(
                      (s) => s.value === inputValue.trim(),
                    ) && (
                      <div className="p-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start h-8 px-2"
                          onClick={() => addTag(inputValue)}
                        >
                          <Plus className="h-3 w-3 mr-2" />
                          {globalT(
                            "packages.nextVibeUi.web.common.addCustomValue",
                            {
                              value: inputValue.trim(),
                            },
                          )}
                        </Button>
                      </div>
                    )}
                </div>
              </PopoverContent>
            )}
          </Popover>
        )}

        {/* Max tags indicator */}
        {maxTags && (
          <div className="text-xs text-muted-foreground ml-auto">
            {value.length}/{maxTags}
          </div>
        )}
      </div>

      {/* Hidden input for form submission */}
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      )}
    </div>
  );
}
