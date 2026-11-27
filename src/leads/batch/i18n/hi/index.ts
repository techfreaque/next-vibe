import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "लीड",
  tags: {
    leads: "लीड",
    batch: "बैच",
  },

  patch: {
    title: "बैच अपडेट",
    titleShort: "बैच अपडेट",
    description: "फ़िल्टर के आधार पर लीड्स का बैच अपडेट करें",
    form: {
      title: "बैच अपडेट कॉन्फ़िगरेशन",
      description: "बैच अपडेट के पैरामीटर सेट करें",
    },
    search: {
      label: "खोजें",
      description: "ईमेल या बिज़नेस नाम से लीड्स खोजें",
      placeholder: "ईमेल या बिज़नेस नाम लिखें",
    },
    status: {
      label: "स्थिति फ़िल्टर",
      description: "मौजूदा स्टेटस से लीड्स फ़िल्टर करें",
    },
    currentCampaignStage: {
      label: "कैंपेन स्टेज फ़िल्टर",
      description: "मौजूदा कैंपेन स्टेज से लीड्स फ़िल्टर करें",
    },
    source: {
      label: "सोर्स फ़िल्टर",
      description: "सोर्स से लीड्स फ़िल्टर करें",
    },
    scope: {
      label: "ऑपरेशन का स्कोप",
      description: "बैच ऑपरेशन का दायरा तय करें",
    },
    dryRun: {
      label: "ड्राई रन",
      description: "बदलाव लागू किए बिना उनका प्रीव्यू देखें",
    },
    maxRecords: {
      label: "अधिकतम रिकॉर्ड",
      description: "प्रोसेस करने के लिए रिकॉर्ड की अधिकतम संख्या",
    },
    updates: {
      title: "अपडेट के फ़ील्ड",
      description: "बताएँ कि कौन से फ़ील्ड अपडेट करने हैं",
      status: {
        label: "नई स्थिति",
        description: "लीड का स्टेटस इस वैल्यू पर अपडेट करें",
      },
      currentCampaignStage: {
        label: "नया कैंपेन स्टेज",
        description: "कैंपेन स्टेज इस वैल्यू पर अपडेट करें",
      },
      source: {
        label: "नया सोर्स",
        description: "लीड का सोर्स इस वैल्यू पर अपडेट करें",
      },
      notes: {
        label: "नोट्स",
        description: "लीड के लिए नोट्स जोड़ें या अपडेट करें",
      },
    },
    response: {
      title: "अपडेट रिस्पॉन्स",
      description: "बैच अपडेट का रिस्पॉन्स डेटा",
      success: "सफल",
      totalMatched: "कुल मैच",
      totalProcessed: "कुल प्रोसेस हुए",
      totalUpdated: "कुल अपडेट",
      preview: "प्रीव्यू",
      errors: "एरर",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "बैच ऑपरेशन के लिए लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "बैच अपडेट के रिक्वेस्ट पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "बैच अपडेट के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "बैच अपडेट के दौरान अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "बैच अपडेट के दौरान नेटवर्क एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "बैच ऑपरेशन के लिए एक्सेस की अनुमति नहीं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "बैच अपडेट के लिए रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "बैच अपडेट के दौरान डेटा कॉन्फ़्लिक्ट हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बैच अपडेट में बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "अपडेट सफल",
      description: "बैच अपडेट ऑपरेशन पूरा हुआ",
    },
  },
  delete: {
    title: "बैच डिलीट",
    titleShort: "बैच डिलीट",
    description: "फ़िल्टर के आधार पर लीड्स का बैच डिलीट करें",
    form: {
      title: "बैच डिलीट कॉन्फ़िगरेशन",
      description: "बैच डिलीट के पैरामीटर सेट करें",
    },
    search: {
      label: "खोजें",
      description: "ईमेल या बिज़नेस नाम से लीड्स खोजें",
    },
    status: {
      label: "स्थिति फ़िल्टर",
      description: "मौजूदा स्टेटस से लीड्स फ़िल्टर करें",
    },
    confirmDelete: {
      label: "डिलीट की पुष्टि करें",
      description: "पुष्टि करें कि आप चुनी हुई लीड्स डिलीट करना चाहते हैं",
    },
    dryRun: {
      label: "ड्राई रन",
      description: "रिकॉर्ड हटाए बिना डिलीशन का प्रीव्यू देखें",
    },
    maxRecords: {
      label: "अधिकतम रिकॉर्ड",
      description: "डिलीट करने के लिए रिकॉर्ड की अधिकतम संख्या",
    },
    response: {
      title: "हटाने का रिस्पॉन्स",
      description: "बैच डिलीट का रिस्पॉन्स डेटा",
      success: "सफल",
      totalMatched: "कुल मैच",
      totalProcessed: "कुल प्रोसेस हुए",
      totalDeleted: "कुल डिलीट",
      preview: "प्रीव्यू",
      errors: "एरर",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "बैच डिलीट ऑपरेशन के लिए लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "बैच डिलीट के रिक्वेस्ट पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "बैच डिलीट के दौरान इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "बैच डिलीट के दौरान अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "बैच डिलीट के दौरान नेटवर्क एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "बैच डिलीट ऑपरेशन के लिए एक्सेस की अनुमति नहीं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "बैच डिलीट के लिए रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "बैच डिलीट के दौरान डेटा कॉन्फ़्लिक्ट हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बैच डिलीट में बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "डिलीट सफल",
      description: "बैच डिलीट ऑपरेशन पूरा हुआ",
    },
  },
  widget: {
    update: {
      headerTitle: "बैच लीड्स अपडेट",
      emptyStateTitle: "बैच लीड्स अपडेट",
      emptyStateDescription:
        "फ़िल्टर के आधार पर कई लीड्स में एक साथ फ़ील्ड अपडेट लागू करें। बदलाव पक्के करने से पहले यह देखने के लिए कि कौन सी लीड्स प्रभावित होंगी,",
      emptyStateDescriptionStrong: "ड्राई रन",
      emptyStateDescriptionSuffix: "इस्तेमाल करें।",
      emptyStateTip1: "फ़िल्टर सेट करें और पहले ड्राई-रन प्रीव्यू के लिए सबमिट करें",
      emptyStateTip2: "बदलाव असल में लागू करने के लिए ड्राई रन का निशान हटाएँ",
      highVolumeTitle: "बड़ा बैच: {{count}} लीड्स मैच हुईं",
      highVolumeDescription:
        "इससे बहुत सारे रिकॉर्ड प्रभावित होंगे। ड्राई रन बंद करके असल में सबमिट करने से पहले प्रीव्यू ध्यान से देखें।",
      partialBatchTitle: "बैच अधूरा प्रोसेस हुआ",
      partialBatchDescription:
        "मैच हुई {{matched}} लीड्स में से {{processed}} प्रोसेस हुईं। और प्रोसेस करने के लिए अधिकतम रिकॉर्ड बढ़ाएँ या दोबारा चलाएँ।",
      successTitle: "बैच ऑपरेशन पूरा हुआ",
      failureTitle: "बैच ऑपरेशन फ़ेल हुआ",
      statMatched: "मिलान हुआ",
      statProcessed: "प्रोसेस हुआ",
      statUpdated: "अपडेट किया गया",
      btnRunAgain: "दोबारा चलाएँ",
      btnViewAllAffected: "प्रभावित सभी लीड्स देखें",
      btnViewInList: "लिस्ट में देखें",
      dryRunPreviewTitle: "ड्राई रन प्रीव्यू ({{count}} लीड्स प्रभावित होंगी)",
      leadFallback: "लीड {{number}}",
      errorsTitle: "{{count}} एरर",
      errorRow: "लीड {{leadId}}: {{error}}",
      sectionFilter: "फ़िल्टर शर्तें",
      sectionUpdates: "अपडेट के फ़ील्ड",
      sectionSettings: "ऑपरेशन सेटिंग्स",
      activeFiltersLabel: "लिस्ट के एक्टिव फ़िल्टर (पहले से भरे)",
      filterSearch: "खोजें",
      submitButton: "अपडेट लागू करें",
      submitButtonLoading: "लागू हो रहा है...",
    },
    delete: {
      headerTitle: "बैच लीड्स डिलीट",
      warningTitle: "चेतावनी: {{count}} लीड हमेशा के लिए डिलीट होगी",
      warningTitlePlural: "चेतावनी: {{count}} लीड्स हमेशा के लिए डिलीट होंगी",
      warningDescription:
        "यह कार्रवाई वापस नहीं हो सकती। मैच हुई लीड्स का सारा डेटा हमेशा के लिए हट जाएगा। आगे बढ़ने के लिए ड्राई रन बंद करें और पुष्टि करें।",
      successTitle: "डिलीशन पूरा हुआ",
      failureTitle: "डिलीशन फ़ेल हुआ",
      statMatched: "मिलान हुआ",
      statDeleted: "हटा दिया गया",
      btnRunAgain: "दोबारा चलाएँ",
      btnViewRemainingLeads: "बची हुई लीड्स देखें",
      previewTitle: "{{count}} लीड्स हमेशा के लिए डिलीट होंगी",
      leadFallback: "लीड {{number}}",
      errorRow: "लीड {{leadId}}: {{error}}",
      sectionFilter: "फ़िल्टर शर्तें",
      sectionSettings: "डिलीट सेटिंग्स",
      activeFiltersLabel: "लिस्ट के एक्टिव फ़िल्टर (पहले से भरे)",
      filterSearch: "खोजें",
      submitButton: "लीड्स डिलीट करें",
      submitButtonLoading: "हटाया जा रहा है...",
    },
  },
  enums: {
    batchOperationScope: {
      currentPage: "मौजूदा पेज",
      allPages: "सभी पेज",
    },
    leadStatus: {
      new: "नया",
      pending: "पेंडिंग",
      campaignRunning: "कैंपेन चल रहा है",
      websiteUser: "वेबसाइट यूज़र",
      newsletterSubscriber: "न्यूज़लेटर सब्सक्राइबर",
      inContact: "संपर्क में",
      signedUp: "साइन अप किया",
      subscriptionConfirmed: "सब्सक्रिप्शन पक्का",
      unsubscribed: "अनसब्सक्राइब हुए",
      bounced: "बाउंस हुए",
      invalid: "अमान्य",
    },
    emailCampaignStage: {
      notStarted: "शुरू नहीं हुआ",
      initial: "पहला संपर्क",
      followup1: "फ़ॉलो-अप 1",
      followup2: "फ़ॉलो-अप 2",
      followup3: "फ़ॉलो-अप 3",
      nurture: "नर्चर",
      reactivation: "रीएक्टिवेशन",
    },
    leadSource: {
      website: "वेबसाइट",
      socialMedia: "सोशल मीडिया",
      emailCampaign: "ईमेल कैंपेन",
      referral: "रेफ़रल",
      csvImport: "CSV इम्पोर्ट",
    },
  },
  email: {
    admin: {
      batchUpdate: {
        title: "बैच अपडेट पूरा हुआ",
        subject: "बैच अपडेट के नतीजे",
        preview: "{{totalProcessed}} लीड्स प्रोसेस हुईं",
        message: "बैच अपडेट ऑपरेशन पूरा हुआ, {{totalProcessed}} लीड्स प्रोसेस हुईं।",
        operationSummary: "ऑपरेशन का सारांश",
        totalMatched: "कुल मैच",
        totalProcessed: "कुल प्रोसेस हुए",
        totalUpdated: "कुल अपडेट",
        errors: "एरर",
        dryRunNote: "यह ड्राई रन था, कोई असली बदलाव नहीं हुआ।",
        viewLeads: "अपडेट हुई लीड्स देखें",
        error: {
          noData: "बैच अपडेट का कोई डेटा नहीं है",
        },
      },
      batchDelete: {
        title: "बैच डिलीट पूरा हुआ",
        subject: "बैच डिलीट के नतीजे",
        preview: "डिलीशन के लिए {{totalProcessed}} लीड्स प्रोसेस हुईं",
        message: "बैच डिलीट ऑपरेशन पूरा हुआ, {{totalProcessed}} लीड्स प्रोसेस हुईं।",
        operationSummary: "ऑपरेशन का सारांश",
        totalMatched: "कुल मैच",
        totalProcessed: "कुल प्रोसेस हुए",
        totalDeleted: "कुल डिलीट",
        errors: "एरर",
        dryRunNote: "यह ड्राई रन था, कोई असली डिलीशन नहीं हुआ।",
        viewLeads: "लीड देखें",
        error: {
          noData: "बैच डिलीट का कोई डेटा नहीं है",
        },
      },
    },
    error: {
      general: {
        internal_server_error: "इंटरनल सर्वर एरर आया",
      },
    },
  },
};
