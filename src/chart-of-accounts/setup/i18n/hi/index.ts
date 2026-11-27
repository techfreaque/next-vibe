import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    country: {
      AT: "ऑस्ट्रिया (ÖKR)",
      DE: "जर्मनी (SKR03)",
      XX: "जेनेरिक IFRS",
      SK: "स्लोवाकिया (Rámcová účtová osnova)",
    },
  },
  post: {
    title: "चार्ट ऑफ़ अकाउंट्स सेट करें",
    titleShort: "चार्ट ऑफ़ अकाउंट्स सेट करें",
    description: "मानक टेम्पलेट से अपनी कंपनी के ज़रूरी अकाउंट जोड़ें।",
    companyId: {
      label: "कंपनी",
      description: "सेट करने के लिए कंपनी चुनें।",
      placeholder: "कंपनी चुनें",
    },
    country: {
      label: "अकाउंटिंग टेम्पलेट",
      description: "जोड़ने के लिए अकाउंट ढाँचा चुनें।",
      placeholder: "टेम्पलेट चुनें",
    },
    response: {
      created: "बनाए गए अकाउंट",
      skipped: "मौजूदा अकाउंट रखे गए",
    },
    errors: {
      unauthorized: {
        title: "अनधिकृत",
        description: "चार्ट ऑफ़ अकाउंट्स सेट करने के लिए लॉग इन होना ज़रूरी है",
      },
      validation: {
        title: "वैलिडेशन एरर",
        description: "कंपनी और अकाउंटिंग टेम्पलेट जाँचें।",
      },
      forbidden: {
        title: "प्रतिबंधित",
        description: "अकाउंट सिर्फ़ कंपनी के मालिक और एडमिन सेट कर सकते हैं",
      },
      server: {
        title: "सर्वर एरर",
        description: "टेम्पलेट फिर लागू करके देखें।",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कुछ अनपेक्षित हुआ",
      },
      conflict: {
        title: "सेटअप जाँचें",
        description: "टेम्पलेट लागू करने से पहले कंपनी के मौजूदा अकाउंट फिर लोड करें।",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "सर्वर तक पहुँच नहीं हो सकी",
      },
      notFound: {
        title: "टेम्पलेट नहीं मिला",
        description: "इस देश के लिए चार्ट ऑफ़ अकाउंट्स टेम्पलेट नहीं मिला",
      },
      unsavedChanges: {
        title: "बिना सेव बदलाव",
        description: "आपके बदलाव सेव नहीं हुए हैं",
      },
    },
    success: {
      title: "चार्ट ऑफ़ अकाउंट्स तैयार",
      description: "टेम्पलेट लागू हो गया। नीचे नए और मौजूदा अकाउंट देखें।",
    },
    widget: {
      review: "अकाउंट सेटअप देखें",
      previewLoading: "मौजूदा अकाउंट खोजे जा रहे हैं…",
      previewFailed: "मौजूदा अकाउंट की गिनती उपलब्ध नहीं।",
      existing: "मौजूदा अकाउंट: {{count}}।",
      empty: "इस कंपनी के अभी कोई अकाउंट नहीं हैं।",
      consequences:
        "सेटअप टेम्पलेट से गायब अकाउंट कोड जोड़ता है और मौजूदा रिकॉर्ड जस के तस रखता है।",
      submit: "टेम्पलेट से अकाउंट जोड़ें",
      back: "वापस",
      viewAccounts: "चार्ट ऑफ़ अकाउंट्स खोलें",
      viewPeriods: "अकाउंटिंग अवधि देखें",
    },
  },
  title: "चार्ट ऑफ़ अकाउंट्स सेटअप",
  description: "टेम्पलेट से कंपनी के अकाउंट शुरू करें",
  category: "चार्ट ऑफ़ अकाउंट्स",
  tag: "सेटअप",
};
