import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",

  post: {
    title: "ईमेल वेरिफ़िकेशन रिमाइंडर",
    titleShort: "वेरिफ़ाई रिमाइंडर",
    description:
      "जिन अकाउंट ने साइन अप के 24 घंटे बाद भी ईमेल कन्फ़र्म नहीं किया, उन्हें एक रिमाइंडर भेजें। फ़्री क्रेडिट के लिए कन्फ़र्म ईमेल ज़रूरी है।",
    tag: "वेरिफ़ाई रिमाइंडर",
    container: {
      title: "ईमेल वेरिफ़िकेशन रिमाइंडर",
      description: "24-25 घंटे पहले बने अकाउंट जो अभी भी वेरिफ़ाइड नहीं हैं",
    },
    fields: {
      batchSize: {
        label: "बैच साइज़",
        description: "हर रन में ज़्यादा से ज़्यादा रिमाइंडर",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "बिना भेजे गिनें कि किसे रिमाइंडर मिलेगा",
      },
    },
    response: {
      candidates: "इस समय-सीमा में बिना वेरिफ़ाई अकाउंट",
      sent: "भेजे गए रिमाइंडर",
      skipped: "छोड़े गए",
      failed: "फ़ेल हुए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "वेरिफ़ाई रिमाइंडर भेजने के लिए आपका एडमिन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "एक्सेस की अनुमति नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "वेरिफ़ाई रिमाइंडर नहीं भेजे जा सके",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "एक अज्ञात एरर आया",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिमाइंडर सेटिंग्स गलत हैं",
      },
    },
    success: {
      title: "रिमाइंडर प्रोसेस हुए",
      description: "ईमेल वेरिफ़िकेशन रिमाइंडर प्रोसेस हो गए",
    },
  },
  task: {
    name: "ईमेल वेरिफ़िकेशन रिमाइंडर",
    description:
      "हर घंटे: साइन अप के 24 घंटे बाद भी बिना वेरिफ़ाई अकाउंट को एक रिमाइंडर",
  },
};
