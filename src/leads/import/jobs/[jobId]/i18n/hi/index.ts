import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटा इम्पोर्ट",
  tags: {
    leads: "लीड",
    management: "मैनेजमेंट",
  },

  get: {
    title: "इम्पोर्ट जॉब लाएँ",
    titleShort: "इम्पोर्ट जॉब",
    description: "किसी ख़ास इम्पोर्ट जॉब का ब्योरा लाएँ",
    actions: {
      retry: "रीट्राई",
      stop: "रोकें",
      viewLeads: "लीड देखें",
    },
    jobId: {
      label: "जॉब ID",
      description: "इम्पोर्ट जॉब की यूनिक पहचान",
    },
    form: {
      title: "इम्पोर्ट जॉब की स्थिति",
      description: "इम्पोर्ट जॉब की मौजूदा स्थिति और प्रगति",
    },
    response: {
      title: "जॉब की जानकारी",
      description: "मौजूदा इम्पोर्ट जॉब का ब्योरा",
      info: {
        title: "जॉब की जानकारी",
        description: "जॉब का बुनियादी ब्योरा",
      },
      id: {
        content: "जॉब ID",
      },
      fileName: {
        content: "फ़ाइल का नाम",
      },
      status: {
        content: "जॉब की स्थिति",
      },
      progress: {
        title: "इम्पोर्ट प्रगति",
        description: "मौजूदा इम्पोर्ट प्रगति और आँकड़े",
      },
      totalRows: {
        content: "कुल पंक्तियाँ",
      },
      processedRows: {
        content: "प्रोसेस हुई पंक्तियाँ",
      },
      successfulImports: {
        content: "सफल इम्पोर्ट",
      },
      failedImports: {
        content: "फ़ेल इम्पोर्ट",
      },
      duplicateEmails: {
        content: "डुप्लिकेट ईमेल",
      },
      configuration: {
        title: "जॉब कॉन्फ़िगरेशन",
        description: "जॉब की मौजूदा कॉन्फ़िगरेशन सेटिंग्स",
      },
      currentBatchStart: {
        content: "मौजूदा बैच की शुरुआत",
      },
      batchSize: {
        content: "बैच साइज़",
      },
      retryCount: {
        content: "रीट्राई की गिनती",
      },
      maxRetries: {
        content: "अधिकतम रीट्राई",
      },
      error: {
        content: "एरर संदेश",
      },
      timestamps: {
        title: "जॉब टाइमस्टैंप",
        description: "जॉब जीवनचक्र के टाइमस्टैंप",
      },
      createdAt: {
        content: "बनने का समय",
      },
      updatedAt: {
        content: "अपडेट होने का समय",
      },
      startedAt: {
        content: "शुरू होने का समय",
      },
      completedAt: {
        content: "पूरा होने का समय",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दी गई जॉब ID गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "जॉब देखने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको यह जॉब देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "जॉब नहीं मिली",
        description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "जॉब लाते समय एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "जॉब लाते समय टकराव हुआ",
      },
    },
    success: {
      title: "सफल",
      description: "इम्पोर्ट जॉब सफलतापूर्वक मिल गई",
    },
  },
  patch: {
    title: "इम्पोर्ट जॉब अपडेट करें",
    titleShort: "इम्पोर्ट जॉब एडिट करें",
    description: "इम्पोर्ट जॉब की कॉन्फ़िगरेशन सेटिंग्स अपडेट करें",
    jobId: {
      label: "जॉब ID",
      description: "इम्पोर्ट जॉब की यूनिक पहचान",
    },
    form: {
      title: "जॉब सेटिंग्स अपडेट करें",
      description: "इम्पोर्ट जॉब का कॉन्फ़िगरेशन बदलें",
    },
    settings: {
      title: "जॉब सेटिंग्स",
      description: "इम्पोर्ट जॉब की कॉन्फ़िगरेशन सेटिंग्स",
    },
    batchSize: {
      label: "बैच साइज़",
      description: "हर बैच में प्रोसेस होने वाली पंक्तियों की संख्या",
      placeholder: "100",
    },
    maxRetries: {
      label: "अधिकतम रीट्राई",
      description: "फ़ेल पंक्तियों के लिए अधिकतम रीट्राई प्रयास",
      placeholder: "3",
    },
    response: {
      title: "अपडेट की गई जॉब जानकारी",
      description: "अपडेट की गई इम्पोर्ट जॉब का ब्योरा",
      info: {
        title: "जॉब की जानकारी",
        description: "जॉब का बुनियादी ब्योरा",
      },
      id: {
        content: "जॉब ID",
      },
      fileName: {
        content: "फ़ाइल का नाम",
      },
      status: {
        content: "जॉब की स्थिति",
      },
      progress: {
        title: "इम्पोर्ट प्रगति",
        description: "मौजूदा इम्पोर्ट प्रगति और आँकड़े",
      },
      totalRows: {
        content: "कुल पंक्तियाँ",
      },
      processedRows: {
        content: "प्रोसेस हुई पंक्तियाँ",
      },
      successfulImports: {
        content: "सफल इम्पोर्ट",
      },
      failedImports: {
        content: "फ़ेल इम्पोर्ट",
      },
      duplicateEmails: {
        content: "डुप्लिकेट ईमेल",
      },
      configuration: {
        title: "जॉब कॉन्फ़िगरेशन",
        description: "जॉब की मौजूदा कॉन्फ़िगरेशन सेटिंग्स",
      },
      currentBatchStart: {
        content: "मौजूदा बैच की शुरुआत",
      },
      batchSize: {
        content: "बैच साइज़",
      },
      retryCount: {
        content: "रीट्राई की गिनती",
      },
      maxRetries: {
        content: "अधिकतम रीट्राई",
      },
      error: {
        content: "एरर संदेश",
      },
      timestamps: {
        title: "जॉब टाइमस्टैंप",
        description: "जॉब जीवनचक्र के टाइमस्टैंप",
      },
      createdAt: {
        content: "बनने का समय",
      },
      updatedAt: {
        content: "अपडेट होने का समय",
      },
      startedAt: {
        content: "शुरू होने का समय",
      },
      completedAt: {
        content: "पूरा होने का समय",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दिया गया डेटा गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "जॉब अपडेट करने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको यह जॉब अपडेट करने की अनुमति नहीं है",
      },
      notFound: {
        title: "जॉब नहीं मिली",
        description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "जॉब अपडेट करते समय एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "अपडेट में टकराव",
        description: "जॉब को किसी दूसरे यूज़र ने बदल दिया",
      },
    },
    success: {
      title: "सफल",
      description: "इम्पोर्ट जॉब सफलतापूर्वक अपडेट हुई",
    },
  },
  delete: {
    title: "इम्पोर्ट जॉब हटाएँ",
    titleShort: "इम्पोर्ट जॉब हटाएँ",
    description: "किसी ख़ास इम्पोर्ट जॉब को हटाएँ",
    jobId: {
      label: "जॉब ID",
      description: "हटाई जाने वाली इम्पोर्ट जॉब की यूनिक पहचान",
    },
    form: {
      title: "इम्पोर्ट जॉब हटाएँ",
      description: "इम्पोर्ट जॉब हटाने की पुष्टि करें",
    },
    response: {
      title: "हटाने का नतीजा",
      description: "हटाने की कार्रवाई का नतीजा",
      success: {
        content: "सफलता की स्थिति",
      },
      message: {
        content: "हटाने का संदेश",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "दी गई जॉब ID गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "जॉब हटाने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "एक्सेस नहीं मिला",
        description: "आपको यह जॉब हटाने की अनुमति नहीं है",
      },
      notFound: {
        title: "जॉब नहीं मिली",
        description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "जॉब हटाते समय एरर हुई",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "हटाने में टकराव",
        description: "जो जॉब अभी प्रोसेस हो रही है उसे हटाया नहीं जा सकता",
      },
    },
    success: {
      title: "सफल",
      description: "इम्पोर्ट जॉब सफलतापूर्वक हट गई",
    },
  },
  retry: {
    category: "डेटा इम्पोर्ट",
    tags: {
      leads: "लीड",
      management: "मैनेजमेंट",
    },

    post: {
      title: "इम्पोर्ट जॉब रीट्राई करें",
      description: "फ़ेल हुई इम्पोर्ट जॉब रीट्राई करें",
      jobId: {
        label: "जॉब ID",
        description: "रीट्राई की जाने वाली इम्पोर्ट जॉब की यूनिक पहचान",
      },
      form: {
        title: "इम्पोर्ट जॉब रीट्राई करें",
        description: "फ़ेल हुई इम्पोर्ट जॉब रीट्राई करें",
      },
      response: {
        title: "रीट्राई का नतीजा",
        description: "रीट्राई की कार्रवाई का नतीजा",
        success: {
          content: "सफलता की स्थिति",
        },
        message: {
          content: "रीट्राई संदेश",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "दी गई जॉब ID गलत है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "जॉब रीट्राई करने के लिए ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "आपको यह जॉब रीट्राई करने की अनुमति नहीं है",
        },
        notFound: {
          title: "जॉब नहीं मिली",
          description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
        },
        server: {
          title: "सर्वर एरर",
          description: "जॉब रीट्राई करते समय एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "रीट्राई में टकराव",
          description: "जो जॉब अभी प्रोसेस हो रही है उसे रीट्राई नहीं किया जा सकता",
        },
      },
      success: {
        title: "सफल",
        description: "इम्पोर्ट जॉब सफलतापूर्वक रीट्राई हुई",
      },
    },
    widget: {
      title: "इम्पोर्ट जॉब रीट्राई करें",
      successMessage: "जॉब रीट्राई सफलतापूर्वक शुरू हुई",
    },
  },
  stop: {
    category: "डेटा इम्पोर्ट",
    tags: {
      leads: "लीड",
      management: "मैनेजमेंट",
    },

    post: {
      title: "इम्पोर्ट जॉब रोकें",
      description: "चल रही इम्पोर्ट जॉब रोकें",
      jobId: {
        label: "जॉब ID",
        description: "रोकी जाने वाली इम्पोर्ट जॉब की यूनिक पहचान",
      },
      form: {
        title: "इम्पोर्ट जॉब रोकें",
        description: "चल रही इम्पोर्ट जॉब रोकें",
      },
      response: {
        title: "रोकने का नतीजा",
        description: "रोकने की कार्रवाई का नतीजा",
        success: {
          content: "सफलता की स्थिति",
        },
        message: {
          content: "रोकने का संदेश",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "दी गई जॉब ID गलत है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "जॉब रोकने के लिए ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "एक्सेस नहीं मिला",
          description: "आपको यह जॉब रोकने की अनुमति नहीं है",
        },
        notFound: {
          title: "जॉब नहीं मिली",
          description: "दी गई ID की कोई इम्पोर्ट जॉब नहीं मिली",
        },
        server: {
          title: "सर्वर एरर",
          description: "जॉब रोकते समय एरर हुई",
        },
        unknown: {
          title: "अनजान एरर",
          description: "अप्रत्याशित एरर आई",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सर्वर से कनेक्ट नहीं हो सका",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "रोकने में टकराव",
          description: "जो जॉब अभी प्रोसेस नहीं हो रही उसे रोका नहीं जा सकता",
        },
      },
      success: {
        title: "सफल",
        description: "इम्पोर्ट जॉब सफलतापूर्वक रुकी",
      },
    },
    widget: {
      title: "इम्पोर्ट जॉब रोकें",
      successMessage: "जॉब सफलतापूर्वक रुक गई",
    },
  },
  widget: {
    status: {
      title: "इम्पोर्ट जॉब की स्थिति",
      jobId: "जॉब ID",
      loadingJobStatus: "जॉब की स्थिति लोड हो रही है…",
      totalRows: "कुल पंक्तियाँ",
      processed: "प्रोसेस हुआ",
      imported: "Imported",
      failed: "फ़ेल",
      duplicates: "डुप्लिकेट",
      progress: "प्रगति",
      configurationTitle: "कॉन्फ़िगरेशन",
      batchSize: "बैच साइज़",
      batchStart: "बैच की शुरुआत",
      retries: "रीट्राई",
      timestampsTitle: "टाइमस्टैंप",
      created: "बनाया गया",
      started: "शुरू हुआ",
      completed: "पूरा हुआ",
      jobStatus: {
        enums: {
          csvImportJobStatus: {
            pending: "लंबित",
            processing: "प्रोसेस हो रहा है",
            completed: "पूरा हुआ",
            failed: "फ़ेल",
          },
        },
      },
    },
    retry: {
      title: "इम्पोर्ट जॉब रीट्राई करें",
      loadingRetrying: "जॉब रीट्राई हो रही है…",
      successMessage: "जॉब सफलतापूर्वक रीट्राई हुई",
      failureMessage: "रीट्राई फ़ेल हुई",
      viewJobStatus: "जॉब की स्थिति देखें",
      viewLeads: "लीड देखें",
    },
    stop: {
      title: "इम्पोर्ट जॉब रोकें",
      loadingStopping: "जॉब रोकी जा रही है…",
      successMessage: "जॉब सफलतापूर्वक रुकी",
      failureMessage: "रोकना फ़ेल हुआ",
      viewLeads: "लीड देखें",
      startNewImport: "नया इम्पोर्ट शुरू करें",
    },
  },
};
