import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सर्वर मैनेजमेंट",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  post: {
    title: "Dev",
    titleShort: "Dev सर्वर",
    description: "Dev endpoint",
    form: {
      title: "Dev कॉन्फ़िगरेशन",
      description: "dev पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "Dev रिस्पॉन्स डेटा",
    },
    fields: {
      debug: {
        title: "डीबग मोड",
        description: "विस्तृत आउटपुट के लिए डीबग मोड चालू करें",
      },
      skipDbSetup: {
        title: "DB सेटअप छोड़ें",
        description: "डेटाबेस सेटअप स्टेप छोड़ें",
      },
      skipNextCommand: {
        title: "Next कमांड छोड़ें",
        description: "Next.js डेवलपमेंट सर्वर चलाना छोड़ें",
      },
      skipDbReset: {
        title: "DB रीसेट छोड़ें",
        description: "डेटाबेस रीसेट ऑपरेशन छोड़ें",
      },

      port: {
        title: "पोर्ट",
        description: "डेवलपमेंट सर्वर का पोर्ट नंबर",
      },
      skipGeneratorWatcher: {
        title: "जनरेटर वॉचर छोड़ें",
        description: "ऑटोमैटिक कोड जनरेशन वॉचर छोड़ें",
      },
      generatorWatcherInterval: {
        title: "जनरेटर अंतराल",
        description: "जनरेटर वॉचर का अंतराल मिलीसेकंड में",
      },
      skipTaskRunner: {
        title: "टास्क रनर छोड़ें",
        description: "टास्क रनर सिस्टम शुरू करना छोड़ें",
      },
      skipMigrations: {
        title: "माइग्रेशन छोड़ें",
        description: "डेटाबेस माइग्रेशन छोड़ें",
      },
      skipMigrationGeneration: {
        title: "माइग्रेशन जनरेशन छोड़ें",
        description: "ऑटोमैटिक माइग्रेशन जनरेशन छोड़ें",
      },
      skipSeeding: {
        title: "सीडिंग छोड़ें",
        description: "शुरुआती डेटा से डेटाबेस सीडिंग छोड़ें",
      },
      framework: {
        title: "फ़्रेमवर्क",
        description: "इस्तेमाल होने वाला फ़्रंटएंड फ़्रेमवर्क/बंडलर",
      },
      profile: {
        title: "प्रोफ़ाइल",
        description:
          "प्रोफ़ाइलिंग चालू करें: NEXT_TURBOPACK_TRACING=1 सेट करता है (ट्रेस फ़ाइल .next/dev/trace-turbopack पर) और NEXT_CPU_PROF=1 (बाहर निकलते समय .cpuprofile लिखता है)",
      },
      success: {
        title: "सफल",
      },
      output: {
        title: "आउटपुट",
      },
      duration: {
        title: "अवधि",
      },
      serverUrl: {
        title: "सर्वर URL",
      },
      databaseStatus: {
        title: "डेटाबेस स्टेटस",
      },
      processes: {
        title: "प्रोसेस",
      },
      errors: {
        title: "एरर",
      },
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      forbidden: {
        title: "अनुमति नहीं",
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
      description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
    },
  },
};
