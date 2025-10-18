import { translations as actionsTranslations } from "./actions";
import { translations as billingTranslations } from "./billing";
import { translations as cancellationTranslations } from "./cancellation";
import { translations as checkoutTranslations } from "./checkout";
import { translations as currentTranslations } from "./current";
import { translations as downgradeTranslations } from "./downgrade";
import { translations as emailTranslations } from "./email";
import { translations as errorsTranslations } from "./errors";
import { translations as featuresTranslations } from "./features";
import { translations as invoiceStatusTranslations } from "./invoiceStatus";
import { translations as messagesTranslations } from "./messages";
import { translations as noActiveTranslations } from "./noActive";
import { translations as plansTranslations } from "./plans";
import { translations as reactivationTranslations } from "./reactivation";
import { translations as statusTranslations } from "./status";
import { translations as tabsTranslations } from "./tabs";
import { translations as timeTranslations } from "./time";
import { translations as updateTranslations } from "./update";

export const translations = {
  actions: actionsTranslations,
  billing: billingTranslations,
  cancellation: cancellationTranslations,
  checkout: checkoutTranslations,
  current: currentTranslations,
  downgrade: downgradeTranslations,
  email: emailTranslations,
  errors: errorsTranslations,
  features: featuresTranslations,
  invoiceStatus: invoiceStatusTranslations,
  messages: messagesTranslations,
  noActive: noActiveTranslations,
  plans: plansTranslations,
  reactivation: reactivationTranslations,
  status: statusTranslations,
  tabs: tabsTranslations,
  time: timeTranslations,
  update: updateTranslations,
  // Legacy tier-based
  currentPlan: "Current Plan",
  billingCycle: "Billing Cycle",
  nextBilling: "Next billing date",
  noBillingDate: "No billing date available",
  planFeatures: "Plan Features",
  noSubscription: "No active subscription",
  chooseAPlan: "Choose a subscription plan to get started",
  starterFeatures: "Starter Plan Features",
  cancellationPending: "Subscription Cancellation Pending",
  accessUntil: "You'll have access until",
  // New credit-based system
  title: "Credits",
  description: "Manage your credits and subscriptions",
  balance: {
    title: "Credit Balance",
    description: "Your available credits for AI conversations",
    total: "credits",
    expiring: {
      title: "Expiring Credits",
      description: "From subscription",
    },
    permanent: {
      title: "Permanent Credits",
      description: "Never expire",
    },
    free: {
      title: "Free Credits",
      description: "Free tier",
    },
    nextExpiration: "Next Expiration",
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
        title: "Free Credits",
        description:
          "Everyone gets 20 free credits to try our service. Start chatting with AI immediately!",
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
        audioCost: "1 credit/min",
      },
    },
  },
  buy: {
    subscription: {
      badge: "Best Value",
      title: "Monthly Subscription",
      description: "1000 credits per month (expire monthly)",
      perMonth: "/month",
      features: {
        credits: "1000 credits every month",
        expiry: "Credits expire at end of billing cycle",
        bestFor: "Best for regular users",
      },
      button: "Subscribe Now",
    },
    pack: {
      title: "Credit Pack",
      description: "500 credits per pack (never expire)",
      perPack: "/pack",
      features: {
        credits: "500 permanent credits",
        expiry: "Credits never expire",
        bestFor: "Best for occasional users",
      },
      quantity: "Quantity",
      total: "{{count}} credits total",
      totalPrice: "Total: {{price}}",
      button: "Buy {{count}} {{type}}",
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
    },
  },
};
