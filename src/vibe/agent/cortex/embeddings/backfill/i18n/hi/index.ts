import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "एम्बेडिंग बैकफ़िल",
    titleShort: "बैकफ़िल",
    description: "जिन cortex नोड्स की एम्बेडिंग नहीं है, उनकी बनाएँ।",
    status: {
      loading: "एम्बेड हो रहा है...",
      done: "हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    widget: {
      hint: "जिन cortex नोड्स की एम्बेडिंग नहीं है, उन सबकी बनाएँ। इसमें समय लग सकता है।",
    },
    fields: {
      force: {
        label: "दोबारा एम्बेड करें",
        description:
          "पहले सारी मौजूदा एम्बेडिंग हटाएँ और शुरू से बनाएँ (सिर्फ़ कंटेंट फ़ॉर्मैट में)। एम्बेडिंग फ़ॉर्मैट बदलने पर इस्तेमाल करें।",
      },
    },
    submitButton: {
      label: "बैकफ़िल शुरू करें",
      loadingText: "प्रोसेस हो रहा है...",
    },
    response: {
      materialized: { text: "मटेरियलाइज़ हुए" },
      processed: { text: "एम्बेड हुए" },
      failed: { text: "फ़ेल हुए" },
      skipped: { text: "छोड़े गए" },
    },
    errors: {
      validation: {
        title: "गलत इनपुट",
        description: "अमान्य रिक्वेस्ट",
      },
      network: {
        title: "ऑफ़लाइन",
        description: "सर्वर तक नहीं पहुँच पा रहे",
      },
      unauthorized: {
        title: "लॉग इन नहीं हैं",
        description: "पहले लॉग इन करें",
      },
      forbidden: {
        title: "सिर्फ़ एडमिन",
        description: "एडमिन एक्सेस चाहिए",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "एम्बेडिंग सर्विस फ़ेल हो गई",
      },
      unknown: {
        title: "एरर",
        description: "कुछ गड़बड़ हो गई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: {
        title: "पहले से चल रहा है",
        description: "बैकफ़िल पहले से चल रहा है",
      },
    },
    success: {
      title: "बैकफ़िल पूरा हुआ",
      description: "सारी एम्बेडिंग प्रोसेस हो गईं",
    },
  },
};
