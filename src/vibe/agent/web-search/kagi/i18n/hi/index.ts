import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "जानकारी",
  get: {
    title: "Kagi से सर्च करें",
    titleShort: "Kagi Search",
    dynamicTitle: "Kagi: {{query}}",
    description:
      "Kagi से इंटरनेट पर खोजें या AI से जवाब पाएँ। FastGPT मोड सोर्स के साथ पूरा जवाब देता है, जबकि सर्च मोड सीधे नतीजे लौटाता है।",
    form: {
      title: "सर्च के पैरामीटर",
      description: "अपनी Kagi सर्च क्वेरी सेट करें",
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
        description: "साफ़ और खास सर्च क्वेरी या सवाल।",
        placeholder: "अपनी सर्च क्वेरी लिखें...",
      },
      mode: {
        title: "सर्च मोड",
        description: "AI से बने जवाब (FastGPT) या सीधे सर्च नतीजों में से चुनें",
        options: {
          fastgpt: "FastGPT (AI से जवाब)",
          search: "सर्च (सीधे नतीजे)",
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
      output: {
        title: "जवाब",
        description: "FastGPT से बना AI जवाब",
      },
      query: {
        title: "क्वेरी",
        description: "जो सर्च क्वेरी चलाई गई",
      },
      references: {
        title: "रेफ़रेंस",
        description: "सोर्स रेफ़रेंस और हवाले",
        reference: "रेफ़रेंस",
        item: {
          title: "रेफ़रेंस",
          description: "हवाले के साथ सोर्स रेफ़रेंस",
          url: "URL",
          snippet: "स्निपेट",
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
        description: "Kagi सर्च चालू करने के लिए {{label}} सेट करें",
      },
    },
    success: {
      title: "सर्च सफल",
      description: "Kagi सर्च सफलतापूर्वक पूरी हुई",
    },
  },
  tags: {
    search: "सर्च",
    web: "वेब",
    ai: "AI",
  },
};
