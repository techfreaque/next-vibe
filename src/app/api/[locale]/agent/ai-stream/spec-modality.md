# AI Stream - Unified Modality Spec

## Core Principle

Every model supports every input and output format from the user's perspective. The pipeline silently bridges gaps. Storage and LLM context are fully decoupled - same stored data, different view depending on the active model's capabilities.

---

## Model Role System

```typescript
type ModelRole =
  | "llm" // Language model - may natively handle image/audio I/O
  | "tts" // Text-to-speech
  | "stt" // Speech-to-text
  | "image-gen" // Pure image generator - only callable as a tool, never a primary model
  | "video-gen" // Pure video generator - only callable as a tool
  | "audio-gen" // Music/audio generator - only callable as a tool
  | "embedding"
  | "router";
```

Models declare native capabilities:

```typescript
type Modality = "text" | "audio" | "image" | "video";

interface ModelCapabilities {
  inputs: Modality[];
  outputs: Modality[];
}
```

**Pure generators** (`image-gen`, `video-gen`, `audio-gen`) never appear in the chat model selector. They are tools that LLMs call. Users select them via dedicated per-media-type selectors (image, music, video) - separate from the chat LLM selector.

A multi-modal LLM like Gemini Flash Image (`inputs: ["text","image"], outputs: ["text","image"]`) appears in the **chat** model selector and handles images natively - it never gets offered the `image_gen` tool because it doesn't need it.

---

## Chat Modes

```typescript
type ChatMode = "text" | "voice" | "call";
```

- **text** - default. User types, manually sends.
- **voice** - user records manually, sends. AI response auto-piped through TTS.
- **call** - continuous audio with client-side VAD (~800ms silence detection). AI always responds with audio.

Call mode pipeline depends on active model:

| Model capabilities                      | Pipeline                          |
| --------------------------------------- | --------------------------------- |
| `inputs: ["audio"], outputs: ["audio"]` | Native end-to-end. No STT or TTS. |
| `inputs: ["audio"], outputs: ["text"]`  | Audio in → model → TTS bridge     |
| `inputs: ["text"], outputs: ["text"]`   | STT bridge → model → TTS bridge   |

Interruption: client VAD detects speech, cancels TTS playback, aborts stream, sends new turn.

Cascade: `skill → favorite → user settings → "text"`.

---

## Media as Tool Calls

All media generation goes through tool calls. The LLM reasons, then calls a tool. This applies whether the underlying model is a pure generator or a native multi-modal LLM.

```
user: "a cat on a throne"
LLM:  "Let me generate that." → calls image_gen({ prompt: "..." })
tool: [gpt-5-image-mini or native] → result: { file: StorageRef, text: "A regal cat..." }
LLM:  [endLoop]
```

### Tool Schema

```typescript
// Shared pattern - image_gen / video_gen / audio_gen
interface MediaToolArgs {
  prompt: string;
  inputRef?: StorageRef; // for edit/transform (img2img, style transfer)
  size?: string;
  quality?: string;
  duration?: string;
}

interface MediaToolResult {
  file: StorageRef;
  text: string; // refined prompt or lazily-generated bridge description — always populated in AI context
  mediaType: "image" | "video" | "audio";
  creditCost: number;
}
```

### Model Selectors

The UI exposes separate selectors per media type:

| Selector    | Cascade                                                             | System default     |
| ----------- | ------------------------------------------------------------------- | ------------------ |
| Chat LLM    | `skill → favorite → user settings → system default`                 | best available LLM |
| Image model | `skill.imageGenModelId → favorite → user settings → system default` | gpt-5-image-mini   |
| Music model | `skill.musicGenModelId → favorite → user settings → system default` | (tbd)              |
| Video model | `skill.videoGenModelId → favorite → user settings → system default` | (tbd)              |

The image/music/video selectors set which pure generator tool implementation runs. For multi-modal LLMs (e.g. Gemini Flash Image) the image selector is irrelevant - the LLM uses its native capability instead.

### System Prompt: Media Capabilities

