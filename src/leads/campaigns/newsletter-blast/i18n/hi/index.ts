import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "न्यूज़लेटर",
  post: {
    title: "न्यूज़लेटर ब्लास्ट",
    titleShort: "ब्लास्ट",
    description:
      "सिर्फ़ पुष्ट ऑप्ट-इन को एक बार का न्यूज़लेटर भेजें। ड्राई रन हर लोकेल की गिनती दिखाता है। Send सिर्फ़ यही न्यूज़लेटर तुरंत भेजता है, और कुछ नहीं।",
    container: {
      title: "न्यूज़लेटर ब्लास्ट",
      description: "सिर्फ़ पुष्ट ऑप्ट-इन। गिनें, कतार में लगाएँ, भेजें।",
    },
    fields: {
      dryRun: {
        label: "ड्राई रन",
        description:
          "हर लोकेल में सहमति वाली ऑडियंस गिनें। कुछ नहीं लिखता, कुछ नहीं भेजता।",
      },
      send: {
        label: "अभी भेजें",
        description:
          "यह न्यूज़लेटर सहमति वाली ऑडियंस को तुरंत भेजें। बाकी लंबित कैंपेन को नहीं छूता।",
      },
    },
    response: {
      audience: "सहमति वाली ऑडियंस",
      byLocale: "हर लोकेल के प्राप्तकर्ता",
      scheduled: "नई कतार में",
      alreadyPending: "पहले से कतार में",
      cancelled: "रद्द (सहमति नहीं)",
      alreadySent: "छोड़े गए (पहले ही मिल चुका)",
      duplicates: "रद्द की गई डुप्लिकेट रो",
      errors: "एरर",
      sent: "भेजे गए",
      sendSkipped: "भेजते समय छोड़े गए (पहले ही मिल चुका)",
      sendFailed: "भेजना फ़ेल",
    },
    success: {
      title: "न्यूज़लेटर ब्लास्ट कतार में",
      description:
        "सहमति वाले प्राप्तकर्ता कतार में हैं। अभी भेजें चालू हो तो वे इसी रन में भेजे जाते हैं।",
    },
  },
  errors: {
    unauthorized: {
      title: "साइन इन नहीं है",
      description: "न्यूज़लेटर ब्लास्ट चलाने के लिए साइन इन करें।",
    },
    forbidden: {
      title: "अनुमति नहीं",
      description: "न्यूज़लेटर ब्लास्ट सिर्फ़ एडमिन चला सकते हैं।",
    },
    server: {
      title: "कुछ गड़बड़ हुई",
      description: "न्यूज़लेटर ब्लास्ट चल नहीं सका। फिर कोशिश करें।",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कुछ अनपेक्षित हुआ।",
    },
    validation: {
      title: "गलत इनपुट",
      description: "रिक्वेस्ट जाँचें और फिर कोशिश करें।",
    },
    notFound: {
      title: "नहीं मिला",
      description: "माँगा गया रिसोर्स नहीं मिला।",
    },
    conflict: {
      title: "टकराव",
      description: "यह कार्रवाई मौजूदा स्थिति से टकराती है।",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर हुआ। फिर कोशिश करें।",
    },
    unsavedChanges: {
      title: "बिना सेव बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं।",
    },
  },
};
