/**
 * Icon Picker Component
 * Comprehensive icon selection UI with categories, search, and all icons from ICON_REGISTRY
 * Better organized version of folder-icon-selector
 */

"use client";

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import {
  getIconComponent,
  ICON_REGISTRY,
  type IconKey,
} from "@/app/api/[locale]/agent/chat/model-access/icons";
import { useTranslation } from "@/i18n/core/client";

import { Button } from "./button";
import { Div } from "./div";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import { Span } from "./span";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

/**
 * Icon categories for better organization
 * Maps category names to their icon keys
 */
export const ICON_CATEGORIES = {
  all: Object.keys(ICON_REGISTRY) as IconKey[],
  general: [
    "folder",
    "folder-open",
    "folder-heart",
    "folder-clock",
    "folder-code",
    "folder-git",
    "briefcase",
    "home",
    "star",
    "heart",
    "sparkles",
    "link",
    "bookmark",
  ] as IconKey[],
  ai: [
    "brain",
    "bot",
    "cpu",
    "si-openai",
    "terminal",
    "laptop",
    "monitor",
    "database",
    "bug",
    "code",
    "network",
    "cloud",
    "robot-face",
  ] as IconKey[],
  education: [
    "book",
    "book-open",
    "library",
    "graduation-cap",
    "microscope",
    "test-tube",
    "atom",
    "target",
    "books",
  ] as IconKey[],
  communication: [
    "message-square",
    "message-circle",
    "users",
    "user",
    "si-reddit",
    "si-discord",
    "mail",
    "phone",
    "send",
    "share",
    "megaphone",
    "bell",
  ] as IconKey[],
  science: [
    "rocket",
    "lightbulb",
    "zap",
    "wand",
    "compass",
    "microscope",
    "test-tube",
    "atom",
    "rocket-emoji",
  ] as IconKey[],
  arts: [
    "music",
    "palette",
    "film",
    "camera",
    "image",
    "gamepad",
    "trophy",
    "tv",
    "artist-palette",
  ] as IconKey[],
  finance: [
    "dollar-sign",
    "trending-up",
    "banknote",
    "wallet",
    "shopping-cart",
    "pie-chart",
    "bar-chart",
    "credit-card",
    "coins",
    "bitcoin",
  ] as IconKey[],
  lifestyle: [
    "coffee",
    "utensils",
    "dumbbell",
    "activity",
    "plane",
    "map",
    "mountain",
    "leaf",
    "flame",
    "sun",
  ] as IconKey[],
  security: ["lock", "key", "eye-off", "shield", "shield-plus", "locked"] as IconKey[],
  programming: [
    "si-javascript",
    "si-typescript",
    "si-python",
    "si-rust",
    "si-go",
    "si-react",
    "si-nextdotjs",
    "si-nodejs",
    "si-docker",
    "si-git",
    "si-github",
    "technologist",
  ] as IconKey[],
  platforms: [
    "si-linux",
    "si-apple",
    "si-android",
    "si-google",
    "facebook",
    "instagram",
    "linkedin",
    "twitter",
    "youtube",
  ] as IconKey[],
  ai_providers: [
    "si-anthropic",
    "si-googlegemini",
    "si-mistralai",
    "si-openai",
    "freedom-gpt-logo",
    "gab-ai-logo",
  ] as IconKey[],
  media: ["newspaper", "globe", "scale", "file-text"] as IconKey[],
  special: ["1a", "sparkle", "fire", "glowing-star", "high-voltage"] as IconKey[],
} as const;

export type CategoryKey = keyof typeof ICON_CATEGORIES;

export interface IconPickerProps {
  /** Current selected icon key */
  value?: IconKey;
  /** Callback when icon is selected */
  onChange: (iconKey: IconKey) => void;
  /** Optional className for the trigger button */
  className?: string;
  /** Trigger button size */
  size?: "sm" | "default" | "lg";
}

/**
 * Icon Picker Component
 * Allows users to browse and select icons from ICON_REGISTRY
 */
