export const translations = {
  backToChat: "Back to Chat",
  title: "Earn Real Money with {{appName}}",
  description:
    "Share {{appName}} and get paid. Earn {{directPct}} on every subscription you refer - plus bonus earnings when your referrals refer others.",
  tagline: "Affiliate Program",

  hero: {
    directEarning: "You earn",
    directLabel: "on every subscription",
    directNote: "from people you directly refer",
    bonusEarning: "Plus bonus from their referrals",
    bonusNote: "Earn a share up to {{maxUplineLevels}} levels deep",
    example:
      "Example: {{examplePrice}}/mo plan → you get {{exampleDirectEarning}} every month",
  },

  commissionTable: {
    colLevel: "Level",
    colCut: "Your cut",
    colExample: "Example ({{examplePrice}}/mo plan)",
    alwaysYours: "always yours",
    heroLabel: "per subscription",
    heroSub: "Recurring. Forever.",
    // Only "who" labels are translated - pct and example are derived from config
    whoLabels: [
      "People you refer",
      "Their referrals",
      "Level 3 referrals",
      "Level 4 referrals",
      "Level 5 referrals",
      "Level 6 referrals",
    ],
  },

  commission: {
    title: "How Much Do You Earn?",
    subtitle:
      "Your {{directPct}} comes from every subscription payment - recurring, every month.",
    directTitle: "Direct Commission",
    directAmount: "{{directPct}} always",
    directDesc:
      "Every time someone you referred pays, you earn {{directPct}}. Instant. Every month.",
    bonusTitle: "Bonus from Your Network",
    bonusAmount: "Up to {{uplinePct}} more",
    bonusDesc:
      "When your referrals refer others, you earn a share too - {{level2Pct}} from level 2, {{level3Pct}} from level 3, and so on.",
    totalTitle: "Total potential",
    totalAmount: "Up to {{totalPct}}",
    totalDesc: "If your referrals are also referring others",
    levelsTitle: "Level Breakdown",
    level1: "You refer someone → {{directPct}} of their payments",
    level2: "They refer someone → {{level2Pct}} of those payments",
    level3: "Those refer others → {{level3Pct}}",
    level4: "And so on... up to {{maxUplineLevels}} levels",
  },

  overview: {
    title: "Your Earnings",
    subtitle: "Real-time stats updated with every purchase.",
  },

  howItWorks: {
    title: "How It Works",
    step1Title: "Create referral codes",
    step1Body:
      "Generate unique codes for different audiences - friends, social media, or campaigns.",
    step2Title: "Share your link",
    step2Body:
      "When someone signs up using your link and subscribes, you earn {{directPct}} of every payment they make.",
    step3Title: "Get paid",
    step3Body:
      "Earnings land instantly in your account. Spend them on AI chats or withdraw to crypto.",
  },

  manage: {
    createSubtitle: "Create codes for specific campaigns or audiences.",
    codesSubtitle: "Track performance and earnings for each referral code.",
  },
  createCode: {
    title: "Create Referral Code",
    create: "Create Code",
    creating: "Creating...",
  },
  myCodes: {
    title: "Your Referral Codes",
    loading: "Loading codes...",
    error: "Failed to load codes",
    empty: "No referral codes yet. Create your first one above!",
    copy: "Copy Link",
    copied: "Copied!",
    uses: "Uses",
    signups: "Signups",
    revenue: "Revenue",
    earnings: "Earned",
    inactive: "Inactive",
  },
  stats: {
    loading: "Loading stats...",
    error: "Failed to load stats",
    totalSignups: "Total Signups",
    totalSignupsDesc: "People who signed up via your links",
    totalRevenue: "Revenue Generated",
    totalRevenueDesc: "Total value from your referrals",
    totalEarned: "Total Earned",
    totalEarnedDesc: "Your commission earnings",
    availableBalance: "Available Balance",
    availableBalanceDesc: "Ready to use or withdraw",
  },
  cta: {
    title: "Start Earning Today",
    description:
      "Create an account or log in to get your referral link and start earning {{directPct}} on every subscription - forever.",
    signUp: "Create Account",
    logIn: "Log In",
    pitch1: "{{directPct}} on every payment from your referrals",
    pitch2: "Bonus earnings from multi-level referrals",
    pitch3: "Instant payouts - use as credits or withdraw to crypto",
  },
  payout: {
    title: "Withdraw Your Earnings",
    description: "Multiple ways to use your referral earnings",
    useAsCredits: "Use as Chat Credits",
    useAsCreditsDesc:
      "Instantly convert earnings to chat credits for AI conversations.",
    cryptoPayout: "Withdraw to Crypto",
    cryptoPayoutDesc: "Request payout in BTC or USDC to your wallet address.",
    minimumNote:
      "Minimum payout: {{minPayout}}. Crypto payouts processed within {{cryptoPayoutHours}} hours after approval.",
  },
};
