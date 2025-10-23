/**
 * STUB: autocomplete-field
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function AutocompleteField({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: AutocompleteField");

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
        AutocompleteField (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const AutocompleteFieldContent = AutocompleteField;
export const AutocompleteFieldHeader = AutocompleteField;
export const AutocompleteFieldFooter = AutocompleteField;
export const AutocompleteFieldTitle = AutocompleteField;
export const AutocompleteFieldDescription = AutocompleteField;
export const AutocompleteFieldTrigger = AutocompleteField;
export const AutocompleteFieldItem = AutocompleteField;
export const AutocompleteFieldLabel = AutocompleteField;

export default AutocompleteField;
