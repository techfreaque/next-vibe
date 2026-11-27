import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "सिस्टम में प्रमोट करें",
    titleShort: "ग्राफ़ प्रमोट करें",
    description: "एडमिन ग्राफ़ को सिस्टम-ओन्ड (रीड-ओनली, साझा) में प्रमोट करें",
    fields: {
      id: { label: "ग्राफ़ ID", description: "ग्राफ़ की UUID" },
    },
    response: {
      promotedId: "ग्राफ़ ID",
    },
    widget: {
      confirmDescription:
        "इस ग्राफ़ को प्रमोट करने पर वह सिस्टम-ओन्ड हो जाएगा और सभी यूज़र्स के साथ साझा होगा। इस slug का मौजूदा सिस्टम वर्ज़न निष्क्रिय हो जाएगा। किसी और वर्ज़न को प्रमोट करके इसे पलटा जा सकता है।",
      promotedIdLabel: "प्रमोट की गई ID:",
      viewButton: "देखें",
    },
    success: {
      title: "ग्राफ़ प्रमोट हुआ",
      description: "ग्राफ़ सफलतापूर्वक सिस्टम में प्रमोट हुआ",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "ग्राफ़ प्रमोट नहीं हो सका",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "पैरामीटर गलत हैं",
      },
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
