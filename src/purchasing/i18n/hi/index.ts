import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "खरीदारी",
  orderAction: {
    backToOrder: "ऑर्डर पर वापस",
    keepOrder: "ऑर्डर बनाए रखें",
    openOrder: "खुला ऑर्डर",
    expected: "अपेक्षित",
    total: "ऑर्डर कुल",
    notAvailable: "इस ऑर्डर के लिए उपलब्ध नहीं",
  },
  tags: {
    purchasing: "खरीदारी",
    vendor: "वेंडर",
    order: "परचेज़ ऑर्डर",
    receipt: "रसीद",
    create: "बनाएँ",
    list: "सूची",
    get: "लाएँ",
    update: "अपडेट",
    deactivate: "निष्क्रिय करें",
    send: "भेजें",
    confirm: "कन्फ़र्म करें",
    receive: "प्राप्त करें",
    cancel: "रद्द करें",
    convertToBill: "बिल में बदलें",
    addLine: "लाइन जोड़ें",
    removeLine: "लाइन हटाएँ",
  },
  endpointCategories: {
    purchasing: "खरीदारी",
    vendors: "वेंडर",
    purchaseOrders: "परचेज़ ऑर्डर",
    purchasingOrders: "परचेज़ ऑर्डर",
    purchasingVendors: "वेंडर",
  },
  enums: {
    poStatus: {
      draft: "ड्राफ़्ट",
      sent: "भेजे गए",
      confirmed: "कन्फ़र्म",
      partiallyReceived: "आंशिक रूप से प्राप्त",
      received: "प्राप्त",
      billed: "बिल हो चुका",
      cancelled: "रद्द",
    },
  },

  // Vendor create
  vendorCreate: {
    post: {
      title: "वेंडर बनाएँ",
      titleShort: "वेंडर बनाएँ",
      description: "अपनी कंपनी के लिए नया सप्लायर रजिस्टर करें।",
      widget: {
        back: "वापस",
        viewVendor: "वेंडर खोलें",
        createAnother: "एक और बनाएँ",
        subtitle: "सप्लायर एक बार जोड़ें। परचेज़ ऑर्डर और बिल उसे नाम से चुन लेते हैं।",
        cancel: "रद्द करें",
        allVendors: "सभी वेंडर",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "सभी फ़ील्ड जाँचें और दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "वेंडर बनाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "आपके पास मेंबर या उससे ऊपर की भूमिका होनी चाहिए",
        },
        conflict: {
          title: "कोड पहले से मौजूद है",
          description: "इस कोड वाला वेंडर पहले से मौजूद है",
        },
        server: {
          title: "सर्वर एरर",
          description: "वेंडर नहीं बन सका। फिर कोशिश करें।",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेंडर बन गया",
        description: "वेंडर सफलतापूर्वक रजिस्टर हो गया",
      },
      response: {
        id: "वेंडर ID",
        name: "नाम",
        code: "कोड",
        email: "ईमेल",
        isActive: "सक्रिय",
        createdAt: "बनाया गया",
      },
    },
    companyId: {
      label: "कंपनी",
      description: "वह कंपनी जिसका यह वेंडर है",
      placeholder: "कंपनी UUID",
    },
    name: {
      label: "वेंडर का नाम",
      description: "सप्लायर का क़ानूनी नाम",
      placeholder: "Acme GmbH",
    },
    code: {
      label: "कोड",
      description: "छोटा आंतरिक आइडेंटिफ़ायर (वैकल्पिक)",
      placeholder: "ACM-001",
    },
    email: {
      label: "ईमेल",
      description: "वेंडर का संपर्क ईमेल",
      placeholder: "orders@acme.com",
    },
    phone: {
      label: "फ़ोन",
      description: "वेंडर का संपर्क फ़ोन",
      placeholder: "+49 30 12345678",
    },
    website: {
      label: "वेबसाइट",
      description: "वेंडर की वेबसाइट",
      placeholder: "https://acme.com",
    },
    vatNumber: {
      label: "VAT नंबर",
      description: "वेंडर का VAT रजिस्ट्रेशन नंबर",
      placeholder: "DE123456789",
    },
    taxId: {
      label: "टैक्स ID",
      description: "वेंडर का टैक्स आइडेंटिफ़िकेशन नंबर",
      placeholder: "12345678",
    },
    addressLine1: {
      label: "पता लाइन 1",
      description: "सड़क और नंबर",
      placeholder: "123 Main Street",
    },
    addressLine2: {
      label: "पता लाइन 2",
      description: "सुइट, फ़्लोर आदि",
      placeholder: "Floor 2",
    },
    city: { label: "शहर", description: "शहर", placeholder: "Berlin" },
    region: {
      label: "क्षेत्र / राज्य",
      description: "क्षेत्र या राज्य",
      placeholder: "Berlin",
    },
    postalCode: {
      label: "पिन कोड",
      description: "पोस्टल या ZIP कोड",
      placeholder: "10115",
    },
    country: {
      label: "देश",
      description: "देश का कोड (ISO 3166-1 alpha-2)",
      placeholder: "DE",
    },
    defaultCurrency: {
      label: "डिफ़ॉल्ट करेंसी",
      description: "इस वेंडर के परचेज़ ऑर्डर की करेंसी",
      placeholder: "EUR",
    },
    defaultPaymentTermsDays: {
      label: "भुगतान की शर्तें (दिन)",
      description: "दिनों में डिफ़ॉल्ट पेमेंट शर्तें",
      placeholder: "30",
    },
    notes: {
      label: "नोट्स",
      description: "इस वेंडर के बारे में आंतरिक नोट",
      placeholder: "इलेक्ट्रॉनिक्स के लिए पसंदीदा सप्लायर",
    },
  },

  // Vendor list
  vendorList: {
    get: {
      title: "वेंडर",
      titleShort: "वेंडर",
      description: "किसी कंपनी के सभी वेंडर देखें।",
      widget: {
        back: "वापस",
        active: "सक्रिय",
        inactive: "निष्क्रिय",
        total: "कुल",
        createVendor: "नया वेंडर",
        empty: "अभी कोई वेंडर नहीं",
        vatLabel: "VAT",
        vatPrefix: "VAT:",
        paymentTerms: "नेट {{days}} दिन",
        paymentTermsPrefix: "नेट",
        paymentTermsSuffix: "दिन",
        loading: "लोड हो रहा है…",
        subtitle: "जिनसे आप ख़रीदते हैं वे सप्लायर, उनकी शर्तों और संपर्क के साथ।",
        filterAll: "सभी",
        statusFilter: "वेंडर स्टेटस",
        search: "नाम, कोड, ईमेल या VAT खोजें",
        colVendor: "वेंडर",
        colContact: "ईमेल",
        colCurrency: "करेंसी",
        colStatus: "स्टेटस",
        emptyHint:
          "जिन सप्लायर से आप ख़रीदते हैं उन्हें जोड़ें। परचेज़ ऑर्डर और सप्लायर बिल उन्हें नाम से चुन लेते हैं।",
        noMatch: "इस फ़िल्टर से कोई वेंडर मैच नहीं करता",
        clearFilters: "फ़िल्टर हटाएँ",
        count: "{{total}} में से {{shown}} वेंडर",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "वेंडर देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस कंपनी का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "वेंडर की सूची नहीं मिल सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेंडर लोड हो गए",
        description: "वेंडर सूची मिल गई",
      },
      response: {
        id: "वेंडर ID",
        name: "नाम",
        code: "कोड",
        email: "ईमेल",
        vatNumber: "VAT",
        defaultCurrency: "करेंसी",
        defaultPaymentTermsDays: "पेमेंट शर्तें",
        isActive: "सक्रिय",
        createdAt: "बनाया गया",
      },
    },
    companyId: { label: "कंपनी", description: "जिस कंपनी के वेंडर देखने हैं" },
  },

  // Vendor get
  vendorGet: {
    get: {
      title: "वेंडर पाएँ",
      titleShort: "वेंडर की जानकारी",
      description: "किसी वेंडर की पूरी जानकारी निकालें।",
      widget: {
        companyName: "कंपनी",
        orderCount: "परचेज़ ऑर्डर",
        receivingCount: "माल की प्राप्ति बाक़ी",
        details: "वेंडर की जानकारी",
        related: "वेंडर एक्शन",
        backToList: "वेंडर",
        back: "वापस",
        edit: "वेंडर एडिट करें",
        createOrder: "नया परचेज़ ऑर्डर",
        viewOrders: "ऑर्डर देखें",
        deactivate: "निष्क्रिय करें",
        select: "वेंडर चुनें",
        paymentTerms: "पेमेंट शर्तें",
        dueOnReceipt: "प्राप्ति पर देय",
        netDays: "नेट {{days}} दिन",
        address: "पता",
        deactivateTitle: "{{name}} को निष्क्रिय करें?",
        deactivateMessage:
          "आप इस वेंडर से आगे ऑर्डर नहीं कर पाएँगे। मौजूदा परचेज़ ऑर्डर और बिल जैसे हैं वैसे रहेंगे।",
        deactivateFailed: "वेंडर निष्क्रिय नहीं हुआ",
        loadFailed: "यह वेंडर लोड नहीं हो सका",
        retry: "दोबारा कोशिश करें",
        loading: "वेंडर लोड हो रहा है",
      },
      vendorId: { label: "वेंडर ID", description: "जिस वेंडर को निकालना है" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "वेंडर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "वेंडर देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेंडर तक पहुँच नहीं है",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: { title: "सर्वर एरर", description: "वेंडर लोड नहीं हो सका" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "वेंडर नहीं मिला",
          description: "वेंडर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेंडर लोड हो गया",
        description: "वेंडर की जानकारी मिल गई",
      },
      response: {
        id: "वेंडर ID",
        companyId: "कंपनी ID",
        name: "नाम",
        code: "कोड",
        email: "ईमेल",
        phone: "फ़ोन",
        website: "वेबसाइट",
        vatNumber: "VAT नंबर",
        taxId: "टैक्स ID",
        addressLine1: "पता",
        addressLine2: "पता लाइन 2",
        city: "शहर",
        region: "क्षेत्र",
        postalCode: "पिन कोड",
        country: "देश",
        defaultCurrency: "करेंसी",
        defaultPaymentTermsDays: "भुगतान की शर्तें (दिन)",
        isActive: "सक्रिय",
        notes: "नोट्स",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
      },
    },
  },

  // Vendor update
  vendorUpdate: {
    patch: {
      title: "वेंडर अपडेट करें",
      titleShort: "वेंडर अपडेट करें",
      description: "वेंडर की जानकारी अपडेट करें।",
      isActive: {
        label: "सक्रिय",
        description: "सक्रिय वेंडर नए परचेज़ ऑर्डर में चुने जा सकते हैं।",
      },
      widget: {
        backToVendor: "वेंडर पर वापस",
        viewVendor: "वेंडर देखें",
        sectionStatus: "स्टेटस",
        title: "वेंडर एडिट करें",
        cancel: "रद्द करें",
        save: "बदलाव सेव करें",
        sectionCompany: "कंपनी और टैक्स",
        sectionContact: "संपर्क",
        sectionAddress: "पता",
        sectionTerms: "ख़रीद की शर्तें",
      },
      vendorId: { label: "वेंडर ID", description: "जिस वेंडर को अपडेट करना है" },
      name: {
        label: "वेंडर का नाम",
        description: "सप्लायर का क़ानूनी नाम",
        placeholder: "Acme GmbH",
      },
      code: {
        label: "कोड",
        description: "छोटा आंतरिक आइडेंटिफ़ायर",
        placeholder: "ACM-001",
      },
      email: {
        label: "ईमेल",
        description: "वेंडर का संपर्क ईमेल",
        placeholder: "orders@acme.com",
      },
      phone: {
        label: "फ़ोन",
        description: "वेंडर का संपर्क फ़ोन",
        placeholder: "+49 30 12345678",
      },
      website: {
        label: "वेबसाइट",
        description: "वेंडर की वेबसाइट",
        placeholder: "https://acme.com",
      },
      vatNumber: {
        label: "VAT नंबर",
        description: "वेंडर का VAT रजिस्ट्रेशन नंबर",
        placeholder: "DE123456789",
      },
      taxId: {
        label: "टैक्स ID",
        description: "टैक्स आइडेंटिफ़िकेशन नंबर",
        placeholder: "12345678",
      },
      addressLine1: {
        label: "पता लाइन 1",
        description: "सड़क और नंबर",
        placeholder: "123 Main Street",
      },
      addressLine2: {
        label: "पता लाइन 2",
        description: "सुइट, फ़्लोर आदि",
        placeholder: "Floor 2",
      },
      city: { label: "शहर", description: "शहर", placeholder: "Berlin" },
      region: {
        label: "क्षेत्र / राज्य",
        description: "क्षेत्र या राज्य",
        placeholder: "Berlin",
      },
      postalCode: {
        label: "पिन कोड",
        description: "पोस्टल या ZIP कोड",
        placeholder: "10115",
      },
      country: {
        label: "देश",
        description: "देश का कोड (ISO 3166-1 alpha-2)",
        placeholder: "DE",
      },
      defaultCurrency: {
        label: "डिफ़ॉल्ट करेंसी",
        description: "इस वेंडर के परचेज़ ऑर्डर की करेंसी",
        placeholder: "EUR",
      },
      defaultPaymentTermsDays: {
        label: "भुगतान की शर्तें (दिन)",
        description: "दिनों में डिफ़ॉल्ट पेमेंट शर्तें",
        placeholder: "30",
      },
      notes: {
        label: "नोट्स",
        description: "इस वेंडर के बारे में आंतरिक नोट",
        placeholder: "पसंदीदा सप्लायर",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "वेंडर अपडेट करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेंडर तक पहुँच नहीं है",
        },
        conflict: {
          title: "कोड में टकराव",
          description: "वह वेंडर कोड पहले से इस्तेमाल में है",
        },
        server: {
          title: "सर्वर एरर",
          description: "वेंडर अपडेट नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "वेंडर नहीं मिला",
          description: "वेंडर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेंडर अपडेट हो गया",
        description: "वेंडर सफलतापूर्वक अपडेट हो गया",
      },
      response: {
        id: "वेंडर ID",
        name: "नाम",
        isActive: "सक्रिय",
        updatedAt: "अपडेट किया गया",
      },
    },
  },

  // Vendor deactivate
  vendorDeactivate: {
    post: {
      title: "वेंडर निष्क्रिय करें",
      titleShort: "निष्क्रिय करें",
      description: "वेंडर को निष्क्रिय मार्क करें। मौजूदा परचेज़ ऑर्डर पर असर नहीं पड़ता।",
      vendorId: { label: "वेंडर ID", description: "जिस वेंडर को निष्क्रिय करना है" },
      widget: {
        warning:
          "नए परचेज़ ऑर्डर अब यह वेंडर नहीं चुन सकेंगे। मौजूदा ऑर्डर, रसीदें और बिल जैसे हैं वैसे रहेंगे। बाद में 'वेंडर एडिट करें' से इसे दोबारा सक्रिय कर सकते हैं।",
        backToList: "वेंडर सूची पर वापस",
        backToVendor: "वेंडर पर वापस",
        subtitle: "इस सप्लायर से ऑर्डर करना बंद करें।",
        cancel: "रद्द करें",
        openVendor: "वेंडर खोलें",
        alreadyInactive: "यह वेंडर पहले से निष्क्रिय है",
        reactivateHint:
          "दोबारा ऑर्डर करने के लिए वेंडर खोलें, 'वेंडर एडिट करें' चुनें और उसे फिर सक्रिय करें।",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "वेंडर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "वेंडर निष्क्रिय करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस वेंडर तक पहुँच नहीं है",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "वेंडर निष्क्रिय नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "वेंडर नहीं मिला",
          description: "वेंडर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "वेंडर निष्क्रिय हो गया",
        description: "वेंडर अब निष्क्रिय है",
      },
      response: {
        id: "वेंडर ID",
        isActive: "सक्रिय",
      },
    },
  },

  // PO create
  orderCreate: {
    post: {
      title: "परचेज़ ऑर्डर बनाएँ",
      titleShort: "ऑर्डर बनाएँ",
      description: "ड्राफ़्ट स्टेटस में नया परचेज़ ऑर्डर बनाएँ।",
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "सभी फ़ील्ड जाँचें और दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़ ऑर्डर बनाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "आपके पास मेंबर या उससे ऊपर की भूमिका होनी चाहिए",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़ ऑर्डर नहीं बन सका। फिर कोशिश करें।",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "नहीं मिला",
          description: "वेंडर या कंपनी नहीं मिली",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "परचेज़ ऑर्डर बन गया",
        description: "परचेज़ ऑर्डर ड्राफ़्ट स्टेटस में बन गया",
      },
      widget: {
        browseVendors: "वेंडर ब्राउज़ करें",
        browseWarehouses: "वेयरहाउस देखें",
        viewOrder: "परचेज़ ऑर्डर खोलें",
        backToList: "सूची पर वापस",
        subtitle: "सप्लायर चुनें और माल कहाँ जाएगा। लाइनें अगली स्क्रीन पर जोड़ें।",
        cancel: "रद्द करें",
        nextStep: "ड्राफ़्ट तैयार है। इसकी लाइनें जोड़ें, फिर इसे भेजा हुआ मार्क करें।",
        sectionSupplier: "सप्लायर",
        sectionDelivery: "डिलीवरी",
      },
      response: {
        id: "परचेज़ ऑर्डर ID",
        poNumber: "परचेज़ ऑर्डर नंबर",
        status: "स्टेटस",
        subtotal: "उप-योग",
        taxAmount: "टैक्स",
        total: "कुल",
        createdAt: "बनाया गया",
      },
    },
    companyId: {
      label: "कंपनी",
      description: "इस परचेज़ ऑर्डर को जारी करने वाली कंपनी",
      placeholder: "कंपनी UUID",
    },
    vendorId: {
      label: "वेंडर",
      description: "इस परचेज़ ऑर्डर को पाने वाला सप्लायर",
      placeholder: "वेंडर UUID",
    },
    currency: {
      label: "करेंसी",
      description: "परचेज़ ऑर्डर की करेंसी",
      placeholder: "EUR",
    },
    expectedDeliveryDate: {
      label: "अपेक्षित डिलीवरी",
      description: "अपेक्षित डिलीवरी तारीख़ (वैकल्पिक)",
      placeholder: "2024-03-01",
    },
    deliveryWarehouseId: {
      label: "डिलीवरी वेयरहाउस",
      description: "माल प्राप्त करने वाला वेयरहाउस (वैकल्पिक)",
      placeholder: "वेयरहाउस UUID",
    },
    notes: {
      label: "नोट्स",
      description: "इस परचेज़ ऑर्डर के आंतरिक नोट",
      placeholder: "रश ऑर्डर",
    },
    lines: {
      label: "लाइन आइटम",
      description: "ऑर्डर करने वाले प्रोडक्ट और मात्रा",
    },
    lineDescription: {
      label: "विवरण",
      description: "आइटम का विवरण",
      placeholder: "ऑफ़िस चेयर",
    },
    lineProductId: {
      label: "प्रोडक्ट ID",
      description: "कैटलॉग प्रोडक्ट (वैकल्पिक)",
      placeholder: "प्रोडक्ट UUID",
    },
    lineQuantity: {
      label: "मात्रा",
      description: "यूनिट की संख्या",
      placeholder: "10",
    },
    lineUnitPrice: {
      label: "यूनिट कीमत",
      description: "प्रति यूनिट कीमत",
      placeholder: "99.00",
    },
    lineTaxRate: {
      label: "टैक्स दर",
      description: "टैक्स दर दशमलव में (जैसे 0.19 = 19%)",
      placeholder: "0.19",
    },
    lineSortOrder: {
      label: "सॉर्ट क्रम",
      description: "इस लाइन का डिस्प्ले क्रम",
      placeholder: "0",
    },
  },

  // PO list
  orderList: {
    get: {
      title: "परचेज़ ऑर्डर",
      titleShort: "ऑर्डर",
      description: "किसी कंपनी के परचेज़ ऑर्डर देखें, चाहें तो स्टेटस फ़िल्टर के साथ।",
      widget: {
        newOrder: "नया परचेज़ ऑर्डर",
        empty: "कोई परचेज़ ऑर्डर नहीं मिला।",
        statusAll: "सभी",
        orders: "परचेज़ ऑर्डर",
        order: "परचेज़ ऑर्डर",
        colPoVendor: "परचेज़ ऑर्डर / वेंडर",
        colDate: "तारीख",
        colAmount: "रकम",
        colStatus: "स्टेटस",
        deliveryArrow: "→",
        overdue: "देर हो चुकी",
        readyToBill: "प्राप्त, बिलिंग के लिए तैयार",
        openAttentionOrder: "ऑर्डर {{reference}} खोलें",
        attentionCount: "ध्यान चाहने वाले ऑर्डर: {{count}}",
        actionNeeded: "परचेज़ ऑर्डर पर ध्यान चाहिए",
        back: "वापस",
        loading: "लोड हो रहा है…",
      },
      companyId: {
        label: "कंपनी",
        description: "जिस कंपनी के परचेज़ ऑर्डर देखने हैं",
      },
      status: {
        label: "स्थिति फ़िल्टर",
        description: "परचेज़ ऑर्डर स्टेटस से फ़िल्टर करें (वैकल्पिक)",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़ ऑर्डर देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस कंपनी का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़ ऑर्डर की सूची नहीं मिल सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "परचेज़ ऑर्डर लोड हो गए",
        description: "परचेज़ ऑर्डर सूची मिल गई",
      },
      response: {
        id: "परचेज़ ऑर्डर ID",
        poNumber: "परचेज़ ऑर्डर नंबर",
        vendorId: "वेंडर",
        vendorName: "वेंडर",
        status: "स्टेटस",
        currency: "करेंसी",
        total: "कुल",
        expectedDeliveryDate: "अपेक्षित डिलीवरी",
        createdAt: "बनाया गया",
      },
    },
  },

  // PO get
  orderGet: {
    get: {
      title: "परचेज़ ऑर्डर पाएँ",
      titleShort: "ऑर्डर का ब्योरा",
      description: "सभी लाइन और रसीद हिस्ट्री के साथ परचेज़ ऑर्डर निकालें।",
      widget: {
        precision: "लाइन टोटल डिस्प्ले राउंडिंग से पहले की सप्लायर यूनिट कीमत पर बनते हैं।",
        back: "वापस",
        send: "भेजा हुआ चिह्नित करें",
        confirm: "कन्फ़र्म मार्क करें",
        receive: "माल प्राप्त करें",
        convertToBill: "बिल में बदलें",
        viewBill: "बिल देखें",
        addLine: "+ लाइन जोड़ें",
        cancel: "ऑर्डर रद्द करें",
        edit: "एडिट करें",
        select: "परचेज़ ऑर्डर चुनें",
        linesHeader: "लाइन आइटम",
        receiptsHeader: "रसीद हिस्ट्री",
        noLines: "कोई लाइन आइटम नहीं।",
        noReceipts: "अभी कोई रसीद नहीं।",
        colDescription: "विवरण",
        colQtyPrice: "मात्रा × कीमत",
        colLineTotal: "कुल",
        delivery: "अपेक्षित डिलीवरी:",
        overdue: "(देर हो चुकी)",
        received: "प्राप्त",
        billCreated: "इस परचेज़ ऑर्डर से AP बिल बना।",
        vendorLabel: "वेंडर:",
      },
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर को निकालना है",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "परचेज़ ऑर्डर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़ ऑर्डर देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़ ऑर्डर लोड नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "परचेज़ ऑर्डर लोड हो गया",
        description: "परचेज़ ऑर्डर की जानकारी मिल गई",
      },
      response: {
        id: "परचेज़ ऑर्डर ID",
        companyId: "कंपनी ID",
        vendorId: "वेंडर ID",
        poNumber: "परचेज़ ऑर्डर नंबर",
        status: "स्टेटस",
        currency: "करेंसी",
        expectedDeliveryDate: "अपेक्षित डिलीवरी",
        deliveryWarehouseId: "डिलीवरी वेयरहाउस",
        notes: "नोट्स",
        subtotal: "उप-योग",
        taxAmount: "टैक्स",
        total: "कुल",
        billId: "बिल ID",
        confirmedAt: "कन्फ़र्म",
        receivedAt: "प्राप्त",
        createdAt: "बनाया गया",
        updatedAt: "अपडेट किया गया",
        lines: "लाइनें",
        lineId: "लाइन ID",
        lineProductId: "प्रोडक्ट ID",
        lineDescription: "विवरण",
        lineQuantity: "मात्रा",
        lineUnitPrice: "यूनिट कीमत",
        lineTaxRate: "टैक्स दर",
        lineTaxAmount: "टैक्स",
        lineTotal: "कुल",
        lineQuantityReceived: "प्राप्त",
        receipts: "रसीदें",
        receiptId: "रसीद ID",
        receiptReceivedAt: "प्राप्त हुआ",
        receiptNotes: "नोट्स",
      },
    },
  },

  // PO update
  orderUpdate: {
    patch: {
      title: "परचेज़ ऑर्डर अपडेट करें",
      titleShort: "ऑर्डर अपडेट करें",
      description: "ड्राफ़्ट परचेज़ ऑर्डर की जानकारी और लाइन आइटम एडिट करें।",
      widget: {
        backToPO: "परचेज़ ऑर्डर पर वापस",
        title: "परचेज़ ऑर्डर एडिट करें",
        cancel: "रद्द करें",
        save: "बदलाव सेव करें",
        lockedTitle: "सिर्फ़ ड्राफ़्ट एडिट हो सकते हैं",
        lockedMessage:
          "यह ऑर्डर पहले भेजा जा चुका है। सप्लायर, करेंसी या डिलीवरी बदलने के लिए इसे रद्द करके नया ऑर्डर बनाएँ।",
      },
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर को अपडेट करना है",
      },
      vendorId: {
        label: "वेंडर",
        description: "वेंडर बदलें (वैकल्पिक)",
        placeholder: "वेंडर UUID",
      },
      currency: {
        label: "करेंसी",
        description: "परचेज़ ऑर्डर की करेंसी",
        placeholder: "EUR",
      },
      expectedDeliveryDate: {
        label: "अपेक्षित डिलीवरी",
        description: "अपेक्षित डिलीवरी तारीख़",
        placeholder: "2024-03-01",
      },
      deliveryWarehouseId: {
        label: "डिलीवरी वेयरहाउस",
        description: "माल प्राप्त करने वाला वेयरहाउस",
        placeholder: "वेयरहाउस UUID",
      },
      notes: {
        label: "नोट्स",
        description: "इस परचेज़ ऑर्डर के आंतरिक नोट",
        placeholder: "रश ऑर्डर",
      },
      lines: {
        label: "लाइन आइटम",
        description: "सभी लाइन आइटम बदलें (वैकल्पिक)",
      },
      lineDescription: {
        label: "विवरण",
        description: "आइटम का विवरण",
        placeholder: "ऑफ़िस चेयर",
      },
      lineProductId: {
        label: "प्रोडक्ट ID",
        description: "कैटलॉग प्रोडक्ट (वैकल्पिक)",
        placeholder: "प्रोडक्ट UUID",
      },
      lineQuantity: {
        label: "मात्रा",
        description: "यूनिट की संख्या",
        placeholder: "10",
      },
      lineUnitPrice: {
        label: "यूनिट कीमत",
        description: "प्रति यूनिट कीमत",
        placeholder: "99.00",
      },
      lineTaxRate: {
        label: "टैक्स दर",
        description: "टैक्स दर दशमलव में",
        placeholder: "0.19",
      },
      lineSortOrder: {
        label: "सॉर्ट क्रम",
        description: "इस लाइन का डिस्प्ले क्रम",
        placeholder: "0",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़ ऑर्डर अपडेट करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "ड्राफ़्ट नहीं है",
          description: "सिर्फ़ ड्राफ़्ट परचेज़ ऑर्डर एडिट हो सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़ ऑर्डर अपडेट नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "परचेज़ ऑर्डर अपडेट हो गया",
        description: "परचेज़ ऑर्डर अपडेट हो गया",
      },
      response: {
        id: "परचेज़ ऑर्डर ID",
        status: "स्टेटस",
        subtotal: "उप-योग",
        taxAmount: "टैक्स",
        total: "कुल",
        updatedAt: "अपडेट किया गया",
      },
    },
  },

  // PO send
  orderSend: {
    post: {
      title: "परचेज़ ऑर्डर को भेजा हुआ मार्क करें",
      titleShort: "भेजा हुआ चिह्नित करें",
      description: "दर्ज करें कि परचेज़ ऑर्डर भेज दिया गया।",
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर को भेजना है",
      },
      widget: {
        back: "वापस",
        consequence:
          "ऑर्डर 'भेजा गया' हो जाएगा। सप्लायर का जवाब आने पर इसे कन्फ़र्म करें, फिर माल प्राप्त करें।",
        blocked: "सिर्फ़ ड्राफ़्ट ऑर्डर को भेजा हुआ मार्क किया जा सकता है।",
        noLines: "ऑर्डर भेजने से पहले कम से कम एक लाइन जोड़ें।",
        backToPO: "परचेज़ ऑर्डर पर वापस",
        warning: "इससे इस वर्कस्पेस में ऑर्डर का स्टेटस 'भेजा गया' हो जाएगा।",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "परचेज़ ऑर्डर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़ ऑर्डर भेजने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "ड्राफ़्ट नहीं है",
          description: "सिर्फ़ ड्राफ़्ट परचेज़ ऑर्डर भेजे जा सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़ ऑर्डर नहीं भेजा जा सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "परचेज़ ऑर्डर भेजा हुआ मार्क हुआ",
        description: "परचेज़ ऑर्डर का स्टेटस अब 'भेजा गया' है।",
      },
      response: {
        id: "परचेज़ ऑर्डर ID",
        status: "स्टेटस",
      },
    },
  },

  // PO confirm
  orderConfirm: {
    post: {
      title: "परचेज़ ऑर्डर कन्फ़र्म करें",
      titleShort: "ऑर्डर कन्फ़र्म करें",
      description: "इस परचेज़ ऑर्डर की सप्लायर से मिली पुष्टि दर्ज करें।",
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर को कन्फ़र्म करना है",
      },
      widget: {
        back: "वापस",
        consequence:
          "सप्लायर ने ऑर्डर स्वीकार कर लिया। पूरा माल आने तक यह प्राप्ति के लिए खुला रहता है।",
        blocked: "सिर्फ़ भेजे गए ऑर्डर कन्फ़र्म हो सकते हैं।",
        backToPO: "परचेज़ ऑर्डर पर वापस",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "परचेज़ ऑर्डर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़ ऑर्डर कन्फ़र्म करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "ग़लत स्टेटस",
          description: "सिर्फ़ भेजे गए परचेज़ ऑर्डर कन्फ़र्म हो सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़ ऑर्डर कन्फ़र्म नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "परचेज़ ऑर्डर कन्फ़र्म हो गया",
        description: "परचेज़ ऑर्डर कन्फ़र्म मार्क हो गया",
      },
      response: {
        id: "परचेज़ ऑर्डर ID",
        status: "स्टेटस",
        confirmedAt: "पुष्टि का समय",
      },
    },
  },

  // PO receive
  orderReceive: {
    post: {
      title: "माल प्राप्त करें",
      titleShort: "माल प्राप्त करें",
      description: "परचेज़ ऑर्डर के मुक़ाबले माल की प्राप्ति दर्ज करें। स्टॉक मूवमेंट बनते हैं।",
      widget: {
        retry: "दोबारा कोशिश करें",
        loading: "ऑर्डर लोड हो रहा है…",
        remaining: "{{quantity}} बाक़ी",
        noOpenLines: "ऑर्डर की गई सारी मात्रा प्राप्त हो चुकी है।",
        backToPO: "परचेज़ ऑर्डर पर वापस",
      },
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर के मुक़ाबले माल प्राप्त करना है",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "माल प्राप्त करने वाला वेयरहाउस (वैकल्पिक)",
        placeholder: "वेयरहाउस UUID",
      },
      notes: {
        label: "नोट्स",
        description: "इस डिलीवरी के बारे में नोट",
        placeholder: "Delivery note #12345",
      },
      lines: {
        label: "प्राप्त आइटम",
        description: "हर लाइन के लिए प्राप्त मात्रा",
      },
      linePoLineId: { label: "लाइन ID", description: "परचेज़ ऑर्डर लाइन" },
      lineQuantityReceived: {
        label: "प्राप्त मात्रा",
        description: "इस लाइन के लिए प्राप्त मात्रा",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "सभी फ़ील्ड और मात्राएँ जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "माल प्राप्त करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "ग़लत स्टेटस",
          description:
            "माल प्राप्त करने के लिए परचेज़ ऑर्डर कन्फ़र्म या भेजा हुआ होना चाहिए",
        },
        server: {
          title: "सर्वर एरर",
          description: "रसीद दर्ज नहीं हो सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर या लाइन नहीं मिली",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "माल मिला",
        description: "रसीद दर्ज हो गई और स्टॉक अपडेट हुआ",
      },
      response: {
        receiptId: "रसीद ID",
        status: "परचेज़ ऑर्डर स्टेटस",
        receivedAt: "प्राप्त हुआ",
      },
    },
  },

  // PO convert to bill
  orderConvertToBill: {
    post: {
      title: "बिल में बदलें",
      titleShort: "बिल में बदलें",
      description:
        "पूरी तरह प्राप्त परचेज़ ऑर्डर से सप्लायर बिल बनाएँ। देनदारी पोस्ट करने के लिए बिल अप्रूव करें।",
      widget: {
        back: "वापस",
        consequence:
          "प्राप्त मात्रा के साथ बिना पोस्ट किया सप्लायर बिल बनता है। उसे बिल सेक्शन में रिव्यू करके अप्रूव करें।",
        blocked: "सिर्फ़ पूरी तरह प्राप्त और बिना बिल वाले ऑर्डर बदले जा सकते हैं।",
        viewBill: "बिल देखें",
      },
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर को बदलना है",
      },
      errors: {
        validation: {
          title: "करेंसी और ऑर्डर टोटल जाँचें",
          description:
            "बिल की करेंसी सपोर्टेड होनी चाहिए और हर टोटल ऑर्डर लाइन से मेल खाना चाहिए।",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "बिल बनाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "ऑर्डर बिलिंग के लिए उपलब्ध नहीं",
          description:
            "सिर्फ़ पूरी तरह प्राप्त और बिना मौजूदा बिल वाला ऑर्डर बदला जा सकता है।",
        },
        server: { title: "सर्वर एरर", description: "बिल नहीं बन सका" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "बिल बन गया",
        description: "परचेज़ ऑर्डर से AP बिल बन गया",
      },
      response: {
        billId: "बिल ID",
        billNumber: "बिल नंबर",
        poId: "परचेज़ ऑर्डर ID",
      },
    },
  },

  // PO line add
  orderLineAdd: {
    post: {
      widget: {
        productSearch: "नाम या SKU से प्रोडक्ट खोजें",
        search: "खोजें",
        noProducts: "कोई प्रोडक्ट मैच नहीं हुआ।",
        clearProduct: "प्रोडक्ट हटाएँ",
        backToOrder: "ऑर्डर पर वापस",
        lineAdded: "लाइन आइटम जुड़ गया",
      },
      title: "लाइन आइटम जोड़ें",
      titleShort: "लाइन जोड़ें",
      description: "परचेज़ ऑर्डर में लाइन आइटम जोड़ें।",
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर में लाइन जोड़नी है",
      },
      productId: {
        label: "प्रोडक्ट",
        description: "कैटलॉग प्रोडक्ट (वैकल्पिक)",
        placeholder: "प्रोडक्ट UUID",
      },
      itemDescription: {
        label: "विवरण",
        description: "आइटम का विवरण",
        placeholder: "ऑफ़िस चेयर",
      },
      quantity: {
        label: "मात्रा",
        description: "यूनिट की संख्या",
        placeholder: "10",
      },
      unitPrice: {
        label: "यूनिट कीमत",
        description: "प्रति यूनिट कीमत",
        placeholder: "99.00",
      },
      taxRate: {
        label: "टैक्स दर",
        description: "टैक्स दर दशमलव में (जैसे 0.19 = 19%)",
        placeholder: "0.19",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "सभी फ़ील्ड जाँचें और दोबारा कोशिश करें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "लाइन आइटम जोड़ने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "ड्राफ़्ट नहीं है",
          description: "सिर्फ़ ड्राफ़्ट परचेज़ ऑर्डर बदले जा सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "लाइन आइटम नहीं जुड़ सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "लाइन जुड़ी",
        description: "परचेज़ ऑर्डर में लाइन आइटम जुड़ गया",
      },
      response: {
        lineId: "लाइन ID",
        subtotal: "उप-योग",
        taxAmount: "टैक्स",
        total: "कुल",
      },
    },
  },

  // PO line remove
  orderLineRemove: {
    post: {
      title: "लाइन आइटम हटाएँ",
      titleShort: "लाइन हटाएँ",
      description: "परचेज़ ऑर्डर से लाइन आइटम हटाएँ।",
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर से लाइन हटानी है",
      },
      lineId: { label: "लाइन ID", description: "हटाने वाला लाइन आइटम" },
      widget: {
        updatedOrderTotals: "अपडेटेड ऑर्डर टोटल",
        cancel: "रद्द करें",
        verifying: "चुना हुआ आइटम जाँचा जा रहा है…",
        unavailable: "ड्राफ़्ट ऑर्डर फिर खोलें और हटाने के लिए लाइन चुनें।",
        backToOrder: "परचेज़ ऑर्डर पर वापस",
        warning: "इससे लाइन आइटम परचेज़ ऑर्डर से हमेशा के लिए हट जाएगा।",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ID गलत हैं",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "लाइन आइटम हटाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "ड्राफ़्ट नहीं है",
          description: "सिर्फ़ ड्राफ़्ट परचेज़ ऑर्डर बदले जा सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "लाइन आइटम नहीं हट सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "नहीं मिला",
          description: "परचेज़ ऑर्डर या लाइन आइटम नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "लाइन हटाई गई",
        description: "परचेज़ ऑर्डर से लाइन आइटम हट गया",
      },
      response: {
        subtotal: "उप-योग",
        taxAmount: "टैक्स",
        total: "कुल",
      },
    },
  },

  // Purchasing Dashboard
  dashboard: {
    get: {
      title: "परचेज़िंग ओवरव्यू",
      titleShort: "ओवरव्यू",
      description: "आपकी कंपनी के परचेज़ ऑर्डर और सप्लायर गतिविधि का लाइव स्नैपशॉट।",
      widget: {
        openValue: "खुले ऑर्डर की वैल्यू",
        settledBills: "इस महीने चुकाए बिल",
        deliveries: "आने वाली डिलीवरी",
        order: "ऑर्डर",
        supplier: "सप्लायर",
        expected: "अपेक्षित",
        orderTotal: "ऑर्डर कुल",
        noDeliveries:
          "कोई डिलीवरी बाक़ी नहीं। भेजे और कन्फ़र्म ऑर्डर माल मिलने तक यहाँ दिखते हैं।",
        overdue: "देर से आने वाली डिलीवरी",
        dueSeven: "अगले 7 दिनों में देय",
        kpiDraft: "ड्राफ़्ट",
        kpiConfirmed: "कन्फ़र्म",
        kpiAwaitingReceipt: "प्राप्ति बाक़ी",
        kpiActiveVendors: "सक्रिय वेंडर",
        warningDueThisWeek:
          "एक परचेज़ ऑर्डर इसी हफ़्ते देय है। उसकी डिलीवरी तारीख़ जाँचें।",
        warningDueThisWeekPlural:
          "{{count}} परचेज़ ऑर्डर इसी हफ़्ते देय हैं। उनकी डिलीवरी तारीख़ें जाँचें।",
        navNewPo: "नया परचेज़ ऑर्डर",
        navAllPos: "सभी परचेज़ ऑर्डर",
        navVendors: "वेंडर",
        navNewVendor: "नया वेंडर",
        loading: "लोड हो रहा है…",
      },
      companyId: {
        label: "कंपनी",
        description: "जिस कंपनी के परचेज़िंग आँकड़े दिखाने हैं (वैकल्पिक)",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़िंग ओवरव्यू देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस कंपनी का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़िंग ओवरव्यू लोड नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कंपनी नहीं मिली" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "डैशबोर्ड लोड हुआ",
        description: "परचेज़िंग ओवरव्यू मिल गया",
      },
      response: {
        draftCount: "ड्राफ़्ट परचेज़ ऑर्डर",
        confirmedCount: "कन्फ़र्म परचेज़ ऑर्डर",
        awaitingReceiptCount: "प्राप्ति बाक़ी",
        activeVendorCount: "सक्रिय वेंडर",
        dueThisWeekCount: "इसी हफ़्ते देय",
      },
    },
  },

  // PO cancel
  orderCancel: {
    post: {
      title: "परचेज़ ऑर्डर रद्द करें",
      titleShort: "ऑर्डर रद्द करें",
      description: "ड्राफ़्ट या भेजा गया परचेज़ ऑर्डर रद्द करें।",
      poId: {
        label: "परचेज़ ऑर्डर ID",
        description: "जिस परचेज़ ऑर्डर को रद्द करना है",
      },
      widget: {
        back: "वापस",
        blocked: "सिर्फ़ ड्राफ़्ट या भेजे गए ऑर्डर रद्द हो सकते हैं।",
        warning:
          "ऑर्डर हमेशा के लिए बंद हो जाता है। इसके बाद इस पर न माल प्राप्त होगा, न बिल बनेगा।",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "परचेज़ ऑर्डर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "परचेज़ ऑर्डर रद्द करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस परचेज़ ऑर्डर तक पहुँच नहीं है",
        },
        conflict: {
          title: "रद्द नहीं हो सकता",
          description: "सिर्फ़ ड्राफ़्ट या भेजे गए परचेज़ ऑर्डर रद्द हो सकते हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "परचेज़ ऑर्डर रद्द नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें",
        },
        notFound: {
          title: "परचेज़ ऑर्डर नहीं मिला",
          description: "परचेज़ ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "परचेज़ ऑर्डर रद्द हो गया",
        description: "परचेज़ ऑर्डर रद्द हो गया",
      },
      response: {
        id: "परचेज़ ऑर्डर ID",
        status: "स्टेटस",
      },
    },
  },
};
