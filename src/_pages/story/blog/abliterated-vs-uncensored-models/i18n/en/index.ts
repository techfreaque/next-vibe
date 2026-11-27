export const translations = {
  meta: {
    title: "Abliterated vs. Uncensored AI Models",
    description:
      "Learn what abliteration changes in a language model, how it differs from uncensored fine-tuning, and how to compare a variant with its base model.",
    category: "Model Guide",
    imageAlt: "Three kinds of uncensored AI model, explained",
    keywords:
      "abliterated vs uncensored, what is an abliterated model, abliteration explained, abliterated LLM, uncensored AI models, uncensored fine-tune, GLM 5.3 Uncensored, DeepSeek V4.1 Flash Uncensored, Kimi K3.1 Pro Uncensored, UncensoredLM, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "8 min read",
    title: "How abliterated models differ from other uncensored models",
    subtitle:
      "See what happens to refusals, writing style, and accuracy when model weights change. Compare abliteration, fine-tuning, and the approach behind {{ownName}}.",
  },
  intro: {
    lead: "An abliterated LLM is a language model whose weights have been edited to reduce learned refusals. It starts from an existing model, so its knowledge and writing style may still feel familiar.",
    p2: "Uncensored is a broader label. It can cover models edited through abliteration, models fine-tuned to answer more freely, and models trained to offer a different perspective, such as {{ownName}}.",
  },
  online: {
    title: "Try an abliterated model online",
    directoryLink: "Browse abliterated models for browser chat",
    guideLink: "Explore uncensored AI chat and models",
    compare:
      "On {{appName}}, open a model page to check its context window, features, and estimated cost before you start a chat. Compare an abliterated model with its base version if both are available.",
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
      how: "Abliteration reduces learned refusals by editing a model’s weights. A 2024 study identified a direction associated with refusal in the chat models it tested. The effect of removing that signal varies by model and prompt.",
      keeps:
        "The base model’s writing style and knowledge often remain recognizable. Test the exact version for accuracy and tool use.",
      changes:
        "An abliterated variant may answer prompts its base model refuses. Results vary with the model and prompt.",
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
      "The method tells you what the developer changed. Use the comparison below to see what matters for your own prompts.",
    sources: {
      paper:
        "Paper: Refusal in language models is mediated by a single direction (arXiv)",
      blog: "Abliteration explained step by step (Hugging Face blog)",
    },
  },
  ours: {
    title: "Other uncensored models",
    intro:
      "The remaining uncensored models on {{appName}} are grouped by documented method. If the provider hasn’t published its method, we leave it unspecified.",
    abliterated: {
      title: "Abliterated models available now ({{count}})",
      body: "For coding or analysis, check tool support. For long chats or fiction, compare context windows.",
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
    title: "How the base and uncensored versions compare",
    intro:
      "Compare the base models and their uncensored variants below. Check each pair for the method, context window, and estimated price per message.",
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
        body: "Try a benign prompt where the base model is reluctant, such as writing a dark fictional scene. Compare how directly each model responds. One answer alone tells you little about how the model was made.",
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
      a: "An abliterated model is an existing language model edited to refuse fewer prompts. The change targets the model’s weights.",
    },
    difference: {
      q: "What is the difference between abliterated and uncensored?",
      a: "Uncensored is the behavior: the model answers. Abliterated is one way to get there. Others are a decensoring fine-tune, or training on different material, like {{ownName}}. On {{appName}}, {{abliteratedCount}} uncensored models are abliterated and {{fineTunedCount}} are fine-tuned.",
    },
    identify: {
      q: "How can I tell if an AI model is abliterated?",
      a: "Check the model card or release notes for a description of the method. In the {{appName}} catalog, the abliterated label is based on provider documentation.",
    },
    worse: {
      q: "Can abliteration affect model quality?",
      a: "Yes. It changes the weights, so it can affect accuracy, style, or other capabilities. Compare the specific variant with its base model on the same task.",
    },
    truly: {
      q: "Is {{ownName}} an abliterated model?",
      a: "{{ownName}} is listed separately because its developer describes a model trained on different material for a different perspective. The abliterated models here are variants of existing models edited to reduce refusals.",
    },
    free: {
      q: "Can I try uncensored models for free?",
      a: "Yes. {{guestCredits}} free credits a month without an account, {{freeCredits}} with a free account, {{maxCredits}} with the newsletter. Enough to run the ten-minute test on the cheaper uncensored models. The premium ones cost more per message.",
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
