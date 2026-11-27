import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "कस्टम स्किल देखने के लिए लॉग इन करना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको इस रिसोर्स को एक्सेस करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "स्किल लाते समय एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "मौजूदा स्थिति से टकराव हो गया",
      },
    },
  },
  title: "AI गतिविधि",
  description: "पिछले सात दिनों में बनी मॉडल कैटलॉग और बातचीत का जायज़ा लें।",
  models: "कैटलॉग में मॉडल",
  providers: "मॉडल प्रोवाइडर",
  skills: "पब्लिश की गई कम्युनिटी स्किल",
  conversations: "नई बातचीत",
  reported: "रिपोर्ट की गई स्किल",
  attention: "रिव्यू चाहिए",
  clear: "कोई रिपोर्ट की गई स्किल नहीं।",
  unavailable: "मॉडरेशन स्टेटस उपलब्ध नहीं है।",
  recent: "हाल की गतिविधि",
  loading: "AI गतिविधि लोड हो रही है…",
  failed: "AI गतिविधि लोड नहीं हो पाई।",
};
