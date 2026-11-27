import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र्स",

  widget: {
    intro: "आपके अकाउंट में साइन इन हर डिवाइस। जो पहचान में न आए उसे साइन आउट करें।",
    revokeFailed: "उस डिवाइस को साइन आउट नहीं कर सके। दोबारा कोशिश करें।",
    back: "वापस",
    loading: "सेशन लोड हो रहे हैं…",
    empty: "कोई एक्टिव सेशन नहीं",
    emptyHint: "हर बार लॉग इन करने पर एक सेशन बनता है",
    browserSession: "ब्राउज़र सेशन",
    revoke: "साइन आउट करें",
    revoking: "रद्द हो रहा है…",
    currentSession: "मौजूदा",
    created: "बनाया गया",
    expires: "एक्सपायर होता है",
    never: "कभी नहीं",
  },

  list: {
    title: "साइन इन डिवाइस",
    titleShort: "मेरे सेशन",
    description: "अपने अकाउंट के सभी एक्टिव सेशन देखें",
    tag: "सेशन",
    response: {
      sessions: "सेशन",
    },
    success: {
      title: "सेशन मिल गए",
      description: "आपके एक्टिव सेशन मिल गए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: { title: "वैलिडेशन एरर", description: "अमान्य रिक्वेस्ट" },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर",
        detail: "आपके सेशन लोड नहीं हो सके: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: { title: "प्रतिबंधित", description: "एक्सेस प्रतिबंधित है" },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
      conflict: { title: "टकराव", description: "डेटा में टकराव" },
    },
  },
  create: {
    title: "सेशन टोकन बनाएँ",
    titleShort: "टोकन बनाएँ",
    description: "प्रोग्रामैटिक एक्सेस के लिए नाम वाला सेशन टोकन बनाएँ",
    tag: "सेशन",
    form: {
      name: "टोकन का नाम",
      namePlaceholder: "जैसे मेरा एजेंट बॉट",
    },
    response: {
      token: "टोकन",
      id: "सेशन ID",
      name: "नाम",
      message: "इस टोकन को कॉपी करें, यह दोबारा नहीं दिखेगा",
    },
    success: {
      title: "सेशन बन गया",
      description: "आपका सेशन टोकन बन गया है",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: { title: "वैलिडेशन एरर", description: "अमान्य रिक्वेस्ट" },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर",
        detail: "सेशन टोकन नहीं बन सका: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: { title: "प्रतिबंधित", description: "एक्सेस प्रतिबंधित है" },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
      conflict: { title: "टकराव", description: "डेटा में टकराव" },
    },
  },
  revoke: {
    title: "सेशन रद्द करें",
    titleShort: "सेशन रद्द करें",
    description: "ID से सेशन टोकन रद्द करें",
    tag: "सेशन",
    response: {
      message: "सेशन रद्द हो गया",
    },
    success: {
      title: "सेशन रद्द हो गया",
      description: "सेशन रद्द कर दिया गया है",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: { title: "वैलिडेशन एरर", description: "अमान्य रिक्वेस्ट" },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर",
        detail: "सेशन रद्द नहीं हो सका: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: { title: "प्रतिबंधित", description: "एक्सेस प्रतिबंधित है" },
      notFound: {
        title: "नहीं मिला",
        description: "सेशन नहीं मिला",
        detail: "ID {{sessionId}} वाला कोई सेशन आपके अकाउंट का नहीं है",
      },
      conflict: { title: "टकराव", description: "डेटा में टकराव" },
    },
  },
};
