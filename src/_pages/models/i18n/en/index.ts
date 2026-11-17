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
      title: "{{model}} price, API & {{context}} context | {{appName}}",
      titleShort: "{{model}} price, API & {{context}} context",
      titleMin: "{{model}} price & API",
      titleUncensored: "{{model}}: uncensored AI, price & API | {{appName}}",
      titleUncensoredShort: "{{model}}: uncensored AI, price & API",
      titleUncensoredMin: "{{model}} uncensored: price & API",
      titleLegacy: "{{model}} price & context (legacy) | {{appName}}",
      titleLegacyShort: "{{model}} price & context (legacy)",
      description:
        "{{model}} by {{lab}}: {{input}} input, {{output}} output per 1M tokens. {{context}} context, ~{{credits}} credits per message. Free credits to start.",
      descriptionFlat:
        "{{model}} by {{lab}}: ~{{credits}} credits ({{money}}) per message, {{context}} context, {{tier}} tier. Free credits to start.",
      descriptionUncensored:
        "{{model}} answers what filtered AI refuses. {{input}} input, {{output}} output per 1M tokens, {{context}} context. Chat or API, one-time 18+ check.",
      descriptionUncensoredFlat:
        "{{model}} answers what filtered AI refuses. ~{{credits}} credits ({{money}}) per message, {{context}} context. Chat or API, one-time 18+ check.",
      descriptionLegacy:
        "{{model}} by {{lab}} is a legacy model, replaced by {{successor}}. {{context}} context, ~{{credits}} credits per message. Specs, price and successor.",
      descriptionLegacyNoSuccessor:
        "{{model}} by {{lab}} is a legacy model. {{context}} context, ~{{credits}} credits per message. Specs, price and current alternatives.",
      imageAlt: "{{model}} on {{appName}}",
      keywords:
        "{{model}}, {{model}} price, {{model}} API, {{model}} context window, {{lab}} AI, {{appName}}",
    },
    media: {
      title: "{{model}} price: {{credits}} credits per {{unit}} | {{appName}}",
      titleShort: "{{model}} price: {{credits}} credits per {{unit}}",
      titleMin: "{{model}} price per {{unit}}",
      titleNoPrice: "{{model}}: {{type}} AI price & how to use | {{appName}}",
      titleNoPriceShort: "{{model}}: {{type}} AI price & how to use",
      description:
        "{{model}} by {{lab}} ({{type}}): {{credits}} credits ({{money}}) per {{unit}}. Input: {{inputs}}. Run it in the tool or from chat. Free credits to start.",
      descriptionNoPrice:
        "{{model}} by {{lab}} ({{type}}), {{tier}} tier. Real price per use in credits. Run it in the tool or from chat. Free credits to start.",
      imageAlt: "{{model}} on {{appName}}",
      keywords:
        "{{model}}, {{model}} price, {{lab}} AI, {{type}} AI model, {{appName}}",
    },
    compare: {
      title: "{{a}} vs {{b}}: price & context | {{appName}}",
      titleShort: "{{a}} vs {{b}}: price & context",
      titleMin: "{{a}} vs {{b}}",
      description:
        "{{a}} vs {{b}}: ~{{creditsA}} vs ~{{creditsB}} credits per message, {{contextA}} vs {{contextB}} context. Inputs, tools, filters and API side by side.",
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
      line: "Two kinds, both answer everything. Most are mainstream models with the refusal reflex cut out: same training, same worldview, no more dodging. UncensoredLM is the other kind: trained on books and documents banned from the mainstream internet, so its political takes run against the mainstream.",
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
    tokenPrice: "Price per 1M tokens",
    tokenPriceValue: "{{input}} input, {{output}} output",
    tokenPriceHint: "{{inputCredits}} / {{outputCredits}} credits",
    parameters: "Size",
    parametersValue: "{{count}}B parameters",
    strengths: "Known for",
    uncensoredKind: "Kind of uncensored",
    apiId: "API model id",
    apiIdHint:
      "OpenAI and Anthropic compatible API. Needs a paid account: any plan.",
    apiIdLegacy: "Not on the API anymore. Use {{successor}}.",
    apiIdLegacyNoSuccessor: "Not on the API anymore.",
    notListed: "Not listed",
    notUncensored: "Filtered",
    fixedPrice: "Fixed price per message",
    notPublished: "Not published",
  },
  strengths: {
    coding: "Code",
    reasoning: "Reasoning",
    analysis: "Analysis",
    creative: "Creative writing",
    roleplay: "Roleplay",
    roleplayDark: "Dark fiction",
    fast: "Speed",
    vision: "Vision",
    imageGen: "Image generation",
  },
  uncensoredKind: {
    ownWorldview: {
      name: "Own worldview",
      line: "Trained on books and documents banned from the mainstream internet. Political takes run against the mainstream.",
    },
    refusalsRemoved: {
      name: "Refusals removed",
      line: "Built on an existing model and tuned to stop refusing. Same training, same worldview, no more dodging.",
    },
  },
  units: {
    image: "image",
    audio: "track",
    video: "{{seconds}}s clip",
    videoClip: "clip",
    tts: "{{chars}} characters",
    stt: "{{seconds}}s of audio",
  },
  bestFor: {
    heading: "What {{model}} is best for",
    good: "Use it for",
    skip: "Skip it for",
    items: {
      coding: "Writing, reviewing and fixing code",
      reasoning: "Multi-step reasoning: math, logic, planning",
      analysis: "Research and analysis of long material",
      creative: "Creative writing and brainstorming",
      roleplay: "Roleplay and interactive fiction",
      roleplayDark: "Dark and taboo fiction",
      fast: "Quick replies when speed matters",
      vision: "Reading screenshots, photos and scans",
      videoInput: "Understanding video",
      audioInput: "Listening to audio",
      imageGen: "Generating and editing images in chat",
      longContext: "Whole books or codebases in one prompt",
      budget: "High-volume work on a small budget",
      tools: "Agent work with tools: search, memory, code",
      uncensored: "Questions mainstream models refuse",
      ownWorldview: "Political takes that run against the mainstream",
    },
    skipItems: {
      noTools: "Agent workflows: it has no tool calling",
      textOnly: "Images or screenshots: it reads text only",
      pricey: "Bulk jobs: it costs more per message than most models here",
      smallContext: "Very long documents: context ends at {{tokens}} tokens",
      filtered: "Topics {{lab}} filters: use an uncensored model for those",
      legacy: "New projects: {{successor}} replaces it",
      legacyNoSuccessor: "New projects: it is a legacy model",
    },
    picks: {
      claudeOpus:
        "Anthropic's heavy hitter for hard work: big codebases, careful analysis, writing that needs judgment. It costs more per message, so use it where quality pays.",
      claudeSonnet:
        "The everyday Claude. Strong at code, analysis and writing, and cheaper than Opus, so it carries daily work without draining your credits.",
      claudeHaiku:
        "Fast, cheap Claude for quick answers, summaries and simple code. Reads screenshots too.",
      gptSol:
        "OpenAI's flagship for reasoning, code and long analysis. The pick when you want GPT quality on hard problems.",
      gptLuna:
        "OpenAI's fast, low-cost model for everyday chat and quick lookups.",
      geminiArgon:
        "Google's top tier that reads text, images, video and audio. Strong at reasoning and code over mixed media.",
      geminiFlash:
        "Fast Gemini that still reads images, video and audio. Good value for analysis and code at speed.",
      grok: "xAI's flagship with lighter filters than the other big labs. Strong reasoning and code, fewer refusals.",
      deepseekPro:
        "DeepSeek's big reasoning model. Top-tier code and analysis at a fraction of what the closed flagships charge.",
      deepseekFlash:
        "One of the cheapest capable models here. Fast code and analysis, reads images, built for high volume.",
      glm: "Z.AI's open model for code and reasoning. Smart answers at a budget price.",
      kimi: "Moonshot's flagship: reasoning, code and creative writing, and it reads images and video.",
      qwenMax:
        "Alibaba's flagship Qwen. Reasoning, code and analysis, and it reads images and video.",
      mistralLarge:
        "Mistral's flagship from France. Solid code and analysis, and it reads images.",
      metaWonder:
        "Meta's top model. Reads text, images, video and audio, strong at reasoning, code and creative work.",
      uncensoredLm:
        "The uncensored model with its own worldview. Trained on books and documents banned from the mainstream internet, so expect political takes the big labs won't give you.",
      glmUncensored:
        "GLM 5.3 with the refusals removed. Same brain, same worldview, answers everything. One of the strongest reasoners in the uncensored tier.",
      glmFlashUncensored:
        "Fast, cheap and refusal-free. GLM 5.3 Flash without the dodging, and it reads images.",
      deepseekFlashUncensored:
        "DeepSeek V4.1 Flash with the refusals removed. Code, analysis and fiction without lectures, at a low price.",
      veniceUncensored:
        "Venice's own uncensored chat model. Cheap and quick, made for creative writing and roleplay without refusals.",
    },
  },
  related: {
    heading: "Similar models",
    intro: "Same lab, same tier, cheaper picks. Each one has its own page.",
    reasons: {
      uncensored: "Uncensored version",
      original: "Original model",
      cheaper: "Cheaper, same tier",
      sameLab: "Also by {{lab}}",
      sameTier: "Same tier",
      sameType: "Same type",
    },
    perMessage: "~{{credits}} credits per message",
    perUse: "{{credits}} credits per {{unit}}",
  },
  faq: {
    heading: "{{model}}: questions and answers",
    price: {
      q: "How much does {{model}} cost?",
      aTokens:
        "About {{credits}} credits ({{money}}) for a typical message: 16K tokens in, 1.5K out. Per 1M tokens: {{input}} input, {{output}} output. You pay per use in credits. Free credits to start.",
      aFlat:
        "About {{credits}} credits ({{money}}) for a typical message. You pay per use in credits. Free credits to start.",
      aFree: "{{model}} costs no credits per message.",
    },
    uncensored: {
      q: "Is {{model}} uncensored?",
      mainstream:
        "No. {{model}} keeps {{lab}}'s safety filters and refuses some topics. For those, switch to an uncensored model in the same chat.",
      open: "Partly. {{model}} is an open model with lighter filters than mainstream models: it refuses less, but it is not fully uncensored. For zero refusals, pick a model from the uncensored tier.",
      refusalsRemoved:
        "Yes. {{model}} is built on an existing model with the refusal reflex removed: same training, same worldview, it just stops dodging questions. Uncensored models need a one-time 18+ confirmation.",
      ownWorldview:
        "Yes, and not like most. {{model}} is trained on books and documents banned from the mainstream internet, so its political takes run against the mainstream. Most other uncensored models only have their refusals removed. Uncensored models need a one-time 18+ confirmation.",
    },
    api: {
      q: "Can I use {{model}} via API?",
      a: "Yes. Call it as {{id}} on the {{appName}} API, which speaks the OpenAI and Anthropic formats. The API needs a paid account: any plan.",
      legacy:
        "{{model}} is a legacy model and no longer listed on the API. Use {{successor}} ({{id}}) instead. The API needs a paid account: any plan.",
      legacyNoSuccessor:
        "{{model}} is a legacy model and no longer listed on the API. GET /v1/models shows every model you can call.",
    },
    context: {
      q: "How big is the context window of {{model}}?",
      a: "{{tokens}} tokens. That is about {{pages}} pages of text in one go.",
    },
    inputs: {
      q: "Can {{model}} read images and use tools?",
      images: "Yes, it reads images: send screenshots, photos or scans.",
      imagesAndMore: "Yes, it reads images. Other inputs: {{more}}.",
      textOnly: "No, it reads text only.",
      toolsYes:
        "It supports tool calling: web search, memory and code in chat, function calls on the API.",
      toolsNo: "It has no tool calling, so it answers from what it knows.",
    },
  },
  mediaFaq: {
    price: {
      q: "How much does {{model}} cost?",
      a: "{{credits}} credits ({{money}}) per {{unit}}. Size, length and options change the price. You pay per use in credits. Free credits to start.",
      aNone:
        "The price depends on size, length and options. The live price is in the table above. You pay per use in credits. Free credits to start.",
    },
    use: {
      q: "How do I use {{model}}?",
      a: "Open the {{type}} tool with {{model}} already selected and run it. Or ask any chat model to use {{model}} for you.",
    },
    inputs: {
      q: "What does {{model}} take as input?",
      a: "Input: {{inputs}}. Output: {{outputs}}.",
    },
    uncensored: {
      q: "Is {{model}} uncensored?",
      mainstream: "No. {{model}} runs with {{lab}}'s content filters.",
      open: "Partly. {{model}} has lighter filters than mainstream models, but it is not fully uncensored.",
      uncensored:
        "Yes. {{model}} sits in the uncensored tier and generates what filtered models block.",
      consent: "Uncensored models need a one-time 18+ confirmation.",
    },
  },
  readMore: {
    heading: "Read more",
  },
  directory: {
    heading: "Every model page",
    intro: "Direct links to all {{count}} model pages, legacy models included.",
  },
  breadcrumb: {
    models: "AI models",
  },
  jsonLd: {
    perMessage: "typical message (16K tokens in, 1.5K out)",
    perInputTokens: "input tokens",
    perOutputTokens: "output tokens",
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
      "Free credits to start, no card needed. The chat opens with {{model}} selected and a prompt ready. Just send.",
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
      "Free credits to start, no card needed. The tool opens ready to run.",
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
      "How {{model}} answers the Refusal Index questions. Updated {{date}}, new questions every week.",
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
