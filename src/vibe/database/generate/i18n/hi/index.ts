import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "डेटाबेस ऑपरेशन",
  tag: "migration",
  post: {
    title: "माइग्रेशन जनरेट करें",
    titleShort: "माइग्रेशन जनरेट करें",
    description: "स्कीमा बदलावों से Drizzle माइग्रेशन फ़ाइलें बनाएँ",
    form: {
      title: "जनरेशन कॉन्फ़िगरेशन",
      description: "माइग्रेशन जनरेशन के विकल्प कॉन्फ़िगर करें",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "गलत पैरामीटर",
      },
      network: {
        title: "जनरेशन फ़ेल हुआ",
        description: "drizzle-kit generate फ़ेल हुआ",
        detail: "drizzle-kit generate फ़ेल हुआ: {{error}}",
        exitCode: "drizzle-kit generate कोड {{code}} के साथ बाहर निकला",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "पर्याप्त अनुमति नहीं",
      },
      notFound: { title: "नहीं मिला", description: "रिसोर्स नहीं मिले" },
      server: { title: "सर्वर एरर", description: "इंटरनल सर्वर एरर" },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
      conflict: { title: "टकराव", description: "टकराव मिला" },
    },
    success: {
      title: "जनरेशन सफल",
      description: "माइग्रेशन फ़ाइलें सफलतापूर्वक बन गईं",
    },
  },
  fields: {
    success: { title: "सफलता स्टेटस" },
    output: { title: "आउटपुट" },
    duration: { title: "अवधि (ms)" },
  },
};
