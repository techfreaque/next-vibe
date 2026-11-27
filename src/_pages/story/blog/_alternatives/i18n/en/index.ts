export const translations = {
  title: "Platform comparison",
  verify:
    "Additional options checked against the linked official sources on {{date}}. Scroll sideways on mobile to see every column. Limits vary by plan and region.",
  verifyRange:
    "Additional options checked against the linked official sources between {{from}} and {{to}}. Scroll sideways on mobile to see every column. Limits vary by plan and region.",
  related: "More alternatives guides",
  kind: {
    chat: "Chat with fewer refusals",
    assistant: "General assistant",
    writing: "Creative writing",
    privateChat: "Privacy-focused chat",
    frontend: "Model interface",
    local: "Local model runner",
    multiChat: "Multi-model chat",
    research: "Research assistant",
    roleplay: "Character roleplay",
    companion: "AI companion",
    gateway: "API gateway",
    inference: "Hosted model inference",
  },
  free: {
    yes: "Limited free access",
    software: "Free software",
    trial: "Trial or starter credits",
    unlisted: "See provider",
    public: "Free access",
  },
  paid: {
    plan: "Subscription",
    usage: "Usage-based",
    both: "Subscription or usage, by product",
    hosted: "Optional hosted plan",
    none: "Hardware costs",
    contact: "Commercial plans",
    license: "License plus model usage",
    unlisted: "See provider",
    fixedAccess: "Prepaid access for 30 days",
    byoApi: "Free app, you pay the model provider",
  },
  filter: {
    permissive: "Advertises fewer refusals",
    policy: "Provider policy applies",
    adultPolicy: "Mature options, platform rules apply",
    selected: "Fewer refusals on selected models",
    varies: "Depends on model and provider",
    guardrails: "Configurable guardrails plus provider rules",
  },
  privacy: {
    noFilter: "Chat purge claimed, with IP and usage logging",
    trainingControl: "Hosted, with training settings",
    hosted: "Hosted under provider terms",
    deviceHistory: "History on device, prompts go to remote models",
    enclave: "Hardware-isolated processing",
    encryptedHistory: "Encrypted saved history",
    proxy: "Proxy for hosted requests",
    noTraining: "Provider says it excludes chats from training",
    configurable: "Depends on deployment and logging",
    localOption: "On device with a local model",
    upstream: "Depends on upstream provider",
    noLogs: "Provider says it keeps no prompt logs",
    noDisk: "Provider says it stores no API inputs on disk",
  },
  api: {
    separate: "Separate API product",
    unlisted: "Public API unlisted",
    available: "Available",
    local: "Local API",
    backend: "Connects to a backend",
    openAi: "OpenAI compatible",
    dual: "OpenAI and Anthropic compatible",
    eligible: "Eligible paid plans",
  },
  media: {
    text: "Text",
    image: "Images",
    voice: "Voice",
    imageVoice: "Images, voice",
    imageVideo: "Images, video",
    all: "Images, video, voice",
    varies: "Depends on model or plan",
  },
  open: {
    closed: "Proprietary service",
    weights: "Some model weights available",
    client: "Client code available",
    open: "Open source, self-host",
    core: "Open component available",
    license: "Source available, license conditions",
  },
  fees: {
    topUp: "{{fee}} on credit purchases",
    markup: "{{fee}} on model usage",
    noMarkup: "Provider token price",
  },
  summaries: {
    noFilter:
      "Custom GPT-style chat with adjustable tone. The free plan caps daily messages.",
    chatGpt:
      "Search, files and voice in one app. Usage limits depend on the plan.",
    grok: "Searches X posts and the web. Higher limits and some features require a paid plan.",
    unrestricted:
      "Simple browser chat with a named Dolphin-Mistral model. The web app uses one text model.",
    uncensoredCom:
      "Chat, characters and media in one service. Usage allowances vary by tier.",
    hemmingway:
      "Adult fiction and roleplay with an open-weight model. The Unlocked offer is focused on text.",
    maple:
      "The app verifies the processing enclave. Its uncensored model requires a paid plan.",
    confer:
      "The client checks that it is sending to an attested enclave. Pick it for private text chat.",
    lumo: "Proton offers guest chat and zero-access encryption for saved history. Inference runs on Proton’s servers.",
    duck: "Try several models without an account. DuckDuckGo proxies the prompts to model providers.",
    morse:
      "Offers private inference and an uncensored text option. Check which models your plan includes.",
    harbor:
      "Private chat and web search with Harbor-1. The service processes the prompts in the cloud.",
    leo: "Chat with the page you have open in Brave. Built-in and custom models follow different data paths.",
    openWebUi:
      "Self-hosted browser interface for Ollama and compatible APIs. Set up a model backend separately.",
    jan: "Desktop chat with downloadable models and a local API. Available models depend on your hardware.",
    anythingLlm:
      "Ask questions across a document workspace. Choose local generation and embeddings to keep processing on device.",
    gpt4all:
      "Desktop chat with local document retrieval. The size of the model depends on available memory.",
    llamaCpp:
      "Run GGUF models with fine control over inference and a compatible local server. Setup is geared to technical users.",
    typingMind:
      "A chat workspace with local storage and your own provider keys. Model usage is billed separately.",
    poe: "Try different models and community bots in one app. Usage draws on compute points.",
    claude:
      "Projects, artifacts and web search for writing and coding. Usage limits and policy still apply.",
    gemini:
      "Deep Research and connections to Google apps. Model and media quotas depend on your plan.",
    perplexity:
      "Web answers with citations you can follow. Advanced research and model choices sit on paid plans.",
    copilot:
      "Fits Microsoft 365 workflows. Office integration depends on the plan.",
    meta: "Available in Meta apps where supported. Features vary by app and country.",
    mistral:
      "Mistral’s assistant combines chat with coding features. Its hosted app follows Mistral’s rules.",
    deepseek:
      "Hosted DeepSeek chat, a separate API and downloadable weights for selected models. Check the policy for the version you use.",
    qwen: "Alibaba offers a hosted Qwen chat and publishes model weights. Hosting and filtering depend on the version you use.",
    kimi: "Moonshot’s assistant offers Kimi models and coding workflows. Hosted usage depends on its plans.",
    spicychat:
      "Pick from community characters and start with free access. Paid tiers add capacity and features.",
    chub: "Huge library of character cards and lorebooks. Its own models need the Mars plan, the free path is a small daily allowance or your own backend.",
    dreamgen:
      "Steer scenes and play with several characters. Usage limits depend on the plan and model.",
    novelai:
      "Long-form fiction with Lorebook entries and anime-style image generation. The full features sit behind a subscription.",
    chai: "Mobile-first discovery of community bots. Interaction follows the app’s policies.",
    replika:
      "One persistent companion, with voice and an avatar. Features depend on the subscription.",
    polybuzz:
      "Create and discover characters in a mobile app. The app has optional purchases and its own rules.",
    fictionlab:
      "Interactive fiction built around user-made scenarios. Its focus is story-driven text.",
    zeta: "Create characters and play through user-made scenarios. Availability varies by market.",
    characterTavern:
      "Discover and create character cards and start on a free tier. It focuses on character chat.",
    liteLlm:
      "Self-host a compatible proxy with virtual keys, budgets and rate limits. You operate it and supply provider access.",
    portkey:
      "Configure fallbacks, guardrails and monitoring. Logging and deployment options depend on your setup.",
    vercel:
      "Works with Vercel’s AI SDK and charges no token markup. Routing is through Vercel’s hosted service.",
    cloudflare:
      "Edge caching, rate limiting and routing. Check the cost of unified billing and the logging settings.",
    requesty:
      "Hosted gateway with latency-based and EU routing options. Check availability by model and configuration.",
    helicone:
      "An AI gateway with request traces and spend visibility. Review what gets logged before sending sensitive data.",
    eden: "One API for language models and services such as OCR or translation. Capabilities depend on the provider selected.",
    together:
      "Serverless and dedicated inference with OpenAI, Responses and Anthropic Messages APIs plus images, video and speech. No uncensored models, and its terms bar pornography.",
    bifrost:
      "Self-host a Go gateway with failover and semantic caching. You configure deployments and provider access.",
    truefoundry:
      "Centralized access policies and monitoring for teams. Review the deployment and commercial terms for your organization.",
    llmGateway:
      "OpenAI and Anthropic compatibility with a self-hosted option. Billing and retention depend on the deployment.",
    deepInfra:
      "Among the cheapest per token for stock open models, with 200 concurrent requests per model by default. No uncensored or roleplay models in its catalog.",
    bedrock:
      "Managed model catalog with AWS access controls. Available models and features depend on region.",
    kong: "Adds model routing and policies to an API gateway. Check which plugins your edition includes.",
    huggingFace:
      "Call Hub models through multiple inference providers. Model and hardware availability depend on the provider.",
    apiko:
      "One compatible endpoint for text, image, video and audio. Check price and availability for the model you want.",
    zerouter:
      "One key for coding clients including Claude Code and Codex. Check model prices and routing before moving traffic.",
    shannon:
      "Offers its own Shannon model and several modified open-weight models. The API bills by usage.",
    nokeep:
      "Chat and media without signup. History stays in the browser, and hosted models still process the prompts.",
    icelake:
      "Daily chat allowance plus image and video tools. Its OpenAI-compatible API requires an eligible paid plan.",
    uncensoredChat:
      "Browser chat with 2,000 starter tokens. Media and API access depend on the plan.",
    aiDungeon:
      "Interactive adventures with Story Cards. Paid memberships give access to more context and memories.",
    talkie:
      "Discover and create characters in a social catalog. Check the app’s own content rules.",
    perchance:
      "Free character chat in the browser without signing up. It is a lightweight tool for individual sessions.",
    candy:
      "Romance-focused companions with voice and images. The product is built around companion chats.",
    ngrok:
      "Routes model calls across providers with key failover. Review routing and logging when you configure it.",
    sandbase:
      "Combines model calls, web data and code sandboxes in one API. Free calls have daily limits.",
    openUncensored:
      "Prepaid key, no account, no email: 58 text models, almost all abliterated, plus RP fine-tunes, 20 image and 3 video models. Provider price with no commission, top-ups from $5 that never expire. No free tier, no web chat.",
    risuAi:
      "Open-source character chat client with lorebooks, group chats, emotion images and TTS. You bring and pay for the model API.",
    agnai:
      "Hosted or self-hosted roleplay client with multi-user group chats and lorebooks. Hosted plan prices are not public.",
    koboldCpp:
      "One-file local runner for GGUF models with a built-in chat UI and an OpenAI-compatible API. Without your own GPU you queue on the volunteer AI Horde.",
    talemate:
      "Multi-agent roleplay engine with a narrator, a director and world state tracking. A self-install tool for power users.",
    featherless:
      "Over 50,000 Hugging Face models behind one key, 1,398 tagged abliterated and 1,605 uncensored. The $25 Chat plan has unlimited tokens but 32K context, low concurrency and personal use only.",
    arliAi:
      "Unlimited tokens on flat plans from $15: about 121 text models, many derestricted or uncensored fine-tunes, plus image generation. Core and Plus run one request at a time.",
    infermatic:
      "Flat plans from $9 for a curated set of uncensored and roleplay 70B tunes, with a no-logs claim. The free plan is web only, and individual plans may not power apps.",
    chutes:
      "Decentralized pay-per-token inference, most text models in confidential compute, crypto accepted. No uncensored models and no free tier.",
    kagi: "Multi-model assistant bundled with Kagi search. Threads delete after 24 hours by default, and flagship models need the top plan.",
    huggingChat:
      "Chat with open models through an automatic router. The chat code is open source, and inference bills through Hugging Face credits.",
    zai: "Zhipu's own chat for GLM models, with a separate API. Its privacy policy lists message content for model training.",
    ourDream:
      "Adult companion builder with chat, images and video. Media runs on coins you can only buy with an active plan.",
    refuseless:
      "API-only host for abliterated GLM 5.3, DeepSeek V4.1 Flash and Kimi K3.1 Pro with 1M context, on OpenAI, Responses and Anthropic Messages formats. Needs a verified email, no chat app.",
    nearAi:
      "Confidential-compute API with two abliterated models and hardware attestation. No application, no identity checks, pay per token.",
    uncensoredLlmAi:
      "Prepaid gateway listing 332 abliterated and uncensored chat models, with a daily refusal check. Card or crypto from $3, no resale without written consent.",
    abliterationAi:
      "Its own abliterated models on OpenAI and Anthropic formats, an EU region and a policy layer for your own rules. Plans from $20 a month.",
    mancer:
      "Roleplay fine-tunes like MythoMax and Magnum with a free MythoLite tier. No abliterated models, and its terms ban obscene or lewd material.",
  },
  articles: {
    "nofiltergpt-alternatives": {
      question:
        "Do any NoFilterGPT alternatives name the model or run offline?",
      answer:
        "Unrestricted.chat names its Dolphin-Mistral model but still runs it for you. LM Studio, Ollama and Jan can run downloaded models on your device. {{appName}} has a model picker and browser-local incognito history. Its hosted models still receive the prompt.",
    },
    "freedomgpt-alternatives": {
      question: "What can replace the offline FreedomGPT desktop app?",
      answer:
        "LM Studio and Jan offer desktop apps for downloaded models. Ollama gives you a local API and pairs with Open WebUI for a browser interface. AnythingLLM suits document work if you configure local models and embeddings.",
    },
    "gab-ai-alternatives": {
      question: "What can replace Arya for political questions?",
      answer:
        "For contrasting viewpoints, use {{appName}} to ask different models in the same thread. For cited web research, try Perplexity or check original materials through Grok’s search. Compare sources across answers. Every model can reflect a point of view or get a fact wrong.",
    },
    "openrouter-alternatives": {
      question: "Which OpenRouter replacement fits a production app?",
      answer:
        "For uncensored traffic: OpenUncensored, Refuseless or NEAR AI Cloud for abliterated weights at provider price, {{appName}} if you also need mainstream models, media and a chat on the same key. For routing your own provider accounts: LiteLLM or Bifrost self-hosted, Vercel hosted with no token markup. Check fallbacks, retention and fees before you move traffic.",
    },
    "venice-ai-alternatives": {
      question: "What privacy options go beyond browser-local history?",
      answer:
        "Maple, Confer and Morse describe hardware-isolated processing with verification. Lumo encrypts saved history and Duck.ai uses a proxy. LM Studio and Ollama can run downloaded models on your device. These options protect different parts of a request, so check where the prompt is decrypted and whether you need media or an API.",
    },
    "character-ai-alternatives": {
      question:
        "Which apps suit character browsing, longer stories or an ongoing companion?",
      answer:
        "Janitor AI, SpicyChat and Chub have character libraries. DreamGen and NovelAI give you more control over a scene or longer story. Kindroid and Nomi focus on a companion over time. Use SillyTavern if you want to configure your own backend and character cards.",
    },
    "chatgpt-alternative-without-filters": {
      question: "Which ChatGPT alternatives give me more model choice?",
      answer:
        "{{appName}} and Venice let you select models with different refusal behavior. NanoGPT adds pay-as-you-go access. LM Studio and Ollama run downloaded models on your device. Claude and Gemini are useful for writing or research, and their policies still apply.",
    },
    "chatgpt-jailbreak-alternative": {
      question: "What should I compare before switching models?",
      answer:
        "Check whether the service names the model, how the free allowance works and where your prompt is processed. Try ordinary prompts from your writing or roleplay on {{appName}}, Venice or a local app. Responses and refusals vary by model and service.",
    },
    "grok-alternative": {
      question:
        "Which alternatives replace Grok’s search and creative features?",
      answer:
        "Perplexity is built for cited web answers. Gemini offers Deep Research and video on eligible plans. Venice and {{appName}} combine a model picker with media generation. Keep Grok if searching posts on X from the same chat is central to your work.",
    },
    "chub-ai-alternatives": {
      question: "Can I keep my Chub character cards somewhere else?",
      answer:
        "Yes. Chub cards download as PNG or JSON in the V2 card format, and SillyTavern, RisuAI and Agnaistic import them directly. {{appName}} turns a character into a skill you can chat with on any model. Lorebooks carry over to SillyTavern and RisuAI.",
    },
    "crushon-ai-alternatives": {
      question: "Which CrushOn alternative has the most predictable cost?",
      answer:
        "Flat plans: Kindroid, Nomi and SpicyChat charge one monthly price. Pay as you go: {{appName}} and NanoGPT bill per message, so a quiet month costs less. Running a model on your own PC with SillyTavern and KoboldCpp costs nothing after the hardware.",
    },
    "sillytavern-alternatives": {
      question: "Is there a SillyTavern alternative that needs no install?",
      answer:
        "Yes. Janitor AI, Chub and Character Tavern run in the browser with characters built in. RisuAI also has a web version. {{appName}} runs in any browser, iPhone included, with models already connected, so there is no API key to set up.",
    },
    "nanogpt-alternatives": {
      question: "Which NanoGPT alternative suits flat-rate open models?",
      answer:
        "Featherless, Arli AI and Infermatic sell monthly plans for open and uncensored models, with limits on context or parallel requests. OpenRouter and Chutes bill per token. {{appName}} bills per message from one balance across uncensored, open and mainstream models.",
    },
    "claude-alternatives": {
      question: "Which Claude alternative writes the best long-form text?",
      answer:
        "GPT and Gemini come closest for structured writing. Kimi and GLM are strong open models with fewer refusals. For fiction Claude refuses, use an uncensored model such as GLM 5.3 Uncensored or UncensoredLM on {{appName}}, and keep Claude in the same thread for edits.",
    },
  },
};
