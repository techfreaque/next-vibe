import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 मिनट",
      "3m": "3 मिनट",
      "5m": "5 मिनट",
      "15m": "15 मिनट",
      "30m": "30 मिनट",
      "1h": "1 घंटा",
      "4h": "4 घंटे",
      "1d": "1 दिन",
      "1w": "1 हफ़्ता",
      "1M": "1 महीना",
    },
    runStatus: {
      running: "चल रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
    },
    backtestActionMode: {
      simulate: "सिमुलेट करें",
      execute: "चलाएँ",
    },
    graphOwnerType: {
      system: "सिस्टम",
      admin: "एडमिन",
      user: "यूज़र",
    },
    triggerType: {
      manual: "मैन्युअल",
      cron: "शेड्यूल्ड",
    },
  },
  // Standard vibe-sense field labels (used by shared/fields.ts helpers)
  fields: {
    source: { label: "सोर्स", description: "इनपुट टाइम सीरीज़" },
    resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-अवधि" },
    range: { label: "रेंज", description: "गणना की समय-सीमा" },
    lookback: {
      label: "लुकबैक",
      description: "वार्म-अप के लिए रेंज शुरू होने से पहले के अतिरिक्त बार",
    },
    result: { label: "नतीजा", description: "आउटपुट टाइम सीरीज़" },
    meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन मेटाडेटा" },
  },
  tags: {
    vibeSense: "vibe-sense",
    analytics: "analytics",
    pipeline: "pipeline",
  },

  // Graph list
  graphs: {
    list: {
      title: "पाइपलाइन ग्राफ़",
      description: "मौजूदा यूज़र को दिखने वाले सभी ग्राफ़ लिस्ट करें",
      container: {
        title: "ग्राफ़",
        description: "सभी पाइपलाइन ग्राफ़",
      },
      response: {
        graphs: "ग्राफ़",
      },
      success: {
        title: "ग्राफ़ लोड हुए",
        description: "पाइपलाइन ग्राफ़ मिल गए",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
        server: { title: "सर्वर एरर", description: "ग्राफ़ लोड नहीं हो पाए" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "रिक्वेस्ट गलत है",
        },
        notFound: { title: "नहीं मिला", description: "कोई ग्राफ़ नहीं मिला" },
        conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    create: {
      title: "ग्राफ़ बनाएँ",
      description: "नया पाइपलाइन ग्राफ़ बनाएँ",
      fields: {
        name: {
          label: "नाम",
          description: "ग्राफ़ का डिस्प्ले नाम",
          placeholder: "मेरा ग्राफ़",
        },
        slug: {
          label: "स्लग",
          description: "यूनीक आइडेंटिफ़ायर",
          placeholder: "my-graph",
        },
        description: {
          label: "विवरण",
          description: "वैकल्पिक विवरण",
          placeholder: "",
        },
        config: { label: "कॉन्फ़िग", description: "ग्राफ़ DAG कॉन्फ़िगरेशन" },
      },
      response: {
        id: "ग्राफ़ ID",
      },
      success: {
        title: "ग्राफ़ बन गया",
        description: "पाइपलाइन ग्राफ़ बन गया",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
        server: {
          title: "सर्वर एरर",
          description: "ग्राफ़ नहीं बन पाया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "ग्राफ़ कॉन्फ़िग गलत है",
        },
        notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
        conflict: {
          title: "टकराव",
          description: "ग्राफ़ स्लग पहले से मौजूद है",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    get: {
      title: "ग्राफ़ पाएँ",
      description: "ID से कोई ख़ास ग्राफ़ पाएँ",
      fields: {
        id: { label: "ग्राफ़ ID", description: "ग्राफ़ वर्शन का UUID" },
      },
      response: {
        graph: "ग्राफ़",
      },
      success: {
        title: "ग्राफ़ लोड हो गया",
        description: "ग्राफ़ सफलतापूर्वक मिल गया",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
        server: { title: "सर्वर एरर", description: "ग्राफ़ लोड नहीं हो सका" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: { title: "वैलिडेशन फ़ेल हुआ", description: "गलत ID" },
        notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
        conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    edit: {
      title: "ग्राफ़ एडिट करें",
      description:
        "ग्राफ़ की ब्रांच बनाकर एडिट करें (नया वर्ज़न बनता है, पुराना कभी नहीं बदलता)",
      fields: {
        id: {
          label: "ग्राफ़ ID",
          description: "जिस वर्शन से ब्रांच बनानी है उसका UUID",
        },
        config: { label: "कॉन्फ़िग", description: "अपडेट किया ग्राफ़ कॉन्फ़िग" },
        name: { label: "नाम", description: "अपडेट किया नाम" },
        description: {
          label: "विवरण",
          description: "अपडेट किया विवरण",
        },
      },
      response: {
        id: "नए वर्ज़न की ID",
      },
      success: {
        title: "ग्राफ़ की ब्रांच बन गई",
        description: "नया ग्राफ़ वर्ज़न सफलतापूर्वक बन गया",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
        server: { title: "सर्वर एरर", description: "ग्राफ़ एडिट नहीं हो सका" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "गलत कॉन्फ़िग",
        },
        notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
        conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    promote: {
      title: "सिस्टम में प्रमोट करें",
      description: "एडमिन ग्राफ़ को सिस्टम-ओन्ड (रीड-ओनली, साझा) में प्रमोट करें",
      fields: {
        id: { label: "ग्राफ़ ID", description: "प्रमोट होने वाले ग्राफ़ का UUID" },
      },
      response: {
        id: "ग्राफ़ ID",
      },
      success: {
        title: "ग्राफ़ प्रमोट हुआ",
        description: "ग्राफ़ सफलतापूर्वक सिस्टम में प्रमोट हुआ",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
        server: {
          title: "सर्वर एरर",
          description: "ग्राफ़ प्रमोट नहीं हो सका",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: { title: "वैलिडेशन फ़ेल हुआ", description: "गलत ID" },
        notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
        conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    trigger: {
      title: "ग्राफ़ ट्रिगर करें",
      description: "ऑन-डिमांड ग्राफ़ एक्ज़ीक्यूशन हाथ से ट्रिगर करें",
      fields: {
        id: { label: "ग्राफ़ ID", description: "ट्रिगर होने वाले ग्राफ़ का UUID" },
        rangeFrom: { label: "से", description: "रेंज की शुरुआत (ISO तारीख़)" },
        rangeTo: { label: "तक", description: "रेंज का अंत (ISO तारीख़)" },
      },
      response: {
        nodeCount: "चलाए गए नोड",
        errorCount: "एरर",
        errors: "एरर",
      },
      success: {
        title: "ग्राफ़ चल गया",
        description: "ग्राफ़ सफलतापूर्वक चला",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
        server: {
          title: "सर्वर एरर",
          description: "ग्राफ़ का एक्ज़ीक्यूशन फ़ेल हुआ",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "पैरामीटर गलत हैं",
        },
        notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
        conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    backtest: {
      title: "बैकटेस्ट चलाएँ",
      description: "ऐतिहासिक रेंज पर बैकटेस्ट चलाएँ (कार्रवाइयाँ सिम्युलेटेड)",
      fields: {
        id: { label: "ग्राफ़ ID", description: "ग्राफ़ वर्शन का UUID" },
        rangeFrom: { label: "से", description: "बैकटेस्ट रेंज की शुरुआत" },
        rangeTo: { label: "तक", description: "बैकटेस्ट रेंज का अंत" },
        resolution: {
          label: "रेज़ोल्यूशन",
          description: "मूल्यांकन की टाइमफ़्रेम",
        },
      },
      response: {
        runId: "रन ID",
        eligible: "योग्य",
        ineligibleNodes: "अयोग्य नोड",
      },
      success: {
        title: "बैकटेस्ट पूरा हुआ",
        description: "बैकटेस्ट सफलतापूर्वक चला",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
        server: { title: "सर्वर एरर", description: "बैकटेस्ट फ़ेल हुआ" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "पैरामीटर गलत हैं",
        },
        notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
        conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    data: {
      title: "ग्राफ़ डेटा",
      description: "किसी ग्राफ़ का टाइम-सीरीज़ डेटा लाएँ (ऑन-डिमांड एक्ज़ीक्यूशन)",
      fields: {
        id: { label: "ग्राफ़ ID", description: "ग्राफ़ का UUID" },
        rangeFrom: { label: "से", description: "रेंज की शुरुआत" },
        rangeTo: { label: "तक", description: "रेंज का अंत" },
      },
      response: {
        series: "सीरीज़",
        signals: "सिग्नल",
      },
      success: {
        title: "डेटा लोड हो गया",
        description: "ग्राफ़ डेटा सफलतापूर्वक मिल गया",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एक्सेस नहीं मिला" },
        server: { title: "सर्वर एरर", description: "डेटा नहीं मिल सका" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "पैरामीटर गलत हैं",
        },
        notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
        conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
  },

  // Indicator node definitions
  indicators: {
    ema: {
      description: "एक्सपोनेंशियल मूविंग एवरेज: हाल की कीमतों को ज़्यादा वज़न देता है",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "EMA" } },
      params: {
        period: { label: "अवधि", description: "पीरियड की संख्या (1–500)" },
      },
    },
    rsi: {
      description: "Relative Strength Index, मोमेंटम ऑसिलेटर (0-100)",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "RSI" } },
      params: {
        period: { label: "अवधि", description: "लुकबैक अवधि (2-100)" },
      },
    },
    bollinger: {
      description: "Bollinger Bands, मूविंग एवरेज के आसपास वोलैटिलिटी का दायरा",
      input: { source: { label: "सोर्स" } },
      output: {
        upper: { label: "ऊपरी बैंड" },
        middle: { label: "मध्य बैंड" },
        lower: { label: "निचला बैंड" },
      },
      params: {
        period: { label: "अवधि", description: "मूविंग एवरेज की अवधि" },
        stdDev: {
          label: "Std Dev",
          description: "स्टैंडर्ड डेविएशन गुणक",
        },
      },
    },
    macd: {
      description: "MACD, ट्रेंड फ़ॉलो करने वाला मोमेंटम इंडिकेटर",
      input: { source: { label: "सोर्स" } },
      output: {
        macd: { label: "MACD" },
        signal: { label: "सिग्नल" },
        histogram: { label: "हिस्टोग्राम" },
      },
      params: {
        fastPeriod: { label: "फ़ास्ट अवधि", description: "फ़ास्ट EMA अवधि" },
        slowPeriod: { label: "स्लो अवधि", description: "स्लो EMA अवधि" },
        signalPeriod: {
          label: "सिग्नल अवधि",
          description: "सिग्नल EMA अवधि",
        },
      },
    },
    ratio: {
      description: "हर टाइमस्टैम्प पर A / B निकालें",
      input: { a: { label: "अंश" }, b: { label: "हर" } },
      output: { value: { label: "अनुपात" } },
    },
    delta: {
      description: "पिछली अवधि से बदलाव",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "डेल्टा" } },
    },
    clamp: {
      description: "वैल्यू को [min, max] के बीच सीमित करें",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "क्लैंप की हुई" } },
      params: {
        min: { label: "न्यूनतम", description: "निचली सीमा" },
        max: { label: "अधिकतम", description: "ऊपरी सीमा" },
      },
    },
    windowAvg: {
      description: "N अवधियों का रोलिंग एवरेज",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "औसत" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
    windowSum: {
      description: "N अवधियों का रोलिंग योग",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "योग" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
    windowMin: {
      description: "N अवधियों का रोलिंग न्यूनतम",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "न्यूनतम" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
    windowMax: {
      description: "N अवधियों का रोलिंग अधिकतम",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "अधिकतम" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
  },

  // Data source node definitions
  dataSources: {
    leadsCreated: {
      description: "हर मिनट बनी नई लीड की संख्या",
      output: { value: { label: "बनी लीड" } },
    },
    leadsConverted: {
      description: "हर मिनट यूज़र में बदली लीड की संख्या",
      output: { value: { label: "कन्वर्ट हुई लीड" } },
    },
    leadsActive: {
      description: "कुल सक्रिय लीड (रोज़ का स्नैपशॉट)",
      output: { value: { label: "सक्रिय लीड" } },
    },
    leadsBounced: {
      description: "हर मिनट लीड ईमेल बाउंस की संख्या",
      output: { value: { label: "बाउंस हुई लीड्स" } },
    },
    leadsEngagements: {
      description: "हर मिनट कुल लीड एंगेजमेंट इवेंट (ओपन + क्लिक)",
      output: { value: { label: "लीड एंगेजमेंट" } },
    },
    leadsEmailsSent: {
      description: "हर मिनट भेजे गए कैंपेन ईमेल की संख्या",
      output: { value: { label: "भेजे गए ईमेल" } },
    },
    leadsUnsubscribed: {
      description: "हर मिनट अनसब्सक्राइब हुई लीड की संख्या",
      output: { value: { label: "अनसब्सक्राइब हुई लीड" } },
    },
    leadsEmailOpens: {
      description: "हर मिनट ट्रैक हुए ईमेल ओपन की संख्या",
      output: { value: { label: "ईमेल ओपन" } },
    },
    leadsEmailClicks: {
      description: "हर मिनट ट्रैक हुए ईमेल लिंक क्लिक की संख्या",
      output: { value: { label: "ईमेल क्लिक" } },
    },
    leadsNewsletterSubscribers: {
      description: "कन्फ़र्म न्यूज़लेटर सब्सक्रिप्शन वाली कुल लीड (रोज़ का स्नैपशॉट)",
      output: { value: { label: "न्यूज़लेटर सब्सक्राइबर" } },
    },
    leadsWebsiteUsers: {
      description: "वेबसाइट यूज़र स्टेटस वाली कुल लीड (रोज़ का स्नैपशॉट)",
      output: { value: { label: "वेबसाइट यूज़र" } },
    },
    leadsCampaignRunning: {
      description: "अभी सक्रिय ईमेल कैंपेन में कुल लीड (रोज़ का स्नैपशॉट)",
      output: { value: { label: "कैंपेन में" } },
    },
    leadsInContact: {
      description: "अभी कॉन्टैक्ट स्टेटस में कुल लीड (रोज़ का स्नैपशॉट)",
      output: { value: { label: "संपर्क में" } },
    },
    leadsWebsiteVisits: {
      description: "हर मिनट वेबसाइट विज़िट एंगेजमेंट इवेंट की संख्या",
      output: { value: { label: "वेबसाइट विज़िट" } },
    },
    leadsFormSubmits: {
      description: "हर मिनट फ़ॉर्म सबमिट एंगेजमेंट इवेंट की संख्या",
      output: { value: { label: "फ़ॉर्म सबमिट" } },
    },
    usersRegistered: {
      description: "हर मिनट नए यूज़र रजिस्ट्रेशन की संख्या",
      output: { value: { label: "रजिस्टर हुए यूज़र" } },
    },
    usersActiveTotal: {
      description: "कुल सक्रिय वेरिफ़ाइड यूज़र (रोज़ का स्नैपशॉट)",
      output: { value: { label: "सक्रिय यूज़र" } },
    },
    usersBanned: {
      description: "हर मिनट बैन हुए यूज़र की संख्या (अनुमानित)",
      output: { value: { label: "बैन किए गए यूज़र" } },
    },
    usersEmailVerified: {
      description: "वेरिफ़ाइड ईमेल वाले कुल यूज़र (रोज़ का स्नैपशॉट)",
      output: { value: { label: "ईमेल वेरिफ़ाइड" } },
    },
    usersMarketingConsent: {
      description: "मार्केटिंग सहमति देने वाले कुल यूज़र (रोज़ का स्नैपशॉट)",
      output: { value: { label: "मार्केटिंग सहमति" } },
    },
    usersWithStripe: {
      description: "Stripe कस्टमर से जुड़े कुल यूज़र (रोज़ का स्नैपशॉट)",
      output: { value: { label: "Stripe यूज़र" } },
    },
    usersTwoFaEnabled: {
      description: "2FA चालू वाले कुल यूज़र (रोज़ का स्नैपशॉट)",
      output: { value: { label: "2FA चालू" } },
    },
    usersLoginAttemptsTotal: {
      description: "हर मिनट कुल लॉगिन कोशिशें",
      output: { value: { label: "लॉगिन प्रयास" } },
    },
    usersLoginAttemptsFailed: {
      description: "हर मिनट फ़ेल लॉगिन कोशिशें",
      output: { value: { label: "फ़ेल हुए लॉगिन" } },
    },
    creditsSpentTotal: {
      description: "सभी वॉलेट में हर मिनट ख़र्च हुए कुल क्रेडिट",
      output: { value: { label: "खर्च हुए क्रेडिट" } },
    },
    creditsSpentByUsers: {
      description: "लॉग इन यूज़र द्वारा हर मिनट ख़र्च हुए क्रेडिट",
      output: { value: { label: "ख़र्च हुए क्रेडिट (यूज़र)" } },
    },
    creditsSpentByLeads: {
      description: "लीड द्वारा हर मिनट ख़र्च हुए फ़्री क्रेडिट",
      output: { value: { label: "ख़र्च हुए क्रेडिट (लीड)" } },
    },
    creditsPurchased: {
      description: "हर मिनट ख़रीदे या सब्सक्रिप्शन से जुड़े क्रेडिट",
      output: { value: { label: "ख़रीदे गए क्रेडिट" } },
    },
    creditsFreeGrants: {
      description: "हर मिनट लीड को दिए गए फ़्री क्रेडिट ग्रांट",
      output: { value: { label: "फ़्री ग्रांट" } },
    },
    creditsEarned: {
      description: "हर मिनट रेफ़रल से कमाए गए क्रेडिट",
      output: { value: { label: "कमाए गए क्रेडिट" } },
    },
    creditsExpired: {
      description: "हर मिनट एक्सपायर हुए क्रेडिट",
      output: { value: { label: "एक्सपायर हुए क्रेडिट" } },
    },
    creditsRefunded: {
      description: "हर मिनट रिफ़ंड हुए क्रेडिट",
      output: { value: { label: "रिफ़ंड हुए क्रेडिट" } },
    },
    creditsBalanceTotal: {
      description: "सभी यूज़र वॉलेट में कुल क्रेडिट बैलेंस (रोज़ का स्नैपशॉट)",
      output: { value: { label: "क्रेडिट बैलेंस" } },
    },
    creditsSubscriptionRevenue: {
      description: "हर मिनट सब्सक्रिप्शन-टाइप पैक से मिले क्रेडिट",
      output: { value: { label: "सब्सक्रिप्शन आमदनी" } },
    },
    creditsTransferVolume: {
      description: "हर मिनट वॉलेट के बीच क्रेडिट ट्रांसफ़र की मात्रा",
      output: { value: { label: "ट्रांसफ़र वॉल्यूम" } },
    },
    creditsFreePoolUtilization: {
      description: "इस्तेमाल हुए फ़्री क्रेडिट पूल का प्रतिशत (रोज़ का स्नैपशॉट)",
      output: { value: { label: "फ़्री पूल का उपयोग" } },
    },
  },

  // Evaluator node definitions
  evaluators: {
    threshold: {
      description: "तब चलता है जब सीरीज़ का मान किसी स्थिरांक से तुलना की शर्त पूरी करे",
      input: {
        series: { label: "सीरीज़" },
      },
      output: {
        signal: { label: "सिग्नल" },
      },
      params: {
        op: {
          label: "ऑपरेटर",
          description: "तुलना ऑपरेटर",
        },
        value: {
          label: "वैल्यू",
          description: "जिससे तुलना करनी है वह कॉन्स्टेंट",
        },
      },
    },
    and: {
      description: "तब फ़ायर होता है जब सभी इनपुट सिग्नल एक ही टाइमस्टैम्प पर फ़ायर हों",
      input: { signals: { label: "सिग्नल" } },
      output: { signal: { label: "सिग्नल" } },
    },
    or: {
      description:
        "किसी दिए टाइमस्टैम्प पर कोई भी इनपुट सिग्नल फ़ायर हो तो फ़ायर होता है",
      input: { signals: { label: "सिग्नल" } },
      output: { signal: { label: "सिग्नल" } },
    },
    not: {
      description: "सिग्नल स्ट्रीम को उलट देता है",
      input: { signal: { label: "सिग्नल" } },
      output: { signal: { label: "उलटा" } },
    },
    crossover: {
      description: "तब फ़ायर होता है जब सीरीज़ A सीरीज़ B के ऊपर पार करती है",
      input: {
        seriesA: { label: "सीरीज़ A" },
        seriesB: { label: "सीरीज़ B" },
      },
      output: { signal: { label: "सिग्नल" } },
    },
    script: {
      description:
        "सैंडबॉक्स्ड कस्टम इवैल्युएटर, इनपुट सीरीज़ लेता है और सिग्नल इवेंट लौटाता है",
      input: { inputs: { label: "इनपुट" } },
      output: { signal: { label: "सिग्नल" } },
      params: {
        fn: {
          label: "फ़ंक्शन",
          description:
            "JS फ़ंक्शन बॉडी, जो इनपुट सीरीज़ ऐरे लेती है और सिग्नल इवेंट लौटाती है",
        },
      },
    },
  },

  // Transformer node definitions
  transformers: {
    merge: {
      description: "मैच करते टाइमस्टैम्प पर दो सीरीज़ जोड़ें",
      input: {
        a: { label: "सीरीज़ A" },
        b: { label: "सीरीज़ B" },
      },
      output: { value: { label: "मर्ज की हुई" } },
    },
    ratio: {
      description: "हर टाइमस्टैम्प पर A / B निकालें",
      input: {
        a: { label: "अंश" },
        b: { label: "हर" },
      },
      output: { value: { label: "अनुपात" } },
    },
    delta: {
      description: "पिछली अवधि से बदलाव",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "डेल्टा" } },
    },
    clamp: {
      description: "वैल्यू को [min, max] के बीच सीमित करें",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "क्लैंप की हुई" } },
      params: {
        min: { label: "न्यूनतम", description: "निचली सीमा" },
        max: { label: "अधिकतम", description: "ऊपरी सीमा" },
      },
    },
    windowAvg: {
      description: "N अवधियों का रोलिंग एवरेज",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "औसत" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
    windowSum: {
      description: "N अवधियों का रोलिंग योग",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "योग" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
    windowMin: {
      description: "N अवधियों का रोलिंग न्यूनतम",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "न्यूनतम" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
    windowMax: {
      description: "N अवधियों का रोलिंग अधिकतम",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "अधिकतम" } },
      params: {
        size: { label: "विंडो", description: "पीरियड की संख्या (1–500)" },
      },
    },
    fieldPick: {
      description: "मल्टी-वैल्यू सीरीज़ से नाम वाला फ़ील्ड निकालें",
      input: { source: { label: "मल्टी-वैल्यू" } },
      output: { value: { label: "फ़ील्ड" } },
      params: {
        field: {
          label: "फ़ील्ड का नाम",
          description: "निकालने वाले फ़ील्ड का नाम",
        },
      },
    },
    jsonPath: {
      description: "DataPoint meta से डॉट-नोटेशन पाथ के ज़रिए वैल्यू निकालें",
      input: { source: { label: "सोर्स" } },
      output: { value: { label: "वैल्यू" } },
      params: {
        path: {
          label: "पाथ",
          description: "डॉट-नोटेशन पाथ, जैसे data.stats.total",
        },
      },
    },
    script: {
      description: "कस्टम सैंडबॉक्स्ड स्क्रिप्ट ट्रांसफ़ॉर्मेशन",
      input: { inputs: { label: "इनपुट" } },
      output: { value: { label: "नतीजा" } },
      params: {
        fn: {
          label: "फ़ंक्शन",
          description:
            "JS ऐरो फ़ंक्शन, जो इनपुट सीरीज़ ऐरे लेता है और DataPoint[] लौटाता है",
        },
      },
    },
  },

  // Shared data-source chart widget UI
  dataSourceWidget: {
    latestValue: "ताज़ा",
    browseGraphs: "ग्राफ़ ब्राउज़ करें",
    filters: "फ़िल्टर",
    applyFilters: "फ़िल्टर लगाएँ",
    expandPeriod: "{{period}} दिखाएँ",
    period: "अवधि",
    interval: "ग्रुप करें",
    loadError: "चार्ट लोड नहीं हो सका।",
    addToGraph: "ग्राफ़ में जोड़ें",
    newGraph: "नया ग्राफ़",
    loading: "डेटा लोड हो रहा है…",
    noData: "इस अवधि के लिए कोई डेटा नहीं",
  },

  // Cleanup task
  cleanup: {
    post: {
      title: "Vibe Sense क्लीनअप",
      description: "डेटापॉइंट के लिए रिटेंशन क्लीनअप चलाएँ और स्नैपशॉट एक्सपायर करें",
      success: {
        title: "क्लीनअप पूरा हुआ",
        description: "रिटेंशन क्लीनअप ख़त्म हुआ",
      },
      response: {
        nodesProcessed: "प्रोसेस हुए नोड",
        totalDeleted: "हटाई गई पंक्तियाँ",
        snapshotsDeleted: "हटाए गए स्नैपशॉट",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
        server: { title: "सर्वर एरर", description: "क्लीनअप फ़ेल हुआ" },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        validation: {
          title: "वैलिडेशन फ़ेल हुआ",
          description: "रिक्वेस्ट गलत है",
        },
        notFound: { title: "नहीं मिला", description: "नहीं मिला" },
        conflict: { title: "टकराव", description: "टकराव" },
        network: {
          title: "नेटवर्क एरर",
          description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "पहले बदलाव सेव करें",
        },
      },
    },
    name: "Vibe Sense क्लीनअप",
    description: "पुराने डेटापॉइंट हटाता है और स्नैपशॉट कैश एक्सपायर करता है",
  },
};
