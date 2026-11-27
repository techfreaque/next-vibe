import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटाबेस कार्रवाइयाँ",
  tag: "studio",
  post: {
    title: "डेटाबेस स्टूडियो",
    titleShort: "DB स्टूडियो",
    description: "विज़ुअल डेटाबेस मैनेजमेंट के लिए डेटाबेस स्टूडियो खोलें",
    form: {
      title: "स्टूडियो कॉन्फ़िगरेशन",
      description: "डेटाबेस स्टूडियो के पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "स्टूडियो रिस्पॉन्स",
      description: "डेटाबेस स्टूडियो शुरू करने के नतीजे",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "डेटाबेस स्टूडियो के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "स्टूडियो के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "स्टूडियो शुरू करते समय आंतरिक सर्वर एरर",
        detail: "Drizzle Studio {{seconds}} सेकंड बाद भी शुरू नहीं हुआ: {{error}}",
      },
      internal: {
        title: "आंतरिक एरर",
        description: "डेटाबेस स्टूडियो शुरू नहीं हो सका",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "स्टूडियो शुरू करते समय कोई अज्ञात एरर हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "स्टूडियो शुरू करते समय नेटवर्क एरर",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "डेटाबेस स्टूडियो के लिए अनुमतियाँ कम हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "स्टूडियो रिसोर्स नहीं मिले",
      },
      conflict: {
        title: "टकराव",
        description: "स्टूडियो पोर्ट में टकराव मिला",
      },
    },
    success: {
      title: "स्टूडियो शुरू हुआ",
      description: "डेटाबेस स्टूडियो सफलतापूर्वक शुरू हुआ",
    },
  },
  fields: {
    port: {
      title: "पोर्ट",
      description: "डेटाबेस स्टूडियो का पोर्ट नंबर (1024-65535)",
    },
    openBrowser: {
      title: "ब्राउज़र खोलें",
      description: "स्टूडियो को ब्राउज़र में अपने आप खोलें",
    },
    success: {
      title: "सफलता स्टेटस",
    },
    url: {
      title: "स्टूडियो URL",
    },
    portUsed: {
      title: "असल में इस्तेमाल हुआ पोर्ट",
    },
    output: {
      title: "शुरू करने का आउटपुट",
    },
    duration: {
      title: "शुरू होने में लगा समय",
    },
  },
};
