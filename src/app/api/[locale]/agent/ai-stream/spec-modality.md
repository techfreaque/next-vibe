# AI Stream - Unified Modality Spec

## Core Principle

Every model supports every input and output format from the user's perspective. When the underlying model cannot natively handle a modality, the pipeline silently bridges the gap. Users never hit a capability wall — they get the best available experience regardless of which model is active.

---

## Model Role System

Every model has a `modelRole` that defines its place in the pipeline:

```typescript
type ModelRole =
  | "llm" // Language model — text in, text (+ optional image/audio) out
  | "tts" // Text-to-speech — text in, audio out
  | "stt" // Speech-to-text — audio in, text out
  | "image-gen" // Pure image generator — text prompt in, image out
  | "video-gen" // Pure video generator — text prompt in, video out
  | "audio-gen" // Music/audio generator — text prompt in, audio out
  | "embedding" // Embedding — text in, vector out
  | "router"; // Intent router — text in, routing decision out
```

`modelRole` replaces the existing `modelType: "text" | "image" | "video" | "audio"`. UI tab filtering is derived from `modelRole` — `image-gen` models appear in the image tab, `audio-gen` in the audio tab, `llm` in the chat tab. Models with `llm` role and `outputs: ["image"]` also appear in the image tab.

Models declare their native capabilities:

```typescript
type Modality = "text" | "audio" | "image" | "video" | "file";

interface ModelCapabilities {
  inputs: Modality[]; // what this model natively accepts
  outputs: Modality[]; // what this model natively produces
}
```

A model that natively handles audio end-to-end (e.g. GPT-4o Realtime) simply has both `"audio"` in `inputs` and `"audio"` in `outputs`. No separate flag needed — the pipeline infers from inputs/outputs whether bridging is required.

---

## Chat Modes

Three modes control how the user interacts with the AI. The model's capabilities determine what happens underneath — the user just picks a mode.

```typescript
type ChatMode =
  | "text" // User types, manually sends. Current default behavior.
  | "voice" // User records manually, sends, AI responds with TTS. Current callMode.
  | "call"; // Continuous audio. Client-side VAD triggers sends. AI always responds with audio.
```

### `text` mode

Current behavior. No audio pipeline. Gap-filling still applies to any file attachments the user sends.

### `voice` mode

Formalization of the existing `callMode`. User manually records, manually sends. AI response is automatically piped through TTS. Gap-filling assembles STT/TTS bridges based on the active model's capabilities.

### `call` mode

Continuous conversation. The client streams audio and uses client-side Voice Activity Detection (VAD) to detect natural speech pauses (~800ms silence after speech). On pause detection, the client sends the audio chunk to the pipeline. The AI always responds with audio.

What happens under the hood depends on the active model:

| Active model capabilities                                                   | Pipeline                                                      |
| --------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `inputs: ["audio"], outputs: ["audio"]` (e.g. GPT-4o Realtime, Gemini Live) | Native: audio in → model → audio out. No STT or TTS inserted. |
| `inputs: ["audio"], outputs: ["text"]`                                      | Audio in → model → TTS bridge → audio out                     |
| `inputs: ["text"], outputs: ["text"]`                                       | STT bridge → model → TTS bridge → audio out                   |

The user doesn't choose the pipeline — they choose the model and the mode. Gaps are filled automatically.

**Interruption**: when the user starts speaking while the AI is playing audio, the client detects voice activity, cancels TTS playback, and aborts the active stream via the existing abort controller. The new audio chunk is sent as a fresh turn. This works identically across all pipeline variants.

**Latency**: native models (~300ms end-to-end), assembled pipeline (~1.8-2.3s). Both are valid — the assembled path is "call-like" not truly realtime, but the interaction model is identical.

`call` mode lives on the thread as the active mode. The cascade for the default mode a new thread starts in: `skill → favorite → user settings → "text"`.

---

## Pure Generators as First-Class Models

Models with `modelRole` of `image-gen`, `video-gen`, or `audio-gen` appear in the model selector alongside LLMs. They are not tools — they are models. The image/music/video tabs are filtered views of the same model list.

