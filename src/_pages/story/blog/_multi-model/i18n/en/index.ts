export const translations = {
  common: {
    back: "Back to blog",
    category: "Comparison",
    readTime: "7 min read",
    switching: "Why people look for alternatives",
    criteria: "What to compare before you switch",
    privacy:
      "Check where history is saved and who processes prompts. Connecting a hosted model still sends the prompt to a provider, even with a local interface.",
    table: "All options, side by side",
    checked:
      "Competitor prices checked on {{date}}. Prices shown in US dollars. Local checkout prices can vary. {{appName}} figures come from our current configuration. Scroll sideways on small screens.",
    alternatives: "The other options, one by one",
    price: "Price.",
    pro: "Best part.",
    con: "Trade-off.",
    fit: "Choose it if",
    faq: "FAQ",
    guides: "Related comparisons",
    modelCatalog: "See the model catalog",
  },
  kinds: {
    aggregator: "Hosted multi-model chat",
    client: "Client for your own API keys",
    selfHosted: "Self-hosted chat interface",
    gateway: "API gateway with web chat",
    creativeChat: "Hosted creative chat",
    singleProvider: "Single-provider hosted chat",
  },
  us: {
    title: "{{appName}}. Hosted chat with a choice of filters",
    intro:
      "Switch models in the same conversation without setting up a provider key. The catalog has {{modelCount}} chat models, including {{mainstream}} mainstream, {{open}} open and {{uncensored}} uncensored models. Uncensored access requires confirming you are 18 or older.",
    price:
      "Start with {{guestCredits}} free credits a month as a guest or {{freeCredits}} with an account, {{maxCredits}} with the newsletter. Plans start at {{subPrice}} a month. Usage draws credits at the selected model’s rate.",
    privacy:
      "Incognito history stays in your browser. A hosted model still receives the prompt it needs to answer.",
    api: "Paid access to OpenAI and Anthropic compatible APIs starts at {{apiSubPrice}} a month.",
    cta: "Try your usual prompt in two models",
    ctaSubtitle:
      "Start incognito with {{guestCredits}} free credits a month. Pick a model and send your first message.",
    start: "Start an incognito chat",
    models: "Explore uncensored models",
  },
  platforms: {
    poe: {
      free: "Free daily points.",
      paid: "From {{poeStart}}/month",
      filter: "Poe policy and bot rules",
      privacy: "Poe and bot providers handle chat data",
      api: "OpenAI compatible, shares plan points",
      media: "Images, video, audio",
      open: "Proprietary",
      models:
        "Quora’s hosted service puts GPT, Claude, Gemini and other models next to community bots. One points balance covers chat and media, with no provider keys to configure.",
      price:
        "Free points reset every 24 hours and do not carry over. The entry paid tier lists 10,000 points a day. The point cost varies by bot and can rise with more input, output or context.",
      pro: "Discover community bots, invite people to a group chat or publish a bot. Eligible creators can earn per message. Subscribers can spend the same points in chat and the API.",
      con: "The points budget and per-bot rates determine how much you can use. Poe’s privacy policy says bot providers and developers may receive chats and uploads. Rules differ by bot, and Poe’s own policy also applies.",
      fit: "you want a hosted bot directory, group chats and one bill for several model providers.",
    },
    typingMind: {
      free: "Basic interface without a license.",
      paid: "{{typingStandard}} once, plus model usage",
      filter: "Rules of the connected model and provider",
      privacy: "Browser storage by default, optional sync",
      api: "Connects to external APIs",
      media: "Images and voice with eligible plans and models",
      open: "Proprietary, paid static self-host",
      models:
        "TypingMind is an interface for your own API keys or compatible endpoints. It connects to GPT, Claude, Gemini and other models, and can keep licensed chat history in your browser.",
      price:
        "Standard costs {{typingStandard}}, Extended {{typingExtended}}, and Premium was listed at {{typingPremium}} on promotion, with {{typingList}} as the list price. The license excludes model usage. Paid storage upgrades are separate from the license.",
      pro: "Premium adds project folders and side-by-side answers, with separate context per model. You set model parameters and can use the providers you already pay for.",
      con: "The free interface does not save chats. You manage keys and provider bills. Self-hosting uses the compiled app under a paid license.",
      fit: "you want direct provider billing and a ready-made client with detailed controls.",
    },
    libreChat: {
      free: "Free MIT software.",
      paid: "Hosting and model usage as applicable",
      filter: "Depends on instance and model",
      privacy: "History on your instance; hosted models receive prompts",
      api: "Provider APIs and beta Agents API",
      media: "Image generation with configured tools",
      open: "MIT, self-hosted",
      models:
        "LibreChat connects providers such as OpenAI, Anthropic and OpenRouter. Install it on your own server or try the project’s public demo with an account.",
      price:
        "The software has no license fee. Budget for a server and any paid providers. The public demo is for evaluation.",
      pro: "A stack you can modify, with agents, MCP, file search, chat imports and formats for exports.",
      con: "You own installation, upgrades and backups. The demo is a poor place for sensitive data or chats you need to keep.",
      fit: "you want an adaptable chat interface with multiple providers and can maintain the server.",
    },
    openWebUi: {
      free: "Free to host under its license.",
      paid: "Hardware, hosting or model usage as applicable",
      filter: "Depends on instance and model",
      privacy: "Can run offline with local models",
      api: "Ollama and OpenAI compatible endpoints",
      media: "Images and voice with integrations",
      open: "Source available, branding conditions",
      models:
        "Open WebUI is a self-hosted interface for Ollama and OpenAI compatible APIs. The chat can run entirely offline with a local model.",
      price:
        "The software is free with the project’s branding. A separate license can cover rebranding for larger deployments.",
      pro: "Run models and keep history on your hardware. You can connect a cloud API later in the same interface.",
      con: "Local models need adequate hardware or a separate server. Operational work and the branding rules matter if you deploy it for others.",
      fit: "running local and hosted models in one interface matters, especially offline.",
    },
    openRouter: {
      free: "Selected models free.",
      paid: "Pay per use",
      filter: "Model and provider rules",
      privacy: "Provider data policies vary by route",
      api: "Unified API",
      media: "Depends on the selected model",
      open: "Hosted, proprietary",
      models:
        "OpenRouter Chat is the browser playground for OpenRouter’s model catalog. Send one prompt to several models and compare replies side by side.",
      price:
        "Paid models are billed per use. Standard card top-ups carry a {{routerFee}} fee with a {{routerMinimum}} minimum, and the model rates pass through from providers.",
      pro: "Compare answers and choose a provider route. The same balance also works with OpenRouter’s API.",
      con: "Free requests are capped. Paid usage varies by model and context, and provider retention rules vary by route.",
      fit: "you want to compare many models in your browser and pay as you go.",
    },
    venice: {
      free: "10 text and 15 image prompts daily on base models.",
      paid: "Pro {{venicePro}}/month",
      filter: "Mature filter can be disabled on Pro",
      privacy: "Local history by default; privacy varies by route",
      api: "API billed in credits",
      media: "Images, video, voice and music",
      open: "Hosted, proprietary",
      models:
        "Venice hosts a mix of open and proprietary text models alongside image, video and audio tools. Its privacy page distinguishes four inference paths with different protections.",
      price:
        "Pro costs {{venicePro}} a month. It includes unlimited text prompts on included models. Some frontier models and media generations still use credits.",
      pro: "Browser-local history by default, encrypted backups on Pro and the option to choose hardware-protected models on supported routes.",
      con: "The free tier has daily limits. Some frontier routes send prompts to external providers, and turning off the mature filter requires Pro or higher.",
      fit: "you want more control over content settings and a hosted interface with local history.",
    },
    nanoGpt: {
      free: "One free web model.",
      paid: "Pay per use or Pro {{nanoPro}}/month",
      filter: "Terms and model limits apply",
      privacy: "Browser history by default; optional sync",
      api: "API with prepaid balance or eligible plan usage",
      media: "Images, video and voice",
      open: "Hosted, proprietary",
      models:
        "NanoGPT offers mainstream and open models in the browser and via API. Add funds to use paid models without a recurring charge, or choose a plan for included usage.",
      price:
        "Pro is {{nanoPro}} a month, with up to 60 million input tokens weekly on included open models and 100 images a day on four included image models.",
      pro: "Pay as you go with a shared web and API balance. Browser-local history is the default, and signup can use a generated ID.",
      con: "On Pro, most closed models, video and voice still charge your balance. The included allowance applies to specific models.",
      fit: "your usage varies or you want a recurring allowance mostly for open models.",
    },
    chatGpt: {
      free: "Separate ChatGPT Free tier.",
      paid: "Plus {{plus}}/month",
      filter: "OpenAI policies",
      privacy: "Account history with training controls",
      api: "OpenAI API billed separately",
      media: "Images and voice",
      open: "Hosted, proprietary",
      models:
        "ChatGPT Plus is OpenAI’s hosted subscription. It bundles access to OpenAI models, voice conversations, file analysis, image generation and deep research where available.",
      price:
        "OpenAI lists Plus at {{plus}} per month. Limits can change, and API billing is separate.",
      pro: "Voice, files and research are available in the same app, with a straightforward monthly price.",
      con: "Usage caps can apply, and this is a single-provider chat. A Plus subscription does not cover general OpenAI API usage.",
      fit: "you mainly use OpenAI models and want the tools that come with ChatGPT.",
    },
  },
  posts: {
    poe: {
      metaTitle: "8 Poe alternatives compared (2026)",
      description:
        "Compare Poe alternatives for one hosted balance, per-use billing or your own keys. See current prices, trade-offs and where {{appName}} fits.",
      keywords:
        "Poe alternatives, alternatives to Poe AI, Poe compute points, Poe vs TypingMind, OpenRouter Chat, {{appName}}",
      title: "8 Poe alternatives for different budgets",
      subtitle:
        "Keep a hosted chat, buy usage as you need it, or run your own interface. Eight options compared, including {{appName}}.",
      lead: "Poe is convenient when you use several models regularly. If the cost of a long thread catches you off guard, look at how the next app bills that same conversation. A daily allowance, a prepaid balance and a provider API meter reward different habits.",
      overview: "What Poe offers and how it charges",
      tradeoff:
        "Poe’s strengths are its public bot directory, creator payouts and group chats. {{appName}} still meters usage in credits, so you should compare the cost of a long thread on the models you actually use.",
      switch: {
        firstLink: "Poe renewal prices and allowances",
        secondLink: "Poe versus pay as you go",
        first:
          "In one r/PoeAI discussion, subscribers reported changes to renewal prices and point allowances. One participant said they planned to switch to OpenRouter with TypingMind. Another said a legacy plan still made sense for their usage.",
        second:
          "In a separate thread, one user favored OpenRouter for visibility into model costs. Another argued Poe’s daily allowance could offer better value if used consistently. These are individual experiences, and the official prices below are the basis for this comparison.",
      },
      criteria: {
        cost: "If your usage comes in bursts, compare a prepaid service to what you spend on a subscription in a quiet month. If you chat every day, check how many real turns fit the points you get.",
        workflow:
          "List what you use outside ordinary chat. Community bots and group chats are reasons to keep Poe. If you mainly compare answers, check for parallel responses or switching models inside a thread.",
      },
      faq: {
        best: {
          q: "What is the best Poe alternative?",
          a: "Try {{appName}} for hosted chat with mainstream and uncensored options. OpenRouter Chat and NanoGPT suit usage-based billing. TypingMind works if you want to bring your own keys, and Open WebUI suits a local setup.",
        },
        free: {
          q: "Is there a free alternative to Poe?",
          a: "{{appName}} gives guests {{guestCredits}} free credits each month. OpenRouter has a limited set of free models. LibreChat and Open WebUI have no software fee for ordinary self-hosting. Hardware, hosting and paid providers can still cost money.",
        },
        billing: {
          q: "Which Poe alternatives let me pay as I go?",
          a: "OpenRouter and NanoGPT let you fund a balance and pay for usage. TypingMind and LibreChat can use accounts you pay directly. The cheapest option depends on your model, context length and frequency.",
        },
        privacy: {
          q: "Which alternative keeps my chats local?",
          a: "Open WebUI can run offline with a local model. TypingMind stores licensed chat history locally by default. Venice, NanoGPT and {{appName}} incognito can keep history on your device while using hosted models, which still receive the prompt.",
        },
        switching: {
          q: "Should I stay with Poe if I use community bots?",
          a: "Often, yes. Other apps have their own agents or tools, while Poe’s bot directory, group chats and creator payouts are specific to Poe. Make sure your replacement covers the workflow you rely on before changing your plan.",
        },
      },
    },
    typingMind: {
      metaTitle: "8 TypingMind alternatives compared (2026)",
      description:
        "Compare TypingMind alternatives for your own API keys, local models or hosted chat. See license costs, model billing and where {{appName}} fits.",
      keywords:
        "TypingMind alternatives, TypingMind vs LibreChat, TypingMind vs Open WebUI, bring your own API key, {{appName}}",
      title: "8 TypingMind alternatives for your AI chat setup",
      subtitle:
        "Keep your provider keys and run your own interface, or get straight to a hosted model. Eight options compared, including {{appName}}.",
      lead: "TypingMind makes sense when you want one polished interface for the providers you pay. If you mainly want a chat window, ask what the license, model usage and any sync upgrade add up to. The answer may point to a free interface or to a hosted chat that manages the models for you.",
      overview: "What the TypingMind license buys",
      tradeoff:
        "TypingMind gives you direct provider billing and Premium can show several independent replies at once. {{appName}} gives you one hosted catalog and charges at the selected model’s credit rate. Pick a client like TypingMind if you already have provider credits you want to spend directly.",
      switch: {
        firstLink: "Free self-hosted alternatives to TypingMind",
        secondLink: "Costs beyond the TypingMind license",
        first:
          "In r/selfhosted, a user said TypingMind cost more than they wanted to pay. They looked for a self-hosted interface for their OpenAI access, tried Open WebUI and reported that it fit.",
        second:
          "In r/TypingMind, a prospective buyer asked what they would pay beyond the lifetime license. Replies discussed API usage and optional cloud storage. Use the current pricing page for the terms and amounts, since the discussion reflects individual setups.",
      },
      criteria: {
        cost: "Compare the total over a year, including license, model usage, storage and any server you need. A hosted plan is simpler to budget, while usage charges can suit occasional work.",
        workflow:
          "If your own keys or a local model are essential, shortlist LibreChat and Open WebUI. If you need separate context per model or project folders, check those workflows before moving.",
      },
      faq: {
        best: {
          q: "What is the best TypingMind alternative?",
          a: "LibreChat is a strong fit for self-hosting a multi-provider client. Pick Open WebUI for local models, OpenRouter Chat for comparing hosted models, or {{appName}} if you want hosted chat with mainstream and uncensored choices and no key setup.",
        },
        free: {
          q: "Is there a free TypingMind alternative?",
          a: "LibreChat and Open WebUI are free to self-host under their licenses. Your server and any paid model usage are separate. {{appName}} gives guests {{guestCredits}} free credits per month without an account.",
        },
        billing: {
          q: "Does a TypingMind license include API usage?",
          a: "No. You pay the license once, then pay your model providers at their rates. With a local model, the running costs are your hardware and electricity. ChatGPT Plus is a separate subscription and does not cover general OpenAI API usage.",
        },
        privacy: {
          q: "Is local chat history the same as offline inference?",
          a: "No. TypingMind can save history on your device while sending prompts straight to an online provider. Open WebUI with a fully local model is an option if you need both the history and the inference to stay on your hardware.",
        },
        switching: {
          q: "Can I switch from TypingMind to Poe or OpenRouter Chat?",
          a: "Yes. Poe manages model access with subscription points. OpenRouter Chat bills paid models against a balance and can run the same prompt on several models. Save any important chat history before moving, and check the destination’s import formats.",
        },
      },
    },
  },
};
