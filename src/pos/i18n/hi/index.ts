import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "पॉइंट ऑफ़ सेल",
  tags: {
    pos: "POS",
    terminal: "टर्मिनल",
    session: "सेशन",
    order: "ऑर्डर",
    payment: "पेमेंट",
    create: "बनाएँ",
    list: "सूची",
    get: "लाएँ",
    open: "खुला",
    close: "बंद करें",
    complete: "पूरा करें",
    void: "रद्द",
    addItem: "आइटम जोड़ें",
    removeItem: "आइटम हटाएँ",
    addPayment: "पेमेंट जोड़ें",
  },
  endpointCategories: {
    pos: "पॉइंट ऑफ़ सेल",
    terminals: "टर्मिनल",
    sessions: "सेशन",
    orders: "ऑर्डर",
  },
  enums: {
    sessionStatus: {
      open: "खुला",
      closed: "बंद",
    },
    orderStatus: {
      open: "खुला",
      completed: "पूरा हुआ",
      voided: "रद्द",
    },
    paymentMethod: {
      cash: "नकद",
      card: "कार्ड",
      transfer: "ट्रांसफ़र",
      other: "अन्य",
    },
  },

  // POS Dashboard
  workflow: {
    backToSessionOrders: "सेशन ऑर्डर पर वापस",
    receiptTitle: "रसीद",
    amountDue: "बकाया रकम",
    ledgerCurrencyMismatch:
      "यह ऑर्डर कंपनी के लेजर से अलग करेंसी में है। पेमेंट लेने से पहले लेजर की करेंसी वाला टर्मिनल या ऑर्डर इस्तेमाल करें।",
    postingUnavailable:
      "यह बिक्री पोस्ट नहीं हो सकी। कंपनी की करेंसी, खुली अकाउंटिंग अवधि और पोस्टिंग अकाउंट जाँचें।",
    cashCurrencyMismatch:
      "नकद ड्रॉअर की करेंसी में होना चाहिए। इस ऑर्डर के लिए कोई और पेमेंट तरीक़ा चुनें।",
    tenderMinorUnits: "नकद और पेमेंट के लिए पूरे सेंट इस्तेमाल करें।",
    legacyTenderReview:
      "इस ऑर्डर पर पहले का आंशिक-सेंट पेमेंट है। और पैसे लेने से पहले दर्ज टेंडर की समीक्षा करें।",
    legacyTenderRecorded: "यह ऑर्डर अपनी मूल चार-दशमलव रकम बनाए रखता है।",
    legacyPostingReview:
      "दर्ज आंशिक-सेंट रकम लेजर में पोस्ट नहीं हो सकती। बिक्री बंद करने से पहले मूल टेंडर की समीक्षा करें।",
    viewReceipt: "रसीद देखें",
    openDrawer: "ड्रॉअर खोलें",
    warehouse: "बिक्री का वेयरहाउस",
    noWarehouse: "कोई वेयरहाउस असाइन नहीं",
    chooseCompanyFirst: "पहले कंपनी चुनें।",
    warehouseInstruction: "चुनी हुई कंपनी का सक्रिय वेयरहाउस इस्तेमाल करें।",
    stockUnavailable:
      "इस टर्मिनल के वेयरहाउस में स्टॉक उपलब्ध नहीं है। बिक्री पूरी करने से पहले उपलब्ध मात्रा जाँचें।",
  },
  dashboard: {
    get: {
      title: "POS डैशबोर्ड",
      titleShort: "POS डैशबोर्ड",
      description: "टर्मिनल, सक्रिय सेशन और आज की बिक्री का ओवरव्यू।",
      widget: {
        title: "पॉइंट ऑफ़ सेल",
        subtitle: "टिल खोलें, बिक्री दर्ज करें, कैश गिनती के साथ शिफ़्ट बंद करें।",
        salesHistory: "बिक्री हिस्ट्री",
        newTill: "नया टिल",
        kpiSalesToday: "आज की बिक्री",
        kpiSalesCount: "बिक्री: {{count}}",
        kpiOpenTills: "खुले टिल",
        kpiTillsTotal: "{{total}} में से {{active}} सक्रिय",
        kpiAverage: "औसत बिक्री",
        kpiRefunds: "आज के रिफ़ंड",
        kpiRefundsCount: "रिफ़ंड: {{count}}",
        tillsTitle: "टिल",
        manageTills: "टिल मैनेज करें",
        emptyTitle: "अभी कोई टिल नहीं",
        emptyMessage: "काउंटर पर बेचना शुरू करने के लिए टिल जोड़ें।",
        createTill: "टिल जोड़ें",
        tillSelling: "बिक्री हो रही है",
        tillReady: "तैयार",
        tillInactive: "निष्क्रिय",
        openRegister: "रजिस्टर खोलें",
        openTill: "टिल खोलें",
        closeTill: "टिल बंद करें",
        loading: "डैशबोर्ड लोड हो रहा है...",
        loadingHint: "आपका POS डेटा लाया जा रहा है।",
        kpiTerminals: "टर्मिनल (सक्रिय / कुल)",
        kpiOpenSessions: "खुले सेशन",
        kpiTodayOrders: "आज के ऑर्डर",
        kpiTodaySales: "आज की आय",
        terminalsHeading: "टर्मिनल",
        refresh: "रिफ़्रेश",
        openSession: "सेशन खोलें",
        viewOrders: "ऑर्डर देखें",
        viewSession: "सेशन देखें",
        allTerminals: "सभी टर्मिनल",
        statusActive: "सक्रिय",
        statusInactive: "निष्क्रिय",
        statusSessionOpen: "सेशन खुला",
        emptyTerminals: "कोई टर्मिनल कॉन्फ़िगर नहीं।",
        emptyTerminalsHint:
          "POS टर्मिनल सेट अप करने के लिए अपने एडमिनिस्ट्रेटर से संपर्क करें।",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "POS डैशबोर्ड देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "POS डेटा का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: {
          title: "सर्वर एरर",
          description: "डैशबोर्ड लोड नहीं हो सका",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: { title: "नहीं मिला", description: "कोई POS डेटा नहीं मिला" },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "डैशबोर्ड लोड हुआ",
        description: "POS ओवरव्यू मिल गया",
      },
      response: {
        terminalsTotal: "कुल टर्मिनल",
        terminalsActive: "सक्रिय टर्मिनल",
        openSessionsCount: "खुले सेशन",
        todayOrderCount: "आज के ऑर्डर",
        todaySalesTotal: "आज की आय",
        refundsToday: "आज के रिफ़ंड",
        currency: "करेंसी",
        terminalId: "टर्मिनल ID",
        terminalName: "टर्मिनल का नाम",
        terminalLocation: "जगह",
        terminalCurrency: "करेंसी",
        terminalIsActive: "सक्रिय",
        terminalHasOpenSession: "सेशन खुला",
        terminalOpenSessionId: "खुले सेशन की ID",
      },
    },
  },

  // Terminal create
  terminalCreate: {
    post: {
      title: "नया टिल",
      titleShort: "नया टिल",
      description: "कंपनी में टिल जोड़ें: नाम, करेंसी, कैश अकाउंट और स्टॉक वेयरहाउस।",
      widget: {
        title: "नया टिल",
        subtitle:
          "एक टिल एक करेंसी में बेचता है, कैश एक अकाउंट में बुक करता है और स्टॉक एक वेयरहाउस से लेता है।",
        subtitleCompany:
          "{{company}} में एक टिल जोड़ता है। वह एक करेंसी में बेचता है और कैश एक अकाउंट में बुक करता है।",
        back: "वापस",
        backToList: "सभी टिल",
        openTill: "टिल खोलें",
        cancel: "रद्द करें",
        submit: "टिल बनाएँ",
        none: "कोई नहीं",
        sectionTill: "टिल",
        sectionMoney: "पैसे",
        sectionMoneyHint: "टिल किस करेंसी में बेचता है और उसका कैश कहाँ बुक होता है।",
        sectionStock: "स्टॉक",
        sectionStockHint:
          "पूरी हुई बिक्री इसी वेयरहाउस से स्टॉक लेती है। सिर्फ़ सेवाएँ बेचते हैं तो इसे छोड़ दें।",
        defaultCashAccount: "कंपनी का डिफ़ॉल्ट कैश अकाउंट",
        noWarehouse: "कोई स्टॉक ट्रैकिंग नहीं",
        chooseCompanyFirst: "पहले कंपनी चुनें।",
      },
      companyId: {
        label: "कंपनी",
        description: "इस टिल की मालिक कंपनी",
      },
      name: {
        label: "नाम",
        description: "टिल कार्ड और रसीदों पर दिखता है",
        placeholder: "फ़्रंट काउंटर",
      },
      location: {
        label: "जगह",
        description: "टिल कहाँ है। वैकल्पिक।",
        placeholder: "ग्राउंड फ़्लोर",
      },
      currency: {
        label: "करेंसी",
        description: "इस टिल पर हर बिक्री इसी करेंसी में होती है",
        placeholder: "करेंसी चुनें",
      },
      cashAccountNodeId: {
        label: "कैश अकाउंट",
        description: "इस टिल पर लिया गया नकद इसी अकाउंट में बुक होता है।",
        invalid: "इस कंपनी का पोस्ट करने योग्य कैश या बैंक अकाउंट चुनें।",
      },
      warehouseId: {
        label: "वेयरहाउस",
        description: "बिक्री पूरी होने पर स्टॉक इसी वेयरहाउस से निकलता है।",
      },
      errors: {
        validation: {
          title: "टिल जाँचें",
          description: "नाम जोड़ें और करेंसी चुनें।",
        },
        unauthorized: {
          title: "साइन इन ज़रूरी है",
          description: "टिल जोड़ने के लिए साइन इन करें।",
        },
        forbidden: {
          title: "सिर्फ़ एडमिन",
          description: "सिर्फ़ कंपनी एडमिन टिल जोड़ सकते हैं।",
        },
        conflict: {
          title: "नाम पहले से लिया गया है",
          description: "इस नाम का टिल पहले से मौजूद है।",
        },
        server: {
          title: "टिल नहीं बना",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        unknown: {
          title: "टिल नहीं बना",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        network: {
          title: "कनेक्शन नहीं",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें।",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कंपनी या वेयरहाउस मौजूद नहीं है।",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले अपने बदलाव पूरे करें या छोड़ दें।",
        },
      },
      success: {
        title: "टिल बन गया",
        description: "ड्रॉअर गिनें और बिक्री शुरू करने के लिए उसे खोलें।",
      },
      response: {
        id: "टिल",
        name: "नाम",
        companyId: "कंपनी",
        currency: "करेंसी",
        isActive: "सक्रिय",
      },
    },
  },

  // Terminal list
  terminalList: {
    get: {
      title: "टिल",
      titleShort: "टिल",
      description: "आपकी कंपनियों का हर टिल और क्या वह अभी बिक्री कर रहा है।",
      widget: {
        title: "टिल",
        pickTitle: "टिल चुनें",
        subtitle: "आपके काउंटर का हर रजिस्टर और क्या वह अभी बिक्री कर रहा है।",
        summary: "टिल: {{total}} · अभी बिक्री में: {{selling}}",
        newTill: "नया टिल",
        createTill: "टिल जोड़ें",
        emptyTitle: "अभी कोई टिल नहीं",
        emptyMessage: "काउंटर पर बेचना शुरू करने के लिए टिल जोड़ें।",
        selling: "बिक्री हो रही है",
        ready: "तैयार",
        inactive: "निष्क्रिय",
        openRegister: "रजिस्टर खोलें",
        openTill: "टिल खोलें",
        loading: "टिल लोड हो रहे हैं",
        back: "वापस",
      },
      companyId: {
        label: "कंपनी",
        description: "सिर्फ़ इस कंपनी के टिल",
      },
      terminalId: {
        label: "टिल",
        description: "सिर्फ़ यह टिल",
      },
      errors: {
        validation: {
          title: "फ़िल्टर जाँचें",
          description: "कंपनी या टिल सही नहीं है।",
        },
        unauthorized: {
          title: "साइन इन ज़रूरी है",
          description: "टिल देखने के लिए साइन इन करें।",
        },
        forbidden: {
          title: "एक्सेस नहीं",
          description: "आप इस कंपनी के सदस्य नहीं हैं।",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा बदल गया। रीलोड करें और फिर कोशिश करें।",
        },
        server: {
          title: "टिल लोड नहीं हुए",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        unknown: {
          title: "टिल लोड नहीं हुए",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        network: {
          title: "कनेक्शन नहीं",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें।",
        },
        notFound: {
          title: "नहीं मिला",
          description: "यह कंपनी मौजूद नहीं है।",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले अपने बदलाव पूरे करें या छोड़ दें।",
        },
      },
      success: {
        title: "टिल लोड हुए",
        description: "आपके टिल अप-टू-डेट हैं।",
      },
      response: {
        id: "टिल",
        name: "नाम",
        location: "जगह",
        currency: "करेंसी",
        isActive: "सक्रिय",
        companyName: "कंपनी",
        openSessionId: "शिफ़्ट खोलें",
        createdAt: "बनाया गया",
      },
    },
  },

  // Session open
  sessionOpen: {
    post: {
      title: "टिल खोलें",
      titleShort: "टिल खोलें",
      description: "ड्रॉअर में गिने नकद के साथ टिल पर शिफ़्ट शुरू करें।",
      widget: {
        title: "टिल खोलें",
        subtitle: "ड्रॉअर का नकद गिनें, फिर शिफ़्ट शुरू करें।",
        back: "वापस",
        cancel: "रद्द करें",
        loadingTill: "टिल लोड हो रहा है",
        selling: "बिक्री हो रही है",
        ready: "तैयार",
        inactive: "निष्क्रिय",
        alreadyOpen: "यह टिल पहले से खुला है। बिक्री जारी रखें।",
        openRegister: "रजिस्टर खोलें",
        floatHint:
          "फ़्लोट वह खुले पैसे हैं जिनसे आप शुरू करते हैं। टिल बंद करते समय गिनती की तुलना इससे होती है।",
      },
      terminalId: {
        label: "टिल",
        description: "जो टिल खोलना है",
      },
      openingFloat: {
        label: "शुरुआती फ़्लोट",
        description: "शिफ़्ट शुरू होते समय ड्रॉअर में नकद",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "फ़्लोट जाँचें",
          description: "ड्रॉअर का नकद दर्ज करें, शून्य या ज़्यादा।",
        },
        unauthorized: {
          title: "साइन इन ज़रूरी है",
          description: "टिल खोलने के लिए साइन इन करें।",
        },
        forbidden: {
          title: "एक्सेस नहीं",
          description: "आप इस टिल की कंपनी के सदस्य नहीं हैं।",
        },
        conflict: {
          title: "टिल पहले से खुला है",
          description: "इस टिल की एक शिफ़्ट पहले से खुली है।",
        },
        server: {
          title: "टिल नहीं खुला",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        unknown: {
          title: "टिल नहीं खुला",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        network: {
          title: "कनेक्शन नहीं",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें।",
        },
        notFound: {
          title: "टिल नहीं मिला",
          description: "यह टिल मौजूद नहीं है।",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले अपने बदलाव पूरे करें या छोड़ दें।",
        },
      },
      success: {
        title: "टिल खुला",
        description: "शिफ़्ट शुरू हो गई है। पहली बिक्री दर्ज करें।",
      },
      response: {
        id: "शिफ़्ट",
        terminalId: "टिल",
        openedAt: "खोला",
        status: "स्थिति",
        openingFloat: "शुरुआती फ़्लोट",
      },
    },
  },

  // Session close
  sessionClose: {
    post: {
      mixedCash:
        "दूसरी करेंसी में नकद पेमेंट का मिलान ज़रूरी है, तब यह ड्रॉअर बंद हो सकता है।",
      title: "टिल बंद करें",
      titleShort: "टिल बंद करें",
      description: "कैशियर सेशन बंद करें और क्लोज़िंग फ़्लोट दर्ज करें।",
      widget: {
        backToTerminals: "वापस",
        sessionSummary: "सेशन का सारांश",
        terminal: "टर्मिनल",
        openedAt: "खोलने का समय",
        orderCount: "ऑर्डर: {{count}}",
        sessionRevenue: "आय",
        floatHint: "ड्रॉअर का हर नोट और सिक्का गिनें।",
        reconciliation: "दिन का अंत",
        sessionReady: "सेशन",
        active: "सक्रिय",
        openingFloat: "शुरुआती फ़्लोट",
        cashSales: "नकद बिक्री",
        expectedClosingFloat: "ड्रॉअर में अपेक्षित",
        actualClosingFloat: "गिना हुआ नकद",
        variance: "अंतर",
        reconciliationTitle: "कैश गिनती",
        title: "टिल बंद करें",
        subtitle: "{{terminal}} · {{time}} से खुला",
        cashRefunds: "नकद रिफ़ंड",
        balanced: "ड्रॉअर संतुलित",
        over: "{{amount}} ज़्यादा",
        short: "{{amount}} कम",
        openSaleBlocks:
          "इस टिल पर एक बिक्री अब भी खुली है। रजिस्टर में उसे पूरा करें या रद्द करें, फिर टिल बंद करें।",
        backToPos: "POS पर वापस",
      },
      sessionId: { label: "सेशन ID", description: "बंद किया जाने वाला सेशन" },
      closingFloat: {
        label: "गिना हुआ नकद",
        description: "बंद करते समय ड्रॉअर में गिना नकद",
        placeholder: "0.00",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "सेशन बंद करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "आप सिर्फ़ अपना सेशन बंद कर सकते हैं",
        },
        conflict: {
          title: "सेशन पहले से बंद है",
          description: "यह सेशन पहले से बंद है",
        },
        server: {
          title: "सर्वर एरर",
          description: "सेशन बंद नहीं हो सका",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "सेशन नहीं मिला",
          description: "सेशन मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "सेशन बंद हुआ",
        description: "सेशन सफलतापूर्वक बंद हुआ",
      },
      response: {
        id: "सेशन ID",
        status: "स्थिति",
        closedAt: "बंद होने का समय",
        closingFloat: "क्लोज़िंग फ़्लोट",
        expectedFloat: "अपेक्षित फ़्लोट",
        cashSalesTotal: "नकद बिक्री",
        cashRefundsTotal: "नकद रिफ़ंड",
        openingFloat: "शुरुआती फ़्लोट",
        variance: "अंतर",
        orderCount: "ऑर्डर की संख्या",
      },
    },
  },

  // Session get
  sessionGet: {
    get: {
      title: "शिफ़्ट का सारांश",
      titleShort: "शिफ़्ट",
      description:
        "टिल की एक शिफ़्ट: कब खुली, किसने बेचा और ड्रॉअर में क्या होना चाहिए।",
      widget: {
        title: "शिफ़्ट",
        back: "वापस",
        loading: "शिफ़्ट लोड हो रही है",
        selling: "बिक्री हो रही है",
        closed: "बंद",
        subtitleOpen: "{{time}} से खुला",
        subtitleClosed: "{{time}} को बंद हुआ",
        sales: "बिक्री",
        closeTill: "टिल बंद करें",
        openRegister: "रजिस्टर खोलें",
        drawerTitle: "कैश ड्रॉअर",
        variance: "अंतर",
        closeSession: "टिल बंद करें",
        newOrder: "नया ऑर्डर",
      },
      sessionId: {
        label: "शिफ़्ट",
        description: "जो शिफ़्ट दिखानी है",
      },
      errors: {
        validation: {
          title: "शिफ़्ट जाँचें",
          description: "यह शिफ़्ट लिंक सही नहीं है।",
        },
        unauthorized: {
          title: "साइन इन ज़रूरी है",
          description: "शिफ़्ट देखने के लिए साइन इन करें।",
        },
        forbidden: {
          title: "एक्सेस नहीं",
          description: "आप इस टिल की कंपनी के सदस्य नहीं हैं।",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा बदल गया। रीलोड करें और फिर कोशिश करें।",
        },
        server: {
          title: "शिफ़्ट लोड नहीं हुई",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        unknown: {
          title: "शिफ़्ट लोड नहीं हुई",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        network: {
          title: "कनेक्शन नहीं",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें।",
        },
        notFound: {
          title: "शिफ़्ट नहीं मिली",
          description: "यह शिफ़्ट मौजूद नहीं है।",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले अपने बदलाव पूरे करें या छोड़ दें।",
        },
      },
      success: {
        title: "शिफ़्ट लोड हुई",
        description: "ड्रॉअर के आँकड़े अप-टू-डेट हैं।",
      },
      response: {
        id: "शिफ़्ट",
        terminalId: "टिल",
        terminalName: "टिल",
        companyName: "कंपनी",
        cashierUserId: "कैशियर",
        cashierName: "कैशियर",
        status: "स्थिति",
        openedAt: "खोला",
        closedAt: "बंद",
        openingFloat: "शुरुआती फ़्लोट",
        closingFloat: "बंद करते समय गिना गया",
        cashSalesTotal: "नकद बिक्री",
        cashRefundsTotal: "नकद रिफ़ंड",
        expectedCash: "ड्रॉअर में अपेक्षित",
      },
    },
  },

  // Order create
  orderCreate: {
    post: {
      title: "ऑर्डर बनाएँ",
      titleShort: "ऑर्डर बनाएँ",
      description: "खुले सेशन में नया ऑर्डर बनाएँ।",
      widget: {
        addItem: "आइटम जोड़ें",
        viewOrder: "ऑर्डर देखें",
        creating: "ऑर्डर खुल रहा है...",
        back: "वापस",
      },
      sessionId: {
        label: "सेशन ID",
        description: "जिस सेशन में ऑर्डर बनाना है",
      },
      customerId: {
        label: "ग्राहक ID",
        description: "वैकल्पिक ग्राहक रेफ़रेंस",
      },
      currency: {
        label: "करेंसी",
        description: "ऑर्डर की करेंसी",
        placeholder: "EUR",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "ऑर्डर बनाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस सेशन का एक्सेस नहीं",
        },
        conflict: {
          title: "सेशन बंद हुआ",
          description: "बंद सेशन में ऑर्डर नहीं बन सकते",
        },
        server: {
          title: "सर्वर एरर",
          description: "ऑर्डर बनाना फ़ेल हुआ",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "सेशन नहीं मिला",
          description: "सेशन मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ऑर्डर बन गया",
        description: "ऑर्डर सफलतापूर्वक बन गया",
      },
      response: {
        id: "ऑर्डर ID",
        orderNumber: "ऑर्डर नंबर",
        sessionId: "सेशन ID",
        status: "स्थिति",
        currency: "करेंसी",
        total: "कुल",
      },
    },
  },

  // Order add item
  orderAddItem: {
    post: {
      title: "आइटम जोड़ें",
      titleShort: "आइटम जोड़ें",
      description: "खुले ऑर्डर में लाइन आइटम जोड़ें।",
      widget: {
        backToOrder: "ऑर्डर पर वापस",
        linePreview: "लाइन कुल",
        taxNote: "टैक्स समेत",
        multiplier: "×",
        addAnother: "एक और आइटम जोड़ें",
        searchProduct: "प्रोडक्ट कैटलॉग खोजें",
        searchPlaceholder: "नाम या SKU…",
        orManual: "या ख़ुद दर्ज करें",
        selectedProduct: "चुना हुआ प्रोडक्ट",
        clearProduct: "साफ़ करें",
        searchButton: "खोजें",
        noProductResults: "कोई मेल नहीं। आइटम का ब्योरा नीचे दर्ज करें।",
      },
      orderId: { label: "ऑर्डर ID", description: "जिस ऑर्डर में आइटम जोड़ना है" },
      productId: {
        label: "प्रोडक्ट ID",
        description: "वैकल्पिक प्रोडक्ट रेफ़रेंस",
      },
      itemDescription: {
        label: "विवरण",
        description: "आइटम का विवरण",
        placeholder: "कॉफ़ी",
      },
      quantity: {
        label: "मात्रा",
        description: "मात्रा",
        placeholder: "1",
      },
      unitPrice: {
        label: "यूनिट कीमत",
        description: "प्रति यूनिट कीमत",
        placeholder: "3.50",
      },
      mergeWithLine: {
        label: "मेल खाती लाइन में जोड़ें",
        description: "इस प्रोडक्ट की मौजूदा लाइन की मात्रा बढ़ाएँ",
      },
      taxRate: {
        label: "टैक्स दर",
        description: "दशमलव में टैक्स दर (जैसे 20% के लिए 0.2)",
        placeholder: "0.20",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "आइटम जोड़ने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ऑर्डर का एक्सेस नहीं",
        },
        conflict: {
          title: "ऑर्डर खुला नहीं है",
          description: "जो ऑर्डर खुला नहीं है उसमें आइटम नहीं जुड़ सकते",
        },
        server: { title: "सर्वर एरर", description: "आइटम जोड़ना फ़ेल हुआ" },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "ऑर्डर नहीं मिला",
          description: "ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: { title: "आइटम जुड़ गया", description: "आइटम ऑर्डर में जुड़ गया" },
      response: {
        id: "आइटम ID",
        description: "विवरण",
        quantity: "मात्रा",
        unitPrice: "यूनिट कीमत",
        taxAmount: "टैक्स रकम",
        lineTotal: "लाइन कुल",
        orderTotal: "ऑर्डर कुल",
      },
    },
  },

  // Order remove item
  orderRemoveItem: {
    post: {
      title: "आइटम हटाएँ",
      titleShort: "आइटम हटाएँ",
      description: "खुले ऑर्डर से लाइन आइटम हटाएँ।",
      widget: {
        chooseLine: "लाइन आइटम चुनें",
        backToOrder: "ऑर्डर पर वापस",
      },
      orderId: { label: "ऑर्डर", description: "जिस ऑर्डर से आइटम हटाना है" },
      quantity: {
        label: "हटाने की मात्रा",
        description: "पूरी लाइन हटाने के लिए ख़ाली छोड़ें",
      },
      itemId: { label: "लाइन आइटम", description: "हटाया जाने वाला आइटम" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "आइटम हटाने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ऑर्डर का एक्सेस नहीं",
        },
        conflict: {
          title: "ऑर्डर खुला नहीं है",
          description: "जो ऑर्डर खुला नहीं है उससे आइटम नहीं हट सकते",
        },
        server: { title: "सर्वर एरर", description: "आइटम हटाना फ़ेल हुआ" },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "नहीं मिला",
          description: "ऑर्डर या आइटम नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "आइटम हट गया",
        description: "आइटम ऑर्डर से हट गया",
      },
      response: {
        orderId: "ऑर्डर ID",
        orderTotal: "अपडेट किया कुल",
      },
    },
  },

  // Order complete
  orderComplete: {
    post: {
      title: "ऑर्डर पूरा करें",
      titleShort: "ऑर्डर पूरा करें",
      description: "ऑर्डर पूरा करें। पूरा पेमेंट जाँचता है और जर्नल एंट्री पोस्ट करता है।",
      widget: {
        backToList: "ऑर्डर पर वापस",
        confirmTitle: "यह ऑर्डर पूरा करें?",
        confirmHint: "यह वापस नहीं हो सकता। सभी पेमेंट वसूले जा चुके होने चाहिए।",
        orderNumber: "ऑर्डर",
        cancel: "रद्द करें",
      },
      orderId: { label: "ऑर्डर ID", description: "पूरा किया जाने वाला ऑर्डर" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ऑर्डर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "ऑर्डर पूरे करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ऑर्डर का एक्सेस नहीं",
        },
        conflict: {
          title: "बिना चुकाया बैलेंस",
          description: "कुल पेमेंट ऑर्डर के कुल को कवर नहीं करते",
        },
        server: {
          title: "सर्वर एरर",
          description: "ऑर्डर पूरा करना फ़ेल हुआ",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "ऑर्डर नहीं मिला",
          description: "ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ऑर्डर पूरा हुआ",
        description: "ऑर्डर पूरा हुआ और जर्नल एंट्री पोस्ट हुई",
      },
      response: {
        id: "ऑर्डर ID",
        status: "स्थिति",
        total: "कुल",
        journalEntryId: "जर्नल एंट्री ID",
      },
    },
  },

  // Order void
  orderVoid: {
    post: {
      title: "ऑर्डर रद्द करें",
      titleShort: "ऑर्डर रद्द करें",
      description: "खुला ऑर्डर रद्द करें। वापस नहीं हो सकता।",
      widget: {
        tendered: "पेमेंट पहले ही दर्ज हो चुका है। अब आइटम और ऑर्डर बदले नहीं जा सकते।",
        closed: "यह ऑर्डर बंद है।",
        backToList: "ऑर्डर पर वापस",
      },
      orderId: { label: "ऑर्डर", description: "रद्द किया जाने वाला ऑर्डर" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ऑर्डर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "ऑर्डर रद्द करने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ऑर्डर का एक्सेस नहीं",
        },
        conflict: {
          title: "ऑर्डर खुला नहीं है",
          description: "सिर्फ़ खुले ऑर्डर रद्द हो सकते हैं",
        },
        server: { title: "सर्वर एरर", description: "ऑर्डर रद्द करना फ़ेल हुआ" },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "ऑर्डर नहीं मिला",
          description: "ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: { title: "ऑर्डर रद्द हुआ", description: "ऑर्डर रद्द कर दिया गया है" },
      response: {
        id: "ऑर्डर ID",
        status: "स्थिति",
      },
    },
  },

  // Order get
  orderGet: {
    get: {
      title: "ऑर्डर लाएँ",
      titleShort: "ऑर्डर का ब्योरा",
      description: "आइटम और पेमेंट के साथ एक ऑर्डर लाएँ।",
      widget: {
        refund: "रिफ़ंड",
        addItem: "आइटम जोड़ें",
        addPayment: "पेमेंट जोड़ें",
        complete: "ऑर्डर पूरा करें",
        void: "ऑर्डर रद्द करें",
        back: "वापस",
        outstanding: "बकाया",
        fullyPaid: "पूरा चुकाया",
        qtyTimesPrice: "×",
        loading: "ऑर्डर लोड हो रहा है...",
        noItems: "पहला आइटम जोड़ें।",
        viewJournalEntry: "जर्नल एंट्री देखें",
        voidedStamp: "रद्द",
        completedReadOnly: "यह ऑर्डर पूरा हो चुका है और बदला नहीं जा सकता।",
        select: "ऑर्डर चुनें",
      },
      orderId: { label: "ऑर्डर ID", description: "जो ऑर्डर लाना है" },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ऑर्डर ID गलत है",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "ऑर्डर देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ऑर्डर का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: { title: "सर्वर एरर", description: "ऑर्डर लोड नहीं हो सका" },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "ऑर्डर नहीं मिला",
          description: "ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "ऑर्डर लोड हुआ",
        description: "ऑर्डर का ब्योरा मिल गया",
      },
      response: {
        id: "ऑर्डर ID",
        orderNumber: "ऑर्डर नंबर",
        sessionId: "सेशन ID",
        customerId: "ग्राहक ID",
        status: "स्थिति",
        currency: "करेंसी",
        subtotal: "उप-योग",
        taxAmount: "टैक्स",
        total: "कुल",
        journalEntryId: "जर्नल एंट्री ID",
        createdAt: "बनने का समय",
        items: "आइटम",
        itemId: "आइटम ID",
        productId: "प्रोडक्ट ID",
        description: "विवरण",
        quantity: "मात्रा",
        unitPrice: "यूनिट कीमत",
        taxRate: "टैक्स दर",
        taxAmountItem: "टैक्स",
        lineTotal: "लाइन कुल",
        payments: "पेमेंट",
        paymentId: "पेमेंट ID",
        method: "तरीक़ा",
        amount: "रकम",
        change: "वापस रकम",
        reference: "रेफ़रेंस",
      },
    },
  },

  // Order list
  orderList: {
    get: {
      title: "ऑर्डर",
      titleShort: "ऑर्डर",
      description: "वैकल्पिक स्थिति फ़िल्टर के साथ किसी सेशन या टर्मिनल के ऑर्डर की सूची।",
      widget: {
        title: "बिक्री",
        subtitleAll: "हर टिल की बिक्री, सबसे नई पहले।",
        subtitleSession: "इस टिल सेशन की बिक्री, सबसे नई पहले।",
        openRegister: "रजिस्टर खोलें",
        colSale: "बिक्री",
        colTime: "समय",
        colStatus: "स्थिति",
        colTotal: "कुल",
        count: "बिक्री: {{count}}",
        newOrder: "नया ऑर्डर",
        empty: "अभी कोई बिक्री नहीं",
        emptyHint: "टिल पर दर्ज बिक्री अपनी रसीद के साथ यहाँ दिखती है।",
        back: "वापस",
        backToTerminals: "टर्मिनल पर वापस",
        selectSession: "सेशन चुनें",
        selectSessionHint: "ऑर्डर देखने के लिए सेशन ID दर्ज करें।",
        sessionTotal: "सेशन का कुल",
        filterAll: "सभी",
        loading: "ऑर्डर लोड हो रहे हैं...",
        ordersTotal: "orders",
        tapToView: "देखने के लिए टैप करें",
      },
      companyId: {
        label: "कंपनी",
        description: "जिस कंपनी के टिल की बिक्री दिखानी है",
      },
      sessionId: {
        label: "सेशन ID",
        description: "जिस सेशन के ऑर्डर दिखाने हैं",
      },
      status: {
        label: "स्थिति",
        description: "ऑर्डर स्थिति से फ़िल्टर करें",
        placeholder: "सभी स्थितियाँ",
      },
      page: { label: "पेज", description: "पेज नंबर (1 से शुरू)" },
      pageSize: {
        label: "प्रति पेज",
        description: "प्रति पेज नतीजे (अधिकतम 100)",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "ऑर्डर की सूची देखने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस सेशन का एक्सेस नहीं",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        server: { title: "सर्वर एरर", description: "ऑर्डर की सूची नहीं बन सकी" },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "सेशन नहीं मिला",
          description: "सेशन मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: { title: "ऑर्डर लोड हुए", description: "ऑर्डर की सूची मिल गई" },
      response: {
        terminalName: "टिल",
        count: "कुल",
        id: "ऑर्डर ID",
        orderNumber: "ऑर्डर नंबर",
        sessionId: "सेशन ID",
        status: "स्थिति",
        currency: "करेंसी",
        total: "कुल",
        createdAt: "बनने का समय",
      },
    },
  },

  // Product lookup (POS catalog search)
  productLookup: {
    get: {
      title: "प्रोडक्ट खोज",
      titleShort: "प्रोडक्ट",
      description: "नाम या SKU से कैटलॉग के प्रोडक्ट खोजें, कीमत और VAT के साथ।",
      widget: {
        title: "प्रोडक्ट",
        pickTitle: "प्रोडक्ट चुनें",
        subtitle: "नाम या SKU से खोजें। स्कैन किए बारकोड सटीक मिलते हैं।",
        back: "वापस",
        loading: "प्रोडक्ट लोड हो रहे हैं",
        emptyTitle: "अभी कोई प्रोडक्ट नहीं",
        emptyMessage: "कैटलॉग में आपके जोड़े प्रोडक्ट अपनी कीमत के साथ यहाँ दिखते हैं।",
        noMatchTitle: 'Nothing matches "{{query}}"',
        noMatchMessage: "स्पेलिंग जाँचें या SKU से खोजें।",
        vat: "VAT {{rate}}",
        noVat: "कोई VAT नहीं",
        perUnit: "प्रति {{unit}}",
      },
      companyId: {
        label: "कंपनी",
        description: "सिर्फ़ इस कंपनी के प्रोडक्ट",
      },
      query: {
        label: "प्रोडक्ट खोजें",
        description: "प्रोडक्ट का नाम या SKU। देखने के लिए ख़ाली छोड़ें।",
        placeholder: "नाम या SKU",
      },
      currency: {
        label: "करेंसी",
        description: "सिर्फ़ इस करेंसी में कीमत वाले प्रोडक्ट",
      },
      page: {
        label: "पेज",
        description: "पेज नंबर, 1 से शुरू",
      },
      pageSize: {
        label: "प्रति पेज",
        description: "प्रति पेज नतीजे, अधिकतम 50",
      },
      errors: {
        validation: {
          title: "खोज जाँचें",
          description: "120 अक्षरों तक इस्तेमाल करें।",
        },
        unauthorized: {
          title: "साइन इन ज़रूरी है",
          description: "प्रोडक्ट खोजने के लिए साइन इन करें।",
        },
        forbidden: {
          title: "एक्सेस नहीं",
          description: "आप इस कंपनी के सदस्य नहीं हैं।",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा बदल गया। रीलोड करें और फिर कोशिश करें।",
        },
        server: {
          title: "खोज फ़ेल हुई",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        unknown: {
          title: "खोज फ़ेल हुई",
          description: "कुछ गड़बड़ हुई। फिर कोशिश करें।",
        },
        network: {
          title: "कनेक्शन नहीं",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें।",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कोई प्रोडक्ट नहीं मिला।",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले अपने बदलाव पूरे करें या छोड़ दें।",
        },
      },
      success: {
        title: "प्रोडक्ट मिल गए",
        description: "नतीजे अप-टू-डेट हैं।",
      },
      response: {
        id: "प्रोडक्ट",
        name: "नाम",
        sku: "SKU",
        type: "प्रकार",
        basePrice: "कीमत",
        currency: "करेंसी",
        defaultTaxRate: "VAT दर",
        unit: "यूनिट",
      },
    },
  },

  // Order add payment
  orderAddPayment: {
    post: {
      title: "पेमेंट जोड़ें",
      titleShort: "पेमेंट जोड़ें",
      description: "खुले ऑर्डर पर पेमेंट दर्ज करें।",
      widget: {
        fullyPaid: "पूरा चुकाया",
        backToOrder: "ऑर्डर पर वापस",
        amountDue: "बकाया रकम",
        changeLabel: "वापस रकम",
        changeHint: "ग्राहक को लौटाएँ",
        addAnotherPayment: "एक और पेमेंट जोड़ें",
      },
      orderId: { label: "ऑर्डर ID", description: "जिस ऑर्डर का पेमेंट करना है" },
      method: {
        label: "पेमेंट का तरीक़ा",
        description: "ग्राहक कैसे पेमेंट करता है",
        placeholder: "तरीक़ा चुनें",
      },
      amount: {
        label: "रकम",
        description: "दी गई रकम",
        placeholder: "0.00",
      },
      change: {
        label: "वापस रकम",
        description: "ग्राहक को लौटाई गई वापस रकम",
        placeholder: "0.00",
      },
      reference: {
        label: "रेफ़रेंस",
        description: "कार्ड ऑथराइज़ेशन कोड या ट्रांसफ़र रेफ़रेंस",
      },
      accountNodeId: {
        label: "अकाउंट नोड",
        description: "पेमेंट पाने वाला अकाउंट नोड (टर्मिनल डिफ़ॉल्ट को ओवरराइड करता है)",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "ज़रूरी फ़ील्ड जाँचें",
        },
        unauthorized: {
          title: "साइन इन नहीं है",
          description: "पेमेंट जोड़ने के लिए साइन इन करें",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "इस ऑर्डर का एक्सेस नहीं",
        },
        conflict: {
          title: "ऑर्डर खुला नहीं है",
          description: "जो ऑर्डर खुला नहीं है उसमें पेमेंट नहीं जुड़ सकते",
        },
        server: {
          title: "सर्वर एरर",
          description: "पेमेंट दर्ज करना फ़ेल हुआ",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "अपना कनेक्शन जाँचें और फिर कोशिश करें",
        },
        notFound: {
          title: "ऑर्डर नहीं मिला",
          description: "ऑर्डर मौजूद नहीं है",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "पेमेंट दर्ज हुआ",
        description: "ऑर्डर के विरुद्ध पेमेंट दर्ज हुआ",
      },
      response: {
        id: "पेमेंट ID",
        method: "तरीक़ा",
        amount: "रकम",
        change: "वापस रकम",
        totalPaid: "कुल चुकाया",
        outstanding: "बकाया",
      },
    },
  },
};
