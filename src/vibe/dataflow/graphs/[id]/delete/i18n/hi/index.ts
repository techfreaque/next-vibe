import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  delete: {
    title: "ग्राफ़ हटाएँ",
    titleShort: "ग्राफ़ हटाएँ",
    description: "ग्राफ़ हमेशा के लिए हटाएँ। हमेशा के लिए ख़त्म।",
    fields: {
      id: { label: "ग्राफ़ ID", description: "हटाने वाले ग्राफ़ का UUID" },
    },
    response: {
      deletedId: "हटाए गए ग्राफ़ की ID",
    },
    widget: {
      confirmDescription:
        "स्थायी। ग्राफ़ और उसका कॉन्फ़िग मिट जाता है, वापसी नहीं। ये सिर्फ़ तब चलता है जब ग्राफ़ में कोई डेटा नहीं हो; नहीं तो उसे आर्काइव करें।",
      deletedIdLabel: "हटाई गई ID:",
      backToList: "ग्राफ़ पर वापस",
    },
    success: {
      title: "ग्राफ़ हट गया",
      description: "ग्राफ़ हमेशा के लिए हटा दिया गया",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आप ये ग्राफ़ नहीं हटा सकते",
      },
      server: {
        title: "सर्वर एरर",
        description: "ग्राफ़ नहीं हट सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "गलत पैरामीटर",
      },
      notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
      conflict: {
        title: "डेटा है",
        description: "ग्राफ़ में डेटा पॉइंट हैं: हटाने की जगह आर्काइव करें",
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