Pure generators are stateless (text prompt in, media out). A **translation LLM** bridges conversation history to a refined prompt before the generator runs:

```
conversation history → [translation LLM] → refined prompt → [Flux] → image
```

"Make it darker" works because the translation LLM has the prior generation description in context. The translation LLM's output is not shown — only the generator's result is. The step is recorded in `pipelineSteps` for cost attribution.

The translation LLM resolves via the same cascade as all other bridge models. The message bubble shows the user's original message. The refined prompt is accessible as a variant (see below).

---

## Gap-Filling: The Universal Bridge

When the active model cannot natively handle a modality, the pipeline auto-inserts a bridge model. This applies to both inputs and outputs.

### Bridge Model Cascade

Most specific wins:

```
skill → favorite → user settings → system default
```

| Bridge type                              | Key                   | System default                         |
| ---------------------------------------- | --------------------- | -------------------------------------- |
| STT (audio → text)                       | `sttModelId`          | Whisper-1                              |
| TTS (text → audio)                       | `ttsModelId`          | OpenAI TTS-1                           |
| Vision (image/video → text)              | `visionBridgeModelId` | best vision LLM the user has access to |
| Translation (history → generator prompt) | `translationModelId`  | fast cheap LLM                         |

### Input Gaps

| User sends | Model native input | Bridge                                             |
| ---------- | ------------------ | -------------------------------------------------- |
| Audio      | No audio           | STT → transcript text                              |
| Image      | No image           | Vision model → text description                    |
| Video      | No video           | First frame extraction + vision → text description |
| PDF        | No PDF             | Text extraction → content                          |
| Any        | Native support     | Passed directly, no bridge                         |

### Output Gaps

| Expected output         | Model native output | Bridge                    |
| ----------------------- | ------------------- | ------------------------- |
| Audio (voice/call mode) | No audio            | TTS bridge → audio stream |
| Text                    | Native text         | No bridge                 |

### TTS Streaming Timing

TTS bridges run sentence-by-sentence as the LLM streams. A 50–300 character chunk buffer with natural break detection (`.!?` endings, `,;:\n` breaks at 300+ chars) gates emission. A sequential generation chain keeps at most one TTS API call in-flight at a time, providing one chunk of look-ahead while the client plays the current chunk. Credits deduct per chunk as each call completes.

---

## Message Variants

Every gap-fill translation is stored as an alternate representation on the message. A message can have multiple variants — the original file and one or more translated representations.

```typescript
interface MessageVariant {
  modality: Modality      // what this variant is ("text", "audio", "image")
  content: string         // text content or storage URL
  modelId?: ModelId       // which bridge model produced this
  creditCost?: number
  createdAt: Date
}

// added to MessageMetadata
variants?: MessageVariant[]
```

### How Variants Are Used

When building model context, for each message with attachments:

1. Check if active model natively supports the attachment modality
2. If yes → pass the file directly
3. If no → look for an existing text variant in `variants[]`
4. If no variant exists → run the bridge model now, store result as new variant, pass text

Variants are computed lazily and cached. Once generated, reused for all future model switches — no re-processing.

### Variant Generation Timing on Model Switch

When the user switches models mid-conversation, the context window may contain attachments the new model can't handle. Variant generation runs at the start of the next turn, before the LLM call. If multiple variants need generating (e.g. 5 images when switching from GPT-4o to DeepSeek), they run in parallel. The frontend shows a "Preparing context..." state while this completes. The latency is included in `pipelineSteps` and the credit cost is attributed to the turn.

### Frontend: Toggle Between Variants

Users can toggle between variants on any message. A small button on voice messages shows the transcript. A button on images shows the description. A button on AI responses shows the TTS source text. A button on generated images shows the refined prompt the translation LLM produced. This is a UI affordance on the existing message display.

### Compaction and Variants

When messages are compacted, their `variants[]` are preserved in the compact summary metadata. The text variant is what gets summarized — the file reference (URL) is preserved alongside. Credit costs within variants are historical and not carried forward into the summary.

