import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  acquisition: {
    title: "लीड एक्विज़िशन",
    fields: { currency: "रेवेन्यू करेंसी" },
  },
  get: {
    title: "रेफ़रल डैशबोर्ड",
    titleShort: "रेफ़रल गतिविधि",
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
        currentUses: "कोड इस्तेमाल",
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
    titleShort: "पेआउट कार्रवाई",
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
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
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
    sortOrder: {
      asc: "बढ़ता क्रम",
      desc: "घटता क्रम",
    },
    payoutAction: {
      approve: "मंज़ूर करें",
      reject: "रिजेक्ट करें",
      complete: "पूरा करें",
    },
  },
};
