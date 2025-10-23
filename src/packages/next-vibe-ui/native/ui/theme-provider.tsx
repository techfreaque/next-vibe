/**
 * STUB: theme-provider
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function ThemeProvider({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: ThemeProvider");

  return (
    <View
      style={{
        padding: 8,
        backgroundColor: "#FEF3C7",
        marginVertical: 4,
        borderRadius: 4,
      }}
    >
      <Text style={{ fontSize: 12, color: "#92400E", marginBottom: 4 }}>
        ThemeProvider (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const ThemeProviderContent = ThemeProvider;
export const ThemeProviderHeader = ThemeProvider;
export const ThemeProviderFooter = ThemeProvider;
export const ThemeProviderTitle = ThemeProvider;
export const ThemeProviderDescription = ThemeProvider;
export const ThemeProviderTrigger = ThemeProvider;
export const ThemeProviderItem = ThemeProvider;
export const ThemeProviderLabel = ThemeProvider;

export default ThemeProvider;
