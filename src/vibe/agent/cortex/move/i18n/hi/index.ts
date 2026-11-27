import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "मूव करें",
    titleShort: "फ़ाइल मूव करें",
    description: "फ़ाइल या फ़ोल्डर को मूव या रीनेम करें।",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "मूव हो रहा है...",
      done: "मूव हो गया",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "कहाँ से",
        description: "मौजूदा पाथ",
      },
      to: {
        label: "कहाँ तक",
        description: "नया पाथ",
      },
    },
    submitButton: {
      label: "मूव करें",
      loadingText: "मूव हो रहा है...",
    },
    response: {
      from: { content: "कहाँ से" },
      to: { content: "कहाँ तक" },
      nodesAffected: { text: "मूव हुए" },
    },
    errors: {
      validation: { title: "गलत इनपुट", description: "दोनों पाथ जाँचें" },
      network: { title: "ऑफ़लाइन", description: "सर्वर तक नहीं पहुँच पा रहे" },
      unauthorized: { title: "लॉग इन नहीं हैं", description: "पहले लॉग इन करें" },
      forbidden: { title: "एक्सेस नहीं है", description: "इसे मूव नहीं कर सकते" },
      notFound: {
        title: "नहीं मिला",
        description: "सोर्स पाथ पर कुछ नहीं है",
      },
      server: { title: "सर्वर एरर", description: "कुछ टूट गया" },
      unknown: { title: "एरर", description: "कुछ गड़बड़ हो गई" },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "पहले सेव करें या छोड़ दें",
      },
      conflict: {
        title: "रुका हुआ",
        description: "डेस्टिनेशन पर पहले से कुछ है",
      },
    },
    success: {
      title: "मूव हो गया",
      description: "हो गया",
    },
  },
};
