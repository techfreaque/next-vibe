import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सर्वर मैनेजमेंट",
  enum: {
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  tags: {
    start: "शुरू करें",
  },
  post: {
    title: "प्रोडक्शन सर्वर शुरू करें",
    titleShort: "सर्वर शुरू करें",
    description: "प्री-टास्क और Next.js के साथ प्रोडक्शन सर्वर शुरू करें",
    form: {
      title: "स्टार्ट कॉन्फ़िगरेशन",
      description: "सर्वर शुरू करने के पैरामीटर कॉन्फ़िगर करें",
    },
    response: {
      title: "रिस्पॉन्स",
      description: "स्टार्ट रिस्पॉन्स डेटा",
    },
    fields: {
      skipPre: {
        title: "प्री-टास्क छोड़ें",
        description: "सर्वर शुरू करने से पहले प्री-टास्क चलाना छोड़ें",
      },
      skipNextCommand: {
        title: "Next.js कमांड छोड़ें",
        description: "Next.js start कमांड चलाना छोड़ें",
      },
      mode: {
        title: "सर्वर मोड",
        description:
          "कौन से सबसिस्टम चलाने हैं: all (डिफ़ॉल्ट), web (सिर्फ़ Next.js + WS), tasks (सिर्फ़ टास्क रनर)",
        options: {
          all: "सब (डिफ़ॉल्ट)",
          web: "सिर्फ़ वेब (Next.js + WebSocket)",
          tasks: "सिर्फ़ टास्क (cron रनर)",
        },
      },
      seed: {
        title: "सीडिंग चलाएँ",
        description: "स्टार्टअप पर डेटाबेस सीडिंग चलाएँ",
      },
      dbSetup: {
        title: "डेटाबेस सेटअप",
        description: "स्टार्टअप पर डेटाबेस सेटअप और माइग्रेशन चलाएँ",
      },
      taskRunner: {
        title: "टास्क रनर",
        description: "टास्क रनर सिस्टम शुरू करें",
      },
      nextServer: {
        title: "Next.js सर्वर",
        description: "Next.js सर्वर शुरू करें",
      },
      port: {
        title: "पोर्ट",
        description: "सर्वर का पोर्ट नंबर",
      },
      profile: {
        title: "प्रोफ़ाइल",
        description:
          "प्रोफ़ाइलिंग चालू करें: प्रोडक्शन Next.js सर्वर के लिए NEXT_CPU_PROF=1 सेट करता है (बाहर निकलते समय .cpuprofile लिखता है)",
      },
      framework: {
        title: "फ़्रेमवर्क",
        description: "शुरू करने वाला फ़्रंटएंड फ़्रेमवर्क/बंडलर",
      },
      vibeMode: {
        title: "इंस्टेंस मोड",
        description:
          "रनटाइम पर इंस्टेंस मोड ओवरराइड करें। बिल्ट बंडल को पैच करता है। 'agent' = निजी लोकल इंस्टेंस। 'cloud' = SaaS। 'dev' = कोडिंग इंस्टेंस।",
        options: {
          agent: "एजेंट (निजी लोकल इंस्टेंस)",
          cloud: "क्लाउड (SaaS डिप्लॉयमेंट)",
          dev: "Dev (कोडिंग इंस्टेंस)",
        },
      },
      skipTaskRunner: {
        title: "टास्क रनर छोड़ें",
        description: "टास्क रनर शुरू करना छोड़ें",
      },
      success: {
        title: "सफल",
      },
      serverStarted: {
        title: "सर्वर शुरू हो गया",
      },
      output: {
        title: "आउटपुट",
      },
      serverInfo: {
        title: "सर्वर की जानकारी",
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
      tanstackBuildNotFound:
        "कोई TanStack Start बिल्ड नहीं मिला: क्या 'vibe build --tanstack' चला था?",
      tanstackServerExited: "TanStack Start सर्वर तुरंत बंद हो गया",
      nextBuildNotFound:
        "कोई .next-prod बिल्ड नहीं मिला: क्या 'vibe build' चला था?",
      startFailed: "सर्वर शुरू नहीं हो सका",
    },
    success: {
      title: "सफल",
      description: "ऑपरेशन सफलतापूर्वक पूरा हुआ",
    },
    repository: {
      messages: {
        startingServer: "🚀 प्रोडक्शन सर्वर शुरू हो रहा है...",
        environment: "✅ एनवायरनमेंट: ",
        runningPreTasks: "प्री-स्टार्ट टास्क चल रहे हैं...",
        runningMigrations: "डेटाबेस माइग्रेशन चल रहे हैं...",
        migrationsCompleted: "✅ डेटाबेस माइग्रेशन पूरे हुए",
        failedMigrations: "माइग्रेशन नहीं चल सके",
        seedingDatabase: "डेटाबेस सीड हो रहा है...",
        seedingCompleted: "✅ डेटाबेस सीडिंग पूरी हुई",
        failedSeeding: "डेटाबेस सीड नहीं हो सका",
        startingTaskRunner: "प्रोडक्शन टास्क रनर सिस्टम शुरू हो रहा है...",
        failedTaskRunner: "प्रोडक्शन टास्क रनर शुरू नहीं हो सका",
        taskRunnerStarted: "✅ प्रोडक्शन टास्क रनर शुरू हुआ, ",
        taskRunnerStartedSuffix: " टास्क के साथ",
        taskRunnerSkipped:
          "प्रोडक्शन टास्क रनर छोड़ा गया (--skip-task-runner फ़्लैग इस्तेमाल हुआ)",
        skipNextStart: "Next.js स्टार्ट छोड़ा जा रहा है (package.json सँभालेगा)",
        serverWillStart: "प्रोडक्शन सर्वर package.json से शुरू होगा",
        serverAvailable: "सर्वर यहाँ उपलब्ध होगा: http://localhost:",
        startupPrepared: "✅ प्रोडक्शन सर्वर स्टार्टअप सफलतापूर्वक तैयार",
        failedStart: "❌ प्रोडक्शन सर्वर शुरू नहीं हो सका: ",
        gracefulShutdown: "प्रोडक्शन टास्क रनर के लिए ग्रेसफ़ुल शटडाउन माँगा गया",
      },
    },
  },
};
