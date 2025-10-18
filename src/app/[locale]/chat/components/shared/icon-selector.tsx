"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import React, { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/packages/next-vibe-ui/web/ui";

import {
  getIconComponent,
  ICON_REGISTRY,
  type IconKey,
  type IconValue,
  isIconComponent,
  isIconKey,
} from "../../lib/config/icons";

interface IconSelectorProps {
  value: IconValue;
  onChange: (icon: IconValue) => void;
  className?: string;
  locale: CountryLanguage;
}

// Common emoji suggestions (visual UI elements, not translatable text)
const COMMON_EMOJIS = [
  "🤖",
  "🎨",
  "💼",
  "🔒",
  "🌍",
  "👥",
  "⚡",
  "🚀",
  "💡",
  "📚",
  "🎯",
  "🔥",
  "⭐",
  "💻",
  "📱",
  "🎮",
] as const;

/**
 * Unified Icon Selector Component
 *
 * Supports three types of icons:
 * 1. Unicode/Emoji - Text input for emoji/unicode characters
 * 2. Icon Library - Grid of all ICON_REGISTRY icons with preview
 * 3. Custom Component - Advanced option for developers (future)
 *
 * This component replaces all existing icon selectors:
 * - folder-icon-selector
 * - model icon picker
 * - persona icon picker
 */
export function IconSelector({
  value,
  onChange,
  className,
  locale,
}: IconSelectorProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [emojiInput, setEmojiInput] = useState("");
  const [activeTab, setActiveTab] = useState<"library" | "emoji">("library");

  // Translation function
  const { t } = simpleT(locale);

  // Get the current icon component for display
  const CurrentIcon = getIconComponent(value);

  // Get the current value as a string for comparison
  const currentValueString = isIconComponent(value)
    ? "" // Components don't have string representation
    : value;

  // Handle emoji input change
  const handleEmojiChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmojiInput(e.target.value);
  };

  // Handle emoji submit
  const handleEmojiSubmit = (): void => {
    if (emojiInput.trim()) {
      onChange(emojiInput.trim());
      setEmojiInput("");
      setOpen(false);
    }
  };

  // Handle icon library selection
  const handleIconSelect = (iconKey: IconKey): void => {
    onChange(iconKey);
    setOpen(false);
  };

  // Group icons by category for better organization
  const iconCategories: Record<string, IconKey[]> = {
    "Folders": [
      "folder",
      "folder-open",
      "folder-heart",
      "folder-clock",
      "folder-code",
      "folder-git",
      "briefcase",
      "home",
    ],
    "AI & Tech": [
      "brain",
      "bot",
      "cpu",
      "si-openai",
      "terminal",
      "laptop",
      "monitor",
      "database",
    ],
    "Security": ["lock", "shield", "shield-plus", "eye-off"],
    "Social": ["users", "globe", "message-square", "heart"],
    "Development": [
      "si-react",
      "si-nextdotjs",
      "si-typescript",
      "si-javascript",
      "si-python",
      "si-rust",
      "si-go",
      "si-nodejs",
    ],
    "Education": [
      "book",
      "book-open",
      "graduation-cap",
      "library",
      "microscope",
    ],
    "Creative": ["palette", "camera", "film", "music", "image"],
    "Business": ["briefcase", "dollar-sign", "trending-up", "trophy", "scale"],
    "Lifestyle": ["coffee", "utensils", "dumbbell", "gamepad", "plane"],
    "Nature": ["leaf", "mountain", "flame", "sparkles"],
    "Other": ["star", "heart", "link", "zap", "rocket"],
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 w-8 p-0", className)}
        >
          <CurrentIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
            <TabsTrigger value="library">
              {t("app.chat.iconSelector.tabs.library")}
            </TabsTrigger>
            <TabsTrigger value="emoji">
              {t("app.chat.iconSelector.tabs.emoji")}
            </TabsTrigger>
          </TabsList>

          {/* Icon Library Tab */}
          <TabsContent
            value="library"
            className="max-h-96 overflow-y-auto p-2 m-0"
          >
            <div className="space-y-4">
              {Object.entries(iconCategories).map(([category, icons]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                    {category}
                  </h4>
                  <div className="grid grid-cols-8 gap-1">
                    {icons.map((iconKey) => {
                      const Icon = ICON_REGISTRY[iconKey];
                      const isSelected =
                        isIconKey(currentValueString) &&
                        currentValueString === iconKey;

                      return (
                        <button
                          key={iconKey}
                          onClick={() => handleIconSelect(iconKey)}
                          className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors",
                            isSelected && "bg-accent border-2 border-primary",
                          )}
                          title={iconKey}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Unicode/Emoji Tab */}
          <TabsContent value="emoji" className="p-4 m-0">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {t("app.chat.iconSelector.emojiTab.label")}
                </label>
                <div className="flex gap-2">
                  <Input
                    value={emojiInput}
                    onChange={handleEmojiChange}
                    placeholder={t(
                      "app.chat.iconSelector.emojiTab.placeholder",
                    )}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEmojiSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handleEmojiSubmit}
                    disabled={!emojiInput.trim()}
                  >
                    {t("app.chat.iconSelector.emojiTab.apply")}
                  </Button>
                </div>
              </div>

              {/* Show current emoji if it's a string */}
              {!isIconKey(currentValueString) && currentValueString && (
                <div className="border rounded-md p-4 text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    {t("app.chat.iconSelector.emojiTab.currentIcon")}
                  </div>
                  <div className="text-4xl">{currentValueString}</div>
                </div>
              )}

              {/* Common emoji suggestions */}
              <div>
                <div className="text-sm font-medium mb-2">
                  {t("app.chat.iconSelector.emojiTab.commonEmojis")}
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onChange(emoji);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors text-xl",
                        currentValueString === emoji &&
                          "bg-accent border-2 border-primary",
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
