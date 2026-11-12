export const translations = {
  meta: {
    title: "{{appName}} API Docs - OpenAI-Compatible /v1",
    description:
      "One endpoint, {{modelCount}} models. Drop-in OpenAI API: chat completions, streaming, tool calling. Authenticate with an sk-unb key, pay per token in credits.",
    category: "API",
    imageAlt: "{{appName}} OpenAI-compatible API docs",
    keywords:
      "api, openai compatible, chat completions, streaming, function calling, tools, {{appName}}",
  },
  nav: {
    quickstart: "Quickstart",
    auth: "Authentication",
    models: "Models",
    chat: "Chat completions",
    tools: "Tool calling",
    billing: "Credits and billing",
    limits: "Rate limits",
    errors: "Errors",
    codingTools: "Coding tools",
  },
  hero: {
    badge: "OpenAI-compatible API",
    title: "One base URL.",
    titleHighlight: "Every model.",
    subtitle:
      "Point any OpenAI SDK at {{appName}}. {{modelCount}} models, streaming, tool calling. Your key, your credits, no new client to learn.",
    ctaKey: "Get an API key",
    ctaPricing: "See plans",
  },
  quickstart: {
    title: "Call a model in 60 seconds",
    intro:
      "The API speaks the OpenAI wire format. If your code runs against OpenAI, it runs here after two changes: the base URL and the key.",
    baseUrlLabel: "Base URL",
    baseUrlNote:
      "Any locale works in the path (en-US, de-DE, pl-PL). It only changes the language of error messages.",
    step1: {
      title: "Get a key",
      description:
        "Create an sk-unb key under Settings > API keys. It is shown once. The API is part of every paid plan: an active subscription or a credit pack purchase unlocks it.",
    },
    step2: {
      title: "Send a request",
      description: "Plain HTTP. Works from any language.",
    },
    step3: {
      title: "Or use an OpenAI SDK",
      description: "Change baseURL and apiKey. Nothing else.",
      python: "Python",
      node: "Node.js",
    },
  },
  access: {
    title: "Paid plans only",
    body: "Creating keys and calling /v1 requires a paid account: an active subscription, or at least one credit purchase. Free-tier accounts get HTTP 402 with code paid_plan_required, and can still read these docs. Credits stay yours: buy a pack once and the API keeps working until the balance runs out.",
  },
  auth: {
    title: "Authentication",
    intro:
      "Send your key as a Bearer token on every request. Keys start with sk-unb-.",
    header: "Authorization: Bearer sk-unb-YOUR_KEY",
    points: {
      hash: "We store a hash, not the key. Lose it and you create a new one.",
      scope:
        "A key works on /v1 only. It cannot touch your account, payments or settings.",
      limit:
        "Up to 20 active keys per account. Revoke any key at any time: it stops working at once.",
      missing:
        "No key or a revoked key returns 401. A key whose account has no paid plan returns 402.",
    },
  },
  models: {
    title: "GET /v1/models",
    intro:
      "Lists the models your key can call right now, with context size, tool support and credit prices per million tokens. Use the id as the model field in requests.",
    note: "The list depends on your account. Unknown or unavailable ids return 404 model_not_found. The API never silently swaps your model.",
  },
  chat: {
    title: "POST /v1/chat/completions",
    intro:
      "Standard OpenAI chat completions. Messages in, one assistant message out. Text and image inputs (image_url as https URL or base64 data URL).",
    nonStream: {
      title: "Non-streaming",
      body: "The default. You get one JSON body when the model is done. usage.credits_charged is what this call cost you.",
    },
    stream: {
      title: "Streaming",
      body: "Set stream: true for server-sent events in the OpenAI chunk format, ended by data: [DONE]. Add stream_options.include_usage to get a final chunk with token counts and credits_charged. Closing the connection stops generation. You pay only for what ran.",
    },
    paramsTitle: "Request fields",
    paramsColumns: { field: "Field", description: "What it does" },
    params: {
      model: "Required. A model id from GET /v1/models.",
      messages:
        "Required. system, developer, user, assistant and tool messages. User content may be a string or text and image_url parts.",
      stream: "true for server-sent events. Default false.",
      streamOptions: "{ include_usage: true } adds a final usage chunk.",
      maxTokens:
        "Upper bound on generated tokens. max_completion_tokens takes precedence. Capped at 32768.",
      temperature: "0 to 2. Ignored by models that do not support it.",
      topP: "0 to 1.",
      stop: "A stop string or a list of them.",
      n: "Only 1 is supported. Other values return 400.",
      tools: "Function tools the model may call. See tool calling.",
      toolChoice: "none, auto, required, or one named function.",
    },
  },
  tools: {
    title: "Tool calling",
    intro:
      "Function calling works like OpenAI. You describe functions, the model decides to call one, you run it and send the result back. We never execute your tools.",
    flow: {
      title: "The loop",
      step1: "Send tools with your messages.",
      step2:
        "The model answers with tool_calls and finish_reason: tool_calls. Each call has an id, a function name and JSON-string arguments.",
      step3:
        "Run the function yourself. Append the assistant message, then one tool message per call with its tool_call_id.",
      step4: "Call again. The model uses the results and answers.",
    },
    requestTitle: "1. Request with tools",
    responseTitle: "2. The model asks for a call",
    followUpTitle: "3. Return the result",
    sdkTitle: "The same loop with the Python SDK",
    streamingTitle: "Streaming tool calls",
    streamingBody:
      "With stream: true, calls arrive as delta.tool_calls chunks, addressed by index. The first chunk for an index carries id and function.name. Later chunks append to function.arguments. Concatenate them, then parse the JSON when finish_reason is tool_calls. Every OpenAI SDK does this for you.",
    rules: {
      title: "Rules",
      support:
        "The model must support tools: check supports_tools in GET /v1/models. Others return 400 tools_not_supported.",
      choice:
        "tool_choice none, auto and required work as in OpenAI. Naming a function that is not in tools returns 400.",
      names:
        "Function names: letters, digits, underscore, dash, up to 64 characters.",
      billing:
        "Tool definitions and tool results are input tokens. Calls are output tokens. They bill like any other tokens.",
    },
  },
  billing: {
    title: "Credits and billing",
    intro:
      "The API draws from the same credits as the chat app, at the same prices. One balance, one bill.",
    points: {
      price:
        "Cost = input tokens plus output tokens at the model's credit price. Prices per million tokens are listed in GET /v1/models.",
      usage:
        "Every response reports usage.credits_charged. Your balance is in the app under Credits.",
      preflight:
        "Before a call runs we check your balance against a worst-case estimate. Not enough: HTTP 402 insufficient_credits, nothing runs, nothing is charged.",
      real: "After the call you pay the real token usage the provider reports, not the estimate.",
      topup:
        "Out of credits? Buy a pack or renew your plan. The next call works immediately.",
    },
  },
  limits: {
    title: "Rate limits",
    body: "Each key allows 60 requests per minute by default. Over the limit you get HTTP 429 with a Retry-After header in seconds. Back off for that long and retry. Limits are per key, so split heavy workloads across keys.",
  },
  errors: {
    title: "Errors",
    intro:
      "Errors use the OpenAI envelope, so SDKs raise their usual exceptions. Branch on error.code, not on the message.",
    columns: { status: "HTTP", code: "code", meaning: "Meaning" },
    rows: {
      missingKey: "No Authorization header. Send Bearer sk-unb-...",
      invalidKey: "Key is wrong or revoked.",
      paid: "Account has no paid plan. Subscribe or buy credits.",
      credits: "Balance too low for this call. Top up.",
      cap: "Free-tier daily cap reached. Credits fix it.",
      notFound: "Model does not exist or is not available to you.",
      invalid:
        "Bad request: unsupported parameter, bad tool_choice, bad image URL.",
      rate: "Over 60 requests per minute for this key. Read Retry-After.",
      upstream:
        "The model provider failed. Safe to retry. Streams end with an error event.",
      balance: "We could not read your balance, so nothing ran. Retry.",
    },
    streamNote:
      "Errors that happen mid-stream arrive as a data: event with the same error object, followed by data: [DONE].",
  },
  codingTools: {
    title: "Use it in your coding agent",
    intro:
      "Same base URL, same key. OpenCode and Continue connect directly. Add any id from GET /v1/models to the config.",
    opencodeTitle: "OpenCode",
    continueTitle: "Continue",
    bridgeTitle: "Codex CLI and Claude Code",
    bridgeBody:
      "Codex only speaks the Responses API, Claude Code only the Anthropic Messages API. Both work through a local LiteLLM bridge that converts to chat completions. The guide has tested configs for all four tools.",
    guide: "Read the coding tools guide",
  },
  cta: {
    title: "Build on every model.",
    subtitle: "Create a key, point your SDK here, ship.",
    button: "Create an API key",
    secondary: "Compare plans",
  },
};
