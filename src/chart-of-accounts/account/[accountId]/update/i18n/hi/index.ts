import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  patch: {
    title: "अकाउंट एडिट करें",
    titleShort: "अकाउंट एडिट करें",
    description:
      "अकाउंट का नाम, विवरण या क्रम बदलें। सिस्टम अकाउंट पर टाइप और सबटाइप नहीं बदले जा सकते।",
    accountId: {
      label: "अकाउंट",
      description: "जिस अकाउंट को एडिट करना है",
      placeholder: "अकाउंट UUID",
    },
    code: {
      label: "कोड",
      description: "अकाउंट कोड",
    },
    type: {
      label: "टाइप",
      description: "अकाउंट का प्रकार",
    },
    subtype: {
      label: "सबटाइप",
      description: "अकाउंट का सबटाइप",
    },
    isSystem: {
      label: "सिस्टम अकाउंट",
      description: "क्या यह सिस्टम अकाउंट है",
    },
    isActive: {
      label: "सक्रिय",
      description: "क्या यह अकाउंट सक्रिय है",
    },
    name: {
      label: "अकाउंट का नाम",
      description: "इस अकाउंट का दिखने वाला नाम",
      placeholder: "जैसे प्राप्य खाते (Accounts Receivable)",
    },
    accountDescription: {
      label: "विवरण",
      description: "इस अकाउंट के मकसद के बारे में वैकल्पिक नोट्स",
      placeholder: "जैसे ग्राहकों से लेनी बकाया राशि का हिसाब",
    },
    sortOrder: {
      label: "क्रम",
      description: "पैरेंट समूह में छोटे नंबर पहले दिखते हैं",
      placeholder: "जैसे 10",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "सभी फ़ील्ड जाँचें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "सिस्टम अकाउंट के फ़ील्ड नहीं बदले जा सकते",
      },
      server: {
        title: "सर्वर एरर",
        description: "अकाउंट अपडेट नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
      notFound: {
        title: "नहीं मिला",
        description: "अकाउंट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "अकाउंट अपडेट हुआ",
      description: "बदलाव सेव हुए",
    },
    widget: {
      savedLabel: "सेव हुआ",
      failedLabel: "फ़ेल",
      back: "वापस",
      submit: "बदलाव सेव करें",
      sectionDetails: "ब्योरा",
      viewAccount: "अकाउंट खोलें",
      successTitle: "बदलाव सेव हुए",
      successDesc: "अकाउंट अपडेट हो गया।",
      systemNotice: "सिस्टम अकाउंट: टाइप और सबटाइप लॉक हैं।",
      inactiveNotice: "यह अकाउंट निष्क्रिय है।",
      selectPrompt: "एडिट करने के लिए अकाउंट चुनें",
    },
  },
  title: "अकाउंट एडिट करें",
  description: "अकाउंट का ब्योरा एडिट करें",
  category: "चार्ट ऑफ़ अकाउंट्स",
  tag: "अकाउंट",
};
