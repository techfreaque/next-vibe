# AI Stream - Call Mode Spec

## Core Principle

Call mode makes every model feel like a live voice conversation. The user speaks naturally, pauses are detected automatically, and the AI always responds with audio. Whether the active model is GPT-4o Realtime or DeepSeek, the interaction feels the same — the pipeline fills whatever gaps exist silently.

---

## User Experience

```
user speaks → natural pause → AI responds with audio → user speaks again
```

The user can interrupt the AI at any point. Speaking while the AI is playing audio cancels playback and starts a new turn. No buttons to hold, no manual send.

---

## Client-Side Voice Activity Detection (VAD)

The client listens continuously via the WebAudio API. VAD runs in a `ScriptProcessorNode` or `AudioWorklet`, computing RMS amplitude on each audio frame (~20ms).

```
speaking:  RMS > threshold → accumulate audio chunks
silence:   RMS < threshold for 800ms after speech → seal chunk, send
```

Tunable parameters (with sensible defaults):

- `silenceThresholdMs: 800` — how long silence must hold before triggering send
- `speechThresholdRms: 0.01` — amplitude above which input is considered speech
- `minSpeechDurationMs: 300` — ignore sub-300ms utterances (cough, breath)

The client does not stream raw audio continuously to the server. It accumulates audio during speech, then sends the sealed chunk as a single request when VAD triggers — same as the existing manual voice recording flow, just automated.

**Why client-side VAD**: consistent behavior regardless of network conditions. Avoids streaming silence. Reuses the existing audio recording infrastructure. Server-side VAD (used by GPT-4o Realtime and Gemini Live natively) is handled by those models' own APIs when in native mode.

---

## Interruption

When the user starts speaking while the AI is playing TTS audio:

1. VAD detects voice activity (`RMS > threshold`)
2. Client immediately cancels TTS audio playback
3. Client sends abort signal to server (existing `/cancel` endpoint)
4. Existing abort controller tears down the active stream
5. Client accumulates the new audio chunk
6. On VAD pause → sends as a new turn

This works identically whether the pipeline is native (GPT-4o Realtime) or assembled (STT+LLM+TTS). For native models the abort cancels the WebSocket session and starts a new one. For assembled models it uses the existing HTTP stream abort.

---

## Pipeline Variants in Call Mode

The active model's `inputs` and `outputs` determine which pipeline runs. The user sees none of this.

### Native (audio in, audio out)

Models: GPT-4o Realtime, Gemini Live

```
sealed audio chunk → native model WebSocket → audio stream back
```

Transcript captured as side channel, stored as text variant on the message.

### Semi-native (audio in, text out)

Models: any LLM with `inputs: ["audio"]` but `outputs: ["text"]`

```
sealed audio chunk → LLM → text response → TTS bridge → audio stream back
```

No STT step — audio passed directly to the LLM.

### Assembled (text in, text out) — most models today

Models: Claude, DeepSeek, Grok, most OpenRouter models

```
sealed audio chunk → STT bridge → transcript → LLM → text response → TTS bridge → audio stream back
```

Latency breakdown:

- VAD pause detection: 800ms (tunable)
- STT transcription: ~400-600ms
- LLM first token: ~300-800ms
- TTS first chunk: ~200ms
- **Total to first audio**: ~1.8-2.5s after pause

---

## Turn Lifecycle

```
[IDLE]
  client listening, VAD running

[SPEAKING]
  voice activity detected
  accumulating audio

[SENDING]
  VAD triggered (pause detected)
  audio chunk sealed and sent
  frontend hint shown ("Transcribing..." or "Thinking...")

[AI_RESPONDING]
  stream active
  TTS playing chunk by chunk
  client listening for interruption (VAD active, low sensitivity)

[INTERRUPTED]
  voice detected during AI_RESPONDING
  playback cancelled, stream aborted
  → back to SPEAKING with new audio

[IDLE]
  AI finished, TTS drained
  client listening again
```

State is managed in the voice mode store (`stream/hooks/voice-mode/store.ts`), extended with call mode states.

---

## Persistence

Call mode threads persist by default — same as voice mode. Every turn is stored as a message with `inputModality: "audio"` and a text variant (transcript). The user can scroll back and read the full conversation, toggle to see transcripts, or re-play generated audio if the URL is still valid.

---

## Relationship to Voice Mode

`voice` and `call` mode use the same gap-filling pipeline. The only difference is how audio input is triggered:

| Mode    | Input trigger                   | Output                                 |
| ------- | ------------------------------- | -------------------------------------- |
| `voice` | User manually records and sends | TTS auto-plays                         |
| `call`  | VAD auto-sends on pause         | TTS auto-plays, interruption supported |

`call` mode is `voice` mode with VAD + interruption added. The server-side pipeline is identical.

---

## Related Files

| File                                  | Change                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| `stream/hooks/voice-mode/store.ts`    | Add call mode states: IDLE, SPEAKING, SENDING, AI_RESPONDING, INTERRUPTED       |
| `stream/hooks/voice-mode/vad.ts`      | New: VAD implementation via WebAudio API, configurable thresholds               |
| `stream/hooks/use-voice-recording.ts` | Extend to support continuous mode with VAD trigger instead of manual stop       |
| `stream/hooks/audio-queue.ts`         | Interruption: cancel playback on new VAD trigger                                |
| `stream/hooks/send-message.ts`        | Auto-send on VAD trigger in call mode                                           |
| `stream/widget/`                      | Call mode UI: ambient indicator (not a record button), turn state visualization |
| `agent/chat/favorites/db.ts`          | `defaultChatMode` can be set to `"call"`                                        |
| `agent/chat/skills/config.ts`         | `defaultChatMode` on skill — companion skills default to `"call"`               |
