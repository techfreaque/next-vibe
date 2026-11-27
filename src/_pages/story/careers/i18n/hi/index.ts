import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "next-vibe के साथ बनाएँ: {{appName}}",
    category: "डेवलपर्स",
    description:
      "next-vibe किसी भी endpoint को एक साथ वेब फ़ॉर्म, CLI कमांड, MCP टूल, नेटिव स्क्रीन और AI से चलने वाली स्किल बना देता है। कंप्यूटर पर इंसान जो करता है, सब ऑटोमेट करें।",
    imageAlt: "next-vibe डेवलपर प्लेटफ़ॉर्म: {{appName}}",
    keywords:
      "next-vibe, AI ऑटोमेशन, डेवलपर प्लेटफ़ॉर्म, बिज़नेस ऑटोमेशन, ERP इंटीग्रेशन, प्रोडक्शन ऑटोमेशन, {{appName}}",
    ogTitle: "next-vibe के साथ बनाएँ: {{appName}}",
    ogDescription:
      "एक कोडबेस। हर प्लेटफ़ॉर्म। प्रोडक्शन लाइन, ERP सिस्टम, डेस्कटॉप वर्कफ़्लो ऑटोमेट करें: कंप्यूटर पर इंसान जो कुछ भी कर सकता है।",
    twitterTitle: "next-vibe के साथ बनाएँ: {{appName}}",
    twitterDescription:
      "एक कोडबेस। हर प्लेटफ़ॉर्म। प्रोडक्शन लाइन, ERP सिस्टम, डेस्कटॉप वर्कफ़्लो ऑटोमेट करें: कंप्यूटर पर इंसान जो कुछ भी कर सकता है।",
  },

  hero: {
    eyebrow: "करियर",
    title: "कोई जॉब बोर्ड नहीं। काम सबके लिए खुला है।",
    subtitle:
      "यहाँ कोई वैकेंसी लिस्ट नहीं है। काम खुला है: क्लाइंट्स को next-vibe पर बने प्रोडक्ट दें, असली बिज़नेस ऑटोमेट करें, अपनी पब्लिश की हुई स्किल से कमाएँ। जो कुछ चाहिए, सब GitHub पर है।",
    ctaPrimary: "बनाना शुरू करें",
    ctaSecondary: "डॉक्स पढ़ें",
  },

  audience: {
    title: "next-vibe से कौन बनाता है",
    items: {
      freelancers: {
        title: "फ़्रीलांसर और एजेंसियाँ",
        description:
          "क्लाइंट्स को AI वाले टूल दें, अलग-अलग बैकएंड, CLI और UI बनाए बिना। एक कोडबेस, हर प्लेटफ़ॉर्म।",
      },
      businessDevs: {
        title: "बिज़नेस डेवलपर्स",
        description:
          "अपना ERP, CRM या कोई भी इंटरनल सिस्टम AI वर्कफ़्लो से जोड़ें। डेटा डालें, फ़ैसले पाएँ: कोई जुगाड़ू glue code नहीं।",
      },
      industrialDevs: {
        title: "इंडस्ट्रियल और एम्बेडेड",
        description:
          "प्रोडक्शन लाइन पर डिवाइस कॉन्फ़िगरेशन ऑटोमेट करें। सेंसर ट्रिगर होते ही AI स्किल चलाएँ। Vibe Sense से मापें, Autopilot से एक्शन लें।",
      },
      enterpriseDevs: {
        title: "एंटरप्राइज़ टीमें",
        description:
          "बिखरे हुए टूल्स की जगह एक यूनिफ़ाइड प्लेटफ़ॉर्म। वेब UI, CLI, MCP, नेटिव ऐप: वही endpoint, ज़ीरो दोहराव।",
      },
    },
  },

  useCases: {
    title: "आप क्या बना सकते हैं",
    items: {
      erpIntegration: {
        title: "ERP और बिज़नेस सिस्टम इंटीग्रेशन",
        description:
          "प्रोडक्शन डेटा ऐसी AI स्किल में भेजें जो खराबी पहचाने, इन्वेंट्री अपडेट करे या दोबारा ऑर्डर का वर्कफ़्लो चलाए। आपका endpoint ही पुल है।",
      },
      desktopAutomation: {
        title: "पूरा डेस्कटॉप ऑटोमेशन",
        description:
          "next-vibe ब्राउज़र समेत पूरा डेस्कटॉप संभाल सकता है। फ़ॉर्म भरना, स्क्रैपिंग, नेविगेशन, फ़ाइल ऑपरेशन: एक बार स्क्रिप्ट करें, कहीं भी चलाएँ।",
      },
      productionLine: {
        title: "प्रोडक्शन लाइन ऑटोमेशन",
        description:
          "endpoint से डिवाइस रिमोटली कॉन्फ़िगर करें। Vibe Sense से क्वालिटी चेक चलाएँ। जैसे ही कोई माप सीमा पार करे, AI स्किल जवाब देती है।",
      },
      autopilotScheduling: {
        title: "शेड्यूल्ड AI एक्शन",
        description:
          "Autopilot आपकी स्किल शेड्यूल पर चलाता है। हर घंटे डेटा सोर्स चेक करें, रात के लॉग का सार निकालें, गड़बड़ी दिखते ही अलर्ट भेजें।",
      },
      vibeSenseMonitoring: {
        title: "Sense → decide → act पाइपलाइन",
        description:
          "Vibe Sense कुछ भी माप सकता है: मशीन आउटपुट, API हेल्थ, queue की लंबाई। रीडिंग स्किल को दें। स्किल फ़ैसला करती है। endpoint एक्शन लेता है।",
      },
      skillEconomy: {
        title: "जो बनाएँ, वह बेचें",
        description:
          "अपने ऑटोमेशन को स्किल बना दें। लिंक शेयर करें। उससे साइन अप करने वाले हर यूज़र के हर पेमेंट का 10% कमाएँ: हर महीने, जब तक वे पेमेंट करते रहें।",
      },
    },
  },

  architecture: {
    title: "एक definition। हर प्लेटफ़ॉर्म।",
    subtitle: "हर फ़ीचर के लिए एक definition.ts लिखें। बाकी सब अपने आप बनता है।",
    surfaces: {
      web: "वेब फ़ॉर्म",
      cli: "CLI कमांड",
      mcp: "MCP टूल",
      native: "नेटिव स्क्रीन",
      cron: "Cron जॉब",
      ai: "AI से चलने वाली स्किल",
    },
    description:
      "प्लेटफ़ॉर्म रनटाइम पर पहचाना जाता है। जो endpoint इंसान के लिए वेब UI दिखाता है, वही AI एजेंट के लिए मशीन से चलने वाला टूल बन जाता है: बिना एक्स्ट्रा कोड के।",
  },

  referral: {
    title: "बनाएँ। शेयर करें। कमाएँ।",
    description:
      "आपकी शेयर की हुई हर स्किल में आपका रेफ़रल लिंक होता है। आपके लाए यूज़र के हर पेमेंट का 10%। और 5% तब, जब किसी और का लिंक आपकी स्किल पर यूज़र लाए। हर महीने, जब तक वे पेमेंट करते रहें।",
    cta: "स्किल इकॉनमी कैसे काम करती है",
  },

  cta: {
    title: "एक endpoint से शुरू करें।",
    subtitle:
      "next-vibe को किसी मौजूदा प्रोजेक्ट में मिनटों में जोड़ें। या scaffold से शुरू करके आज ही पूरा मल्टी-प्लेटफ़ॉर्म टूल डिप्लॉय करें।",
    primary: "शुरू करें",
    secondary: "स्टोरी पोस्ट देखें",
  },

  // kept for type compatibility
  post: {
    title: "next-vibe के साथ बनाएँ",
    description: "डेवलपर प्लेटफ़ॉर्म endpoint",
    form: {
      title: "कॉन्फ़िगरेशन",
      description: "पैरामीटर सेट करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉग इन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन गड़बड़ी",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर गड़बड़ी",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
      },
      unknown: {
        title: "अज्ञात गड़बड़ी",
        description: "कोई अज्ञात गड़बड़ी हुई",
      },
      network: {
        title: "नेटवर्क गड़बड़ी",
        description: "नेटवर्क में गड़बड़ी हुई",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "काम पूरा हो गया",
    },
  },
};
