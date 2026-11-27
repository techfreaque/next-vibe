import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI टूल",
  tags: {
    skills: "स्किल",
  },
  post: {
    title: "स्किल रिपोर्ट करें",
    titleShort: "स्किल रिपोर्ट करें",
    description:
      "मॉडरेशन के लिए किसी कम्युनिटी स्किल की रिपोर्ट करें। एक यूज़र की एक स्किल पर एक ही रिपोर्ट गिनी जाती है।",
    dynamicTitle: "रिपोर्ट: {{name}}",
    reason: {
      label: "वजह",
      description: "आप यह स्किल क्यों रिपोर्ट कर रहे हैं?",
      placeholder: "समस्या बताएँ...",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कोई वजह बताएँ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "रिपोर्ट करने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आप यह स्किल रिपोर्ट नहीं कर सकते",
      },
      notFound: { title: "नहीं मिला", description: "स्किल नहीं मिली" },
      server: {
        title: "सर्वर एरर",
        description: "आपकी रिपोर्ट भेजते समय एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "पहले ही रिपोर्ट हो चुकी",
        description: "आप यह स्किल पहले ही रिपोर्ट कर चुके हैं",
      },
    },
    success: {
      title: "रिपोर्ट भेज दी गई",
      description: "कम्युनिटी को सुरक्षित रखने में मदद के लिए शुक्रिया",
    },
    response: {
      reported: { content: "रिपोर्ट हुई" },
      reportCount: { content: "रिपोर्ट की संख्या" },
    },
    backButton: {
      label: "वापस",
    },
    button: {
      submit: "रिपोर्ट भेजें",
      loading: "भेज रहे हैं...",
    },
  },
};
