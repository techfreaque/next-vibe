export const translations = {
  meta: {
    title:
      "OpenRouter Alternatives With Uncensored Models (2026) | {{appName}}",
    description:
      "Compare OpenRouter with Vercel AI Gateway, LiteLLM, Portkey, Cloudflare, NanoGPT and {{appName}}. See hosted fees, self-hosting, filters and privacy.",
    category: "Developer Guide",
    imageAlt: "OpenRouter alternatives for developers, compared",
    keywords:
      "OpenRouter alternative, OpenRouter alternatives, OpenRouter vs NanoGPT, sites like OpenRouter, LLM API gateway, uncensored LLM API, one API key for all models, OpenAI compatible API, Anthropic compatible API, OpenRouter uncensored models, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "9 min read",
    title: "OpenRouter alternatives for routing model requests",
    subtitle:
      "{{count}} alternatives and {{appName}}, compared on API formats, uncensored coverage and fees. Checked {{date}}.",
  },
  intro: {
    lead: "OpenRouter routes one API key across many providers and offers a web chat. Its Standard plan lists a 5.5% platform fee. Compare other gateways if you want to run the router yourself, set more granular limits or change how you pay.",
    p2: "We checked hosted gateways, self-hosted proxies and apps with uncensored models against their official docs and pricing. We buy model access from OpenRouter too. {{openRouterModels}} of our models route through it.",
  },
  criteria: {
    title: "What to compare before you switch",
    intro: "Six questions decide it.",
    catalog:
      "Catalog: how many models, from how many labs, and are the ones you use today there?",
    uncensored:
      "Uncensored coverage: how many models with the refusals removed, and of which kind?",
    formats:
      "Formats: OpenAI chat completions only, or also the Responses API and the Anthropic Messages API that coding agents use?",
    billing:
      "Billing: list price plus a fee, a markup, or a subscription? And what happens at zero balance?",
    data: "Data: are prompts stored, logged or used for training, and is that opt-in?",
    chat: "Chat: can people who never write code use the same models in a browser?",
  },
  table: {
    title: "All of them, side by side",
  },
  us: {
    title: "{{appName}}: one key, every kind of model",
    intro:
      "{{modelCount}} chat models behind one key, {{uncensored}} of them uncensored.",
    models:
      "Models: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, GLM and Qwen next to {{uncensored}} uncensored models. {{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    formats:
      "Formats: OpenAI chat completions, the OpenAI Responses API and the Anthropic Messages API. Point any SDK or coding agent at one base URL.",
    billing:
      "Billing: one credit balance, our {{markup}}% markup on what we pay. Your first purchase unlocks API keys, plans start at {{apiSubPrice}} a month.",
    chat: "Chat: the same models in a web chat with folders, tools, image, video and music generation. Your non-developers get the models too.",
    openRouter:
      "OpenRouter inside: {{openRouterModels}} of our models route through OpenRouter. Same models, one account with the uncensored ones.",
    weak: "Where we are weaker: OpenRouter's catalog is much bigger, it lets you bring your own provider keys and pick providers per request, and its prices sit closer to list because we add a markup. If you need a rare model, OpenRouter probably has it.",
    codeLabel:
      "Moving an OpenAI SDK client over: change the base URL and the key",
    docsLink: "API docs: endpoints, auth and limits",
    formatsLink: "OpenAI and Anthropic compatible API, explained",
    toolsLink: "Use one key in Claude Code, Codex CLI, Aider and more",
  },
  models: {
    title: "{{apiUncensored}} uncensored models you can call today",
    intro:
      "Every uncensored model on the API, with the id you pass as model. Cheapest first.",
    colModel: "Model",
    colId: "API id",
    colContext: "Context",
    colPrice: "Per message",
    footnote:
      "Price of one reference message, our {{markup}}% markup included. The label under each name shows how a model was made.",
  },
  list: {
    title: "The {{count}} alternatives, one by one",
    intro:
      "From their own pages, checked {{date}}. What each one is, how its API works, which models it has and what it costs.",
    heading: "{{number}}. {{name}}: {{kind}}",
    api: "API:",
    models: "Models:",
    price: "Price:",
    priceValue: "Free tier: {{free}}. Paid: {{plans}}.",
    pro: "Best part:",
    con: "Catch:",
    forWho: "Pick it if:",
    versusLink: "{{appName}} vs {{name}}: full comparison",
    visit: "Visit {{name}}",
  },
  stay: {
    title: "When OpenRouter is still the right pick",
    intro: "Sometimes the original is the better tool.",
    rare: "You need a niche model or a specific provider that nobody else on this list serves.",
    callout:
      "Many teams run two: OpenRouter for the long tail, a second key for uncensored models and a chat their whole team can use.",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "What is the best OpenRouter alternative?",
      a: "Depends on what OpenRouter lacks for you. Many uncensored models, pay per use: NanoGPT. Venice's own models and privacy: Venice. Local and free: Ollama. Uncensored, open and mainstream models plus a team chat on one key: {{appName}}.",
    },
    cheaper: {
      q: "Is there a cheaper OpenRouter alternative?",
      a: "Compare the price per model, not the fee. Provider-direct APIs skip any middleman. Among gateways, prices differ per model and change often. On {{appName}} you pay what we pay plus a {{markup}}% markup, and every model page shows the price per message.",
    },
    uncensored: {
      q: "Which OpenRouter alternative has uncensored models?",
      a: "NanoGPT, Venice, uncensored.ai, Gab AI and {{appName}} all serve uncensored models over an API. {{appName}} has {{apiUncensored}} on its API right now, abliterated and fine-tuned ones next to {{ownModel}}.",
    },
    sdk: {
      q: "Can I keep my OpenAI SDK code?",
      a: "Yes. Change the base URL and the API key, keep the rest. Model ids differ per gateway, so swap those too. Example: {{example}}.",
    },
    anthropic: {
      q: "Does it work with Anthropic SDKs and coding agents?",
      a: "On {{appName}}, yes: the Anthropic Messages API runs next to the OpenAI formats, so Claude Code and other agents connect with one key, uncensored models included.",
    },
    free: {
      q: "Is there a free OpenRouter alternative?",
      a: "Ollama is free if your hardware can hold the model. OpenRouter itself has free models with daily limits. {{appName}} gives free chat credits every month, the API unlocks with your first purchase.",
    },
    apiLink: "Uncensored LLM API: model ids, code and limits",
    veniceLink: "Venice AI alternatives, compared",
    keysLink: "Manage your API keys",
  },
  cta: {
    title: "One key. Every model. Fewer refusals.",
    subtitle:
      "Try the models in chat first, {{guestCredits}} free credits a month, no account needed.",
    start: "Try an uncensored model",
    docs: "Read the API docs",
  },
};
