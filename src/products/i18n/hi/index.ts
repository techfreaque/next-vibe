import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  // Product category
  category: "प्रोडक्ट",

  // Enums
  enums: {
    productType: {
      service: "सर्विस",
      physical: "फ़िज़िकल",
      digital: "डिजिटल",
    },
  },

  // Product summary (single source of truth)
  summary:
    "हमारे पास Free है (बिना अकाउंट: महीने के {{freeCredits}} क्रेडिट, फ़्री अकाउंट: {{freeCreditsSignedIn}}, अकाउंट + न्यूज़लेटर: {{freeCreditsMax}}) और चार मंथली प्लान: {{subCredits}} क्रेडिट के लिए {{subPrice}}, {{plusCredits}} के लिए {{plusPrice}}, {{proCredits}} के लिए {{proPrice}} और {{ultraCredits}} के लिए {{ultraPrice}}। सब्सक्राइबर कभी भी क्रेडिट पैक ({{packCredits}} क्रेडिट के लिए {{packPrice}}) से टॉप अप कर सकते हैं, जो कभी एक्सपायर नहीं होते।",

  // Free tier product
  free: {
    name: "फ़्री टियर",
    description: "फ़्री क्रेडिट के साथ शुरू करें, कार्ड नहीं चाहिए",
  },

  // Subscription product
  subscription: {
    name: "Starter",
    description:
      "सभी {{modelCount}} AI मॉडल के साथ हर महीने {{subCredits}} क्रेडिट",
    longDescription:
      "सभी {{modelCount}} अनसेंसर्ड AI मॉडल के लिए {{subCredits}} क्रेडिट का मंथली सब्सक्रिप्शन",
    price: "मंथली सब्सक्रिप्शन की कीमत",
    cta: "अभी सब्सक्राइब करें",
    features: {
      credits: "हर महीने {{subCredits}} क्रेडिट",
      allModels: "सभी {{modelCount}} AI मॉडल",
      allFeatures: "सारे फ़ीचर शामिल",
      cancel: "कभी भी रद्द करें",
    },
  },

  // Higher subscription tiers (credits and prices come from config)
  subscriptionPlus: {
    name: "Plus",
  },
  subscriptionPro: {
    name: "Pro",
  },
  subscriptionUltra: {
    name: "Ultra",
  },

  // Credit pack product
  creditPack: {
    name: "क्रेडिट पैक",
    description: "अपने प्लान को टॉप अप करें। क्रेडिट कभी एक्सपायर नहीं होते।",
    longDescription:
      "प्लान रिन्यू होने से पहले क्रेडिट कम पड़ गए? पैक जोड़ें। पैक आपके मंथली क्रेडिट के ऊपर जुड़ते हैं और कभी एक्सपायर नहीं होते।",
    features: {
      credits: "हर पैक में {{packCredits}} क्रेडिट",
      allModels: "सभी {{modelCount}} AI मॉडल शामिल",
      allFeatures: "सारे फ़ीचर शामिल",
      multiple: "कई पैक खरीदें",
      permanent: "क्रेडिट कभी एक्सपायर नहीं होते",
    },
  },

  // Large credit pack: retired, no longer sold. Shown only on past purchases.
  creditPackLarge: {
    name: "बड़ा क्रेडिट पैक (बंद)",
    description: "अब नहीं बिकता। पहले खरीदे गए क्रेडिट वैध रहते हैं।",
  },
};
