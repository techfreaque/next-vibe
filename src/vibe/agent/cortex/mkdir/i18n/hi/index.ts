import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    viewType: {
      calendar: "कैलेंडर",
      grid: "ग्रिड",
      kanban: "कानबान",
      list: "लिस्ट",
      wiki: "विकि",
    },
  },
  post: {
    title: "नया फ़ोल्डर",
    titleShort: "नया फ़ोल्डर",
    description: "फ़ोल्डर बनाएँ।",
    dynamicTitle: "{{path}} बनाया गया",
    status: {
      loading: "बन रहा है...",
      done: "बन गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "पाथ",
        description:
          "फ़ोल्डर का पाथ। अपनी भाषा का रूट इस्तेमाल करें (जैसे DE के लिए /dokumente/, PL के लिए /dokumenty/)। उदाहरण: /documents/projects/my-app",
      },
      viewType: {
        label: "व्यू",
        description: "कैसे दिखाना है (लिस्ट, कानबान, कैलेंडर, ग्रिड)",
      },
      createParents: {
        label: "फ़ोल्डर बनाएँ",
        description: "जो पैरेंट फ़ोल्डर नहीं हैं, वे भी बनाएँ",
      },
    },
    submitButton: {
      label: "बनाएँ",
      loadingText: "बन रहा है...",
    },
    response: {
      path: { content: "पाथ" },
      created: { text: "बना" },
      alreadyExists: { text: "पहले से मौजूद" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "पाथ जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "यहाँ फ़ोल्डर नहीं बना सकते",
      },
      notFound: {
        title: "पैरेंट गायब है",
        description: "पैरेंट फ़ोल्डर मौजूद नहीं है",
      },
      server: { title: "सर्वर एरर", description: "कुछ टूट गया" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: {
        title: "पहले से मौजूद",
        description: "फ़ोल्डर पहले से है",
      },
    },
    success: {
      title: "बन गया",
      description: "फ़ोल्डर तैयार है",
    },
  },
};
