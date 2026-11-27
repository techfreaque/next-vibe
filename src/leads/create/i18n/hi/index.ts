import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
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
    headerCreateLead: "नई लीड",
    subheaderFillDetails: "नीचे ब्योरा भरें",
    fallbackLeadName: "लीड",
    buttonCopyId: "ID कॉपी करें",
    buttonViewLead: "लीड देखें",
    buttonEditLead: "लीड एडिट करें",
    buttonBackToList: "सूची पर वापस",
  },
  post: {
    title: "लीड बनाएँ",
    titleShort: "नई लीड",
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
    validation: {
      country: "कोई देश चुनें।",
      language: "कोई भाषा चुनें।",
      source: "चुनें कि यह लीड कहाँ से आई।",
    },
    contactInfo: {
      title: "संपर्क",
      description: "लीड का मुख्य संपर्क ब्योरा",
    },
    email: {
      label: "ईमेल",
      description: "संपर्क के लिए मुख्य ईमेल पता",
      placeholder: "john@example.com",
    },
    businessName: {
      label: "बिज़नेस का नाम",
      description: "कंपनी या व्यवसाय का नाम",
      placeholder: "Example Corp",
    },
    phone: {
      label: "फ़ोन",
      description: "देश कोड के साथ संपर्क फ़ोन नंबर",
      placeholder: "+1234567890",
    },
    website: {
      label: "वेबसाइट",
      description: "कंपनी की वेबसाइट URL",
      placeholder: "https://example.com",
    },
    locationPreferences: {
      title: "लोकेशन और भाषा",
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
      title: "स्रोत और नोट्स",
      description: "लीड के बारे में अतिरिक्त जानकारी",
    },
    source: {
      label: "स्रोत",
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
        title: "अनजान एरर",
        description: "लीड बनाते समय अनजान एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "लीड बनाते समय नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "मना है",
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
      defaultName: "there",
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
        source: "स्रोत",
        status: "स्थिति",
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
        internal_server_error: "आंतरिक सर्वर एरर हुई",
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
