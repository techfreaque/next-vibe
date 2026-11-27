import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "AND",
    titleShort: "AND",
    description: "तभी चलता है जब सभी इनपुट सिग्नल एक ही टाइमस्टैंप पर चलें",
    fields: {
      signals: {
        label: "सिग्नल स्ट्रीम",
        description: "AND करने के लिए सिग्नल स्ट्रीम की ऐरे",
      },
      result: { label: "नतीजा", description: "आउटपुट सिग्नल इवेंट" },
    },
    success: {
      title: "AND का मूल्यांकन हुआ",
      description: "सिग्नल इवेंट लौटा दिए गए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "AND का मूल्यांकन फ़ेल हुआ",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
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
