import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unknown: "एक अज्ञात एरर आया",
    title: "एरर",
  },
  meta: {
    passwordReset: {
      title: "पासवर्ड रीसेट करें: {{appName}}",
      description: "अपने {{appName}} अकाउंट का पासवर्ड रीसेट करें",
      category: "ऑथेंटिकेशन",
      imageAlt: "पासवर्ड रीसेट",
      keywords: "पासवर्ड रीसेट, पासवर्ड भूल गए, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      errors: {
        loadingError: "पासवर्ड रीसेट फ़ॉर्म लोड नहीं हो पाया",
      },
    },
  },
};
