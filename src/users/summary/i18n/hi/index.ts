import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    validation: {
      title: "गलत स्टैट्स रिक्वेस्ट",
      description: "विंडो और तारीखें जाँचें",
    },
    unauthorized: {
      title: "साइन इन ज़रूरी है",
      description: "स्टैट्स देखने के लिए साइन इन करें",
    },
    forbidden: {
      title: "सिर्फ़ एडमिन",
      description: "स्टैट्स देखने के लिए आपके पास एडमिन रोल होना चाहिए",
    },
    notFound: {
      title: "कोई डेटा नहीं",
      description: "इस विंडो में रिपोर्ट करने को कुछ नहीं",
    },
    server: {
      title: "स्टैट्स की गणना नहीं हो सकी",
      description: "सर्वर यूज़र स्टैटिस्टिक्स की गणना नहीं कर सका",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "सर्वर तक नहीं पहुँच सके",
    },
    unknown: {
      title: "अनपेक्षित एरर",
      description: "स्टैट्स की गणना में कुछ गलत हो गया",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
    },
  },
  title: "अकाउंट ओवरव्यू",
  description: "कस्टमर साइनअप और ईमेल वेरिफ़िकेशन देखें। स्टाफ़ और टेस्ट अकाउंट शामिल नहीं।",
  accounts: "कस्टमर अकाउंट",
  signups: "7 दिन में नए",
  verified: "वेरिफ़ाइड ईमेल",
  unverified: "अनवेरिफ़ाइड ईमेल",
  reviewUnverified: "वेरिफ़िकेशन का इंतज़ार करते नए अकाउंट ({{count}})",
  attention: "जाँच चाहिए",
  clear: "सभी नए अकाउंट ने अपना ईमेल वेरिफ़ाई कर लिया है।",
  unavailable: "वेरिफ़िकेशन स्टेटस उपलब्ध नहीं।",
  recent: "हाल की गतिविधि",
  loading: "अकाउंट ओवरव्यू लोड हो रहा है…",
};