---

## Proactive Frontend Hints

When the user sends a message containing modalities the active model doesn't natively support, the frontend shows an inline hint before the response arrives:

```
"Transcribing voice message with Whisper..."
"Describing image for DeepSeek..."
```

Hints are derived client-side from the active model's known `inputs` vs the attachment types in the outgoing message. No server roundtrip needed. They disappear once the response streams in and are replaced by the variant toggle button.

---

## Voice + TTS Model Selection

TTS and STT are first-class model entries in `models.ts` — same structure as LLMs. One model entry, multiple provider options underneath. Picking a voice IS picking a model. No separate `ttsModelId` field needed — `voiceId: ModelId` is the only selector.

### TTS Models

Each TTS voice is its own `ModelId` entry with `modelRole: "tts"`. Providers are the delivery mechanism, same as OpenRouter vs direct for LLMs.

```typescript
// Each TTS voice entry has optional voice metadata
interface TtsVoiceMeta {
  gender?: "male" | "female" | "neutral";
  preview?: string; // short audio preview URL
  language?: string; // primary language code
  style?: string; // "conversational", "narration", "news"
}
// Added to ModelDefinition as: voiceMeta?: TtsVoiceMeta
```

Example entries:

| Model ID            | Name      | Provider(s)                        | Pricing       |
| ------------------- | --------- | ---------------------------------- | ------------- |
| `openai-alloy`      | Alloy     | OpenAI TTS, Eden AI TTS (fallback) | per character |
| `openai-nova`       | Nova      | OpenAI TTS, Eden AI TTS (fallback) | per character |
| `openai-onyx`       | Onyx      | OpenAI TTS, Eden AI TTS (fallback) | per character |
| `elevenlabs-rachel` | Rachel    | ElevenLabs                         | per character |
| `elevenlabs-josh`   | Josh      | ElevenLabs                         | per character |
| `google-neural2-a`  | Neural2-A | Google TTS                         | per character |

### STT Models

Same pattern — one model entry per STT model, multiple providers.

| Model ID           | Name      | Provider(s)                        | Pricing    |
| ------------------ | --------- | ---------------------------------- | ---------- |
| `openai-whisper`   | Whisper   | OpenAI STT, Eden AI STT (fallback) | per second |
| `deepgram-nova-2`  | Nova-2    | Deepgram                           | per second |
| `google-speech-v2` | Speech v2 | Google STT                         | per second |

### Cascade

The cascade for voice selection resolves a single `voiceId: ModelId`:

```
skill.voiceId → favorite.voiceId → user settings → system default (openai-alloy)
```

The TTS model and its provider are fully determined by the `ModelId`. No separate `ttsModelId` field exists anywhere. Skills and favorites have one field: `voiceId`.

STT resolves the same way via `sttModelId: ModelId`:

```
skill.sttModelId → favorite.sttModelId → user settings → system default (openai-whisper)
```

---

## Message Modality Provenance

```typescript
// additions to MessageMetadata in chat/db.ts
inputModality?: Modality
outputModality?: Modality
pipelineSteps?: PipelineStep[]
variants?: MessageVariant[]

interface PipelineStep {
  type: "stt" | "tts" | "vision-bridge" | "translation" | "routing"
  modelId: ModelId
  creditCost: number
  durationMs?: number
}
```

---

## Unified Pipeline Pricing

One user-facing credit deduction per turn, expandable:

```
Voice message → DeepSeek + ElevenLabs Rachel    14 credits
  ├── STT (Whisper)                               2 credits
  ├── LLM (DeepSeek)                              9 credits
  └── TTS (ElevenLabs Rachel)                    3 credits
```

Credits deduct per step as each completes. If a step fails mid-pipeline, only completed steps are charged.

---

## Intent-Based Routing

Skills and favorites can enable automatic routing: a lightweight router model classifies intent before the main LLM call and selects the best model from the skill's allowed set.

```typescript
interface RoutingConfig {
  enabled: boolean;
  routerModelId: ModelId;
  routes: {
    intent: string;
    modelId: ModelId;
    confidence: number; // minimum threshold (0-1)
  }[];
  fallbackModelId: ModelId;
}
```

