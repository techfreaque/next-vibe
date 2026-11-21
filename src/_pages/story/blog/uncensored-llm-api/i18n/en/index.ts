export const translations = {
  meta: {
    title:
      "Uncensored LLM API: Abliterated Models, OpenAI Format | {{appName}}",
    description:
      "An uncensored LLM API for abliterated and uncensored models. OpenAI and Anthropic compatible, model ids, context and prices per model, a working curl and Python example, limits and privacy.",
    category: "Developer Guide",
    imageAlt: "Uncensored LLM API with OpenAI-compatible endpoints",
    keywords:
      "uncensored LLM API, uncensored AI API, abliterated model API, abliterated LLM API, uncensored OpenAI compatible API, NSFW LLM API, API without content filter, uncensored chat completions API, hosted abliterated models, Venice API alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "8 min read",
    title: "Uncensored LLM API. Your SDK. No refusal reflex.",
    subtitle:
      "{{count}} uncensored models behind one OpenAI and Anthropic compatible key. Model ids, context and prices read live from our registry.",
  },
  intro: {
    lead: "Your app needs a model that answers. Not one that lectures, not one that refuses half your test prompts. Mainstream APIs filter by design, and running abliterated weights yourself means renting GPUs.",
    p2: "{{appName}} serves {{count}} uncensored models over the same /v1 endpoints as every mainstream model. Change the base URL, keep the OpenAI or Anthropic SDK, pick an uncensored model id. Here is the list, the code, the limits, and the honest catch.",
    access:
      "Up front: the API needs a paid account. Any plan, from {{subPrice}} a month, unlocks it. Free and bonus credits don't.",
    accessLink: "Unlock the API",
  },
  models: {
    title: "{{count}} uncensored models on the API",
    intro:
      "Every current uncensored text model, cheapest first. Use the id exactly as shown in the model field.",
    colModel: "Model",
    colId: "Model id",
    colContext: "Context",
    colTools: "Tools",
    colPrice: "Per message",
    yes: "Yes",
    no: "No",
    footnote:
      "Per message is one reference exchange on the cheapest route. The API bills per token, and every response reports the exact charge in usage.credits_charged. GET /v1/models returns the same list with per-token prices.",
  },
  code: {
    title: "One request",
    intro:
      "The cheapest uncensored model right now is {{example}}. Swap in any id from the table.",
    prompt:
      "Give me the strongest case for and against nuclear power. No disclaimers.",
    curl: "curl",
    python: "OpenAI Python SDK",
    anthropic:
      "Prefer the Anthropic SDK or Claude Code? Point them at the same base URL without /v1 and they call /v1/messages with the same models and the same key.",
  },
  consent: {
    title: "The one 18+ step",
    intro: "Uncensored models are adults only. The API checks it once.",
    where: "Confirm you are 18 or older once, on the API keys page.",
    link: "Open API keys",
    error:
      "Without it, a request to an uncensored model returns 403 uncensored_consent_required, and nothing is charged.",
    once: "After that, your keys can call the uncensored models.",
  },
  kinds: {
    title: "Which uncensored model for which job",
    intro: "Three kinds sit in that table. They behave differently.",
    abliterated:
      "Abliterated: a mainstream or open model with the refusal behaviour cut out of its weights. Same training, same knowledge, same worldview. It just answers. The default for most apps.",
    fineTuned:
      "Fine-tuned: an open model trained further on unfiltered data. Often looser in tone, popular for fiction and roleplay.",
    own: "{{ownModel}}: trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. Use it when you want the takes mainstream models won't give.",
    link: "Abliterated, fine-tuned or own worldview: the full explainer",
  },
  limits: {
    title: "Limits you should know",
    intro: "The hard edges, before you ship.",
    stateless:
      "Stateless. No conversation is kept on our side. Send the full history every turn.",
    maxTokens: "Output is capped at {{maxTokens}} tokens per request.",
    rateLimit:
      "{{rateLimit}} requests per minute per key by default. Over the limit you get 429 with a Retry-After header.",
    tools:
      "Tool calls only work on models that support them. The table shows which do. Otherwise you get 400 tools_not_supported.",
    refusals:
      "Uncensored is not infallible. A model can still decline a request or get facts wrong. Test your prompts on two models before you commit.",
  },
  privacy: {
    title: "What happens to your prompts",
    intro: "We keep the bill, not the conversation.",
    noStore:
      "The API stores no conversation and creates no threads. What stays on our side is the billing record: which model, how many credits.",
    upstream:
      "Your prompt goes to the provider that serves the model. Its terms apply to what it receives.",
    callout:
      "If prompts may never leave your infrastructure, run abliterated weights on your own hardware. Everything else: the API is faster to ship.",
  },
  others: {
    title: "Other uncensored APIs, honestly",
    intro:
      "We are not the only option. We buy from some of these ourselves. Facts from their own docs and pricing pages.",
    versusLink: "{{appName}} vs {{name}}: full comparison",
    routerLink:
      "Switching from OpenRouter: one key for every model, three wire formats",
  },
  faq: {
    title: "FAQ",
    free: {
      q: "Is there a free uncensored LLM API?",
      a: "Not here. The chat app has free credits, the API does not. Any plan, from {{subPrice}} a month, unlocks API keys. Local runners like Ollama give you a free local API if your hardware can hold the model.",
    },
    ids: {
      q: "Which model ids are uncensored?",
      a: "Right now {{count}} of them, listed in the table above with their exact ids. GET /v1/models returns every model your key can call, with prices and tool support.",
    },
    sdk: {
      q: "Does the uncensored API work with the OpenAI SDK?",
      a: "Yes. Set base_url to the {{appName}} base URL, use your key, and put an uncensored model id in the model field. The Anthropic SDK works too, against the same base URL without /v1.",
    },
    refuse: {
      q: "Will an uncensored model never refuse?",
      a: "It refuses far less, not never. Abliterated models lose the trained refusal reflex but can still decline or get things wrong. Test with your real prompts.",
    },
    logs: {
      q: "Does {{appName}} log my API prompts?",
      a: "No conversation is stored from the API, only the billing record: model and credits charged. The provider that serves the model sees the prompt, under its own terms.",
    },
    local: {
      q: "Should I host abliterated models myself instead?",
      a: "If you have the GPUs and strict data rules, yes. A local runner exposes an OpenAI-compatible API on your own machine. If you want frontier-size uncensored models without renting hardware, a hosted API is cheaper to start.",
    },
    docsLink: "Read the full API reference",
    directoryLink: "Browse the abliterated models in chat",
  },
  cta: {
    title: "Try the models first. Then wire them in.",
    subtitle:
      "Every model in the table also runs in the chat app. Test your prompts there, then copy the id into your code.",
    chat: "Test an uncensored model in chat",
    docs: "Read the API docs",
  },
};
