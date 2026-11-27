import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  passwordStrength: {
    label: "पासवर्ड की मज़बूती",
    weak: "कमज़ोर",
    fair: "ठीक-ठाक",
    good: "अच्छा",
    strong: "मज़बूत",
    requirement: {
      minLength: {
        icon: "✗",
        text: "कम से कम 8 कैरेक्टर",
      },
      uppercase: {
        icon: "✗",
        text: "कम से कम एक कैपिटल अक्षर",
      },
      lowercase: {
        icon: "✗",
        text: "कम से कम एक स्मॉल अक्षर",
      },
      number: {
        icon: "✗",
        text: "कम से कम एक नंबर",
      },
      special: {
        icon: "!",
        text: "स्पेशल कैरेक्टर (ज़रूरी नहीं, पासवर्ड को मज़बूत बनाता है)",
      },
    },
  },
  post: {
    title: "_components",
    description: "_components एंडपॉइंट",
    form: {
      title: "_components कॉन्फ़िगरेशन",
      description: "_components पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "_components रिस्पॉन्स डेटा",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "एक अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
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
      title: "हो गया",
      description: "काम सफलतापूर्वक पूरा हुआ",
    },
  },
};
