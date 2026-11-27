import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    metric: {
      occurrences: "घटनाएँ",
      distinct: "दिखी एरर क्लास",
      new: "नई एरर क्लास",
      openBacklog: "खुला बैकलॉग (अभी अनसुलझा)",
    },
    level: {
      all: "एरर और वॉर्निंग",
      error: "सिर्फ़ एरर",
      warn: "सिर्फ़ वॉर्निंग",
    },
  },
  post: {
    titleShort: "एरर लॉग",
    title: "एरर लॉग सीरीज़",
    description:
      "समय के साथ एरर लॉग का वॉल्यूम। घटनाएँ और दिखी क्लास रोज़ के काउंटर से आती हैं (दैनिक बकेट, हिस्ट्री 2026-11-22 से)। नई क्लास पहली बार दिखने को गिनती है। खुला बैकलॉग अभी की अनसुलझी गिनती है, जो हर ग्राफ़ रन पर दर्ज होती है।",
    fields: {
      resolution: {
        label: "रेज़ोल्यूशन",
        description:
          "कंप्यूटेशन की समय-सीमा (घटनाएँ और दिखी क्लास अधिकतम दैनिक होती हैं)",
      },
      range: { label: "रेंज", description: "क्वेरी की समय सीमा" },
      lookback: { label: "लुकबैक", description: "रेंज शुरू होने से पहले के अतिरिक्त बार" },
      metric: {
        label: "मेट्रिक",
        description: "क्या गिनना है: घटनाएँ, दिखी एरर क्लास, नई क्लास या खुला बैकलॉग",
      },
      level: {
        label: "लेवल",
        description: "एरर, वॉर्निंग या दोनों",
      },
      result: { label: "एरर लॉग गिनती", description: "आउटपुट टाइम सीरीज़" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "एरर लॉग सीरीज़ की गणना हो गई",
      description: "एरर लॉग सीरीज़ लौटाई गई",
    },
    errors: {
      unauthorized: { title: "अनधिकृत", description: "ऑथेंटिकेशन ज़रूरी है" },
      forbidden: { title: "प्रतिबंधित", description: "एडमिन एक्सेस ज़रूरी है" },
      server: { title: "सर्वर एरर", description: "क्वेरी फ़ेल हुई" },
      unknown: { title: "अज्ञात एरर", description: "कुछ अनपेक्षित हुआ" },
      validation: { title: "वैलिडेशन फ़ेल", description: "रिक्वेस्ट पैरामीटर गलत हैं" },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
      network: { title: "नेटवर्क एरर", description: "नेटवर्क रिक्वेस्ट फ़ेल हुई" },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
