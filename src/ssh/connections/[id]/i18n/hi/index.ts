import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    clusterRole: {
      none: "कोई नहीं",
      controlPlane: "कंट्रोल प्लेन",
      worker: "वर्कर",
      storage: "स्टोरेज",
    },
    authType: {
      password: "पासवर्ड",
      privateKey: "प्राइवेट Key (PEM)",
      keyAgent: "SSH एजेंट",
      local: "लोकल मशीन",
    },
  },

  errors: {
    connectionNotFound: "कनेक्शन नहीं मिला",
    encryptionFailed: "एन्क्रिप्शन फ़ेल: JWT_SECRET_KEY गलत हो सकती है",
  },

  get: {
    title: "SSH कनेक्शन",
    titleShort: "SSH कनेक्शन",
    description: "SSH कनेक्शन का ब्योरा देखें",
    fields: {
      id: { label: "कनेक्शन ID", description: "जो कनेक्शन देखना है" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "कनेक्शन लोड नहीं हो सका",
      },
      notFound: { title: "नहीं मिला", description: "कनेक्शन नहीं मिला" },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "टकराव हुआ" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
    },
    response: {
      label: { title: "लेबल" },
      host: { title: "होस्ट" },
      port: { title: "पोर्ट" },
      username: { title: "यूज़रनेम" },
      authType: { title: "ऑथ प्रकार" },
      isDefault: { title: "डिफ़ॉल्ट" },
      fingerprint: { title: "फ़िंगरप्रिंट" },
      notes: { title: "नोट्स" },
      createdAt: { title: "बनने का समय" },
    },
    success: {
      title: "कनेक्शन लोड हुआ",
      description: "कनेक्शन का ब्योरा मिल गया",
    },
  },
  patch: {
    title: "SSH कनेक्शन अपडेट करें",
    titleShort: "कनेक्शन अपडेट करें",
    description: "SSH कनेक्शन की सेटिंग्स अपडेट करें",
    fields: {
      id: { label: "कनेक्शन ID", description: "जो कनेक्शन अपडेट करना है" },
      label: {
        label: "लेबल",
        description: "इस कनेक्शन का डिस्प्ले नाम",
        placeholder: "prod-web-01",
      },
      host: {
        label: "होस्ट",
        description: "होस्टनेम या IP पता",
        placeholder: "1.2.3.4",
      },
      port: { label: "पोर्ट", description: "SSH पोर्ट", placeholder: "22" },
      username: {
        label: "यूज़रनेम",
        description: "SSH लॉगिन यूज़र",
        placeholder: "deploy",
      },
      authType: { label: "ऑथ प्रकार", description: "ऑथेंटिकेशन का तरीक़ा" },
      secret: {
        label: "पासवर्ड / प्राइवेट Key",
        description: "मौजूदा सीक्रेट रखने के लिए ख़ाली छोड़ें",
      },
      passphrase: {
        label: "Key पासफ़्रेज़",
        description: "मौजूदा पासफ़्रेज़ रखने या हटाने के लिए ख़ाली छोड़ें",
      },
      isDefault: {
        label: "डिफ़ॉल्ट बनाएँ",
        description: "टर्मिनल सेशन के लिए इस कनेक्शन को डिफ़ॉल्ट की तरह इस्तेमाल करें",
      },
      clusterRole: {
        label: "क्लस्टर रोल",
        description:
          "k8s क्लस्टर में इस सर्वर का रोल (control-plane, worker, storage या कोई नहीं)",
      },
      notes: {
        label: "नोट्स",
        description: "इस कनेक्शन के बारे में वैकल्पिक नोट्स",
      },
    },
    response: {
      updatedAt: { title: "अपडेट होने का समय" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "कनेक्शन अपडेट नहीं हो सका",
      },
      notFound: { title: "नहीं मिला", description: "कनेक्शन नहीं मिला" },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "टकराव हुआ" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
    },
    success: {
      title: "कनेक्शन अपडेट हुआ",
      description: "कनेक्शन सफलतापूर्वक अपडेट हुआ",
    },
  },
  delete: {
    title: "SSH कनेक्शन हटाएँ",
    titleShort: "कनेक्शन हटाएँ",
    description: "SSH कनेक्शन हटाएँ",
    fields: {
      id: { label: "कनेक्शन ID", description: "जो कनेक्शन हटाना है" },
    },
    response: {
      deleted: { title: "हट गया" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "कनेक्शन हटाया नहीं जा सका",
      },
      notFound: { title: "नहीं मिला", description: "कनेक्शन नहीं मिला" },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: { title: "टकराव", description: "टकराव हुआ" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
    },
    success: {
      title: "कनेक्शन हट गया",
      description: "कनेक्शन सफलतापूर्वक हट गया",
    },
  },
  widget: {
    title: "कनेक्शन का ब्योरा",
    host: "होस्ट",
    user: "यूज़र",
    auth: "ऑथ",
    notes: "नोट्स",
    saveButton: "बदलाव सेव करें",
    deleteButton: "कनेक्शन हटाएँ",
    testButton: "कनेक्शन टेस्ट करें",
    confirmDelete: "यह कनेक्शन हटाएँ? यह वापस नहीं हो सकता।",
    mountsSection: "माउंट की गई डायरेक्टरी",
    manageMounts: "माउंट मैनेज करें",
  },
};
