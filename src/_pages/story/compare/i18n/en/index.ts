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
      "Venice, NanoGPT, Janitor AI, Character.AI, FreedomGPT, local models and more: prices, filters, privacy and API, with sources",
    versus: "{{appName}} vs {{name}}",
    sectionTitle: "Uncensored AI platforms compared",
    sectionIntro:
      "Venice, NanoGPT, Janitor AI, Character.AI, FreedomGPT and more: prices, filters and privacy from their own pages.",
  },
  platforms: {
    venice: {
      what: "Privacy-first AI app with a large model catalog, many uncensored text models, image, video and music generation, an OpenAI-compatible API and a crypto staking layer (VVV and DIEM).",
      pricingNote:
        "Free: 10 text and 15 image prompts a day, base models only. 100 credits = $1. Video, music and frontier models cost credits on top.",
      models:
        "420 models in its docs (148 text). About 17 text models are labelled uncensored, led by Venice Uncensored 1.2 (Dolphin Mistral 24B Venice Edition), plus uncensored GLM, DeepSeek and Qwen builds. Claude, GPT, Gemini and Grok too.",
      filterShort: "Mature filter on by default, Pro can turn it off",
      filter:
        "A Mature Filter is on by default. Pro subscribers switch it off in their preferences. An optional Safe Venice mode, locked with a PIN, hides adult characters and images.",
      privacyShort: "Chat history stays on your device",
      privacy:
        "Venice says conversation history stays on your device and is never stored on its servers. For third-party models in Anonymous mode it tells you to assume the provider stores your content.",
      apiShort: "",
      api: "OpenAI-compatible API, billed per token in USD credits. Staked DIEM gives $1 of API credit a day. Accountless pay-per-request with USDC via x402.",
      forWho:
        "Privacy-minded users who want uncensored chat and media in one app, plus developers and crypto holders.",
      pro1: "Big catalog with many uncensored text models and cheap uncensored API prices.",
      pro2: "History stays on your device by default.",
      con1: "Free tier is tight: 10 text prompts a day on base models.",
      con2: "The adult filter and most media need Pro plus credits.",
    },
    uncensoredAi: {
      what: "Single-model uncensored chat app with a community forum and document archives. Web, iOS and Android.",
      pricingNote:
        "Free: 3 responses a day. Pro prices are locked for life. Cards, Cash App, Apple Pay and Bitcoin. API credits sell separately at $0.05 per call.",
      models:
        "One model: UncensoredAI v1.2, 32K context. Its public pages do not name the base model or the training data.",
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
      con2: "Strongly ideological site around the model: archives and landing pages on conspiracy themes.",
    },
    nanoGpt: {
      what: "Pay-as-you-go web app and API for text, image, video and audio models. No subscription needed, optional plan for open models.",
      pricingNote:
        "Top up from $0.10 in crypto or $1 by card, no deposit fees. Free: one model, web only. PRO includes open-source models only: Claude, GPT, Gemini and Grok bill from your balance.",
      models:
        "631 text models in its public API, about 39 of them uncensored or abliterated: Venice Uncensored, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 abliterated and more. Mainstream models too.",
      filterShort: "No blanket NSFW ban, 18+",
      filter:
        "Terms require 18+. They ban CSAM, non-consensual intimate imagery and sexually explicit deepfakes, not adult content in general.",
      privacyShort: "Chats in your browser, no account needed",
      privacy:
        "Conversations are stored in your browser by default, cloud sync is opt-in. NanoGPT says it does not log or retain prompts and responses. No account required. Some provider routes allow training.",
      apiShort: "",
      api: "OpenAI-compatible API, also Anthropic Messages format, with accountless x402 payments. Every response returns its cost.",
      forWho:
        "Pay-per-use users and developers who want every model, crypto payments and no subscription.",
      pro1: "Huge model list, list prices, entry from ten cents.",
      pro2: "No account needed, chats stay in your browser.",
      con1: "Free tier is one model on the web.",
      con2: "Privacy depends on the provider route you pick.",
    },
    openRouter: {
      what: "Developer API that routes one key to hundreds of models from many providers, billed per token from prepaid credits.",
      pricingNote:
        "No subscription. Provider list prices plus a 5.5% fee on credit purchases. Free models: 50 requests a day, 1,000 after you buy $10 of credits.",
      models:
        "474 models, 17 free. Uncensored options are thin: Venice Uncensored (Dolphin Mistral 24B, hosted by Venice) and roleplay fine-tunes like Hermes 4 and Magnum. 143 routes are flagged as moderated.",
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
        "Free with no card or account. Pro includes 2,200 credits a month: a premium reply costs about 10, an image about 25, a 5-second video about 400.",
      models:
        "ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Llama, Mistral and more, plus Liberty and other censor-free models in the same list. No total count published.",
      filterShort: "Censor-free models, US law and ethics rules",
      filter:
        "FreedomGPT says everyone and every model it hosts must follow US law, and it does not allow its models to be used for unethical purposes. A censor-free label does not promise every request gets answered.",
      privacyShort: "Messages shared with AI providers",
      privacy:
        "Its policy says chat messages, voice recordings and images are shared with third-party AI providers to produce answers. No retention period is stated. Using it without an account does not make a cloud request local.",
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
        "Gab sees your prompts and answers, keeps history on its servers and uses content to improve its models. It says your identity is hidden from third-party model providers.",
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
        "Free: unlimited chats on standard models, about 9K tokens of context. janitor+ adds 5x character memory, priority speed and more models. Its Router bills other models per token, web only, subscribers only.",
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
        "None included. Connects to local backends (KoboldCpp, llama.cpp, Ollama, text-generation-webui) and about 16 cloud APIs, including OpenAI, Claude, Google, Mistral, DeepSeek, OpenRouter and any OpenAI-compatible endpoint.",
      filterShort: "None of its own: the model decides",
      filter:
        "No filter of its own. The limits are whatever the connected model or provider enforces.",
      privacyShort: "Local install, no tracking",
      privacy:
        "The project says it offers no hosted services and does not track user data. Chats are stored on your machine. Whatever you send to a cloud API falls under that provider's policy.",
      apiShort: "Connects to APIs",
      api: "A client, not a provider. It talks to the API you configure.",
      forWho:
        "Power users who accept a steep learning curve for full control over prompts and characters.",
      pro1: "Maximum control: any backend, any prompt, rich extensions.",
      pro2: "Free, open source, nothing leaves your machine except what you send to an API.",
      con1: "You install and maintain it, and supply the model yourself.",
      con2: "Steep learning curve, by the project's own description.",
    },
    characterAi: {
      what: "The biggest mainstream character chat platform, 10M+ characters on its own models, with strict content rules. Included here as the filtered contrast.",
      pricingNote:
        "Free: unlimited messages with ads. lite removes most ads (US price, varies by country). c.ai+ adds the top chat models, better memory and no slow mode.",
      models:
        "Its own models only, offered as chat styles (PipSqueak, DeepSqueak, LongSqueak). No model choice beyond those, no own key.",
      filterShort: "Filtered, pornography never supported",
      filter:
        "Pornographic content is against its terms and, in its words, will not be supported at any point in the future. Every user goes through age assurance via Persona. Users verified as under 18 get reading mode only, no chat.",
      privacyShort: "Chats can train its models and target ads",
      privacy:
        "Its privacy policy says information is used to train its AI models and to provide tailored advertising.",
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
        "No ongoing free tier: a 50-message preview, then read-only. Ultra and MAX are monthly add-ons on top. US App Store prices; Kindroid says web checkout is usually cheaper.",
      models:
        "Its own models (Polaris, Ember, Reverie and others) and its own selfie models. No own key.",
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
      con1: "Pay to keep talking after 50 messages.",
      con2: "Top memory tiers stack up: Ultra and MAX on top of the base plan.",
    },
    nomi: {
      what: "AI companion app built around long-term memory: friend, partner or mentor, with selfies, voice and group chats.",
      pricingNote:
        "Free tier with daily messages and images (limits not published). Subscription unlocks unlimited messages and voice. US App Store prices; no public web price list.",
      models: "Its own models, not named publicly. No own key.",
      filterShort: "Text unfiltered, nudity filter on images",
      filter:
        "Its site says conversations are not restricted by arbitrary content filters. Images have a nudity filter because of app stores and payment processors. Under 18s may not use it.",
      privacyShort: "Never sold, deleted with your account",
      privacy:
        "Its policy says personal data is never sold or rented and is not kept after you delete your account (within about 28 days).",
      apiShort: "Personal API to your companions",
      api: "REST API to chat with your own Nomis, not a general model API.",
      forWho:
        "People who want an emotional, long-term companion that remembers.",
      pro1: "Memory built for long relationships.",
      pro2: "Free tier and a clear no-selling privacy stance.",
      con1: "Nudity filter on images.",
      con2: "Voice only with a subscription, free limits not published.",
    },
    crushOn: {
      what: "NSFW character chat site with an Unfiltered switch and credit-metered access to third-party models.",
      pricingNote:
        "Free: 100 message credits a month, unlimited free models, history wiped after 7 days of inactivity. Annual plans are cheaper. Pro models need a membership or a separate package.",
      models:
        "Third-party models routed by tier; its site names Claude 4, Gemini 2.5 Flash, GPT-4.1 and DeepSeek V4. Full list behind login.",
      filterShort: "Unfiltered switch after an age check",
      filter:
        "An Unfiltered switch unlocks adult text after age verification: selfie or ID via Didit, AgeGo, or a $0.99 payment. Its guidelines still ban explicit sexual imagery, realistic images of real people, minors and aged-up characters.",
      privacyShort: "Chats may train its models",
      privacy:
        "Its policy says chat content may be used to train its models, not linked to specific users. Cookies are used for retargeting ads.",
      apiShort: "",
      api: "No public developer API.",
      forWho: "Adults who want spicy character chat in a ready-made app.",
      pro1: "Adult roleplay in a polished app, free entry.",
      pro2: "Age check that, per CrushOn, never shows it your photo or ID.",
      con1: "Six credit tiers up to $199.99 a month: hard to predict cost.",
      con2: "Free history wiped after 7 days of inactivity; chats may train models.",
    },
    ollama: {
      what: "Free, MIT-licensed tool that downloads and runs open models on your own computer, with a local API. Also sells hosted cloud models.",
      pricingNote:
        "Running models on your own hardware is free and unlimited. Paid plans only cover its cloud models.",
      models:
        "Any open model in its library, including Dolphin 3 and community abliterated uploads such as Qwen 3.8 abliterated. Community uploads are not vetted by Ollama.",
      filterShort: "Whatever model you load",
      filter:
        "No filter of its own when you run locally. An abliterated model does not refuse. A stock model keeps the refusals it was trained with.",
      privacyShort: "Fully local, prompts never leave your machine",
      privacy:
        "Ollama says it does not see your prompts or data when you run locally. Cloud can be switched off completely.",
      apiShort: "",
      api: "OpenAI-compatible server on localhost:11434, plus a cloud API for its hosted models.",
      forWho:
        "Developers and technical users with a capable machine, often paired with a chat frontend.",
      pro1: "Total privacy and zero cost per message.",
      pro2: "Huge library, OpenAI-compatible local API.",
      con1: "Your hardware caps quality: a 70B model is a 43 GB download before context.",
      con2: "Mostly CLI and API: you add the chat interface.",
    },
    lmStudio: {
      what: "Desktop app with a polished interface to download and run local models (GGUF and MLX), plus a local API server.",
      pricingNote:
        "Free for home and work use since July 2025. Paid plans add hosted models and more devices.",
      models:
        "Local models from Hugging Face, including abliterated GGUF builds and Dolphin.",
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
      p2: "So we checked. Each platform's own pricing page, terms, privacy policy and API docs, on {{date}}. Below: a quick pick per job, the full table, a card per platform with its sources, and the cases where you should not use us.",
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
        title: "Chats that never touch a server: Venice or NanoGPT",
        body: "Both keep history in your browser by default. NanoGPT needs no account at all. On {{appName}}, incognito chats do the same.",
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
        body: "Safe-for-work by design, with age checks for everyone. The right call for teens or a strict workplace.",
      },
    },
    table: {
      title: "All {{count}} platforms and {{appName}}, side by side",
      intro:
        "Scroll sideways on mobile. Competitor facts checked {{date}} on their own pages, ours read live from our config.",
      footnote:
        'Prices are USD list prices from each platform\'s own page; Kindroid and Nomi show prices only at checkout after login, so theirs come from the US App Store. Taxes, regional pricing and promos differ. "Limited" means through a bring-your-own-key setup, an add-on or a personal companion API.',
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
        "What it is, what it costs, how it filters, where your chats go, and its sources. Checked {{date}}.",
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
        "The five platforms people compare us with most, each on its own page with pros, cons and a clear pick.",
    },
    method: {
      title: "How we compared",
      intro: "Rules we held ourselves to. Checked {{date}}.",
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
        a: "A local model: nothing leaves your machine. Among hosted services, Venice and NanoGPT keep history in your browser by default and NanoGPT needs no account. On {{appName}}, incognito chats stay in your browser. Every hosted service still sends your message to a model provider.",
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
        a: "Bigger catalog: 420 models in its docs, including video, music and voice.",
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
        c: "Private chats are stored on our servers. Only incognito chats stay in your browser, while Venice keeps all history local.",
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
          a: "Venice has a free tier with 10 text and 15 image prompts a day on base models. Pro removes the limits and lets you turn off the mature filter.",
        },
        q3: {
          q: "Is Venice cheaper than {{appName}}?",
          a: "For Venice's own models, yes: we add {{markup}}% to provider costs. For mixing models across providers in one app, we save you separate subscriptions.",
        },
        q4: {
          q: "Which is more private, Venice or {{appName}}?",
          a: "Venice keeps all history on your device. On {{appName}}, incognito chats do the same; private chats are stored on our servers so they sync across devices. On both, your message goes to a model provider to get an answer.",
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
        b: "Its privacy policy allows training on your information and tailored ads.",
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
        b: "You are under 18 or set up a teen's account.",
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
        b: "Better models need janitor+ Router or your own API key and proxy setup.",
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
          a: "Janitor's free model has about 9K tokens of context; janitor+ raises character memory. On {{appName}}, context depends on the model you pick, and many roleplay models hold far more.",
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
        lead: "NanoGPT is the pay-per-use answer to AI subscriptions: top up ten cents, use any model, no account. Several of our uncensored models run on its API. So the real question is not which is better, it is which shape fits how you use AI.",
        p2: "NanoGPT facts from its pricing, privacy and terms pages and its public model list, checked {{date}}. Ours read live from our config.",
      },
      relation:
        "We are a NanoGPT customer: {{nanoGptModels}} of our models run through NanoGPT's API ({{nanoGptUncensored}} of them uncensored), including {{nanoGptExamples}}.",
      verdict:
        "Pick NanoGPT for the widest catalog at list prices, pay-per-use with no account, and an API for everything. Pick {{appName}} if you want a curated, tested model picker with uncensored models from several providers, free monthly credits, skills and memory, and an open-source app you can self-host.",
      themPros: {
        a: "631 text models in its API, about 39 uncensored or abliterated.",
        b: "No account, no subscription: start from ten cents in crypto.",
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
        a: "You want pay-per-use with no subscription and no account.",
        b: "You need an obscure model only a huge catalog carries.",
        c: "You build on the API and want list prices.",
      },
      chooseUs: {
        a: "You want a tested shortlist instead of 631 options.",
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
          a: "No. It works with a generated user ID and keeps chats in your browser by default.",
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
  },
};
