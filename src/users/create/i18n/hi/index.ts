import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",
  tags: {
    create: "बनाएँ",
    admin: "एडमिन",
  },
  post: {
    title: "यूज़र बनाएँ",
    titleShort: "यूज़र बनाएँ",
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
      description: "कम से कम 8 अक्षर रखें।",
    },
    privateName: {
      label: "निजी नाम",
      description: "यूज़र का पूरा कानूनी नाम (सिर्फ़ एडमिन को दिखता है)",
    },
    publicName: {
      label: "पब्लिक नाम",
      description: "यूज़र का डिस्प्ले नाम (सबको दिखता है)",
    },
    firstName: {
      label: "पहला नाम",
      description: "यूज़र का पहला नाम",
    },
    lastName: {
      label: "अंतिम नाम",
      description: "यूज़र का अंतिम नाम",
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
      label: "पसंदीदा संपर्क तरीका",
      description: "यूज़र से किस तरीके से संपर्क करना पसंद है",
    },
    roles: {
      label: "यूज़र रोल",
      placeholder: "रोल असाइन करें",
      description: "यूज़र को रोल असाइन करें",
    },
    imageUrl: {
      label: "प्रोफ़ाइल इमेज URL",
      description: "यूज़र की प्रोफ़ाइल इमेज का URL",
    },
    bio: {
      label: "बायो",
      description: "यूज़र के बारे में संक्षिप्त विवरण",
    },
    website: {
      label: "वेबसाइट",
      description: "यूज़र की निजी या कंपनी वेबसाइट",
    },
    jobTitle: {
      label: "जॉब टाइटल",
      description: "यूज़र का जॉब टाइटल या पद",
    },
    emailVerified: {
      label: "ईमेल वेरिफ़ाइड",
      description: "यूज़र का ईमेल वेरिफ़ाइड है या नहीं",
    },
    isActive: {
      label: "एक्टिव स्टेटस",
      description: "यूज़र अकाउंट एक्टिव है या नहीं",
    },
    leadId: {
      label: "लीड ID",
      description: "जुड़ी लीड की पहचान",
    },
    country: {
      label: "देश",
      placeholder: "देश चुनें",
      description: "यूज़र का निवास देश",
    },
    language: {
      label: "भाषा",
      placeholder: "भाषा चुनें",
      description: "यूज़र की पसंदीदा भाषा",
    },
    response: {
      title: "यूज़र बन गया",
      description: "नए बने यूज़र का ब्योरा",
      id: {
        content: "यूज़र ID",
      },
      leadId: {
        content: "जुड़ी लीड ID",
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
        content: "पब्लिक नाम",
      },
      firstName: {
        content: "पहला नाम",
      },
      lastName: {
        content: "अंतिम नाम",
      },
      company: {
        content: "कंपनी",
      },
      phone: {
        content: "फ़ोन नंबर",
      },
      preferredContactMethod: {
        content: "पसंदीदा संपर्क तरीका",
      },
      imageUrl: {
        content: "प्रोफ़ाइल इमेज",
      },
      bio: {
        content: "बायो",
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
        content: "एक्टिव स्टेटस",
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
        content: "बनाने का समय",
      },
      updatedAt: {
        content: "अपडेट का समय",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत एक्सेस",
        description: "यूज़र बनाने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "फ़ॉर्म का डेटा जाँचें और दोबारा कोशिश करें",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर एरर की वजह से यूज़र नहीं बन सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "यूज़र बनाते समय कोई अनपेक्षित एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "यूज़र बनाते समय नेटवर्क कनेक्शन फ़ेल हुआ",
      },
      forbidden: {
        title: "एक्सेस मना है",
        description: "आपके पास यूज़र बनाने की अनुमति नहीं है",
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
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं, वो खो जाएँगे",
      },
      internal: {
        title: "इंटरनल एरर: {{details}}",
        description: "यूज़र बनाते समय इंटरनल एरर आया",
      },
    },
    sms: {
      errors: {
        welcome_failed: {
          title: "SMS वेलकम फ़ेल हुआ",
          description: "यूज़र को वेलकम SMS नहीं भेजा जा सका",
        },
        verification_failed: {
          title: "SMS वेरिफ़िकेशन फ़ेल हुआ",
          description: "यूज़र को वेरिफ़िकेशन SMS नहीं भेजा जा सका",
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
    headerCreate: "नया यूज़र",
    headerSubtitle: "एडमिन या कस्टमर अकाउंट जोड़ें। वो तुरंत साइन इन कर सकते हैं।",
    activeBadge: "एक्टिव",
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
    createButton: "यूज़र बनाएँ",
    sections: {
      signIn: "साइन-इन",
      profile: "प्रोफ़ाइल",
      access: "एक्सेस",
    },
  },
  email: {
    users: {
      welcome: {
        greeting: "हमारे प्लेटफ़ॉर्म पर स्वागत है, {{firstName}}!",
        preview: "आपका अकाउंट सफलतापूर्वक बन गया है",
        subject: "{{companyName}} में स्वागत है, आपका अकाउंट तैयार है!",
        introduction:
          "नमस्ते {{firstName}}, आपका साथ पाकर हमें ख़ुशी है! आपका अकाउंट सफलतापूर्वक बन गया है और अब आप हमारे सभी फ़ीचर इस्तेमाल कर सकते हैं।",
        accountDetails: "अकाउंट का ब्योरा",
        email: "ईमेल",
        name: "नाम",
        publicName: "डिस्प्ले नाम",
        company: "कंपनी",
        phone: "फ़ोन",
        nextSteps: "अगले कदम",
        loginButton: "अपने अकाउंट में लॉग इन करें",
        support: "कोई सवाल हो तो हमारी सपोर्ट टीम मदद के लिए है। कभी भी संपर्क करें!",
      },
      admin: {
        newUser: "नया यूज़र बना",
        preview: "नया यूज़र {{firstName}} {{lastName}} बना है",
        subject: "नया यूज़र अकाउंट बना: {{firstName}} {{lastName}}",
        notification: "सिस्टम में एक नया यूज़र अकाउंट बना है। ब्योरा ये रहा:",
        userDetails: "यूज़र का ब्योरा",
        viewUser: "यूज़र प्रोफ़ाइल देखें",
      },
      errors: {
        missing_data: "ईमेल टेम्पलेट के लिए ज़रूरी यूज़र डेटा नहीं है",
      },
      error: {
        general: {
          internal_server_error: "इंटरनल सर्वर एरर आया",
        },
      },
      labels: {
        id: "ID:",
        email: "ईमेल:",
        name: "नाम:",
        privateName: "पूरा नाम:",
        publicName: "डिस्प्ले नाम:",
        company: "कंपनी:",
        created: "बनाया गया:",
        leadId: "लीड ID:",
      },
    },
  },
  sms: {
    welcome: {
      message:
        "स्वागत है {{firstName}}! आपका अकाउंट सफलतापूर्वक बन गया है। हमसे मिलिए: {{appUrl}}",
    },
    verification: {
      message:
        "{{firstName}}, आपका वेरिफ़िकेशन कोड है: {{code}}। कोड 10 मिनट के अंदर डालें।",
    },
    errors: {
      welcome_failed: {
        title: "SMS वेलकम फ़ेल हुआ",
        description: "यूज़र को वेलकम SMS नहीं भेजा जा सका",
      },
      verification_failed: {
        title: "SMS वेरिफ़िकेशन फ़ेल हुआ",
        description: "यूज़र को वेरिफ़िकेशन SMS नहीं भेजा जा सका",
      },
    },
  },
  countries: {
    ...regionalCountryNames("hi"),
    global: "ग्लोबल",
    de: "जर्मनी",
    pl: "पोलैंड",
    fr: "फ़्रांस",
    us: "संयुक्त राज्य अमेरिका",
  },
  languages: {
    it: "इतालवी",
    es: "स्पेनिश",
    sk: "स्लोवाक",
    hi: "हिंदी",
    en: "अंग्रेज़ी",
    de: "जर्मन",
    pl: "पोलिश",
    fr: "फ़्रेंच",
  },
  enums: {
    userRole: {
      public: "पब्लिक",
      customer: "कस्टमर",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर कर्मचारी",
      admin: "एडमिन",
      cliOff: "CLI बंद",
      cliAuthBypass: "CLI ऑथ बायपास",
      aiToolOff: "AI टूल बंद",
      webOff: "वेब बंद",
      mcpOff: "MCP बंद",
      mcpVisible: "MCP दिखता है",
      productionOff: "प्रोडक्शन बंद",
      skillOff: "स्किल बंद",
    },
  },
};
