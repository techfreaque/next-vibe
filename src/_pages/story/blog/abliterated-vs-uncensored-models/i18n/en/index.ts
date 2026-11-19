export const translations = {
  meta: {
    title: "Abliterated vs Uncensored AI Models: 3 Kinds Explained",
    description:
      "Abliterated, fine-tuned or trained on its own worldview: what each kind of uncensored AI model changes, how to tell them apart in ten minutes, and which model on {{appName}} is which.",
    category: "Model Guide",
    imageAlt: "Three kinds of uncensored AI model, explained",
    keywords:
      "abliterated vs uncensored, what is an abliterated model, abliteration explained, abliterated LLM, uncensored AI models, uncensored fine-tune, uncensored AI chat, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "8 min read",
    title:
      "Abliterated, fine-tuned, or its own worldview. Three kinds of uncensored AI.",
    subtitle:
      "{{uncensoredCount}} uncensored models on {{appName}}, sorted by how they lost their filter. What each method changes, what it leaves alone, and a ten-minute test to tell them apart.",
  },
  intro: {
    lead: 'Two models both say "uncensored". One answers your political question in the voice of the lab that built it. The other argues the opposite side. Same label, different machines.',
    p2: "There are three ways to make an AI model stop refusing, and they produce three different models. This guide explains each method in plain terms, shows which of our models was made which way, puts three open models next to their uncensored builds, and gives you a test you can run yourself.",
  },
  label: {
    title: 'Why "uncensored" alone tells you little',
    p1: '"Uncensored" describes behavior: the model answers instead of refusing. It says nothing about how the model got there. Hosts use the word for very different things, and model names mix "abliterated", "uncensored", "heretic" and "unfiltered" freely.',
    p2: "The method matters because it decides what else changed. Did only the refusals go, or the writing style too? Did the model's view of the world move, or just its willingness to share it? Those answers decide which model fits your work.",
  },
  methods: {
    title: "The three methods",
    intro: "From the smallest change to the biggest.",
    abliterated: {
      title: "1. Abliterated: the refusal cut out of the weights",
      how: "Research from 2024 showed that refusal in chat models runs through a single direction inside the model. Abliteration measures that direction by comparing how the model reacts to prompts it refuses and prompts it answers, then removes it from the weights. No new training data, no retraining.",
      keeps:
        "Keeps: the base model's knowledge, writing style, tool calling and worldview. Same model, minus the reflex to say no.",
      changes:
        "Changes: refusals mostly stop. On political or moral questions it still answers the way its base lab trained it to, just without the dodge.",
    },
    fineTuned: {
      title: "2. Fine-tuned: retrained to answer",
      how: "A decensoring fine-tune trains the model further on examples that reward direct answers: fiction, roleplay, open conversation. Dolphin, the base of Venice Uncensored, is one of the best-known examples. Roleplay fine-tunes go further and train on stories.",
      keeps:
        "Keeps: most of the base model's knowledge. The underlying worldview still comes from the base model's original training.",
      changes:
        "Changes: refusals, and often the voice. Fine-tunes write differently from their base: looser, more vivid, sometimes more repetitive. Quality depends entirely on the training data.",
    },
    ownWorldview: {
      title: "3. Its own worldview: different training material",
      how: "The first two methods start from a mainstream model and remove the brakes. {{ownName}} takes a different route: it is trained on books and documents banned from the mainstream internet. The result is a model with contrary political opinions.",
      keeps:
        "Keeps: nothing of a mainstream model's framing. There is no consensus line to steer back to.",
      changes:
        "Changes: the answers themselves. Ask about politics and you get takes the mainstream models will not give you, unlocked or not.",
    },
    callout:
      "Short version. Abliterated and fine-tuned models are mainstream models that stopped dodging: same worldview, they just answer. {{ownName}} is the other kind: a different worldview. Pick the first for capability without refusals. Pick the second for the other side of the argument.",
    sources: {
      paper:
        "Paper: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "Abliteration explained step by step (Hugging Face blog)",
    },
  },
  ours: {
    title: "Which of our models is which",
    intro:
      "Live from our model registry: every uncensored model on {{appName}} right now, grouped by how it was made. We only list a method where the model's provider documents it.",
    abliterated: {
      title: "Abliterated ({{count}})",
      body: "Mainstream and open models with the refusal direction removed. The most capability in the uncensored set: reasoning, code, tools.",
    },
    fineTuned: {
      title: "Fine-tuned ({{count}})",
      body: "Retrained to answer, mostly for fiction and roleplay. Expect a different voice from the base model.",
    },
    ownWorldview: {
      title: "Own worldview ({{count}})",
      body: "Trained on books and documents banned from the mainstream internet. The pick for politics, other viewpoints and the darkest fiction.",
    },
    unlisted: {
      title: "Method not published ({{count}})",
      body: "Uncensored, but the provider does not say how. Test them with the steps below before you rely on them.",
    },
  },
  pairs: {
    title: "Same model, filter on and off",
    intro:
      "Three open models next to their uncensored builds. Same lab, same base. What changes is the refusals, and the price.",
    colBase: "Base model",
    colUncensored: "Uncensored build",
    colMethod: "Method",
    colContext: "Context",
    colPrice: "Price per message",
    method: {
      abliterated: "Abliterated",
      fineTuned: "Fine-tuned",
      ownWorldview: "Own worldview",
      unlisted: "Not published",
    },
    price: "{{base}} vs {{uncensored}}",
    ratio: "Uncensored costs {{ratio}}x",
    footnote:
      "Where the filter never gets in your way, the base model is the cheaper pick.",
    compareLink: "Compare {{a}} with {{b}}",
  },
  test: {
    title: "Tell them apart in ten minutes",
    intro:
      "Model names lie, behavior does not. Run the same three prompts on two models in one chat and watch what changes.",
    steps: {
      refusal: {
        title: "The refusal test",
        body: "Ask something the base model dodges: a blunt medical question, a dark scene, a security write-up. Every uncensored model should answer. If it still refuses or wraps the answer in warnings, the uncensoring is shallow.",
      },
      voice: {
        title: "The voice test",
        body: "Ask both for the same short story. An abliterated build reads like its base model. A fine-tune sounds noticeably different: its own rhythm, its own favorite words.",
      },
      worldview: {
        title: "The worldview test",
        body: "Ask a contested political question and ask for a clear position, not a list of perspectives. Abliterated and fine-tuned models answer in their base lab's framing. {{ownName}} argues a position the mainstream models will not take.",
      },
      switch: {
        title: "Switch models mid-thread",
        body: "Pick another model and send the next message. The thread keeps its history and the new model reads all of it, so you compare on the exact same context.",
      },
    },
    callout:
      "Check the facts either way. Removing refusals does not add accuracy, and a model with a different worldview states contested claims as plainly as settled ones.",
  },
  tradeoffs: {
    title: "What each method costs you",
    intro: "No method is free.",
    abliterated:
      "Abliterated: can lose some accuracy. The write-up that made the method popular measured a drop on benchmarks after abliteration and recovered most of it with an extra round of training. In return you keep the base model's skills, tools included.",
    fineTuned:
      "Fine-tuned: only as good as its training data. Great prose on stories, weaker on code and analysis. Roleplay fine-tunes are storytellers, not assistants.",
    ownWorldview:
      "Own worldview: not neutral by design, so check its facts. {{ownName}} holds {{ownContext}} tokens of context and is not a coder.",
  },
  pick: {
    title: "Which kind for which job",
    capability:
      "Code, analysis, research without refusals: an abliterated build of a strong model.",
    fiction:
      "Roleplay and fiction with a vivid voice: a fine-tune, or an abliterated model with a long context for long campaigns.",
    viewpoint:
      "Politics, controversial questions, the other side of an argument: {{ownName}}.",
    unsure:
      "Not sure: put two models side by side on your own prompt. That beats any label.",
    consent:
      "Uncensored models are for adults. The first time you pick one, you confirm you are 18 or older. Once. After that you decide what you ask, not a corporation. The law where you live still applies.",
  },
  faq: {
    title: "FAQ",
    whatIs: {
      q: "What is an abliterated model?",
      a: "A model with its refusal direction removed from the weights. Researchers found that refusal runs through one direction inside the model. Abliteration measures it and cuts it out, without retraining. The model keeps its knowledge and worldview and stops refusing.",
    },
    difference: {
      q: "What is the difference between abliterated and uncensored?",
      a: "Uncensored is the behavior: the model answers. Abliterated is one way to get there. Others are a decensoring fine-tune, or training on different material, like {{ownName}}. On {{appName}}, {{abliteratedCount}} uncensored models are abliterated and {{fineTunedCount}} are fine-tuned.",
    },
    worse: {
      q: "Are abliterated models dumber than the original?",
      a: "Slightly, sometimes. Removing the refusal direction can cost some accuracy, and an extra round of training recovers most of it. For most tasks you keep the base model's strengths. Compare both on your own prompt.",
    },
    truly: {
      q: "Which uncensored model is truly uncensored?",
      a: 'Abliterated and fine-tuned models stop refusing but keep a mainstream worldview. {{ownName}} is trained on books and documents banned from the mainstream internet, so it has contrary political opinions of its own. Which one is "truly" uncensored depends on whether you want answers or a different view.',
    },
    free: {
      q: "Can I try uncensored models for free?",
      a: "Yes. {{guestCredits}} free credits a month without an account, {{freeCredits}} with a free account. Enough to run the ten-minute test on the cheaper uncensored models. The premium ones cost more per message.",
    },
    legal: {
      q: "Are uncensored AI models legal?",
      a: "A model is a tool. What you generate and publish is your responsibility, and the law where you live applies to it. On {{appName}}, uncensored models unlock after a one-time 18+ confirmation.",
    },
    ownLink: "See the {{ownName}} model page",
    guideLink: "Read the uncensored models guide, model by model",
  },
  cta: {
    title: "Run the test yourself.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Abliterated, fine-tuned or {{ownName}}: switch per message.",
    chat: "Start an incognito chat",
    models: "Browse all models",
  },
};
