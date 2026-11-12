/**
 * Config snippets for the coding-tools post. Language-independent and built
 * from the live base URL and registry ids, so they work as printed.
 *
 * Tested 2026-11-12: OpenCode 1.19.5, Continue CLI 1.5.47 (direct),
 * Codex CLI 0.118.0 and Claude Code 2.1.322 (through LiteLLM 1.109.1).
 */

import { ChatModelId } from "next-vibe/agent/ai-stream/models";

/** Default model in every snippet: cheap, fast, calls tools. */
export const SNIPPET_MODEL = ChatModelId.DEEPSEEK_V4_1_FLASH;
const STRONG_MODEL = ChatModelId.CLAUDE_SONNET_5_5;
const UNCENSORED_MODEL = ChatModelId.GLM_5_3_UNCENSORED;
const SMALL_MODEL = ChatModelId.GLM_5_3_FLASH;

/** Local LiteLLM bridge for tools that do not speak chat completions. */
const BRIDGE_URL = "http://localhost:4000";

export interface CodingToolSnippets {
  key: string;
  opencode: string;
  opencodeRun: string;
  continueConfig: string;
  continueRun: string;
  litellmConfig: string;
  litellmRun: string;
  codex: string;
  codexRun: string;
  claudeCode: string;
}

export function buildCodingToolSnippets(baseUrl: string): CodingToolSnippets {
  const bridgeModel = (id: ChatModelId): string => `  - model_name: ${id}
    litellm_params:
      model: custom_openai/${id}
      api_base: ${baseUrl}
      api_key: os.environ/UNBOTTLED_API_KEY`;

  return {
    key: `export UNBOTTLED_API_KEY="sk-unb-..."

# Check the key and list every model id you can call
curl ${baseUrl}/models \\
  -H "Authorization: Bearer $UNBOTTLED_API_KEY"`,

    opencode: `{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "unbottled": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "unbottled.ai",
      "options": {
        "baseURL": "${baseUrl}",
        "apiKey": "{env:UNBOTTLED_API_KEY}"
      },
      "models": {
        "${SNIPPET_MODEL}": { "name": "DeepSeek V4.1 Flash" },
        "${STRONG_MODEL}": { "name": "Claude Sonnet 5.5" },
        "${UNCENSORED_MODEL}": { "name": "GLM 5.3 Uncensored" }
      }
    }
  },
  "model": "unbottled/${SNIPPET_MODEL}"
}`,

    opencodeRun: `opencode run -m unbottled/${SNIPPET_MODEL} "Read notes.txt and summarize it"`,

    continueConfig: `name: unbottled
version: 1.0.0
schema: v1
models:
  - name: DeepSeek V4.1 Flash
    provider: openai
    model: ${SNIPPET_MODEL}
    apiBase: ${baseUrl}
    apiKey: \${{ secrets.UNBOTTLED_API_KEY }}
    roles: [chat, edit, apply]`,

    continueRun: `cn --config ./config.yaml -p "Read notes.txt and summarize it"`,

    litellmConfig: `model_list:
${bridgeModel(SNIPPET_MODEL)}
${bridgeModel(SMALL_MODEL)}
${bridgeModel(STRONG_MODEL)}`,

    litellmRun: `pip install 'litellm[proxy]'

export UNBOTTLED_API_KEY="sk-unb-..."
export LITELLM_MASTER_KEY="sk-local-$(openssl rand -hex 16)"
litellm --config litellm.yaml --port 4000`,

    codex: `model_provider = "unbottled"
model = "${SNIPPET_MODEL}"

[model_providers.unbottled]
name = "unbottled.ai via LiteLLM"
base_url = "${BRIDGE_URL}/v1"
env_key = "LITELLM_MASTER_KEY"
wire_api = "responses"`,

    codexRun: `codex exec "Read notes.txt and summarize it"`,

    claudeCode: `export ANTHROPIC_BASE_URL="${BRIDGE_URL}"
export ANTHROPIC_AUTH_TOKEN="$LITELLM_MASTER_KEY"
export ANTHROPIC_MODEL="${SNIPPET_MODEL}"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="${SMALL_MODEL}"
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1

claude`,
  };
}
