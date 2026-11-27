import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    messages: "मैसेज",
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
  chat: {
    enums: {
      role: {
        user: "यूज़र",
        assistant: "असिस्टेंट",
        system: "सिस्टम",
        tool: "टूल",
        error: "एरर",
      },
    },
  },
  get: {
    title: "मैसेज देखें",
    titleShort: "मैसेज",
    description: "ID से कोई खास मैसेज खोलें",
    container: {
      title: "मैसेज की जानकारी",
      description: "मैसेज की जानकारी देखें",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड में मैसेज है उसकी ID",
    },
    messageId: {
      label: "मैसेज ID",
      description: "जो मैसेज चाहिए उसकी ID",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    response: {
      title: "मैसेज रिस्पॉन्स",
      description: "मैसेज की जानकारी",
      message: {
        title: "मैसेज",
        id: {
          content: "मैसेज ID",
        },
        threadId: {
          content: "थ्रेड ID",
        },
        role: {
          content: "रोल",
        },
        content: {
          content: "कंटेंट",
        },
        parentId: {
          content: "पैरेंट मैसेज ID",
        },
        authorId: {
          content: "ऑथर ID",
        },
        isAI: {
          content: "AI है",
        },
        model: {
          content: "मॉडल",
        },
        tokens: {
          content: "टोकन",
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
        description: "रिक्वेस्ट के पैरामीटर सही नहीं हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "मैसेज देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह मैसेज देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मैसेज नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
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
      threadNotFound: {
        title: "थ्रेड नहीं मिला",
        description: "यह थ्रेड मौजूद नहीं है",
      },
      messageNotFound: {
        title: "मैसेज नहीं मिला",
        description: "यह मैसेज मौजूद नहीं है",
      },
    },
    backButton: {
      label: "वापस",
    },
    success: {
      title: "सफल",
      description: "मैसेज मिल गया",
    },
  },
  patch: {
    title: "मैसेज अपडेट करें",
    titleShort: "मैसेज अपडेट करें",
    description: "मैसेज का कंटेंट अपडेट करें",
    container: {
      title: "मैसेज एडिट करें",
      description: "मैसेज का कंटेंट अपडेट करें",
    },
    form: {
      title: "मैसेज एडिट करें",
      description: "मैसेज का कंटेंट अपडेट करें",
    },
    sections: {
      message: {
        title: "मैसेज कंटेंट",
        description: "मैसेज एडिट करें",
      },
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड में मैसेज है उसकी ID",
    },
    messageId: {
      label: "मैसेज ID",
      description: "जिस मैसेज को अपडेट करना है उसकी ID",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    content: {
      label: "कंटेंट",
      description: "अपडेट किया हुआ कंटेंट",
      placeholder: "मैसेज लिखें...",
    },
    role: {
      label: "रोल",
      description: "मैसेज का रोल (user, assistant, system)",
    },
    response: {
      title: "अपडेट किया गया मैसेज",
      description: "अपडेट किए गए मैसेज की जानकारी",
      message: {
        title: "मैसेज",
        id: {
          content: "मैसेज ID",
        },
        threadId: {
          content: "थ्रेड ID",
        },
        role: {
          content: "रोल",
        },
        content: {
          content: "कंटेंट",
        },
        parentId: {
          content: "पैरेंट मैसेज ID",
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
        description: "मैसेज का डेटा सही नहीं है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "मैसेज अपडेट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह मैसेज अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मैसेज नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
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
      threadNotFound: {
        title: "थ्रेड नहीं मिला",
        description: "यह थ्रेड मौजूद नहीं है",
      },
      messageNotFound: {
        title: "मैसेज नहीं मिला",
        description: "यह मैसेज मौजूद नहीं है",
      },
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "बदलाव सेव करें",
      loadingText: "सेव हो रहा है…",
    },
    success: {
      title: "सफल",
      description: "मैसेज अपडेट हो गया",
    },
  },
  delete: {
    title: "मैसेज हटाएँ",
    titleShort: "मैसेज हटाएँ",
    description: "थ्रेड से कोई मैसेज हटाएँ",
    container: {
      title: "मैसेज हटाएँ",
      description: "थ्रेड से मैसेज हटाएँ",
    },
    confirmTitle: "मैसेज हटाएँ",
    confirmText: "क्या आप यह मैसेज हटाना चाहते हैं? यह कदम वापस नहीं हो सकता।",
    backButton: {
      label: "रद्द करें",
    },
    submitButton: {
      label: "हटाएँ",
      loadingText: "हटाया जा रहा है…",
    },
    deleteButton: {
      label: "हटाएँ",
      loadingText: "हटाया जा रहा है…",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड में मैसेज है उसकी ID",
    },
    messageId: {
      label: "मैसेज ID",
      description: "जिस मैसेज को हटाना है उसकी ID",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    response: {
      success: { content: "सफल" },
      role: { content: "रोल" },
      content: { content: "कंटेंट" },
      parentId: { content: "पैरेंट मैसेज ID" },
      authorId: { content: "ऑथर ID" },
      isAI: { content: "AI है" },
      model: { content: "मॉडल" },
      createdAt: { content: "बनाने का समय" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर सही नहीं हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पा रहा",
      },
      unauthorized: {
        title: "अनुमति नहीं है",
        description: "मैसेज हटाने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह मैसेज हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मैसेज नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
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
        description: "जिस मैसेज के नीचे जवाब हैं उसे हटाया नहीं जा सकता",
      },
      threadNotFound: {
        title: "थ्रेड नहीं मिला",
        description: "यह थ्रेड मौजूद नहीं है",
      },
      messageNotFound: {
        title: "मैसेज नहीं मिला",
        description: "यह मैसेज मौजूद नहीं है",
      },
    },
    success: {
      title: "सफल",
      description: "मैसेज हटा दिया गया",
    },
  },
  vote: {
    category: "चैट",
    tags: {
      messages: "मैसेज",
    },
    post: {
      title: "मैसेज पर वोट करें",
      description: "मैसेज को अपवोट या डाउनवोट करें",
      container: {
        title: "वोट",
        description: "इस मैसेज पर अपना वोट दें",
      },
      form: {
        title: "मैसेज पर वोट करें",
        description: "अपवोट, डाउनवोट या अपना वोट हटाएँ",
      },
      threadId: {
        label: "थ्रेड ID",
        description: "जिस थ्रेड में मैसेज है उसकी ID",
      },
      messageId: {
        label: "मैसेज ID",
        description: "जिस मैसेज पर वोट करना है उसकी ID",
      },
      rootFolderId: {
        label: "रूट फ़ोल्डर",
        description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
      },
      vote: {
        label: "वोट",
        description: "आपका वोट: अपवोट, डाउनवोट या हटाएँ",
        placeholder: "वोट का प्रकार चुनें...",
        options: {
          upvote: "अपवोट",
          downvote: "डाउनवोट",
          remove: "वोट हटाएँ",
        },
      },
      response: {
        title: "वोट का नतीजा",
        description: "अपडेट की गई वोट गिनती",
        upvotes: {
          content: "अपवोट",
        },
        downvotes: {
          content: "डाउनवोट",
        },
        userVote: {
          content: "आपका वोट",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "वोट का डेटा सही नहीं है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो पा रहा",
        },
        unauthorized: {
          title: "अनुमति नहीं है",
          description: "वोट करने के लिए लॉग इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं है",
          description: "आपको इस मैसेज पर वोट करने की अनुमति नहीं है",
          incognitoNotAllowed: "इनकॉग्निटो थ्रेड सर्वर पर नहीं खुल सकते",
        },
        notFound: {
          title: "नहीं मिला",
          description: "मैसेज नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "वोट दर्ज नहीं हो सका",
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
          description: "वोट में टकराव हुआ",
        },
      },
      success: {
        title: "वोट दर्ज हो गया",
        description: "आपका वोट दर्ज हो गया है",
      },
    },
  },
};
