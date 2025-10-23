/**
 * STUB: chart
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function Chart({
  children,
  ...props
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  console.warn("🔶 Using stub: Chart");

  return (
    <View
      style={{
        padding: 8,
        backgroundColor: "#FEF3C7",
        marginVertical: 4,
        borderRadius: 4,
      }}
    >
      <Text style={{ fontSize: 12, color: "#92400E", marginBottom: 4 }}>
        Chart (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const ChartContent = Chart;
export const ChartHeader = Chart;
export const ChartFooter = Chart;
export const ChartTitle = Chart;
export const ChartDescription = Chart;
export const ChartTrigger = Chart;
export const ChartItem = Chart;
export const ChartLabel = Chart;

export default Chart;
