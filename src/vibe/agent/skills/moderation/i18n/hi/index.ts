import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI स्किल",
  tags: {
    moderation: "मॉडरेशन",
  },
  get: {
    title: "रिपोर्ट की गई स्किल",
    titleShort: "रिपोर्ट की गई स्किल",
    description: "रिपोर्ट वाली स्किल की सूची, रिपोर्ट की गिनती के हिसाब से सॉर्ट",
    fields: {
      minReports: {
        label: "न्यूनतम रिपोर्ट",
        description: "शामिल करने के लिए न्यूनतम रिपोर्ट गिनती (डिफ़ॉल्ट: 1)",
      },
      limit: {
        label: "सीमा",
        description: "लौटाई जाने वाली स्किल की अधिकतम संख्या",
      },
      offset: {
        label: "ऑफ़सेट",
        description: "पेजिनेशन के लिए छोड़ी जाने वाली स्किल की संख्या",
      },
    },
    response: {
      skills: {
        id: { content: "स्किल ID" },
        name: { content: "नाम" },
        ownerAuthorId: { content: "मालिक ID" },
        status: { content: "स्थिति" },
        reportCount: { content: "रिपोर्ट" },
        voteCount: { content: "वोट" },
        trustLevel: { content: "ट्रस्ट स्तर" },
        publishedAt: { content: "पब्लिश होने का समय" },
        updatedAt: { content: "अपडेट होने का समय" },
      },
      totalCount: { content: "कुल" },
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "रिक्वेस्ट गलत है" },
      network: { title: "नेटवर्क एरर", description: "कनेक्शन फ़ेल" },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      notFound: { title: "नहीं मिला", description: "कोई स्किल नहीं मिली" },
      server: {
        title: "सर्वर एरर",
        description: "रिपोर्ट की गई स्किल लोड नहीं हो सकीं",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "डेटा टकराव हुआ" },
    },
    success: {
      title: "स्किल लोड हुईं",
      description: "रिपोर्ट की गई स्किल सफलतापूर्वक मिल गईं",
    },
    empty: "कोई रिपोर्ट की गई स्किल नहीं: कम्युनिटी स्वस्थ दिखती है!",
    action: {
      moderate: "मॉडरेट करें",
    },
    backButton: {
      label: "वापस",
    },
  },
  patch: {
    title: "स्किल मॉडरेट करें",
    titleShort: "स्किल मॉडरेट करें",
    description: "रिपोर्ट की गई स्किल छिपाएँ या उसकी रिपोर्ट साफ़ करें",
    fields: {
      id: {
        label: "स्किल ID",
        description: "मॉडरेट की जाने वाली स्किल की ID",
      },
      action: {
        label: "कार्रवाई",
        description:
          "hide = स्थिति UNLISTED करें, clear = रिपोर्ट गिनती 0 पर रीसेट करें",
      },
    },
    response: {
      id: { content: "स्किल ID" },
      status: { content: "नई स्थिति" },
      reportCount: { content: "रिपोर्ट गिनती" },
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "रिक्वेस्ट गलत है" },
      network: { title: "नेटवर्क एरर", description: "कनेक्शन फ़ेल" },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      notFound: { title: "नहीं मिला", description: "स्किल नहीं मिली" },
      server: {
        title: "सर्वर एरर",
        description: "स्किल मॉडरेट नहीं हो सकी",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "डेटा टकराव हुआ" },
    },
    success: {
      title: "स्किल मॉडरेट हुई",
      description: "कार्रवाई सफलतापूर्वक लागू हुई",
    },
  },
};
