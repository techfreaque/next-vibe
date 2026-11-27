import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    messages: "मैसेज",
  },
  search: {
    get: {
      title: "ग्लोबल मैसेज सर्च",
      titleShort: "मैसेज खोजें",
      description: "फ़ुल-टेक्स्ट सर्च से सभी थ्रेड के मैसेज खोजें",
      container: {
        title: "ग्लोबल मैसेज सर्च",
        description: "अपने सभी थ्रेड में मैसेज खोजें",
      },
      query: {
        label: "सर्च क्वेरी",
        description: "मैसेज में जो टेक्स्ट खोजना है",
      },
      sections: {
        filters: {
          title: "फ़िल्टर",
          description: "नतीजे छाँटने के वैकल्पिक फ़िल्टर",
        },
        pagination: {
          title: "पेजिनेशन",
          description: "पेज नेविगेशन सेटिंग्स",
        },
      },
      rootFolderId: {
        label: "रूट फ़ोल्डर",
        description:
          "सर्च को किसी एक रूट फ़ोल्डर तक सीमित करें (private, shared, public, background)",
      },
      role: {
        label: "मैसेज रोल",
        description:
          "मैसेज रोल से फ़िल्टर करें (user, assistant, system, tool, error)",
      },
      startDate: {
        label: "शुरू की तारीख़",
        description: "सिर्फ़ इस तारीख़ के बाद बने मैसेज शामिल करें",
      },
      endDate: {
        label: "आख़िरी तारीख़",
        description: "सिर्फ़ इस तारीख़ से पहले बने मैसेज शामिल करें",
      },
      page: {
        label: "पेज",
        description: "कौन सा पेज चाहिए",
      },
      limit: {
        label: "सीमा",
        description: "हर पेज पर नतीजों की संख्या",
      },
      response: {
        results: {
          message: {
            title: "मैसेज नतीजा",
            messageId: {
              content: "मैसेज ID",
            },
            threadId: {
              content: "थ्रेड ID",
            },
            threadTitle: {
              content: "थ्रेड टाइटल",
            },
            role: {
              content: "रोल",
            },
            headline: {
              content: "कंटेंट स्निपेट",
            },
            createdAt: {
              content: "बनाने का समय",
            },
            rootFolderId: {
              content: "रूट फ़ोल्डर",
            },
          },
        },
        total: {
          content: "कुल नतीजे",
        },
        page: {
          content: "मौजूदा पेज",
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
          description: "मैसेज खोजने के लिए लॉग इन करें",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपको यह सर्च करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "आपकी क्वेरी से कोई नतीजा नहीं मिला",
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
        description: "ग्लोबल मैसेज सर्च पूरी हुई",
      },
    },
  },
};
