export const translations = {
  meta: {
    title: "Build a skill. Share the link. Earn every month.",
    description:
      "{{appName}} skills are pre-configured AI setups you craft once and share anywhere. The share link positions you in the referral chain - earning 10% + 5% bonus from every payment that user ever makes.",
    category: "Skill Economy",
    imageAlt:
      "A person crafting AI skills and earning recurring income by sharing them",
    keywords:
      "AI skills, passive income, referral program, {{appName}}, custom AI, skill sharing, skill economy",
  },
  hero: {
    backToBlog: "Back to Blog",
    brand: "{{appName}} - ",
    icon: "✦",
    category: "Skill Economy",
    readTime: "7 min read",
    title: "Build a skill. Share the link. Earn every month.",
    subtitle:
      "Craft a pre-configured AI once. Share it anywhere. Earn 10% + 5% recurring from every payment the people who sign up through it ever make.",
    quote:
      '"I built a clinical reasoning skill for med students. Three months in, it\'s paying for my own subscription and then some."',
  },
  whatAreSkills: {
    title: "What are skills on {{appName}}?",
    p1: "A skill is a complete AI setup - system prompt, companion persona, model selection per modality, voice, image generation settings - configured once and reusable anywhere. Think of it as a recipe: you figure out the right ingredients once, then anyone can use it.",
    p2: "The platform has {{modelCount}} models: mainstream, open-source, uncensored. Each skill configures which model to use for conversation, which for vision, which for image generation, which voice to speak with. Most users will never need to touch those settings - they just use the skill. You, as the creator, figure it out once.",
    p3: "Skills are free to create. No paid subscription required. No coding. If you can describe what you want an AI to do, you can build a skill.",
    buildTitle: "Three ways to build a skill",
    build1Title: "Manually on the skill page",
    build1Body:
      "Full control. Configure every setting directly. Good if you know exactly what you want.",
    build2Title: "Ask Thea or Hermes in conversation",
    build2Body:
      "Describe what you're trying to build. Brainstorm with them - let them draft the system prompt, push back on your ideas, iterate. Best way to build something nuanced. They know the platform.",
    build3Title: "For developers: generate a skill.ts",
    build3Body:
      "Ask your agent to create a skill file. It outputs a skill.ts following the same structure as the built-in companion skills - ready to commit and use immediately.",
  },
  shareLink: {
    title: "The share link mechanic - how you actually earn",
    p1: "When you hit Share & Earn on any skill, you get a URL that does two things at once:",
    bullet1:
      "Shows visitors the skill - what it does, how it's configured, what kind of AI it is",
    bullet2:
      "Positions you in the referral chain - anyone who signs up through this link is attributed to you",
    p2: "Here's what that attribution means in practice: when someone signs up through your skill link, you become their direct referrer AND their skill creator. You earn 10% of every payment they ever make (direct referral commission) plus 5% additional (skill bonus) - 15% total from that one user, forever.",
    p3: "This is not a one-time reward. It's not a signup bonus. Every subscription renewal, every top-up, every purchase - you earn 15% of it. You did the work once.",
    p4: "The URL looks like: {{appName}}/track?ref=YOUR_CODE&url=/en/skill/SKILL_ID",
  },
  examples: {
    title: "Skills that people actually share - and earn from",
    p1: "The most successful skills solve a specific, recurring problem that's hard to explain without showing. Here are patterns that work:",
    example1Title: "The specialist companion",
    example1Body:
      "A med student builds a skill that talks to you like a senior clinical colleague - cases, differentials, reasoning under pressure. Shared in med school forums. Every signup from that community pays monthly.",
    example2Title: "The knowledge seller's real product",
    example2Body:
      "Coaches, consultants, course creators - they've been selling PDFs and Zoom calls. A well-crafted skill with their actual expertise earns recurring income without the overhead. This is better than a course.",
    example3Title: "The uncensored option",
    example3Body:
      "Skills using uncensored models for creative writing, roleplay, or debate. Shared in communities where mainstream AI censorship is a constant, daily frustration. High signup intent.",
    example4Title: "The developer's code reviewer",
    example4Body:
      "Knows your stack, enforces your team's conventions. Shared in engineering communities full of people spending $100–200/month on AI. High-value signups that stick.",
  },
  theMath: {
    title: "The math: 15% per user per month, forever",
    p1: "When someone signs up through your skill link and subscribes, you earn 15% of every payment they make - 10% direct referral + 5% skill bonus. Not just the first month. Every month, for as long as they're subscribed.",
    tableHeaderProfile: "User profile",
    tableHeaderSpend: "Monthly spend",
    tableHeaderEarn: "You earn/mo (via skill link)",
    row1Profile: "Casual user",
    row1Spend: "~$8/mo",
    row1Earn: "$1.20/mo",
    row2Profile: "Regular subscriber",
    row2Spend: "$20/mo",
    row2Earn: "$3.00/mo",
    row3Profile: "Heavy AI user",
    row3Spend: "$100/mo",
    row3Earn: "$15.00/mo",
    row4Profile: "Developer / power user",
    row4Spend: "$200+/mo",
    row4Earn: "$30.00+/mo",
    p2: "The skill is the hook. The link is the revenue. You earn whether someone uses your skill daily or switches to something else - the referral attribution stays with you regardless.",
    p3: "Share a skill in five places. Some percentage click through. Some percentage sign up. Those signups pay you 15% every month. Share another skill next month. Your earnings grow without proportionally more work.",
  },
  chain: {
    title: "You also earn when your users refer others",
    p1: "When users you referred go on to refer others, you earn a share of those payments too - up to 5 levels deep, each level halving:",
    level1: "Level 2 (your referrals' referrals): ~5% of every payment",
    level2: "Level 3: ~2.5% of every payment",
    level3: "Level 4: ~1.25% of every payment",
    level4: "Level 5: ~0.625% of every payment",
    p2: "Honest note: the chain bonuses get small fast. The 15% you earn from direct skill referrals is where almost all your income comes from. Treat chain earnings as a bonus - don't optimize for depth, optimize for quality shares.",
  },
  howTo: {
    title: "5 minutes to your first share link",
    step1Title: "Create or find a skill",
    step1Body:
      "Build one from scratch on the skill page, ask Thea or Hermes to help you draft it, or find a built-in skill worth sharing.",
    step2Title: "Open the skill",
    step2Body:
      "Click on the skill to see its details page. This is where you'll find the Share & Earn button.",
    step3Title: "Generate your share link",
    step3Body:
      "Click Share & Earn. If you have a referral code, select it. If not, create one in three seconds. Your link carries both your referral code and the skill ID - both commissions are tracked automatically.",
    step4Title: "Share where it matters",
    step4Body:
      "Post it in communities where people would actually use the skill - Discord servers, subreddits, forum threads, blog posts, Slack channels. Specific beats broad.",
    step5Title: "Watch the dashboard",
    step5Body:
      "Your referral dashboard shows visitors, signups, and earnings in real time. Every new signup through your link is 15% recurring revenue.",
  },
  close: {
    title: "The skill is the product. The link is the revenue.",
    p1: 'Most people think of referral programs as sharing a generic signup link. That works, but it\'s a hard sell. "Here\'s a link to an AI platform" goes nowhere. "Here\'s an AI that thinks like a senior clinician" is something people actually send.',
    p2: "Build what you'd want to use yourself. Make it specific. Then share the link. The 15% takes care of itself.",
    createSkill: "Create your first skill",
    referralPage: "Set up your referral code",
  },
};
