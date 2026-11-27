export const translations = {
  summary:
    "{{appName}} is an AI chat platform with {{modelCount}} chat models from {{providerCount}} labs: mainstream, open and uncensored. You pick the filter level per chat. Pay per use with credits. Open source and self-hostable.",
  intro:
    "Chat, image, video, music, voice and transcription models on one credit balance. Use them in the browser, from the command line, as an MCP server or through an OpenAI and Anthropic compatible API. Built on next-vibe, an open source TypeScript framework where one endpoint definition becomes the web UI, the CLI command, the AI tool and the MCP tool.",
  facts: {
    heading: "Key facts",
    models:
      "Models: {{modelCount}} chat models ({{mainstream}} mainstream, {{open}} open, {{uncensored}} uncensored) from {{providerCount}} labs, plus {{mediaCount}} image, video, music, speech and transcription models.",
    free: "Free credits every month: {{guest}} without an account, {{signedIn}} with a free account, {{max}} with a free account and a confirmed newsletter subscription. No card needed.",
    paid: "Paid plans: {{plans}}. Every plan also bills yearly at 11 months' price (Starter: {{subYearPrice}} a year). Subscribers can top up with a one-time credit pack at {{packPrice}} for {{packCredits}} credits. Pack credits never expire.",
    planItem: "{{name}} {{price}} a month for {{credits}} credits",
    credit:
      "1 credit = {{creditValue}}. Every model page lists its price per message.",
    api: "API: OpenAI chat completions, OpenAI Responses and Anthropic Messages formats on one base URL ({{apiBaseUrl}}). The same key calls {{mediaCount}} media models through OpenAI-format endpoints: /v1/images/generations, /v1/images/edits, /v1/audio/speech, /v1/audio/transcriptions, /v1/audio/translations, /v1/videos, /v1/music (video and music run as async jobs). It needs a paid account: any plan, from {{subPrice}} a month. Free accounts get HTTP 402. No fixed rate limit: usage is billed per request from your credits, with generous abuse protection.",
    uncensored:
      "Uncensored tier: two kinds of models. Abliterated models are mainstream models changed so they stop dodging questions. Truly uncensored models like UncensoredLM are trained on books and documents banned from the mainstream internet, which gives them contrary political opinions. The uncensored tier needs a one-time 18+ confirmation.",
    openSource:
      "Open source: the app code is MIT licensed, the next-vibe framework core is GPL-3.0. Source code: {{repoUrl}}",
    referral:
      "Referral program: {{direct}}% recurring commission on referred payments, plus a {{upline}}% pool shared across {{levels}} upline levels. Paid out as credits or BTC/USDC, minimum payout {{minPayout}}.",
    languages:
      "Site languages: English ({{en}}), German ({{de}}), Polish ({{pl}}), French ({{fr}}), Italian ({{it}}), Spanish ({{es}}), Slovak ({{sk}}), and Hindi ({{hi}}).",
  },
  pages: {
    heading: "Main pages",
    models: "Models",
    modelsDesc:
      "every model with price per message, context window, content tier and head-to-head comparisons",
    pricing: "Pricing",
    pricingDesc: "free credits, the four plans and the credit pack top-up",
    api: "API docs",
    apiDesc: "base URL, authentication, chat and media endpoints, code samples",
    blog: "Blog",
    blogDesc: "guides, model comparisons and build notes",
    partners: "Partners",
    partnersDesc: "program for creators, newsletters and directories",
    earn: "Referral program",
    earnDesc: "how the commission and payouts work",
    selfHost: "Self-host",
    selfHostDesc: "run your own instance on your own hardware",
    framework: "next-vibe framework",
    frameworkDesc: "the open source stack behind {{appName}}",
    refusalIndex: "Refusal index",
    refusalIndexDesc:
      "the same questions to every model, every week: who answers, who hedges, who refuses",
    skills: "Skills",
    skillsDesc:
      "ready-made specialists and characters, each with its own prompt, model and tools",
    help: "Help",
    helpDesc: "FAQ and contact",
  },
  compare: {
    heading: "Comparisons",
  },
  blog: {
    heading: "Blog posts",
  },
  optional: {
    heading: "Optional",
    full: "Full version",
    fullDesc: "this file plus the complete model list",
    sitemap: "Sitemap",
    sitemapDesc: "every public page in every language",
    about: "About us",
    privacy: "Privacy policy",
    terms: "Terms of service",
    imprint: "Imprint",
  },
  full: {
    chatHeading: "Chat models",
    chatIntro:
      "Current chat models. Price per message is for a normal chat turn ({{inputTokens}} input tokens, {{outputTokens}} output tokens) on the cheapest provider.",
    chatLine:
      "{{lab}}, {{tier}}, {{context}} tokens context, about {{credits}} credits per message",
    legacyHeading: "Older chat models, still available",
    legacySuccessor: "replaced by {{successor}}",
    mediaHeading: "Media models",
    mediaLine: "{{lab}}, {{type}}",
    mediaTypes: {
      image: "image generation",
      video: "video generation",
      audio: "music generation",
      tts: "text to speech",
      stt: "speech to text",
    },
  },
};
