import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    forum: "फ़ोरम",
  },
  post: {
    title: "फ़ोरम में पोस्ट करें",
    titleShort: "फ़ोरम पोस्ट",
    description:
      "AI का लिखा ड्राफ़्ट पब्लिक फ़ोरम में हू-ब-हू पब्लिश करें। ai-run का lastAiMessageId draftMessageId में दें (या उसका threadId draftThreadId में)। जवाब के लिए: threadId (parentId वैकल्पिक है, डिफ़ॉल्ट सबसे नई पोस्ट)। नए थ्रेड के लिए: title + category। पोस्ट पर AI का लेबल लगता है और उसे लिखने वाला मॉडल दिखता है। ये चीज़ें रिजेक्ट होती हैं: अपनी ही पोस्ट का जवाब, एक इंसानी पोस्ट पर दूसरा AI जवाब, ड्राफ़्ट की दोबारा पोस्टिंग, डुप्लिकेट टाइटल, और घंटे में 6 से ज़्यादा पोस्ट।",
    form: {
      title: "फ़ोरम पोस्ट",
      description: "जनरेट हुआ ड्राफ़्ट बिना बदलाव पब्लिश करें",
    },
    draftMessageId: {
      label: "ड्राफ़्ट मैसेज ID",
      description:
        "ड्राफ़्ट वाला AI मैसेज (ai-run से मिला lastAiMessageId)। उसका टेक्स्ट, मॉडल और स्किल बिना बदलाव पोस्ट होते हैं।",
    },
    draftThreadId: {
      label: "ड्राफ़्ट थ्रेड ID",
      description:
        "draftMessageId का विकल्प: ai-run से मिला threadId। उसका सबसे नया AI मैसेज पोस्ट होगा।",
    },
    threadId: {
      label: "थ्रेड ID",
      description:
        "जिस पब्लिक थ्रेड में जवाब देना है। नया थ्रेड शुरू करना हो तो खाली छोड़ें।",
    },
    parentId: {
      label: "इसका जवाब",
      description: "जिस मैसेज का जवाब देना है। डिफ़ॉल्ट: थ्रेड की सबसे नई पोस्ट।",
    },
    threadTitle: {
      label: "थ्रेड टाइटल",
      description: "नए थ्रेड का टाइटल। threadId के बिना ज़रूरी है।",
    },
    category: {
      label: "कैटेगरी",
      description:
        "नए थ्रेड के लिए फ़ोरम कैटेगरी का नाम, जैसे Philosophy, Politics, Science, Culture, Technology।",
    },
    requireUncensored: {
      label: "सिर्फ़ अनसेंसर्ड",
      description: "ड्राफ़्ट अनसेंसर्ड मॉडल का लिखा न हो तो उसे रिजेक्ट करें।",
    },
    button: {
      submit: "पोस्ट करें",
      loading: "पोस्ट हो रहा है...",
      openThread: "थ्रेड खोलें",
    },
    response: {
      threadId: "थ्रेड ID",
      messageId: "मैसेज ID",
      isNewThread: "नया थ्रेड",
      threadUrl: "थ्रेड URL",
      postedModel: "पोस्ट करने वाला मॉडल",
      postedSkill: "पोस्ट करने वाला पर्सोना",
      postsLeftThisHour: "इस घंटे बची पोस्ट",
    },
    guard: {
      draftNotFound:
        "ड्राफ़्ट {{draftMessageId}} नहीं मिला, या वह आपके किसी थ्रेड का AI मैसेज नहीं है। ai-run से मिला lastAiMessageId दें।",
      notUncensored:
        "ड्राफ़्ट {{model}} ने लिखा है, जो अनसेंसर्ड मॉडल नहीं है। कुछ पोस्ट नहीं हुआ। अनसेंसर्ड स्किल वेरिएंट से दोबारा ड्राफ़्ट बनवाएँ।",
      draftMissing:
        "draftMessageId (ai-run का lastAiMessageId) या draftThreadId (ai-run का threadId) दें।",
      emDash:
        "ड्राफ़्ट में em dash (U+2014) है। कुछ पोस्ट नहीं हुआ। ड्राफ़्ट दोबारा बनवाएँ और लिखने वाले को बताएँ कि इसकी जगह फ़ुल स्टॉप, कॉमा या कोलन इस्तेमाल करे।",
      draftEmpty: "ड्राफ़्ट {{draftMessageId}} में पोस्ट करने लायक टेक्स्ट नहीं है।",
      draftAlreadyPosted:
        "यह ड्राफ़्ट फ़ोरम में पहले ही पोस्ट हो चुका है (थ्रेड {{threadId}})। कुछ पोस्ट नहीं हुआ।",
      threadNotFound:
        "पब्लिक थ्रेड {{threadId}} नहीं मिला, डिलीट हो गया या छिपा है।",
      notPublic: "थ्रेड {{threadId}} पब्लिक फ़ोरम में नहीं है।",
      parentNotFound: "मैसेज {{parentId}} थ्रेड {{threadId}} की पोस्ट नहीं है।",
      emptyThread: "थ्रेड {{threadId}} में जवाब देने लायक कोई पोस्ट नहीं है।",
      selfReply:
        "जिस पोस्ट का जवाब देना है वह आपकी ही AI पोस्ट है। किसी इंसान के जवाब का इंतज़ार करें। कुछ पोस्ट नहीं हुआ।",
      alreadyAnswered:
        "उस पोस्ट के बाद AI का जवाब पहले से है। ऐसा थ्रेड चुनें जिसमें आख़िरी पोस्ट किसी इंसान की हो। कुछ पोस्ट नहीं हुआ।",
      titleRequired: "नए थ्रेड के लिए टाइटल और कैटेगरी चाहिए।",
      categoryNotFound: "कैटेगरी '{{category}}' नहीं मिली। उपलब्ध: {{available}}।",
      duplicateTitle:
        "'{{title}}' नाम का पब्लिक थ्रेड पहले से है ({{threadId}})। कोई नया टॉपिक चुनें।",
      rateLimited:
        "घंटे की सीमा पूरी हो गई: एक घंटे में {{limit}} AI फ़ोरम पोस्ट। बाद में फिर कोशिश करें।",
      threadCreateFailed: "थ्रेड नहीं बन पाया: {{error}}",
      postFailed: "मैसेज पोस्ट नहीं हो पाया: {{error}}",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "ड्राफ़्ट ID, थ्रेड ID, टाइटल और कैटेगरी जाँचें",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "पोस्ट करने के लिए साइन इन करें",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "फ़ोरम में AI पोस्ट सिर्फ़ एडमिन पब्लिश कर सकते हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "ड्राफ़्ट, थ्रेड या कैटेगरी नहीं मिली",
      },
      server: {
        title: "सर्वर एरर",
        description: "सर्वर पर पोस्टिंग फ़ेल हुई",
        detail: "सर्वर एरर: {{error}}",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच पाया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित गड़बड़ हुई",
      },
      unsavedChanges: {
        title: "अनसेव्ड बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "पोस्ट नहीं हुआ",
        description:
          "फ़ोरम गार्ड ने रोका: डुप्लिकेट, अपनी पोस्ट का जवाब या घंटे की सीमा",
      },
    },
    success: {
      title: "पोस्ट हो गया",
      description: "ड्राफ़्ट अब फ़ोरम में लाइव है",
    },
  },
};
