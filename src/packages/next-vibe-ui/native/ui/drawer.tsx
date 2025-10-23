/**
 * STUB: drawer
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function Drawer({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: Drawer");

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
        Drawer (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const DrawerContent = Drawer;
export const DrawerHeader = Drawer;
export const DrawerFooter = Drawer;
export const DrawerTitle = Drawer;
export const DrawerDescription = Drawer;
export const DrawerTrigger = Drawer;
export const DrawerItem = Drawer;
export const DrawerLabel = Drawer;

export default Drawer;
