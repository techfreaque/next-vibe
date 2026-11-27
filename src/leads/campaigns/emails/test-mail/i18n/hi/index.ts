import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "लीड",
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
  enums: {
    campaignType: {
      leadCampaign: "लीड कैंपेन",
      newsletter: "न्यूज़लेटर",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      transactional: "ट्रांज़ैक्शनल",
      notification: "नोटिफ़िकेशन",
      system: "सिस्टम",
    },
    emailJourneyVariant: {
      uncensoredConvert: "अनसेंसर्ड कन्वर्ट",
      sideHustle: "साइड हसल",
      quietRecommendation: "शांत सिफ़ारिश",
      signupNurture: "साइनअप नर्चर",
      retention: "रिटेंशन",
      winback: "विनबैक",
      newsletterMay2026: "न्यूज़लेटर मई 2026",
      newsletterNov2026: "न्यूज़लेटर नवंबर 2026",
    },
    emailCampaignStage: {
      notStarted: "शुरू नहीं हुआ",
      initial: "शुरुआती",
      followup1: "फ़ॉलो-अप 1",
      followup2: "फ़ॉलो-अप 2",
      followup3: "फ़ॉलो-अप 3",
      nurture: "पोषण",
      reactivation: "पुनः सक्रियण",
    },
    leadStatus: {
      new: "नई",
      pending: "लंबित",
      campaignRunning: "कैंपेन चल रहा है",
      websiteUser: "वेबसाइट यूज़र",
      newsletterSubscriber: "न्यूज़लेटर सब्सक्राइबर",
      inContact: "संपर्क में",
      signedUp: "साइन अप किया",
      subscriptionConfirmed: "सब्सक्रिप्शन पक्का",
      unsubscribed: "अनसब्सक्राइब",
      bounced: "बाउंस",
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
  tags: {
    campaigns: "कैंपेन",
    leads: "लीड",
  },
  post: {
    title: "टेस्ट मेल",
    titleShort: "टेस्ट ईमेल",
    description: "अपनी मर्ज़ी के लीड डेटा के साथ टेस्ट ईमेल भेजें",
    form: {
      title: "टेस्ट मेल कॉन्फ़िगरेशन",
      description: "टेस्ट मेल के पैरामीटर और लीड डेटा सेट करें",
    },
    campaignType: {
      label: "कैंपेन का प्रकार",
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
        placeholder: "John Doe",
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
        label: "स्थिति",
        description: "लीड की स्थिति",
        placeholder: "NEW",
      },
      source: {
        label: "स्रोत",
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
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
        detail: "टेस्ट भेजना फ़ेल हुआ: {{error}}",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव हैं",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
      templateNotFound: {
        title:
          "{{emailJourneyVariant}} / {{emailCampaignStage}} के लिए कोई टेंप्लेट नहीं",
        description: "बताए पैरामीटर के लिए ईमेल टेंप्लेट नहीं मिला",
      },
      sendingFailed: {
        title: "{{recipient}} को भेजना फ़ेल हुआ ({{subject}}): {{error}}",
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
};
