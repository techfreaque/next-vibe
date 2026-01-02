import type { JSX } from "react";
import * as React from "react";
import type { ViewStyle } from "react-native";
import { Animated, StyleSheet, View } from "react-native";

import type { AudioWaveformProps as WebAudioWaveformProps } from "@/packages/next-vibe-ui/web/ui/audio-waveform";
import { applyStyleType } from "@/packages/next-vibe-ui/web/utils/style-type";

// Native adapts to web's props - stream is MediaStream | null from web
export type AudioWaveformProps = WebAudioWaveformProps & {
  /** Color for the waveform bars (native-only prop) */
  color?: string;
};

/**
 * Historical time-series audio waveform visualization for React Native
 * Simulates entire recording history compressed into fixed bars
 * As recording continues, each bar represents a larger time window (compacted history)
 */
export function AudioWaveform({
  stream,
  isPaused = false,
  className,
  nativeStyle,
  barCount = 96,
  height = 32,
  maxBarHeight = 32,
  color = "#ef4444", // destructive/red color
}: AudioWaveformProps & { nativeStyle?: ViewStyle }): JSX.Element {
  const animatedValues = React.useRef(
    Array.from({ length: barCount }, () => new Animated.Value(0)),
  ).current;

  const fullHistoryRef = React.useRef<number[]>([]); // Grows indefinitely
  const isPausedRef = React.useRef(isPaused);

  // Keep isPausedRef in sync with isPaused prop
  React.useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  React.useEffect(() => {
    if (!stream) {
      // Reset when not streaming
      animatedValues.forEach((value) => {
        Animated.timing(value, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
      fullHistoryRef.current = [];
      return;
    }

    // Compress full history into barCount bars
    const compressHistory = (fullHistory: number[]): number[] => {
      if (fullHistory.length === 0) {
        return Array(barCount).fill(0);
      }

      if (fullHistory.length <= barCount) {
        // Not enough samples yet, pad with zeros
        return [...fullHistory, ...Array(barCount - fullHistory.length).fill(0)];
      }

      // Downsample: divide history into barCount chunks and take the max peak in each
      const chunkSize = fullHistory.length / barCount;
      const compressed: number[] = [];

      for (let i = 0; i < barCount; i++) {
        const start = Math.floor(i * chunkSize);
        const end = Math.floor((i + 1) * chunkSize);
        const chunk = fullHistory.slice(start, end);
        // Use the maximum value (peak) in the chunk to preserve amplitude
        const peak = Math.max(...chunk);
        compressed.push(peak);
      }

      return compressed;
    };

    // Simulate time-series waveform with growing history
    const updateInterval = setInterval(() => {
      // Skip when paused
      if (isPausedRef.current) {
        return;
      }

      // Generate new amplitude value (simulated audio level)
      const newAmplitude = 0.3 + Math.random() * 0.7;

      // Add to growing history
      fullHistoryRef.current.push(newAmplitude);

      // Compress entire history to fit barCount bars
      const compressed = compressHistory(fullHistoryRef.current);

      // Animate all bars to their new compressed values
      animatedValues.forEach((value, index) => {
        Animated.timing(value, {
          toValue: compressed[index],
          duration: 100,
          useNativeDriver: false,
        }).start();
      });
    }, 100);

    return (): void => {
      clearInterval(updateInterval);
      animatedValues.forEach((value) => value.stopAnimation());
    };
  }, [stream, animatedValues, barCount]);

  const styleProps = applyStyleType({
    nativeStyle: nativeStyle || styles.container,
    className,
  });

  return (
    <View {...styleProps} style={[styles.container, styleProps.style, { height }]}>
      {animatedValues.map((animatedValue, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              height: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [2, maxBarHeight],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    flex: 1,
  },
  bar: {
    flex: 1,
    minWidth: 2,
    borderRadius: 2, // slightly rounded
    backgroundColor: "#ef4444",
  },
});
