import "./global.css";

import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * Root layout with NativeWind global styles and SafeAreaProvider
 */
export default function RootLayout(): React.ReactElement {
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
