import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tag: "यूज़र",
  get: {
    title: "यूज़र",
    titleShort: "यूज़र",
    description:
      "हर अकाउंट: कितना चुकाया, कितना खर्च करता है और आख़िरी बार कब सक्रिय था। खोजें, कमाई, गतिविधि, साइन अप की तारीख़ या स्रोत से फ़िल्टर करें, किसी भी पैसे वाले कॉलम से सॉर्ट करें।",
    fields: {
      hasSpentCredits: "क्रेडिट इस्तेमाल किए",
      requiredState: {
        label: "ज़रूरी स्थिति",
        description: "यह अकाउंट स्थिति भी ज़रूरी हो",
      },
      accountLocale: {
        label: "अकाउंट लोकेल",
        description: "सटीक अकाउंट लोकेल, जैसे en-US",
      },
      attributedRefCode: {
        label: "श्रेय वाला रेफ़रल कोड",
        description:
          "जिसे श्रेय मिला वह रेफ़रल कोड, या श्रेय न हो तो पहली विज़िट का कोड",
      },
      search: {
        label: "अकाउंट खोजें",
        description: "ईमेल, नाम, या यूज़र ID की शुरुआत",
        placeholder: "ईमेल, नाम या ID खोजें...",
      },
      roles: {
        label: "रोल",
        description: "इनमें से कोई भी रोल रखने वाले यूज़र",
        placeholder: "कोई भी रोल",
      },
      accountState: {
        label: "अकाउंट स्थिति",
        description: "सक्रिय, निष्क्रिय, बैन, वेरिफ़ाइड या अनवेरिफ़ाइड",
        placeholder: "कोई भी स्थिति",
      },
      payer: {
        label: "पेड या फ़्री",
        description: "पेड = अब तक कम से कम एक सफल पेमेंट",
        placeholder: "पेड या फ़्री",
      },
      subscription: {
        label: "सब्सक्रिप्शन",
        description: "अभी सक्रिय सब्सक्रिप्शन, कभी सब्सक्राइब किया, या कभी नहीं",
        placeholder: "कोई भी सब्सक्रिप्शन",
      },
      lastActive: {
        label: "आख़िरी सक्रिय",
        description: "गतिविधि = क्रेडिट खर्च, लॉगिन या पेमेंट",
        placeholder: "कभी भी",
      },
      signupFrom: {
        label: "साइन अप से",
        description: "शामिल करने के लिए पहला साइन अप दिन",
      },
      signupTo: {
        label: "साइन अप तक",
        description: "शामिल करने के लिए आख़िरी साइन अप दिन",
      },
      creditsMin: {
        label: "कम से कम क्रेडिट",
        description: "न्यूनतम वॉलेट बैलेंस",
      },
      creditsMax: {
        label: "अधिकतम क्रेडिट",
        description: "अधिकतम वॉलेट बैलेंस",
      },
      source: {
        label: "स्रोत",
        description:
          "पहला संपर्क चैनल, UTM source/medium/campaign, रेफ़रर होस्ट या रेफ़रल कोड",
        placeholder: "google, ref:, newsletter...",
      },
      referralActivity: {
        label: "रेफ़रर के रूप में",
        description: "जो यूज़र रेफ़रल लिंक शेयर करते हैं और उससे क्या मिला",
        placeholder: "कोई भी",
      },
      audience: {
        label: "ऑडियंस",
        description:
          "सिर्फ़ इंसान: एडमिन और टेस्ट पते (example.com, .invalid, .test फ़िक्स्चर) हटते हैं",
        placeholder: "सब",
      },
      channel: {
        label: "चैनल",
        description:
          "पहला संपर्क चैनल, सटीक मेल (google, youtube, direct)। जिन अकाउंट का कोई जर्नी नहीं, उनके लिए none इस्तेमाल करें",
        placeholder: "youtube",
      },
      channelType: {
        label: "चैनल किस्म",
        description: "पहला संपर्क हम तक कैसे पहुँचा",
        placeholder: "कोई भी किस्म",
      },
      refCode: {
        label: "रेफ़ कोड",
        description: "पहली विज़िट या श्रेय पाए रेफ़रल का रेफ़रल कोड, सटीक मेल",
        placeholder: "FRIEND2024",
      },
      plan: {
        label: "प्लान",
        description: "इस प्लान पर सक्रिय या ट्रायल वाला सब्सक्रिप्शन",
        placeholder: "कोई भी प्लान",
      },
      activeFrom: {
        label: "क्रेडिट खर्च से",
        description: "इस दिन या उसके बाद क्रेडिट इस्तेमाल किया",
      },
      activeTo: {
        label: "क्रेडिट खर्च तक",
        description: "इस दिन या उससे पहले क्रेडिट इस्तेमाल किया",
      },
      spentMin: {
        label: "कम से कम खर्च",
        description:
          "जीवनभर खर्च हुए क्रेडिट। फ़्री बर्नर खोजने के लिए कभी पेड नहीं के साथ जोड़ें",
      },
      paidFrom: {
        label: "पेमेंट से",
        description: "इस दिन या उसके बाद सफल पेमेंट किया",
      },
      paidTo: {
        label: "पेमेंट तक",
        description: "इस दिन या उससे पहले सफल पेमेंट किया",
      },
      sortBy: {
        label: "सॉर्ट करें",
        description: "सॉर्ट के लिए कॉलम",
      },
      sortOrder: {
        label: "क्रम",
        description: "बढ़ता या घटता",
      },
      page: {
        label: "पेज",
        description: "पेज नंबर, 1 से शुरू",
      },
      limit: {
        label: "प्रति पेज",
        description: "प्रति पेज यूज़र (अधिकतम 200)",
      },
    },
    response: {
      users: "यूज़र",
      summary: "सार",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "यूज़र देखने के लिए लॉग इन करें",
      },
      validation: {
        title: "गलत फ़िल्टर",
        description: "फ़िल्टर की वैल्यू जाँचें और फिर कोशिश करें",
      },
      forbidden: {
        title: "सिर्फ़ एडमिन के लिए",
        description: "यूज़र देखने के लिए एडमिन रोल चाहिए",
      },
      server: {
        title: "यूज़र लोड नहीं हुए",
        description: "सर्वर यूज़र लिस्ट लोड नहीं कर सका",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "यूज़र लोड करते समय कुछ गड़बड़ हुई",
      },
      conflict: {
        title: "टकराव",
        description: "रिक्वेस्ट मौजूदा डेटा से टकराती है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक पहुँच नहीं हो सकी",
      },
      notFound: {
        title: "कोई यूज़र नहीं",
        description: "इन फ़िल्टर से कोई यूज़र मेल नहीं खाता",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "यूज़र लोड हुए",
      description: "यूज़र लिस्ट लोड हुई",
    },
  },
  enums: {
    audience: {
      all: "सब",
      humans: "सिर्फ़ इंसान",
    },
    channelType: {
      campaign: "कैंपेन",
      referral: "रेफ़रल",
      organic: "ऑर्गेनिक",
      direct: "डायरेक्ट",
    },
    plan: {
      subscription: "Starter",
      plus: "Plus",
      pro: "Pro",
      ultra: "Ultra",
    },
    sortOrder: {
      asc: "बढ़ता क्रम",
      desc: "घटता क्रम",
    },
    role: {
      admin: "एडमिन",
      customer: "ग्राहक",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर कर्मचारी",
      public: "पब्लिक",
    },
    subscription: {
      any: "कोई भी",
      hasActive: "अभी सक्रिय",
      hadAny: "कभी सब्सक्राइब किया",
      never: "कभी सब्सक्राइब नहीं किया",
    },
    referrer: {
      any: "कोई भी",
      hasCode: "रेफ़रल लिंक है",
      hasClicks: "लिंक पर क्लिक आए",
      hasSignups: "लिंक से साइन अप आए",
      hasSubscribers: "लिंक से पेइंग सब्सक्राइबर आए",
    },
    sortField: {
      createdAt: "साइन अप की तारीख़",
      lastActive: "आख़िरी सक्रिय",
      credits: "क्रेडिट बैलेंस",
      totalPaid: "कुल चुकाया",
      creditsSpent: "खर्च हुए क्रेडिट",
      email: "ईमेल",
      name: "नाम",
    },
    accountState: {
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      banned: "बैन",
      verified: "ईमेल वेरिफ़ाइड",
      unverified: "ईमेल अनवेरिफ़ाइड",
    },
    payer: {
      any: "पेड या फ़्री",
      paid: "पेइंग",
      free: "कभी पेड नहीं",
    },
    lastActive: {
      any: "कभी भी",
      day: "पिछले 24 घंटे",
      week: "पिछले 7 दिन",
      month: "पिछले 30 दिन",
      dormant: "30+ दिन से निष्क्रिय",
      never: "कभी सक्रिय नहीं",
    },
  },
  widget: {
    planStatus: "प्लान",
    accountActive: "सक्रिय",
    accountInactive: "निष्क्रिय",
    none: "कोई नहीं",
    creditAmount: "{{count}} क्रेडिट",
    spent30d: "30 दिन में {{count}}",
    notTracked: "ट्रैक नहीं",
    oneOff: "सिर्फ़ क्रेडिट",
    refCode: "ref:{{code}}",
    chips: {
      paid: "पेड",
      signedUp: "साइन अप",
      spentCredits: "क्रेडिट खर्च किए",
      remove: "फ़िल्टर {{label}} हटाएँ",
    },
    creditsAny: "कोई भी",
    titleWithCount: "यूज़र ({{count}})",
    loading: "यूज़र लोड हो रहे हैं...",
    never: "कभी नहीं",
    referredBy: "{{email}} के ज़रिए",
    actions: {
      open: "खोलें",
      select: "चुनें",
      openUser: "{{email}} का अकाउंट खोलें",
      selectUser: "{{email}} चुनें",
      stats: "साइन अप रिपोर्ट",
      refresh: "रिफ़्रेश",
      newUser: "नया यूज़र",
      clearFilters: "फ़िल्टर हटाएँ",
      moreFilters: "फ़िल्टर",
    },
    kpi: {
      activeSpentHint: "30 दिन में {{credits}} क्रेडिट खर्च हुए",
      matchingHint:
        "हर हफ़्ते के साइन अप, पिछले 12 पूरे हफ़्ते। पिछला हफ़्ता: {{last}}, इस हफ़्ते अब तक: {{count}}",
      verified: "ईमेल वेरिफ़ाइड",
      verifiedHint: "वेरिफ़ाइड: {{count}}",
      active: "30 दिन में सक्रिय",
      matching: "मेल खाते यूज़र",
      paying: "पेइंग",
      payingShare: "मेल खाते यूज़र का {{percent}}%",
      revenue: "जीवनभर की कमाई",
      revenueHint: "सफल पेमेंट, USD",
      credits: "रखे क्रेडिट",
      creditsHint: "वॉलेट बैलेंस का योग",
    },
    quick: {
      freeBurn: "फ़्री बर्न {{min}}+ ({{count}})",
      banned: "बैन ({{count}})",
      humans: "सिर्फ़ इंसान",
      paying: "पेइंग ({{count}})",
      free: "कभी पेड नहीं",
      activeWeek: "7 दिन में सक्रिय",
      dormant: "30+ दिन निष्क्रिय",
      never: "कभी सक्रिय नहीं",
    },
    columns: {
      flags: "फ़्लैग",
      user: "यूज़र",
      joined: "जुड़ा",
      lastActive: "आख़िरी सक्रिय",
      credits: "बैलेंस",
      spent: "खर्च (जीवनभर)",
      paid: "चुकाया",
      subscription: "प्लान",
      source: "स्रोत",
      id: "ID",
    },
    compact: {
      joined: "{{date}} को जुड़ा",
      active: "{{when}} सक्रिय",
      neverActive: "कभी सक्रिय नहीं",
      paid: "{{amount}} चुकाया",
      free: "कभी पेड नहीं",
      spent: "{{count}} क्रेडिट खर्च",
    },
    flags: {
      freeBurn: "फ़्री बर्न",
      admin: "एडमिन",
      banned: "बैन",
      unverified: "अनवेरिफ़ाइड",
    },
    empty: {
      none: "अभी कोई यूज़र नहीं",
      filtered: "इन फ़िल्टर से कोई यूज़र मेल नहीं खाता",
      filteredHint: "कोई फ़िल्टर ढीला करें या सब हटा दें।",
    },
    pagination: {
      previous: "पिछला पेज",
      next: "अगला पेज",
      showing: "{{total}} में से {{start}}-{{end}}",
    },
    text: {
      subheader:
        "{{verified}} वेरिफ़ाइड | 30 दिन में {{active}} सक्रिय | {{banned}} बैन | साइन अप/हफ़्ता (12w): {{weekly}}",
      header: "{{total}} यूज़र | {{paying}} पेइंग | {{paid}} जीवनभर की कमाई",
      pageHint: "पेज {{page}}/{{pages}}। अगला: --page={{next}}",
      detailHint: "ब्योरा: vibe users-view --userId=<ID>",
    },
    planFree: "फ़्री",
  },
};
