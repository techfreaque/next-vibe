import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    find_failed: "यूज़र {{userId}} के रोल नहीं मिल सके: {{error}}",
    batch_find_failed: "{{count}} यूज़र्स के रोल एक साथ नहीं मिल सके: {{error}}",
    not_found: "यूज़र {{userId}} के लिए रोल {{role}} नहीं मिला",
    lookup_failed:
      "यूज़र {{userId}} के लिए रोल {{role}} खोजा नहीं जा सका: {{error}}",
    add_failed: "यूज़र {{userId}} में रोल {{role}} जोड़ा नहीं जा सका: {{error}}",
    no_data_returned: "डेटाबेस से कोई डेटा नहीं मिला",
    remove_failed: "यूज़र {{userId}} से रोल {{role}} हटाया नहीं जा सका: {{error}}",
    check_failed:
      "यूज़र {{userId}} के लिए रोल {{role}} जाँचा नहीं जा सका: {{error}}",
    delete_failed: "यूज़र {{userId}} के रोल हटाए नहीं जा सके: {{error}}",
    endpoint_not_created: "यूज़र रोल एंडपॉइंट अभी बना नहीं है",
  },
  post: {
    title: "यूज़र रोल",
    description: "यूज़र रोल एंडपॉइंट",
    form: {
      title: "यूज़र रोल कॉन्फ़िगरेशन",
      description: "यूज़र रोल पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "यूज़र रोल रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में आंतरिक एरर हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस प्रतिबंधित है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा में टकराव हुआ",
      },
      database_connection_failed: {
        title: "डेटाबेस कनेक्शन विफल रहा",
        description: "डेटाबेस से कनेक्ट नहीं हो सका",
      },
    },
    success: {
      title: "सफल",
      description: "ऑपरेशन सफल रहा",
    },
  },
  enums: {
    userRole: {
      public: "पब्लिक",
      customer: "कस्टमर",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर कर्मचारी",
      admin: "एडमिन",
      cliOff: "CLI बंद",
      cliAuthBypass: "CLI ऑथ बायपास",
      aiToolOff: "AI टूल बंद",
      webOff: "वेब बंद",
      mcpOff: "MCP बंद",
      mcpVisible: "MCP दिखता है",
      cronAllowed: "क्रॉन में अनुमत",
      productionOff: "प्रोडक्शन में बंद",
      skillOff: "स्किल बंद",
    },
  },
};
