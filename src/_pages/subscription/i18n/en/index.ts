export const translations = {
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
      portal: {
        error: "Couldn't open the billing portal. Try again.",
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
        description:
          "{{guest}} free credits a month as a guest, {{signedIn}} signed in, +{{bonus}} with the newsletter",
      },
      earned: {
        title: "Earned Credits",
        description: "Earn by inviting friends →",
      },
    },
    overview: {
      howItWorks: {
        title: "How credits work",
        description:
          "One currency for every model. Subscribe, top up, or start free.",
        expiring: {
          title: "Monthly plan",
          description:
            "{{subPrice}}/month. {{subCredits}} credits every month, all {{modelCount}} models.",
        },
        permanent: {
          title: "Credit packs",
          description:
            "{{packPrice}} for {{packCredits}} credits, or {{largePackPrice}} for {{largePackCredits}}. Never expire. No subscription needed.",
        },
        free: {
          title: "Free credits",
          description:
            "{{guest}} a month as a guest. {{signedIn}} with a free account, +{{bonus}} with the newsletter. No card.",
        },
      },
      costs: {
        title: "What things cost",
        description: "Credits per message, image, clip or tool call.",
        models: {
          title: "AI Models (per message)",
          gpt4: "GPT-4",
          claude: "Claude Sonnet",
          gpt35: "GPT-3.5",
          llama: "Llama 3",
          cost: "{{count}} credits",
          showLegacy: "Show Legacy Models",
          hideLegacy: "Hide Legacy Models",
          free: "Free",
          approxCost: "~credits",
          legacyBadge: "Legacy",
          types: {
            text: "Chat",
            tts: "Text to Voice",
            stt: "Voice to Text",
            image: "Image Generation",
            audio: "Music Generation",
            video: "Video Generation",
          },
        },
        features: {
          title: "Features",
          braveSearchLabel: "Brave Search (per search)",
          kagiSearchLabel: "Kagi Search (per search)",
          fetchUrlLabel: "Get Website as Text (per fetch)",
          costFormat: "{{value}} {{unit}}",
          creditsUnit: "credits",
        },
      },
      cta: {
        title: "Unlock every model.",
        description:
          "Monthly credits across all {{modelCount}} models. Top up with packs anytime.",
        button: "Subscribe",
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
        description: "Pay as you go. No subscription. Credits never expire.",
        badge: "No Subscription",
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
      adminBuy: "Manage Credits",
      billing: "Billing",
      history: "History",
      plans: "Plans",
      remote: "Cloud Sync",
    },
    admin: {
      title: "Credits & Limits",
      description: "Manage credit allocations and usage caps for this instance",
      allocate: {
        title: "Allocate Credits",
        description:
          "Add credits to any user account. Credits act as a spending cap - they control how much AI usage is allowed. For self-hosted instances, set this to the budget you want to allow.",
        howItWorks: {
          title: "How Credit Limits Work",
          freePool: {
            title: "Free Pool (Shared)",
            description:
              "All users share a pool of free credits that resets monthly. Configure the pool size in your environment settings.",
          },
          bonus: {
            title: "Bonus Credits (Per User)",
            description:
              "Bonus credits are permanent - they never expire and stack on top of free pool credits. Use these to grant individual users extra capacity.",
          },
          apiKeys: {
            title: "Remove All Limits",
            description:
              "Configure your own LLM API keys in settings to bypass credits entirely. Each user can also bring their own API key.",
          },
        },
      },
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
    category: "Pricing",
    imageAlt: "{{appName}} pricing: credits for every AI model",
    keywords:
      "AI chat pricing, uncensored AI pricing, pay per message AI, AI credits, {{appName}}",
    overview: {
      title: "Pricing - pay per message, no lock-in | {{appName}}",
      description:
        "{{freeCredits}} free credits a month. {{subCredits}} credits for {{subPrice}} a month, or buy a pack that never expires. One balance for {{modelCount}} models, mainstream to uncensored.",
    },
    buyCredits: {
      title: "Buy credits - subscription or packs | {{appName}}",
      description:
        "{{subCredits}} credits a month for {{subPrice}}, or credit packs that never expire. Pay by card or crypto. Use them on {{modelCount}} AI models.",
    },
    history: {
      title: "Credit history | {{appName}}",
      description:
        "Every credit in and out: purchases, monthly grants, referral earnings and what each chat cost.",
    },
  },
  payment: {
    success: {
      title: "Payment Successful",
      subscription:
        "Your monthly subscription has been activated! You now get {{subCredits}} credits per month with all {{modelCount}} models.",
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
