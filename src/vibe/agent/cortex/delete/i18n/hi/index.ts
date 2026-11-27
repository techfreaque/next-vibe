import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  delete: {
    title: "हटाएँ",
    titleShort: "फ़ाइल हटाएँ",
    description: "फ़ाइल या फ़ोल्डर हटाएँ। हमेशा के लिए।",
    dynamicTitle: "{{path}} हटाया गया",
    status: {
      loading: "हटा रहे हैं...",
      done: "हटा दिया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "पाथ",
        description: "क्या हटाना है",
      },
      recursive: {
        label: "अंदर का सब कुछ भी",
        description: "अंदर की हर चीज़ भी हटाएँ",
      },
    },
    submitButton: {
      label: "हटाएँ",
      loadingText: "हटा रहे हैं...",
    },
    response: {
      path: { content: "पाथ" },
      nodesDeleted: { text: "हटाए गए" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "पाथ जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: { title: "एक्सेस नहीं है", description: "इसे हटाया नहीं जा सकता" },
      notFound: { title: "नहीं मिला", description: "इस पाथ पर कुछ नहीं है" },
      server: { title: "सर्वर एरर", description: "कुछ टूट गया" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: {
        title: "खाली नहीं है",
        description: 'फ़ोल्डर में सामान है। "अंदर का सब कुछ भी" चुनें',
      },
    },
    success: {
      title: "हटा दिया",
      description: "चला गया",
    },
  },
};
