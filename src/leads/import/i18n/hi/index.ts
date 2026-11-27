import { regionalCountryNames } from "next-vibe/core/i18n/core/regions";

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    import: "इम्पोर्ट",
    leads: "लीड",
    csv: "CSV",
  },

  category: "डेटा इम्पोर्ट",
  post: {
    title: "लीड इम्पोर्ट करें",
    titleShort: "लीड इम्पोर्ट करें",
    description: "CSV फ़ाइल से लीड्स इम्पोर्ट करें",
    form: {
      title: "इम्पोर्ट कॉन्फ़िगरेशन",
      description: "लीड इम्पोर्ट के पैरामीटर सेट करें",
    },
    file: {
      label: "CSV फ़ाइल",
      description: "CSV फ़ाइल का कंटेंट (base64 एन्कोडेड)",
      placeholder: "base64 एन्कोडेड CSV कंटेंट पेस्ट करें",
      helpText: "लीड डेटा वाली CSV फ़ाइल अपलोड करें",
    },
    fileName: {
      label: "फ़ाइल का नाम",
      description: "CSV फ़ाइल का नाम",
      placeholder: "leads.csv",
      helpText: "समझ आने वाला फ़ाइल नाम दें",
    },
    skipDuplicates: {
      label: "डुप्लिकेट छोड़ें",
      description: "डुप्लिकेट ईमेल पते वाली लीड्स छोड़ें",
      helpText: "मौजूदा ईमेल पते अपने आप छोड़ने के लिए चालू करें",
    },
    updateExisting: {
      label: "मौजूदा अपडेट करें",
      description: "मौजूदा लीड्स को नए डेटा से अपडेट करें",
      helpText: "छोड़ने की जगह मौजूदा लीड्स अपडेट करने के लिए चालू करें",
    },
    defaultCountry: {
      label: "डिफ़ॉल्ट देश",
      description: "जिन लीड्स में देश नहीं है उनके लिए डिफ़ॉल्ट देश",
      helpText: "डिफ़ॉल्ट देश कोड चुनें",
    },
    defaultLanguage: {
      label: "डिफ़ॉल्ट भाषा",
      description: "जिन लीड्स में भाषा नहीं है उनके लिए डिफ़ॉल्ट भाषा",
      helpText: "डिफ़ॉल्ट भाषा कोड चुनें",
    },
    defaultStatus: {
      label: "डिफ़ॉल्ट स्टेटस",
      description: "इम्पोर्ट की गई लीड्स का डिफ़ॉल्ट स्टेटस",
      helpText: "नई लीड्स का शुरुआती स्टेटस चुनें",
    },
    defaultCampaignStage: {
      label: "डिफ़ॉल्ट कैंपेन स्टेज",
      description: "इम्पोर्ट की गई लीड्स का डिफ़ॉल्ट ईमेल कैंपेन स्टेज",
      helpText: "शुरुआती कैंपेन स्टेज चुनें",
    },
    defaultSource: {
      label: "डिफ़ॉल्ट सोर्स",
      description: "इम्पोर्ट की गई लीड्स का डिफ़ॉल्ट सोर्स एट्रिब्यूशन",
      helpText: "ट्रैकिंग के लिए लीड सोर्स चुनें",
    },
    useChunkedProcessing: {
      label: "चंक्ड प्रोसेसिंग इस्तेमाल करें",
      description: "बड़े इम्पोर्ट को बैकग्राउंड चंक्स में प्रोसेस करें",
      helpText: "1000 से ज़्यादा पंक्तियों वाली फ़ाइलों के लिए चालू करें",
    },
    batchSize: {
      label: "बैच साइज़",
      description: "हर बैच में प्रोसेस होने वाली पंक्तियों की संख्या",
      helpText: "सुझाव: हर बैच में 2000 पंक्तियाँ",
    },
    response: {
      batchId: "बैच ID",
      totalRows: "कुल पंक्तियाँ",
      successfulImports: "सफल इम्पोर्ट",
      failedImports: "फ़ेल इम्पोर्ट",
      duplicateEmails: "डुप्लिकेट ईमेल",
      errors: "इम्पोर्ट एरर",
      summary: "इम्पोर्ट सारांश",
      isChunkedProcessing: "चंक्ड प्रोसेसिंग इस्तेमाल हो रही है",
      jobId: "बैकग्राउंड जॉब ID",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "इम्पोर्ट के पैरामीटर या CSV फ़ॉर्मैट गलत है",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लीड्स इम्पोर्ट करने के लिए लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "लीड इम्पोर्ट के लिए एक्सेस की अनुमति नहीं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "CSV फ़ाइल नहीं मिली या गलत है",
      },
      conflict: {
        title: "टकराव",
        description: "इम्पोर्ट के दौरान डेटा कॉन्फ़्लिक्ट",
      },
      server: {
        title: "सर्वर एरर",
        description: "इम्पोर्ट के दौरान इंटरनल सर्वर एरर",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "इम्पोर्ट के दौरान अज्ञात एरर आया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "इम्पोर्ट के दौरान नेटवर्क एरर",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "इम्पोर्ट फ़ॉर्म में बिना सेव किए बदलाव हैं",
      },
    },
    success: {
      title: "इम्पोर्ट शुरू हुआ",
      description: "लीड इम्पोर्ट सफलतापूर्वक शुरू हो गया है",
    },
    widget: {
      headerTitle: "CSV से लीड इंपोर्ट करें",
      exportTemplateButton: "टेम्पलेट एक्सपोर्ट करें",
      importGuideTitle: "इंपोर्ट गाइड",
      importGuideSubtitle: "इन कॉलम वाली CSV फ़ाइल अपलोड करें:",
      importGuideNote:
        "सिर्फ़ {{email}} ज़रूरी है। बाकी सारे कॉलम वैकल्पिक हैं और नीचे सेट किए डिफ़ॉल्ट से भर जाएँगे।",
      fileRequirementsTitle: "फ़ाइल की ज़रूरतें",
      fileRequirementFormat: "फ़ॉर्मैट: CSV (कॉमा से अलग वैल्यू, UTF-8 एन्कोडेड)",
      fileRequirementHeader: "पहली पंक्ति कॉलम नामों वाली हेडर पंक्ति होनी चाहिए",
      fileRequirementSize: "हर अपलोड का अधिकतम सुझाया साइज़: 50 MB",
      fileRequirementChunked:
        "लगभग 5 000 पंक्तियों से बड़ी फ़ाइलों में टाइमआउट से बचने के लिए {{chunkedProcessing}} चालू करें",
      chunkedProcessingLabel: "चंक्ड प्रोसेसिंग",
      downloadTemplateLink: "CSV टेम्पलेट डाउनलोड करें",
      loadingText: "लीड्स इम्पोर्ट हो रही हैं…",
      backgroundProcessingTitle: "बैकग्राउंड प्रोसेसिंग",
      backgroundProcessingNote:
        "बड़ा इम्पोर्ट जॉब के रूप में कतार में है: {{jobId}}। {{totalRows}} पंक्तियाँ बैकग्राउंड में प्रोसेस हो रही हैं।",
      checkJobStatusButton: "जॉब का स्टेटस जाँचें",
      stopJobButton: "जॉब रोकें",
      retryFailedButton: "रीट्राई फ़ेल हुई",
      statTotalRows: "कुल पंक्तियाँ",
      statImported: "इंपोर्ट हुआ",
      statDuplicates: "डुप्लिकेट",
      statFailed: "फ़ेल",
      viewImportedLeadsButton: "इम्पोर्ट की गई लीड्स देखें",
      retryFailedWithCountButton: "फ़ेल हुई दोबारा करें ({{count}})",
      summaryTitle: "सारांश",
      summaryNewLeads: "नई लीड्स",
      summaryUpdated: "अपडेट किया गया",
      summarySkipped: "छोड़ा गया",
      successRateLabel: "सफलता दर",
      importErrorsTitle: "{{count}} इंपोर्ट एरर",
      errorRowLabel: "पंक्ति {{row}}",
      findLeadButton: "लीड खोजें",
    },
  },
  process: {
    tag: "इम्पोर्ट प्रोसेस",
    post: {
      title: "इम्पोर्ट जॉब प्रोसेस करें",
      titleShort: "इम्पोर्ट प्रोसेस करें",
      description: "लंबित CSV इम्पोर्ट जॉब प्रोसेस करें",
      container: {
        title: "इम्पोर्ट प्रोसेस कॉन्फ़िगरेशन",
        description: "इम्पोर्ट प्रोसेस के पैरामीटर सेट करें",
      },
      fields: {
        maxJobsPerRun: {
          label: "हर रन में अधिकतम जॉब",
          description: "हर रन में प्रोसेस होने वाले जॉब की अधिकतम संख्या",
        },
        maxRetriesPerJob: {
          label: "हर जॉब के अधिकतम रीट्राई",
          description: "हर जॉब के रीट्राई की अधिकतम संख्या",
        },
        dryRun: {
          label: "ड्राई रन",
          description: "बदलाव किए बिना चलाएँ",
        },
        selfTaskId: {
          label: "सेल्फ़ टास्क ID",
          description: "प्रोसेसिंग के बाद सेल्फ़-क्लीनअप के लिए इंटरनल टास्क ID",
        },
      },
      response: {
        jobsProcessed: "प्रोसेस हुए जॉब",
        totalRowsProcessed: "प्रोसेस हुई कुल पंक्तियाँ",
        successfulImports: "सफल इम्पोर्ट",
        failedImports: "फ़ेल इम्पोर्ट",
      },
      errors: {
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "एक्सेस मना है",
        },
        server: {
          title: "सर्वर एरर",
          description: "इम्पोर्ट प्रोसेस करते समय एरर आया",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर आया",
        },
        validation: {
          title: "वैलिडेशन एरर",
          description: "रिक्वेस्ट के पैरामीटर गलत हैं",
        },
      },
      success: {
        title: "इम्पोर्ट प्रोसेसिंग पूरी हुई",
        description: "इम्पोर्ट जॉब सफलतापूर्वक प्रोसेस हुए",
      },
    },
  },
  widget: {
    header: {
      title: "इम्पोर्ट जॉब",
      newImport: "नया इम्पोर्ट",
    },
    filter: {
      all: "सभी",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
      pending: "पेंडिंग",
      running: "चल रहा है",
    },
    loading: "इम्पोर्ट जॉब लोड हो रहे हैं…",
    empty: {
      title: "कोई इम्पोर्ट जॉब नहीं मिला",
      withFilter: "कोई दूसरा फ़िल्टर आज़माएँ या नया इम्पोर्ट शुरू करें।",
      withoutFilter: "अपना पहला इम्पोर्ट शुरू करें, वह यहाँ दिखेगा।",
      newImport: "नया इम्पोर्ट",
    },
  },
  jobs: {
    jobId: {
      category: "डेटा इम्पोर्ट",
      tags: {
        leads: "लीड",
        management: "मैनेजमेंट",
      },

      get: {
        title: "इम्पोर्ट जॉब लाएँ",
        description: "किसी ख़ास इम्पोर्ट जॉब का ब्योरा लाएँ",
        actions: {
          retry: "दोबारा कोशिश करें",
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
            content: "एरर मैसेज",
          },
          timestamps: {
            title: "जॉब टाइमस्टैंप",
            description: "जॉब जीवनचक्र के टाइमस्टैंप",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
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
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
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
            content: "एरर मैसेज",
          },
          timestamps: {
            title: "जॉब टाइमस्टैंप",
            description: "जॉब जीवनचक्र के टाइमस्टैंप",
          },
          createdAt: {
            content: "बनाने का समय",
          },
          updatedAt: {
            content: "अपडेट का समय",
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
            description: "दिया गया डेटा सही नहीं है",
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
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
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
            content: "सफलता स्टेटस",
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
            title: "अज्ञात एरर",
            description: "कोई अनपेक्षित एरर आया",
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
              content: "सफलता स्टेटस",
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
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
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
              description:
                "जो जॉब अभी प्रोसेस हो रही है उसे रीट्राई नहीं किया जा सकता",
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
              content: "सफलता स्टेटस",
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
              title: "अज्ञात एरर",
              description: "कोई अनपेक्षित एरर आया",
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
          loadingJobStatus: "जॉब की स्थिति लोड हो रही है…",
          totalRows: "कुल पंक्तियाँ",
          processed: "प्रोसेस हुआ",
          imported: "इंपोर्ट हुआ",
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
                pending: "पेंडिंग",
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
    },
  },
  status: {
    category: "डेटा इम्पोर्ट",
    tags: {
      import: "इम्पोर्ट",
      jobs: "जॉब्स",
      list: "सूची",
    },

    get: {
      title: "इम्पोर्ट जॉब का स्टेटस",
      titleShort: "इम्पोर्ट जॉब",
      description: "CSV इम्पोर्ट जॉब देखें और मॉनिटर करें",
      actions: {
        refresh: "रीफ़्रेश करें",
        refreshing: "रिफ़्रेश हो रहा है...",
      },
      form: {
        title: "जॉब फ़िल्टर",
        description: "स्टेटस और पेजिनेशन से इम्पोर्ट जॉब फ़िल्टर करें",
      },
      filters: {
        title: "फ़िल्टर",
        description: "इम्पोर्ट जॉब के फ़िल्टर विकल्प",
      },
      status: {
        label: "जॉब की स्थिति",
        description: "जॉब स्टेटस से फ़िल्टर करें",
        placeholder: "स्टेटस चुनें",
      },
      limit: {
        label: "प्रति पेज नतीजे",
        description: "लौटाए जाने वाले जॉब की संख्या",
        placeholder: "50",
      },
      offset: {
        label: "पेज ऑफ़सेट",
        description: "छोड़े जाने वाले जॉब की संख्या",
        placeholder: "0",
      },
      response: {
        title: "इम्पोर्ट जॉब",
        description: "इम्पोर्ट जॉब की लिस्ट और उनका मौजूदा स्टेटस",
        statusCounts: "स्टेटस की गिनती",
        items: {
          title: "जॉब लिस्ट",
        },
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "फ़िल्टर पैरामीटर गलत हैं",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "इम्पोर्ट जॉब देखने के लिए लॉगिन ज़रूरी है",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "इम्पोर्ट जॉब के लिए एक्सेस की अनुमति नहीं",
        },
        notFound: {
          title: "नहीं मिला",
          description: "कोई इम्पोर्ट जॉब नहीं मिला",
        },
        server: {
          title: "सर्वर एरर",
          description: "जॉब लाते समय इंटरनल सर्वर एरर",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अज्ञात एरर आया",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "जॉब लाते समय नेटवर्क एरर",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "डेटा टकराव हुआ",
        },
      },
      success: {
        title: "जॉब मिल गए",
        description: "इम्पोर्ट जॉब की लिस्ट मिल गई",
      },
    },
    widget: {
      status: {
        pending: "पेंडिंग",
        running: "चल रहा है",
        completed: "पूरा हुआ",
        failed: "फ़ेल",
        stopped: "रुके हुए",
      },
      filter: {
        all: "सभी",
        pending: "पेंडिंग",
        running: "चल रहा है",
        completed: "पूरा हुआ",
        failed: "फ़ेल",
      },
      progress: {
        rows: "पंक्तियाँ",
      },
      job: {
        total: "कुल:",
        processed: "प्रोसेस हुईं:",
        ok: "ठीक:",
        fail: "फ़ेल:",
        created: "बनाया गया:",
        done: "पूरी:",
      },
      header: {
        title: "इम्पोर्ट जॉब",
        newImport: "नया इम्पोर्ट",
      },
      loading: "इम्पोर्ट जॉब लोड हो रहे हैं…",
      empty: {
        title: "कोई इम्पोर्ट जॉब नहीं मिला",
        withFilter: "कोई दूसरा फ़िल्टर आज़माएँ या नया इम्पोर्ट शुरू करें।",
        withoutFilter: "अपना पहला इम्पोर्ट शुरू करें, वह यहाँ दिखेगा।",
        newImport: "नया इम्पोर्ट",
      },
    },
  },
  csv: {
    post: {
      title: "CSV डेटा इम्पोर्ट करें",
      description: "स्मार्ट प्रोसेसिंग और वैलिडेशन के साथ CSV फ़ाइलों से डेटा इम्पोर्ट करें",
      form: {
        title: "CSV इम्पोर्ट कॉन्फ़िगरेशन",
        description: "बेहतर नतीजों के लिए अपनी CSV इम्पोर्ट सेटिंग्स सेट करें",
      },
      fileSection: {
        title: "फ़ाइल अपलोड",
        description: "अपनी CSV फ़ाइल चुनें और टारगेट डोमेन बताएँ",
      },
      file: {
        label: "CSV फ़ाइल",
        description: "अपलोड के लिए CSV फ़ाइल चुनें (अधिकतम 10MB)",
        placeholder: "CSV फ़ाइल चुनें...",
        helpText:
          "सपोर्टेड फ़ॉर्मैट: कॉमा से अलग वैल्यू वाली CSV। पहली पंक्ति में कॉलम हेडर होने चाहिए।",
      },
      fileName: {
        label: "फ़ाइल का नाम",
        description: "इस इम्पोर्ट का नाम (आपके रेफ़रेंस के लिए)",
        placeholder: "जैसे जनवरी 2024 लीड्स इम्पोर्ट",
      },
      domain: {
        label: "इम्पोर्ट डोमेन",
        description: "आप किस तरह का डेटा इम्पोर्ट कर रहे हैं?",
        placeholder: "डेटा का प्रकार चुनें...",
      },
      processingSection: {
        title: "प्रोसेसिंग विकल्प",
        description: "तय करें कि आपका डेटा कैसे प्रोसेस हो",
      },
      skipDuplicates: {
        label: "डुप्लिकेट छोड़ें",
        description: "डुप्लिकेट ईमेल पते वाले रिकॉर्ड छोड़ें",
        helpText: "सुझाव: एक ही संपर्क दो बार इम्पोर्ट होने से बचाता है",
      },
      updateExisting: {
        label: "मौजूदा अपडेट करें",
        description: "CSV के नए डेटा से मौजूदा रिकॉर्ड अपडेट करें",
        helpText: "निशान न लगाने पर मौजूदा रिकॉर्ड जैसे हैं वैसे रहेंगे",
      },
      useChunkedProcessing: {
        label: "बैकग्राउंड प्रोसेसिंग",
        description: "बड़ी फ़ाइलें बैकग्राउंड में प्रोसेस करें",
        helpText: "500 से ज़्यादा रिकॉर्ड वाली फ़ाइलों के लिए सुझाव",
      },
      batchSize: {
        label: "बैच साइज़",
        description: "एक बार में प्रोसेस होने वाले रिकॉर्ड की संख्या",
        placeholder: "100",
        helpText: "छोटे बैच ज़्यादा स्थिर हैं, बड़े बैच तेज़ हैं",
      },
      defaultsSection: {
        title: "डिफ़ॉल्ट वैल्यू (वैकल्पिक)",
        description: "जिन रिकॉर्ड में यह जानकारी नहीं है उनके लिए डिफ़ॉल्ट वैल्यू सेट करें",
      },
      defaultCountry: {
        label: "डिफ़ॉल्ट देश",
        description: "बिना लोकेशन वाले रिकॉर्ड का देश",
        placeholder: "देश चुनें...",
      },
      defaultLanguage: {
        label: "डिफ़ॉल्ट भाषा",
        description: "बिना भाषा पसंद वाले रिकॉर्ड की भाषा",
        placeholder: "भाषा चुनें...",
      },
      response: {
        title: "इम्पोर्ट के नतीजे",
        description: "आपके CSV इम्पोर्ट का सारांश",
        basicResults: {
          title: "बुनियादी नतीजे",
          description: "इम्पोर्ट के मुख्य आँकड़े",
        },
        batchId: {
          label: "बैच ID",
        },
        totalRows: {
          label: "कुल पंक्तियाँ",
        },
        isChunkedProcessing: {
          label: "बैकग्राउंड प्रोसेसिंग",
        },
        jobId: {
          label: "जॉब ID",
        },
        statistics: {
          title: "इम्पोर्ट आँकड़े",
          description: "इम्पोर्ट ऑपरेशन का विस्तृत ब्योरा",
        },
        successfulImports: {
          label: "सफल इम्पोर्ट",
        },
        failedImports: {
          label: "फ़ेल इम्पोर्ट",
        },
        duplicateEmails: {
          label: "डुप्लिकेट ईमेल",
        },
        processingTimeMs: {
          label: "प्रोसेसिंग टाइम (ms)",
        },
        summary: {
          title: "इम्पोर्ट सारांश",
          description: "इम्पोर्ट नतीजों का सार",
        },
        newRecords: {
          label: "नए रिकॉर्ड",
        },
        updatedRecords: {
          label: "अपडेट हुए रिकॉर्ड",
        },
        skippedDuplicates: {
          label: "छोड़े गए डुप्लिकेट",
        },
        errors: {
          title: "एरर का ब्योरा",
          row: {
            label: "पंक्ति",
          },
          email: {
            label: "ईमेल",
          },
          error: {
            label: "एरर",
          },
        },
        nextSteps: {
          title: "अगले कदम",
          item: {
            label: "अगला कदम",
          },
        },
      },
      errors: {
        validation: {
          title: "इम्पोर्ट डेटा गलत है",
          description: "अपनी CSV फ़ाइल और सेटिंग्स जाँचें",
          emptyFile: "CSV फ़ाइल का कंटेंट ज़रूरी है",
          emptyFileName: "इस इम्पोर्ट का नाम दें",
          invalidDomain: "सही इम्पोर्ट डोमेन चुनें",
          invalidBatchSize: "बैच साइज़ 10 से 1000 के बीच होना चाहिए",
          fileTooLarge:
            "फ़ाइल साइज़ 10MB की सीमा से ज़्यादा है। बैकग्राउंड प्रोसेसिंग इस्तेमाल करें।",
        },
        unauthorized: {
          title: "एक्सेस नहीं मिला",
          description: "आपको डेटा इम्पोर्ट करने की अनुमति नहीं है",
        },
        fileTooLarge: {
          title: "फ़ाइल बहुत बड़ी है",
          description: "चुनी फ़ाइल 10MB की अधिकतम सीमा से बड़ी है",
        },
        server: {
          title: "इम्पोर्ट फ़ेल हुआ",
          description: "आपका इम्पोर्ट प्रोसेस करते समय एरर आया। दोबारा कोशिश करें।",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "इम्पोर्ट के दौरान नेटवर्क कनेक्शन फ़ेल हुआ",
        },
        forbidden: {
          title: "अनुमति नहीं",
          description: "आपको यह इम्पोर्ट करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "इम्पोर्ट रिसोर्स नहीं मिला",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर आया",
        },
        unsavedChanges: {
          title: "बिना सेव किए बदलाव",
          description: "आपके बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "डेटा टकराव",
          description: "मौजूदा डेटा से टकराव हुआ",
        },
      },
      success: {
        title: "इम्पोर्ट सफल",
        description: "आपका CSV डेटा इम्पोर्ट हो गया",
      },
    },
  },
  enum: {
    status: {
      pending: {
        label: "पेंडिंग",
        description: "जॉब प्रोसेस होने का इंतज़ार कर रहा है",
      },
      processing: {
        label: "प्रोसेस हो रहा है",
        description: "जॉब अभी प्रोसेस हो रहा है",
      },
      completed: {
        label: "पूरा हुआ",
        description: "जॉब सफलतापूर्वक पूरा हुआ",
      },
      failed: {
        label: "फ़ेल",
        description: "जॉब में एरर आया",
      },
      cancelled: {
        label: "रद्द",
        description: "जॉब यूज़र ने रद्द किया",
      },
      paused: {
        label: "रुका हुआ",
        description: "जॉब की प्रोसेसिंग कुछ समय के लिए रुकी है",
      },
    },
    domain: {
      leads: {
        label: "लीड",
        description: "संभावित ग्राहक और बिज़नेस संपर्क",
      },
      contacts: {
        label: "संपर्क",
        description: "सामान्य संपर्क जानकारी और पता-पुस्तिका",
      },
      businessData: {
        label: "बिज़नेस डेटा",
        description: "कंपनी की जानकारी और बिज़नेस प्रोफ़ाइल",
      },
      emails: {
        label: "ईमेल लिस्ट",
        description: "ईमेल मार्केटिंग लिस्ट और कैंपेन",
      },
      users: {
        label: "यूज़र्स",
        description: "सिस्टम यूज़र और अकाउंट की जानकारी",
      },
      templates: {
        label: "टेम्पलेट",
        description: "ईमेल टेम्पलेट और कंटेंट",
      },
    },
    format: {
      csv: {
        label: "CSV फ़ाइल",
        description: "कॉमा से अलग वैल्यू (सबसे आम)",
      },
      xlsx: {
        label: "Excel फ़ाइल",
        description: "Microsoft Excel स्प्रेडशीट",
      },
      json: {
        label: "JSON फ़ाइल",
        description: "JavaScript Object Notation डेटा",
      },
      tsv: {
        label: "TSV फ़ाइल",
        description: "टैब से अलग वैल्यू",
      },
    },
    processing: {
      immediate: {
        label: "अभी प्रोसेस करें",
        description: "फ़ाइल तुरंत प्रोसेस करें (सबसे तेज़)",
      },
      background: {
        label: "बैकग्राउंड",
        description: "बैकग्राउंड में प्रोसेस करें (बड़ी फ़ाइलों के लिए)",
      },
      scheduled: {
        label: "बाद के लिए शेड्यूल करें",
        description: "प्रोसेसिंग को किसी ख़ास समय पर शेड्यूल करें",
      },
    },
    errorType: {
      validation: {
        label: "वैलिडेशन एरर",
        description: "डेटा तय फ़ॉर्मैट या नियमों पर खरा नहीं उतरता",
      },
      duplicate: {
        label: "डुप्लिकेट डेटा",
        description: "रिकॉर्ड सिस्टम में पहले से है",
      },
      format: {
        label: "फ़ॉर्मैट एरर",
        description: "फ़ाइल का फ़ॉर्मैट गलत या ख़राब है",
      },
      processing: {
        label: "प्रोसेसिंग एरर",
        description: "डेटा प्रोसेसिंग के दौरान एरर आया",
      },
      system: {
        label: "सिस्टम एरर",
        description: "इंटरनल सिस्टम एरर",
      },
    },
    batchSize: {
      small: {
        label: "छोटा (50)",
        description: "टेस्टिंग या छोटे इम्पोर्ट के लिए सबसे अच्छा",
      },
      medium: {
        label: "मध्यम (100)",
        description: "ज़्यादातर इम्पोर्ट के लिए सुझाया गया",
      },
      large: {
        label: "बड़ा (250)",
        description: "सरल डेटा वाली बड़ी फ़ाइलों के लिए अच्छा",
      },
      xlarge: {
        label: "अतिरिक्त बड़ा (500)",
        description: "बहुत बड़ी फ़ाइलों के लिए (एडवांस्ड यूज़र)",
      },
    },
  },
  nextSteps: {
    reviewErrors: "गड़बड़ी समझने के लिए एरर की जानकारी देखें",
    checkDuplicates: "डुप्लिकेट हैंडलिंग की सेटिंग्स बदलने पर विचार करें",
    reviewLeads: "इम्पोर्ट की गई लीड्स को लीड्स मैनेजमेंट सेक्शन में देखें",
    startCampaign: "अपनी नई लीड्स के साथ ईमेल कैंपेन शुरू करने पर विचार करें",
    reviewContacts: "इम्पोर्ट किए संपर्कों को कॉन्टैक्ट्स सेक्शन में देखें",
    organizeContacts: "अपने संपर्कों को ग्रुप या टैग में व्यवस्थित करें",
    reviewImported: "इम्पोर्ट किया डेटा संबंधित सेक्शन में देखें",
    monitorProgress: "जॉब हिस्ट्री में प्रगति देखते रहें",
    checkJobsList: "विस्तृत स्टेटस अपडेट के लिए जॉब लिस्ट देखें",
  },
  errors: {
    cancel: {
      server: "इम्पोर्ट जॉब रद्द नहीं हो पाया",
    },
    retry: {
      server: "इम्पोर्ट जॉब दोबारा नहीं चल पाया",
    },
    delete: {
      server: "इम्पोर्ट जॉब डिलीट नहीं हो पाया",
    },
    status: {
      server: "जॉब का स्टेटस नहीं मिल पाया",
    },
  },
  error: {
    default: "एरर आया",
  },
  enums: {
    csvImportJobStatus: {
      pending: "पेंडिंग",
      processing: "प्रोसेस हो रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
    },
    csvImportJobAction: {
      retry: "दोबारा कोशिश करें",
      delete: "हटाएँ",
      stop: "रोकें",
    },
    importMode: {
      createOnly: "सिर्फ़ बनाएँ",
      updateOnly: "सिर्फ़ अपडेट करें",
      createOrUpdate: "बनाएँ या अपडेट करें",
      skipDuplicates: "डुप्लिकेट छोड़ें",
    },
    importFormat: {
      csv: "CSV",
      tsv: "TSV",
      json: "JSON",
    },
    importProcessingType: {
      immediate: "तुरंत",
      chunked: "चंक्ड",
      scheduled: "शेड्यूल्ड",
    },
    importErrorType: {
      validationError: "वैलिडेशन एरर",
      duplicateEmail: "डुप्लिकेट ईमेल",
      invalidFormat: "गलत फ़ॉर्मैट",
      missingRequiredField: "ज़रूरी फ़ील्ड गायब",
      processingError: "प्रोसेसिंग एरर",
      systemError: "सिस्टम एरर",
    },
    batchProcessingStatus: {
      pending: "पेंडिंग",
      processing: "प्रोसेस हो रहा है",
      completed: "पूरा हुआ",
      failed: "फ़ेल",
      retrying: "रीट्राई हो रहा है",
    },
    importPriority: {
      low: "लो",
      normal: "सामान्य",
      high: "हाई",
      urgent: "तुरंत",
    },
    importSource: {
      webUpload: "वेब अपलोड",
      apiUpload: "API अपलोड",
      scheduledImport: "शेड्यूल्ड इम्पोर्ट",
      bulkOperation: "बल्क ऑपरेशन",
    },
    csvDelimiter: {
      comma: "कॉमा",
      semicolon: "सेमीकोलन",
      tab: "टैब",
      pipe: "पाइप",
    },
    importValidationLevel: {
      strict: "सख़्त",
      moderate: "मॉडरेट करें",
      lenient: "नरम",
    },
    importNotificationType: {
      email: "ईमेल",
      inApp: "इन-ऐप",
      webhook: "वेबहुक",
      none: "कोई नहीं",
    },
    leadStatus: {
      new: "नया",
      pending: "पेंडिंग",
      campaignRunning: "कैंपेन चल रहा है",
      websiteUser: "वेबसाइट यूज़र",
      newsletterSubscriber: "न्यूज़लेटर सब्सक्राइबर",
      inContact: "संपर्क में",
      signedUp: "साइन अप किया",
      subscriptionConfirmed: "सब्सक्रिप्शन पक्का",
      unsubscribed: "अनसब्सक्राइब हुए",
      bounced: "बाउंस हुए",
      invalid: "अमान्य",
    },
    emailCampaignStage: {
      notStarted: "शुरू नहीं हुआ",
      initial: "पहला संपर्क",
      followup1: "फ़ॉलो-अप 1",
      followup2: "फ़ॉलो-अप 2",
      followup3: "फ़ॉलो-अप 3",
      nurture: "नर्चर",
      reactivation: "रीएक्टिवेशन",
    },
    leadSource: {
      website: "वेबसाइट",
      socialMedia: "सोशल मीडिया",
      emailCampaign: "ईमेल कैंपेन",
      referral: "रेफ़रल",
      csvImport: "CSV इम्पोर्ट",
    },
  },
  countries: {
    ...regionalCountryNames("hi"),
    global: "ग्लोबल",
    de: "जर्मनी",
    pl: "पोलैंड",
    fr: "फ़्रांस",
    us: "संयुक्त राज्य अमेरिका",
  },
  languages: {
    it: "इतालवी",
    es: "स्पेनिश",
    sk: "स्लोवाक",
    hi: "हिंदी",
    en: "अंग्रेज़ी",
    de: "जर्मन",
    pl: "पोलिश",
    fr: "फ़्रेंच",
  },
};
