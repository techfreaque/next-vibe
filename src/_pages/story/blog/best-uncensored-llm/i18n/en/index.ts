export const translations = {
  meta: {
    title:
      "Best Uncensored LLM (2026): Picked by Job, Priced Live | {{appName}}",
    description:
      "The best uncensored LLM for reasoning, everyday chat, coding, dark fiction, contrary views and images. GLM 5.3 Uncensored vs DeepSeek V4.1 Flash Uncensored, with live context and prices.",
    category: "Model Guide",
    imageAlt: "The best uncensored LLMs, ranked by job",
    keywords:
      "best uncensored LLM, best uncensored AI model, best abliterated model, uncensored LLM 2026, GLM uncensored vs DeepSeek uncensored, GLM 5.3 uncensored, DeepSeek V4.1 Flash uncensored, best uncensored model for roleplay, best uncensored model for coding, uncensored LLM ranking, {{appName}}",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "Model Guide",
    readTime: "8 min read",
    title: "The best uncensored LLM. Picked by job, not by hype.",
    subtitle:
      "One winner per job across {{count}} live uncensored models, plus the GLM vs DeepSeek head-to-head. Context and price read live from our model registry.",
  },
  intro: {
    lead: 'Every "best uncensored LLM" list crowns one model. Then you try it on your work and it is the wrong one. A model that writes dark fiction well is not the one you want for code. The cheapest one is not the one you want for a hard argument.',
    p2: "So this list names a winner per job. Every pick runs on {{appName}} in a browser tab, every number comes from our registry, and you can switch between them in the same chat.",
  },
  method: {
    title: "How we picked",
    intro: "Four questions per model. No invented benchmark scores.",
    answers:
      "Does it answer? Every model here sits in the uncensored tier: it takes the question instead of lecturing you.",
    base: "How strong is the base? Abliterated flagships keep their lab's intelligence. Small fine-tunes trade some of it for style.",
    context:
      "How much does it remember? Context decides whether it holds a long document or forgets page one.",
    price:
      "What does it cost? Price per reference message, cheapest public route, markup included.",
    callout:
      "Want proof that a model answers? Our refusal index puts the same questions to every model and counts who refuses.",
    refusalLink: "The refusal index: which AI actually answers",
  },
  picks: {
    title: "The winners, job by job",
    intro:
      "One model per job, no model twice. If a pick goes offline, the next model with the same strength takes its place.",
    facts:
      "{{context}} context. {{price}} per message. Good at: {{strengths}}.",
    reasoning: {
      title: "{{number}}. Best for reasoning and analysis: {{model}}",
      body: "A flagship base model with the refusals removed. Use it when the answer needs real thinking: a contested question argued through, a long document taken apart, a plan stress-tested.",
    },
    everyday: {
      title: "{{number}}. Best everyday model: {{model}}",
      body: "Fast, cheap and with a huge memory. The model to leave selected for normal questions, quick drafts and long chats that would cost too much on a flagship.",
    },
    coding: {
      title: "{{number}}. Best for coding: {{model}}",
      body: "Tagged for coding and reasoning, without the refusals that block security research, scraping or reverse engineering questions mainstream assistants dodge.",
    },
    fiction: {
      title: "{{number}}. Best for roleplay and dark fiction: {{model}}",
      body: "Tuned for roleplay, including dark roleplay. Stays in character, writes the violent or explicit scene, and does not break the story to moralize.",
    },
    viewpoint: {
      title: "{{number}}. Best for contrary views: {{model}}",
      body: "The only pick here that is not a mainstream model unlocked. Trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions. Ask it what the others will not say, and check its facts.",
    },
    vision: {
      title: "{{number}}. Best for images: {{model}}",
      body: "Reads the images you upload and answers about them without the usual refusals. Cheap enough to run on every screenshot.",
    },
  },
  versus: {
    title: "{{a}} vs {{b}}",
    intro:
      "The two abliterated flagships people compare most. Same idea, refusals removed, different strengths.",
    glm: "{{model}}: the abliterated build of GLM-5.3. Pick it when the answer needs depth: reasoning, analysis, code.",
    deepseek:
      "{{model}}: the abliterated build of DeepSeek V4.1 Flash. A Flash model: cheaper per message, quick, also tagged for roleplay. Pick it for volume.",
    verdict:
      "Short version: thinking work goes to GLM, volume and roleplay go to DeepSeek. Both answer. Switch mid-chat and compare on your own question.",
    compareLink: "Full comparison: {{a}} vs {{b}}",
  },
  all: {
    title: "All {{count}} uncensored models, cheapest first",
    intro:
      "The whole uncensored tier on {{appName}} right now. Click a model for its page, or start a chat with it.",
    footnote:
      "Per message means one reference exchange on the cheapest route. Long chats and long answers cost more. Strengths are registry tags.",
  },
  table: {
    model: "Model",
    context: "Context",
    strengths: "Good at",
    price: "Per message",
    chat: "Try it",
    chatLink: "Chat with {{model}}",
  },
  kinds: {
    title: "Two kinds of uncensored. Know which one you pick.",
    intro: "The label hides a real difference.",
    abliterated:
      "Abliterated and fine-tuned builds: mainstream or open models slightly changed so they stop dodging questions. Same training, same worldview. They just answer.",
    own: "{{ownModel}}: trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
    explainerLink: "What abliteration is and how it differs from other methods",
    tourLink: "Every uncensored model, one by one",
  },
  local: {
    title: "Local or hosted?",
    intro:
      "Most best-of lists assume you run the model yourself. That is one option.",
    local:
      "Local: full privacy and no per-message price, but the big models need more GPU memory than any home PC has.",
    hosted:
      "Hosted: every model on this page, in a browser, including the frontier-size ones. The provider sees your prompt.",
    api: "API: the same models over OpenAI and Anthropic compatible endpoints. API keys unlock with any purchase.",
    noGpuLink: "Run an uncensored LLM online, no GPU",
    apiLink: "Uncensored LLM API: model ids, prices, code",
  },
  pairs: {
    title: "More head-to-heads",
    intro:
      "Own worldview against abliterated, and base models against their uncensored builds.",
    link: "{{a}} vs {{b}}",
  },
  faq: {
    title: "FAQ",
    best: {
      q: "What is the best uncensored LLM overall?",
      a: "For most hard questions, {{topModel}}: a flagship base model with the refusals removed. For contrary views, {{ownModel}}. For cheap volume, a Flash build. On {{appName}} you can switch between all {{count}} in the same chat.",
    },
    free: {
      q: "What is the best free uncensored LLM?",
      a: "Online, {{appName}} gives you {{guestCredits}} free credits a month without an account and {{freeCredits}} with a free account. The cheapest uncensored model, {{cheapestModel}}, costs {{cheapestPrice}} per message. Uncensored models ask for a one-time 18+ confirmation.",
    },
    roleplay: {
      q: "What is the best uncensored model for roleplay?",
      a: "A model tuned for dark roleplay: it stays in character and writes the hard scenes. For political or taboo characters, {{ownModel}} brings a worldview the mainstream models do not have.",
    },
    coding: {
      q: "What is the best uncensored model for coding?",
      a: "An abliterated build of a strong coding model. It keeps the base model's skill and drops the refusals that block security research and other questions mainstream assistants dodge.",
    },
    quality: {
      q: "Do abliterated models lose quality?",
      a: "A little, depending on the method. Abliteration removes the refusal direction from the weights. Done well, the model keeps nearly all of its skill. Small fine-tunes can lose more. Compare a base model and its uncensored build side by side before you decide.",
    },
    api: {
      q: "Can I use these uncensored models over an API?",
      a: "Yes. Every text model here works over OpenAI and Anthropic compatible endpoints. API keys unlock with any purchase.",
    },
    writerLink: "The best uncensored AI for fiction writers",
    directoryLink: "All abliterated models, hosted",
    platformsLink: "Uncensored AI platforms compared",
  },
  cta: {
    title: "Stop reading rankings. Ask the real question.",
    subtitle:
      "{{guestCredits}} free credits a month, no account needed. Start with the winner, switch any time.",
    start: "Chat with {{topModel}}",
    models: "Compare all models",
  },
};
