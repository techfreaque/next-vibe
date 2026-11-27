import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    moderation: "मॉडरेशन",
  },
  get: {
    title: "रिपोर्ट किया गया कंटेंट",
    titleShort: "मॉडरेशन कतार",
    description:
      "रिपोर्ट किए गए और छिपाए गए पब्लिक फ़ीड पोस्ट और शेयर्ड थ्रेड, सबसे ज़रूरी पहले",
    fields: {
      minReports: {
        label: "न्यूनतम रिपोर्ट",
        description: "शामिल करने के लिए कम से कम खुली रिपोर्ट (डिफ़ॉल्ट: 1)",
      },
      limit: {
        label: "सीमा",
        description: "ज़्यादा से ज़्यादा कितने थ्रेड लौटाने हैं",
      },
      offset: {
        label: "ऑफ़सेट",
        description: "पेजिंग के लिए छोड़े जाने वाले थ्रेड की संख्या",
      },
    },
    response: {
      threads: {
        id: { content: "थ्रेड ID" },
        title: { content: "टाइटल" },
        rootFolderId: { content: "फ़ोल्डर" },
        authorId: { content: "लेखक ID" },
        authorName: { content: "लेखक" },
        authorBanned: { content: "लेखक बैन है" },
        moderationStatus: { content: "स्टेटस" },
        reportCount: { content: "रिपोर्ट" },
        reasons: { content: "कारण" },
        latestNote: { content: "आखिरी नोट" },
        updatedAt: { content: "अपडेट का समय" },
      },
      totalCount: { content: "कुल" },
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "रिक्वेस्ट सही नहीं है" },
      network: { title: "नेटवर्क एरर", description: "कनेक्शन नहीं बन पाया" },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "प्रतिबंधित", description: "एडमिन एक्सेस ज़रूरी है" },
      notFound: { title: "नहीं मिला", description: "थ्रेड नहीं मिला" },
      server: {
        title: "सर्वर एरर",
        description: "मॉडरेशन कतार लोड नहीं हो सकी",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "डेटा में टकराव हुआ" },
    },
    success: {
      title: "कतार लोड हो गई",
      description: "रिपोर्ट किया गया कंटेंट मिल गया",
    },
    note: "“{{note}}”",
    empty: "कोई रिपोर्ट नहीं। कम्युनिटी सही चल रही है।",
    status: {
      visible: "दिख रहा है",
      underReview: "समीक्षा में",
      removed: "हटा दिया गया",
      authorBanned: "लेखक बैन है",
    },
    reasons: {
      spam: "स्पैम",
      illegal: "गैरकानूनी",
      abuse: "गाली-गलौज",
      csamFlag: "बच्चों की सुरक्षा",
      other: "अन्य",
    },
    action: {
      dismiss: "खारिज करें",
      remove: "हटाएँ",
      banAuthor: "हटाएँ और लेखक को बैन करें",
    },
    backButton: {
      label: "वापस",
    },
  },
  patch: {
    title: "कंटेंट मॉडरेट करें",
    titleShort: "मॉडरेट करें",
    description:
      "रिपोर्ट खारिज करके थ्रेड बहाल करें, थ्रेड हटाएँ, या हटाकर लेखक को बैन करें",
    fields: {
      id: {
        label: "थ्रेड ID",
        description: "मॉडरेट किए जाने वाले थ्रेड की ID",
      },
      action: {
        label: "कार्रवाई",
        description:
          "dismiss = बहाल करें और रिपोर्ट साफ़ करें, remove = हमेशा के लिए छिपाएँ, ban = हटाएँ और लेखक को बैन करें",
      },
    },
    actions: {
      dismiss: "रिपोर्ट खारिज करें (बहाल करें)",
      remove: "कंटेंट हटाएँ",
      banAuthor: "हटाएँ और लेखक को बैन करें",
    },
    response: {
      patchId: { content: "थ्रेड ID" },
      patchStatus: { content: "नया स्टेटस" },
      patchReportCount: { content: "रिपोर्ट की संख्या" },
      authorBanned: { content: "लेखक बैन है" },
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "रिक्वेस्ट सही नहीं है" },
      network: { title: "नेटवर्क एरर", description: "कनेक्शन नहीं बन पाया" },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "प्रतिबंधित", description: "एडमिन एक्सेस ज़रूरी है" },
      notFound: { title: "नहीं मिला", description: "थ्रेड नहीं मिला" },
      server: {
        title: "सर्वर एरर",
        description: "थ्रेड मॉडरेट नहीं हो सका",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "डेटा में टकराव हुआ" },
      noAuthor: {
        title: "कोई रजिस्टर्ड लेखक नहीं",
        description:
          "यह थ्रेड गेस्ट ने पोस्ट किया है, इसलिए बैन करने के लिए कोई अकाउंट नहीं है",
      },
    },
    success: {
      title: "कंटेंट मॉडरेट हो गया",
      description: "कार्रवाई लागू हो गई",
    },
  },
};
