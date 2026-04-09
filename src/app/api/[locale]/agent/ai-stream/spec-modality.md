# AI Stream - Unified Modality Spec

## Core Principle

Every model supports every input and output format from the user's perspective. The pipeline silently bridges gaps. Storage and LLM context are fully decoupled - same stored data, different view depending on the active model's capabilities.

---

## Model Capabilities

Every model definition declares native I/O modalities - no separate role field:

```typescript
type Modality = "text" | "audio" | "image" | "video";
inputs: Modality[];   // what this model accepts
outputs: Modality[];  // what this model produces
```

`ModelRole` (`"llm"`, `"image-gen"`, `"image-vision"`, …) is a derived UI classification, not stored. A model's role is determined by which auto-generated enum its ID appears in - rebuilt by `vibe gen` / the price updater from `inputs`/`outputs`.

| Pool enum                   | Criterion                        | Used for                             |
| --------------------------- | -------------------------------- | ------------------------------------ |
| `ChatModelId`               | defined in `ai-stream/models.ts` | chat model selector                  |
| `ImageVisionModelId`        | chat model, `"image"` in inputs  | gap-fill image→text bridge           |
| `VideoVisionModelId`        | chat model, `"video"` in inputs  | gap-fill video→text bridge           |
| `AudioVisionModelId`        | chat model, `"audio"` in inputs  | gap-fill STT fallback                |
| `ImageGenModelId`           | any model, `"image"` in outputs  | `generate_image` tool implementation |
| `VideoGenModelId`           | any model, `"video"` in outputs  | `generate_video` tool implementation |
| `MusicGenModelId`           | any model, `"audio"` in outputs  | `generate_music` tool implementation |
| `TtsModelId` / `SttModelId` | defined in their model files     | voice/call pipeline                  |

A model can appear in multiple pools. Gemini Flash Image (`inputs: ["text","image"], outputs: ["text","image"]`) is in both `ImageVisionModelId` and `ImageGenModelId`.

---

## Chat Modes

```typescript
type ChatMode = "text" | "voice" | "call";
```

| Mode    | Description                                                       |
| ------- | ----------------------------------------------------------------- |
| `text`  | Default. User types, manually sends.                              |
| `voice` | User records manually, sends. AI response auto-piped through TTS. |
| `call`  | Continuous audio with client-side VAD (~800ms silence detection). |

Call mode pipeline by active model:

| Model inputs/outputs                    | Pipeline                          |
| --------------------------------------- | --------------------------------- |
| `inputs: ["audio"], outputs: ["audio"]` | Native end-to-end. No STT or TTS. |
| `inputs: ["audio"], outputs: ["text"]`  | Audio in → model → TTS bridge     |
| `inputs: ["text"], outputs: ["text"]`   | STT bridge → model → TTS bridge   |

Cascade: `skill → favorite → user settings → "text"`.

---

## All Modality Operations Are Tools

Every media operation - generation and bridging - is a tool call with a `definition.ts` and `widget.tsx` owning its rendering lifecycle.

| Tool                | input → output | Tool ID            | Pinned | Triggered by                         |
| ------------------- | -------------- | ------------------ | ------ | ------------------------------------ |
| Image generation    | text → image   | `generate_image`   | yes\*  | LLM                                  |
| Video generation    | text → video   | `generate_video`   | yes\*  | LLM                                  |
| Music generation    | text → audio   | `generate_music`   | yes\*  | LLM                                  |
| Image description   | image → text   | `describe_image`   | no     | System (gap-fill) or LLM (on demand) |
| Video description   | video → text   | `describe_video`   | no     | System (gap-fill) or LLM (on demand) |
| Audio transcription | audio → text   | `transcribe_audio` | no     | System (gap-fill) or LLM (on demand) |

\*Pinned only when the active chat model is not also the gen model. Bridge tools are discoverable via `tool-help` `execute-tool` but not injected per-request.

> `video_gen` / `audio_gen` are internal synthetic names used by `GapFillExecutor` when injecting prior media tool results as native LLM file parts. The registered aliases are `generate_video` / `generate_music`.

TTS remains a call-mode side-effect, not a tool.

### Tool Filtering

When the chat model and gen model are the same (e.g. Gemini Flash Image), the corresponding gen tool is removed from the tool list - routing through the tool would be a detour.

### Tool Schema

```typescript
// generate_image / generate_video / generate_music
interface MediaGenArgs {
  prompt: string;
  inputRef?: StorageRef; // img2img, style transfer
  size?: string;
  quality?: string;
  duration?: string;
}
interface MediaGenResult {
  file: StorageRef;
  text: string; // refined prompt or lazy bridge description
  mediaType: "image" | "video" | "audio";
  creditCost: number;
}

// describe_image / describe_video / transcribe_audio
interface BridgeToolArgs {
  file: StorageRef;
  context?: string;
}
interface BridgeToolResult {
  text: string;
  model: ModelId;
  creditCost: number;
}
```

### Synthetic Tool Calls

The system emits tool calls on its own behalf for gap-fill and native file part handling:

- Marked `isAI: true`; role `ChatMessageRole.TOOL`; `toolCall` in `metadata.toolCall`
- Appears after the user message, before the assistant response
- Rendered via the tool's `widget.tsx` - same as LLM-initiated calls
- Gap-fill emits `GAP_FILL_STARTED` / `GAP_FILL_COMPLETED` SSE. Completed event appends a `MessageVariant` to `metadata.variants[]` on the source message.

### LLM Context: What the Model Sees

