import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    missingUrlParam:
      "एंडपॉइंट {{endpoint}} के लिए URL पैरामीटर {{paramName}} गायब है",
    urlConstructionFailed: "URL बनाना फ़ेल: {{error}}",
    validationFailed: "वैलिडेशन फ़ेल: {{error}}",
    htmlResponseReceived:
      "{{url}} से JSON की जगह HTML जवाब मिला (स्टेटस {{status}})। जाँचें कि API सर्वर चल रहा है और एंडपॉइंट मौजूद है।",
    networkError: "नेटवर्क एरर हुआ: {{error}}",
    failedToLoadPage: "पेज लोड नहीं हो सका",
  },
  generate: {
    post: {
      title: "Expo इंडेक्स जेनरेट करें",
      titleShort: "Expo इंडेक्स",
      description: "Next.js पेज के लिए Expo Router कम्पैटिबिलिटी रैपर जेनरेट करें",
      response: {
        fields: {
          success: "सफल",
          created: "बनाई गई फ़ाइलें",
          skipped: "छोड़ी गई फ़ाइलें",
          errors: "एरर",
          message: "संदेश",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट पैरामीटर गलत हैं",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "आपको यह कार्रवाई करने की अनुमति नहीं है",
        },
        server: {
          title: "सर्वर एरर",
          description: "इंडेक्स जेनरेट करते समय एरर हुआ",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क एरर हुआ",
        },
        forbidden: {
          title: "प्रतिबंधित",
          description: "आपके पास यह कार्रवाई करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "सोर्स डायरेक्टरी नहीं मिली",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर हुआ",
        },
        conflict: {
          title: "टकराव",
          description: "टकराव हुआ",
        },
      },
      success: {
        title: "सफल",
        description:
          "{{created}} फ़ाइलें बनीं, {{skipped}} छोड़ी गईं, {{errors}} एरर",
      },
    },
  },
};
