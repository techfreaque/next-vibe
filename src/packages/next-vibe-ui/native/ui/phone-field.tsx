/**
 * STUB: phone-field
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function PhoneField({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: PhoneField");

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
        PhoneField (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const PhoneFieldContent = PhoneField;
export const PhoneFieldHeader = PhoneField;
export const PhoneFieldFooter = PhoneField;
export const PhoneFieldTitle = PhoneField;
export const PhoneFieldDescription = PhoneField;
export const PhoneFieldTrigger = PhoneField;
export const PhoneFieldItem = PhoneField;
export const PhoneFieldLabel = PhoneField;

export default PhoneField;
