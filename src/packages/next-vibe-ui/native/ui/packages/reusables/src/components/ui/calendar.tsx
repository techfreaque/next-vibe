/**
 * STUB: calendar
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Calendar({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Calendar');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Calendar (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const CalendarContent = Calendar;
export const CalendarHeader = Calendar;
export const CalendarFooter = Calendar;
export const CalendarTitle = Calendar;
export const CalendarDescription = Calendar;
export const CalendarTrigger = Calendar;
export const CalendarItem = Calendar;
export const CalendarLabel = Calendar;

export default Calendar;
