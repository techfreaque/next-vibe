/**
 * STUB: use-mobile
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function UseMobile({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: UseMobile");

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
        UseMobile (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const UseMobileContent = UseMobile;
export const UseMobileHeader = UseMobile;
export const UseMobileFooter = UseMobile;
export const UseMobileTitle = UseMobile;
export const UseMobileDescription = UseMobile;
export const UseMobileTrigger = UseMobile;
export const UseMobileItem = UseMobile;
export const UseMobileLabel = UseMobile;

export default UseMobile;
