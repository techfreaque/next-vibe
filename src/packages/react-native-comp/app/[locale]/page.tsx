import { useLocalSearchParams } from "expo-router";
import { Text, View } from "next-vibe-ui/ui";
import { useEffect } from "react";

// import { Pressable } from "react-native";

// import { useTranslation } from "@/i18n/core/client";

/**
 * Home Page
 * Works for both Next.js and Expo Router
 * Uses Next.js naming convention: page.tsx
 *
 * Uses platform-agnostic View component with NativeWind
 */
export default function HomePage(): React.ReactElement {
  const { locale } = useLocalSearchParams<{ locale: string }>();
  // const { t } = useTranslation();

  useEffect(() => {
    console.log("HomePage mounted with locale:", locale);
  }, [locale]);

  return (
    <View className="flex-1 justify-center items-center bg-violet-600">
      <Text className="text-4xl font-bold text-white mb-4">
        Welcome to Next Vibe!
      </Text>
      <Text className="text-lg text-gray-200 mb-2">
        React Native + Next.js Architecture
      </Text>
      <Text className="text-sm text-gray-300 mb-8">
        {/* Locale: {locale || "en-GLOBAL"} */}
      </Text>

      <View className="bg-red-500 p-4 rounded-md">
        <Text className="text-yellow-300">Next View Component</Text>
      </View>

      {/* Test NativeWind classes */}
      <View className="bg-green-600 px-6 py-3 rounded-lg mb-4 active:opacity-80">
        <Text className="text-white font-semibold">Test NativeWind</Text>
      </View>

      <View className="bg-yellow-500 p-4 rounded-md">
        <Text className="text-gray-900 font-medium">View 2</Text>
      </View>
      <View className="bg-yellow-500 p-4 rounded-md">
        <Text className="text-gray-900 font-medium">View 3</Text>
      </View>
      <View className="bg-yellow-500 p-4 rounded-md">
        <Text className="text-gray-900 font-medium">View 4</Text>
      </View>
      <View className="bg-yellow-500 p-4 rounded-md">
        <Text className="text-gray-900 font-medium">View 5</Text>
      </View>
      <View className="bg-yellow-500 p-4 rounded-md">
        <Text className="text-gray-900 font-medium">View 6</Text>
      </View>
    </View>
  );
}
