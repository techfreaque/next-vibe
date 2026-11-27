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
    rebuild: "रीबिल्ड",
  },
  post: {
    title: "रीबिल्ड और रीस्टार्ट",
    titleShort: "रीबिल्ड",
    description:
      "ऐप को रीबिल्ड करें और चल रहे Next.js सर्वर को हॉट-रीस्टार्ट करें। 6 स्टेप क्रम से चलते हैं: 1) कोड जनरेशन, 2) vibe check (कोड क्वालिटी गेट), 3) Next.js प्रोडक्शन बिल्ड, 4) डेटाबेस माइग्रेशन, 5) डेटाबेस सीडिंग, 6) SIGUSR1 से हॉट-रीस्टार्ट। एरर होने पर vibe check बिल्ड रोक देता है। डिटेल के लिए 'vibe check' या MCP check टूल इस्तेमाल करें। चेतावनी: रिस्पॉन्स पूरा होने से पहले सर्वर रीस्टार्ट हो जाता है, इसलिए HTTP रिस्पॉन्स बीच में कट सकता है।",
    form: {
      title: "रीबिल्ड और रीस्टार्ट",
      description: "ऐप को रीबिल्ड करें और सर्वर रीस्टार्ट करें",
    },
    fields: {
      framework: {
        title: "फ़्रेमवर्क",
        description: "बिल्ड और रीस्टार्ट के लिए टारगेट फ़्रेमवर्क",
      },
      webpack: {
        title: "Webpack",
        description: "Turbopack की जगह webpack इस्तेमाल करें (डिफ़ॉल्ट: true)",
      },
      success: {
        title: "नतीजा",
      },
      errors: {
        title: "एरर",
      },
      duration: {
        title: "अवधि",
      },
      steps: {
        title: "स्टेप",
      },
    },
    steps: {
      codegen: "कोड जनरेशन",
      vibeCheck: "Vibe check",
      nextBuild: "Next.js बिल्ड",
      migrate: "माइग्रेशन",
      seed: "सीडिंग",
      restart: "रीस्टार्ट",
      codegenFailed: "कोड जनरेशन फ़ेल हुआ: {{error}}",
      vibeCheckFailed:
        "Vibe check: {{errors}} एरर, {{warnings}} वॉर्निंग। डिटेल के लिए 'vibe check' या MCP check टूल इस्तेमाल करें।",
      vibeCheckError: "Vibe check फ़ेल हुआ: {{error}}",
      buildFailed: "Next.js बिल्ड फ़ेल हुआ: {{error}}",
      buildOom:
        "OS ने Next.js बिल्ड मार दिया (शायद मेमोरी ख़त्म) - सिग्नल: {{signal}}",
      buildExitCode: "Next.js बिल्ड कोड {{code}} के साथ बाहर निकला",
      migrationFailed: "माइग्रेशन फ़ेल हुआ: {{error}}",
      seedingFailed: "सीडिंग फ़ेल हुई: {{error}}",
      restartFailed: "सर्वर रीस्टार्ट फ़ेल हुआ: {{error}}",
      unknownError: "अनजान एरर",
      noPidFile: ".vibe-pid फ़ाइल नहीं मिली, क्या vibe start चल रहा है?",
      invalidPid: ".vibe-pid में PID गलत है: {{pid}}",
      processNotRunning: "प्रोसेस {{pid}} चल नहीं रहा",
      signalFailed: "SIGUSR1 भेजना फ़ेल हुआ: {{error}}",
    },
    errors: {
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "रीबिल्ड के पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "रीबिल्ड के दौरान नेटवर्क कनेक्शन फ़ेल हुआ",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऐप रीबिल्ड करने के लिए आपको लॉग इन होना होगा",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "ऐप रीबिल्ड करने की अनुमति आपके पास नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "रीबिल्ड के रिसोर्स नहीं मिले",
      },
      server: {
        title: "सर्वर एरर",
        description: "रीबिल्ड के दौरान इंटरनल सर्वर एरर हुआ",
        buildFailed: "बिल्ड फ़ेल हुआ: {{error}}",
        migrationsFailed: "माइग्रेशन फ़ेल हुए: {{error}}",
        rebuildFailed: "रीबिल्ड फ़ेल हुआ: {{error}}",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "रीबिल्ड के दौरान अज्ञात एरर हुआ",
      },
      conflict: {
        title: "टकराव",
        description: "रीबिल्ड पहले से चल रहा है",
      },
    },
    success: {
      title: "रीबिल्ड पूरा",
      description: "ऐप रीबिल्ड हो गया और सर्वर सफलतापूर्वक रीस्टार्ट हुआ",
    },
    widget: {
      rebuildComplete: "रीबिल्ड पूरा",
      rebuildFailed: "रीबिल्ड फ़ेल हुआ",
      errors: "एरर:",
      runRebuild: "रीबिल्ड चलाएँ",
      runAgain: "फिर से चलाएँ",
      skipped: "छोड़ा गया",
    },
  },
};
