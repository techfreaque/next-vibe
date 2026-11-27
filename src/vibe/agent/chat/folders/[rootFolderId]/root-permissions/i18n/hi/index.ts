import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },

  get: {
    title: "रूट फ़ोल्डर की परमिशन देखें",
    titleShort: "फ़ोल्डर एक्सेस",
    description: "रूट फ़ोल्डर की परमिशन निकालें",
    container: {
      title: "रूट फ़ोल्डर की परमिशन",
      description: "रूट फ़ोल्डर की परमिशन देखें",
    },
    rootFolderId: {
      label: "रूट फ़ोल्डर",
      description: "जिस रूट फ़ोल्डर की परमिशन जाँचनी है उसकी ID",
      options: {
        private: "प्राइवेट",
        shared: "शेयर्ड",
        public: "पब्लिक",
        background: "बैकग्राउंड",
        incognito: "इनकॉग्निटो",
        remote: "रिमोट",
      },
    },
    response: {
      canCreateThread: {
        content: "थ्रेड बना सकते हैं",
      },
      canCreateFolder: {
        content: "फ़ोल्डर बना सकते हैं",
      },
    },
    success: {
      title: "सफल",
      description: "रूट फ़ोल्डर की परमिशन मिल गई",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रूट फ़ोल्डर ID सही नहीं है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "परमिशन जाँचने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास इस रिसोर्स को खोलने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रूट फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी एरर आया",
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
        description: "टकराव हुआ",
      },
    },
  },
};
