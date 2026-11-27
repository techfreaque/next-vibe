export const translations = {
  meta: {
    title: "Privacy Policy: {{appName}}",
    category: "Legal",
    description:
      "Learn how {{appName}} protects your privacy and handles your data",
    imageAlt: "Privacy Policy",
    keywords:
      "privacy policy, data protection, user privacy, {{appName}} privacy",
    ogTitle: "Privacy Policy: {{appName}}",
    ogDescription:
      "Learn how {{appName}} protects your privacy and handles your data",
    twitterTitle: "Privacy Policy: {{appName}}",
    twitterDescription:
      "Learn how {{appName}} protects your privacy and handles your data",
  },
  printAriaLabel: "Print privacy policy",
  onThisPage: "On this page",
  printButton: "Print",
  title: "Privacy Policy",
  lastUpdated: "Last updated: November 2026",
  bindingVersionNotice:
    "Translation provided for convenience. The German version of this document is the legally binding one.",
  introduction:
    "At {{appName}}, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our uncensored AI chat platform.",
  sections: {
    informationCollect: {
      title: "Information We Collect",
      description:
        "We collect information that you provide directly to us and information automatically collected when you use our service.",
    },
    personalData: {
      title: "Personal Data",
      description: "We may collect the following personal information:",
      items: {
        name: "Name and contact information",
        email: "Email address",
        phone: "Phone number (optional)",
        company: "Company name (optional)",
        billing: "Billing and payment information",
        payment: "Payment method and transaction details",
      },
    },
    socialMediaData: {
      title: "Social Media Data",
      description:
        "If you connect social media accounts, we may collect profile information and related data as permitted by those platforms.",
    },
    derivativeData: {
      title: "Derivative Data",
      description:
        "We may create anonymized, aggregated data from your usage to improve our services.",
    },
    useOfInformation: {
      title: "Use of Your Information",
      description:
        "We use the information we collect for various purposes, including:",
      items: {
        provide: "To provide and maintain our AI chat services",
        process: "To process your transactions and manage your account",
        send: "To send you updates, newsletters, and marketing communications",
        respond: "To respond to your inquiries and provide customer support",
        monitor:
          "To monitor and analyze usage patterns to improve our platform",
        personalize:
          "To personalize your experience and deliver relevant content",
      },
    },
    disclosure: {
      title: "Information Disclosure",
      description:
        "We may disclose your information when required by law or to protect our rights and safety.",
    },
    businessTransfers: {
      title: "Change of Operator",
      description:
        "If the service is handed over to a new operator, your data may be transferred to them.",
    },
    thirdParty: {
      title: "Third-Party Services",
      description:
        "We share personal data only with the service providers listed below, and only as far as each one needs it to do its job. Your account, chats and files are stored on our own servers in Germany.",
      aiNotice:
        "When you chat or generate media, the request goes to the provider of the model you picked. It contains what the model needs to answer: your message, earlier messages of the conversation, attachments, the instructions and memories the AI uses, and the display name you set in your profile. We do not send your email address. Routers such as OpenRouter, NanoGPT and Venice pass the request on to the company that runs the model, for example OpenAI, Anthropic, Google, xAI, DeepSeek or Mistral. How long a provider keeps a request and what it may do with it is governed by that provider's terms. We do not train AI models on your chats.",
      transfers:
        "Several providers are based outside the EU. Where a provider offers the European Commission's Standard Contractual Clauses, for example Stripe and OpenRouter, they are the basis for the transfer. Otherwise, data is transferred under the provider's terms.",
      labels: {
        purpose: "Purpose",
        data: "Data shared",
        privacyPolicy: "Privacy policy",
      },
      groups: {
        hosting: "Hosting and storage",
        email: "Email",
        payments: "Payments",
        ai: "AI models",
        web: "Web search and page fetching",
      },
      providers: {
        hostinger: {
          purpose:
            "Rents us the two virtual servers that run the platform. We operate the database, file storage (MinIO) and cache (Redis) ourselves on these servers. No separate cloud storage service is involved.",
          data: "Everything stored on the platform: account details, chats, memories, uploaded and generated files, payment records.",
          location: "Servers in Germany, company in Lithuania (EU)",
        },
        hosttech: {
          purpose:
            "Mail server for our email addresses. Sends sign-up codes, receipts and newsletters and receives the emails you send us.",
          data: "Email address, name, content of the emails.",
          location: "Switzerland (EU adequacy decision)",
        },
        stripe: {
          purpose: "Card payments, subscriptions and invoices.",
          data: "Name, email address, billing address, payment details, amounts, your account ID. We never see your full card number.",
          location:
            "Stripe Payments Europe, Ltd., Ireland (EU); parent company in the USA",
        },
        paypal: {
          purpose: "Only if you choose PayPal in the Stripe checkout.",
          data: "Name, email address, payment details, amounts.",
          location: "PayPal (Europe) S.à r.l. et Cie, S.C.A., Luxembourg (EU)",
        },
        nowpayments: {
          purpose: "Cryptocurrency payments.",
          data: "Your account ID in the order number, product and amount, wallet and transaction data. For recurring crypto payments also your email address.",
          location: "Saint Vincent and the Grenadines",
        },
        openrouter: {
          purpose:
            "Routes most chat models (for example from OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral and Qwen) and some image and video models to the company that runs them.",
          data: "Content of the AI request as described above. The company that runs the model receives the same content.",
          location: "USA",
        },
        nanogpt: {
          purpose: "Chat, image and video models, text to speech.",
          data: "Content of the AI request, text you have read aloud.",
          location: "USA",
        },
        venice: {
          purpose: "Uncensored chat, image and video models.",
          data: "Content of the AI request.",
          location: "USA",
        },
        uncensoredAi: {
          purpose: "UncensoredLM chat model.",
          data: "Content of the AI request.",
          location: "USA",
        },
        freedomgpt: {
          purpose: "FreedomGPT chat models.",
          data: "Content of the AI request.",
          location: "USA",
        },
        gabAi: {
          purpose: "Gab AI chat models.",
          data: "Content of the AI request.",
          location: "USA",
        },
        modelslab: {
          purpose: "Image, video and music models.",
          data: "Your prompt and any images you attach.",
          location: "India",
        },
        edenAi: {
          purpose:
            "Speech to text and text to speech. Passes audio or text on to the speech engine it uses.",
          data: "Voice recordings you transcribe, text you have read aloud.",
          location: "France (EU)",
        },
        braveSearch: {
          purpose: "Web search when the AI searches the internet.",
          data: "The search query the AI writes. No account data.",
          location: "USA",
        },
        kagi: {
          purpose:
            "Web search and short web answers when the AI searches the internet.",
          data: "The search query the AI writes. No account data.",
          location: "USA",
        },
        scrappey: {
          purpose: "Loads a web page when the AI reads a link.",
          data: "The address of the page. No account data.",
          location: "EU",
        },
      },
    },
    legal: {
      title: "Legal Basis for Processing",
      description:
        "We process your personal data based on your consent, contractual necessity, legal obligations, and our legitimate interests in providing and improving our services.",
    },
    security: {
      title: "Security Measures",
      description:
        "We implement appropriate technical and organizational security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.",
    },
    rights: {
      title: "Your Data Protection Rights",
      description:
        "Under data protection laws, you have certain rights regarding your personal information:",
      items: {
        access: "Right to access your personal data",
        correction: "Right to correct inaccurate or incomplete data",
        deletion:
          "Right to deletion: delete your account from Settings and your personal data is erased",
        objection: "Right to object to processing of your data",
        portability:
          "Right to data portability: export all your data as JSON from Settings",
      },
    },
    cookies: {
      title: "Cookies and Tracking",
      description:
        "No third-party trackers, no ad pixels, no fingerprinting. One first-party cookie identifies your browser to us. To learn which channels bring people who stay, we record how you first arrived and how you most recently arrived through a tagged link: the campaign tags in the link (utm_source, utm_medium, utm_campaign, utm_content, utm_term), the referring website's domain (never the full address), the page you landed on (without its query string) and any referral code. We then note when you first chatted, signed up, confirmed the newsletter, paid and renewed. This is linked to your account when you sign up, used only in aggregate to judge marketing channels, never sold or shared, and deleted with your account.",
    },
    guestMedia: {
      title: "Media Created Without an Account",
      description:
        "Images, audio and video generated without an account, including in incognito mode, are stored on our servers so they can be shown and downloaded. If you never create an account, these files are deleted automatically after 4 months.",
    },
    thirdPartySites: {
      title: "Third-Party Websites",
      description:
        "Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.",
    },
    children: {
      title: "Children's Privacy",
      description:
        "Our service is not intended for children under 13. We do not knowingly collect data from children.",
    },
    changes: {
      title: "Changes to This Policy",
      description:
        "We may update this Privacy Policy from time to time. We will notify you of any significant changes.",
    },
    controller: {
      description:
        "The controller responsible for your data under the GDPR is {{operator}}, {{address}}.",
    },
    gdpr: {
      title: "GDPR Compliance",
      description:
        "For users in the European Union, we respect your GDPR rights. Export your data any time from Settings. When you delete your account, your profile, chats, memories, addresses, newsletter subscription and contact details are erased, and personal details on linked visitor records are removed. Anonymous aggregate statistics and the credit ledger (no longer linked to you) are kept. Contact us for anything Settings does not cover.",
    },
  },
  post: {
    title: "Privacy Policy",
    description: "Privacy Policy endpoint",
    form: {
      title: "Privacy Policy Configuration",
      description: "Configure privacy policy parameters",
    },
    response: {
      title: "Response",
      description: "Privacy Policy response data",
    },
    errors: {
      unauthorized: {
        title: "Unauthorized",
        description: "Authentication required",
      },
      validation: {
        title: "Validation Error",
        description: "Invalid request parameters",
      },
      server: {
        title: "Server Error",
        description: "Internal server error occurred",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unknown error occurred",
      },
      network: {
        title: "Network Error",
        description: "Network error occurred",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access forbidden",
      },
      notFound: {
        title: "Not Found",
        description: "Resource not found",
      },
      conflict: {
        title: "Conflict",
        description: "Data conflict occurred",
      },
    },
    success: {
      title: "Success",
      description: "Operation completed successfully",
    },
  },
};
