import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  meta: {
    title: "लॉग इन करें: {{appName}}",
    description:
      "अपने {{appName}} अकाउंट में लॉग इन करें और अपनी AI चैट वहीं से जारी रखें।",
    category: "ऑथेंटिकेशन",
    imageAlt: "लॉग इन",
    keywords: "लॉग इन, साइन इन, अकाउंट, AI चैट लॉगिन, {{appName}}",
    ogTitle: "{{appName}} में लॉग इन करें",
    ogDescription: "अपना {{appName}} अकाउंट खोलें",
    twitterTitle: "{{appName}} में लॉग इन करें",
    twitterDescription: "अपना अकाउंट और बातचीत खोलें",
  },
  errors: {
    failedToLoadBrowserIdentity: "ब्राउज़र पहचान लोड नहीं हो पाई। पेज रीफ़्रेश करें।",
  },
};
