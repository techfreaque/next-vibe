import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function HomePage(): React.ReactElement {
  useEffect(() => {
    console.log("HomePage mounted");
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-blue-500">
      <Text className="text-4xl font-bold text-white mb-4">
        Welcome to Next Vibe!
      </Text>
      <Text className="text-lg text-gray-200 mb-8">
        React Native + NativeWind v5 + Tailwind v4
      </Text>

      {/* Inline style test for comparison */}
      <View style={{ backgroundColor: "red", padding: 10, marginBottom: 10 }}>
        <Text style={{ color: "white" }}>
          Inline Style Test (should be red)
        </Text>
      </View>

      <Pressable className="bg-green-600 px-6 py-3 rounded-lg active:opacity-80">
        <Text className="text-white font-semibold">Test NativeWind</Text>
      </Pressable>
    </View>
  );
}
