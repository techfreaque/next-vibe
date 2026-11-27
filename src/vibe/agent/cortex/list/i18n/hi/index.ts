import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "फ़ोल्डर देखें",
    titleShort: "फ़ाइलें देखें",
    description: "देखें फ़ोल्डर में क्या है।",
    dynamicTitle: "{{path}} की लिस्ट",
    status: {
      loading: "लिस्ट बन रही है...",
      done: "लिस्ट बन गई",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "पाथ",
        description:
          "जिस फ़ोल्डर की लिस्ट चाहिए। /ssh → सारी मशीनें। /ssh/<name>/ → फ़ाइलें या माउंट। /ssh/<name>/<mount>/ → माउंट का कंटेंट।",
      },
    },
    submitButton: {
      label: "ब्राउज़ करें",
      loadingText: "लोड हो रहा है...",
    },
    emptyState: "यह फ़ोल्डर खाली है",
    folderNames: {
      memories: "मेमोरी",
      documents: "डॉक्यूमेंट",
      threads: "थ्रेड",
      skills: "स्किल",
      tasks: "टास्क",
      uploads: "अपलोड",
      searches: "सर्च",
      gens: "जनरेट किया मीडिया",
      favorites: "पसंदीदा",
      inbox: "इनबॉक्स",
      projects: "प्रोजेक्ट",
      knowledge: "नॉलेज",
      journal: "जर्नल",
      templates: "टेम्पलेट",
      identity: "पहचान",
      expertise: "विशेषज्ञता",
      context: "संदर्भ",
    },
    response: {
      path: { content: "पाथ" },
      entries: {
        name: { content: "नाम" },
        path: { content: "पाथ" },
        nodeType: { text: "टाइप" },
        size: { text: "साइज़" },
        updatedAt: { content: "अपडेट हुआ" },
      },
      total: { text: "कुल" },
      writable: { text: "लिखने लायक" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "पाथ जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: { title: "एक्सेस नहीं है", description: "यह फ़ोल्डर नहीं देख सकते" },
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
      title: "लिस्ट बन गई",
      description: "यह रहा अंदर का सामान",
    },
  },
};
