export const translations = {
  backToChat: "Back to Chat",
  title: "Earn Real Money with {{appName}}",
  description:
    "Share {{appName}} and get paid. You always earn {{directPct}} on every subscription from people you refer — no matter how many people referred you.",
  tagline: "Affiliate Program",

  hero: {
    directEarning: "You always earn",
    directLabel: "on every subscription",
    directNote: "from people you directly refer",
    bonusEarning: "Plus bonus earnings",
    bonusNote:
      "when your referrals refer others (up to {{maxUplineLevels}} levels deep)",
    example:
      "Example: someone pays {{examplePrice}}/mo → you get {{exampleDirectEarning}} every month",
  },

  commissionTable: {
    colLevel: "Level",
    colCut: "Your cut",
    colExample: "Example ({{examplePrice}}/mo plan)",
    alwaysYours: "always yours",
    heroGuarantee: "guaranteed to you, always",
    heroNote:
      "On every subscription payment from people you refer — no sharing with your own referrer",
    // Only "who" labels are translated — pct and example are derived from config
    whoLabels: [
      "People you refer",
      "Their referrals",
      "Level 3 referrals",
      "Level 4 referrals",
      "Level 5 referrals",
    ],
  },

  commission: {
    title: "How Much Do You Earn?",
    subtitle:
      "Your {{directPct}} is always yours — no sharing with your own referrer. Your upline doesn't affect what you make.",
    directTitle: "Your Direct Cut",
    directAmount: "{{directPct}} always",
    directDesc:
      "Every time someone you referred pays, you get {{directPct}} of that payment. Instant. Every time.",
    bonusTitle: "Bonus from Your Network",
    bonusAmount: "Up to {{uplinePct}} more",
    bonusDesc:
      "When your referrals refer others, you also earn a share — {{level2Pct}} from level 2, {{level3Pct}} from level 3, and so on.",
    totalTitle: "Total you can earn",
    totalAmount: "Up to {{totalPct}}",
    totalDesc: "If your referrals are also referring people",
    levelsTitle: "Level Breakdown",
    level1: "You refer someone → you earn {{directPct}} of their payments",
    level2: "They refer someone → you earn {{level2Pct}} of those payments",
    level3: "Those people refer → you earn {{level3Pct}}",
    level4: "And so on... up to {{maxUplineLevels}} levels",
    noPenalty: "Being referred yourself doesn't reduce what you earn",
    noPenaltyNote:
      "Even if someone referred you, your {{directPct}} is completely separate and protected.",
  },

  overview: {
    title: "Your Earnings",
    subtitle: "Real-time stats updated with every purchase.",
  },

  howItWorks: {
    title: "How It Works",
    step1Title: "Create referral codes",
    step1Body:
      "Generate unique codes for different audiences — friends, social media, or campaigns.",
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
      "Create an account or log in to generate your referral codes and start earning {{directPct}} commission on every subscription — forever.",
    signUp: "Create Account",
    logIn: "Log In",
    pitch1: "{{directPct}} on every payment from your referrals",
    pitch2: "Bonus earnings from multi-level referrals",
    pitch3: "Instant payouts — use as credits or withdraw to crypto",
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
      "Minimum payout: {{minPayout}}. Crypto payouts are processed within 48 hours after approval.",
  },
};
