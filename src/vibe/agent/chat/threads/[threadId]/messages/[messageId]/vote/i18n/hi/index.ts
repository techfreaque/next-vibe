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
  post: {
    title: "मैसेज पर वोट करें",
    titleShort: "मैसेज को वोट करें",
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
};
