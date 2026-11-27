import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI टूल",
  tags: {
    skills: "स्किल",
  },
  get: {
    title: "कैरेक्टर कार्ड एक्सपोर्ट करें",
    titleShort: "कार्ड एक्सपोर्ट करें",
    description:
      "किसी स्किल को Character Card V2 JSON फ़ाइल के रूप में एक्सपोर्ट करें। उसे SillyTavern, RisuAI, Chub या किसी भी Tavern-फ़ॉर्मैट ऐप में इंपोर्ट करें, या बैकअप की तरह रखें। आपकी अपनी स्किल, पब्लिक कम्युनिटी स्किल और पब्लिक बिल्ट-इन स्किल पर काम करता है। कार्ड में क्रिएटर को क्रेडिट मिलता है और स्किल पेज का लिंक रहता है।",
    dynamicTitle: "एक्सपोर्ट: {{name}}",
    id: {
      label: "स्किल",
      description: "एक्सपोर्ट करने वाली स्किल",
    },
    widget: {
      intro:
        "आपका कैरेक्टर, एक ऐसी फ़ाइल में जो आपकी अपनी है। Character Card V2, यानी वह फ़ॉर्मैट जिसे SillyTavern, RisuAI और Chub इंपोर्ट करते हैं।",
      included:
        "अंदर: नाम, पूरा कैरेक्टर प्रॉम्प्ट, टैगलाइन, विवरण, क्रिएटर और यहाँ का लिंक।",
      download: "कार्ड डाउनलोड करें",
      copy: "JSON कॉपी करें",
      copied: "कॉपी हो गया",
    },
    card: {
      skillPage: "स्किल पेज: {{url}}",
    },
    response: {
      name: { content: "नाम" },
      fileName: { content: "फ़ाइल का नाम" },
      card: { content: "कार्ड JSON" },
    },
    errors: {
      validation: {
        title: "गलत रिक्वेस्ट",
        description: "स्किल ID जाँचें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक नहीं पहुँच पाए।",
      },
      unauthorized: {
        title: "साइन इन ज़रूरी है",
        description: "यह स्किल एक्सपोर्ट करने के लिए साइन इन करें।",
      },
      forbidden: {
        title: "अनुमति नहीं है",
        description: "आप यह स्किल एक्सपोर्ट नहीं कर सकते।",
      },
      notFound: {
        title: "स्किल नहीं मिली",
        description: "यह स्किल मौजूद नहीं है या आपको दिखती नहीं है।",
      },
      server: {
        title: "एक्सपोर्ट फ़ेल हुआ",
        description: "कार्ड बनाते समय कुछ टूट गया। दोबारा कोशिश करें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया।",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं।",
      },
      conflict: {
        title: "टकराव",
        description: "एक्सपोर्ट के दौरान स्किल बदल गई। दोबारा कोशिश करें।",
      },
    },
    success: {
      title: "कार्ड तैयार है",
      description: "इसे डाउनलोड करें या JSON कॉपी करें।",
    },
  },
};
