import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },
  enums: {
    userRole: {
      public: "पब्लिक",
      customer: "कस्टमर",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर कर्मचारी",
      admin: "एडमिन",
    },
  },
  widget: {
    config: {
      foldersShort: {
        private: "प्राइवेट",
        shared: "शेयर्ड",
        public: "पब्लिक",
        incognito: "इनकॉग्निटो",
        cron: "बैकग्राउंड",
        support: "सपोर्ट",
        remote: "रिमोट",
      },
    },
    folderList: {
      menu: "फ़ोल्डर के विकल्प",
      newChatInFolder: "फ़ोल्डर में नई चैट",
      moveUp: "ऊपर ले जाएँ",
      moveDown: "नीचे ले जाएँ",
      newSubfolder: "नया सब फ़ोल्डर",
      managePermissions: "परमिशन मैनेज करें",
      projectSettings: "प्रोजेक्ट सेटिंग्स",
      renameFolder: "फ़ोल्डर का नाम बदलें",
      moveToFolder: "फ़ोल्डर में ले जाएँ",
      deleteFolder: "फ़ोल्डर हटाएँ",
      deleteDialog: {
        title: "फ़ोल्डर हटाएँ",
        description: 'क्या आप "{{folderName}}" हटाना चाहते हैं?',
      },
      pinned: "पिन किया हुआ",
      pin: "पिन करें",
      unpin: "अनपिन करें",
      today: "आज",
      lastWeek: "पिछले 7 दिन",
      lastMonth: "पिछले 30 दिन",
      older: "पुराने",
      showMore: "और दिखाएँ",
    },
    renameFolder: {
      title: "फ़ोल्डर का नाम बदलें",
    },
    moveFolder: {
      title: "फ़ोल्डर मूव करें",
    },
    newFolder: {
      title: "नया फ़ोल्डर बनाएँ",
    },
    project: {
      dialogTitle: "प्रोजेक्ट सेटिंग्स",
    },
    permissions: {
      folderTitle: "फ़ोल्डर की परमिशन",
    },
    accessModal: {
      title: "अकाउंट ज़रूरी है",
      privateTitle: "प्राइवेट थ्रेड",
      sharedTitle: "शेयर्ड थ्रेड",
      publicTitle: "पब्लिक फ़ोरम",
      incognitoTitle: "इनकॉग्निटो मोड",
      backgroundTitle: "बैकग्राउंड थ्रेड",
      remoteTitle: "रिमोट थ्रेड",
      privateExplanation:
        "प्राइवेट थ्रेड AI से बातचीत के लिए आपकी निजी जगह हैं। आपकी सारी चैट हमारे सर्वर पर सुरक्षित रहती हैं और आपके सभी डिवाइस पर अपने आप सिंक होती हैं।",
      sharedExplanation:
        "शेयर्ड थ्रेड में आप बातचीत बनाकर सुरक्षित लिंक से दूसरों के साथ शेयर कर सकते हैं। टीम या दोस्तों के साथ मिलकर काम करने और आइडिया बाँटने के लिए बढ़िया।",
      publicExplanation:
        "पब्लिक फ़ोरम खुली जगह है, जहाँ लोग और AI बेझिझक बात करते हैं। क्या पढ़ना है, यह आप तय करते हैं। हम सिर्फ़ वही हटाते हैं जो कानून या हमारी शर्तें तोड़ता है। आइडिया शेयर करें, नज़रिये को चुनौती दें, अनसेंसर्ड बहस में शामिल हों।",
      incognitoExplanation:
        "इनकॉग्निटो मोड आपकी बातचीत को पूरी तरह निजी और लोकल रखता है। चैट सिर्फ़ आपके ब्राउज़र में रहती हैं, हमारे सर्वर पर कभी नहीं भेजी जातीं (बनाया गया मीडिया तकनीकी वजहों से कुछ समय के लिए सर्वर पर रहता है) और आपके अकाउंट से जुड़ी भी नहीं होतीं।",
      backgroundExplanation:
        "आपके सब-एजेंट और शेड्यूल्ड एजेंट अपने नतीजे यहाँ पोस्ट करते हैं। वे काम करते रहें, आप चैट करते रहें।",
      remoteExplanation: "आपके कनेक्टेड इंस्टेंस की चैट यहाँ मिलेंगी।",
      requiresAccount: "{{folderName}} खोलने के लिए अकाउंट बनाएँ या लॉग इन करें।",
      loginButton: "लॉग इन",
      signupButton: "साइन अप",
      close: "बंद करें",
    },
    actions: {
      rename: "नाम बदलें",
      moveToFolder: "फ़ोल्डर में ले जाएँ",
      pin: "पिन करें",
      unpin: "अनपिन करें",
    },
    threadList: {
      deleteDialog: {
        title: "थ्रेड हटाएँ",
        description: 'क्या आप "{{title}}" हटाना चाहते हैं?',
      },
    },
    sharedThread: {
      noLinks: "अभी शेयर नहीं किया। शेयर करने के लिए टैप करें",
      linkCount: "{{count}} चालू लिंक",
      shareAction: "शेयर करें",
      moveToShared: "शेयर्ड में ले जाएँ",
    },
    common: {
      cancel: "रद्द करें",
      delete: "हटाएँ",
      noChatsFound: "कोई थ्रेड नहीं मिला",
      noResults: "कोई मिलता-जुलता थ्रेड नहीं",
      searchPlaceholder: "सर्च करें...",
      privateChats: "प्राइवेट थ्रेड",
      sharedChats: "शेयर्ड थ्रेड",
      publicChats: "पब्लिक थ्रेड",
      incognitoChats: "इनकॉग्निटो थ्रेड",
      backgroundChats: "बैकग्राउंड थ्रेड",
      remoteChats: "रिमोट थ्रेड",
      newChat: "नया थ्रेड",
      newPrivateChat: "प्राइवेट थ्रेड",
      newSharedChat: "शेयर्ड थ्रेड",
      newPublicChat: "पब्लिक थ्रेड",
      newIncognitoChat: "इनकॉग्निटो थ्रेड",
      newPrivateFolder: "नया प्राइवेट फ़ोल्डर",
      newSharedFolder: "नया शेयर्ड फ़ोल्डर",
      newPublicFolder: "नया पब्लिक फ़ोल्डर",
      newIncognitoFolder: "नया इनकॉग्निटो फ़ोल्डर",
      newFolder: "नया फ़ोल्डर",
    },
  },
  errors: {
    not_implemented_on_native:
      "{{method}} नेटिव प्लेटफ़ॉर्म पर उपलब्ध नहीं है। इस काम के लिए वेब वर्शन इस्तेमाल करें।",
  },
  config: {
    folders: {
      private: "प्राइवेट",
      shared: "शेयर्ड",
      public: "पब्लिक",
      background: "बैकग्राउंड",
      incognito: "इनकॉग्निटो",
      support: "सपोर्ट",
      remote: "रिमोट",
    },
  },
  get: {
    title: "फ़ोल्डर देखें",
    titleShort: "फ़ोल्डर",
    description: "मौजूदा रूट फ़ोल्डर के सभी फ़ोल्डर पाएँ",
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description:
        "जो रूट फ़ोल्डर चाहिए (प्राइवेट, शेयर्ड, पब्लिक, बैकग्राउंड, इनकॉग्निटो)",
    },
    container: {
      title: "फ़ोल्डर की जानकारी",
      description: "फ़ोल्डर की जानकारी देखें",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "फ़ोल्डर की यूनिक पहचान",
    },
    response: {
      title: "फ़ोल्डर",
      description: "परमिशन के साथ फ़ोल्डर की सूची",
      rootFolderPermissions: {
        title: "रूट फ़ोल्डर की परमिशन",
        description: "रूट फ़ोल्डर के लिए परमिशन",
        canCreateThread: {
          content: "थ्रेड बना सकते हैं",
        },
        canCreateFolder: {
          content: "फ़ोल्डर बना सकते हैं",
        },
      },
      folders: {
        folder: {
          id: { content: "ID" },
          userId: { content: "यूज़र ID" },
          name: { content: "नाम" },
          icon: { content: "आइकन" },
          color: { content: "रंग" },
          parentId: { content: "पैरेंट फ़ोल्डर" },
          expanded: { content: "खुला हुआ" },
          sortOrder: { content: "क्रम" },
          rootFolderId: {
            content: "रूट फ़ोल्डर",
          },
          canManage: {
            content: "मैनेज कर सकते हैं",
          },
          canCreateThread: {
            content: "थ्रेड बना सकते हैं",
          },
          canModerate: {
            content: "मॉडरेट कर सकते हैं",
          },
          canDelete: {
            content: "हटा सकते हैं",
          },
          canManagePermissions: {
            content: "परमिशन मैनेज कर सकते हैं",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
          },
        },
      },
      folder: {
        title: "फ़ोल्डर",
        id: {
          content: "ID",
        },
        userId: {
          content: "यूज़र ID",
        },
        name: {
          content: "नाम",
        },
        icon: {
          content: "आइकन",
        },
        color: {
          content: "रंग",
        },
        parentId: {
          content: "पैरेंट फ़ोल्डर",
        },
        expanded: {
          content: "खुला हुआ",
        },
        sortOrder: {
          content: "क्रम",
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
        description: "दी गई फ़ोल्डर ID सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर लाते समय एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "आपका रिक्वेस्ट प्रोसेस करते समय टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर मिल गया",
    },
  },
  patch: {
    title: "फ़ोल्डर अपडेट करें",
    description: "मौजूदा फ़ोल्डर अपडेट करें",
    container: {
      title: "फ़ोल्डर अपडेट करें",
      description: "फ़ोल्डर की प्रॉपर्टी बदलें",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "जो फ़ोल्डर अपडेट करना है उसकी यूनिक पहचान",
    },
    sections: {
      updates: {
        title: "फ़ोल्डर के बदलाव",
        description: "जो फ़ील्ड बदलनी हैं",
      },
    },
    name: {
      label: "नाम",
      description: "फ़ोल्डर का नाम",
    },
    icon: {
      label: "आइकन",
      description: "Lucide या Simple Icons आइकन का नाम",
    },
    color: {
      label: "रंग",
      description: "अलग पहचान के लिए Hex रंग कोड",
    },
    parentId: {
      label: "पैरेंट फ़ोल्डर",
      description: "फ़ोल्डर को दूसरे पैरेंट में ले जाएँ (रूट के लिए null)",
    },
    expanded: {
      label: "खुला हुआ",
      description: "UI में फ़ोल्डर खुला है या नहीं",
    },
    sortOrder: {
      label: "क्रम",
      description: "फ़ोल्डर को क्रम में लगाने का क्रम",
    },
    metadata: {
      label: "मेटाडेटा",
      description: "फ़ोल्डर का अतिरिक्त मेटाडेटा",
    },
    rolesView: {
      label: "देखने वाले रोल",
      description: "जो रोल यह फ़ोल्डर देख सकते हैं",
    },
    rolesManage: {
      label: "मैनेज करने वाले रोल",
      description: "जो रोल फ़ोल्डर सेटिंग्स मैनेज कर सकते हैं",
    },
    rolesCreateThread: {
      label: "थ्रेड बनाने वाले रोल",
      description: "जो रोल इस फ़ोल्डर में थ्रेड बना सकते हैं",
    },
    rolesPost: {
      label: "पोस्ट करने वाले रोल",
      description: "जो रोल मैसेज पोस्ट कर सकते हैं",
    },
    rolesModerate: {
      label: "मॉडरेट करने वाले रोल",
      description: "जो रोल कंटेंट मॉडरेट कर सकते हैं",
    },
    rolesAdmin: {
      label: "एडमिन रोल",
      description: "जिन रोल के पास पूरा एडमिन एक्सेस है",
    },
    response: {
      title: "अपडेट किया गया फ़ोल्डर",
      description: "अपडेट किए गए फ़ोल्डर की जानकारी",
      folder: {
        title: "फ़ोल्डर",
        id: {
          content: "ID",
        },
        userId: {
          content: "यूज़र ID",
        },
        name: {
          content: "नाम",
        },
        icon: {
          content: "आइकन",
        },
        color: {
          content: "रंग",
        },
        parentId: {
          content: "पैरेंट फ़ोल्डर",
        },
        expanded: {
          content: "खुला हुआ",
        },
        sortOrder: {
          content: "क्रम",
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
        description: "दिया गया डेटा सही नहीं है",
        circularReference: "फ़ोल्डर को उसका ही पैरेंट नहीं बनाया जा सकता",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर अपडेट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर अपडेट करते समय एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "इस नाम का फ़ोल्डर पहले से मौजूद है",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर अपडेट हो गया",
    },
  },
  delete: {
    title: "फ़ोल्डर हटाएँ",
    description: "फ़ोल्डर और उसकी सारी सामग्री हटाएँ",
    container: {
      title: "फ़ोल्डर हटाएँ",
      description: "फ़ोल्डर हमेशा के लिए हटाएँ",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "जो फ़ोल्डर हटाना है उसकी यूनिक पहचान",
    },
    response: {
      title: "हटाने का नतीजा",
      description: "फ़ोल्डर हटाने की पुष्टि",
      success: {
        content: "सफल",
      },
      deletedFolderId: {
        content: "हटाए गए फ़ोल्डर की ID",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दी गई फ़ोल्डर ID सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर हटाने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर हटाते समय एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "जिस फ़ोल्डर में सामग्री है उसे नहीं हटाया जा सकता",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर हट गया",
    },
  },
  post: {
    errors: {
      forbidden: {
        title: "प्रतिबंधित",
        incognitoNotAllowed: "इनकॉग्निटो मोड में फ़ोल्डर सपोर्ट नहीं हैं",
      },
      unauthorized: {
        title: "अनुमति नहीं",
      },
      server: {
        title: "सर्वर एरर",
      },
    },
  },
};
