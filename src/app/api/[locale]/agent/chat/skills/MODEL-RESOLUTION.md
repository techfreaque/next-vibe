# Model Resolution & Skill/Favorite System - Specification

This is the canonical reference for how model selection and resolution works across skills, favorites, and user settings. Describes **intended** behavior, not necessarily current implementation.

---

## 1. SELECTION TYPES

Every model field uses one of two modes:

**MANUAL** - Pin a specific model by ID. Use when you need deterministic behavior (e.g., "always use Claude Opus for this reasoning skill"). Falls back to FILTERS (all models eligible) if the model is unavailable in the current environment.

**FILTERS** - Specify acceptable ranges across 4 dimensions. The system picks the best available model matching those constraints. Use when portability across environments matters, or when you want the system to automatically upgrade/downgrade as the model landscape changes.

### Filter Dimensions

| Dimension           | Levels (ordered)               | Meaning                                                                                                                                |
| ------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `intelligenceRange` | QUICK → SMART → BRILLIANT      | Capability tier. QUICK = fast/cheap (Haiku, Flash), SMART = balanced (Sonnet, GPT-4o-mini), BRILLIANT = most capable (Opus, GPT-5, o3) |
| `priceRange`        | CHEAP → STANDARD → PREMIUM     | Cost tier based on reference usage. CHEAP ≤3 credits, STANDARD 3–9, PREMIUM >9                                                         |
| `contentRange`      | MAINSTREAM → OPEN → UNCENSORED | Censorship level. MAINSTREAM = OpenAI/Anthropic/Google, OPEN = fewer restrictions, UNCENSORED = no content policy                      |

**Resolution:** For FILTERS, the system returns all models satisfying all range constraints, sorted by the specified `sortBy` field (descending by default). The first result is used.

**Fallback chain:** MANUAL model unavailable → treat as FILTERS with filters passed on from manual model selection.

---

## 2. MODEL MODALITIES

| Modality     | Field name                  | Role                        | Billing unit            |
| ------------ | --------------------------- | --------------------------- | ----------------------- |
| Chat (LLM)   | `modelSelection`            | Main reasoning / generation | tokens (input + output) |
| Voice / TTS  | `voiceModelSelection`       | Text → speech               | per character           |
| STT          | `sttModelSelection`         | Speech → text               | per second of audio     |
| Image Gen    | `imageGenModelSelection`    | Text/image → image          | per image               |
| Music Gen    | `musicGenModelSelection`    | Text → audio clip           | per clip                |
| Video Gen    | `videoGenModelSelection`    | Text/image → video          | per second of video     |
| Image Vision | `imageVisionModelSelection` | LLM that can read images    | tokens                  |
| Video Vision | `videoVisionModelSelection` | LLM that can read video     | tokens                  |
| Audio Vision | `audioVisionModelSelection` | LLM that can read audio     | tokens                  |

Vision modalities (image/video/audio vision) are subsets of chat models - they are LLMs with multimodal input. The chat model and image-vision model can be the same model (e.g., GPT-5 supports both).

---

## 3. THE RESOLUTION CHAIN

There are four configuration layers. Each field is independently nullable at each layer. `null` = "defer to next layer."

**Layers (most-specific → most-general):**

1. **Skill** - Intent-level default. The skill author's recommended model for this personality/task.
2. **Favorite** - User personalization on top of a skill. Can override any model, add prompt append, restrict tools.
3. **User Settings** - User's global preferences. Fallback when no favorite override is set.
4. **Platform Default** - Hardcoded system defaults. Final fallback, always non-null.

### Priority rules differ by modality class

#### Bridge Models (TTS, STT, Image Vision, Video Vision, Audio Vision)

User preference dominates. The user controls how they hear/see output globally.

```
Priority: User Settings > Favorite > Skill > Platform Default
```

**Rationale:** TTS voice is an output preference. Even if a "pirate" skill has a gruff voice configured, the user's globally preferred voice should win. Bridge models connect AI output to human perception - personal preference matters more than skill intent.

#### Media Gen Models (Image Gen, Music Gen, Video Gen)

Skill intent dominates. A "Flux image artist" skill should use Flux, not whatever the user has globally set.

```
Priority: Skill > Favorite > User Settings > Platform Default
```

**Rationale:** The skill IS the image generator. The skill author chose this model for a reason. The user can override in their favorite if they want a different generator for their personal copy.

#### Chat Model (LLM)

No cascade. The chat model is specified explicitly per-request. The resolved value comes from:

- The active variant's `modelSelection` (filtered through `getBestChatModel`)
- The variant lives in the favorite's `variantId` → skill's variants array → default variant

---

## 4. SKILL VARIANTS

A **variant** is a named alternative model configuration for the same skill personality. The skill's system prompt, name, icon, and category are shared. Only model selections differ across variants.

**Why variants exist:**

- Same "Code Reviewer" skill → Variant A: fast/cheap for quick checks, Variant B: brilliant for deep reviews
- Same "Creative Writer" skill → Variant A: mainstream model, Variant B: uncensored model
- Multi-user scenario: public skill with platform-recommended variant, user's favorite pins a personal variant

**Structure:**

```
Skill
  └── Default Variant (always exists, from skill.modelSelection)
  └── Custom Variant 2 (user-created, stored in favorite with variantId reference)
  └── Custom Variant N ...
```

