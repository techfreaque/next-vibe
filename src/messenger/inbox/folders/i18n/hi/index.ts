import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "फ़ोल्डर की सूची",
  titleShort: "फ़ोल्डर",
  description: "किसी मैसेंजर अकाउंट के उपलब्ध फ़ोल्डर की सूची",
  tag: "इनबॉक्स",

  container: {
    title: "फ़ोल्डर",
    description: "चुने गए अकाउंट के उपलब्ध फ़ोल्डर",
  },

  accountId: {
    label: "अकाउंट",
    description: "जिस मैसेंजर अकाउंट के फ़ोल्डर देखने हैं",
    placeholder: "अकाउंट UUID",
  },

  folders: {
    label: "फ़ोल्डर",
    path: { label: "पाथ" },
    name: { label: "नाम" },
    displayName: { label: "डिस्प्ले नाम" },
    specialUseType: { label: "प्रकार" },
    messageCount: { label: "मैसेज" },
    unseenCount: { label: "अनदेखे" },
  },

  errors: {
    validation: { title: "वैलिडेशन एरर", description: "अपना इनपुट जाँचें" },
    unauthorized: { title: "अनधिकृत", description: "लॉगिन ज़रूरी है" },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर",
      detail: "फ़ोल्डर लोड नहीं हो सके: {{error}}",
    },
    unknown: { title: "अनजान एरर", description: "अप्रत्याशित एरर" },
    forbidden: { title: "मना है", description: "एक्सेस नहीं मिला" },
    network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
    notFound: {
      title: "अकाउंट नहीं मिला",
      description: "मैसेंजर अकाउंट नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
  },

  success: {
    title: "फ़ोल्डर लोड हुए",
    description: "फ़ोल्डर सफलतापूर्वक मिल गए",
  },
};
