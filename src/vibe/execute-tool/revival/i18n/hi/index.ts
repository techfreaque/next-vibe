import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unexpectedError: "अनपेक्षित एरर हुई: {{error}}। दोबारा कोशिश करें।",
    modelNotResolved:
      "इस थ्रेड के लिए मॉडल तय नहीं हो सका, स्ट्रीम दोबारा चालू नहीं की जा सकती।",
  },
  post: {
    title: "पुनर्जीवन",
    titleShort: "पुनर्जीवन",
    description:
      "async टास्क पूरा होने के बाद मौजूदा थ्रेड जारी रखता है (callbackMode=wait या wakeUp)। TaskCompletion.handle इसे एक बार के cron टास्क की तरह शेड्यूल करता है; cron पल्स इसे सही इंस्टेंस पर चलाता है।",
    fields: {
      threadId: {
        title: "थ्रेड ID",
        description: "जारी रखने वाले थ्रेड का UUID।",
      },
      favoriteId: {
        title: "पसंदीदा ID",
        description: "सेव किया पसंदीदा जिससे मॉडल और स्किल लोड होंगे।",
      },
      modelId: {
        title: "मॉडल ID",
        description: "दोबारा शुरू हुए टर्न का AI मॉडल।",
      },
      skillId: {
        title: "स्किल ID",
        description: "दोबारा शुरू हुए टर्न का स्किल/पर्सोना।",
      },
      callbackMode: {
        title: "कॉलबैक मोड",
        description: "wait या wakeUp: पुनर्जीवन का बर्ताव तय करता है।",
      },
      wakeUpToolMessageId: {
        title: "टूल मैसेज ID",
        description: "भरे हुए नतीजे के साथ मूल टूल कॉल मैसेज का ID।",
      },
      wakeUpTaskId: {
        title: "WakeUp टास्क ID",
        description: "शुरुआती wakeUp cron टास्क, पुनर्जीवन के बाद हटा दिया जाता है।",
      },
      resumeTaskId: {
        title: "पुनर्जीवन टास्क ID",
        description: "यही पुनर्जीवन cron टास्क, पुनर्जीवन के बाद हटा दिया जाता है।",
      },
      resumed: {
        title: "दोबारा शुरू हुआ",
        description: "क्या थ्रेड सफलतापूर्वक जारी रखा गया।",
      },
      lastAiMessageId: {
        title: "आख़िरी AI मैसेज ID",
        description: "बने आख़िरी असिस्टेंट मैसेज का UUID।",
      },
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "पैरामीटर गलत हैं: threadId मान्य UUID होना चाहिए।",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है।",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "एक्सेस अस्वीकृत।",
      },
      notFound: {
        title: "नहीं मिला",
        description: "थ्रेड या मॉडल नहीं मिला।",
      },
      internal: {
        title: "सर्वर एरर",
        description: "स्ट्रीम पुनर्जीवन के दौरान आंतरिक एरर।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुई।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुई।",
      },
      unsaved: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव बदलावों से टकराव।",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ।",
      },
    },
    success: {
      title: "थ्रेड फिर चालू हुआ",
      description: "AI थ्रेड सफलतापूर्वक जारी रखा गया।",
    },
  },
};
