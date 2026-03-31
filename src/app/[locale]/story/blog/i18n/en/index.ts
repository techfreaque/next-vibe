export const translations = {
  page: {
    title: "The Build Log",
    subtitle:
      "How unbottled.ai and next-vibe got built. The architecture decisions, the dead ends, the things that turned out to matter.",
    meta: {
      title: "Build Log - next-vibe & unbottled.ai",
      description:
        "Engineering deep dives into the decisions behind next-vibe and unbottled.ai. Unified surfaces, TypeScript enforcement, Vibe Sense, and the story of building both.",
      category: "Blog",
      imageAlt: "next-vibe & unbottled.ai Build Log",
      keywords:
        "next-vibe, unbottled.ai, blog, TypeScript, architecture, SaaS, AI, open-source, engineering",
    },
  },
  posts: {
    oneCodebase: {
      title: "One codebase. 13 platforms. Zero compromises.",
      category: "Architecture",
      excerpt:
        "One endpoint definition. Web form, CLI command, MCP tool, native screen, cron job - simultaneously. Here's how it works.",
      readTime: "12 min read",
    },
    typeChecker: {
      title: "I built a type checker that made AI stop lying to me",
      category: "TypeScript",
      excerpt:
        "AI will use `any` to escape a type error. It will add eslint-disable. It will lie to you. Here's how we fixed the feedback loop.",
      readTime: "10 min read",
    },
    tradingBot: {
      title: "My dead trading bot became a platform monitoring engine",
      category: "Vibe Sense",
      excerpt:
        "I abandoned a trading bot. Years later its architecture became the most interesting part of next-vibe. The pipeline is just endpoints.",
      readTime: "14 min read",
    },
    fired: {
      title: "I got fired. This is what I built instead.",
      category: "VibeFrame",
      excerpt:
        "A federated widget engine I built at a job I no longer have. Now any next-vibe endpoint is embeddable anywhere in two script tags.",
      readTime: "11 min read",
    },
    hackernews: {
      title: "Show HN: next-vibe",
      category: "Community",
      excerpt:
        "The post we're writing for Hacker News. TypeScript supremacy, unified surfaces, and a trading bot that can't trade.",
      readTime: "5 min read",
    },
    referralBeginners: {
      title:
        "I've never done affiliate marketing. Can I actually earn money here?",
      category: "Referrals",
      excerpt:
        "Honest answer: yes, with realistic expectations. Here's how the recurring commission model works if you've never referred anyone before.",
      readTime: "6 min read",
    },
    referralAffiliatePros: {
      title:
        "I'm an affiliate marketer. What's different about AI subscriptions?",
      category: "Referrals",
      excerpt:
        "The floor is higher and it rises over time. Monthly recurring commissions from AI subscribers who spend more as the platform grows.",
      readTime: "7 min read",
    },
    referralDevelopers: {
      title: "You built something with AI. Now earn from sharing it.",
      category: "Referrals",
      excerpt:
        "Your referral link is a revenue stream you haven't turned on yet. Blog posts, READMEs, tutorials - the math for technical audiences.",
      readTime: "5 min read",
    },
  },
  labels: {
    readMore: "Read more",
    allPosts: "All posts",
    featured: "Featured",
    new: "New",
    draft: "Draft",
    referralSection: "Referral Program",
  },
  ui: {
    heroTagline: "next-vibe · unbottled.ai",
    featuredFileBar:
      "definition.ts → web · cli · mcp · native · cron · 10 more",
    hnSiteName: "Hacker News",
    hnNav: "new · past · comments · ask · show · jobs · submit",
    hnPoints: "points:",
    hnComments: "comments:",
    hnAuthor: "author:",
    hnTags: "> next-vibe · TypeScript · OSS · SaaS · AI",
    hnDraftPoints: "— (not submitted)",
    hnDraftComments: "— (not submitted)",
    hnDraftStatus: "draft",
    vibeFrameEmbedCaption: "Any endpoint. Two script tags. On any site.",
  },
};
