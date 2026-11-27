import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    moderation: "मॉडरेशन",
  },
  post: {
    title: "कंटेंट रिपोर्ट करें",
    titleShort: "रिपोर्ट",
    description:
      "किसी पब्लिक पोस्ट या शेयर्ड थ्रेड को रिपोर्ट करें। काफ़ी लोग रिपोर्ट करें तो एडमिन के रिव्यू तक वह छिप जाता है।",
    reason: {
      label: "वजह",
      description: "इस कंटेंट में क्या गलत है?",
    },
    note: {
      label: "जानकारी",
      description: "वैकल्पिक। रिव्यूअर के लिए कॉन्टेक्स्ट जोड़ें।",
      placeholder: "रिव्यूअर को क्या पता होना चाहिए?",
    },
    reasons: {
      spam: "स्पैम",
      illegal: "गैरकानूनी कंटेंट",
      abuse: "गाली-गलौज या उत्पीड़न",
      csamFlag: "बच्चों की सुरक्षा से जुड़ी चिंता",
      other: "अन्य",
    },
    messageId: {
      label: "मैसेज ID",
      description: "जिस मैसेज की रिपोर्ट करनी है (वैकल्पिक)",
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "कोई वजह चुनें" },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "आप इस कंटेंट को रिपोर्ट नहीं कर सकते",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आप अपना ही कंटेंट रिपोर्ट नहीं कर सकते",
      },
      notFound: {
        title: "नहीं मिला",
        description: "यह कंटेंट हट चुका है या उपलब्ध नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "आपकी रिपोर्ट सबमिट नहीं हो सकी",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "पहले ही रिपोर्ट हो चुका",
        description: "आप इसे पहले ही रिपोर्ट कर चुके हैं",
      },
      rateLimited: {
        title: "बहुत ज़्यादा रिपोर्ट",
        description: "आप बहुत तेज़ी से रिपोर्ट कर रहे हैं। थोड़ी देर बाद कोशिश करें।",
      },
    },
    success: {
      title: "रिपोर्ट सबमिट हो गई",
      description: "शुक्रिया। हम हर रिपोर्ट देखते हैं।",
    },
    response: {
      reported: { content: "रिपोर्ट किया गया" },
      reportCount: { content: "रिपोर्ट की गिनती" },
      hidden: { content: "छिपा हुआ" },
    },
    backButton: {
      label: "वापस",
    },
    button: {
      submit: "रिपोर्ट सबमिट करें",
      loading: "सबमिट हो रहा है...",
    },
  },
};
