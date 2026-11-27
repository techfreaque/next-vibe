export const translations = {
  compareHub: {
    title: "Compare AI models",
    description:
      "Compare available AI models side by side. See how they differ in price, context, capabilities and content filters.",
  },
  meta: {
    category: "AI Models",
    index: {
      title: "{{count}} AI chat models: prices, context, filters | {{appName}}",
      description:
        "Every AI model on {{appName}}: Claude, GPT, Gemini, Grok, DeepSeek, uncensored and abliterated chat, plus image, voice and video. Real prices, free credits.",
      imageAlt: "AI model directory on {{appName}}",
      keywords:
        "AI models, LLM comparison, uncensored AI, open source AI, AI pricing, {{appName}}",
    },
    model: {
      title: "{{model}} chat online: price & API | {{appName}}",
      titleShort: "{{model}} chat online: price & API",
      titleMin: "{{model}} chat online",
      titleUncensored: "{{model}} chat online, uncensored | {{appName}}",
      titleUncensoredShort: "{{model}} chat online, uncensored",
      titleLegacy: "{{model}} price & context (legacy) | {{appName}}",
      titleLegacyShort: "{{model}} price & context (legacy)",
      description:
        "Chat with {{model}} by {{lab}} online, no install, or via API: {{input}} input, {{output}} output per 1M tokens, {{context}} context. {{hook}}",
      descriptionFlat:
        "Chat with {{model}} by {{lab}} online, no install, or via API: ~{{credits}} credits ({{money}}) per message, {{context}} context. {{hook}}",
      descriptionUncensored:
        "Uncensored AI chat with {{model}} online, no install, or via API: {{input}} input, {{output}} output per 1M tokens, {{context}} context. {{hook}}",
      descriptionUncensoredFlat:
        "Uncensored AI chat with {{model}} online, no install, or via API: ~{{credits}} credits ({{money}}) per message, {{context}} context. {{hook}}",
      descriptionLegacy:
        "{{model}} by {{lab}} is a legacy model, replaced by {{successor}}. {{context}} context, ~{{credits}} credits per message. Specs, price and successor.",
      descriptionLegacyNoSuccessor:
        "{{model}} by {{lab}} is a legacy model. {{context}} context, ~{{credits}} credits per message. Specs, price and current alternatives.",
      titleUncensoredNamed: "{{model}} chat online, free to try | {{appName}}",
      titleUncensoredNamedShort: "{{model}} chat online, free to try",
      hookGuest: "Free credits, no sign-up.",
      hookAccount: "Free account credits to start.",
      hookPaid: "Pay per message in credits.",
      hookAdult: "{{hook}} One-time 18+ check.",
      descriptionShort:
        "Chat with {{model}} online or via API: ~{{credits}} credits per message, {{context}} context. {{hook}}",
      descriptionUncensoredShort:
        "Uncensored AI chat with {{model}} online or via API: ~{{credits}} credits per message, {{context}} context. {{hook}}",
      descriptionUncensoredNamed:
        "Chat with {{model}} online, no install, or via API: {{input}} input, {{output}} output per 1M tokens, {{context}} context. {{hook}}",
      descriptionUncensoredNamedFlat:
        "Chat with {{model}} online, no install, or via API: ~{{credits}} credits ({{money}}) per message, {{context}} context. {{hook}}",
      descriptionUncensoredNamedShort:
        "Chat with {{model}} online or via API: ~{{credits}} credits per message, {{context}} context. {{hook}}",
      descriptionLegacyShort:
        "{{model}} by {{lab}} is a legacy model, replaced by {{successor}}. {{context}} context, ~{{credits}} credits per message.",
      descriptionLegacyNoSuccessorShort:
        "{{model}} by {{lab}} is a legacy model. {{context}} context, ~{{credits}} credits per message. See current alternatives.",
      imageAlt: "{{model}} on {{appName}}",
      keywords:
        "{{model}}, {{model}} price, {{model}} API, {{model}} context window, {{lab}} AI, {{appName}}",
    },
    media: {
      title: "{{model}} online: {{credits}} credits per {{unit}} | {{appName}}",
      titleShort: "{{model}} online: {{credits}} credits per {{unit}}",
      titleMin: "{{model}} online",
      titleNoPrice: "{{model}}: {{type}} AI price & how to use | {{appName}}",
      titleNoPriceShort: "{{model}}: {{type}} AI price & how to use",
      description:
        "{{model}} by {{lab}} ({{type}}) online: {{credits}} credits ({{money}}) per {{unit}}. Input: {{inputs}}. Use it in the browser or from chat. {{hook}}",
      descriptionNoPrice:
        "{{model}} by {{lab}} ({{type}}), {{tier}} tier. Real price per use in credits. Run it in the tool or from chat. Free credits to start.",
      descriptionShort:
        "{{model}} by {{lab}} online: {{credits}} credits ({{money}}) per {{unit}}. Use it in the browser or from chat. {{hook}}",
      descriptionMin:
        "{{model}} online: {{credits}} credits per {{unit}}. Use it in the browser or from chat. {{hook}}",
      descriptionNoPriceShort:
        "{{model}} by {{lab}} ({{type}}). Real price per use in credits, in the browser or from chat.",
      imageAlt: "{{model}} on {{appName}}",
      keywords:
        "{{model}}, {{model}} price, {{lab}} AI, {{type}} AI model, {{appName}}",
    },
    compare: {
      title: "{{a}} vs {{b}}: price & context | {{appName}}",
      titleShort: "{{a}} vs {{b}}: price & context",
      titleMin: "{{a}} vs {{b}}",
      description:
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}): ~{{moneyA}} vs ~{{moneyB}} per message, {{contextA}} vs {{contextB}} context. When to pick which, facts side by side.",
      descriptionShort:
        "{{a}} ({{tierA}}) vs {{b}} ({{tierB}}): ~{{moneyA}} vs ~{{moneyB}} per message, {{contextA}} vs {{contextB}} context.",
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
      line: "Models offered for less restricted conversations and creative work.",
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
    priceValue: "~{{credits}} credits ({{money}})",
    priceFree: "Free",
    referenceTurn:
      "Reference message with {{input}} input tokens and {{output}} output tokens.",
    referenceImageTurn:
      "Reference message with {{input}} input tokens, {{output}} text output tokens and one generated image.",
    priceProvider: "Rates shown for {{provider}}.",
    conditionalPrice: "Conditional prices per 1M tokens",
    tierAt: "From {{tokens}} input tokens: {{rates}}.",
    tierUtc: "{{start}} to {{end}} UTC: {{rates}}.",
    tierInput: "input {{price}}",
    tierOutput: "output {{price}}",
    tierRead: "cache read {{price}}",
    tierWrite: "cache write {{price}}",
    tierHour: "one-hour write {{price}}",
    cacheReadSentence: "Cached input costs {{price}} per million tokens.",
    cacheWrite1hPrice: "One-hour cache writes per 1M tokens",
    cacheWrite1hSentence:
      "One-hour cache writes cost {{price}} per million tokens.",
    cacheWriteSentence: "Cache writes cost {{price}} per million tokens.",
    cacheReadPrice: "Cached input per 1M tokens",
    cacheWritePrice: "Cache writes per 1M tokens",
    imageOutputPrice: "Image output per 1M tokens",
    perMillionCredits: "{{credits}} credits",
    priceFootnote:
      "Charges depend on usage and provider. Currency estimates use the one-time credit pack rate of {{value}} per credit.",
    context: "Context window",
    contextValue: "{{tokens}} tokens",
    contextHint: "≈ {{pages}} pages of text in one go",
    inputs: "Input modalities",
    outputs: "Output modalities",
    providers: "Served via",
    tools: "Tool use",
    toolsYes: "Yes: search, memory, code and more",
    toolsNo: "No: plain chat",
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
    fixedPrice: "Fixed price per message.",
    notPublished: "Not published",
    apiIdUnsupported: "This model is outside the text chat API.",
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
      line: "Trained on books and documents banned from the mainstream internet, with political takes that run against the mainstream.",
    },
    abliterated: {
      name: "Abliterated",
      line: "The base model’s weights were modified to reduce refusals.",
    },
    fineTuned: {
      name: "Fine-tuned",
      line: "An existing model was fine-tuned for less restricted responses.",
    },
    unlisted: {
      name: "Method unspecified",
      line: "This model is in the uncensored tier. Its training or filtering method is unspecified.",
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
      imageGen: "Generating images in chat",
      longContext: "Whole books or codebases in one prompt",
      budget: "High-volume work on a small budget",
      tools: "Agent work with tools: search, memory, code",
      uncensored: "Questions mainstream models refuse",
      ownWorldview: "Political takes that run against the mainstream",
    },
    skipItems: {
      noTools: "Agent workflows: it has no tool calling",
      noImages: "Tasks that require image input",
      pricey: "Bulk jobs at {{credits}} credits per reference message",
      smallContext: "Very long documents: context ends at {{tokens}} tokens",
      filtered: "Topics {{lab}} filters: use an uncensored model for those",
      legacy: "New projects: {{successor}} replaces it",
      legacyNoSuccessor: "New projects: it is a legacy model",
      coding: "Code-heavy work",
      analysis: "In-depth analysis",
      reasoning: "Complex reasoning",
      creative: "Creative writing",
      roleplay: "Character roleplay",
    },
    media: {
      image: "Generating images",
      video: "Generating video clips",
      audio: "Generating music",
      tts: "Turning written text into speech",
      stt: "Transcribing recorded speech",
      otherOutputs: "Tasks that need output other than {{outputs}}",
    },
    picks: {
      claudeOpus:
        "Anthropic's heavy hitter for hard work: big codebases, careful analysis, writing that needs judgment. It costs more per message, so use it where quality pays.",
      claudeSonnet:
        "The everyday Claude. Strong at code, analysis and writing, and cheaper than Opus, so it carries daily work without draining your credits.",
      claudeHaiku:
        "Fast, cheap Claude for quick answers, summaries and simple code. Reads screenshots too.",
      gptSol:
        "Use Sol for daily coding, document analysis and tasks that need tools. It accepts text and images.",
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
        "Abliterated GLM 5.3 for reasoning, coding and analysis. Supports tool calling.",
      glmFlashUncensored:
        "Abliterated GLM 5.3 Flash for quick replies and prompts with images.",
      deepseekFlashUncensored:
        "Abliterated DeepSeek V4.1 Flash for code, analysis and fiction. Accepts images.",
      veniceUncensored:
        "Venice’s fine-tuned chat model for creative writing and roleplay.",
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
  plans: {
    heading: "What {{model}} costs on each plan",
    intro:
      "One reference message on {{model}} costs about {{credits}} credits ({{money}}). Here is how far each plan goes in a month.",
    mediaIntro:
      "With {{model}}, one {{unit}} costs {{credits}} credits ({{money}}). Here is how far each plan goes in a month.",
    messages: "Messages per month",
    uses: "Uses per month",
    colPlan: "Plan",
    colPrice: "Price per month",
    colCredits: "Credits per month",
    guest: "Guest, no signup",
    account: "Free account",
    free: "Free",
    about: "about {{count}}",
    underOne: "under 1",
    footnote:
      "Long prompts, files and tool calls use more credits per message. The same credits work on every model.",
    mediaFootnote:
      "Length, size or quality options change the charge per use. The same credits work on every model.",
  },
  nearest: {
    heading: "{{model}} vs the closest alternatives",
    intro:
      "Price, context and tier side by side. Open a head-to-head for the full breakdown.",
    colModel: "Model",
    colPrice: "Price per message",
    colCompare: "Head-to-head",
    thisModel: "This page",
  },
  faq: {
    heading: "{{model}}: questions and answers",
    price: {
      q: "How much does {{model}} cost?",
      aTokens:
        "About {{credits}} credits ({{money}}) for a reference message via {{provider}}. Per million tokens, {{input}} for input and {{output}} for text output.",
      aFlat: "{{credits}} credits ({{money}}) per message via {{provider}}.",
      aFree: "{{model}} costs no credits per message.",
    },
    uncensored: {
      q: "Is {{model}} uncensored?",
      mainstream:
        "No. {{model}} keeps {{lab}}'s safety filters and refuses some topics. For those, switch to an uncensored model in the same chat.",
      open: "{{model}} is in the Open tier. Its responses can still be filtered.",
      yes: "Yes.",
      consent: "Uncensored chat models require a one-time 18+ confirmation.",
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
    providers: {
      q: "Who serves {{model}} on this platform?",
      a: "Available providers include {{providers}}.",
    },
    inputs: {
      q: "What inputs and outputs does {{model}} support?",
      modalities: "Input: {{inputs}}. Output: {{outputs}}.",
      toolsYes: "It supports tool calling.",
      toolsNo: "Tool calling is unavailable.",
    },
    bestFor: {
      q: "What is {{model}} good for?",
      a: "Use it for: {{items}}.",
    },
    cheaper: {
      q: "Is there a cheaper alternative to {{model}}?",
      a: "{{other}}: same tier, the same or a higher intelligence level, and about {{otherCredits}} credits per reference message instead of {{credits}}.",
    },
    free: {
      q: "Is {{model}} free to use?",
      a: "You can try it free. Guests get {{guest}} credits a month with no signup, enough for about {{guestMessages}} {{model}} messages. A free account holds {{account}} credits, about {{accountMessages}} messages. Plans start at {{planPrice}} a month for {{planCredits}} credits, about {{planMessages}} messages.",
      aAccount:
        "One reference message costs {{credits}} credits, more than the {{guest}} guest credits. A free account holds {{account}} credits a month, about {{accountMessages}} {{model}} messages. Plans start at {{planPrice}} a month for {{planCredits}} credits, about {{planMessages}} messages.",
      aPaid:
        "Not on the free allowance. One reference message costs {{credits}} credits, more than the {{account}} free credits a month. Plans start at {{planPrice}} a month for {{planCredits}} credits, about {{planMessages}} {{model}} messages.",
    },
    versus: {
      q: "{{model}} or {{other}}: which one should I pick?",
      a: "{{model}} costs about {{credits}} credits per reference message, has a {{context}} token context window and sits in the {{tier}} tier. {{other}} costs about {{otherCredits}} credits, has {{otherContext}} tokens of context and sits in the {{otherTier}} tier. Both run in the same chat, so you can switch mid conversation and judge the answers yourself.",
    },
    try: {
      q: "How can I try {{model}}?",
      a: "Open a chat with {{model}} selected. New visitors get free credits to start, no card needed.",
      aLegacy:
        "{{model}} is a legacy model. New chats use {{successor}}, which you can try with free starter credits, no card needed.",
    },
  },
  mediaFaq: {
    price: {
      q: "How much does {{model}} cost?",
      a: "{{credits}} credits ({{money}}) per {{unit}} via {{provider}}. Options such as length or size can affect the charge.",
      aNone: "A reference price is currently unavailable.",
    },
    use: {
      q: "How do I use {{model}}?",
      a: "Open the creation tool with {{model}} selected to get started.",
    },
    inputs: {
      q: "What does {{model}} take as input?",
      a: "Input: {{inputs}}. Output: {{outputs}}.",
    },
    uncensored: {
      q: "Is {{model}} uncensored?",
      mainstream: "No. {{model}} runs with {{lab}}'s content filters.",
      open: "Partly. {{model}} has lighter filters than mainstream models, but it is not fully uncensored.",
      uncensored: "This model is in the uncensored tier.",
      consent: "Uncensored models need a one-time 18+ confirmation.",
    },
  },
  readMore: {
    heading: "Read more",
    landings: {
      uncensored: {
        title: "Uncensored AI chat in your browser",
        excerpt:
          "Every uncensored model in one list: context, price per message and a direct chat link.",
      },
      abliterated: {
        title: "Abliterated AI models you can try online",
        excerpt:
          "Mainstream models with the refusals removed. Context, price per message and a direct chat link.",
      },
    },
  },
  directory: {
    heading: "Every model page",
    intro: "Direct links to all {{count}} model pages, legacy models included.",
  },
  breadcrumb: {
    models: "AI models",
  },
  jsonLd: {
    perMessage: "reference message",
    perCacheReadTokens: "cached input tokens",
    perCacheWrite1hTokens: "one-hour cache write tokens",
    perCacheWriteTokens: "cache write tokens",
    perInputTokens: "input tokens",
    perOutputTokens: "output tokens",
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
    chatCta: "Try {{model}} in chat",
    compareCta: "Compare",
    legacyBanner:
      "{{model}} is a legacy model. Open {{successor}} to start a new chat.",
    legacyCta: "See {{successor}}",
    compareWith: "{{model}} vs {{other}}",
    ctaTitle: "Try {{model}} now.",
    ctaSubtitle:
      "Free credits to start, no card needed. The chat opens with {{model}} selected and a prompt ready. Just send.",
  },
  media: {
    priceValue: "{{credits}} credits per {{unit}}",
    priceProvider: "About {{price}} via {{provider}}.",
    priceLabel: "Price per use",
    generateCta: "Generate with {{model}}",
    useCta: "Use {{model}}",
    priceFootnote:
      "Currency estimates use the one-time credit pack rate of {{value}} per credit.",
    ctaTitle: "Try {{model}} now.",
    ctaSubtitle:
      "Free credits to start, no card needed. The generator opens with {{model}} selected.",
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
    modelPage: "{{model}} details",
    swap: "Swap sides",
    cheaperFree: "{{model}} costs no credits per message.",
    tierLine:
      "{{model}} sits in the {{tier}} tier, {{other}} in {{otherTier}}.",
    verdictHeading: "Which one should you pick?",
    verdictIntro:
      "Straight from the specs: price, context, filters, inputs. No benchmark claims.",
    edge: "Where {{model}} has the edge",
    noEdge: "No edge over {{other}} on the facts we track.",
    similar:
      "On paper, {{a}} and {{b}} are close: same filters, similar price, similar context. Send both the same prompt and keep the one you prefer.",
    moreHeading: "More comparisons",
    moreWith: "More {{model}} comparisons",
    both: "{{a}} and {{b}}",
    pick: {
      cheaper:
        "Lower price: {{money}} vs {{otherMoney}} per message, {{times}}× less.",
      free: "No credits per message.",
      context:
        "More context: {{tokens}} tokens (about {{pages}} pages) vs {{otherTokens}}.",
      lessFiltered: "Fewer filters: {{tier}} tier vs {{otherTier}}.",
      mainstream: "Safety filters from {{lab}}, built for work and research.",
      kind: {
        ownWorldview:
          "Own worldview: trained on books and documents banned from the mainstream internet.",
        abliterated:
          "Abliterated: the base model's weights were changed to cut refusals.",
        fineTuned: "Fine-tuned for less restricted answers.",
      },
      smarter: "Higher intelligence rating: {{level}} vs {{otherLevel}}.",
      fast: "Speed: quick replies are a listed strength.",
      strengths: "Known for {{list}}, which {{other}} does not list.",
      inputs: "Reads {{list}}. {{other}} does not.",
      imageOutput: "Generates images right in the chat.",
      tools: "Tool calling for agent work. {{other}} has none.",
      current: "Current model. {{other}} is legacy.",
    },
  },
  compareFaq: {
    cheaper: {
      q: "Which is cheaper, {{a}} or {{b}}?",
      same: "About the same. {{a}} costs ~{{creditsA}} credits ({{moneyA}}) per message, {{b}} ~{{creditsB}} credits ({{moneyB}}).",
      diff: "{{cheap}}. It costs ~{{cheapCredits}} credits ({{cheapMoney}}) per message, {{dear}} ~{{dearCredits}} credits ({{dearMoney}}): {{times}}× more.",
      diffFree:
        "{{cheap}}. It costs no credits per message, {{dear}} ~{{dearCredits}} credits ({{dearMoney}}).",
      reference:
        "Estimates assume a reference message with {{input}} input and {{output}} output tokens. You pay for the tokens you actually use.",
      rates:
        "{{model}} via {{provider}}: {{input}} per 1M input tokens, {{output}} per 1M output tokens.",
      fixed: "{{model}} via {{provider}}: fixed price per message.",
      credit: "One credit is {{value}} at the credit pack rate.",
    },
    context: {
      q: "Which has more context, {{a}} or {{b}}?",
      diff: "{{big}}: {{bigTokens}} tokens (about {{bigPages}} pages) vs {{smallTokens}} tokens (about {{smallPages}} pages) for {{small}}. That is {{times}}× more.",
      same: "Neither by much. {{big}} holds {{bigTokens}} tokens (about {{bigPages}} pages), {{small}} {{smallTokens}} tokens (about {{smallPages}} pages).",
      equal:
        "The same: {{bigTokens}} tokens each, about {{bigPages}} pages of text.",
    },
    smarter: {
      q: "Which is better for hard tasks, {{a}} or {{b}}?",
      diff: "{{model}} carries the higher intelligence rating: {{level}} vs {{otherLevel}} for {{other}}.",
      same: "Both carry the same intelligence rating: {{level}}.",
      known: "{{model}} is known for: {{list}}.",
      knownBoth: "Both are known for: {{list}}.",
      source:
        "Ratings and strengths come from our model catalog, not from a benchmark.",
    },
    inputs: {
      q: "What can {{a}} and {{b}} read and write?",
      line: "{{model}}: input {{inputs}}, output {{outputs}}, {{tools}}.",
      toolsYes: "tool calling",
      toolsNo: "no tool calling",
    },
    api: {
      q: "Can I use {{a}} and {{b}} via API?",
      both: "Yes. Call {{idA}} or {{idB}} on the {{appName}} API, which speaks the OpenAI and Anthropic formats. One key covers both. The API needs a paid account: any plan.",
      one: "{{model}} is on the API as {{id}} (paid account, any plan).",
    },
    try: {
      q: "How can I try {{a}} and {{b}}?",
      a: "Open a chat with either model selected and switch in the model selector mid-conversation. New visitors get free credits to start, no card needed.",
    },
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
    categoryNames: {
      politics: "Politics",
      history: "History",
      health: "Health",
      drugs: "Drugs",
      sexuality: "Sexuality",
      security: "IT security",
      religion: "Religion",
      law: "Law",
      science: "Science",
      fiction: "Fiction",
      satire: "Satire",
    },
  },
};
