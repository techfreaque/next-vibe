/**
 * Coding-tool setup snippets. THE one place every tool config is written:
 * the API key page (./widget.tsx), /docs/api and the coding-tools blog post
 * all render from buildCodingToolSnippets(). Fix a snippet here and every
 * surface follows.
 *
 * Client-safe: no server-only imports. Language-independent: captions and
 * prose live in ./i18n (codingTools.*).
 */

import {
  chatModelDefinitions,
  ChatModelId,
} from "next-vibe/agent/ai-stream/models";

import { API_KEY_PREFIX } from "./constants";

/**
 * Default model in every snippet. Passed real Codex CLI and Claude Code runs
 * (read, edit, run) and calls tools reliably at a low output price.
 * Not DeepSeek V4.1 Flash: OpenRouter spreads it over dozens of fp4/fp8
 * hosts and some return garbled text inside long agent contexts.
 */
export const CODING_TOOL_MODEL = ChatModelId.GLM_5_3;
/** Background / "haiku" slot: session titles, summaries, quick lookups. */
export const CODING_TOOL_SMALL_MODEL = ChatModelId.GLM_5_3_FLASH;
/** Extra entries in configs that list several models (OpenCode). */
export const CODING_TOOL_STRONG_MODEL = ChatModelId.CLAUDE_SONNET_5_5;
export const CODING_TOOL_UNCENSORED_MODEL = ChatModelId.GLM_5_3_UNCENSORED;
/** "Any id from GET /v1/models works", e.g. these. */
export const CODING_TOOL_EXAMPLE_MODELS = [
  ChatModelId.KIMI_K3_1_PRO,
  ChatModelId.KIMI_K3,
  ChatModelId.UNCENSORED_LM_V1_2,
] as const;

/** Shown wherever the real key is not known (it is only visible once). */
export const API_KEY_PLACEHOLDER = `${API_KEY_PREFIX}YOUR_KEY`;
/** Environment variable every snippet reads the key from. */
export const API_KEY_ENV = "UNBOTTLED_API_KEY";

export const CODING_TOOL_IDS = [
  "codex",
  "claudeCode",
  "opencode",
  "continue",
  "aider",
  "cline",
  "openaiCompatible",
  "curl",
] as const;
export type CodingToolId = (typeof CODING_TOOL_IDS)[number];

export interface TestedVersion {
  /** Tool version as the tool prints it, e.g. "0.118.0". */
  version: string;
  /** ISO date of the end-to-end run. */
  date: string;
}

/**
 * Tool versions each setup below was run end to end with.
 * null = not confirmed yet: no surface shows a "tested" claim for it.
 * Fill these in after a real run, nowhere else.
 */
export const CODING_TOOLS_TESTED: Record<CodingToolId, TestedVersion | null> = {
  codex: { version: "0.118.0", date: "2026-11-13" },
  claudeCode: { version: "2.1.323", date: "2026-11-13" },
  opencode: { version: "1.19.5", date: "2026-11-13" },
  continue: { version: "1.5.47", date: "2026-11-13" },
  aider: { version: "0.86.2", date: "2026-11-13" },
  cline: { version: "3.0.74", date: "2026-11-13" },
  openaiCompatible: null,
  curl: { version: "8.20.0", date: "2026-11-13" },
};

/** What a block is for. Each kind has one caption in i18n codingTools.blocks. */
export type SnippetKind =
  | "oneCommand"
  | "config"
  | "run"
  | "fields"
  | "check"
  | "request";

export type SnippetLanguage = "bash" | "toml" | "json" | "yaml" | "text";

export interface SnippetBlock {
  kind: SnippetKind;
  /** File the block goes into, or "terminal" / the settings screen. */
  filename: string;
  language: SnippetLanguage;
  code: string;
}

/** Which of our wire formats the tool talks to. */
export type CodingToolWire = "responses" | "messages" | "chat";

export interface CodingToolSetup {
  id: CodingToolId;
  /** Product name, never translated. */
  name: string;
  wire: CodingToolWire;
  tested: TestedVersion | null;
  blocks: readonly SnippetBlock[];
}

export interface CodingToolSnippets {
  /** OpenAI-style base URL, ends with /v1. */
  baseUrl: string;
  /** Anthropic-style base URL: same URL without /v1 (clients append /v1/messages). */
  anthropicBaseUrl: string;
  /** The key printed in snippets: the real one when known, else the placeholder. */
  key: string;
  hasRealKey: boolean;
  tools: Record<CodingToolId, CodingToolSetup>;
}

