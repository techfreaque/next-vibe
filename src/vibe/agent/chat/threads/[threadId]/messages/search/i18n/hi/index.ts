import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    messages: "मैसेज",
  },
  search: {
    get: {
      title: "मैसेज सर्च करें",
      titleShort: "मैसेज सर्च करें",
      description: "फ़ुल-टेक्स्ट सर्च से किसी थ्रेड के अंदर मैसेज खोजें",
      container: {
        title: "मैसेज सर्च",
        description: "इस थ्रेड में मैसेज खोजें",
      },
      threadId: {
        label: "थ्रेड ID",
        description: "जिस थ्रेड में खोजना है उसकी ID",
      },
      query: {
        label: "सर्च क्वेरी",
        description: "मैसेज में खोजने वाला टेक्स्ट",
      },
      sections: {
        pagination: {
          title: "पेजिनेशन",
          description: "पेज नेविगेशन की सेटिंग्स",
        },
      },
      page: {
        label: "पेज",
        description: "जो पेज नंबर चाहिए",
      },
      limit: {
        label: "लिमिट",
        description: "हर पेज पर नतीजों की संख्या",
      },
      response: {
        results: {
          message: {
            title: "मैसेज",
            id: {
              content: "मैसेज ID",
            },
            content: {
              content: "कंटेंट",
            },
            role: {
              content: "रोल",
            },
            rank: {
              content: "रेलेवेंस स्कोर",
            },
            headline: {
              content: "स्निपेट",
            },
            createdAt: {
              content: "बनाने का समय",
            },
          },
        },
        totalCount: {
          content: "कुल नतीजे",
        },
      },
      errors: {
        validationFailed: {
          title: "वैलिडेशन फ़ेल",
          description: "सर्च के पैरामीटर सही नहीं हैं",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो पा रहा",
        },
        unauthorized: {
          title: "अनुमति नहीं है",
          description: "मैसेज सर्च करने के लिए लॉग इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं है",
          description: "आपको इस थ्रेड में मैसेज सर्च करने की अनुमति नहीं है",
        },
        notFound: {
          title: "थ्रेड नहीं मिला",
          description: "यह थ्रेड मौजूद नहीं है या आपके पास इसका एक्सेस नहीं है",
        },
        serverError: {
          title: "सर्वर एरर",
          description: "सर्च के दौरान सर्वर में अंदरूनी गड़बड़ी हुई",
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
        description: "मैसेज सर्च पूरी हुई",
      },
    },
  },
};
