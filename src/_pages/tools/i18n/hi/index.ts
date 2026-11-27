import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "AI टूल्स",
  backToChat: "चैट पर वापस",
  description:
    "तय करें कि AI के लिए कौन से टूल उपलब्ध हों। किसी टूल को पिन करें ताकि वह हमेशा कॉन्टेक्स्ट में रहे।",
  openFullPage: "पूरा पेज खोलें",
  modal: {
    title: "AI टूल्स",
    description:
      "तय करें कि AI के लिए कौन से टूल उपलब्ध हों। किसी टूल को पिन करें ताकि वह हमेशा कॉन्टेक्स्ट में रहे।",
  },
  widget: {
    tools: "टूल्स",
    overrideForSlot: "इस स्लॉट के लिए टूल सेटिंग्स बदलें",
    inheritedDefaults:
      "अभी विरासत में मिले डिफ़ॉल्ट इस्तेमाल हो रहे हैं। अपनी पसंद लगाने के लिए चालू करें।",
    customToolsConfigured: "इस स्लॉट के लिए कस्टम टूल सेट हैं।",
    deselectAll: "सब हटाएँ",
    selectAll: "सब चुनें",
    reset: "रीसेट",
    pinnedToContext: "कॉन्टेक्स्ट में पिन",
    requiresConfirmation: "पुष्टि चाहिए",
    loadingTools: "टूल्स लोड हो रहे हैं...",
  },
  loadError: {
    title: "एडमिन लोड नहीं हो सका",
    message:
      "आपका सेशन जाँचा नहीं जा सका। पेज रीलोड करें। फिर भी न चले तो दोबारा साइन इन करें।",
    reload: "रीलोड करें",
    signIn: "साइन इन करें",
  },
};