- Native multi-modal LLM (emitted image) → sees the image inline next turn
- LLM that called `generate_image` → sees tool result with `file` URL + `text` description
- Non-native model receiving another model's image → gets `text` description only

Same stored message, different view.

---

## Gap-Filling

When a modality mismatch exists, the pipeline bridges it. Native passthrough is always preferred.

For each message in context: if the model natively supports the modality → pass file directly. Otherwise → use `text` variant from `variants[]`; generate lazily via synthetic tool call if missing.

### Cascade Priority

Bridge and gen models use **opposite** cascade priority:

```
Bridge (STT/TTS/vision):  user settings → favorite → skill → system default
Gen (image/video/music):  skill → favorite → user settings → system default
```

| Bridge                | DB field (settings/favorites) | Default            |
| --------------------- | ----------------------------- | ------------------ |
| STT                   | `sttModelSelection`           | OpenAI Whisper     |
| TTS                   | `voiceModelSelection`         | OpenAI Nova        |
| Vision (image → text) | `imageVisionModelSelection`   | best available LLM |
| Vision (video → text) | `videoVisionModelSelection`   | best available LLM |
| Vision (audio → text) | `audioVisionModelSelection`   | best available LLM |

### Input Gaps

| User sends          | Bridge tool        | Pool                                        |
| ------------------- | ------------------ | ------------------------------------------- |
| Audio (speech)      | `transcribe_audio` | STT pool first, AudioVision LLM as fallback |
| Audio (music/other) | `transcribe_audio` | AudioVision pool                            |
| Image               | `describe_image`   | ImageVision pool                            |
| Video               | `describe_video`   | VideoVision pool                            |
| PDF                 | Text extraction    | -                                           |

### Output Gaps

voice/call mode with a text-only model → TTS bridge.

### TTS Streaming

Sentence-by-sentence as LLM streams. 50–300 char buffer with natural break detection. One call in-flight at a time, one chunk look-ahead. Credits deduct per chunk.

### Tool Result Gap-Fill

When passing prior media tool results to the LLM in subsequent turns:

| Model supports modality? | `text` populated? | Action                                       |
| ------------------------ | ----------------- | -------------------------------------------- |
| Yes                      | -                 | Pass `file` URL directly                     |
| No                       | Yes               | Pass `{ text }` only                         |
| No                       | No                | Gap-fill → populate `text` → pass `{ text }` |

### Model Switch: Parallel Gap Fill

On model switch, walk back to last compaction boundary, collect all messages needing gap fill for the new model, run all in parallel, show "Preparing context…" until complete, then proceed. Cost attributed to the current turn.

---

## Message Variants

```typescript
interface MessageVariant {
  modality: Modality;
  content: string;   // text or storage URL
  modelId: ChatModelId | SttModelId | TtsModelId | ImageVisionModelId | VideoVisionModelId | AudioVisionModelId;
  creditCost?: number;
  createdAt: string; // ISO timestamp
}
// on MessageMetadata:
variants?: MessageVariant[];
gapFillStatus?: { bridgeType: BridgeType; modality: Modality } | null;
```

| Message type          | file | text                                                 |
| --------------------- | ---- | ---------------------------------------------------- |
| User voice            | yes  | STT transcript (at send time)                        |
| User image attachment | yes  | vision description (lazy)                            |
| AI media tool result  | yes  | refined prompt (at gen) or bridge description (lazy) |
| AI text response      | -    | the text itself                                      |
| AI TTS audio          | yes  | LLM source text                                      |

### Attachment Rendering

User attachments are message content, not tool calls. Each media type has its own endpoint + `widget.tsx`:

- **Image** - preview, lightbox, gap-fill status, description toggle
- **Video** - player, gap-fill status, transcript toggle
- **Audio** - player, transcription status, transcript toggle
- **File** - icon, download, text extraction status

---

## Compaction

Same context builder as normal turns - same native passthrough / gap fill logic. Extra instruction: _"Preserve all file reference URLs exactly as-is."_ Missing `text` variant → gap fill forced before compaction call. `containsMediaReferences: boolean` on compact summary metadata.

---

## Unified Pricing

```
Voice → DeepSeek + ElevenLabs Rachel       14 credits
  ├── STT (Whisper)                          2 credits
  ├── LLM (DeepSeek)                         9 credits
  └── TTS (ElevenLabs Rachel)                3 credits

Image gen → GPT-4o + generate_image        22 credits
  ├── LLM (GPT-4o)                          12 credits
  └── generate_image (gpt-5-image-mini)     10 credits
```

Credits deduct per step as completed. Failed steps not charged. Pipeline steps stored in `metadata.pipelineSteps[]`.

---

## Design Decisions

1. **img2img**: `inputRef` is a response field on `MediaGenResult` - the LLM sees it in tool result context and can pass it back in a follow-up `generate_image` call. UI offers an "Edit" shortcut (pre-fills prompt + inputRef). Same pipeline either way.
2. **Streaming media**: No partial previews. Spinner during generation, full result on complete.
3. **Direct triggers**: Image/video/music tab = direct tool call, no LLM wrapper. Chat tab = LLM calls tool. Same tool, same schema.
4. **Video gen latency**: Async job. Result starts as `{ status: "pending", jobId }`. `TOOL_RESULT_UPDATED` SSE when complete.
5. **Gap fill cost**: Lazy - runs at start of next send, attributed to that turn as a `gap-fill` pipeline step.
6. **Multi-modal output ordering**: LLM emits text before file → media attached to text message. File-only → standalone tool message.
