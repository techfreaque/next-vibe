import { translations as contactTranslations } from "@/app/api/[locale]/contact/i18n/en";

export const translations = {
  contact: contactTranslations,
  nav: {
    home: "Home",
  },
  meta: {
    contact: {
      title: "Contact & Support - {{appName}}",
      description:
        "Get help with {{appName}} - uncensored AI chat platform. Contact our support team for assistance.",
      category: "Support",
      imageAlt: "{{appName}} Support",
      keywords: "contact, support, help, {{appName}}, ai chat, assistance",
      ogTitle: "Contact {{appName}} Support",
      ogDescription: "Get help with your uncensored AI chat experience",
      twitterTitle: "Contact {{appName}}",
      twitterDescription: "Reach out to our support team",
    },
  },
  pages: {
    help: {
      title: "How Can We Help You?",
      subtitle:
        "Get support for your uncensored AI chat experience or find answers to common questions",
      faq: {
        title: "Frequently Asked Questions",
        questions: {
          q1: {
            question: "What is {{appName}}?",
            answer:
              "{{appName}} is an uncensored AI chat platform with access to {{modelCount}} AI models. We combine honest AI conversations with advanced features like folder management, custom personas, and multi-model support.",
          },
          q2: {
            question: "What payment methods do you accept?",
            answer:
              "We accept credit cards via Stripe and cryptocurrency payments (Bitcoin, Ethereum, stablecoins) via NowPayments. The {{subPrice}}/month subscription includes {{subCredits}} credits/month. You can also purchase credit packs ({{packPrice}} for {{packCredits}} credits) if you need more credits. Credit packs never expire, even after subscription ends.",
          },
          q3: {
            question: "How does the credit system work?",
            answer:
              "You need the {{subPrice}}/month subscription to access AI chat, which includes {{subCredits}} credits/month. If you need more credits, you can purchase credit packs ({{packPrice}} for {{packCredits}} credits). Credit packs never expire, even after your subscription ends, so they work across all {{modelCount}} AI models whenever you reactivate.",
          },
          q4: {
            question: "Is my data private and secure?",
            answer:
              "Yes! We offer end-to-end encryption for private folders, incognito mode for session-only chats, and full GDPR compliance. Your conversations are yours - we never sell your data.",
          },
        },
      },
    },
  },
};