export function IconPicker({
  value,
  onChange,
  className,
  size = "default",
}: IconPickerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const { t } = useTranslation();

  // Get selected icon component
  const SelectedIcon = value ? getIconComponent(value) : null;

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    const categoryIcons = ICON_CATEGORIES[activeCategory];
    if (!searchQuery) {
      return categoryIcons;
    }

    const query = searchQuery.toLowerCase();
    return categoryIcons.filter((iconKey) => iconKey.toLowerCase().includes(query));
  }, [searchQuery, activeCategory]);

  // Button size classes
  const sizeClasses = {
    sm: "h-8 w-8 p-0",
    default: "h-10 w-10 p-0",
    lg: "h-12 w-12 p-0",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(sizeClasses[size], className)}
          title={t("app.ui.iconPicker.selectIcon")}
        >
          {SelectedIcon ? (
            <SelectedIcon className={iconSizeClasses[size]} />
          ) : (
            // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Non-translatable placeholder icon
            <Span className="text-muted-foreground text-xs">?</Span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Div className="flex flex-col h-[600px]">
          {/* Header with search */}
          <Div className="flex flex-col gap-3 p-4 border-b bg-card">
            <Span className="font-semibold text-sm">{t("app.ui.iconPicker.title")}</Span>
            <Input
              placeholder={t("app.ui.iconPicker.searchPlaceholder")}
              value={searchQuery}
              onChange={(e): void => setSearchQuery(e.target.value)}
              className="h-9"
            />
          </Div>

          {/* Category tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={(val): void => setActiveCategory(val as CategoryKey)}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 p-2 border-b rounded-none bg-muted/30">
              <TabsTrigger value="all" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.all")}
              </TabsTrigger>
              <TabsTrigger value="general" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.general")}
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.ai")}
              </TabsTrigger>
              <TabsTrigger value="education" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.education")}
              </TabsTrigger>
              <TabsTrigger value="communication" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.communication")}
              </TabsTrigger>
              <TabsTrigger value="science" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.science")}
              </TabsTrigger>
              <TabsTrigger value="arts" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.arts")}
              </TabsTrigger>
              <TabsTrigger value="finance" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.finance")}
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.lifestyle")}
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.security")}
              </TabsTrigger>
              <TabsTrigger value="programming" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.programming")}
              </TabsTrigger>
              <TabsTrigger value="platforms" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.platforms")}
              </TabsTrigger>
              {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Non-translatable component prop identifier */}
              <TabsTrigger value="ai_providers" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.aiProviders")}
              </TabsTrigger>
              <TabsTrigger value="media" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.media")}
              </TabsTrigger>
              <TabsTrigger value="special" className="text-xs px-2 py-1">
                {t("app.ui.iconPicker.categories.special")}
              </TabsTrigger>
            </TabsList>

            {/* Icon grid */}
            <TabsContent value={activeCategory} className="flex-1 overflow-hidden mt-0 border-0">
              <ScrollArea className="h-full">
                <Div className="grid grid-cols-8 gap-1 p-3">
                  {filteredIcons.map((iconKey) => {
                    const Icon = getIconComponent(iconKey);
                    const isSelected = value === iconKey;

                    return (
                      <Button
                        key={iconKey}
                        variant="ghost"
                        size="sm"
                        onClick={(): void => {
                          onChange(iconKey);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-center h-10 w-full rounded-md hover:bg-accent transition-colors",
                          isSelected && "bg-accent border-2 border-primary",
                        )}
                        title={iconKey}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </Div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Footer with count */}
          <Div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
            <Span>
              {t("app.ui.iconPicker.showing", {
                count: filteredIcons.length,
                total: ICON_CATEGORIES[activeCategory].length,
              })}
            </Span>
            {value && <Span className="font-mono text-primary">{value}</Span>}
          </Div>
        </Div>
      </PopoverContent>
    </Popover>
  );
}

IconPicker.displayName = "IconPicker";