Each LLM gets a system prompt section describing what it can do:

```
// native multi-modal LLM:
"You can natively generate and read images. Do not call image_gen."

// text-only LLM:
"Use the image_gen tool for images. Active generator: gpt-5-image-mini."
```

For non-native models, the tools are offered and described. The model calls them.

### Message Structure Per Turn

A turn where the LLM reasons and generates an image produces **two messages**:

1. **Assistant text message** - the LLM's reasoning ("Let me generate that...")
2. **Synthetic tool message** - the image result (tool call + tool result pair)

These are separate DB messages, same turn. The reasoning message is created first via the existing text streaming path. The tool/file message is created when the file part arrives or the tool result completes.

### Native File Parts → Synthetic Tool Messages

When a native multi-modal LLM emits a raw file part (not an explicit tool call), `FilePartHandler` synthesizes a tool call/result pair:

```
file part received
  → create synthetic tool_call: image_gen({ prompt: "<from context>" })
  → create synthetic tool_result: { file: <stored>, text: null, mediaType: "image" }
  → text variant filled by gap fill if null
```

Stored and rendered identically to explicit tool calls. For subsequent turns, the LLM receives the `tool_result` containing the file URL - it can pass this as `inputRef` to edit the image (img2img).

### LLM Context: What the Model Sees

The model always sees its own prior outputs in the form it produced them:

- Native multi-modal LLM that emitted an image → sees the image inline next turn
- LLM that called `image_gen` → sees the tool result with `file` URL and `text` description

For non-native models receiving another model's image output: they get the `text` description from the tool result. Same stored message, different view.

### Tool Result Gap-Fill (Assistant Media)

When passing media tool results (`image_gen` / `video_gen` / `audio_gen`) back to the LLM in subsequent turns, the pipeline applies the same modality-awareness as user input gap-fill:

**Case 1 — model supports the media modality** (`model.inputs` includes `"image"` / `"video"` / `"audio"`):
→ Pass the `file` URL directly in the tool result. Model renders/processes it natively.

**Case 2 — model does not support the modality AND `text` is populated**:
→ Pass only `{ text }`. Model reads the description instead of the file.

**Case 3 — model does not support the modality AND `text` is null/missing**:
→ Gap-fill: call the vision bridge (for images) or translation bridge (for audio/video) to generate a text description, populate `text`, cache to DB.
→ Then pass `{ text }` as in Case 2.

`text` is always populated after gap-fill. It is never null in AI context.

This means `text` in `MediaToolResult` is populated from one of:

- The refined prompt used for generation (always set by `FilePartHandler`)
- A vision-bridge description generated lazily on first model-switch that can't see the file

The stored `file` URL is always preserved in DB for frontend display and for future model-switches to a vision-capable model.

---

## Gap-Filling

When a modality mismatch exists, the pipeline bridges it. **Native passthrough is always preferred.**

For each message in context:

1. Model natively supports this modality → pass file directly
2. No → use `text` variant from `variants[]`; generate lazily if missing

### Bridge Model Cascade

```
skill → favorite → user settings → system default
```

| Bridge                | Key                   | Default            |
| --------------------- | --------------------- | ------------------ |
| STT                   | `sttModelId`          | Whisper-1          |
| TTS                   | `ttsModelId`          | OpenAI TTS-1       |
| Vision (image → text) | `visionBridgeModelId` | best available LLM |
| Translation (prompt)  | `translationModelId`  | fast cheap LLM     |

### Input Gaps

| User sends | Model native input | Bridge                                  |
| ---------- | ------------------ | --------------------------------------- |
| Audio      | No audio           | STT → transcript                        |
| Image      | No image           | Vision model → text description         |
| Video      | No video           | First frame + vision → text description |
| PDF        | No PDF             | Text extraction                         |
| Any        | Native             | Pass directly                           |

### Output Gaps

| Mode       | Model native output | Bridge     |
| ---------- | ------------------- | ---------- |
| voice/call | No audio            | TTS bridge |
| text       | Native text         | None       |

