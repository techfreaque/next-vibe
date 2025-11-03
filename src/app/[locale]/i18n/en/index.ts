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
  ...componentsTranslations,
  story: siteTranslations,
  notFound: notFoundTranslations,
  admin: adminTranslations,
  chat: chatTranslations,
  help: helpTranslations,
  subscription: subscriptionTranslations,
  track: trackTranslations,
  user: userTranslations,
  native: {
    page: {
      welcome: "Welcome to Next Vibe",
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
          description: "Using next-vibe-ui components that work seamlessly across platforms",
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
    logoPart1: "Unbottled",
    logoPart2: ".ai",
    appName: "Unbottled.ai",
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
    company: {
      name: "Unbottled.ai",
      legalForm: "Limited Liability Company (LLC)",
      registrationNumber: "REG-2024-UNBOTTLED-AI",
      address: {
        title: "Address",
        street: "123 AI Innovation Drive",
        city: "San Francisco, CA 94105",
        country: "United States",
        addressIn1Line:
          "123 AI Innovation Drive, San Francisco, CA 94105, United States",
      },
      responsiblePerson: {
        name: "Chief Executive Officer",
      },
    },
    selector: {
      country: "Country",
      language: "Language",
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
    countries: {
      global: "Global",
      de: "Germany",
      pl: "Poland",
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
