import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "लीड",
  tags: {
    leads: "लीड",
    batch: "बैच",
    campaigns: "कैंपेन",
    management: "मैनेजमेंट",
    create: "बनाएँ",
    search: "खोजें",
    export: "एक्सपोर्ट",
    import: "Import",
    csv: "CSV",
    jobs: "जॉब्स",
    list: "लिस्ट",
  },
  admin: {
    title: "लीड्स मैनेजमेंट",
    tabs: {
      overview: "लीड्स नेविगेशन",
      stats: "ओवरव्यू",
      stats_description: "लीड आँकड़े और एनालिटिक्स देखें",
      leads: "लीड",
      leads_description: "सभी लीड्स देखें और मैनेज करें",
      emails: "ईमेल कैंपेन",
      emails_description: "ईमेल कैंपेन और टेम्पलेट मैनेज करें",
      abTesting: "A/B टेस्टिंग",
      abTesting_description: "A/B टेस्टिंग के वेरिएंट सेट करें",
      campaignStarter: "कैंपेन स्टार्टर",
      campaignStarter_description: "लीड कैंपेन सेट करें और शुरू करें",
    },
    import: {
      label: "इम्पोर्ट करें",
      description: "CSV फ़ाइलों से लीड्स इम्पोर्ट करें",
    },
    emails: {
      preview: {
        error: "ईमेल प्रीव्यू नहीं बन पाया",
        live: "लाइव प्रीव्यू",
        actions: {
          title: "ईमेल प्रीव्यू",
          description: "देखें कि ईमेल पाने वालों को कैसा दिखेगा",
        },
      },
      preview_title: "ईमेल प्रीव्यू",
      testEmail: {
        button: "टेस्ट ईमेल भेजें",
      },
      from: "से",
      recipient: "प्राप्तकर्ता",
      subject: "विषय",
      email_preview: "ईमेल प्रीव्यू",
      stage_of: "में से",
      stages: "स्टेज",
      journey: "जर्नी",
      back: "वापस",
      previous: "पिछला",
      next: "अगला",
    },
  },
  auth: {
    public: {
      validCookie: "सही कुकी लीड मिली",
      invalidCookie: "कुकी लीड गलत है",
      created: "गुमनाम लीड बनी",
      error: "पब्लिक लीड ऑथ में एरर",
    },
    authenticated: {
      primaryFound: "यूज़र की प्राइमरी लीड मिली",
      noPrimary: "यूज़र की कोई प्राइमरी लीड नहीं मिली",
      error: "ऑथेंटिकेटेड लीड ऑथ में एरर",
    },
    link: {
      alreadyExists: "लीड लिंक पहले से मौजूद है",
      created: "लीड लिंक बन गया",
      error: "लीड लिंक करने में एरर",
    },
    validate: {
      error: "लीड वैलिडेट करने में एरर",
    },
    getOrCreate: {
      invalid: "लीड ID गलत है",
      error: "लीड लाने या बनाने में एरर",
    },
    create: {
      existingFound: "मौजूदा गुमनाम लीड मिली",
      success: "लीड सफलतापूर्वक बन गई",
      error: "लीड बनाने में एरर",
    },
    createForUser: {
      success: "यूज़र के लिए लीड बनी",
      error: "यूज़र के लिए लीड बनाने में एरर",
    },
    cookie: {
      set: "लीड कुकी सेट हुई",
      error: "लीड कुकी सेट करने में एरर",
    },
    getUserLeads: {
      error: "यूज़र की लीड्स लाने में एरर",
    },
    linkLeads: {
      sameId: "लीड को खुद से लिंक नहीं कर सकते",
      alreadyExists: "लीड लिंक पहले से मौजूद है",
      created: "लीड्स लिंक हो गईं",
      error: "लीड लिंक करने में एरर",
    },
    getLinkedLeads: {
      error: "लिंक की गई लीड्स लाने में एरर",
    },
    getAllLinkedLeads: {
      error: "सारी लिंक की गई लीड्स लाने में एरर",
    },
  },
  errors: {
    cannotLinkLeadToItself: "लीड को खुद से लिंक नहीं कर सकते",
    linkFailed: "लीड्स लिंक नहीं हो पाईं",
  },
  filters: {
    search: {
      label: "खोजें",
      description: "ईमेल या बिज़नेस नाम से लीड्स खोजें",
      placeholder: "ईमेल या बिज़नेस नाम लिखें...",
    },
    status: {
      label: "स्टेटस",
      description: "लीड स्टेटस से फ़िल्टर करें",
      placeholder: "सभी स्टेटस",
    },
    currentCampaignStage: {
      label: "कैंपेन चरण",
      description: "ईमेल कैंपेन स्टेज से फ़िल्टर करें",
      placeholder: "सभी स्टेज",
    },
    source: {
      label: "सोर्स",
      description: "लीड सोर्स से फ़िल्टर करें",
      placeholder: "सभी सोर्स",
    },
    country: {
      label: "लोकेल क्षेत्र",
      description: "विज़िटर ने जो साइट लोकेल चुना उसके क्षेत्र से फ़िल्टर करें",
      placeholder: "सभी क्षेत्र",
    },
    language: {
      label: "भाषा",
      description: "भाषा से फ़िल्टर करें",
      placeholder: "सभी भाषाएँ",
    },
    sortBy: {
      label: "इसके हिसाब से क्रम",
      description: "सॉर्ट करने का फ़ील्ड चुनें",
      placeholder: "क्रम का फ़ील्ड",
    },
    sortOrder: {
      label: "सॉर्ट क्रम",
      description: "बढ़ते या घटते क्रम में सॉर्ट करें",
      placeholder: "सॉर्ट क्रम",
    },
    statusFilters: {
      title: "स्टेटस और कैंपेन फ़िल्टर",
      description: "स्टेटस, कैंपेन स्टेज और सोर्स से फ़िल्टर करें",
    },
    locationFilters: {
      title: "लोकेशन फ़िल्टर",
      description: "देश और भाषा से फ़िल्टर करें",
    },
    sortingOptions: {
      title: "सॉर्टिंग विकल्प",
      description: "सॉर्ट का क्रम सेट करें",
    },
  },
  batch: {
    category: "लीड",
    tags: {
      leads: "लीड",
      batch: "बैच",
    },

    patch: {
      title: "बैच अपडेट",
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
  },
  campaigns: {
    category: "कैंपेन मैनेजमेंट",
    tags: {
      campaigns: "कैंपेन",
      management: "मैनेजमेंट",
    },
    campaignStarter: {
      category: "कैंपेन मैनेजमेंट",
      tag: "कैंपेन स्टार्टर",
      task: {
        description: "नई लीड्स को PENDING स्टेटस में ले जाकर उनके कैंपेन शुरू करें",
      },
      errors: {
        server: {
          title: "सर्वर एरर",
          description: "कैंपेन स्टार्टर रिक्वेस्ट प्रोसेस करते समय एरर आया",
        },
        invalidTransition: "कैंपेन शुरू करने के लिए स्टेटस ट्रांज़िशन गलत है",
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस मना है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
      },
      post: {
        title: "कैंपेन स्टार्टर",
        description: "नई लीड्स के कैंपेन शुरू करें",
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस मना है" },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "कैंपेन शुरू करते समय एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        fields: {
          timezone: {
            label: "टाइमज़ोन",
            description: "घंटे बदलने के लिए ब्राउज़र टाइमज़ोन",
          },
          dryRun: {
            label: "ड्राई रन",
            description: "बदलाव किए बिना चलाएँ",
          },
          force: {
            label: "ज़बरदस्ती",
            description: "दिन/घंटे की शेड्यूल पाबंदियाँ नज़रअंदाज़ करें",
          },
        },
        response: {
          leadsProcessed: "प्रोसेस हुई लीड",
          leadsStarted: "शुरू हुई लीड्स",
          leadsSkipped: "छोड़ी गई लीड्स",
          executionTimeMs: "एक्ज़ीक्यूशन समय (ms)",
          errors: "एरर",
          quotaDetails: "कोटा की जानकारी",
        },
        success: {
          title: "कैंपेन स्टार्टर पूरा हुआ",
          description: "कैंपेन स्टार्टर सफलतापूर्वक चला",
        },
      },
      get: {
        title: "कैंपेन स्टार्टर कॉन्फ़िग देखें",
        description: "कैंपेन स्टार्टर का कॉन्फ़िगरेशन लाएँ",
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस मना है" },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "इंटरनल सर्वर एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        fields: {
          timezone: {
            label: "टाइमज़ोन",
            description: "घंटे बदलने के लिए ब्राउज़र टाइमज़ोन",
          },
        },
        response: {
          dryRun: "ड्राई रन मोड",
          minAgeHours: "न्यूनतम उम्र (घंटे)",
          enabledDays: "चालू दिन",
          enabledHours: "चालू घंटे",
          localeConfig: "लोकेल कॉन्फ़िगरेशन",
          leadsPerWeek: "प्रति हफ़्ता लीड्स",
          schedule: "शेड्यूल",
          enabled: "चालू",
          priority: "प्राथमिकता",
          timeout: "टाइमआउट",
          retries: "रीट्राई",
          retryDelay: "रीट्राई में देरी",
        },
        success: {
          title: "कॉन्फ़िग सफलतापूर्वक मिला",
          description: "कैंपेन स्टार्टर कॉन्फ़िगरेशन मिल गया",
        },
      },
      put: {
        title: "कैंपेन स्टार्टर कॉन्फ़िग",
        description: "कैंपेन स्टार्टर कॉन्फ़िगरेशन अपडेट करें",
        dryRun: {
          label: "ड्राई रन मोड",
          description: "टेस्टिंग के लिए ड्राई रन मोड चालू करें",
        },
        minAgeHours: {
          label: "न्यूनतम उम्र (घंटे)",
          description: "लीड्स प्रोसेस करने से पहले की न्यूनतम उम्र (घंटे में)",
        },
        enabledDays: {
          label: "चालू दिन",
          description: "हफ़्ते के वे दिन जब कैंपेन चालू हैं",
          monday: "सोमवार",
          tuesday: "मंगलवार",
          wednesday: "बुधवार",
          thursday: "गुरुवार",
          friday: "शुक्रवार",
          saturday: "शनिवार",
          sunday: "रविवार",
        },
        enabledHours: {
          label: "चालू घंटे",
          description: "दिन के वे घंटे जब कैंपेन चालू हैं",
          start: {
            label: "शुरुआती घंटा",
            description: "दिन का वह घंटा जब कैंपेन शुरू होते हैं (0-23)",
          },
          end: {
            label: "अंतिम घंटा",
            description: "दिन का वह घंटा जब कैंपेन ख़त्म होते हैं (0-23)",
          },
        },
        localeConfig: {
          label: "लोकेल कॉन्फ़िगरेशन",
          description: "हर लोकेल की सेटिंग: प्रति हफ़्ता लीड्स, चालू दिन और चालू घंटे",
        },
        leadsPerWeek: {
          label: "प्रति हफ़्ता लीड्स",
          description: "प्रति हफ़्ता प्रोसेस होने वाली लीड्स की अधिकतम संख्या",
        },
        schedule: {
          label: "शेड्यूल",
          description: "कैंपेन चलाने का शेड्यूल",
        },
        enabled: {
          label: "चालू",
          description: "कैंपेन स्टार्टर चालू या बंद करें",
        },
        priority: {
          label: "प्राथमिकता",
          description: "कैंपेन चलाने की प्राथमिकता",
        },
        timeout: {
          label: "टाइमआउट",
          description: "टाइमआउट वैल्यू (मिलीसेकंड में)",
        },
        retries: {
          label: "रीट्राई",
          description: "रीट्राई कोशिशों की संख्या",
        },
        retryDelay: {
          label: "रीट्राई में देरी",
          description: "रीट्राई के बीच मिलीसेकंड में देरी",
        },
        success: {
          title: "कॉन्फ़िग सेव हुआ",
          description: "कैंपेन स्टार्टर कॉन्फ़िगरेशन सेव हो गया",
        },
      },
      priority: {
        critical: "क्रिटिकल",
        high: "हाई",
        medium: "मीडियम",
        low: "लो",
        background: "बैकग्राउंड",
        filter: {
          all: "सभी प्राथमिकताएँ",
          highAndAbove: "हाई और उससे ऊपर",
          mediumAndAbove: "मीडियम और उससे ऊपर",
        },
      },
      widget: {
        title: "कैंपेन स्टार्टर",
        titleSaved: "कॉन्फ़िगरेशन सेव हुआ",
        description: "उन नई लीड्स के कैंपेन शुरू करें जिनसे संपर्क करने का समय आ गया है।",
        saving: "सेव हो रहा है...",
        save: "सेटिंग्स सेव करें",
        addLocale: "+ लोकेल जोड़ें",
        guidanceTitle: "कैंपेन स्टार्टर सेट करें",
        guidanceDescription:
          "शेड्यूल, चालू दिन/घंटे, प्रति हफ़्ता लीड्स के लक्ष्य और क्रॉन टास्क की सेटिंग्स तय करें।",
        runButton: "कैंपेन शुरू करें",
        running: "चल रहा है...",
        done: "हो गया",
        perRunBudget:
          "~{{perRunBudget}} लीड्स/रन · {{totalRunsPerWeek}} रन/हफ़्ता",
        perRunBudgetFractional:
          "{{exactBudget}}/रन · {{totalRunsPerWeek}} रन/हफ़्ता (भिन्नात्मक, रन में जुड़ता जाता है)",
        perRunBudgetZeroHint: "leads/week बढ़ाएँ या शेड्यूल की आवृत्ति घटाएँ",
        sections: {
          general: "सामान्य",
          generalDescription:
            "कैंपेन स्टार्टर और ड्राई रन मोड चालू करने के मास्टर कंट्रोल।",
          schedule: "शेड्यूल",
          scheduleDescription: "कैंपेन कब चलें? क्रॉन शेड्यूल, चालू दिन और घंटे सेट करें।",
          hoursTimezoneNote:
            "घंटे आपके ब्राउज़र टाइमज़ोन ({{offset}}) में हैं। सर्वर पर UTC में स्टोर होते हैं।",
          quotas: "कोटा",
          quotasDescription: "हर हफ़्ते कितनी लीड्स प्रोसेस करनी हैं, लोकेल के हिसाब से।",
          advanced: "एडवांस्ड",
          advancedDescription:
            "प्राथमिकता, टाइमआउट और रीट्राई जैसी टास्क एक्ज़ीक्यूशन सेटिंग्स।",
        },
        days: {
          mon: "सोम",
          tue: "मंगल",
          wed: "बुध",
          thu: "गुरु",
          fri: "शुक्र",
          sat: "शनि",
          sun: "रवि",
        },
      },
    },
    emailCampaigns: {
      category: "कैंपेन मैनेजमेंट",
      tag: "ईमेल कैंपेन",
      task: {
        description: "लीड के चरण और समय के आधार पर ऑटोमैटिक ईमेल कैंपेन भेजें",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस मना है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "इंटरनल सर्वर एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर आया",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
      },
      post: {
        title: "ईमेल कैंपेन",
        description: "लीड के लिए ईमेल कैंपेन प्रोसेस करें",
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस मना है" },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "इंटरनल सर्वर एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        fields: {
          batchSize: {
            label: "बैच साइज़",
            description: "हर बैच में प्रोसेस होने वाली लीड की संख्या",
          },
          maxEmailsPerRun: {
            label: "हर रन में अधिकतम ईमेल",
            description: "हर रन में भेजे जाने वाले ईमेल की अधिकतम संख्या",
          },
          dryRun: {
            label: "ड्राई रन",
            description: "ईमेल भेजे बिना चलाएँ",
          },
        },
        response: {
          emailsScheduled: "तय ईमेल",
          emailsSent: "भेजे गए ईमेल",
          emailsFailed: "फ़ेल हुए ईमेल",
          leadsProcessed: "प्रोसेस हुई लीड",
        },
        success: {
          title: "सफल",
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
      },
      get: {
        title: "ईमेल कैंपेन कॉन्फ़िग लाएँ",
        description: "ईमेल कैंपेन बैकग्राउंड टास्क का कॉन्फ़िगरेशन लाएँ",
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: { title: "अनुमति नहीं", description: "एक्सेस मना है" },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "इंटरनल सर्वर एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        response: {
          enabled: "चालू",
          dryRun: "ड्राई रन मोड",
          batchSize: "बैच साइज़",
          maxEmailsPerRun: "हर रन में अधिकतम ईमेल",
          schedule: "शेड्यूल",
          priority: "प्राथमिकता",
          timeout: "टाइमआउट",
          retries: "रीट्राई",
          retryDelay: "रीट्राई में देरी",
        },
        success: {
          title: "कॉन्फ़िग सफलतापूर्वक मिला",
          description: "ईमेल कैंपेन का कॉन्फ़िगरेशन सफलतापूर्वक मिल गया",
        },
      },
      put: {
        title: "ईमेल कैंपेन कॉन्फ़िग",
        description: "ईमेल कैंपेन बैकग्राउंड टास्क का कॉन्फ़िगरेशन अपडेट करें",
        enabled: {
          label: "चालू",
          description: "ईमेल कैंपेन बैकग्राउंड टास्क चालू या बंद करें",
        },
        dryRun: {
          label: "ड्राई रन मोड",
          description: "ईमेल असल में भेजे बिना प्रोसेस करें",
        },
        batchSize: {
          label: "बैच साइज़",
          description: "हर बैच में प्रोसेस होने वाली लीड की संख्या (1–100)",
        },
        maxEmailsPerRun: {
          label: "हर रन में अधिकतम ईमेल",
          description: "हर बैकग्राउंड रन में भेजे जाने वाले ईमेल की अधिकतम संख्या (1–1000)",
        },
        schedule: {
          label: "शेड्यूल",
          description: "ईमेल कैंपेन कब चलें, इसके लिए cron एक्सप्रेशन",
        },
        priority: {
          label: "प्राथमिकता",
          description: "टास्क एक्ज़ीक्यूशन का प्राथमिकता स्तर",
        },
        timeout: {
          label: "टाइमआउट (ms)",
          description: "मिलीसेकंड में अधिकतम एक्ज़ीक्यूशन समय",
        },
        retries: {
          label: "रीट्राई",
          description: "फ़ेल होने पर रीट्राई कोशिशों की संख्या",
        },
        retryDelay: {
          label: "रीट्राई में देरी (ms)",
          description: "रीट्राई के बीच मिलीसेकंड में देरी",
        },
        success: {
          title: "कॉन्फ़िग सेव हुआ",
          description: "ईमेल कैंपेन का कॉन्फ़िगरेशन सफलतापूर्वक सेव हुआ",
        },
      },
      priority: {
        critical: "क्रिटिकल",
        high: "हाई",
        medium: "मीडियम",
        low: "लो",
        background: "बैकग्राउंड",
      },
      widget: {
        title: "ईमेल कैंपेन कॉन्फ़िगरेशन",
        titleSaved: "कॉन्फ़िगरेशन सेव हुआ",
        saving: "सेव हो रहा है...",
        save: "सेटिंग्स सेव करें",
        guidanceTitle: "ईमेल कैंपेन बैकग्राउंड टास्क कॉन्फ़िगर करें",
        guidanceDescription:
          "ईमेल कैंपेन cron टास्क चालू या बंद करें और उसका शेड्यूल, बैच साइज़ और एक्ज़ीक्यूशन सेटिंग्स तय करें।",
        runButton: "अभी चलाएँ",
        running: "चल रहा है...",
        done: "हो गया",
        sections: {
          general: "सामान्य",
          generalDescription:
            "ईमेल कैंपेन टास्क और ड्राई रन मोड चालू करने के मुख्य कंट्रोल।",
          schedule: "शेड्यूल",
          scheduleDescription: "ईमेल कब भेजे जाएँ, इसका cron शेड्यूल सेट करें।",
          processing: "प्रोसेस हो रहा है",
          processingDescription: "तय करें कि हर रन में कितनी लीड और ईमेल प्रोसेस हों।",
          advanced: "एडवांस्ड",
          advancedDescription:
            "प्राथमिकता, टाइमआउट और रीट्राई जैसी टास्क एक्ज़ीक्यूशन सेटिंग्स।",
        },
      },
    },
    emails: {
      common: {
        logoPart1: "अगला",
        logoPart2: "Vibe",
      },
      email: {
        template: {
          tagline: "बेहतर प्रोडक्ट, तेज़ी से बनाएँ",
        },
      },
      emailJourneys: {
        components: {
          footer: {
            copyright: "© 2024 {{appName}}। सर्वाधिकार सुरक्षित।",
            helpText: "कोई सवाल हो तो हमें {{config.emails.support}} पर लिखें",
            unsubscribeText: "ये ईमेल नहीं चाहिए?",
            unsubscribeLink: "अनसब्सक्राइब करें",
          },
          socialProof: {
            quotePrefix: "201C",
            quoteSuffix: "201D",
            attribution: "ग्राहक का नाम, कंपनी",
          },
        },
      },
      journeys: {
        emailJourneys: {
          components: {
            defaults: {
              signatureName: "unbottled.ai का एक और यूज़र",
              previewLeadId: "preview-lead-id",
              previewEmail: "preview@example.com",
              previewBusinessName: "Acme Corp",
              previewContactName: "प्रीव्यू यूज़र",
              previewPhone: "+1234567890",
              previewCampaignId: "preview-campaign-id",
            },
            footer: {
              unsubscribeText:
                "आपको यह इसलिए मिल रहा है क्योंकि आपने ऑप्ट-इन किया था।",
              unsubscribeLink: "अनसब्सक्राइब करें",
            },
            journeyInfo: {
              uncensoredConvert: {
                name: "अनसेंसर्ड कन्वर्ट",
                description: "unbottled.ai की अपनी खोज बताने वाला एक शौकीन",
                longDescription:
                  "एफ़िलिएट पारदर्शिता के साथ सच्ची खोज बताने वाला शौकीन पर्सोना",
                characteristics: {
                  tone: "आम बोलचाल का, राज़ की बात जैसा लहजा",
                  story: "सच्ची निजी कहानी",
                  transparency: "एफ़िलिएट पारदर्शिता",
                  angle: "सेंसरशिप विरोधी एंगल",
                  energy: "शौकीन का जोश",
                },
              },
              sideHustle: {
                name: "साइड हसल",
                description: "असली इस्तेमाल बताने वाला पारदर्शी एफ़िलिएट",
                longDescription:
                  "हर हफ़्ते के असली इस्तेमाल बताने वाला पारदर्शी एफ़िलिएट मार्केटर",
                characteristics: {
                  disclosure: "शुरू में ही पूरा एफ़िलिएट डिस्क्लोज़र",
                  updates: "हफ़्ते के इस्तेमाल के अपडेट",
                  income: "पैसिव इनकम की कहानी",
                  proof: "हवा-हवाई नहीं, व्यावहारिक सबूत",
                  energy: "ईमानदार मेहनत का जोश",
                },
              },
              quietRecommendation: {
                name: "क्वाइट रेकमेंडेशन",
                description: "आज़माया हुआ टूल बताने वाला शांत प्रोफ़ेशनल",
                longDescription: "हफ़्तों आज़माया टूल बताने वाला शांत प्रोफ़ेशनल",
                characteristics: {
                  signal: "छोटा और काम की बात वाला",
                  specifics: "कोई हाइप नहीं, सिर्फ़ ठोस बातें",
                  testing: "3 हफ़्ते की टेस्टिंग की पृष्ठभूमि",
                  comparison: "ChatGPT से ईमानदार तुलना",
                  affiliate: "एफ़िलिएट का हल्का ज़िक्र",
                },
              },
              signupNurture: {
                name: "साइनअप नर्चर",
                description: "नए साइन अप यूज़र्स के लिए ऑनबोर्डिंग सीक्वेंस",
                longDescription:
                  "नए यूज़र को प्लेटफ़ॉर्म से शुरुआत कराने वाले वेलकम और ऑनबोर्डिंग ईमेल",
              },
              retention: {
                name: "रिटेंशन",
                description: "मौजूदा सब्सक्राइबर्स की दोबारा एंगेजमेंट",
                longDescription:
                  "सक्रिय सब्सक्राइबर्स को जोड़े रखने और फ़ीचर आज़माने के लिए काम के ईमेल",
              },
              winback: {
                name: "विनबैक",
                description: "निष्क्रिय या छोड़ चुके यूज़र्स को वापस लाएँ",
                longDescription:
                  "शांत हो चुके या सब्सक्रिप्शन रद्द कर चुके यूज़र्स के लिए री-एक्टिवेशन कैंपेन",
              },
              newsletterMay2026: {
                name: "न्यूज़लेटर मई 2026",
                description:
                  "Cortex, Dreamer, Autopilot और मीडिया जनरेशन पर एक बार का न्यूज़लेटर",
                longDescription:
                  "मई 2026 का प्रोडक्ट अपडेट न्यूज़लेटर, सभी साइन अप यूज़र्स को भेजा गया, बग की ईमानदार स्वीकारोक्ति और फ़ीचर हाइलाइट के साथ",
              },
              newsletterNov2026: {
                name: "न्यूज़लेटर नवंबर 2026",
                description:
                  "एक बार का री-एक्टिवेशन न्यूज़लेटर: आपके साथ खड़ा कंपैनियन, आपका फ़िल्टर और सस्ता डिफ़ॉल्ट",
                longDescription:
                  "नवंबर 2026 का कन्वर्ज़न न्यूज़लेटर, सहमति देने वाले न्यूज़लेटर ऑप्ट-इन्स को भेजा गया, कंपैनियन की सोच और सस्ते डिफ़ॉल्ट मॉडल के साथ",
              },
            },
          },
        },
      },
      services: {
        scheduler: {
          cancelledBySystem: "सिस्टम ने रद्द किया",
        },
        abTesting: {
          invalidWeights: "सभी वेरिएंट के वेट का कुल 100% होना चाहिए",
          negativeWeight: "वेरिएंट का वेट पॉज़िटिव होना चाहिए",
        },
        post: {
          title: "सेवाएँ",
          description: "सेवाओं का एंडपॉइंट",
          form: {
            title: "सेवाओं का कॉन्फ़िगरेशन",
            description: "सेवाओं के पैरामीटर सेट करें",
          },
          response: {
            title: "रिस्पॉन्स",
            description: "सेवाओं का रिस्पॉन्स डेटा",
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत",
              description: "लॉगिन ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन एरर",
              description: "रिक्वेस्ट के पैरामीटर गलत हैं",
            },
            server: {
              title: "सर्वर एरर",
              description: "इंटरनल सर्वर एरर आया",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अज्ञात एरर आया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर आया",
            },
            forbidden: {
              title: "अनुमति नहीं",
              description: "एक्सेस मना है",
            },
            notFound: {
              title: "नहीं मिला",
              description: "रिसोर्स नहीं मिला",
            },
            conflict: {
              title: "टकराव",
              description: "डेटा टकराव हुआ",
            },
          },
          success: {
            title: "सफल",
            description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
          },
        },
      },
      testMail: {
        category: "लीड",
        tags: {
          campaigns: "कैंपेन",
          leads: "लीड",
        },
        post: {
          title: "टेस्ट मेल",
          description: "अपनी मर्ज़ी के लीड डेटा के साथ टेस्ट ईमेल भेजें",
          form: {
            title: "टेस्ट मेल कॉन्फ़िगरेशन",
            description: "टेस्ट मेल के पैरामीटर और लीड डेटा सेट करें",
          },
          campaignType: {
            label: "कैंपेन टाइप",
            description: "ईमेल कैंपेन का प्रकार",
            placeholder: "कैंपेन का प्रकार दर्ज करें",
          },
          emailJourneyVariant: {
            label: "ईमेल जर्नी वेरिएंट",
            description: "ईमेल जर्नी के लिए A/B टेस्ट वेरिएंट",
            placeholder: "जर्नी वेरिएंट चुनें",
          },
          emailCampaignStage: {
            label: "ईमेल कैंपेन चरण",
            description: "ईमेल कैंपेन का मौजूदा चरण",
            placeholder: "कैंपेन चरण चुनें",
          },
          testEmail: {
            label: "टेस्ट ईमेल पता",
            description: "जिस ईमेल पर टेस्ट मेल भेजना है",
            placeholder: "test@example.com",
          },
          leadData: {
            title: "लीड डेटा",
            description: "टेंप्लेट रेंडर करने के लिए लीड की जानकारी",
            businessName: {
              label: "बिज़नेस का नाम",
              description: "व्यवसाय का नाम",
              placeholder: "Acme Corporation",
            },
            contactName: {
              label: "संपर्क का नाम",
              description: "संपर्क व्यक्ति का नाम",
              placeholder: "राहुल शर्मा",
            },
            website: {
              label: "वेबसाइट",
              description: "कंपनी की वेबसाइट URL",
              placeholder: "https://example.com",
            },
            country: {
              label: "देश",
              description: "देश कोड",
              placeholder: "GLOBAL",
            },
            language: {
              label: "भाषा",
              description: "पसंदीदा भाषा कोड",
              placeholder: "en",
            },
            status: {
              label: "स्टेटस",
              description: "लीड की स्थिति",
              placeholder: "NEW",
            },
            source: {
              label: "सोर्स",
              description: "लीड का स्रोत",
              placeholder: "WEBSITE",
            },
            notes: {
              label: "नोट्स",
              description: "लीड के बारे में अतिरिक्त नोट्स",
              placeholder: "कोई अतिरिक्त नोट्स दर्ज करें",
            },
          },
          response: {
            title: "टेस्ट ईमेल का नतीजा",
            description: "टेस्ट ईमेल भेजने का नतीजा",
            success: {
              content: "सफल",
            },
            messageId: {
              content: "मैसेज ID",
            },
            testEmail: {
              content: "टेस्ट ईमेल",
            },
            subject: {
              content: "ईमेल विषय",
            },
            sentAt: {
              content: "भेजने का समय",
            },
          },
          errors: {
            unauthorized: {
              title: "अनधिकृत",
              description: "लॉगिन ज़रूरी है",
            },
            validation: {
              title: "वैलिडेशन एरर",
              description: "रिक्वेस्ट के पैरामीटर गलत हैं",
            },
            server: {
              title: "सर्वर एरर",
              description: "इंटरनल सर्वर एरर आया",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अज्ञात एरर आया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "नेटवर्क एरर आया",
            },
            forbidden: {
              title: "अनुमति नहीं",
              description: "एक्सेस मना है",
            },
            notFound: {
              title: "नहीं मिला",
              description: "रिसोर्स नहीं मिला",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "कुछ बदलाव सेव नहीं हुए हैं",
            },
            conflict: {
              title: "टकराव",
              description: "डेटा टकराव हुआ",
            },
            templateNotFound: {
              title: "टेम्पलेट नहीं मिला",
              description: "बताए पैरामीटर के लिए ईमेल टेंप्लेट नहीं मिला",
            },
            sendingFailed: {
              title: "भेजना फ़ेल हुआ",
              description: "टेस्ट ईमेल भेजना फ़ेल हुआ",
            },
          },
          success: {
            title: "सफल",
            description: "टेस्ट ईमेल सफलतापूर्वक भेजा गया",
          },
          selectionCriteria: "SMTP चयन मानदंड",
          widget: {
            title: "टेस्ट ईमेल भेजें",
            send: "टेस्ट ईमेल भेजें",
            sending: "भेजा जा रहा है...",
            successMessage: "टेस्ट ईमेल सफलतापूर्वक भेजा गया",
            sentTo: "इसे भेजा गया: ",
            subject: "विषय: ",
            sentAt: "भेजने का समय: ",
            campaignConfig: "कैंपेन कॉन्फ़िग",
            sendAnother: "एक और भेजें",
          },
        },
      },
    },
  },
  create: {
    category: "लीड",
    tags: {
      leads: "लीड",
      create: "बनाएँ",
    },

    enums: {
      leadSource: {
        website: "वेबसाइट",
        socialMedia: "सोशल मीडिया",
        emailCampaign: "ईमेल कैंपेन",
        referral: "रेफ़रल",
        csvImport: "CSV इम्पोर्ट",
      },
    },
    widget: {
      headerLeadCreated: "लीड बनी",
      headerCreateLead: "लीड बनाएँ",
      subheaderFillDetails: "नीचे ब्योरा भरें",
      fallbackLeadName: "लीड",
      buttonCopyId: "ID कॉपी करें",
      buttonViewLead: "लीड देखें",
      buttonEditLead: "लीड एडिट करें",
      buttonBackToList: "लिस्ट पर वापस",
    },
    post: {
      title: "लीड बनाएँ",
      description: "सिस्टम में नई लीड बनाएँ",
      backButton: {
        label: "लीड पर वापस",
      },
      submitButton: {
        label: "लीड बनाएँ",
        loadingText: "लीड बन रही है...",
      },
      form: {
        title: "नई लीड का फ़ॉर्म",
        description: "नई लीड बनाने के लिए लीड की जानकारी दर्ज करें",
      },
      contactInfo: {
        title: "संपर्क की जानकारी",
        description: "लीड का मुख्य संपर्क ब्योरा",
      },
      email: {
        label: "ईमेल पता",
        description: "संपर्क के लिए मुख्य ईमेल पता",
        placeholder: "john@example.com",
      },
      businessName: {
        label: "बिज़नेस का नाम",
        description: "कंपनी या व्यवसाय का नाम",
        placeholder: "Example Corp",
      },
      phone: {
        label: "फ़ोन नंबर",
        description: "देश कोड के साथ संपर्क फ़ोन नंबर",
        placeholder: "+1234567890",
      },
      website: {
        label: "वेबसाइट",
        description: "कंपनी की वेबसाइट URL",
        placeholder: "https://example.com",
      },
      locationPreferences: {
        title: "लोकेशन और पसंद",
        description: "भौगोलिक और भाषा की पसंद",
      },
      country: {
        label: "देश",
        description: "व्यवसाय की लोकेशन या टारगेट बाज़ार",
        placeholder: "कोई देश चुनें",
      },
      language: {
        label: "भाषा",
        description: "संवाद की पसंदीदा भाषा",
        placeholder: "कोई भाषा चुनें",
      },
      leadDetails: {
        title: "लीड का ब्योरा",
        description: "लीड के बारे में अतिरिक्त जानकारी",
      },
      source: {
        label: "लीड का स्रोत",
        description: "लीड कैसे मिली",
        placeholder: "स्रोत चुनें",
      },
      notes: {
        label: "नोट्स",
        description: "अतिरिक्त नोट्स या टिप्पणियाँ",
        placeholder: "कोई अतिरिक्त जानकारी दर्ज करें...",
      },
      response: {
        title: "बनी हुई लीड",
        description: "नई बनी लीड का ब्योरा",
        summary: {
          title: "लीड सारांश",
          id: "लीड ID",
          businessName: "बिज़नेस का नाम",
          email: "ईमेल पता",
          status: "लीड की स्थिति",
        },
        contactDetails: {
          title: "संपर्क ब्योरा",
          phone: "फ़ोन नंबर",
          website: "वेबसाइट URL",
          country: "देश",
          language: "भाषा",
        },
        trackingInfo: {
          title: "ट्रैकिंग जानकारी",
          source: "लीड का स्रोत",
          emailsSent: "ईमेल की संख्या",
          currentCampaignStage: "कैंपेन चरण",
        },
        metadata: {
          title: "मेटाडेटा",
          notes: "नोट्स",
          createdAt: "बनने की तारीख़",
          updatedAt: "आख़िरी अपडेट",
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लीड बनाने के लिए ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "दी गई लीड की जानकारी गलत है",
        },
        server: {
          title: "सर्वर एरर",
          description: "लीड बनाते समय आंतरिक सर्वर एरर हुई",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "लीड बनाते समय अनजान एरर हुई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "लीड बनाते समय नेटवर्क एरर हुई",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "लीड बनाने का एक्सेस मना है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "लीड बनाने के लिए ज़रूरी रिसोर्स नहीं मिला",
        },
        conflict: {
          title: "टकराव",
          description: "लीड पहले से मौजूद है या डेटा टकराव हुआ",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "लीड फ़ॉर्म में बिना सेव किए बदलाव हैं",
        },
      },
      success: {
        title: "लीड बनी",
        description: "लीड सफलतापूर्वक बन गई",
      },
    },
    email: {
      welcome: {
        subject: "{{companyName}} में स्वागत है",
        title: "{{companyName}} में स्वागत है, {{businessName}}!",
        preview: "स्वागत है। शुरू करने का तरीक़ा यह रहा।",
        greeting:
          "{{companyName}} में स्वागत है, {{businessName}}! आपका साथ अच्छा लगा।",
        defaultName: "दोस्त",
        introduction:
          "दिलचस्पी के लिए शुक्रिया। आपका ब्योरा हम तक पहुँचा, और उसे कोई असली इंसान पढ़ता है।",
        nextSteps: {
          title: "आगे क्या होगा?",
          step1Number: "1.",
          step1: "अभी चैट शुरू करें। कोई सेटअप नहीं, कोई कार्ड नहीं।",
          step2Number: "2.",
          step2: "सवाल हैं? इस ईमेल का जवाब दें। इसे इंसान पढ़ता है।",
          step3Number: "3.",
          step3: "हम जितनी जल्दी हो सके जवाब देते हैं।",
        },
        cta: {
          getStarted: "चैट शुरू करें",
        },
        support: "सवाल हैं? इस ईमेल का जवाब दें या हमें {{supportEmail}} पर संपर्क करें",
        error: {
          noEmail: "वेलकम ईमेल नहीं भेजा जा सकता: कोई ईमेल पता नहीं दिया गया",
        },
      },
      admin: {
        newLead: {
          subject: "नई लीड: {{businessName}}",
          title: "नई लीड बनी",
          preview: "{{businessName}} की नई लीड पर फ़ॉलो-अप ज़रूरी है",
          message:
            "सिस्टम में {{businessName}} से एक नई लीड बनी है और उस पर आपका ध्यान चाहिए।",
          leadDetails: "लीड का ब्योरा",
          businessName: "बिज़नेस का नाम",
          email: "ईमेल",
          phone: "फ़ोन",
          website: "वेबसाइट",
          source: "सोर्स",
          status: "स्टेटस",
          notes: "नोट्स",
          notProvided: "दिया नहीं गया",
          viewLead: "लीड का ब्योरा देखें",
          viewAllLeads: "सभी लीड देखें",
          error: {
            noData: "एडमिन सूचना नहीं भेजी जा सकती: कोई लीड डेटा नहीं दिया गया",
          },
          defaultName: "नई लीड",
        },
      },
      error: {
        general: {
          internal_server_error: "इंटरनल सर्वर एरर आया",
        },
      },
    },
  },
  export: {
    category: "लीड",
    tags: {
      leads: "लीड",
      export: "एक्सपोर्ट",
    },

    get: {
      title: "लीड्स एक्सपोर्ट करें",
      description: "लीड्स का डेटा फ़ाइल में एक्सपोर्ट करें",
      form: {
        title: "एक्सपोर्ट कॉन्फ़िगरेशन",
        description: "लीड एक्सपोर्ट के पैरामीटर और फ़िल्टर सेट करें",
      },
      format: {
        label: "एक्सपोर्ट फ़ॉर्मैट",
        description: "एक्सपोर्ट के लिए फ़ाइल फ़ॉर्मैट",
      },
      status: {
        label: "लीड की स्थिति",
        description: "लीड स्टेटस से फ़िल्टर करें",
      },
      country: {
        label: "देश",
        description: "देश से फ़िल्टर करें",
        placeholder: "देश चुनें",
      },
      language: {
        label: "भाषा",
        description: "भाषा से फ़िल्टर करें",
        placeholder: "भाषा चुनें",
      },
      source: {
        label: "लीड का स्रोत",
        description: "लीड सोर्स से फ़िल्टर करें",
        placeholder: "स्रोत चुनें",
      },
      search: {
        label: "खोजें",
        description: "टेक्स्ट से लीड्स खोजें",
        placeholder: "लीड्स खोजें...",
      },
      dateFrom: {
        label: "शुरू की तारीख",
        description: "इस तारीख से बनी लीड्स एक्सपोर्ट करें",
      },
      dateTo: {
        label: "अंत की तारीख",
        description: "इस तारीख तक बनी लीड्स एक्सपोर्ट करें",
      },
      includeMetadata: {
        label: "मेटाडेटा शामिल करें",
        description: "बनने और अपडेट के टाइमस्टैम्प शामिल करें",
      },
      includeEngagementData: {
        label: "एंगेजमेंट डेटा शामिल करें",
        description: "ईमेल ट्रैकिंग और कैंपेन डेटा शामिल करें",
      },
      response: {
        title: "एक्सपोर्ट फ़ाइल",
        description: "लीड डेटा के साथ बनी एक्सपोर्ट फ़ाइल",
        fileName: "फ़ाइल का नाम",
        fileContent: "फ़ाइल कंटेंट (Base64)",
        mimeType: "MIME टाइप",
        totalRecords: "कुल रिकॉर्ड",
        exportedAt: "एक्सपोर्ट का समय",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लीड्स एक्सपोर्ट करने के लिए लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "एक्सपोर्ट के पैरामीटर या फ़िल्टर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "एक्सपोर्ट के दौरान इंटरनल सर्वर एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "एक्सपोर्ट के दौरान अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "एक्सपोर्ट के दौरान नेटवर्क एरर आया",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "लीड एक्सपोर्ट के लिए एक्सेस की अनुमति नहीं",
        },
        notFound: {
          title: "कोई डेटा नहीं",
          description: "एक्सपोर्ट की शर्तों से मेल खाती कोई लीड नहीं मिली",
        },
        conflict: {
          title: "टकराव",
          description: "एक्सपोर्ट के दौरान डेटा कॉन्फ़्लिक्ट हुआ",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "एक्सपोर्ट फ़ॉर्म में बिना सेव किए बदलाव हैं",
        },
      },
      success: {
        title: "एक्सपोर्ट पूरा हुआ",
        description: "लीड एक्सपोर्ट सफलतापूर्वक पूरा हुआ",
      },
    },
    widget: {
      exportLeads: "लीड्स एक्सपोर्ट करें",
      import: "Import",
      viewList: "सूची देखें",
      importLeadsTitle: "Import Leads",
      viewLeadsListTitle: "लीड्स की लिस्ट देखें",
      copyCsvTitle: "CSV कंटेंट क्लिपबोर्ड पर कॉपी करें",
      generatingExport: "एक्सपोर्ट बन रहा है…",
      generatingExportHint: "बड़े डेटासेट में थोड़ा समय लग सकता है",
      exportReady: "एक्सपोर्ट तैयार",
      fileReadyToDownload: "आपकी फ़ाइल डाउनलोड के लिए तैयार है",
      records: "रिकॉर्ड",
      format: "फ़ॉर्मेट",
      fileSize: "फ़ाइल साइज़",
      copied: "कॉपी हो गया!",
      copy: "कॉपी करें",
      download: "डाउनलोड करें",
      exportedAt: "एक्सपोर्ट का समय:",
      nextSteps: "अगले कदम:",
      viewLeads: "लीड देखें",
      importLeads: "Import Leads",
      configureExport: "एक्सपोर्ट सेट करें",
      configureExportHint:
        "नीचे फ़ॉर्मैट और फ़िल्टर चुनें, फिर फ़ाइल बनाने के लिए एक्सपोर्ट पर क्लिक करें",
      formatLabel: "फ़ॉर्मेट",
      formatHint: "CSV या Excel (XLSX) चुनें",
      statusFilter: "स्थिति फ़िल्टर",
      statusFilterHint: "सिर्फ़ किसी ख़ास स्टेटस की लीड्स एक्सपोर्ट करें",
      dateRange: "तारीख़ रेंज",
      dateRangeHint: "एक्सपोर्ट को किसी ख़ास समय सीमा तक सीमित करें",
      metadataEngagement: "मेटाडेटा और एंगेजमेंट",
      metadataEngagementHint: "गहरे विश्लेषण के लिए चाहें तो अतिरिक्त कॉलम जोड़ें",
      viewLeadsList: "लीड्स की लिस्ट देखें",
      excelSpreadsheet: "Excel स्प्रेडशीट",
      csvFile: "CSV फ़ाइल",
    },
    enums: {
      exportFormat: {
        csv: "CSV",
        xlsx: "Excel",
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
      leadSource: {
        website: "वेबसाइट",
        socialMedia: "सोशल मीडिया",
        emailCampaign: "ईमेल कैंपेन",
        referral: "रेफ़रल",
        csvImport: "CSV इम्पोर्ट",
      },
    },
    headers: {
      email: "ईमेल",
      businessName: "बिज़नेस का नाम",
      contactName: "संपर्क का नाम",
      phone: "फ़ोन",
      country: "देश",
      language: "भाषा",
      status: "स्टेटस",
      source: "सोर्स",
      website: "वेबसाइट",
      notes: "नोट्स",
      campaignStage: "कैंपेन चरण",
      emailsSent: "भेजे गए ईमेल",
      emailsOpened: "खोले गए ईमेल",
      emailsClicked: "क्लिक किए गए ईमेल",
      lastEmailSent: "आख़िरी भेजा ईमेल",
      lastEngagement: "आख़िरी एंगेजमेंट",
      unsubscribedAt: "अनसब्सक्राइब का समय",
      createdAt: "बनाने का समय",
      updatedAt: "अपडेट का समय",
      lastEngagementAt: "आख़िरी एंगेजमेंट",
      metadata: "मेटाडेटा",
      ipAddress: "IP पता",
      userAgent: "यूज़र एजेंट",
      deviceType: "डिवाइस प्रकार",
      browser: "ब्राउज़र",
      os: "OS",
      referralCode: "रेफ़रल कोड",
    },
  },
  import: {
    tags: {
      import: "Import",
      leads: "लीड",
      csv: "CSV",
    },

    category: "डेटा इम्पोर्ट",
    post: {
      title: "लीड्स इम्पोर्ट करें",
      description: "CSV फ़ाइल से लीड्स इम्पोर्ट करें",
      form: {
        title: "इम्पोर्ट कॉन्फ़िगरेशन",
        description: "लीड इम्पोर्ट के पैरामीटर सेट करें",
      },
      file: {
        label: "CSV फ़ाइल",
        description: "CSV फ़ाइल का कंटेंट (base64 एन्कोडेड)",
        placeholder: "base64 एन्कोडेड CSV कंटेंट पेस्ट करें",
        helpText: "लीड डेटा वाली CSV फ़ाइल अपलोड करें",
      },
      fileName: {
        label: "फ़ाइल का नाम",
        description: "CSV फ़ाइल का नाम",
        placeholder: "leads.csv",
        helpText: "समझ आने वाला फ़ाइल नाम दें",
      },
      skipDuplicates: {
        label: "डुप्लिकेट छोड़ें",
        description: "डुप्लिकेट ईमेल पते वाली लीड्स छोड़ें",
        helpText: "मौजूदा ईमेल पते अपने आप छोड़ने के लिए चालू करें",
      },
      updateExisting: {
        label: "मौजूदा अपडेट करें",
        description: "मौजूदा लीड्स को नए डेटा से अपडेट करें",
        helpText: "छोड़ने की जगह मौजूदा लीड्स अपडेट करने के लिए चालू करें",
      },
      defaultCountry: {
        label: "डिफ़ॉल्ट देश",
        description: "जिन लीड्स में देश नहीं है उनके लिए डिफ़ॉल्ट देश",
        helpText: "डिफ़ॉल्ट देश कोड चुनें",
      },
      defaultLanguage: {
        label: "डिफ़ॉल्ट भाषा",
        description: "जिन लीड्स में भाषा नहीं है उनके लिए डिफ़ॉल्ट भाषा",
        helpText: "डिफ़ॉल्ट भाषा कोड चुनें",
      },
      defaultStatus: {
        label: "डिफ़ॉल्ट स्टेटस",
        description: "इम्पोर्ट की गई लीड्स का डिफ़ॉल्ट स्टेटस",
        helpText: "नई लीड्स का शुरुआती स्टेटस चुनें",
      },
      defaultCampaignStage: {
        label: "डिफ़ॉल्ट कैंपेन स्टेज",
        description: "इम्पोर्ट की गई लीड्स का डिफ़ॉल्ट ईमेल कैंपेन स्टेज",
        helpText: "शुरुआती कैंपेन स्टेज चुनें",
      },
      defaultSource: {
        label: "डिफ़ॉल्ट सोर्स",
        description: "इम्पोर्ट की गई लीड्स का डिफ़ॉल्ट सोर्स एट्रिब्यूशन",
        helpText: "ट्रैकिंग के लिए लीड सोर्स चुनें",
      },
      useChunkedProcessing: {
        label: "चंक्ड प्रोसेसिंग इस्तेमाल करें",
        description: "बड़े इम्पोर्ट को बैकग्राउंड चंक्स में प्रोसेस करें",
        helpText: "1000 से ज़्यादा पंक्तियों वाली फ़ाइलों के लिए चालू करें",
      },
      batchSize: {
        label: "बैच साइज़",
        description: "हर बैच में प्रोसेस होने वाली पंक्तियों की संख्या",
        helpText: "सुझाव: हर बैच में 2000 पंक्तियाँ",
      },
      response: {
        batchId: "बैच ID",
        totalRows: "कुल पंक्तियाँ",
        successfulImports: "सफल इम्पोर्ट",
        failedImports: "फ़ेल इम्पोर्ट",
        duplicateEmails: "डुप्लिकेट ईमेल",
        errors: "इम्पोर्ट एरर",
        summary: "इम्पोर्ट सारांश",
        isChunkedProcessing: "चंक्ड प्रोसेसिंग इस्तेमाल हो रही है",
        jobId: "बैकग्राउंड जॉब ID",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "इम्पोर्ट के पैरामीटर या CSV फ़ॉर्मैट गलत है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "लीड्स इम्पोर्ट करने के लिए लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "लीड इम्पोर्ट के लिए एक्सेस की अनुमति नहीं",
        },
        notFound: {
          title: "नहीं मिला",
          description: "CSV फ़ाइल नहीं मिली या गलत है",
        },
        conflict: {
          title: "टकराव",
          description: "इम्पोर्ट के दौरान डेटा कॉन्फ़्लिक्ट",
        },
        server: {
          title: "सर्वर एरर",
          description: "इम्पोर्ट के दौरान इंटरनल सर्वर एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "इम्पोर्ट के दौरान अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "इम्पोर्ट के दौरान नेटवर्क एरर",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "इम्पोर्ट फ़ॉर्म में बिना सेव किए बदलाव हैं",
        },
      },
      success: {
        title: "इम्पोर्ट शुरू हुआ",
        description: "लीड इम्पोर्ट सफलतापूर्वक शुरू हो गया है",
      },
      widget: {
        headerTitle: "CSV से लीड्स इम्पोर्ट करें",
        exportTemplateButton: "टेम्पलेट एक्सपोर्ट करें",
        importGuideTitle: "Import Guide",
        importGuideSubtitle: "Upload a CSV file with the following columns:",
        importGuideNote:
          "सिर्फ़ {{email}} ज़रूरी है। बाकी सारे कॉलम वैकल्पिक हैं और नीचे सेट किए डिफ़ॉल्ट से भर जाएँगे।",
        fileRequirementsTitle: "फ़ाइल की ज़रूरतें",
        fileRequirementFormat: "फ़ॉर्मैट: CSV (कॉमा से अलग वैल्यू, UTF-8 एन्कोडेड)",
        fileRequirementHeader: "पहली पंक्ति कॉलम नामों वाली हेडर पंक्ति होनी चाहिए",
        fileRequirementSize: "हर अपलोड का अधिकतम सुझाया साइज़: 50 MB",
        fileRequirementChunked:
          "लगभग 5 000 पंक्तियों से बड़ी फ़ाइलों में टाइमआउट से बचने के लिए {{chunkedProcessing}} चालू करें",
        chunkedProcessingLabel: "चंक्ड प्रोसेसिंग",
        downloadTemplateLink: "CSV टेम्पलेट डाउनलोड करें",
        loadingText: "लीड्स इम्पोर्ट हो रही हैं…",
        backgroundProcessingTitle: "बैकग्राउंड प्रोसेसिंग",
        backgroundProcessingNote:
          "बड़ा इम्पोर्ट जॉब के रूप में कतार में है: {{jobId}}। {{totalRows}} पंक्तियाँ बैकग्राउंड में प्रोसेस हो रही हैं।",
        checkJobStatusButton: "जॉब का स्टेटस जाँचें",
        stopJobButton: "जॉब रोकें",
        retryFailedButton: "रीट्राई फ़ेल हुई",
        statTotalRows: "कुल पंक्तियाँ",
        statImported: "इम्पोर्ट हुईं",
        statDuplicates: "डुप्लिकेट",
        statFailed: "फ़ेल",
        viewImportedLeadsButton: "इम्पोर्ट की गई लीड्स देखें",
        retryFailedWithCountButton: "फ़ेल हुई दोबारा करें ({{count}})",
        summaryTitle: "सारांश",
        summaryNewLeads: "नई लीड्स",
        summaryUpdated: "अपडेट किया गया",
        summarySkipped: "छोड़ा गया",
        successRateLabel: "सफलता दर",
        importErrorsTitle: "{{count}} Import Errors",
        errorRowLabel: "पंक्ति {{row}}",
        findLeadButton: "लीड खोजें",
      },
    },
    process: {
      tag: "इम्पोर्ट प्रोसेस",
      post: {
        title: "इम्पोर्ट जॉब प्रोसेस करें",
        titleShort: "इम्पोर्ट प्रोसेस करें",
        description: "लंबित CSV इम्पोर्ट जॉब प्रोसेस करें",
        container: {
          title: "इम्पोर्ट प्रोसेस कॉन्फ़िगरेशन",
          description: "इम्पोर्ट प्रोसेस के पैरामीटर सेट करें",
        },
        fields: {
          maxJobsPerRun: {
            label: "हर रन में अधिकतम जॉब",
            description: "हर रन में प्रोसेस होने वाले जॉब की अधिकतम संख्या",
          },
          maxRetriesPerJob: {
            label: "हर जॉब के अधिकतम रीट्राई",
            description: "हर जॉब के रीट्राई की अधिकतम संख्या",
          },
          dryRun: {
            label: "ड्राई रन",
            description: "बदलाव किए बिना चलाएँ",
          },
          selfTaskId: {
            label: "सेल्फ़ टास्क ID",
            description: "प्रोसेसिंग के बाद सेल्फ़-क्लीनअप के लिए इंटरनल टास्क ID",
          },
        },
        response: {
          jobsProcessed: "प्रोसेस हुए जॉब",
          totalRowsProcessed: "प्रोसेस हुई कुल पंक्तियाँ",
          successfulImports: "सफल इम्पोर्ट",
          failedImports: "फ़ेल इम्पोर्ट",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एक्सेस मना है",
          },
          server: {
            title: "सर्वर एरर",
            description: "इम्पोर्ट प्रोसेस करते समय एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
        },
        success: {
          title: "इम्पोर्ट प्रोसेसिंग पूरी हुई",
          description: "इम्पोर्ट जॉब सफलतापूर्वक प्रोसेस हुए",
        },
      },
    },
    widget: {
      header: {
        title: "इम्पोर्ट जॉब",
        newImport: "नया इम्पोर्ट",
      },
      filter: {
        all: "सभी",
        completed: "पूरा हुआ",
        failed: "फ़ेल",
        pending: "पेंडिंग",
        running: "चल रहा है",
      },
      loading: "इम्पोर्ट जॉब लोड हो रहे हैं…",
      empty: {
        title: "कोई इम्पोर्ट जॉब नहीं मिला",
        withFilter: "कोई दूसरा फ़िल्टर आज़माएँ या नया इम्पोर्ट शुरू करें।",
        withoutFilter: "अपना पहला इम्पोर्ट शुरू करें, वह यहाँ दिखेगा।",
        newImport: "नया इम्पोर्ट",
      },
    },
    jobs: {
      jobId: {
        category: "डेटा इम्पोर्ट",
        tags: {
          leads: "लीड",
          management: "मैनेजमेंट",
        },

        get: {
          title: "इम्पोर्ट जॉब लाएँ",
          description: "किसी ख़ास इम्पोर्ट जॉब का ब्योरा लाएँ",
          actions: {
            retry: "दोबारा कोशिश करें",
            stop: "स्टॉप",
            viewLeads: "लीड देखें",
          },
          jobId: {
            label: "जॉब ID",
            description: "इम्पोर्ट जॉब की यूनिक पहचान",
          },
          form: {
            title: "इम्पोर्ट जॉब की स्थिति",
            description: "इम्पोर्ट जॉब की मौजूदा स्थिति और प्रगति",
          },
          response: {
            title: "जॉब की जानकारी",
            description: "मौजूदा इम्पोर्ट जॉब का ब्योरा",
            info: {
              title: "जॉब की जानकारी",
              description: "जॉब का बुनियादी ब्योरा",
            },
            id: {
              content: "जॉब ID",
            },
            fileName: {
              content: "फ़ाइल का नाम",
            },
            status: {
              content: "जॉब की स्थिति",
            },
            progress: {
              title: "इम्पोर्ट प्रगति",
              description: "मौजूदा इम्पोर्ट प्रगति और आँकड़े",
            },
            totalRows: {
              content: "कुल पंक्तियाँ",
            },
            processedRows: {
              content: "प्रोसेस हुई पंक्तियाँ",
            },
            successfulImports: {
              content: "सफल इम्पोर्ट",
            },
            failedImports: {
              content: "फ़ेल इम्पोर्ट",
            },
            duplicateEmails: {
              content: "डुप्लिकेट ईमेल",
            },
            configuration: {
              title: "जॉब कॉन्फ़िगरेशन",
              description: "जॉब की मौजूदा कॉन्फ़िगरेशन सेटिंग्स",
            },
            currentBatchStart: {
              content: "मौजूदा बैच की शुरुआत",
            },
            batchSize: {
              content: "बैच साइज़",
            },
            retryCount: {
              content: "रीट्राई की गिनती",
            },
            maxRetries: {
              content: "अधिकतम रीट्राई",
            },
            error: {
              content: "एरर मैसेज",
            },
            timestamps: {
              title: "जॉब टाइमस्टैंप",
              description: "जॉब जीवनचक्र के टाइमस्टैंप",
            },
            createdAt: {
              content: "बनाने का समय",
            },
            updatedAt: {
              content: "अपडेट का समय",
            },
            startedAt: {
              content: "शुरू होने का समय",
            },
            completedAt: {
              content: "पूरा होने का समय",
            },
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "दी गई जॉब ID गलत है",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "जॉब देखने के लिए ऑथेंटिकेशन ज़रूरी है",
            },
            forbidden: {
              title: "एक्सेस नहीं मिला",
              description: "आपको यह जॉब देखने की अनुमति नहीं है",
            },
            notFound: {
              title: "जॉब नहीं मिली",
              description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
            },
            server: {
              title: "सर्वर एरर",
              description: "जॉब लाते समय एरर हुई",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "सर्वर से कनेक्ट नहीं हो सका",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "आपके बदलाव सेव नहीं हुए हैं",
            },
            conflict: {
              title: "टकराव",
              description: "जॉब लाते समय टकराव हुआ",
            },
          },
          success: {
            title: "सफल",
            description: "इम्पोर्ट जॉब सफलतापूर्वक मिल गई",
          },
        },
        patch: {
          title: "इम्पोर्ट जॉब अपडेट करें",
          description: "इम्पोर्ट जॉब की कॉन्फ़िगरेशन सेटिंग्स अपडेट करें",
          jobId: {
            label: "जॉब ID",
            description: "इम्पोर्ट जॉब की यूनिक पहचान",
          },
          form: {
            title: "जॉब सेटिंग्स अपडेट करें",
            description: "इम्पोर्ट जॉब का कॉन्फ़िगरेशन बदलें",
          },
          settings: {
            title: "जॉब सेटिंग्स",
            description: "इम्पोर्ट जॉब की कॉन्फ़िगरेशन सेटिंग्स",
          },
          batchSize: {
            label: "बैच साइज़",
            description: "हर बैच में प्रोसेस होने वाली पंक्तियों की संख्या",
            placeholder: "100",
          },
          maxRetries: {
            label: "अधिकतम रीट्राई",
            description: "फ़ेल पंक्तियों के लिए अधिकतम रीट्राई प्रयास",
            placeholder: "3",
          },
          response: {
            title: "अपडेट की गई जॉब जानकारी",
            description: "अपडेट की गई इम्पोर्ट जॉब का ब्योरा",
            info: {
              title: "जॉब की जानकारी",
              description: "जॉब का बुनियादी ब्योरा",
            },
            id: {
              content: "जॉब ID",
            },
            fileName: {
              content: "फ़ाइल का नाम",
            },
            status: {
              content: "जॉब की स्थिति",
            },
            progress: {
              title: "इम्पोर्ट प्रगति",
              description: "मौजूदा इम्पोर्ट प्रगति और आँकड़े",
            },
            totalRows: {
              content: "कुल पंक्तियाँ",
            },
            processedRows: {
              content: "प्रोसेस हुई पंक्तियाँ",
            },
            successfulImports: {
              content: "सफल इम्पोर्ट",
            },
            failedImports: {
              content: "फ़ेल इम्पोर्ट",
            },
            duplicateEmails: {
              content: "डुप्लिकेट ईमेल",
            },
            configuration: {
              title: "जॉब कॉन्फ़िगरेशन",
              description: "जॉब की मौजूदा कॉन्फ़िगरेशन सेटिंग्स",
            },
            currentBatchStart: {
              content: "मौजूदा बैच की शुरुआत",
            },
            batchSize: {
              content: "बैच साइज़",
            },
            retryCount: {
              content: "रीट्राई की गिनती",
            },
            maxRetries: {
              content: "अधिकतम रीट्राई",
            },
            error: {
              content: "एरर मैसेज",
            },
            timestamps: {
              title: "जॉब टाइमस्टैंप",
              description: "जॉब जीवनचक्र के टाइमस्टैंप",
            },
            createdAt: {
              content: "बनाने का समय",
            },
            updatedAt: {
              content: "अपडेट का समय",
            },
            startedAt: {
              content: "शुरू होने का समय",
            },
            completedAt: {
              content: "पूरा होने का समय",
            },
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "दिया गया डेटा गलत है",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "जॉब अपडेट करने के लिए ऑथेंटिकेशन ज़रूरी है",
            },
            forbidden: {
              title: "एक्सेस नहीं मिला",
              description: "आपको यह जॉब अपडेट करने की अनुमति नहीं है",
            },
            notFound: {
              title: "जॉब नहीं मिली",
              description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
            },
            server: {
              title: "सर्वर एरर",
              description: "जॉब अपडेट करते समय एरर हुई",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "सर्वर से कनेक्ट नहीं हो सका",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "आपके बदलाव सेव नहीं हुए हैं",
            },
            conflict: {
              title: "अपडेट में टकराव",
              description: "जॉब को किसी दूसरे यूज़र ने बदल दिया",
            },
          },
          success: {
            title: "सफल",
            description: "इम्पोर्ट जॉब सफलतापूर्वक अपडेट हुई",
          },
        },
        delete: {
          title: "इम्पोर्ट जॉब हटाएँ",
          description: "किसी ख़ास इम्पोर्ट जॉब को हटाएँ",
          jobId: {
            label: "जॉब ID",
            description: "हटाई जाने वाली इम्पोर्ट जॉब की यूनिक पहचान",
          },
          form: {
            title: "इम्पोर्ट जॉब हटाएँ",
            description: "इम्पोर्ट जॉब हटाने की पुष्टि करें",
          },
          response: {
            title: "हटाने का नतीजा",
            description: "हटाने की कार्रवाई का नतीजा",
            success: {
              content: "सफलता स्टेटस",
            },
            message: {
              content: "हटाने का संदेश",
            },
          },
          errors: {
            validation: {
              title: "वैलिडेशन एरर",
              description: "दी गई जॉब ID गलत है",
            },
            unauthorized: {
              title: "अनधिकृत",
              description: "जॉब हटाने के लिए ऑथेंटिकेशन ज़रूरी है",
            },
            forbidden: {
              title: "एक्सेस नहीं मिला",
              description: "आपको यह जॉब हटाने की अनुमति नहीं है",
            },
            notFound: {
              title: "जॉब नहीं मिली",
              description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
            },
            server: {
              title: "सर्वर एरर",
              description: "जॉब हटाते समय एरर हुई",
            },
            unknown: {
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
            },
            network: {
              title: "नेटवर्क एरर",
              description: "सर्वर से कनेक्ट नहीं हो सका",
            },
            unsavedChanges: {
              title: "बिना सेव किए बदलाव",
              description: "आपके बदलाव सेव नहीं हुए हैं",
            },
            conflict: {
              title: "हटाने में टकराव",
              description: "जो जॉब अभी प्रोसेस हो रही है उसे हटाया नहीं जा सकता",
            },
          },
          success: {
            title: "सफल",
            description: "इम्पोर्ट जॉब सफलतापूर्वक हट गई",
          },
        },
        retry: {
          category: "डेटा इम्पोर्ट",
          tags: {
            leads: "लीड",
            management: "मैनेजमेंट",
          },

          post: {
            title: "इम्पोर्ट जॉब रीट्राई करें",
            description: "फ़ेल हुई इम्पोर्ट जॉब रीट्राई करें",
            jobId: {
              label: "जॉब ID",
              description: "रीट्राई की जाने वाली इम्पोर्ट जॉब की यूनिक पहचान",
            },
            form: {
              title: "इम्पोर्ट जॉब रीट्राई करें",
              description: "फ़ेल हुई इम्पोर्ट जॉब रीट्राई करें",
            },
            response: {
              title: "रीट्राई का नतीजा",
              description: "रीट्राई की कार्रवाई का नतीजा",
              success: {
                content: "सफलता स्टेटस",
              },
              message: {
                content: "रीट्राई संदेश",
              },
            },
            errors: {
              validation: {
                title: "वैलिडेशन एरर",
                description: "दी गई जॉब ID गलत है",
              },
              unauthorized: {
                title: "अनधिकृत",
                description: "जॉब रीट्राई करने के लिए ऑथेंटिकेशन ज़रूरी है",
              },
              forbidden: {
                title: "एक्सेस नहीं मिला",
                description: "आपको यह जॉब रीट्राई करने की अनुमति नहीं है",
              },
              notFound: {
                title: "जॉब नहीं मिली",
                description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
              },
              server: {
                title: "सर्वर एरर",
                description: "जॉब रीट्राई करते समय एरर हुई",
              },
              unknown: {
                title: "अज्ञात एरर",
                description: "कोई अनपेक्षित एरर आया",
              },
              network: {
                title: "नेटवर्क एरर",
                description: "सर्वर से कनेक्ट नहीं हो सका",
              },
              unsavedChanges: {
                title: "बिना सेव किए बदलाव",
                description: "आपके बदलाव सेव नहीं हुए हैं",
              },
              conflict: {
                title: "रीट्राई में टकराव",
                description:
                  "जो जॉब अभी प्रोसेस हो रही है उसे रीट्राई नहीं किया जा सकता",
              },
            },
            success: {
              title: "सफल",
              description: "इम्पोर्ट जॉब सफलतापूर्वक रीट्राई हुई",
            },
          },
          widget: {
            title: "इम्पोर्ट जॉब रीट्राई करें",
            successMessage: "जॉब रीट्राई सफलतापूर्वक शुरू हुई",
          },
        },
        stop: {
          category: "डेटा इम्पोर्ट",
          tags: {
            leads: "लीड",
            management: "मैनेजमेंट",
          },

          post: {
            title: "इम्पोर्ट जॉब रोकें",
            description: "चल रही इम्पोर्ट जॉब रोकें",
            jobId: {
              label: "जॉब ID",
              description: "रोकी जाने वाली इम्पोर्ट जॉब की यूनिक पहचान",
            },
            form: {
              title: "इम्पोर्ट जॉब रोकें",
              description: "चल रही इम्पोर्ट जॉब रोकें",
            },
            response: {
              title: "रोकने का नतीजा",
              description: "रोकने की कार्रवाई का नतीजा",
              success: {
                content: "सफलता स्टेटस",
              },
              message: {
                content: "रोकने का संदेश",
              },
            },
            errors: {
              validation: {
                title: "वैलिडेशन एरर",
                description: "दी गई जॉब ID गलत है",
              },
              unauthorized: {
                title: "अनधिकृत",
                description: "जॉब रोकने के लिए ऑथेंटिकेशन ज़रूरी है",
              },
              forbidden: {
                title: "एक्सेस नहीं मिला",
                description: "आपको यह जॉब रोकने की अनुमति नहीं है",
              },
              notFound: {
                title: "जॉब नहीं मिली",
                description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
              },
              server: {
                title: "सर्वर एरर",
                description: "जॉब रोकते समय एरर हुई",
              },
              unknown: {
                title: "अज्ञात एरर",
                description: "कोई अनपेक्षित एरर आया",
              },
              network: {
                title: "नेटवर्क एरर",
                description: "सर्वर से कनेक्ट नहीं हो सका",
              },
              unsavedChanges: {
                title: "बिना सेव किए बदलाव",
                description: "आपके बदलाव सेव नहीं हुए हैं",
              },
              conflict: {
                title: "रोकने में टकराव",
                description: "जो जॉब अभी प्रोसेस नहीं हो रही उसे रोका नहीं जा सकता",
              },
            },
            success: {
              title: "सफल",
              description: "इम्पोर्ट जॉब सफलतापूर्वक रुकी",
            },
          },
          widget: {
            title: "इम्पोर्ट जॉब रोकें",
            successMessage: "जॉब सफलतापूर्वक रुक गई",
          },
        },
        widget: {
          status: {
            title: "इम्पोर्ट जॉब की स्थिति",
            loadingJobStatus: "जॉब की स्थिति लोड हो रही है…",
            totalRows: "कुल पंक्तियाँ",
            processed: "प्रोसेस हुआ",
            imported: "Imported",
            failed: "फ़ेल",
            duplicates: "डुप्लिकेट",
            progress: "प्रगति",
            configurationTitle: "कॉन्फ़िगरेशन",
            batchSize: "बैच साइज़",
            batchStart: "बैच की शुरुआत",
            retries: "रीट्राई",
            timestampsTitle: "टाइमस्टैम्प",
            created: "बनाया गया",
            started: "शुरू हुआ",
            completed: "पूरा हुआ",
            jobStatus: {
              enums: {
                csvImportJobStatus: {
                  pending: "पेंडिंग",
                  processing: "प्रोसेस हो रहा है",
                  completed: "पूरा हुआ",
                  failed: "फ़ेल",
                },
              },
            },
          },
          retry: {
            title: "इम्पोर्ट जॉब रीट्राई करें",
            loadingRetrying: "जॉब रीट्राई हो रही है…",
            successMessage: "जॉब सफलतापूर्वक रीट्राई हुई",
            failureMessage: "रीट्राई फ़ेल हुई",
            viewJobStatus: "जॉब की स्थिति देखें",
            viewLeads: "लीड देखें",
          },
          stop: {
            title: "इम्पोर्ट जॉब रोकें",
            loadingStopping: "जॉब रोकी जा रही है…",
            successMessage: "जॉब सफलतापूर्वक रुकी",
            failureMessage: "रोकना फ़ेल हुआ",
            viewLeads: "लीड देखें",
            startNewImport: "नया इम्पोर्ट शुरू करें",
          },
        },
      },
    },
    status: {
      category: "डेटा इम्पोर्ट",
      tags: {
        import: "Import",
        jobs: "जॉब्स",
        list: "लिस्ट",
      },

      get: {
        title: "इम्पोर्ट जॉब का स्टेटस",
        description: "CSV इम्पोर्ट जॉब देखें और मॉनिटर करें",
        form: {
          title: "जॉब फ़िल्टर",
          description: "स्टेटस और पेजिनेशन से इम्पोर्ट जॉब फ़िल्टर करें",
        },
        filters: {
          title: "फ़िल्टर",
          description: "इम्पोर्ट जॉब के फ़िल्टर विकल्प",
        },
        status: {
          label: "जॉब की स्थिति",
          description: "जॉब स्टेटस से फ़िल्टर करें",
          placeholder: "स्टेटस चुनें",
        },
        limit: {
          label: "प्रति पेज नतीजे",
          description: "लौटाए जाने वाले जॉब की संख्या",
          placeholder: "50",
        },
        offset: {
          label: "पेज ऑफ़सेट",
          description: "छोड़े जाने वाले जॉब की संख्या",
          placeholder: "0",
        },
        response: {
          title: "इम्पोर्ट जॉब",
          description: "इम्पोर्ट जॉब की लिस्ट और उनका मौजूदा स्टेटस",
          items: {
            title: "जॉब लिस्ट",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "फ़िल्टर पैरामीटर गलत हैं",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "इम्पोर्ट जॉब देखने के लिए लॉगिन ज़रूरी है",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "इम्पोर्ट जॉब के लिए एक्सेस की अनुमति नहीं",
          },
          notFound: {
            title: "नहीं मिला",
            description: "कोई इम्पोर्ट जॉब नहीं मिला",
          },
          server: {
            title: "सर्वर एरर",
            description: "जॉब लाते समय इंटरनल सर्वर एरर",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "जॉब लाते समय नेटवर्क एरर",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "कुछ बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
        },
        success: {
          title: "जॉब मिल गए",
          description: "इम्पोर्ट जॉब की लिस्ट मिल गई",
        },
      },
      widget: {
        status: {
          pending: "पेंडिंग",
          running: "चल रहा है",
          completed: "पूरा हुआ",
          failed: "फ़ेल",
          stopped: "रुके हुए",
        },
        filter: {
          all: "सभी",
          pending: "पेंडिंग",
          running: "चल रहा है",
          completed: "पूरा हुआ",
          failed: "फ़ेल",
        },
        progress: {
          rows: "पंक्तियाँ",
        },
        job: {
          total: "कुल:",
          processed: "प्रोसेस हुईं:",
          ok: "ठीक:",
          fail: "फ़ेल:",
          created: "बनाया गया:",
          done: "पूरी:",
        },
        header: {
          title: "इम्पोर्ट जॉब",
          newImport: "नया इम्पोर्ट",
        },
        loading: "इम्पोर्ट जॉब लोड हो रहे हैं…",
        empty: {
          title: "कोई इम्पोर्ट जॉब नहीं मिला",
          withFilter: "कोई दूसरा फ़िल्टर आज़माएँ या नया इम्पोर्ट शुरू करें।",
          withoutFilter: "अपना पहला इम्पोर्ट शुरू करें, वह यहाँ दिखेगा।",
          newImport: "नया इम्पोर्ट",
        },
      },
    },
    csv: {
      post: {
        title: "CSV डेटा इम्पोर्ट करें",
        description: "स्मार्ट प्रोसेसिंग और वैलिडेशन के साथ CSV फ़ाइलों से डेटा इम्पोर्ट करें",
        form: {
          title: "CSV इम्पोर्ट कॉन्फ़िगरेशन",
          description: "बेहतर नतीजों के लिए अपनी CSV इम्पोर्ट सेटिंग्स सेट करें",
        },
        fileSection: {
          title: "फ़ाइल अपलोड",
          description: "अपनी CSV फ़ाइल चुनें और टारगेट डोमेन बताएँ",
        },
        file: {
          label: "CSV फ़ाइल",
          description: "अपलोड के लिए CSV फ़ाइल चुनें (अधिकतम 10MB)",
          placeholder: "CSV फ़ाइल चुनें...",
          helpText:
            "सपोर्टेड फ़ॉर्मैट: कॉमा से अलग वैल्यू वाली CSV। पहली पंक्ति में कॉलम हेडर होने चाहिए।",
        },
        fileName: {
          label: "फ़ाइल का नाम",
          description: "इस इम्पोर्ट का नाम (आपके रेफ़रेंस के लिए)",
          placeholder: "जैसे जनवरी 2024 लीड्स इम्पोर्ट",
        },
        domain: {
          label: "इम्पोर्ट डोमेन",
          description: "आप किस तरह का डेटा इम्पोर्ट कर रहे हैं?",
          placeholder: "डेटा का प्रकार चुनें...",
        },
        processingSection: {
          title: "प्रोसेसिंग विकल्प",
          description: "तय करें कि आपका डेटा कैसे प्रोसेस हो",
        },
        skipDuplicates: {
          label: "डुप्लिकेट छोड़ें",
          description: "डुप्लिकेट ईमेल पते वाले रिकॉर्ड छोड़ें",
          helpText: "सुझाव: एक ही संपर्क दो बार इम्पोर्ट होने से बचाता है",
        },
        updateExisting: {
          label: "मौजूदा अपडेट करें",
          description: "CSV के नए डेटा से मौजूदा रिकॉर्ड अपडेट करें",
          helpText: "निशान न लगाने पर मौजूदा रिकॉर्ड जैसे हैं वैसे रहेंगे",
        },
        useChunkedProcessing: {
          label: "बैकग्राउंड प्रोसेसिंग",
          description: "बड़ी फ़ाइलें बैकग्राउंड में प्रोसेस करें",
          helpText: "500 से ज़्यादा रिकॉर्ड वाली फ़ाइलों के लिए सुझाव",
        },
        batchSize: {
          label: "बैच साइज़",
          description: "एक बार में प्रोसेस होने वाले रिकॉर्ड की संख्या",
          placeholder: "100",
          helpText: "छोटे बैच ज़्यादा स्थिर हैं, बड़े बैच तेज़ हैं",
        },
        defaultsSection: {
          title: "डिफ़ॉल्ट वैल्यू (वैकल्पिक)",
          description: "जिन रिकॉर्ड में यह जानकारी नहीं है उनके लिए डिफ़ॉल्ट वैल्यू सेट करें",
        },
        defaultCountry: {
          label: "डिफ़ॉल्ट देश",
          description: "बिना लोकेशन वाले रिकॉर्ड का देश",
          placeholder: "देश चुनें...",
        },
        defaultLanguage: {
          label: "डिफ़ॉल्ट भाषा",
          description: "बिना भाषा पसंद वाले रिकॉर्ड की भाषा",
          placeholder: "भाषा चुनें...",
        },
        response: {
          title: "इम्पोर्ट के नतीजे",
          description: "आपके CSV इम्पोर्ट का सारांश",
          basicResults: {
            title: "बुनियादी नतीजे",
            description: "इम्पोर्ट के मुख्य आँकड़े",
          },
          batchId: {
            label: "बैच ID",
          },
          totalRows: {
            label: "कुल पंक्तियाँ",
          },
          isChunkedProcessing: {
            label: "बैकग्राउंड प्रोसेसिंग",
          },
          jobId: {
            label: "जॉब ID",
          },
          statistics: {
            title: "इम्पोर्ट आँकड़े",
            description: "इम्पोर्ट ऑपरेशन का विस्तृत ब्योरा",
          },
          successfulImports: {
            label: "सफल इम्पोर्ट",
          },
          failedImports: {
            label: "फ़ेल इम्पोर्ट",
          },
          duplicateEmails: {
            label: "डुप्लिकेट ईमेल",
          },
          processingTimeMs: {
            label: "प्रोसेसिंग टाइम (ms)",
          },
          summary: {
            title: "इम्पोर्ट सारांश",
            description: "इम्पोर्ट नतीजों का सार",
          },
          newRecords: {
            label: "नए रिकॉर्ड",
          },
          updatedRecords: {
            label: "अपडेट हुए रिकॉर्ड",
          },
          skippedDuplicates: {
            label: "छोड़े गए डुप्लिकेट",
          },
          errors: {
            title: "एरर का ब्योरा",
            row: {
              label: "पंक्ति",
            },
            email: {
              label: "ईमेल",
            },
            error: {
              label: "एरर",
            },
          },
          nextSteps: {
            title: "अगले कदम",
            item: {
              label: "अगला कदम",
            },
          },
        },
        errors: {
          validation: {
            title: "इम्पोर्ट डेटा गलत है",
            description: "अपनी CSV फ़ाइल और सेटिंग्स जाँचें",
            emptyFile: "CSV फ़ाइल का कंटेंट ज़रूरी है",
            emptyFileName: "इस इम्पोर्ट का नाम दें",
            invalidDomain: "सही इम्पोर्ट डोमेन चुनें",
            invalidBatchSize: "बैच साइज़ 10 से 1000 के बीच होना चाहिए",
            fileTooLarge:
              "फ़ाइल साइज़ 10MB की सीमा से ज़्यादा है। बैकग्राउंड प्रोसेसिंग इस्तेमाल करें।",
          },
          unauthorized: {
            title: "एक्सेस नहीं मिला",
            description: "आपको डेटा इम्पोर्ट करने की अनुमति नहीं है",
          },
          fileTooLarge: {
            title: "फ़ाइल बहुत बड़ी है",
            description: "चुनी फ़ाइल 10MB की अधिकतम सीमा से बड़ी है",
          },
          server: {
            title: "इम्पोर्ट फ़ेल हुआ",
            description: "आपका इम्पोर्ट प्रोसेस करते समय एरर आया। दोबारा कोशिश करें।",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "इम्पोर्ट के दौरान नेटवर्क कनेक्शन फ़ेल हुआ",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "आपको यह इम्पोर्ट करने की अनुमति नहीं है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "इम्पोर्ट रिसोर्स नहीं मिला",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "डेटा टकराव",
            description: "मौजूदा डेटा से टकराव हुआ",
          },
        },
        success: {
          title: "इम्पोर्ट सफल",
          description: "आपका CSV डेटा इम्पोर्ट हो गया",
        },
      },
    },
    enum: {
      status: {
        pending: {
          label: "पेंडिंग",
          description: "जॉब प्रोसेस होने का इंतज़ार कर रहा है",
        },
        processing: {
          label: "प्रोसेस हो रहा है",
          description: "जॉब अभी प्रोसेस हो रहा है",
        },
        completed: {
          label: "पूरा हुआ",
          description: "जॉब सफलतापूर्वक पूरा हुआ",
        },
        failed: {
          label: "फ़ेल",
          description: "जॉब में एरर आया",
        },
        cancelled: {
          label: "रद्द",
          description: "जॉब यूज़र ने रद्द किया",
        },
        paused: {
          label: "रुका हुआ",
          description: "जॉब की प्रोसेसिंग कुछ समय के लिए रुकी है",
        },
      },
      domain: {
        leads: {
          label: "लीड",
          description: "संभावित ग्राहक और बिज़नेस संपर्क",
        },
        contacts: {
          label: "संपर्क",
          description: "सामान्य संपर्क जानकारी और पता-पुस्तिका",
        },
        businessData: {
          label: "बिज़नेस डेटा",
          description: "कंपनी की जानकारी और बिज़नेस प्रोफ़ाइल",
        },
        emails: {
          label: "ईमेल लिस्ट",
          description: "ईमेल मार्केटिंग लिस्ट और कैंपेन",
        },
        users: {
          label: "यूज़र",
          description: "सिस्टम यूज़र और अकाउंट की जानकारी",
        },
        templates: {
          label: "टेम्पलेट",
          description: "ईमेल टेम्पलेट और कंटेंट",
        },
      },
      format: {
        csv: {
          label: "CSV फ़ाइल",
          description: "कॉमा से अलग वैल्यू (सबसे आम)",
        },
        xlsx: {
          label: "Excel फ़ाइल",
          description: "Microsoft Excel स्प्रेडशीट",
        },
        json: {
          label: "JSON फ़ाइल",
          description: "JavaScript Object Notation डेटा",
        },
        tsv: {
          label: "TSV फ़ाइल",
          description: "टैब से अलग वैल्यू",
        },
      },
      processing: {
        immediate: {
          label: "अभी प्रोसेस करें",
          description: "फ़ाइल तुरंत प्रोसेस करें (सबसे तेज़)",
        },
        background: {
          label: "बैकग्राउंड",
          description: "बैकग्राउंड में प्रोसेस करें (बड़ी फ़ाइलों के लिए)",
        },
        scheduled: {
          label: "बाद के लिए शेड्यूल करें",
          description: "प्रोसेसिंग को किसी ख़ास समय पर शेड्यूल करें",
        },
      },
      errorType: {
        validation: {
          label: "वैलिडेशन एरर",
          description: "डेटा तय फ़ॉर्मैट या नियमों पर खरा नहीं उतरता",
        },
        duplicate: {
          label: "डुप्लिकेट डेटा",
          description: "रिकॉर्ड सिस्टम में पहले से है",
        },
        format: {
          label: "फ़ॉर्मैट एरर",
          description: "फ़ाइल का फ़ॉर्मैट गलत या ख़राब है",
        },
        processing: {
          label: "प्रोसेसिंग एरर",
          description: "डेटा प्रोसेसिंग के दौरान एरर आया",
        },
        system: {
          label: "सिस्टम एरर",
          description: "इंटरनल सिस्टम एरर",
        },
      },
      batchSize: {
        small: {
          label: "छोटा (50)",
          description: "टेस्टिंग या छोटे इम्पोर्ट के लिए सबसे अच्छा",
        },
        medium: {
          label: "मध्यम (100)",
          description: "ज़्यादातर इम्पोर्ट के लिए सुझाया गया",
        },
        large: {
          label: "बड़ा (250)",
          description: "सरल डेटा वाली बड़ी फ़ाइलों के लिए अच्छा",
        },
        xlarge: {
          label: "अतिरिक्त बड़ा (500)",
          description: "बहुत बड़ी फ़ाइलों के लिए (एडवांस्ड यूज़र)",
        },
      },
    },
    nextSteps: {
      reviewErrors: "गड़बड़ी समझने के लिए एरर की जानकारी देखें",
      checkDuplicates: "डुप्लिकेट हैंडलिंग की सेटिंग्स बदलने पर विचार करें",
      reviewLeads: "इम्पोर्ट की गई लीड्स को लीड्स मैनेजमेंट सेक्शन में देखें",
      startCampaign: "अपनी नई लीड्स के साथ ईमेल कैंपेन शुरू करने पर विचार करें",
      reviewContacts: "इम्पोर्ट किए संपर्कों को कॉन्टैक्ट्स सेक्शन में देखें",
      organizeContacts: "अपने संपर्कों को ग्रुप या टैग में व्यवस्थित करें",
      reviewImported: "इम्पोर्ट किया डेटा संबंधित सेक्शन में देखें",
      monitorProgress: "जॉब हिस्ट्री में प्रगति देखते रहें",
      checkJobsList: "विस्तृत स्टेटस अपडेट के लिए जॉब लिस्ट देखें",
    },
    errors: {
      cancel: {
        server: "इम्पोर्ट जॉब रद्द नहीं हो पाया",
      },
      retry: {
        server: "इम्पोर्ट जॉब दोबारा नहीं चल पाया",
      },
      delete: {
        server: "इम्पोर्ट जॉब डिलीट नहीं हो पाया",
      },
      status: {
        server: "जॉब का स्टेटस नहीं मिल पाया",
      },
    },
    error: {
      default: "एरर आया",
    },
    enums: {
      csvImportJobStatus: {
        pending: "पेंडिंग",
        processing: "प्रोसेस हो रहा है",
        completed: "पूरा हुआ",
        failed: "फ़ेल",
      },
      csvImportJobAction: {
        retry: "दोबारा कोशिश करें",
        delete: "हटाएँ",
        stop: "स्टॉप",
      },
      importMode: {
        createOnly: "सिर्फ़ बनाएँ",
        updateOnly: "सिर्फ़ अपडेट करें",
        createOrUpdate: "बनाएँ या अपडेट करें",
        skipDuplicates: "डुप्लिकेट छोड़ें",
      },
      importFormat: {
        csv: "CSV",
        tsv: "TSV",
        json: "JSON",
      },
      importProcessingType: {
        immediate: "तुरंत",
        chunked: "चंक्ड",
        scheduled: "शेड्यूल्ड",
      },
      importErrorType: {
        validationError: "वैलिडेशन एरर",
        duplicateEmail: "डुप्लिकेट ईमेल",
        invalidFormat: "गलत फ़ॉर्मैट",
        missingRequiredField: "ज़रूरी फ़ील्ड गायब",
        processingError: "प्रोसेसिंग एरर",
        systemError: "सिस्टम एरर",
      },
      batchProcessingStatus: {
        pending: "पेंडिंग",
        processing: "प्रोसेस हो रहा है",
        completed: "पूरा हुआ",
        failed: "फ़ेल",
        retrying: "रीट्राई हो रहा है",
      },
      importPriority: {
        low: "लो",
        normal: "सामान्य",
        high: "हाई",
        urgent: "अर्जेंट",
      },
      importSource: {
        webUpload: "वेब अपलोड",
        apiUpload: "API अपलोड",
        scheduledImport: "शेड्यूल्ड इम्पोर्ट",
        bulkOperation: "बल्क ऑपरेशन",
      },
      csvDelimiter: {
        comma: "कॉमा",
        semicolon: "सेमीकोलन",
        tab: "टैब",
        pipe: "पाइप",
      },
      importValidationLevel: {
        strict: "सख़्त",
        moderate: "मॉडरेट करें",
        lenient: "नरम",
      },
      importNotificationType: {
        email: "ईमेल",
        inApp: "इन-ऐप",
        webhook: "वेबहुक",
        none: "कोई नहीं",
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
  },
  lead: {
    id: {
      category: "लीड",
      tags: {
        leads: "लीड",
        management: "मैनेजमेंट",
      },

      get: {
        title: "लीड का ब्योरा लाएँ",
        description: "किसी ख़ास लीड की विस्तृत जानकारी लाएँ",
        backButton: {
          label: "लीड पर वापस",
        },
        editButton: {
          label: "लीड एडिट करें",
        },
        deleteButton: {
          label: "लीड हटाएँ",
        },
        id: {
          label: "लीड ID",
          description: "लीड की यूनिक पहचान",
        },
        form: {
          title: "लीड ब्योरे की रिक्वेस्ट",
          description: "लीड की जानकारी लाने के रिक्वेस्ट पैरामीटर",
        },
        response: {
          title: "लीड की जानकारी",
          description: "लीड का पूरा ब्योरा और हिस्ट्री",
          basicInfo: {
            title: "बुनियादी जानकारी",
            description: "लीड की मुख्य पहचान और स्थिति",
          },
          id: {
            content: "लीड ID",
          },
          email: {
            content: "ईमेल पता",
          },
          businessName: {
            content: "बिज़नेस का नाम",
          },
          contactName: {
            content: "संपर्क का नाम",
          },
          status: {
            content: "लीड की स्थिति",
          },
          contactDetails: {
            title: "संपर्क ब्योरा",
            description: "संपर्क जानकारी और पसंद",
          },
          phone: {
            content: "फ़ोन नंबर",
          },
          website: {
            content: "वेबसाइट URL",
          },
          country: {
            content: "देश",
          },
          language: {
            content: "भाषा",
          },
          campaignTracking: {
            title: "कैंपेन ट्रैकिंग",
            description: "ईमेल कैंपेन और ट्रैकिंग की जानकारी",
          },
          source: {
            content: "लीड का स्रोत",
          },
          currentCampaignStage: {
            content: "मौजूदा कैंपेन चरण",
          },
          emailJourneyVariant: {
            content: "ईमेल जर्नी वेरिएंट",
          },
          emailsSent: {
            content: "भेजे गए ईमेल",
          },
          lastEmailSentAt: {
            content: "आख़िरी भेजा ईमेल",
          },
          engagement: {
            title: "एंगेजमेंट मेट्रिक",
            description: "ईमेल एंगेजमेंट और इंटरैक्शन का डेटा",
          },
          emailsOpened: {
            content: "खोले गए ईमेल",
          },
          emailsClicked: {
            content: "क्लिक किए गए ईमेल",
          },
          lastEngagementAt: {
            content: "आख़िरी एंगेजमेंट",
          },
          unsubscribedAt: {
            content: "अनसब्सक्राइब का समय",
          },
          conversion: {
            title: "कन्वर्ज़न ट्रैकिंग",
            description: "लीड कन्वर्ज़न और माइलस्टोन ट्रैकिंग",
          },
          convertedUserId: {
            content: "कन्वर्ट हुए यूज़र की ID",
          },
          convertedAt: {
            content: "कन्वर्ट होने का समय",
          },
          signedUpAt: {
            content: "साइन अप का समय",
          },
          subscriptionConfirmedAt: {
            content: "सब्सक्रिप्शन पुष्टि का समय",
          },
          metadata: {
            title: "अतिरिक्त जानकारी",
            description: "नोट्स और मेटाडेटा",
            content: "मेटाडेटा",
          },
          notes: {
            content: "नोट्स",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
          },
          identity: {
            title: "डिवाइस और पहचान",
            description: "ट्रैकिंग पहचान और डिवाइस की जानकारी",
          },
          ipAddress: {
            content: "IP पता",
          },
          userAgent: {
            content: "यूज़र एजेंट",
          },
          deviceType: {
            content: "डिवाइस प्रकार",
          },
          browser: {
            content: "ब्राउज़र",
          },
          os: {
            content: "ऑपरेटिंग सिस्टम",
          },
          referralCode: {
            content: "रेफ़रल कोड",
          },
          lifecycle: {
            title: "जीवनचक्र",
            description: "जीवनचक्र के अतिरिक्त टाइमस्टैंप",
          },
          bouncedAt: {
            content: "बाउंस का समय",
          },
          invalidAt: {
            content: "अमान्य होने का समय",
          },
          campaignStartedAt: {
            content: "कैंपेन शुरू होने का समय",
          },
          linkedLeads: {
            title: "जुड़ी हुई लीड",
            description: "वे लीड जो एक ही व्यक्ति की पहचानी गईं",
            linkedLeadId: {
              content: "जुड़ी लीड की ID",
            },
            linkReason: {
              content: "जुड़ाव की वजह",
            },
            linkedAt: {
              content: "जुड़ने का समय",
            },
            email: {
              content: "ईमेल",
            },
            businessName: {
              content: "बिज़नेस का नाम",
            },
            status: {
              content: "स्टेटस",
            },
            ipAddress: {
              content: "IP पता",
            },
            userAgent: {
              content: "यूज़र एजेंट",
            },
            createdAt: {
              content: "बनाने का समय",
            },
          },
          linkedUsers: {
            title: "जुड़े यूज़र अकाउंट",
            description: "इस लीड से जुड़े यूज़र अकाउंट",
            userId: {
              content: "यूज़र ID",
            },
            linkReason: {
              content: "जुड़ाव की वजह",
            },
            linkedAt: {
              content: "जुड़ने का समय",
            },
            email: {
              content: "ईमेल",
            },
            publicName: {
              content: "डिस्प्ले नाम",
            },
          },
          referralHistory: {
            title: "रेफ़रल हिस्ट्री",
            description: "साइन अप से पहले इस लीड ने जिन रेफ़रल कोड पर क्लिक किया",
            code: {
              content: "रेफ़रल कोड",
            },
            ownerUserId: {
              content: "कोड का मालिक",
            },
            clickedAt: {
              content: "क्लिक का समय",
            },
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "दी गई लीड ID गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लीड का ब्योरा देखने के लिए ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "एक्सेस नहीं मिला",
            description: "आपको यह लीड देखने की अनुमति नहीं है",
          },
          notFound: {
            title: "लीड नहीं मिली",
            description: "दी गई ID की कोई लीड नहीं मिली",
          },
          server: {
            title: "सर्वर एरर",
            description: "लीड का ब्योरा लाते समय एरर हुई",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "सर्वर से कनेक्ट नहीं हो सका",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
          conflict: {
            title: "डेटा टकराव",
            description: "लीड का डेटा बदल गया है",
          },
        },
        success: {
          title: "सफल",
          description: "लीड का ब्योरा सफलतापूर्वक मिल गया",
        },
      },
      patch: {
        title: "लीड अपडेट करें",
        description: "लीड की जानकारी और स्थिति अपडेट करें",
        backButton: {
          label: "लीड पर वापस",
        },
        deleteButton: {
          label: "लीड हटाएँ",
        },
        submitButton: {
          label: "लीड अपडेट करें",
          loadingText: "लीड अपडेट हो रही है...",
        },
        id: {
          label: "लीड ID",
          description: "अपडेट की जाने वाली लीड की यूनिक पहचान",
        },
        form: {
          title: "लीड अपडेट करें",
          description: "लीड की जानकारी बदलें",
        },
        updates: {
          title: "लीड अपडेट",
          description: "अपडेट करने के फ़ील्ड",
        },
        basicInfo: {
          title: "बुनियादी जानकारी",
          description: "लीड की मुख्य जानकारी अपडेट करें",
        },
        email: {
          label: "ईमेल पता",
          description: "लीड का ईमेल पता",
          placeholder: "email@example.com",
        },
        businessName: {
          label: "बिज़नेस का नाम",
          description: "व्यवसाय का नाम",
          placeholder: "Acme Corporation",
        },
        contactName: {
          label: "संपर्क का नाम",
          description: "मुख्य संपर्क व्यक्ति",
          placeholder: "राहुल शर्मा",
        },
        status: {
          label: "लीड की स्थिति",
          description: "लीड की मौजूदा स्थिति",
          placeholder: "स्टेटस चुनें",
        },
        contactDetails: {
          title: "संपर्क ब्योरा",
          description: "संपर्क जानकारी अपडेट करें",
        },
        phone: {
          label: "फ़ोन नंबर",
          description: "संपर्क फ़ोन नंबर",
          placeholder: "+1234567890",
        },
        website: {
          label: "वेबसाइट",
          description: "व्यवसाय की वेबसाइट URL",
          placeholder: "https://example.com",
        },
        country: {
          label: "देश",
          description: "व्यवसाय का देश",
          placeholder: "देश चुनें",
        },
        language: {
          label: "भाषा",
          description: "पसंदीदा भाषा",
          placeholder: "भाषा चुनें",
        },
        campaignManagement: {
          title: "कैंपेन मैनेजमेंट",
          description: "कैंपेन सेटिंग्स मैनेज करें",
        },
        source: {
          label: "लीड का स्रोत",
          description: "लीड कहाँ से आई",
          placeholder: "स्रोत चुनें",
        },
        currentCampaignStage: {
          label: "कैंपेन चरण",
          description: "मौजूदा ईमेल कैंपेन चरण",
          placeholder: "चरण चुनें",
        },
        additionalDetails: {
          title: "अतिरिक्त ब्योरा",
          description: "नोट्स और मेटाडेटा",
        },
        notes: {
          label: "नोट्स",
          description: "लीड के बारे में आंतरिक नोट्स",
          placeholder: "यहाँ नोट्स जोड़ें",
        },
        metadata: {
          label: "मेटाडेटा",
          description: "अतिरिक्त मेटाडेटा (JSON)",
          placeholder: '{"key": "value"}',
        },
        convertedUserId: {
          label: "कन्वर्ट हुए यूज़र की ID",
          description: "कन्वर्ट हुए यूज़र अकाउंट की ID",
          placeholder: "यूज़र ID",
        },
        subscriptionConfirmedAt: {
          label: "सब्सक्रिप्शन पुष्टि का समय",
          description: "सब्सक्रिप्शन पक्का होने की तारीख़",
          placeholder: "तारीख़ चुनें",
        },
        response: {
          title: "अपडेट की गई लीड",
          description: "अपडेट की गई लीड की जानकारी",
          basicInfo: {
            title: "बुनियादी जानकारी",
            description: "अपडेट की गई मुख्य लीड जानकारी",
          },
          id: {
            content: "लीड ID",
          },
          email: {
            content: "ईमेल पता",
          },
          businessName: {
            content: "बिज़नेस का नाम",
          },
          contactName: {
            content: "संपर्क का नाम",
          },
          status: {
            content: "लीड की स्थिति",
          },
          contactDetails: {
            title: "संपर्क ब्योरा",
            description: "अपडेट की गई संपर्क जानकारी",
          },
          phone: {
            content: "फ़ोन नंबर",
          },
          website: {
            content: "वेबसाइट URL",
          },
          country: {
            content: "देश",
          },
          language: {
            content: "भाषा",
          },
          campaignTracking: {
            title: "कैंपेन ट्रैकिंग",
            description: "अपडेट की गई कैंपेन जानकारी",
          },
          source: {
            content: "लीड का स्रोत",
          },
          currentCampaignStage: {
            content: "मौजूदा कैंपेन चरण",
          },
          emailJourneyVariant: {
            content: "ईमेल जर्नी वेरिएंट",
          },
          emailsSent: {
            content: "भेजे गए ईमेल",
          },
          lastEmailSentAt: {
            content: "आख़िरी भेजा ईमेल",
          },
          engagement: {
            title: "एंगेजमेंट मेट्रिक",
            description: "ईमेल एंगेजमेंट का डेटा",
          },
          emailsOpened: {
            content: "खोले गए ईमेल",
          },
          emailsClicked: {
            content: "क्लिक किए गए ईमेल",
          },
          lastEngagementAt: {
            content: "आख़िरी एंगेजमेंट",
          },
          unsubscribedAt: {
            content: "अनसब्सक्राइब का समय",
          },
          conversion: {
            title: "कन्वर्ज़न ट्रैकिंग",
            description: "कन्वर्ज़न माइलस्टोन ट्रैकिंग",
          },
          convertedUserId: {
            content: "कन्वर्ट हुए यूज़र की ID",
          },
          convertedAt: {
            content: "कन्वर्ट होने का समय",
          },
          signedUpAt: {
            content: "साइन अप का समय",
          },
          subscriptionConfirmedAt: {
            content: "सब्सक्रिप्शन पुष्टि का समय",
          },
          metadata: {
            title: "अतिरिक्त जानकारी",
            description: "नोट्स और मेटाडेटा",
            content: "मेटाडेटा",
          },
          notes: {
            content: "नोट्स",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
          },
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "दिया गया डेटा गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लीड अपडेट करने के लिए ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "एक्सेस नहीं मिला",
            description: "आपको यह लीड अपडेट करने की अनुमति नहीं है",
          },
          notFound: {
            title: "लीड नहीं मिली",
            description: "दी गई ID की कोई लीड नहीं मिली",
          },
          conflict: {
            title: "अपडेट में टकराव",
            description: "लीड को किसी दूसरे यूज़र ने बदल दिया",
          },
          server: {
            title: "सर्वर एरर",
            description: "लीड अपडेट करते समय एरर हुई",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "सर्वर से कनेक्ट नहीं हो सका",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        success: {
          title: "सफल",
          description: "लीड सफलतापूर्वक अपडेट हुई",
        },
      },
      post: {
        title: "[id]",
        description: "[id] एंडपॉइंट",
        form: {
          title: "[id] कॉन्फ़िगरेशन",
          description: "[id] पैरामीटर कॉन्फ़िगर करें",
        },
        response: {
          title: "रिस्पॉन्स",
          description: "[id] रिस्पॉन्स डेटा",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "इंटरनल सर्वर एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
        },
        success: {
          title: "सफल",
          description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
        },
      },
      enums: {
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
        leadSource: {
          website: "वेबसाइट",
          referral: "रेफ़रल",
          socialMedia: "सोशल मीडिया",
          emailCampaign: "ईमेल कैंपेन",
          csvImport: "CSV इम्पोर्ट",
          api: "API",
          manual: "मैन्युअल",
          other: "अन्य",
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
        emailJourneyVariant: {
          uncensoredConvert: "अनसेंसर्ड कन्वर्ट",
          sideHustle: "साइड हसल",
          quietRecommendation: "क्वाइट रेकमेंडेशन",
        },
      },
      widget: {
        loading: "लीड लोड हो रही है...",
        notFound: "लीड नहीं मिली।",
        back: "वापस",
        leadFallbackTitle: "लीड",
        edit: "एडिट करें",
        delete: "हटाएँ",
        converted: "बदला गया",
        quickActions: "त्वरित कार्रवाइयाँ",
        editLead: "लीड एडिट करें",
        sendTestEmail: "टेस्ट ईमेल भेजें",
        viewInSearch: "सर्च में देखें",
        userProfile: "यूज़र प्रोफ़ाइल",
        userDetail: "यूज़र ब्योरा",
        creditHistory: "क्रेडिट हिस्ट्री",
        campaignFunnel: "कैंपेन फ़नल",
        sourceLabel: "स्रोत:",
        lastEmailLabel: "आख़िरी ईमेल:",
        campaignPerformance: "कैंपेन परफ़ॉर्मेंस",
        emailsSent: "भेजे गए ईमेल",
        opened: "खोले गए",
        clicked: "क्लिक किए गए",
        openRate: "ओपन दर",
        clickRate: "क्लिक दर",
        clickToOpenRate: "क्लिक-टू-ओपन दर",
        contactDetails: "संपर्क ब्योरा",
        country: "देश",
        language: "भाषा",
        engagement: "एंगेजमेंट",
        emailsOpened: "खोले गए ईमेल",
        emailsClicked: "क्लिक किए गए ईमेल",
        lastEngagement: "आख़िरी एंगेजमेंट",
        unsubscribed: "अनसब्सक्राइब हुए",
        conversion: "कन्वर्ज़न",
        signedUp: "साइन अप किया",
        convertedAt: "कन्वर्ट होने का समय",
        subscriptionConfirmed: "सब्सक्रिप्शन पक्का",
        convertedUserId: "कन्वर्ट हुए यूज़र की ID",
        activeSubscriberSince: "तब से सक्रिय सब्सक्राइबर",
        viewUserProfile: "यूज़र प्रोफ़ाइल देखें",
        viewUserDetail: "यूज़र ब्योरा देखें",
        notesAndMetadata: "नोट्स और मेटाडेटा",
        notes: "नोट्स",
        metadata: "मेटाडेटा",
        created: "बनाया गया",
        lastUpdated: "आख़िरी अपडेट",
        daysOld: "दिन पुरानी",
        lastEngaged: "आख़िरी एंगेजमेंट",
        ago: "पहले",
        variant: "वेरिएंट:",
        copyEmail: "ईमेल",
        copyId: "ID",
        copyPhone: "फ़ोन",
        copyUserId: "यूज़र ID",
        stageNotStarted: "शुरू नहीं हुआ",
        stageInitial: "शुरुआती",
        stageFollowup1: "फ़ॉलो-अप 1",
        stageFollowup2: "फ़ॉलो-अप 2",
        stageFollowup3: "फ़ॉलो-अप 3",
        stageNurture: "नर्चर",
        stageReactivation: "रीएक्टिवेशन",
        tabOverview: "ओवरव्यू",
        tabDetails: "ब्योरा",
        tabIdentity: "पहचान",
        tabBasic: "बुनियादी",
        tabCampaign: "कैंपेन",
        tabAdvanced: "एडवांस्ड",
        deviceIdentity: "डिवाइस और पहचान",
        ipAddress: "IP पता",
        userAgent: "यूज़र एजेंट",
        deviceType: "डिवाइस प्रकार",
        browser: "ब्राउज़र",
        os: "ऑपरेटिंग सिस्टम",
        referralCode: "रेफ़रल कोड",
        lifecycleTimestamps: "जीवनचक्र",
        bouncedAt: "बाउंस का समय",
        invalidAt: "अमान्य होने का समय",
        campaignStartedAt: "कैंपेन शुरू होने का समय",
        linkedLeadsSection: "जुड़ी हुई लीड",
        linkedLeadsEmpty: "कोई जुड़ी लीड नहीं",
        linkedUsersSection: "जुड़े यूज़र अकाउंट",
        linkedUsersEmpty: "कोई जुड़ा यूज़र अकाउंट नहीं",
        linkReason: "जुड़ाव की वजह:",
        linkedAt: "जुड़ने का समय:",
        copyIp: "IP",
        copyLinkedLeadId: "लीड ID",
        copyUserId2: "यूज़र ID",
      },
      delete: {
        title: "लीड हटाएँ",
        description: "सिस्टम से लीड हटाएँ",
        container: {
          title: "लीड हटाएँ",
          description: "क्या आप सच में इस लीड को हमेशा के लिए हटाना चाहते हैं?",
        },
        backButton: {
          label: "लीड पर वापस",
        },
        submitButton: {
          label: "लीड हटाएँ",
          loadingText: "लीड हट रही है...",
        },
        actions: {
          delete: "लीड हटाएँ",
          deleting: "लीड हट रही है...",
        },
        id: {
          label: "लीड ID",
          description: "हटाई जाने वाली लीड की यूनिक पहचान",
        },
        errors: {
          validation: {
            title: "वैलिडेशन एरर",
            description: "दी गई लीड ID गलत है",
          },
          unauthorized: {
            title: "अनधिकृत",
            description: "लीड हटाने के लिए ऑथेंटिकेशन ज़रूरी है",
          },
          forbidden: {
            title: "एक्सेस नहीं मिला",
            description: "आपको यह लीड हटाने की अनुमति नहीं है",
          },
          notFound: {
            title: "लीड नहीं मिली",
            description: "दी गई ID की कोई लीड नहीं मिली",
          },
          conflict: {
            title: "हटाने में टकराव",
            description: "मौजूदा निर्भरताओं की वजह से लीड हट नहीं सकती",
          },
          server: {
            title: "सर्वर एरर",
            description: "लीड हटाते समय एरर हुई",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "सर्वर से कनेक्ट नहीं हो सका",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        success: {
          title: "लीड हट गई",
          description: "लीड सफलतापूर्वक हट गई है",
        },
      },
    },
  },
  list: {
    category: "लीड",
    tags: {
      leads: "लीड",
      management: "मैनेजमेंट",
    },

    get: {
      title: "लीड्स की लिस्ट",
      description: "फ़िल्टर के साथ लीड्स की पेजिनेटेड लिस्ट लाएँ",
      createButton: {
        label: "लीड बनाएँ",
      },
      form: {
        title: "लीड लिस्ट फ़िल्टर",
        description: "लीड लिस्ट के फ़िल्टर सेट करें",
      },
      actions: {
        refresh: "रीफ़्रेश करें",
        refreshing: "रिफ़्रेश हो रहा है...",
      },
      page: {
        label: "पेज नंबर",
        description: "पेजिनेशन के लिए पेज नंबर",
        placeholder: "पेज नंबर दर्ज करें",
      },
      limit: {
        label: "प्रति पेज नतीजे",
        description: "हर पेज पर दिखने वाले नतीजों की संख्या",
        placeholder: "सीमा दर्ज करें",
      },
      status: {
        label: "लीड की स्थिति",
        description: "लीड स्टेटस से फ़िल्टर करें",
        placeholder: "स्टेटस चुनें",
      },
      currentCampaignStage: {
        label: "कैंपेन चरण",
        description: "मौजूदा कैंपेन स्टेज से फ़िल्टर करें",
        placeholder: "कैंपेन चरण चुनें",
      },
      source: {
        label: "लीड का स्रोत",
        description: "लीड सोर्स से फ़िल्टर करें",
        placeholder: "स्रोत चुनें",
      },
      country: {
        label: "देश",
        description: "देश से फ़िल्टर करें",
        placeholder: "देश चुनें",
      },
      language: {
        label: "भाषा",
        description: "भाषा से फ़िल्टर करें",
        placeholder: "भाषाएँ चुनें",
      },
      search: {
        label: "खोजें",
        description: "नाम, ईमेल या बिज़नेस से लीड्स खोजें",
        placeholder: "सर्च शब्द लिखें",
      },
      searchPagination: {
        title: "सर्च और पेजिनेशन",
        description: "सर्च और पेजिनेशन कंट्रोल",
      },
      statusFilters: {
        title: "स्टेटस और कैंपेन फ़िल्टर",
        description: "स्टेटस, कैंपेन स्टेज और सोर्स से फ़िल्टर करें",
      },
      locationFilters: {
        title: "लोकेशन फ़िल्टर",
        description: "देश और भाषा से फ़िल्टर करें",
      },
      sortingOptions: {
        title: "सॉर्टिंग विकल्प",
        description: "नतीजों का क्रम कॉन्फ़िगर करें",
      },
      sortBy: {
        label: "इसके हिसाब से क्रम",
        description: "नतीजे जिस फ़ील्ड से सॉर्ट करने हैं",
        placeholder: "सॉर्ट फ़ील्ड चुनें",
      },
      sortOrder: {
        label: "सॉर्ट क्रम",
        description: "नतीजों का सॉर्ट क्रम",
        placeholder: "सॉर्ट क्रम चुनें",
      },
      response: {
        title: "लीड लिस्ट का रिस्पॉन्स",
        description: "मेटाडेटा के साथ लीड्स की पेजिनेटेड लिस्ट",
        leads: {
          title: "लीड का ब्योरा",
          description: "हर लीड की जानकारी",
          id: "लीड ID",
          email: "ईमेल पता",
          businessName: "बिज़नेस का नाम",
          contactName: "संपर्क का नाम",
          phone: "फ़ोन नंबर",
          website: "वेबसाइट",
          country: "देश",
          language: "भाषा",
          status: "स्टेटस",
          source: "सोर्स",
          notes: "नोट्स",
          convertedUserId: "कन्वर्ट हुए यूज़र की ID",
          convertedAt: "कन्वर्ट होने का समय",
          signedUpAt: "साइन अप का समय",
          subscriptionConfirmedAt: "सब्सक्रिप्शन पुष्टि का समय",
          currentCampaignStage: "मौजूदा कैंपेन चरण",
          emailsSent: "भेजे गए ईमेल",
          lastEmailSentAt: "आख़िरी ईमेल भेजने का समय",
          unsubscribedAt: "अनसब्सक्राइब का समय",
          emailsOpened: "खोले गए ईमेल",
          emailsClicked: "क्लिक किए गए ईमेल",
          lastEngagementAt: "आख़िरी एंगेजमेंट का समय",
          metadata: "मेटाडेटा",
          createdAt: "बनाने का समय",
          updatedAt: "अपडेट का समय",
        },
        total: "कुल लीड्स",
        page: "मौजूदा पेज",
        limit: "पेज साइज़",
        totalPages: "कुल पेज",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लीड्स की लिस्ट देखने के लिए लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "फ़िल्टर पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "लीड्स लाते समय इंटरनल सर्वर एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "लीड्स लाते समय अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "लीड्स लाते समय नेटवर्क एरर आया",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "लीड लिस्ट के लिए एक्सेस की अनुमति नहीं",
        },
        notFound: {
          title: "नहीं मिला",
          description: "लीड्स नहीं मिलीं",
        },
        conflict: {
          title: "टकराव",
          description: "लीड्स लाते समय डेटा कॉन्फ़्लिक्ट हुआ",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "लीड लिस्ट में बिना सेव किए बदलाव हैं",
        },
      },
      success: {
        title: "सफल",
        description: "लीड लिस्ट मिल गई",
      },
      emptySearch: "आपके फ़िल्टर से कोई लीड मेल नहीं खाती",
      emptyState: "अभी कोई लीड नहीं",
    },
    widget: {
      converted: "बदला गया",
      emailsSent: "{{count}} ईमेल भेजे",
      openRate: "{{percent}}% ओपन दर",
      clicks: "{{count}} क्लिक",
      stats: "स्टैट्स",
      graphs: "ग्राफ़",
      search: "खोजें",
      export: "एक्सपोर्ट",
      import: "Import",
      batch: "बैच",
      refresh: "रीफ़्रेश करें",
      view: "देखें",
      edit: "एडिट करें",
      delete: "हटाएँ",
      allSources: "सभी सोर्स",
      clearSearch: "सर्च हटाएँ",
      clearStatusFilter: "स्टेटस फ़िल्टर हटाएँ",
      clearSourceFilter: "सोर्स फ़िल्टर हटाएँ",
      addLead: "लीड जोड़ें",
      importCsv: "Import CSV",
      pagination: "पेज {{page}} / {{totalPages}} · {{total}} लीड्स",
      tabAll: "सभी",
      tabNew: "नया",
      tabCampaign: "कैंपेन",
      tabConfirmed: "कन्फ़र्म",
      tabUnsubscribed: "अनसब्सक्राइब हुए",
      tabBounced: "बाउंस हुए",
      sortNewest: "सबसे नई पहले",
      sortOldest: "सबसे पुरानी पहले",
      sortEmailsSentHigh: "भेजे ईमेल (ज़्यादा)",
      sortEmailsSentLow: "भेजे ईमेल (कम)",
      sortBusinessNameAZ: "बिज़नेस नाम (A-Z)",
      sortBusinessNameZA: "बिज़नेस नाम (Z-A)",
      linkedCount: "{{count}} लिंक्ड",
      hasLinkedUser: "यूज़र",
      referralCode: "रेफ़ कोड",
    },
  },
  search: {
    category: "लीड मैनेजमेंट",
    tags: {
      leads: "लीड",
      search: "खोजें",
    },
    get: {
      title: "लीड्स खोजें",
      description: "फ़िल्टर और पेजिनेशन के साथ लीड्स खोजें",
      form: {
        title: "लीड सर्च फ़ॉर्म",
        description: "लीड्स खोजने के लिए सर्च शर्तें लिखें",
      },
      search: {
        label: "खोज क्वेरी",
        description: "ईमेल, बिज़नेस नाम या नोट्स से लीड्स फ़िल्टर करने का शब्द",
        placeholder: "खोज शब्द दर्ज करें...",
      },
      status: {
        label: "स्थिति फ़िल्टर",
        description: "स्टेटस से लीड्स फ़िल्टर करें",
      },
      limit: {
        label: "नतीजों की सीमा",
        description: "लौटाए जाने वाले नतीजों की अधिकतम संख्या (1-100)",
      },
      offset: {
        label: "नतीजों का ऑफ़सेट",
        description: "पेजिनेशन के लिए छोड़े जाने वाले नतीजों की संख्या",
      },
      response: {
        title: "खोज के नतीजे",
        description: "लीड डेटा के साथ पेजिनेटेड सर्च नतीजे",
        leads: {
          title: "लीड",
          item: "लीड",
        },
        total: "कुल नतीजे",
        hasMore: "और नतीजे हैं",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "लीड्स खोजने के लिए लॉगिन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "सर्च पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "लीड्स खोजते समय इंटरनल सर्वर एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "लीड्स खोजते समय अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "लीड्स खोजते समय नेटवर्क एरर आया",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "लीड सर्च के लिए एक्सेस की अनुमति नहीं",
        },
        notFound: {
          title: "कोई नतीजा नहीं",
          description: "सर्च शर्तों से मेल खाती कोई लीड नहीं मिली",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "सर्च फ़ॉर्म में बिना सेव किए बदलाव हैं",
        },
        conflict: {
          title: "टकराव",
          description: "लीड्स खोजते समय डेटा कॉन्फ़्लिक्ट हुआ",
        },
      },
      success: {
        title: "सर्च पूरी हुई",
        description: "लीड सर्च सफलतापूर्वक पूरी हुई",
      },
    },
    widget: {
      title: "लीड्स खोजें",
      filterLabel: "फ़िल्टर:",
      clearFilter: "क्लियर",
      noResultsTitle: "कोई नतीजा नहीं मिला",
      noResultsSubtitle: "ईमेल, बिज़नेस नाम या फ़ोन से खोजें",
      createLead: "लीड बनाएँ",
      noLeadsMatchFilter: "चुने फ़िल्टर से कोई लीड मेल नहीं खाती।",
      clearFilters: "फ़िल्टर साफ़ करें",
      loadMore: "और लोड करें",
      openRateSuffix: "% ओपन",
      noEmails: "कोई ईमेल नहीं",
      converted: "बदला गया",
      emailsSentSuffix: "भेजे",
      copyEmailTitle: "ईमेल कॉपी करें",
      editLeadTitle: "लीड एडिट करें",
      deleteLeadTitle: "लीड हटाएँ",
      statusNew: "नया",
      statusPending: "पेंडिंग",
      statusCampaign: "कैंपेन",
      statusWebUser: "वेब यूज़र",
      statusNewsletter: "न्यूज़लेटर",
      statusInContact: "संपर्क में",
      statusSignedUp: "साइन अप किया",
      statusSubscribed: "सब्सक्राइब्ड",
      statusUnsub: "अनसब",
      statusBounced: "बाउंस हुए",
      statusInvalid: "अमान्य",
    },
  },
  stats: {
    title: "लीड आँकड़े",
    description: "इतिहास के साथ लीड्स के पूरे आँकड़े और एनालिटिक्स",
    category: "लीड मैनेजमेंट",
    tags: {
      leads: "लीड",
      statistics: "स्टैटिस्टिक्स",
      analytics: "एनालिटिक्स",
    },
    container: {
      title: "आँकड़ा फ़िल्टर",
      description: "अपने लीड आँकड़े के फ़िल्टर और व्यू विकल्प सेट करें",
    },
    refresh: "रीफ़्रेश करें",
    sections: {
      timeFilters: "समय अवधि और तारीख रेंज",
      comparison: "तुलना सेटिंग्स",
      leadFilters: "लीड फ़िल्टर",
      engagement: "एंगेजमेंट फ़िल्टर",
      conversion: "कन्वर्ज़न फ़िल्टर",
      dataCompleteness: "डेटा की पूर्णता",
      additional: "अतिरिक्त फ़िल्टर",
      searchSort: "सर्च और सॉर्टिंग",
    },
    timePeriod: {
      label: "समय अवधि",
      description: "आँकड़े जोड़ने के लिए समय अवधि चुनें",
      hour: "घंटा",
      day: "दिन",
      week: "हफ़्ता",
      month: "महीना",
      quarter: "तिमाही",
      year: "साल",
    },
    dateRangePreset: {
      label: "तारीख़ रेंज प्रीसेट",
      description: "पहले से तय तारीख रेंज चुनें",
    },
    dateRange: {
      today: "आज",
      yesterday: "कल",
      last7Days: "पिछले 7 दिन",
      last30Days: "पिछले 30 दिन",
      last90Days: "पिछले 90 दिन",
      thisWeek: "इस हफ़्ते",
      lastWeek: "पिछला हफ़्ता",
      thisMonth: "इस महीने",
      lastMonth: "पिछला महीना",
      thisQuarter: "इस तिमाही",
      lastQuarter: "पिछली तिमाही",
      thisYear: "इस साल",
      lastYear: "पिछला साल",
      custom: "कस्टम रेंज",
    },
    dateFrom: {
      label: "शुरू की तारीख",
      description: "आँकड़ों की शुरुआती तारीख",
    },
    dateTo: {
      label: "अंत की तारीख",
      description: "आँकड़ों की अंतिम तारीख",
    },
    chartType: {
      label: "चार्ट प्रकार",
      description: "डेटा विज़ुअलाइज़ेशन के लिए चार्ट का प्रकार चुनें",
      line: "लाइन चार्ट",
      bar: "बार चार्ट",
      area: "एरिया चार्ट",
      pie: "पाई चार्ट",
      donut: "डोनट चार्ट",
    },
    includeComparison: {
      label: "तुलना शामिल करें",
      description: "पिछली अवधि से तुलना करें",
    },
    comparisonPeriod: {
      label: "तुलना की अवधि",
      description: "जिस अवधि से तुलना करनी है उसे चुनें",
    },
    status: {
      label: "लीड की स्थिति",
      description: "लीड स्टेटस से फ़िल्टर करें",
    },
    source: {
      label: "लीड का स्रोत",
      description: "लीड सोर्स से फ़िल्टर करें",
    },
    country: {
      ...regionalCountryNames("hi"),
      label: "देश",
      description: "देश से फ़िल्टर करें",
      all: "सभी देश",
      de: "जर्मनी",
      pl: "पोलैंड",
      fr: "फ़्रांस",
      global: "ग्लोबल",
    },
    language: {
      it: "इतालवी",
      es: "स्पेनिश",
      sk: "स्लोवाक",
      label: "भाषा",
      description: "भाषा की पसंद से फ़िल्टर करें",
      all: "सभी भाषाएँ",
      en: "अंग्रेज़ी",
      de: "जर्मन",
      pl: "पोलिश",
      fr: "फ़्रेंच",
    },
    campaignStage: {
      label: "कैंपेन चरण",
      description: "ईमेल कैंपेन स्टेज से फ़िल्टर करें",
    },
    hasEngagement: {
      label: "एंगेजमेंट है",
      description: "किसी भी ईमेल एंगेजमेंट वाली लीड्स फ़िल्टर करें",
    },
    minEmailsOpened: {
      label: "कम से कम खोले गए ईमेल",
      description: "खोले गए ईमेल की न्यूनतम संख्या",
    },
    minEmailsClicked: {
      label: "कम से कम क्लिक किए गए ईमेल",
      description: "क्लिक किए गए ईमेल की न्यूनतम संख्या",
    },
    isConverted: {
      label: "कन्वर्ट हुई",
      description: "कन्वर्ट हुई लीड्स फ़िल्टर करें",
    },
    hasSignedUp: {
      label: "साइन अप किया है",
      description: "साइन अप कर चुकी लीड्स फ़िल्टर करें",
    },
    hasConfirmedSubscription: {
      label: "कन्फ़र्म सब्सक्रिप्शन है",
      description: "कन्फ़र्म सब्सक्रिप्शन वाली लीड्स फ़िल्टर करें",
    },
    hasBusinessName: {
      label: "बिज़नेस नाम है",
      description: "बिज़नेस नाम वाली लीड्स फ़िल्टर करें",
    },
    hasContactName: {
      label: "संपर्क का नाम है",
      description: "संपर्क के नाम वाली लीड्स फ़िल्टर करें",
    },
    hasPhone: {
      label: "फ़ोन है",
      description: "फ़ोन नंबर वाली लीड्स फ़िल्टर करें",
    },
    hasWebsite: {
      label: "वेबसाइट है",
      description: "वेबसाइट वाली लीड्स फ़िल्टर करें",
    },
    hasNotes: {
      label: "नोट्स हैं",
      description: "नोट्स वाली लीड्स फ़िल्टर करें",
    },
    sortBy: {
      label: "इसके हिसाब से क्रम",
      description: "नतीजे जिस फ़ील्ड से सॉर्ट करने हैं",
    },
    sortOrder: {
      label: "सॉर्ट क्रम",
      description: "बढ़ते या घटते क्रम में",
    },
    limit: {
      label: "नतीजों की सीमा",
      description: "नतीजों की अधिकतम संख्या",
    },
    hasUserId: {
      label: "यूज़र ID है",
      description: "जुड़ी हुई यूज़र ID वाली लीड्स फ़िल्टर करें",
    },
    emailVerified: {
      label: "ईमेल वेरिफ़ाइड",
      description: "ईमेल वेरिफ़िकेशन स्टेटस से फ़िल्टर करें",
    },
    journeyVariant: {
      label: "जर्नी वेरिएंट",
      description: "ईमेल जर्नी वेरिएंट से फ़िल्टर करें",
    },
    minEmailsSent: {
      label: "कम से कम भेजे गए ईमेल",
      description: "लीड को भेजे गए ईमेल की न्यूनतम संख्या",
    },
    createdAfter: {
      label: "इसके बाद बनी",
      description: "इस तारीख के बाद बनी लीड्स फ़िल्टर करें",
    },
    createdBefore: {
      label: "इससे पहले बनी",
      description: "इस तारीख से पहले बनी लीड्स फ़िल्टर करें",
    },
    updatedAfter: {
      label: "इसके बाद अपडेट हुई",
      description: "इस तारीख के बाद अपडेट हुई लीड्स फ़िल्टर करें",
    },
    updatedBefore: {
      label: "इससे पहले अपडेट हुई",
      description: "इस तारीख से पहले अपडेट हुई लीड्स फ़िल्टर करें",
    },
    search: {
      label: "खोजें",
      description: "ईमेल, नाम या बिज़नेस नाम से लीड्स खोजें",
      placeholder: "लीड्स खोजें...",
    },
    engagementLevel: {
      high: "ज़्यादा एंगेजमेंट",
      medium: "मध्यम एंगेजमेंट",
      low: "कम एंगेजमेंट",
      none: "कोई एंगेजमेंट नहीं",
    },
    response: {
      overview: "ओवरव्यू",
      emailPerformance: "ईमेल परफ़ॉर्मेंस",
      conversionRates: "कन्वर्ज़न रेट",
      activityTimeline: "गतिविधि टाइमलाइन",
      campaignDistribution: "कैंपेन वितरण",
      geographicDistribution: "भौगोलिक और सोर्स वितरण",
      dataQuality: "डेटा क्वालिटी",
      performanceMetrics: "परफ़ॉर्मेंस मेट्रिक्स",
      engagementLevels: "एंगेजमेंट लेवल",
      conversionFunnel: "कन्वर्ज़न फ़नल",
      totalLeads: "कुल लीड्स",
      newLeads: "नई लीड्स",
      activeLeads: "सक्रिय लीड",
      inactiveLeads: "निष्क्रिय लीड्स",
      leadsByStatus: "स्टेटस के हिसाब से लीड्स",
      leadsBySource: "सोर्स के हिसाब से लीड्स",
      leadsByCountry: "देश के हिसाब से लीड्स",
      leadsByLanguage: "भाषा के हिसाब से लीड्स",
      websiteUserLeads: "वेबसाइट यूज़र",
      newsletterSubscriberLeads: "न्यूज़लेटर सब्सक्राइबर",
      convertedLeads: "कन्वर्ट हुई लीड",
      consultationBookedLeads: "कंसल्टेशन बुक",
      signedUpLeads: "साइन अप वाली लीड्स",
      subscriptionConfirmedLeads: "सब्सक्रिप्शन पक्का",
      unsubscribedLeads: "अनसब्सक्राइब हुई लीड",
      bounces: "बाउंस हुए",
      qualifiedLeads: "क्वालिफ़ाइड लीड्स",
      nonQualifiedLeads: "नॉन-क्वालिफ़ाइड लीड्स",
      nurturingLeads: "नर्चरिंग लीड्स",
      engagedLeads: "एंगेज्ड लीड्स",
      leadsWithEmailEngagement: "ईमेल एंगेजमेंट वाली",
      leadsWithoutEmailEngagement: "बिना ईमेल एंगेजमेंट वाली",
      averageEmailEngagementScore: "औसत ईमेल एंगेजमेंट",
      totalEmailEngagements: "कुल ईमेल एंगेजमेंट",
      signupRate: "साइन अप रेट",
      subscriptionConfirmationRate: "सब्सक्रिप्शन कन्फ़र्मेशन रेट",
      dataCompletenessRate: "डेटा की पूर्णता",
      leadsWithBusinessName: "बिज़नेस नाम वाली",
      leadsWithContactName: "संपर्क नाम वाली",
      leadsWithPhone: "फ़ोन वाली",
      leadsWithWebsite: "वेबसाइट वाली",
      leadsWithNotes: "नोट्स वाली",
      averageBusinessDataCompleteness: "औसत बिज़नेस डेटा पूर्णता",
      leadsByCampaignStage: "कैंपेन स्टेज के हिसाब से लीड्स",
      leadsInActiveCampaigns: "चालू कैंपेन में",
      leadsNotInCampaigns: "कैंपेन में नहीं",
      recentLeads: "हाल की लीड्स",
      topLeadsByEngagement: "एंगेजमेंट के हिसाब से टॉप लीड्स",
      mostActiveLeads: "सबसे सक्रिय लीड्स",
      recentConversions: "हाल के कन्वर्ज़न",
      recentSignups: "हाल के साइन अप",
      timeSeriesData: "टाइम सीरीज़ डेटा",
      comparisonData: "तुलना का डेटा",
      averageTimeToConversion: "कन्वर्ज़न तक औसत समय",
      averageTimeToConsultation: "कंसल्टेशन तक औसत समय",
      averageTimeToSignup: "साइन अप तक औसत समय",
      topPerformingCampaigns: "सबसे अच्छे कैंपेन",
      topPerformingSources: "सबसे अच्छे सोर्स",
      topPerformingCountries: "सबसे अच्छे देश",
      conversionRate: "कन्वर्ज़न रेट",
      consultationBookingRate: "कंसल्टेशन बुकिंग रेट",
      averageOpenRate: "औसत ओपन रेट",
      averageClickRate: "औसत क्लिक रेट",
      campaignRunningLeads: "चल रहे कैंपेन में",
      bouncedLeads: "बाउंस हुई लीड्स",
      invalidLeads: "अमान्य लीड्स",
      totalEmailsSent: "कुल भेजे ईमेल",
      totalEmailsOpened: "कुल खोले गए ईमेल",
      totalEmailsClicked: "कुल क्लिक किए गए ईमेल",
      averageEmailsPerLead: "प्रति लीड औसत ईमेल",
      leadVelocity: "लीड वेलॉसिटी",
      leadsCreatedToday: "आज बनी लीड्स",
      leadsCreatedThisWeek: "इस हफ़्ते बनी लीड्स",
      leadsCreatedThisMonth: "इस महीने बनी लीड्स",
      leadsUpdatedToday: "आज अपडेट हुई लीड्स",
      leadsUpdatedThisWeek: "इस हफ़्ते अपडेट हुई लीड्स",
      leadsUpdatedThisMonth: "इस महीने अपडेट हुई लीड्स",
      leadsByJourneyVariant: "जर्नी वेरिएंट के हिसाब से लीड्स",
      historicalData: "ऐतिहासिक डेटा",
      groupedStats: "समूहित आँकड़े",
      recentActivity: "हाल की गतिविधि",
      metadata: "रिपोर्ट की जानकारी",
      generatedAt: "बनाए जाने का समय",
      dataRange: "डेटा रेंज",
      data: "आँकड़ों का डेटा",
      campaignName: "कैंपेन",
      leadsGenerated: "लीड",
      openRate: "ओपन दर",
      clickRate: "क्लिक दर",
      source: "सोर्स",
      qualityScore: "क्वालिटी स्कोर",
      activityType: "गतिविधि",
      email: "ईमेल",
      businessName: "बिज़नेस",
      timestamp: "समय",
      status: "स्टेटस",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत एक्सेस",
        description: "लीड आँकड़े देखने के लिए लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "आँकड़ों के रिक्वेस्ट पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "लीड आँकड़े लाते समय इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "आँकड़े लाते समय कोई अनपेक्षित एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "आँकड़े लाते समय नेटवर्क एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "लीड आँकड़ों के लिए एक्सेस की अनुमति नहीं",
      },
      notFound: {
        title: "कोई डेटा नहीं",
        description: "बताई शर्तों के लिए कोई आँकड़ा डेटा नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "आँकड़े बनाते समय डेटा कॉन्फ़्लिक्ट हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आँकड़ा फ़िल्टर में बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "आँकड़े तैयार",
      description: "लीड आँकड़े मिल गए",
    },
    widget: {
      title: "लीड आँकड़े",
      refresh: "रीफ़्रेश करें",
      viewAllLeads: "सभी लीड देखें",
      searchLeads: "लीड्स खोजें",
      export: "एक्सपोर्ट",
      import: "Import",
      batchUpdate: "बैच अपडेट",
      totalLeads: "कुल लीड्स",
      activeLeads: "सक्रिय लीड",
      converted: "बदला गया",
      conversionRate: "कन्वर्ज़न रेट",
      openRate: "ओपन दर",
      clickRate: "क्लिक दर",
      unsubscribeRate: "अनसब्सक्राइब रेट",
      newThisMonth: "नई (30 दिन)",
      newLeadsTimeline: "नई लीड्स की टाइमलाइन",
      today: "आज",
      thisWeek: "इस हफ़्ते",
      thisMonth: "इस महीने",
      conversionFunnel: "कन्वर्ज़न फ़नल",
      funnelTotalLeads: "कुल लीड्स",
      funnelCampaignRunning: "कैंपेन चल रहा है",
      funnelSignedUp: "साइन अप किया",
      funnelSubscriptionConfirmed: "सब्सक्रिप्शन पक्का",
      byStatus: "स्थिति के हिसाब से",
      clickToFilter: "(फ़िल्टर करने के लिए क्लिक करें)",
      bySource: "सोर्स के हिसाब से",
      byCountry: "देश के हिसाब से",
      byCampaignStage: "कैंपेन स्टेज के हिसाब से",
      topPerformingCampaigns: "सबसे अच्छे कैंपेन",
      topSources: "टॉप सोर्स",
      viewAll: "सभी देखें",
      recentActivity: "हाल की गतिविधि",
      filters: "फ़िल्टर",
      applyFilters: "फ़िल्टर लगाएँ",
      openRateSuffix: "% ओपन",
      conversionRateSuffix: "% सीवीआर",
      emDash: "–",
      dateSeparator: "–",
    },
    enums: {
      sortOrder: {
        asc: "बढ़ता क्रम",
        desc: "घटता क्रम",
      },
      leadSortField: {
        email: "ईमेल",
        businessName: "बिज़नेस का नाम",
        createdAt: "बनने की तारीख",
        updatedAt: "अपडेट की तारीख",
        lastEngagementAt: "आख़िरी एंगेजमेंट",
      },
      leadStatusFilter: {
        all: "सभी",
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
      emailCampaignStageFilter: {
        all: "सभी",
        notStarted: "शुरू नहीं हुआ",
        initial: "पहला संपर्क",
        followup1: "फ़ॉलो-अप 1",
        followup2: "फ़ॉलो-अप 2",
        followup3: "फ़ॉलो-अप 3",
        nurture: "नर्चर",
        reactivation: "रीएक्टिवेशन",
      },
      leadSourceFilter: {
        all: "सभी",
        website: "वेबसाइट",
        socialMedia: "सोशल मीडिया",
        emailCampaign: "ईमेल कैंपेन",
        referral: "रेफ़रल",
        csvImport: "CSV इम्पोर्ट",
      },
    },
  },
  tracking: {
    engagement: {
      category: "लीड ट्रैकिंग",
      tags: {
        tracking: "ट्रैकिंग",
        engagement: "एंगेजमेंट",
      },
      post: {
        title: "लीड एंगेजमेंट दर्ज करें",
        description: "किसी लीड के लिए नया एंगेजमेंट इवेंट दर्ज करें",
        form: {
          title: "लीड एंगेजमेंट फ़ॉर्म",
          description: "लीड एंगेजमेंट का ब्योरा दर्ज करें",
        },
        leadId: {
          label: "लीड ID",
          description: "लीड की यूनिक पहचान",
          placeholder: "लीड ID दर्ज करें",
          helpText: "जिस लीड का एंगेजमेंट ट्रैक करना है उसकी UUID",
        },
        engagementType: {
          label: "एंगेजमेंट का प्रकार",
          description: "एंगेजमेंट इवेंट का प्रकार",
          placeholder: "एंगेजमेंट का प्रकार चुनें",
          helpText: "इंटरैक्शन या एंगेजमेंट का प्रकार",
        },
        campaignId: {
          label: "कैंपेन ID",
          description: "जुड़ी कैंपेन की पहचान",
          placeholder: "कैंपेन ID दर्ज करें",
          helpText: "वैकल्पिक कैंपेन जिसका यह एंगेजमेंट हिस्सा है",
        },
        metadata: {
          label: "मेटाडेटा",
          description: "अतिरिक्त एंगेजमेंट मेटाडेटा",
          placeholder: "मेटाडेटा JSON में डालें",
          helpText: "इस एंगेजमेंट का कस्टम डेटा",
        },
        userId: {
          label: "यूज़र ID",
          description: "जुड़े यूज़र की पहचान",
          placeholder: "यूज़र ID दर्ज करें",
          helpText: "लीड किसी यूज़र से जुड़ी हो तो वैकल्पिक यूज़र ID",
        },
        response: {
          id: "एंगेजमेंट ID",
          leadId: "लीड ID",
          engagementType: "एंगेजमेंट का प्रकार",
          campaignId: "कैंपेन ID",
          metadata: "मेटाडेटा",
          timestamp: "टाइमस्टैम्प",
          ipAddress: "IP पता",
          userAgent: "यूज़र एजेंट",
          createdAt: "बनाने का समय",
          leadCreated: "लीड बनी",
          relationshipEstablished: "संबंध स्थापित हुआ",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "इंटरनल सर्वर एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        success: {
          title: "एंगेजमेंट दर्ज हुआ",
          description: "लीड एंगेजमेंट सफलतापूर्वक दर्ज हुआ",
        },
      },
      get: {
        title: "लीड क्लिक ट्रैक करें",
        description: "लीड क्लिक ट्रैक करें और टारगेट URL पर रीडायरेक्ट करें",
        form: {
          title: "क्लिक ट्रैकिंग पैरामीटर",
          description: "क्लिक ट्रैकिंग और रीडायरेक्ट के पैरामीटर",
        },
        id: {
          label: "लीड ID",
          description: "लीड की यूनिक पहचान",
          placeholder: "लीड ID दर्ज करें",
          helpText: "जिस लीड का क्लिक ट्रैक करना है उसकी UUID",
        },
        stage: {
          label: "कैंपेन चरण",
          description: "ईमेल कैंपेन चरण",
          placeholder: "कैंपेन चरण चुनें",
          helpText: "वैकल्पिक कैंपेन चरण जिसका यह क्लिक हिस्सा है",
        },
        source: {
          label: "लीड का स्रोत",
          description: "लीड का स्रोत",
          placeholder: "लीड स्रोत चुनें",
          helpText: "वह स्रोत जहाँ से लीड आई",
        },
        url: {
          label: "टारगेट URL",
          description: "ट्रैकिंग के बाद जिस URL पर रीडायरेक्ट करना है",
          placeholder: "टारगेट URL दर्ज करें",
          helpText: "रीडायरेक्ट की मंज़िल का URL",
        },
        ref: {
          label: "रेफ़रेंस ID",
          description: "ट्रैकिंग के लिए रेफ़रेंस पहचान",
          placeholder: "रेफ़रेंस ID दर्ज करें",
          helpText: "अतिरिक्त ट्रैकिंग संदर्भ के लिए वैकल्पिक रेफ़रेंस ID",
        },
        response: {
          success: "सफल",
          redirectUrl: "रीडायरेक्ट URL",
          leadId: "लीड ID",
          campaignId: "कैंपेन ID",
          engagementRecorded: "एंगेजमेंट दर्ज हुआ",
          leadStatusUpdated: "लीड की स्थिति अपडेट हुई",
          isLoggedIn: "लॉग इन है",
        },
        errors: {
          unauthorized: {
            title: "अनधिकृत",
            description: "लॉगिन ज़रूरी है",
          },
          validation: {
            title: "वैलिडेशन एरर",
            description: "रिक्वेस्ट के पैरामीटर गलत हैं",
          },
          server: {
            title: "सर्वर एरर",
            description: "इंटरनल सर्वर एरर आया",
          },
          unknown: {
            title: "अज्ञात एरर",
            description: "कोई अज्ञात एरर आया",
          },
          forbidden: {
            title: "अनुमति नहीं",
            description: "एक्सेस मना है",
          },
          notFound: {
            title: "नहीं मिला",
            description: "रिसोर्स नहीं मिला",
          },
          conflict: {
            title: "टकराव",
            description: "डेटा टकराव हुआ",
          },
          network: {
            title: "नेटवर्क एरर",
            description: "नेटवर्क एरर आया",
          },
          unsavedChanges: {
            title: "बिना सेव किए बदलाव",
            description: "आपके बदलाव सेव नहीं हुए हैं",
          },
        },
        success: {
          title: "क्लिक ट्रैक हुआ",
          description: "लीड क्लिक सफलतापूर्वक ट्रैक हुआ",
        },
      },
      widget: {
        post: {
          headerTitle: "एंगेजमेंट दर्ज करें",
          viewStatsTitle: "लीड आँकड़े देखें",
          statsButton: "स्टैट्स",
          loading: "एंगेजमेंट दर्ज हो रहा है…",
          successTitle: "एंगेजमेंट दर्ज हुआ",
          successSubtitle: "सफलतापूर्वक ट्रैक हुआ",
          event: "इवेंट",
          labels: {
            engagementId: "एंगेजमेंट ID",
            type: "टाइप",
            leadId: "लीड ID",
            campaignId: "कैंपेन ID",
            ipAddress: "IP पता",
            recordedAt: "दर्ज होने का समय",
            leadCreated: "लीड बनी",
            leadCreatedYes: "हाँ (नई लीड)",
            leadCreatedNo: "नहीं (मौजूदा)",
            relationshipEst: "संबंध स्थापित",
            relationshipYes: "हाँ",
            relationshipNo: "नहीं",
            metadata: "मेटाडेटा",
          },
          nextSteps: "अगले कदम:",
          viewLeadButton: "लीड देखें",
          leadStatsButton: "लीड आँकड़े",
          emptyTitle: "एंगेजमेंट इवेंट ट्रैक करें",
          emptyDescription:
            "किसी लीड के लिए नया एंगेजमेंट इवेंट दर्ज करने के लिए नीचे का फ़ॉर्म भरकर सबमिट करें",
          viewLeadStatsButton: "लीड आँकड़े देखें",
        },
        get: {
          headerTitle: "क्लिक ट्रैकिंग",
          viewStatsTitle: "लीड आँकड़े देखें",
          statsButton: "स्टैट्स",
          loading: "क्लिक ट्रैकिंग प्रोसेस हो रही है…",
          successTitle: "क्लिक ट्रैक हुआ",
          successSubtitle: "एंगेजमेंट दर्ज हुआ और रीडायरेक्ट URL तैयार है",
          failTitle: "ट्रैकिंग फ़ेल हुई",
          failSubtitle: "क्लिक इवेंट दर्ज नहीं हो सका",
          labels: {
            engagementLabel: "एंगेजमेंट",
            recorded: "दर्ज",
            notRecorded: "दर्ज नहीं",
            leadStatusLabel: "लीड की स्थिति",
            updated: "अपडेट किया गया",
            unchanged: "अपरिवर्तित",
            userLabel: "यूज़र",
            loggedIn: "लॉग इन",
            anonymous: "अनाम",
            leadId: "लीड ID",
            campaignId: "कैंपेन ID",
            redirectUrl: "रीडायरेक्ट URL",
          },
          nextSteps: "अगले कदम:",
          openUrlButton: "URL खोलें",
          viewLeadButton: "लीड देखें",
          leadStatsButton: "लीड आँकड़े",
          emptyTitle: "क्लिक इवेंट ट्रैक करें",
          emptyDescription:
            "क्लिक दर्ज करने और रीडायरेक्ट URL पाने के लिए नीचे ट्रैकिंग पैरामीटर दर्ज करें",
          viewLeadStatsButton: "लीड आँकड़े देखें",
        },
      },
      enums: {
        engagementLevel: {
          high: "हाई",
          medium: "मीडियम",
          low: "लो",
          none: "कोई नहीं",
        },
      },
      error: {
        default: "एंगेजमेंट प्रोसेस करते समय एरर हुई",
      },
    },
    pixel: {
      category: "API Endpoint",
      tags: {
        pixel: "पिक्सेल",
      },
      // Add endpoint-specific translations here
    },
    existing: {
      found: "मौजूदा लीड ट्रैकिंग मिली",
    },
    component: {
      initialized: "लीड ट्रैकिंग कॉम्पोनेंट शुरू हुआ",
    },
    error: "लीड ट्रैकिंग में एरर",
    errors: {
      default: "एरर आया",
      missingId: "ट्रैकिंग ID गायब है",
      invalidUrl: "URL गलत है",
    },
    data: {
      captured: "लीड ट्रैकिंग डेटा कैप्चर हुआ",
      capture: {
        error: "लीड ट्रैकिंग डेटा कैप्चर करने में एरर",
      },
      retrieve: {
        error: "लीड ट्रैकिंग डेटा पाने में एरर",
      },
      loaded: {
        signup: "साइन अप के लिए लीड ट्रैकिंग डेटा लोड हुआ",
      },
      load: {
        error: {
          noncritical: "लीड ट्रैकिंग डेटा लोड करने में एरर (गैर-ज़रूरी)",
        },
      },
      stored: "लीड ट्रैकिंग डेटा स्टोर हुआ",
      store: {
        error: "लीड ट्रैकिंग डेटा स्टोर करने में एरर",
      },
      cleared: "लीड ट्रैकिंग डेटा साफ़ हुआ",
      clear: {
        error: "लीड ट्रैकिंग डेटा साफ़ करने में एरर",
      },
      format: {
        error: "ट्रैकिंग डेटा फ़ॉर्मैट करने में एरर",
      },
    },
    params: {
      validate: {
        error: "ट्रैकिंग पैरामीटर वैलिडेट करने में एरर",
      },
    },
  },
  enums: {
    engagementTypes: {
      emailOpen: "ईमेल खोला गया",
      emailClick: "ईमेल क्लिक हुआ",
      websiteVisit: "वेबसाइट विज़िट",
      formSubmit: "फ़ॉर्म सबमिशन",
      leadAttribution: "लीड एट्रिब्यूशन",
      creditWall: "क्रेडिट ख़त्म",
      consentDeclined: "18+ सहमति अस्वीकार",
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
    emailStatus: {
      pending: "पेंडिंग",
      sent: "भेजे गए",
      delivered: "पहुँच गया",
      opened: "खोले गए",
      clicked: "क्लिक किए गए",
      bounced: "बाउंस हुए",
      failed: "फ़ेल",
      unsubscribed: "अनसब्सक्राइब हुए",
    },
    emailJourneyVariant: {
      uncensoredConvert: "अनसेंसर्ड कन्वर्ट",
      sideHustle: "साइड हसल",
      quietRecommendation: "क्वाइट रेकमेंडेशन",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      newsletterMay2026: "न्यूज़लेटर मई 2026",
      newsletterNov2026: "न्यूज़लेटर नवंबर 2026",
    },
    emailJourneyVariantFilter: {
      all: "सभी",
      uncensoredConvert: "अनसेंसर्ड कन्वर्ट",
      sideHustle: "साइड हसल",
      quietRecommendation: "क्वाइट रेकमेंडेशन",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      newsletterMay2026: "न्यूज़लेटर मई 2026",
      newsletterNov2026: "न्यूज़लेटर नवंबर 2026",
    },
    sortOrder: {
      asc: "बढ़ता क्रम",
      desc: "घटता क्रम",
    },
    leadSortField: {
      email: "ईमेल",
      businessName: "बिज़नेस का नाम",
      createdAt: "बनने की तारीख",
      updatedAt: "अपडेट की तारीख",
      lastEngagementAt: "आख़िरी एंगेजमेंट",
    },
    exportFormat: {
      csv: "CSV",
      xlsx: "Excel",
    },
    mimeType: {
      csv: "text/csv",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    activityType: {
      leadCreated: "लीड बनी",
      leadUpdated: "लीड अपडेट हुई",
      emailSent: "ईमेल भेजा गया",
      emailOpened: "ईमेल खोला गया",
      emailClicked: "ईमेल क्लिक हुआ",
      leadConverted: "लीड कन्वर्ट हुई",
      leadUnsubscribed: "लीड ने अनसब्सक्राइब किया",
    },
    userAssociation: {
      withUser: "यूज़र के साथ",
      withLead: "लीड के साथ",
      standalone: "अकेले",
      withBoth: "दोनों के साथ",
    },
    deviceType: {
      desktop: "डेस्कटॉप",
      mobile: "मोबाइल",
      tablet: "टैबलेट",
      bot: "बॉट",
      unknown: "अज्ञात",
    },
    leadSource: {
      website: "वेबसाइट",
      socialMedia: "सोशल मीडिया",
      emailCampaign: "ईमेल कैंपेन",
      referral: "रेफ़रल",
      csvImport: "CSV इम्पोर्ट",
    },
    leadStatusFilter: {
      all: "सभी",
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
    emailCampaignStageFilter: {
      all: "सभी",
      notStarted: "शुरू नहीं हुआ",
      initial: "पहला संपर्क",
      followup1: "फ़ॉलो-अप 1",
      followup2: "फ़ॉलो-अप 2",
      followup3: "फ़ॉलो-अप 3",
      nurture: "नर्चर",
      reactivation: "रीएक्टिवेशन",
    },
    leadSourceFilter: {
      all: "सभी",
      website: "वेबसाइट",
      socialMedia: "सोशल मीडिया",
      emailCampaign: "ईमेल कैंपेन",
      referral: "रेफ़रल",
      csvImport: "CSV इम्पोर्ट",
    },
    batchOperationScope: {
      currentPage: "मौजूदा पेज",
      allPages: "सभी पेज",
    },
    country: {
      ...regionalCountryNames("hi"),
      de: "जर्मनी",
      pl: "पोलैंड",
      fr: "फ़्रांस",
      global: "ग्लोबल",
    },
    language: {
      it: "इतालवी",
      es: "स्पेनिश",
      sk: "स्लोवाक",
      de: "जर्मन",
      pl: "पोलिश",
      fr: "फ़्रेंच",
      en: "अंग्रेज़ी",
    },
    emailProvider: {
      resend: "Resend",
      sendgrid: "SendGrid",
      mailgun: "Mailgun",
      ses: "Amazon SES",
      smtp: "SMTP",
      mailjet: "Mailjet",
      postmark: "Postmark",
      other: "अन्य",
    },
  },
  error: {
    general: {
      internal_server_error: "इंटरनल सर्वर एरर",
      not_found: "नहीं मिला",
      unauthorized: "अनधिकृत",
      forbidden: "अनुमति नहीं",
      bad_request: "गलत रिक्वेस्ट",
      validation_error: "वैलिडेशन एरर",
    },
  },
  leadsErrors: {
    batch: {
      update: {
        error: {
          validation: {
            title: "बैच अपडेट रिक्वेस्ट गलत है",
          },
          server: {
            title: "बैच में लीड्स अपडेट करते समय सर्वर एरर",
          },
          default: "बैच में लीड्स अपडेट करने में एरर",
        },
      },
    },
    leads: {
      get: {
        error: {
          server: {
            title: "लीड्स लाते समय सर्वर एरर",
            detail: "लीड्स लाते समय सर्वर एरर: {{error}}",
          },
          not_found: {
            title: "लीड्स नहीं मिलीं",
          },
        },
      },
      post: {
        error: {
          duplicate: {
            title: "इस ईमेल की लीड पहले से मौजूद है",
          },
          server: {
            title: "लीड बनाते समय सर्वर एरर",
          },
        },
      },
      patch: {
        error: {
          invalidStatusTransition:
            "यह लीड {{current}} से {{next}} में नहीं जा सकती।",
          not_found: {
            title: "लीड नहीं मिली",
          },
          server: {
            title: "लीड अपडेट करते समय सर्वर एरर",
          },
        },
      },
    },
    leadsUnsubscribe: {
      post: {
        success: {
          description: "अनसब्सक्राइब हो गया",
        },
        error: {
          validation: {
            title: "अनसब्सक्राइब रिक्वेस्ट गलत है",
          },
          server: {
            title: "अनसब्सक्राइब प्रोसेस करते समय सर्वर एरर",
          },
        },
      },
    },
    leadsEngagement: {
      post: {
        error: {
          validation: {
            title: "एंगेजमेंट डेटा गलत है",
          },
          server: {
            title: "एंगेजमेंट दर्ज करते समय सर्वर एरर",
          },
        },
      },
    },
    leadsExport: {
      get: {
        error: {
          server: {
            title: "लीड्स एक्सपोर्ट करते समय सर्वर एरर",
          },
        },
      },
    },
    campaigns: {
      common: {
        error: {
          server: {
            title: "कैंपेन प्रोसेस करते समय सर्वर एरर",
          },
        },
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
};
