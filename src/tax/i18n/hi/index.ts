import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "टैक्स",
  endpointCategories: {
    tax: "टैक्स",
    taxRates: "टैक्स दरें",
    taxReports: "टैक्स रिपोर्ट",
  },

  rate: {
    details: "दर का ब्योरा",
    create: {
      title: "टैक्स दर जोड़ें",
      titleShort: "टैक्स दर जोड़ें",
      description: "अपनी कंपनी के लिए टैक्स दर जोड़ें",
      widget: {
        save: "टैक्स दर बनाएँ",
        backToList: "टैक्स दरों पर वापस",
      },
      companyId: {
        label: "कंपनी",
        description: "वो कंपनी जिसकी ये टैक्स दर है",
        placeholder: "कंपनी ID",
      },
      name: {
        label: "नाम",
        description: "टैक्स दर का वर्णनात्मक नाम",
        placeholder: "जैसे VAT 20%",
      },
      code: {
        label: "कोड",
        description: "इस टैक्स दर की छोटी पहचान",
        placeholder: "जैसे AT-VAT20",
      },
      type: {
        label: "टैक्स टाइप",
        description: "टैक्स की श्रेणी",
        placeholder: "टैक्स टाइप चुनें",
      },
      rate: {
        label: "दर",
        description: "टैक्स दर दशमलव में (0.2 = 20%)",
        placeholder: "0.2000",
      },
      country: {
        label: "देश",
        description: "वो देश जहाँ ये टैक्स दर लागू होती है (वैकल्पिक)",
        placeholder: "जैसे AT",
      },
      region: {
        label: "क्षेत्र",
        description: "वो क्षेत्र या राज्य जहाँ ये दर लागू होती है (वैकल्पिक)",
        placeholder: "जैसे Vienna",
      },
      isDefault: {
        label: "डिफ़ॉल्ट दर",
        description: "नए आइटम के लिए इस दर को डिफ़ॉल्ट रखें",
      },
      response: {
        id: "टैक्स दर ID",
        code: "टैक्स दर कोड",
        name: "टैक्स दर का नाम",
      },
      success: {
        title: "टैक्स दर जुड़ गई",
        description: "टैक्स दर आपकी कंपनी में जोड़ दी गई है",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपका लॉग इन होना ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपके पास टैक्स दरें मैनेज करने की अनुमति नहीं है",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        conflict: {
          title: "कोड पहले से इस्तेमाल में है",
          description: "इस कोड की टैक्स दर पहले से मौजूद है",
        },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
    },
    list: {
      title: "टैक्स दरें",
      titleShort: "टैक्स दरें",
      description: "आपकी कंपनी के लिए कॉन्फ़िगर की गई सभी टैक्स दरें",
      widget: {
        actions: "कार्रवाइयाँ",
        retry: "दोबारा कोशिश करें",
        previous: "पिछला",
        next: "अगला",
        addRate: "दर जोड़ें",
        labelDefault: "डिफ़ॉल्ट",
        labelActive: "एक्टिव",
        labelInactive: "निष्क्रिय",
        labelEdit: "एडिट करें",
        labelDelete: "निष्क्रिय करें",
        labelCompound: "कंपाउंड",
        empty: "कोई टैक्स दर कॉन्फ़िगर नहीं। शुरू करने के लिए अपनी पहली दर जोड़ें।",
        emptySetup: "वो टैक्स दरें सेट करें जो आपकी कंपनी इनवॉइस पर इस्तेमाल करती है।",
        columnRate: "टैक्स दर",
        columnTypeRateActions: "टाइप / दर / स्टेटस",
        backToCatalog: "← प्रोडक्ट",
      },
      companyId: {
        label: "कंपनी",
        description: "जिस कंपनी की टैक्स दरें दिखानी हैं",
        placeholder: "कंपनी ID",
      },
      country: {
        label: "देश फ़िल्टर",
        description: "देश कोड से फ़िल्टर करें (वैकल्पिक)",
        placeholder: "जैसे AT",
      },
      type: {
        label: "टाइप फ़िल्टर",
        description: "टैक्स टाइप से फ़िल्टर करें (वैकल्पिक)",
        placeholder: "टैक्स टाइप चुनें",
      },
      page: {
        label: "पेज",
        description: "पेज नंबर (1 से शुरू)",
      },
      pageSize: {
        label: "प्रति पेज",
        description: "प्रति पेज नतीजे (ज़्यादा से ज़्यादा 100)",
      },
      response: {
        total: "कुल",
        rates: "टैक्स दरें",
        rate: {
          id: "ID",
          company: "कंपनी",
          name: "नाम",
          code: "कोड",
          type: "टाइप",
          rate: "दर",
          country: "देश",
          region: "क्षेत्र",
          isDefault: "डिफ़ॉल्ट",
          isActive: "एक्टिव",
          isCompound: "कंपाउंड",
          createdAt: "बनाया गया",
          updatedAt: "अपडेट किया गया",
          validFrom: "इस तारीख़ से वैध",
          validTo: "इस तारीख़ तक वैध",
        },
      },
      success: {
        title: "टैक्स दरें लोड हो गईं",
        description: "टैक्स दरें सफलतापूर्वक मिल गईं",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपका लॉग इन होना ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपके पास टैक्स दरें देखने की अनुमति नहीं है",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        conflict: { title: "टकराव", description: "टकराव हो गया" },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      validOn: {
        label: "इस तारीख़ को वैध",
        description: "सिर्फ़ वो दरें दिखाएँ जो इस दिन कानूनी रूप से लागू हैं",
      },
    },
    update: {
      title: "टैक्स दर एडिट करें",
      titleShort: "टैक्स दर एडिट करें",
      description: "मौजूदा टैक्स दर बदलें",
      widget: {
        save: "टैक्स दर सेव करें",
        backToList: "टैक्स दरों पर वापस",
        failed: "टैक्स दर सेव नहीं हुई",
        subtitle: "{{company}} · {{code}}",
        notFoundTitle: "ये टैक्स दर अब मौजूद नहीं है",
        notFoundMessage:
          "वो हटा दी गई थी, या किसी ऐसी कंपनी की है जिसे आप नहीं खोल सकते। लिस्ट से कोई दर चुनें।",
        loadErrorTitle: "टैक्स दर लोड नहीं हो सकी",
      },
      rateId: {
        label: "टैक्स दर ID",
        description: "अपडेट करने वाली टैक्स दर की ID",
        placeholder: "टैक्स दर UUID",
      },
      name: {
        label: "नाम",
        description: "टैक्स दर का नया नाम",
        placeholder: "जैसे VAT 20%",
      },
      rate: {
        label: "दर",
        description: "दशमलव में नई टैक्स दर (0.2 = 20%)",
        placeholder: "0.2000",
      },
      isDefault: {
        label: "डिफ़ॉल्ट दर",
        description: "नए आइटम के लिए इस दर को डिफ़ॉल्ट रखें",
      },
      isActive: {
        label: "एक्टिव",
        description: "ये टैक्स दर अभी एक्टिव है या नहीं",
      },
      response: {
        updated: "अपडेट किया गया",
      },
      success: {
        title: "टैक्स दर सेव हो गई",
        description: "टैक्स दर अपडेट हो गई है",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपका लॉग इन होना ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपके पास टैक्स दरें मैनेज करने की अनुमति नहीं है",
        },
        notFound: { title: "नहीं मिला", description: "टैक्स दर नहीं मिली" },
        conflict: { title: "टकराव", description: "टकराव हो गया" },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
    },
    delete: {
      title: "टैक्स दर निष्क्रिय करें",
      titleShort: "दर निष्क्रिय करें",
      description: "टैक्स दर निष्क्रिय करें",
      widget: {
        backToList: "टैक्स दरों पर वापस",
        warning: "इससे टैक्स दर निष्क्रिय हो जाएगी। ये कार्रवाई वापस नहीं हो सकती।",
        confirmTitle: "ये टैक्स दर निष्क्रिय करें?",
        confirmDescription:
          "निष्क्रिय दरें अब इनवॉइस पर लागू नहीं हो सकतीं। मौजूदा इनवॉइस लाइनों पर असर नहीं पड़ता।",
        confirmButton: "हाँ, निष्क्रिय करें",
        cancelButton: "रद्द करें",
      },
      rateId: {
        label: "टैक्स दर ID",
        description: "निष्क्रिय करने वाली टैक्स दर की ID",
        placeholder: "टैक्स दर UUID",
      },
      response: {
        deleted: "निष्क्रिय",
      },
      success: {
        title: "टैक्स दर निष्क्रिय हो गई",
        description: "टैक्स दर निष्क्रिय कर दी गई है",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपका लॉग इन होना ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपके पास टैक्स दरें मैनेज करने की अनुमति नहीं है",
        },
        notFound: { title: "नहीं मिला", description: "टैक्स दर नहीं मिली" },
        conflict: { title: "टकराव", description: "टकराव हो गया" },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
    },
  },

  report: {
    title: "दर के हिसाब से टैक्स",
    titleShort: "दर के हिसाब से टैक्स",
    description:
      "सेल्स इनवॉइस, क्रेडिट नोट, सप्लायर बिल और टिल बिक्री पर दर्ज टैक्स देखें।",
    widget: {
      retry: "रिपोर्ट दोबारा चलाएँ",
      scope:
        "इनवॉइस अपनी जुड़ी लेजर तारीख़ या बनने की तारीख़ इस्तेमाल करते हैं। खरीद बिल की तारीख़ इस्तेमाल करती है। टिल बिक्री अपनी UTC पूर्णता तारीख़ इस्तेमाल करती है और सकारात्मक दर या दर्ज टैक्स वाली लाइनें शामिल करती है। जब जारी इनवॉइस टिल बिक्री के साथ एक लेजर एंट्री साझा करे, तो इनवॉइस ही बिक्री को दर्शाता है।",
      empty:
        "टैक्स वाले जारी इनवॉइस, क्रेडिट नोट, सप्लायर बिल और टिल बिक्री यहाँ दर के हिसाब से ग्रुप होकर दिखते हैं।",
      range: "{{from}} से {{to}}",
      total: "कुल",
      previousMonth: "पिछला महीना दिखाएँ",
      unknownRate: "दर उपलब्ध नहीं",
      run: "रिपोर्ट चलाएँ",
      running: "रिपोर्ट चल रही है…",
      scopeHint:
        "एक कंपनी और अवधि के लिए दर के हिसाब से बिक्री और खरीद का टैक्स तुलना करें।",
      selectCompany: "इस रिपोर्ट की कंपनी चुनें।",
      subtitle: "{{company}} · {{from}} से {{to}}",
      errorTitle: "टैक्स रिपोर्ट लोड नहीं हो सकी",
      emptyTitle: "इस अवधि में टैक्स वाले कोई दस्तावेज़ नहीं",
      period: {
        label: "अवधि",
        thisMonth: "इस महीने",
        lastMonth: "पिछले महीने",
        thisQuarter: "इस तिमाही",
        thisYear: "इस साल",
        custom: "कस्टम",
      },
      kpi: {
        salesTax: "बिक्री पर टैक्स",
        salesBase: "टैक्स योग्य बिक्री",
        purchaseTax: "खरीद पर टैक्स",
        purchaseBase: "टैक्स योग्य खरीद",
      },
    },
    currency: {
      label: "करेंसी",
      placeholder: "कंपनी की करेंसी",
      description: "डिफ़ॉल्ट रूप से कंपनी की करेंसी।",
    },
    currencies: { EUR: "EUR", PLN: "PLN", USD: "USD" },
    companyId: {
      label: "कंपनी",
      description: "जिस कंपनी की टैक्स रिपोर्ट बनानी है",
      placeholder: "कंपनी ID",
    },
    dateFrom: {
      label: "से",
      description: "रिपोर्ट अवधि की शुरुआती तारीख़",
      placeholder: "इस महीने की शुरुआत",
    },
    dateTo: {
      label: "तक",
      description: "रिपोर्ट अवधि की अंतिम तारीख़",
      placeholder: "आज",
    },
    response: {
      rows: "रिपोर्ट की पंक्तियाँ",
      row: {
        direction: "दस्तावेज़ का प्रकार",
        rate: "टैक्स दर",
        taxableAmount: "टैक्स योग्य रकम",
        taxAmount: "टैक्स",
      },
    },
    success: {
      title: "टैक्स रिपोर्ट बन गई",
      description: "टैक्स रिपोर्ट सफलतापूर्वक मिल गई",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "शुरुआती तारीख़ के दिन या उसके बाद की अंतिम तारीख़ चुनें।",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "टैक्स रिपोर्ट का एक्सेस ज़रूरी",
        description: "आपके पास इस कंपनी की टैक्स रिपोर्ट देखने की अनुमति नहीं है।",
      },
      notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
      conflict: { title: "टकराव", description: "टकराव हो गया" },
      server: {
        title: "सर्वर एरर",
        description: "इंटरनल एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
  },

  enums: {
    reportDirection: {
      nonDeductible: "नॉन-डिडक्टिबल सप्लायर VAT",
      reverseCharge: "रिवर्स-चार्ज VAT देय",
      posSales: "टिल बिक्री",
      sales: "सेल्स इनवॉइस",
      creditNotes: "सेल्स क्रेडिट नोट",
      purchases: "सप्लायर बिल",
    },
    taxType: {
      vat: "VAT",
      gst: "GST",
      sales: "सेल्स टैक्स",
      withholding: "विदहोल्डिंग टैक्स",
      none: "कोई टैक्स नहीं / छूट",
    },
  },

  tags: {
    tax: "tax",
    rate: "rate",
    create: "create",
    list: "list",
    update: "update",
    delete: "delete",
    report: "report",
  },
};