### Gap Fill SSE Events

Gap fill operations emit progress events so the frontend can show state:

```typescript
// emitted when gap fill starts for a message
GAP_FILL_STARTED: { messageId, type: "stt" | "vision" | "translation" | "tts" }
// emitted when complete - carries the text variant
GAP_FILL_COMPLETED: { messageId, type, text: string }
```

Frontend renders "Transcribing..." / "Describing image..." inline, then swaps to the variant toggle once complete.

### TTS Streaming

Sentence-by-sentence as LLM streams. 50–300 char buffer with natural break detection. One TTS call in-flight at a time, one chunk look-ahead. Credits deduct per chunk.

---

## Model Switch: Parallel Gap Fill

When the user switches models and sends the next message:

1. Walk back to last compaction boundary
2. Collect all messages needing gap fill for the new model
3. Run all in parallel
4. Frontend shows "Preparing context..." until complete
5. Proceed with stream

Compaction boundary is the hard stop. Cost attributed to the current turn.

---

## Message Variants

```typescript
interface MessageVariant {
  modality: Modality
  content: string      // text or storage URL
  modelId?: ModelId
  creditCost?: number
  createdAt: Date
}
// on MessageMetadata:
variants?: MessageVariant[]
```

Variants are computed lazily and cached. Once generated, reused for all future model switches.

| Message type          | file | text                                                                                               |
| --------------------- | ---- | -------------------------------------------------------------------------------------------------- |
| User voice            | yes  | STT transcript (at send time)                                                                      |
| User image attachment | yes  | vision description (lazy)                                                                          |
| AI media tool result  | yes  | refined prompt (at generation) or vision-bridge description (lazy, on first non-vision model turn) |
| AI text response      | -    | the text itself                                                                                    |
| AI TTS audio          | yes  | LLM source text                                                                                    |

### Frontend Toggle

Ghost underline button below any media: "Show prompt" / "Hide prompt", "Show transcript" / "Hide transcript". In text view: copy copies text. In file view: copy copies URL. Download always downloads file.

---

## Compaction

The compacter is just another LLM call - same context builder, same native passthrough / gap fill logic. Extra system instruction: _"Preserve all file reference URLs exactly as-is."_

- Audio: transcript in summary, URL + duration in metadata
- Image/video: description in summary, URL in metadata
- Media tool results: refined prompt + URL preserved
- Missing `text` variant: gap fill runs **before** compaction call (forced)

`containsMediaReferences: boolean` on compact summary metadata.

---

## Voice + TTS / STT Models

TTS and STT are first-class model entries. Picking a voice IS picking a model.

```typescript
// voiceMeta on TTS model entries
interface TtsVoiceMeta {
  gender?: "male" | "female" | "neutral";
  preview?: string;
  language?: string;
  style?: string;
}
```

Cascade:

```
skill.voiceId → favorite.voiceId → user settings → openai-alloy
skill.sttModelId → favorite.sttModelId → user settings → openai-whisper
```

---

## Proactive Frontend Hints

Derived client-side from `model.inputs` vs outgoing attachment types. No server roundtrip.

```
"Transcribing voice message with Whisper..."
"Describing image for DeepSeek..."
```

Replaced by variant toggle button once response arrives.

---

## Message Modality Provenance

```typescript
// MessageMetadata additions
inputModality?: Modality
outputModality?: Modality
pipelineSteps?: PipelineStep[]
variants?: MessageVariant[]

interface PipelineStep {
  type: "stt" | "tts" | "vision-bridge" | "translation" | "routing" | "gap-fill"
  modelId: ModelId
  creditCost: number
  durationMs?: number
}
```

---

## Unified Pricing

```
Voice → DeepSeek + ElevenLabs Rachel     14 credits
  ├── STT (Whisper)                        2 credits
  ├── LLM (DeepSeek)                       9 credits
  └── TTS (ElevenLabs Rachel)             3 credits

Image gen turn → GPT-4o + image_gen      22 credits
  ├── LLM (GPT-4o)                        12 credits
  └── image_gen tool (gpt-5-image-mini)  10 credits
```

