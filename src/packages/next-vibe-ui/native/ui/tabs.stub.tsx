/**
 * STUB: tabs
 * Temporary stub to avoid @rn-primitives/tabs dependency
 */
import { View, Text, TouchableOpacity } from 'react-native';
import type { ReactNode } from 'react';

export function Tabs({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Tabs');
  return <View {...props}>{children}</View>;
}

export const TabsList = Tabs;
export const TabsTrigger = ({ children, ...props }: any) => (
  <TouchableOpacity {...props}>
    <Text>{children}</Text>
  </TouchableOpacity>
);
export const TabsContent = Tabs;

export default Tabs;
