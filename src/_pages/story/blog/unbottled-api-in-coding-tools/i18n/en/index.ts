export const translations = {
  meta: {
    title: "Codex CLI and Claude Code on every model - {{appName}} API",
    description:
      "Codex CLI, Claude Code, OpenCode, Continue, Aider and Cline on one {{appName}} key. Claude, GPT, DeepSeek, GLM and uncensored models. One base URL, one command per tool.",
    category: "Developer Guide",
    imageAlt: "{{appName}} API inside coding tools",
    keywords:
      "{{appName}}, Codex CLI, Claude Code, OpenCode, Continue, Aider, Cline, OpenAI compatible API, Responses API, Anthropic Messages API, coding agent, uncensored models, custom provider",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "8 min read",
    title: "One key. Every model. Codex and Claude Code included.",
    subtitle:
      "Codex CLI and Claude Code now connect to {{appName}} directly, next to OpenCode, Continue, Aider and Cline. One base URL, one key, one command per tool.",
  },
  intro: {
    lead: "Your coding agent is locked to one vendor's models. Want a second opinion from another lab, a cheaper model for grunt work, or a model that does not refuse? That means another account, another key, another bill.",
    p2: "{{appName}} speaks all three formats coding agents use: OpenAI chat completions, the OpenAI Responses API and the Anthropic Messages API. Nothing to install in between. Point a tool at us once, then switch between Claude, GPT, DeepSeek, GLM, Kimi, Qwen and the uncensored models by changing one model id.",
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
      "Same credits as the chat app, same prices. Every response reports what it cost.",
  },
  setup: {
    title: "Get a key and a base URL",
    intro: "Two values. Every tool below needs exactly these.",
    p1: "Create a key under Settings > API keys. It starts with sk-unb- and is shown once. The API is part of every paid plan: an active subscription or any credit pack unlocks it.",
    shortcut:
      "Fastest path: right after you create a key, the API keys page shows every block below with your key already filled in. Pick your tool, copy, run.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "For OpenAI-style tools: Codex, OpenCode, Continue, Aider, Cline. The locale in the path only changes the language of error messages.",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "For Claude Code and Anthropic SDKs. Same URL without /v1: they add /v1/messages themselves.",
    p2: "Keep the key in an environment variable, never in a file you commit. The curl call proves the key works and lists every model id your account can call, with context size, tool support and credit prices.",
  },
  compat: {
    title: "Every tool connects directly",
    intro:
      "Coding agents speak three different wire formats. We serve all three, on the same key and the same models.",
    codex: "Codex CLI: OpenAI Responses API.",
    claudeCode: "Claude Code: Anthropic Messages API.",
    chat: "OpenCode, Continue, Aider, Cline: OpenAI chat completions.",
    other:
      "Anything else with a base URL field works the same way: base URL, key, model id.",
  },
  wire: {
    responses: "Responses API",
    messages: "Messages API",
    chat: "Chat completions",
  },
  codex: {
    intro:
      "OpenAI's terminal agent. Reads your repo, runs commands, edits files.",
    p1: "Codex speaks the Responses API, and so do we. The one command defines the provider inline: nothing to edit, nothing to install. For daily use, append the config once and start Codex with the profile.",
    p2: 'Switch models with -m or the model line in the profile. Keep wire_api = "responses": current Codex accepts nothing else.',
  },
  claudeCode: {
    intro:
      "Anthropic's terminal agent. Plans, edits, runs tests, spawns subagents.",
    p1: "Claude Code reads its gateway from environment variables. ANTHROPIC_BASE_URL is the base URL without /v1. ANTHROPIC_MODEL sets the main model. The OPUS and SONNET defaults cover the model picker and plan mode, the HAIKU default moves background jobs such as session titles to a cheap model, and CLAUDE_CODE_SUBAGENT_MODEL covers subagents. CLAUDE_CODE_MAX_CONTEXT_TOKENS tells Claude Code the real context size of a non-Claude model, so it compacts at the right point.",
    p2: "Want Claude itself? Drop the model lines. Claude Code asks for its usual Claude ids and we route them to our matching Claude model, billed in credits.",
    p3: "Claude Code sends a big system prompt, over 30k input tokens even for a trivial task. A cheap default model keeps that affordable.",
  },
  opencode: {
    intro: "Open-source terminal agent with a TUI and a headless run mode.",
    p1: "Save the config as opencode.json in your project, or as ~/.config/opencode/opencode.json for every project. The key stays in your environment. Add any id from GET /v1/models to the models map, then pick one with /models in the TUI.",
    gotcha:
      "Update OpenCode first. Old 1.0.x builds pull the newest @ai-sdk/openai-compatible package and crash after the first tool call with DecimalError: Invalid argument. 1.19.5 runs the same config clean.",
  },
  continue: {
    intro: "Coding assistant for VS Code and JetBrains, plus the cn CLI.",
    p1: "secrets.UNBOTTLED_API_KEY resolves from your environment. Add -p with a prompt for a headless run. The IDE extension reads ~/.continue/config.yaml: put the same model entry there.",
  },
  aider: {
    intro: "Pair programming in your terminal, commits included.",
    p1: "One command, no config file. Aider wants openai/ in front of the model id and strips it before it calls us. --edit-format diff keeps edits small; without it Aider falls back to resending whole files for model ids it does not know. Name the files to edit on the command line, as usual with Aider.",
  },
  cline: {
    intro: "Autonomous coding agent, in VS Code and as a CLI.",
    p1: "Two commands with the Cline CLI: save the provider once, then run cline. Base URL, key and model id are the same three values as everywhere else.",
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
      "Ids change as models get replaced. GET /v1/models is the source of truth: if an id is not listed for your key, the API returns 404 model_not_found. The one mapping is for Claude Code: its built-in Claude ids go to our newest Claude of the same family.",
  },
  gotchas: {
    title: "Gotchas we hit",
    intro: "So you do not have to.",
    localeUrl:
      "Copy the base URL exactly, /api/<locale>/v1 included. Without the locale you get a redirect that some clients drop. Without /api you get an HTML page instead of JSON.",
    anthropicUrl:
      "Claude Code gets the base URL without /v1. With /v1 it calls /v1/v1/messages and gets a 404.",
    modelId:
      "Use the exact id from GET /v1/models, like {{model}}. Aider wants openai/ in front. Claude Code's built-in Claude ids are mapped for you to our newest Claude of the same family. Any other unknown id returns 404 model_not_found.",
    paid: "HTTP 402 with paid_plan_required means the account has no paid plan yet. Any credit pack fixes it.",
    tools:
      "A model without tool support returns 400 tools_not_supported once the agent sends tools. Check supports_tools in GET /v1/models.",
    rateLimit:
      "Each key allows 60 requests per minute. Agents fire many small calls. If you hit 429, give the agent its own key.",
  },
  cta: {
    title: "Wired up in one command.",
    subtitle:
      "Create a key, copy the block for your tool, pick a model. The API docs cover every endpoint, field, error code and streaming detail.",
    key: "Create an API key",
    docs: "Read the API docs",
  },
};
