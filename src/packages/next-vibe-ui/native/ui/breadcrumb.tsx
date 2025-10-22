/**
 * STUB: breadcrumb
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Breadcrumb({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Breadcrumb');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Breadcrumb (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const BreadcrumbContent = Breadcrumb;
export const BreadcrumbHeader = Breadcrumb;
export const BreadcrumbFooter = Breadcrumb;
export const BreadcrumbTitle = Breadcrumb;
export const BreadcrumbDescription = Breadcrumb;
export const BreadcrumbTrigger = Breadcrumb;
export const BreadcrumbItem = Breadcrumb;
export const BreadcrumbLabel = Breadcrumb;

export default Breadcrumb;
