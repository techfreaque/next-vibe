import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "API key",
  metaTitle: "API key: {{appName}}",
  description:
    "एक key, {{modelCount}} मॉडल। OpenAI और Anthropic फ़ॉर्मेट, बिल आपके क्रेडिट से।",
  unauthenticated: {
    title: "अपनी API key मैनेज करने के लिए साइन इन करें",
    subtitle:
      "key आपके अकाउंट से जुड़ी होती हैं। साइन इन करें, {{subPrice}} महीने से कोई भी प्लान चुनें, और सेकंडों में अपनी पहली key बनाएँ।",
    point1: "एक OpenAI कम्पैटिबल endpoint के पीछे {{modelCount}} मॉडल",
    point2:
      "Claude Code, Codex, OpenCode, Cline और किसी भी OpenAI SDK में चलता है",
    point3: "चैट जितनी ही कीमत। API का कोई अलग बिल नहीं।",
    logIn: "लॉग इन करें",
    signUp: "अकाउंट बनाएँ",
    docs: "पहले API डॉक्स पढ़ें",
  },
};
