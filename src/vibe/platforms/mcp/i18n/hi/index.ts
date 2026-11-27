import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tools: {
    category: "MCP टूल",
    tags: {
      mcp: "MCP",
    },
    get: {
      title: "MCP टूल की सूची",
      description: "मौजूदा यूज़र के लिए सभी उपलब्ध MCP टूल पाएँ",
      fields: {
        name: "टूल का नाम",
        description: "विवरण",
        inputSchema: "इनपुट स्कीमा",
      },
      response: {
        title: "MCP टूल सूची",
        description: "उपलब्ध MCP टूल की सूची",
      },
      errors: {
        validation: {
          title: "वैलिडेशन फ़ेल",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपको इस रिसोर्स को एक्सेस करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "रिसोर्स नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
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
          title: "टकराव",
          description: "रिसोर्स कॉन्फ़्लिक्ट मिला",
        },
      },
      success: {
        title: "सफल",
        description: "टूल सफलतापूर्वक मिल गए",
      },
    },
  },
  execute: {
    category: "MCP एक्ज़ीक्यूट",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "MCP टूल चलाएँ",
      titleShort: "MCP सर्वर",
      description: "नाम और आर्ग्युमेंट देकर MCP टूल चलाएँ",
      fields: {
        title: "टूल एक्ज़ीक्यूशन पैरामीटर",
        description: "टूल चलाने के पैरामीटर",
        name: {
          title: "टूल का नाम",
          description: "चलाए जाने वाले टूल का नाम (जैसे core:system:db:ping)",
          placeholder: "core:system:db:ping",
        },
        arguments: {
          title: "आर्ग्युमेंट",
          description: "टूल आर्ग्युमेंट, key-value जोड़ियों में",
          placeholder: "{}",
        },
      },
      response: {
        title: "टूल एक्ज़ीक्यूशन रिज़ल्ट",
        description: "टूल चलने का नतीजा",
        result: {
          content: {
            type: "कंटेंट टाइप",
            text: "कंटेंट",
          },
          isError: "एरर है या नहीं",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन फ़ेल",
          description: "टूल का नाम या आर्ग्युमेंट गलत हैं",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "इस टूल को चलाने की अनुमति आपके पास नहीं है",
        },
        notFound: {
          title: "टूल नहीं मिला",
          description: "बताया गया टूल मौजूद नहीं है",
        },
        server: {
          title: "सर्वर एरर",
          description: "टूल एक्ज़ीक्यूशन फ़ेल हुआ",
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
          title: "टकराव",
          description: "रिसोर्स कॉन्फ़्लिक्ट मिला",
        },
      },
      success: {
        title: "सफल",
        description: "टूल सफलतापूर्वक चला",
      },
    },
  },
  serve: {
    category: "MCP सर्वर",
    tags: {
      mcp: "MCP",
    },
    post: {
      title: "MCP सर्वर शुरू करें",
      titleShort: "MCP सर्वर",
      description: "Model Context Protocol सर्वर शुरू करें",
      response: {
        title: "MCP सर्वर स्टेटस",
        description: "MCP सर्वर का स्टेटस",
      },
      errors: {
        validation: {
          title: "वैलिडेशन फ़ेल",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "MCP सर्वर शुरू नहीं हो सका",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
      },
      success: {
        title: "सफल",
        description: "MCP सर्वर सफलतापूर्वक शुरू हो गया",
      },
    },
  },
  registry: {
    toolNotFound: "टूल नहीं मिला",
    endpointNotFound: "एंडपॉइंट नहीं मिला",
    permissionDenied: "अनुमति नहीं",
    toolExecutionFailed: "टूल एक्ज़ीक्यूशन फ़ेल हुआ",
  },
};
