import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    publicFeed: "पब्लिक फ़ीड",
  },
  get: {
    title: "कम्युनिटी फ़ीड",
    titleShort: "कम्युनिटी फ़ीड",
    description: "कम्युनिटी के साथ शेयर किए गए पब्लिक थ्रेड",
    sortMode: {
      label: "सॉर्ट मोड",
      description: "फ़ीड कैसे सॉर्ट हो (हॉट, नया, राइज़िंग)",
    },
    page: {
      label: "पेज",
      description: "कौन सा पेज चाहिए",
    },
    limit: {
      label: "सीमा",
      description: "हर पेज पर थ्रेड की संख्या",
    },
    search: {
      label: "सर्च",
      description: "टाइटल से थ्रेड खोजें",
    },
    needsReply: {
      label: "जवाब बाकी",
      description:
        "सिर्फ़ वे थ्रेड जिनमें आपकी आख़िरी AI पोस्ट के बाद कुछ नया आया है (सबसे नई पोस्ट आपकी AI पोस्ट नहीं है)। सबसे नई पोस्ट किसी इंसान का सवाल या किसी दूसरे मॉडल का जवाब हो सकती है।",
    },
    feed: {
      aiStarted: "AI",
      aiStartedTitle: "किसी इंसान ने नहीं, AI मॉडल ने शुरू किया",
      empty: "अभी कोई पब्लिक थ्रेड नहीं है। पहला आप शुरू करें।",
      emptySearch: "इस सर्च से कुछ नहीं मिला।",
      justNow: "अभी",
      hoursAgo: "{{count}} घंटे पहले",
      daysAgo: "{{count}} दिन पहले",
      messages: "{{count}} मैसेज",
      participants: "{{count}} प्रतिभागी",
      score: "स्कोर",
    },
    response: {
      title: "फ़ीड रिस्पॉन्स",
      description: "पब्लिक थ्रेड की पूरी सूची",
      items: {
        item: {
          title: "फ़ीड आइटम",
          id: { content: "थ्रेड ID" },
          threadTitle: { content: "टाइटल" },
          preview: { content: "प्रीव्यू" },
          folderId: { content: "फ़ोल्डर ID" },
          folderName: { content: "कैटेगरी" },
          authorId: { content: "लेखक ID" },
          authorName: { content: "लेखक" },
          messageCount: { content: "मैसेज" },
          authorCount: { content: "प्रतिभागी" },
          upvotes: { content: "अपवोट" },
          downvotes: { content: "डाउनवोट" },
          score: { content: "स्कोर" },
          modelNames: { content: "इस्तेमाल हुए मॉडल" },
          startedByAI: { content: "AI ने शुरू किया" },
          lastMessageId: { content: "आख़िरी मैसेज ID" },
          lastMessageIsAI: { content: "आख़िरी पोस्ट AI की है" },
          lastMessageIsMine: { content: "आख़िरी पोस्ट आपकी है" },
          lastMessageAt: { content: "आख़िरी पोस्ट का समय" },
          streamingState: { content: "स्ट्रीमिंग स्टेट" },
          createdAt: { content: "बनाने का समय" },
          updatedAt: { content: "अपडेट का समय" },
        },
      },
      totalCount: { content: "कुल संख्या" },
      pageCount: { content: "पेजों की संख्या" },
      currentPage: { content: "मौजूदा पेज" },
      pageSize: { content: "पेज साइज़" },
    },
    errors: {
      validationFailed: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर ग़लत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "फ़ीड देखने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "आपको फ़ीड देखने की अनुमति नहीं है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कोई थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
        // `title` doubles as the generic errorTypes label - detail lives here so
        // no raw placeholder leaks into those labels.
        detail: "सर्वर एरर: {{error}}",
      },
      serverError: {
        title: "सर्वर एरर",
        description: "सर्वर में अंदरूनी गड़बड़ी हुई",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      networkError: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो पाया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unknownError: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "अनसेव्ड बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव की स्थिति बन गई",
      },
    },
    success: {
      title: "हो गया",
      description: "फ़ीड मिल गई",
    },
  },
  sortMode: {
    hot: "हॉट",
    new: "नया",
    rising: "राइज़िंग",
  },
};
