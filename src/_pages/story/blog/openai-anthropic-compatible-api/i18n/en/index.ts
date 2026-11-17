export const translations = {
  meta: {
    title:
      "{{modelCount}} models, one API: OpenAI and Anthropic compatible | {{appName}}",
    description:
      "One {{appName}} key for {{modelCount}} models. OpenAI chat completions, Responses API and Anthropic Messages on one endpoint. Works with Claude Code and Codex CLI. Plus {{mediaModelCount}} image, voice, video and music models in OpenAI format.",
    category: "Developer Guide",
    imageAlt: "{{appName}}: one API endpoint for every model",
    keywords:
      "{{appName}}, OpenRouter alternative, one API for GPT Claude Gemini, OpenAI compatible API, OpenAI compatible API many models, Anthropic API compatible endpoint, Anthropic Messages API, Responses API, use Claude Code with other models, Codex CLI custom provider, LLM API gateway, uncensored models API, OpenAI compatible image API, text to speech API, Whisper API, video generation API, music generation API",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "11 min read",
    title: "One API key. {{modelCount}} models. Three wire formats.",
    subtitle:
      "{{appName}} speaks OpenAI chat completions, the OpenAI Responses API and the Anthropic Messages API on one endpoint. Your SDK stays. Your tools stay. Only the base URL changes. The same key also runs {{mediaModelCount}} image, voice, video and music models.",
  },
  intro: {
    lead: "GPT from OpenAI, Claude from Anthropic, Gemini from Google. Three SDKs, three keys, three bills, three dashboards. Or worse: the tool you like only speaks one format, so it only gets one vendor's models.",
    p2: "{{appName}} puts {{modelCount}} chat models from {{providerCount}} labs behind one key and one credit balance. Call them in the OpenAI format, the Responses format or the Anthropic format. Same models on every endpoint. Here is exactly how it works, what it costs, and where going direct or using a router is the better call.",
    access:
      "Up front: the API needs a paid account. Any plan, from {{subPrice}} a month, unlocks it. Free and bonus credits don't.",
    accessLink: "Unlock the API",
  },
  endpoints: {
    title: "Every endpoint, one key",
    intro:
      "Every endpoint takes the same key and bills the same balance. The three chat formats serve the same models.",
    chat: "POST /v1/chat/completions: OpenAI Chat Completions. Streaming over SSE that ends with data: [DONE], stream_options.include_usage, tool calling. The format almost every OpenAI compatible client speaks.",
    responses:
      "POST /v1/responses: the OpenAI Responses API, the format Codex CLI speaks. Streaming and tools. Stateless: store is false and previous_response_id is rejected with 400, so send the full input each turn.",
    messages:
      "POST /v1/messages: the Anthropic Messages API. Streaming and tool use. This is what Claude Code and the Anthropic SDKs talk to.",
    countTokens:
      "POST /v1/messages/count_tokens: costs no credits. A local estimate, no model call, and it does not count against your per-minute rate limit. Claude Code calls it constantly to size its context.",
    models:
      "GET /v1/models: every model your key can call right now, with context length, tool support and prices. One response body that both the OpenAI and the Anthropic SDKs parse.",
    media:
      "Media in OpenAI format, {{mediaModelCount}} models: POST /v1/images/generations and /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions and /v1/audio/translations. Video (POST /v1/videos) and music (POST /v1/music) run as async jobs: start, poll, download. GET /v1/models marks each model with its modality.",
    auth: "Auth works two ways, on every endpoint. Authorization: Bearer sk-unb-... for OpenAI clients and for Claude Code with ANTHROPIC_AUTH_TOKEN. x-api-key: sk-unb-... for the Anthropic SDKs. Keys start with sk-unb-, are shown once and stored only as a hash. Create them under Settings > API keys, up to 20 active keys per account.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "For OpenAI SDKs and OpenAI-style tools. The locale is part of the path. It only sets the language of error messages, and any supported locale works, but it has to be there.",
    anthropicBaseUrlLabel: "Anthropic base URL",
    anthropicBaseUrlNote:
      "For the Anthropic SDKs and Claude Code. Same URL without /v1: they append /v1/messages themselves.",
  },
  samples: {
    title: "Code: your SDK, our base URL",
    intro:
      "No new client library. The official OpenAI and Anthropic SDKs work as they are. Replace sk-unb-YOUR_KEY with your key.",
    curl: {
      title: "curl",
      body: "The fastest proof that your key works. A plain chat completion, nothing to install.",
      caption: "Chat completions with curl",
    },
    openai: {
      title: "OpenAI Python SDK",
      body: "Set base_url and api_key on the client, then call chat.completions.create as usual. Any model from GET /v1/models goes in the model field, Claude and Gemini included.",
      caption: "Chat completions with the OpenAI SDK",
      responses:
        "The same client also speaks the Responses API. Call client.responses.create. Remember it is stateless here: pass the whole conversation as input every turn.",
      responsesCaption: "Responses API with the OpenAI SDK",
    },
    anthropic: {
      title: "Anthropic Python SDK",
      body: "Set base_url without /v1 and your key as api_key, then call messages.create. Reasoning models put a thinking block first, so the sample prints the text block, not the first block.",
      caption: "Messages API with the Anthropic SDK",
      countTokens:
        "Need a size before you send? count_tokens returns an estimate without calling a model. No credits spent.",
      countTokensCaption: "Count tokens with curl",
    },
    models: {
      title: "List the models",
      body: "GET /v1/models is the source of truth. It shows exactly which ids your key can call, with context length, tool support and price per token.",
      caption: "List models with curl",
    },
    media: {
      title: "Images, voice, video, music",
      body: "Same key, same base URL, OpenAI's media shapes. The OpenAI SDK's images and audio clients work unchanged. Pick a model with the matching modality from GET /v1/models.",
      imageCaption: "Generate an image with curl",
      async:
        "Video and music take minutes, so they run as jobs. POST answers at once with an id. Poll it for free, then download the file. A failed job costs nothing.",
      videoCaption: "Start a video job",
      pollCaption: "Poll it, then download the MP4",
    },
  },
  ids: {
    title: "Model ids: ours, or the vendor's",
    intro:
      "You do not have to rewrite configs that already name a model. We accept the common spellings.",
    ours: "Our ids, as GET /v1/models lists them: claude-sonnet-5.5, gpt-6.1-sol, glm-5.3. Use these when you start fresh.",
    vendor:
      "Vendor spellings work too. Date-stamped Anthropic ids (claude-sonnet-4-5-20250929 resolves to claude-sonnet-4.5), dashed version numbers, -latest suffixes, the [1m] context suffix, and dotted ids like gpt-5.5.",
    prefix:
      "Provider prefixes such as anthropic/... or openai/..., so OpenRouter-style ids from an existing config keep working.",
    claudeFallback:
      "On /v1/messages only: a Claude id your account cannot call, like the built-in ids Claude Code sends for its background calls, falls back to the newest Claude of the same family (Opus, Sonnet or Haiku) that you can call. Claude Code works without extra env vars. Any other unknown id returns 404 model_not_found.",
  },
  tools: {
    title: "Use Claude Code and Codex CLI with other models",
    intro:
      "Both connect directly. No proxy, no translation layer, nothing to install.",
    p1: "Every snippet defaults to {{model}}. It passed real Claude Code and Codex CLI runs, calls tools reliably and costs little per output token. Swap it for any id once things work.",
    claudeCode:
      "That is the whole answer to using Claude Code with other models. ANTHROPIC_BASE_URL points it at us, ANTHROPIC_AUTH_TOKEN carries your key, and the model variables decide what runs. Replace the model id with any id from GET /v1/models: GPT, Gemini, Kimi, DeepSeek or an uncensored model. CLAUDE_CODE_MAX_CONTEXT_TOKENS is set to that model's real context window, so Claude Code compacts at the right point.",
    codex:
      "Codex CLI gets a custom model provider with wire_api set to responses. It talks the Responses API to us exactly as it does to OpenAI. Change the model with -m.",
    others:
      "OpenCode, Continue, Aider and Cline work too, all tested. Their setups, the permanent config files and the gotchas we hit are in the coding tools guide.",
    guideLink: "Set up every coding tool",
  },
  picks: {
    title: "Which model for which job",
    intro:
      "Every model below supports tool calling. Click a name for its price and specs, copy the id into your code.",
    frontier: {
      title: "Frontier: the hardest code and reasoning",
      body: "Large refactors, unfamiliar codebases, long reasoning chains. Higher price per token, fewer wrong turns.",
    },
    cheap: {
      title: "Cheap and fast: loops, bulk, background calls",
      body: "Agent loops that send big prompts, batch jobs, classification, the background calls coding tools fire all day. A fraction of frontier prices.",
    },
    uncensored: {
      title: "Uncensored: no refusal reflex",
      body: "GLM 5.3 Uncensored and Qwen 3.6 Plus Uncensored are mainstream models with the refusals removed. UncensoredLM v1.2 is different: trained on books and documents banned from the mainstream internet, not just a stripped model. Same API, same tools.",
    },
    compare:
      "Torn between two? The comparison pages put two models side by side.",
    compareLink: "{{a}} vs {{b}}",
    allModels: "All {{modelCount}} models",
  },
  billing: {
    title: "What it costs",
    intro: "Credits, billed per token. No seat fees.",
    price:
      "Most models bill at their listed per-token price plus our markup. Cached input tokens bill at the model's cache price. Models served through OpenRouter bill the real cost OpenRouter charged for the call, plus the same markup.",
    reported:
      "Every response reports usage.credits_charged. You never have to guess what a call cost.",
    preflight:
      "Before a call runs, your balance is checked against a worst-case estimate. Not enough means HTTP 402 insufficient_credits: nothing runs, nothing is charged.",
    abort:
      "Streaming: close the connection and generation stops. You pay only for what ran. Same if the provider fails mid-stream.",
    chat: "Chat and API bill the same way. OpenRouter spreads a model across several hosts, and some charge more than the cheapest one we list. So for those models the listed price is an estimate, and usage.credits_charged is the real number. If OpenRouter reports no cost for a call, it bills at the listed price.",
    media:
      "Media bills the same way: the provider's real cost plus our markup where the provider reports it, the listed per-model price otherwise. Images per image, voice per character, transcription per second of audio, video and music once the file is ready.",
    paid: "Same credit balance as the chat app. The API itself needs a paid account: any plan. Free credits do not unlock it.",
    sub: "Monthly plans: four sizes, starting at {{subCredits}} credits for {{subPrice}}.",
    pack: "Credit packs: a top-up for subscribers, {{packCredits}} credits for {{packPrice}}. They never expire. Card, PayPal or crypto.",
    link: "See plans and pricing",
  },
  versus: {
    title: "Go direct, use a router, or use us?",
    intro: "Three honest options. Each is the right one for somebody.",
    direct: {
      title: "Going direct to OpenAI, Anthropic or Google",
      body: "The newest first-party features land there first. No middleman markup. One vendor's terms to read. If you only ever use one vendor's models, go direct.",
    },
    router: {
      title: "An aggregator such as OpenRouter",
      body: "Many models, pay as you go. Full disclosure: many of our models are served through OpenRouter. If raw routing is all you need, go there.",
    },
    here: {
      title: "{{appName}}",
      body: "One key across three wire formats: chat completions, Responses, and Anthropic Messages with count_tokens. Claude Code and Codex CLI connect without a proxy. Uncensored models sit next to mainstream ones, behind a one-time 18+ confirmation. The same balance pays for the chat app and the API, from subscription credits or packs. And {{appName}} is open source and self-hostable.",
    },
    verdict:
      "Bottom line: one vendor, go direct. Plain routing over the OpenAI format, a router does the job. Want Claude Code, Codex CLI and the OpenAI and Anthropic SDKs on one key, uncensored models included, with a chat app on the same balance? That is what we built this for.",
  },
  limits: {
    title: "Limits you should know",
    intro: "No surprises in production. These are the hard edges.",
    stateless:
      "Stateless. The Responses API runs with store set to false and rejects previous_response_id. Send the full history every turn. That holds for every endpoint.",
    maxTokens: "Output is capped at {{maxTokens}} tokens per request.",
    rateLimit:
      "{{rateLimit}} requests per minute per key by default. Over the limit you get 429 with a Retry-After header. Agents that fire many calls get their own key.",
    countTokens:
      "count_tokens is an estimate, not the provider's exact tokenizer. Good for sizing context, not for billing math.",
    tools:
      "Tool calls only work on models that support them. Otherwise you get 400 tools_not_supported. GET /v1/models shows supports_tools for every model.",
    consent:
      "Uncensored models need a one-time 18+ confirmation on the API keys page. Without it you get 403 uncensored_consent_required, and nothing is charged.",
    localeUrl:
      "The two classic setup mistakes, both a 404. One: dropping the locale from the path. The base URL is /api/<locale>/v1, not /api/v1. Two: keeping /v1 on the Anthropic base URL. Claude Code and the Anthropic SDKs append /v1/messages themselves, so /v1 twice means nothing is found.",
  },
  privacy: {
    title: "What happens to your prompts",
    intro: "Short version: we keep the bill, not the conversation.",
    noStore:
      "The API saves no conversation and creates no threads. What stays on our side is the billing record: which model, how many credits.",
    upstream:
      "Your prompt goes to the provider that serves the model. Its terms apply to what it receives.",
    incognito:
      "In the chat app, incognito chats live only in your browser's local storage, not on our servers.",
    selfHost:
      "Want full control? {{appName}} is open source (MIT and GPL v3). Run your own instance with your own provider keys and pay the providers directly.",
    selfHostLink: "Self-host it",
  },
  faq: {
    title: "FAQ",
    openrouter: {
      q: "Is {{appName}} an OpenRouter alternative?",
      a: "For many uses, yes: one key, many models, pay per token. The differences: {{appName}} speaks the Anthropic Messages API and the OpenAI Responses API natively, not just chat completions. It carries uncensored models. And the chat app runs on the same balance. Many of our models are served through OpenRouter underneath.",
    },
    claudeCode: {
      q: "Can I use Claude Code with non-Claude models?",
      a: "Yes. Set ANTHROPIC_BASE_URL to the {{appName}} Anthropic base URL, put your key in ANTHROPIC_AUTH_TOKEN and pick any model id from GET /v1/models. GPT, Gemini, GLM, Kimi, DeepSeek and the uncensored models all run in Claude Code that way.",
    },
    sdk: {
      q: "Do I need a new SDK?",
      a: "No. Use the official OpenAI and Anthropic SDKs. Change the base URL and the key. Nothing else.",
    },
    free: {
      q: "Is there a free tier for the API?",
      a: "No. The chat app has free credits, the API does not. It needs a plan, from {{subCredits}} credits a month for {{subPrice}}. Subscribers can top up with credit packs ({{packCredits}} credits for {{packPrice}}) that never expire.",
    },
    pricing: {
      q: "Is the listed price what I pay?",
      a: "For most models, yes: listed per-token price plus our markup. Models served through OpenRouter bill the real cost OpenRouter charged for the call, plus the same markup, in the chat app and on the API alike. Their listed price is an estimate. Every response reports the exact charge in usage.credits_charged.",
    },
    models: {
      q: "Which models can I call?",
      a: "{{modelCount}} chat models right now: Claude, GPT, Gemini, DeepSeek, Kimi, GLM, Qwen and uncensored models. Plus {{mediaModelCount}} image, video, music, voice and transcription models. GET /v1/models lists exactly what your key can call, with prices.",
    },
    data: {
      q: "Does {{appName}} store my prompts?",
      a: "Not from the API. No conversation is stored, only the billing record: model and credits charged. The provider that serves the model does see the prompt, under its own terms.",
    },
    docsLink: "Read the full API reference",
    pricingLink: "See plans and pricing",
  },
  partners: {
    body: "Building tools or content for developers? The {{appName}} partner program pays you a recurring share of every payment you refer.",
    link: "Join the partner program",
  },
  cta: {
    title: "One key. Every model. Start now.",
    subtitle:
      "Create a key, change one base URL, keep your SDK. The API docs cover every endpoint, field and error code.",
    key: "Create an API key",
    docs: "Read the API docs",
  },
};
