import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "सिस्टम",
  tags: {
    remoteSync: "रिमोट सिंक",
  },
  taskSync: {
    post: {
      title: "रिमोट सिंक",
      titleShort: "सिंक",
      description:
        "इंस्टेंस के बीच कर्सर-आधारित दोतरफ़ा सिंक। लोकल कर्सर भेजता है, सिर्फ़ नए रिकॉर्ड पाता है।",
      instanceId: {
        label: "इंस्टेंस का नाम",
        description: "बुलाने वाले इंस्टेंस की पहचान",
      },
      syncCursors: {
        label: "सिंक कर्सर",
        description: "हर डोमेन के कर्सर जो आख़िरी सिंक की जगह बताते हैं",
      },
      capabilitiesVersion: {
        label: "कैपेबिलिटी वर्ज़न",
        description:
          "पाने वाले इंस्टेंस के कैपेबिलिटी स्नैपशॉट का वह वर्ज़न जो बुलाने वाले के पास है",
      },
      senderCapabilitiesVersion: {
        label: "भेजने वाले का कैपेबिलिटी वर्ज़न",
        description: "बुलाने वाले इंस्टेंस के अपने कैपेबिलिटी स्नैपशॉट का वर्ज़न",
      },
      capabilitiesJson: {
        label: "कैपेबिलिटी JSON",
        description: "इस इंस्टेंस पर रजिस्टर होने वाला टूल मैनिफ़ेस्ट स्नैपशॉट",
      },
      pushPayloads: {
        label: "पुश पेलोड",
        description:
          "बुलाने वाले के वे रिकॉर्ड जो उसके पुश कर्सर से नए हैं: रिस्पॉन्स बनने से पहले यहाँ लागू होते हैं (दोतरफ़ा पुश-पुल)",
      },
      syncPayloads: {
        label: "सिंक पेलोड",
        description: "दिए गए कर्सर से नए रिकॉर्ड, डोमेन के हिसाब से",
      },
      syncCounts: {
        label: "सिंक की गिनती",
        description: "हर डोमेन के लौटाए रिकॉर्ड की संख्या",
      },
      remoteCursors: {
        label: "रिमोट कर्सर",
        description: "इस इंस्टेंस के मौजूदा कर्सर: लोकल कर्सर इन तक आगे बढ़ाएँ",
      },
      remoteCapabilitiesVersion: {
        label: "रिमोट कैपेबिलिटी वर्ज़न",
        description: "इस इंस्टेंस का मौजूदा कैपेबिलिटी वर्ज़न",
      },
      capabilities: {
        label: "कैपेबिलिटी",
        description: "इस इंस्टेंस का टूल मैनिफ़ेस्ट स्नैपशॉट",
      },
      serverTime: {
        label: "सर्वर का समय",
        description: "मौजूदा सर्वर टाइमस्टैम्प",
      },
      errors: {
        validation: {
          title: "वैलिडेशन एरर",
          description: "सिंक रिक्वेस्ट गलत है",
        },
        unauthorized: {
          title: "अनधिकृत",
          description: "ऑथेंटिकेशन ज़रूरी है",
        },
        internal: {
          title: "सिंक एरर",
          description: "सिंक के दौरान एरर हुई",
        },
        forbidden: {
          title: "प्रतिबंधित",
          description: "आपको सिंक करने की अनुमति नहीं है",
        },
        notFound: {
          title: "नहीं मिला",
          description: "सिंक का लक्ष्य नहीं मिला",
        },
        network: {
          title: "नेटवर्क एरर",
          description: "सिंक एंडपॉइंट तक नहीं पहुँच सके",
        },
        unknown: {
          title: "अज्ञात एरर",
          description: "कोई अनपेक्षित एरर हुई",
        },
        unsaved: {
          title: "बिना सेव किए बदलाव",
          description: "कुछ बदलाव सेव नहीं हुए हैं",
        },
        conflict: {
          title: "टकराव",
          description: "सिंक में टकराव मिला",
        },
      },
      success: {
        title: "सिंक हुआ",
        description: "सिंक सफलतापूर्वक पूरा हुआ",
      },
    },
  },
};
