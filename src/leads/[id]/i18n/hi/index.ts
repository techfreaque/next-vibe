import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  traffic: {
    burstNetwork: "बर्स्ट नेटवर्क: 30 दिन में {{count}} लीड",
    sharedAgent: "साझा यूज़र एजेंट: {{count}} लीड",
    title: "ट्रैफ़िक और नेटवर्क",
    subtitle: "एजेंट क्लास, पहला टच और कितनी लीड यह नेटवर्क या एजेंट साझा करती हैं।",
    agent: "एजेंट",
    firstTouch: "पहला टच",
    referrer: "रेफ़रर",
    landingPath: "लैंडिंग पेज",
    refCode: "रेफ़ कोड",
    freeCredits: "ख़र्च हुए फ़्री क्रेडिट",
    network: "नेटवर्क",
    sameAgent: "वही यूज़र एजेंट",
    agentLeadsIn30d: "30 दिन में {{count}} लीड",
    openLeads: "लीड खोलें",
  },
  category: "लीड",
  tags: {
    leads: "लीड",
    management: "मैनेजमेंट",
  },

  get: {
    title: "लीड का ब्योरा लाएँ",
    titleShort: "लीड का ब्योरा",
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
        content: "बनने का समय",
      },
      updatedAt: {
        content: "अपडेट होने का समय",
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
          content: "स्थिति",
        },
        ipAddress: {
          content: "IP पता",
        },
        userAgent: {
          content: "यूज़र एजेंट",
        },
        createdAt: {
          content: "बनने का समय",
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
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
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
    titleShort: "लीड एडिट करें",
    description: "लीड की जानकारी और स्थिति अपडेट करें",
    backButton: {
      label: "लीड पर वापस",
    },
    deleteButton: {
      label: "लीड हटाएँ",
    },
    submitButton: {
      label: "बदलाव सेव करें",
      loadingText: "सेव हो रहा है...",
    },
    id: {
      label: "लीड ID",
      description: "अपडेट की जाने वाली लीड की यूनिक पहचान",
    },
    form: {
      title: "लीड एडिट करें",
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
      label: "ईमेल",
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
      placeholder: "John Doe",
    },
    status: {
      label: "स्थिति",
      description: "लीड की मौजूदा स्थिति",
      placeholder: "स्थिति चुनें",
    },
    contactDetails: {
      title: "संपर्क ब्योरा",
      description: "संपर्क जानकारी अपडेट करें",
    },
    phone: {
      label: "फ़ोन",
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
      label: "स्रोत",
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
        content: "बनने का समय",
      },
      updatedAt: {
        content: "अपडेट होने का समय",
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
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
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
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
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
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "कार्रवाई सफलतापूर्वक पूरी हुई",
    },
  },
  enums: {
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
      nurture: "पोषण",
      reactivation: "पुनः सक्रियण",
    },
    emailJourneyVariant: {
      uncensoredConvert: "अनसेंसर्ड कन्वर्ट",
      sideHustle: "साइड हसल",
      quietRecommendation: "शांत सिफ़ारिश",
    },
  },
  journey: {
    reviewUnavailable: "वॉलेट, सहमति और जर्नी रिकॉर्ड लोड नहीं हो सके।",
    title: "लीड जर्नी",
    subtitle: "सबसे पुराना पहले · हाल की गतिविधि और दर्ज माइलस्टोन",
    unavailable: "जर्नी का सबूत लोड नहीं हो सका",
    campaign: "कैंपेन कतार",
    emailScheduled: "अगला तय ईमेल",
    campaignRunning: "कैंपेन जारी है",
    noQueue: "कोई ईमेल तय नहीं है",
    openQueue: "लीड कतार खोलें",
    openAccount: "अकाउंट खोलें",
    openLead: "लीड खोलें",
    attributionOnly:
      "एट्रिब्यूशन लिंक सिर्फ़ सुराग हैं जिनकी समीक्षा करनी है। एक साझा IP या ट्रैकिंग विज़िट में एक से ज़्यादा लोग हो सकते हैं।",
    recordedAccountLink: "दर्ज अकाउंट लिंक",
    recordedConversion: "कन्वर्ज़न पर दर्ज अकाउंट",
    attributedAccount: "ग्रोथ एट्रिब्यूशन में दर्ज अकाउंट",
    previewIpMatches: "लीड के बीच IP मिलान का प्रीव्यू करें",
    wallets: "वॉलेट रिकॉर्ड",
    noWallets: "कोई वॉलेट रिकॉर्ड नहीं मिला",
    thisLeadWallet: "इस लीड का वॉलेट",
    accountWallet: "अकाउंट वॉलेट",
    relatedLeadWallet: "संबंधित लीड का वॉलेट",
    newsletterConsent: "न्यूज़लेटर सहमति रिकॉर्ड",
    noNewsletter: "कोई जुड़ा न्यूज़लेटर रिकॉर्ड नहीं",
    consentRecorded: "सहमति दर्ज",
    consentAbsent: "कोई सहमति दर्ज नहीं",
    confirmedOn: "{{date}} को पक्का हुआ",
    confirmationMissing: "पुष्टि की तारीख़ ग़ायब",
    guestConsent: "अनसेंसर्ड मॉडल के लिए गेस्ट की सहमति",
    consentVersion: "सहमति वर्ज़न {{version}}",
    leadReference: "लीड ID {{id}}",
    accountReference: "अकाउंट ID {{id}}",
    leadSource: "लीड स्रोत · {{source}}",
    guestConsentOn: "अनसेंसर्ड मॉडल की सहमति {{date}} को दर्ज हुई",
    guestConsentMissing: "अनसेंसर्ड मॉडल की कोई सहमति दर्ज नहीं",
    consentVersionMissing: "सहमति का वर्ज़न ग़ायब",
    firstTouch: "पहली विज़िट · {{touch}}",
    lastTouch: "आख़िरी एट्रिब्यूटेड विज़िट · {{touch}}",
    attributionMissing: "कोई ग्रोथ एट्रिब्यूशन दर्ज नहीं",
    linkEvidenceUnavailable: "सहमति और एट्रिब्यूशन का ब्योरा उपलब्ध नहीं",
    optedOutOn: "ऑप्ट-आउट {{date}} को दर्ज हुआ",
    optOutDateMissing: "ऑप्ट-आउट की कोई तारीख़ दर्ज नहीं",
    events: {
      created: "लीड बनी",
      campaignStarted: "कैंपेन शुरू हुआ",
      emailSent: "कैंपेन ईमेल भेजा गया",
      emailBounced: "कैंपेन ईमेल बाउंस हुआ",
      bounced: "लीड बाउंस चिह्नित हुई",
      unsubscribed: "लीड ने अनसब्सक्राइब किया",
      invalid: "लीड अमान्य चिह्नित हुई",
      signup: "अकाउंट साइन अप हुआ",
      converted: "कन्वर्ज़न दर्ज हुआ",
      subscriptionConfirmed: "सब्सक्रिप्शन पक्का हुआ",
      firstTouch: "पहली दर्ज विज़िट",
      lastTouch: "आख़िरी एट्रिब्यूटेड विज़िट",
      firstChat: "पहली चैट",
      firstPayment: "पहला पेड कन्वर्ज़न",
      leadLink: "संबंधित लीड जुड़ी",
      accountLink: "अकाउंट लिंक दर्ज हुआ",
      referral: "इस्तेमाल हुआ रेफ़रल कोड",
      interaction: "इंटरैक्शन दर्ज हुआ",
      newsletterSubscribed: "न्यूज़लेटर साइनअप दर्ज हुआ",
      newsletterConfirmed: "न्यूज़लेटर ईमेल पक्का हुआ",
      newsletterUnsubscribed: "न्यूज़लेटर अनसब्सक्राइब हुआ",
    },
    evidence: {
      ipMatch: "साझा IP मिलान",
      trackPage: "ट्रैकिंग विज़िट और विज़िटर कुकी",
      referral: "रेफ़रल लिंक",
      manual: "मैन्युअल लिंक",
      test: "टेस्ट लिंक",
      login: "लॉगिन पर जुड़ा",
      signup: "साइनअप पर जुड़ा",
      merge: "ऐतिहासिक मर्ज लिंक",
    },
  },
  widget: {
    loading: "लीड लोड हो रही है...",
    notFound: "लीड नहीं मिली।",
    loadFailed: "लीड लोड नहीं हो सकी",
    retryLoad: "फिर कोशिश करें",
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
    opened: "खोला",
    clicked: "क्लिक किया",
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
    unsubscribed: "अनसब्सक्राइब",
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
    ago: "ago",
    variant: "वेरिएंट:",
    copyEmail: "email",
    copyId: "ID",
    copyPhone: "phone",
    copyUserId: "यूज़र ID",
    stageNotStarted: "शुरू नहीं हुआ",
    stageInitial: "शुरुआती",
    stageFollowup1: "फ़ॉलो-अप 1",
    stageFollowup2: "फ़ॉलो-अप 2",
    stageFollowup3: "फ़ॉलो-अप 3",
    stageNurture: "पोषण",
    stageReactivation: "पुनः सक्रियण",
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
    more: "और",
    copyLeadId: "लीड ID कॉपी करें",
    kpiFirstTouch: "पहला टच",
    kpiStage: "कैंपेन चरण",
    kpiEmails: "खोले गए ईमेल",
    kpiOpenRate: "{{percent}}% ओपन दर",
    kpiAge: "लीड की उम्र",
    kpiAgeValue: "{{count}} दिन",
    kpiAgeHint: "{{date}} को बनी",
    kpiCredits: "इस्तेमाल हुए फ़्री क्रेडिट",
    kpiCreditsHint: "फ़्री टियर पर ख़र्च हुए",
    notTracked: "ट्रैक नहीं",
    selectLead: "लीड चुनें",
  },
  delete: {
    title: "लीड हटाएँ",
    titleShort: "लीड हटाएँ",
    description: "इस लीड और उसकी जर्नी को हमेशा के लिए हटाएँ। यह वापस नहीं हो सकता।",
    container: {
      title: "लीड हटाएँ",
      description: "क्या आप सच में इस लीड को हमेशा के लिए हटाना चाहते हैं?",
    },
    backButton: {
      label: "रद्द करें",
    },
    submitButton: {
      label: "लीड हटाएँ",
      loadingText: "हटाया जा रहा है...",
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
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
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
