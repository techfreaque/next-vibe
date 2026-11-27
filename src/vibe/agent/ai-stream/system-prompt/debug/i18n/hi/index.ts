import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  get: {
    title: "सिस्टम प्रॉम्प्ट डीबग",
    titleShort: "प्रॉम्प्ट डीबग",
    description:
      "किसी दिए संदर्भ (फ़ोल्डर, स्किल, थ्रेड, मैसेज) में AI को मिलने वाला सटीक सिस्टम प्रॉम्प्ट दिखाता है।",
    status: {
      loading: "बन रहा है...",
      done: "हो गया",
    },
    tags: {
      debug: "डीबग",
    },
    fields: {
      rootFolderId: {
        label: "रूट फ़ोल्डर",
        description:
          "सिमुलेट करने के लिए फ़ोल्डर संदर्भ (private, public, incognito, cron, shared, remote)",
        placeholder: "private",
        options: {
          private: "प्राइवेट",
          shared: "शेयर्ड",
          public: "पब्लिक",
          incognito: "इनकॉग्निटो",
          background: "बैकग्राउंड",
          remote: "रिमोट",
        },
      },
      userRole: {
        label: "यूज़र रोल",
        description: "सिमुलेटेड यूज़र रोल: public | customer | admin",
        placeholder: "admin",
      },
      userMessage: {
        label: "यूज़र मैसेज",
        description: "cortex एम्बेडिंग सर्च के लिए सिमुलेटेड यूज़र मैसेज",
        placeholder: "पिछली बार हमने क्या बात की थी?",
      },
      threadId: {
        label: "थ्रेड ID",
        description: "संदर्भ के लिए वैकल्पिक थ्रेड ID",
        placeholder: "uuid या खाली छोड़ें",
      },
      userId: {
        label: "यूज़र ID",
        description:
          "जिस यूज़र का cortex डेटा लोड करना है उसकी वैकल्पिक ID (डिफ़ॉल्ट: खुद)",
        placeholder: "uuid या खाली छोड़ें",
      },
      skillId: {
        label: "स्किल ID",
        description: "सिस्टम प्रॉम्प्ट में डालने के लिए वैकल्पिक स्किल ID",
        placeholder: "स्किल uuid या खाली छोड़ें",
      },
      subFolderId: {
        label: "सब-फ़ोल्डर ID",
        description: "वैकल्पिक सब-फ़ोल्डर UUID",
        placeholder: "uuid या खाली छोड़ें",
      },
      imageGenModelSelection: {
        label: "इमेज जेन चुनाव",
        description:
          "सक्रिय फ़ेवरेट/चैट UI से इमेज जेन मॉडल का चुनाव (यूज़र डिफ़ॉल्ट के लिए खाली छोड़ें)",
        placeholder: "यूज़र डिफ़ॉल्ट के लिए खाली छोड़ें",
      },
      musicGenModelSelection: {
        label: "म्यूज़िक जेन चुनाव",
        description:
          "सक्रिय फ़ेवरेट/चैट UI से म्यूज़िक जेन मॉडल का चुनाव (यूज़र डिफ़ॉल्ट के लिए खाली छोड़ें)",
        placeholder: "यूज़र डिफ़ॉल्ट के लिए खाली छोड़ें",
      },
      videoGenModelSelection: {
        label: "वीडियो जेन चुनाव",
        description:
          "सक्रिय फ़ेवरेट/चैट UI से वीडियो जेन मॉडल का चुनाव (यूज़र डिफ़ॉल्ट के लिए खाली छोड़ें)",
        placeholder: "यूज़र डिफ़ॉल्ट के लिए खाली छोड़ें",
      },
    },
    response: {
      systemPrompt: { text: "सिस्टम प्रॉम्प्ट" },
      trailingSystemMessage: { text: "आख़िरी संदर्भ" },
      charCount: { text: "स्किल" },
      tokenEstimate: { text: "~टोकन" },
      cortexDiagnostics: { text: "Cortex एम्बेडिंग डायग्नोस्टिक्स" },
      messageContextLines: { text: "मैसेज संदर्भ लाइनें" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "अपने पैरामीटर जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच सके" },
      unauthorized: { title: "लॉग इन नहीं है", description: "पहले लॉग इन करें" },
      forbidden: { title: "सिर्फ़ एडमिन", description: "एडमिन एक्सेस ज़रूरी है" },
      notFound: {
        title: "नहीं मिला",
        description: "यूज़र या रिसोर्स नहीं मिला",
      },
      threadNotFound: {
        title: "थ्रेड नहीं मिला या आपको दिखता नहीं",
      },
      server: { title: "सर्वर एरर", description: "प्रॉम्प्ट बन नहीं सका" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हुई" },
      unsavedChanges: {
        title: "बिना सेव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: { title: "टकराव", description: "आपस में टकराती स्थिति" },
    },
    widget: {
      emptyTitle: "संदर्भ चुनें",
      emptyMessage: "फ़ोल्डर चुनें, चाहें तो एक मैसेज भी, फिर प्रॉम्प्ट बनाएँ।",
      chars: "अक्षर",
      tokens: "~टोकन",
      cortexFailed: "Cortex एम्बेडिंग फ़ेल: API key नहीं है या प्रोवाइडर एरर।",
      cortexNoNodes: "एम्बेडिंग बनी, लेकिन अभी किसी cortex नोड की एम्बेडिंग नहीं है।",
      cortexPassing: "{{total}} में से {{passing}} मैच थ्रेशोल्ड पार करते हैं",
      noTrailing: "इस रिक्वेस्ट के लिए कोई आख़िरी संदर्भ नहीं।",
    },
    success: {
      title: "प्रॉम्प्ट बन गया",
      description: "सिस्टम प्रॉम्प्ट सफलतापूर्वक रेंडर हुआ",
    },
  },
};
