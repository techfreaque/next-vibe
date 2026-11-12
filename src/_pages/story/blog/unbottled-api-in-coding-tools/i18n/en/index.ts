export const translations = {
  meta: {
    title: "Every model in your coding agent - {{appName}} API",
    description:
      "Run OpenCode, Continue, Codex CLI and Claude Code on one {{appName}} key. Claude, GPT, DeepSeek, GLM and uncensored models. Tested configs, real gotchas.",
    category: "Developer Guide",
    imageAlt: "{{appName}} API inside coding tools",
    keywords:
      "{{appName}}, OpenAI compatible API, OpenCode, Codex CLI, Claude Code, Continue, LiteLLM, coding agent, uncensored models, custom provider",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "9 min read",
    title: "One key. Every model. Inside your coding agent.",
    subtitle:
      "Plug the {{appName}} API into OpenCode, Continue, Codex CLI and Claude Code. Every config below ran end to end before we published it.",
  },
  intro: {
    lead: "Your coding agent is locked to one vendor's models. Want a second opinion from another lab, a cheaper model for grunt work, or a model that does not refuse? That means another account, another key, another bill.",
    p2: "{{appName}} speaks the OpenAI chat completions format. Point a tool at it once and you can switch between Claude, GPT, DeepSeek, GLM, Kimi, Qwen and the uncensored models by changing one model id. Two tools connect directly. Two need a small local bridge. Here is exactly how, with the versions we tested.",
  },
  why: {
    title: "Why bother",
    oneKey:
      "One key, one balance. No separate accounts at Anthropic, OpenAI, DeepSeek, Moonshot and Z.ai.",
    uncensored:
      "Uncensored models in your editor. Security research, red-team prompts, fiction tooling, data that trips mainstream filters. You pick the filter level, not the vendor.",
    switch:
      "Right model per task. A frontier model for the hard refactor, a flash model for renames and test scaffolding. Same config, different id.",
    billing:
      "Same credits as the chat app, same prices. Every response reports what it cost in usage.credits_charged.",
  },
  setup: {
    title: "Get a key and a base URL",
    intro: "Two values. Every tool below needs exactly these.",
    p1: "Create a key under Settings > API keys. It starts with sk-unb- and is shown once. The API is part of every paid plan: an active subscription or any credit pack unlocks it.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "The locale in the path only changes the language of error messages. Any locale works.",
    p2: "Put the key in an environment variable, never in a file you commit. The curl call proves the key works and lists every model id your account can call, with context size, tool support and credit prices.",
  },
  compat: {
    title: "What connects how",
    intro:
      "Coding agents speak three different wire formats. We serve one of them, chat completions. That decides the setup.",
    opencode:
      "OpenCode: direct. Speaks chat completions through its OpenAI-compatible provider.",
    continue:
      "Continue (CLI and IDE extension): direct. provider: openai with a custom apiBase.",
    codex:
      "Codex CLI: needs a bridge. Current Codex only speaks the OpenAI Responses API. Chat completions support was removed in early 2026.",
    claudeCode:
      "Claude Code: needs a bridge. It speaks the Anthropic Messages API, not the OpenAI format.",
    other:
      "Anything else with an OpenAI base URL field follows the OpenCode pattern: base URL, key, model id. We only list tools we ran ourselves.",
  },
  opencode: {
    label: "Direct",
    title: "OpenCode",
    intro:
      "Tested with OpenCode 1.19.5. Tool calls, file reads and edits work.",
    p1: "Add a custom provider to opencode.json in your project, or to ~/.config/opencode/opencode.json for every project. The key stays in your environment. Add any id from GET /models to the models map.",
    p2: "Then run it, or pick the model with /models in the TUI:",
    gotcha:
      "Update OpenCode first. Old 1.0.x builds pull the newest @ai-sdk/openai-compatible package and crash after the first tool call with DecimalError: Invalid argument. 1.19.5 runs the same config clean.",
  },
  continue: {
    label: "Direct",
    title: "Continue",
    intro:
      "Tested with the Continue CLI 1.5.47. The IDE extension reads the same config.yaml.",
    p1: "secrets.UNBOTTLED_API_KEY resolves from your environment. Run headless with -p, or drop -p for the interactive session:",
  },
  bridge: {
    label: "Bridge",
    title: "The LiteLLM bridge",
    intro:
      "Codex and Claude Code need a translator. LiteLLM runs on your machine and converts their formats to chat completions.",
    p1: "One LiteLLM proxy serves both tools. It exposes /v1/responses for Codex and /v1/messages for Claude Code, and forwards everything to {{appName}} as chat completions. List each model you want to use. Tested with LiteLLM 1.109.1.",
    gotcha:
      "Use the custom_openai/ prefix, not openai/. With openai/, LiteLLM forwards Codex calls as native Responses requests, and our API answers 404. LiteLLM also refuses to start without LITELLM_MASTER_KEY. That value is the key your tools send to the bridge. Your sk-unb key never leaves the proxy.",
  },
  codex: {
    label: "Via bridge",
    title: "Codex CLI",
    intro:
      "Tested with codex-cli 0.118.0. It ran a shell command and answered from its output.",
    p1: 'Point a custom provider at the bridge. wire_api must be "responses". Codex rejects "chat" at startup with a hard error. env_key names the variable that holds your bridge key.',
    p2: "Use the model ids from litellm.yaml. To switch models, add the id to the bridge config and change model in config.toml, or pass -m on the command line.",
  },
  claudeCode: {
    label: "Via bridge",
    title: "Claude Code",
    intro:
      "Tested with Claude Code 2.1.322. It used its Read tool across three turns and answered correctly.",
    p1: "Claude Code reads the gateway from environment variables. ANTHROPIC_MODEL sets the main model. ANTHROPIC_DEFAULT_HAIKU_MODEL moves background jobs such as session titles to a cheap model, so they do not burn the main one.",
    p2: "Claude Code warns that it does not recognize the model id and assumes a 200k context window. That is expected and harmless. The cost it prints is its own estimate. Your real cost is the credits charged on {{appName}}.",
    caveat:
      "Anthropic does not support running Claude Code on non-Claude models through a gateway. It works, and we tested it, but treat it as experimental: a Claude Code update can break it. Claude Code also sends a large system prompt, over 30k input tokens for a trivial task. Pick a cheap model or watch your balance.",
  },
  models: {
    title: "Which model for which job",
    intro:
      "All of these call tools, which agents need. Ids are what goes in your config.",
    strong: {
      title: "Hard problems",
      body: "Large refactors, unfamiliar codebases, multi-step debugging. Higher credit prices, fewer wrong turns.",
    },
    cheap: {
      title: "Cheap and fast",
      body: "Renames, tests, boilerplate, background jobs. A fraction of a frontier model's price. Good default for agents that send big prompts.",
    },
    uncensored: {
      title: "Uncensored",
      body: "Same agent workflow, no refusal reflex. Exploit analysis, red-team tooling, adult fiction pipelines, scrapers other models lecture you about. You stay responsible for what you build.",
    },
    listNote:
      "Ids change as models get replaced. GET /models is the source of truth: if an id is not listed for your key, the API returns 404 model_not_found and never swaps in a different model.",
  },
  gotchas: {
    title: "Gotchas we hit",
    intro: "So you do not have to.",
    localeUrl:
      "Copy the base URL exactly, /api/<locale>/v1 included. Without the locale you get a redirect that some clients drop. Without /api you get an HTML page instead of JSON.",
    modelId:
      "Use the exact id from GET /models, like deepseek-v4.1-flash. Provider prefixes such as openai/ belong in the LiteLLM config only, never in the request.",
    paid: "HTTP 402 with paid_plan_required means the account has no paid plan yet. Any credit pack fixes it.",
    tools:
      "A model without tool support returns 400 tools_not_supported once the agent sends tools. Check supports_tools in GET /models.",
    bridgeKey:
      "Behind the bridge, a 401 can come from either side. LiteLLM rejects a wrong master key. {{appName}} rejects a wrong sk-unb key. The LiteLLM log says which.",
    rateLimit:
      "Each key allows 60 requests per minute. Agents fire many small calls. If you hit 429, give the agent its own key.",
  },
  cta: {
    title: "Wire it up in five minutes.",
    subtitle:
      "Create a key, paste one config, pick a model. The API docs cover every field, error code and streaming detail.",
    key: "Create an API key",
    docs: "Read the API docs",
  },
};
