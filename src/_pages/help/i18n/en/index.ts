export const translations = {
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
      info: {
        title: "Contact Information",
        supportEmail: "Support Email",
        discord: "Discord",
        discordUrl: "Join our Discord community",
      },
      faq: {
        title: "Frequently Asked Questions",
        questions: {
          q1: {
            question: "What is {{appName}}?",
            answer:
              "{{appName}} is an uncensored AI chat platform with access to {{modelCount}} AI models. We combine honest AI conversations with advanced features like folder management, custom characters, and multi-model support.",
          },
          q2: {
            question: "What payment methods do you accept?",
            answer:
              "Card, PayPal, Apple Pay and Google Pay via Stripe, plus crypto (Bitcoin, Ethereum, stablecoins) via NOWPayments. Plans start at {{subscriptionPrice}} a month. Credit packs are a top-up for subscribers.",
          },
          q3: {
            question: "How does the credit system work?",
            answer:
              "Every model costs credits per use. Free credits get you started. Every plan adds credits each month: {{subscriptionPrice}} for {{subscriptionCredits}}, {{plusPrice}} for {{plusCredits}}, {{proPrice}} for {{proCredits}}, {{ultraPrice}} for {{ultraCredits}}. Need more? Subscribers top up with credit packs ({{packPrice}} for {{packCredits}} credits). Pack credits never expire and work across all {{modelCount}} AI models.",
          },
          q4: {
            question: "Is my data private and secure?",
            answer:
              "Yes! Private folders are only visible to you, incognito mode keeps chats out of our servers (generated media is stored temporarily for technical reasons), and you can export all your data or delete your account (and the personal data tied to it) from Settings. Your conversations are yours - we never sell your data. End-to-end encryption is coming soon.",
          },
        },
      },
    },
  },
};
