import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Google Sheets",
  titleShort: "Google Sheets",
  description:
    "हर नई लीड अपने आप आपकी Google Sheet में एक रो के रूप में जुड़ जाए। अपना Google अकाउंट जोड़ें, API key की ज़रूरत नहीं।",
  connect: {
    label: "Google अकाउंट जोड़ें",
    description: "अपनी स्प्रेडशीट का एक्सेस देने के लिए Google से साइन इन करें",
  },
  connected: {
    label: "जुड़ा हुआ",
    description: "आपका Google अकाउंट जुड़ा है",
  },
  spreadsheetId: {
    label: "स्प्रेडशीट",
    description: "वह स्प्रेडशीट चुनें जिसमें लीड जुड़ेंगी",
    placeholder: "स्प्रेडशीट चुनें…",
  },
  sheetTab: {
    label: "शीट टैब (वैकल्पिक)",
    description: "स्प्रेडशीट के अंदर टैब का नाम। पहला टैब इस्तेमाल करने के लिए खाली छोड़ें।",
    placeholder: "जैसे Leads",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Google Sheets कॉन्फ़िग सेव करें",
  saveDescription: "लीड पकड़ने के लिए अपनी Google Sheet जोड़ें",
  saveSuccess: {
    title: "जुड़ गया",
    description: "नई लीड आपकी शीट में रो के रूप में दिखेंगी।",
  },
  oauthStart: {
    title: "Google Sheets जोड़ें",
    description: "स्प्रेडशीट एक्सेस देने के लिए Google OAuth शुरू करें",
  },
  oauthCallback: {
    title: "Google Sheets OAuth कॉलबैक",
    description: "Google रीडायरेक्ट के बाद OAuth कोड एक्सचेंज संभालता है",
  },
  sheetsList: {
    title: "स्प्रेडशीट की सूची",
    titleShort: "स्प्रेडशीट",
    description: "जुड़े Google अकाउंट की पहुँच वाली स्प्रेडशीट की सूची लौटाता है",
  },
  errors: {
    validation: {
      title: "वैलिडेशन एरर",
      description: "अपना इनपुट जाँचें",
    },
    unauthorized: {
      title: "अनधिकृत",
      description: "आगे बढ़ने के लिए लॉग इन करें",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "एक्सेस नहीं मिला",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    conflict: {
      title: "टकराव",
      description: "टकराव हुआ",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "नेटवर्क एरर हुआ",
    },
    unsavedChanges: {
      title: "बिना सेव बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
    internal: {
      title: "सर्वर एरर",
      description: "आंतरिक एरर हुआ",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अज्ञात एरर हुआ",
    },
    oauthFailed: "Google ऑथराइज़ेशन फ़ेल हुआ। फिर कोशिश करें।",
    noRefreshToken:
      "Google ने रिफ़्रेश टोकन नहीं लौटाया। अपना अकाउंट डिस्कनेक्ट करके दोबारा जोड़ें।",
    sheetsApiFailed: "स्प्रेडशीट लोड नहीं हो सकीं। अपना Google कनेक्शन जाँचें।",
    appendFailed: "Google Sheet में नहीं लिखा जा सका। टोकन एक्सपायर हो सकता है।",
  },
  response: {
    provider: "प्रोवाइडर",
    isActive: "सक्रिय",
    spreadsheetId: "स्प्रेडशीट ID",
    sheetTab: "शीट टैब",
    sheets: "स्प्रेडशीट",
    connected: "जुड़ा हुआ",
  },
  widget: {
    connectTitle: "Google Sheets जोड़ें",
    connectDescription:
      "Google से साइन इन करें ताकि हर नई लीड अपने आप आपकी स्प्रेडशीट में रो के रूप में जुड़ जाए।",
    redirectNote: "स्प्रेडशीट एक्सेस देने के लिए आपको Google पर भेजा जाएगा।",
    reconnect: "दोबारा जोड़ें",
    loading: "स्प्रेडशीट लोड हो रही हैं…",
    noSheets: "कोई स्प्रेडशीट नहीं मिली",
    refresh: "सूची रिफ़्रेश करें",
    selectRequired: "कृपया एक स्प्रेडशीट चुनें",
    saveFailed: "सेव नहीं हो सका। फिर कोशिश करें।",
    saving: "सेव हो रहा है…",
  },
};
