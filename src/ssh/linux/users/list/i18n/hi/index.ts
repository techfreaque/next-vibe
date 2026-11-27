import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",
  errors: {
    localModeOnly: {
      title: "सिर्फ़ लोकल मोड",
    },
    connectionNotFound: "कनेक्शन नहीं मिला",
    encryptionFailed: "एन्क्रिप्शन फ़ेल: JWT_SECRET_KEY गलत हो सकती है",
    connectTimeout: "कनेक्शन टाइमआउट हो गया",
    sshAuthFailed: "SSH ऑथेंटिकेशन फ़ेल",
    sshConnectionFailed: "SSH कनेक्शन फ़ेल",
    fingerprintMismatch:
      "होस्ट फ़िंगरप्रिंट बदल गया है। MITM हमले की आशंका। आगे बढ़ने के लिए acknowledgeNewFingerprint=true इस्तेमाल करें।",
  },
  get: {
    title: "Linux यूज़र की सूची",
    titleShort: "Linux यूज़र",
    description: "होस्ट के OS यूज़र अकाउंट की सूची (uid >= 1000)",
    fields: {
      connectionId: {
        label: "कनेक्शन",
        description: "इस्तेमाल के लिए SSH कनेक्शन (लोकल के लिए खाली छोड़ें)",
        placeholder: "uuid",
      },
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
      forbidden: {
        title: "प्रतिबंधित",
        description: "LOCAL_MODE ज़रूरी है",
      },
      server: {
        title: "सर्वर एरर",
        description: "यूज़र की सूची नहीं मिल सकी",
      },
      notFound: {
        title: "नहीं मिला",
        description: "नहीं मिला",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      timeout: {
        title: "टाइमआउट",
        description: "रिक्वेस्ट टाइमआउट हो गई",
      },
    },
    response: {
      users: {
        title: "यूज़र",
      },
    },
    success: {
      title: "यूज़र की सूची मिली",
      description: "OS यूज़र मिल गए",
    },
  },
  widget: {
    title: "Linux यूज़र",
    createButton: "यूज़र बनाएँ",
    lockButton: "लॉक करें",
    unlockButton: "अनलॉक करें",
    deleteButton: "हटाएँ",
    usernameCol: "यूज़रनेम",
    uidCol: "UID",
    homeDirCol: "होम",
    shellCol: "शेल",
    groupsCol: "ग्रुप",
    statusCol: "स्टेटस",
    locked: "लॉक",
    active: "सक्रिय",
    localModeOnly: "सिर्फ़ LOCAL_MODE में उपलब्ध",
    noUsers: "कोई यूज़र नहीं मिला",
    confirmDelete: "यूज़र {username} हटाएँ? इसे पलटा नहीं जा सकता।",
  },
};
