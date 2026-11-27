import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "मौजूदा लीड का रेफ़रल पाएँ",
  titleShort: "लीड रेफ़रल",
  description: "मौजूदा लीड से जुड़ा रेफ़रल कोड लौटाता है, अगर कोई हो",
  tag: "रेफ़रल",
  noReferral: "इस लीड से कोई रेफ़रल जुड़ा नहीं है",
  response: {
    referralCode: "रेफ़रल कोड",
    referralLabel: "रेफ़रल लेबल",
    subscriptionBonusCredits: "पहले प्लान पर बोनस क्रेडिट",
  },
  errors: {
    validation: { title: "वैलिडेशन एरर", description: "अमान्य रिक्वेस्ट" },
    unauthorized: {
      title: "अनधिकृत",
      description: "ऑथेंटिकेशन ज़रूरी है",
    },
    forbidden: { title: "प्रतिबंधित", description: "एक्सेस नहीं मिला" },
    notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिला" },
    conflict: { title: "टकराव", description: "डेटा में टकराव" },
    serverError: {
      title: "सर्वर एरर",
      description: "सर्वर में आंतरिक एरर",
    },
    unknown: {
      title: "अज्ञात एरर",
      description: "कोई अनपेक्षित एरर हुआ",
    },
    network: { title: "नेटवर्क एरर", description: "नेटवर्क एरर हुआ" },
    unsavedChanges: {
      title: "बिना सेव किए बदलाव",
      description: "आपके बदलाव सेव नहीं हुए हैं",
    },
  },
  success: {
    title: "रेफ़रल कोड मिल गया",
    description: "मौजूदा लीड का रेफ़रल कोड मिल गया",
  },
};
