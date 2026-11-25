export const translations = {
  meta: {
    title: "You built something with AI. Now earn from sharing it.",
    description:
      "For developers: your READMEs, blog posts and tutorials already carry referral potential. Here's the math, plus the skill bonus when others share your skill.",
    category: "Affiliate Program",
    imageAlt: "A developer's terminal with earnings stats alongside code",
    keywords:
      "developer referral program, AI affiliate, passive income developer, open source monetization",
  },
  hero: {
    backToBlog: "Back to Blog",
    category: "For Developers",
    readTime: "5 min read",
    title: "You built something with AI. Now earn from sharing it.",
    subtitle:
      "You're already shipping with AI. Your referral link is a revenue stream you haven't turned on yet.",
  },
  useCase: {
    title: "Where developers naturally refer people",
    p1: "You're already creating content that leads people to tools. A blog post about your workflow. A README that mentions the AI you used. A YouTube tutorial. A Discord answer where you recommend a platform. These all have referral potential that most developers leave untapped.",
    p2: "Anywhere you'd naturally mention {{appName}}, add your referral link. People who click and subscribe earn you 10% of every payment they make: every month, forever. You don't change what you're saying. You just add the link.",
    examples: [
      'GitHub README: "I built this with {{appName}}\'s API. Try it: [your link]"',
      'Blog post footer: "Tools I use: ...{{appName}} for AI access [ref link]"',
      "Discord/Slack: \"I've been using {{appName}}. Here's my referral if you want in\"",
      'YouTube description: "AI tools used in this video: {{appName}} [referral link]"',
    ],
  },
  skillAngle: {
    title: "Publish a skill: earn when others share it",
    p1: "Every skill you publish has a shareable link. Share it yourself and you earn the standard 10% direct. When another member shares it with their own link, you still earn 5% of every payment from those users, forever.",
    p2: "Here's what most people miss: you earn the 5% as the skill creator even when someone else shares your skill. A user finds your skill in the directory, shares the link with a friend: that friend signs up, you get 5% of their payments. Automatically. The platform tracks skill authorship, not who shared the link. Your skill works for you even when you're not the one promoting it.",
    p3: "Embed your skill link in a GitHub README. Post it in a developer Discord. Every person who signs up through it pays you 10%. Every person someone else brings to your skill pays you 5%. Same skill, two income paths.",
  },
  math: {
    title: "The math (actual numbers)",
    subtitle: "Your link (10%) vs. your skill shared by others (5%)",
    tableHeaderProfile: "User profile",
    tableHeaderSpend: "Monthly spend",
    tableHeaderDirect: "Direct only (10%)",
    tableHeaderSkill: "Others share your skill (5%)",
    rows: [
      {
        profile: "Starter subscriber",
        spend: "{{planPrice}}/mo",
        direct: "{{planEarn}}/mo",
        skill: "{{planSkillEarn}}/mo",
      },
      {
        profile: "Starter + 1 credit pack",
        spend: "{{plusPackSpend}}/mo",
        direct: "{{plusPackEarn}}/mo",
        skill: "{{plusPackSkillEarn}}/mo",
      },
      {
        profile: "Heavy user: Starter + {{heavyPacks}} packs",
        spend: "{{heavySpend}}/mo",
        direct: "{{heavyEarn}}/mo",
        skill: "{{heavySkillEarn}}/mo",
      },
      {
        profile: "Power user: Starter + {{powerPacks}} packs",
        spend: "{{powerSpend}}/mo",
        direct: "{{powerEarn}}/mo",
        skill: "{{powerSkillEarn}}/mo",
      },
    ],
    note: "One power user through your link earns you {{powerEarn}}/mo. That's {{powerVsPlan}} plan subscribers in one. Developers already pay for AI tools. They convert fast and rarely churn.",
    growthNote:
      "As {{appName}} adds models and capabilities, ARPU trends up. Referrals you make today earn you more next year without any extra work.",
  },
  chain: {
    title: "The chain: what happens when your referrals refer others",
    p1: "When the people you refer go on to refer others, you earn a share of those payments too. Here's the exact breakdown:",
    level0: "You → direct referral: 10% of every payment, forever",
    level1:
      "Their referrals (level 2): ~5% of every payment (half of the upline pool, which is 10% total)",
    level2: "Level 3: ~2.5% of every payment",
    level3: "Level 4: ~1.25% of every payment",
    level4: "Level 5: ~0.625% of every payment",
    total:
      "Maximum total payout across all earners: ~20% of any single payment",
    p2: "Honest note: the chain bonuses get small fast. The 10% direct + 5% skill is where the real income is. If you build in public and your referrals are themselves developers, the chain adds up, but don't optimize for depth. Optimize for quality direct referrals.",
  },
  crypto: {
    title: "Payout in crypto: no bank account needed",
    p1: "Earnings pay out in BTC or USDC. Processed within 48 hours after approval. Minimum payout is {{minPayout}}: about {{payoutPowerMonths}} months from one power user, or {{payoutPlanMonths}} subscriber-months on Starter.",
    p2: "Or convert earnings instantly to platform credits. If you're using {{appName}} yourself, your referral income offsets your own usage costs.",
  },
  close: {
    title: "Turn on the stream",
    p1: "You're already building, writing, and talking about AI tools. Adding a referral link costs nothing and takes five minutes. Publish a skill too, and you also earn when other people share it.",
    p2: "Recurring commissions, rising revenue per user, and referrals between developers compound as you build in public.",
    createCode: "Create your referral code",
    joinDiscord: "Join the Discord",
  },
};
