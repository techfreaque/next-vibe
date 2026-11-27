import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  common: {
    newChat: "नई चैट",
    delete: "हटाएँ",
    cancel: "रद्द करें",
    settings: "सेटिंग्स",
    close: "बंद करें",
    toggleSidebar: "साइडबार खोलें/बंद करें",
    noChatsFound: "कोई चैट नहीं मिली",
  },
  actions: {
    rename: "नाम बदलें",
    unpin: "अनपिन करें",
    pin: "ऊपर पिन करें",
    unarchive: "आर्काइव से निकालें",
    archive: "आर्काइव करें",
    manageSharing: "शेयरिंग मैनेज करें",
    moveToFolder: "फ़ोल्डर में ले जाएँ",
    unfiled: "फ़ोल्डर से हटाएँ",
  },
  folderList: {
    managePermissions: "परमिशन मैनेज करें",
    today: "आज",
    lastWeek: "पिछले 7 दिन",
    lastMonth: "पिछले 30 दिन",
    older: "पुराने",
  },
  threadList: {
    deleteDialog: {
      title: "थ्रेड हटाएँ",
      description:
        'क्या आप "{{title}}" हटाना चाहते हैं? यह कदम वापस नहीं हो सकता और इस थ्रेड के सारे मैसेज हमेशा के लिए हट जाएँगे।',
    },
  },
  suggestedPrompts: {
    title: "मैं आपकी क्या मदद करूँ?",
    privateTitle: "आपका प्राइवेट AI असिस्टेंट",
    privateDescription:
      "बातचीत आपके अकाउंट में सेव होती है और सारे डिवाइस पर सिंक रहती है।",
    sharedTitle: "AI के साथ मिलकर काम करें",
    sharedDescription: "चैट बनाएँ और सुरक्षित लिंक से टीम के साथ शेयर करें।",
    publicTitle: "पब्लिक AI फ़ोरम से जुड़ें",
    publicDescription:
      "पब्लिक बातचीत सबको दिखती है। अपने आइडिया शेयर करें और खुलकर चर्चा करें।",
    incognitoTitle: "गुमनाम AI चैट",
    incognitoDescription:
      "सिर्फ़ आपके ब्राउज़र में रहती है। न अकाउंट में सेव होती है, न सिंक।",
    backgroundTitle: "आपके AI एजेंट काम पर हैं",
    backgroundDescription:
      "सब-एजेंट और बैकग्राउंड एजेंट यहाँ काम करते हैं, आप कुछ और करते रहें। नतीजे अपने आप आ जाते हैं।",
  },
  config: {
    appName: "unbottled.ai",
  },
  components: {
    sidebar: {
      login: "लॉग इन",
      signup: "साइन अप",
      logout: "लॉग आउट",
      footer: {
        account: "अकाउंट",
        expandAccount: "अकाउंट सेक्शन खोलें",
        collapseAccount: "अकाउंट सेक्शन समेटें",
      },
    },
    credits: {
      label: "क्रेडिट",
      credit: "{{count}} क्रेडिट",
      credits: "{{count}} क्रेडिट",
    },
    navigation: {
      subscription: "सब्सक्रिप्शन और क्रेडिट",
      partnerDashboard: "पार्टनर डैशबोर्ड",
      apiKeys: "API Keys",
      referral: "रेफ़रल प्रोग्राम",
      settings: "मेरी प्रोफ़ाइल और सेटिंग्स",
      leadMagnet: "लीड मैग्नेट",
      help: "फ़ीडबैक और सपोर्ट",
      about: "हमारे बारे में",
      websiteBlog: "कहानियाँ",
      newsletter: "न्यूज़लेटर: हर महीने {{freeCreditsMax}} फ़्री क्रेडिट",
      admin: "एडमिन डैशबोर्ड",
    },
    confirmations: {
      deleteMessage: "क्या आप यह मैसेज हटाना चाहते हैं?",
    },
    signInGate: {
      title: "यह थ्रेड खोलने के लिए साइन इन करें",
      description:
        "यह बातचीत प्राइवेट या शेयर्ड फ़ोल्डर में है। ऐसे अकाउंट से साइन इन करें जिसे एक्सेस मिला हो।",
      signIn: "साइन इन",
      signUp: "फ़्री अकाउंट बनाएँ",
      incognito: "इसके बजाय प्राइवेट चैट शुरू करें",
    },
  },
};
