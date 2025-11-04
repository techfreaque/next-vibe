import { translations as componentsTranslations } from "../../_components/i18n/en";

export const translations = {
  components: componentsTranslations,
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
              "We accept credit cards via Stripe and cryptocurrency payments (Bitcoin, Ethereum, stablecoins) via NowPayments. Choose between {{subPrice}}/month subscription ({{subCredits}} credits/month) or {{packPrice}} credit packs ({{packCredits}} credits each, requires subscription).",
          },
          q3: {
            question: "How does the credit system work?",
            answer:
              "Free users get {{freeCredits}} credits/month. Paid users can choose unlimited subscription ({{subPrice}}/month) or pay-as-you-go credit packs ({{packPrice}} for {{packCredits}} credits). Credits never expire and work across all {{modelCount}} AI models.",
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
