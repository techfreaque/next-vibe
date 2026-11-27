import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "जानकारी",
  get: {
    title: "वेब पर सर्च करें",
    titleShort: "Brave Search",
    dynamicTitle: "सर्च: {{query}}",
    description:
      "ताज़ा जानकारी, खबरों, तथ्यों या हाल की घटनाओं के लिए इंटरनेट पर खोजें। ताज़ा जानकारी चाहिए या तथ्य जाँचने हों तो इस्तेमाल करें।",
    form: {
      title: "सर्च के पैरामीटर",
      description: "अपनी वेब सर्च क्वेरी सेट करें",
    },
    submitButton: {
      label: "सर्च करें",
      loadingText: "खोज रहे हैं...",
    },
    backButton: {
      label: "वापस",
    },
    fields: {
      query: {
        title: "सर्च क्वेरी",
        description: "साफ़ और खास सर्च क्वेरी। सवालों की जगह कीवर्ड इस्तेमाल करें।",
        placeholder: "अपनी सर्च क्वेरी लिखें...",
      },
      maxResults: {
        title: "अधिकतम नतीजे",
        description: "कितने नतीजे लौटाने हैं (1-10)",
      },
      includeNews: {
        title: "खबरें शामिल करें",
        description: "ताज़ा घटनाओं के लिए खबरों के नतीजे जोड़ें",
      },
      freshness: {
        title: "ताज़गी",
        description: "नतीजों को कितने नए हैं, उसके हिसाब से फ़िल्टर करें",
        options: {
          day: "पिछला दिन",
          week: "पिछला हफ़्ता",
          month: "पिछला महीना",
          year: "पिछला साल",
        },
      },
    },
    response: {
      success: {
        title: "सफल",
        description: "सर्च सफल रही या नहीं",
      },
      message: {
        title: "मैसेज",
        description: "सर्च का स्टेटस मैसेज",
      },
      query: {
        title: "क्वेरी",
        description: "जो सर्च क्वेरी चलाई गई",
      },
      results: {
        title: "नतीजे",
        description: "सर्च नतीजों की सूची",
        result: "नतीजा",
        item: {
          title: "सर्च नतीजा",
          description: "एक सर्च नतीजा",
          url: "URL",
          snippet: "स्निपेट",
          age: "उम्र",
          source: "सोर्स",
        },
      },
      cached: {
        title: "कैश्ड",
        description: "नतीजे कैश से आए या नहीं",
      },
      timestamp: {
        title: "टाइमस्टैम्प",
        description: "सर्च कब की गई",
      },
    },
    errors: {
      queryEmpty: {
        title: "सर्च क्वेरी ज़रूरी है",
        description: "कोई सर्च क्वेरी दें",
      },
      queryTooLong: {
        title: "सर्च क्वेरी बहुत लंबी है (अधिकतम {{maxLength}} अक्षर)",
        description: "क्वेरी 400 अक्षर या उससे कम होनी चाहिए",
      },
      timeout: {
        title: "सर्च रिक्वेस्ट टाइमआउट हो गई",
        description: "सर्च पूरी होने में बहुत समय लगा",
      },
      searchFailed: {
        title: "सर्च फ़ेल हो गई",
        description: "सर्च करते समय एरर आया",
      },
      validation: {
        title: "गलत सर्च",
        description: "अपने सर्च पैरामीटर जाँचें और दोबारा कोशिश करें",
      },
      internal: {
        title: "कुछ गड़बड़ हो गई",
        description: "आपकी सर्च पूरी नहीं हो पाई। दोबारा कोशिश करें",
      },
      notConfigured: {
        title:
          "{{label}} की API key सेट नहीं है। अपनी .env फ़ाइल में {{envKey}}=<your-key> जोड़ें। key यहाँ से लें: {{url}}",
        description: "वेब सर्च चालू करने के लिए {{label}} सेट करें",
      },
    },
    success: {
      title: "सर्च सफल",
      description: "वेब सर्च सफलतापूर्वक पूरी हुई",
    },
  },
  tags: {
    search: "सर्च",
    web: "वेब",
    internet: "इंटरनेट",
  },
};
