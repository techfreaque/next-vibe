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
  get: {
    title: "बातचीत का पाथ देखें",
    titleShort: "मैसेज पाथ",
    description: "किसी खास बातचीत के पाथ वाले मैसेज देखें",
    container: {
      title: "बातचीत का पाथ",
      description: "चुनी हुई बातचीत ब्रांच के मैसेज",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड का पाथ चाहिए उसकी ID",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "थ्रेड का रूट फ़ोल्डर (क्लाइंट राउटिंग के लिए)",
    },
    leafMessageId: {
      label: "लीफ़ मैसेज ID",
      description:
        "जिस आखिरी (सबसे गहरे) मैसेज तक का पाथ चाहिए उसकी ID। खाली छोड़ें तो सबसे नया।",
    },
    before: {
      label: "इस मैसेज ID से पहले",
      description: "इस मैसेज ID से पहले की हिस्ट्री लोड करें (कर्सर-आधारित पेजिनेशन)",
    },
    response: {
      title: "पाथ के मैसेज",
      description: "बातचीत के पाथ में आने वाले मैसेज",
      messages: {
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
          sequenceId: {
            content: "सीक्वेंस ID",
          },
          authorId: {
            content: "ऑथर ID",
          },
          authorName: {
            content: "ऑथर का नाम",
          },
          isAI: {
            content: "AI है",
          },
          model: {
            content: "मॉडल",
          },
          skill: {
            content: "स्किल",
          },
          errorType: {
            content: "एरर का प्रकार",
          },
          errorMessage: {
            content: "एरर मैसेज",
          },
          errorCode: {
            content: "एरर कोड",
          },
          metadata: {
            content: "मेटाडेटा",
          },
          upvotes: {
            content: "अपवोट",
          },
          downvotes: {
            content: "डाउनवोट",
          },
          searchVector: {
            content: "सर्च वेक्टर",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
          },
        },
      },
      hasOlderHistory: {
        content: "पुरानी हिस्ट्री है",
      },
      hasNewerMessages: {
        content: "नए मैसेज हैं",
      },
      resolvedLeafMessageId: {
        content: "तय हुआ लीफ़ मैसेज ID",
      },
      oldestLoadedMessageId: {
        content: "सबसे पुराना लोड हुआ मैसेज ID",
      },
      compactionBoundaryId: {
        content: "कॉम्पैक्शन बाउंड्री ID",
      },
      newerChunkAnchorId: {
        content: "नए चंक का एंकर ID",
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
        description: "बातचीत का पाथ देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "आपको यह बातचीत का पाथ देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "थ्रेड नहीं मिला",
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
      noRootMessage: {
        title: "रूट मैसेज नहीं है",
        description: "इस थ्रेड में कोई रूट मैसेज नहीं है",
      },
      getFailed: {
        title: "पाथ नहीं मिला",
        description: "बातचीत का पाथ नहीं मिल सका",
      },
    },
    success: {
      title: "सफल",
      description: "बातचीत का पाथ मिल गया",
    },
  },
};

export default translations;
