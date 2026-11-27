import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  tags: {
    remoteConnection: "रिमोट कनेक्शन",
  },
  providers: {
    memories: "मेमोरी",
    documents: "दस्तावेज़",
    skills: "स्किल",
    favorites: "फ़ेवरेट",
    threads: "थ्रेड",
  },
  providerDescriptions: {
    memories: "अपनी AI मेमोरी इंस्टेंस के बीच सिंक करें",
    documents: "अपनी दस्तावेज़ लाइब्रेरी सिंक करें",
    skills: "कस्टम स्किल और प्रॉम्प्ट सिंक करें",
    favorites: "सेव किए फ़ेवरेट कॉन्फ़िगरेशन सिंक करें",
    threads: "बातचीत के थ्रेड और मैसेज सिंक करें",
  },
  get: {
    title: "सिंक प्रोवाइडर",
    titleShort: "सिंक प्रोवाइडर",
    description: "कनेक्शन सेटिंग्स के लिए सभी रजिस्टर्ड सिंक प्रोवाइडर की सूची",
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट गलत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "लॉग इन नहीं है",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "एडमिन रोल ज़रूरी है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई प्रोवाइडर रजिस्टर्ड नहीं",
      },
      server: {
        title: "सर्वर एरर",
        description: "प्रोवाइडर लोड नहीं हो सके",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
    },
    success: {
      title: "प्रोवाइडर लोड हुए",
      description: "सिंक प्रोवाइडर की सूची सफलतापूर्वक मिली",
    },
  },
};
