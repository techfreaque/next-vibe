/**
 * STUB: sheet
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function Sheet({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: Sheet");

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
        Sheet (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const SheetContent = Sheet;
export const SheetHeader = Sheet;
export const SheetFooter = Sheet;
export const SheetTitle = Sheet;
export const SheetDescription = Sheet;
export const SheetTrigger = Sheet;
export const SheetItem = Sheet;
export const SheetLabel = Sheet;

export default Sheet;
