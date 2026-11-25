export const translations = {
  common: {
    category: "Comparison",
    breadcrumb: "Uncensored AI platforms compared",
    backToBlog: "Back to Blog",
    backToHub: "All uncensored AI platforms",
    updated: "Updated {{date}}",
    versusImageAlt: "{{appName}} vs {{name}}: side-by-side comparison",
    kinds: {
      uncensoredChat: "Uncensored chat app",
      aggregator: "Multi-model app + API",
      router: "API router",
      roleplay: "Character roleplay",
      frontend: "Roleplay frontend (self-hosted)",
      companion: "AI companion app",
      filteredChat: "Filtered character chat",
      local: "Local model runner",
    },
    period: {
      month: "{{plan}} {{price}}/month",
      quarter: "{{plan}} {{price}}/3 months",
      year: "{{plan}} {{price}}/year",
      once: "{{plan}} {{price}} one-time",
    },
    free: {
      yes: "Yes",
      no: "No",
      local: "Free on your own hardware",
    },
    paid: {
      from: "From {{price}}",
      payg: "Pay as you go",
      none: "No paid plan",
    },
    availability: {
      yes: "Yes",
      no: "No",
      partial: "Limited",
    },
    media: {
      image: "Images",
      video: "Video",
      voice: "Voice",
      partial: "{{name}} (add-ons)",
      none: "Text only",
    },
    openSource: {
      yes: "Open source",
      yesSelfHost: "Open source, self-host",
      closedLocal: "Closed app, runs locally",
      partial: "Older desktop app only",
      no: "No",
    },
    sourceKinds: {
      home: "{{name}} homepage",
      pricing: "{{name}} pricing page",
      features: "{{name}} features page",
      models: "{{name}} model list",
      privacy: "{{name}} privacy policy",
      terms: "{{name}} terms of service",
      guidelines: "{{name}} community guidelines",
      api: "{{name}} API docs",
      docs: "{{name}} documentation",
      help: "{{name}} help center",
      repo: "{{name}} source code",
      blog: "{{name}} blog post",
      appStore: "{{name}} app store listing",
      paper: "{{name}} research paper",
    },
    table: {
      platform: "Platform",
      kind: "Type",
      free: "Free tier",
      paid: "Paid",
      filter: "Filter and consent",
      privacy: "Privacy",
      api: "API",
      media: "Media",
      open: "Open source",
      usLink: "See plans",
      versusLink: "Full comparison",
    },
    versus: {
      shortTitle: "The short answer",
      tableTitle: "{{appName}} vs {{name}}, side by side",
      tableIntro:
        "{{name}} facts from its own pages, checked {{date}}. {{appName}} facts read live from our config.",
      tableFootnote:
        "Prices are list prices in USD on {{name}}'s own pages. Ours are the prices you pay at checkout here. Plans change: check the sources below before you buy.",
      colAspect: "",
      rows: {
        price: "Price",
        free: "Free tier",
        models: "Models",
        filter: "Filter and consent",
        privacy: "Privacy",
        api: "API",
        media: "Images, video, voice",
        open: "Open source",
        forWho: "Built for",
      },
      priceCell: "{{plans}}. {{note}}",
      apiCell: "{{short}}. {{text}}",
      themTitle: "{{name}}: honest pros and cons",
      usTitle: "{{appName}}: honest pros and cons",
      wins: "Where {{name}} wins",
      short: "Where {{name}} falls short",
      chooseTitle: "Which one should you pick?",
      chooseThem: "Choose {{name}} if",
      chooseUs: "Choose {{appName}} if",
      faqTitle: "FAQ",
      sourcesTitle: "Sources",
      sourcesIntro:
        "Every {{name}} fact on this page comes from these pages, checked {{date}}. Spot something outdated? Tell us and we fix it.",
      ourSources:
        "Our numbers come from the same config that bills you. Check them here:",
      modelsLink: "Every model on {{appName}} with live prices",
      pricingLink: "Plans and credit packs",
      privacyLink: "Our privacy policy",
      modelTitle: "{{model}} on {{appName}}",
      modelIntro:
        "{{name}}'s own model runs in our picker. Its page has the live price per message, the context window and the API ID.",
      modelPageLink: "{{model}}: price, context and API",
      modelCompareLink: "{{model}} vs {{other}}: head to head",
      moreTitle: "More comparisons",
      ctaSubtitle:
        "{{guestCredits}} free credits a month. No account, no card. Mainstream, open or uncensored: you switch per message.",
      ctaTry: "Start an incognito chat",
      ctaModels: "Browse all models",
    },
  },
  us: {
    kind: "Multi-model chat: mainstream, open and uncensored",
    free: "Yes: {{guestCredits}} credits a month without an account, {{freeCredits}} with one",
    paid: "From {{subPrice}}/month",
    filterShort:
      "You pick the level per chat. Uncensored after a one-time 18+ confirmation",
    privacyShort:
      "Incognito chats stay in your browser. Private chats saved to your account",
    apiShort: "Yes, OpenAI and Anthropic compatible (after a purchase)",
    mediaShort: "Images, video, music, voice",
    openShort: "Open source, self-host",
    price:
      "Plans: {{planList}} a month. Credit packs ({{packCredits}} credits for {{packPrice}}) top up an active plan and never expire. Card, PayPal or crypto.",
    models:
      "{{modelCount}} chat models from {{labCount}} labs: {{mainstream}} mainstream, {{open}} open, {{uncensored}} uncensored. {{refusalsRemoved}} uncensored ones are mainstream or open models with the refusals cut out. {{ownModel}} has its own worldview: trained on books and documents banned from the mainstream internet.",
    filter:
      "Three levels: mainstream, open, uncensored. You pick the model per message. Uncensored models unlock after a one-time 18+ confirmation. No refusal layer on top. Mainstream models keep their vendor's own filters.",
    privacy:
      "Incognito chats live in your browser's local storage, not on our servers, and work without an account. Private chats are saved to your account. Generated media is stored on our servers. Every message passes through us to the model provider that answers it.",
    api: "OpenAI and Anthropic compatible /v1 API for chat, images, video and speech. Unlocks after any plan (from {{apiSubPrice}} a month) or a credit purchase. Free accounts get HTTP 402.",
    media:
      "{{imageModels}} image, {{videoModels}} video, {{musicModels}} music and {{voiceModels}} voice models on the same credit balance, callable from any chat.",
    open: "The whole platform is open source on GitHub. Self-host it on your own hardware.",
    forWho:
      "People who want mainstream, open and uncensored models plus media in one chat and one balance, and want to set the filter themselves.",
  },
  links: {
    hub: "Best uncensored AI platforms: honest comparison",
    hubDesc:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT, local models and more: prices, filters, privacy and API, with sources",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Uncensored AI platforms compared",
    sectionIntro:
      "Venice, NanoGPT, Gab AI, uncensored.ai, OpenRouter, Janitor AI, Character.AI, FreedomGPT and more: prices, filters and privacy from their own pages.",
  },
  platforms: {
    venice: {
      what: "Privacy-first AI app with a large model catalog, many uncensored text models, image, video and music generation, an OpenAI-compatible API and a crypto staking layer (VVV and DIEM).",
      pricingNote:
        "Free: 10 text and 15 image prompts a day, base models only. 100 credits = $1. Video, music and frontier models cost credits on top.",
      models:
        "Its API catalog lists 303 models, including 143 text models. The text catalog labels 17 uncensored. It also lists Claude, GPT, Gemini and Grok.",
      filterShort: "Mature filter on by default, Pro can turn it off",
      filter:
        "The Mature Filter is on by default. Pro users can switch it off in preferences. The terms require parental consent for ages 13 to 17 and require those users to keep the filter on.",
      privacyShort: "History stays on your device by default",
      privacy:
        "Venice keeps chat history on your device by default. Its paid plans offer encrypted backup and restore. In Anonymous mode, Venice tells you to assume the model provider stores your content. Pro also offers hardware-isolated and end-to-end encrypted inference on selected models.",
      apiShort: "",
      api: "OpenAI-compatible API, billed per token in USD credits. Staked DIEM gives $1 of API credit a day. Accountless pay-per-request with USDC via x402.",
      forWho:
        "Privacy-minded users who want uncensored chat and media in one app, plus developers and crypto holders.",
      pro1: "Big catalog with many uncensored text models and cheap uncensored API prices.",
      pro2: "History stays on your device by default.",
      con1: "Free tier is tight: 10 text prompts a day on base models.",
      con2: "Disabling the adult filter requires Pro. Video, music and premium models use credits.",
    },
    uncensoredAi: {
      what: "Single-model uncensored chat app with a community forum and document archives. Web, iOS and Android.",
      pricingNote:
        "Free: 3 responses a day. Pro prices are locked for life. Cards, Cash App, Apple Pay and Bitcoin. API credits sell separately at $0.05 per call.",
      models:
        "One model: UncensoredAI v1.2, 32K context, trained on books and documents banned from the mainstream internet. Its political opinions run against the mainstream.",
      filterShort: "No filter described, 18+ in terms",
      filter:
        "Calls itself an unrestricted AI platform. Terms require users to be 18 or older and ban content meant to harm, harass or endanger others.",
      privacyShort: "Not used for training, per its policy",
      privacy:
        "Its policy says your data is not used to train or improve AI models. Messages go to Parasail AI for processing. Pro keeps chat history with search and export.",
      apiShort: "",
      api: "Drop-in OpenAI-compatible API at $0.05 per inference.",
      forWho:
        "People who distrust mainstream narratives and want blunt answers on contested topics.",
      pro1: "Cheapest paid plan in this list, price locked for life.",
      pro2: "Not used for training, says its privacy policy.",
      con1: "One model, 32K context, no image, video or music generation.",
      con2: "Free tier is 3 responses a day; voice, folders and archives need Pro.",
    },
    nanoGpt: {
      what: "Pay-as-you-go web app and API for text, image, video and audio models. No subscription needed, optional plan for open models.",
      pricingNote:
        "First deposit: $0.10 in crypto or $1 by card, then $5 for card deposits. Sign in to add balance. The web has one free model. PRO (it was $8 until May 2026) covers 60M input tokens a week on selected open-source text models plus 100 images a day, for personal use. Claude, GPT, Gemini and Grok draw from your balance.",
      models:
        "The public text-model API returned 596 entries, 38 with IDs containing uncensored, abliterated or Dolphin. Examples include Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored and a Kimi K3.1 Pro abliterated variant.",
      filterShort: "No blanket NSFW ban, 18+",
      filter:
        "You must be at least 18 and old enough to enter a contract where you live. The terms ban child sexual abuse material and non-consensual intimate or sexually explicit content depicting identifiable people, including deepfakes. Providers may apply their own restrictions.",
      privacyShort: "History stays in your browser by default",
      privacy:
        "History stays in your browser by default, with optional cloud sync. NanoGPT says it does not log prompts and responses during normal inference. API content logging and chat memory are optional. Certain provider routes may retain prompts or use them for training. In November 2026 NanoGPT disclosed prompt exposures at several upstream providers and dropped those routes.",
      apiShort: "",
      api: "OpenAI-compatible API with Anthropic Messages support and accountless x402 payments. Some responses omit the cost or show an estimate while billing is pending.",
      forWho:
        "Pay-per-use users and developers who want every model, crypto payments and no subscription.",
      pro1: "Huge model list, mostly at list price, entry from ten cents.",
      pro2: "The free web model needs no account. History stays in your browser by default.",
      con1: "Free tier is one model on the web.",
      con2: "Privacy depends on the provider route you pick.",
    },
    openRouter: {
      what: "Developer API that routes one key to hundreds of models from many providers, billed per token from prepaid credits.",
      pricingNote:
        "No subscription. Provider list prices plus a 5.5% fee on credit purchases. Free models: 50 requests a day, 1,000 after you buy $10 of credits.",
      models:
        "474 models, 15 free. Uncensored options are thin: Venice Uncensored (Dolphin Mistral 24B, hosted by Venice) and roleplay fine-tunes like Hermes 4 and Magnum. 142 models are flagged as moderated.",
      filterShort: "Provider rules apply, many routes moderated",
      filter:
        "Terms require 18+. OpenRouter screens inputs for known CSAM. Each provider keeps control of its own model, and moderated routes decline per the vendor's policy.",
      privacyShort: "No prompt storage unless you opt in",
      privacy:
        "OpenRouter says it does not store prompts or responses unless you opt in. Metadata is always stored. Provider logging policies vary.",
      apiShort: "",
      api: "OpenAI-compatible API. This is the product.",
      forWho:
        "Developers who want one API key for many models with provider fallback.",
      pro1: "Huge catalog at list prices, no subscription.",
      pro2: "Logging and training are opt-in.",
      con1: "Few uncensored models.",
      con2: "No consumer chat app focus: you bring the interface.",
    },
    freedomGpt: {
      what: "All-in-one AI app: mainstream models next to its own censor-free model Liberty, with image and video generation. Also an older open-source desktop app for offline models.",
      pricingNote:
        "Start without a card or account. Pro includes 2,200 monthly credits and offers one-time top-ups. FreedomGPT estimates 10 credits for a premium reply, 25 for an image and 400 for a 5-second video.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral and more, plus Liberty and other censor-free models in the same list. No total count published.",
      filterShort: "Censor-free models, US law and ethics rules",
      filter:
        "FreedomGPT says everyone and every model it hosts must follow US law, and it does not allow its models to be used for unethical purposes. A censor-free label does not promise every request gets answered.",
      privacyShort: "Messages shared with AI providers",
      privacy:
        "FreedomGPT sends messages and attachments to the provider needed for the response. Its mobile privacy policy says providers may receive messages, recordings and images only to generate replies, and may not use them for their own purposes. It gives no fixed retention period for them.",
      apiShort: "",
      api: "API at chat.freedomgpt.com/api/v1 with a key from the dashboard. Pricing is not documented.",
      forWho:
        "Users who want one subscription for many models with censor-free options.",
      pro1: "Free start with no account or card.",
      pro2: "Images and video in the same app.",
      con1: "Still bound by US law and an unethical-use rule.",
      con2: "The open-source desktop app has not been updated since June 2024.",
    },
    gabAi: {
      what: "Multi-model AI platform from Gab with 214 models, its own model Arya, an agent mode, image, video and music generation and desktop apps. Openly right-wing Christian positioning.",
      pricingNote:
        "Free: 250 credits after email verification. One-time credit packs from $10 for 700 credits, never expire.",
      models:
        "214 models on one account: GPT, Claude, Gemini, DeepSeek, Qwen, Kimi and more. Arya is Gab's own model, built around Christian values and conservative principles.",
      filterShort: "Uncensored on speech, bans sexual content",
      filter:
        "Terms require 18+ and ban obscene, sexually explicit or pornographic content. Automated systems may scan content for compliance. Free on politics, not on adult content.",
      privacyShort: "Chats stored, used to improve models",
      privacy:
        "Gab keeps your prompts, answers and history on its servers and lists improving its models as a purpose. Requests reach model providers through Gab's own accounts; its policy says this does not make a request anonymous.",
      apiShort: "",
      api: "OpenAI and Anthropic compatible API. Requires a Plus plan.",
      forWho:
        "Conservative and Christian users who want AI built outside Big Tech.",
      pro1: "Large catalog, agent mode and desktop apps.",
      pro2: "Credit packs never expire.",
      con1: "Bans sexually explicit content: no help for adult fiction.",
      con2: "Prompts stored and used to improve models.",
    },
    janitorAi: {
      what: "Community character site with millions of user-made bots, a free built-in model (JLLM) and the option to plug in your own model through an API proxy.",
      pricingNote:
        "The US App Store lists $12.99 monthly and $99 annually for janitor+. The help center lists unlimited free chats on standard models with around 9K tokens of context. janitor+ adds 5× the context, priority replies and monthly swipes on premium models.",
      models:
        "JLLM, its own free model (base model not disclosed). Or any model you connect through a proxy: its official guide uses OpenRouter.",
      filterShort: "NSFW bots allowed if tagged, 18+ self-declared",
      filter:
        "Adults only, 18+ by self-declaration. Bots are tagged Limited (no sexual content) or Limitless (NSFW allowed). The mobile app starts in Safe Mode until you enable NSFW on the web. Banned: anything sexual involving minors, sexual violence, gore, bestiality, hate speech.",
      privacyShort: "Chats stored, used for research and development",
      privacy:
        "Chats are stored as user content and its policy lists research and development to improve its AI systems. With a proxy, your messages also go to that provider under its own policy.",
      apiShort: "Bring your own key",
      api: "No developer API. It consumes APIs: you can bring your own key through a proxy.",
      forWho:
        "Roleplayers who want a huge free library of community characters.",
      pro1: "Free unlimited chat with millions of community bots.",
      pro2: "Bring your own model through a proxy.",
      con1: "Free context is about 9K tokens: long stories forget early scenes.",
      con2: "Text only: no image, video or voice generation.",
    },
    sillyTavern: {
      what: "Free, open-source (AGPL-3.0) chat frontend you install yourself. Character cards, lorebooks, extensions. It ships no model: you connect one.",
      pricingNote:
        "The app is free forever. You pay whatever API you connect, or nothing if you run a model locally.",
      models:
        "SillyTavern ships without a model. It connects to local backends such as KoboldCpp, llama.cpp, Ollama and Oobabooga TextGeneration WebUI, and to cloud APIs such as OpenAI, Anthropic and OpenRouter.",
      filterShort: "None of its own: the model decides",
      filter:
        "No filter of its own. The limits are whatever the connected model or provider enforces.",
      privacyShort: "Chats stored on your machine",
      privacy:
        "SillyTavern stores chats in the local installation’s data directory. If you connect a cloud API or extension, it receives the data you send to it under its own policy.",
      apiShort: "Connects to APIs",
      api: "A client, not a provider. It talks to the API you configure.",
      forWho:
        "Power users who accept a steep learning curve for full control over prompts and characters.",
      pro1: "Maximum control: any backend, any prompt, rich extensions.",
      pro2: "Free, open source, nothing leaves your machine except what you send to an API.",
      con1: "You install and maintain it (Node.js 20 or newer), supply the model yourself, and iPhone has no install.",
      con2: "Steep learning curve, by the project's own description.",
    },
    characterAi: {
      what: "The biggest mainstream character chat platform, 10M+ characters on its own models, with strict content rules. Included here as the filtered contrast.",
      pricingNote:
        "Free: unlimited messages with ads. c.ai lite reduces ads and gives a daily premium-chat allowance. c.ai+ removes ads and gives unlimited premium chats and the full memory features. Prices vary by country.",
      models:
        "Character.AI offers its own chat styles. PipSqueak 3 and ShortSqueak are free. DeepSqueak and LongSqueak are premium styles. You cannot connect an external model key.",
      filterShort: "Filtered, pornography never supported",
      filter:
        "Pornographic content is against its terms and, in its words, will not be supported at any point in the future. Every user goes through age assurance via Persona. Users verified as under 18 get reading mode only, no chat.",
      privacyShort: "Chats can train its models and target ads",
      privacy:
        "Character.AI can use chat content to train its models. Its help center documents an opt-out for new chat content for users in the EEA and UK.",
      apiShort: "",
      api: "No public developer API.",
      forWho:
        "Safe-for-work entertainment chat with a giant character library.",
      pro1: "Huge character library and unlimited free messages.",
      pro2: "Cheap entry with lite, voice calls with characters.",
      con1: "No adult content, ever. Dark scenes get softened or refused.",
      con2: "Chats can be used for training and ads. No model choice.",
    },
    kindroid: {
      what: "AI companion app: one persistent friend or partner with long memory, voice and video calls, selfies and group chats.",
      pricingNote:
        "One-time preview of 50 messages, or 15 in some regions. Then the account becomes read-only. The separate 3-day trial requires a payment method and renews unless canceled. Ultra and MAX are monthly add-ons. Prices are from the US App Store.",
      models:
        "Ember powers the free preview and trial. Paid users can select Polaris and other in-house models, including Reverie. Kindroid also has its own selfie models.",
      filterShort: "Unfiltered stance, account-level red lines",
      filter:
        "It calls itself truly unfiltered and puts no filter on the AI itself, but scans messages for a few red lines such as imminent self-harm or harm to others. 18+: a paid subscription counts as age verification, Yoti is the alternative.",
      privacyShort: "Encrypted at rest, not end-to-end",
      privacy:
        "Chats are encrypted at rest and in transit, not end-to-end: its systems process content and automated safety systems review it. It says data is never sold.",
      apiShort: "Personal API to your companions",
      api: "Personal API keys to talk to your own Kindroids, not a general model API.",
      forWho:
        "Adults who want one long-term AI companion with voice, video and photos.",
      pro1: "Full companion stack: memory, selfies, voice and live video calls.",
      pro2: "Unfiltered stance aimed at adults.",
      con1: "When your free preview runs out, continuing requires a trial or subscription.",
      con2: "Top memory tiers stack up: Ultra and MAX on top of the base plan.",
    },
    nomi: {
      what: "AI companion with long-term memory, selfies, voice, group chats and image-to-video clips.",
      pricingNote:
        "Free: 50 messages a day. Standard unlocks unlimited messages and voice. Prices are from the US App Store. The old Launch plan was a one-time beta offer.",
      models:
        "Its own companion models, including Cambrian 6 and Solstice. No external model keys.",
      filterShort: "Text unfiltered, nudity filter on images",
      filter:
        "Its site says conversations are not restricted by arbitrary content filters. Images have a nudity filter because of app stores and payment processors. Under 18s may not use it.",
      privacyShort: "No data sales. Account deletion has exceptions.",
      privacy:
        "Nomi says it neither sells nor rents personal information. Account deletion generally removes personal information in about 28 days. Training, communications and legal archives have exceptions. Retained training data is no longer linked to you after deletion.",
      apiShort: "Personal API to your companions",
      api: "REST API to chat with your own Nomis, not a general model API.",
      forWho:
        "People who want an emotional, long-term companion that remembers.",
      pro1: "Memory built for long relationships.",
      pro2: "Free tier and a clear no-selling privacy stance.",
      con1: "Nudity filter on images.",
      con2: "Voice requires a subscription. The free plan caps chat at 50 messages a day.",
    },
    crushOn: {
      what: "NSFW character chat site with an Unfiltered switch and credit-metered access to third-party models.",
      pricingNote:
        "Free: unlimited chats on queued free models and 100 monthly credits for Pro models, no Ultra models. Paid tiers run from 2,000 to 125,000 credits a month, and yearly billing is cheaper. Unlimited Pro-model chat is a separate Chat Package.",
      models:
        "Models and context limits depend on the tier. CrushOn.AI’s public model list names Claude Opus 4.7 and 5.5, Claude Sonnet 4.6 and GLM 5.1 to 5.3 as Ultra options.",
      filterShort: "Unfiltered switch after an age check",
      filter:
        "An Unfiltered switch unlocks adult text after age verification: selfie or ID via Didit, AgeGo, or a $0.99 payment. Its guidelines still ban explicit sexual imagery, realistic images of real people, minors and aged-up characters.",
      privacyShort: "Chats may train its models",
      privacy:
        "Its policy says chat content may be used to train its models, not linked to specific users. Its SFW site claims the opposite. Cookies are used for retargeting ads.",
      apiShort: "",
      api: "No public developer API.",
      forWho: "Adults who want spicy character chat in a ready-made app.",
      pro1: "Adult roleplay in a polished app, free entry.",
      pro2: "Age check that, per CrushOn, never shows it your photo or ID.",
      con1: "Six credit tiers up to $199.99 a month: hard to predict cost.",
      con2: "Free history wiped after 7 days of inactivity; chats may train models.",
    },
    ollama: {
      what: "MIT-licensed tool that runs open models on your computer, with a local API and an official chat app for macOS and Windows. It also offers paid cloud models.",
      pricingNote:
        "Running models on your own hardware is free and unlimited. Paid plans only cover its cloud models.",
      models:
        "Any open model in its library, including Dolphin 3 and community abliterated uploads such as Qwen 3.8 abliterated. Community uploads are not vetted by Ollama.",
      filterShort: "Whatever model you load",
      filter:
        "Local inference uses the model you load. Community builds with abliteration aim to reduce refusals. The cloud service has its own terms.",
      privacyShort: "Fully local, prompts never leave your machine",
      privacy:
        "Ollama says it does not see prompts or responses when you run locally, and you can disable cloud features. Its privacy policy says cloud prompts and replies are processed temporarily and never used for training. It collects limited metadata.",
      apiShort: "",
      api: "OpenAI-compatible server on localhost:11434, plus a cloud API for its hosted models.",
      forWho:
        "Developers and technical users with a capable machine, often paired with a chat frontend.",
      pro1: "Total privacy and zero cost per message.",
      pro2: "Huge library, OpenAI-compatible local API.",
      con1: "Your hardware caps quality: a 70B model is a 43 GB download before context.",
      con2: "The official chat app is for macOS and Windows. On Linux, use the CLI, API or another frontend.",
    },
    lmStudio: {
      what: "Desktop app with a polished interface to download and run local models (GGUF and MLX), plus a local API server.",
      pricingNote:
        "Local models are free for personal and work use. Bionic+ and Pro add cloud inference, web search and higher device limits. The free plan includes offline voice transcription and LM Link for up to five devices.",
      models:
        "Run local GGUF or MLX models from Hugging Face, including Dolphin and community variants with reduced refusals. LM Studio’s cloud catalog includes Kimi K3.1 Pro, DeepSeek V4 Pro and GLM-5.3.",
      filterShort: "Whatever model you load",
      filter:
        "No filter of its own for local models. What refuses is the model you pick.",
      privacyShort: "Local inference stays on your device",
      privacy:
        "Local models run on your device. Its hosted services claim zero data retention.",
      apiShort: "",
      api: "OpenAI-compatible server on localhost:1234.",
      forWho:
        "Non-developers who want local models without a command line, on a Mac with Apple Silicon, Windows or Linux.",
      pro1: "Easiest way to run uncensored models locally.",
      pro2: "Free, including commercial use.",
      con1: "The app itself is closed source. No Intel Macs.",
      con2: "Same hardware ceiling as any local setup.",
    },
  },
  hub: {
    meta: {
      title: "Best Uncensored AI Platforms 2026: Honest Comparison",
      category: "Comparison",
      description:
        "{{count}} uncensored AI platforms compared: Venice, NanoGPT, Janitor AI, FreedomGPT, Kindroid, local models and more. Prices, filters, privacy, API. Sources cited.",
      imageAlt: "Uncensored AI platforms compared side by side",
      keywords:
        "best uncensored AI, uncensored AI platforms, uncensored AI chat, unfiltered AI, Venice AI alternative, Venice.ai review, NanoGPT, Janitor AI alternative, Character AI alternative, FreedomGPT, Gab AI, uncensored.ai, Kindroid, Nomi, CrushOn AI, SillyTavern, Ollama uncensored, LM Studio uncensored, abliterated models, NSFW AI chat, {{appName}}",
    },
    hero: {
      category: "Comparison",
      readTime: "14 min read",
      title: "Best uncensored AI platforms 2026: the honest comparison",
      subtitle:
        "{{count}} platforms, plus us. Real prices from their own pricing pages, how each one filters, what happens to your chats, and who each one is built for. Every fact has a source.",
    },
    intro: {
      lead: "Every uncensored AI site calls itself the most private, the most free, the least filtered. Half of them still ban adult content. Some train on your chats. One sells you a token. Marketing pages will not tell you which.",
      p2: "We read official pricing, policies and docs. The latest checks were on {{date}}. Each platform card gives its own date and sources.",
      disclosure:
        "Disclosure: {{appName}} is one of the platforms on this page, and we buy from several of the others. Venice, uncensored.ai, NanoGPT, FreedomGPT, Gab AI and OpenRouter serve some of our models through their APIs. We say where, with live numbers. No scores, no star ratings: facts and sources, you judge.",
    },
    picks: {
      title: "Quick picks: the best uncensored AI for each job",
      intro: "No platform wins everything. Start from what you need.",
      oneApp: {
        title: "Everything in one chat: {{appName}}",
        body: "{{modelCount}} models, {{uncensored}} of them uncensored, next to Claude, GPT and Gemini. Images, video, music and voice on the same balance. You switch the model per message.",
      },
      ownWorldview: {
        title:
          "A different worldview, not just fewer refusals: uncensored.ai's model",
        body: "Most uncensored models are mainstream models with the refusals cut out. uncensored.ai sells one model with its own takes. On {{appName}} it runs as {{ownModel}}, next to everything else.",
      },
      privacy: {
        title: "Browser-local chat history: Venice or NanoGPT",
        body: "Both keep history on your device by default. NanoGPT’s free web model works without an account. On {{appName}}, incognito history stays in your browser.",
      },
      roleplay: {
        title: "Community character roleplay: Janitor AI or SillyTavern",
        body: "Janitor AI for a huge free bot library. SillyTavern if you want total control and will set it up yourself.",
      },
      companions: {
        title: "One long-term AI companion: Kindroid or Nomi",
        body: "Memory, selfies, voice calls. Kindroid has no ongoing free tier; Nomi does but filters nudity in images.",
      },
      developers: {
        title: "API for uncensored models: NanoGPT, Venice or OpenRouter",
        body: "NanoGPT and Venice carry many uncensored models at low per-token prices. OpenRouter has the widest catalog but few uncensored options.",
      },
      local: {
        title: "Total privacy, zero cost per message: Ollama or LM Studio",
        body: "Run abliterated models on your own machine. Nothing leaves it. Your hardware sets the quality ceiling.",
      },
      filtered: {
        title: "You want the filter: Character.AI",
        body: "Filtered character chat with age checks. Under-18 accounts get reading mode without chat.",
      },
    },
    table: {
      title: "All {{count}} platforms and {{appName}}, side by side",
      intro:
        "Scroll sideways on mobile. Latest checks: {{date}}. Each platform card has its own date. Our facts come from our live config.",
      footnote:
        "Prices are US list prices. For Kindroid, Nomi and janitor+, we use the US App Store listing. Taxes, regional prices and promotions vary. Limited can mean a personal API, your own external key or an add-on.",
    },
    kinds: {
      title: "Uncensored is not one thing: four kinds of filtering",
      intro:
        "Before you compare platforms, know what the label hides. The model decides more than the app.",
      abliterated:
        "Abliterated: a mainstream or open model with its refusal direction removed from the weights. Researchers found refusal sits in a single direction inside the model; cut it and the model stops saying no. Same knowledge, same worldview, no dodging.",
      finetuned:
        "Decensored fine-tunes (Dolphin, Venice Uncensored): retrained on data that drops refusals. Same idea, different method.",
      ownWorldview:
        "Own worldview: {{ownModel}} is trained on books and documents banned from the mainstream internet. It does not just stop refusing, it argues takes the mainstream models will not give you.",
      filtered:
        'Filtered: mainstream models and apps like Character.AI. A safety layer decides before you type. On most "uncensored" platforms, the mainstream models keep their vendor\'s filters too.',
      tradeoff:
        "The trade-off: the abliteration write-up itself measured a quality drop on every benchmark, partly recovered by extra training. Uncensored models are usually smaller than frontier models. Use them for what the filter blocks, not for your hardest reasoning.",
      sourceName: "Abliteration",
    },
    platforms: {
      title: "Every platform, in detail",
      intro:
        "What each platform offers, costs and filters. Latest checks: {{date}}. See each card for its own date and sources.",
      price: "Price: {{plans}}. {{note}}",
      models: "Models: {{text}}",
      filter: "Filter and consent: {{text}}",
      privacy: "Privacy: {{text}}",
      api: "API: {{short}}. {{text}}",
      media: "Media: {{text}}",
      open: "Open source: {{text}}",
      forWho: "Built for: {{text}}",
      strengths: "Strengths",
      limits: "Limits",
      sources: "Sources, checked {{date}}",
    },
    upstream:
      "{{appName}} runs {{models}} models through {{name}}'s API ({{uncensored}} of them uncensored), including {{examples}}. Same models, our chat, our billing.",
    us: {
      title: "Where {{appName}} fits, honestly",
      intro:
        "We are not a model lab. We are the chat that puts every kind of model in one place and lets you choose the filter.",
      models:
        "{{modelCount}} chat models from {{labCount}} labs: {{mainstream}} mainstream, {{open}} open, {{uncensored}} uncensored. You pick the model per message, so one thread can mix Claude and an abliterated model.",
      upstream:
        "Our uncensored models come from providers on this page. Venice serves {{veniceModels}} of our models, NanoGPT {{nanoGptModels}}, uncensored.ai {{uncensoredAiModels}}, FreedomGPT {{freedomGptModels}}, Gab AI {{gabAiModels}}. We aggregate, we do not train.",
      consent:
        "Uncensored models unlock after a one-time 18+ confirmation. No refusal layer on top. Humans decide what they read, not a corporation.",
      privacy:
        "Incognito chats live in your browser, not on our servers, and need no account. Private chats sync to your account. Every message still passes through us to the provider that answers it.",
      pricing:
        "{{guestCredits}} free credits a month without an account, {{freeCredits}} with one. Plans: {{planList}} a month. Credit packs top up an active plan and never expire. Card, PayPal or crypto.",
      api: "OpenAI and Anthropic compatible API for chat, images, video and speech, after any plan (from {{apiSubPrice}}) or a credit purchase.",
      media:
        "{{imageModels}} image, {{videoModels}} video, {{musicModels}} music and {{voiceModels}} voice models on the same balance.",
      open: "The whole platform is open source. Self-host it if you want no middleman at all.",
      weakTitle: "Where we are not the best pick",
      weak1:
        "Price per token: we add {{markup}}% to provider costs. If you only want one provider's models, going direct to Venice or NanoGPT is cheaper.",
      weak2:
        "Character library: Janitor AI and Character.AI have millions of community bots. Ours is far smaller, though you can import characters from Character.AI and Talkie links.",
      weak3:
        "Companion features: no selfies or live video calls like Kindroid or Nomi. We are a chat workspace, not a companion app.",
      weak4:
        "Total privacy: a local model on your own machine beats any hosted service, us included.",
      modelsLink: "See all {{modelCount}} models with live prices",
      pricingLink: "Plans and free credits",
      guideLink: "Guide: every uncensored model and what it is good at",
    },
    versus: {
      title: "Head-to-head comparisons",
      intro:
        "The {{versusCount}} platforms people compare us with most, each on its own page with pros, cons and a clear pick.",
    },
    method: {
      title: "How we compared",
      intro: "How we checked. Latest source review: {{date}}.",
      sources:
        "Official pages only: each platform's pricing page, terms, privacy policy, help center, API docs or model list. Review sites were never a source.",
      prices:
        "Prices are USD list prices as shown on the day. Where a price sits behind a login, we used the platform's official app store listing and say so.",
      noScores:
        "No scores, no ratings, no winner badge. Different jobs need different platforms.",
      us: "Our own numbers (models, prices, free credits) are read live from the config that bills you, so they cannot drift from what you pay.",
      bias: "We are a competitor and a customer of several platforms here. We say where we route to them and list the cases where you should pick someone else.",
      changes:
        "Plans and policies change. Each card links its sources: check them before you buy. Where a page did not say something, we left it out instead of guessing.",
      corrections:
        "Found an outdated price or a wrong claim? Tell us with a link to the source and we fix it.",
      correctionsLink: "Contact us",
    },
    faq: {
      title: "FAQ",
      best: {
        q: "What is the best uncensored AI?",
        a: "It depends on the job. For many models plus media in one chat: {{appName}}. For privacy-first chat: Venice or NanoGPT. For community roleplay: Janitor AI or SillyTavern. For a companion: Kindroid or Nomi. For total privacy: a local model with Ollama or LM Studio.",
      },
      free: {
        q: "Is there a free uncensored AI?",
        a: "Yes, with limits. Venice gives 10 text prompts a day, uncensored.ai 3 responses, Janitor AI unlimited chat on its own model, CrushOn 100 credits a month, {{appName}} {{guestCredits}} credits a month without an account. Local models with Ollama or LM Studio cost nothing per message.",
      },
      private: {
        q: "Which uncensored AI is the most private?",
        a: "Local inference keeps chat content on your machine. Venice and NanoGPT keep history on your device by default. NanoGPT’s free web model works without an account. On {{appName}}, incognito history stays in your browser. Hosted services still send requests to the model that answers.",
      },
      difference: {
        q: "What is the difference between abliterated and uncensored models?",
        a: "Abliterated models are mainstream or open models with the refusal direction cut out of the weights: same knowledge, same worldview, no refusals. Fine-tunes like Dolphin get there by retraining. {{ownModel}} is different again: trained on books and documents banned from the mainstream internet, with its own takes.",
      },
      veniceVs: {
        q: "Is Venice AI really uncensored?",
        a: "Its uncensored models are, and its mature filter is on by default until a Pro subscriber turns it off. Its mainstream models (Claude, GPT, Gemini) keep their own vendor filters, like everywhere else.",
      },
      characterAi: {
        q: "Is there a Character.AI without a filter?",
        a: "Not from Character.AI: it says pornographic content will never be supported. Alternatives with adult roleplay: Janitor AI (Limitless bots), CrushOn (Unfiltered switch), Kindroid, SillyTavern with an uncensored model, or {{appName}} with uncensored roleplay models.",
      },
      gabAi: {
        q: "Is Gab AI uncensored?",
        a: "On politics, culture and faith, yes: its own model Arya is built for that. On adult content, no: its terms ban sexually explicit content. {{appName}} runs Arya too, next to uncensored models that allow adult fiction.",
      },
      uncensoredAi: {
        q: "What is the difference between uncensored.ai and other uncensored AI?",
        a: "Most uncensored AI is a mainstream model with the refusals cut out. uncensored.ai's model is trained on books and documents banned from the mainstream internet, so its political opinions run against the mainstream. On {{appName}} it runs as {{ownModel}}.",
      },
      openRouter: {
        q: "Does OpenRouter have uncensored models?",
        a: "A few: Venice Uncensored and roleplay fine-tunes like Hermes 4 and Magnum, and 142 of its 474 models are flagged as moderated. For more uncensored choice in one API, NanoGPT, Venice and {{appName}} carry far more.",
      },
      local: {
        q: "Can I run an uncensored AI on my own computer?",
        a: "Yes. Ollama or LM Studio plus an abliterated or Dolphin model. An 8B model is a 5 GB download and runs on a typical laptop. A 70B model needs over 40 GB of memory. Quality is capped by your hardware.",
      },
      legal: {
        q: "Is it legal to use an uncensored AI?",
        a: "Using one is legal in most countries. What you generate and publish is still bound by the law where you live. Every platform here bans content involving minors and most ban non-consensual imagery of real people.",
      },
    },
    cta: {
      title: "Test it on your own prompts",
      subtitle:
        "{{guestCredits}} free credits a month, no account. Ask the question that got refused elsewhere and compare.",
      try: "Start an incognito chat",
      models: "Browse all models",
    },
  },
  versus: {
    venice: {
      meta: {
        title: "{{appName}} vs Venice AI: Honest Comparison 2026",
        description:
          "{{appName}} vs Venice.ai: prices, uncensored models, mature filter, privacy and API side by side. We buy from Venice, so we say exactly where each one wins.",
        keywords:
          "Venice AI alternative, Venice.ai vs, Venice AI review, Venice AI pricing, Venice Pro, Venice uncensored, is Venice AI uncensored, Venice AI mature filter, Venice AI API, VVV DIEM, uncensored AI chat, {{appName}} vs Venice",
      },
      hero: {
        title: "{{appName}} vs Venice AI",
        subtitle:
          "Two uncensored AI platforms, one of which buys from the other. Prices, filters, privacy and API, side by side.",
        readTime: "7 min read",
      },
      intro: {
        lead: "Venice is the best-known name in private, uncensored AI. Many of our uncensored models run on Venice's API. So this is not a takedown. It is the honest answer to one question: should you use Venice directly, or through {{appName}}?",
        p2: "Venice facts from its own pricing, privacy and docs pages, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "We are a Venice customer: {{veniceModels}} of our models run through Venice's API ({{veniceUncensored}} of them uncensored), including {{veniceExamples}}. Same models, different app around them.",
      verdict:
        "Pick Venice if you want its full catalog, local-only history and the cheapest per-token price on its own models, and you are fine paying for Pro to drop the mature filter. Pick {{appName}} if you want Venice's uncensored models next to Claude, GPT, uncensored.ai's model and abliterated GLM and DeepSeek builds from other providers, in one chat, with no filter to unlock beyond a one-time 18+ confirmation.",
      themPros: {
        a: "303 models in its API catalog, including video, music and voice.",
        b: "History stays on your device by default. Strong privacy story.",
        c: "Cheapest way to call Venice's own models: no middleman markup, plus DIEM staking for daily API credit.",
      },
      themCons: {
        a: "Free tier: 10 text prompts a day, base models only.",
        b: "The mature filter is on by default. Turning it off needs Pro.",
        c: "Only Venice's lineup: no uncensored.ai model, no models from providers Venice does not host.",
      },
      usPros: {
        a: "Venice's uncensored models plus uncensored models from NanoGPT, uncensored.ai, FreedomGPT and Gab AI in one model picker.",
        b: "No mature filter to buy your way out of: a one-time 18+ confirmation unlocks every uncensored model, even on the free tier.",
        c: "{{guestCredits}} free credits a month without an account, and the whole platform is open source.",
      },
      usCons: {
        a: "On Venice's own models we cost more: our {{markup}}% markup sits on top of Venice's price.",
        b: "Smaller catalog than Venice overall.",
        c: "We store private chats for sync. Incognito history stays in your browser. Venice keeps history local by default and offers encrypted backup on paid plans.",
      },
      chooseThem: {
        a: "You want the largest uncensored catalog from a single provider.",
        b: "You hold or want to stake VVV for API credit.",
        c: "You call Venice's models via API and every cent per token matters.",
      },
      chooseUs: {
        a: "You want models Venice does not carry, like {{ownModel}}, in the same chat.",
        b: "You want uncensored without paying for a plan to remove a filter.",
        c: "You want open source, self-hostable software and one balance for chat, images, video and music.",
      },
      both: "Using both is normal. Venice for its catalog, {{appName}} when you want to compare Venice's answer against another provider's uncensored model in the same thread.",
      switch: {
        title: "Switching from Venice",
        body: "Nothing to migrate for the models: Venice Uncensored and the other Venice models are in our picker under the same names. Start an incognito chat, pick a Venice model, and continue where you left off. Paste old context into the first message if you need it.",
      },
      faq: {
        q1: {
          q: "Is {{appName}} the same as Venice?",
          a: "No. We are a separate, open-source platform. Some of our models run on Venice's API, others come from NanoGPT, uncensored.ai, FreedomGPT, Gab AI, OpenRouter and the big labs.",
        },
        q2: {
          q: "Is Venice AI free?",
          a: "Free accounts get 10 text and 15 image prompts a day on base models. Pro includes unlimited text, up to 1,000 images a day on Pro models, and the option to turn off the Mature Filter for adults.",
        },
        q3: {
          q: "Is Venice cheaper than {{appName}}?",
          a: "For Venice's own models, yes: we add {{markup}}% to provider costs. For mixing models across providers in one app, we save you separate subscriptions.",
        },
        q4: {
          q: "Which is more private, Venice or {{appName}}?",
          a: "Venice keeps history on your device by default, with encrypted backup on paid plans. {{appName}} keeps incognito history in the browser and saves private chats for sync. On both, messages still go to the model that answers them.",
        },
      },
      cta: { title: "Try Venice's models next to everything else" },
    },
    characterAi: {
      meta: {
        title:
          "Character.AI Alternative Without Filter: {{appName}} vs Character.AI",
        description:
          "{{appName}} vs Character.AI: filters, age checks, models, privacy and price. When Character.AI is the right call, and when you need an uncensored alternative.",
        keywords:
          "Character AI alternative, Character AI alternative without filter, Character.AI filter, c.ai+ price, Character AI NSFW, Character AI age verification, uncensored character AI, AI roleplay without filter, {{appName}} vs Character.AI",
      },
      hero: {
        title: "{{appName}} vs Character.AI: the alternative without a filter",
        subtitle:
          "The biggest character chat platform against an open, uncensored one. What each allows, what each costs, where your chats go.",
        readTime: "7 min read",
      },
      intro: {
        lead: "Character.AI has the biggest character library on the internet and a filter that will not move. Its own help center says pornographic content will not be supported at any point in the future. If that is a dealbreaker, you need a different platform, not a jailbreak.",
        p2: "Character.AI facts from its subscription, help center and privacy pages, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "No business relationship with Character.AI. You can bring a character over: paste its Character.AI link and {{appName}} imports it as a skill.",
      verdict:
        "Pick Character.AI for safe-for-work fun with millions of ready-made characters, free and unlimited, or for anyone under 18. Pick {{appName}} if the filter keeps breaking your story: uncensored roleplay models after a one-time 18+ confirmation, model choice per message, and chats that are not used to train anyone's models.",
      themPros: {
        a: "Millions of community characters, ready to chat.",
        b: "Unlimited free messages, cheap paid tiers.",
        c: "Voice calls with characters.",
      },
      themCons: {
        a: "No adult content, ever, and dark scenes get softened.",
        b: "Chat content can be used for training. The help center documents an opt-out for new content in the EEA and UK.",
        c: "Its own models only. No choice, no own key.",
      },
      usPros: {
        a: "{{uncensored}} uncensored models, several built for roleplay. Scenes go where the story goes.",
        b: "Pick the model per message: an uncensored roleplay model for the scene, a frontier model for planning.",
        c: "Incognito chats stay in your browser. We do not train models on your chats.",
      },
      usCons: {
        a: "Far fewer ready-made characters. You import or write your own.",
        b: "Metered credits instead of unlimited free messages.",
        c: "No voice calls with characters.",
      },
      chooseThem: {
        a: "You want safe-for-work chat with a giant character library.",
        b: "A reader under 18 only needs reading mode.",
        c: "You want unlimited free messages and never think about cost.",
      },
      chooseUs: {
        a: "The filter keeps breaking your roleplay.",
        b: "You want to pick the model, not get one assigned.",
        c: "You want your chats kept out of training and ad targeting.",
      },
      both: "Many people keep Character.AI for light chat and move the stories that need an adult model here, using the import to bring the character along.",
      switch: {
        title: "Moving a character from Character.AI",
        body: "Copy the character's Character.AI link, paste it into the skill import on {{appName}}, and the name, greeting and definition come over where the character makes them public. Then pick an uncensored roleplay model and continue the story.",
      },
      faq: {
        q1: {
          q: "Does Character.AI allow NSFW?",
          a: "No. Its help center says pornographic content is against its terms and will not be supported at any point in the future.",
        },
        q2: {
          q: "Does Character.AI require age verification?",
          a: "Yes. Users go through age assurance with Persona. Users verified as under 18 get reading mode only, without chat.",
        },
        q3: {
          q: "Is {{appName}} a Character.AI alternative without a filter?",
          a: "Yes for adults. Uncensored models unlock after a one-time 18+ confirmation, and several are built for roleplay. Mainstream models keep their vendors' filters, so pick an uncensored one for adult scenes.",
        },
        q4: {
          q: "Can I import my Character.AI characters?",
          a: "Yes: paste the character's link into the skill import. What comes over depends on what the creator made public on Character.AI.",
        },
      },
      cta: { title: "Continue the story without the filter" },
    },
    janitorAi: {
      meta: {
        title: "Janitor AI Alternative: {{appName}} vs Janitor AI (2026)",
        description:
          "{{appName}} vs Janitor AI: JLLM vs {{modelCount}} models, context limits, NSFW rules, proxies, privacy and price. Honest pros and cons for roleplay.",
        keywords:
          "Janitor AI alternative, Janitor AI vs, JanitorAI, janitor+ price, JLLM, Janitor AI proxy, Janitor AI OpenRouter, Janitor AI context limit, NSFW AI roleplay, uncensored roleplay AI, {{appName}} vs Janitor AI",
      },
      hero: {
        title: "{{appName}} vs Janitor AI",
        subtitle:
          "The biggest free roleplay community against a multi-model uncensored chat. Models, memory, rules, price.",
        readTime: "6 min read",
      },
      intro: {
        lead: "Janitor AI won roleplay on two things: millions of community bots and a free model. The catch shows up in long stories. Free context sits around 9K tokens, and the better models mean setting up a proxy with your own key.",
        p2: "Janitor AI facts from its janitor+ page, help center and policies, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "No business relationship with Janitor AI. Different shapes: Janitor is a character library with one free model, we are a model library with characters.",
      verdict:
        "Pick Janitor AI for the bot library and free unlimited chat on JLLM. Pick {{appName}} if you want strong uncensored models with long context ready to go, no proxy setup, and images, video and voice in the same chat.",
      themPros: {
        a: "Millions of community bots, with Limitless tags for NSFW.",
        b: "Free unlimited chat on its own model.",
        c: "Bring your own model through a proxy, OpenRouter included.",
      },
      themCons: {
        a: "About 9K tokens of free context: long campaigns forget.",
        b: "janitor+ includes a monthly allowance on premium models. Connecting your own model takes an API key and a proxy.",
        c: "Text only, and the mobile app starts in Safe Mode.",
      },
      usPros: {
        a: "{{modelCount}} models in the picker, {{uncensored}} uncensored, no proxy or key to configure.",
        b: "Long-context uncensored models for campaigns that run for weeks.",
        c: "Images, video, music and voice from the same chat and balance.",
      },
      usCons: {
        a: "A tiny character library next to Janitor's.",
        b: "No unlimited free tier: {{guestCredits}} free credits a month, then a plan.",
        c: "Less of a community: no public bot feed.",
      },
      chooseThem: {
        a: "You want to browse thousands of ready-made bots.",
        b: "You want free unlimited chat and the free model is good enough.",
        c: "You already run your own key through a proxy and like it.",
      },
      chooseUs: {
        a: "Long stories need long context and a strong uncensored model.",
        b: "You want to switch models mid-scene without touching proxy settings.",
        c: "You want images or voice for your characters in the same place.",
      },
      both: "Common setup: discover characters on Janitor AI, run the long campaigns on {{appName}}.",
      switch: {
        title: "Moving from Janitor AI",
        body: "Create a skill on {{appName}} with your character's personality, scenario and greeting, then pick an uncensored roleplay model. Incognito chats need no account, so you can test a scene before you sign up.",
      },
      faq: {
        q1: {
          q: "Is Janitor AI free?",
          a: "Yes: unlimited chats on its own model with about 9K tokens of context. janitor+ adds more memory, speed and models.",
        },
        q2: {
          q: "Does Janitor AI allow NSFW?",
          a: "Yes for adults on bots tagged Limitless, on the web. The mobile app starts in Safe Mode until you enable NSFW in web settings.",
        },
        q3: {
          q: "Do I need a proxy on {{appName}}?",
          a: "No. Every model is in the picker. You pay credits per message, no API key needed.",
        },
        q4: {
          q: "Which has better memory for long roleplay?",
          a: "Janitor AI lists around 9K tokens of free context and five times as much with janitor+. On {{appName}}, context depends on the model you choose.",
        },
      },
      cta: { title: "Run your next campaign on a long-context model" },
    },
    nanoGpt: {
      meta: {
        title: "{{appName}} vs NanoGPT: Honest Comparison 2026",
        description:
          "{{appName}} vs NanoGPT: pay-as-you-go vs plans, uncensored and abliterated models, privacy, API and media. We buy from NanoGPT and say where it wins.",
        keywords:
          "NanoGPT alternative, NanoGPT vs, nano-gpt review, NanoGPT pricing, NanoGPT PRO, NanoGPT uncensored, abliterated models API, pay as you go AI, uncensored AI API, {{appName}} vs NanoGPT",
      },
      hero: {
        title: "{{appName}} vs NanoGPT",
        subtitle:
          "Two multi-model platforms with uncensored models and an API. One pay-as-you-go, one plan-based. One sells to the other.",
        readTime: "6 min read",
      },
      intro: {
        lead: "NanoGPT charges per use, with a free model you can try without signing up. Several of our uncensored models run on its API. Here's when each platform makes sense.",
        p2: "NanoGPT facts from its pricing, privacy and terms pages and its public model list, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "We are a NanoGPT customer: {{nanoGptModels}} of our models run through NanoGPT's API ({{nanoGptUncensored}} of them uncensored), including {{nanoGptExamples}}.",
      verdict:
        "Pick NanoGPT for a broad catalog and pay-as-you-go access, including accountless API calls with x402. Pick {{appName}} for a tested selection across providers, free monthly credits, skills, memory and an open-source chat you can host yourself.",
      themPros: {
        a: "596 text model entries. 38 IDs contain uncensored, abliterated or Dolphin.",
        b: "No subscription needed. First top-up from $0.10 in crypto after signing in.",
        c: "List prices on auto-routed models, cheaper than any middleman.",
      },
      themCons: {
        a: "Free tier is one model on the web.",
        b: "Privacy depends on the provider route; some routes allow training.",
        c: "A catalog that big means you do the testing yourself.",
      },
      usPros: {
        a: "A curated picker: every model tagged mainstream, open or uncensored, with a page and a live price.",
        b: "{{guestCredits}} free credits a month, enough to try uncensored models on your own prompts.",
        c: "Skills, memory, folders and a chat built for long work, open source and self-hostable.",
      },
      usCons: {
        a: "Fewer models than NanoGPT.",
        b: "We add {{markup}}% to provider costs, so the same model costs more here.",
        c: "Plans first: credit packs top up an active plan.",
      },
      chooseThem: {
        a: "You want pay-as-you-go without a subscription, or accountless API calls via x402.",
        b: "You need an obscure model only a huge catalog carries.",
        c: "You build on the API and want list prices.",
      },
      chooseUs: {
        a: "You want a tested shortlist.",
        b: "You want free monthly credits and a polished chat with skills and memory.",
        c: "You want uncensored.ai's model and Venice's models next to NanoGPT's in one thread.",
      },
      both: "Developers often use NanoGPT's API for batch jobs and {{appName}} as their daily chat.",
      switch: {
        title: "Switching from NanoGPT",
        body: "The NanoGPT-served models in our picker, like {{nanoGptExamples}}, are the same models. Start an incognito chat, pick one and compare answers with a model from another provider in the same thread.",
      },
      faq: {
        q1: {
          q: "Is NanoGPT cheaper than {{appName}}?",
          a: "Per token, usually yes: NanoGPT charges list prices and we add {{markup}}%. We give {{guestCredits}} free credits a month and one app for every provider.",
        },
        q2: {
          q: "Does NanoGPT need an account?",
          a: "The free web model works without an account. You must sign in to add balance on the website. The API supports accountless x402 payments.",
        },
        q3: {
          q: "Do both have an API?",
          a: "Yes. NanoGPT's API is OpenAI and Anthropic compatible with accountless payments. Ours is OpenAI and Anthropic compatible and unlocks after a plan or credit purchase.",
        },
        q4: {
          q: "Which has more uncensored models?",
          a: "NanoGPT lists more in total. {{appName}} has {{uncensored}}, picked and tested, from NanoGPT, Venice, uncensored.ai, FreedomGPT and Gab AI.",
        },
      },
      cta: { title: "Compare NanoGPT's models with everyone else's" },
    },
    freedomGpt: {
      meta: {
        title: "FreedomGPT Alternative: {{appName}} vs FreedomGPT (2026)",
        description:
          "{{appName}} vs FreedomGPT: Liberty and censor-free models, content rules, privacy, credits, API and open source. Facts with sources, both sides.",
        keywords:
          "FreedomGPT alternative, FreedomGPT vs, FreedomGPT review, FreedomGPT pricing, FreedomGPT Pro, Liberty model, FreedomGPT uncensored, censor-free AI, uncensored ChatGPT alternative, {{appName}} vs FreedomGPT",
      },
      hero: {
        title: "{{appName}} vs FreedomGPT",
        subtitle:
          "Two apps that put censor-free models next to ChatGPT, Claude and Gemini. Rules, privacy, credits, open source.",
        readTime: "6 min read",
      },
      intro: {
        lead: "FreedomGPT and {{appName}} share an idea: mainstream and uncensored models in one list. The differences are in the rules, the credits and what happens to your messages.",
        p2: "FreedomGPT facts from its homepage, pricing, privacy policy, docs and GitHub, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "We are a FreedomGPT customer: {{freedomGptExamples}} runs on {{appName}} through FreedomGPT's own API.",
      verdict:
        "Pick FreedomGPT for one $20 plan covering chat, images and video with a free start and no account. Pick {{appName}} if you want more uncensored models from several providers, no unethical-use clause on top of the law, published per-model prices and an open-source platform that is actively developed.",
      themPros: {
        a: "Free with no card or account.",
        b: "Liberty and other censor-free models next to ChatGPT, Claude and Gemini.",
        c: "Image and video generation in the same plan.",
      },
      themCons: {
        a: "Models must follow US law and may not be used for unethical purposes, by its rules.",
        b: "Messages, voice and images go to third-party providers; no retention period stated.",
        c: "The open-source desktop app has not been updated since June 2024.",
      },
      usPros: {
        a: "{{uncensored}} uncensored models from five providers, Liberty included.",
        b: "Every model has a public page with its live price per message.",
        c: "The whole platform is open source and actively developed. Self-host it.",
      },
      usCons: {
        a: "No flat all-in plan: credits are metered per model.",
        b: "Account needed for memory and synced chats.",
        c: "Our {{markup}}% markup applies to FreedomGPT-served models too.",
      },
      chooseThem: {
        a: "You want one simple $20 plan for chat, images and video.",
        b: "You only need Liberty and the mainstream models.",
        c: "You want an offline desktop app and the 2024 version is fine.",
      },
      chooseUs: {
        a: "You want more uncensored choice: Venice, NanoGPT, uncensored.ai and Gab models too.",
        b: "You want to see the price per message before you send it.",
        c: "You want current, self-hostable open-source software.",
      },
      both: "FreedomGPT's Liberty is in our picker, so you can test it against other uncensored models without a second subscription.",
      switch: {
        title: "Switching from FreedomGPT",
        body: "Pick Liberty in our model picker and keep going. Then try the same prompt on {{ownModel}} or an abliterated model and keep whichever answers best.",
      },
      faq: {
        q1: {
          q: "Is FreedomGPT really uncensored?",
          a: "Its censor-free models drop most refusals, but FreedomGPT says every model it hosts must follow US law and may not be used for unethical purposes, and a censor-free label does not guarantee every request is answered.",
        },
        q2: {
          q: "How much does FreedomGPT cost?",
          a: "It is free to start. Pro includes 2,200 credits a month; a premium reply costs about 10, an image about 25 and a 5-second video about 400.",
        },
        q3: {
          q: "Is FreedomGPT open source?",
          a: "Its older desktop app for offline models is open source (GPL-3.0) on GitHub, last updated in June 2024. The cloud app is not. {{appName}} is open source as a whole.",
        },
        q4: {
          q: "Can I use FreedomGPT's Liberty model on {{appName}}?",
          a: "Yes. It runs through FreedomGPT's API and sits in our picker next to the other uncensored models.",
        },
      },
      cta: { title: "Test Liberty against every other uncensored model" },
    },
    gabAi: {
      meta: {
        title: "Gab AI Alternative: {{appName}} vs Gab AI (2026)",
        description:
          "{{appName}} vs Gab AI: Arya, 214 models, the ban on sexual content, privacy, credits and API side by side. We buy from Gab, so we say where each one wins.",
        keywords:
          "Gab AI alternative, Gab AI vs, Gab AI review, Gab AI pricing, Gab AI Plus, Arya AI, Gab Arya, is Gab AI uncensored, Gab AI NSFW, Gab AI API, conservative AI chatbot, right-wing AI, uncensored AI chat, {{appName}} vs Gab AI",
      },
      hero: {
        title: "{{appName}} vs Gab AI",
        subtitle:
          "Two multi-model apps that refuse to censor politics. One also bans adult content. Prices, rules, privacy and API, side by side.",
        readTime: "7 min read",
      },
      intro: {
        lead: "Gab AI built Arya for people tired of chatbots that lecture them on politics, culture and faith. We run Arya too, through Gab's own API. So the real question is not which one is uncensored. It is which rules you want around the model.",
        p2: "Gab AI facts from its homepage, pricing page, API page, terms and privacy policy, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "We are a Gab AI customer: {{gabAiExamples}} runs on {{appName}} through Gab's own API. Same model, different app and different rules around it.",
      verdict:
        "Pick Gab AI if you want Arya with Gab's agent mode, desktop apps and a catalog of 214 models under one conservative brand, and you never need adult content. Pick {{appName}} if you want Arya next to {{ownModel}} and abliterated GLM and DeepSeek builds in one chat, adult fiction on the uncensored models that allow it, and chats that can stay in your browser.",
      themPros: {
        a: "214 models on one account, plus Arya, its own model for politics, culture and faith.",
        b: "Agent mode (Work), live voice, image, video and music, apps for Mac, Windows, iPhone and Android.",
        c: "Purchased credit packs carry forward and do not expire.",
      },
      themCons: {
        a: "Its terms ban obscene, sexually explicit or pornographic content, and automated systems may scan your content.",
        b: "Prompts, answers and history are kept on its servers, and improving its models is a listed purpose.",
        c: "Free means 250 one-time signup credits after email verification. The API needs Plus or Plus Premium.",
      },
      usPros: {
        a: "{{uncensored}} uncensored models from several providers, Arya included, in one model picker.",
        b: "No blanket ban on adult content: a one-time 18+ confirmation unlocks every uncensored model.",
        c: "{{guestCredits}} free credits a month without an account. Incognito chats stay in your browser.",
      },
      usCons: {
        a: "No agent mode or desktop app like Gab's Work.",
        b: "Smaller catalog: {{modelCount}} chat models against Gab's 214.",
        c: "Our {{markup}}% markup applies to Arya too.",
      },
      chooseThem: {
        a: "You want Arya with Gab's agent mode and desktop apps.",
        b: "You share Gab's values and want to support an AI company built outside Big Tech.",
        c: "You never write adult fiction and want the largest catalog on one bill.",
      },
      chooseUs: {
        a: "You want to compare Arya with {{ownModel}} and abliterated models in the same thread.",
        b: "You write adult or dark fiction and need models that allow it.",
        c: "You want to start without an account and keep incognito chats in your browser.",
      },
      both: "Arya is in our picker, so you can run the same question on Arya, {{ownModel}} and an abliterated model and judge the answers yourself, without a second subscription.",
      switch: {
        title: "Switching from Gab AI",
        body: "Pick Arya in our model picker and keep going. Then send the same prompt to {{ownModel}}: both refuse to dodge politics, but they were built differently, and the answers show it. Paste old context into the first message if you need it.",
      },
      faq: {
        q1: {
          q: "Is Gab AI really uncensored?",
          a: "On politics, culture and faith, yes: that is what Arya is built for. On sexual content, no. Gab's terms ban obscene, sexually explicit or pornographic content and say automated systems may scan your content for compliance.",
        },
        q2: {
          q: "How much does Gab AI cost?",
          a: "Free accounts get 250 signup credits after email verification. Plus costs $20 a month or $200 a year with 2,000 credits a month. Plus Premium costs $999 a year with 12,000 credits. Credit packs start at $10 for 700 credits.",
        },
        q3: {
          q: "Can I use Arya on {{appName}}?",
          a: "Yes. Arya runs through Gab's API and sits in our picker next to {{ownModel}} and the other uncensored models. Gab's own content rules still apply to Arya's answers.",
        },
        q4: {
          q: "Does Gab AI keep my chats?",
          a: "Yes. Its privacy policy says it keeps your prompts, answers and conversation history, lists improving its models as a purpose, and warns that sending requests to model providers does not make them anonymous. On {{appName}}, incognito chats stay in your browser.",
        },
      },
      cta: { title: "Test Arya against every other uncensored model" },
    },
    uncensoredAi: {
      meta: {
        title: "uncensored.ai Alternative: {{appName}} vs uncensored.ai",
        description:
          "{{appName}} vs uncensored.ai: same UncensoredLM model, different app. Free limits, Pro price, API, privacy and media side by side, with sources.",
        keywords:
          "uncensored.ai alternative, uncensored.ai vs, uncensored.ai review, uncensored.ai pricing, uncensored.ai Pro, UncensoredLM, UncensoredAI v1.2, uncensored.ai API, is uncensored.ai free, uncensored AI chat, {{appName}} vs uncensored.ai",
      },
      hero: {
        title: "{{appName}} vs uncensored.ai",
        subtitle:
          "One model with its own worldview, two ways to use it. Free limits, price, API and what else comes with it.",
        readTime: "6 min read",
      },
      intro: {
        lead: "uncensored.ai makes the most different uncensored model we know: {{ownModel}}, trained on books and documents banned from the mainstream internet, with political opinions that run against the mainstream. We run it through uncensored.ai's own API. So this page answers one question: should you use it on uncensored.ai, or here?",
        p2: "uncensored.ai facts from its pricing page, API page, about page and privacy policy, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "We are an uncensored.ai customer: {{uncensoredAiExamples}} runs on {{appName}} through uncensored.ai's API. Same model, our chat, our billing.",
      verdict:
        "Pick uncensored.ai if you want unlimited chats with this one model for a flat Pro price locked for life, plus its forum and voice mode. Pick {{appName}} if you want {{ownModel}} next to {{modelCount}} other models, so one thread can check its take against Claude, GPT or an abliterated model, with images, video and music on the same balance.",
      themPros: {
        a: "Flat price: Pro is $9.99 a month or $99.99 a year, locked for life while you stay subscribed.",
        b: "Unlimited chats with the model for that price, plus voice mode, folders and archives.",
        c: "Its privacy policy says your data is not used to train or improve AI models.",
      },
      themCons: {
        a: "Free is 3 responses a day.",
        b: "One model, 32,768 tokens of context, no image, video or music generation.",
        c: "API calls cost $0.05 each and are bought separately from Pro.",
      },
      usPros: {
        a: "{{ownModel}} plus {{modelCount}} other models in one chat: compare its answer against mainstream and abliterated models in the same thread.",
        b: "{{guestCredits}} free credits a month without an account, {{freeCredits}} with one.",
        c: "Images, video, music and voice on the same balance, and the whole platform is open source.",
      },
      usCons: {
        a: "Metered credits, not a flat unlimited plan: heavy daily use of this one model costs more here.",
        b: "No community forum or archives around the model.",
        c: "Our {{markup}}% markup applies to the uncensored.ai model too.",
      },
      chooseThem: {
        a: "This one model is all you need and you use it every day.",
        b: "You want a price locked for life.",
        c: "You want its forum and voice mode.",
      },
      chooseUs: {
        a: "You want to compare its take with mainstream and abliterated models.",
        b: "You use it now and then and do not want another subscription.",
        c: "You also need images, video or music.",
      },
      both: "Many people use both: uncensored.ai for daily unlimited chats with the model, {{appName}} when they want to put its answer next to another model's in the same thread.",
      switch: {
        title: "Switching from uncensored.ai",
        body: "Pick {{ownModel}} in our model picker and start an incognito chat. No migration needed. Paste old context into the first message if you need it, then ask the same question to an abliterated model and see where the two part ways.",
      },
      faq: {
        q1: {
          q: "Is {{appName}} the same as uncensored.ai?",
          a: "No. We are a separate, open-source platform. We run uncensored.ai's model through its API, next to models from Venice, NanoGPT, FreedomGPT, Gab AI, OpenRouter and the big labs.",
        },
        q2: {
          q: "Is uncensored.ai free?",
          a: "It has a free tier with 3 responses a day. Pro costs $9.99 a month or $99.99 a year and removes the limit. On {{appName}}, {{guestCredits}} free credits a month work without an account.",
        },
        q3: {
          q: "What makes uncensored.ai's model different?",
          a: "Most uncensored models are mainstream models with the refusals cut out: same training, same worldview. {{ownModel}} is trained on books and documents banned from the mainstream internet, so its political opinions run against the mainstream.",
        },
        q4: {
          q: "Does uncensored.ai have an API?",
          a: "Yes: an OpenAI-compatible API at $0.05 per inference, with credits bought separately. On {{appName}} the same model is callable through our OpenAI and Anthropic compatible API after any plan or credit purchase.",
        },
      },
      cta: { title: "Put its takes next to every other model" },
    },
    openRouter: {
      meta: {
        title: "OpenRouter Alternative for Chat: {{appName}} vs OpenRouter",
        description:
          "{{appName}} vs OpenRouter: a finished chat app vs a developer API router. Uncensored models, fees, privacy and API side by side, with sources.",
        keywords:
          "OpenRouter alternative, OpenRouter vs, OpenRouter review, OpenRouter pricing, OpenRouter fees, OpenRouter uncensored, OpenRouter uncensored models, OpenRouter chat app, OpenRouter free models, OpenAI compatible API, uncensored LLM API, {{appName}} vs OpenRouter",
      },
      hero: {
        title: "{{appName}} vs OpenRouter",
        subtitle:
          "A developer router with 474 models against a chat app with uncensored models built in. Fees, filters, privacy and API.",
        readTime: "6 min read",
      },
      intro: {
        lead: "OpenRouter is the default answer for one API key and hundreds of models. We use it ourselves. But it is a router for developers, not a chat app, and its uncensored shelf is thin. If you came looking for an OpenRouter alternative to chat with, this is the honest comparison.",
        p2: "OpenRouter facts from its pricing page, data collection guide, terms and public model list, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "We are an OpenRouter customer: {{openRouterModels}} of our models run through OpenRouter's API, including {{openRouterExamples}}. We add the chat, the media and the uncensored providers it does not carry.",
      verdict:
        "Pick OpenRouter if you are a developer who wants one key for 474 models at provider prices with fallback routing, and you bring your own interface. Pick {{appName}} if you want a finished chat with {{uncensored}} uncensored models, including {{ownModel}} and abliterated builds OpenRouter does not list, plus images, video and music, and an API when you need one.",
      themPros: {
        a: "474 models in its public model list, at provider prices.",
        b: "No subscription. Free models with 50 requests a day, 1,000 after you buy $10 of credits.",
        c: "Prompt logging and use of your data are both opt-in.",
      },
      themCons: {
        a: "A 5.5% fee on credit purchases on the standard plan.",
        b: "Few uncensored models: Venice Uncensored plus roleplay fine-tunes like Hermes 4 and Magnum. 142 of its 474 models are flagged as moderated.",
        c: "No consumer chat focus: you bring the interface.",
      },
      usPros: {
        a: "A finished chat in the browser: no key, no setup, {{guestCredits}} free credits a month without an account.",
        b: "{{uncensored}} uncensored models from Venice, NanoGPT, uncensored.ai, FreedomGPT and Gab AI, unlocked by a one-time 18+ confirmation.",
        c: "OpenAI and Anthropic compatible API for chat, images, video and speech on the same balance.",
      },
      usCons: {
        a: "Smaller catalog: {{modelCount}} chat models against OpenRouter's 474.",
        b: "Our {{markup}}% markup on provider costs is above OpenRouter's 5.5% fee.",
        c: "Built as a chat first: fewer routing controls than a dedicated router.",
      },
      chooseThem: {
        a: "You build an app and want one key for hundreds of models.",
        b: "You need provider fallback and routing controls.",
        c: "Every cent per token counts and you have your own interface.",
      },
      chooseUs: {
        a: "You want to chat, not build: open the page and type.",
        b: "You want uncensored models OpenRouter does not list, like {{ownModel}}.",
        c: "You want chat, images, video and music on one balance, with an API on top.",
      },
      both: "Using both is normal: OpenRouter in your code, {{appName}} as the chat where you test uncensored models side by side before you wire one in.",
      switch: {
        title: "Switching from OpenRouter",
        body: "In a chat app: start an incognito chat and pick a model, no key needed. In code: our API is OpenAI compatible, so you change the base URL and the key, then check the model ID on its model page.",
      },
      faq: {
        q1: {
          q: "Is there an OpenRouter alternative with uncensored models?",
          a: "Yes. {{appName}} carries {{uncensored}} uncensored models from Venice, NanoGPT, uncensored.ai, FreedomGPT and Gab AI in one chat and one API. NanoGPT and Venice also sell uncensored models by API. OpenRouter itself lists only a few.",
        },
        q2: {
          q: "Does OpenRouter allow NSFW content?",
          a: "Its terms require 18+ and it screens inputs for known CSAM. Each provider keeps its own rules, and 142 of the 474 models in its list are flagged as moderated, so whether a request passes depends on the model and the provider.",
        },
        q3: {
          q: "How much does OpenRouter charge?",
          a: "Provider list prices per token, plus a 5.5% fee on credit purchases on the standard plan. There is no subscription. Free models allow 50 requests a day, 1,000 once you have bought $10 of credits.",
        },
        q4: {
          q: "Can I use my OpenRouter code with {{appName}}?",
          a: "Yes, if it uses the OpenAI format: point it at our base URL with your {{appName}} key and use our model IDs. The API unlocks after any plan (from {{apiSubPrice}} a month) or a credit purchase.",
        },
      },
      cta: { title: "Chat with the models OpenRouter does not carry" },
    },
  },
};
