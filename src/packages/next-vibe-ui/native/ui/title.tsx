/**
 * STUB: title
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Title({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Title');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Title (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const TitleContent = Title;
export const TitleHeader = Title;
export const TitleFooter = Title;
export const TitleTitle = Title;
export const TitleDescription = Title;
export const TitleTrigger = Title;
export const TitleItem = Title;
export const TitleLabel = Title;

export default Title;
