export const translations = {
  meta: {
    title: "Uncensored LLM API: Abliterated Models, OpenAI SDK | {{appName}}",
    description:
      "Uncensored and abliterated models on one OpenAI and Anthropic compatible API. Model ids, prices vs other hosts, what Vertex, Azure and Bedrock allow, code.",
    category: "Developer Guide",
    imageAlt: "Uncensored LLM API with OpenAI-compatible endpoints",
    keywords:
      "uncensored LLM API, uncensored AI API, abliterated model API, abliterated LLM API, LLM API without content filter, LLM API no content filter, uncensored OpenAI compatible API, NSFW LLM API, Gemini API safety settings off, Vertex AI uncensored, Together AI uncensored, uncensored Azure OpenAI alternative, uncensored Bedrock alternative, hosted abliterated models, Venice API alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Developer Guide",
    readTime: "12 min read",
    title: "Uncensored LLM API. Your SDK. No refusal reflex.",
    subtitle:
      "{{count}} uncensored models behind one OpenAI and Anthropic compatible key. Model ids, context and prices read live from our registry.",
  },
  intro: {
    lead: "Your app needs a model that answers. Not one that lectures, not one that refuses half your test prompts. Mainstream APIs filter by design, and running abliterated weights yourself means renting GPUs.",
    p2: "{{appName}} serves {{count}} uncensored models over the same /v1 endpoints as every mainstream model. Change the base URL, keep the OpenAI or Anthropic SDK, pick an uncensored model id. Here is the list, the code, prices next to other hosts, what the big clouds really allow, and the honest catch.",
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
      "No fixed rate limit. Usage is billed per request from your credits, and generous abuse protection applies. Upstream provider 429s pass through with a Retry-After header.",
    tools:
      "Tool calls only work on models that support them. The table shows which do. Otherwise you get 400 tools_not_supported.",
    refusals:
      "Uncensored is not infallible. A model can still decline a request or get facts wrong. Test your prompts on two models before you commit.",
  },
  privacy: {
    title: "What happens to your prompts",
    intro: "The API keeps the bill, not a chat history.",
    noStore:
      "The API creates no chat threads. What it records is the billing entry: which model, how many credits.",
    upstream:
      "Every prompt passes through us to the provider that serves the model. Its terms apply to what it receives. Our privacy policy makes no separate no-logging or no-training promise, so judge us by what it does say.",
    callout:
      "If prompts may never leave your infrastructure, run abliterated weights on your own hardware. Everything else: the API is faster to ship.",
  },
  abliterated: {
    title: "Abliterated model API: who serves which weights",
    intro:
      "The same abliterated weights sit on several hosts. Here is what each charges per token, read today from their public model lists.",
    honest:
      "Honest read: the routers win on price. OpenUncensored and Refuseless sell GLM 5.3 Flash and DeepSeek V4.1 Flash abliterated at $0.12 input. Our listed price carries a {{markup}}% markup. You pay it for one key across uncensored, open and mainstream models, media, the Anthropic format and a chat your team can use.",
  },
  noFilter: {
    title: "LLM API without a content filter: what off really means",
    intro:
      "Every big cloud lets you lower a filter. None of them removes the model's trained refusals or its usage policy.",
    vertex:
      "Vertex AI and the Gemini API: safety thresholds go to OFF, and OFF is the default on Vertex from gemini-3.5-flash. Child safety and other core harms stay blocked, and Gemini's alignment still refuses. Google's Prohibited Use Policy bans sexually explicit content and circumventing safety filters, with exceptions for educational, documentary, scientific or artistic work. Own weights: Model Garden self-deploy on vLLM or TGI containers.",
    together:
      "Together AI: 24 serverless chat models, none uncensored. Its terms bar obscene content and pornography. Own weights run on dedicated endpoints from $5.49 per H100 hour, and uploads must be fine-tunes of an architecture Together already supports.",
    azure:
      "Azure OpenAI: filters on by default, off only after an approved application, and the Code of Conduct bans erotic and romantic chatbots either way.",
    bedrock:
      "AWS Bedrock: no filter unless you attach a Guardrail, but refusals and the AWS policy stay. Abliterated weights need Custom Model Import, billed per capacity minute.",
    azureLink: "Uncensored Azure OpenAI alternatives, in full",
    bedrockLink: "Uncensored AWS Bedrock alternatives, in full",
  },
  others: {
    title: "Other uncensored APIs, honestly",
    intro:
      "We are not the only option. We buy from some of these ourselves. Facts from their own docs, model lists and pricing pages, read {{date}}.",
    versusLink: "{{appName}} vs {{name}}: full comparison",
    routerLink:
      "Switching from OpenRouter: one key for every model, three wire formats",
    openRouterAlternatives: "OpenRouter alternatives, compared",
    veniceAlternatives: "Venice AI alternatives, compared",
    freedomGptAlternatives: "FreedomGPT alternatives, compared",
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
      a: "The API writes no chat threads, only the billing record: model and credits charged. Every prompt passes through us to the provider that serves the model, under its own terms. Our privacy policy makes no separate no-logging promise. If you need that as a contract, self-host.",
    },
    abliterated: {
      q: "Which API serves abliterated models?",
      a: "OpenUncensored, Refuseless, NEAR AI Cloud, NanoGPT, Venice and {{appName}} all serve abliterated weights over an OpenAI-compatible API. The routers are cheapest per token. {{appName}} adds mainstream models, media and a web chat on the same key.",
    },
    noFilter: {
      q: "Is there an LLM API without a content filter?",
      a: "Bedrock without a Guardrail and Gemini with safety settings OFF add no filter layer, but their models keep trained refusals and their policies ban sexual content. Azure needs an approved application to turn filters off. For models that don't refuse, use abliterated or fine-tuned weights: hosted here or on the routers above, or on your own GPUs.",
    },
    vertex: {
      q: "Can I turn off Gemini safety filters?",
      a: "Yes. On the Gemini API, categories you don't set default to Off for Gemini 2.5 and later, and on Vertex OFF is the default from gemini-3.5-flash. Core harms such as child safety stay blocked, Gemini's trained refusals stay, and Google's policy bans sexually explicit content and circumventing safety filters.",
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
