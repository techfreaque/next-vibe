import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र प्रोफ़ाइल",
  title: "टू-फ़ैक्टर ऑथेंटिकेशन",
  titleShort: "टू-फ़ैक्टर",
  description:
    "ऑथेंटिकेटर ऐप के वन-टाइम कोड से अपना अकाउंट सुरक्षित करें। सेट अप करें, बंद करें, या रिकवरी कोड दोबारा बनाएँ।",
  tag: "two-factor",
  enums: {
    action: {
      status: "स्टेटस",
      setup: "सेटअप शुरू करें",
      enable: "कन्फ़र्म करें और चालू करें",
      disable: "बंद करें",
      regenerate: "रिकवरी कोड दोबारा बनाएँ",
    },
  },
  fields: {
    action: {
      label: "कार्रवाई",
      description:
        "status, setup, enable, disable या regenerate। Setup एक सीक्रेट देता है, फिर enable उसे कोड से कन्फ़र्म करता है।",
    },
    code: {
      label: "ऑथेंटिकेशन कोड",
      description: "आपके ऑथेंटिकेटर ऐप का 6 अंकों का कोड, या रिकवरी कोड।",
      placeholder: "123456",
    },
    password: {
      label: "पासवर्ड",
      description: "आपके अकाउंट का पासवर्ड (बंद करने के लिए कोड की जगह)।",
      placeholder: "आपका पासवर्ड",
    },
  },
  response: {
    enabled: "टू-फ़ैक्टर चालू है",
    message: "स्टेटस",
    recoveryCodesRemaining: "बचे हुए रिकवरी कोड",
    otpauthUri: "ऑथेंटिकेटर URI",
    secret: "सीक्रेट की",
    qrDataUri: "QR कोड",
    recoveryCodes: "रिकवरी कोड",
  },
  widget: {
    back: "वापस",
    statusOn: "चालू",
    statusOff: "बंद",
    offIntro:
      "साइन इन में दूसरा स्टेप जोड़ें। आपके पासवर्ड के बावजूद, आपके फ़ोन के कोड के बिना कोई अंदर नहीं आ सकता।",
    startSetup: "टू-फ़ैक्टर सेट अप करें",
    setupStep1:
      "1. इस QR कोड को ऑथेंटिकेटर ऐप से स्कैन करें (Google Authenticator, Aegis, 1Password, Authy)।",
    setupStep2: "स्कैन नहीं हो रहा? यह की हाथ से लिखें:",
    setupStep3: "2. कन्फ़र्म करने के लिए ऐप में दिखने वाला 6 अंकों का कोड लिखें।",
    confirm: "कन्फ़र्म करें और चालू करें",
    confirming: "कन्फ़र्म हो रहा है...",
    cancelSetup: "रद्द करें",
    onIntro:
      "साइन इन पर आपके ऑथेंटिकेटर ऐप का कोड माँगा जाता है। बचे हुए रिकवरी कोड: {{count}}।",
    recoveryTitle: "अपने रिकवरी कोड सेव करें",
    recoveryHint:
      "फ़ोन खो जाने पर हर कोड एक बार काम करता है। ये सिर्फ़ अभी दिखाए जाते हैं। इन्हें सुरक्षित जगह रखें।",
    recoveryCopy: "कोड कॉपी करें",
    recoveryCopied: "कॉपी हो गया",
    recoveryDone: "मैंने सेव कर लिए",
    manageTitle: "मैनेज करें",
    manageHint: "सेटिंग्स बदलने के लिए ऑथेंटिकेटर का मौजूदा कोड (या रिकवरी कोड) लिखें।",
    regenerate: "रिकवरी कोड दोबारा बनाएँ",
    disable: "टू-फ़ैक्टर बंद करें",
    disablePasswordHint: "या इसकी जगह अपने पासवर्ड से कन्फ़र्म करें:",
    working: "काम हो रहा है...",
  },
  errors: {
    notConfigured:
      "टू-फ़ैक्टर के लिए सर्वर की (JWT_SECRET_KEY) चाहिए और वह सेट नहीं है।",
    alreadyEnabled: "टू-फ़ैक्टर पहले से चालू है। सेटअप दोबारा चलाने के लिए पहले इसे बंद करें।",
    notEnabled: "टू-फ़ैक्टर चालू नहीं है।",
    noPendingSetup: "कोई सेटअप जारी नहीं है। पहले सेटअप शुरू करें।",
    codeRequired: "6 अंकों का कोड लिखें।",
    invalidCode: "यह कोड सही नहीं है। अपने फ़ोन का समय जाँचें और दोबारा कोशिश करें।",
    credentialRequired: "मौजूदा कोड, रिकवरी कोड या अपना पासवर्ड लिखें।",
    invalidPassword: "ग़लत पासवर्ड।",
    tooManyAttempts: "बहुत ज़्यादा ग़लत कोशिशें। कुछ मिनट रुककर दोबारा कोशिश करें।",
    userNotFound: "अकाउंट नहीं मिला।",
    failed: "टू-फ़ैक्टर सेटिंग्स अपडेट नहीं हो सकीं।",
    validation: {
      title: "वैलिडेशन एरर",
      description: "अपना इनपुट जाँचें और दोबारा कोशिश करें",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "टू-फ़ैक्टर मैनेज करने के लिए आपका लॉग इन होना ज़रूरी है",
    },
    server: {
      title: "सर्वर एरर",
      description: "टू-फ़ैक्टर अपडेट नहीं हो सका",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर हुआ",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क कनेक्शन विफल रहा",
    },
    forbidden: {
      title: "एक्सेस प्रतिबंधित है",
      description: "आपको यह करने की अनुमति नहीं है",
    },
    notFound: {
      title: "नहीं मिला",
      description: "अकाउंट नहीं मिला",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    conflict: {
      title: "टकराव",
      description: "टकराव हुआ",
    },
  },
  success: {
    title: "टू-फ़ैक्टर अपडेट हो गया",
    description: "आपकी टू-फ़ैक्टर सेटिंग्स सेव हो गईं",
    status: "टू-फ़ैक्टर स्टेटस लोड हो गया।",
    setupStarted: "QR कोड स्कैन करें, फिर चालू करने के लिए कोड से कन्फ़र्म करें।",
    enabled: "टू-फ़ैक्टर चालू है। अपने रिकवरी कोड अभी सेव करें, ये सिर्फ़ एक बार दिखते हैं।",
    disabled: "टू-फ़ैक्टर बंद है।",
    regenerated: "नए रिकवरी कोड बन गए। पुराने अब काम नहीं करेंगे।",
  },
};
