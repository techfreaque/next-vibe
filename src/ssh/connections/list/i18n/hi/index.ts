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

  get: {
    title: "कनेक्शन",
    titleShort: "कनेक्शन",
    description:
      "वो सभी मशीनें जिनसे आप जुड़ सकते हैं: लोकल शेल, SSH सर्वर और रिमोट इंस्टेंस",
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत पैरामीटर",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "एडमिन एक्सेस ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "अनुमति नहीं" },
      server: {
        title: "सर्वर एरर",
        description: "कनेक्शन की लिस्ट नहीं मिल सकी",
      },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsavedChanges: { title: "बिना सेव किए बदलाव" },
      conflict: { title: "टकराव", description: "टकराव हुआ" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      timeout: { title: "टाइमआउट", description: "रिक्वेस्ट टाइमआउट हो गई" },
    },
    success: {
      title: "कनेक्शन लिस्ट हो गए",
      description: "सभी मशीन कनेक्शन मिल गए",
    },
    response: {
      connections: {
        title: "कनेक्शन",
      },
    },
  },
  widget: {
    title: "कनेक्शन",
    back: "वापस",
    addSsh: "SSH जोड़ें",
    connectRemote: "रिमोट कनेक्ट करें",
    openTerminal: "टर्मिनल",
    viewRemote: "ब्योरा",
    defaultBadge: "डिफ़ॉल्ट",
    localType: "लोकल",
    sshType: "SSH",
    remoteType: "रिमोट",
    healthHealthy: "कनेक्टेड",
    healthWarning: "धीमा",
    healthCritical: "पहुँच से बाहर",
    healthDisconnected: "ऑफ़लाइन",
    noConnections: "कोई मशीन कॉन्फ़िगर नहीं",
    noConnectionsHint: "शुरू करने के लिए SSH कनेक्शन जोड़ें या रिमोट इंस्टेंस कनेक्ट करें।",
    emptyState: "अभी कोई कनेक्शन नहीं। रिमोट मशीनों से जुड़ने के लिए एक जोड़ें।",
  },
};
