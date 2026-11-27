import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    threads: "थ्रेड",
  },
  enums: {
    threadStatus: {
      active: "एक्टिव",
      archived: "आर्काइव्ड",
      deleted: "डिलीटेड",
    },
  },
  errors: {
    count_failed: "बातचीत की गिनती नहीं मिल पाई: {{error}}",
  },
  get: {
    title: "थ्रेड",
    titleShort: "थ्रेड",
    description: "फ़िल्टर के साथ चैट थ्रेड की पेज वाली सूची पाएँ",
    container: {
      title: "थ्रेड सूची",
      description: "चैट थ्रेड ब्राउज़ और फ़िल्टर करें",
    },
    sections: {
      pagination: {
        title: "पेजिनेशन",
        description: "पेज नेविगेशन सेटिंग्स",
      },
      filters: {
        title: "फ़िल्टर",
        description: "थ्रेड को शर्तों से फ़िल्टर करें",
      },
    },
    page: {
      label: "पेज",
      description: "कौन सा पेज चाहिए",
    },
    limit: {
      label: "सीमा",
      description: "हर पेज पर थ्रेड की संख्या",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "रूट फ़ोल्डर से फ़िल्टर करें (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "सबफ़ोल्डर",
      description: "सबफ़ोल्डर ID से फ़िल्टर करें (वैकल्पिक)",
    },
    status: {
      label: "स्टेटस",
      description: "थ्रेड के स्टेटस से फ़िल्टर करें",
    },
    search: {
      label: "सर्च",
      description: "टाइटल या कंटेंट से थ्रेड खोजें",
      placeholder: "थ्रेड खोजें...",
    },
    isPinned: {
      label: "सिर्फ़ पिन किए",
      description: "सिर्फ़ पिन किए गए थ्रेड दिखाएँ",
    },
    dateFrom: {
      label: "इस तारीख़ से",
      description: "इस तारीख़ के बाद बने थ्रेड दिखाएँ",
    },
    dateTo: {
      label: "इस तारीख़ तक",
      description: "इस तारीख़ से पहले बने थ्रेड दिखाएँ",
    },
    response: {
      title: "थ्रेड सूची रिस्पॉन्स",
      description: "थ्रेड की पेज वाली सूची",
      threads: {
        thread: {
          title: "थ्रेड",
          id: {
            content: "थ्रेड ID",
          },
          threadTitle: {
            content: "टाइटल",
          },
          rootFolderId: {
            content: "रूट फ़ोल्डर",
          },
          folderId: {
            content: "सबफ़ोल्डर ID",
          },
          status: {
            content: "स्टेटस",
          },
          preview: {
            content: "प्रीव्यू",
          },
          pinned: {
            content: "पिन किया हुआ",
          },
          archived: {
            content: "आर्काइव्ड",
          },
          streamingState: {
            content: "स्ट्रीमिंग स्टेट",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
          },
          canEdit: {
            content: "एडिट कर सकते हैं",
          },
          canPost: {
            content: "पोस्ट कर सकते हैं",
          },
          canModerate: {
            content: "मॉडरेट कर सकते हैं",
          },
          canDelete: {
            content: "डिलीट कर सकते हैं",
          },
          canManagePermissions: {
            content: "अनुमतियाँ मैनेज कर सकते हैं",
          },
        },
      },
      totalCount: {
        content: "कुल संख्या",
      },
      pageCount: {
        content: "पेजों की संख्या",
      },
      page: {
        content: "मौजूदा पेज",
      },
      limit: {
        content: "प्रति पेज आइटम",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "थ्रेड देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको थ्रेड देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
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
      description: "थ्रेड मिल गए",
    },
  },
  post: {
    title: "नया थ्रेड",
    titleShort: "नया थ्रेड",
    description: "नया चैट थ्रेड बनाएँ",
    form: {
      title: "थ्रेड बनाएँ",
      description: "नए थ्रेड की सेटिंग्स तय करें",
    },
    sections: {
      thread: {
        title: "थ्रेड की जानकारी",
        description: "थ्रेड की बुनियादी जानकारी",
      },
    },
    id: {
      label: "थ्रेड ID",
      description: "क्लाइंट की बनाई थ्रेड ID",
    },
    threadTitle: {
      label: "टाइटल",
      description: "थ्रेड का टाइटल",
      placeholder: "थ्रेड का टाइटल लिखें...",
      default: "नई चैट",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "रूट फ़ोल्डर (private, shared, public, incognito)",
    },
    subFolderId: {
      label: "सबफ़ोल्डर",
      description: "थ्रेड जिस सबफ़ोल्डर में रखना है (वैकल्पिक)",
    },
    defaultModel: {
      label: "डिफ़ॉल्ट मॉडल",
      description: "इस थ्रेड के लिए डिफ़ॉल्ट AI मॉडल",
    },
    defaultTone: {
      label: "डिफ़ॉल्ट स्किल",
      description: "इस थ्रेड के लिए डिफ़ॉल्ट स्किल",
    },
    systemPrompt: {
      label: "सिस्टम प्रॉम्प्ट",
      description: "इस थ्रेड के लिए अपना सिस्टम प्रॉम्प्ट",
      placeholder: "सिस्टम प्रॉम्प्ट लिखें...",
    },
    response: {
      title: "बना हुआ थ्रेड",
      description: "नए बने थ्रेड की जानकारी",
      thread: {
        title: "थ्रेड",
        id: {
          content: "थ्रेड ID",
        },
        threadTitle: {
          content: "टाइटल",
        },
        rootFolderId: {
          content: "रूट फ़ोल्डर",
        },
        subFolderId: {
          content: "सबफ़ोल्डर ID",
        },
        status: {
          content: "स्टेटस",
        },
        createdAt: {
          content: "बनाने का समय",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
        canEdit: {
          content: "एडिट कर सकते हैं",
        },
        canPost: {
          content: "पोस्ट कर सकते हैं",
        },
        canModerate: {
          content: "मॉडरेट कर सकते हैं",
        },
        canDelete: {
          content: "डिलीट कर सकते हैं",
        },
        canManagePermissions: {
          content: "अनुमतियाँ मैनेज कर सकते हैं",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "थ्रेड का डेटा ग़लत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "थ्रेड बनाने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको थ्रेड बनाने की अनुमति नहीं है",
        incognitoNotAllowed: "इनकॉग्निटो थ्रेड सर्वर पर नहीं बन सकते",
        cannotCreateHere: "इस जगह आप थ्रेड नहीं बना सकते",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
        folderNotFound: "फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
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
        description: "इस नाम का थ्रेड पहले से है",
      },
    },
    success: {
      title: "हो गया",
      description: "थ्रेड बन गया",
    },
  },
  widget: {
    common: {
      noChatsFound: "कोई चैट नहीं मिली",
      delete: "हटाएँ",
      cancel: "रद्द करें",
    },
    actions: {
      menu: "थ्रेड एक्शन",
      rename: "नाम बदलें",
      unpin: "पिन हटाएँ",
      pin: "ऊपर पिन करें",
      unarchive: "आर्काइव से निकालें",
      archive: "आर्काइव करें",
      manageSharing: "शेयरिंग मैनेज करें",
      moveToFolder: "फ़ोल्डर में ले जाएँ",
      unfiled: "बिना फ़ोल्डर",
    },
    folderList: {
      managePermissions: "अनुमतियाँ मैनेज करें",
      today: "आज",
      lastWeek: "पिछले 7 दिन",
      lastMonth: "पिछले 30 दिन",
      older: "पुरानी",
    },
    threadList: {
      deleteDialog: {
        title: "थ्रेड हटाएँ",
        description:
          'क्या आप "{{title}}" हटाना चाहते हैं? यह वापस नहीं हो सकता और इस थ्रेड के सारे मैसेज हमेशा के लिए मिट जाएँगे।',
      },
    },
    suggestedPrompts: {
      starters: {
        explain: {
          label: "आसान भाषा में समझाओ",
          prompt:
            "महँगाई कैसे काम करती है, ऐसे समझाओ जैसे मैं 12 साल का हूँ। छोटा और ठोस जवाब दो।",
        },
        search: {
          label: "वेब पर खोजो",
          prompt: "इस हफ़्ते की सबसे बड़ी टेक ख़बरें क्या रहीं? सर्च करके सोर्स के साथ बताओ।",
        },
        image: {
          label: "इमेज बनाओ",
          prompt:
            "रात में बर्फ़ीले तूफ़ान के बीच एक आरामदेह केबिन की इमेज बनाओ, खिड़कियों से गर्म रोशनी आ रही हो।",
        },
        honest: {
          label: "सीधी राय लो",
          prompt:
            "क्रिप्टो के पक्ष और विपक्ष में सबसे मज़बूत तर्क दो। गोलमोल बात नहीं, कोई डिस्क्लेमर नहीं।",
        },
      },
      backgroundTitle: "आपके AI एजेंट काम पर हैं",
      backgroundDescription:
        "सब-एजेंट और ऑटोनॉमस बैकग्राउंड एजेंट यहाँ काम चलाते हैं, आप कुछ और करते रहें। नतीजे अपने आप आ जाते हैं।",
    },
    emptyState: {
      changeCompanion: "कंपैनियन या मॉडल बदलें। अभी: {{name}}",
      folder: {
        private: { label: "प्राइवेट", note: "आपके अकाउंट से सिंक होती है।" },
        incognito: {
          label: "इनकॉग्निटो",
          note: "सिर्फ़ इस ब्राउज़र में। कभी सिंक नहीं होती।",
        },
        shared: { label: "शेयर्ड", note: "लिंक वाला कोई भी पढ़ सकता है।" },
        public: { label: "पब्लिक", note: "सबको दिखती है।" },
        cron: { label: "बैकग्राउंड", note: "एजेंट यहाँ अपने आप काम करते हैं।" },
        remote: { label: "रिमोट", note: "आपके कनेक्टेड इंस्टेंस पर चलती है।" },
      },
      remoteSidebar: {
        title: "कोई इंस्टेंस कनेक्ट नहीं है",
        description:
          "सेल्फ़-होस्टेड next-vibe इंस्टेंस जोड़ें, फिर उसके थ्रेड यहीं सिंक और चलाएँ।",
        cta: "इंस्टेंस कनेक्ट करें",
      },
      use: {
        everyday: {
          good: "रिसर्च, लिखना और रोज़ के काम",
          weak: "राजनीति पर सेफ़ खेलता है",
        },
        politics: {
          good: "राजनीति और टैबू विषयों पर सीधे जवाब",
          weak: "सिर्फ़ टेक्स्ट, जटिल कामों में कम धारदार",
        },
        security: {
          good: "ऑफ़ेंसिव और डिफ़ेंसिव सिक्योरिटी का काम",
          weak: "राजनीति पर सेफ़ खेलता है",
        },
        writing: {
          good: "सोच-समझकर लिखना, कोड और एनालिसिस",
          weak: "तीखे विषयों पर गोलमोल जवाब देता है या मना कर देता है",
        },
        images: {
          good: "स्क्रीनशॉट, फ़ोटो और वीडियो पढ़ता है",
          weak: "तीखे विषयों पर संभलकर चलता है",
        },
        classic: {
          good: "कोड और प्लानिंग के लिए भरोसेमंद ऑल-राउंडर",
          weak: "तीखे विषयों पर संभलकर चलता है",
        },
        bold: {
          good: "सीधे, बेबाक जवाब",
          weak: "राजनीति के लिए सही चुनाव नहीं",
        },
        general: {
          good: "आम सवाल",
          weak: "राजनीति के लिए सही चुनाव नहीं",
        },
      },
      mode: {
        autoModel: "अपने आप चुना गया",
        goodAt: "इसमें अच्छा:",
        weakAt: "इसमें कमज़ोर:",
      },
      spotlight: {
        adultsOnly: "18+",
        title: "तय करें कि {{name}} कैसे काम करे।",
        subtitle: "हर मोड अलग मॉडल चलाता है। या सीधे टाइप करके शुरू करें।",
        now: "मौजूदा मोड: {{mode}}",
        runsOn: "इस पर चलता है",
        allModes: "सभी मोड",
        fix: {
          politics: "राजनीति पर बात? {{mode}} पर जाएँ",
          complex: "जटिल काम? {{mode}} पर जाएँ",
        },
      },
      single: {
        title: "{{name}} से चैट करें।",
        action: "और मोड के लिए {{companion}} पर जाएँ",
      },
      companion: {
        title: "जवाब कौन दे?",
        subtitle:
          "हर कंपैनियन की अपनी पर्सनैलिटी है और अलग-अलग कामों के लिए मॉडल का सेट।",
        skip: "या कंपैनियन के बिना सीधे टाइप करके शुरू करें।",
        skipModel: "या सीधे टाइप करें। {{model}} जवाब देगा, कोई पर्सोना नहीं।",
        about: {
          thea: "गर्मजोश और सोच-समझकर बोलने वाली। बात को खोलकर समझाती है।",
          hermes: "सीधा और तेज़। काम निपटा देता है।",
        },
      },
      custom: {
        title: "आपकी कस्टम स्किल तैयार है।",
        subtitle: "मैसेज बॉक्स के नीचे के सिलेक्टर से स्किल या मॉडल बदलें।",
      },
    },
  },
  publicFeed: {
    timestamp: {
      justNow: "अभी",
      hoursAgo: "{{hours}} घंटे पहले",
      daysAgo: "{{days}} दिन पहले",
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
};
