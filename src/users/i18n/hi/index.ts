import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र्स",
  tags: {
    create: "बनाएँ",
    admin: "एडमिन",
    user: "यूज़र",
    view: "देखें",
    stats: "आँकड़े",
  },
  create: {
    category: "यूज़र्स",
    tags: {
      create: "बनाएँ",
      admin: "एडमिन",
    },
    post: {
      title: "यूज़र बनाएँ",
      description: "नया यूज़र अकाउंट बनाएँ",
      form: {
        title: "यूज़र बनाने का फ़ॉर्म",
        description: "नया यूज़र बनाने के लिए ब्योरा भरें",
      },
      email: {
        label: "ईमेल पता",
        description: "लॉगिन और संपर्क के लिए यूज़र का ईमेल पता",
      },
      password: {
        label: "पासवर्ड",
        description: "यूज़र अकाउंट के लिए सुरक्षित पासवर्ड",
      },
      privateName: {
        label: "निजी नाम",
        description: "यूज़र का पूरा क़ानूनी नाम (सिर्फ़ एडमिन को दिखता है)",
      },
      publicName: {
        label: "सार्वजनिक नाम",
        description: "यूज़र का डिस्प्ले नाम (सबको दिखता है)",
      },
      firstName: {
        label: "पहला नाम",
        description: "यूज़र का पहला नाम",
      },
      lastName: {
        label: "उपनाम",
        description: "यूज़र का उपनाम",
      },
      company: {
        label: "कंपनी",
        description: "यूज़र की कंपनी या संस्था",
      },
      phone: {
        label: "फ़ोन नंबर",
        description: "यूज़र का संपर्क फ़ोन नंबर",
      },
      preferredContactMethod: {
        label: "पसंदीदा संपर्क तरीक़ा",
        description: "यूज़र को कैसे संपर्क किया जाना पसंद है",
      },
      roles: {
        label: "यूज़र रोल",
        description: "यूज़र को रोल दें",
      },
      imageUrl: {
        label: "प्रोफ़ाइल इमेज URL",
        description: "यूज़र की प्रोफ़ाइल इमेज का URL",
      },
      bio: {
        label: "बायोग्राफ़ी",
        description: "यूज़र के बारे में छोटा परिचय",
      },
      website: {
        label: "वेबसाइट",
        description: "यूज़र की निजी या कंपनी की वेबसाइट",
      },
      jobTitle: {
        label: "जॉब टाइटल",
        description: "यूज़र का पद या भूमिका",
      },
      emailVerified: {
        label: "ईमेल वेरिफ़ाइड",
        description: "यूज़र का ईमेल वेरिफ़ाइड है या नहीं",
      },
      isActive: {
        label: "सक्रिय स्थिति",
        description: "यूज़र अकाउंट सक्रिय है या नहीं",
      },
      leadId: {
        label: "लीड ID",
        description: "जुड़ी हुई लीड की पहचान",
      },
      country: {
        label: "देश",
        description: "यूज़र का निवास देश",
      },
      language: {
        label: "भाषा",
        description: "यूज़र की पसंदीदा भाषा",
      },
      response: {
        title: "यूज़र बन गया",
        description: "नए बने यूज़र का ब्योरा",
        id: {
          content: "यूज़र ID",
        },
        leadId: {
          content: "जुड़ी हुई लीड ID",
        },
        country: {
          label: "देश",
          description: "यूज़र का निवास देश",
        },
        language: {
          label: "भाषा",
          description: "यूज़र की पसंदीदा भाषा",
        },
        email: {
          content: "ईमेल पता",
        },
        privateName: {
          content: "निजी नाम",
        },
        publicName: {
          content: "सार्वजनिक नाम",
        },
        firstName: {
          content: "पहला नाम",
        },
        lastName: {
          content: "उपनाम",
        },
        company: {
          content: "कंपनी",
        },
        phone: {
          content: "फ़ोन नंबर",
        },
        preferredContactMethod: {
          content: "पसंदीदा संपर्क तरीक़ा",
        },
        imageUrl: {
          content: "प्रोफ़ाइल इमेज",
        },
        bio: {
          content: "बायोग्राफ़ी",
        },
        website: {
          content: "वेबसाइट",
        },
        jobTitle: {
          content: "जॉब टाइटल",
        },
        emailVerified: {
          content: "ईमेल वेरिफ़ाइड",
        },
        isActive: {
          content: "सक्रिय स्थिति",
        },
        stripeCustomerId: {
          content: "Stripe कस्टमर ID",
        },
        userRoles: {
          content: "यूज़र रोल",
          id: {
            content: "रोल ID",
          },
          role: {
            content: "रोल",
          },
        },
        createdAt: {
          content: "बनाया गया",
        },
        updatedAt: {
          content: "अपडेट किया गया",
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत एक्सेस",
          description: "यूज़र बनाने के लिए आपका लॉग इन होना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन फ़ेल",
          description: "फ़ॉर्म का डेटा जाँचें और फिर कोशिश करें",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर एरर की वजह से यूज़र नहीं बन सका",
        },
        unknown: {
          title: "अनजान एरर",
          description: "यूज़र बनाते समय अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "यूज़र बनाते समय नेटवर्क कनेक्शन फ़ेल हुआ",
        },
        forbidden: {
          title: "एक्सेस मना है",
          description: "आपको यूज़र बनाने की अनुमति नहीं है",
        },
        notFound: {
          title: "रिसोर्स नहीं मिला",
          description: "यूज़र बनाने के लिए ज़रूरी रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "यूज़र पहले से मौजूद है",
          description: "इस ईमेल का यूज़र पहले से मौजूद है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
        },
        internal: {
          title: "आंतरिक एरर",
          description: "यूज़र बनाते समय आंतरिक एरर आई",
        },
      },
      sms: {
        errors: {
          welcome_failed: {
            title: "SMS वेलकम फ़ेल",
            description: "यूज़र को वेलकम SMS भेजना फ़ेल हुआ",
          },
          verification_failed: {
            title: "SMS वेरिफ़िकेशन फ़ेल",
            description: "यूज़र को वेरिफ़िकेशन SMS भेजना फ़ेल हुआ",
          },
        },
      },
      success: {
        title: "यूज़र सफलतापूर्वक बन गया",
        description: "नया यूज़र अकाउंट बन गया है",
        message: {
          content: "यूज़र सफलतापूर्वक बन गया",
        },
        created: {
          content: "बनाया गया",
        },
      },
    },
    widget: {
      headerCreated: "यूज़र बन गया",
      headerCreate: "यूज़र बनाएँ",
      headerSubtitle: "नया एडमिन यूज़र या कस्टमर अकाउंट बनाएँ",
      activeBadge: "सक्रिय",
      verifiedBadge: "वेरिफ़ाइड",
      copiedTooltip: "कॉपी हो गया!",
      copyUserIdTooltip: "यूज़र ID कॉपी करें",
      copyIdButton: "ID कॉपी करें",
      copiedButton: "कॉपी हो गया!",
      viewUserButton: "यूज़र देखें",
      fullProfileButton: "पूरी प्रोफ़ाइल",
      creditHistoryButton: "क्रेडिट हिस्ट्री",
      createAnotherButton: "एक और यूज़र बनाएँ",
      createdPrefix: "बनाया गया",
    },
    email: {
      users: {
        welcome: {
          greeting: "हमारे प्लेटफ़ॉर्म पर स्वागत है, {{firstName}}!",
          preview: "आपका अकाउंट सफलतापूर्वक बन गया है",
          subject: "{{companyName}} में स्वागत है: आपका अकाउंट तैयार है!",
          introduction:
            "{{firstName}}, आपका स्वागत है! आपका अकाउंट सफलतापूर्वक बन गया है और अब आप हमारे सभी फ़ीचर इस्तेमाल कर सकते हैं।",
          accountDetails: "अकाउंट का ब्योरा",
          email: "ईमेल",
          name: "नाम",
          publicName: "डिस्प्ले नाम",
          company: "कंपनी",
          phone: "फ़ोन",
          nextSteps: "अगले कदम",
          loginButton: "अपने अकाउंट में लॉग इन करें",
          support:
            "कोई सवाल हो तो हमारी सपोर्ट टीम मदद के लिए है। कभी भी संपर्क करें!",
        },
        admin: {
          newUser: "नया यूज़र बना",
          preview: "नया यूज़र {{firstName}} {{lastName}} बनाया गया है",
          subject: "नया यूज़र अकाउंट बना: {{firstName}} {{lastName}}",
          notification: "सिस्टम में नया यूज़र अकाउंट बनाया गया है। ब्योरा यह है:",
          userDetails: "यूज़र का ब्योरा",
          viewUser: "यूज़र प्रोफ़ाइल देखें",
        },
        errors: {
          missing_data: "ईमेल टेंपलेट के लिए ज़रूरी यूज़र डेटा ग़ायब है",
        },
        error: {
          general: {
            internal_server_error: "आंतरिक सर्वर एरर हुई",
          },
        },
        labels: {
          id: "ID:",
          email: "ईमेल:",
          name: "नाम:",
          privateName: "पूरा नाम:",
          publicName: "डिस्प्ले नाम:",
          company: "कंपनी:",
          created: "बना:",
          leadId: "लीड ID:",
        },
      },
    },
    sms: {
      welcome: {
        message:
          "{{firstName}}, स्वागत है! आपका अकाउंट सफलतापूर्वक बन गया है। हमारे यहाँ आएँ: {{appUrl}}",
      },
      verification: {
        message:
          "{{firstName}}, आपका वेरिफ़िकेशन कोड है: {{code}}। कोड 10 मिनट के भीतर दर्ज करें।",
      },
      errors: {
        welcome_failed: {
          title: "SMS वेलकम फ़ेल",
          description: "यूज़र को वेलकम SMS भेजना फ़ेल हुआ",
        },
        verification_failed: {
          title: "SMS वेरिफ़िकेशन फ़ेल",
          description: "यूज़र को वेरिफ़िकेशन SMS भेजना फ़ेल हुआ",
        },
      },
    },
  },
  list: {
    get: {
      title: "यूज़र सूची",
      description: "यूज़र खोजें और फ़िल्टर करें",
      form: {
        title: "यूज़र मैनेजमेंट",
        description: "यूज़र मैनेज और फ़िल्टर करें",
      },
      actions: {
        refresh: "रिफ़्रेश",
        refreshing: "रिफ़्रेश हो रहा है...",
      },
      // Search & Filters section
      searchFilters: {
        title: "खोज और फ़िल्टर",
        description: "मानदंड से यूज़र खोजें और फ़िल्टर करें",
      },
      search: {
        label: "खोजें",
        description: "नाम या ईमेल से यूज़र खोजें",
        placeholder: "यूज़र खोजें...",
      },
      status: {
        label: "स्थिति",
        description: "स्थिति से यूज़र फ़िल्टर करें",
        placeholder: "स्थिति चुनें...",
      },
      role: {
        label: "रोल",
        description: "रोल से यूज़र फ़िल्टर करें",
        placeholder: "रोल चुनें...",
      },
      subscription: {
        label: "सब्सक्रिप्शन",
        description: "सब्सक्रिप्शन स्थिति से फ़िल्टर करें",
        placeholder: "कोई भी सब्सक्रिप्शन स्थिति",
      },
      creditActivity: {
        label: "क्रेडिट गतिविधि",
        description: "क्रेडिट ख़रीद या ख़र्च की गतिविधि से फ़िल्टर करें",
        placeholder: "कोई भी क्रेडिट गतिविधि",
      },
      threads: {
        label: "थ्रेड",
        description: "फ़िल्टर करें कि यूज़र के पास कोई चैट थ्रेड है या नहीं",
        placeholder: "कोई भी थ्रेड स्थिति",
      },
      referralActivity: {
        label: "रेफ़रल गतिविधि",
        description: "रेफ़रल लिंक, क्लिक, साइनअप या पेड सब्सक्राइबर से फ़िल्टर करें",
        placeholder: "कोई भी रेफ़रल गतिविधि",
      },
      // Sorting section
      sortingOptions: {
        title: "सॉर्टिंग",
        description: "नतीजों की सॉर्टिंग सेट करें",
      },
      sortBy: {
        label: "इससे सॉर्ट करें",
        description: "जिस फ़ील्ड से सॉर्ट करना है",
        placeholder: "सॉर्ट फ़ील्ड चुनें...",
      },
      sortOrder: {
        label: "क्रम",
        description: "सॉर्ट की दिशा",
        placeholder: "सॉर्ट क्रम चुनें...",
      },
      // Response section
      response: {
        title: "यूज़र्स",
        description: "मानदंड से मेल खाते यूज़र की सूची",
        users: {
          id: "यूज़र ID",
          email: "ईमेल",
          privateName: "निजी नाम",
          publicName: "सार्वजनिक नाम",
          isActive: "सक्रिय",
          emailVerified: "वेरिफ़ाइड",
          createdAt: "बनाया गया",
          updatedAt: "अपडेट हुआ",
          referralCode: "इस्तेमाल हुआ रेफ़रल कोड",
          referredByUserId: "किसने रेफ़र किया",
          totalReferrals: "किए गए रेफ़रल",
        },
        totalCount: "कुल यूज़र",
        pageCount: "कुल पेज",
      },
      // Pagination section
      page: {
        label: "पेज",
      },
      limit: {
        label: "प्रति पेज",
      },
      // Error messages
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "यूज़र देखने के लिए आपका लॉग इन होना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "दिए गए पैरामीटर गलत हैं",
        },
        forbidden: {
          title: "एक्सेस मना है",
          description: "आपको यूज़र देखने की अनुमति नहीं है",
        },
        server: {
          title: "सर्वर एरर",
          description: "यूज़र नहीं मिल सके",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        conflict: {
          title: "टकराव एरर",
          description: "टकराव की वजह से यूज़र की सूची नहीं बन सकी",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कोई यूज़र नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "सफल",
        description: "यूज़र सफलतापूर्वक मिल गए",
      },
    },
    // Legacy keys for backward compatibility
    title: "यूज़र की सूची",
    description: "फ़िल्टर के साथ यूज़र की सूची और खोज",
    category: "यूज़र्स",
    tag: "सूची",
    container: {
      title: "यूज़र सूची",
      description: "यूज़र खोजें और फ़िल्टर करें",
    },
    response: {
      summary: {
        title: "यूज़र सारांश",
        description: "यूज़र सूची के सारांश आँकड़े",
      },
      users: {
        title: "यूज़र्स",
      },
      user: {
        title: "यूज़र",
        id: "यूज़र ID",
        email: "ईमेल",
        privateName: "निजी नाम",
        publicName: "सार्वजनिक नाम",
        firstName: "पहला नाम",
        lastName: "उपनाम",
        company: "कंपनी",
        phone: "फ़ोन",
        isActive: "सक्रिय",
        emailVerified: "ईमेल वेरिफ़ाइड",
        role: "रोल",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
      total: {
        content: "कुल यूज़र",
      },
      page: {
        content: "मौजूदा पेज",
      },
      limit: {
        content: "प्रति पेज यूज़र",
      },
      totalPages: {
        content: "कुल पेज",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत एक्सेस",
        description: "यूज़र देखने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "यूज़र सूची के लिए दिए पैरामीटर गलत हैं",
      },
      forbidden: {
        title: "एक्सेस मना है",
        description: "आपको यूज़र देखने की अनुमति नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर एरर की वजह से यूज़र नहीं मिल सके",
      },
      unknown: {
        title: "अनजान एरर",
        description: "यूज़र की सूची बनाते समय अप्रत्याशित एरर आई",
      },
      conflict: {
        title: "टकराव एरर",
        description: "मौजूदा टकराव की वजह से यूज़र की सूची नहीं बन सकी",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      notFound: {
        title: "यूज़र नहीं मिले",
        description: "आपके मानदंड से कोई यूज़र नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "यूज़र की सूची बनाते समय आंतरिक एरर आई",
      },
    },
    post: {
      title: "सूची",
      description: "सूची एंडपॉइंट",
      form: {
        title: "सूची कॉन्फ़िगरेशन",
        description: "सूची के पैरामीटर सेट करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "सूची रिस्पॉन्स का डेटा",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुई",
        },
        forbidden: {
          title: "मना है",
          description: "एक्सेस मना है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
      },
      success: {
        title: "सफल",
        description: "कार्रवाई सफलतापूर्वक पूरी हुई",
      },
    },
    widget: {
      statusActive: "सक्रिय",
      statusInactive: "निष्क्रिय",
      statusUnverified: "अवेरिफ़ाइड",
      joined: "जुड़े",
      creditHistory: "क्रेडिट हिस्ट्री",
      view: "देखें",
      edit: "एडिट करें",
      delete: "हटाएँ",
      stats: "आँकड़े",
      graphs: "ग्राफ़",
      newUser: "नया यूज़र",
      searchPlaceholder: "नाम या ईमेल से खोजें… (Ctrl+F)",
      roleFilterLabel: "रोल",
      sortLabel: "सॉर्ट:",
      clearFilters: "फ़िल्टर साफ़ करें",
      noUsersMatchFilters: "आपके फ़िल्टर से कोई यूज़र मेल नहीं खाता।",
      noUsersFound: "कोई यूज़र नहीं मिला।",
      userStatistics: "यूज़र आँकड़े",
      refresh: "रिफ़्रेश",
      roleAll: "सभी",
      roleAdmin: "एडमिन",
      roleCustomer: "ग्राहक",
      rolePartnerAdmin: "पार्टनर एडमिन",
      rolePartnerEmployee: "पार्टनर कर्मचारी",
      statusAll: "सभी",
      sortNewest: "सबसे नए",
      sortOldest: "सबसे पुराने",
      sortNameAZ: "नाम A-Z",
      sortNameZA: "नाम Z-A",
      sortEmailAZ: "ईमेल A-Z",
      of: "of",
      usersShown: "यूज़र दिखाए गए",
      paginationPage: "पेज",
      paginationOf: "of",
      paginationSeparator: "·",
      paginationUsers: "users",
    },
    enums: {
      userSortField: {
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
        email: "ईमेल",
        privateName: "निजी नाम",
        publicName: "सार्वजनिक नाम",
        firstName: "पहला नाम",
        lastName: "उपनाम",
        company: "कंपनी",
        lastLogin: "आख़िरी लॉगिन",
      },
      sortOrder: {
        asc: "बढ़ते क्रम में",
        desc: "घटते क्रम में",
      },
      userStatusFilter: {
        all: "सभी",
        active: "सक्रिय",
        inactive: "निष्क्रिय",
        pending: "लंबित",
        suspended: "निलंबित",
        emailVerified: "ईमेल वेरिफ़ाइड",
        emailUnverified: "ईमेल अवेरिफ़ाइड",
      },
      userStatus: {
        active: "सक्रिय",
        inactive: "निष्क्रिय",
        pending: "लंबित",
        suspended: "निलंबित",
      },
      userRoleFilter: {
        all: "सभी",
        user: "यूज़र",
        public: "सार्वजनिक",
        customer: "ग्राहक",
        moderator: "मॉडरेटर",
        partnerAdmin: "पार्टनर एडमिन",
        partnerEmployee: "पार्टनर कर्मचारी",
        admin: "एडमिन",
        superAdmin: "सुपर एडमिन",
      },
      subscriptionPresenceFilter: {
        any: "कोई भी",
        hasActive: "सक्रिय सब्सक्रिप्शन है",
        hadAny: "कभी सब्सक्रिप्शन था",
        never: "कभी सब्सक्राइब नहीं किया",
      },
      creditActivityFilter: {
        any: "कोई भी",
        boughtPack: "क्रेडिट पैक ख़रीदा",
        spentCredits: "क्रेडिट ख़र्च किए",
        neverSpent: "कभी क्रेडिट ख़र्च नहीं किए",
      },
      threadsFilter: {
        any: "कोई भी",
        hasThreads: "थ्रेड हैं",
        noThreads: "कोई थ्रेड नहीं",
      },
      referralActivityFilter: {
        any: "कोई भी",
        hasCode: "रेफ़रल लिंक है",
        hasClicks: "रेफ़रल क्लिक हैं",
        hasSignups: "रेफ़रल साइनअप हैं",
        hasSubscribers: "पेड रेफ़रल हैं",
      },
    },
  },
  stats: {
    title: "यूज़र आँकड़े",
    description: "यूज़र के व्यापक एनालिटिक्स और आँकड़े",
    category: "यूज़र्स",
    tag: "आँकड़े",
    container: {
      title: "यूज़र आँकड़ों का डैशबोर्ड",
      description: "यूज़र के व्यापक एनालिटिक्स और आँकड़े देखें",
    },
    actions: {
      refresh: "रिफ़्रेश",
      refreshing: "रिफ़्रेश हो रहा है...",
    },
    basicFilters: {
      title: "बुनियादी फ़िल्टर",
      description: "स्थिति और रोल से यूज़र फ़िल्टर करें",
    },
    subscriptionFilters: {
      title: "सब्सक्रिप्शन फ़िल्टर",
      description: "सब्सक्रिप्शन और पेमेंट से फ़िल्टर करें",
    },
    locationFilters: {
      title: "लोकेशन फ़िल्टर",
      description: "देश और भाषा से फ़िल्टर करें",
    },
    timePeriodOptions: {
      title: "समय अवधि के विकल्प",
      description: "समय अवधि और चार्ट सेटिंग्स सेट करें",
    },
    sections: {
      filterOptions: {
        title: "फ़िल्टर विकल्प",
        description: "यूज़र आँकड़ों के फ़िल्टर सेट करें",
      },
    },
    fields: {
      status: {
        label: "स्थिति फ़िल्टर",
        description: "यूज़र स्थिति से आँकड़े फ़िल्टर करें",
      },
      role: {
        label: "रोल फ़िल्टर",
        description: "यूज़र रोल से आँकड़े फ़िल्टर करें",
      },
      country: {
        label: "देश फ़िल्टर",
        description: "देश से आँकड़े फ़िल्टर करें",
        placeholder: "देश चुनें...",
      },
      language: {
        label: "भाषा फ़िल्टर",
        description: "भाषा से आँकड़े फ़िल्टर करें",
        placeholder: "भाषा चुनें...",
      },
      search: {
        label: "खोजें",
        description: "आँकड़ों के लिए यूज़र खोजें",
        placeholder: "खोज शब्द दर्ज करें...",
      },
      chartType: {
        label: "चार्ट का प्रकार",
        description: "दिखाने के लिए चार्ट का प्रकार चुनें",
      },
      dateRangePreset: {
        label: "तारीख़ रेंज प्रीसेट",
        description: "पहले से तय तारीख़ रेंज चुनें",
      },
      includeComparison: {
        label: "तुलना शामिल करें",
        description: "पिछली अवधि से तुलना शामिल करें",
      },
      timePeriod: {
        label: "समय अवधि",
        description: "आँकड़ों के लिए समय अवधि चुनें",
      },
      subscriptionStatus: {
        label: "सब्सक्रिप्शन स्थिति",
        description: "सब्सक्रिप्शन स्थिति से फ़िल्टर करें",
      },
      paymentMethod: {
        label: "पेमेंट का तरीक़ा",
        description: "पेमेंट के तरीक़े से फ़िल्टर करें",
      },
    },
    response: {
      overviewStats: {
        title: "ओवरव्यू आँकड़े",
        description: "यूज़र आँकड़ों का सामान्य ओवरव्यू",
        totalUsers: {
          label: "कुल यूज़र",
        },
        activeUsers: {
          label: "सक्रिय यूज़र",
        },
        inactiveUsers: {
          label: "निष्क्रिय यूज़र",
        },
        newUsers: {
          label: "नए यूज़र",
        },
      },
      emailStats: {
        title: "ईमेल आँकड़े",
        description: "यूज़र ईमेल वेरिफ़िकेशन के आँकड़े",
        emailVerifiedUsers: {
          label: "वेरिफ़ाइड ईमेल",
        },
        emailUnverifiedUsers: {
          label: "अवेरिफ़ाइड ईमेल",
        },
        verificationRate: {
          label: "वेरिफ़िकेशन दर",
        },
      },
      profileStats: {
        title: "प्रोफ़ाइल आँकड़े",
        description: "यूज़र प्रोफ़ाइल पूरी करने के आँकड़े",
        complete: {
          title: "प्रोफ़ाइल पूर्णता",
          description: "प्रोफ़ाइल पूर्णता के विस्तृत मेट्रिक",
          usersWithPhone: {
            content: "फ़ोन वाले यूज़र",
          },
          usersWithBio: {
            content: "बायोग्राफ़ी वाले यूज़र",
          },
          usersWithWebsite: {
            content: "वेबसाइट वाले यूज़र",
          },
          usersWithJobTitle: {
            content: "जॉब टाइटल वाले यूज़र",
          },
          usersWithImage: {
            content: "प्रोफ़ाइल इमेज वाले यूज़र",
          },
          completionRate: {
            content: "प्रोफ़ाइल पूर्णता दर",
          },
        },
      },
      subscriptionStats: {
        title: "सब्सक्रिप्शन आँकड़े",
        description: "यूज़र सब्सक्रिप्शन वितरण के आँकड़े",
        activeSubscriptions: {
          label: "सक्रिय",
        },
        canceledSubscriptions: {
          label: "रद्द",
        },
        expiredSubscriptions: {
          label: "समाप्त",
        },
        noSubscription: {
          label: "कोई सब्सक्रिप्शन नहीं",
        },
        subscriptionChart: {
          label: "सब्सक्रिप्शन वितरण",
          description: "सब्सक्रिप्शन स्थितियों का विज़ुअल ब्रेकडाउन",
        },
      },
      paymentStats: {
        title: "पेमेंट आँकड़े",
        description: "आय और ट्रांज़ैक्शन के आँकड़े",
        totalRevenue: {
          label: "कुल आय",
        },
        transactionCount: {
          label: "ट्रांज़ैक्शन",
        },
        averageOrderValue: {
          label: "औसत ऑर्डर मूल्य",
        },
        refundRate: {
          label: "रिफ़ंड दर",
        },
      },
      roleStats: {
        title: "रोल आँकड़े",
        description: "यूज़र रोल वितरण के आँकड़े",
        publicUsers: {
          label: "सार्वजनिक",
        },
        customerUsers: {
          label: "कस्टमर",
        },
        partnerAdminUsers: {
          label: "पार्टनर एडमिन",
        },
        partnerEmployeeUsers: {
          label: "पार्टनर स्टाफ़",
        },
        adminUsers: {
          label: "एडमिन",
        },
        roleChart: {
          label: "रोल वितरण",
          description: "रोल के हिसाब से यूज़र का विज़ुअल ब्रेकडाउन",
        },
      },
      timeStats: {
        title: "समय-आधारित आँकड़े",
        description: "समय के साथ यूज़र बनने और बढ़ने के आँकड़े",
        usersCreatedToday: {
          label: "आज",
        },
        usersCreatedThisWeek: {
          label: "इस हफ़्ते",
        },
        usersCreatedThisMonth: {
          label: "इस महीने",
        },
        usersCreatedLastMonth: {
          label: "पिछला महीना",
        },
        growthRate: {
          label: "वृद्धि दर",
        },
      },
      companyStats: {
        title: "कंपनी आँकड़े",
        description: "कंपनी से जुड़े यूज़र आँकड़े",
        uniqueCompanies: {
          content: "अनोखी कंपनियाँ",
        },
      },
      // Keep the flat structure for backward compatibility
      totalUsers: {
        content: "कुल यूज़र",
      },
      activeUsers: {
        content: "सक्रिय यूज़र",
      },
      inactiveUsers: {
        content: "निष्क्रिय यूज़र",
      },
      newUsers: {
        content: "नए यूज़र",
      },
      emailVerifiedUsers: {
        content: "ईमेल वेरिफ़ाइड यूज़र",
      },
      emailUnverifiedUsers: {
        content: "ईमेल अवेरिफ़ाइड यूज़र",
      },
      verificationRate: {
        content: "ईमेल वेरिफ़िकेशन दर",
      },
      usersWithPhone: {
        content: "फ़ोन वाले यूज़र",
      },
      usersWithBio: {
        content: "बायोग्राफ़ी वाले यूज़र",
      },
      usersWithWebsite: {
        content: "वेबसाइट वाले यूज़र",
      },
      usersWithJobTitle: {
        content: "जॉब टाइटल वाले यूज़र",
      },
      usersWithImage: {
        content: "प्रोफ़ाइल इमेज वाले यूज़र",
      },
      usersWithStripeId: {
        content: "Stripe ID वाले यूज़र",
      },
      usersWithoutStripeId: {
        content: "बिना Stripe ID के यूज़र",
      },
      stripeIntegrationRate: {
        content: "Stripe इंटीग्रेशन दर",
      },
      usersWithLeadId: {
        content: "लीड ID वाले यूज़र",
      },
      usersWithoutLeadId: {
        content: "बिना लीड ID के यूज़र",
      },
      leadAssociationRate: {
        content: "लीड जुड़ाव दर",
      },
      publicUsers: {
        content: "सार्वजनिक यूज़र",
      },
      customerUsers: {
        content: "कस्टमर यूज़र",
      },
      partnerAdminUsers: {
        content: "पार्टनर एडमिन यूज़र",
      },
      partnerEmployeeUsers: {
        content: "पार्टनर कर्मचारी यूज़र",
      },
      adminUsers: {
        content: "एडमिन यूज़र",
      },
      uniqueCompanies: {
        content: "अनोखी कंपनियाँ",
      },
      usersCreatedToday: {
        content: "आज बने यूज़र",
      },
      usersCreatedThisWeek: {
        content: "इस हफ़्ते बने यूज़र",
      },
      usersCreatedThisMonth: {
        content: "इस महीने बने यूज़र",
      },
      usersCreatedLastMonth: {
        content: "पिछले महीने बने यूज़र",
      },
      growthRate: {
        content: "वृद्धि दर",
      },
      leadToUserConversionRate: {
        content: "लीड से यूज़र कन्वर्ज़न दर",
      },
      retentionRate: {
        content: "यूज़र रिटेंशन दर",
      },
      generatedAt: {
        content: "आँकड़े बनने का समय",
      },
      growthMetrics: {
        title: "ग्रोथ मेट्रिक",
        description: "यूज़र ग्रोथ और कन्वर्ज़न मेट्रिक",
        growthChart: {
          label: "समय के साथ यूज़र ग्रोथ",
          description: "यूज़र बनने के रुझान का विज़ुअल रूप",
        },
      },
      performanceRates: {
        title: "परफ़ॉर्मेंस दरें",
        description: "यूज़र परफ़ॉर्मेंस और कन्वर्ज़न मेट्रिक",
        growthRate: {
          label: "वृद्धि दर",
        },
        leadToUserConversionRate: {
          label: "लीड कन्वर्ज़न",
        },
        retentionRate: {
          label: "रिटेंशन दर",
        },
      },
      businessInsights: {
        title: "बिज़नेस इनसाइट",
        description: "बिज़नेस इंटेलिजेंस और एनालिटिक्स",
        uniqueCompanies: {
          label: "अनोखी कंपनियाँ",
        },
        generatedAt: {
          label: "बनाए जाने का समय",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "आँकड़ों के दिए पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत एक्सेस",
        description: "आँकड़े देखने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस मना है",
        description: "आपको आँकड़े देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "आँकड़े नहीं मिले",
        description: "माँगे गए आँकड़े नहीं मिल सके",
      },
      conflict: {
        title: "टकराव एरर",
        description: "मौजूदा टकराव की वजह से आँकड़े नहीं बन सके",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर एरर की वजह से आँकड़े नहीं बन सके",
      },
      unknown: {
        title: "अनजान एरर",
        description: "आँकड़े बनाते समय अप्रत्याशित एरर आई",
      },
    },
    enums: {
      subscriptionStatusFilter: {
        all: "सभी",
        active: "सक्रिय",
        trialing: "ट्रायल में",
        pastDue: "बकाया",
        canceled: "रद्द",
        unpaid: "अनपेड",
        paused: "रुका हुआ",
        noSubscription: "कोई सब्सक्रिप्शन नहीं",
      },
      paymentMethodFilter: {
        all: "सभी",
        card: "कार्ड",
        bankTransfer: "बैंक ट्रांसफ़र",
        paypal: "PayPal",
        applePay: "Apple Pay",
        googlePay: "Google Pay",
        sepaDebit: "SEPA डेबिट",
        crypto: "क्रिप्टोकरेंसी",
        noPaymentMethod: "कोई पेमेंट तरीक़ा नहीं",
      },
    },
    success: {
      title: "आँकड़े सफलतापूर्वक बने",
      description: "यूज़र आँकड़े सफलतापूर्वक बन गए हैं",
    },
    widget: {
      headerTitle: "यूज़र आँकड़े",
      refresh: "रिफ़्रेश",
      labelTotalUsers: "कुल यूज़र",
      labelActiveUsers: "सक्रिय यूज़र",
      labelNewToday: "आज नए",
      labelNewThisWeek: "इस हफ़्ते नए",
      labelNewThisMonth: "इस महीने नए",
      labelTotalRevenue: "कुल आय",
      labelAvgRevenuePerUser: "औसत आय / यूज़र",
      labelEmailVerified: "ईमेल वेरिफ़ाइड",
      labelVerificationRate: "वेरिफ़िकेशन दर",
      labelEmailUnverified: "ईमेल अवेरिफ़ाइड",
      labelGrowthRate: "वृद्धि दर",
      labelLeadUserCvr: "लीड → यूज़र CVR",
      labelRetentionRate: "रिटेंशन दर",
      chartByRole: "रोल के हिसाब से",
      chartBySubscriptionStatus: "सब्सक्रिप्शन स्थिति के हिसाब से",
      chartGrowthOverTime: "समय के साथ ग्रोथ",
      recentSignupsSummary: "हाल के साइनअप का सारांश",
      rowToday: "आज",
      rowThisWeek: "इस हफ़्ते",
      rowThisMonth: "इस महीने",
      rowLastMonth: "पिछला महीना",
      generatedAt: "बनाए जाने का समय:",
      filters: "फ़िल्टर",
      filtersTitle: "फ़िल्टर विकल्प",
      applyFilters: "फ़िल्टर लगाएँ",
      viewUsers: "यूज़र देखें",
      createUser: "यूज़र बनाएँ",
    },
  },
  user: {
    category: "यूज़र्स",
    tag: "यूज़र मैनेजमेंट",
    errors: {
      not_found: {
        title: "यूज़र नहीं मिला",
        description: "माँगा गया यूज़र नहीं मिल सका",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "यूज़र रिक्वेस्ट प्रोसेस करते समय आंतरिक एरर आई",
      },
    },
    id: {
      category: "यूज़र्स",
      tag: "यूज़र मैनेजमेंट",

      id: {
        roles: {
          post: {
            title: "यूज़र रोल जोड़ें",
            description: "किसी ख़ास यूज़र अकाउंट को रोल दें",
            container: {
              title: "रोल जोड़ें",
              description: "इस यूज़र को देने के लिए रोल चुनें",
            },
            id: {
              label: "यूज़र ID",
              description: "जिस यूज़र को रोल देना है उसकी यूनिक पहचान",
              placeholder: "यूज़र ID दर्ज करें...",
            },
            role: {
              label: "रोल",
              description: "यूज़र को देने वाला रोल",
              placeholder: "रोल चुनें...",
            },
            submit: {
              label: "रोल जोड़ें",
            },
            response: {
              roleId: {
                content: "रोल असाइनमेंट ID",
              },
              userId: {
                content: "यूज़र ID",
              },
              assignedRole: {
                content: "असाइन किया गया रोल",
              },
            },
            errors: {
              unauthorized: {
                title: "अनधिकृत",
                description: "यूज़र रोल मैनेज करने के लिए आपका लॉग इन होना ज़रूरी है",
              },
              validation: {
                title: "वैलिडेशन फ़ेल",
                description: "कृपया सही यूज़र ID और रोल दें",
              },
              forbidden: {
                title: "एक्सेस मना है",
                description: "सिर्फ़ एडमिनिस्ट्रेटर यूज़र रोल मैनेज कर सकते हैं",
              },
              notFound: {
                title: "यूज़र नहीं मिला",
                description: "बताया गया यूज़र नहीं मिल सका",
              },
              conflict: {
                title: "रोल पहले से असाइन है",
                description: "इस यूज़र के पास यह रोल पहले से है",
              },
              network: {
                title: "नेटवर्क एरर",
                description: "सर्वर से कनेक्ट नहीं हो सका",
              },
              unsavedChanges: {
                title: "बिना सेव किए बदलाव",
                description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
              },
              server: {
                title: "सर्वर एरर",
                description: "सर्वर एरर की वजह से रोल नहीं जोड़ा जा सका",
              },
              unknown: {
                title: "अनजान एरर",
                description: "रोल जोड़ते समय अप्रत्याशित एरर आई",
              },
            },
            success: {
              title: "रोल जुड़ गया",
              description: "यूज़र को रोल सफलतापूर्वक दे दिया गया",
            },
          },
          delete: {
            title: "यूज़र रोल हटाएँ",
            description: "किसी ख़ास यूज़र अकाउंट से रोल वापस लें",
            container: {
              title: "रोल हटाएँ",
              description: "इस यूज़र से वापस लेने के लिए रोल चुनें",
            },
            id: {
              label: "यूज़र ID",
              description: "जिस यूज़र से रोल वापस लेना है उसकी यूनिक पहचान",
              placeholder: "यूज़र ID दर्ज करें...",
            },
            role: {
              label: "रोल",
              description: "यूज़र से वापस लेने वाला रोल",
              placeholder: "रोल चुनें...",
            },
            submit: {
              label: "रोल हटाएँ",
            },
            response: {
              success: {
                content: "रोल हट गया",
              },
            },
            errors: {
              unauthorized: {
                title: "अनधिकृत",
                description: "यूज़र रोल मैनेज करने के लिए आपका लॉग इन होना ज़रूरी है",
              },
              validation: {
                title: "वैलिडेशन फ़ेल",
                description: "कृपया सही यूज़र ID और रोल दें",
              },
              forbidden: {
                title: "एक्सेस मना है",
                description: "सिर्फ़ एडमिनिस्ट्रेटर यूज़र रोल मैनेज कर सकते हैं",
              },
              notFound: {
                title: "यूज़र नहीं मिला",
                description: "बताया गया यूज़र नहीं मिल सका",
              },
              conflict: {
                title: "टकराव एरर",
                description: "मौजूदा निर्भरताओं की वजह से रोल नहीं हटाया जा सका",
              },
              network: {
                title: "नेटवर्क एरर",
                description: "सर्वर से कनेक्ट नहीं हो सका",
              },
              unsavedChanges: {
                title: "बिना सेव किए बदलाव",
                description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
              },
              server: {
                title: "सर्वर एरर",
                description: "सर्वर एरर की वजह से रोल नहीं हटाया जा सका",
              },
              unknown: {
                title: "अनजान एरर",
                description: "रोल हटाते समय अप्रत्याशित एरर आई",
              },
            },
            success: {
              title: "रोल हट गया",
              description: "यूज़र से रोल सफलतापूर्वक वापस ले लिया गया",
            },
          },
        },
        get: {
          title: "यूज़र लाएँ",
          description: "किसी ख़ास यूज़र की विस्तृत जानकारी लाएँ",
          container: {
            title: "यूज़र का ब्योरा",
            description: "यूज़र की विस्तृत जानकारी देखें",
          },
          id: {
            label: "यूज़र ID",
            description: "यूज़र की यूनिक पहचान",
            placeholder: "यूज़र ID दर्ज करें...",
          },
          response: {
            userProfile: {
              title: "यूज़र प्रोफ़ाइल",
              description: "यूज़र प्रोफ़ाइल की विस्तृत जानकारी",
              basicInfo: {
                title: "बुनियादी जानकारी",
                description: "यूज़र की मुख्य जानकारी",
                id: {
                  content: "यूज़र ID",
                },
                email: {
                  content: "ईमेल पता",
                },
                privateName: {
                  content: "निजी नाम",
                },
                publicName: {
                  content: "सार्वजनिक नाम",
                },
                firstName: {
                  content: "पहला नाम",
                },
                lastName: {
                  content: "उपनाम",
                },
                company: {
                  content: "कंपनी",
                },
              },
              contactDetails: {
                title: "संपर्क ब्योरा",
                description: "यूज़र की संपर्क जानकारी",
                phone: {
                  content: "फ़ोन नंबर",
                },
                preferredContactMethod: {
                  content: "पसंदीदा संपर्क तरीक़ा",
                },
                website: {
                  content: "वेबसाइट",
                },
              },
            },
            profileDetails: {
              title: "प्रोफ़ाइल ब्योरा",
              description: "प्रोफ़ाइल की अतिरिक्त जानकारी",
              imageUrl: {
                content: "प्रोफ़ाइल इमेज",
              },
              bio: {
                content: "बायोग्राफ़ी",
              },
              jobTitle: {
                content: "जॉब टाइटल",
              },
              leadId: {
                content: "जुड़ी हुई लीड ID",
              },
            },
            accountStatus: {
              title: "अकाउंट स्थिति",
              description: "यूज़र अकाउंट की स्थिति की जानकारी",
              isActive: {
                content: "सक्रिय स्थिति",
              },
              emailVerified: {
                content: "ईमेल वेरिफ़ाइड",
              },
              stripeCustomerId: {
                content: "Stripe कस्टमर ID",
              },
              userRoles: {
                content: "यूज़र रोल",
              },
            },
            timestamps: {
              title: "टाइमस्टैंप",
              description: "बनाने और अपडेट करने के टाइमस्टैंप",
              createdAt: {
                content: "बनाया गया",
              },
              updatedAt: {
                content: "अपडेट किया गया",
              },
            },
            referralInfo: {
              title: "रेफ़रल जानकारी",
              description: "रेफ़रल चेन और कमाई",
              referredByUserId: {
                content: "किसने रेफ़र किया (यूज़र ID)",
              },
              referredByCode: {
                content: "इस्तेमाल हुआ रेफ़रल कोड",
              },
              totalReferrals: {
                content: "रेफ़र किए गए यूज़र",
              },
              totalEarnedCents: {
                content: "कुल कमाई (सेंट)",
              },
            },
            leadId: {
              content: "जुड़ी हुई लीड ID",
            },
            email: {
              content: "ईमेल पता",
            },
            privateName: {
              content: "निजी नाम",
            },
            publicName: {
              content: "सार्वजनिक नाम",
            },
            firstName: {
              content: "पहला नाम",
            },
            lastName: {
              content: "उपनाम",
            },
            company: {
              content: "कंपनी",
            },
            phone: {
              content: "फ़ोन नंबर",
            },
            preferredContactMethod: {
              content: "पसंदीदा संपर्क तरीक़ा",
            },
            imageUrl: {
              content: "प्रोफ़ाइल इमेज",
            },
            bio: {
              content: "बायोग्राफ़ी",
            },
            website: {
              content: "वेबसाइट",
            },
            jobTitle: {
              content: "जॉब टाइटल",
            },
            emailVerified: {
              content: "ईमेल वेरिफ़ाइड",
            },
            isActive: {
              content: "सक्रिय स्थिति",
            },
            stripeCustomerId: {
              content: "Stripe कस्टमर ID",
            },
            userRoles: {
              content: "यूज़र रोल",
            },
            createdAt: {
              content: "बनाया गया",
            },
            updatedAt: {
              content: "अपडेट किया गया",
            },
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत एक्सेस",
              description: "यूज़र का ब्योरा देखने के लिए आपका लॉग इन होना ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन फ़ेल",
              description: "दी गई यूज़र ID गलत है",
            },
            forbidden: {
              title: "एक्सेस मना है",
              description: "आपको यह यूज़र देखने की अनुमति नहीं है",
            },
            notFound: {
              title: "यूज़र नहीं मिला",
              description: "माँगा गया यूज़र नहीं मिल सका",
            },
            conflict: {
              title: "टकराव एरर",
              description: "मौजूदा टकराव की वजह से यूज़र नहीं मिल सका",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "सर्वर से कनेक्ट नहीं हो सका",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
            },
            server: {
              title: "सर्वर एरर",
              description: "सर्वर एरर की वजह से यूज़र नहीं मिल सका",
            },
            unknown: {
              title: "अनजान एरर",
              description: "यूज़र लाते समय अप्रत्याशित एरर आई",
            },
          },
          success: {
            title: "यूज़र सफलतापूर्वक मिल गया",
            description: "यूज़र का ब्योरा सफलतापूर्वक मिल गया है",
          },
        },
        put: {
          title: "यूज़र अपडेट करें",
          description: "यूज़र की जानकारी और प्रोफ़ाइल का ब्योरा अपडेट करें",
          container: {
            title: "यूज़र अपडेट करें",
            description: "यूज़र की जानकारी और सेटिंग्स बदलें",
          },
          id: {
            label: "यूज़र ID",
            description: "अपडेट किए जाने वाले यूज़र की यूनिक पहचान",
            placeholder: "यूज़र ID दर्ज करें...",
          },
          sections: {
            basicInfo: {
              title: "बुनियादी जानकारी",
              description: "बुनियादी यूज़र जानकारी अपडेट करें",
            },
            contactInfo: {
              title: "संपर्क जानकारी",
              description: "संपर्क ब्योरा अपडेट करें",
            },
            profileDetails: {
              title: "प्रोफ़ाइल ब्योरा",
              description: "प्रोफ़ाइल की अतिरिक्त जानकारी अपडेट करें",
            },
            adminSettings: {
              title: "एडमिन सेटिंग्स",
              description: "एडमिन सेटिंग्स अपडेट करें",
            },
          },
          email: {
            label: "ईमेल पता",
            description: "लॉगिन और संपर्क के लिए यूज़र का ईमेल पता",
            placeholder: "ईमेल पता दर्ज करें...",
          },
          privateName: {
            label: "निजी नाम",
            description: "यूज़र का पूरा क़ानूनी नाम (सिर्फ़ एडमिन को दिखता है)",
          },
          publicName: {
            label: "सार्वजनिक नाम",
            description: "यूज़र का डिस्प्ले नाम (सबको दिखता है)",
          },
          firstName: {
            label: "पहला नाम",
            description: "यूज़र का पहला नाम",
            placeholder: "पहला नाम दर्ज करें...",
          },
          lastName: {
            label: "उपनाम",
            description: "यूज़र का उपनाम",
            placeholder: "उपनाम दर्ज करें...",
          },
          company: {
            label: "कंपनी",
            description: "यूज़र की कंपनी या संस्था",
            placeholder: "कंपनी का नाम दर्ज करें...",
          },
          phone: {
            label: "फ़ोन नंबर",
            description: "यूज़र का संपर्क फ़ोन नंबर",
            placeholder: "फ़ोन नंबर दर्ज करें...",
          },
          preferredContactMethod: {
            label: "पसंदीदा संपर्क तरीक़ा",
            description: "यूज़र को कैसे संपर्क किया जाना पसंद है",
          },
          bio: {
            label: "बायोग्राफ़ी",
            description: "यूज़र के बारे में छोटा परिचय",
            placeholder: "बायोग्राफ़ी दर्ज करें...",
          },
          website: {
            label: "वेबसाइट",
            description: "यूज़र की निजी या कंपनी की वेबसाइट",
            placeholder: "वेबसाइट URL दर्ज करें...",
          },
          jobTitle: {
            label: "जॉब टाइटल",
            description: "यूज़र का पद या भूमिका",
            placeholder: "जॉब टाइटल दर्ज करें...",
          },
          emailVerified: {
            label: "ईमेल वेरिफ़ाइड",
            description: "यूज़र का ईमेल वेरिफ़ाइड है या नहीं",
          },
          isActive: {
            label: "सक्रिय स्थिति",
            description: "यूज़र अकाउंट सक्रिय है या नहीं",
          },
          leadId: {
            label: "लीड ID",
            description: "जुड़ी हुई लीड की पहचान",
            placeholder: "लीड ID दर्ज करें...",
          },
          isBanned: {
            label: "बैन",
            description: "यूज़र प्लेटफ़ॉर्म से बैन है या नहीं",
          },
          bannedReason: {
            label: "बैन की वजह",
            description: "यूज़र को बैन करने की वजह",
          },
          response: {
            leadId: {
              content: "जुड़ी हुई लीड ID",
            },
            email: {
              content: "ईमेल पता",
            },
            privateName: {
              content: "निजी नाम",
            },
            publicName: {
              content: "सार्वजनिक नाम",
            },
            firstName: {
              content: "पहला नाम",
            },
            lastName: {
              content: "उपनाम",
            },
            company: {
              content: "कंपनी",
            },
            phone: {
              content: "फ़ोन नंबर",
            },
            preferredContactMethod: {
              content: "पसंदीदा संपर्क तरीक़ा",
            },
            imageUrl: {
              content: "प्रोफ़ाइल इमेज",
            },
            bio: {
              content: "बायोग्राफ़ी",
            },
            website: {
              content: "वेबसाइट",
            },
            jobTitle: {
              content: "जॉब टाइटल",
            },
            emailVerified: {
              content: "ईमेल वेरिफ़ाइड",
            },
            isActive: {
              content: "सक्रिय स्थिति",
            },
            stripeCustomerId: {
              content: "Stripe कस्टमर ID",
            },
            userRoles: {
              content: "यूज़र रोल",
            },
            createdAt: {
              content: "बनाया गया",
            },
            updatedAt: {
              content: "अपडेट किया गया",
            },
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत एक्सेस",
              description: "यूज़र अपडेट करने के लिए आपका लॉग इन होना ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन फ़ेल",
              description: "फ़ॉर्म का डेटा जाँचें और फिर कोशिश करें",
            },
            forbidden: {
              title: "एक्सेस मना है",
              description: "आपको यह यूज़र अपडेट करने की अनुमति नहीं है",
            },
            notFound: {
              title: "यूज़र नहीं मिला",
              description: "अपडेट किया जाने वाला यूज़र नहीं मिल सका",
            },
            conflict: {
              title: "अपडेट में टकराव",
              description: "यूज़र का डेटा मौजूदा रिकॉर्ड से टकराता है",
            },
            server: {
              title: "सर्वर एरर",
              description: "सर्वर एरर की वजह से यूज़र अपडेट नहीं हो सका",
            },
            unknown: {
              title: "अनजान एरर",
              description: "यूज़र अपडेट करते समय अप्रत्याशित एरर आई",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "सर्वर से कनेक्ट नहीं हो सका",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
            },
          },
          success: {
            title: "यूज़र सफलतापूर्वक अपडेट हुआ",
            description: "यूज़र की जानकारी सफलतापूर्वक अपडेट हो गई है",
          },
        },
        delete: {
          title: "यूज़र हटाएँ",
          description: "यूज़र अकाउंट हमेशा के लिए हटाएँ",
          container: {
            title: "यूज़र हटाएँ",
            description: "यूज़र को सिस्टम से हमेशा के लिए हटाएँ",
          },
          id: {
            label: "यूज़र ID",
            description: "हटाए जाने वाले यूज़र की यूनिक पहचान",
            placeholder: "यूज़र ID दर्ज करें...",
            helpText: "चेतावनी: यह कार्रवाई वापस नहीं हो सकती",
          },
          submitButton: {
            label: "यूज़र हटाएँ",
            loadingText: "हटाया जा रहा है...",
          },
          response: {
            deletionResult: {
              title: "हटाने का नतीजा",
              description: "हटाने की कार्रवाई का नतीजा",
              success: {
                content: "हटाना सफल",
              },
              message: {
                content: "हटाने का संदेश",
              },
              deletedAt: {
                content: "हटाने का समय",
              },
            },
            success: {
              content: "हटाना सफल",
            },
            message: {
              content: "हटाने का संदेश",
            },
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत एक्सेस",
              description: "यूज़र हटाने के लिए आपका लॉग इन होना ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन फ़ेल",
              description: "हटाने के लिए दी गई यूज़र ID गलत है",
            },
            forbidden: {
              title: "एक्सेस मना है",
              description: "आपको यूज़र हटाने की अनुमति नहीं है",
            },
            notFound: {
              title: "यूज़र नहीं मिला",
              description: "हटाया जाने वाला यूज़र नहीं मिल सका",
            },
            server: {
              title: "सर्वर एरर",
              description: "सर्वर एरर की वजह से यूज़र हट नहीं सका",
            },
            unknown: {
              title: "अनजान एरर",
              description: "यूज़र हटाते समय अप्रत्याशित एरर आई",
            },
            conflict: {
              title: "टकराव एरर",
              description: "मौजूदा निर्भरताओं की वजह से यूज़र हट नहीं सका",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "सर्वर से कनेक्ट नहीं हो सका",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "आपके बदलाव सेव नहीं हुए हैं और खो जाएँगे",
            },
          },
          success: {
            title: "यूज़र सफलतापूर्वक हट गया",
            description: "यूज़र सफलतापूर्वक हटा दिया गया है",
          },
        },
        widget: {
          userProfile: "यूज़र प्रोफ़ाइल",
          active: "सक्रिय",
          inactive: "निष्क्रिय",
          leadId: "लीड ID:",
          viewLead: "लीड देखें",
          created: "बनाया गया",
          lastUpdated: "आख़िरी अपडेट",
          fullProfile: "पूरी प्रोफ़ाइल",
          referrals: "रेफ़रल",
          subscription: "सब्सक्रिप्शन",
          creditHistory: "क्रेडिट हिस्ट्री",
          deleteUser: "यूज़र हटाएँ",
          userDeletedSuccessfully: "यूज़र सफलतापूर्वक हट गया",
          deletedAt: "हटाने का समय",
          confirmDeletion: "हटाने की पुष्टि करें",
          confirmDeletionMessage:
            "इससे यूज़र और उससे जुड़ा सारा डेटा हमेशा के लिए हट जाएगा। यह कार्रवाई वापस नहीं हो सकती।",
          titleReferralCodes: "रेफ़रल कोड और आँकड़े देखें",
          titleSubscription: "सब्सक्रिप्शन देखें",
          titleCopyUserId: "यूज़र ID कॉपी करें",
        },
      },
    },
  },
  view: {
    category: "यूज़र्स",
    tags: {
      user: "यूज़र",
      view: "देखें",
    },

    badge: "यूज़र का ब्योरा",
    get: {
      title: "यूज़र देखें",
      description: "किसी यूज़र की विस्तृत जानकारी देखें",
      userId: {
        label: "यूज़र ID",
      },
    },
    errors: {
      validation: {
        title: "रिक्वेस्ट गलत है",
        description: "कृपया यूज़र ID जाँचें और फिर कोशिश करें",
      },
      network: {
        title: "कनेक्शन एरर",
        description: "कनेक्ट नहीं हो सका। अपना इंटरनेट कनेक्शन जाँचें",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "यूज़र का ब्योरा देखने के लिए साइन इन करें",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको यह यूज़र देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "यूज़र नहीं मिला",
        description: "हमें यह यूज़र नहीं मिला",
      },
      serverError: {
        title: "कुछ गड़बड़ हुई",
        description: "हम यूज़र का ब्योरा लोड नहीं कर सके। फिर कोशिश करें",
      },
      unknown: {
        title: "अप्रत्याशित एरर",
        description: "कुछ अप्रत्याशित हुआ। फिर कोशिश करें",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "डेटा टकराव",
        description: "यूज़र का डेटा बदल गया है। रिफ़्रेश करें और फिर कोशिश करें",
      },
    },
    success: {
      title: "यूज़र लोड हुआ",
      description: "यूज़र का ब्योरा सफलतापूर्वक लोड हुआ",
    },
    empty: "कोई यूज़र डेटा नहीं मिला",
    sections: {
      basicInfo: "बुनियादी जानकारी",
      chatActivity: "चैट गतिविधि",
      credits: "क्रेडिट",
      payments: "पेमेंट",
      newsletter: "न्यूज़लेटर",
      referrals: "रेफ़रल",
      recentActivity: "हाल की गतिविधि",
    },
    status: {
      active: "सक्रिय",
      banned: "बैन",
      inactive: "निष्क्रिय",
      verified: "वेरिफ़ाइड",
    },
    fields: {
      userId: "यूज़र ID",
      locale: "लोकेल",
      twoFactor: "टू-फ़ैक्टर ऑथ",
      enabled: "चालू",
      disabled: "बंद",
      marketing: "मार्केटिंग",
      optedIn: "सहमत",
      optedOut: "सहमत नहीं",
      created: "बनाया गया",
      lastUpdated: "आख़िरी अपडेट",
      banReason: "बैन की वजह",
      roles: "रोल",
    },
    credits: {
      currentBalance: "मौजूदा बैलेंस",
      availableCredits: "उपलब्ध क्रेडिट",
      packBreakdown: "क्रेडिट पैक का ब्रेकडाउन",
      subscription: "सब्सक्रिप्शन",
      permanent: "स्थायी",
      bonus: "बोनस",
      earned: "कमाए",
      expires: "समाप्ति",
    },
    payment: {
      stripeCustomerId: "Stripe कस्टमर ID",
      activeSubscription: "सक्रिय सब्सक्रिप्शन",
      subscriptionPlan: "प्लान",
      subscriptionStatus: "सब्सक्रिप्शन स्थिति",
      nextBilling: "अगली बिलिंग",
    },
    common: {
      yes: "हाँ",
      no: "नहीं",
    },
    newsletter: {
      status: "स्थिति",
      subscribed: "सब्सक्राइब्ड",
      notSubscribed: "सब्सक्राइब्ड नहीं",
      subscribedAt: "सब्सक्राइब करने का समय",
      confirmedAt: "पुष्टि का समय",
      lastEmailSent: "आख़िरी भेजा ईमेल",
    },
    referrals: {
      totalReferrals: "कुल रेफ़रल",
      activeCodes: "सक्रिय कोड",
      revenue: "आय",
      earnings: "कमाई",
    },
    activity: {
      lastLogin: "आख़िरी लॉगिन",
      lastThread: "आख़िरी थ्रेड",
      lastMessage: "आख़िरी मैसेज",
      lastPayment: "आख़िरी पेमेंट",
    },
    tabs: {
      overview: "ओवरव्यू",
      credits: "क्रेडिट",
      referrals: "रेफ़रल",
      earnings: "कमाई",
      connections: "कनेक्शन",
      favorites: "पसंदीदा",
      skills: "स्किल",
    },
    modelUsage: {
      title: "मॉडल इस्तेमाल",
      model: "मॉडल",
      spent: "ख़र्च हुए क्रेडिट",
      messages: "मैसेज",
      noUsage: "मॉडल इस्तेमाल का कोई डेटा नहीं",
    },
    connections: {
      title: "कनेक्शन",
      leadsTitle: "जुड़ी हुई लीड",
      usersTitle: "जुड़े हुए यूज़र",
      noLeads: "कोई जुड़ी हुई लीड नहीं",
      noUsers: "कोई जुड़ा हुआ यूज़र नहीं",
      leadEmail: "ईमेल",
      leadBusiness: "बिज़नेस",
      leadStatus: "स्थिति",
      ipAddress: "IP पता",
      device: "डिवाइस",
      linkReason: "जुड़ाव की वजह",
      linkedAt: "जुड़ने का समय",
      userId: "यूज़र ID",
      userEmail: "ईमेल",
      userPublicName: "यूज़रनेम",
      viewLead: "लीड देखें",
      viewUser: "यूज़र देखें",
    },
    ban: {
      banUser: "यूज़र बैन करें",
      unbanUser: "यूज़र का बैन हटाएँ",
    },
    widget: {
      actions: {
        edit: "एडिट करें",
        delete: "हटाएँ",
        viewCreditHistory: "क्रेडिट हिस्ट्री देखें",
        viewSubscription: "सब्सक्रिप्शन देखें",
        viewReferralCodes: "रेफ़रल कोड देखें",
        viewReferralEarnings: "रेफ़रल कमाई देखें",
        addCredits: "क्रेडिट जोड़ें",
        viewLead: "लीड देखें",
        copyUserId: "यूज़र ID कॉपी करें",
        copied: "कॉपी हो गया!",
      },
      sections: {
        quickActions: "त्वरित कार्रवाइयाँ",
      },
      stats: {
        totalThreads: "कुल थ्रेड",
        totalMessages: "कुल मैसेज",
        userMessages: "यूज़र के मैसेज",
        lastActivity: "आख़िरी गतिविधि",
        never: "कभी नहीं",
        freeCredits: "फ़्री क्रेडिट",
        freePeriod: "अवधि",
        totalSpent: "कुल ख़र्च",
        totalPurchased: "कुल ख़रीदे",
        totalRevenue: "कुल आय",
        payments: "payments",
        successful: "सफल",
        failed: "फ़ेल",
        totalRefunds: "कुल रिफ़ंड",
        lastPayment: "आख़िरी पेमेंट",
      },
    },
  },
};
