import { translations as historyTranslations } from "../../history/i18n/en";

export const translations = {
  history: historyTranslations,
  subscription: {
    title: "Credits & Subscription",
    description: "Manage your credits and monthly subscription",
    backToChat: "Back to Chat",
    billingInterval: "Billing Interval",
    currentPeriodStart: "Current Period Start",
    nextBillingDate: "Next Billing Date",
    endsOn: "Subscription Ends On",
    canceledOn: "Canceled On",
    endedOn: "Ended On",
    cancellation: {
      title: "Subscription Scheduled for Cancellation",
      description:
        "Your subscription will end on {{date}}. You will retain access until then.",
    },
    canceled: {
      title: "Subscription Canceled",
      description:
        "Your subscription has been canceled. You can resubscribe at any time to regain access to monthly credits.",
    },
    manage: {
      stripe: {
        button: "Manage Subscription",
      },
      nowpayments: {
        button: "View Subscription Details",
        info: "Your subscription is managed via email. Please check your inbox for payment links and subscription details from NOWPayments.",
      },
    },
    balance: {
      title: "Credit Balance",
      description:
        "Your available credits for AI conversations with {{modelCount}} models",
      credit: "{{count}} credit",
      credits: "{{count}} credits",
      nextExpiration: "Next Expiration",
      expiring: {
        title: "Subscription Credits",
        description: "From monthly subscription ({{subCredits}} credits/month)",
      },
      permanent: {
        title: "Permanent Credits",
        description: "Credits purchased in packs never expire",
      },
      free: {
        title: "Free Monthly Credits",
        description: "{{count}} free credits per month for everyone",
      },
      earned: {
        title: "Earned Credits",
        description: "Earn by inviting friends →",
      },
    },
    overview: {
      howItWorks: {
        title: "How Credits Work",
        description:
          "Subscribe for {{subCredits}} monthly credits, and buy extra credit packs when you need more",
        expiring: {
          title: "Monthly Subscription",
          description:
            "{{subPrice}}/month - {{subCredits}} credits per month with all {{modelCount}} AI models. Perfect for regular users!",
        },
        permanent: {
          title: "Extra Credit Packs",
          description:
            "{{packPrice}} for {{packCredits}} credits - Need more than {{subCredits}} credits? Buy additional packs that never expire. Requires active subscription.",
        },
        free: {
          title: "Free Credits",
          description:
            "Everyone gets {{count}} free credits to try our uncensored AI chat platform. No credit card required!",
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
          searchLabel: "Brave Search (per search)",
          fetchUrlLabel: "Get Website as Text (per fetch)",
          ttsLabel: "Text-to-Speech (per 1000 characters)",
          sttLabel: "Speech-to-Text (per minute)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "credits",
        },
      },
      cta: {
        title: "Ready to get started?",
        description:
          "Subscribe for monthly credits and chat with all {{modelCount}} AI models. Subscribers can buy extra credit packs when needed!",
        button: "Subscribe Now",
      },
    },
    buy: {
      signInRequired: {
        title: "Sign In Required",
        description:
          "Please sign in or create an account to purchase credits or subscribe.",
      },
      provider: {
        stripe: {
          description: "Credit/Debit Cards",
        },
        nowpayments: {
          description: "Cryptocurrency",
        },
        cryptoMonthlyDisabled:
          "Cryptocurrency payments are only available for yearly subscriptions due to minimum transaction value requirements (minimum $20).",
        cryptoMinimumPacks:
          "Cryptocurrency payments require a minimum of {{minPacks}} credit packs ({{minValue}}) due to minimum transaction value requirements.",
      },
      subscription: {
        badge: "Best Value",
        title: "Monthly Subscription",
        description:
          "{{subPrice}}/month - {{subCredits}} credits per month with all {{modelCount}} AI models",
        perMonth: "/month",
        perYear: "/year",
        yearlyEquivalent: "Only {{monthlyPrice}}/month when billed annually",
        features: {
          credits: "{{count}} credits per month",
          expiry: "Access all {{modelCount}} AI models",
          bestFor: "Perfect for regular AI users",
        },
        button: "Subscribe Now",
        buttonAlreadySubscribed: "Already Subscribed",
      },
      pack: {
        title: "Extra Credit Packs",
        description:
          "Additional credits that never expire. Requires active subscription.",
        badge: "For Subscribers",
        perPack: "/pack",
        quantity: "Quantity",
        total: "{{count}} credits",
        features: {
          credits: "{{count}} credits per pack",
          permanent: "Never expires",
          expiry: "Never expires",
          bestFor: "Perfect for power users who need more",
        },
        button: {
          submit: "Buy Credit Pack",
        },
        totalPrice: "Total: {{price}}",
        pack: "Pack",
        packs: "Packs",
        requiresSubscription:
          "Credit packs require an active subscription. Subscribe to get monthly credits and unlock the ability to buy credit packs!",
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
        monthly_reset: "Monthly Reset",
        free_grant: "Free Grant",
        free_reset: "Free Reset",
        refund: "Refund",
        transfer: "Transfer",
        other_devices: "Spending from other devices",
        referral_earning: "Referral Earning",
        referral_payout: "Referral Payout",
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
        subscription:
          "Your subscription has been activated successfully! Your credits will be available shortly.",
        credits:
          "Your credit pack purchase was successful! Your credits will be available shortly.",
      },
      canceled: {
        title: "Payment Canceled",
        subscription:
          "Your subscription payment was canceled. You can try again anytime.",
        credits:
          "Your credit pack purchase was canceled. You can try again anytime.",
      },
    },
  },
  meta: {
    subscription: {
      title: "Credits & Subscription - Unbottled AI",
      description:
        "Subscribe for {{subCredits}} monthly credits and buy extra packs when needed. Chat with {{modelCount}}+ uncensored AI models.",
      category: "Account",
      imageAlt: "Credits and subscription management for uncensored AI chat",
      keywords: {
        subscription: "monthly AI subscription",
        billing: "AI credits billing",
        plans: "AI chat plans",
        pricing: "uncensored AI pricing",
      },
    },
    overview: {
      title: "Subscription Overview - Unbottled AI",
      description:
        "View your credit balance, subscription status, and learn how credits work. Chat with {{modelCount}}+ uncensored AI models.",
    },
    buyCredits: {
      title: "Buy Credits - Unbottled AI",
      description:
        "Subscribe for {{subCredits}} monthly credits or buy extra credit packs. Access {{modelCount}}+ uncensored AI models.",
    },
    history: {
      title: "Transaction History - Unbottled AI",
      description:
        "View your credit transaction history, purchases, and usage. Manage your AI chat credits.",
    },
  },
  payment: {
    success: {
      title: "Payment Successful",
      subscription:
        "Your monthly subscription has been activated! You now get {{subCredits}} credits per month with all {{modelCount}}+ models.",
      credits:
        "Your credit pack purchase was successful! Credits never expire.",
    },
    canceled: {
      title: "Payment Canceled",
      subscription:
        "Your subscription payment was canceled. You can try again anytime.",
      credits:
        "Your credit pack purchase was canceled. You can try again anytime.",
    },
  },
};
