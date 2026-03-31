/**
 * Voice Activity Detector (VAD)
 * Client-side voice activity detection for call mode.
 * Uses WebAudio API to detect speech pauses and trigger sends automatically.
 */

"use client";

export interface VadConfig {
  /** How long silence must hold before triggering send (ms). Default: 800 */
  silenceThresholdMs?: number;
  /** RMS amplitude above which input is considered speech. Default: 0.01 */
  speechThresholdRms?: number;
  /** Ignore utterances shorter than this (ms). Filters coughs, breaths. Default: 300 */
  minSpeechDurationMs?: number;
  /** Called when VAD detects end of speech with accumulated audio */
  onSpeechEnd: (audioBlob: Blob) => void;
  /** Called when speech starts */
  onSpeechStart?: () => void;
}

const DEFAULT_SILENCE_THRESHOLD_MS = 800;
const DEFAULT_SPEECH_THRESHOLD_RMS = 0.01;
const DEFAULT_MIN_SPEECH_DURATION_MS = 300;
// oxlint-disable-next-line no-unused-vars -- documented constant for future use
const FRAME_DURATION_MS = 20; // ~20ms per audio frame at 4096 samples / 192kHz
void FRAME_DURATION_MS;

export class VoiceActivityDetector {
  private config: Required<VadConfig>;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private chunks: Float32Array[] = [];
  private isSpeaking = false;
  private speechStartTime = 0;
  private silenceStartTime = 0;
  private isRunning = false;

  constructor(config: VadConfig) {
    this.config = {
      silenceThresholdMs:
        config.silenceThresholdMs ?? DEFAULT_SILENCE_THRESHOLD_MS,
      speechThresholdRms:
        config.speechThresholdRms ?? DEFAULT_SPEECH_THRESHOLD_RMS,
      minSpeechDurationMs:
        config.minSpeechDurationMs ?? DEFAULT_MIN_SPEECH_DURATION_MS,
      onSpeechEnd: config.onSpeechEnd,
      onSpeechStart: config.onSpeechStart ?? ((): void => undefined),
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaStreamSource(this.stream);

    // ScriptProcessorNode: 4096 samples, 1 input channel, 1 output channel
    // Deprecated but widely supported; AudioWorklet is the modern alternative
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (event): void => {
      const inputData = event.inputBuffer.getChannelData(0);
      const rms = this.computeRms(inputData);
      const now = Date.now();

      if (rms > this.config.speechThresholdRms) {
        if (!this.isSpeaking) {
          this.isSpeaking = true;
          this.speechStartTime = now;
          this.chunks = [];
          this.config.onSpeechStart();
        }
        this.chunks.push(new Float32Array(inputData));
      } else {
        if (this.isSpeaking) {
          if (this.silenceStartTime === 0) {
            this.silenceStartTime = now;
          }
          // Still accumulate audio during silence window
          this.chunks.push(new Float32Array(inputData));

          const silenceDuration = now - this.silenceStartTime;
          if (silenceDuration >= this.config.silenceThresholdMs) {
            const speechDuration = now - this.speechStartTime;
            if (speechDuration >= this.config.minSpeechDurationMs) {
              this.sealAndSend();
            } else {
              // Too short - discard
              this.resetSpeech();
            }
          }
        }
      }

      if (!this.isSpeaking) {
        this.silenceStartTime = 0;
      }
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
    this.isRunning = true;
  }

  stop(): void {
    this.isRunning = false;
    this.processor?.disconnect();
    this.source?.disconnect();
  }

  destroy(): void {
    this.stop();
    this.stream?.getTracks().forEach((t) => t.stop());
    void this.audioContext?.close();
    this.audioContext = null;
    this.stream = null;
    this.processor = null;
    this.source = null;
    this.chunks = [];
    this.resetSpeech();
  }

  private resetSpeech(): void {
    this.isSpeaking = false;
    this.speechStartTime = 0;
    this.silenceStartTime = 0;
    this.chunks = [];
  }

  private sealAndSend(): void {
    const chunks = this.chunks;
    this.resetSpeech();

    if (chunks.length === 0) {
      return;
    }

    // Concatenate all Float32Array chunks
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    // Encode as WAV blob
    const blob = this.encodeWav(
      combined,
      this.audioContext?.sampleRate ?? 44100,
    );
    this.config.onSpeechEnd(blob);
  }

  private computeRms(data: Float32Array): number {
    let sum = 0;
    for (const sample of data) {
      sum += sample * sample;
    }
    return Math.sqrt(sum / data.length);
  }

  /**
   * Encode raw PCM Float32 samples as a WAV blob
   */
  private encodeWav(samples: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // WAV header
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    this.writeString(view, 8, "WAVE");
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    this.writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    // PCM data: convert Float32 [-1, 1] to Int16
    let writeOffset = 44;
    for (const sample of samples) {
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(writeOffset, clamped * 0x7fff, true);
      writeOffset += 2;
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  private writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
}
