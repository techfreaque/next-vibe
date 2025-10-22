/**
 * STUB: tags-field
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function TagsField({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: TagsField');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        TagsField (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const TagsFieldContent = TagsField;
export const TagsFieldHeader = TagsField;
export const TagsFieldFooter = TagsField;
export const TagsFieldTitle = TagsField;
export const TagsFieldDescription = TagsField;
export const TagsFieldTrigger = TagsField;
export const TagsFieldItem = TagsField;
export const TagsFieldLabel = TagsField;

export default TagsField;
