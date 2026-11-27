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
    build: "बिल्ड",
  },
  post: {
    title: "ऐप बिल्ड करें",
    titleShort: "ऐप बिल्ड",
    description: "प्रोडक्शन डिप्लॉयमेंट के लिए ऐप बिल्ड करें",
    form: {
      title: "बिल्ड कॉन्फ़िगरेशन",
      description: "बिल्ड विकल्प और सेटिंग्स सेट करें",
    },
    fields: {
      package: {
        title: "पैकेज बिल्ड करें",
        description: "ऐप बिल्ड करने से पहले पैकेज बिल्ड करें",
      },
      skipNextCommand: {
        title: "Next.js कमांड छोड़ें",
        description: "Next.js बिल्ड कमांड चलाना छोड़ें",
      },
      target: {
        title: "बिल्ड टारगेट",
        description: "बिल्ड टारगेट बताएँ (जैसे 'production', 'staging')",
      },
      skipGeneration: {
        title: "कोड जनरेशन छोड़ें",
        description: "बिल्ड के दौरान API एंडपॉइंट जनरेशन छोड़ें",
      },
      generate: {
        title: "कोड जनरेट करें",
        description: "बिल्ड के दौरान कोड जनरेशन चलाएँ",
      },
      generateEndpoints: {
        title: "एंडपॉइंट जनरेट करें",
        description: "बिल्ड के दौरान API एंडपॉइंट फ़ाइलें जनरेट करें",
      },
      generateSeeds: {
        title: "सीड जनरेट करें",
        description: "बिल्ड के दौरान सीड फ़ाइलें जनरेट करें",
      },
      nextBuild: {
        title: "Next.js बिल्ड",
        description: "Next.js बिल्ड प्रोसेस चलाएँ",
      },
      migrate: {
        title: "माइग्रेशन चलाएँ",
        description: "बिल्ड के दौरान डेटाबेस माइग्रेशन चलाएँ",
      },
      seed: {
        title: "सीडिंग चलाएँ",
        description: "बिल्ड के दौरान डेटाबेस सीडिंग चलाएँ",
      },
      force: {
        title: "ज़बरदस्ती बिल्ड",
        description: "एरर आने पर भी बिल्ड जारी रखें",
      },
      framework: {
        title: "फ़्रेमवर्क",
        description: "बिल्ड करने के लिए फ़्रंटएंड फ़्रेमवर्क/बंडलर",
      },
      webpack: {
        title: "Webpack इस्तेमाल करें",
        description:
          "Turbopack की जगह webpack इस्तेमाल करें। कम मेमोरी (~7.5 GB बनाम ~12 GB)। प्रोडक्शन Docker बिल्ड में डिफ़ॉल्ट रूप से चालू।",
      },
      vibeMode: {
        title: "इंस्टेंस मोड",
        description:
          "इंस्टेंस मोड को Next.js बंडल में बेक करता है। 'agent' = निजी लोकल इंस्टेंस। 'cloud' = SaaS डिप्लॉयमेंट। 'dev' = कोडिंग इंस्टेंस (डिफ़ॉल्ट)। .env में NEXT_PUBLIC_VIBE_MODE को ओवरराइड करता है।",
        options: {
          agent: "Agent (निजी लोकल इंस्टेंस)",
          cloud: "Cloud (SaaS डिप्लॉयमेंट)",
          dev: "Dev (कोडिंग इंस्टेंस, डिफ़ॉल्ट)",
        },
      },
      skipEndpoints: {
        title: "एंडपॉइंट जनरेशन छोड़ें",
        description: "एंडपॉइंट फ़ाइलें जनरेट करना छोड़ें",
      },
      skipSeeds: {
        title: "सीड जनरेशन छोड़ें",
        description: "सीड फ़ाइलें जनरेट करना छोड़ें",
      },
      skipProdMigrations: {
        title: "प्रोडक्शन माइग्रेशन छोड़ें",
        description: "प्रोडक्शन के लिए डेटाबेस माइग्रेशन चलाना छोड़ें",
      },
      skipProdSeeding: {
        title: "प्रोडक्शन सीडिंग छोड़ें",
        description: "प्रोडक्शन के लिए डेटाबेस सीडिंग छोड़ें",
      },
      runProdDatabase: {
        title: "प्रोडक्शन डेटाबेस ऑपरेशन चलाएँ",
        description: "बिल्ड के बाद प्रोडक्शन डेटाबेस ऑपरेशन चलाएँ",
      },
      success: {
        title: "बिल्ड सफल",
      },
      output: {
        title: "बिल्ड आउटपुट",
      },
      duration: {
        title: "बिल्ड अवधि (ms)",
      },
      errors: {
        title: "बिल्ड एरर",
      },
      steps: {
        title: "बिल्ड चरण",
      },
      label: {
        title: "चरण",
      },
      ok: {
        title: "सफल",
      },
      skipped: {
        title: "छोड़ा गया",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "बिल्ड के दिए पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "बिल्ड के दौरान नेटवर्क कनेक्शन फ़ेल हुआ",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऐप बिल्ड करने के लिए आपका लॉग इन होना ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "आपको ऐप बिल्ड करने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "बिल्ड रिसोर्स नहीं मिले",
      },
      server: {
        title: "सर्वर एरर",
        description: "बिल्ड के दौरान आंतरिक सर्वर एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "बिल्ड के दौरान अनजान एरर हुई",
      },
      conflict: {
        title: "टकराव",
        description: "बिल्ड में टकराव मिला",
      },
      nextjs_build_failed: {
        title: "Next.js बिल्ड फ़ेल हुआ",
        description: "Next.js बिल्ड प्रोसेस फ़ेल हुआ: {{error}}",
      },
    },
    success: {
      title: "बिल्ड पूरा हुआ",
      description: "ऐप बिल्ड सफलतापूर्वक पूरा हुआ",
    },
    repository: {
      messages: {
        buildStart: "🚀 ऐप बिल्ड शुरू हो रहा है...",
        packageBuildStart: "पैकेज बिल्ड हो रहा है...",
        packageBuildSuccess: "✅ पैकेज बिल्ड सफलतापूर्वक पूरा हुआ",
        packageBuildFailed: "पैकेज बिल्ड फ़ेल हुआ: {{error}}",
        buildPrerequisites: "बिल्ड की पूर्व-शर्तें चल रही हैं...",
        skipGeneration: "API एंडपॉइंट जनरेशन छोड़ा जा रहा है (--skip-generation)",
        generatingEndpoints: "API एंडपॉइंट जनरेट हो रहे हैं...",
        generationSuccess: "✅ कोड जनरेशन सफलतापूर्वक पूरा हुआ",
        generationFailed: "कोड जनरेशन फ़ेल हुआ",
        generationFailedDetail: "कोड जनरेशन फ़ेल हुआ: {{error}}",
        tanstackBuildStart: "TanStack Start (SSR) बिल्ड हो रहा है...",
        tanstackBuildSuccess: "✅ TanStack Start (SSR) बिल्ड सफलतापूर्वक पूरा हुआ",
        tanstackBuildFailed: "TanStack Start बिल्ड फ़ेल हुआ",
        tanstackBuildFailedDetail: "TanStack Start बिल्ड फ़ेल हुआ: {{error}}",
        skipNextBuild: "Next.js बिल्ड छोड़ा जा रहा है (package.json संभालेगा)",
        buildingNextjs: "Next.js ऐप बिल्ड हो रहा है...",
        nextjsBuildSuccess: "✅ Next.js बिल्ड सफलतापूर्वक पूरा हुआ",
        nextjsBuildFailed: "Next.js बिल्ड फ़ेल हुआ: {{error}}",
        nextjsBuildOom:
          "OS ने Next.js बिल्ड मार दिया (शायद मेमोरी ख़त्म) - सिग्नल: {{signal}}",
        nextjsBuildExitCode: "Next.js बिल्ड कोड {{code}} के साथ बाहर निकला",
        skipProdDb:
          "प्रोडक्शन डेटाबेस ऑपरेशन छोड़े जा रहे हैं (--run-prod-database=false)",
        buildFailed: "❌ बिल्ड फ़ेल हुआ: {{error}}",
        unknownError: "अनजान एरर",
        schemaGenerationStart: "डेटाबेस स्कीमा जनरेट हो रहा है...",
        schemaGenerationSuccess: "✅ डेटाबेस स्कीमा जनरेशन पूरा हुआ",
        schemaGenerationFailed: "डेटाबेस स्कीमा जनरेशन फ़ेल हुआ",
        skipSchemaGeneration:
          "डेटाबेस स्कीमा जनरेशन छोड़ा जा रहा है (--run-prod-database=false)",
        reportsGenerationStart: "सभी रिपोर्ट जनरेट हो रही हैं...",
        reportsGenerationSuccess: "✅ सभी रिपोर्ट सफलतापूर्वक जनरेट हुईं",
        reportsGenerationFailed: "रिपोर्ट जनरेशन फ़ेल हुआ",
        prodDbStart: "🚀 प्रोडक्शन डेटाबेस ऑपरेशन चल रहे हैं...",
        prodDbSuccess: "🎉 प्रोडक्शन डेटाबेस ऑपरेशन सफलतापूर्वक पूरे हुए",
        prodDbFailed:
          "❌ डेटाबेस ऑपरेशन के दौरान प्रोडक्शन बिल्ड फ़ेल हुआ: {{error}}। डेटाबेस शुरू करने के लिए 'docker compose -f docker-compose-dev.yml up -d' चलाकर देखें।",
        prodDbConnectionFailed:
          "❌ डेटाबेस ऑपरेशन के दौरान प्रोडक्शन बिल्ड फ़ेल हुआ: डेटाबेस तक नहीं पहुँचा जा सका ({{error}})। पक्का करें कि वह चल रहा है, फिर उसे शुरू करने के लिए 'docker compose -f docker-compose-dev.yml up -d' आज़माएँ।",
        prodDbNotReady: "💡 यह बिल्ड प्रोडक्शन डिप्लॉयमेंट के लिए तैयार नहीं है",
        deploymentReady: "🚀 आपका ऐप प्रोडक्शन डिप्लॉयमेंट के लिए तैयार है!",
        nextBuildHandled: "✅ Next.js बिल्ड yarn build कमांड संभालेगी",
        failedProdMigrations: "प्रोडक्शन माइग्रेशन चलाना फ़ेल हुआ",
      },
    },
  },
};
