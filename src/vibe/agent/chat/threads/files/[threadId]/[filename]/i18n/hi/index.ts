import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    files: "फ़ाइलें",
  },
  get: {
    title: "फ़ाइल पाएँ",
    titleShort: "थ्रेड फ़ाइल",
    description: "अपलोड की गई फ़ाइल पाएँ",
    success: {
      title: "फ़ाइल मिल गई",
      description: "फ़ाइल मिल गई",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़ाइल रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर की वजह से फ़ाइल नहीं मिली",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "इस फ़ाइल तक पहुँचने के लिए लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको इस फ़ाइल तक पहुँचने की अनुमति नहीं है",
      },
      notFound: {
        title: "फ़ाइल नहीं मिली",
        description: "माँगी गई फ़ाइल नहीं मिली या एक्सेस मना है",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर एरर की वजह से फ़ाइल नहीं मिली",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात गड़बड़ी हुई",
      },
      unsavedChanges: {
        title: "अनसेव्ड बदलाव",
        description: "कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव की स्थिति बन गई",
      },
    },
  },
  errors: {
    fileNotFound: "फ़ाइल नहीं मिली या एक्सेस मना है",
  },
};
