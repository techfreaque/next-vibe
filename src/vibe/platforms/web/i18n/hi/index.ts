import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सर्वर मैनेजमेंट",
  enum: {
    processStatus: {
      running: "चल रहा है",
      stopped: "रुके हुए",
      error: "एरर",
    },
    environment: {
      development: "डेवलपमेंट",
      production: "प्रोडक्शन",
      testing: "टेस्टिंग",
      staging: "स्टेजिंग",
    },
    mode: {
      development: "डेवलपमेंट",
      production: "प्रोडक्शन",
    },
    framework: {
      next: "Next.js",
      tanstack: "TanStack/Vite",
    },
  },
  build: {
    category: "सर्वर मैनेजमेंट",
    tags: {
      build: "बिल्ड",
    },
    post: {
      title: "ऐप बिल्ड करें",
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
          title: "स्टेप",
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
          title: "अनुमति नहीं",
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
          title: "अज्ञात एरर",
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
          packageBuildFailed: "पैकेज बिल्ड फ़ेल हुआ",
          buildPrerequisites: "बिल्ड की पूर्व-शर्तें चल रही हैं...",
          skipGeneration: "API एंडपॉइंट जनरेशन छोड़ा जा रहा है (--skip-generation)",
          generatingEndpoints: "API एंडपॉइंट जनरेट हो रहे हैं...",
          generationSuccess: "✅ कोड जनरेशन सफलतापूर्वक पूरा हुआ",
          generationFailed: "कोड जनरेशन फ़ेल हुआ",
          skipNextBuild: "Next.js बिल्ड छोड़ा जा रहा है (package.json संभालेगा)",
          buildingNextjs: "Next.js ऐप बिल्ड हो रहा है...",
          nextjsBuildSuccess: "✅ Next.js बिल्ड सफलतापूर्वक पूरा हुआ",
          nextjsBuildFailed: "Next.js बिल्ड फ़ेल हुआ",
          skipProdDb:
            "प्रोडक्शन डेटाबेस ऑपरेशन छोड़े जा रहे हैं (--run-prod-database=false)",
          buildFailed: "❌ बिल्ड फ़ेल हुआ",
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
          prodDbFailed: "❌ डेटाबेस ऑपरेशन के दौरान प्रोडक्शन बिल्ड फ़ेल हुआ",
          prodDbNotReady: "💡 यह बिल्ड प्रोडक्शन डिप्लॉयमेंट के लिए तैयार नहीं है",
          deploymentReady: "🚀 आपका ऐप प्रोडक्शन डिप्लॉयमेंट के लिए तैयार है!",
          dbConnectionError:
            "डेटाबेस कनेक्शन फ़ेल हुआ। पक्का करें कि डेटाबेस चल रहा है और पहुँच में है।",
          dbStartSuggestion:
            "डेटाबेस शुरू करने के लिए 'docker compose -f docker-compose-dev.yml up -d' चलाकर देखें",
          nextBuildHandled: "✅ Next.js बिल्ड yarn build कमांड संभालेगी",
          failedProdMigrations: "प्रोडक्शन माइग्रेशन चलाना फ़ेल हुआ",
        },
      },
    },
  },
  dev: {
    category: "सर्वर मैनेजमेंट",

    post: {
      title: "Dev",
      description: "Dev एंडपॉइंट",
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
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
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
  },
  health: {
    category: "सर्वर मैनेजमेंट",

    tag: "हेल्थ",
    get: {
      title: "हेल्थ चेक",
      description: "सर्वर का हेल्थ स्टेटस और डायग्नोस्टिक्स देखें",
      form: {
        title: "हेल्थ चेक ऑप्शन",
        description: "हेल्थ चेक के पैरामीटर सेट करें",
      },
      fields: {
        detailed: {
          title: "विस्तृत रिपोर्ट",
          description: "विस्तृत सिस्टम जानकारी शामिल करें",
        },
        includeDatabase: {
          title: "डेटाबेस शामिल करें",
          description: "डेटाबेस हेल्थ चेक शामिल करें",
        },
        includeTasks: {
          title: "टास्क शामिल करें",
          description: "टास्क रनर के हेल्थ चेक शामिल करें",
        },
        includeSystem: {
          title: "सिस्टम शामिल करें",
          description: "सिस्टम रिसोर्स की जानकारी शामिल करें",
        },
      },
      response: {
        status: {
          title: "स्टेटस",
          description: "कुल हेल्थ स्टेटस",
        },
        timestamp: {
          title: "टाइमस्टैम्प",
          description: "हेल्थ चेक का समय",
        },
        uptime: {
          title: "अपटाइम",
          description: "सर्वर अपटाइम (सेकंड में)",
        },
        environment: {
          title: "एनवायरनमेंट",
          description: "सर्वर एनवायरनमेंट की जानकारी",
          name: {
            title: "एनवायरनमेंट नाम",
          },
          nodeEnv: {
            title: "Node एनवायरनमेंट",
          },
          platform: {
            title: "प्लेटफ़ॉर्म",
          },
          supportsTaskRunners: {
            title: "टास्क रनर सपोर्ट",
          },
        },
        database: {
          title: "डेटाबेस स्टेटस",
          description: "डेटाबेस कनेक्शन स्टेटस",
          status: {
            title: "कनेक्शन स्थिति",
          },
          responseTime: {
            title: "रिस्पॉन्स टाइम (ms)",
          },
          error: {
            title: "एरर मैसेज",
          },
        },
        tasks: {
          title: "टास्क स्टेटस",
          description: "टास्क रनर स्टेटस",
          runnerStatus: {
            title: "रनर स्टेटस",
          },
          activeTasks: {
            title: "एक्टिव टास्क",
          },
          totalTasks: {
            title: "कुल टास्क",
          },
          errors: {
            title: "एरर की गिनती",
          },
          lastError: {
            title: "आख़िरी एरर",
          },
        },
        system: {
          title: "सिस्टम जानकारी",
          description: "सिस्टम रिसोर्स की जानकारी",
          memory: {
            title: "मेमोरी उपयोग",
            description: "सिस्टम मेमोरी की जानकारी",
            used: {
              title: "इस्तेमाल हुई मेमोरी",
            },
            total: {
              title: "कुल मेमोरी",
            },
            percentage: {
              title: "मेमोरी उपयोग %",
            },
          },
          cpu: {
            title: "CPU उपयोग",
            description: "सिस्टम CPU की जानकारी",
            usage: {
              title: "CPU उपयोग %",
            },
            loadAverage: {
              title: "लोड एवरेज",
            },
          },
          disk: {
            title: "डिस्क उपयोग",
            description: "सिस्टम डिस्क की जानकारी",
            available: {
              title: "उपलब्ध जगह",
            },
            total: {
              title: "कुल जगह",
            },
            percentage: {
              title: "डिस्क उपयोग %",
            },
          },
        },
        checks: {
          title: "हेल्थ चेक",
          description: "हर कॉम्पोनेंट के अलग हेल्थ चेक",
          item: {
            title: "हेल्थ चेक",
            description: "हर हेल्थ चेक का नतीजा",
            name: {
              title: "चेक का नाम",
            },
            status: {
              title: "चेक का स्टेटस",
            },
            message: {
              title: "चेक का मैसेज",
            },
            duration: {
              title: "अवधि (ms)",
            },
          },
        },
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
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
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
      },
      success: {
        title: "सफल",
        description: "हेल्थ चेक सफलतापूर्वक पूरा हुआ",
      },
    },
  },
  start: {
    category: "सर्वर मैनेजमेंट",
    tags: {
      start: "शुरू करें",
    },
    post: {
      title: "प्रोडक्शन सर्वर शुरू करें",
      description: "प्री-टास्क और Next.js के साथ प्रोडक्शन सर्वर शुरू करें",
      form: {
        title: "स्टार्ट कॉन्फ़िगरेशन",
        description: "सर्वर शुरू करने के पैरामीटर कॉन्फ़िगर करें",
      },
      response: {
        title: "रिस्पॉन्स",
        description: "शुरू करने का रिस्पॉन्स डेटा",
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
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
        server: {
          title: "सर्वर एरर",
          description: "आंतरिक सर्वर एरर हुई",
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
  },
};
