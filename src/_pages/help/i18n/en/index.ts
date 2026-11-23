export const translations = {
  nav: {
    home: "Home",
  },
  breadcrumb: "Help",
  meta: {
    contact: {
      title: "Help center: FAQ, guides and support | {{appName}}",
      description:
        "Answers on credits, payments, privacy, uncensored models and API access. Guides for every part of {{appName}}, plus direct support by email and Discord.",
      category: "Support",
      imageAlt: "{{appName}} help center",
      keywords:
        "{{appName}} help, {{appName}} FAQ, AI chat support, uncensored AI help, AI credits, AI API access",
      ogTitle: "{{appName}} help center",
      ogDescription:
        "Credits, payments, privacy, uncensored models and API access, answered.",
      twitterTitle: "{{appName}} help center",
      twitterDescription: "Answers, guides and direct support.",
    },
  },
  pages: {
    help: {
      title: "How can we help?",
      subtitle:
        "Quick answers first. Guides for the deep dives. A human when you need one.",
      topics: {
        title: "Find your way",
        models: {
          title: "Models",
          body: "Compare {{modelCount}} chat models by price, context and censorship level.",
        },
        uncensored: {
          title: "Uncensored AI chat",
          body: "Which models answer without the mainstream filters, and how to start.",
        },
        skills: {
          title: "Skills",
          body: "Ready-made specialists and characters. Or build your own.",
        },
        studio: {
          title: "Media Studio",
          body: "Images, video, music, speech and transcription in one place.",
        },
        pricing: {
          title: "Plans and credits",
          body: "What a plan includes, how credits work and how to top up.",
        },
        api: {
          title: "API docs",
          body: "OpenAI and Anthropic compatible endpoints with copyable examples.",
        },
        selfHost: {
          title: "Self-host",
          body: "Run your own instance from the open source code.",
        },
      },
      info: {
        title: "Still stuck? Talk to us",
        intro:
          "Send a message below or reach us directly. We read every request.",
        supportEmail: "Support Email",
        discord: "Discord",
        discordUrl: "Join our Discord community",
      },
      guides: {
        title: "Popular guides",
      },
      faq: {
        title: "Frequently asked questions",
        more: "Read more",
        questions: {
          q1: {
            question: "What is {{appName}}?",
            answer:
              "{{appName}} is an AI chat platform with {{modelCount}} models: mainstream, open and uncensored. You pick the model and with it how much filtering you want. Skills, folders, media generation and an API come on top.",
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
              "Private folders are visible only to you. Incognito mode keeps chat history off our servers, though generated media files are still stored there. Export all your data or delete your account and the personal data tied to it from Settings. We never sell your data.",
          },
          q5: {
            question: "Can I try it without an account?",
            answer:
              "Yes. Guests get up to {{freeCreditsGuest}} free credits per month. A free, verified account raises that to {{freeCreditsSignedIn}}, and a confirmed newsletter subscription to {{freeCreditsMax}}.",
          },
          q6: {
            question:
              "What is the difference between abliterated and uncensored models?",
            answer:
              "Abliterated models are mainstream models with their refusal behavior removed, so they answer instead of dodging. Uncensored LM is different: it is trained on books and documents banned from the mainstream internet, resulting in a model with contrary political opinions.",
          },
          q7: {
            question: "How do I get API access?",
            answer:
              "API keys unlock with your first purchase, a plan or a credit pack. Free credits do not unlock the API. Then create a key in your account and point any OpenAI or Anthropic client at our base URL.",
          },
          q8: {
            question: "Can I run {{appName}} on my own server?",
            answer:
              "Yes. The code is open source. Clone the repository, run bun i and vibe dev, then finish the setup in the browser. You can connect your instance to your {{appName}} account.",
          },
        },
      },
    },
  },
};
