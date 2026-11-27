import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "IMAP क्लाइंट",

  title: "IMAP सिंक",
  titleShort: "IMAP सिंक",
  description: "IMAP सिंक्रनाइज़ेशन सर्विस",
  container: {
    title: "IMAP सिंक कॉन्फ़िगरेशन",
    description: "IMAP सिंक्रनाइज़ेशन पैरामीटर सेट करें",
  },
  accountIds: {
    label: "अकाउंट ID",
    description: "सिंक होने वाली IMAP अकाउंट ID",
    placeholder: "अकाउंट ID कॉमा से अलग करके दर्ज करें",
  },
  force: {
    label: "ज़बरदस्ती सिंक",
    description: "हाल में सिंक हुआ हो तब भी सिंक्रनाइज़ेशन ज़बरदस्ती करें",
  },
  dryRun: {
    label: "ड्राई रन",
    description: "बिना बदलाव किए टेस्ट रन चलाएँ",
  },
  maxMessages: {
    label: "अधिकतम मैसेज",
    description: "हर फ़ोल्डर में सिंक होने वाले अधिकतम मैसेज",
    placeholder: "अधिकतम मैसेज की संख्या दर्ज करें",
  },
  post: {
    title: "सिंक",
    description: "सिंक एंडपॉइंट",
    form: {
      title: "सिंक कॉन्फ़िगरेशन",
      description: "सिंक पैरामीटर सेट करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "सिंक रिस्पॉन्स डेटा",
      result: {
        title: "सिंक नतीजे",
        description: "सिंक्रनाइज़ेशन के विस्तृत नतीजे",
        accountsProcessed: "प्रोसेस हुए अकाउंट",
        foldersProcessed: "प्रोसेस हुए फ़ोल्डर",
        messagesProcessed: "प्रोसेस हुए मैसेज",
        messagesAdded: "जुड़े मैसेज",
        messagesUpdated: "अपडेट हुए मैसेज",
        messagesDeleted: "हटे मैसेज",
        duration: "अवधि",
      },
      errors: {
        error: {
          title: "सिंक एरर",
          description: "एरर का ब्योरा",
          code: "एरर कोड",
          message: "एरर संदेश",
        },
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "कोई अनजान एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "डेटा टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "कार्रवाई सफलतापूर्वक पूरी हुई",
    },
  },
  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "रिक्वेस्ट के पैरामीटर गलत हैं",
    },
    server: {
      title: "सर्वर एरर",
      description: "आंतरिक सर्वर एरर हुई",
      detail_sync: "सिंक फ़ेल हुआ: {{error}}",
      detail_status: "सिंक की स्थिति पढ़ी नहीं जा सकी: {{error}}",
    },
    unknown: {
      title: "अनजान एरर",
      description: "कोई अनजान एरर आई",
    },
    forbidden: {
      title: "मना है",
      description: "एक्सेस मना है",
    },
  },
  success: {
    title: "सफल",
    description: "कार्रवाई सफलतापूर्वक पूरी हुई",
  },
  widget: {
    title: "पूरा IMAP सिंक",
    options: "सिंक विकल्प",
    noAccounts: "कोई IMAP अकाउंट कॉन्फ़िगर नहीं",
    result: "सिंक का नतीजा",
    duration: "अवधि",
    errors: "एरर",
    accountsProcessed: "प्रोसेस हुए अकाउंट",
    foldersProcessed: "प्रोसेस हुए फ़ोल्डर",
    messagesProcessed: "प्रोसेस हुए मैसेज",
    messagesAdded: "जुड़े मैसेज",
    messagesUpdated: "अपडेट हुए मैसेज",
    messagesDeleted: "हटे मैसेज",
    submit: "सिंक शुरू करें",
    submitting: "सिंक हो रहा है...",
  },
};