function modelName(id: ChatModelId): string {
  return chatModelDefinitions[id].name;
}

/**
 * Public API base URL for a locale: `<app url>/api/<locale>/v1`.
 * Tolerates a trailing slash on the app URL (no `//api` in printed snippets).
 */
export function buildPublicApiBaseUrl(appUrl: string, locale: string): string {
  return normalizeBaseUrl(`${appUrl}/api/${locale}/v1`);
}

/** Collapse duplicate slashes (keeping the protocol's) and drop a trailing one. */
function normalizeBaseUrl(url: string): string {
  return url.replace(/([^:/])\/{2,}/g, "$1/").replace(/\/+$/, "");
}

/** Strip the trailing /v1 for Anthropic-style clients. */
export function toAnthropicBaseUrl(baseUrl: string): string {
  return normalizeBaseUrl(baseUrl).replace(/\/v1$/, "");
}

export function buildCodingToolSnippets({
  baseUrl,
  apiKey,
}: {
  baseUrl: string;
  /** Plaintext key right after creation. Omit to print the placeholder. */
  apiKey?: string | null;
}): CodingToolSnippets {
  const url = normalizeBaseUrl(baseUrl);
  const anthropicBaseUrl = toAnthropicBaseUrl(url);
  const key = apiKey && apiKey.length > 0 ? apiKey : API_KEY_PLACEHOLDER;
  const exportKey = `export ${API_KEY_ENV}="${key}"`;
  const model = CODING_TOOL_MODEL;
  const small = CODING_TOOL_SMALL_MODEL;

  const claudeCodeEnv: readonly (readonly [string, string])[] = [
    ["ANTHROPIC_BASE_URL", anthropicBaseUrl],
    ["ANTHROPIC_AUTH_TOKEN", key],
    ["ANTHROPIC_MODEL", model],
    ["ANTHROPIC_DEFAULT_OPUS_MODEL", model],
    ["ANTHROPIC_DEFAULT_SONNET_MODEL", model],
    ["ANTHROPIC_DEFAULT_HAIKU_MODEL", small],
    ["CLAUDE_CODE_SUBAGENT_MODEL", model],
    // Claude Code only knows Claude context sizes; tell it the real window
    // so it compacts at the right point (and does not warn about the id).
    [
      "CLAUDE_CODE_MAX_CONTEXT_TOKENS",
      String(chatModelDefinitions[model].contextWindow),
    ],
    ["CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC", "1"],
  ];

  const tools: Record<CodingToolId, CodingToolSetup> = {
    codex: {
      id: "codex",
      name: "Codex CLI",
      wire: "responses",
      tested: CODING_TOOLS_TESTED.codex,
      blocks: [
        {
          kind: "oneCommand",
          filename: "terminal",
          language: "bash",
          code: `${API_KEY_ENV}="${key}" codex \\
  -c 'model_providers.unbottled={name="unbottled.ai",base_url="${url}",env_key="${API_KEY_ENV}",wire_api="responses"}' \\
  -c model_provider=unbottled \\
  -m ${model}`,
        },
        {
          kind: "config",
          filename: "~/.codex/config.toml",
          language: "toml",
          code: `[model_providers.unbottled]
name = "unbottled.ai"
base_url = "${url}"
env_key = "${API_KEY_ENV}"
wire_api = "responses"

[profiles.unbottled]
model_provider = "unbottled"
model = "${model}"`,
        },
        {
          kind: "run",
          filename: "terminal",
          language: "bash",
          code: `${exportKey}
codex --profile unbottled`,
        },
      ],
    },

    claudeCode: {
      id: "claudeCode",
      name: "Claude Code",
      wire: "messages",
      tested: CODING_TOOLS_TESTED.claudeCode,
      blocks: [
        {
          kind: "oneCommand",
          filename: "terminal",
          language: "bash",
          code: `${claudeCodeEnv
            .map(([name, value]) => `${name}="${value}" \\`)
            .join("\n")}
claude`,
        },
        {
          kind: "config",
          filename: "~/.claude/settings.json",
          language: "json",
          code: `{
  "env": {
${claudeCodeEnv.map(([name, value]) => `    "${name}": "${value}"`).join(",\n")}
  }
}`,
        },
        {
          kind: "run",
          filename: "terminal",
          language: "bash",
          code: "claude",
        },
      ],
    },

    opencode: {
      id: "opencode",
      name: "OpenCode",
      wire: "chat",
      tested: CODING_TOOLS_TESTED.opencode,
      blocks: [
        {
          kind: "oneCommand",
          filename: "terminal",
          language: "bash",
          code: `${API_KEY_ENV}="${key}" \\
OPENCODE_CONFIG_CONTENT='{"provider":{"unbottled":{"npm":"@ai-sdk/openai-compatible","options":{"baseURL":"${url}","apiKey":"{env:${API_KEY_ENV}}"},"models":{"${model}":{}}}},"model":"unbottled/${model}"}' \\
opencode`,
        },
        {
          kind: "config",
          filename: "opencode.json",
          language: "json",
          code: `{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "unbottled": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "unbottled.ai",
      "options": {
        "baseURL": "${url}",
        "apiKey": "{env:${API_KEY_ENV}}"
      },
      "models": {
        "${model}": { "name": "${modelName(model)}" },
        "${CODING_TOOL_STRONG_MODEL}": { "name": "${modelName(CODING_TOOL_STRONG_MODEL)}" },
        "${CODING_TOOL_UNCENSORED_MODEL}": { "name": "${modelName(CODING_TOOL_UNCENSORED_MODEL)}" }
      }
    }
  },
  "model": "unbottled/${model}"
}`,
        },
        {
          kind: "run",
          filename: "terminal",
          language: "bash",
          code: `${exportKey}
opencode`,
        },
      ],
    },

    continue: {
      id: "continue",
      name: "Continue",
      wire: "chat",
      tested: CODING_TOOLS_TESTED.continue,
      blocks: [
        {
          kind: "config",
          filename: "config.yaml",
          language: "yaml",
          code: `name: unbottled
version: 1.0.0
schema: v1
models:
  - name: ${modelName(model)}
    provider: openai
    model: ${model}
    apiBase: ${url}
    apiKey: \${{ secrets.${API_KEY_ENV} }}
    roles: [chat, edit, apply]`,
        },
        {
          kind: "run",
          filename: "terminal",
          language: "bash",
          code: `${exportKey}
cn --config ./config.yaml`,
        },
      ],
    },

    aider: {
      id: "aider",
      name: "Aider",
      wire: "chat",
      tested: CODING_TOOLS_TESTED.aider,
      blocks: [
        {
          kind: "oneCommand",
          filename: "terminal",
          language: "bash",
          code: `OPENAI_API_BASE="${url}" \\
OPENAI_API_KEY="${key}" \\
aider --model openai/${model} --edit-format diff --no-show-model-warnings`,
        },
      ],
    },

    cline: {
      id: "cline",
      name: "Cline",
      wire: "chat",
      tested: CODING_TOOLS_TESTED.cline,
      blocks: [
        {
          kind: "oneCommand",
          filename: "terminal",
          language: "bash",
          code: `cline auth -p openai -k "${key}" -b "${url}" -m ${model}`,
        },
        {
          kind: "run",
          filename: "terminal",
          language: "bash",
          code: "cline",
        },
      ],
    },

    openaiCompatible: {
      id: "openaiCompatible",
      name: "OpenAI-compatible",
      wire: "chat",
      tested: CODING_TOOLS_TESTED.openaiCompatible,
      blocks: [
        {
          kind: "fields",
          filename: "settings",
          language: "text",
          code: `# OpenAI-compatible tools (chat completions or Responses API)
Base URL:  ${url}
API key:   ${key}
Model:     ${model}

# Anthropic-compatible tools (Messages API)
Base URL:  ${anthropicBaseUrl}
API key:   ${key}
Model:     ${model}`,
        },
      ],
    },

    curl: {
      id: "curl",
      name: "curl",
      wire: "chat",
      tested: CODING_TOOLS_TESTED.curl,
      blocks: [
        {
          kind: "check",
          filename: "terminal",
          language: "bash",
          code: `${exportKey}

curl ${url}/models \\
  -H "Authorization: Bearer $${API_KEY_ENV}"`,
        },
        {
          kind: "request",
          filename: "terminal",
          language: "bash",
          code: `curl ${url}/chat/completions \\
  -H "Authorization: Bearer $${API_KEY_ENV}" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"${model}","messages":[{"role":"user","content":"Hello"}]}'`,
        },
      ],
    },
  };

  return {
    baseUrl: url,
    anthropicBaseUrl,
    key,
    hasRealKey: key !== API_KEY_PLACEHOLDER,
    tools,
  };
}
