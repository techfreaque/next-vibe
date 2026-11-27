import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  page: {
    welcome: "{{appName}} में आपका स्वागत है",
    description: "लोकेल:",
    locale: {
      title: "मौजूदा लोकेल",
      description: "यह पेज लोकेल सपोर्ट दिखाता है",
    },
    features: {
      title: "प्लेटफ़ॉर्म की खूबियाँ",
      description: "यह प्लेटफ़ॉर्म कई सतहों को सपोर्ट करता है",
      unified: {
        title: "Unified Surface",
        description: "वेब, नेटिव, CLI और AI-कॉल योग्य टूल के लिए एक कोडबेस",
      },
      types: {
        title: "टाइप सेफ़्टी",
        description: "सभी प्लेटफ़ॉर्म पर सख़्त टाइप चेकिंग के साथ पूरा TypeScript सपोर्ट",
      },
      async: {
        title: "Async सपोर्ट",
        description: "async डेटा लोडिंग वाले सर्वर कॉम्पोनेंट",
      },
    },
    links: {
      chat: "चैट पर जाएँ",
      help: "हेल्प",
      about: "हमारे बारे में",
      story: "हमारी कहानी",
      designTest: "डिज़ाइन टेस्ट",
    },
    status: {
      title: "प्लेटफ़ॉर्म स्टेटस",
      platform: "प्लेटफ़ॉर्म",
      universal: "यूनिवर्सल",
      routing: "राउटिंग",
      filebased: "फ़ाइल-आधारित",
      styling: "स्टाइलिंग",
      nativewind: "NativeWind",
    },
  },
};
