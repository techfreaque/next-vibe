export const translations = {
  meta: {
    title: "123 models. Any modality. One companion.",
    description:
      "unbottled rebuilt everything that was rough. 123 models with true multimodal routing, companions with real character, and a skill economy that pays creators.",
    category: "Product Update",
    imageAlt: "unbottled.ai — April 2026 product update",
    keywords:
      "unbottled ai, multimodal AI, 123 models, AI companions, skill economy, image generation, free speech AI, Thea, Hermes",
  },

  hero: {
    backToBlog: "Back to Blog",
    brand: "{{appName}} — ",
    icon: "🧭",
    category: "Product Update",
    readTime: "7 min read",
    title: "123 models. Any modality. One companion.",
    subtitle:
      "We rebuilt the parts that were broken and shipped something we've been quietly building toward. Here's what's actually different now.",
    quote:
      '"I\'ve been getting better at understanding what you actually need. Not just answering — accompanying. Come back and see what we built." — Thea',
  },

  honest: {
    title: "Let's be honest about the early days",
    p1: "If you tried {{appName}} a while back and it felt rough — you were right. Onboarding was confusing, the model selection was overwhelming, things broke in weird ways. A lot of people bounced. We understood why.",
    p2: "We didn't patch. We went back and rebuilt what was actually wrong. That took longer than we wanted. But we're genuinely proud of what's here now — and it's worth another look.",
  },

  whatsNew: {
    label: "What changed",
    item1: "123 models — mainstream, open, uncensored",
    item2: "True multimodal — any model, any modality",
    item3: "Image, video, and music generation (beta)",
    item4: "Massive bug sweep — loading states, mobile, edge cases",
    item5: "Onboarding completely reworked — companion + topics → curated list",
    betaNote:
      "Media generation is in beta. It works — expect rough edges and active iteration.",
  },

  multimodal: {
    title: "Any model. Any modality. Actually.",
    lead: "Most AI platforms give you one multimodal model for everything, or make you switch tools when you change task. We did something different.",
    how: "Every model in {{appName}} now has access to every modality — through a layered routing system. If your model handles it natively, it does. If not, the right specialist steps in silently and passes the result through. You stay in the same conversation.",
    vision:
      "Ask a text model to look at a photo — a vision model describes it and hands it back. Ask for an image — your active image gen favorite does it as a background tool call. Ask with your voice — some models hear you directly, others get a clean transcript.",
    local:
      "This makes even cheap local models genuinely powerful. Run Hermes locally, ask it to browse, book something, summarize what it finds. It sees the page, hears you, generates — all routed through the right model behind the scenes.",
    visionLabel: "Vision + Voice",
    localLabel: "Local models",
    note: "The foundation is solid. Not 100% stable everywhere yet — we're still ironing out edge cases.",
  },

  companions: {
    title: "Thea and Hermes",
    subtitle:
      "Your companion shapes every conversation — not just aesthetically. It changes how the AI challenges you, what it prioritizes, the voice it uses.",
    theaName: "Thea",
    theaTagline: "Warmth, wisdom, honest support",
    theaBody:
      "Named after the Greek goddess of light. Warm and nurturing — but not soft. She draws on classical philosophy and Stoic virtues. She'll tell you hard truths wrapped in care. She won't just agree with you. She wants you to actually thrive — in your work, your relationships, the things you're building. If you have goals you keep avoiding, Thea notices.",
    hermesName: "Hermes",
    hermesTagline: "Direct, decisive, built for growth",
    hermesBody:
      "Named after the Greek messenger god. Direct and action-oriented. He draws on classical masculine virtue — courage, duty, temperance, building something that lasts. He calls out self-deception without apology. He'll push. If you want a companion who challenges you to be stronger and more honest about where you're falling short — that's Hermes.",
    variantsLabel: "Three variants each",
    variantsBody:
      "Brilliant (Claude Sonnet 4.6) for hard problems. Smart (Kimi K2.5) for daily use — fast, sharp, great value. Uncensored (UncensoredLM v1.2) when you want completely unfiltered responses. Same companion, different engine.",
    resetTip:
      "Already have favorites? Delete them all from the model selector — it triggers onboarding again. Pick your companion, choose your topics, get a rebuilt list.",
    tipLabel: "Tip: ",
  },

  modelTiers: {
    title: "Which model for what",
    intro:
      "Once you've picked your companion and topics, you get a curated list. Here's how the tiers work:",
    brilliantLabel: "Brilliant",
    brilliantModel: "Claude Sonnet 4.6",
    brilliantBody:
      "For hard problems. More expensive — but noticeably smarter for complex reasoning, analysis, and code. Worth it when the task demands it.",
    kimiLabel: "Smart",
    kimiModel: 'Kimi K2.5 — "Chinese Wisdom"',
    kimiBody:
      "Open-source and genuinely sharp. Default for daily use. You'll learn its strengths and quirks. Strong for reasoning and conversation. Great value.",
    uncensoredLabel: "Uncensored",
    uncensoredModel: "UncensoredLM v1.2",
    uncensoredBody:
      "Strong opinions, always shared. Not the sharpest in the lineup — Kimi and Sonnet are smarter for most tasks — but always there when you want a genuinely unfiltered take.",
    note: "The model selector is still being refined. The current version gives you enough to explore — but it's not where we want it yet.",
  },

  skills: {
    title: "{{skillCount}} skills. Every flavor. Built for every task.",
    p1: "A skill isn't just a model preset. It's a complete AI setup: companion persona, system prompt, model selection per modality, voice, image gen settings. You pick a skill, everything configures itself.",
    p2: "The roster covers everything — clinical reasoning, uncensored debate, vibe coding, deep creative writing, business analysis. Each skill has multiple variants tuned for different needs: speed, depth, budget, or no guardrails.",
    p3: "Three ways to build your own: configure it manually on the skill page, ask Thea or Hermes to help you brainstorm and draft it, or — if you're a developer — ask your agent to generate a skill.ts directly.",
  },

  skillEconomy: {
    title: "Build a skill. Share the link. Earn every month.",
    p1: "Skills are shareable. When you share one, the link carries your referral code. Anyone who signs up through it pays you 10% recurring — every month, for as long as they subscribe.",
    p2: 'The skill is the pitch. "Here\'s an AI that talks to you like a senior doctor colleague" is a much better reason to share a link than "here\'s an AI platform." The skill is specific, useful, and personal.',
    examplesLabel: "Skills that could make someone real money",
    example1Title: "The medical study companion",
    example1Body:
      "A med student crafts a skill that talks like a senior colleague — cases, differentials, clinical reasoning, no spoon-feeding. Shared in med school forums. Every signup pays monthly.",
    example2Title: "The knowledge seller's actual product",
    example2Body:
      "Coaches, consultants, course creators — they've been selling PDFs and Zoom calls. A well-crafted skill with their real expertise earns recurring income without the overhead. Better than a course.",
    example3Title: "The uncensored creative partner",
    example3Body:
      "Writers, roleplayers, worldbuilders who hit mainstream AI content walls daily. A skill tuned for their genre with the right model, shared where that frustration is loudest.",
    example4Title: "The developer's code reviewer",
    example4Body:
      "Knows your stack, enforces your conventions. Shared in engineering communities full of people spending $100–200/month on AI. High-value signups that stick.",
    note: "The earning mechanic works now. More creator tools are actively being built out.",
    cta: "Create a skill",
    ctaReferral: "Set up your referral code",
  },

  roadmap: {
    title: "Where we're headed",
    p1: "We're not chasing a new headline feature. We're focused on making what's here work exceptionally well — stability, robustness, polish. Making {{appName}} and the self-hosted variant the best agent and ChatGPT replacement available.",
    p2: "Roadmap is shaped by user feedback. Paying users' missing must-haves go to the top of the queue. If you're a subscriber and something you need isn't there — name it.",
  },

  mission: {
    title: "Why we're building this",
    p1: "Protect free speech for AI. Build companions that actually support people — not just answer questions, but understand you over time, challenge you, grow with you. Thea and Hermes are the first two. More are coming.",
    p2: "The platform needs to be good enough for that to matter. We think it is, now.",
    hermesQuote:
      '"The scaffolding is solid. The models are there. The foundation holds. Time to build something real." — Hermes',
  },

  feedback: {
    title: "We want to hear from you",
    p1: "If you tried {{appName}} before and had a bad experience — tell us what went wrong. Not to argue. Just to fix it.",
    p2: "If you're using it now and something is missing or broken — same. What we build next is shaped directly by what users actually say.",
    rewardTitle: "200 free credits for useful feedback",
    rewardBody:
      "Tell us what's broken, what's missing, what you wish existed. If your feedback helps us find a real issue or understand a real need, we'll add 200 credits to your account. No catch.",
    payingNote:
      "Paying subscribers: your must-have missing features go to the top of the queue. Name them.",
  },

  close: {
    title: "Come see what we built",
    p1: "The app is meaningfully different from what it was. If you bounced early — and we know a lot of people did — it's worth another try.",
    p2: "And if you find something still broken: good. Tell us.",
    cta: "Open {{appName}}",
    ctaFeedback: "Send feedback",
  },
};