**Variant fields:** Each variant has its own `modelSelection` (required) + optional overrides for all 8 non-chat modalities.

### Variant resolution

1. Request comes in with `favoriteId`
2. Favorite has `variantId` (null = use default variant)
3. Fetch skill, find matching variant by ID
4. Use variant's `modelSelection` as the base chat model selection
5. Run `getBestChatModel(variant.modelSelection, user, env)` to resolve actual model

---

## 5. FULL RESOLUTION WALKTHROUGH

Example: User sends a message. Active favorite = "MyCodeReviewer" (variantId = "v2").

```
1. Load favorite → gets skill "CodeReviewer" + variantId "v2"
2. Load skill → find variant "v2" → modelSelection = FILTERS{BRILLIANT, CHEAP, MAINSTREAM}
3. Chat model: getBestChatModel(FILTERS{BRILLIANT, CHEAP, MAINSTREAM}, user, env)
   → returns best available BRILLIANT+CHEAP+MAINSTREAM model in env

4. TTS: cascadeBridgeModel(
     userSettings.voiceModelSelection,   // e.g., { MANUAL, openai_onyx }
     favorite.voiceModelSelection,        // null
     skill.voiceModelSelection,           // null
     DEFAULT_TTS_MODEL_SELECTION          // fallback
   ) → openai_onyx (user settings wins)

5. Image Gen: cascadeMediaGenModel(
     skill.imageGenModelSelection,        // { MANUAL, flux-pro }
     favorite.imageGenModelSelection,     // null
     userSettings.imageGenModelSelection, // { FILTERS, BRILLIANT }
     DEFAULT_IMAGE_GEN_SELECTION          // fallback
   ) → flux-pro (skill wins)

6. STT: cascadeBridgeModel(
     userSettings.sttModelSelection,      // null
     favorite.sttModelSelection,          // null
     skill.sttModelSelection,             // null
     DEFAULT_STT_SELECTION                // → deepgram-nova-2
   ) → deepgram-nova-2 (platform default)
```

---

## 6. WHAT TO STORE AT EACH LAYER

### Skill

Store model selections that define the skill's **INTENT**.

- Building an "Uncensored Creative Writer"? Set `contentRange: {min: OPEN, max: UNCENSORED}`.
- Building a "Fast Customer Support Bot"? Set `intelligenceRange: {max: SMART}, priceRange: {max: STANDARD}`.
- Don't over-specify: leave most selections `null` unless the skill specifically needs a particular modality.
- Set `imageGenModelSelection` only if this skill IS an image generator (e.g., "Flux Artist").
- Set `voiceModelSelection` only if this skill has a signature voice (e.g., "Morgan Freeman Narrator").

### Favorite

Store **USER OVERRIDES** only.

- A user who always wants their own TTS voice should set it in User Settings, not here.
- A user who wants THIS skill specifically to use Flux instead of the default image gen should set `imageGenModelSelection` here.
- `promptAppend`: inject personal context ("My name is Max, I prefer TypeScript") without modifying the skill's core system prompt. Use aggressively when personalizing.
- `variantId`: selects which skill variant to use. null = default variant.
- `deniedTools`: tools blocked specifically for this favorite.

### User Settings

Store **GLOBAL PREFERENCES**.

- TTS voice preference, preferred STT provider, global image gen default.
- These apply everywhere the user hasn't made a more specific override.

---

## 7. AI AGENT GUIDANCE

### When creating a skill

**Use FILTERS** (recommended for most skills) when:

- The skill should work across different environments/deployments
- You want the system to automatically pick the best available model
- Portability matters more than exact model identity

**Use MANUAL** when:

- You need a specific model's unique capabilities (e.g., o3 for reasoning, a specific uncensored model)
- The skill is environment-specific and you know the model will always be available

### Common filter presets

| Use case                | intelligenceRange   | priceRange     | contentRange                   |
| ----------------------- | ------------------- | -------------- | ------------------------------ |
| Fast assistant          | QUICK–SMART         | CHEAP–STANDARD | MAINSTREAM                     |
| Deep reasoning          | BRILLIANT–BRILLIANT | any            | MAINSTREAM                     |
| Budget mode             | QUICK–SMART         | CHEAP–CHEAP    | MAINSTREAM                     |
| Uncensored creative     | SMART–BRILLIANT     | CHEAP–STANDARD | OPEN–UNCENSORED                |
| Multi-modal image skill | SMART–BRILLIANT     | any            | (+ set imageGenModelSelection) |

### Variant auto-generation (recommended)

When creating a skill via AI, consider pre-seeding 3 variants:

1. **"Smart & Fast"** (default): SMART–SMART, CHEAP–STANDARD, FAST–BALANCED
2. **"Brilliant"**: BRILLIANT–BRILLIANT, any price, any speed
3. **"Budget"**: QUICK–SMART, CHEAP–CHEAP, FAST–FAST

If the skill has a content floor (e.g., `contentRange.min: OPEN`), all variants should inherit that floor.

### promptAppend guidance

When creating a favorite for a specific user, populate `promptAppend` with:

- User's name and preferred name
- Language/locale preferences
- Technical level and domain expertise
- Workflow context ("I work in TypeScript, prefer bun over npm")

This turns a generic skill into a personalized one without modifying the shared skill prompt.
