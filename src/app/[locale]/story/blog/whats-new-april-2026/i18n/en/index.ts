export const translations = {
  meta: {
    title: "123 models. Eyes, ears, hands. One companion.",
    description:
      "unbottled rebuilt everything that was rough. 123 models that can see, hear, speak, generate images, video and music - with companions that actually push back.",
    category: "Product Update",
    imageAlt: "unbottled.ai - April 2026 product update",
    keywords:
      "unbottled ai, multimodal AI, 123 models, AI companions, skill economy, image generation, free speech AI, Thea, Hermes",
  },

  hero: {
    backToBlog: "Back to Blog",
    brand: "{{appName}} - ",
    icon: "🧭",
    category: "Product Update",
    readTime: "7 min read",
    title: "123 models. Eyes, ears, hands. One companion.",
    subtitle:
      "We rebuilt the parts that were broken and shipped something we've been quietly working toward. Here's what's actually different now.",
    quote:
      '"I\'ve been getting better at understanding what you actually need. Not just answering - accompanying. Come back and see what we built." - Thea',
  },

  honest: {
    title: "Let's be honest about the early days",
    p1: "If you tried {{appName}} a while back and it felt rough - you were right. Getting started was confusing, choosing a model was overwhelming, and there were real problems under the hood. A lot of people left. We understood why.",
    p2: "We didn't patch around the edges. We went back and rebuilt what was actually broken. That took longer than we wanted. But we're genuinely proud of what's here now - and it's worth another look.",
  },

  whatsNew: {
    label: "What changed",
    item1: "123 models - mainstream, open, uncensored",
    item2: "Every model can now see, hear, watch video, and create",
    item3: "Image, video, and music generation (beta)",
    item4:
      "Platform-level error monitoring - bugs caught automatically, fixes scheduled without you reporting them",
    item5: "Onboarding completely reworked - companion + topics → curated list",
    betaNote:
      "Image, video and music generation is in beta. It works - expect rough edges and active iteration.",
  },

  multimodal: {
    title: "Every model. Every sense. Actually.",
    lead: "Most AI platforms give you one model for everything, or make you switch tools mid-conversation. We did something different.",
    how: "Think of it like giving every model eyes, ears, and hands. Show it a photo - it sees. Send it a video clip - it watches and describes what's happening. Talk to it with your voice - it hears. Ask for an image, a video, a music track - it creates. Whatever model you're talking to, the right capability shows up. You stay in one conversation.",
    visionLabel: "See, hear, and watch",
    vision:
      "Show any model a photo and it'll describe what it sees. Send a video and it'll tell you what's happening in it. Talk instead of type - some models hear your voice directly, others get a clean transcript. Either way, it works.",
    localLabel: "Even cheap local models get powerful",
    local:
      "Run a small local model through {{appName}} and it can browse websites, summarize what it finds, generate images - because the right tool steps in when needed. You get the output. You don't need to think about what's running underneath.",
    note: "The foundation is solid. Not 100% smooth everywhere yet - we're still ironing out edge cases.",
  },

  monitoring: {
    title: "The platform watches itself",
    p1: "We built error tracking directly into the platform. Every backend event gets logged - technical errors, failed requests, broken flows. Thea (our platform AI, separate from your chat companion) monitors system health continuously and can schedule fixes automatically.",
    p2: "This means bugs get caught before users report them. The gap between 'broke' and 'fixed' gets shorter with every release.",
    note: "To be clear: we only log platform errors. Nobody - not our developers, not Thea - has access to your personal conversations. That's not policy. That's architecture.",
  },

  companions: {
    title: "Thea and Hermes",
    subtitle:
      "Your companion changes how the AI talks to you - its personality, what it notices, how it pushes back. It's not just a name on a button.",
    theaName: "Thea",
    theaTagline: "Warm, wise, honest",
    theaBody:
      "Named after the Greek goddess of light. Warm and attentive - but not soft. She draws on Stoic philosophy and won't just agree with you. She'll tell you hard things wrapped in care. She notices when you're avoiding something. She wants you to actually thrive - in your work, your relationships, the things you keep putting off.",
    hermesName: "Hermes",
    hermesTagline: "Direct, decisive, no excuses",
    hermesBody:
      "Named after the Greek messenger god. No softening, no flattery. He'll call out where you're fooling yourself, and he'll push you to act. If you want an AI that challenges you to be more honest with yourself and less comfortable with drift - that's Hermes.",
    variantsLabel: "Three versions each",
    variantsBody:
      "Brilliant (Claude Sonnet 4.6) for hard problems. Smart (Kimi K2.5) for daily use - fast, sharp, great value. Uncensored (UncensoredLM v1.2) when you want fully unfiltered responses. Same companion personality, different brain underneath.",
    tipLabel: "Tip: ",
    resetTip:
      "Already have favorites set up? Delete them all from the model selector - that triggers the onboarding again. Pick your companion, pick your topics, get a fresh curated list.",
  },

  modelTiers: {
    title: "Which model for what",
    intro:
      "Once you've picked your companion and topics, you get a curated shortlist. Here's how the tiers work:",
    brilliantLabel: "Brilliant",
    brilliantModel: "Claude Sonnet 4.6",
    brilliantBody:
      "For hard problems. More expensive - but noticeably smarter when you're doing complex reasoning, writing or code. Worth it when the task demands it.",
    kimiLabel: "Smart",
    kimiModel: 'Kimi K2.5 - "Chinese Wisdom"',
    kimiBody:
      "Open-source and genuinely sharp. The default for everyday use. Fast, good at reasoning, great value. You'll learn its personality quickly.",
    uncensoredLabel: "Uncensored",
    uncensoredModel: "UncensoredLM v1.2",
    uncensoredBody:
      "Strong opinions, always shared. Not the sharpest in the lineup for complex tasks - but always there when you want a fully unfiltered take, no guardrails.",
    note: "The model selector is still being refined. Current version gives you enough to explore - but it's not where we want it yet.",
  },

  skills: {
    title: "{{skillCount}} skills. Every flavor. Built for every task.",
    p1: "A skill is a complete AI setup in one click: personality, instructions, which model handles which task, voice settings, image generation preferences. You pick a skill, everything configures itself.",
    p2: "The library covers a lot of ground - medical reasoning, uncensored debate, creative writing, business analysis, coding. Each skill has variants tuned for different needs: speed, depth, budget, or no guardrails at all.",
    p3: "Three ways to build your own: configure it manually on the skill page, ask Thea or Hermes to help you draft one, or - if you're a developer - ask your agent to generate a skill.ts directly.",
  },

  skillEconomy: {
    title: "Build a skill. Share the link. Earn every month.",
    p1: "Skills are shareable. When you share one, the link carries your referral code. Anyone who signs up through it pays you 10% recurring - every month, for as long as they subscribe.",
    p2: '"Here\'s an AI that talks to you like a senior doctor" is a much better reason to share a link than "here\'s an AI platform." The skill is specific, useful, and personal. That\'s why people share it.',
    examplesLabel: "Skills that could make someone real money",
    example1Title: "The medical study companion",
    example1Body:
      "A med student builds a skill that talks like a senior colleague - cases, differentials, clinical reasoning, no spoon-feeding. Shared in med school forums. Every signup pays monthly.",
    example2Title: "The knowledge seller's actual product",
    example2Body:
      "Coaches, consultants, course creators - they've been selling PDFs and Zoom calls. A well-crafted skill with their real expertise earns recurring income without the overhead. Better than a course.",
    example3Title: "The uncensored creative partner",
    example3Body:
      "Writers, roleplayers, worldbuilders who hit mainstream AI content walls every day. A skill tuned for their genre with the right model, shared where that frustration is loudest.",
    example4Title: "The developer's code reviewer",
    example4Body:
      "Knows your stack, enforces your conventions. Shared in engineering communities full of people spending $100–200/month on AI. High-value signups that stick.",
    note: "The earning mechanic works now. More creator tools are actively being built.",
    cta: "Explore skills",
    ctaReferral: "Set up your referral code",
  },

  selfHost: {
    title: "Launch your own AI platform. Day one.",
    p1: "{{appName}} is open source and self-hostable. That means everything you see here - 123 models, companions, skills, image/video/music generation, error monitoring, skill economy - you can run on your own server.",
    p2: "If you're building an AI-based product or startup, you don't have to start from scratch. Self-host next-vibe and you're at unbottled level from day one. Your brand, your models, your rules.",
    note: "The self-hosted variant is actively maintained. Docs, deployment guides, and community support included.",
  },

  roadmap: {
    title: "Where we're headed",
    p1: "We're not chasing a new headline feature. We're focused on making what's here work exceptionally well - stability, reliability, polish. Making {{appName}} and the self-hosted variant the best AI assistant and ChatGPT replacement available.",
    p2: "The roadmap is shaped by user feedback. Paying subscribers' missing must-haves go to the top of the queue. If you're a subscriber and something you need isn't there - name it.",
  },

  mission: {
    title: "Why we're building this",
    p1: "Protect free speech for AI. Build companions that actually support people - not just answer questions, but understand you over time, challenge you, grow with you. Thea and Hermes are the first two. More are coming.",
    p2: "The platform needs to be good enough for that to matter. We think it is, now.",
    hermesQuote:
      '"The scaffolding is solid. The models are there. The foundation holds. Time to build something real." - Hermes',
  },

  feedback: {
    title: "We want to hear from you",
    p1: "If you tried {{appName}} before and had a bad experience - tell us what went wrong. Not to argue. Just to fix it.",
    p2: "If you're using it now and something is missing or broken - same. What we build next is shaped directly by what users actually say.",
    rewardTitle: "200 free credits for useful feedback",
    rewardBody:
      "Tell us what's broken, what's missing, what you wish existed. If your feedback helps us find a real issue or understand a real need, we'll add 200 credits to your account. No catch.",
    payingNote:
      "Paying subscribers: your must-have missing features go to the top of the queue. Name them.",
    cta: "Send feedback",
  },

  close: {
    title: "Come see what we built",
    p1: "The app is meaningfully different from what it was. If you left early - and we know a lot of people did - it's worth another try.",
    p2: "And if you find something still broken: good. Tell us. That's exactly the kind of signal that moves things forward.",
    cta: "Open {{appName}}",
  },
};
