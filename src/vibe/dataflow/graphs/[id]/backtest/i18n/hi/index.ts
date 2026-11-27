import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 मिनट",
      "3m": "3 मिनट",
      "5m": "5 मिनट",
      "15m": "15 मिनट",
      "30m": "30 मिनट",
      "1h": "1 घंटा",
      "4h": "4 घंटे",
      "1d": "1 दिन",
      "1w": "1 हफ़्ता",
      "1M": "1 महीना",
    },
  },
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "बैकटेस्ट चलाएँ",
    titleShort: "बैकटेस्ट",
    description: "ऐतिहासिक रेंज पर बैकटेस्ट चलाएँ (कार्रवाइयाँ सिम्युलेटेड)",
    fields: {
      id: { label: "ग्राफ़ ID", description: "ग्राफ़ का UUID" },
      rangeFrom: { label: "से", description: "बैकटेस्ट रेंज की शुरुआत" },
      rangeTo: { label: "तक", description: "बैकटेस्ट रेंज का अंत" },
      resolution: {
        label: "रेज़ोल्यूशन",
        description: "मूल्यांकन की टाइमफ़्रेम",
      },
    },
    response: {
      runId: "रन ID",
      eligible: "योग्य",
      ineligibleNodes: "अयोग्य नोड",
    },
    widget: {
      eligible: "योग्य",
      notEligible: "योग्य नहीं",
      runLabel: "रन:",
      ineligibleNodesLabel: "अयोग्य नोड:",
      ineligibleNodesHint:
        "इन नोड का बैकटेस्ट नहीं हो सकता (सेव किया डेटा नहीं, असंगत रेज़ोल्यूशन, या सिर्फ़ स्क्रिप्ट वाला लॉजिक)।",
    },
    success: {
      title: "बैकटेस्ट पूरा हुआ",
      description: "बैकटेस्ट सफलतापूर्वक चला",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "लॉगिन ज़रूरी है",
      },
      forbidden: { title: "अनुमति नहीं", description: "एडमिन एक्सेस ज़रूरी है" },
      server: {
        title: "सर्वर एरर",
        description: "बैकटेस्ट फ़ेल हुआ",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      validation: {
        title: "वैलिडेशन फ़ेल हुआ",
        description: "गलत पैरामीटर",
      },
      notFound: { title: "नहीं मिला", description: "ग्राफ़ नहीं मिला" },
      conflict: { title: "टकराव", description: "रिसोर्स टकराव" },
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
