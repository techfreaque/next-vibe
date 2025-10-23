/**
 * STUB: toaster
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function Toaster({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: Toaster");

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
        Toaster (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const ToasterContent = Toaster;
export const ToasterHeader = Toaster;
export const ToasterFooter = Toaster;
export const ToasterTitle = Toaster;
export const ToasterDescription = Toaster;
export const ToasterTrigger = Toaster;
export const ToasterItem = Toaster;
export const ToasterLabel = Toaster;

export default Toaster;
