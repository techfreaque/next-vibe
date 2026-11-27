export const translations = {
  meta: {
    title: "Uncensored LLM Online: No GPU, No Install | {{appName}}",
    description:
      "Uncensored LLM online, no GPU. The VRAM local models really need, which abliterated and uncensored models run in your browser, and what each message costs.",
    category: "Model Guide",
    imageAlt: "An uncensored LLM running online, no GPU needed",
    keywords:
      "uncensored LLM online, run uncensored LLM without GPU, online alternative to local LLM, local LLM alternative online, uncensored AI no GPU, abliterated model online, uncensored model in browser, VRAM for local LLM, Ollama alternative online, LM Studio alternative, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "8 min read",
    title: "Uncensored LLM online. No GPU. No install.",
    subtitle:
      "What a local uncensored model really asks of your hardware, and {{count}} uncensored models you can run in a browser tab instead. Prices and context read live from our model registry.",
  },
  intro: {
    lead: "Every guide to uncensored models says the same thing: download it, run it locally. Then you check your graphics card. The big models need more memory than any gaming PC has. The small ones that fit are not the ones people rave about.",
    p2: "There is a second route. The same kind of models, hosted, in a browser tab. No GPU, no drivers, no 40 GB download. This guide shows what local actually takes, when it still wins, and which {{count}} uncensored models run on {{appName}} right now.",
  },
  table: {
    model: "Model",
    context: "Context",
    price: "Per message",
  },
  hardware: {
    title: "What running it locally actually takes",
    intro:
      "Memory is the wall. The model's weights must fit in your GPU's VRAM (or unified memory on a Mac) to run at a usable speed. These are the uncensored models in our catalog with a published parameter count.",
    colParams: "Parameters",
    colMemory: "Weights at 4-bit / 8-bit",
    paramsValue: "{{count}}B",
    memoryValue: "{{q4}} GB / {{q8}} GB",
    unknown: "Not published",
    footnote:
      "Weights only, computed from the parameter count: about 0.5 GB per billion parameters at 4-bit, 1 GB at 8-bit. The context (KV cache) and the runtime need more on top, and long chats need a lot more.",
    small:
      "Up to about 12 GB of weights: fits a 16 GB graphics card with room for context.",
    mid: "20 to 40 GB: a 24 GB card at 4-bit with short context, or two cards, or a Mac with a lot of unified memory.",
    large:
      "Hundreds of GB: no consumer machine. These are the frontier-size models, and the only practical way to use them is hosted.",
    callout:
      "Quantization shrinks the file and costs some quality. A 4-bit build of a mid-size model is not the same experience as the full model in the cloud.",
  },
  local: {
    title: "When local is still the right call",
    intro:
      "Local is not wrong. It is a trade. Tools like Ollama and LM Studio make it easy if your hardware is up to it.",
    winsTitle: "Where local wins",
    offline:
      "Offline: no internet, no account, no provider in the loop. Nothing leaves the machine.",
    catchTitle: "The catch",
    verdict:
      "Short version: you have a strong GPU, you want full privacy and you are happy with a mid-size model? Run it locally. You want the big models, long context or just an answer in the next minute? Run it online.",
  },
  online: {
    title: "{{count}} uncensored models you can run in a browser",
    intro:
      "Every current uncensored model on {{appName}}, cheapest first. Context and price per message come straight from our model registry. Click a model to chat with it.",
    colChat: "Try it",
    chatLink: "Chat with {{model}}",
    footnote:
      "Per message means one reference exchange on the cheapest route. Long chats and long answers cost more. All of them run on servers, so your laptop just needs a browser.",
    directoryLink: "All abliterated models, with context and price",
  },
  steps: {
    title: "From zero to an answer in a minute",
    intro: "No download, no account needed to start.",
    open: {
      title: "Open a chat",
      body: "Click any model above, or start an incognito chat. Guests get {{guestCredits}} free credits a month.",
    },
    pick: {
      title: "Pick the model",
      body: "Choose from the uncensored tier in the model selector. Switch mid-conversation any time, the chat keeps its history.",
    },
    confirm: {
      title: "Confirm you are 18+",
      body: "Uncensored models ask once for an 18+ confirmation and the terms. Then they stay unlocked.",
    },
    ask: {
      title: "Ask the real question",
      body: "The one other assistants dodge. No jailbreak prompt, no roleplay wrapper.",
    },
  },
  kinds: {
    title: "Two kinds of uncensored, both online",
    intro: "Not every uncensored model is uncensored the same way.",
    abliterated:
      "Abliterated and fine-tuned builds: mainstream or open models slightly changed so they stop dodging questions. Same training, same worldview. They just answer.",
    own: "{{ownModel}}: trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. It is served hosted, through uncensored.ai.",
    link: "Abliterated, fine-tuned or own worldview: how they differ",
  },
  privacy: {
    title: "What a hosted model sees",
    intro:
      "Online means someone else's server runs the model. Here is exactly who sees what.",
    transit:
      "Each message passes through our server to the provider that runs the model. The provider sees the prompt, under its own terms. Every hosted AI works this way.",
    incognito:
      "Incognito chats are stored in your browser's local storage, not on our servers. Clear your browser data and they are gone.",
    selfHost:
      "{{appName}} is open source. Self-host it and point it at your own local models when nothing may leave your machine.",
    selfHostLink: "Self-host {{appName}}",
    callout:
      "If a prompt must never leave your hardware, run it locally. For everything else, hosted is the fast route.",
  },
  cost: {
    title: "What it costs, local vs online",
    intro: "Local has no per-message price. The hardware is the price.",
    guest:
      "Online here: {{guestCredits}} free credits a month without an account, {{freeCredits}} with a free account, {{maxCredits}} with the newsletter.",
    plan: "Plans from {{subPrice}} a month. Credit packs top up an active plan and never expire.",
    local:
      "Local: free per message, but a GPU that runs the big models costs more than years of hosted chat. Electricity too.",
  },
  pairs: {
    title: "The base model next to its uncensored build",
    intro:
      "Same lab, same size, refusals cut. Compare context, price and filter side by side.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    gpu: {
      q: "Can I run an uncensored LLM without a GPU?",
      a: "Yes. Use a hosted one. The model runs on the provider's servers, you only need a browser. On {{appName}} that covers {{count}} uncensored models, including frontier-size ones no home PC can hold.",
    },
    free: {
      q: "Is there a free uncensored LLM online?",
      a: "On {{appName}} you get {{guestCredits}} free credits a month without an account and {{freeCredits}} with a free account, {{maxCredits}} with the newsletter. How many messages that buys depends on the model and the chat length. Uncensored models need a one-time 18+ confirmation.",
    },
    vram: {
      q: "How much VRAM do I need to run an uncensored model locally?",
      a: "Rule of thumb for the weights: about 0.5 GB per billion parameters at 4-bit, 1 GB at 8-bit. A 24B model needs about 12 GB at 4-bit, a 70B model about 35 to 40 GB. Context and the runtime come on top.",
    },
    private: {
      q: "Is an online uncensored LLM private?",
      a: "Less private than local. The provider that runs the model sees your prompt. On {{appName}}, incognito chats stay in your browser's storage, not on our servers. For prompts that may never leave your machine, run a model locally.",
    },
    offline: {
      q: "Can I use an uncensored model offline?",
      a: "Not a hosted one. Offline means local: download a model you can fit in memory and run it with a tool like Ollama or LM Studio.",
    },
    truly: {
      q: "Are abliterated models truly uncensored?",
      a: "They stop refusing, but they keep their base model's training and worldview. {{ownModel}} is different: it is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    },
    chatLink: "Unfiltered AI in your browser: every uncensored model",
    platformsLink: "Uncensored AI platforms compared, local runners included",
  },
  cta: {
    title: "Skip the download. Ask now.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Pick an uncensored model and switch any time.",
    start: "Start an uncensored chat",
    models: "Compare all models",
  },
};