Credits deduct per step as completed. Failed steps not charged.

---

## Intent-Based Routing

```typescript
interface RoutingConfig {
  enabled: boolean;
  routerModelId: ModelId;
  routes: { intent: string; modelId: ModelId; confidence: number }[];
  fallbackModelId: ModelId;
}
```

Gap-fill re-evaluates after routing. Routing shown as pipeline step in cost breakdown.

---

## Resolved Design Decisions

1. **img2img UX**: LLM passes `inputRef` from tool result context naturally. UI also offers an explicit "Edit" button as a shortcut (pre-fills prompt + inputRef). Same pipeline either way.

2. **Streaming media tool results**: No partial previews - APIs don't expose them. Spinner during generation, full result on complete.

3. **Direct tool triggers**: Tab context determines path. Image/video/music tab = direct tool call, no LLM wrapper (faster, no reasoning overhead). Chat tab = LLM calls tool. Same tool, same result schema, different entry point.

4. **Video gen latency**: Async job. Tool result starts as `{ status: "pending", jobId }`. Background job runs generation. `TOOL_RESULT_UPDATED` SSE event when complete. Image stays synchronous.

5. **Gap fill cost attribution**: Lazy - runs at start of next send, attributed to that turn as a separate `gap-fill` pipeline step line item in the cost breakdown.

6. **Multi-modal output ordering**: If LLM emits text before the file part → attach media to the text message (`GENERATED_MEDIA_ADDED` SSE event, one bubble). If file-only (no preceding text) → standalone tool message.

---

## Migration

- `callMode: false` → `"text"`, `callMode: true` → `"voice"`. No data loss.
- Pure generator models removed from model selector (moved to tool implementations only).

---

## Related Files

| File                                              | Change                                                                                                                                                            |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agent/models/models.ts`                          | `modelRole`; `inputs/outputs`; pure-gen models as tool-only; TTS/STT entries                                                                                      |
| `agent/models/enum.ts`                            | `ModelRole` enum; remove `ModelType`                                                                                                                              |
| `agent/chat/db.ts`                                | `inputModality`, `outputModality`, `pipelineSteps`, `variants[]`; `chatMode` on thread                                                                            |
| `agent/chat/favorites/db.ts`                      | `voiceId`, `sttModelId`, `visionBridgeModelId`, `translationModelId`, `imageGenModelId`, `musicGenModelId`, `videoGenModelId`, `defaultChatMode`, `routingConfig` |
| `agent/chat/skills/config.ts`                     | `voiceId`, `sttModelId`, `imageGenModelId`, `musicGenModelId`, `videoGenModelId`, bridge model fields                                                             |
| `agent/image-gen/`, `video-gen/`, `audio-gen/`    | Unified `MediaToolArgs`/`MediaToolResult`; `inputRef` for edits                                                                                                   |
| `repository/stream-setup.ts`                      | Gap-fill resolution; tool list filtered by model native capabilities                                                                                              |
| `repository/handlers/message-context-builder.ts`  | Native passthrough vs text variant; parallel gap fill on model switch                                                                                             |
| `repository/handlers/file-part-handler.ts`        | Synthesize tool call/result from native file parts                                                                                                                |
| `repository/handlers/stream-execution-handler.ts` | Remove pure generator special-case                                                                                                                                |
| `repository/handlers/compacting-handler.ts`       | Force gap fill before compaction; same context builder                                                                                                            |
| `repository/streaming-tts.ts`                     | Named voice IDs from model entry                                                                                                                                  |
| `agent/speech-to-text/repository.ts`              | Drive from STT model entry                                                                                                                                        |
| `agent/text-to-speech/repository.ts`              | Drive from TTS model entry                                                                                                                                        |
| `stream/hooks/voice-mode/`                        | Client-side VAD; interruption                                                                                                                                     |
| `stream/widget/`                                  | Variant toggles; media tool widgets open by default; gap fill progress; call mode UI                                                                              |
