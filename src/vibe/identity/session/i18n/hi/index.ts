import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    sessionErrorReason: {
      noTokenInCookies: "कुकी में कोई टोकन नहीं",
    },
  },
  errors: {
    session_not_found: "टोकन {{token}} के लिए सेशन नहीं मिला",
    session_token_missing: "कोई सेशन टोकन नहीं मिला ({{reason}})",
    session_lookup_failed: "सेशन {{token}} खोजा नहीं जा सका: {{error}}",
    current_session_failed: "मौजूदा सेशन पढ़ा नहीं जा सका: {{error}}",
    expired_sessions_delete_failed: "एक्सपायर सेशन हटाए नहीं जा सके",
    session_creation_failed: "यूज़र {{userId}} के लिए सेशन नहीं बन सका",
    session_creation_database_error:
      "यूज़र {{userId}} का सेशन बनाते समय डेटाबेस एरर: {{error}}",
    user_sessions_delete_failed:
      "सेशन {{sessionId}} हटाया नहीं जा सका: {{error}}",
    expired: "सेशन {{expiresAt}} को एक्सपायर हो गया",
  },
  post: {
    title: "सेशन",
    description: "सेशन एंडपॉइंट",
    form: {
      title: "सेशन कॉन्फ़िगरेशन",
      description: "सेशन पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "सेशन रिस्पॉन्स डेटा",
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
    },
    success: {
      title: "सफल",
      description: "ऑपरेशन सफल रहा",
    },
  },
};
