/**
 * STUB: sidebar
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Sidebar({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Sidebar');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Sidebar (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const SidebarContent = Sidebar;
export const SidebarHeader = Sidebar;
export const SidebarFooter = Sidebar;
export const SidebarTitle = Sidebar;
export const SidebarDescription = Sidebar;
export const SidebarTrigger = Sidebar;
export const SidebarItem = Sidebar;
export const SidebarLabel = Sidebar;

export default Sidebar;
