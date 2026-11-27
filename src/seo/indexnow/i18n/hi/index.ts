import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "IndexNow सबमिट",
    titleShort: "IndexNow",
    description:
      "हर नए या बदले sitemap URL के साथ Bing, Yandex, Seznam, Naver और Yep को पिंग करें। सिर्फ़ प्रोडक्शन, पहले भेजे गए URL छोड़ देता है।",
    tag: "SEO",
    container: {
      title: "IndexNow रन",
      description: "सर्च इंजन को क्या भेजा गया",
    },
    fields: {
      force: {
        label: "सब कुछ दोबारा भेजें",
        description: "हर sitemap URL दोबारा भेजें, सिर्फ़ नए या बदले हुए नहीं।",
      },
      dryRun: {
        label: "ड्राई रन",
        description: "लंबित URL को भेजे बिना गिनें।",
      },
    },
    response: {
      status: "स्टेटस",
      host: "होस्ट",
      totalUrls: "Sitemap URL",
      pendingUrls: "लंबित URL",
      submittedUrls: "भेजे गए URL",
      requests: "भेजी गई रिक्वेस्ट",
    },
    errors: {
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "URL सबमिट करने के लिए एडमिन के रूप में साइन इन करें।",
      },
      forbidden: {
        title: "सिर्फ़ एडमिन",
        description: "IndexNow पर URL सिर्फ़ एडमिन सबमिट कर सकते हैं।",
      },
      server: {
        title: "सबमिशन फ़ेल हुआ",
        description:
          "IndexNow ने सबमिशन ठुकरा दिया या sitemap बन नहीं सका। सर्वर लॉग जाँचें।",
      },
      unknown: {
        title: "अनपेक्षित एरर",
        description: "URL सबमिट करते समय कुछ गड़बड़ हुई।",
      },
      validation: {
        title: "इनपुट गलत है",
        description: "भेजे गए विकल्प जाँचें।",
      },
      keyUnreachable: {
        title: "की फ़ाइल नहीं मिली",
        description:
          "साइट रूट पर IndexNow की फ़ाइल ने key के साथ 200 नहीं लौटाया, इसलिए कुछ नहीं भेजा गया। सर्वर लॉग जाँचें।",
      },
      network: {
        title: "IndexNow तक नहीं पहुँच सके",
        description:
          "IndexNow API ने जवाब नहीं दिया। अगला रन लंबित URL दोबारा आज़माएगा।",
      },
    },
    success: {
      title: "हो गया",
      description: "IndexNow रन पूरा हुआ।",
    },
  },
  enums: {
    status: {
      submitted: "भेजे गए",
      unchanged: "कुछ नया नहीं",
      dryRun: "ड्राई रन",
      notProduction: "छोड़ा गया (प्रोडक्शन नहीं)",
    },
  },
  task: {
    description:
      "हर घंटे: नए या बदले sitemap URL IndexNow (Bing, Yandex और पार्टनर) को भेजता है।",
  },
};
