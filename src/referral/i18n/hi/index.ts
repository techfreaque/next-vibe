import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "रेफ़रल",

  tags: {
    referral: "referral",
    codes: "codes",
    earnings: "earnings",
    get: "get",
    create: "create",
    list: "list",
  },

  get: {
    title: "रेफ़रल कोड पाएँ",
    titleShort: "कोड पाएँ",
    description: "रेफ़रल कोड की जानकारी पाएँ",
    form: {
      title: "रेफ़रल कोड की जानकारी",
      description: "रेफ़रल कोड की जानकारी देखें",
      limit: {
        label: "सीमा",
        description: "वापस भेजे जाने वाले नतीजों की अधिकतम संख्या",
      },
      offset: {
        label: "ऑफ़सेट",
        description: "छोड़े जाने वाले नतीजों की संख्या",
      },
    },
    response: {
      earnings: {
        id: "ID",
        earnerUserId: "कमाने वाले यूज़र की ID",
        sourceUserId: "सोर्स यूज़र की ID",
        transactionId: "ट्रांज़ैक्शन ID",
        level: "लेवल",
        amountCents: "राशि (सेंट में)",
        currency: "करेंसी",
        status: "स्टेटस",
        createdAt: "बनाने का समय",
      },
      totalCount: "कुल गिनती",
    },
  },

  post: {
    title: "रेफ़रल कोड बनाएँ",
    titleShort: "कोड बनाएँ",
    description: "नया रेफ़रल कोड बनाएँ",
    form: {
      title: "नया रेफ़रल कोड",
      description:
        "हर ऑडियंस के लिए एक कोड। Discord, ब्लॉग, दोस्त। हर एक अलग ट्रैक होता है।",
    },
    submit: {
      label: "कोड बनाएँ",
      loading: "बन रहा है...",
    },
  },

  put: {
    title: "रेफ़रल कोड अपडेट करें",
    description: "रेफ़रल कोड की सेटिंग्स अपडेट करें",
    form: {
      title: "रेफ़रल कोड अपडेट करें",
      description: "रेफ़रल कोड की प्रॉपर्टीज़ बदलें",
    },
  },

  delete: {
    title: "रेफ़रल कोड बंद करें",
    description: "एक रेफ़रल कोड बंद करें",
    form: {
      title: "रेफ़रल कोड बंद करें",
      description: "इस रेफ़रल कोड को डिसेबल करें",
    },
  },

  linkToLead: {
    post: {
      title: "रेफ़रल को लीड से जोड़ें",
      titleShort: "रेफ़रल लिंक करें",
      description: "साइन अप से पहले रेफ़रल कोड को लीड से जोड़ें",
      form: {
        title: "रेफ़रल कोड लिंक करें",
        description: "रेफ़रल कोड को अपने सेशन से जोड़ें",
      },
    },
    success: {
      title: "रेफ़रल लिंक हो गया",
      description: "रेफ़रल कोड आपके सेशन से जुड़ गया",
    },
  },

  codes: {
    list: {
      get: {
        title: "रेफ़रल कमाई",
        titleShort: "रेफ़रल कमाई",
        description: "रेफ़रल कमीशन देखें। प्लेटफ़ॉर्म एडमिन सभी पार्टनर्स को देख सकते हैं।",
        form: {
          title: "आपके रेफ़रल कोड",
          description: "अपने रेफ़रल कोड देखें और मैनेज करें",
        },
        response: {
          codes: {
            id: "ID",
            code: "कोड",
            label: "लेबल",
            currentVisitors: "मौजूदा विज़िटर",
            isActive: "एक्टिव",
            createdAt: "बनाने का समय",
            totalSignups: "कुल साइन अप",
            totalRevenueCents: "कुल रेवेन्यू (सेंट में)",
            totalEarningsCents: "कुल कमाई (सेंट में)",
          },
        },
      },
      success: {
        title: "कोड मिल गए",
        description: "आपके रेफ़रल कोड मिल गए",
      },
      widget: {
        loading: "आपके कोड लोड हो रहे हैं...",
        empty: "आपके पास अभी कोई रेफ़रल कोड नहीं है",
        emptyHint: "नीचे अपना पहला कोड बनाएँ। लिंक तुरंत तैयार है।",
        copied: "कॉपी हो गया!",
        copy: "लिंक कॉपी करें",
        visitors: "विज़िटर",
        signups: "साइन अप",
        revenue: "रेवेन्यू",
        earnings: "कमाई",
        inactive: "यह रेफ़रल कोड बंद है",
        conversionHint:
          "हर {{examplePrice}}/माह वाला सब्सक्राइबर आपको हर महीने {{exampleEarning}} कमाकर देता है, बार-बार",
        linkGen: "कस्टम लिंक",
        linkGenPlaceholder: "कोई भी पेज URL पेस्ट करें...",
        linkGenHint:
          "unbottled का कोई भी पेज URL पेस्ट करें और ट्रैक होने वाला रेफ़रल लिंक बनाएँ",
        linkGenCopy: "कॉपी करें",
        linkGenCopied: "कॉपी हो गया!",
      },
    },
  },

  stats: {
    get: {
      title: "रेफ़रल आँकड़े",
      titleShort: "आँकड़े",
      description: "अपने रेफ़रल प्रोग्राम के आँकड़े देखें",
      form: {
        title: "आपके रेफ़रल आँकड़े",
        description: "अपने रेफ़रल की परफ़ॉर्मेंस के आँकड़े देखें",
      },
    },
    success: {
      title: "आँकड़े मिल गए",
      description: "आपके रेफ़रल आँकड़े मिल गए",
    },
    widget: {
      emptyAdminMessage: "पूरे प्रोग्राम की गतिविधि देखने के लिए ओवरव्यू खोलें।",
      loading: "रेफ़रल आँकड़े लोड हो रहे हैं",
      loadError: "रेफ़रल आँकड़े लोड नहीं हो सके",
      retry: "दोबारा कोशिश करें",
      emptyTitle: "अभी तक कोई रेफ़रल गतिविधि नहीं",
      openCodes: "रेफ़रल कोड खोलें",
      revenueCoverage:
        "{{total}} में से {{measured}} खरीदारियों की मूल खरीद राशि दर्ज है।",
      revenueUnavailable: "उपलब्ध नहीं",
      walletUnits: "{{amount}} क्रेडिट",
      adminNotice: "ये आँकड़े आपके रेफ़रल के हैं। प्रोग्राम के कुल आँकड़ों के लिए ओवरव्यू खोलें।",
      openOverview: "रेफ़रल ओवरव्यू खोलें",
      emptyMessage: "साइन अप और कमीशन ट्रैक करने के लिए कोई रेफ़रल कोड शेयर करें।",
    },
    fields: {
      totalSignups: "कुल साइन अप",
      totalSignupsDescription: "आपके रेफ़रल कोड से साइन अप करने वाले यूज़र्स की संख्या",
      totalRevenue: "दर्ज खरीद मूल्य",
      totalRevenueDescription: "आपके कमीशन से जुड़ी मूल USD खरीद राशियाँ।",
      totalEarned: "कुल कमाई",
      totalEarnedDescription: "कमाए गए क्रेडिट, रिफ़ंड विंडो वाले क्रेडिट समेत।",
      availableBalance: "उपलब्ध बैलेंस",
      availableBalanceDescription: "पेआउट रिज़र्वेशन के बाद वॉलेट में उपलब्ध क्रेडिट।",
      availableBalanceDescriptionLow:
        "पेआउट रिज़र्वेशन के बाद वॉलेट में उपलब्ध क्रेडिट। न्यूनतम पेआउट: {{minPayout}} क्रेडिट।",
      totalRevenueCredits: "कुल रेवेन्यू (क्रेडिट)",
      totalEarnedCredits: "कुल कमाई (क्रेडिट)",
      totalPaidOutCredits: "कुल पेआउट (क्रेडिट)",
      availableCredits: "उपलब्ध क्रेडिट",
    },
  },

  earnings: {
    confirm: {
      post: {
        title: "रेफ़रल कमाई कन्फ़र्म करें",
        titleShort: "कमाई कन्फ़र्म करें",
        description:
          "जिन रेफ़रल कमाइयों की रिफ़ंड विंडो ख़त्म हो चुकी है उन्हें अनलॉक करें। रोज़ चलता है।",
        container: {
          title: "कमाई की पुष्टि",
          description: "रिफ़ंड विंडो के बाद की पेंडिंग कमाई",
        },
        response: {
          confirmedCount: "कन्फ़र्म हुए",
          failedCount: "विफल",
        },
        success: {
          title: "कमाई कन्फ़र्म हो गई",
          description: "पुरानी हो चुकी रेफ़रल कमाई अब खर्च की जा सकती है",
        },
      },
      task: {
        description: "रिफ़ंड विंडो से पुरानी रेफ़रल कमाई को कमाए हुए क्रेडिट में बदलता है",
      },
    },
    list: {
      get: {
        title: "रेफ़रल कमाई",
        titleShort: "रेफ़रल कमाई",
        description: "रेफ़रल कमीशन देखें। प्लेटफ़ॉर्म एडमिन सभी पार्टनर्स को देख सकते हैं।",
        form: {
          title: "आपकी रेफ़रल कमाई",
          description: "रेफ़रल से अपनी कमाई देखें",
          targetUserId: "पार्टनर अकाउंट",
          personal: "सिर्फ़ मेरी कमाई",
          limit: {
            label: "प्रति पेज पंक्तियाँ",
            description: "प्रति पेज कितनी कमाई दिखानी है",
          },
          offset: {
            label: "यहाँ से शुरू करें",
            description: "छोड़ी जाने वाली कमाई की संख्या",
          },
        },
        widget: {
          subtitle:
            "आपके रेफ़र किए यूज़र्स के पेमेंट से कमीशन। हर कमीशन रिफ़ंड विंडो ख़त्म होने तक होल्ड पर रहता है।",
          platformSubtitle:
            "सभी पार्टनर्स का रेफ़रल कमीशन। पेंडिंग कमीशन रिफ़ंड विंडो बंद होने तक होल्ड पर रहते हैं।",
          platformEmptyHint: "रेफ़र किए गए कस्टमर के पेमेंट करते ही कमीशन यहाँ दिखेगा।",
          direct: "सीधा रेफ़रल",
          level: "लेवल {{level}} रेफ़रल",
          empty: "अभी तक कोई कमाई नहीं",
          emptyHint:
            "जब आपका रेफ़र किया कोई व्यक्ति पेमेंट करेगा, आपका कमीशन यहाँ दिखेगा।",
          loading: "कमाई लोड हो रही है…",
          loadFailed: "कमाई लोड नहीं हो सकी",
          retry: "दोबारा कोशिश करें",
          showing: "{{total}} में से {{from}} से {{to}}",
          previous: "पिछला",
          next: "अगला",
          pageTotal: "इस पेज का कुल ({{currency}})",
          col: {
            partner: "पार्टनर",
            date: "तारीख़",
            source: "सोर्स",
            status: "स्टेटस",
            amount: "कमीशन",
          },
        },
      },
      success: {
        title: "कमाई मिल गई",
        description: "आपकी रेफ़रल कमाई मिल गई",
      },
    },
  },

  form: {
    fields: {
      code: {
        label: "कोड",
        description: "आपके लिंक में लोगों को जो लिखा या दिखा दिखेगा। 3 से 50 अक्षर।",
        placeholder: "जैसे ALEX10",
      },
      label: {
        label: "लेबल (सिर्फ़ आपको दिखता है)",
        description: "आप इसे कहाँ शेयर करेंगे।",
        placeholder: "जैसे YouTube बायो",
      },
      description: {
        label: "विवरण",
        description: "वैकल्पिक विवरण",
        placeholder: "विवरण लिखें",
      },
      maxUses: {
        label: "अधिकतम इस्तेमाल",
        description: "इस कोड को अधिकतम कितनी बार इस्तेमाल किया जा सकता है",
        placeholder: "असीमित के लिए खाली छोड़ें",
      },
      expiresAt: {
        label: "समाप्ति तिथि",
        description: "यह कोड कब एक्सपायर होगा",
        placeholder: "तारीख़ चुनें",
      },
      isActive: {
        label: "एक्टिव",
        description: "यह कोड अभी एक्टिव है या नहीं",
      },
    },
  },

  response: {
    id: "ID",
    code: "कोड",
    label: "लेबल",
    description: "विवरण",
    ownerUserId: "मालिक यूज़र ID",
    maxUses: "अधिकतम इस्तेमाल",
    currentUses: "अभी तक इस्तेमाल",
    expiresAt: "एक्सपायर होने का समय",
    isActive: "एक्टिव",
    createdAt: "बनाने का समय",
    updatedAt: "अपडेट का समय",
    referralCode: "रेफ़रल कोड",
    success:
      "🎉 आपका रेफ़रल कोड तैयार है! नीचे दिया लिंक कॉपी करें और हर सब्सक्रिप्शन पर {{directPct}} कमीशन कमाना शुरू करें। साथ में उनके रेफ़रल से बोनस कमाई भी।",
    message: "मैसेज",
  },

  admin: {
    payouts: {
      get: {
        title: "पेआउट रिक्वेस्ट",
        titleShort: "पेआउट रिक्वेस्ट",
        description: "रेफ़रल पेआउट रिक्वेस्ट मैनेज करें",
      },
      post: {
        title: "पेआउट प्रोसेस करें",
        titleShort: "पेआउट प्रोसेस करें",
        description: "पेआउट रिक्वेस्ट को मंज़ूर, अस्वीकार या पूरा करें",
      },
      fields: {
        search: {
          label: "पार्टनर का ईमेल",
          description: "पूरा या आधा ईमेल एड्रेस लिखकर खोजें।",
        },
        userId: {
          label: "पार्टनर अकाउंट",
        },
        page: {
          label: "पेज",
        },
        limit: {
          label: "प्रति पेज नतीजे",
        },
        status: {
          all: "सभी स्टेटस",
          label: "स्टेटस फ़िल्टर",
          description: "पेआउट स्टेटस से फ़िल्टर करें",
        },
        currency: {
          label: "पेआउट का तरीका",
          description: "पेआउट के तरीके से फ़िल्टर करें",
          all: "सभी तरीके",
        },
        requestId: {
          label: "रिक्वेस्ट ID",
          description: "पेआउट रिक्वेस्ट की पहचान",
        },
        action: {
          label: "कार्रवाई",
          description: "पेआउट रिक्वेस्ट पर की जाने वाली कार्रवाई",
        },
        adminNotes: {
          label: "एडमिन नोट्स",
          description: "इस कार्रवाई के लिए वैकल्पिक नोट्स",
        },
        rejectionReason: {
          label: "अस्वीकार करने का कारण",
          description: "पेआउट रिक्वेस्ट अस्वीकार करने का कारण",
        },
      },
      widget: {
        empty: "इन फ़िल्टर से कोई पेआउट रिक्वेस्ट नहीं मिली",
        emptyHint: "कोई दूसरा ईमेल, स्टेटस या तरीका आज़माएँ।",
        results: "{{count}} नतीजे",
        clear: "फ़िल्टर हटाएँ",
        refresh: "रिफ़्रेश करें",
        loading: "पेआउट रिक्वेस्ट लोड हो रही हैं…",
        amount: "{{credits}} कमाए क्रेडिट · {{value}} USD मूल्य",
        openPartner: "पार्टनर खोलें",
        actionFor: "{{email}} के लिए पेआउट {{action}}",
        previous: "पिछला पेज",
        next: "अगला पेज",
        page: "पेज {{page}} / {{total}}",
        confirmAction: "कार्रवाई कन्फ़र्म करें",
        lookupFailed: "पेआउट रिक्वेस्ट लोड नहीं हो सकी।",
        state: "स्टेटस",
        valueLabel: "माँगा गया मूल्य",
        destinationLabel: "गंतव्य",
        actionSaved: "पेआउट कार्रवाई सेव हो गई।",
        approveDetail: "मंज़ूरी देने पर कमाए हुए क्रेडिट इस पेआउट के लिए रिज़र्व रहते हैं।",
        rejectDetail:
          "अस्वीकार करने पर इस पेआउट के लिए रिज़र्व कमाए क्रेडिट वापस छूट जाते हैं।",
        completeDetail:
          "ट्रांसफ़र भेजने के बाद पेआउट को पूरा चिह्नित करें। इससे संबंधित कमाए क्रेडिट कट जाते हैं।",
        approve: "मंज़ूर करें",
        reject: "अस्वीकार करें",
        complete: "पूरा करें",
        overBalanceSingle:
          "यह रिक्वेस्ट {{amount}} की है, लेकिन सिर्फ़ {{available}} कन्फ़र्म और अनपेड है। इसे मंज़ूर न करें।",
        partnerNoCodes: "अपना कोई कोड नहीं · रेफ़र किए यूज़र्स: {{referred}}",
        overBalance:
          "{{count}} खुली रिक्वेस्ट का कुल {{open}} है, लेकिन सिर्फ़ {{available}} कन्फ़र्म और अनपेड है। सबको मंज़ूर न करें।",
        possibleDuplicate:
          "संभावित डुप्लिकेट: उसी राशि और वॉलेट की {{count}} और खुली रिक्वेस्ट।",
        overBalanceShort: "कन्फ़र्म बैलेंस से ज़्यादा (इस पार्टनर की पहली रिक्वेस्ट देखें)।",
        approveOverBalance: "फिर भी मंज़ूर करें",
        subtitle: "पार्टनर की निकासी। मंज़ूर करें, ट्रांसफ़र भेजें, फिर पूरा चिह्नित करें।",
        tabAll: "सभी",
        searchPlaceholder: "पार्टनर का ईमेल खोजें",
        flagOver: "कन्फ़र्म बैलेंस से ज़्यादा",
        flagDuplicate: "संभावित डुप्लिकेट ({{count}})",
        moreFor: "{{email}} के लिए और कार्रवाइयाँ",
        rejectEllipsis: "अस्वीकार करें…",
        freeLabel: "खुली रिक्वेस्ट के बाद फ़्री",
        earnedLabel: "कमाया",
        earnedValue: "{{confirmed}} कन्फ़र्म · {{pending}} होल्ड पर",
        paidLabel: "अब तक पेआउट हुआ",
        codesLabel: "कोड",
        codesValue: "{{codes}} · {{referred}} रेफ़र किए यूज़र्स",
        updatedLabel: "आख़िरी अपडेट",
        copy: "कॉपी करें",
        copied: "कॉपी हो गया",
        reference: "रिक्वेस्ट रेफ़रेंस",
        compactMeta: "{{method}} · {{date}}",
        showDetails: "विवरण",
        hideDetails: "विवरण छिपाएँ",
        partnerScope: "{{email}} की रिक्वेस्ट",
        showAllPartners: "सभी पार्टनर्स दिखाएँ",
        loadFailed: "पेआउट रिक्वेस्ट लोड नहीं हो सकीं",
        retry: "दोबारा कोशिश करें",
        emptyAll: "अभी तक कोई पेआउट रिक्वेस्ट नहीं",
        emptyAllHint:
          "पार्टनर अपने कमाई पेज से पेआउट माँगते हैं। नई रिक्वेस्ट रिव्यू के लिए यहाँ आती हैं।",
        showing: "{{total}} में से {{from}} से {{to}}",
        cancel: "रद्द करें",
        confirmApprove: "पेआउट मंज़ूर करें",
        confirmReject: "पेआउट अस्वीकार करें",
        confirmComplete: "पेआउट पूरा चिह्नित करें",
        col: {
          partner: "पार्टनर",
          requested: "माँगा गया",
          method: "तरीका",
          status: "स्टेटस",
          amount: "राशि",
          actions: "कार्रवाइयाँ",
        },
        nextStep: {
          failed:
            "ट्रांसफ़र पूरा नहीं हो सका और कोई क्रेडिट नहीं कटा। पार्टनर नई रिक्वेस्ट भेज सकता है।",
          processing:
            "ट्रांसफ़र जारी है। यह अपने आप पूरा होगा या विफल होगा। आपको कुछ करने की ज़रूरत नहीं।",
          credits:
            "क्रेडिट पेआउट रिक्वेस्ट करते ही कन्वर्ट हो जाते हैं, इसलिए पेंडिंग वाला अटका हुआ है। कमाई छोड़ने के लिए उसे अस्वीकार करें। पार्टनर दोबारा रिक्वेस्ट कर सकता है।",
        },
        prepareBill: "सप्लायर बिल तैयार करें",
        codeReport: "कोड रिपोर्ट",
      },
    },
  },

  payout: {
    get: {
      title: "आपकी कमाई",
      titleShort: "मेरी कमाई",
      description: "अपनी रेफ़रल कमाई और पेआउट हिस्ट्री देखें",
    },
    post: {
      title: "पेआउट रिक्वेस्ट करें",
      titleShort: "पेआउट रिक्वेस्ट करें",
      description: "अपनी रेफ़रल कमाई निकालें",
    },
    fields: {
      amountCents: {
        label: "राशि (क्रेडिट)",
        description: "निकालने के लिए क्रेडिट में राशि",
        placeholder: "जैसे 5000",
      },
      currency: {
        label: "पेआउट का तरीका",
        description: "आप अपनी कमाई कैसे पाना चाहते हैं",
      },
      walletAddress: {
        label: "वॉलेट एड्रेस",
        description: "BTC या USDC पेआउट के लिए ज़रूरी",
        placeholder: "आपका वॉलेट एड्रेस",
      },
    },
    widget: {
      totalEarned: "कुल कमाई",
      available: "उपलब्ध",
      locked: "लॉक्ड",
      credits: "क्रेडिट",
      readyForPayout: "पेआउट के लिए तैयार",
      moreToUnlock: "और अनलॉक होने बाकी",
      pendingConfirmation: "कन्फ़र्मेशन पेंडिंग",
      requestPayout: "पेआउट रिक्वेस्ट करें",
      payoutHistory: "पेआउट हिस्ट्री",
      noPayout: "अभी तक कोई पेआउट रिक्वेस्ट नहीं",
      howItWorksTitle: "यह कैसे काम करता है",
      step1Title: "रेफ़रल कोड बनाएँ",
      step1Body: "अलग-अलग ऑडियंस के लिए यूनिक कोड बनाएँ: दोस्त, सोशल मीडिया या कैंपेन।",
      step2Title: "अपना लिंक शेयर करें, या स्किल का लिंक",
      step2Body:
        "रेफ़रल लिंक: उस यूज़र के हर पेमेंट का {{directPct}}, हमेशा। दूसरों के शेयर किए आपके स्किल पर: उन यूज़र्स के हर पेमेंट का {{skillBonusPct}}। यानी उन लिंक से भी कमाई जो आपने कभी पोस्ट ही नहीं किए।",
      step3Title: "पैसे पाएँ",
      step3Body:
        "हर पेमेंट के {{holdDays}} दिन बाद कमाई अनलॉक होती है, यही रिफ़ंड विंडो है। फिर उसे चैट क्रेडिट की तरह इस्तेमाल करें या क्रिप्टो में निकालें।",
      withdrawTitle: "अपनी कमाई निकालें",
      withdrawDescription: "रेफ़रल कमाई इस्तेमाल करने के कई तरीके",
      useAsCredits: "चैट क्रेडिट की तरह इस्तेमाल करें",
      useAsCreditsDesc: "कमाई को तुरंत AI बातचीत के चैट क्रेडिट में बदलें।",
      cryptoPayout: "क्रिप्टो में निकालें",
      cryptoPayoutDesc: "अपने वॉलेट एड्रेस पर BTC या USDC में पेआउट माँगें।",
      minimumNote:
        "न्यूनतम पेआउट: {{minPayout}}। क्रिप्टो पेआउट मंज़ूरी के बाद {{cryptoPayoutHours}} घंटे के अंदर प्रोसेस होते हैं।",
      progressLabel: "पेआउट तक की प्रगति",
      unlockedOf: "अनलॉक हुए, कुल",
      viewHistory: "हिस्ट्री देखें",
      historyEmpty: "आपके पेआउट यहाँ दिखेंगे",
      pendingTitle: "{{amount}} पेंडिंग",
      pendingNote:
        "हर पेमेंट के {{holdDays}} दिन बाद अनलॉक होता है, यही रिफ़ंड विंडो है। रिफ़ंड हुए पेमेंट की कमाई रद्द हो जाती है।",
    },
    email: {
      user: {
        subjectCrypto: "पेआउट रिक्वेस्ट मिल गई",
        subjectCredits: "क्रेडिट कन्वर्ट हो गए",
        titleCrypto: "आपकी पेआउट रिक्वेस्ट",
        titleCredits: "क्रेडिट कन्वर्ट हो गए",
        previewCrypto: "आपकी पेआउट रिक्वेस्ट प्रोसेस हो रही है",
        previewCredits: "आपके क्रेडिट कन्वर्ट हो गए हैं",
        bodyCrypto:
          "हमें आपकी पेआउट रिक्वेस्ट मिल गई है। क्रिप्टो पेआउट एडमिन की मंज़ूरी के बाद {{cryptoPayoutHours}} घंटे के अंदर प्रोसेस होते हैं।",
        bodyCredits: "आपकी रेफ़रल कमाई तुरंत चैट क्रेडिट में बदलकर आपके अकाउंट में जुड़ गई है।",
        followUpCrypto: "पेआउट प्रोसेस होने पर आपको एक और ईमेल मिलेगा।",
        labelAmount: "राशि",
        labelMethod: "तरीका",
        labelWallet: "वॉलेट",
        credits: "क्रेडिट",
      },
      admin: {
        subject: "नई पेआउट रिक्वेस्ट",
        title: "नई पेआउट रिक्वेस्ट",
        preview: "पेआउट रिक्वेस्ट भेजी गई",
        body: "एक यूज़र ने पेआउट रिक्वेस्ट भेजी है।",
        footer: "कृपया एडमिन पैनल में इस रिक्वेस्ट को रिव्यू करके प्रोसेस करें।",
        labelUser: "यूज़र",
        labelAmount: "राशि",
        labelCurrency: "करेंसी",
        labelWallet: "वॉलेट",
        credits: "क्रेडिट",
      },
    },
    errors: {
      minimumAmount: "न्यूनतम पेआउट राशि {{minPayout}} है",
      walletRequired: "क्रिप्टो पेआउट के लिए वॉलेट एड्रेस ज़रूरी है",
      insufficientBalance: "पेआउट के लिए बैलेंस काफ़ी नहीं है",
      conversionFailed:
        "कन्वर्ज़न विफल रहा। आपकी कमाई जस की तस है, एक मिनट बाद फिर कोशिश करें।",
      notFound: "पेआउट रिक्वेस्ट नहीं मिली",
      invalidStatus: "इस ऑपरेशन के लिए पेआउट रिक्वेस्ट का स्टेटस ग़लत है",
    },
    success: {
      creditsConverted: "क्रेडिट कन्वर्ट हो गए",
      payoutRequested: "पेआउट रिक्वेस्ट भेज दी गई, {{hours}} घंटे के अंदर प्रोसेस होगी",
    },
  },

  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "रेफ़रल कोड के पैरामीटर ग़लत हैं",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क कनेक्शन एरर",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस प्रतिबंधित है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रेफ़रल कोड नहीं मिला",
    },
    not_found: "रेफ़रल कोड नहीं मिला",
    server: {
      title: "सर्वर एरर",
      description: "सर्वर में आंतरिक एरर हुआ",
    },
    serverError: {
      title: "सर्वर एरर",
      description: "सर्वर में आंतरिक एरर हुआ",
      detail: "हमारी तरफ़ कुछ गड़बड़ हुई: {{error}}",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "रेफ़रल कोड पहले से मौजूद है",
    },
    code_exists: "यह रेफ़रल कोड पहले से मौजूद है",
    code_expired: "यह रेफ़रल कोड एक्सपायर हो चुका है",
    code_inactive: "यह रेफ़रल कोड एक्टिव नहीं है",
    max_uses_reached: "इस रेफ़रल कोड की अधिकतम इस्तेमाल सीमा पूरी हो चुकी है",
    invalid_code: "अमान्य रेफ़रल कोड",
  },

  success: {
    title: "सफल",
    description: "ऑपरेशन सफल रहा",
    code_created: "रेफ़रल कोड बन गया",
    code_updated: "रेफ़रल कोड अपडेट हो गया",
    code_deactivated: "रेफ़रल कोड बंद हो गया",
  },

  enums: {
    sourceType: {
      subscription: "सब्सक्रिप्शन",
      creditPack: "क्रेडिट पैक",
    },
    earningStatus: {
      pending: "पेंडिंग",
      confirmed: "कन्फ़र्म हुए",
      canceled: "रद्द",
    },
    payoutCurrency: {
      usdc: "USDC",
      btc: "Bitcoin",
      credits: "क्रेडिट",
    },
    payoutStatus: {
      pending: "पेंडिंग",
      processing: "प्रोसेस हो रहा है",
      completed: "पूरा हुआ",
      failed: "विफल",
      rejected: "अस्वीकृत",
      approved: "मंज़ूर",
    },
  },
};
