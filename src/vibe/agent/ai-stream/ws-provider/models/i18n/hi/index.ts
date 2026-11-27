import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI मॉडल",
  tags: {
    models: "मॉडल",
    aiModels: "ai-मॉडल",
  },
  get: {
    title: "AI मॉडल की सूची",
    titleShort: "AI मॉडल",
    description: "कीमत और क्षमताओं की जानकारी के साथ सभी उपलब्ध AI मॉडल लौटाता है",
    response: {
      models: {
        title: "मॉडल",
      },
      id: {
        content: "मॉडल ID",
      },
      name: {
        content: "नाम",
      },
      provider: {
        content: "प्रोवाइडर",
      },
      category: {
        content: "कैटेगरी",
      },
      description: {
        content: "विवरण",
      },
      contextWindow: {
        content: "कॉन्टेक्स्ट विंडो",
      },
      supportsTools: {
        content: "टूल सपोर्ट",
      },
      creditCost: {
        content: "क्रेडिट लागत",
      },
    },
    success: {
      title: "मॉडल मिल गए",
      description: "AI मॉडल की सूची सफलतापूर्वक मिली",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "मना है",
        description: "एक्सेस नहीं मिला",
      },
      notFound: {
        title: "नहीं मिला",
        description: "मॉडल नहीं मिले",
      },
      server: {
        title: "सर्वर एरर",
        description: "मॉडल नहीं मिल सके",
      },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
    },
  },
};
