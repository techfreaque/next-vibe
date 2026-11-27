import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "इमेज देखें",
    titleShort: "इमेज देखें",
    description:
      "पहले से ली गई इमेज को उसके स्टोरेज URL से लाकर दिखाएँ। पिछले टर्न का कोई स्क्रीनशॉट या इमेज दोबारा देखने के लिए इस्तेमाल करें।",
    dynamicTitle: "देखें: {{url}}",
    url: {
      label: "इमेज URL",
      description: "जो इमेज देखनी है उसका स्टोरेज URL",
      placeholder: "https://...",
    },
    response: {
      url: "इमेज URL",
    },
    errors: {
      validation_failed: {
        title: "वैलिडेशन एरर",
        description: "दिया गया URL गलत है",
      },
      network_error: {
        title: "नेटवर्क एरर",
        description: "इमेज लाई नहीं जा सकी",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "आपको यह इमेज देखने की अनुमति नहीं है",
      },
      forbidden: {
        title: "मना है",
        description: "इस इमेज का एक्सेस मना है",
      },
      not_found: {
        title: "इमेज नहीं मिली",
        description: "दिए गए URL पर कोई इमेज नहीं मिली",
      },
      server_error: {
        title: "सर्वर एरर",
        description: "इंटरनल सर्वर एरर आया",
      },
      unknown_error: {
        title: "अज्ञात एरर",
        description: "कोई अनपेक्षित एरर आया",
      },
      unsaved_changes: {
        title: "बिना सेव किए बदलाव",
        description: "आपके कुछ बदलाव सेव नहीं हुए हैं",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
    },
    success: {
      title: "इमेज लोड हो गई",
      description: "इमेज सफलतापूर्वक आ गई",
    },
  },
  tags: {
    vision: "विज़न",
    ai: "AI",
  },
};
