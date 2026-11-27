import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "ग्राफ़ वर्ज़न हिस्ट्री",
    titleShort: "ग्राफ़ वर्ज़न",
    description: "किसी ग्राफ़ की वर्ज़न चेन लाएँ (parentVersionId से पूर्वजों तक)",
    fields: {
      id: { label: "ग्राफ़ ID", description: "ग्राफ़ की UUID" },
      versions: {
        label: "वर्ज़न",
        description: "पूर्वज वर्ज़न की क्रमबद्ध सूची (सबसे पुराना पहले)",
        id: { label: "वर्ज़न ID", description: "वर्ज़न की UUID" },
        name: { label: "नाम", description: "इस वर्ज़न पर ग्राफ़ का नाम" },
        createdAt: {
          label: "बनने का समय",
          description: "यह वर्ज़न कब बना",
        },
        isActive: {
          label: "सक्रिय",
          description: "क्या यह मौजूदा सक्रिय वर्ज़न है",
        },
      },
    },
    success: {
      title: "वर्ज़न हिस्ट्री लोड हुई",
      description: "वर्ज़न चेन सफलतापूर्वक मिल गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "इस ग्राफ़ का एक्सेस नहीं",
      },
      server: {
        title: "सर्वर एरर",
        description: "वर्ज़न हिस्ट्री लोड नहीं हो सकी",
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
