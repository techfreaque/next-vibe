"use client";

import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

export type AudioWaveformProps = {
  /** MediaStream from getUserMedia or null when not recording */
  stream: MediaStream | null;
  /** Whether the recording is paused (stops animation while preserving history) */
  isPaused?: boolean;
  /** Number of bars to display (time points) */
  barCount?: number;

  /** Maximum height for each bar in pixels */
  maxBarHeight?: number;
} & StyleType;

/**
 * Historical time-series audio waveform visualization using Web Audio API
 * Displays entire recording history compressed into fixed bars
 * As recording continues, each bar represents a larger time window (compacted history)
 */
export function AudioWaveform({
  stream,
  isPaused = false,
  className,
  barCount = 200,
  maxBarHeight = 32,
}: AudioWaveformProps): JSX.Element {
  const [audioLevels, setAudioLevels] = React.useState<number[]>(
    Array(barCount).fill(0),
  );
  const [maxAmplitude, setMaxAmplitude] = React.useState<number>(0);
  const animationFrameRef = React.useRef<number | undefined>(undefined);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const allSamplesRef = React.useRef<number[]>([]); // All amplitude samples ever captured
  const maxAmplitudeRef = React.useRef<number>(0); // Track max for smoothing
  const isPausedRef = React.useRef(isPaused);

  // Keep isPausedRef in sync with isPaused prop
  React.useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  React.useEffect(() => {
    if (!stream) {
      // Reset when not streaming
      const resetLevels = Array(barCount).fill(0);
      setAudioLevels(resetLevels);
      setMaxAmplitude(0);
      maxAmplitudeRef.current = 0;
      allSamplesRef.current = [];
      return;
    }

    try {
      // Create audio context and analyser
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      // Configure for time-domain analysis
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;

      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.fftSize);

      let frameCounter = 0;
      const updateInterval = 2; // Update display every N frames for performance

      // Compress entire sample history into barCount bars
      const compressToBarCount = (samples: number[]): number[] => {
        if (samples.length === 0) {
          return Array(barCount).fill(0);
        }

        if (samples.length <= barCount) {
          // Pad on the left so bars grow from right
          return [...Array(barCount - samples.length).fill(0), ...samples];
        }

        // Divide entire history into barCount equal chunks
        const chunkSize = samples.length / barCount;
        const compressed: number[] = [];

        for (let i = 0; i < barCount; i++) {
          const start = Math.floor(i * chunkSize);
          const end = Math.floor((i + 1) * chunkSize);
          const chunk = samples.slice(start, end);
          // Take max peak in each chunk (lossless for peaks)
          const peak = Math.max(...chunk, 0);
          compressed.push(peak);
        }

        return compressed;
      };

      // Animation loop to capture waveform
      const updateWaveform = (): void => {
        if (!analyserRef.current) {
          return;
        }

        // Skip capturing data when paused
        if (isPausedRef.current) {
          animationFrameRef.current = requestAnimationFrame(updateWaveform);
          return;
        }

        // Get time-domain data (amplitude over time)
        analyserRef.current.getByteTimeDomainData(dataArray);

        // Calculate RMS amplitude for this frame
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const amplitude = Math.min(1, rms * 3);

        // Add to all samples history
        allSamplesRef.current.push(amplitude);

        // Update display every N frames for better performance
        frameCounter++;
        if (frameCounter >= updateInterval) {
          frameCounter = 0;

          // Compress entire history into bars
          const compressed = compressToBarCount(allSamplesRef.current);

          // Calculate max amplitude for scaling with smoothing
          const currentMax = Math.max(...allSamplesRef.current, 0.01);
          // Minimum scale threshold to avoid noise dominating when quiet
          const minScale = 0.15;
          const effectiveMax = Math.max(currentMax, minScale);

          // Only increase max immediately, but decay slowly when it decreases
          if (effectiveMax > maxAmplitudeRef.current) {
            maxAmplitudeRef.current = effectiveMax;
          } else {
            // Slow decay towards current max
            maxAmplitudeRef.current =
              maxAmplitudeRef.current * 0.98 + effectiveMax * 0.02;
          }

          setMaxAmplitude(maxAmplitudeRef.current);
          setAudioLevels(compressed);
        }

        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };

      updateWaveform();
    } catch {
      // Fallback: simple animated pattern when Web Audio API fails
      const fallbackInterval = setInterval(() => {
        // Skip when paused
        if (isPausedRef.current) {
          return;
        }

        const newAmplitude = 0.3 + Math.random() * 0.4;
        allSamplesRef.current.push(newAmplitude);

        // Update every 50ms for performance
        if (allSamplesRef.current.length % 2 === 0) {
          // Compress entire history into bars
          const samples = allSamplesRef.current;
          let compressed: number[];

          if (samples.length <= barCount) {
            // Pad on the left so bars grow from right
            compressed = [
              ...Array(barCount - samples.length).fill(0),
              ...samples,
            ];
          } else {
            // Divide entire history into barCount equal chunks
            const chunkSize = samples.length / barCount;
            compressed = [];

            for (let i = 0; i < barCount; i++) {
              const start = Math.floor(i * chunkSize);
              const end = Math.floor((i + 1) * chunkSize);
              const chunk = samples.slice(start, end);
              const peak = Math.max(...chunk, 0);
              compressed.push(peak);
            }
          }

          // Calculate max amplitude with smoothing
          const currentMax = Math.max(...samples, 0.01);
          // Minimum scale threshold to avoid noise dominating when quiet
          const minScale = 0.15;
          const effectiveMax = Math.max(currentMax, minScale);

          if (effectiveMax > maxAmplitudeRef.current) {
            maxAmplitudeRef.current = effectiveMax;
          } else {
            maxAmplitudeRef.current =
              maxAmplitudeRef.current * 0.98 + effectiveMax * 0.02;
          }

          setMaxAmplitude(maxAmplitudeRef.current);
          setAudioLevels(compressed);
        }
      }, 50);

      return (): void => {
        clearInterval(fallbackInterval);
      };
    }

    return (): void => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current?.state !== "closed") {
        void audioContextRef.current?.close();
      }
    };
  }, [stream, barCount]);

  return (
    <div
      className={cn("flex items-center", className)}
      style={{ height: `${maxBarHeight}px` }}
    >
      {audioLevels.map((level, i) => {
        // Normalize all bars by the maximum amplitude in the recording
        // This ensures consistent scaling regardless of when bars were recorded
        const normalizedLevel = maxAmplitude > 0 ? level / maxAmplitude : 0;

        // Only show bar if there's actual amplitude (skip zeros from padding)
        if (level === 0) {
          return (
            <div
              key={i}
              className="flex-1"
              style={{
                height: `${maxBarHeight}px`,
                minWidth: "1px",
              }}
            />
          );
        }

        // Calculate height as percentage - minimum 3% for visibility
        const heightPercent = Math.max(3, normalizedLevel * 100);

        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center justify-center"
            style={{
              height: `${maxBarHeight}px`,
              minWidth: "1px",
            }}
          >
            {/* Top half (mirrored) */}
            <div
              className="bg-destructive w-full rounded-sm"
              style={{
                height: `${heightPercent / 2}%`,
                transition: "height 0.1s ease-out",
              }}
            />
            {/* Bottom half */}
            <div
              className="bg-destructive w-full rounded-sm"
              style={{
                height: `${heightPercent / 2}%`,
                transition: "height 0.1s ease-out",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
