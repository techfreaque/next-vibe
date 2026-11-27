import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  setup: {
    install: {
      post: {
        title: "इंस्टॉल",
        description: "इंस्टॉल एंडपॉइंट",
        form: {
          title: "इंस्टॉल कॉन्फ़िगरेशन",
          description: "इंस्टॉल पैरामीटर सेट करें",
        },
        response: {
          title: "रिस्पॉन्स",
          description: "इंस्टॉल रिस्पॉन्स डेटा",
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
    status: {
      post: {
        title: "CLI इंस्टॉलेशन स्टेटस",
        description: "Vibe CLI का मौजूदा इंस्टॉलेशन स्टेटस देखें",
        form: {
          title: "स्थिति कॉन्फ़िगरेशन",
          description: "स्थिति के पैरामीटर सेट करें",
        },
        response: {
          title: "इंस्टॉलेशन स्टेटस",
          description: "CLI इंस्टॉलेशन की मौजूदा जानकारी",
          fields: {
            success: "ऑपरेशन स्टेटस",
            installed: "इंस्टॉल है",
            version: "CLI वर्शन",
            path: "इंस्टॉलेशन पाथ",
            message: "स्टेटस मैसेज",
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
    uninstall: {
      post: {
        title: "अनइंस्टॉल",
        description: "अनइंस्टॉल एंडपॉइंट",
        form: {
          title: "अनइंस्टॉल कॉन्फ़िगरेशन",
          description: "अनइंस्टॉल पैरामीटर सेट करें",
        },
        response: {
          title: "रिस्पॉन्स",
          description: "अनइंस्टॉल रिस्पॉन्स डेटा",
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
    update: {
      post: {
        title: "अपडेट",
        description: "अपडेट एंडपॉइंट",
        form: {
          title: "अपडेट कॉन्फ़िगरेशन",
          description: "अपडेट पैरामीटर सेट करें",
        },
        response: {
          title: "रिस्पॉन्स",
          description: "अपडेट रिस्पॉन्स डेटा",
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
  },
  request: "रिक्वेस्ट",
  response: {
    success: "रिस्पॉन्स",
    error: "एरर",
  },
  auth: {
    errors: {
      userNotFound:
        "ईमेल {{email}} वाला CLI यूज़र डेटाबेस में नहीं मिला। पहले 'vibe seed' चलाएँ।",
      databaseError: "CLI यूज़र लाते समय डेटाबेस एरर: {{error}}",
      authNotAvailable: "ऑथेंटिकेशन उपलब्ध नहीं है",
    },
  },
  vibe: {
    noFields: "दिखाने के लिए कोई फ़ील्ड नहीं",
    startingUp: "Vibe CLI शुरू हो रहा है...",
    executeCommand: "कमांड चल रही है",
    executing: "चल रहा है",
    listCommands: "सभी उपलब्ध कमांड दिखाएँ",
    output: "आउटपुट फ़ॉर्मैट",
    utils: {
      debug: {
        executionSummary:
          "एक्ज़ीक्यूशन: {{executionSeconds}}s | ओवरहेड: {{overheadSeconds}}s | कुल: {{totalSeconds}}s",
      },
    },
    help: {
      title: "Vibe CLI हेल्प",
      description: "Vibe CLI, अगली पीढ़ी का API एक्ज़ीक्यूशन टूल",
      usage: "उपयोग: vibe <command> [options]",
      commands: "उपलब्ध कमांड",
      options: "विकल्प",
      examples: "उदाहरण",
      locale: "लोकेल चुनें (en-GLOBAL, de-DE, pl-PL)",
      verbose: "विस्तृत आउटपुट चालू करें",
      target: "एक्ज़ीक्यूशन टारगेट: dev (डिफ़ॉल्ट) या local (--hermes के साथ प्रीव्यू DB)",
      thea: "--remote का शॉर्टकट ('thea' इंस्टेंस को टारगेट करता है)",
      remote:
        "ID से रिमोट इंस्टेंस पर चलाएँ (डिफ़ॉल्ट: thea)। कनेक्शन एक्टिव DB से लिया जाता है।",
      interactive: "इंटरैक्टिव मोड चालू करें",
    },
    errors: {
      routeNotFound: "टूल नहीं मिला: {{toolName}}",
      executionFailed: "एक्ज़ीक्यूशन फ़ेल हुआ",
      executionFailedDetail: "एक्ज़ीक्यूशन फ़ेल: {{error}}",
      unknownError: "अज्ञात एरर हुआ",
      publicPayloadNotSupported: "पब्लिक पेलोड सपोर्ट नहीं है",
      invalidTokenPayload: "टोकन पेलोड गलत है",
      invalidToken: "ग़लत टोकन",
      signingFailed: "टोकन साइन नहीं हो सका",
      userNotFound: "यूज़र नहीं मिला",
      authenticationFailed: "ऑथेंटिकेशन फ़ेल हुआ",
      invalidFormat: "सेशन फ़ॉर्मैट गलत है",
      sessionExpired: "सेशन समाप्त हो गया",
      notFound: "सेशन नहीं मिला",
      readFailed: "सेशन पढ़ा नहीं जा सका",
      invalidData: "सेशन डेटा गलत है",
      writeFailed: "सेशन लिखा नहीं जा सका: {{error}}",
      deleteFailed: "सेशन हटाया नहीं जा सका: {{error}}",
      storeFailed: "सेशन सेव नहीं हो सका: {{error}}",
      clearFailed: "सेशन साफ़ नहीं हो सका: {{error}}",
      setLeadIdCookieFailed: "लीड ID कुकी सेट नहीं हो सकी",
      remoteNoToken: "रिमोट सेशन में कोई एक्टिव टोकन नहीं है",
      remoteExpired: "रिमोट सेशन एक्सपायर हो गया",
      remoteNotFound:
        "कोई रिमोट सेशन नहीं मिला। चलाएँ: vibe login --target remote",
      remoteReadFailed: "रिमोट सेशन पढ़ा नहीं जा सका",
      remoteWriteFailed: "रिमोट सेशन लिखा नहीं जा सका",
      remoteClearFailed: "रिमोट सेशन साफ़ नहीं हो सका",
      remoteNoConnection:
        "इंस्टेंस '{{instanceId}}' के लिए कोई एक्टिव कनेक्शन नहीं है। चलाएँ: vibe connect <url>",
      remoteNotLoggedIn:
        "रिमोट होस्ट पर लॉग इन नहीं हैं। चलाएँ: vibe --remote login",
      remoteNoLeadId: "रिमोट होस्ट से पहचान नहीं मिल सकी",
      remoteServerError: "रिमोट सर्वर एरर",
      remoteNotAvailable: "इस बिल्ड में रिमोट एक्ज़ीक्यूशन उपलब्ध नहीं है",
    },
    endpoints: {
      endpointHandler: {
        error: {
          form_validation_failed: "फ़ॉर्म वैलिडेशन फ़ेल हुआ",
          unauthorized: "अनधिकृत एक्सेस",
          errors: {
            unknown_validation_error: "अज्ञात वैलिडेशन एरर",
            invalid_request_data: "ग़लत रिक्वेस्ट डेटा",
            invalid_url_parameters: "URL पैरामीटर गलत हैं",
          },
          general: {
            internal_server_error: "आंतरिक सर्वर एरर",
          },
        },
      },
      renderers: {
        cliUi: {
          helpHandler: {
            noDescription: "कोई विवरण उपलब्ध नहीं",
            flagDataDesc: "रिक्वेस्ट डेटा JSON में दें",
            flagUserTypeDesc: "यूज़र टाइप चुनें (admin, customer, public)",
            flagLocaleDesc: "लोकेल चुनें (en-GLOBAL, de-DE, pl-PL)",
            flagOutputDesc: "आउटपुट फ़ॉर्मैट (pretty, json)",
            flagVerboseDesc: "विस्तृत आउटपुट चालू करें",
            flagDryRunDesc: "बिना चलाए ड्राई रन करें",
            usageLabel: "इस्तेमाल",
            availableCommandsLabel: "उपलब्ध कमांड",
            globalOptionsLabel: "ग्लोबल ऑप्शन",
            examplesLabel: "उदाहरण",
          },
          noEndpoint: "यह फ़ीचर अभी उपलब्ध नहीं है। थोड़ी देर बाद फिर कोशिश करें",
          widgets: {
            common: {
              noDataAvailable: "कोई डेटा उपलब्ध नहीं",
              noIssuesFound: "कोई समस्या नहीं मिली",
              invalidDataFormat: "डेटा का फ़ॉर्मेट गलत है",
              invalidFormType:
                "फ़ॉर्म कॉन्टेक्स्ट Ink फ़ॉर्म स्टेट नहीं है। इंटरैक्टिव इनपुट नहीं दिखाया जा सकता।",
              info: "जानकारी",
              items: "आइटम",
              andMoreItems: "और {{count}} आइटम",
              affectedFiles: "प्रभावित फ़ाइलें",
              summary: "सारांश",
              files: "फ़ाइलें",
              issues: "समस्याएँ",
              other: "अन्य",
              error: "एरर",
              errors: "एरर",
              warning: "चेतावनी",
              warnings: "चेतावनियाँ",
              hints: {
                spaceToToggle: "(टॉगल के लिए space)",
                arrowsToChange: "(बदलने के लिए ←/→)",
                dollarPrompt: "$ ",
                executing: "चल रहा है...",
                tabNextField:
                  "tab: अगला फ़ील्ड | enter: सबमिट | q/esc: बाहर निकलें",
                ctrlCExitHint: "बाहर निकलने के लिए Ctrl+C फिर दबाएँ",
                escExitHint: "बाहर निकलने के लिए Esc फिर दबाएँ",
              },
            },
            pagination: {
              notImplemented:
                "CLI में पेजिनेशन उपलब्ध नहीं है। नतीजे छोटे करने के लिए फ़िल्टर लगाएँ।",
            },
          },
        },
      },
    },
    interactive: {
      welcome: "Vibe इंटरैक्टिव मोड में स्वागत है",
      goodbye: "फिर मिलेंगे!",
      help: {
        selectCategory: "टूल देखने के लिए कैटेगरी चुनें",
        selectTool: "डिटेल देखने के लिए टूल चुनें",
        category: "कैटेगरी  ",
        method: "मेथड  ",
        credits: "क्रेडिट  ",
        callAs: "कॉल करें  ",
        fields: "फ़ील्ड",
        hintsNavSelect: "arrows: नेविगेट | enter: चुनें | q: बाहर",
        hintsNavSelectBack: "arrows: नेविगेट | enter: चुनें | esc: वापस | q: बाहर",
        hintsExecuteBack: "enter: चलाएँ | esc: वापस | q: बाहर",
        hintsBack: "enter/esc: वापस | q: बाहर",
        success: "सफल",
        error: "एरर",
        result: "नतीजा",
      },
      navigation: {
        rootName: "रूट",
        directoryIcon: "📁",
        upIcon: "⬆️",
        goUp: "ऊपर जाएँ",
        routeIcon: "🔗",
        routes: "रूट",
        settingsIcon: "⚙️",
        settings: "सेटिंग्स",
        exitIcon: "🚪",
        exit: "बाहर निकलें",
        navigate: "नेविगेट",
        route: "रूट",
        method: "मेथड",
        description: "विवरण",
        noDefinition: "कोई डेफ़िनिशन नहीं मिली",
        executionFailed: "एक्ज़ीक्यूशन फ़ेल हुआ",
        executeAnother: "एक और चलाएँ",
        selectLocale: "लोकेल चुनें",
        englishGlobal: "English (Global)",
        requestData: "रिक्वेस्ट डेटा",
        urlParameters: "URL पैरामीटर",
        preview: "प्रीव्यू",
        executeWithParams: "पैरामीटर के साथ चलाएँ",
        navigationError: "नेविगेशन एरर",
        chooseSettingToModify: "बदलने के लिए सेटिंग चुनें",
        outputFormatCurrent: "आउटपुट फ़ॉर्मैट (मौजूदा",
        verboseModeCurrent: "वर्बोस मोड (मौजूदा",
        localeCurrent: "लोकेल (मौजूदा",
        backToMainMenu: "मुख्य मेन्यू पर वापस",
        chooseOutputFormat: "आउटपुट फ़ॉर्मैट चुनें",
        prettyFormatted: "प्रिटी फ़ॉर्मैट",
        jsonRaw: "JSON (रॉ)",
        enableVerboseOutput: "विस्तृत आउटपुट चालू करें",
        chooseLocale: "लोकेल चुनें",
        german: "जर्मन",
        polish: "पोलिश",
        settingUpdated: "सेटिंग अपडेट हो गई",
        viewAllRoutes: "सभी रूट देखें",
        selectRoute: "चलाने के लिए रूट चुनें",
        backToNavigation: "नेविगेशन पर वापस",
      },
    },
  },
};
