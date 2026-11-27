import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    studio: "मीडिया स्टूडियो",
    history: "हिस्ट्री",
  },
  get: {
    title: "आपके बनाए नतीजे",
    titleShort: "जनरेशन",
    description:
      "स्टूडियो में, चैट में या API से आपके बनाए इमेज, वीडियो, म्यूज़िक, स्पीच और ट्रांसक्रिप्ट। सबसे नए पहले।",
    fields: {
      kind: {
        label: "टाइप",
        description:
          "image, video, music, speech या transcribe। सब कुछ देखने के लिए खाली छोड़ें।",
      },
      cursor: {
        label: "पेज कर्सर",
        description:
          "सबसे नए नतीजों के लिए खाली छोड़ें। आगे बढ़ने के लिए पिछले पेज का nextCursor दें।",
      },
    },
    response: {
      items: "जनरेशन",
      id: "ID",
      kind: "टाइप",
      title: "प्रॉम्प्ट",
      createdAt: "बनाया गया",
      status: "स्टेटस",
      url: "फ़ाइल",
      transcript: "ट्रांसक्रिप्ट",
      credits: "क्रेडिट",
      model: "मॉडल",
      settings: "सेटिंग्स",
      source: "कहाँ बना",
      threadId: "थ्रेड",
      rootFolderId: "फ़ोल्डर",
      nextCursor: "अगले पेज का कर्सर",
    },
    success: {
      title: "हिस्ट्री लोड हुई",
      description: "आपके बनाए नतीजों की सूची तैयार है।",
    },
    errors: {
      validation: {
        title: "फ़िल्टर गलत है",
        description: "टाइप और पेज जाँचें, फिर दोबारा कोशिश करें।",
      },
      unauthorized: {
        title: "साइन इन नहीं है",
        description: "अपने बनाए नतीजे देखने के लिए साइन इन करें।",
      },
      forbidden: {
        title: "एक्सेस नहीं",
        description: "आप सिर्फ़ अपने बनाए नतीजे देख सकते हैं।",
      },
      notFound: {
        title: "यहाँ कुछ नहीं",
        description: "इस फ़िल्टर से कोई नतीजा नहीं मिला।",
      },
      server: {
        title: "हिस्ट्री उपलब्ध नहीं",
        description: "आपकी हिस्ट्री लोड नहीं हो सकी। थोड़ी देर में दोबारा कोशिश करें।",
      },
      network: {
        title: "कनेक्शन टूट गया",
        description: "अपना कनेक्शन जाँचें और दोबारा कोशिश करें।",
      },
      unknown: {
        title: "कुछ गड़बड़ हुई",
        description: "आपकी हिस्ट्री लोड नहीं हो सकी। दोबारा कोशिश करें।",
      },
      conflict: {
        title: "हिस्ट्री बदल गई",
        description: "ताज़ा नतीजे देखने के लिए रीलोड करें।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले अपने बदलाव सेव करें या छोड़ दें।",
      },
    },
  },
  widget: {
    title: "आपके बनाए नतीजे",
    titles: {
      image: "आपकी इमेज",
      video: "आपके वीडियो",
      music: "आपके ट्रैक",
      speech: "आपके वॉइसओवर",
      transcribe: "आपके ट्रांसक्रिप्ट",
    },
    count: "कुल {{count}}",
    error: "आपकी हिस्ट्री लोड नहीं हुई।",
    retry: "दोबारा कोशिश करें",
    loadMore: "और लोड करें",
    loadingMore: "लोड हो रहा है",
    loadMoreFailed: "और नतीजे लोड नहीं हुए।",
    endOfList: "बस इतना ही है।",
    emptyTitle: "अभी कुछ नहीं बना",
    emptyHint: "आप जो भी बनाते हैं वह यहाँ आता है, डाउनलोड के लिए तैयार।",
    emptyKindHint: "आपका पहला नतीजा पूरा होते ही यहाँ दिखेगा।",
    runAgain: "दोबारा चलाएँ",
    download: "डाउनलोड करें",
    copyPrompt: "प्रॉम्प्ट कॉपी करें",
    copied: "कॉपी हुआ",
    copyFailed: "कॉपी रुक गई",
    openInChat: "चैट में खोलें",
    continueInChat: "चैट में जारी रखें",
    chatPrompt: "मैंने यह बनाया है: {{url}}\n\nप्रॉम्प्ट: {{prompt}}",
    open: "पूरे साइज़ में खोलें",
    credits: "{{amount}} क्रेडिट",
    source: {
      studio: "स्टूडियो से",
      chat: "चैट से",
      api: "API से",
    },
    status: {
      queued: "कतार में",
      running: "बन रहा है",
      saving: "फ़ाइल सेव हो रही है",
      completed: "हो गया",
      failed: "फ़ेल",
    },
    pendingHint: "वीडियो और म्यूज़िक में कुछ मिनट लग सकते हैं।",
    kinds: {
      image: "इमेज",
      video: "वीडियो",
      music: "म्यूज़िक",
      speech: "स्पीच",
      transcribe: "ट्रांसक्रिप्ट",
    },
  },
};
