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
    paid: "Paid: a subscription at {{subPrice}} per month or {{subYearPrice}} per year with {{subCredits}} credits a month, or a one-time credit pack at {{packPrice}} for {{packCredits}} credits. Pack credits never expire.",
    credit:
      "1 credit = {{creditValue}}. Every model page lists its price per message.",
    api: "API: OpenAI chat completions, OpenAI Responses and Anthropic Messages formats on one base URL ({{apiBaseUrl}}). It needs a paid account: any subscription or one credit purchase, for example the {{packPrice}} pack. Free accounts get HTTP 402.",
    uncensored:
      "Uncensored tier: two kinds of models. Abliterated models are mainstream models changed so they stop dodging questions. Truly uncensored models are trained on different material. The uncensored tier needs a one-time 18+ confirmation.",
    openSource:
      "Open source: the app code is MIT licensed, the next-vibe framework core is GPL-3.0. Source code: {{repoUrl}}",
    referral:
      "Referral program: {{direct}}% recurring commission on referred payments, plus a {{upline}}% pool shared across {{levels}} upline levels. Paid out as credits or BTC/USDC, minimum payout {{minPayout}}.",
    languages:
      "Every page exists in English ({{en}}), German ({{de}}) and Polish ({{pl}}).",
  },
  pages: {
    heading: "Main pages",
    models: "Models",
    modelsDesc:
      "every model with price per message, context window, content tier and head-to-head comparisons",
    pricing: "Pricing",
    pricingDesc: "free credits, the subscription and the credit pack",
    api: "API docs",
    apiDesc: "base URL, authentication, request formats and code samples",
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
