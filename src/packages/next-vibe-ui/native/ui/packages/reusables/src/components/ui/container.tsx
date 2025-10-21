/**
 * STUB: container
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Container({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Container');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Container (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const ContainerContent = Container;
export const ContainerHeader = Container;
export const ContainerFooter = Container;
export const ContainerTitle = Container;
export const ContainerDescription = Container;
export const ContainerTrigger = Container;
export const ContainerItem = Container;
export const ContainerLabel = Container;

export default Container;
