import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI टूल",
  tags: {
    skills: "स्किल",
  },
  enums: {
    platform: {
      characterAi: "Character.AI",
      talkie: "Talkie",
      characterCard: "कैरेक्टर कार्ड",
    },
    visibility: {
      private: "प्राइवेट",
      unlisted: "अनलिस्टेड",
      public: "पब्लिक",
    },
  },
  post: {
    title: "लिंक से कैरेक्टर इंपोर्ट करें",
    titleShort: "लिंक से इंपोर्ट करें",
    description:
      "Character.AI (character.ai, c.ai) या Talkie (talkie-ai.com) के पब्लिक लिंक से कैरेक्टर इंपोर्ट करें। नाम, अवतार, ग्रीटिंग, विवरण, डेफ़िनिशन और टैग आपके अपने नए कैरेक्टर में कॉपी होते हैं। असली क्रिएटर को क्रेडिट मिलता है और सोर्स का लिंक रहता है। वही लिंक दोबारा इंपोर्ट करने पर मौजूदा कैरेक्टर ही मिलता है।",
    dynamicTitle: "इंपोर्ट: {{url}}",
    intro:
      "किसी पब्लिक कैरेक्टर का लिंक पेस्ट करें। पेज पर जो सबके लिए दिखता है, हम वही कॉपी करते हैं और असली क्रिएटर को क्रेडिट देते हैं।",
    supported: "Character.AI और Talkie के साथ काम करता है।",
    url: {
      label: "कैरेक्टर का लिंक",
      description: "कैरेक्टर पेज का पब्लिक लिंक",
      placeholder: "https://character.ai/character/...",
      validation: {
        invalid: "https:// से शुरू होने वाला पूरा लिंक पेस्ट करें",
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
      creatorName: { content: "असली क्रिएटर" },
      sourceUrl: { content: "सोर्स लिंक" },
      avatarUrl: { content: "अवतार" },
      alreadyImported: { content: "पहले से इंपोर्ट" },
      importedFields: { content: "इंपोर्ट हुआ" },
    },
    fields: {
      name: "नाम",
      avatar: "अवतार",
      greeting: "ग्रीटिंग",
      description: "विवरण",
      definition: "डेफ़िनिशन",
      tags: "टैग",
    },
    result: {
      imported: "{{name}} तैयार है।",
      alreadyImported: "आप {{name}} पहले ही इंपोर्ट कर चुके हैं। आपकी कॉपी खोल रहे हैं।",
      credit: "असली क्रिएटर: {{creator}}, {{platform}} पर",
      creditUnknown: "{{platform}} से इंपोर्ट किया गया",
      cardCredit: "कार्ड बनाने वाले: {{creator}}",
      cardCreditUnknown: "कैरेक्टर कार्ड से इंपोर्ट किया गया",
      fieldsList: "इंपोर्ट हुआ: {{fields}}",
      openSkill: "कैरेक्टर खोलें",
      importAnother: "एक और इंपोर्ट करें",
    },
    errors: {
      validation: {
        title: "गलत लिंक",
        description: "कैरेक्टर का पूरा पब्लिक लिंक पेस्ट करें।",
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
        title: "कैरेक्टर नहीं मिला",
        description:
          "पेज पर कोई पब्लिक कैरेक्टर डेटा नहीं दिखता। वह प्राइवेट हो सकता है, हटाया जा चुका हो सकता है या उसके लिए लॉगिन चाहिए।",
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
        title: "पहले से इंपोर्ट",
        description: "आप यह कैरेक्टर पहले ही इंपोर्ट कर चुके हैं।",
      },
      unsupported:
        "यह लिंक सपोर्टेड नहीं है। Character.AI (character.ai, c.ai) या Talkie (talkie-ai.com) का कैरेक्टर लिंक पेस्ट करें।",
      blocked:
        "{{platform}} ने रिक्वेस्ट ब्लॉक कर दी। कुछ मिनट बाद फिर कोशिश करें या कैरेक्टर खुद बना लें।",
      noPublicData:
        "{{platform}} इस कैरेक्टर का कोई पब्लिक डेटा नहीं दिखाता। वह प्राइवेट हो सकता है, हटाया जा चुका हो सकता है या उसके लिए लॉगिन चाहिए।",
      rateLimited: "बहुत ज़्यादा इंपोर्ट हो गए। {{seconds}} सेकंड रुकें और फिर कोशिश करें।",
      notConfigured:
        "{{platform}} के पेज के लिए पेज फ़ेचर चाहिए, जो इस सर्वर पर सेट नहीं है।",
    },
    success: {
      title: "कैरेक्टर इंपोर्ट हो गया",
      description: "आपकी कॉपी चैट के लिए तैयार है।",
    },
    backButton: {
      label: "वापस",
    },
    submitButton: {
      label: "इंपोर्ट करें",
      loadingText: "इंपोर्ट हो रहा है...",
    },
  },
};
