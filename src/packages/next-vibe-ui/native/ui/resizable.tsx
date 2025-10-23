/**
 * STUB: resizable
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function Resizable({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: Resizable");

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
        Resizable (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const ResizableContent = Resizable;
export const ResizableHeader = Resizable;
export const ResizableFooter = Resizable;
export const ResizableTitle = Resizable;
export const ResizableDescription = Resizable;
export const ResizableTrigger = Resizable;
export const ResizableItem = Resizable;
export const ResizableLabel = Resizable;

export default Resizable;
