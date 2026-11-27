import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },

  list: {
    title: "पाइपलाइन ग्राफ़",
    titleShort: "ग्राफ़",
    description: "मौजूदा यूज़र को दिखने वाले सभी ग्राफ़ लिस्ट करें",
    fields: {
      search: {
        label: "खोजें",
        description: "नाम या स्लग से ग्राफ़ फ़िल्टर करें",
        placeholder: "ग्राफ़ खोजें...",
      },
    },
    container: {
      title: "ग्राफ़",
      description: "सभी पाइपलाइन ग्राफ़",
    },
    response: {
      graphs: "ग्राफ़",
      graph: {
        id: "ID",
        slug: "स्लग",
        name: "नाम",
        description: "विवरण",
        ownerType: "मालिक का टाइप",
        ownerId: "मालिक ID",
        isActive: "एक्टिव",
        createdAt: "बनाने का समय",
      },
    },
    success: {
      title: "ग्राफ़ लोड हुए",
      description: "पाइपलाइन ग्राफ़ मिल गए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ग्राफ़ लिस्ट करने के लिए लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "ग्राफ़ लोड नहीं हो पाए",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "ग्राफ़ लोड करते समय कोई अनपेक्षित एरर आया",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई ग्राफ़ नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स कॉन्फ़्लिक्ट हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "ग्राफ़ लोड करते समय नेटवर्क रिक्वेस्ट फ़ेल हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आगे बढ़ने से पहले बदलाव सेव करें",
      },
    },
  },

  widget: {
    refresh: "रीफ़्रेश करें",
    createGraph: "नया ग्राफ़",
    active: "एक्टिव",
    inactive: "निष्क्रिय",
    empty: "अभी कोई ग्राफ़ नहीं। अपना पहला पाइपलाइन ग्राफ़ बनाएँ।",
    error: "ग्राफ़ लोड नहीं हो पाए। दोबारा कोशिश करें।",
    archive: "आर्काइव",
    delete: "हटाएँ",
    searchPlaceholder: "नाम, स्लग या विवरण से खोजें…",
    noMatchTitle: "कोई ग्राफ़ मेल नहीं खाता",
    noMatchHint: "कोई दूसरा सर्च शब्द आज़माएँ",
    clearSearch: "सर्च हटाएँ",
    searchResults: "नतीजे:",
    stats: {
      total: "कुल ग्राफ़",
      active: "एक्टिव",
      system: "सिस्टम",
      admin: "एडमिन",
    },
  },

  create: {
    title: "ग्राफ़ बनाएँ",
    description: "नया पाइपलाइन ग्राफ़ बनाएँ",
    fields: {
      name: {
        label: "नाम",
        description: "ग्राफ़ का डिस्प्ले नाम",
        placeholder: "मेरा ग्राफ़",
      },
      slug: {
        label: "स्लग",
        description: "यूनिक आइडेंटिफ़ायर (छोटे अक्षर और हाइफ़न)",
        placeholder: "my-graph",
      },
      description: {
        label: "विवरण",
        description: "वैकल्पिक विवरण",
        placeholder: "",
      },
      config: {
        label: "कॉन्फ़िग",
        description: "ग्राफ़ DAG कॉन्फ़िगरेशन",
      },
    },
    response: {
      id: "ग्राफ़ ID",
    },
    success: {
      title: "ग्राफ़ बन गया",
      description: "पाइपलाइन ग्राफ़ बन गया",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ग्राफ़ बनाने के लिए लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "ग्राफ़ नहीं बन पाया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "ग्राफ़ बनाते समय कोई अनपेक्षित एरर आया",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "ग्राफ़ कॉन्फ़िगरेशन गलत है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "ग्राफ़ स्लग पहले से मौजूद है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "ग्राफ़ बनाते समय नेटवर्क रिक्वेस्ट फ़ेल हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आगे बढ़ने से पहले बदलाव सेव करें",
      },
    },
  },
};
