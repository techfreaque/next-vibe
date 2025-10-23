/**
 * STUB: pagination
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function Pagination({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: Pagination");

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
        Pagination (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const PaginationContent = Pagination;
export const PaginationHeader = Pagination;
export const PaginationFooter = Pagination;
export const PaginationTitle = Pagination;
export const PaginationDescription = Pagination;
export const PaginationTrigger = Pagination;
export const PaginationItem = Pagination;
export const PaginationLabel = Pagination;

export default Pagination;
