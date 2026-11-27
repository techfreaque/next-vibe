import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI",
  tags: {
    streaming: "स्ट्रीमिंग",
  },
  post: {
    title: "AI स्ट्रीम रद्द करें",
    titleShort: "स्ट्रीम रद्द करें",
    description: "चालू AI स्ट्रीमिंग जवाब को रद्द करें",
    container: {
      title: "स्ट्रीम रद्द करें",
      description: "किसी थ्रेड की चालू AI स्ट्रीम रोकें",
    },
    form: {
      title: "स्ट्रीम रद्द करें",
      description: "चालू स्ट्रीम रद्द करने के लिए थ्रेड ID दें",
    },
    threadId: {
      label: "थ्रेड ID",
      description: "जिस थ्रेड की स्ट्रीम रद्द करनी है उसकी ID",
    },
    response: {
      title: "रद्द करने का नतीजा",
      description: "रद्द करने की कार्रवाई का नतीजा",
      cancelled: "चालू स्ट्रीम मिली और रद्द हुई या नहीं",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "रद्द करने का डेटा गलत है",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर से कनेक्ट नहीं हो सका",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "स्ट्रीम रद्द करने के लिए ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आप सिर्फ़ अपनी ही स्ट्रीम रद्द कर सकते हैं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "थ्रेड नहीं मिला",
      },
      server: {
        title: "सर्वर एरर",
        description: "स्ट्रीम रद्द नहीं हो सकी",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "रद्द करने में टकराव हुआ",
      },
    },
    success: {
      title: "स्ट्रीम रद्द हुई",
      description: "AI स्ट्रीम सफलतापूर्वक रद्द हो गई",
    },
    streamInterrupted: "जेनरेशन रोक दिया गया। अधूरा जवाब सेव हो गया है।",
  },
};
