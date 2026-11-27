/**
 * Thread Search API - Hindi Translations
 */
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  enums: {
    threadStatus: {
      active: "एक्टिव",
      archived: "आर्काइव्ड",
      deleted: "डिलीटेड",
    },
  },
  tags: {
    threads: "थ्रेड",
  },
  search: {
    get: {
      title: "थ्रेड खोजें",
      titleShort: "थ्रेड खोजें",
      description: "फ़ुल-टेक्स्ट सर्च से थ्रेड के टाइटल, प्रीव्यू और सिस्टम प्रॉम्प्ट में खोजें",
      container: {
        title: "थ्रेड सर्च",
        description: "रिलेवेंस रैंकिंग के साथ थ्रेड खोजें",
      },
      query: {
        label: "सर्च क्वेरी",
        description: "सर्च शब्द लिखें। कोट्स में फ़्रेज़ और AND/OR ऑपरेटर चलते हैं",
        placeholder: "थ्रेड खोजें...",
      },
      sections: {
        pagination: {
          title: "पेजिनेशन",
          description: "नतीजों का पेज कंट्रोल",
        },
      },
      page: {
        label: "पेज",
        description: "पेज नंबर (1 से शुरू)",
      },
      limit: {
        label: "प्रति पेज नतीजे",
        description: "हर पेज पर नतीजों की संख्या (1-100)",
      },
      sortBy: {
        label: "इससे सॉर्ट करें",
        description: "नतीजे रिलेवेंस या तारीख़ से सॉर्ट करें",
        options: {
          relevance: "रिलेवेंस",
          date: "तारीख़ (सबसे नया पहले)",
        },
      },
      includeArchived: {
        label: "आर्काइव्ड शामिल करें",
        description: "सर्च नतीजों में आर्काइव्ड थ्रेड भी शामिल करें",
      },
      response: {
        results: {
          title: "सर्च नतीजे",
          description: "आपकी क्वेरी से मेल खाते थ्रेड",
          thread: {
            id: {
              label: "थ्रेड ID",
            },
            title: {
              label: "टाइटल",
            },
            preview: {
              label: "प्रीव्यू",
            },
            rank: {
              label: "रिलेवेंस स्कोर",
              description: "ज़्यादा स्कोर यानी बेहतर मैच",
            },
            headline: {
              label: "स्निपेट",
              description: "मेल खाए शब्दों वाला हाइलाइट किया अंश",
            },
            status: {
              label: "स्टेटस",
            },
            createdAt: {
              label: "बनाने का समय",
            },
            updatedAt: {
              label: "अपडेट का समय",
            },
          },
        },
        totalResults: {
          label: "कुल नतीजे",
          description: "सर्च क्वेरी से मेल खाते थ्रेड की कुल संख्या",
        },
      },
      errors: {
        validationFailed: {
          title: "वैलिडेशन फ़ेल",
          description: "सर्च के पैरामीटर ग़लत हैं",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "थ्रेड खोजने के लिए लॉग इन करें",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपको थ्रेड खोजने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कोई थ्रेड नहीं मिला",
        },
        serverError: {
          title: "सर्वर एरर",
          description: "सर्च के दौरान सर्वर में अंदरूनी गड़बड़ी हुई",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कुछ अनपेक्षित हुआ",
        },
        unsavedChanges: {
          title: "अनसेव्ड बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "टकराव की स्थिति बन गई",
        },
      },
      success: {
        title: "हो गया",
        description: "सर्च पूरी हुई",
      },
    },
  },
};
