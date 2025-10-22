/**
 * STUB: dropdown-item
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function DropdownItem({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: DropdownItem');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        DropdownItem (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const DropdownItemContent = DropdownItem;
export const DropdownItemHeader = DropdownItem;
export const DropdownItemFooter = DropdownItem;
export const DropdownItemTitle = DropdownItem;
export const DropdownItemDescription = DropdownItem;
export const DropdownItemTrigger = DropdownItem;
export const DropdownItemItem = DropdownItem;
export const DropdownItemLabel = DropdownItem;

export default DropdownItem;
