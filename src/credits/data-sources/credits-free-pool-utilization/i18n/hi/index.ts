import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    titleShort: "इस्तेमाल हुआ फ़्री कोटा",
    title: "इस्तेमाल हुआ फ़्री कोटा (महीने से अब तक)",
    description:
      "खर्च हुए फ़्री क्रेडिट को दिए गए फ़्री क्रेडिट से भाग दिया गया, दोनों महीने की शुरुआत से अब तक (UTC महीना, 1 तारीख़ को रीसेट)। 0 = कुछ इस्तेमाल नहीं हुआ, 1 = दिया गया हर फ़्री क्रेडिट खर्च हो गया। गेस्ट / यूज़र / न्यूज़लेटर जैसे टियर वाले कोटे के लिए भी चलता है।",
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "कंप्यूटेशन की समय-सीमा" },
      range: { label: "रेंज", description: "क्वेरी की समय सीमा" },
      lookback: { label: "लुकबैक", description: "रेंज शुरू होने से पहले के अतिरिक्त बार" },
      result: { label: "इस्तेमाल हुआ फ़्री कोटा", description: "आउटपुट टाइम सीरीज़" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "फ़्री कोटा उपयोग की गणना हो गई",
      description: "फ़्री कोटा उपयोग की सीरीज़ लौटाई गई",
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