When the router selects a model, gap-filling re-evaluates for the newly selected model. If the router picks an image-gen model, the translation layer kicks in automatically. Routing decision is transparent — shown as a pipeline step in the cost breakdown.

---

## Modality-Aware Compaction

- **Audio messages**: transcript variant used in summary. Audio URL + duration preserved in metadata.
- **Image/video messages**: text description variant included in summary. File URL preserved.
- **Generated media**: prompt + URL preserved. File never re-fetched.

Compact summary carries `containsMediaReferences: boolean` so downstream models know to expect media-referencing context.

---

## Migration: `callMode` → `ChatMode`

The existing `callMode` boolean maps to `ChatMode`:

- `callMode: false` → `"text"`
- `callMode: true` → `"voice"`

`"call"` is a new mode with no existing equivalent. Existing threads and settings migrate by treating `callMode: false` as `"text"` and `callMode: true` as `"voice"`. No data loss.

---

## Config Cascade Summary

All settings follow `skill → favorite → user settings → system default`:

| Setting                 | Key                   | System Default                     |
| ----------------------- | --------------------- | ---------------------------------- |
| TTS voice (= TTS model) | `voiceId: ModelId`    | `openai-alloy`                     |
| STT model               | `sttModelId: ModelId` | `openai-whisper`                   |
| Vision bridge model     | `visionBridgeModelId` | best vision LLM user has access to |
| Translation model       | `translationModelId`  | fast LLM                           |
| Default chat mode       | `defaultChatMode`     | `"text"`                           |
| Routing config          | `routingConfig`       | disabled                           |

---

## Related Files

| File                                              | Change                                                                                                                                                    |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent/models/models.ts`                          | Replace `modelType` with `modelRole`; replace `ModelFeatures` flags with `inputs/outputs` arrays; add `voices[]` to TTS models; add TTS/STT model entries |
| `agent/models/enum.ts`                            | Add `ModelRole` enum; remove `ModelType`; add `TTS`, `STT` to `ModelUtility`                                                                              |
| `agent/chat/db.ts`                                | Add `inputModality`, `outputModality`, `pipelineSteps`, `variants[]` to `MessageMetadata`; add `chatMode` to thread schema                                |
| `agent/chat/favorites/db.ts`                      | Add `voiceId`, `sttModelId`, `visionBridgeModelId`, `translationModelId`, `defaultChatMode`, `routingConfig`; remove `voice` (MALE/FEMALE)                |
| `agent/chat/skills/config.ts`                     | Replace `voice: TtsVoiceValue` with `voiceId: ModelId`; add `sttModelId`, `visionBridgeModelId`, `translationModelId`, `defaultChatMode`                  |
| `repository/stream-setup.ts`                      | Gap-fill resolution: resolve all bridge models via cascade; detect modality mismatches                                                                    |
| `repository/handlers/message-context-builder.ts`  | Variant resolution: check native support → use existing variant or generate lazily                                                                        |
| `repository/handlers/stream-execution-handler.ts` | Pure generator pipeline: translation LLM step before executor; mixed output parts                                                                         |
| `repository/handlers/compacting-handler.ts`       | Modality-aware compaction: preserve media references and variant text                                                                                     |
| `repository/core/provider-factory.ts`             | Route by `modelRole` instead of `apiProvider` type-sniffing                                                                                               |
| `repository/streaming-tts.ts`                     | Drive from active TTS model entry; support named voice IDs                                                                                                |
| `agent/speech-to-text/repository.ts`              | Drive from active STT model entry instead of hardcoded Whisper                                                                                            |
| `agent/text-to-speech/repository.ts`              | Drive from TTS model entry; support named voice IDs                                                                                                       |
| `stream/hooks/voice-mode/`                        | Add client-side VAD for call mode; interruption via existing abort controller                                                                             |
| `stream/widget/`                                  | Frontend hints; variant toggle buttons on messages; call mode UI                                                                                          |
