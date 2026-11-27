import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  tags: {
    remoteConnection: "रिमोट कनेक्शन",
  },
  patch: {
    title: "इस इंस्टेंस का नाम बदलें",
    titleShort: "इंस्टेंस का नाम बदलें",
    description: "अपने इंस्टेंस का आसान नाम अपडेट करें",
    renaming: "नाम बदल रहा है…",
    newInstanceId: {
      label: "इंस्टेंस का नया नाम",
      description:
        "जुड़े हुए इंस्टेंस इस सर्वर को इसी नाम से देखते हैं। यूनिक होना चाहिए, अधिकतम 32 अक्षर।",
      placeholder: "hermes",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं है",
        description: "इस इंस्टेंस का नाम बदलने के लिए लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस अस्वीकृत",
        description: "आपको इस इंस्टेंस का नाम बदलने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "इंस्टेंस की पहचान नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "नाम बदलते समय एरर हुई",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
    },
    success: {
      title: "नाम बदला",
      description: "इंस्टेंस का नाम सफलतापूर्वक बदला",
    },
  },
};
