import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "टास्क मैनेजमेंट",
  description: "बैकग्राउंड टास्क चलाता है और साइड टास्क मैनेज करता है",
  common: {
    taskName: "टास्क का नाम",
    taskNamesDescription: "फ़िल्टर करने के लिए टास्क के नाम",
    detailed: "विस्तृत",
    detailedDescription: "विस्तृत जानकारी शामिल करें",
    active: "सक्रिय",
    total: "कुल",
    uptime: "अपटाइम",
    id: "ID",
    status: "स्टेटस",
    lastRun: "आख़िरी रन",
    nextRun: "अगला रन",
    schedule: "शेड्यूल",
  },
  post: {
    title: "यूनिफ़ाइड टास्क रनर",
    titleShort: "टास्क रनर",
    description: "बैकग्राउंड टास्क और साइड टास्क के लिए यूनिफ़ाइड टास्क रनर मैनेज करें",
    container: {
      title: "यूनिफ़ाइड टास्क रनर मैनेजमेंट",
      description:
        "उस यूनिफ़ाइड टास्क रनर को कंट्रोल करें जो बैकग्राउंड और साइड दोनों टास्क संभालता है",
    },
    fields: {
      action: {
        label: "कार्रवाई",
        description: "टास्क रनर पर की जाने वाली कार्रवाई",
        options: {
          start: "रनर शुरू करें",
          stop: "रनर रोकें",
          status: "स्टेटस देखें",
          restart: "रनर रीस्टार्ट करें",
        },
      },
      taskFilter: {
        label: "टास्क फ़िल्टर",
        description: "किस्म से टास्क फ़िल्टर करें",
        options: {
          all: "सभी टास्क",
          cron: "सिर्फ़ क्रॉन टास्क",
          side: "सिर्फ़ साइड टास्क",
        },
      },
      dryRun: {
        label: "ड्राई रन",
        description: "असल बदलाव किए बिना ड्राई रन करें",
      },
    },
    response: {
      success: "ऑपरेशन सफल",
      actionResult: "कार्रवाई का नतीजा",
      message: "जवाब का संदेश",
      timestamp: "टाइमस्टैम्प",
    },
    reasons: {
      previousInstanceRunning: "पिछला इंस्टेंस अभी चल रहा है",
    },
    messages: {
      taskSkipped: "टास्क छोड़ा गया",
      taskCompleted: "टास्क सफलतापूर्वक पूरा हुआ",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "आंतरिक सर्वर एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
      unsaved: {
        title: "बिना सेव बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      execution: {
        title: "टास्क एक्ज़ीक्यूशन एरर",
        description: "टास्क नहीं चल सका",
      },
      taskAlreadyRunning: {
        title: "टास्क पहले से चल रहा है",
        description: "बताया गया टास्क पहले से चल रहा है",
      },
      sideTaskExecution: {
        title: "साइड टास्क एक्ज़ीक्यूशन एरर",
        description: "साइड टास्क नहीं चल सका",
      },
    },
    success: {
      title: "सफल",
      description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
    },
  },
};
