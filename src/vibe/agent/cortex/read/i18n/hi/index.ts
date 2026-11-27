import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "फ़ाइल पढ़ें",
    titleShort: "फ़ाइल पढ़ें",
    description: "कोई भी फ़ाइल खोलें: आपके नोट्स, थ्रेड, मेमोरी, स्किल या टास्क।",
    dynamicTitle: "{{path}} पढ़ा गया",
    status: {
      loading: "पढ़ रहे हैं...",
      done: "लोड हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      path: {
        label: "पाथ",
        description:
          "कौन-सी फ़ाइल। अपनी भाषा का रूट इस्तेमाल करें (जैसे DE के लिए /erinnerungen/, PL के लिए /wspomnienia/)। उदाहरण: /documents/notes/ideas.md",
      },
      maxLines: {
        label: "अधिकतम लाइनें",
        description: "सिर्फ़ इतनी लाइनें दिखाएँ",
      },
    },
    submitButton: {
      label: "पढ़ें",
      loadingText: "पढ़ रहे हैं...",
    },
    emptyFile: "यह फ़ाइल खाली है।",
    response: {
      path: { content: "पाथ" },
      content: { content: "कंटेंट" },
      size: { text: "साइज़" },
      truncated: { text: "छोटा किया गया" },
      readonly: { text: "सिर्फ़ पढ़ने लायक" },
      nodeType: { text: "टाइप" },
      updatedAt: { content: "अपडेट हुआ" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "पाथ जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: { title: "एक्सेस नहीं है", description: "आप इसे नहीं पढ़ सकते" },
      notFound: { title: "नहीं मिला", description: "इस पाथ पर कुछ नहीं है" },
      server: { title: "सर्वर एरर", description: "कुछ टूट गया" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: { title: "टकराव", description: "वर्शन मेल नहीं खाता" },
    },
    success: {
      title: "मिल गया",
      description: "फ़ाइल लोड हो गई",
    },
  },
};
