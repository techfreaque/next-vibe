import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    tag: "lead-magnet-config",
    title: "आपकी ईमेल लिस्ट",
    titleShort: "LM कॉन्फ़िग",
    description: "अपना मौजूदा लीड मैग्नेट कॉन्फ़िगरेशन देखें",
    response: {
      exists: "कॉन्फ़िग मौजूद है",
      config: "कॉन्फ़िग",
    },
    success: {
      title: "कॉन्फ़िग मिल गया",
      description: "आपका लीड मैग्नेट कॉन्फ़िग सफलतापूर्वक मिल गया",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट का डेटा गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपके पास अनुमति नहीं है",
      },
      notFound: { title: "नहीं मिला", description: "कोई कॉन्फ़िग नहीं मिला" },
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
  },
  widget: {
    delete: "डिस्कनेक्ट करें",
    confirmDelete: {
      title: "{{provider}} डिस्कनेक्ट करें?",
      description:
        "डिस्कनेक्ट करने से नए साइनअप रुक जाते हैं और यहाँ की कैप्चर हिस्ट्री साफ़ हो जाती है। आपके प्रोवाइडर को पहले भेजे गए कॉन्टैक्ट वहीं रहते हैं।",
      cancel: "कनेक्टेड रखें",
      proceed: "डिस्कनेक्ट करें",
    },
    back: "वापस",
    loading: "लोड हो रहा है…",
    pitch: {
      headline: "विज़िटर को सब्सक्राइबर बनाएँ",
      body: "जब कोई आपकी स्किल का पेज या क्रिएटर प्रोफ़ाइल देखता है, उसे सब्सक्राइब फ़ील्ड दिखता है। वे अपना ईमेल डालते हैं और वह सीधे आपकी लिस्ट में पहुँचता है। कोई अतिरिक्त ऐप नहीं, कोई बिचौलिया नहीं, बुनियादी कैप्चर का कोई मासिक शुल्क नहीं।",
      step1: "कोई आपकी स्किल का पेज या क्रिएटर प्रोफ़ाइल खोलता है",
      step2: "वह सब्सक्राइब फ़ॉर्म भेजता है",
      step3: "ईमेल आपकी पसंद के प्लेटफ़ॉर्म पर आपकी लिस्ट में पहुँचता है",
    },
    noConfig:
      "अपने स्किल पेज और क्रिएटर प्रोफ़ाइल से सब्सक्राइबर जुटाना शुरू करने के लिए ईमेल प्लेटफ़ॉर्म कनेक्ट करें।",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    choosePlatform: "ईमेल प्लेटफ़ॉर्म कनेक्ट करें",
    switchPlatform: "प्लेटफ़ॉर्म बदलें",
    selectPlaceholder: "प्लेटफ़ॉर्म चुनें…",
    providers: {
      GETRESPONSE: "GetResponse",
      KLAVIYO: "Klaviyo",
      EMARSYS: "Emarsys",
      ACUMBAMAIL: "Acumbamail",
      CLEVERREACH: "CleverReach",
      CONNECTIF: "Connectif",
      DATANEXT: "DataNext",
      EDRONE: "Edrone",
      EXPERTSENDER: "ExpertSender",
      FRESHMAIL: "FreshMail",
      MAILUP: "MailUp",
      MAPP: "Mapp",
      SAILTHRU: "Sailthru",
      SALESMANAGO: "SALESmanago",
      SHOPIFY: "Shopify",
      SPOTLER: "Spotler",
      YOULEAD: "YouLead",
      ADOBECAMPAIGN: "Adobe Campaign",
      GOOGLE_SHEETS: "Google Sheets",
      PLATFORM_EMAIL: "ईमेल (प्लेटफ़ॉर्म के ज़रिए)",
    },
    capturedLeads: "कैप्चर की गई लीड",
  },
  delete: {
    tag: "lead-magnet-config",
    title: "ईमेल प्लेटफ़ॉर्म डिस्कनेक्ट करें",
    titleShort: "डिस्कनेक्ट करें",
    description: "अपना लीड मैग्नेट कॉन्फ़िगरेशन हटाएँ और लीड कैप्चर करना बंद करें",
    response: {
      deleted: "डिस्कनेक्ट हो गया",
    },
    success: {
      title: "डिस्कनेक्ट हो गया",
      description: "आपका ईमेल प्लेटफ़ॉर्म डिस्कनेक्ट हो गया है",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट का डेटा गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपके पास अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "हटाने के लिए कोई कॉन्फ़िग नहीं मिला",
      },
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
  },
};
