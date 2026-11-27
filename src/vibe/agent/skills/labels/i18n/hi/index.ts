import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    category: {
      companion: "कंपैनियन",
      assistant: "असिस्टेंट",
      coding: "कोडिंग",
      creative: "क्रिएटिव",
      writing: "राइटिंग",
      analysis: "एनालिसिस",
      roleplay: "रोलप्ले",
      education: "शिक्षा",
      controversial: "विवादित",
      background: "बैकग्राउंड",
      custom: "कस्टम",
    },
    source: {
      all: "सभी",
      builtIn: "बिल्ट-इन",
      my: "मेरी",
      community: "कम्युनिटी",
    },
    ownershipType: {
      system: "बिल्ट-इन स्किल",
      user: "आपकी बनाई",
      public: "कम्युनिटी की",
    },
    voice: {
      male: "पुरुष आवाज़",
      female: "महिला आवाज़",
    },
    mode: {
      auto: "ऑटो",
      manual: "मैन्युअल",
    },
    selectionType: {
      skillBased: "स्किल के हिसाब से",
      manual: "खास मॉडल",
      filters: "फ़िल्टर के हिसाब से",
    },
    intelligence: {
      quick: "तेज़",
      smart: "स्मार्ट और सस्ता",
      brilliant: "बेहतरीन",
    },
    price: {
      cheap: "सस्ता",
      standard: "स्टैंडर्ड",
      premium: "प्रीमियम",
    },
    content: {
      mainstream: "मेनस्ट्रीम",
      open: "ओपन",
      uncensored: "अनसेंसर्ड",
    },
    skillType: {
      persona: "पर्सोना",
      specialist: "स्पेशलिस्ट",
      toolBundle: "टूल बंडल",
    },
    skillStatus: {
      draft: "ड्राफ़्ट",
      published: "पब्लिश्ड",
      unlisted: "अनलिस्टेड",
    },
    trustLevel: {
      community: "कम्युनिटी",
      verified: "वेरिफ़ाइड",
    },
    voteDirection: {
      up: "अपवोट",
      down: "डाउनवोट",
    },
  },
  modelSelection: {
    sort: {
      intelligence: "इंटेलिजेंस",
      price: "कीमत",
      content: "कंटेंट",
    },
    sortDirection: {
      asc: "बढ़ते क्रम में",
      desc: "घटते क्रम में",
    },
  },
};
