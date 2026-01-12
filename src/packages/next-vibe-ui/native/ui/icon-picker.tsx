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

import type { CategoryKey } from "@/app/api/[locale]/system/unified-interface/react/icons";
import {
  Icon,
  ICON_CATEGORIES,
  ICON_CATEGORIES_LIST,
} from "@/app/api/[locale]/system/unified-interface/react/icons";
import { useTranslation } from "@/i18n/core/client";

import type { IconPickerProps } from "../../web/ui/icon-picker";
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

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    const categoryIcons = ICON_CATEGORIES[activeCategory].icons;
    if (!searchQuery) {
      return categoryIcons;
    }

    const query = searchQuery.toLowerCase();
    return categoryIcons.filter((iconKey) =>
      iconKey.toLowerCase().includes(query),
    );
  }, [searchQuery, activeCategory]);

  return (
    <View className={className}>
      {/* Trigger Button */}
      <Pressable
        onPress={(): void => setModalVisible(true)}
        className="h-10 w-10 border border-input rounded-md items-center justify-center bg-background"
      >
        {value ? (
          <Icon icon={value} className="h-5 w-5" />
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
          {/* Header with search */}
          <View className="flex flex-col gap-3 p-4 border-b bg-card">
            <Text className="text-lg font-semibold">
              {t("app.ui.iconPicker.title")}
            </Text>
            <TextInput
              placeholder={t("app.ui.iconPicker.searchPlaceholder")}
              value={searchQuery}
              onChangeText={(text): void => setSearchQuery(text)}
              className="p-2 border border-input rounded-md bg-background"
              returnKeyType="search"
              autoCapitalize="none"
            />
          </View>

          {/* Scrollable content - category tabs + icon grid */}
          <ScrollView className="flex-1">
            {/* Horizontal category tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="border-b bg-muted/30"
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              {ICON_CATEGORIES_LIST.map(([categoryKey, category]) => (
                <Pressable
                  key={categoryKey}
                  onPress={(): void => setActiveCategory(categoryKey)}
                  className="mr-2 mb-1"
                >
                  <Text
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      activeCategory === categoryKey
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {t(category.name)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Icon grid */}
            <FlatList
              data={filteredIcons}
              numColumns={6}
              keyExtractor={(item): string => item}
              renderItem={({ item: iconKey }): JSX.Element => {
                const isSelected = value === iconKey;

                return (
                  <Pressable
                    onPress={(): void => {
                      onChange(iconKey);
                      setModalVisible(false);
                    }}
                    className={cn(
                      "flex-1 aspect-square items-center justify-center m-1 rounded-md",
                      isSelected
                        ? "bg-accent border-2 border-primary"
                        : "bg-muted/30",
                    )}
                  >
                    <Icon icon={iconKey} className="h-5 w-5" />
                  </Pressable>
                );
              }}
              contentContainerStyle={{ padding: 16 }}
              columnWrapperStyle={{ justifyContent: "flex-start" }}
              ListHeaderComponent={
                <Text className="ml-4 mr-4 mb-2 text-xs text-muted-foreground">
                  {t("app.ui.iconPicker.showing", {
                    count: filteredIcons.length,
                    total: ICON_CATEGORIES[activeCategory].icons.length,
                  })}
                </Text>
              }
            />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
