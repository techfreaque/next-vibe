import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    group: {
      uncensoredAi: "Uncensored.ai (Uncensored LM)",
      zai: "Z.AI (GLM)",
      moonshot: "Moonshot (Kimi)",
      deepseek: "DeepSeek",
      venice: "Venice",
      xai: "xAI (Grok)",
      anthropic: "Anthropic (Claude)",
      openai: "OpenAI (GPT)",
      google: "Google (Gemini)",
      otherChat: "अन्य चैट मॉडल",
      image: "इमेज जेनरेशन",
      video: "वीडियो जेनरेशन",
      music: "म्यूज़िक जेनरेशन",
      voice: "वॉइस (TTS + STT)",
      tools: "टूल (सर्च, फ़ेच, मेमोरी)",
      unattributed: "बिना श्रेय वाला",
    },
  },
  post: {
    titleShort: "मॉडल के हिसाब से खर्च",
    title: "मॉडल परिवार के हिसाब से खर्च हुए क्रेडिट",
    description:
      "एक ग्रुप पर हर बकेट में खर्च हुए क्रेडिट: मेकर के हिसाब से चैट मॉडल (Uncensored LM, GLM, Kimi, DeepSeek, Venice, Grok, Claude, GPT, Gemini, अन्य), इमेज, वीडियो, म्यूज़िक, वॉइस, टूल। हर खर्च करने वाला शामिल है, इसलिए ग्रुप मिलकर पूरा खर्च बनाते हैं। क्रेडिट में।",
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "कंप्यूटेशन की समय-सीमा" },
      range: { label: "रेंज", description: "क्वेरी की समय सीमा" },
      lookback: { label: "लुकबैक", description: "रेंज शुरू होने से पहले के अतिरिक्त बार" },
      group: {
        label: "ग्रुप",
        description:
          "गिनने के लिए मॉडल परिवार (मेकर के हिसाब से चैट मॉडल) या मीडिया / टूल ग्रुप",
      },
      result: { label: "खर्च हुए क्रेडिट", description: "आउटपुट टाइम सीरीज़" },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "सीरीज़ की गणना हो गई",
      description: "टाइम सीरीज़ लौटाई गई",
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
