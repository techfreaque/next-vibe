/**
 * STUB: markdown
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Markdown({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Markdown');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Markdown (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const MarkdownContent = Markdown;
export const MarkdownHeader = Markdown;
export const MarkdownFooter = Markdown;
export const MarkdownTitle = Markdown;
export const MarkdownDescription = Markdown;
export const MarkdownTrigger = Markdown;
export const MarkdownItem = Markdown;
export const MarkdownLabel = Markdown;

export default Markdown;
