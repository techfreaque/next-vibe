import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  submit: {
    tag: "lead-magnet-capture",
    title: "सब्सक्राइब करें और एक्सेस पाएँ",
    titleShort: "सब्सक्राइब करें",
    description:
      "क्रिएटर की लिस्ट से जुड़ने और इस स्किल का एक्सेस पाने के लिए अपना ब्योरा भेजें",
    groups: {
      main: {
        title: "एक्सेस पाएँ",
        description: "नीचे अपना ब्योरा डालें",
      },
    },
    fields: {
      skillId: {
        label: "स्किल",
        description: "वो स्किल जिससे आप सब्सक्राइब कर रहे हैं",
      },
      firstName: {
        label: "पहला नाम",
        description: "आपका पहला नाम",
        placeholder: "जैसे राहुल",
      },
      email: {
        label: "ईमेल पता",
        description: "आपका ईमेल पता",
        placeholder: "you@example.com",
      },
    },
    response: {
      captured: "सब्सक्राइब्ड",
      nextStep: "अगला कदम",
      signupUrl: "साइन-अप URL",
    },
    success: {
      title: "आप शामिल हो गए!",
      description: "अपना इनबॉक्स देखें, और स्किल इस्तेमाल करने के लिए साइन अप करें",
    },
    errors: {
      validation: {
        title: "वैलिडेशन एरर",
        description: "कृपया अपना इनपुट जाँचें",
      },
      unauthorized: {
        title: "अनधिकृत",
        description: "अनधिकृत",
      },
      forbidden: {
        title: "अनुमति नहीं",
        description: "अनुमति नहीं",
      },
      notFound: {
        title: "नहीं मिला",
        description: "स्किल नहीं मिली",
      },
      conflict: {
        title: "टकराव",
        description: "टकराव हो गया",
      },
      network: {
        title: "नेटवर्क एरर",
        description: "नेटवर्क एरर आया",
      },
      unsavedChanges: {
        title: "बिना सेव किए बदलाव",
        description: "बिना सेव किए बदलाव",
      },
      internal: {
        title: "सर्वर एरर",
        description: "इंटरनल एरर आया",
      },
      unknown: {
        title: "अज्ञात एरर",
        description: "कोई अज्ञात एरर आया",
      },
    },
  },
  form: {
    signUp: "साइन अप करें",
    headline: "जुड़े रहिए",
    namePlaceholder: "आपका पहला नाम",
    emailPlaceholder: "आपका ईमेल",
    send: "सब्सक्राइब करें",
    sending: "...",
    doneHeading: "हो गया।",
    doneSub: "आप लिस्ट में हैं।",
    finePrint: "कोई स्पैम नहीं। कभी भी अनसब्सक्राइब करें।",
    error: "कुछ गलत हो गया। दोबारा कोशिश करें।",
  },
};
