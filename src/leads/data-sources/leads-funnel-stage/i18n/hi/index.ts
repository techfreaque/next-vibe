import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    stage: {
      leads: "सभी लीड",
      humans: "इंसानी लीड",
      firstChats: "चैट की",
      signups: "साइन अप किया",
      emailConfirmed: "ईमेल पक्का हुआ",
      payers: "चुकाया",
    },
  },
  post: {
    title: "लीड फ़नल चरण",
    titleShort: "फ़नल चरण",
    description:
      "हर टाइम बकेट में बनी लीड और उनमें से कितनी किसी एक फ़नल चरण तक पहुँचीं। पहले चरण के बाद बॉट बाहर रखे गए।",
    fields: {
      resolution: { label: "रेज़ोल्यूशन", description: "गणना की समय-सीमा" },
      range: { label: "रेंज", description: "क्वेरी की समय-सीमा" },
      lookback: {
        label: "लुकबैक",
        description: "रेंज शुरू होने से पहले के अतिरिक्त बार",
      },
      stage: {
        label: "चरण",
        description: "कौन सा फ़नल चरण गिनना है",
      },
      result: {
        label: "चरण की गिनती",
        description: "आउटपुट टाइम सीरीज़",
      },
      meta: { label: "मेटा", description: "नोड एक्ज़ीक्यूशन का मेटाडेटा" },
    },
    success: {
      title: "लीड फ़नल चरण का डेटा",
      description: "फ़नल चरण की सीरीज़ लौटा दी गई",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "ऑथेंटिकेशन ज़रूरी है",
      },
      forbidden: { title: "मना है", description: "एडमिन एक्सेस ज़रूरी है" },
      server: { title: "सर्वर एरर", description: "क्वेरी फ़ेल हुई" },
      unknown: {
        title: "अनजान एरर",
        description: "अप्रत्याशित एरर आई",
      },
      validation: {
        title: "वैलिडेशन फ़ेल",
        description: "रिक्वेस्ट के पैरामीटर गलत हैं",
      },
      notFound: { title: "नहीं मिला", description: "नहीं मिला" },
      conflict: { title: "टकराव", description: "टकराव" },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क रिक्वेस्ट फ़ेल हुई",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले बदलाव सेव करें",
      },
    },
  },
};
