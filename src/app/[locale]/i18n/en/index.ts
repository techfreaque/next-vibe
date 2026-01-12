import { translations as componentsTranslations } from "../../_components/i18n/en";
import { translations as notFoundTranslations } from "../../[...notFound]/i18n/en";
import { translations as adminTranslations } from "../../admin/i18n/en";
import { translations as chatTranslations } from "../../chat/i18n/en";
import { translations as helpTranslations } from "../../help/i18n/en";
import { translations as siteTranslations } from "../../story/i18n/en";
import { translations as subscriptionTranslations } from "../../subscription/i18n/en";
import { translations as trackTranslations } from "../../track/i18n/en";
import { translations as userTranslations } from "../../user/i18n/en";

export const translations = {
  _components: componentsTranslations,
  story: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  help: helpTranslations,
  subscription: subscriptionTranslations,
  track: trackTranslations,
  user: userTranslations,
  currency: {
    usd: "USD",
    eur: "EUR",
    gbp: "GBP",
    jpy: "JPY",
    chf: "CHF",
    cad: "CAD",
    aud: "AUD",
    cny: "CNY",
    inr: "INR",
    brl: "BRL",
  },
  newsletter: {
    title: "Stay Updated",
    description:
      "Subscribe to our newsletter for the latest updates and insights.",
    emailPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    subscription: {
      unsubscribe: {
        title: "Unsubscribe",
        confirmButton: "Confirm Unsubscribe",
      },
    },
  },
  pages: {
    error: {
      title: "Something went wrong!",
      message: "We're sorry, but something unexpected happened.",
      errorId: "Error ID: {{id}}",
      error_message: "Error: {{message}}",
      stackTrace: "Stack trace: {{stack}}",
      tryAgain: "Try again",
      backToHome: "Back to Home",
    },
    notFound: {
      title: "Page Not Found",
      description:
        "The page you're looking for doesn't exist or has been moved.",
      goBack: "Go Back",
      goHome: "Go to Homepage",
    },
  },
  meta: {
    home: {
      title: "{{appName}} - Uncensored AI Chat",
      category: "AI Chat Platform",
      description:
        "Experience truly uncensored AI conversations with {{modelCount}}+ models. No filters, no restrictions, just honest AI.",
      imageAlt: "{{appName}} - Uncensored AI Chat Platform",
      keywords:
        "uncensored AI, AI chat, GPT-4, Claude, Gemini, AI models, no filters, honest AI, AI conversations",
    },
    aboutUs: {
      title: "About Us - {{appName}}",
      category: "About",
      description:
        "Learn about {{appName}}'s mission to provide uncensored AI conversations",
      imageAlt: "About {{appName}}",
      keywords: "about {{appName}}, uncensored AI, AI mission, AI values",
      ogTitle: "About {{appName}} - Uncensored AI Platform",
      ogDescription:
        "Discover our mission to democratize access to uncensored AI",
      twitterTitle: "About {{appName}}",
      twitterDescription:
        "Learn about our mission for uncensored AI conversations",
    },
    privacyPolicy: {
      title: "Privacy Policy - {{appName}}",
      category: "Legal",
      description:
        "Learn how {{appName}} protects your privacy and handles your data",
      imageAlt: "Privacy Policy",
      keywords:
        "privacy policy, data protection, user privacy, {{appName}} privacy",
    },
    termsOfService: {
      title: "Terms of Service - {{appName}}",
      category: "Legal",
      description: "Read the terms and conditions for using {{appName}}",
      imageAlt: "Terms of Service",
      keywords:
        "terms of service, terms and conditions, user agreement, {{appName}} terms",
    },
    imprint: {
      title: "Legal Notice - {{appName}}",
      category: "Legal",
      description: "Legal information and company details for {{appName}}",
      imageAlt: "Legal Notice",
      keywords: "imprint, legal notice, company information, {{appName}} legal",
    },
    careers: {
      title: "Careers - {{appName}}",
      category: "Careers",
      description: "Join our team and help build the future of uncensored AI",
      imageAlt: "Careers at {{appName}}",
      keywords: "careers, jobs, AI jobs, remote work, {{appName}} careers",
    },
    pricing: {
      title: "Pricing - {{appName}}",
      category: "Pricing",
      description:
        "Affordable AI chat plans for everyone. Start free with 10 daily messages.",
      imageAlt: "Pricing Plans",
      keywords:
        "pricing, plans, subscription, AI chat pricing, {{appName}} pricing",
      ogTitle: "Pricing Plans - {{appName}}",
      ogDescription: "Simple, transparent pricing for uncensored AI chat",
      twitterTitle: "Pricing - {{appName}}",
      twitterDescription: "Start free with 10 daily messages",
    },
    billing: {
      category: "Billing",
    },
    notFound: {
      title: "404 - Page Not Found",
      category: "Error",
      description: "The page you're looking for doesn't exist",
      imageAlt: "404 Not Found",
      keywords: "404, not found, error",
    },
  },
  socialMedia: {
    platforms: {
      facebook: "Facebook",
      twitter: "Twitter",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      threads: "Threads",
      mastodon: "Mastodon",
      tiktok: "TikTok",
      pinterest: "Pinterest",
      snapchat: "Snapchat",
      whatsapp: "WhatsApp",
    },
  },
  layout: {
    metadata: {
      defaultTitle: "{{appName}} - Uncensored AI Chat",
      category: "AI Chat Platform",
      description:
        "Experience truly uncensored AI conversations with {{modelCount}}+ models. No filters, no restrictions, just honest AI.",
    },
    openGraph: {
      imageAlt: "{{appName}} - Uncensored AI Chat Platform",
    },
    structuredData: {
      organization: {
        types: {
          organization: "Organization",
          contactPoint: "ContactPoint",
        },
        contactPoint: {
          telephone: "{{config.group.contact.telephone}}",
          contactType: "Customer Service",
        },
      },
    },
  },
  constants: {
    languages: {
      en: "English",
      de: "Deutsch",
      pl: "Polski",
    },
  },
  native: {
    page: {
      welcome: "Welcome to {{appName}}",
      description: "A unified Next.js and React Native application",
      locale: {
        title: "Current Locale",
        description: "Your current language and region settings",
      },
      features: {
        title: "Platform Features",
        description: "This page works on both web and mobile",
        unified: {
          title: "✅ Unified Components",
          description:
            "Using next-vibe-ui components that work seamlessly across platforms",
        },
        types: {
          title: "✅ Type Safety",
          description: "Full TypeScript support with proper type inference",
        },
        async: {
          title: "✅ Async Server Components",
          description: "Next.js 15 async page components work in React Native",
        },
      },
      links: {
        chat: "Go to Chat",
        help: "Go to Help",
        about: "Go to About Us",
        story: "Our Story",
        designTest: "Design Test",
      },
      status: {
        title: "System Status",
        platform: "Platform",
        universal: "Universal",
        routing: "Routing",
        filebased: "File-based",
        styling: "Styling",
        nativewind: "NativeWind",
      },
    },
  },
  common: {
    active: "Active",
    filter: "Filter",
    refresh: "Refresh",
    notAvailable: "N/A",
    weekday: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
    selector: {
      country: "Country",
      language: "Language",
    },
    countries: {
      global: "Global",
      de: "Germany",
      pl: "Poland",
      us: "United States",
    },
    languages: {
      en: "English",
      de: "German",
      pl: "Polish",
    },
    accessibility: {
      srOnly: {
        enableLightMode: "Enable light mode",
        enableDarkMode: "Enable dark mode",
        toggleMenu: "Toggle menu",
        previousPage: "Previous page",
        nextPage: "Next page",
        more: "More",
        close: "Close",
      },
    },
    actions: {
      previous: "Previous",
      next: "Next",
    },
    searchCountries: "Search countries",
    noCountryFound: "No country found",
    preferred: "Preferred",
    allCountries: "All Countries",
    enterPhoneNumber: "Enter phone number",
    selectDate: "Select date",
    unknownFieldType: "Unknown field type",
    required: "Required",
    addTags: "Add tags",
    addCustomValue: "Add '{{value}}'",
    selectOption: "Select option",
    searchOptions: "Search options",
    customValue: "Custom value",
    noOptionsFound: "No options found",
    useCustomValue: "Use custom value",
    cancel: "Cancel",
    error: {
      title: "Error",
      message: "Something went wrong",
      description: "An error occurred. Please try again.",
      tryAgain: "Try Again",
      sending_sms: "Failed to send SMS",
      boundary: {
        stackTrace: "Stack Trace",
        componentStack: "Component Stack",
        errorDetails: "Error Details",
        name: "Name:",
        errorMessage: "Message:",
        cause: "Cause:",
      },
    },
    errors: {
      unknown: "An unknown error occurred",
    },
    api: {
      notifications: {
        welcome: {
          title: "Welcome!",
          description: "Thanks for joining us. Let's get started!",
        },
      },
    },
  },
  shared: {
    error: {
      title: "Error",
      userError: "User error occurred",
      invalidToken: "Invalid or expired token",
    },
  },
  ui: {
    iconPicker: {
      title: "Select Icon",
      selectIcon: "Select an icon",
      searchPlaceholder: "Search icons...",
      showing: "Showing {{count}} of {{total}} icons",
      categories: {
        all: "All",
        general: "General",
        ai: "AI & Tech",
        education: "Education",
        communication: "Communication",
        science: "Science",
        arts: "Arts",
        finance: "Finance",
        lifestyle: "Lifestyle",
        security: "Security",
        programming: "Programming",
        platforms: "Platforms",
        aiProviders: "AI Providers",
        media: "Media",
        special: "Special",
        navigation: "Navigation",
        ui: "UI & Controls",
      },
    },
    countries: {
      global: "Global",
      de: "Germany",
      pl: "Poland",
      us: "United States",
    },
    languages: {
      en: "English",
      de: "German",
      pl: "Polish",
    },
    error: {
      title: "Error",
      message: "Something went wrong",
      description: "An error occurred. Please try again.",
      tryAgain: "Try Again",
      sending_sms: "Failed to send SMS",
      boundary: {
        stackTrace: "Stack Trace",
        componentStack: "Component Stack",
        errorDetails: "Error Details",
        name: "Name:",
        errorMessage: "Message:",
        cause: "Cause:",
      },
    },
    errors: {
      unknown: "An unknown error occurred",
    },
    success: {
      title: "Success",
      message: "Operation completed successfully",
      description: "Your action was completed successfully.",
    },
    info: {
      title: "Information",
      message: "Please note",
      description: "Here's some information for you.",
    },
    api: {
      notifications: {
        welcome: {
          title: "Welcome!",
          description: "Thanks for joining us. Let's get started!",
        },
      },
    },
    footer: {
      description:
        "Transform your social media presence with professional content creation and strategic management.",
      copyright: "© {{year}} {{appName}}. All rights reserved.",
      tagline: "Elevate your social media game",
      social: {
        facebook: "Facebook",
        instagram: "Instagram",
        twitter: "Twitter",
        linkedin: "LinkedIn",
      },
      services: {
        title: "Services",
        socialAccountSetup: "Social Account Setup",
        contentCreation: "Content Creation",
        strategyDevelopment: "Strategy Development",
        performanceAnalytics: "Performance Analytics",
        communityManagement: "Community Management",
        audienceBuilding: "Audience Building",
        adCampaigns: "Ad Campaigns",
      },
      company: {
        title: "Company",
        aboutUs: "About Us",
        contactUs: "Contact Us",
        careers: "Careers",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        imprint: "Imprint",
      },
    },
  },
};
