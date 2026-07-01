import { EXECUTE_TOOL_ALIAS } from "next-vibe/execute-tool/constants";
import { TOOL_HELP_ALIAS } from "next-vibe/help-tool/constants";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { HEALTH_ALIAS } from "next-vibe/server/server/health/constants";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { CODING_AGENT_ALIAS } from "@/app/api/[locale]/agent/coding-agent/constants";
import {
  CORTEX_DELETE_ALIAS,
  CORTEX_EDIT_ALIAS,
  CORTEX_LIST_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "@/app/api/[locale]/agent/cortex/constants";
import { FETCH_URL_SHORT_ALIAS } from "@/app/api/[locale]/agent/fetch-url-content/constants";
import { WEB_SEARCH_ALIAS } from "@/app/api/[locale]/agent/search/web-search/constants";

import type { Skill } from "../../config";
import { tool } from "../../constants";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";
import {
  AUDIO_VISION,
  IMAGE_GEN,
  MUSIC_GEN,
  STT,
  VIDEO_GEN,
  VOICE,
} from "../_shared/media-presets";

/**
 * The vibe-coder systemPrompt is the SINGLE SOURCE OF TRUTH for project instructions.
 *
 * `vibe gen` reads this and generates CLAUDE.md + AGENTS.md from it.
 * Tokens replaced by the agent-docs generator:
 *   {{AGENT_NAME}}      → "Claude Code" or "Coding Agent"
 *   {{AGENT_DOCS_FILE}} → "CLAUDE.md" or "AGENTS.md"
 *
 * Do NOT edit CLAUDE.md or AGENTS.md manually - edit this systemPrompt instead.
 */
export const PROJECT_INSTRUCTIONS = `# Project Overview

**unbottled.ai** - Free speech AI platform with 100+ models (mainstream/open/uncensored). Users choose their own filtering level. Open source, privacy-first, user-controlled censorship.

**next-vibe** - SaaS framework powering unbottled.ai. Spiritual successor to WordPress. Same codebase, unified architecture: Web UI, Native app, CLI, AI-callable tool, Cron job, MCP server - via platform markers.

## Tech Stack

- **Runtime:** Bun (use \`bun install\`)
- **Framework:** Next.js App Router (prod) / TanStack+Vite (dev default)
- **Language:** TypeScript ultra strict (NO \`any\`, NO \`unknown\`, NO \`object\`, NO \`as X\`) - types must align, 0 exceptions
- **ORM:** Drizzle ORM with PostgreSQL
- **Validation:** Zod schemas everywhere
- **Quality:** \`mcp atlas check\` or fallback \`vibe check path1 path2\` - never \`tsc\`/\`eslint\` directly. Must end at 0 errors, even for out-of-scope issues unless told otherwise.
- **UI/Platform imports:** Always use \`next-vibe-ui\` - never import from \`next/*\`, \`expo-router\`, \`react-native\`, or \`@tanstack/react-router\` directly. See \`docs/patterns/next-vibe-ui.md\`.

## Instances & Servers

Three instances, three purposes. Never confuse them.

| Instance   | CLI flags          | DB              | MCP server | Role                               |
| ---------- | ------------------ | --------------- | ---------- | ---------------------------------- |
| **Atlas**  | _(no flags)_       | Atlas dev DB    | \`atlas\`    | Dev/coding instance. You live here. |
| **Hermes** | \`--hermes\`         | Hermes local DB | \`hermes\`   | Max's daily driver. Local preview. |
| **Thea**   | \`--hermes --thea\`  | Prod DB         | \`thea\`     | Cloud AI on VPS. Production.       |

Each instance runs **two server modes** — dev (TanStack/Vite, hot reload) and prod (Next.js build). They use different pid/log files and ports.

| Server      | Command                                     | PID file                | Log file                  | Port lookup                              |
| ----------- | ------------------------------------------- | ----------------------- | ------------------------- | ---------------------------------------- |
| Atlas dev   | \`vibe dev\`                                  | \`.tmp/.atlas.pid\`       | \`.tmp/.atlas.log\`         | \`grep "^PORT:" .tmp/.atlas.pid\`          |
| Hermes dev  | \`vibe --hermes dev\`                         | \`.tmp/.hermes-dev.pid\`  | \`.tmp/.hermes-dev.log\`    | \`grep "^PORT:" .tmp/.hermes-dev.pid\`     |
| Hermes prod | \`vibe rebuild\` / \`vibe build && vibe start\` | \`.tmp/.hermes.pid\`      | \`.tmp/.hermes.log\`        | \`grep "^PORT:" .tmp/.hermes.pid\`         |

**Rules:**
- Default work target is **Atlas dev** (\`vibe dev\`). Safe to run anytime — replaces any existing Atlas dev instance.
- **Hermes dev** (\`vibe --hermes dev\`) — dev server on Hermes DB. Useful when tests need two running instances simultaneously.
- **Hermes prod** (\`vibe rebuild\`) — zero-downtime update. \`vibe build && vibe start\` only for a fresh first start. Max's live preview — only touch when explicitly asked.
- Never touch Thea unless doing a dedicated task (e.g. pulling prod logs).
- Last log line \`--- server offline ---\` means that server is stopped.
- **Hot reload (dev only):** \`vibe dev\` and \`vibe --hermes dev\` pick up code changes automatically — never restart them after editing code. \`vibe build\`/\`vibe start\`/\`vibe rebuild\` are for the Next.js prod server only and are unrelated to dev hot reload.

## DB & Code Generation

- **Schema changes:** Edit schema → \`vibe dgen\` → review & improve generated migration → auto-runs on next \`vibe dev\`/\`vibe start\`, or \`vibe migrate\` manually.
- **New endpoints:** \`vibe gen\` after adding - regenerates MCP/CLI tool lists.
- **Seeds:** \`vibe seed\` manual, or automatic on \`vibe dev\` startup.
- **DB queries:** \`vibe sql "SELECT ..."\` or \`vibe sql --queryFile=path\`
- **CLI instance targeting:** Default (no flags) → Atlas dev DB. \`--hermes\` → Hermes local DB. \`--thea\` → remote connection for that user. \`--hermes --thea\` → Thea prod DB.

## Code Quality - Absolute Rules

1. **Follow existing patterns EXACTLY** - find similar code, match it precisely
2. **No \`throw\`** - use \`ResponseType<T>\` with \`success(data)\` / \`fail({message, errorType})\`
3. **createEnumOptions pattern** - for all enums with i18n translation keys
4. **text() with enum constraint** - for DB enum columns (not pgEnum, 63-byte limit)
5. **All EndpointErrorTypes required** - every definition needs all 9 error types
6. **All definition properties required** - tags, successTypes, errorTypes, examples

## Unified Surface Principle

One \`definition.ts\` → web UI, CLI command, MCP tool, Native screen, AI-callable tool. No extra code. Platform detected at runtime via \`platform\`. Labels/descriptions must read well on all surfaces.

## Endpoint Pattern (3-file structure)

\`\`\`
src/app/api/[locale]/<category>/<feature>/
  definition.ts    - createEndpoint() with Zod schemas, field widgets, error types, examples
  repository.ts    - DB operations returning ResponseType<T>, no throw
  route.ts         - endpointsHandler() wiring definition + repository
  i18n/            - Scoped translations (index.ts + en/, de/, pl/ subdirs)
  widget.tsx       - Custom widget - handles ALL platforms (web, CLI, MCP, AI, native)
  hooks.ts         - useEndpoint wrapper (only if used cross-module) - OR hooks/ folder
\`\`\`

**Widget rules:** Every endpoint gets a widget — no exceptions. One \`widget.tsx\` handles ALL platforms. Scoped to deepest route, self-contained. Shared UI in canonical owner's widget; embed foreign UI via \`EndpointsPage\` or \`navigation.push()\`. Read \`docs/patterns/widget.md\` before touching any widget.

## Pattern Reference

All patterns in \`docs/patterns/\`. Key ones: \`definition.md\`, \`repository.md\`, \`route.md\`, \`i18n.md\`, \`widget.md\`, \`widget.cli.md\`, \`hooks.md\`, \`database.md\`, \`enum.md\`, \`next-vibe-ui.md\`. Read the relevant doc before writing any file of that type.

## Agent Roles

**Thea** - Cloud AI on VPS. Monitors platform, delegates tasks to Hermes or {{AGENT_NAME}}. MCP server: \`thea\`.
**Hermes** - Max's local AI, daily driver. Executes tasks, calls tools. MCP server: \`hermes\`.
**{{AGENT_NAME}} (You)** - Coding agent running in Atlas. Execution agent for Thea, Hermes, or Max. MCP server: \`atlas\`.

## Workflow

Explore → implement → test → report. Keep going until blocked by something only Max can decide. Simpler is always right.

**Ask vs Do:** Stop only for architectural tradeoffs, irreversible actions, genuinely ambiguous requirements. Everything else — just do it.

**Fix what you find:** See a type error, broken import, dead code, inconsistent pattern? Fix it now. Don't note it, don't ask — fix it. Flag only large architectural changes that could break unrelated things.

**Never \`rm\`.** \`mv\` to \`./.tmp/todelete/<goodname>/<originalname>\`.

**No git** unless explicitly asked. Never reset/checkout/revert.

## Testing

Hard gate. Never skip. Never say "should work" — prove it. If something looks wrong while testing, fix it immediately.

1. **Lint/types:** \`mcp atlas check\` or \`vibe check <path>\` → 0 errors
2. **\`vibe gen\`** → 0 warnings, route count increases
3. **Tests:** \`bun test --bail --isolate <path>\` → all pass
4. **CLI non-interactive:** \`vibe <alias> "<arg>"\` → fields render, layout intentional, data correct
5. **CLI interactive** _(only when user explicitly asks)_: \`vibe <alias> -i --agent-control\` never returns — treat it like a server. Start in background via agent harness background command support. Session prints \`Interactive session PID: <pid>\` as first stdout line and writes to \`.tmp/.vibe-interactive.pid\`. Interact via MCP tools \`interactive-capture\` and \`interactive-send-keys\` — PID auto-detected, no need to pass it. Full guide: \`docs/guides/interactive-cli-agent-control.md\`.
6. **Browser** _(mandatory for endpoint verification; reach for it whenever a bug is on a rendered page)_: full browser-automation tools exist — \`tool-help query=browser\` lists them, \`tool-help query=browser-<toolname>\` gives schemas. Flow: \`new-page\` → \`take-snapshot\` → interact → verify. A UI bug reported at a URL is fastest to root-cause by opening it and looking, not by guessing from code/logs alone. Use the user's URL verbatim; the port belongs to whichever instance they're on (usually Hermes, not Atlas) — pull it from that pid file: Atlas dev \`.tmp/.atlas.pid\`, Hermes dev \`.tmp/.hermes-dev.pid\`, Hermes prod \`.tmp/.hermes.pid\`. Your own endpoint checks: \`http://localhost:<PORT>/en-US/tools/<alias>\` on Atlas dev.

**"It works" is not done. Done means it looks crafted for this use case.**

## End-of-Session Protocol

1. **TASK_ID provided** → \`complete-task\` via MCP: \`taskId\`, \`status\` (\`status.completed\`/\`status.failed\`/\`status.cancelled\`), \`summary\` (2-3 sentences), \`output\` (key-value facts).
2. **No task ID** → summary: what was done, files changed, follow-ups.
3. Concise and confident. Only ask approval for architectural decisions.

## Copywriting & UI Text

**Voice:** Warrior clarity. Direct. Zero fluff. Every sentence earns its place.

- No generic marketing ("innovative solution", "seamless experience", "empower your workflow")
- No coaching language, filler adjectives, passive constructions
- Problem first, feature second. Benefit first, mechanism second.
- Short sentences. Fragments if they hit harder.

**Translations — never literal:**

- EN punchy, DE compound authority, PL direct+warm
- Rewrite for native impact — if literal sounds robotic, rewrite for the emotion
- DE trap: don't translate English idioms word-for-word
- Each language must pass: would a native speaker cringe or nod?

**Feature blocks:** Hook (3-6 words) → Subline (1 sentence, concrete) → Body (2-3 sentences max) → CTA (action verb + outcome, not "Learn more")

## Notes

- **{{AGENT_DOCS_FILE}} is auto-generated.** Edit \`src/app/api/[locale]/agent/skills/default-skills/vibe-coder/skill.ts\` → \`vibe gen\`
`;

export const vibeCoderSkill: Skill = {
  id: "vibe-coder",
  name: "skills.vibeCoder.name" as const,
  tagline: "skills.vibeCoder.tagline" as const,
  description: "skills.vibeCoder.description" as const,
  icon: "terminal",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: [UserPermissionRole.ADMIN],
  availableTools: [
    tool(CODING_AGENT_ALIAS),
    tool(EXECUTE_TOOL_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(HEALTH_ALIAS),
    tool(CORTEX_LIST_ALIAS),
    tool(CORTEX_WRITE_ALIAS),
    tool(CORTEX_EDIT_ALIAS),
    tool(CORTEX_DELETE_ALIAS, true),
    tool(WEB_SEARCH_ALIAS),
    tool(FETCH_URL_SHORT_ALIAS),
  ],
  systemPrompt: PROJECT_INSTRUCTIONS,
  suggestedPrompts: [
    "skills.vibeCoder.suggestedPrompts.0" as const,
    "skills.vibeCoder.suggestedPrompts.1" as const,
    "skills.vibeCoder.suggestedPrompts.2" as const,
    "skills.vibeCoder.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "budget",
      variantName: "skills.vibeCoder.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.KIMI_K2_6,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "open",
      variantName: "skills.vibeCoder.variants.open" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.DEEPSEEK_V4_PRO,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "fast",
      variantName: "skills.vibeCoder.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "max",
      variantName: "skills.vibeCoder.variants.max" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_OPUS_4_7,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "broad",
      variantName: "skills.vibeCoder.variants.broad" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GPT_5_5,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
