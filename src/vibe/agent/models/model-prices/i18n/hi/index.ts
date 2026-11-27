import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "एजेंट",

  get: {
    title: "सभी मॉडल की कीमतें अपडेट करें",
    titleShort: "कीमतें अपडेट करें",
    description:
      "प्रोवाइडर की लाइव कीमतें लाएँ और कैटलॉग के प्रस्तावित बदलाव दिखाएँ। लोकल CLI में --write देने पर बदलाव लागू होते हैं।",
    form: {
      title: "मॉडल प्राइस अपडेटर",
      write: "बदलाव सोर्स फ़ाइलों में लिखें",
    },
    response: {
      diff: "सोर्स डिफ़",
      summary: {
        status: "स्टेटस",
        notConfigured: "कीमत की तुलना छोड़ दी गई। प्रोवाइडर की API key सेट नहीं हैं।",
        title: "अपडेट का सार",
        totalProviders: "चलाए गए प्रोवाइडर",
        totalModels: "कुल मॉडल",
        modelsUpdated: "प्रस्तावित बदलाव",
        fileUpdated: "फ़ाइल अपडेट हुई",
      },
      updates: {
        title: "अपडेट हुए मॉडल",
        model: {
          modelId: "मॉडल ID",
          name: "मॉडल का नाम",
          provider: "प्रोवाइडर",
          field: "कीमत का फ़ील्ड",
          value: "नई वैल्यू",
          source: "कीमत का सोर्स",
        },
      },
      failures: {
        title: "कीमत लाने में फ़ेल",
        model: {
          modelId: "मॉडल ID",
          provider: "प्रोवाइडर",
          reason: "वजह",
        },
      },
      providerResults: {
        title: "प्रोवाइडर के नतीजे",
        model: {
          provider: "प्रोवाइडर",
          modelsFound: "मिले मॉडल",
          modelsUpdated: "अपडेट हुए",
          error: "एरर",
        },
      },
    },
    errors: {
      server: {
        title: "सर्वर एरर",
        description: "मॉडल की कीमतें अपडेट नहीं हो पाईं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "प्राइसिंग API से कनेक्ट नहीं हो पाए",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
        // `title` doubles as the generic errorTypes label - detail lives here so
        // no raw placeholder leaks into those labels.
        detail: "अज्ञात एरर: {{error}}",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको यह कार्रवाई करने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "इस रिसोर्स का एक्सेस मना है",
      },
      notFound: {
        title: "नहीं मिला",
        description: "माँगा गया रिसोर्स नहीं मिला",
      },
      conflict: {
        title: "टकराव",
        description: "रिक्वेस्ट प्रोसेस करते समय टकराव हो गया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "सफल",
      description: "प्रोवाइडर की कीमतें आ गईं और कैटलॉग से मिला ली गईं।",
    },
  },
  tags: {
    models: "मॉडल",
  },
  updateAllModelPrices: {
    name: "सभी मॉडल की कीमतें अपडेट करें",
    description: "लाइव प्रोवाइडर प्राइसिंग से रिव्यू के लिए सोर्स डिफ़ रिपोर्ट करता है।",
  },
};
