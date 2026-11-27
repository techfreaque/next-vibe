import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",

  roles: {
    widget: {
      added: "रोल दिया गया: {{role}}",
      removed: "रोल हटाया गया: {{role}}",
      removeWarning: "अगली रिक्वेस्ट से यूज़र इस रोल की दी हर अनुमति खो देगा।",
      addHint: "यूज़र की अगली रिक्वेस्ट से लागू होता है।",
    },
    post: {
      title: "यूज़र रोल जोड़ें",
      titleShort: "रोल जोड़ें",
      description: "किसी खास यूज़र अकाउंट को रोल दें",
      container: {
        title: "रोल जोड़ें",
        description: "इस यूज़र को देने के लिए रोल चुनें",
      },
      id: {
        label: "यूज़र",
        description: "जिस यूज़र को रोल देना है उसकी यूनीक पहचान",
        placeholder: "यूज़र ID डालें...",
      },
      role: {
        label: "रोल",
        description: "यूज़र को दिया जाने वाला रोल",
        placeholder: "रोल चुनें...",
      },
      submit: {
        label: "रोल जोड़ें",
      },
      response: {
        roleId: {
          content: "रोल असाइनमेंट ID",
        },
        userId: {
          content: "यूज़र ID",
        },
        assignedRole: {
          content: "दिया गया रोल",
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "यूज़र रोल मैनेज करने के लिए लॉग इन होना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन फ़ेल",
          description: "सही यूज़र ID और रोल दें",
        },
        forbidden: {
          title: "एक्सेस प्रतिबंधित",
          description: "यूज़र रोल सिर्फ़ एडमिन मैनेज कर सकते हैं",
        },
        notFound: {
          title: "यूज़र नहीं मिला",
          description: "बताया गया यूज़र नहीं मिल सका",
          detail: "ID {{userId}} वाला कोई यूज़र नहीं मिला।",
        },
        conflict: {
          title: "रोल पहले से दिया है",
          description: "इस यूज़र के पास यह रोल पहले से है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unsavedChanges: {
          title: "बिना सेव बदलाव",
          description: "आपके बिना सेव बदलाव खो जाएँगे",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर एरर की वजह से रोल नहीं जोड़ा जा सका",
          detail: "यूज़र {{userId}} को {{role}} रोल नहीं दिया जा सका।",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "रोल जोड़ते समय कुछ अनपेक्षित हुआ",
        },
      },
      success: {
        title: "रोल जुड़ गया",
        description: "यूज़र को रोल सफलतापूर्वक दे दिया गया",
      },
    },
    delete: {
      title: "यूज़र रोल हटाएँ",
      titleShort: "रोल हटाएँ",
      description: "किसी खास यूज़र अकाउंट से रोल वापस लें",
      container: {
        title: "रोल हटाएँ",
        description: "इस यूज़र से वापस लेने के लिए रोल चुनें",
      },
      id: {
        label: "यूज़र",
        description: "जिस यूज़र से रोल वापस लेना है उसकी यूनीक पहचान",
        placeholder: "यूज़र ID डालें...",
      },
      role: {
        label: "रोल",
        description: "यूज़र से वापस लिया जाने वाला रोल",
        placeholder: "रोल चुनें...",
      },
      submit: {
        label: "रोल हटाएँ",
      },
      response: {
        success: {
          content: "रोल हटा दिया गया",
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "यूज़र रोल मैनेज करने के लिए लॉग इन होना ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन फ़ेल",
          description: "सही यूज़र ID और रोल दें",
        },
        forbidden: {
          title: "एक्सेस प्रतिबंधित",
          description: "यूज़र रोल सिर्फ़ एडमिन मैनेज कर सकते हैं",
        },
        notFound: {
          title: "यूज़र नहीं मिला",
          description: "बताया गया यूज़र नहीं मिल सका",
          detail: "ID {{userId}} वाला कोई यूज़र नहीं मिला।",
        },
        conflict: {
          title: "टकराव एरर",
          description: "मौजूदा निर्भरताओं की वजह से रोल हटाया नहीं जा सका",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unsavedChanges: {
          title: "बिना सेव बदलाव",
          description: "आपके बिना सेव बदलाव खो जाएँगे",
        },
        server: {
          title: "सर्वर एरर",
          description: "सर्वर एरर की वजह से रोल हटाया नहीं जा सका",
          detail: "यूज़र {{userId}} से {{role}} रोल नहीं हटाया जा सका।",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "रोल हटाते समय कुछ अनपेक्षित हुआ",
        },
      },
      success: {
        title: "रोल हटा दिया गया",
        description: "यूज़र से रोल सफलतापूर्वक वापस ले लिया गया",
      },
    },
  },
  enums: {
    userRole: {
      public: "पब्लिक",
      customer: "ग्राहक",
      partnerAdmin: "पार्टनर एडमिन",
      partnerEmployee: "पार्टनर कर्मचारी",
      admin: "एडमिन",
      cliOff: "CLI बंद",
      cliAuthBypass: "CLI ऑथ बायपास",
      aiToolOff: "AI टूल बंद",
      webOff: "वेब बंद",
      mcpOff: "MCP बंद",
      mcpVisible: "MCP में दिखता है",
      productionOff: "प्रोडक्शन बंद",
      skillOff: "स्किल बंद",
    },
  },
};
