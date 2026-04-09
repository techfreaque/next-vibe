export const translations = {
  meta: {
    title: "Build a skill. Share the link. Earn every month.",
    description:
      "{{appName}} skills are pre-configured AI setups you craft once and share anywhere. The referral link in the share URL earns you 10% recurring from every signup. Here's how.",
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
      "Craft a pre-configured AI once. Share it anywhere. Earn 10% recurring from every signup that comes through your link.",
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
    title: "The share link mechanic",
    p1: "Every skill has a shareable landing page. When you hit Share & Earn on any skill, you get a URL that does two things at once:",
    bullet1:
      "Shows visitors the skill - what it does, how it's configured, what kind of AI it is",
    bullet2:
      "Tracks your referral - anyone who signs up through this link is attributed to you",
    p2: "The URL looks like: {{appName}}/track?ref=YOUR_CODE&url=/en/skill/SKILL_ID",
    p3: "Visitors land on a clean skill page. One click to add it to their favorites. If they don't have an account, they sign up first - and that signup is attributed to you. Every payment they ever make, you earn 10% of.",
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
    title: "The math: 10% recurring, every month",
    p1: "When someone signs up through your skill link and subscribes, you earn 10% of every payment they make. Not just the first month - every month, for as long as they're subscribed.",
    scenario1Label: "Casual user",
    scenario1Spend: "Spends ~$8/mo",
    scenario1Earn: "You earn $0.80/mo",
    scenario2Label: "Developer / power user",
    scenario2Spend: "Spends $150–200/mo",
    scenario2Earn: "You earn $15–20/mo",
    p2: "The skill isn't what makes the money - the referral embedded in the share URL does. You earn whether someone uses your skill daily or switches to something else. The skill is the hook. The link is the revenue.",
    p3: "And it compounds. Share a skill in five places. Some percentage click through. Some percentage sign up. Those signups pay you every month. Share another skill next month. Your earnings grow without proportionally more work.",
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
      "Click Share & Earn. If you have a referral code, select it. If not, create one in three seconds. Your link is ready.",
    step4Title: "Share where it matters",
    step4Body:
      "Post it in communities where people would actually use the skill - Discord servers, subreddits, forum threads, blog posts, Slack channels. Specific beats broad.",
    step5Title: "Watch the dashboard",
    step5Body:
      "Your referral dashboard shows visitors, signups, and earnings in real time. Every new signup through your link is recurring revenue.",
  },
  close: {
    title: "The skill is the product. The link is the revenue.",
    p1: 'Most people think of referral programs as sharing a generic signup link. That works, but it\'s a hard sell. "Here\'s a link to an AI platform" goes nowhere. "Here\'s an AI that thinks like a senior clinician" is something people actually send.',
    p2: "Build what you'd want to use yourself. Make it specific. Then share the link. The earning takes care of itself.",
    createSkill: "Create your first skill",
    referralPage: "Set up your referral code",
  },
};
