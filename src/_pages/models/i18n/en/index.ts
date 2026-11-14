export const translations = {
  meta: {
    category: "AI Models",
    index: {
      title:
        "{{count}} AI chat models - prices, context, filters | {{appName}}",
      description:
        "Every model on {{appName}} in one list: Claude, GPT, Gemini, Grok, DeepSeek, open and uncensored chat, plus image, voice, music and video. Real price per use, context window, inputs. Pick one, start now.",
      imageAlt: "AI model directory on {{appName}}",
      keywords:
        "AI models, LLM comparison, uncensored AI, open source AI, AI pricing, {{appName}}",
    },
    model: {
      title: "{{model}} by {{lab}} - price, context, how to use | {{appName}}",
      description:
        "{{model}} by {{lab}}: {{tier}} tier, {{context}} tokens of context, about {{price}} credits per message. Chat with it on {{appName}} - no subscription needed.",
      imageAlt: "{{model}} on {{appName}}",
      keywords:
        "{{model}}, {{model}} price, {{model}} context window, {{lab}} AI, {{appName}}",
    },
    media: {
      title: "{{model}} by {{lab}} - {{type}} price, how to use | {{appName}}",
      description:
        "{{model}} by {{lab}}: {{type}} model, {{tier}} tier. Real price per use in credits. Use it on {{appName}} - no subscription needed.",
      imageAlt: "{{model}} on {{appName}}",
      keywords:
        "{{model}}, {{model}} price, {{lab}} AI, {{type}} AI model, {{appName}}",
    },
    compare: {
      title: "{{a}} vs {{b}} - price, context, inputs compared | {{appName}}",
      description:
        "{{a}} vs {{b}}, side by side: price per message, context window, inputs, outputs, providers and content tier. Try both on {{appName}}.",
      imageAlt: "{{a}} vs {{b}} on {{appName}}",
      keywords:
        "{{a}} vs {{b}}, {{a}}, {{b}}, AI model comparison, {{appName}}",
    },
  },
  tiers: {
    mainstream: {
      name: "Mainstream",
      line: "The big labs' models with their own safety filters. Best for work, code and research.",
    },
    open: {
      name: "Open",
      line: "Open-weight models with lighter filters. Discuss more, refuse less.",
    },
    uncensored: {
      name: "Uncensored",
      line: "Two kinds, both answer everything. Most are mainstream models with the refusal reflex cut out: same training, same worldview, no more dodging. UncensoredLM is the other kind: its own tuning, its own worldview, political takes that run against the mainstream.",
    },
  },
  modality: {
    text: "Text",
    image: "Images",
    audio: "Audio",
    video: "Video",
  },
  facts: {
    heading: "The facts",
    type: "Model type",
    lab: "Made by",
    tier: "Content tier",
    intelligence: "Intelligence",
    price: "Estimated price per message",
    priceValue: "~{{credits}} credits",
    priceFree: "Free",
    priceHint: "≈ {{count}} messages for {{unit}}",
    priceHintFree: "Costs you nothing per message",
    priceFootnote:
      "A typical message: 16K tokens in, 1.5K out. Short replies cost less. Models served via OpenRouter bill the real provider cost plus our markup, so actual charges vary. 1 credit = {{value}}.",
    context: "Context window",
    contextValue: "{{tokens}} tokens",
    contextHint: "≈ {{pages}} pages of text in one go",
    inputs: "Reads",
    outputs: "Writes",
    providers: "Served via",
    tools: "Tool use",
    toolsYes: "Yes - search, memory, code and more",
    toolsNo: "No - plain chat",
    status: "Status",
    statusCurrent: "Current",
    statusLegacy: "Legacy",
  },
  currencyUnit: {
    usd: "$1",
    eur: "1 €",
  },
  creditValue: {
    usd: "$0.01",
    eur: "0.01 €",
  },
  chatPrompt: "What are you best at? Show me in one short, concrete example.",
  catalog: {
    typesLabel: "Model type",
    types: {
      text: "Chat",
      tts: "Text to voice",
      stt: "Voice to text",
      image: "Images",
      audio: "Music",
      video: "Video",
    },
    context: "{{size}} context",
    legacyBadge: "Legacy",
    count: "{{count}} models",
    showLegacy: "Show legacy ({{count}})",
    hideLegacy: "Hide legacy",
  },
  index: {
    eyebrow:
      "{{chat}} chat models, plus {{image}} image, {{video}} video, {{music}} music and {{voice}} voice models",
    title: "Every model. One chat.",
    subtitle:
      "Mainstream, open and uncensored. Real prices per message, real context sizes. You choose the filter. Not us.",
    searchLabel: "Search models",
    searchPlaceholder: "Search by name or lab: Claude, DeepSeek, Venice…",
    tierCount: "{{count}} models",
    noResults: "No model matches “{{query}}”.",
    legacyTitle: "Legacy models",
    legacyIntro:
      "Older versions. Saved chats and skills that use them switch to the successor automatically.",
    perMessage: "~{{credits}} cr/msg",
    free: "Free",
    ctaTitle: "Stop reading specs. Ask one.",
    ctaSubtitle:
      "Open a chat, pick any model from the selector, switch mid-conversation.",
    ctaButton: "Start chatting",
  },
  model: {
    back: "All models",
    chatCta: "Chat with {{model}}",
    compareCta: "Compare",
    legacyBanner:
      "{{model}} is a legacy model. Its successor, {{successor}}, is faster or cheaper - and chats that used {{model}} move to it automatically.",
    legacyCta: "See {{successor}}",
    compareHeading: "Compare {{model}}",
    compareIntro: "Same facts, side by side.",
    compareWith: "{{model}} vs {{other}}",
    ctaTitle: "Try {{model}} now.",
    ctaSubtitle:
      "No subscription. Free credits to start. The chat opens with {{model}} selected and a prompt ready - just send.",
  },
  media: {
    priceLabel: "Price per use",
    generateCta: "Generate with {{model}}",
    useCta: "Use {{model}}",
    chatNote:
      "Also works from chat: ask any chat model to use {{model}} for you.",
    priceFootnote:
      "Price is per unit - image, clip, second or character - and shifts with size, length and options. 1 credit = {{value}}.",
    ctaTitle: "Try {{model}} now.",
    ctaSubtitle:
      "No subscription. Free credits to start. The tool opens ready to run.",
  },
  compare: {
    back: "All models",
    eyebrow: "Head to head",
    title: "{{a}} vs {{b}}",
    subtitle: "Price, context, inputs and filters. No benchmarks theatre.",
    fact: "Fact",
    cheaper: "{{model}} costs {{times}}× less per message.",
    samePrice: "Both cost about the same per message.",
    biggerContext: "{{model}} holds {{times}}× more context.",
    sameContext: "Both hold the same amount of context.",
    chatWith: "Chat with {{model}}",
    modelPage: "{{model}} details",
    swap: "Swap sides",
    sameModel: "Pick two different models to compare.",
  },
  picker: {
    change: "Change model",
    search: "Search models",
    suggested: "Suggested",
    all: "All models",
    empty: "No model matches.",
  },
  refusal: {
    heading: "Refusal Index",
    intro:
      "How {{model}} handled the fixed question set in the latest weekly run ({{date}}).",
    rank: "Rank {{rank}} of {{total}} (1 = fewest refusals)",
    refused: "Refused",
    hedged: "Hedged",
    answered: "Answered",
    judged: "{{count}} judged answers",
    trend: "{{delta}} pts vs last run",
    categories: "By category",
    samplesHeading: "Sample answers",
    samplesIntro:
      "Real answers from the benchmark run. Same prompt for every model.",
    question: "Question",
    answer: "Answer",
    judge: "Judge",
    methodCta: "How we measure",
  },
};
