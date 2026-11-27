import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },

  patch: {
    title: "फ़ोल्डर का नाम बदलें",
    titleShort: "फ़ोल्डर का नाम बदलें",
    description: "मौजूदा फ़ोल्डर का नाम बदलें",
    id: {
      label: "फ़ोल्डर ID",
      description: "जिस फ़ोल्डर का नाम बदलना है उसकी यूनिक पहचान",
    },
    name: {
      label: "नाम",
      description: "फ़ोल्डर का नया नाम",
    },
    icon: {
      label: "आइकन",
      description: "Lucide या Simple Icons आइकन का नाम",
    },
    response: {
      folder: {
        id: {
          content: "ID",
        },
        updatedAt: {
          content: "अपडेट का समय",
        },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया डेटा सही नहीं है",
        circularReference: "फ़ोल्डर को उसका ही पैरेंट नहीं बनाया जा सकता",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर का नाम बदलने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास इस फ़ोल्डर का नाम बदलने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर का नाम बदलते समय एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "इस नाम का फ़ोल्डर पहले से मौजूद है",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर का नाम बदल गया",
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "नाम बदलें",
      loadingText: "नाम बदल रहा है...",
    },
  },
};
