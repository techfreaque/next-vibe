export const translations = {
  meta: {
    title: "Character.AI Alternatives for Roleplay (2026)",
    category: "AI roleplay",
    description:
      "Compare Character.AI alternatives for roleplay, fiction and companions, including Janitor AI, SpicyChat, DreamGen, SillyTavern and {{appName}}.",
    imageAlt: "Character.AI alternatives for roleplay and AI companions",
    keywords:
      "Character AI alternatives, Character AI without filter, AI roleplay, Janitor AI, SillyTavern",
  },
  hero: {
    backToBlog: "Back to blog",
    category: "AI roleplay",
    readTime: "9 min read",
    title: "Character.AI alternatives for roleplay",
    subtitle:
      "Find a character library, a companion with memory or a model you can choose. Prices checked {{date}}.",
  },
  intro: {
    lead: "Start with Janitor AI if you want to browse characters and jump into a scene. Run SillyTavern locally if you want control over the whole setup. Pick Kindroid or Nomi if you want one companion that remembers you.",
    p2: "We build {{appName}}. It comes first here for model choice and character import. Every paid price below comes from the linked official pages or publisher listings checked on {{date}}. Competitor prices are in US dollars.",
  },
  characterAi: { title: "What Character.AI offers today" },
  switch: {
    title: "Why people look for an alternative",
    intro:
      "In public discussions, readers describe three different reasons for looking elsewhere.",
    reasons: {
      filtering: {
        body: "Interrupted scenes. In its August 2025 community update, Character.AI acknowledged feedback that the filter was getting in the way too often.",
        source: "Character.AI community update on Reddit",
      },
      continuity: {
        body: "Lost continuity. One reader looking for alternatives wanted better memory and believable dialogue in slow scenes, with room to write their own turns.",
        source: "Roleplay and memory discussion on Reddit",
      },
      oldSite: {
        body: "A changed experience. In a discussion about why people stayed or left, one user said the old website’s removal was what made them switch completely.",
        source: "Discussion about leaving Character.AI on Reddit",
      },
    },
  },
  criteria: {
    title: "What to check before you switch",
    intro:
      "Try the same scene in two apps. Revisit it the next day and ask about an early detail.",
    filter:
      "Check which subjects the model allows and whether the platform requires an age check.",
    memory:
      "Ask how the app handles details that fall outside the model’s active context. Look for saved memories, summaries or lorebooks.",
    price:
      "Compare the number of messages or credits your preferred model uses, including retries.",
    privacy:
      "Check where the transcript is stored and who processes the prompts.",
    characters:
      "Decide whether you want a ready-made cast, an editable character card or one companion you return to.",
  },
  table: {
    title: "Character.AI and its alternatives side by side",
  },
  us: {
    title: "1. {{appName}}: bring a character and choose its model",
    intro:
      "Start a new scene in the browser or build a recurring character as a skill.",
    models:
      "The {{modelCount}} chat models include {{uncensored}} uncensored, {{mainstream}} mainstream and {{open}} open models. You can change the model mid-scene.",
    characters:
      "The Roleplay skill helps the model stay in character. Browse published skills, build a character in the editor or write one with the Skill Creator.",
    consent:
      "Uncensored models require a one-time confirmation that you’re 18 or older and accept unfiltered output.",
    import:
      "Import a public Character.AI or Talkie character link. The copy credits the original creator.",
    privacy:
      "Incognito chat works without an account and keeps the transcript in your browser. A hosted provider still receives each prompt.",
    price:
      "{{guestCredits}} monthly guest credits or {{freeCredits}} with a free account. Subscriptions start at {{subPrice}} a month. Model usage spends credits.",
    weak: "Character.AI and Janitor AI offer deeper character discovery. Heavy users can also get more predictable bills from a flat plan on a dedicated roleplay service.",
    skillsLink: "Browse built-in and community skills",
    roleplayLink: "Open the Roleplay skill",
    creatorLink: "Build a character with the Skill Creator",
  },
  list: {
    title: "Nine alternatives in detail",
    intro:
      "Pick by how you play, then follow the links to check the details that matter to you.",
    heading: "{{number}}. {{name}}: {{bestFor}}",
    filter: "Content rules.",
    price: "Price.",
    pro: "Strength.",
    con: "Trade-off.",
    versusLink: "{{appName}} vs {{name}}",
  },
  options: {
    characterAi: {
      summary:
        "Character.AI hosts public and custom characters for text roleplay, with voices and calls. The free tier keeps unlimited standard messaging for eligible users.",
      pricing:
        "Free standard chats. The US plans are {{plans}}. Lite includes some premium features and still has ads. Plus adds the full memory suite and removes ads.",
      filter:
        "Pornographic content is prohibited. Open-ended character chat is unavailable to users under 18.",
      privacy: "Model training setting available",
      pro: "A large library of fan characters, with voices and calls built in.",
      con: "Paid plans add features and keep the same rules on explicit content.",
    },
    janitorAi: {
      bestFor: "community characters",
      summary:
        "A character chat service with millions of community bots, editable personas and an optional external model connection.",
      pricing:
        "Standard chats are unlimited. The US App Store lists {{plans}}.",
      filter:
        "Limitless characters can include adult themes. Mobile starts in safe mode.",
      privacy: "External proxies can receive prompts",
      pro: "A deep character library and unlimited free standard chats. Janitor+ adds five times the context, priority replies and premium-model rerolls.",
      con: "Free context is about 9,000 tokens. A separate proxy can add setup and usage costs.",
    },
    sillyTavern: {
      bestFor: "local control",
      summary:
        "A free open-source interface for local or hosted models. It imports character cards and supports lorebooks and prompt presets.",
      pricing:
        "Free software. A local model uses your hardware. Hosted APIs bill separately.",
      filter: "The model and backend determine what gets filtered.",
      privacy: "Local chat files. Hosted APIs receive prompts.",
      pro: "You control the character cards, lorebooks, prompt and model. You can run the whole setup locally.",
      con: "You install and maintain the frontend and supply a backend. Local models need suitable hardware.",
    },
    chub: {
      bestFor: "lorebooks and branching plots",
      summary:
        "A character card catalog and hosted roleplay frontend with keyword-triggered lorebooks, multiple characters per chat and a branching chat tree.",
      pricing:
        "Chub describes occasional one-time trial credits. Its hosted subscription is {{plans}}. External model rates vary.",
      filter:
        "Chub describes its own models as uncensored. External providers have their own rules.",
      privacy:
        "Shared chats can appear publicly. External APIs receive prompts.",
      pro: "Fork a scene, attach a lorebook and export chats to SillyTavern’s JSONL format or plain text.",
      con: "Hosted play has a subscription or backend setup. Trial credits are limited and aren’t promised to every new user.",
      free: "Occasional trial credits",
    },
    crushOn: {
      bestFor: "ready-to-play adult roleplay",
      summary:
        "Community characters, group scenes, voice presets and model switching without supplying an API key.",
      pricing:
        "Unlimited chats on free models and 100 monthly credits for Pro models. The monthly options are {{plans}}.",
      filter:
        "Adult roleplay is available. Advanced models have their own access and credit limits.",
      privacy: "Creator access is unclear in the reviewed privacy policy",
      pro: "Start with a community character, stage a group scene and change models mid-chat.",
      con: "Pro and Ultra access work differently. Paying for a subscription doesn’t make every model unlimited.",
    },
    spicyChat: {
      bestFor: "adult characters and personas",
      summary:
        "A hosted adult roleplay service with community characters, multiple user personas and paid memory tools.",
      pricing:
        "Free tier with a 4,096-token context. The US annual options are {{plans}}. Check the site for monthly billing.",
      filter: "Adult roleplay is supported. Public characters are moderated.",
      privacy: "Hosted. The current chat supplies context for replies.",
      pro: "Paid plans let you skip queues and edit memories. Higher plans add semantic memory and conversation images.",
      con: "Free users face ads and queues. Text-to-speech and generation controls require the top tier.",
    },
    kindroid: {
      bestFor: "a companion with live calls",
      summary:
        "Build a companion with a backstory, persistent memories, selfies and voice or video calls.",
      pricing:
        "A one-time preview gives 50 messages, or 15 in some regions. The US App Store lists {{plans}}. Web checkout may be cheaper.",
      filter:
        "For adults. Kindroid says it moderates severe real-world harms at account level.",
      privacy: "Encrypted at rest and in transit",
      pro: "Voice and video calls, proactive messages, group chat and selfies built around a persistent companion.",
      con: "The account goes read-only after the preview or subscription ends. Extra memory tiers cost more.",
      free: "One-time preview",
    },
    nomi: {
      bestFor: "a companion with daily free chat",
      summary:
        "A companion service with long-term memory, selfies, group chat and voice on paid plans.",
      pricing: "50 messages a day for free. The paid options are {{plans}}.",
      filter:
        "For adults. Nomi describes text as unfiltered. Images have separate limits.",
      privacy: "Nomi says it doesn’t sell or rent personal data",
      pro: "Keep talking to the same companion over time, or bring several companions into a group.",
      con: "Free chat has a daily cap. Voice requires a subscription.",
    },
    venice: {
      bestFor: "private character chats and media",
      summary:
        "Venice offers character chat alongside general AI chat, image generation and multiple models.",
      pricing:
        "The free plan gives you 10 text prompts and 15 image prompts a day on base models. {{plans}}. Custom characters require Pro.",
      filter:
        "The mature filter defaults to on. Eligible Pro users can turn it off.",
      privacy: "Chat history stays on device by default",
      pro: "Use characters alongside general chat and image generation, with optional encrypted backup on paid plans.",
      con: "Free text use is limited. Premium models and some media spend credits.",
    },
    nanoGpt: {
      bestFor: "pay-per-use model choice",
      summary:
        "A web chat and API for switching among text and media models. Use a preset or bring your own character prompt.",
      pricing:
        "One free web model. First deposit from $0.10 in crypto or $1 by card. {{plans}}. PRO covers selected open models.",
      filter: "For adults. Restrictions vary by model and provider.",
      privacy: "Local history by default. Provider policies vary.",
      pro: "Pay only for the usage you need. The API also works with frontends such as SillyTavern.",
      con: "You bring the character setup or frontend. Most models use your balance.",
    },
  },
  import: {
    title: "Bring a Character.AI character with you",
    intro:
      "Start a fresh story with the parts of a character that its creator made public.",
    steps: {
      account: {
        title: "Sign in",
        body: "Use a free account so you can edit the imported character later.",
      },
      create: {
        title: "Open the character editor",
        body: "On the Skills page, create a custom skill and choose the link import option.",
      },
      paste: {
        title: "Paste the public link",
        body: "Use a Character.AI or Talkie link. The import copies fields available on the public page, such as name, avatar, greeting and description. It can copy the definition when it’s public.",
      },
      model: {
        title: "Pick the model",
        body: "Start a conversation with your copy. You can switch models while staying in the same thread.",
      },
    },
    callout:
      "The import credits the original creator and links back. Your old chat history stays on the original service.",
  },
  privacy: {
    title: "Where your chat goes",
    intro: "Here’s how incognito works on {{appName}}.",
    incognito:
      "The transcript lives in browser storage. Clearing that storage removes it.",
    transit:
      "Each prompt travels through our service to the hosted model provider. We record credit usage for billing.",
    callout:
      "For a fully local setup, use SillyTavern with a model running on your own hardware.",
  },
  stay: {
    title: "When to stay with Character.AI",
    intro:
      "Character.AI still fits readers who want a familiar cast and casual, moderated chat.",
    library:
      "You already have favorite community characters and use built-in voice calls.",
    flat: "You mainly use standard chat and value unlimited free messaging more than model choice.",
    callout:
      "The original app makes sense if its creative tools and content rules fit the stories you write.",
  },
  faq: {
    title: "Frequently asked questions",
    best: {
      q: "What’s the best Character.AI alternative?",
      a: "For a large character library, start with Janitor AI. For local control and lorebooks, use SillyTavern. For a persistent companion, try Kindroid or Nomi. {{appName}} fits if you want to import a public character and switch between models.",
    },
    free: {
      q: "Is there a free Character.AI alternative?",
      a: "Janitor AI offers unlimited standard chats. Nomi offers 50 messages a day. SillyTavern is free software and needs a separate model. {{appName}} gives {{guestCredits}} monthly guest credits or {{freeCredits}} with a free account.",
    },
    import: {
      q: "Can I move my Character.AI characters and conversations?",
      a: "{{appName}} can import available character fields from a public Character.AI or Talkie link with a free account. Private definitions and past conversations stay on the original service.",
    },
    nsfw: {
      q: "Which Character.AI alternatives allow adult text roleplay?",
      a: "Janitor AI’s Limitless category, CrushOn and SpicyChat support adult text under their own rules. With SillyTavern the backend determines what the model permits. {{appName}} unlocks uncensored models after an 18+ confirmation.",
    },
    private: {
      q: "Which Character.AI alternative can run locally?",
      a: "SillyTavern can run with a local model and keep your chats on your own machine. Venice and {{appName}} incognito keep history on your device while hosted providers still process prompts.",
    },
    account: {
      q: "Can I try {{appName}} without an account?",
      a: "Yes. Start in incognito chat with your guest credits. Sign in to import a character or sync saved chats across devices.",
    },
    memory: {
      q: "Which alternatives are best for long scenes?",
      a: "Chub and SillyTavern offer lorebooks that bring story details into context when needed. Kindroid and Nomi focus on companion memory. Revisit an early scene before paying to see what each model actually recalls.",
    },
    roleplayLink: "AI roleplay without a filter",
    kindsLink: "How uncensored AI models differ",
  },
  partners: {
    body: "Run a roleplay community? The {{appName}} partner program pays {{referralPercent}}% of each payment you refer.",
    link: "See the partner program",
  },
  cta: {
    title: "Choose a model and start a scene",
    subtitle: "Start with {{guestCredits}} free credits a month as a guest.",
    start: "Start a roleplay",
    skills: "Browse skills",
  },
};
