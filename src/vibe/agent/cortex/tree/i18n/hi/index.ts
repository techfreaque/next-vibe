import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "ट्री दिखाएँ",
    titleShort: "फ़ाइल ट्री",
    description:
      "पूरा फ़ोल्डर ढाँचा एक नज़र में देखें। /ssh/ पाथ के लिए मशीनें और माउंट का सार दिखता है। और गहराई में जाने के लिए cortex-list या cortex-exec इस्तेमाल करें।",
    dynamicTitle: "{{path}} का ट्री",
    status: {
      loading: "स्कैन हो रहा है...",
      done: "स्कैन हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "पाथ",
        description: "यहाँ से शुरू करें (डिफ़ॉल्ट: रूट)",
      },
      depth: {
        label: "गहराई",
        description: "कितने लेवल गहराई तक",
      },
    },
    submitButton: {
      label: "ट्री दिखाएँ",
      loadingText: "लोड हो रहा है...",
    },
    response: {
      tree: { content: "ट्री" },
      totalFiles: { text: "फ़ाइलें" },
      totalDirs: { text: "फ़ोल्डर" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "पाथ और गहराई जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: { title: "एक्सेस नहीं है", description: "यह नहीं देख सकते" },
      notFound: { title: "नहीं मिला", description: "फ़ोल्डर मौजूद नहीं है" },
      server: { title: "सर्वर एरर", description: "कुछ टूट गया" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: { title: "टकराव", description: "दोबारा कोशिश करें" },
    },
    success: {
      title: "ट्री",
      description: "यह रहा ढाँचा",
    },
  },
};
