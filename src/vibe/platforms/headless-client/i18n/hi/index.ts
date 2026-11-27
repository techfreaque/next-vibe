import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "हेडलेस क्लाइंट",
    titleShort: "headless",
    description: "हेडलेस रिमोट-कनेक्शन क्लाइंट शुरू करें",
    form: {
      title: "हेडलेस क्लाइंट",
      description: "रिवर्स-WS कनेक्शन और टूल एक्ज़ीक्यूटर शुरू करता है। कोई वेब सर्वर नहीं।",
    },
    fields: {
      computerName: {
        title: "कंप्यूटर का नाम",
        description: "इस मशीन की पहचान (डिफ़ॉल्ट: OS होस्टनेम)",
      },
      remoteUrl: {
        title: "रिमोट URL",
        description: "जिस क्लाउड इंस्टेंस से कनेक्ट करना है उसका URL",
      },
      leadId: {
        title: "लीड ID",
        description: "रिमोट इंस्टेंस पर आपकी लीड UUID",
      },
      token: { title: "टोकन", description: "कनेक्शन ऑथ टोकन" },
      output: { title: "आउटपुट" },
    },
    errors: {
      validation: { title: "वैलिडेशन एरर", description: "इनपुट गलत है" },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर" },
      unauthorized: { title: "अनधिकृत", description: "अनधिकृत" },
      forbidden: { title: "मना है", description: "मना है" },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      server: { title: "सर्वर एरर", description: "सर्वर एरर" },
      unknown: { title: "अनजान एरर", description: "अनजान एरर" },
      conflict: { title: "टकराव", description: "टकराव" },
      migrationFailed: "माइग्रेशन फ़ेल हुआ",
      migrationError: "माइग्रेशन एरर",
    },
    success: {
      title: "हेडलेस क्लाइंट शुरू हुआ",
      description: "रिवर्स-WS कनेक्शन खुले हैं, टूल रिक्वेस्ट का इंतज़ार",
    },
  },
};
