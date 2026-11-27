import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    authType: {
      password: "पासवर्ड",
      privateKey: "प्राइवेट key (PEM)",
      keyAgent: "SSH एजेंट",
      local: "लोकल मशीन",
    },
  },

  errors: {
    sshSecretKeyNotSet:
      "JWT_SECRET_KEY env var सेट नहीं है। SSH मोड चालू करने के लिए 32-बाइट hex वैल्यू जोड़ें।",
    encryptionFailed: "एन्क्रिप्शन फ़ेल हुआ: JWT_SECRET_KEY गलत हो सकती है",
    noRowReturned: "इन्सर्ट से कोई रो नहीं लौटी",
  },

  post: {
    title: "SSH कनेक्शन बनाएँ",
    titleShort: "कनेक्शन बनाएँ",
    description:
      "नया SSH कनेक्शन सेव करें। क्रेडेंशियल AES-256-GCM से एन्क्रिप्ट होकर रखे जाते हैं।",
    fields: {
      label: {
        label: "लेबल",
        description: "इस कनेक्शन को पहचानने के लिए आसान नाम",
        placeholder: "prod-web-01",
      },
      host: {
        label: "होस्टनेम / IP",
        description: "SSH सर्वर का होस्टनेम या IP पता",
        placeholder: "192.168.1.1",
      },
      port: {
        label: "पोर्ट",
        description: "SSH सर्वर पोर्ट (डिफ़ॉल्ट: 22)",
        placeholder: "22",
      },
      username: {
        label: "यूज़रनेम",
        description: "ऑथेंटिकेट करने वाला SSH यूज़र",
        placeholder: "deploy",
      },
      authType: {
        label: "ऑथेंटिकेशन तरीका",
        description:
          "ऑथेंटिकेट कैसे करें। पासवर्ड: सादा पासवर्ड लॉगिन। प्राइवेट key: PEM key फ़ाइल। SSH एजेंट: सिस्टम का SSH एजेंट (SSH_AUTH_SOCK)।",
      },
      secret: {
        label: "पासवर्ड / प्राइवेट key",
        description:
          "पासवर्ड ऑथ के लिए: पासवर्ड। प्राइवेट key के लिए: पूरी PEM key पेस्ट करें (-----BEGIN ... KEY-----)। SSH एजेंट के लिए खाली छोड़ें।",
        placeholder: "",
      },
      passphrase: {
        label: "Key पासफ़्रेज़",
        description:
          "आपकी प्राइवेट key पासफ़्रेज़ से सुरक्षित है तो यहाँ डालें। key एन्क्रिप्टेड नहीं है तो खाली छोड़ें।",
        placeholder: "",
      },
      isDefault: {
        label: "डिफ़ॉल्ट कनेक्शन बनाएँ",
        description:
          "कोई कनेक्शन न बताया जाए तो AI सेशन, टर्मिनल और exec कमांड के लिए यही कनेक्शन डिफ़ॉल्ट रूप से इस्तेमाल करें।",
      },
      notes: {
        label: "नोट्स",
        description: "इस कनेक्शन के बारे में वैकल्पिक आंतरिक नोट",
        placeholder: "NAT के पीछे VPS, जंप होस्ट ज़रूरी",
      },
    },
    response: {
      id: { title: "कनेक्शन ID" },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "फ़ॉर्म की फ़ील्ड जाँचें और दोबारा कोशिश करें",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपके पास कनेक्शन बनाने की अनुमति नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "कनेक्शन सेव नहीं हो सका",
      },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "लेबल पहले से मौजूद है",
        description: "इस लेबल का कनेक्शन पहले से मौजूद है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
      timeout: { title: "टाइमआउट", description: "रिक्वेस्ट टाइमआउट हो गई" },
    },
    success: {
      title: "कनेक्शन सेव हो गया",
      description: "SSH कनेक्शन सफलतापूर्वक सेव हुआ",
    },
    submitButton: {
      text: "कनेक्शन सेव करें",
      loadingText: "सेव हो रहा है...",
    },
  },
  widget: {
    title: "नया SSH कनेक्शन",
    createButton: "कनेक्शन सेव करें",
    creating: "सेव हो रहा है...",
    testFirst: "सेव करने से पहले कनेक्शन टेस्ट करें",
  },
};
