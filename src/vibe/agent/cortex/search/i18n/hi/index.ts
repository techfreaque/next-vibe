import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "सर्च",
    titleShort: "फ़ाइलें खोजें",
    description: "नाम या कंटेंट से फ़ाइलें ढूँढें। सब कुछ खोजता है।",
    dynamicTitle: "सर्च: {{query}}",
    status: {
      loading: "खोज रहे हैं...",
      done: "मिल गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      query: {
        label: "सर्च",
        description: "क्या ढूँढना है",
      },
      path: {
        label: "फ़ोल्डर में",
        description: "सिर्फ़ यहाँ खोजें (डिफ़ॉल्ट: हर जगह)",
      },
      maxResults: {
        label: "सीमा",
        description: "कितने नतीजे (डिफ़ॉल्ट: 20)",
      },
    },
    submitButton: {
      label: "सर्च करें",
      loadingText: "खोज रहे हैं...",
    },
    noResults: "कोई नतीजा नहीं मिला",
    response: {
      query: { content: "खोजा गया" },
      results: {
        path: { content: "पाथ" },
        name: { content: "नाम" },
        nodeType: { text: "टाइप" },
        excerpt: { content: "मैच" },
        score: { text: "स्कोर" },
        updatedAt: { content: "अपडेट हुआ" },
      },
      total: { text: "मिले" },
      searchMode: { text: "मोड" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "सर्च टेक्स्ट जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: { title: "एक्सेस नहीं है", description: "यहाँ सर्च नहीं कर सकते" },
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
      title: "हो गया",
      description: "सर्च पूरी हुई",
    },
  },
};
