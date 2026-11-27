import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  pages: {
    error: {
      title: "कुछ गड़बड़ हो गई!",
      message: "कुछ अनपेक्षित हुआ। हमें खेद है।",
      errorId: "एरर ID: {{id}}",
      error_message: "एरर: {{message}}",
      stackTrace: "स्टैक ट्रेस: {{stack}}",
      tryAgain: "फिर कोशिश करें",
      backToHome: "होम पर वापस",
    },
    frame: {
      endpointNotFound: 'एंडपॉइंट "{{endpointId}}" नहीं मिला',
      endpointLoadFailed: "एंडपॉइंट लोड नहीं हो पाया",
    },
    notFound: {
      title: "पेज नहीं मिला",
      description: "आप जो पेज ढूँढ रहे हैं वो मौजूद नहीं है या कहीं और चला गया है।",
      goBack: "वापस जाएँ",
      goHome: "होम पर जाएँ",
    },
  },
  meta: {
    title: "404: पेज नहीं मिला",
    category: "एरर",
    description: "आप जो पेज ढूँढ रहे हैं वो मौजूद नहीं है",
    imageAlt: "404 नहीं मिला",
    keywords: "404, पेज नहीं मिला, एरर",
  },
  post: {
    title: "[...notFound]",
    description: "[...notFound] एंडपॉइंट",
    form: {
      title: "[...notFound] कॉन्फ़िगरेशन",
      description: "[...notfound] पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "[...notFound] रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉग इन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी एरर हुआ",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "एक्सेस की अनुमति नहीं",
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
      description: "काम सफलतापूर्वक पूरा हुआ",
    },
  },
};
