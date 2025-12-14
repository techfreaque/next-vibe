"use client";

import { cn } from "next-vibe/shared/utils/utils";
import type { JSX } from "react";
import * as React from "react";

import type { StyleType } from "../utils/style-type";

export type AudioWaveformProps = {
  /** MediaStream from getUserMedia or null when not recording */
  stream: MediaStream | null;
  /** Number of bars to display (time points) */
  barCount?: number;
  /** Height of the waveform container in pixels */
  height?: number;
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
  className,
  barCount = 96,
  height = 32,
  maxBarHeight = 32,
}: AudioWaveformProps): JSX.Element {
  const [audioLevels, setAudioLevels] = React.useState<number[]>(
    Array(barCount).fill(0),
  );
  const animationFrameRef = React.useRef<number | undefined>(undefined);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const fullHistoryRef = React.useRef<number[]>([]); // Grows indefinitely

  React.useEffect(() => {
    if (!stream) {
      // Reset when not streaming
      const resetLevels = Array(barCount).fill(0);
      setAudioLevels(resetLevels);
      fullHistoryRef.current = [];
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
      let sampleCounter = 0;
      const samplesPerCapture = 4; // Capture amplitude every N frames

      // Compress full history into barCount bars
      const compressHistory = (fullHistory: number[]): number[] => {
        if (fullHistory.length === 0) {
          return Array(barCount).fill(0);
        }

        if (fullHistory.length <= barCount) {
          // Not enough samples yet, pad with zeros
          return [
            ...fullHistory,
            ...Array(barCount - fullHistory.length).fill(0),
          ];
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

      // Animation loop to capture and compress waveform
      const updateWaveform = (): void => {
        if (!analyserRef.current) {
          return;
        }

        // Get time-domain data (amplitude over time)
        analyserRef.current.getByteTimeDomainData(dataArray);

        sampleCounter++;

        // Capture new amplitude sample every N frames
        if (sampleCounter >= samplesPerCapture) {
          sampleCounter = 0;

          // Calculate RMS amplitude for this time slice
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / dataArray.length);
          const amplitude = Math.min(1, rms * 3);

          // Add to growing history
          fullHistoryRef.current.push(amplitude);

          // Compress entire history to fit barCount bars
          const compressed = compressHistory(fullHistoryRef.current);
          setAudioLevels(compressed);
        }

        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };

      updateWaveform();
    } catch {
      // Fallback: simple animated pattern when Web Audio API fails
      const fallbackInterval = setInterval(() => {
        const newAmplitude = 0.3 + Math.random() * 0.4;
        fullHistoryRef.current.push(newAmplitude);

        // Compress history
        const fullHistory = fullHistoryRef.current;
        if (fullHistory.length <= barCount) {
          setAudioLevels([
            ...fullHistory,
            ...Array(barCount - fullHistory.length).fill(0),
          ]);
        } else {
          const chunkSize = fullHistory.length / barCount;
          const compressed: number[] = [];
          for (let i = 0; i < barCount; i++) {
            const start = Math.floor(i * chunkSize);
            const end = Math.floor((i + 1) * chunkSize);
            const chunk = fullHistory.slice(start, end);
            // Use max peak to preserve amplitude
            const peak = Math.max(...chunk);
            compressed.push(peak);
          }
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
      className={cn("flex items-center gap-px flex-1", className)}
      style={{ height: `${height}px` }}
    >
      {audioLevels.map((level, i) => (
        <div
          key={i}
          className="bg-destructive transition-all duration-100 rounded-sm flex-1"
          style={{
            height: `${Math.max(2, level * maxBarHeight)}px`,
            minWidth: "2px",
          }}
        />
      ))}
    </div>
  );
}
