import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "जर्नल CSV एक्सपोर्ट",
  description: "एक कंपनी और मुद्रा की पोस्ट हुई जर्नल लाइनें, उलटाव समेत, एक्सपोर्ट करें।",
  company: "कंपनी",
  currency: "मुद्रा",
  currencyHint: "तीन अक्षर का मुद्रा कोड डालें, जैसे EUR।",
  otherCurrency: "अन्य मुद्रा",
  debitCount: "डेबिट लाइनें",
  creditCount: "क्रेडिट लाइनें",
  invalidLine: "सेव की गई एक जर्नल लाइन की डेबिट या क्रेडिट दिशा गलत है।",
  from: "से",
  to: "तक",
  prepare: "CSV तैयार करें",
  preparing: "CSV तैयार हो रही है…",
  download: "CSV डाउनलोड करें",
  copy: "CSV कॉपी करें",
  copied: "CSV कॉपी हुई",
  copyFailed: "CSV कॉपी नहीं हो सकी। दोबारा कोशिश करें।",
  filename: "फ़ाइल का नाम",
  rowCount: "जर्नल लाइनें",
  invalidDates:
    "सही तारीख़ सीमा चुनें। आख़िरी तारीख़ पहली के बराबर या बाद की होनी चाहिए।",
  tooLarge:
    "यह एक्सपोर्ट 10,000 जर्नल लाइनों या 5 MiB से ज़्यादा है। तारीख़ सीमा छोटी करें और दोबारा कोशिश करें।",
  ready: "CSV तैयार",
  headerEntry: "एंट्री नंबर",
  headerDate: "अकाउंटिंग तारीख़",
  headerPosted: "पोस्ट हुआ (UTC)",
  headerSource: "स्रोत",
  headerAccountCode: "अकाउंट कोड",
  headerAccountName: "अकाउंट का नाम",
  headerDescription: "एंट्री का विवरण",
  headerLineDescription: "लाइन का विवरण",
  headerCurrency: "मुद्रा",
  headerDebit: "डेबिट",
  headerCredit: "क्रेडिट",
  errors: {
    unauthorized: {
      title: "अनधिकृत",
      description: "लॉगिन ज़रूरी है",
    },
    validation: {
      title: "वैलिडेशन एरर",
      description: "सभी फ़ील्ड जाँचें",
    },
    forbidden: {
      title: "प्रतिबंधित",
      description: "अनुमतियाँ कम हैं",
    },
    server: {
      title: "सर्वर एरर",
      description: "कार्रवाई फ़ेल हुई। दोबारा कोशिश करें।",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर हुई",
    },
    conflict: {
      title: "टकराव",
      description: "डेटा में टकराव",
    },
    network: {
      title: "नेटवर्क एरर",
      description: "सर्वर तक नहीं पहुँच सके",
    },
    notFound: {
      title: "नहीं मिला",
      description: "रिसोर्स नहीं मिला",
    },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
    },
  },
  tags: {
    journal: "journal",
    export: "export",
  },
};
