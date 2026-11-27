import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "फ़ाइल लिखें",
    titleShort: "फ़ाइल लिखें",
    description: "फ़ाइल सेव करें। पाथ और कंटेंट दें, बस।",
    dynamicTitle: "सेव हुआ: {{path}}",
    status: {
      loading: "लिख रहे हैं...",
      done: "सेव हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "पाथ",
        description:
          "कहाँ सेव करना है। अपनी भाषा का रूट इस्तेमाल करें (जैसे DE के लिए /dokumente/, PL के लिए /dokumenty/)। उदाहरण: /documents/notes/ideas.md",
      },
      content: {
        label: "कंटेंट",
        description: "क्या लिखना है (markdown)",
      },
      createParents: {
        label: "फ़ोल्डर बनाएँ",
        description: "रास्ते के जो फ़ोल्डर नहीं हैं, वे भी बनाएँ",
      },
    },
    submitButton: {
      label: "सेव करें",
      loadingText: "सेव हो रहा है...",
    },
    response: {
      path: { content: "पाथ" },
      size: { text: "साइज़" },
      created: { text: "नई फ़ाइल" },
      updated: { text: "अपडेट हुई" },
      updatedAt: { content: "अपडेट हुआ" },
      content: { content: "कंटेंट" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "पाथ और कंटेंट जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: {
        title: "सिर्फ़ पढ़ने लायक",
        description: "यह पाथ सिर्फ़ पढ़ने के लिए है",
      },
      notFound: {
        title: "फ़ोल्डर गायब है",
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
        description: "वहाँ पहले से कुछ है",
      },
    },
    success: {
      title: "सेव हो गया",
      description: "फ़ाइल सेव हो गई",
    },
  },
};
