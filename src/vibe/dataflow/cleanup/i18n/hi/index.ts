import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  cleanup: {
    name: "Vibe Sense क्लीनअप",
    description: "पुराने डेटापॉइंट हटाता है और स्नैपशॉट कैश एक्सपायर करता है",
  },
  graphRunner: {
    name: "Vibe Sense ग्राफ़ रनर",
    description: "सभी cron-ट्रिगर पाइपलाइन ग्राफ़ चलाता है जिनका समय आ गया है",
  },
  post: {
    title: "Vibe Sense क्लीनअप",
    titleShort: "Sense क्लीनअप",
    description: "डेटापॉइंट के लिए रिटेंशन क्लीनअप चलाएँ और स्नैपशॉट एक्सपायर करें",
    response: {
      nodesProcessed: "प्रोसेस हुए नोड",
      totalDeleted: "हटाई गई पंक्तियाँ",
      snapshotsDeleted: "हटाए गए स्नैपशॉट",
      graphsChecked: "जाँचे गए ग्राफ़",
      graphsExecuted: "चलाए गए ग्राफ़",
    },
    success: {
      title: "क्लीनअप पूरा हुआ",
      description: "रिटेंशन क्लीनअप ख़त्म हुआ",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "क्लीनअप फ़ेल हुआ",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "रिक्वेस्ट गलत है",
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
