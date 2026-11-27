import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  enums: {
    shell: {
      bash: "/bin/bash",
      zsh: "/usr/bin/zsh",
      sh: "/bin/sh",
      fish: "/usr/bin/fish",
      dash: "/bin/dash",
      nologin: "कोई लॉगिन शेल नहीं",
    },
  },

  errors: {
    localModeOnly: {
      title: "सिर्फ़ लोकल मोड",
    },
    invalidUsername:
      "गलत यूज़रनेम: अक्षर से शुरू होना चाहिए, फिर छोटे अक्षर, अंक या हाइफ़न (ज़्यादा से ज़्यादा 32 अक्षर)",
    userAlreadyExists: "इस यूज़रनेम का यूज़र पहले से मौजूद है",
    connectionNotFound: "SSH कनेक्शन नहीं मिला",
    encryptionFailed: "एन्क्रिप्शन फ़ेल हुआ: JWT_SECRET_KEY गलत हो सकती है",
    connectTimeout: "कनेक्शन टाइमआउट हो गया",
    sshAuthFailed: "SSH ऑथेंटिकेशन फ़ेल हुआ",
    sshConnectionFailed: "SSH कनेक्शन फ़ेल हुआ",
    sudoAuthFailed: "Sudo ऑथेंटिकेशन फ़ेल: गलत पासवर्ड या sudo अधिकार अपर्याप्त",
    permissionDenied: "अनुमति नहीं: OS यूज़र बनाने के लिए अपना sudo पासवर्ड दें",
    fingerprintMismatch:
      "होस्ट फ़िंगरप्रिंट बदल गया है। संभावित MITM हमला। आगे बढ़ने के लिए स्वीकार करें।",
  },

  post: {
    title: "Linux यूज़र बनाएँ",
    titleShort: "यूज़र बनाएँ",
    description:
      "नया OS यूज़र अकाउंट बनाएँ। टारगेट होस्ट पर useradd चलाता है। सिर्फ़ एडमिन।",
    fields: {
      connectionId: {
        label: "SSH कनेक्शन",
        description:
          "किस सर्वर पर यूज़र बनाना है। डिफ़ॉल्ट कनेक्शन या लोकल मोड के लिए खाली छोड़ें।",
        placeholder: "कनेक्शन चुनें…",
      },
      username: {
        label: "यूज़रनेम",
        description:
          "अक्षर से शुरू होना चाहिए, फिर छोटे अक्षर, अंक या हाइफ़न। ज़्यादा से ज़्यादा 32 अक्षर।",
        placeholder: "alice",
      },
      groups: {
        label: "अतिरिक्त ग्रुप",
        description:
          "यूज़र को जोड़ने के लिए वैकल्पिक अतिरिक्त ग्रुप (कॉमा से अलग)। उदाहरण: docker, www-data।",
        placeholder: "docker,www-data",
      },
      shell: {
        label: "लॉगिन शेल",
        description: "वो शेल जो यूज़र के इंटरैक्टिव लॉगिन पर खुलती है।",
      },
      homeDir: {
        label: "होम डायरेक्टरी",
        description:
          "यूज़र की होम डायरेक्टरी का पाथ। खाली हो तो डिफ़ॉल्ट /home/<username>।",
        placeholder: "/home/alice",
      },
      sudoAccess: {
        label: "Sudo एक्सेस दें",
        description:
          "यूज़र को sudo ग्रुप में जोड़ें ताकि वो root के रूप में कमांड चला सके। सावधानी से इस्तेमाल करें।",
      },
      sudoPassword: {
        label: "Sudo पासवर्ड",
        description:
          "ऊँचे अधिकारों के साथ useradd चलाने के लिए आपका sudo पासवर्ड। पासवर्ड-रहित sudo कॉन्फ़िगर हो तो खाली छोड़ें।",
        placeholder: "sudo पासवर्ड डालें…",
      },
    },
    response: {
      ok: { title: "सफल" },
      uid: { title: "UID" },
      gid: { title: "GID" },
      homeDirectory: { title: "होम डायरेक्टरी" },
      shell: { title: "शेल" },
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
        description: "इस सर्वर पर लोकल मोड चालू नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "यूज़र अकाउंट नहीं बन सका",
      },
      notFound: {
        title: "नहीं मिला",
        description: "SSH कनेक्शन नहीं मिला",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "यूज़रनेम पहले से मौजूद है",
        description: "सर्वर पर इस यूज़रनेम का यूज़र पहले से मौजूद है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच सके",
      },
      timeout: { title: "टाइमआउट", description: "रिक्वेस्ट टाइमआउट हो गई" },
    },
    success: {
      title: "यूज़र बन गया",
      description: "OS यूज़र अकाउंट सफलतापूर्वक बन गया",
    },
    submitButton: {
      text: "यूज़र बनाएँ",
      loadingText: "बन रहा है…",
    },
  },
  widget: {
    title: "Linux यूज़र बनाएँ",
    createButton: "यूज़र बनाएँ",
    creating: "बन रहा है…",
    sudoWarning:
      "Sudo एक्सेस देने से यूज़र को root-स्तर के अधिकार मिलते हैं। ऐसा तभी करें जब आप इस यूज़र पर पूरी तरह भरोसा करते हों।",
  },
};
