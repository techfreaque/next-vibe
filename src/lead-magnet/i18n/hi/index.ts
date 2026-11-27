import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "लीड मैग्नेट",
  tags: {
    leadMagnet: "lead-magnet",
    config: "config",
    capture: "capture",
  },
  enums: {
    captureStatus: {
      success: "सफल",
      failed: "फ़ेल",
    },
    provider: {
      getresponse: "GetResponse",
      klaviyo: "Klaviyo",
      emarsys: "Emarsys",
      acumbamail: "Acumbamail",
      cleverreach: "CleverReach",
      connectif: "Connectif",
      datanext: "DataNext",
      edrone: "Edrone",
      expertsender: "ExpertSender",
      freshmail: "FreshMail",
      mailup: "MailUp",
      mapp: "Mapp",
      sailthru: "Sailthru",
      salesmanago: "SALESmanago",
      shopify: "Shopify",
      spotler: "Spotler",
      youlead: "YouLead",
      adobecampaign: "Adobe Campaign",
      googleSheets: "Google Sheets",
      platformEmail: "ईमेल (प्लेटफ़ॉर्म के ज़रिए)",
    },
  },
  config: {
    title: "लीड मैग्नेट कॉन्फ़िग",
    description: "अपना लीड मैग्नेट ईमेल इंटीग्रेशन कॉन्फ़िगर करें",
    form: {
      title: "लीड मैग्नेट सेटिंग्स",
      description: "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना ईमेल प्लेटफ़ॉर्म कनेक्ट करें",
      provider: {
        label: "ईमेल प्लेटफ़ॉर्म",
        description: "आप कौन सा ईमेल मार्केटिंग प्लेटफ़ॉर्म इस्तेमाल करते हैं?",
      },
      listId: {
        label: "लिस्ट / ग्रुप ID",
        description: "जिस लिस्ट या सेगमेंट में लीड जोड़नी हैं उसकी ID (वैकल्पिक)",
      },
      headline: {
        label: "फ़ॉर्म की हेडलाइन",
        description: "लीड कैप्चर फ़ॉर्म के ऊपर दिखने वाली हेडलाइन",
        placeholder: "मेरा AI प्रॉम्प्ट पैक फ़्री पाएँ",
      },
      buttonText: {
        label: "बटन का टेक्स्ट",
        description: "सबमिट बटन पर लिखा टेक्स्ट",
        placeholder: "एक्सेस पाएँ →",
      },
      isActive: {
        label: "सक्रिय",
        description: "अपने स्किल पेज पर लीड मैग्नेट फ़ॉर्म चालू या बंद करें",
      },
      credentials: {
        label: "API क्रेडेंशियल",
        description: "आपके ईमेल प्लेटफ़ॉर्म के API क्रेडेंशियल (एन्क्रिप्टेड स्टोर)",
      },
    },
    success: {
      saved: "लीड मैग्नेट कॉन्फ़िग सेव हुआ",
      deleted: "लीड मैग्नेट कॉन्फ़िग हट गया",
    },
  },
  capture: {
    title: "लिस्ट से जुड़ें",
    description: "सब्सक्राइब करें और एक्सेस पाएँ",
    form: {
      title: "एक्सेस पाएँ",
      description: "एक्सेस पाने के लिए अपना ब्योरा दें",
      firstName: {
        label: "पहला नाम",
        description: "आपका पहला नाम",
      },
      email: {
        label: "ईमेल पता",
        description: "आपका ईमेल पता",
      },
      skillId: {
        label: "स्किल ID",
        description: "आंतरिक स्किल रेफ़रेंस",
      },
    },
    success: {
      submitted: "आप जुड़ गए! अपना इनबॉक्स देखें।",
    },
  },
  errors: {
    providerError: "ईमेल प्रोवाइडर एरर",
  },
  providers: {
    shared: {
      connectionSettings: "कनेक्शन सेटिंग्स",
      listId: {
        label: "लिस्ट / ग्रुप ID",
        description: "जिस लिस्ट या सेगमेंट में लीड जोड़नी हैं उसकी ID",
        placeholder: "जैसे abc123",
      },
      headline: {
        label: "फ़ॉर्म की हेडलाइन",
        description: "आपके स्किल पेज पर लीड कैप्चर फ़ॉर्म के ऊपर दिखने वाली हेडलाइन",
        placeholder: "मेरा AI प्रॉम्प्ट पैक फ़्री पाएँ",
      },
      buttonText: {
        label: "बटन का टेक्स्ट",
        description: "सबमिट बटन पर लिखा टेक्स्ट",
        placeholder: "एक्सेस पाएँ →",
      },
      isActive: {
        label: "सक्रिय",
        description: "अपने स्किल पेज पर लीड कैप्चर फ़ॉर्म चालू करें",
      },
      secretKeepExisting: "मौजूदा key रखने के लिए ख़ाली छोड़ें",
      saveTitle: "कॉन्फ़िग सेव करें",
      saveDescription: "लीड कैप्चर करने के लिए अपना ईमेल प्लेटफ़ॉर्म कनेक्ट करें",
      saveTag: "lead-magnet-provider",
      saveSuccess: {
        title: "कॉन्फ़िग सेव हुआ",
        description: "आपका ईमेल प्लेटफ़ॉर्म कनेक्ट हो गया है। लीड आने लगेंगी।",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "कृपया अपना इनपुट जाँचें",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपका लॉग इन होना ज़रूरी है",
        },
        forbidden: {
          title: "मना है",
          description: "आपके पास अनुमति नहीं है",
        },
        notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
        conflict: { title: "टकराव", description: "टकराव हो गया" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        internal: {
          title: "सर्वर एरर",
          description: "आंतरिक एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "कोई अनजान एरर आई",
        },
      },
      response: {
        provider: "प्रोवाइडर",
        isActive: "सक्रिय",
        headline: "हेडलाइन",
        buttonText: "बटन का टेक्स्ट",
        listId: "लिस्ट ID",
      },
    },
    klaviyo: {
      title: "Klaviyo कनेक्ट करें",
      titleShort: "Klaviyo",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Klaviyo अकाउंट कनेक्ट करें",
      klaviyoApiKey: {
        label: "Klaviyo API Key",
        description: "आपकी निजी Klaviyo API key",
        placeholder: "pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    getresponse: {
      title: "GetResponse कनेक्ट करें",
      titleShort: "GetResponse",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना GetResponse अकाउंट कनेक्ट करें",
      getresponseApiKey: {
        label: "GetResponse API Key",
        description: "अकाउंट सेटिंग्स से आपकी GetResponse API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    emarsys: {
      title: "Emarsys कनेक्ट करें",
      titleShort: "Emarsys",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Emarsys अकाउंट कनेक्ट करें",
      emarsysUserName: {
        label: "यूज़रनेम",
        description: "आपका Emarsys API यूज़रनेम",
        placeholder: "account123",
      },
      emarsysApiKey: {
        label: "API Key",
        description: "आपकी Emarsys API सीक्रेट key",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      emarsysSubDomain: {
        label: "सबडोमेन",
        description: "आपका Emarsys API सबडोमेन (जैसे suite.emarsys.net)",
        placeholder: "suite.emarsys.net",
      },
    },
    acumbamail: {
      title: "Acumbamail कनेक्ट करें",
      titleShort: "Acumbamail",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Acumbamail अकाउंट कनेक्ट करें",
      acumbamailApiKey: {
        label: "API Key",
        description: "आपकी Acumbamail API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    cleverreach: {
      title: "CleverReach कनेक्ट करें",
      titleShort: "CleverReach",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना CleverReach अकाउंट कनेक्ट करें",
      cleverreachClientId: {
        label: "क्लाइंट ID",
        description: "आपकी CleverReach OAuth क्लाइंट ID",
        placeholder: "xxxxxxxx",
      },
      cleverreachClientSecret: {
        label: "क्लाइंट सीक्रेट",
        description: "आपका CleverReach OAuth क्लाइंट सीक्रेट",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      cleverreachListId: {
        label: "ग्रुप / लिस्ट ID",
        description: "जिस CleverReach ग्रुप में कॉन्टैक्ट जोड़ने हैं उसकी ID",
        placeholder: "123456",
      },
      cleverreachFormId: {
        label: "DOI फ़ॉर्म ID (वैकल्पिक)",
        description: "डबल ऑप्ट-इन के लिए फ़ॉर्म ID। DOI छोड़ने के लिए ख़ाली छोड़ें।",
        placeholder: "123456",
      },
      cleverreachSource: {
        label: "स्रोत (वैकल्पिक)",
        description: "ट्रैकिंग के लिए कॉन्टैक्ट स्रोत का लेबल",
        placeholder: "unbottled.ai",
      },
    },
    connectif: {
      title: "Connectif कनेक्ट करें",
      titleShort: "Connectif",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Connectif अकाउंट कनेक्ट करें",
      connectifApiKey: {
        label: "API Key",
        description: "आपकी Connectif API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    datanext: {
      title: "DataNext कनेक्ट करें",
      titleShort: "DataNext",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना DataNext अकाउंट कनेक्ट करें",
      datanextApiKey: {
        label: "API Key",
        description: "आपकी DataNext API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextApiSecret: {
        label: "API सीक्रेट",
        description: "आपका DataNext API सीक्रेट",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      datanextFormId: {
        label: "फ़ॉर्म ID",
        description: "ऑप्ट-इन फ़ॉर्म की DataNext फ़ॉर्म ID",
        placeholder: "123456",
      },
      datanextCampaignId: {
        label: "कैंपेन ID",
        description: "जिस कैंपेन से लीड जोड़नी हैं उसकी ID",
        placeholder: "123456",
      },
    },
    edrone: {
      title: "Edrone कनेक्ट करें",
      titleShort: "Edrone",
      description: "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Edrone अकाउंट कनेक्ट करें",
      edroneAppId: {
        label: "ऐप ID",
        description: "आपकी Edrone ऐप ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
    },
    expertsender: {
      title: "ExpertSender कनेक्ट करें",
      titleShort: "ExpertSender",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना ExpertSender अकाउंट कनेक्ट करें",
      expertSenderApiDomain: {
        label: "API डोमेन",
        description: "आपका ExpertSender API डोमेन",
        placeholder: "api3.esv2.com",
      },
      expertSenderApiKey: {
        label: "API Key",
        description: "आपकी ExpertSender API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    freshmail: {
      title: "FreshMail कनेक्ट करें",
      titleShort: "FreshMail",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना FreshMail अकाउंट कनेक्ट करें",
      freshmailApiKey: {
        label: "API Key",
        description: "आपकी FreshMail API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      freshmailApiSecret: {
        label: "API सीक्रेट",
        description: "आपका FreshMail API सीक्रेट",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listHash: {
        label: "लिस्ट हैश",
        description: "जिस सब्सक्राइबर लिस्ट में लीड जोड़नी हैं उसका हैश",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    mailup: {
      title: "MailUp कनेक्ट करें",
      titleShort: "MailUp",
      description: "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना MailUp अकाउंट कनेक्ट करें",
      mailupClientId: {
        label: "क्लाइंट ID",
        description: "आपकी MailUp OAuth क्लाइंट ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupClientSecret: {
        label: "क्लाइंट सीक्रेट",
        description: "आपका MailUp OAuth क्लाइंट सीक्रेट",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      mailupUsername: {
        label: "यूज़रनेम",
        description: "आपके MailUp अकाउंट का यूज़रनेम",
        placeholder: "m12345",
      },
      mailupPassword: {
        label: "पासवर्ड",
        description: "आपके MailUp अकाउंट का पासवर्ड",
        placeholder: "••••••••",
      },
      mailupListId: {
        label: "लिस्ट ID",
        description: "जिस लिस्ट में कॉन्टैक्ट सब्सक्राइब करने हैं उसकी संख्यात्मक ID",
        placeholder: "1",
      },
    },
    mapp: {
      title: "Mapp कनेक्ट करें",
      titleShort: "Mapp",
      description: "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Mapp अकाउंट कनेक्ट करें",
      mappUsername: {
        label: "यूज़रनेम",
        description: "आपका Mapp API यूज़रनेम",
        placeholder: "username",
      },
      mappPassword: {
        label: "पासवर्ड",
        description: "आपका Mapp API पासवर्ड",
        placeholder: "••••••••",
      },
      mappDomain: {
        label: "डोमेन",
        description: "आपका Mapp API डोमेन",
        placeholder: "api.mapp.com",
      },
    },
    sailthru: {
      title: "Sailthru कनेक्ट करें",
      titleShort: "Sailthru",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Sailthru अकाउंट कनेक्ट करें",
      sailthruApiKey: {
        label: "API Key",
        description: "आपकी Sailthru API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      sailthruSecret: {
        label: "API सीक्रेट",
        description: "आपका Sailthru API सीक्रेट",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      listName: {
        label: "लिस्ट का नाम",
        description: "जिस Sailthru लिस्ट में कॉन्टैक्ट सब्सक्राइब करने हैं उसका नाम",
        placeholder: "मेरे सब्सक्राइबर",
      },
    },
    salesmanago: {
      title: "SALESmanago कनेक्ट करें",
      titleShort: "SALESmanago",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना SALESmanago अकाउंट कनेक्ट करें",
      salesManagoClientId: {
        label: "क्लाइंट ID",
        description: "आपकी SALESmanago क्लाइंट ID",
        placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      },
      salesManagoApiKey: {
        label: "API Key",
        description: "आपकी SALESmanago API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoSha: {
        label: "SHA",
        description: "ऑथेंटिकेशन के लिए आपका SALESmanago SHA हैश",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      salesManagoDomain: {
        label: "डोमेन",
        description: "आपका SALESmanago API डोमेन",
        placeholder: "app3.salesmanago.pl",
      },
      salesManagoOwner: {
        label: "मालिक का ईमेल",
        description: "आपके SALESmanago अकाउंट के मालिक का ईमेल",
        placeholder: "owner@example.com",
      },
    },
    shopify: {
      title: "Shopify कनेक्ट करें",
      titleShort: "Shopify",
      description: "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Shopify स्टोर कनेक्ट करें",
      shopifyDomain: {
        label: "स्टोर डोमेन",
        description: "आपका Shopify स्टोर डोमेन",
        placeholder: "mystore.myshopify.com",
      },
      shopifyAccessToken: {
        label: "एक्सेस टोकन",
        description: "आपका Shopify Admin API एक्सेस टोकन",
        placeholder: "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    spotler: {
      title: "Spotler कनेक्ट करें",
      titleShort: "Spotler",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Spotler अकाउंट कनेक्ट करें",
      spotlerConsumerKey: {
        label: "कंज़्यूमर Key",
        description: "आपकी Spotler API कंज़्यूमर key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      spotlerConsumerSecret: {
        label: "कंज़्यूमर सीक्रेट",
        description: "आपका Spotler API कंज़्यूमर सीक्रेट",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    youlead: {
      title: "YouLead कनेक्ट करें",
      titleShort: "YouLead",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना YouLead अकाउंट कनेक्ट करें",
      youLeadAppId: {
        label: "ऐप ID",
        description: "आपकी YouLead एप्लिकेशन ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadClientId: {
        label: "क्लाइंट ID",
        description: "आपकी YouLead क्लाइंट ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      youLeadAppSecretKey: {
        label: "ऐप सीक्रेट Key",
        description: "आपकी YouLead एप्लिकेशन सीक्रेट key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    adobecampaign: {
      title: "Adobe Campaign कनेक्ट करें",
      titleShort: "Adobe Campaign",
      description:
        "अपने स्किल पेज से लीड कैप्चर करने के लिए अपना Adobe Campaign अकाउंट कनेक्ट करें",
      adobeCampaignOrganizationId: {
        label: "ऑर्गनाइज़ेशन ID",
        description: "आपकी Adobe IMS ऑर्गनाइज़ेशन ID",
        placeholder: "XXXXXXXXXXXXXXXXXXXXXXXX@AdobeOrg",
      },
      adobeCampaignClientId: {
        label: "क्लाइंट ID",
        description: "आपकी Adobe Campaign API क्लाइंट ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignClientSecret: {
        label: "क्लाइंट सीक्रेट",
        description: "आपका Adobe Campaign API क्लाइंट सीक्रेट",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignApiKey: {
        label: "API Key",
        description: "आपकी Adobe Campaign API key",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
      adobeCampaignListId: {
        label: "लिस्ट ID",
        description: "जिस Adobe Campaign प्रोफ़ाइल लिस्ट में लीड जोड़नी हैं उसकी ID",
        placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      },
    },
    platformEmail: {
      title: "प्लेटफ़ॉर्म ईमेल से सूचित करें",
      titleShort: "प्लेटफ़ॉर्म ईमेल",
      description: "आपके लीड मैग्नेट से जब भी कोई साइन अप करे, ईमेल सूचना पाएँ",
      notifyEmail: {
        label: "सूचना का ईमेल",
        description: "लीड की सूचनाएँ कहाँ भेजनी हैं",
        placeholder: "you@example.com",
      },
      notifyEmailName: {
        label: "आपका नाम",
        description: "सूचना ईमेल में दिखने वाला नाम",
        placeholder: "Jane",
      },
    },
    googleSheets: {
      title: "Google Sheets कनेक्ट करें",
      titleShort: "Google Sheets",
      description:
        "जब भी कोई लीड साइन अप करे, अपनी Google स्प्रेडशीट में एक पंक्ति जोड़ें",
      saveTitle: "Google Sheets कॉन्फ़िग सेव करें",
      connect: {
        label: "Google अकाउंट कनेक्ट करें",
      },
      connected: {
        description: "आपका Google अकाउंट कनेक्ट हो गया है",
      },
      spreadsheetId: {
        label: "स्प्रेडशीट",
        description: "वह स्प्रेडशीट चुनें जिसमें लीड जोड़ी जाएँगी",
        placeholder: "स्प्रेडशीट चुनें…",
      },
      sheetTab: {
        label: "शीट टैब (वैकल्पिक)",
        description:
          "स्प्रेडशीट के भीतर टैब का नाम। पहला टैब इस्तेमाल करने के लिए ख़ाली छोड़ें।",
        placeholder: "जैसे Leads",
      },
      widget: {
        connectTitle: "Google Sheets कनेक्ट करें",
        connectDescription:
          "हर नई लीड को अपने आप अपनी स्प्रेडशीट की पंक्ति बनाने के लिए Google से साइन इन करें।",
        redirectNote: "स्प्रेडशीट का एक्सेस देने के लिए आपको Google पर भेजा जाएगा।",
        reconnect: "दोबारा कनेक्ट करें",
        loading: "स्प्रेडशीट लोड हो रही हैं…",
        noSheets: "कोई स्प्रेडशीट नहीं मिली",
        refresh: "सूची रिफ़्रेश करें",
        selectRequired: "कृपया स्प्रेडशीट चुनें",
        saveFailed: "सेव नहीं हुआ। फिर कोशिश करें।",
        saving: "सेव हो रहा है…",
      },
    },
  },
};
