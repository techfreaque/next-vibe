import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI टूल",
  tags: {
    skills: "स्किल",
  },
  enums: {
    visibility: {
      private: "प्राइवेट",
      unlisted: "अनलिस्टेड",
      public: "पब्लिक",
    },
  },
  post: {
    title: "कैरेक्टर कार्ड इंपोर्ट करें",
    titleShort: "कार्ड इंपोर्ट करें",
    description:
      "SillyTavern, Chub, RisuAI या किसी भी Tavern-फ़ॉर्मैट ऐप से Character Card (V1, V2 या V3) इंपोर्ट करें। .json फ़ाइल, डेटा एम्बेड वाला .png कार्ड, या टेक्स्ट के रूप में कार्ड का JSON, तीनों चलते हैं। नाम, विवरण, पर्सनैलिटी, सीन, पहला मैसेज, उदाहरण डायलॉग, कार्ड के निर्देश और टैग आपके अपने नए कैरेक्टर में बदल जाते हैं। PNG कार्ड की इमेज अवतार बन जाती है। कार्ड में कुछ भी रन नहीं होता। वही कार्ड दोबारा इंपोर्ट करने पर मौजूदा कैरेक्टर ही मिलता है।",
    intro:
      "अपने कैरेक्टर साथ लाएँ। SillyTavern, Chub या RisuAI से एक्सपोर्ट की हुई कार्ड फ़ाइल यहाँ डालें।",
    supported: "कार्ड V1, V2 और V3। JSON या PNG, 10 MB तक।",
    mapping: {
      title: "क्या-क्या आता है",
      fields:
        "नाम, विवरण, पर्सनैलिटी, सीन, पहला मैसेज, उदाहरण डायलॉग, कार्ड के निर्देश, टैग, क्रिएटर।",
      avatar: "PNG कार्ड: इमेज अवतार बन जाती है।",
      safe: "लोरबुक और स्क्रिप्ट छोड़ दी जाती हैं। कार्ड में कुछ भी रन नहीं होता।",
    },
    card: {
      label: "कार्ड फ़ाइल",
      description: ".json या .png में कैरेक्टर कार्ड",
      validation: {
        required: "कार्ड फ़ाइल चुनें।",
        tooLarge: "कार्ड फ़ाइल 10 MB से बड़ी है।",
      },
    },
    visibility: {
      label: "विज़िबिलिटी",
      description:
        "प्राइवेट: सिर्फ़ आप। अनलिस्टेड: पब्लिक लिस्ट में नहीं। पब्लिक: सबके लिए लिस्टेड।",
    },
    response: {
      id: { content: "कैरेक्टर ID" },
      name: { content: "नाम" },
      platform: { content: "सोर्स" },
      creatorName: { content: "कार्ड बनाने वाला" },
      sourceUrl: { content: "सोर्स लिंक" },
      avatarUrl: { content: "अवतार" },
      alreadyImported: { content: "पहले से इंपोर्ट" },
      importedFields: { content: "इंपोर्ट हुआ" },
    },
    fields: {
      name: "नाम",
      avatar: "अवतार",
      greeting: "पहला मैसेज",
      description: "विवरण",
      definition: "पर्सनैलिटी और सीन",
      tags: "टैग",
    },
    result: {
      imported: "{{name}} तैयार है।",
      alreadyImported: "आप {{name}} पहले ही इंपोर्ट कर चुके हैं। आपकी कॉपी खोल रहे हैं।",
      fieldsList: "इंपोर्ट हुआ: {{fields}}",
      openSkill: "कैरेक्टर खोलें",
      importAnother: "एक और कार्ड इंपोर्ट करें",
    },
    errors: {
      validation: {
        title: "गलत कार्ड",
        description: "कैरेक्टर कार्ड फ़ाइल (.json या .png) चुनें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच पाए।",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "कैरेक्टर इंपोर्ट करने के लिए साइन इन करें।",
      },
      forbidden: {
        title: "अनुमति नहीं है",
        description: "आपका अकाउंट कैरेक्टर इंपोर्ट नहीं कर सकता।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "कार्ड नहीं मिल पाया।",
      },
      server: {
        title: "इंपोर्ट फ़ेल हुआ",
        description: "इंपोर्ट करते समय कुछ टूट गया। दोबारा कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं।",
      },
      conflict: {
        title: "इंपोर्ट चल रहा है",
        description: "यह कार्ड पहले से इंपोर्ट हो रहा है।",
      },
      invalidCard:
        "यह कैरेक्टर कार्ड नहीं है। SillyTavern, Chub या RisuAI से एक्सपोर्ट की हुई .json या .png फ़ाइल इस्तेमाल करें।",
      noCardInPng:
        "इस PNG के अंदर कार्ड डेटा नहीं है। इसे दोबारा कैरेक्टर कार्ड के रूप में एक्सपोर्ट करें, या .json फ़ाइल इस्तेमाल करें।",
      rateLimited: "बहुत ज़्यादा इंपोर्ट हो गए। {{seconds}} सेकंड रुकें और फिर कोशिश करें।",
    },
    success: {
      title: "कैरेक्टर इंपोर्ट हो गया",
      description: "आपकी कॉपी चैट के लिए तैयार है।",
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "कार्ड इंपोर्ट करें",
      loadingText: "इंपोर्ट हो रहा है...",
    },
  },
};
