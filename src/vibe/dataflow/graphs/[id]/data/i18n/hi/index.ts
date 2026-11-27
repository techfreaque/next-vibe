import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "ग्राफ़ का ब्योरा",
    titleShort: "ग्राफ़ डेटा",
    description: "इंडिकेटर और सिग्नल के साथ ग्राफ़ चार्ट देखें",
    fields: {
      id: { label: "ग्राफ़ ID", description: "ग्राफ़ का UUID" },
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "टाइम सीरीज़ का बकेट साइज़",
      },
      cursor: {
        label: "कर्सर",
        description: "पेजिनेशन के लिए सबसे पुराना लोड हुआ टाइमस्टैम्प",
      },
    },
    response: {
      graph: {
        id: "ID",
        slug: "स्लग",
        name: "नाम",
        description: "विवरण",
        ownerType: "मालिक का टाइप",
        isActive: "एक्टिव",
        createdAt: "बनाने का समय",
        config: "कॉन्फ़िग",
      },
      series: {
        nodeId: "नोड ID",
        timestamp: "टाइमस्टैम्प",
        value: "वैल्यू",
      },
      signals: {
        nodeId: "नोड ID",
        timestamp: "टाइमस्टैम्प",
        fired: "फ़ायर हुआ",
      },
    },
    widget: {
      loading: "ग्राफ़ लोड हो रहा है...",
      back: "वापस",
      active: "एक्टिव",
      inactive: "निष्क्रिय",
      nodes: "नोड",
      trigger: "ट्रिगर",
      backtest: "बैकटेस्ट",
      edit: "एडिट करें",
      archive: "आर्काइव",
      promote: "प्रमोट करें",
      signal: "सिग्नल",
      noData: "इस रेंज में कोई डेटा नहीं",
      loadingEarlierData: "पुराना डेटा लोड हो रहा है…",
    },
    success: {
      title: "ग्राफ़ लोड हो गया",
      description: "ग्राफ़ सफलतापूर्वक मिल गया",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
      server: { title: "सर्वर एरर", description: "ग्राफ़ लोड नहीं हो सका" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      validation: { title: "वैलिडेशन फ़ेल हुआ", description: "गलत ID" },
      notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
      conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
