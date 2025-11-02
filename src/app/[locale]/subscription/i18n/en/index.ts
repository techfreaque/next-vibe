export const translations = {
  subscription: {
    title: "Monthly Subscription",
    description: "Your active subscription plan",
    backToChat: "Back to Chat",
    billingInterval: "Billing Interval",
    currentPeriodStart: "Current Period Start",
    nextBillingDate: "Next Billing Date",
    balance: {
      title: "Credit Balance",
      description: "Your available credits for AI conversations",
      total: "credits",
      nextExpiration: "Next Expiration: {{date}}",
      expiring: {
        title: "Expiring Credits",
        description: "From subscription",
      },
       permanent: {
         title: "Permanent Credits",
         description: "Credits purchased in packs never expire",
       },
       free: {
         title: "Free Monthly Credits",
         description: "{{count}} free credits per month for everyone",
       },
    },
    overview: {
      howItWorks: {
        title: "How Credits Work",
        description: "Understanding your credit system",
        expiring: {
          title: "Expiring Credits",
          description:
 "Credits from monthly subscriptions expire at the end of each billing cycle. Use them before they expire!",
        },
        permanent: {
          title: "Permanent Credits",
          description:
 "Credits purchased in packs never expire. Buy once, use anytime. Perfect for occasional users.",
        },
        free: {
          title: "Free Monthly Credits",
          description:
 "Everyone gets 20 free credits per month. Start chatting with AI immediately!",
        },
      },
      costs: {
        title: "Credit Costs",
        description: "See how much each feature costs",
        models: {
          title: "AI Models (per message)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} credits",
        },
        features: {
          title: "Features",
          search: "Brave Search",
          tts: "Text-to-Speech",
          stt: "Speech-to-Text",
          searchCost: "+1 credit",
          audioCost: "+2 credits",
        },
      },
    },
    buy: {
      subscription: {
        badge: "Best Value",
        title: "Monthly Subscription",
        description:
 "Get credits every month that expire at the end of your billing cycle",
        perMonth: "/month",
        features: {
          credits: "{{count}} credits per month",
          expiry: "Credits expire monthly",
          bestFor: "Best for regular users",
        },
        button: "Subscribe Now",
      },
       pack: {
         title: "Credit Packs",
         description: "Buy additional credits that never expire (requires active subscription)",
        badge: "Never Expires",
        perPack: "/pack",
        quantity: "Quantity",
        total: "{{count}} credits",
        features: {
          credits: "{{count}} credits per pack",
          permanent: "Never expires",
          expiry: "Never expires",
          bestFor: "Best for occasional use",
        },
        button: {
          submit: "Buy Credit Pack",
        },
        totalPrice: "Total: {{price}}",
        pack: "Pack",
        packs: "Packs",
        requiresSubscription: "Subscribe to a monthly plan to purchase additional credit packs.",
      },
    },
    history: {
      title: "Transaction History",
      description: "Your recent credit transactions",
      empty: {
        title: "No transactions yet",
        description: "Your credit transaction history will appear here",
      },
      balance: "Balance: {{count}}",
      loadMore: "Load More",
      types: {
        purchase: "Purchase",
        subscription: "Subscription",
        usage: "Usage",
        expiry: "Expiry",
        free_tier: "Free Tier",
      },
    },
    tabs: {
      overview: "Overview",
      buy: "Buy Credits",
      billing: "Billing",
      history: "History",
      plans: "Plans",
    },
    payment: {
      success: {
        title: "Payment Successful",
        subscription: "Your subscription has been activated successfully! Your credits will be available shortly.",
        credits: "Your credit pack purchase was successful! Your credits will be available shortly.",
      },
      canceled: {
        title: "Payment Canceled",
        subscription: "Your subscription payment was canceled. You can try again anytime.",
        credits: "Your credit pack purchase was canceled. You can try again anytime.",
      },
    },
  },
  meta: {
    subscription: {
      title: "Subscription & Credits",
      description: "Manage your subscription, credits, and billing",
      category: "Account",
      imageAlt: "Subscription and credits management",
      keywords: {
        subscription: "subscription",
        billing: "billing",
        plans: "plans",
        pricing: "pricing",
      },
    },
  },
  payment: {
    success: {
      title: "Payment Successful",
      subscription: "Your subscription has been activated successfully!",
      credits: "Your credit pack purchase was successful!",
    },
    canceled: {
      title: "Payment Canceled",
      subscription: "Your subscription payment was canceled.",
      credits: "Your credit pack purchase was canceled.",
    },
  },
};
