import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सब्सक्रिप्शन",
  tags: {
    admin: "एडमिन",
    stats: "स्टैटिस्टिक्स",
    list: "लिस्ट",
    purchases: "खरीदारी",
    referrals: "रेफ़रल",
  },
  // Stats endpoint translations
  stats: {
    get: {
      title: "सब्सक्रिप्शन स्टैटिस्टिक्स",
      description: "रेवेन्यू, सब्सक्रिप्शन, क्रेडिट और रेफ़रल मेट्रिक",
      form: {
        title: "स्टैटिस्टिक्स डैशबोर्ड",
        description: "कुल बिज़नेस मेट्रिक",
      },
      timePeriodOptions: {
        title: "समय अवधि",
        description: "समय सीमा कॉन्फ़िगर करें",
      },
      timePeriod: {
        label: "अवधि",
        description: "ग्रुपिंग अंतराल",
      },
      dateRangePreset: {
        label: "तारीख़ रेंज",
        description: "पहले से तय तारीख़ रेंज",
      },
      response: {
        revenueStats: {
          title: "रेवेन्यू",
          description: "रेवेन्यू मेट्रिक",
          mrr: { label: "MRR" },
          arr: { label: "ARR" },
          totalRevenue: { label: "कुल रेवेन्यू" },
          avgOrderValue: { label: "औसत ऑर्डर" },
        },
        subscriptionStats: {
          title: "सब्सक्रिप्शन",
          description: "सब्सक्रिप्शन की गिनती",
          activeCount: { label: "एक्टिव" },
          trialingCount: { label: "ट्रायल पर" },
          canceledCount: { label: "रद्द" },
          churnRate: { label: "चर्न रेट" },
        },
        intervalStats: {
          title: "बिलिंग अंतराल",
          description: "मासिक बनाम सालाना बँटवारा",
          monthlyCount: { label: "मासिक" },
          yearlyCount: { label: "सालाना" },
          yearlyRevenuePct: { label: "% सालाना रेवेन्यू" },
        },
        creditStats: {
          title: "क्रेडिट",
          description: "क्रेडिट पैक मेट्रिक",
          totalPurchased: { label: "खरीदे गए" },
          totalSpent: { label: "ख़र्च हुए" },
          packsSold: { label: "बिके पैक" },
          avgPackSize: { label: "औसत पैक साइज़" },
        },
        referralStats: {
          title: "रेफ़रल",
          description: "रेफ़रल प्रोग्राम मेट्रिक",
          totalReferrals: { label: "कुल रेफ़रल" },
          conversionRate: { label: "कन्वर्ज़न" },
          totalEarned: { label: "कुल कमाई" },
          pendingPayouts: { label: "पेंडिंग पेआउट" },
        },
        growthMetrics: {
          title: "ग्रोथ",
          description: "रेवेन्यू और सब्सक्रिप्शन के रुझान",
          revenueChart: {
            label: "समय के साथ रेवेन्यू",
            description: "रेवेन्यू रुझान",
          },
          subscriptionChart: {
            label: "सब्सक्रिप्शन ग्रोथ",
            description: "एक्टिव सब्सक्रिप्शन का रुझान",
          },
        },
        businessInsights: {
          title: "इनसाइट्स",
          description: "जनरेट की गई मेट्रिक",
          generatedAt: { label: "जनरेट होने का समय" },
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "स्टैटिस्टिक्स देखने के लिए लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत पैरामीटर",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एडमिन एक्सेस ज़रूरी है",
        },
        server: {
          title: "सर्वर एरर",
          description: "स्टैटिस्टिक्स जनरेट नहीं हो सके",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "अनपेक्षित एरर आया",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्ट नहीं हो सका",
        },
        notFound: {
          title: "नहीं मिला",
          description: "स्टैटिस्टिक्स उपलब्ध नहीं",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      success: { title: "सफल", description: "स्टैटिस्टिक्स जनरेट हो गए" },
    },
    widget: {
      refresh: "रीफ़्रेश करें",
      filters: "फ़िल्टर",
    },
  },
  // List endpoint translations
  list: {
    get: {
      title: "सब्सक्रिप्शन लिस्ट",
      description: "सभी सब्सक्रिप्शन देखें",
      form: {
        title: "सब्सक्रिप्शन मैनेजमेंट",
        description: "सब्सक्रिप्शन फ़िल्टर करें और देखें",
      },
      searchFilters: {
        title: "खोज और फ़िल्टर",
        description: "सब्सक्रिप्शन फ़िल्टर करें",
      },
      search: {
        label: "खोजें",
        description: "यूज़र के ईमेल या नाम से खोजें",
        placeholder: "सब्सक्रिप्शन खोजें...",
      },
      status: {
        label: "स्टेटस",
        description: "सब्सक्रिप्शन स्टेटस से फ़िल्टर करें",
        placeholder: "स्टेटस चुनें...",
      },
      interval: {
        label: "बिलिंग अंतराल",
        description: "बिलिंग अंतराल से फ़िल्टर करें",
        placeholder: "कोई भी अंतराल",
      },
      provider: {
        label: "प्रोवाइडर",
        description: "पेमेंट प्रोवाइडर से फ़िल्टर करें",
        placeholder: "कोई भी प्रोवाइडर",
      },
      dateFrom: {
        label: "से",
        description: "शुरुआती तारीख़ का फ़िल्टर",
      },
      dateTo: {
        label: "तक",
        description: "अंतिम तारीख़ का फ़िल्टर",
      },
      sortingOptions: {
        title: "क्रम",
        description: "नतीजों का क्रम कॉन्फ़िगर करें",
      },
      sortBy: {
        label: "इसके हिसाब से क्रम",
        description: "क्रम का फ़ील्ड",
        placeholder: "क्रम का फ़ील्ड चुनें...",
      },
      sortOrder: {
        label: "सॉर्ट क्रम",
        description: "क्रम की दिशा",
        placeholder: "क्रम चुनें...",
      },
      response: {
        title: "सब्सक्रिप्शन",
        description: "मेल खाते सब्सक्रिप्शन",
        subscriptions: {
          id: "ID",
          userEmail: "ईमेल",
          userName: "नाम",
          planId: "प्लान",
          billingInterval: "अंतराल",
          status: "स्टेटस",
          createdAt: "शुरू हुआ",
          currentPeriodEnd: "अवधि का अंत",
          cancelAtPeriodEnd: "अंत में रद्द करें",
          canceledAt: "रद्द करने का समय",
          cancellationReason: "रद्द करने की वजह",
          provider: "प्रोवाइडर",
          providerSubscriptionId: "प्रोवाइडर ID",
        },
        totalCount: "कुल सब्सक्रिप्शन",
        pageCount: "कुल पेज",
      },
      page: { label: "पेज" },
      limit: { label: "प्रति पेज" },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत पैरामीटर",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एडमिन एक्सेस ज़रूरी है",
        },
        server: {
          title: "सर्वर एरर",
          description: "सब्सक्रिप्शन नहीं मिल सके",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "अनपेक्षित एरर",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्ट नहीं हो सका",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कोई सब्सक्रिप्शन नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव",
        },
      },
      success: { title: "सफल", description: "सब्सक्रिप्शन मिल गए" },
    },
    widget: {
      noSubscriptions: "कोई सब्सक्रिप्शन नहीं मिला।",
      noMatchingSubscriptions: "आपके फ़िल्टर से कोई सब्सक्रिप्शन मेल नहीं खाता।",
      searchPlaceholder: "ईमेल या नाम से खोजें...",
      refresh: "रीफ़्रेश करें",
      viewStats: "स्टैटिस्टिक्स",
    },
  },
  // Purchases endpoint translations
  purchases: {
    get: {
      title: "क्रेडिट खरीद",
      description: "क्रेडिट पैक खरीद का इतिहास",
      form: {
        title: "खरीद का इतिहास",
        description: "क्रेडिट पैक की खरीद देखें",
      },
      searchFilters: {
        title: "खोज और फ़िल्टर",
        description: "खरीद फ़िल्टर करें",
      },
      search: {
        label: "खोजें",
        description: "यूज़र के ईमेल से खोजें",
        placeholder: "खरीद खोजें...",
      },
      packType: {
        label: "पैक टाइप",
        description: "क्रेडिट पैक टाइप से फ़िल्टर करें",
        placeholder: "कोई भी टाइप",
      },
      source: {
        label: "सोर्स",
        description: "खरीद के सोर्स से फ़िल्टर करें",
        placeholder: "कोई भी सोर्स",
      },
      dateFrom: {
        label: "से",
        description: "शुरुआती तारीख़ का फ़िल्टर",
      },
      dateTo: {
        label: "तक",
        description: "अंतिम तारीख़ का फ़िल्टर",
      },
      sortingOptions: {
        title: "क्रम",
        description: "नतीजों का क्रम कॉन्फ़िगर करें",
      },
      sortBy: {
        label: "इसके हिसाब से क्रम",
        description: "क्रम का फ़ील्ड",
        placeholder: "क्रम का फ़ील्ड चुनें...",
      },
      sortOrder: {
        label: "सॉर्ट क्रम",
        description: "क्रम की दिशा",
        placeholder: "क्रम चुनें...",
      },
      response: {
        title: "खरीदारी",
        description: "क्रेडिट पैक खरीद का इतिहास",
        purchases: {
          id: "ID",
          userEmail: "ईमेल",
          userName: "नाम",
          packType: "टाइप",
          source: "सोर्स",
          originalAmount: "रकम",
          remaining: "बचा हुआ",
          expiresAt: "एक्सपायर होता है",
          createdAt: "खरीदे गए",
        },
        totalCount: "कुल खरीद",
        pageCount: "कुल पेज",
      },
      page: { label: "पेज" },
      limit: { label: "प्रति पेज" },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत पैरामीटर",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एडमिन एक्सेस ज़रूरी है",
        },
        server: {
          title: "सर्वर एरर",
          description: "खरीद नहीं मिल सकी",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "अनपेक्षित एरर",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्ट नहीं हो सका",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कोई खरीद नहीं मिली",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव",
        },
      },
      success: { title: "सफल", description: "खरीद मिल गई" },
    },
    widget: {
      noPurchases: "कोई क्रेडिट पैक खरीद नहीं मिली।",
      noMatchingPurchases: "आपके फ़िल्टर से कोई खरीद मेल नहीं खाती।",
      searchPlaceholder: "ईमेल से खोजें...",
      refresh: "रीफ़्रेश करें",
      expired: "एक्सपायर हो गया",
      neverExpires: "कभी नहीं",
    },
  },
  // Referrals endpoint translations
  referrals: {
    get: {
      title: "रेफ़रल डैशबोर्ड",
      description: "रेफ़रल कोड, कमाई और पेआउट",
      form: {
        title: "रेफ़रल मैनेजमेंट",
        description: "रेफ़रल प्रोग्राम मैनेज करें",
      },
      searchFilters: {
        title: "खोज और फ़िल्टर",
        description: "रेफ़रल डेटा फ़िल्टर करें",
      },
      search: {
        label: "खोजें",
        description: "यूज़र के ईमेल से खोजें",
        placeholder: "रेफ़रल खोजें...",
      },
      payoutStatus: {
        label: "पेआउट स्टेटस",
        description: "पेआउट रिक्वेस्ट स्टेटस से फ़िल्टर करें",
        placeholder: "कोई भी स्टेटस",
      },
      dateFrom: {
        label: "से",
        description: "शुरुआती तारीख़ का फ़िल्टर",
      },
      dateTo: {
        label: "तक",
        description: "अंतिम तारीख़ का फ़िल्टर",
      },
      sortingOptions: {
        title: "क्रम",
        description: "नतीजों का क्रम कॉन्फ़िगर करें",
      },
      sortBy: {
        label: "इसके हिसाब से क्रम",
        description: "क्रम का फ़ील्ड",
        placeholder: "क्रम का फ़ील्ड चुनें...",
      },
      sortOrder: {
        label: "सॉर्ट क्रम",
        description: "क्रम की दिशा",
        placeholder: "क्रम चुनें...",
      },
      response: {
        title: "रेफ़रल",
        description: "रेफ़रल प्रोग्राम का डेटा",
        summary: {
          title: "सारांश",
          description: "कुल रेफ़रल स्टैट्स",
          totalCodes: { label: "कुल कोड" },
          totalSignups: { label: "कुल साइनअप" },
          totalEarned: { label: "कुल कमाई" },
          totalPaidOut: { label: "कुल चुकाया गया" },
          pendingPayouts: { label: "पेंडिंग पेआउट" },
        },
        codes: {
          code: "कोड",
          ownerEmail: "ओनर",
          ownerName: "नाम",
          currentUses: "क्लिक",
          totalSignups: "साइनअप",
          totalEarned: "कमाया",
          isActive: "एक्टिव",
          createdAt: "बनाया गया",
        },
        payoutRequests: {
          id: "ID",
          userEmail: "यूज़र",
          amountCents: "रकम",
          currency: "करेंसी",
          status: "स्टेटस",
          walletAddress: "वॉलेट",
          adminNotes: "नोट्स",
          rejectionReason: "रिजेक्ट करने की वजह",
          createdAt: "माँगा गया",
          processedAt: "प्रोसेस हुआ",
        },
        totalCount: "कुल",
        pageCount: "कुल पेज",
      },
      page: { label: "पेज" },
      limit: { label: "प्रति पेज" },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत पैरामीटर",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एडमिन एक्सेस ज़रूरी है",
        },
        server: {
          title: "सर्वर एरर",
          description: "रेफ़रल नहीं मिल सके",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "अनपेक्षित एरर",
        },
        conflict: { title: "टकराव", description: "डेटा टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्ट नहीं हो सका",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कोई रेफ़रल डेटा नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव",
        },
      },
      success: { title: "सफल", description: "रेफ़रल मिल गए" },
    },
    post: {
      title: "पेआउट कार्रवाई",
      description: "पेआउट रिक्वेस्ट को मंज़ूर, रिजेक्ट या पूरा करें",
      form: {
        title: "पेआउट कार्रवाई",
        description: "पेआउट रिक्वेस्ट प्रोसेस करें",
      },
      requestId: {
        label: "रिक्वेस्ट ID",
        description: "प्रोसेस करने वाली पेआउट रिक्वेस्ट",
        placeholder: "रिक्वेस्ट ID डालें...",
      },
      action: {
        label: "कार्रवाई",
        description: "की जाने वाली कार्रवाई",
        placeholder: "कार्रवाई चुनें...",
      },
      adminNotes: {
        label: "एडमिन नोट",
        description: "वैकल्पिक नोट्स",
        placeholder: "नोट जोड़ें...",
      },
      rejectionReason: {
        label: "रिजेक्ट करने की वजह",
        description: "रिजेक्ट करते समय ज़रूरी",
        placeholder: "वजह लिखें...",
      },
      response: {
        title: "नतीजा",
        description: "कार्रवाई का नतीजा",
        success: "सफल",
        message: "मैसेज",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "गलत पैरामीटर",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एडमिन एक्सेस ज़रूरी है",
        },
        server: {
          title: "सर्वर एरर",
          description: "पेआउट प्रोसेस नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "अनपेक्षित एरर",
        },
        conflict: {
          title: "टकराव",
          description: "पेआउट पहले ही प्रोसेस हो चुका है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "कनेक्ट नहीं हो सका",
        },
        notFound: {
          title: "नहीं मिला",
          description: "पेआउट रिक्वेस्ट नहीं मिली",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "बिना सेव किए बदलाव",
        },
      },
      success: { title: "सफल", description: "पेआउट प्रोसेस हो गया" },
    },
    widget: {
      noReferrals: "कोई रेफ़रल कोड नहीं मिला।",
      noPayouts: "कोई पेआउट रिक्वेस्ट नहीं।",
      approve: "मंज़ूर करें",
      reject: "रिजेक्ट करें",
      complete: "पूरा करें",
      sectionCodes: "रेफ़रल कोड",
      sectionPayouts: "पेआउट रिक्वेस्ट",
      refresh: "रीफ़्रेश करें",
      codeActive: "एक्टिव",
      codeInactive: "निष्क्रिय",
      clicks: "क्लिक",
      signups: "साइनअप",
      earned: "कमाई",
      confirm: {
        title: "पेआउट कार्रवाई की पुष्टि करें",
        description:
          "क्या आप इस पेआउट कार्रवाई को आगे बढ़ाना चाहते हैं? ये वापस नहीं हो सकती।",
        cancel: "रद्द करें",
        proceed: "आगे बढ़ें",
      },
    },
  },
  // Enum translations
  enums: {
    subscriptionStatusFilter: {
      incomplete: "अधूरा",
      incompleteExpired: "अधूरा, एक्सपायर",
      all: "सभी",
      active: "एक्टिव",
      trialing: "ट्रायल पर",
      pastDue: "बकाया",
      canceled: "रद्द",
      unpaid: "बिना चुकाया",
      paused: "रुका हुआ",
    },
    billingIntervalFilter: {
      any: "कोई भी",
      monthly: "मासिक",
      yearly: "सालाना",
    },
    providerFilter: {
      any: "कोई भी",
      stripe: "Stripe",
      nowpayments: "NowPayments",
    },
    subscriptionSortField: {
      periodEnd: "अवधि का अंत",
      createdAt: "बनाने का समय",
      status: "स्टेटस",
      interval: "अंतराल",
      userEmail: "यूज़र का ईमेल",
    },
    sortOrder: {
      asc: "बढ़ता क्रम",
      desc: "घटता क्रम",
    },
    creditPackTypeFilter: {
      any: "कोई भी",
      subscription: "सब्सक्रिप्शन",
      permanent: "स्थायी",
      bonus: "बोनस",
      earned: "कमाया",
    },
    creditPackSourceFilter: {
      any: "कोई भी",
      stripePurchase: "Stripe खरीद",
      stripeSubscription: "सब्सक्रिप्शन ग्रांट",
      adminGrant: "एडमिन ग्रांट",
      referralEarning: "रेफ़रल कमाई",
    },
    purchaseSortField: {
      createdAt: "बनाने का समय",
      amount: "रकम",
      type: "टाइप",
      userEmail: "यूज़र का ईमेल",
    },
    payoutStatusFilter: {
      all: "सभी",
      pending: "पेंडिंग",
      approved: "मंज़ूर",
      rejected: "रिजेक्ट हुआ",
      processing: "प्रोसेस हो रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
    },
    referralSortField: {
      createdAt: "बनाने का समय",
      earnings: "कुल कमाई",
      signups: "साइनअप",
    },
    payoutAction: {
      approve: "मंज़ूर करें",
      reject: "रिजेक्ट करें",
      complete: "पूरा करें",
    },
  },
};
