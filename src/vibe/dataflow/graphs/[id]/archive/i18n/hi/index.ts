import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: {
    vibeSense: "vibe-sense",
  },
  post: {
    title: "ग्राफ़ आर्काइव करें",
    titleShort: "ग्राफ़ आर्काइव करें",
    description: "ग्राफ़ को सॉफ़्ट-डिलीट करें (निष्क्रिय करें और आर्काइव चिह्नित करें)",
    fields: {
      id: {
        label: "ग्राफ़ ID",
        description: "आर्काइव करने वाले ग्राफ़ का UUID",
      },
    },
    response: {
      archivedId: "आर्काइव हुए ग्राफ़ का ID",
    },
    widget: {
      confirmDescription:
        "इससे ग्राफ़ निष्क्रिय होगा और आर्काइव चिह्नित होगा। वह शेड्यूल पर नहीं चलेगा। इसे पलटा जा सकता है।",
      archivedIdLabel: "आर्काइव हुआ ID:",
      backToList: "ग्राफ़ पर वापस",
    },
    success: {
      title: "ग्राफ़ आर्काइव हुआ",
      description: "ग्राफ़ सफलतापूर्वक आर्काइव हुआ",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "सिस्टम ग्राफ़ आर्काइव नहीं हो सकते",
      },
      server: {
        title: "सर्वर एरर",
        description: "ग्राफ़ आर्काइव नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "पैरामीटर गलत हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "ग्राफ़ नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स में टकराव",
      },
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
