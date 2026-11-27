import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  enums: {
    threadStatus: {
      active: "सक्रिय",
      archived: "आर्काइव किया गया",
      deleted: "हटाया गया",
    },
  },
  config: {
    folders: {
      private: "प्राइवेट चैट",
      shared: "शेयर्ड चैट",
      public: "पब्लिक चैट",
      incognito: "इनकॉग्निटो चैट",
      background: "बैकग्राउंड थ्रेड",
      remote: "रिमोट चैट",
    },
  },
  tags: {
    threads: "थ्रेड",
  },
  errors: {
    not_implemented_on_native:
      "नेटिव प्लेटफ़ॉर्म पर {{method}} उपलब्ध नहीं है। यह ऑपरेशन वेब वर्शन में करें।",
  },
  get: {
    title: "चैट थ्रेड देखें",
    titleShort: "थ्रेड",
    description: "ID से कोई चैट थ्रेड खोलें",
    container: {
      title: "थ्रेड की जानकारी",
      description: "थ्रेड की पूरी जानकारी देखें",
    },
    id: {
      label: "थ्रेड ID",
      description: "थ्रेड की यूनिक पहचान",
      placeholder: "थ्रेड ID डालें...",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    response: {
      thread: {
        title: "थ्रेड की जानकारी",
        description: "थ्रेड की पूरी जानकारी",
        id: {
          content: "थ्रेड ID",
        },
        userId: {
          content: "यूज़र ID",
        },
        leadId: {
          content: "लीड ID",
        },
        threadTitle: {
          content: "शीर्षक",
        },
        rootFolderId: {
          content: "रूट फ़ोल्डर ID",
        },
        folderId: {
          content: "फ़ोल्डर ID",
        },
        status: {
          content: "स्टेटस",
        },
        defaultModel: {
          content: "डिफ़ॉल्ट मॉडल",
        },
        defaultTone: {
          content: "डिफ़ॉल्ट स्किल",
        },
        systemPrompt: {
          content: "सिस्टम प्रॉम्प्ट",
        },
        pinned: {
          content: "पिन किया गया",
        },
        archived: {
          content: "आर्काइव किया गया",
        },
        tags: {
          content: "टैग",
        },
        published: {
          content: "पब्लिश किया गया",
        },
        streamingState: {
          content: "स्ट्रीमिंग स्टेटस",
        },
        searchVector: {
          content: "सर्च वेक्टर",
        },
        preview: {
          content: "प्रीव्यू",
        },
        metadata: {
          content: "मेटाडेटा",
        },
        createdAt: {
          content: "बनाने का समय",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "थ्रेड ID सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "थ्रेड देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह थ्रेड देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "थ्रेड नहीं मिला",
        description: "यह थ्रेड नहीं मिल सका",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
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
        title: "टकराव",
        description: "बदलावों में टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "थ्रेड मिल गया",
    },
  },
  patch: {
    title: "चैट थ्रेड अपडेट करें",
    titleShort: "थ्रेड अपडेट करें",
    description: "मौजूदा चैट थ्रेड अपडेट करें",
    container: {
      title: "थ्रेड अपडेट करें",
      description: "थ्रेड की सेटिंग्स बदलें",
    },
    id: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड को अपडेट करना है उसकी यूनिक पहचान",
      placeholder: "थ्रेड ID डालें...",
    },
    sections: {
      updates: {
        title: "थ्रेड अपडेट",
        description: "जो फ़ील्ड बदलने हैं",
      },
    },
    threadTitle: {
      label: "शीर्षक",
      description: "थ्रेड का शीर्षक",
      placeholder: "थ्रेड का शीर्षक लिखें...",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    folderId: {
      label: "फ़ोल्डर",
      description: "थ्रेड किस फ़ोल्डर में रखना है",
    },
    status: {
      label: "स्टेटस",
      description: "थ्रेड का स्टेटस",
    },
    defaultModel: {
      label: "डिफ़ॉल्ट मॉडल",
      description: "इस थ्रेड का डिफ़ॉल्ट AI मॉडल",
    },
    defaultTone: {
      label: "डिफ़ॉल्ट स्किल",
      description: "इस थ्रेड की डिफ़ॉल्ट स्किल",
    },
    systemPrompt: {
      label: "सिस्टम प्रॉम्प्ट",
      description: "इस थ्रेड के लिए कस्टम सिस्टम प्रॉम्प्ट",
    },
    pinned: {
      label: "पिन किया गया",
      description: "इस थ्रेड को सबसे ऊपर पिन करें",
    },
    archived: {
      label: "आर्काइव किया गया",
      description: "इस थ्रेड को आर्काइव करें",
    },
    tags: {
      label: "टैग",
      description: "व्यवस्थित रखने के लिए टैग",
    },
    published: {
      label: "पब्लिश किया गया",
      description: "इस थ्रेड को लिंक से सबके लिए खोलें (सिर्फ़ SHARED फ़ोल्डर में)",
    },
    response: {
      thread: {
        title: "अपडेट किया गया थ्रेड",
        description: "अपडेट के बाद थ्रेड की जानकारी",
        id: {
          content: "थ्रेड ID",
        },
        userId: {
          content: "यूज़र ID",
        },
        leadId: {
          content: "लीड ID",
        },
        threadTitle: {
          content: "शीर्षक",
        },
        rootFolderId: {
          content: "रूट फ़ोल्डर ID",
        },
        folderId: {
          content: "फ़ोल्डर ID",
        },
        status: {
          content: "स्टेटस",
        },
        defaultModel: {
          content: "डिफ़ॉल्ट मॉडल",
        },
        defaultTone: {
          content: "डिफ़ॉल्ट स्किल",
        },
        systemPrompt: {
          content: "सिस्टम प्रॉम्प्ट",
        },
        pinned: {
          content: "पिन किया गया",
        },
        archived: {
          content: "आर्काइव किया गया",
        },
        tags: {
          content: "टैग",
        },
        published: {
          content: "पब्लिश किया गया",
        },
        searchVector: {
          content: "सर्च वेक्टर",
        },
        preview: {
          content: "प्रीव्यू",
        },
        metadata: {
          content: "मेटाडेटा",
        },
        createdAt: {
          content: "बनाने का समय",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "थ्रेड का डेटा सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "थ्रेड अपडेट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह थ्रेड अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "थ्रेड नहीं मिला",
        description: "अपडेट करने वाला थ्रेड नहीं मिला",
        detail: "थ्रेड नहीं मिला: {{threadId}}",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
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
        title: "टकराव",
        description: "अपडेट के दौरान टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "थ्रेड अपडेट हो गया",
    },
  },
  delete: {
    title: "चैट थ्रेड हटाएँ",
    titleShort: "थ्रेड हटाएँ",
    description: "चैट थ्रेड हटाएँ",
    container: {
      title: "थ्रेड हटाएँ",
      description: "थ्रेड हमेशा के लिए हटाएँ",
    },
    id: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड को हटाना है उसकी यूनिक पहचान",
      placeholder: "थ्रेड ID डालें...",
      helpText: "चेतावनी: यह कदम वापस नहीं हो सकता",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    response: {
      userId: {
        content: "मालिक",
      },
      title: {
        content: "शीर्षक",
      },
      folderId: {
        content: "फ़ोल्डर",
      },
      status: {
        content: "स्टेटस",
      },
      preview: {
        content: "प्रीव्यू",
      },
      createdAt: {
        content: "बनाया गया",
      },
      updatedAt: {
        content: "अपडेट किया गया",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "थ्रेड ID सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "थ्रेड हटाने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह थ्रेड हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "थ्रेड नहीं मिला",
        description: "हटाने वाला थ्रेड नहीं मिला",
        detail: "थ्रेड नहीं मिला: {{threadId}}",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
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
        title: "टकराव",
        description: "जुड़ी हुई चीज़ों की वजह से थ्रेड हटाया नहीं जा सकता",
      },
    },
    success: {
      title: "सफल",
      description: "थ्रेड हटा दिया गया",
    },
  },
  widget: {
    screenshot: {
      capture: "स्क्रीनशॉट लें",
      capturing: "कैप्चर हो रहा है...",
    },
  },
};
