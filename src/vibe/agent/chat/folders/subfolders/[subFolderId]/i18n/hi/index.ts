import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "चैट",
  tags: {
    folders: "फ़ोल्डर",
  },

  get: {
    title: "फ़ोल्डर देखें",
    titleShort: "सब फ़ोल्डर",
    description: "ID से फ़ोल्डर पाएँ",
    container: {
      title: "फ़ोल्डर",
      description: "फ़ोल्डर की जानकारी",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "फ़ोल्डर की यूनिक पहचान",
    },
    response: {
      folder: {
        id: { content: "ID" },
        name: { content: "नाम" },
        icon: { content: "आइकन" },
        color: { content: "रंग" },
        parentId: { content: "पैरेंट ID" },
        rootFolderId: { content: "रूट फ़ोल्डर" },
        expanded: { content: "खुला हुआ" },
        sortOrder: { content: "क्रम" },
        createdAt: { content: "बनाने का समय" },
        updatedAt: { content: "अपडेट का समय" },
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया डेटा सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर लाते समय एरर आया",
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
      conflict: { title: "टकराव", description: "टकराव हुआ" },
    },
    success: { title: "सफल", description: "फ़ोल्डर मिल गया" },
  },

  delete: {
    title: "फ़ोल्डर हटाएँ",
    titleShort: "फ़ोल्डर हटाएँ",
    description: "ID से फ़ोल्डर हटाएँ",
    container: {
      title: "फ़ोल्डर हटाएँ",
      description: "फ़ोल्डर हटाने की पुष्टि करें",
    },
    id: {
      label: "फ़ोल्डर ID",
      description: "जो फ़ोल्डर हटाना है उसकी यूनिक पहचान",
    },
    response: {
      id: { content: "ID" },
      name: { content: "नाम" },
      updatedAt: { content: "हटाने का समय" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया डेटा सही नहीं है",
      },
      unauthorized: {
        title: "अनुमति नहीं",
        description: "फ़ोल्डर हटाने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आपके पास यह फ़ोल्डर हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मांगा गया फ़ोल्डर नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "फ़ोल्डर हटाते समय एरर आया",
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
        description: "फ़ोल्डर नहीं हटाया जा सकता। इसमें सामग्री हो सकती है",
      },
    },
    success: { title: "सफल", description: "फ़ोल्डर हट गया" },
    backButton: { label: "वापस" },
    submitButton: { label: "फ़ोल्डर हटाएँ", loadingText: "हट रहा है..." },
  },

  errors: {
    not_implemented_on_native: "{{method}} नेटिव पर उपलब्ध नहीं है",
  },
};
