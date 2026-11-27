import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "अकाउंट",
  get: {
    title: "मेरा डेटा एक्सपोर्ट करें",
    titleShort: "डेटा एक्सपोर्ट करें",
    description:
      "हमारे पास आपका जो भी डेटा है, डाउनलोड करें: प्रोफ़ाइल, चैट, मेमोरी, स्किल, क्रेडिट, रेफ़रल, न्यूज़लेटर, एड्रेस। JSON के साथ पढ़ने लायक सार भी।",
    tags: { export: "डेटा एक्सपोर्ट" },
    response: {
      json: { title: "पूरा डेटा (JSON)" },
      jsonFilename: { title: "JSON फ़ाइल का नाम" },
      markdown: { title: "सार (Markdown)" },
      markdownFilename: { title: "सार की फ़ाइल का नाम" },
    },
    success: {
      title: "एक्सपोर्ट तैयार",
      description: "आपका डेटा आर्काइव बन गया",
    },
    md: {
      heading: "आपका डेटा एक्सपोर्ट",
      generated: "बनाया गया",
      account: "अकाउंट",
      email: "ईमेल",
      name: "नाम",
      memberSince: "सदस्य बने",
      contents: "सामग्री",
      records: "रिकॉर्ड",
      note: "पूरी जानकारी JSON फ़ाइल में है। इस एक्सपोर्ट में सिर्फ़ आपके अकाउंट से जुड़ा डेटा है।",
    },
    widget: {
      intro:
        "अपने डेटा की कॉपी पाएँ। आपको पूरी JSON फ़ाइल और पढ़ने लायक Markdown सार मिलता है। इसमें सिर्फ़ आपका अपना डेटा शामिल है।",
      downloadJson: "JSON डाउनलोड करें",
      downloadMarkdown: "सार डाउनलोड करें",
      generate: "एक्सपोर्ट तैयार करें",
      preparing: "तैयार हो रहा है...",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "अमान्य रिक्वेस्ट",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "अपना डेटा एक्सपोर्ट करने के लिए लॉग इन करें",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "आप यह डेटा एक्सपोर्ट नहीं कर सकते",
      },
      notFound: {
        title: "नहीं मिला",
        description: "अकाउंट नहीं मिला",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर हुआ",
      },
      server: {
        title: "एक्सपोर्ट विफल रहा",
        description: "हम आपका एक्सपोर्ट नहीं बना सके। थोड़ी देर बाद कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर हुआ",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हुआ",
      },
    },
  },
};
