/**
 * Icon Picker Component for React Native
 * Simplified icon selection UI with categories and search
 */

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { getIconComponent } from "@/app/api/[locale]/agent/chat/model-access/icons";
import { useTranslation } from "@/i18n/core/client";

import {
  type CategoryKey,
  ICON_CATEGORIES,
  type IconPickerProps,
} from "../../web/ui/icon-picker";
import { Text } from "./text";

export type { CategoryKey, IconPickerProps };
export { ICON_CATEGORIES };
/**
 * Icon Picker Component for React Native
 */
export function IconPicker({
  value,
  onChange,
  className,
}: IconPickerProps): JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
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
    return categoryIcons.filter((iconKey) =>
      iconKey.toLowerCase().includes(query),
    );
  }, [searchQuery, activeCategory]);

  const categories: Array<{ key: CategoryKey; label: string }> = [
    { key: "all", label: t("app.ui.iconPicker.categories.all") },
    { key: "general", label: t("app.ui.iconPicker.categories.general") },
    { key: "ai", label: t("app.ui.iconPicker.categories.ai") },
    { key: "education", label: t("app.ui.iconPicker.categories.education") },
    {
      key: "communication",
      label: t("app.ui.iconPicker.categories.communication"),
    },
    { key: "science", label: t("app.ui.iconPicker.categories.science") },
    { key: "arts", label: t("app.ui.iconPicker.categories.arts") },
    { key: "finance", label: t("app.ui.iconPicker.categories.finance") },
    { key: "lifestyle", label: t("app.ui.iconPicker.categories.lifestyle") },
    { key: "security", label: t("app.ui.iconPicker.categories.security") },
    {
      key: "programming",
      label: t("app.ui.iconPicker.categories.programming"),
    },
    { key: "platforms", label: t("app.ui.iconPicker.categories.platforms") },
    {
      key: "ai_providers",
      label: t("app.ui.iconPicker.categories.aiProviders"),
    },
    { key: "media", label: t("app.ui.iconPicker.categories.media") },
    { key: "special", label: t("app.ui.iconPicker.categories.special") },
  ];

  return (
    <View className={className}>
      {/* Trigger Button */}
      <Pressable
        onPress={(): void => setModalVisible(true)}
        className="h-10 w-10 border border-input rounded-md items-center justify-center bg-background"
      >
        {SelectedIcon ? (
          <SelectedIcon className="h-5 w-5" />
        ) : (
          // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Non-translatable placeholder icon
          <Text className="text-muted-foreground text-xs">?</Text>
        )}
      </Pressable>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={(): void => setModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="p-4 border-b border-border">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold">
                {t("app.ui.iconPicker.title")}
              </Text>
              <Pressable onPress={(): void => setModalVisible(false)}>
                <Text className="text-primary">{t("app.common.cancel")}</Text>
              </Pressable>
            </View>
            <TextInput
              placeholder={t("app.ui.iconPicker.searchPlaceholder")}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
          </View>

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="border-b border-border"
          >
            <View className="flex-row p-2 gap-2">
              {categories.map((cat) => (
                <Pressable
                  key={cat.key}
                  onPress={(): void => setActiveCategory(cat.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-md",
                    activeCategory === cat.key ? "bg-primary" : "bg-muted",
                  )}
                >
                  <Text
                    className={cn(
                      "text-xs",
                      activeCategory === cat.key
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Icon Grid */}
          <FlatList
            data={filteredIcons}
            numColumns={6}
            keyExtractor={(item): string => item}
            renderItem={({ item: iconKey }): JSX.Element => {
              const Icon = getIconComponent(iconKey);
              const isSelected = value === iconKey;

              return (
                <Pressable
                  onPress={(): void => {
                    onChange(iconKey);
                    setModalVisible(false);
                  }}
                  className={cn(
                    "flex-1 aspect-square items-center justify-center m-0.5 rounded-md",
                    isSelected
                      ? "bg-accent border-2 border-primary"
                      : "bg-muted/30",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Pressable>
              );
            }}
            contentContainerClassName="p-2"
          />

          {/* Footer */}
          <View className="p-3 border-t border-border">
            <Text className="text-xs text-muted-foreground text-center">
              {t("app.ui.iconPicker.showing", {
                count: filteredIcons.length,
                total: ICON_CATEGORIES[activeCategory].length,
              })}
            </Text>
            {value && (
              <Text className="text-xs text-primary text-center mt-1 font-mono">
                {value}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

IconPicker.displayName = "IconPicker";
