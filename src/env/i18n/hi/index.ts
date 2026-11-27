import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  appName: "unbottled.ai",
  appDescription:
    "{{modelCount}} मॉडल्स वाला फ़्री स्पीच AI प्लेटफ़ॉर्म। फ़िल्टर आप तय करते हैं। प्राइवेसी पहले दिन से।",
  framework: "NextVibe.dev",
  websiteUrl: "https://unbottled.ai",
  group: {
    name: "Unbottled.ai",
    foundedYear: 2024,
    address: {
      title: "पता",
      street: "Bachstrasse 1",
      city: "84359 Simbach am Inn",
      country: "जर्मनी",
      addressIn1Line: "Bachstrasse 1, 84359 Simbach am Inn, जर्मनी",
    },
    responsiblePerson: {
      name: "Marcus Brandstätter",
    },
    contact: {
      title: "संपर्क",
      description: "इस प्राइवेसी पॉलिसी के बारे में कोई सवाल हो, तो हमसे यहाँ संपर्क करें:",
      content: "इन सेवा की शर्तों के बारे में कोई सवाल हो, तो हमसे यहाँ संपर्क करें:",
    },
  },
  emails: {
    support: "hi@unbottled.ai",
  },
  services: {
    supportLevel: "24/7 सपोर्ट",
  },
  social: {
    twitterHandle: "@unbottled_ai",
    twitterUrl: "https://twitter.com/unbottled_ai",
    discordInvite: "https://discord.gg/hBuA22SzkR",
  },
  timezone: {
    PL: "Europe/Warsaw",
    DE: "Europe/Berlin",
    FR: "Europe/Paris",
    IT: "Europe/Rome",
    ES: "Europe/Madrid",
    SK: "Europe/Bratislava",
    US: "America/New_York",
    GLOBAL: "UTC",
  },
  error: {
    title: "कुछ गड़बड़ हो गई",
    message: "एक अनचाही गड़बड़ी हुई। कृपया पेज रीफ़्रेश करें।",
    tryAgain: "फिर से कोशिश करें",
    description: "फिर से कोशिश करें। दिक्कत बनी रहे, तो सपोर्ट से संपर्क करें।",
  },
  countries: {
    ...regionalCountryNames("hi"),
    global: "ग्लोबल",
    de: "जर्मनी",
    pl: "पोलैंड",
    fr: "फ़्रांस",
    us: "अमेरिका",
    it: "इटली",
    es: "स्पेन",
  },
  languages: {
    en: "अंग्रेज़ी",
    de: "जर्मन",
    pl: "पोलिश",
    fr: "फ़्रेंच",
    it: "इतालवी",
    es: "स्पेनिश",
    sk: "स्लोवाक",
    hi: "हिन्दी",
  },
};
