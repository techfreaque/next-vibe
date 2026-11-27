import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "यूज़र",

  post: {
    title: "साइन अप रिमाइंडर",
    titleShort: "साइन अप रिमाइंडर",
    description:
      "जिन लोगों ने साइन अप शुरू किया पर ईमेल कन्फ़र्म नहीं किया, उन्हें एक रिमाइंडर भेजें। रिमाइंडर में नया कोड और 24 घंटे तक वैलिड लिंक होता है।",
    tag: "साइन अप रिमाइंडर",
    container: {
      title: "साइन अप रिमाइंडर",
      description:
        "पेंडिंग साइन अप जिन्हें आखिरी ईमेल 2 से 24 घंटे पहले गया और जो कभी कन्फ़र्म नहीं हुए",
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
      candidates: "इस समय-सीमा में बिना कन्फ़र्म साइन अप",
      sent: "भेजे गए रिमाइंडर",
      skipped: "छोड़े गए",
      failed: "फ़ेल हुए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "साइन अप रिमाइंडर भेजने के लिए आपका एडमिन होना ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं है",
        description: "एक्सेस की अनुमति नहीं है",
      },
      server: {
        title: "सर्वर एरर",
        description: "साइन अप रिमाइंडर नहीं भेजे जा सके",
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
      description: "साइन अप रिमाइंडर प्रोसेस हो गए",
    },
  },
  task: {
    name: "साइन अप रिमाइंडर",
    description:
      "हर 30 मिनट: आखिरी ईमेल के 2 घंटे बाद भी बिना कन्फ़र्म साइन अप को एक रिमाइंडर",
  },
};
