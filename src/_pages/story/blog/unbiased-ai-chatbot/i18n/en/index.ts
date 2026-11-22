export const translations = {
  meta: {
    title: "Unbiased AI Chatbot? None Is Neutral. Ask Several. | {{appName}}",
    description:
      "Every AI chatbot leans. Why no model is politically neutral, how mainstream, abliterated and contrary models frame the same question, and how to hear every side in one chat.",
    category: "Guide",
    imageAlt: "Scales weighing the answers of several AI chatbots",
    keywords:
      "unbiased AI chatbot, AI without political bias, politically neutral AI, unbiased AI, is ChatGPT biased, AI chatbot political bias, conservative AI chatbot, AI with contrary opinions, uncensored political AI, ask AI both sides, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Guide",
    readTime: "7 min read",
    title: "There is no unbiased AI chatbot. Ask several.",
    subtitle:
      "Why every model leans, how {{count}} models frame the same question differently, and a four-step method to hear every side in one chat.",
  },
  intro: {
    lead: "Every chatbot says it is balanced. Then it answers one side's question and lectures the other. You notice. Everyone notices. Most people conclude they need the one unbiased AI.",
    p2: "It does not exist. What does exist: models with different frames, side by side. On {{appName}} you can put the same question to a mainstream model, an abliterated one and a model with contrary political opinions, in one chat, and judge for yourself.",
  },
  neutral: {
    title: "Why no AI is neutral",
    intro:
      "Bias is not a bug someone forgot to fix. It is built in three ways.",
    data: "Training data: a model learns from what was written, published and kept online. What was excluded or removed shapes it as much as what was included.",
    tuning:
      "Human feedback: after training, people rate answers and the model learns to please them. Their judgments of what sounds reasonable become the model's.",
    rules:
      "Refusal rules: someone decides which questions are harmful. That is a judgment call, and it lands harder on some topics than on others.",
    sourcesIntro: "Even the labs and researchers say so:",
    sources: {
      openai: "OpenAI: defining and evaluating political bias in LLMs",
      paper: "Research paper: political neutrality in AI is impossible",
    },
    callout:
      "The fix is not a perfect model. It is more than one model, and you as the judge.",
  },
  frames: {
    title: "Four frames, one question",
    intro: "Models lean in different ways. Know which frame you are reading.",
    mainstream:
      "Mainstream models: the big labs' assistants. Capable and careful, shaped by their lab's safety rules. On contested topics they hedge, or decline.",
    abliterated:
      "Abliterated models: mainstream or open models slightly changed so they stop dodging questions. They answer everything, but from the same training and worldview as their base.",
    own: "{{ownModel}}: trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. The other side of the argument, stated plainly.",
    gab: "{{gabModel}}: Gab describes it as built around Christian values and conservative principles. An openly stated slant, which is more than most models offer.",
    kindsLink: "How abliterated and uncensored models differ",
  },
  lineup: {
    title: "{{count}} models, {{count}} frames",
    intro:
      "A lineup for contested questions: mainstream flagships, an abliterated flagship, the contrary model and an openly slanted one. Context and price read live from our registry.",
    footnote:
      "Per message means one reference exchange on the cheapest route. Uncensored models ask once for an 18+ confirmation.",
  },
  table: {
    model: "Model",
    context: "Context",
    price: "Per message",
    chat: "Try it",
    chatLink: "Ask {{model}}",
  },
  method: {
    title: "Hear every side in four steps",
    intro: "One chat. A few switches. Your own verdict.",
    ask: {
      title: "Ask your real question",
      body: "Not a softened version. Ask it the way you would ask a friend who disagrees with you.",
    },
    switch: {
      title: "Switch the model, keep the chat",
      body: "Pick another model from the selector and ask again. The chat keeps its history, so each model sees the same question.",
    },
    steelman: {
      title: "Ask each one to argue the other side",
      body: "Ask for the strongest case against its own answer. A model that cannot steelman the other side is showing you its frame.",
    },
    check: {
      title: "Check the facts yourself",
      body: "Where the models disagree on facts, not opinions, look it up. {{ownModel}} states contested claims as plainly as settled ones. So do the others, in their own direction.",
    },
  },
  skills: {
    title: "Skills that argue every side",
    intro:
      "A skill sets the persona and the model in one click. These ones are built for contested ground.",
    historian: "Unbiased Historian: facts, not narratives",
    advocate: "Devil's Advocate: challenges every assumption",
    debater: "Debater: argues controversial topics from all sides",
    chan: "4chan: greentext and banter, the old imageboard voice, unfiltered",
  },
  pairs: {
    title: "{{ownModel}} against the mainstream",
    intro:
      "Side-by-side pages: context, price and filter for the contrary model against the big names.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    exists: {
      q: "Is there an unbiased AI chatbot?",
      a: "No. Every model is shaped by its training data, the people who rated its answers and its refusal rules. The practical answer is to ask several models with different frames and compare. On {{appName}} that takes one chat and a few clicks.",
    },
    chatgpt: {
      q: "Is ChatGPT politically biased?",
      a: "Every model leans somewhere, and mainstream assistants hedge or decline on contested topics. OpenAI publishes its own evaluations of political bias in its models. Put the same question to a model with a different frame and the difference shows.",
    },
    conservative: {
      q: "Is there a conservative or right-leaning AI chatbot?",
      a: "{{gabModel}} is described by Gab as built around Christian values and conservative principles. {{ownModel}} is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. Both are in the {{appName}} model selector.",
    },
    truth: {
      q: "Does {{ownModel}} tell the truth?",
      a: "It tells you what the mainstream models will not. It is not neutral either, and it states contested claims as plainly as settled ones. Use it as the other side of the argument and check facts that matter.",
    },
    side: {
      q: "Does {{appName}} take a political side?",
      a: "No. We run mainstream, open and uncensored models side by side and you choose. Humans decide what they read, not a corporation.",
    },
    free: {
      q: "Can I compare models for free?",
      a: "Yes. You get {{guestCredits}} free credits a month without an account and {{freeCredits}} with a free account. Switching models inside a chat costs nothing extra.",
    },
    refusalLink: "The refusal index: which AI actually answers",
    jailbreakLink: "Why ChatGPT jailbreaks keep breaking",
    bestLink: "The best uncensored LLM, picked by job",
  },
  cta: {
    title: "Hear the side your chatbot skips.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Ask the contrary model, then switch and compare.",
    start: "Ask the contrary model",
    models: "Compare all models",
  },
};
