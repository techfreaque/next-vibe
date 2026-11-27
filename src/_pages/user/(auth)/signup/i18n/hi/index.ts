import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    failedToLoadBrowserIdentity: "ब्राउज़र पहचान लोड नहीं हो पाई। पेज रीफ़्रेश करें।",
  },
  meta: {
    title: "फ़्री साइन अप करें: {{appName}}",
    description:
      "अपना {{appName}} अकाउंट बनाएँ और फ़्री क्रेडिट के साथ मेनस्ट्रीम और अनसेंसर्ड AI मॉडल से चैट शुरू करें।",
    category: "ऑथेंटिकेशन",
    imageAlt: "{{appName}} साइन अप",
    keywords: "साइन अप, रजिस्टर, अकाउंट बनाएँ, फ़्री AI चैट, {{appName}}",
    ogTitle: "{{appName}} पर साइन अप करें",
    ogDescription: "{{appName}} से जुड़ें और आज ही AI चैट शुरू करें",
    twitterTitle: "{{appName}} पर साइन अप करें",
    twitterDescription: "अपना अकाउंट बनाएँ और {{appName}} के साथ शुरू करें",
  },
  post: {
    title: "साइन अप",
    description: "साइन अप एंडपॉइंट",
    form: {
      title: "साइन अप कॉन्फ़िगरेशन",
      description: "साइन अप पैरामीटर सेट करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "साइन अप रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर ग़लत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "एक अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क में गड़बड़ हुई",
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
      description: "काम पूरा हो गया",
    },
  },
};
