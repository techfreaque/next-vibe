import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },

  patch: {
    title: "फ़ोल्डर मूव करें",
    titleShort: "फ़ोल्डर मूव करें",
    description: "फ़ोल्डर को दूसरे पैरेंट में ले जाएँ",
    id: {
      label: "फ़ोल्डर ID",
      description: "जो फ़ोल्डर मूव करना है उसकी यूनिक पहचान",
    },
    parentId: {
      label: "पैरेंट फ़ोल्डर",
      description: "फ़ोल्डर को दूसरे पैरेंट में ले जाएँ (रूट के लिए null)",
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
        description: "फ़ोल्डर मूव करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर मूव करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर मूव करते समय एरर आया",
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
        description: "फ़ोल्डर को इस जगह नहीं ले जाया जा सकता",
      },
    },
    success: {
      title: "सफल",
      description: "फ़ोल्डर मूव हो गया",
    },
    backButton: { label: "वापस" },
    submitButton: { label: "फ़ोल्डर मूव करें", loadingText: "मूव हो रहा है..." },
  },
  widget: {
    moveFolder: {
      description: "मंज़िल वाला फ़ोल्डर चुनें",
      rootLevel: "(सबसे ऊपर)",
    },
  },
};
