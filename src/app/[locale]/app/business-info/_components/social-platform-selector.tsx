/**
 * Simple Social Platform Selector Component
 * Uses FormField properly without complex state management
 */

"use client";

import type { LucideIcon } from "lucide-react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Plus,
  Star,
  Trash2,
  TrendingUp,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import type { JSX } from "react";
import { useState } from "react";

import type {
  SocialPlatform,
  SocialPlatformItem,
} from "@/app/api/[locale]/v1/core/business-data/social/schema";
import type { TFunction, TranslationKey } from "@/i18n/core/static-types";

export interface SocialPlatformElement {
  name: TranslationKey;
  icon: LucideIcon;
  color: string;
  textColor: string;
}

// Platform configuration with icons and colors
const PLATFORM_CONFIG: Record<SocialPlatform, SocialPlatformElement> = {
  facebook: {
    name: "businessInfo.social.form.platformNames.facebook",
    icon: Facebook,
    color: "bg-blue-600",
    textColor: "text-blue-600",
  },
  instagram: {
    name: "businessInfo.social.form.platformNames.instagram",
    icon: Instagram,
    color: "bg-purple-500 bg-gradient-to-r from-purple-500 to-pink-500",
    textColor: "text-pink-600",
  },
  twitter: {
    name: "businessInfo.social.form.platformNames.twitter",
    icon: Twitter,
    color: "bg-black",
    textColor: "text-gray-900",
  },
  linkedin: {
    name: "businessInfo.social.form.platformNames.linkedin",
    icon: Linkedin,
    color: "bg-blue-700",
    textColor: "text-blue-700",
  },
  youtube: {
    name: "businessInfo.social.form.platformNames.youtube",
    icon: Youtube,
    color: "bg-red-600",
    textColor: "text-red-600",
  },
  tiktok: {
    name: "businessInfo.social.form.platformNames.tiktok",
    icon: Users,
    color: "bg-black",
    textColor: "text-gray-900",
  },
  pinterest: {
    name: "businessInfo.social.form.platformNames.pinterest",
    icon: TrendingUp,
    color: "bg-red-500",
    textColor: "text-red-500",
  },
  snapchat: {
    name: "businessInfo.social.form.platformNames.snapchat",
    icon: Users,
    color: "bg-yellow-400",
    textColor: "text-yellow-600",
  },
  discord: {
    name: "businessInfo.social.form.platformNames.discord",
    icon: Users,
    color: "bg-indigo-600",
    textColor: "text-indigo-600",
  },
  reddit: {
    name: "businessInfo.social.form.platformNames.reddit",
    icon: Users,
    color: "bg-orange-600",
    textColor: "text-orange-600",
  },
  telegram: {
    name: "businessInfo.social.form.platformNames.telegram",
    icon: Users,
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  whatsapp: {
    name: "businessInfo.social.form.platformNames.whatsapp",
    icon: Users,
    color: "bg-green-500",
    textColor: "text-green-500",
  },
  other: {
    name: "businessInfo.social.form.platformNames.other",
    icon: Plus,
    color: "bg-gray-500",
    textColor: "text-gray-500",
  },
};

interface SocialPlatformSelectorProps {
  value: SocialPlatformItem[];
  onChange: (platforms: SocialPlatformItem[]) => void;
  t: TFunction;
}

export function SocialPlatformSelector({
  value,
  onChange,
  t,
}: SocialPlatformSelectorProps): JSX.Element {
  // Track platforms being edited (with empty usernames)
  const [editingPlatforms, setEditingPlatforms] = useState<
    SocialPlatformItem[]
  >([]);

  // Combine saved platforms (from form) with editing platforms (local state)
  const allPlatforms = [...value, ...editingPlatforms];

  const addPlatform = (platform: SocialPlatform): void => {
    const newPlatform: SocialPlatformItem = {
      platform,
      username: "",
      isActive: true,
      priority: "medium",
    };
    // Add to editing state, not form yet
    setEditingPlatforms([...editingPlatforms, newPlatform]);
  };

  const removePlatform = (index: number): void => {
    if (index < value.length) {
      // Remove from saved platforms
      const newPlatforms = value.filter((_, i) => i !== index);
      onChange(newPlatforms);
    } else {
      // Remove from editing platforms
      const editingIndex = index - value.length;
      const newEditingPlatforms = editingPlatforms.filter(
        (_, i) => i !== editingIndex,
      );
      setEditingPlatforms(newEditingPlatforms);
    }
  };

  const updatePlatform = (
    index: number,
    updates: Partial<SocialPlatformItem>,
  ): void => {
    if (index < value.length) {
      // Update saved platform
      const newPlatforms = value.map((platform, i) =>
        i === index ? { ...platform, ...updates } : platform,
      );
      onChange(newPlatforms);
    } else {
      // Update editing platform
      const editingIndex = index - value.length;
      const updatedPlatform = { ...editingPlatforms[editingIndex], ...updates };

      // If username is now filled, move to saved platforms
      if (updatedPlatform.username?.trim()) {
        const newEditingPlatforms = editingPlatforms.filter(
          (_, i) => i !== editingIndex,
        );
        setEditingPlatforms(newEditingPlatforms);
        onChange([...value, updatedPlatform]);
      } else {
        // Keep in editing state
        const newEditingPlatforms = editingPlatforms.map((platform, i) =>
          i === editingIndex ? updatedPlatform : platform,
        );
        setEditingPlatforms(newEditingPlatforms);
      }
    }
  };

  const availablePlatforms = Object.keys(PLATFORM_CONFIG) as SocialPlatform[];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("businessInfo.social.form.fields.platforms.label")}
          </div>
          {allPlatforms.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {allPlatforms.length} platforms
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Platform Buttons */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">
            {t("businessInfo.social.form.platformSelector.addPlatforms")}
          </Label>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map((platform) => {
              const config = PLATFORM_CONFIG[platform];
              const Icon = config.icon;

              return (
                <Button
                  key={platform}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 flex items-center gap-2"
                  onClick={() => addPlatform(platform)}
                  type="button"
                >
                  <div className={`p-1 rounded-full ${config.color}`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium">{t(config.name)}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Platform List */}
        {allPlatforms.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {t("businessInfo.social.form.platformSelector.yourPlatforms")}
            </Label>
            <div className="space-y-3">
              {allPlatforms.map((item, index) => {
                const config = PLATFORM_CONFIG[item.platform];
                const Icon = config.icon;

                return (
                  <Card key={`${item.platform}-${index}`} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${config.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            {t(
                              "businessInfo.social.form.platformSelector.usernameHandle",
                            )}
                          </Label>
                          <Input
                            placeholder={t(
                              "businessInfo.social.form.platformSelector.usernamePlaceholder",
                            )}
                            value={item.username || ""}
                            onChange={(e) =>
                              updatePlatform(index, {
                                username: e.target.value,
                              })
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            {t(
                              "businessInfo.social.form.platformSelector.priority",
                            )}
                          </Label>
                          <Select
                            value={item.priority}
                            onValueChange={(
                              priority: "high" | "medium" | "low",
                            ) => updatePlatform(index, { priority })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">
                                <div className="flex items-center gap-2">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  {t(
                                    "businessInfo.social.form.platformSelector.highPriority",
                                  )}
                                </div>
                              </SelectItem>
                              <SelectItem value="medium">
                                {t(
                                  "businessInfo.social.form.platformSelector.mediumPriority",
                                )}
                              </SelectItem>
                              <SelectItem value="low">
                                {t(
                                  "businessInfo.social.form.platformSelector.lowPriority",
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() => removePlatform(index)}
                            className="text-red-500 hover:text-red-700 h-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {allPlatforms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {t("businessInfo.social.form.platformSelector.emptyState.title")}
            </p>
            <p className="text-xs">
              {t(
                "businessInfo.social.form.platformSelector.emptyState.instruction",
                {
                  count: availablePlatforms.length,
                },
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
