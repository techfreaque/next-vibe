/**
 * Hindi translations for credits endpoints
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "क्रेडिट",
  tags: {
    credits: "क्रेडिट",
    balance: "बैलेंस",
  },
  repository: {
    bonusCreditsAdded: "{{amount}} बोनस क्रेडिट जोड़े गए",
    tts: "टेक्स्ट से वॉइस",
    stt: "वॉइस से टेक्स्ट",
    search: "सर्च",
    sttHotkey: "वॉइस से टेक्स्ट (हॉटकी)",
  },
  enums: {
    freeStatus: {
      active: "फ़्री क्रेडिट चालू हैं",
      verifyEmail: "अकाउंट क्रेडिट पाने के लिए अपना ईमेल वेरिफ़ाई करें",
      subnetLimit: "इस नेटवर्क के लिए फ़्री क्रेडिट अभी रुके हुए हैं",
    },
    creditType: {
      userSubscription: "यूज़र सब्सक्रिप्शन क्रेडिट",
      leadFree: "लीड फ़्री टियर क्रेडिट",
    },
    creditFeature: {
      textToSpeech: "टेक्स्ट से वॉइस",
      speechToText: "वॉइस से टेक्स्ट",
      memoryWrite: "मेमोरी लिखना",
      memoryEdit: "मेमोरी एडिट",
      memorySearch: "मेमोरी सर्च",
      memoryEmbedding: "मेमोरी एम्बेडिंग",
    },
    transactionType: {
      purchase: "खरीद",
      subscription: "सब्सक्रिप्शन",
      usage: "इस्तेमाल",
      expiry: "एक्सपायरी",
      freeTier: "फ़्री टियर",
      monthlyReset: "मासिक रीसेट",
      freeGrant: "फ़्री ग्रांट",
      freeReset: "फ़्री रीसेट",
      refund: "रिफ़ंड",
      transfer: "ट्रांसफ़र",
      otherDevices: "दूसरे डिवाइस पर इस्तेमाल हुआ",
      referralEarning: "रेफ़रल कमाई",
      referralPayout: "रेफ़रल पेआउट",
    },
    grantReason: {
      giftCreator: "गिफ़्ट / क्रिएटर डील",
      tester: "टेस्टर क्रेडिट",
      compensation: "मुआवज़ा / रिफ़ंड",
      goodwill: "गुडविल",
      feedback: "फ़ीडबैक इनाम",
    },
    fundingType: {
      freeAllowance: "फ़्री मासिक कोटा",
      freeBonus: "साइन अप / न्यूज़लेटर बोनस",
      referral: "रेफ़रल क्रेडिट",
      purchased: "खरीदा गया पैक",
      subscription: "सब्सक्रिप्शन क्रेडिट",
      adminGrant: "एडमिन ग्रांट",
      freeUnknown: "फ़्री, टियर दर्ज नहीं",
      packUnknown: "पैक, स्रोत दर्ज नहीं",
    },
    packType: {
      subscription: "सब्सक्रिप्शन",
      permanent: "स्थायी",
      bonus: "बोनस",
      earned: "कमाए हुए",
    },
  },
  historyLabels: {
    signupCarryover: "साइन अप से पहले गेस्ट के तौर पर इस्तेमाल हुआ",
    sharedLimit: "लिंक किए गए डिवाइस एक ही मासिक लिमिट शेयर करते हैं",
    monthly: "मासिक फ़्री क्रेडिट",
    monthlyGuest: "मासिक फ़्री क्रेडिट (बिना अकाउंट)",
    monthlyAccount: "मासिक फ़्री क्रेडिट (फ़्री अकाउंट)",
    monthlyAccountNewsletter: "मासिक फ़्री क्रेडिट (अकाउंट + न्यूज़लेटर)",
    freeGuest: "फ़्री क्रेडिट (बिना अकाउंट)",
    accountUpgrade: "फ़्री अकाउंट बोनस",
    newsletterBonus: "न्यूज़लेटर बोनस",
    otherDevices: "दूसरे डिवाइस पर इस्तेमाल हुआ",
    linkedAccount: "लिंक किए गए अकाउंट ने इस्तेमाल किया",
  },
  expire: {
    post: {
      title: "क्रेडिट एक्सपायर करें",
      titleShort: "क्रेडिट एक्सपायर करें",
      description:
        "एक्सपायरी डेट निकल चुके सब्सक्रिप्शन क्रेडिट हटाता है। यह रोज़ अपने आप चलता है; मैन्युअल रन सिर्फ़ वही एक्सपायर करता है जो पहले से ड्यू है।",
      tag: "expire",
      container: {
        title: "क्रेडिट एक्सपायर करें",
        description:
          "सिर्फ़ एक्सपायरी डेट निकल चुके सब्सक्रिप्शन पैक एक्सपायर होते हैं। खरीदे गए पैक और बोनस ग्रांट वैसे ही रहते हैं।",
      },
      response: {
        expiredCount: "एक्सपायर हुए पैक",
      },
      success: {
        title: "क्रेडिट एक्सपायर हो गए",
        description: "पुराने सब्सक्रिप्शन क्रेडिट सफलतापूर्वक एक्सपायर हुए",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉग इन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "क्रेडिट एक्सपायर नहीं हो पाए",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कुछ अनपेक्षित गड़बड़ हुई",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट पैरामीटर गलत हैं",
        },
      },
    },
    task: {
      description: "पुराने सब्सक्रिप्शन क्रेडिट रोज़ एक्सपायर करता है",
      error: "क्रेडिट एक्सपायर नहीं हो पाए",
    },
  },
  cleanup: {
    task: {
      description: "हर हफ़्ते बेकार पड़े लीड वॉलेट साफ़ करता है",
      error: "बेकार पड़े वॉलेट साफ़ नहीं हो पाए",
    },
  },
  errors: {
    purchasedModel:
      "इस मॉडल के लिए खरीदे गए क्रेडिट चाहिए। {{path}} पर क्रेडिट जोड़ें या कोई फ़्री मॉडल चुनें।",
    clusterLimit:
      "शेयर किया गया फ़्री कोटा खत्म हो गया है। खरीदे गए क्रेडिट इस्तेमाल करें या अगली विंडो में फिर कोशिश करें।",
    getBalanceFailed: "क्रेडिट बैलेंस नहीं मिल पाया",
    getLeadBalanceFailed: "लीड का क्रेडिट बैलेंस नहीं मिल पाया",
    getOrCreateLeadFailed: "लीड नहीं मिली और बन भी नहीं पाई",
    addCreditsFailed: "क्रेडिट नहीं जुड़ पाए",
    deductCreditsFailed: "क्रेडिट नहीं कट पाए",
    insufficientCredits: "क्रेडिट कम हैं। इस फ़ीचर के लिए आपको {{cost}} क्रेडिट चाहिए।",
    deductionFailed: "{{cost}} क्रेडिट नहीं कट पाए। फिर से कोशिश करें।",
    getTransactionsFailed: "क्रेडिट ट्रांज़ैक्शन नहीं मिल पाए",
    invalidIdentifier: "यूज़र या लीड पहचान गलत है",
    userNotFound: "यूज़र नहीं मिला",
    noLeadFound: "इस यूज़र की कोई लीड नहीं मिली",
    getCreditIdentifierFailed: "क्रेडिट पहचान नहीं मिल पाई",
    noCreditSource: "कोई क्रेडिट स्रोत उपलब्ध नहीं",
    stripeCustomerFailed: "Stripe कस्टमर नहीं बन पाया",
    checkoutFailed: "चेकआउट सेशन नहीं बन पाया",
    mergeFailed: "लीड क्रेडिट मर्ज नहीं हो पाए",
    mergeLeadWalletsFailed: "लीड वॉलेट यूज़र अकाउंट में मर्ज नहीं हो पाए",
    cleanupOrphanedFailed: "बेकार पड़े लीड वॉलेट साफ़ नहीं हो पाए",
    monthlyResetFailed: "मासिक क्रेडिट रीसेट नहीं हो पाए",
    noLeadsToMerge: "मर्ज करने के लिए कोई लीड नहीं दी गई",
    oldestLeadNotFound: "क्लस्टर में सबसे पुरानी लीड नहीं मिली",
    transactionFailed: "ट्रांज़ैक्शन रिकॉर्ड नहीं बन पाया",
    not_implemented_on_native:
      "{{method}} नेटिव ऐप पर उपलब्ध नहीं है। यह काम वेब वर्ज़न पर करें।",
    expireCreditsFailed: "क्रेडिट एक्सपायर नहीं हो पाए",
    invalidAmount: "क्रेडिट की संख्या पॉज़िटिव होनी चाहिए",
    walletNotFound: "वॉलेट नहीं मिला",
    walletCreationFailed: "वॉलेट नहीं बन पाया",
    addEarnedCreditsFailed: "कमाए हुए क्रेडिट नहीं जुड़ पाए",
    getEarnedBalanceFailed: "कमाए हुए क्रेडिट का बैलेंस नहीं मिल पाया",
    insufficientEarnedCredits: "इस काम के लिए कमाए हुए क्रेडिट कम हैं",
    deductEarnedCreditsFailed: "कमाए हुए क्रेडिट नहीं कट पाए",
    getReferralTransactionsFailed: "रेफ़रल ट्रांज़ैक्शन नहीं मिल पाए",
  },
  get: {
    title: "क्रेडिट बैलेंस देखें",
    titleShort: "बैलेंस",
    description: "मौजूदा यूज़र का क्रेडिट बैलेंस पूरी जानकारी के साथ देखें",
    response: {
      title: "क्रेडिट बैलेंस",
      description: "आपका मौजूदा क्रेडिट बैलेंस और उसका ब्योरा",
    },
    balance: {
      subscribe: "प्लान देखें",
      freePlanHint:
        "हर महीने {{count}} फ़्री क्रेडिट, न्यूज़लेटर के साथ {{max}}। प्लान {{planPrice}} से शुरू, हर महीने {{subCredits}} क्रेडिट।",
      lowBalance: {
        title: "{{count}} क्रेडिट बचे हैं",
        emptyTitle: "आपके क्रेडिट खत्म हो गए",
        hint: "नीचे टॉप अप करें: {{packPrice}} में {{packCredits}} क्रेडिट, कभी एक्सपायर नहीं होते।",
        hintPlans: "नीचे कोई प्लान चुनें। पेमेंट होते ही क्रेडिट आ जाते हैं।",
        offersHint:
          "टॉप अप करें और कुछ ही सेकंड में वापस चैट पर। पैक क्रेडिट कभी एक्सपायर नहीं होते।",
        offersHintPlans: "प्लान चुनें और कुछ ही सेकंड में वापस चैट पर।",
      },
      freePlan: "आप फ़्री प्लान पर हैं",
      guestPlan: "गेस्ट बैलेंस",
      signUp: "फ़्री साइन अप करें",
      loadFailed: "बैलेंस लोड नहीं हुआ।",
      retry: "फिर कोशिश करें",
      title: "आपके क्रेडिट",
      adminTitle: "खर्च की लिमिट",
      description: "सभी {{modelCount}} मॉडल के लिए एक ही बैलेंस।",
      adminDescription:
        "क्रेडिट खर्च की सीमा की तरह काम करते हैं। तय करें कि सभी यूज़र कितना AI इस्तेमाल कर सकते हैं।",
      credit: "{{count}} क्रेडिट",
      credits: "{{count}} क्रेडिट",
      expiring: {
        title: "एक्सपायर होने वाले क्रेडिट",
        description: "प्लान क्रेडिट, हर बिलिंग साइकिल में रीफ़िल",
        adminDescription: "सीमित समय वाले क्रेडिट (सब्सक्रिप्शन साइकिल)",
      },
      permanent: {
        title: "स्थायी क्रेडिट",
        description: "कभी एक्सपायर नहीं होते। हमेशा आपके",
        adminDescription: "स्थायी क्रेडिट, कभी एक्सपायर नहीं होते",
      },
      free: {
        title: "फ़्री क्रेडिट",
        description: "हर महीने {{count}} फ़्री, न्यूज़लेटर के साथ {{max}}",
        descriptionGuest:
          "हर महीने {{guest}} फ़्री। साइन अप करें तो {{signedIn}}, न्यूज़लेटर के साथ {{max}}।",
        adminDescription:
          "हर पूल/महीने की फ़्री सीमा (सभी डिवाइस में शेयर): गेस्ट {{guest}}, साइन इन {{signedIn}}, साइन इन + न्यूज़लेटर {{max}}",
      },
      earned: {
        title: "कमाए हुए क्रेडिट",
        description: "रेफ़रल से कमाए। दोस्तों को बुलाने के लिए क्लिक करें",
      },
      spending: {
        title: "आपके कमाए हुए क्रेडिट",
        adminDescription: "आपकी निजी रेफ़रल कमाई (पूरे इंस्टेंस की नहीं)",
      },
    },
    total: {
      content: "कुल क्रेडिट",
    },
    expiring: {
      content: "एक्सपायर होने वाले क्रेडिट (सब्सक्रिप्शन)",
    },
    permanent: {
      content: "स्थायी क्रेडिट (पैक)",
    },
    free: {
      content: "फ़्री टियर क्रेडिट",
    },
    earned: {
      content: "कमाए हुए क्रेडिट (रेफ़रल)",
    },
    expiresAt: {
      content: "एक्सपायरी",
    },
    capacity: {
      content: "कुल क्षमता",
    },
    freeStatus: {
      content: "फ़्री क्रेडिट स्टेटस",
      subnetLimit:
        "इस महीने आपके नेटवर्क से बहुत सारे नए फ़्री अकाउंट बने, इसलिए फ़िलहाल इस अकाउंट को फ़्री क्रेडिट नहीं मिलेंगे। क्रेडिट खरीदने पर ये खुल जाते हैं, या अगले महीने नेटवर्क में जगह होने पर शुरू हो जाएँगे।",
    },
    success: {
      title: "बैलेंस मिल गया",
      description: "क्रेडिट बैलेंस सफलतापूर्वक लोड हुआ",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क कनेक्शन नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "क्रेडिट बैलेंस देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको यह देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "क्रेडिट बैलेंस लोड नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कुछ अनपेक्षित गड़बड़ हुई",
      },
      noActiveSubscription: {
        title: "एक्टिव सब्सक्रिप्शन ज़रूरी",
        description: "क्रेडिट पैक खरीदने के लिए एक्टिव सब्सक्रिप्शन चाहिए",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "रिसोर्स में टकराव हुआ",
      },
      no_active_subscription: {
        title: "एक्टिव सब्सक्रिप्शन ज़रूरी",
        description: "क्रेडिट पैक खरीदने के लिए एक्टिव सब्सक्रिप्शन चाहिए",
      },
    },
  },
  history: {
    get: {
      packId: "क्रेडिट पैक",
      showFilters: "फ़िल्टर दिखाएँ",
      hideFilters: "फ़िल्टर छिपाएँ",
      guestGrantsHidden: "गेस्ट फ़्री ग्रांट छिपे हुए हैं",
      recent: "हाल की गतिविधि",
      payment: "पेमेंट",
      recentTitle: "लेजर की हाल की गतिविधि",
      guestDevice: "गेस्ट डिवाइस",
      kindAccount: "अकाउंट",
      kindLead: "लीड, बिना अकाउंट",
      openPayment: "पेमेंट खोलें",
      currentBalance: "मौजूदा बैलेंस",
      currentBalanceHint: "पैक में {{paid}} · फ़्री {{free}}",
      showingRange: "{{total}} में से {{from}} से {{to}}",
      from: "से",
      to: "तक",
      totals: "कुल",
      allTypes: "सभी प्रकार",
      filteredBy: "फ़िल्टर",
      clearFilters: "सब हटाएँ",
      removeFilter: "फ़िल्टर हटाएँ",
      spent: "खर्च हुए क्रेडिट",
      granted: "मिले क्रेडिट",
      entries: "एंट्री",
      periodHint: "फ़िल्टर की गई अवधि में",
      emptyFiltered: "इन फ़िल्टर से कोई एंट्री मेल नहीं खाती।",
      typeFilter: {
        label: "प्रकार",
      },
      target: {
        label: "कस्टमर",
        description: "अकाउंट ईमेल, यूज़र ID या लीड ID",
        placeholder: "customer@example.com या कोई ID",
      },
      resolvedTarget: "लेजर:",
      detail: "मॉडल या फ़ीचर",
      targetNotFound: "{{target}} से कोई अकाउंट या लीड मेल नहीं खाती।",
      lookupTitle: "कस्टमर लेजर",
      lookupHint:
        "ईमेल, यूज़र ID या लीड ID से कोई अकाउंट या लीड खोजें और हर आने-जाने वाला क्रेडिट देखें।",
      openLedger: "लेजर खोलें",
      changeTarget: "कोई दूसरा खोजें",
      colDate: "तारीख",
      colType: "प्रकार",
      colDetail: "मॉडल या फ़ीचर",
      colAmount: "राशि",
      colBalance: "बाद का बैलेंस",
      showing: "{{who}} का लेजर",
      bonusGrant: "बोनस क्रेडिट ग्रांट",
      relatedRecords: "जुड़े रिकॉर्ड",
      account: "कस्टमर",
      lead: "लीड",
      openAccount: "कस्टमर खोलें",
      openLead: "लीड खोलें",
      openPayouts: "पार्टनर पेआउट देखें",
      loading: "क्रेडिट हिस्ट्री लोड हो रही है…",
      delta: "{{amount}} क्रेडिट",
      entryBalance: "एंट्री के बाद बैलेंस: {{count}} क्रेडिट",
      emptyHint: "हर आने-जाने वाला क्रेडिट यहाँ दिखेगा।",
      title: "क्रेडिट हिस्ट्री देखें",
      titleShort: "क्रेडिट हिस्ट्री",
      description: "पेज के हिसाब से क्रेडिट ट्रांज़ैक्शन हिस्ट्री देखें",
      container: {
        title: "क्रेडिट हिस्ट्री",
        description: "अपनी क्रेडिट ट्रांज़ैक्शन हिस्ट्री देखें",
      },
      emptyState: "अभी कोई ट्रांज़ैक्शन नहीं",
      balance: "बाद का बैलेंस: {{count}}",
      limit: {
        label: "लिमिट",
        description: "ज़्यादा से ज़्यादा कितने ट्रांज़ैक्शन दिखाएँ (1-100)",
      },
      offset: {
        label: "ऑफ़सेट",
        description: "पेजिनेशन के लिए कितने ट्रांज़ैक्शन छोड़ें",
      },
      targetUserId: {
        label: "टारगेट यूज़र ID",
      },
      targetLeadId: {
        label: "टारगेट लीड ID",
      },
      id: "ट्रांज़ैक्शन ID",
      amount: "राशि",
      type: "प्रकार",
      modelId: "मॉडल",
      messageId: "मैसेज ID",
      createdAt: "तारीख",
      transactions: {
        title: "ट्रांज़ैक्शन",
        description: "क्रेडिट ट्रांज़ैक्शन की सूची",
      },
      paginationInfo: {
        total: "कुल ट्रांज़ैक्शन",
        totalPages: "कुल पेज",
      },
      totalCount: {
        content: "कुल संख्या",
      },
      transaction: {
        id: {
          content: "ट्रांज़ैक्शन ID",
        },
        amount: {
          content: "राशि",
        },
        balanceAfter: {
          content: "बाद का बैलेंस",
        },
        type: {
          content: "प्रकार",
        },
        modelId: {
          content: "मॉडल",
        },
        messageId: {
          content: "मैसेज ID",
        },
        createdAt: {
          content: "तारीख",
        },
      },
      success: {
        title: "हिस्ट्री मिल गई",
        description: "क्रेडिट हिस्ट्री सफलतापूर्वक लोड हुई",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट पैरामीटर गलत हैं",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क कनेक्शन नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "क्रेडिट हिस्ट्री देखने के लिए लॉग इन करें",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपको यह देखने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "क्रेडिट हिस्ट्री लोड नहीं हो पाई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कुछ अनपेक्षित गड़बड़ हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "रिसोर्स में टकराव हुआ",
        },
      },
    },
  },
  purchase: {
    post: {
      title: "क्रेडिट खरीदें",
      description: "क्रेडिट पैक खरीदने के लिए Stripe चेकआउट सेशन बनाएँ",
      container: {
        title: "क्रेडिट खरीदें",
        description: "AI फ़ीचर इस्तेमाल करने के लिए क्रेडिट पैक खरीदें",
      },
      quantity: {
        label: "संख्या",
        description: "कितने क्रेडिट पैक खरीदने हैं (1-10)",
        placeholder: "संख्या लिखें (1-10)",
      },
      provider: {
        label: "पेमेंट प्रोवाइडर",
        description: "चुनें कि आप कैसे पेमेंट करना चाहते हैं",
        placeholder: "पेमेंट प्रोवाइडर चुनें",
      },
      checkoutUrl: {
        content: "चेकआउट URL",
      },
      sessionId: {
        content: "सेशन ID",
      },
      totalAmount: {
        content: "कुल राशि (सेंट में)",
      },
      totalCredits: {
        content: "कुल क्रेडिट",
      },
      success: {
        title: "चेकआउट तैयार",
        description: "Stripe चेकआउट सेशन सफलतापूर्वक बना",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "खरीद की संख्या गलत है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क कनेक्शन नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "क्रेडिट खरीदने के लिए लॉग इन करें",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपको क्रेडिट खरीदने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "चेकआउट सेशन नहीं बन पाया",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कुछ अनपेक्षित गड़बड़ हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "रिसोर्स में टकराव हुआ",
        },
        noActiveSubscription: {
          title: "एक्टिव सब्सक्रिप्शन ज़रूरी",
          description: "क्रेडिट पैक खरीदने के लिए एक्टिव सब्सक्रिप्शन चाहिए",
        },
      },
    },
  },
  adminAdd: {
    recipient: {
      details: "प्राप्तकर्ता की जानकारी",
      lookup: "अकाउंट ईमेल या ID",
      lookupDescription: "अकाउंट का सही ईमेल पता या यूज़र ID डालें।",
      renewsOn: "{{date}} को रिन्यू",
      endsOn: "{{date}} को खत्म",
      packBalance: "पैक में क्रेडिट",
      freeBalance: "फ़्री क्रेडिट",
      balanceSplit: "कुल {{total}} · पैक में {{paid}} · फ़्री {{free}}",
      stepHint: "स्टेप 1: पक्का करें कि क्रेडिट किसे मिलेंगे। स्टेप 2: राशि चुनें।",
      verified: "वेरिफ़ाइड प्राप्तकर्ता",
      kind: "प्राप्तकर्ता का प्रकार",
      kindAccount: "अकाउंट · लिंक किए गए डिवाइस: {{count}}",
      subscription: "सब्सक्रिप्शन",
      noSubscription: "कोई सब्सक्रिप्शन नहीं",
      linkedDevices: "लिंक किए गए डिवाइस",
      recentGrants: "हाल के बोनस ग्रांट",
      noGrants: "अभी कोई बोनस ग्रांट नहीं",
      grantLine: "{{date}} को {{count}} क्रेडिट",
      nextStep: "अगला: इस अकाउंट को क्रेडिट दें",
      grant: "क्रेडिट दें",
      openLedger: "लेजर खोलें",
      name: "नाम",
      balance: "मौजूदा बैलेंस",
      joinedAt: "जुड़े",
      noName: "कोई नाम सेट नहीं",
      credits: "{{count}} क्रेडिट",
      balanceLine: "बैलेंस {{count}} क्रेडिट",
      joinedLine: "{{date}} को जुड़े",
      title: "ग्रांट प्राप्तकर्ता वेरिफ़ाई करें",
      description: "वह अकाउंट खोजें जिसे बोनस क्रेडिट मिल सकते हैं।",
      accountId: "अकाउंट ID",
      email: "प्राप्तकर्ता का ईमेल",
      noLinkedDevice: "इस अकाउंट से कोई डिवाइस लिंक नहीं है।",
      loadFailed: "प्राप्तकर्ता वेरिफ़ाई नहीं हो पाया।",
      loading: "प्राप्तकर्ता वेरिफ़ाई हो रहा है…",
      retry: "फिर कोशिश करें",
      openAccount: "कस्टमर खोलें",
      change: "दूसरा प्राप्तकर्ता चुनें",
      verify: "वेरिफ़ाई करें",
    },
    post: {
      stepTwo: "स्टेप 2 / 2: राशि",
      testerPreset: "{{amount}} क्रेडिट इस्तेमाल करें",
      preview: "बैलेंस {{before}} → {{after}} (+{{amount}})",
      title: "क्रेडिट जोड़ें",
      titleShort: "क्रेडिट जोड़ें",
      description: "किसी यूज़र अकाउंट में क्रेडिट पैक जोड़ें (सिर्फ़ एडमिन)",
      tag: "admin",
      container: {
        title: "बोनस क्रेडिट दें",
        description: "प्राप्तकर्ता चुनें और उनके वॉलेट में देने की सही राशि डालें।",
        selfTitle: "अपने अकाउंट में क्रेडिट जोड़ें",
        selfDescription: "खुद को बोनस क्रेडिट दें",
      },
      targetUserId: {
        label: "प्राप्तकर्ता",
        description: "अकाउंट डायरेक्टरी से कोई कस्टमर चुनें।",
      },
      amount: {
        label: "क्रेडिट में राशि",
        description: "कम से कम 1 क्रेडिट डालें। सिर्फ़ पूरे नंबर।",
        placeholder: "जैसे 25",
      },
      reason: {
        label: "कारण",
        description:
          "ये क्रेडिट क्यों दिए जा रहे हैं। रिपोर्ट इसी से रिफ़ंड और मुआवज़े को गिफ़्ट से अलग करती हैं।",
      },
      packType: {
        label: "पैक का प्रकार",
        description: "जोड़े जाने वाले क्रेडिट पैक का प्रकार",
      },
      response: {
        message: {
          content: "नतीजा",
        },
      },
      backButton: {
        label: "वापस",
      },
      submitButton: {
        label: "बोनस क्रेडिट दें",
        loadingText: "क्रेडिट दिए जा रहे हैं…",
      },
      success: {
        title: "क्रेडिट जुड़ गए",
        description: "यूज़र अकाउंट में क्रेडिट जोड़ दिए गए",
      },
      errors: {
        validation: {
          title: "फ़ॉर्म जाँचें",
          description: "रिक्वेस्ट पैरामीटर गलत हैं",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क कनेक्शन नहीं हो पाया",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉग इन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एडमिन एक्सेस ज़रूरी है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "यूज़र नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "क्रेडिट नहीं जुड़ पाए",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कुछ अनपेक्षित गड़बड़ हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "रिसोर्स में टकराव हुआ",
        },
      },
    },
  },
  email: {
    creditPack: {
      user: {
        subject: "आपका {{appName}} क्रेडिट पैक तैयार है",
        title: "आपके अकाउंट में क्रेडिट जुड़ गए",
        previewText: "आपके अकाउंट में {{credits}} क्रेडिट जुड़ गए हैं",
        greeting: "नमस्ते {{privateName}},",
        body: "आपकी क्रेडिट पैक खरीद सफल रही। आपके अकाउंट में {{credits}} स्थायी क्रेडिट जुड़ गए हैं और इस्तेमाल के लिए तैयार हैं।",
        cta: "अपने क्रेडिट इस्तेमाल करें",
        signoff: "खरीदने के लिए शुक्रिया!\n\n{{appName}} टीम",
      },
      admin: {
        subject: "[{{appName}}] क्रेडिट पैक खरीदा गया: {{credits}} क्रेडिट",
        title: "क्रेडिट पैक खरीद",
        preview: "एक यूज़र ने क्रेडिट पैक खरीदा",
        body: "एक यूज़र ने क्रेडिट पैक खरीदा है।",
        labelUser: "यूज़र",
        labelCredits: "क्रेडिट",
        footer: "{{appName}} की ऑटोमैटिक सूचना",
      },
    },
  },
};
