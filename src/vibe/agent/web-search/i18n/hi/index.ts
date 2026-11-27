import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "जानकारी",
  enums: {
    provider: {
      AUTO: "ऑटो (सुझाया गया)",
      BRAVE: "Brave Search",
      KAGI: "Kagi FastGPT",
    },
  },
  get: {
    title: "वेब पर सर्च करें",
    titleShort: "वेब सर्च",
    dynamicTitle: "सर्च: {{query}}",
    description:
      "ताज़ा जानकारी, खबरें, तथ्य या हाल की घटनाओं के लिए इंटरनेट पर खोजें। अपने आप आपके पसंदीदा सर्च प्रोवाइडर पर चला जाता है।",
    form: {
      title: "वेब सर्च",
      description: "अपने पसंदीदा प्रोवाइडर से वेब पर सर्च करें",
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
      provider: {
        title: "सर्च प्रोवाइडर",
        description:
          "कौन-सा सर्च इंजन इस्तेमाल करना है। ऑटो आपका डिफ़ॉल्ट या सबसे सस्ता उपलब्ध चुनता है।",
        options: {
          auto: "ऑटो (सुझाया गया)",
          brave: "Brave Search",
          kagi: "Kagi FastGPT",
        },
      },
      maxResults: {
        title: "अधिकतम नतीजे",
        description: "कितने नतीजे लौटाने हैं (1-10)। सिर्फ़ Brave।",
      },
      includeNews: {
        title: "खबरें शामिल करें",
        description: "ताज़ा घटनाओं के लिए खबरों के नतीजे जोड़ें। सिर्फ़ Brave।",
      },
      freshness: {
        title: "ताज़गी",
        description: "नतीजों को कितने नए हैं, उसके हिसाब से फ़िल्टर करें। सिर्फ़ Brave।",
        options: {
          day: "पिछला दिन",
          week: "पिछला हफ़्ता",
          month: "पिछला महीना",
          year: "पिछला साल",
        },
      },
    },
    response: {
      provider: {
        title: "प्रोवाइडर",
        description: "कौन-सा सर्च प्रोवाइडर इस्तेमाल हुआ",
      },
      output: {
        title: "AI का जवाब",
        description: "AI से बनी समरी (सिर्फ़ Kagi)",
      },
      results: {
        title: "नतीजे",
        description: "वेब सर्च के नतीजे",
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
    },
    widget: {
      aiDefaultLabel: "AI का डिफ़ॉल्ट:",
      switchTo: "बदलें",
      separatorDot: "·",
      via: "{{provider}} से",
      braveBanner: "आपका AI Kagi से सर्च करता है",
      kagiBanner: "आपका AI Brave से सर्च करता है",
      useBrave: "Brave इस्तेमाल करें",
      useKagi: "Kagi इस्तेमाल करें",
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
      noProvider: {
        title: "कोई सर्च प्रोवाइडर उपलब्ध नहीं है",
        description:
          "कोई सर्च API key सेट नहीं है। अपनी .env फ़ाइल में Brave Search या Kagi सेट करें।",
      },
      noProviderAdmin: {
        title:
          "कोई सर्च प्रोवाइडर सेट नहीं है। अपनी .env फ़ाइल में BRAVE_SEARCH_API_KEY या KAGI_API_KEY जोड़ें।",
        description:
          "Brave Search: https://api.search.brave.com/app/keys | Kagi: https://kagi.com/settings?p=api",
      },
      noProviderUser: {
        title: "वेब सर्च अभी उपलब्ध नहीं है।",
        description: "एडमिन ने अभी तक कोई सर्च प्रोवाइडर सेट नहीं किया है।",
      },
      providerUnavailable: {
        title: "सर्च प्रोवाइडर उपलब्ध नहीं है",
        description:
          "चुना गया सर्च प्रोवाइडर सेट नहीं है। दूसरा प्रोवाइडर चुनें या ऑटो इस्तेमाल करें।",
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
