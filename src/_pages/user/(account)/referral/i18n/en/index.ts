export const translations = {
  backToChat: "Back to Chat",
  title: "Share your link. Earn {{directPct}} of every payment. Forever.",
  description:
    "Anyone who signs up through your link pays you {{directPct}} of every payment they make. No expiry, no cap. Publish a skill and earn {{skillBonusPct}} on users others bring to it.",
  tagline: "Referrals & Skills",

  hero: {
    directEarning: "You earn",
    directLabel: "on every payment",
    directNote: "from people you refer, forever",
    bonusEarning: "As skill creator",
    bonusNote: "when others share your skill, recurring forever",
  },

  commissionTable: {
    perMonth: "/ mo",
    colLevel: "Who earns",
    colCut: "Cut",
    alwaysYours: "always yours",
    heroLabel: "on every payment",
    heroSub: "Recurring. Forever.",
    chainTitle: "10 subscribers. What you earn per month.",
    chainSubtitle:
      "Each level is half the one above. Built once at signup - pays forever.",
    youLabel: "You",
    whoLabel0: "You - whoever referred them directly",
    whoLabel1: "Skill creator (if different) or your referrer",
    whoLabel2: "Their referrer's referrer",
    whoLabel3: "Level 4",
    whoLabel4: "Level 5",
    whoLabel5: "Level 6",
    colExample: "Example ({{examplePrice}}/mo spend)",
    tableNote:
      "Referral link: {{directPct}} per user. Your skill shared by someone else: {{skillBonusPct}} per user. Both recurring, forever.",
  },

  commission: {
    title: "The chain, level by level",
    subtitle:
      "Every payment from your referrals flows up the chain. You sit at level 1 - {{directPct}} forever. Each level above earns a cut too.",
    directTitle: "Direct commission",
    directAmount: "{{directPct}} always",
    directDesc:
      "Every time someone you referred pays, you get {{directPct}}. No exceptions. No expiry.",
    bonusTitle: "Network earnings",
    bonusAmount: "Up to {{uplinePct}} more",
    bonusDesc:
      "Your referrals refer others - you earn a cut of those too. {{level2Pct}} from level 2, {{level3Pct}} from level 3, halving each level.",
    totalTitle: "Total potential",
    totalAmount: "Up to {{totalPct}}",
    totalDesc: "When your referrals are also referring others",
    levelsTitle: "Level breakdown",
    level1: "You refer someone → {{directPct}} of their payments",
    level2: "They refer someone → {{level2Pct}} of those payments",
    level3: "Those refer others → {{level3Pct}}",
    level4: "And so on, up to {{maxUplineLevels}} levels",
  },

  // Story scenario section
  story: {
    title: "How the chain compounds",
    subtitle:
      "Same 10 subscribers. Each level that activates adds to your total - forever.",
    totalLabel: "Total / mo",
    addedLabel: "+{{amount}} from this level",
    levelLabel: "Level {{n}} active",
    level1Desc: "Your 10 direct subscribers. {{directPct}} each.",
    level2Desc: "Your referrals refer someone. You earn a cut of that too.",
    level3Desc: "Their referrals refer. Chain keeps building.",
    level4Desc: "Fourth degree. Still paying.",
    level5Desc: "Fifth degree.",
    level6Desc: "Sixth degree. Every cent, forever.",
    noob: {
      label: "Getting started",
      earning: "~{{story_noob_earning}}/mo",
      desc: "{{story_noob_users}} paying subscribers via your referral link. {{directPct}} each - passive income from one tweet or blog post.",
    },
    mid: {
      label: "Growing audience",
      earning: "~{{story_mid_earning}}/mo",
      desc: "{{story_mid_users}} subscribers - mix of referral and skill links. Some of their friends also signed up. Chain is building itself.",
    },
    pro: {
      label: "Established creator",
      earning: "~{{story_pro_earning}}/mo",
      desc: "{{story_pro_users}} subscribers across referral + skill links, plus upline earnings from people they referred. Fully compounding.",
    },
  },

  overview: {
    title: "Your earnings",
    subtitle: "Live stats. Updates with every payment.",
  },

  howItWorks: {
    title: "How it works",
    step1Title: "Create a referral code",
    step1Body:
      "Make unique codes for different audiences - friends, Discord, a blog post. Each tracked separately.",
    step2Title: "Share your link",
    step2Body:
      "Referral link → {{directPct}} per user, forever. Your skill shared by others → {{skillBonusPct}} per user. Two sources, zero extra work.",
    step3Title: "Get paid",
    step3Body:
      "Credits land instantly. Withdraw to BTC or USDC once you hit {{minPayout}}.",
  },

  manage: {
    createSubtitle: "Create codes for specific campaigns or audiences.",
    codesSubtitle: "Copy a link, share it, watch it earn.",
  },
  createCode: {
    title: "Create Referral Code",
    create: "Create Code",
    creating: "Creating...",
  },
  myCodes: {
    title: "Your links",
    loading: "Loading...",
    error: "Failed to load codes",
    empty: "No codes yet. Create your first one above ↑",
    copy: "Copy link",
    copied: "Copied!",
    uses: "Uses",
    signups: "Signups",
    revenue: "Revenue",
    earnings: "Earned",
    inactive: "Inactive",
  },
  stats: {
    loading: "Loading...",
    error: "Failed to load stats",
    totalSignups: "Total signups",
    totalSignupsDesc: "Users who signed up via your referral code",
    totalRevenue: "Revenue generated",
    totalRevenueDesc: "Total subscription value from your referrals",
    totalEarned: "Total earned",
    totalEarnedDesc: "Your commission across all referrals",
    availableBalance: "Available balance",
    availableBalanceDesc:
      "Spend on AI chats - other credits used first. Earn {{minPayout}} to unlock withdrawal.",
  },
  cta: {
    title: "Create an account to start earning",
    description:
      "Get your referral link. {{directPct}} on every payment - recurring, no expiry. Publish a skill and earn {{skillBonusPct}} when others share it.",
    signUp: "Create account",
    logIn: "Log in",
    pitch1: "{{directPct}} referral commission - recurring, no expiry",
    pitch2:
      "Publish a skill → {{skillBonusPct}} from every user others bring to it",
    pitch3: "Credits instantly. BTC/USDC withdrawals at {{minPayout}} minimum.",
  },
  payout: {
    title: "Withdraw your earnings",
    description: "Two ways to use what you've earned",
    useAsCredits: "Use as chat credits",
    useAsCreditsDesc:
      "Instant. No minimum. Converts 1:1 to AI conversation credits.",
    cryptoPayout: "Withdraw to crypto",
    cryptoPayoutDesc: "BTC or USDC to your wallet address.",
    minimumNote:
      "Minimum: {{minPayout}}. Processed within {{cryptoPayoutHours}} hours after approval.",
  },
  audienceCallout: {
    title: "Two ways to earn",
    newTitle: "Referral link - {{directPct}} per user",
    newBody:
      "Share your code. Anyone who signs up and pays gives you {{directPct}} of every payment, every month, forever. Post it once. Earn forever.",
    newCta: "Get your referral link",
    proTitle: "Skill creator - {{skillBonusPct}} per user",
    proBody:
      "Build a skill. Share its link. Everyone who signs up through your own link pays you {{directPct}}, recurring. The multiplier: when someone else shares your skill with their link, you still earn {{skillBonusPct}} as the skill author. The platform tracks skill authorship - passive attribution with no extra work.",
    proCta: "Build a skill",
  },
  discord: {
    title: "Join the community",
    description: "Share strategies, ask questions, connect with other earners.",
    cta: "Join Discord",
  },
};
