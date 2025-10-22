/**
 * STUB: scroll-area
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function ScrollArea({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: ScrollArea');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        ScrollArea (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const ScrollAreaContent = ScrollArea;
export const ScrollAreaHeader = ScrollArea;
export const ScrollAreaFooter = ScrollArea;
export const ScrollAreaTitle = ScrollArea;
export const ScrollAreaDescription = ScrollArea;
export const ScrollAreaTrigger = ScrollArea;
export const ScrollAreaItem = ScrollArea;
export const ScrollAreaLabel = ScrollArea;

export default ScrollArea;
